/**
 * Reproduce: bun scripts/experiments/frontend-interaction-bench.ts
 * Synthetic CPU microbenchmarks, not browser frame times. Initialization and
 * warm-up are excluded. Both picking paths use the same triangle geometry/ray.
 */
import * as THREE from "three";
import type { GraphNode } from "../../types/graph";
import { EdgeGeometryStore } from "../../src/scripts/graph3d/edge-geometry";
import { InstancedNodePicker } from "../../src/scripts/graph3d/spatial-index";
import { bezier2, calcControlOffset, calcSegmentCount, MAX_EDGE_SEGMENTS } from "../../src/utils/bezier";

function summary(samples: number[]) {
  const sorted = samples.toSorted((a, b) => a - b);
  return {
    medianMs: sorted[Math.floor(sorted.length / 2)],
    minMs: sorted[0],
    maxMs: sorted.at(-1),
    samplesMs: samples,
  };
}

function measure(run: () => unknown, rounds = 7) {
  for (let warm = 0; warm < 3; warm++) run();
  const samples: number[] = [];
  for (let round = 0; round < rounds; round++) {
    const start = performance.now();
    run();
    samples.push(performance.now() - start);
  }
  return summary(samples);
}

interface BenchBranch {
  bounds: THREE.Box3;
  entries?: Array<{ index: number; sphere: THREE.Sphere }>;
  left?: BenchBranch;
  right?: BenchBranch;
}

/** Previous collect-all/sort traversal on the identical prebuilt BVH bounds. */
function collectAllPicker(picker: InstancedNodePicker, mesh: THREE.InstancedMesh, raycaster: THREE.Raycaster) {
  // Benchmark only: use the same tree to isolate traversal rather than a second
  // tree constructor with potentially different partition/rounding behavior.
  const root = (picker as unknown as { root: BenchBranch }).root;
  const branches: BenchBranch[] = [];
  const candidates: number[] = [];
  const inverse = new THREE.Matrix4();
  const matrix = new THREE.Matrix4();
  const localRay = new THREE.Ray();
  const candidateMesh = new THREE.Mesh(mesh.geometry, mesh.material);
  const hits: THREE.Intersection[] = [];
  return () => {
    branches.length = candidates.length = 0;
    inverse.copy(mesh.matrixWorld).invert();
    localRay.copy(raycaster.ray).applyMatrix4(inverse);
    branches.push(root);
    while (branches.length) {
      const branch = branches.pop()!;
      if (!localRay.intersectsBox(branch.bounds)) continue;
      if (branch.entries) {
        for (const entry of branch.entries) {
          if (localRay.intersectsSphere(entry.sphere)) candidates.push(entry.index);
        }
      } else branches.push(branch.left!, branch.right!);
    }
    candidates.sort((a, b) => a - b);
    let distance = Infinity;
    let index: number | null = null;
    for (const candidate of candidates) {
      mesh.getMatrixAt(candidate, matrix);
      candidateMesh.matrixWorld.multiplyMatrices(mesh.matrixWorld, matrix);
      hits.length = 0;
      candidateMesh.raycast(raycaster, hits);
      for (const hit of hits) {
        if (hit.distance < distance) {
          distance = hit.distance;
          index = candidate;
        }
      }
    }
    return index;
  };
}

function picking(kind: "column" | "grid", count: number) {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshBasicMaterial(), count);
  const matrix = new THREE.Matrix4();
  for (let index = 0; index < count; index++) {
    mesh.setMatrixAt(
      index,
      matrix
        .makeScale(20, 20, 20)
        .setPosition(
          kind === "column" ? 0 : (index % 100) * 160,
          kind === "column" ? 0 : Math.floor(index / 100) * 160,
          kind === "column" ? -index * 80 : 0,
        ),
    );
  }
  mesh.updateMatrixWorld();
  const ray = new THREE.Raycaster(new THREE.Vector3(0, 0, 100), new THREE.Vector3(0, 0, -1));
  const picker = new InstancedNodePicker(mesh);
  const original = () => ray.intersectObject(mesh)[0]?.instanceId ?? null;
  const collectAll = collectAllPicker(picker, mesh, ray);
  const indexed = () => picker.pick(ray);
  if (original() !== indexed() || collectAll() !== indexed()) throw new Error("Picking results differ");
  const baseline = measure(original);
  const previousBvh = measure(collectAll);
  const optimized = measure(indexed);
  const exactCandidateCount = picker.lastCandidateCount;
  picker.dispose();
  mesh.geometry.dispose();
  (mesh.material as THREE.Material).dispose();
  return {
    kind,
    count,
    result: 0,
    baseline,
    previousBvh,
    optimized,
    exactCandidateCount,
    medianSpeedup: baseline.medianMs / optimized.medianMs,
    medianSpeedupOverPreviousBvh: previousBvh.medianMs / optimized.medianMs,
  };
}

const nodes: GraphNode[] = Array.from({ length: 1001 }, (_, index) => ({
  id: `${index}`,
  name: `${index}`,
  url: "https://example.com",
  x: Math.sin(index * 1.7) * index * 173,
  y: Math.cos(index * 2.3) * index * 51,
  z: index * index * 0.314,
}));
const links = nodes.slice(1).map((node) => ({ source: "0", target: node.id }));
const indices = new Map(nodes.map((node, index) => [node.id, index]));
const store = new EdgeGeometryStore(links, indices, nodes);
const repeated = new Float32Array(MAX_EDGE_SEGMENTS * 6);
let checksum = 0;
function originalSamples() {
  for (const link of links) {
    const source = nodes[indices.get(link.source)!];
    const target = nodes[indices.get(link.target)!];
    const sx = source.x!,
      sy = source.y!,
      sz = source.z!;
    const ex = target.x!,
      ey = target.y!,
      ez = target.z!;
    const dx = ex - sx,
      dy = ey - sy,
      dz = ez - sz;
    const length = Math.hypot(dx, dy, dz) || 1;
    const segments = calcSegmentCount(length);
    const offset = calcControlOffset(dx, dy, dz, length);
    const bend = length * 0.15;
    const cx = (sx + ex) / 2 + offset.ox * bend;
    const cy = (sy + ey) / 2 + offset.oy * bend;
    const cz = (sz + ez) / 2 + offset.oz * bend;
    for (let segment = 0; segment < segments; segment++) {
      const base = segment * 6;
      const start = segment / segments;
      const end = (segment + 1) / segments;
      repeated[base] = bezier2(sx, cx, ex, start);
      repeated[base + 1] = bezier2(sy, cy, ey, start);
      repeated[base + 2] = bezier2(sz, cz, ez, start);
      repeated[base + 3] = bezier2(sx, cx, ex, end);
      repeated[base + 4] = bezier2(sy, cy, ey, end);
      repeated[base + 5] = bezier2(sz, cz, ez, end);
    }
    checksum += repeated[segments * 6 - 1];
  }
}
function sharedSamples() {
  for (let edge = 0; edge < links.length; edge++) {
    const sample = store.sampleVertices(edge);
    checksum += sample.positions[sample.vertexCount * 3 - 1];
  }
}
let segments = 0;
let vertices = 0;
for (let edge = 0; edge < links.length; edge++) {
  segments += store.getSegmentCount(edge);
  vertices += store.getVertexCount(edge);
}
const original = measure(originalSamples);
const shared = measure(sharedSamples);
const report = {
  command: "bun scripts/experiments/frontend-interaction-bench.ts",
  environment: { bun: Bun.version, platform: process.platform, arch: process.arch },
  warmupRuns: 3,
  measuredRuns: 7,
  scope:
    "Synthetic CPU microbenchmarks only; no browser FPS or full-app latency claim. Warm caches; initialization excluded. Same triangle geometry/ray for both picking paths.",
  picking: [picking("column", 2048), picking("grid", 10000)],
  sampling: {
    edgeCount: links.length,
    segments,
    sharedVertices: vertices,
    original,
    shared,
    medianSpeedup: original.medianMs / shared.medianMs,
    baselineBackgroundBytes: segments * 2 * 6 * 4,
    indexedBackgroundBytes: vertices * (3 * 4 + 4) + segments * 2 * 4,
    checksum,
  },
};
const path = new URL("../../reports/frontend-performance-2026-10-18/interaction-microbench.json", import.meta.url);
await Bun.write(path, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report));
