/**
 * Three.js 原生渲染层
 * 替代 3d-force-graph：单层 InstancedMesh + LineSegments + OrbitControls
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import type { GraphNode } from "../../../types/graph";

// ─── 类型 ──────────────────────────────────────────────────────────

export interface RenderContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  nodes: THREE.InstancedMesh;
  linkLines: THREE.LineSegments;
  dummy: THREE.Object3D;
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
}

export interface NodeState {
  _cDefault: string;
  _cHover: string;
  _cFocus: string;
  _cHighlight: string;
  _cDimmed: string;
}

// ─── 常量 ──────────────────────────────────────────────────────────

const NODE_SEGMENTS = 6;
const BG_COLOR = 0x0f1115;

// ─── 工厂 ──────────────────────────────────────────────────────────

export function createRenderer(container: HTMLElement, nodeCount: number, linkCount: number): RenderContext {
  const { width, height } = container.getBoundingClientRect();

  // Camera（far=200k 配合 maxDistance 10x，支持极远视野俯瞰博客宇宙）
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 500000);
  camera.position.set(0, 0, 1000);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(BG_COLOR);
  container.appendChild(renderer.domElement);

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

  // Lights
  scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI);
  scene.add(dirLight);

  // InstancedMesh: 单层球体
  const nodeGeom = new THREE.SphereGeometry(1, NODE_SEGMENTS, NODE_SEGMENTS);
  const nodeMat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.1 });
  const nodes = new THREE.InstancedMesh(nodeGeom, nodeMat, nodeCount);
  nodes.frustumCulled = false;
  scene.add(nodes);

  // 连线 (LineSegments)
  const linkGeom = new THREE.BufferGeometry();
  const linkPositions = new Float32Array(linkCount * 6);
  linkGeom.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
  linkGeom.setDrawRange(0, 0);
  const linkMat = new THREE.LineBasicMaterial({
    color: 0x555555,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const linkLines = new THREE.LineSegments(linkGeom, linkMat);
  linkLines.frustumCulled = false;
  scene.add(linkLines);

  const dummy = new THREE.Object3D();

  // ── EffectComposer + Bloom ──
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.25,   // strength — 泛光强度
    0.5,    // radius   — 泛光扩散半径
    0.3,    // threshold — 亮度阈值（仅超过此亮度的区域产生泛光）
  );
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  return { scene, camera, renderer, controls, nodes, linkLines, dummy, composer, bloomPass };
}

// ─── 节点位置 + 颜色 ──────────────────────────────────────────────

export function updateAllNodePositions(ctx: RenderContext, nodes: GraphNode[], nodeStates: NodeState[]) {
  const m = new THREE.Matrix4();

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    m.compose(new THREE.Vector3(n.x ?? 0, n.y ?? 0, n.z ?? 0), new THREE.Quaternion(), new THREE.Vector3(15, 15, 15));
    ctx.nodes.setMatrixAt(i, m);

    if (nodeStates[i]) {
      ctx.nodes.setColorAt(i, new THREE.Color(nodeStates[i]._cDefault));
    }
  }

  ctx.nodes.instanceMatrix.needsUpdate = true;
  if (ctx.nodes.instanceColor) ctx.nodes.instanceColor.needsUpdate = true;
}

export function setNodeColor(ctx: RenderContext, index: number, color: string) {
  ctx.nodes.setColorAt(index, new THREE.Color(color));
  if (ctx.nodes.instanceColor) ctx.nodes.instanceColor.needsUpdate = true;
}

// ─── 连线更新 ──────────────────────────────────────────────────────

export function updateLinkPositions(
  ctx: RenderContext,
  links: { source: string; target: string }[],
  nodeIdToIndex: Map<string, number>,
  graphNodes: GraphNode[],
  opacity: number,
) {
  const pos = ctx.linkLines.geometry.attributes.position.array as Float32Array;
  const count = Math.min(links.length, pos.length / 6);

  for (let i = 0; i < count; i++) {
    const l = links[i];
    const si = nodeIdToIndex.get(typeof l.source === "string" ? l.source : ((l.source as any).id ?? l.source));
    const ti = nodeIdToIndex.get(typeof l.target === "string" ? l.target : ((l.target as any).id ?? l.target));
    if (si == null || ti == null) continue;

    const sn = graphNodes[si];
    const tn = graphNodes[ti];
    const j = i * 6;
    pos[j] = sn.x ?? 0;
    pos[j + 1] = sn.y ?? 0;
    pos[j + 2] = sn.z ?? 0;
    pos[j + 3] = tn.x ?? 0;
    pos[j + 4] = tn.y ?? 0;
    pos[j + 5] = tn.z ?? 0;
  }

  ctx.linkLines.geometry.attributes.position.needsUpdate = true;
  ctx.linkLines.geometry.setDrawRange(0, count * 2);
  (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = opacity;
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

  // Bounding box 用于确定视野大小
  const box = new THREE.Box3();
  for (const n of graphNodes) {
    box.expandByPoint(new THREE.Vector3(n.x ?? 0, n.y ?? 0, n.z ?? 0));
  }
  box.expandByScalar(padding);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = ctx.camera.fov * (Math.PI / 180);
  const dist = maxDim / (2 * Math.tan(fov / 2));

  const startPos = ctx.camera.position.clone();
  const startTarget = ctx.controls.target.clone();
  const targetPos = wCenter.clone().add(new THREE.Vector3(0, 0, dist));
  const startTime = performance.now();

  function anim() {
    const t = Math.min(1, (performance.now() - startTime) / ms);
    const ease = 1 - Math.pow(1 - t, 3);
    ctx.camera.position.lerpVectors(startPos, targetPos, ease);
    ctx.controls.target.lerpVectors(startTarget, wCenter, ease);
    ctx.controls.update();
    if (t < 1) requestAnimationFrame(anim);
  }
  anim();
}

export function animateCamera(
  ctx: RenderContext,
  pos: { x: number; y: number; z: number },
  lookAt: { x: number; y: number; z: number },
  ms: number,
) {
  const sp = ctx.camera.position.clone();
  const st = ctx.controls.target.clone();
  const ep = new THREE.Vector3(pos.x, pos.y, pos.z);
  const et = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z);
  const t0 = performance.now();

  function anim() {
    const t = Math.min(1, (performance.now() - t0) / ms);
    const e = 1 - Math.pow(1 - t, 3);
    ctx.camera.position.lerpVectors(sp, ep, e);
    ctx.controls.target.lerpVectors(st, et, e);
    ctx.controls.update();
    if (t < 1) requestAnimationFrame(anim);
  }
  anim();
}

export function dispose(ctx: RenderContext) {
  ctx.composer.dispose();
  ctx.renderer.dispose();
  ctx.nodes.geometry.dispose();
  (ctx.nodes.material as THREE.Material).dispose();
  ctx.linkLines.geometry.dispose();
  (ctx.linkLines.material as THREE.Material).dispose();
}
