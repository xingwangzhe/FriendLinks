import * as THREE from "three/webgpu";
import { EdgeGeometryStore } from "./edge-geometry";

/** Indexed endpoints retain all Float32 curve samples; only colors are quantized. */
export function createBackgroundEdgeGeometry(store: EdgeGeometryStore): THREE.BufferGeometry {
  let totalVertices = 0;
  let totalSegments = 0;
  for (let edge = 0; edge < store.edgeCount; edge++) {
    totalVertices += store.getVertexCount(edge);
    totalSegments += store.getSegmentCount(edge);
  }
  const positions = new Float32Array(totalVertices * 3);
  // RGBA8 maps to unorm8x4 on WebGPU and normalized attributes on WebGL.
  const colors = new Uint8Array(totalVertices * 4);
  const indices = new Uint32Array(totalSegments * 2);
  const sourceColor = new THREE.Color();
  const targetColor = new THREE.Color();
  let vertexCursor = 0;
  let indexCursor = 0;
  for (let edge = 0; edge < store.edgeCount; edge++) {
    const sample = store.sampleVertices(edge);
    const { segmentCount, vertexCount } = sample;
    if (!segmentCount) continue;
    positions.set(sample.positions.subarray(0, vertexCount * 3), vertexCursor * 3);
    const link = store.links[edge];
    const source = store.nodes[store.nodeIdToIndex.get(link.source) ?? -1] as { _cDefault?: string } | undefined;
    const target = store.nodes[store.nodeIdToIndex.get(link.target) ?? -1] as { _cDefault?: string } | undefined;
    sourceColor.set(source?._cDefault || "#ffffff");
    targetColor.set(target?._cDefault || "#ffffff");
    const shared = vertexCount === segmentCount + 1;
    for (let vertex = 0; vertex < vertexCount; vertex++) {
      const t = (shared ? vertex : Math.floor(vertex / 2) + (vertex % 2)) / segmentCount;
      const base = (vertexCursor + vertex) * 4;
      colors[base] = Math.round((sourceColor.r + (targetColor.r - sourceColor.r) * t) * 255);
      colors[base + 1] = Math.round((sourceColor.g + (targetColor.g - sourceColor.g) * t) * 255);
      colors[base + 2] = Math.round((sourceColor.b + (targetColor.b - sourceColor.b) * t) * 255);
      colors[base + 3] = 255;
    }
    for (let segment = 0; segment < segmentCount; segment++) {
      const start = vertexCursor + (shared ? segment : segment * 2);
      indices[indexCursor++] = start;
      indices[indexCursor++] = start + 1;
    }
    vertexCursor += vertexCount;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4, true));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.setDrawRange(0, indexCursor);
  return geometry;
}

/** Hiding releases backing arrays and GPU buffers; repeated hides allocate nothing. */
export function releaseBackgroundEdgeGeometry(lines: THREE.LineSegments): boolean {
  const geometry = lines.geometry;
  if (!geometry.hasAttribute("position") && !geometry.index) return false;
  lines.geometry = new THREE.BufferGeometry();
  lines.geometry.setDrawRange(0, 0);
  geometry.dispose();
  return true;
}
