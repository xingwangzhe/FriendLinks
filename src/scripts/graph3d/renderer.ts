/**
 * Three.js 原生渲染层
 * 替代 3d-force-graph：单层 InstancedMesh + LineSegments + OrbitControls
 * 
 * v2: 贝塞尔曲线连线 + 流动粒子
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
  /** 流动粒子系统 */
  particles: {
    mesh: THREE.Points;
    edgeIndices: Int32Array;
    progress: Float32Array;
    speeds: Float32Array;
    positions: Float32Array;
  } | null;
  /** 边数组引用（供粒子使用） */
  edgeRefs: EdgeData[];
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
  sx: number; sy: number; sz: number;  // source
  ex: number; ey: number; ez: number;  // target
  cx: number; cy: number; cz: number;  // control point
}

// ─── 常量 ──────────────────────────────────────────────────────────

const NODE_SEGMENTS = 6;
const BG_COLOR = 0x0f1115;
/** 每条边细分为多少段线 */
export const EDGE_SEGMENTS = 6;
/** 流动粒子数量 */
const PARTICLE_COUNT = 500;

// ─── 贝塞尔工具 ──────────────────────────────────────────────────────

/** 二次贝塞尔插值 */
function bezier(s: number, c: number, e: number, t: number): number {
  const i = 1 - t;
  return i * i * s + 2 * i * t * c + t * t * e;
}

/** 计算垂直于边方向的偏移方向（在 XZ 平面） */
function calcControlOffset(
  dx: number, dy: number, dz: number, len: number,
): { ox: number; oy: number; oz: number } {
  if (len < 0.001) return { ox: 0, oy: 0, oz: 1 };
  const nx = dx / len, ny = dy / len, nz = dz / len;
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
  const nodeGeom = new THREE.SphereGeometry(1, NODE_SEGMENTS, NODE_SEGMENTS);
  const nodeMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        vColor = instanceColor;
        vec4 worldPos = instanceMatrix * vec4(position, 1.0);
        // 均匀缩放 (15,15,15)，mat3(instanceMatrix) 即可正确变换法线
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
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vViewDir);
        // 菲涅尔 rim 光：边缘亮、中心暗，增强 3D 立体感
        float rim = 1.0 - max(0.0, dot(n, v));
        rim = pow(rim, 1.6);
        vec3 col = vColor * mix(0.45, 1.8, rim);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const nodes = new THREE.InstancedMesh(nodeGeom, nodeMat, nodeCount);
  nodes.frustumCulled = false;
  scene.add(nodes);

  // ── 贝塞尔曲线连线 (LineSegments) ──
  // 每条边细分 EDGE_SEGMENTS 段，每段 2 个顶点 × 3 坐标
  const edgeVertsPerEdge = EDGE_SEGMENTS * 2 * 3;
  const linkGeom = new THREE.BufferGeometry();
  const linkPositions = new Float32Array(linkCount * edgeVertsPerEdge);
  linkGeom.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
  linkGeom.setDrawRange(0, 0);
  const linkMat = new THREE.LineBasicMaterial({
    color: 0x666666,
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
    0.3,    // threshold — 亮度阈值
  );
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  return {
    scene, camera, renderer, controls, nodes, linkLines, dummy,
    composer, bloomPass,
    particles: null,
    edgeRefs: [],
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
    const sx = sn.x ?? 0, sy = sn.y ?? 0, sz = sn.z ?? 0;
    const ex = tn.x ?? 0, ey = tn.y ?? 0, ez = tn.z ?? 0;
    const mx = (sx + ex) / 2, my = (sy + ey) / 2, mz = (sz + ez) / 2;
    const dx = ex - sx, dy = ey - sy, dz = ez - sz;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    const offset = calcControlOffset(dx, dy, dz, len);
    // 弯度随边长比例增长，但设上限避免超长边过度弯曲
    const bend = Math.min(len * 0.18, 8000);
    const cx = mx + offset.ox * bend;
    const cy = my + offset.oy * bend;
    const cz = mz + offset.oz * bend;

    edgeDataArr.push({ sx, sy, sz, ex, ey, ez, cx, cy, cz });

    // 生成 EDGE_SEGMENTS 段线
    for (let j = 0; j < EDGE_SEGMENTS; j++) {
      const t0 = j / EDGE_SEGMENTS;
      const t1 = (j + 1) / EDGE_SEGMENTS;
      const base = (i * EDGE_SEGMENTS + j) * 6;
      pos[base]     = bezier(sx, cx, ex, t0);
      pos[base + 1] = bezier(sy, cy, ey, t0);
      pos[base + 2] = bezier(sz, cz, ez, t0);
      pos[base + 3] = bezier(sx, cx, ex, t1);
      pos[base + 4] = bezier(sy, cy, ey, t1);
      pos[base + 5] = bezier(sz, cz, ez, t1);
    }
  }

  ctx.edgeRefs = edgeDataArr;
  ctx.linkLines.geometry.attributes.position.needsUpdate = true;
  ctx.linkLines.geometry.setDrawRange(0, maxEdges * EDGE_SEGMENTS * 2);
  (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = opacity;
}

// ─── 流动粒子系统 ──────────────────────────────────────────────────

export function createParticles(ctx: RenderContext) {
  if (ctx.particles) return;

  const edgeIndices = new Int32Array(PARTICLE_COUNT);
  const progress = new Float32Array(PARTICLE_COUNT);
  const speeds = new Float32Array(PARTICLE_COUNT);
  const positions = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    edgeIndices[i] = Math.floor(Math.random() * ctx.edgeRefs.length);
    progress[i] = Math.random();
    speeds[i] = 0.003 + Math.random() * 0.007;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 2.5,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const mesh = new THREE.Points(geom, mat);
  mesh.frustumCulled = false;
  ctx.scene.add(mesh);

  ctx.particles = { mesh, edgeIndices, progress, speeds, positions };
}

/** 每帧更新粒子位置 */
export function updateParticles(ctx: RenderContext, delta: number) {
  const p = ctx.particles;
  if (!p) return;
  const edges = ctx.edgeRefs;
  if (edges.length === 0) return;

  const pos = p.positions;
  const dt = delta * 60;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    p.progress[i] += p.speeds[i] * dt;
    if (p.progress[i] > 1) {
      p.progress[i] = 0;
      p.edgeIndices[i] = Math.floor(Math.random() * edges.length);
    }
    const ei = p.edgeIndices[i];
    if (ei >= edges.length) continue;
    const e = edges[ei];
    const t = p.progress[i];
    pos[i * 3]     = bezier(e.sx, e.cx, e.ex, t);
    pos[i * 3 + 1] = bezier(e.sy, e.cy, e.ey, t);
    pos[i * 3 + 2] = bezier(e.sz, e.cz, e.ez, t);
  }

  p.mesh.geometry.attributes.position.needsUpdate = true;
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
  let cx = 0, cy = 0, cz = 0, tw = 0;
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
  if (ctx.particles) {
    ctx.particles.mesh.geometry.dispose();
    (ctx.particles.mesh.material as THREE.Material).dispose();
  }
  ctx.composer.dispose();
  ctx.renderer.dispose();
  ctx.nodes.geometry.dispose();
  (ctx.nodes.material as THREE.Material).dispose();
  ctx.linkLines.geometry.dispose();
  (ctx.linkLines.material as THREE.Material).dispose();
}
