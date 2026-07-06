/**
 * Three.js 原生渲染层
 * 替代 3d-force-graph：单层 InstancedMesh + LineSegments + OrbitControls
 *
 * v2: 贝塞尔曲线连线 + 流动粒子
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
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
  bloomPass: BloomEffect;
  /** 边数组引用 */
  edgeRefs: EdgeData[];
  /** 节点光晕 (Points) */
  nodeGlow: THREE.Points | null;
  /** 节点光晕材质（用于调节 glowIntensity uniform） */
  glowMaterial: THREE.ShaderMaterial | null;
}

export interface NodeState {
  _cDefault: string;
  _cHover: string;
  _cFocus: string;
  _cHighlight: string;
  _cDimmed: string;
}

/** 缓存的边几何数据（包括贝塞尔控制点） */
interface EdgeData {
  sx: number;
  sy: number;
  sz: number; // source
  ex: number;
  ey: number;
  ez: number; // target
  cx: number;
  cy: number;
  cz: number; // control point
}

// ─── 常量 ──────────────────────────────────────────────────────────

const NODE_SEGMENTS = 12;
const NODE_HEIGHT_SEGMENTS = 8;
const BG_COLOR = 0x0f1115;
/** 每条边细分为多少段线 */
export const EDGE_SEGMENTS = 6;

// ─── 贝塞尔工具 ──────────────────────────────────────────────────────

/** 二次贝塞尔插值 */
function bezier(s: number, c: number, e: number, t: number): number {
  const i = 1 - t;
  return i * i * s + 2 * i * t * c + t * t * e;
}

/** 计算垂直于边方向的偏移方向（在 XZ 平面） */
function calcControlOffset(dx: number, dy: number, dz: number, len: number): { ox: number; oy: number; oz: number } {
  if (len < 0.001) return { ox: 0, oy: 0, oz: 1 };
  const nx = dx / len,
    ny = dy / len,
    nz = dz / len;
  // 叉积 (nx,ny,nz) × (0,1,0) = (nz, 0, -nx)，若边接近垂直则用 (1,0,0)
  const up = Math.abs(ny) > 0.99 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  const ox = ny * up.z - nz * up.y;
  const oy = nz * up.x - nx * up.z;
  const oz = nx * up.y - ny * up.x;
  const ol = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
  return { ox: ox / ol, oy: oy / ol, oz: oz / ol };
}

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

  // 无需 scene lights — 自定义 ShaderMaterial 不使用 Three.js 内置光照

  // InstancedMesh: 单层球体 + 自定义 ShaderMaterial（菲涅尔 rim 光，比 MeshStandardMaterial 轻量 20x+）
  const nodeGeom = new THREE.SphereGeometry(1, NODE_SEGMENTS, NODE_HEIGHT_SEGMENTS);
  const nodeMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    vertexShader: `
      varying vec3 vColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        vColor = instanceColor;
        vec4 worldPos = instanceMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(instanceMatrix) * normal);
        vec4 mvPos = modelViewMatrix * worldPos;
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        float alpha = 0.25;
        vec3 col = vColor * 0.7;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
  const nodes = new THREE.InstancedMesh(nodeGeom, nodeMat, nodeCount);
  nodes.frustumCulled = false;
  scene.add(nodes);

  // ── 贝塞尔曲线连线 (LineSegments) ──
  // 每条边细分 EDGE_SEGMENTS 段，每段 2 个顶点 × 3 坐标 + 顶点颜色
  const edgeVertsPerEdge = EDGE_SEGMENTS * 2 * 3;
  const linkGeom = new THREE.BufferGeometry();
  const linkPositions = new Float32Array(linkCount * edgeVertsPerEdge);
  const linkColors = new Float32Array(linkCount * EDGE_SEGMENTS * 2 * 3); // 每个顶点 RGB
  linkGeom.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
  linkGeom.setAttribute("color", new THREE.BufferAttribute(linkColors, 3));
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
  scene.add(linkLines);

  const dummy = new THREE.Object3D();

  // ── EffectComposer + Bloom ──
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new BloomEffect({
    intensity: 0.08,
    radius: 0.5,
    luminanceThreshold: 0.25,
  });
  composer.addPass(new EffectPass(camera, bloomPass));

  return {
    scene,
    camera,
    renderer,
    controls,
    nodes,
    linkLines,
    dummy,
    composer,
    bloomPass,
    edgeRefs: [],
    nodeGlow: null,
    glowMaterial: null,
  };
}

// ─── 连线更新（贝塞尔曲线） ──────────────────────────────────────────

export function updateLinkPositions(
  ctx: RenderContext,
  links: { source: string; target: string }[],
  nodeIdToIndex: Map<string, number>,
  graphNodes: GraphNode[],
  opacity: number,
) {
  const pos = ctx.linkLines.geometry.attributes.position.array as Float32Array;
  const col = ctx.linkLines.geometry.attributes.color.array as Float32Array;
  const maxEdges = Math.min(links.length, pos.length / (EDGE_SEGMENTS * 2 * 3));
  const edgeDataArr: EdgeData[] = [];

  for (let i = 0; i < maxEdges; i++) {
    const l = links[i];
    const si = nodeIdToIndex.get(l.source);
    const ti = nodeIdToIndex.get(l.target);
    if (si == null || ti == null) {
      edgeDataArr.push({ sx: 0, sy: 0, sz: 0, ex: 0, ey: 0, ez: 0, cx: 0, cy: 0, cz: 0 });
      continue;
    }
    const sn = graphNodes[si];
    const tn = graphNodes[ti];
    const sx = sn.x ?? 0,
      sy = sn.y ?? 0,
      sz = sn.z ?? 0;
    const ex = tn.x ?? 0,
      ey = tn.y ?? 0,
      ez = tn.z ?? 0;
    const mx = (sx + ex) / 2,
      my = (sy + ey) / 2,
      mz = (sz + ez) / 2;
    const dx = ex - sx,
      dy = ey - sy,
      dz = ez - sz;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    const offset = calcControlOffset(dx, dy, dz, len);
    const bend = Math.min(len * 0.18, 8000);
    const cx = mx + offset.ox * bend;
    const cy = my + offset.oy * bend;
    const cz = mz + offset.oz * bend;

    edgeDataArr.push({ sx, sy, sz, ex, ey, ez, cx, cy, cz });

    // 边颜色：源→目标渐变
    const srcCol = new THREE.Color((sn as any)._cDefault || "#ffffff");
    const tgtCol = new THREE.Color((tn as any)._cDefault || "#ffffff");

    for (let j = 0; j < EDGE_SEGMENTS; j++) {
      const t0 = j / EDGE_SEGMENTS;
      const t1 = (j + 1) / EDGE_SEGMENTS;
      const base = (i * EDGE_SEGMENTS + j) * 6;
      pos[base] = bezier(sx, cx, ex, t0);
      pos[base + 1] = bezier(sy, cy, ey, t0);
      pos[base + 2] = bezier(sz, cz, ez, t0);
      pos[base + 3] = bezier(sx, cx, ex, t1);
      pos[base + 4] = bezier(sy, cy, ey, t1);
      pos[base + 5] = bezier(sz, cz, ez, t1);
      // 顶点颜色：按 t 在源→目标之间插值
      col[base] = srcCol.r + (tgtCol.r - srcCol.r) * t0;
      col[base + 1] = srcCol.g + (tgtCol.g - srcCol.g) * t0;
      col[base + 2] = srcCol.b + (tgtCol.b - srcCol.b) * t0;
      col[base + 3] = srcCol.r + (tgtCol.r - srcCol.r) * t1;
      col[base + 4] = srcCol.g + (tgtCol.g - srcCol.g) * t1;
      col[base + 5] = srcCol.b + (tgtCol.b - srcCol.b) * t1;
    }
  }

  ctx.edgeRefs = edgeDataArr;
  ctx.linkLines.geometry.attributes.position.needsUpdate = true;
  ctx.linkLines.geometry.attributes.color.needsUpdate = true;
  ctx.linkLines.geometry.setDrawRange(0, maxEdges * EDGE_SEGMENTS * 2);
  (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = opacity;
}

// ─── 节点光晕（MeetBlog 风格的 Points 加法混合光晕） ─────────────────

/** 创建 128×128 径向渐变纹理（中心白 → 边缘透明） */
function createGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function createNodeGlow(
  ctx: RenderContext,
  nodeCount: number,
  degreeMap: Record<string, number>,
  nodes: GraphNode[],
  maxDegree: number,
) {
  if (ctx.nodeGlow) return;

  const positions = new Float32Array(nodeCount * 3);
  const colors = new Float32Array(nodeCount * 3);
  const sizes = new Float32Array(nodeCount);

  for (let i = 0; i < nodeCount; i++) {
    const n = nodes[i];
    positions[i * 3] = n.x ?? 0;
    positions[i * 3 + 1] = n.y ?? 0;
    positions[i * 3 + 2] = n.z ?? 0;
    // 颜色：从节点状态取
    const base = (n as any)._cDefault || "#ffffff";
    const c = new THREE.Color(base);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    const deg = degreeMap[n.id] || 1;
    sizes[i] = nodeSize(deg, maxDegree) * 4.5;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geom.setAttribute("aCol", new THREE.BufferAttribute(colors, 3));
  geom.setAttribute("aSz", new THREE.BufferAttribute(sizes, 1));

  const glowTex = createGlowTexture();
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      glowTex: { value: glowTex },
      glowIntensity: { value: 1.0 },
    },
    vertexShader: `
      attribute vec3 aCol;
      attribute float aSz;
      varying vec3 vCol;
      void main() {
        vCol = aCol;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = clamp(aSz * (320.0 / -mv.z), 1.5, 48.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform sampler2D glowTex;
      uniform float glowIntensity;
      varying vec3 vCol;
      void main() {
        float a = texture2D(glowTex, gl_PointCoord).r;
        gl_FragColor = vec4(vCol * 1.2 * glowIntensity, a * 0.60);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });

  const mesh = new THREE.Points(geom, mat);
  mesh.frustumCulled = false;
  ctx.scene.add(mesh);
  ctx.nodeGlow = mesh;
  ctx.glowMaterial = mat;
}

/** 更新线条辉光强度（缩放顶点颜色） */
export function updateLineGlow(ctx: RenderContext, intensity: number) {
  const col = ctx.linkLines.geometry.attributes.color?.array as Float32Array | undefined;
  if (!col) return;
  // 从 edgeRefs 数量推断原始颜色范围
  const maxEdges = ctx.edgeRefs.length;
  // 每段线有 2 个顶点 × 3 分量 × EDGE_SEGMENTS
  const floatsPerEdge = EDGE_SEGMENTS * 2 * 3;
  // 储存一份原始颜色（懒初始化）
  if (!(ctx as any)._lineGlowBaseColors) {
    (ctx as any)._lineGlowBaseColors = new Float32Array(col);
  }
  const base = (ctx as any)._lineGlowBaseColors as Float32Array;
  for (let i = 0; i < maxEdges * floatsPerEdge; i++) {
    col[i] = Math.min(1, base[i] * intensity);
  }
  ctx.linkLines.geometry.attributes.color.needsUpdate = true;
}

// ─── 节点位置 + 颜色 ──────────────────────────────────────────────

/** MeetBlog 风格的节点大小计算：度数越大节点越大 */
export function nodeSize(degree: number, maxDegree: number): number {
  return 8 + Math.pow(degree / Math.max(1, maxDegree), 0.38) * 55;
}

export function updateAllNodePositions(
  ctx: RenderContext,
  nodes: GraphNode[],
  nodeStates: NodeState[],
  degreeMap: Record<string, number>,
  maxDegree: number,
) {
  const m = new THREE.Matrix4();
  // 如果需要更新光晕位置
  const glowPos = ctx.nodeGlow?.geometry.attributes.position?.array as Float32Array | undefined;
  const glowSize = ctx.nodeGlow?.geometry.attributes.aSz?.array as Float32Array | undefined;

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const deg = degreeMap[n.id] || 1;
    const sz = nodeSize(deg, maxDegree);
    m.compose(new THREE.Vector3(n.x ?? 0, n.y ?? 0, n.z ?? 0), new THREE.Quaternion(), new THREE.Vector3(sz, sz, sz));
    ctx.nodes.setMatrixAt(i, m);

    if (nodeStates[i]) {
      ctx.nodes.setColorAt(i, new THREE.Color(nodeStates[i]._cDefault));
    }

    // 同步更新光晕位置和大小
    if (glowPos) {
      glowPos[i * 3] = n.x ?? 0;
      glowPos[i * 3 + 1] = n.y ?? 0;
      glowPos[i * 3 + 2] = n.z ?? 0;
    }
    if (glowSize) {
      glowSize[i] = sz * 3.5;
    }
  }

  ctx.nodes.instanceMatrix.needsUpdate = true;
  if (ctx.nodes.instanceColor) ctx.nodes.instanceColor.needsUpdate = true;
  if (glowPos) ctx.nodeGlow!.geometry.attributes.position.needsUpdate = true;
  if (glowSize) ctx.nodeGlow!.geometry.attributes.aSz.needsUpdate = true;
}

export function setNodeColor(ctx: RenderContext, index: number, color: string) {
  ctx.nodes.setColorAt(index, new THREE.Color(color));
  if (ctx.nodes.instanceColor) ctx.nodes.instanceColor.needsUpdate = true;
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
  if (ctx.nodeGlow) {
    ctx.nodeGlow.geometry.dispose();
    const mat = ctx.nodeGlow.material as THREE.ShaderMaterial;
    if (mat.uniforms?.glowTex?.value) mat.uniforms.glowTex.value.dispose();
    mat.dispose();
  }
  delete (ctx as any)._lineGlowBaseColors;
  ctx.composer.dispose();
  ctx.renderer.dispose();
  ctx.nodes.geometry.dispose();
  (ctx.nodes.material as THREE.Material).dispose();
  ctx.linkLines.geometry.dispose();
  (ctx.linkLines.material as THREE.Material).dispose();
}
