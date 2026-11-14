/**
 * Three.js 原生渲染层
 * 实例化球形替身 + indexed LineSegments + OrbitControls
 *
 * WebGPU 优先，保留 Three.js WebGL fallback
 */
import * as THREE from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { GraphNode } from "../../../types/graph";
import { MAX_EDGE_SEGMENTS } from "../../utils/bezier";
import { EdgeGeometryStore, type CompactBezierData } from "./edge-geometry";
import { NodeSphereInstances } from "./node-spheres";
import { createBackgroundEdgeGeometry, releaseBackgroundEdgeGeometry } from "./background-edges";

// ─── 类型 ──────────────────────────────────────────────────────────

export interface RenderContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGPURenderer;
  controls: OrbitControls;
  nodes: THREE.InstancedMesh;
  linkLines: THREE.LineSegments;
  dummy: THREE.Object3D;
  edgeStore: EdgeGeometryStore | null;
  quality: RenderQuality;
  /** Set by the render scheduler; camera animations invalidate each changed frame. */
  requestRender: () => void;
  cameraAnimating: boolean;
  cancelCameraAnimation: () => void;
}

export interface NodeState {
  _cDefault: string;
  _cHover: string;
  _cFocus: string;
  _cHighlight: string;
  _cDimmed: string;
}

export type RenderQuality = "low" | "balanced" | "high";

// ─── 常量 ──────────────────────────────────────────────────────────

const BG_COLOR = 0x0f1115;
/** 每条边细分为多少段线（最大，实际按边长自适应） */
export const EDGE_SEGMENTS = MAX_EDGE_SEGMENTS;

// ─── 工厂 ──────────────────────────────────────────────────────────

export async function createRenderer(
  container: HTMLElement,
  nodeCount: number,
  _linkCount: number,
): Promise<RenderContext> {
  const { width, height } = container.getBoundingClientRect();

  // Camera（far=200k 配合 maxDistance 10x，支持极远视野俯瞰博客宇宙）
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 500000);
  camera.position.set(0, 0, 1000);

  // Renderer（WebGPU 优先，自动降级 WebGL）
  // This opaque graph uses LDR colors; avoid the default half-float HDR target.
  const renderer = new THREE.WebGPURenderer({
    antialias: false,
    alpha: false,
    outputBufferType: THREE.UnsignedByteType,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height);
  renderer.setClearColor(BG_COLOR);
  container.appendChild(renderer.domElement);
  await renderer.init();

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG_COLOR);

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 20;
  controls.maxDistance = 200000;
  controls.zoomSpeed = 1.5;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI * 2; // 上下贯通旋转

  // 无需 scene lights；节点与关系使用无光照材质

  // GPU quad impostors; CPU sphere proxy retains the InstancedMesh picking API.
  const nodes = new NodeSphereInstances(nodeCount);
  scene.add(nodes);

  // ── 贝塞尔曲线连线 (LineSegments) ──
  // Background edges start hidden and allocate buffers only when requested.
  const linkGeom = new THREE.BufferGeometry();
  linkGeom.setDrawRange(0, 0);
  const linkMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const linkLines = new THREE.LineSegments(linkGeom, linkMat);
  linkLines.frustumCulled = false;
  linkLines.visible = false;
  scene.add(linkLines);

  const dummy = new THREE.Object3D();

  return {
    scene,
    camera,
    renderer,
    controls,
    nodes,
    linkLines,
    dummy,
    edgeStore: null,
    quality: "low",
    requestRender: () => {},
    cameraAnimating: false,
    cancelCameraAnimation: () => {},
  };
}

// ─── 连线更新（贝塞尔曲线） ──────────────────────────────────────────

export function updateLinkPositions(
  ctx: RenderContext,
  links: { source: string; target: string }[],
  nodeIdToIndex: Map<string, number>,
  graphNodes: GraphNode[],
  opacity: number,
  compact?: CompactBezierData,
) {
  ctx.edgeStore = new EdgeGeometryStore(links, nodeIdToIndex, graphNodes, compact);
  const previous = ctx.linkLines.geometry;
  ctx.linkLines.geometry = new THREE.BufferGeometry();
  ctx.linkLines.geometry.setDrawRange(0, 0);
  previous.dispose();
  setLinkOpacity(ctx, opacity);
}

/** Allocate packed, actual-segment background buffers only on the first visible use. */
export function setLinkOpacity(ctx: RenderContext, opacity: number) {
  const material = ctx.linkLines.material as THREE.LineBasicMaterial;
  material.opacity = Math.max(0, Math.min(1, opacity));
  const store = ctx.edgeStore;
  ctx.linkLines.visible = material.opacity > 0 && store !== null;
  if (!ctx.linkLines.visible) {
    releaseBackgroundEdgeGeometry(ctx.linkLines);
  } else if (store && !ctx.linkLines.geometry.hasAttribute("position")) {
    const previous = ctx.linkLines.geometry;
    ctx.linkLines.geometry = createBackgroundEdgeGeometry(store);
    previous.dispose();
  }
  ctx.requestRender();
}

/** Pixel density is adjustable without recreating the GPU context. */
export function setRenderQuality(ctx: RenderContext, quality: RenderQuality) {
  ctx.quality = quality;
  const cap = quality === "high" ? 2 : quality === "balanced" ? 1.5 : 1;
  ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
  ctx.requestRender();
}

// ─── 节点位置 + 颜色 ──────────────────────────────────────────────

/** 统一节点大小，不区分度数 */
export function nodeSize(_degree: number, _maxDegree: number): number {
  return 40;
}

export function updateAllNodePositions(
  ctx: RenderContext,
  nodes: GraphNode[],
  nodeStates: NodeState[],
  degreeMap: Record<string, number>,
  maxDegree: number,
) {
  const m = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const color = new THREE.Color();
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const deg = degreeMap[n.id] || 1;
    const sz = nodeSize(deg, maxDegree);
    position.set(n.x ?? 0, n.y ?? 0, n.z ?? 0);
    scale.set(sz, sz, sz);
    m.compose(position, rotation, scale);
    ctx.nodes.setMatrixAt(i, m);

    if (nodeStates[i]) {
      ctx.nodes.setColorAt(i, color.set(nodeStates[i]._cDefault));
    }
  }

  ctx.nodes.instanceMatrix.needsUpdate = true;
  if (ctx.nodes.instanceColor) ctx.nodes.instanceColor.needsUpdate = true;
}

const nodeColor = new THREE.Color();

export function setNodeColor(ctx: RenderContext, index: number, color: string, markUpdate = true) {
  ctx.nodes.setColorAt(index, nodeColor.set(color));
  if (markUpdate && ctx.nodes.instanceColor) ctx.nodes.instanceColor.needsUpdate = true;
}

// ─── 相机 ──────────────────────────────────────────────────────────

export function zoomToFit(
  ctx: RenderContext,
  graphNodes: GraphNode[],
  ms: number,
  padding: number,
  degreeMap?: Record<string, number>,
) {
  if (!graphNodes.length) return;

  // 度数加权中心：密集区权重高
  let cx = 0,
    cy = 0,
    cz = 0,
    tw = 0;
  for (const n of graphNodes) {
    const w = degreeMap ? Math.max(1, degreeMap[n.id] || 0) : 1;
    cx += (n.x ?? 0) * w;
    cy += (n.y ?? 0) * w;
    cz += (n.z ?? 0) * w;
    tw += w;
  }
  const wCenter = new THREE.Vector3(cx / tw, cy / tw, cz / tw);

  const box = new THREE.Box3();
  const point = new THREE.Vector3();
  for (const n of graphNodes) {
    box.expandByPoint(point.set(n.x ?? 0, n.y ?? 0, n.z ?? 0));
  }
  box.expandByScalar(padding);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = ctx.camera.fov * (Math.PI / 180);
  const dist = maxDim / (2 * Math.tan(fov / 2));

  const targetPos = wCenter.clone().add(new THREE.Vector3(0, 0, dist));
  runCameraAnimation(ctx, targetPos, wCenter, ms);
}

export function animateCamera(
  ctx: RenderContext,
  pos: { x: number; y: number; z: number },
  lookAt: { x: number; y: number; z: number },
  ms: number,
) {
  runCameraAnimation(ctx, new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z), ms);
}

/** One animation chain per renderer; replacing/disposing it cancels the pending frame. */
function runCameraAnimation(ctx: RenderContext, endPosition: THREE.Vector3, endTarget: THREE.Vector3, ms: number) {
  ctx.cancelCameraAnimation();
  const startPosition = ctx.camera.position.clone();
  const startTarget = ctx.controls.target.clone();
  const startTime = performance.now();
  const duration = Number.isFinite(ms) ? Math.max(0, ms) : 0;
  let frameId = 0;
  let active = true;
  ctx.cameraAnimating = true;
  ctx.cancelCameraAnimation = () => {
    active = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    ctx.cameraAnimating = false;
    ctx.cancelCameraAnimation = () => {};
  };

  function animate() {
    if (!active) return;
    frameId = 0;
    const t = duration === 0 ? 1 : Math.min(1, Math.max(0, (performance.now() - startTime) / duration));
    const ease = 1 - Math.pow(1 - t, 3);
    ctx.camera.position.lerpVectors(startPosition, endPosition, ease);
    ctx.controls.target.lerpVectors(startTarget, endTarget, ease);
    ctx.controls.update();
    ctx.requestRender();
    if (!active) return;
    if (t < 1) {
      frameId = requestAnimationFrame(animate);
    } else {
      active = false;
      ctx.cameraAnimating = false;
      ctx.cancelCameraAnimation = () => {};
    }
  }
  animate();
}

export function dispose(ctx: RenderContext) {
  ctx.cancelCameraAnimation();
  ctx.renderer.dispose();
  if (ctx.nodes instanceof NodeSphereInstances) ctx.nodes.dispose();
  else {
    ctx.nodes.geometry.dispose();
    (ctx.nodes.material as THREE.Material).dispose();
  }
  ctx.linkLines.geometry.dispose();
  (ctx.linkLines.material as THREE.Material).dispose();
}
