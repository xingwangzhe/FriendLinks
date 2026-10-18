import { describe, expect, test } from "bun:test";
import * as THREE from "three/webgpu";
import type { GraphNode } from "../../../types/graph";
import { EdgeGeometryStore } from "./edge-geometry";
import { createBackgroundEdgeGeometry, releaseBackgroundEdgeGeometry } from "./background-edges";

const nodes: (GraphNode & { _cDefault: string })[] = [
  { id: "a", name: "a", url: "https://a.example", x: 10, y: 20, z: 30, _cDefault: "#ff6600" },
  { id: "b", name: "b", url: "https://b.example", x: 2010, y: 1020, z: 530, _cDefault: "#33ccff" },
  { id: "c", name: "c", url: "https://c.example", x: 100010, y: -2000, z: 300, _cDefault: "#6633cc" },
];
const indices = new Map(nodes.map((node, index) => [node.id, index]));
const links = [
  { source: "a", target: "b" },
  { source: "b", target: "c" },
];

function checkAllEndpoints(store: EdgeGeometryStore, geometry: THREE.BufferGeometry) {
  const positions = geometry.getAttribute("position");
  const colors = geometry.getAttribute("color");
  const index = geometry.index!;
  let cursor = 0;
  for (let edge = 0; edge < store.edgeCount; edge++) {
    const sample = store.sampleEdge(edge);
    const source = new THREE.Color(nodes[indices.get(store.links[edge].source)!]._cDefault);
    const target = new THREE.Color(nodes[indices.get(store.links[edge].target)!]._cDefault);
    for (let segment = 0; segment < sample.segmentCount; segment++) {
      for (let endpoint = 0; endpoint < 2; endpoint++) {
        const vertex = index.getX(cursor++);
        const base = segment * 6 + endpoint * 3;
        expect([positions.getX(vertex), positions.getY(vertex), positions.getZ(vertex)]).toEqual(
          Array.from(sample.positions.subarray(base, base + 3)),
        );
        const t = (segment + endpoint) / sample.segmentCount;
        expect(Math.abs(colors.getX(vertex) - (source.r + (target.r - source.r) * t))).toBeLessThanOrEqual(1 / 255);
        expect(Math.abs(colors.getY(vertex) - (source.g + (target.g - source.g) * t))).toBeLessThanOrEqual(1 / 255);
        expect(Math.abs(colors.getZ(vertex) - (source.b + (target.b - source.b) * t))).toBeLessThanOrEqual(1 / 255);
        expect(colors.getW(vertex)).toBe(1);
      }
    }
  }
  expect(geometry.drawRange.count).toBe(cursor);
}

describe("indexed background edge buffers", () => {
  test("preserves every Float32 endpoint and gradient while sharing contiguous vertices", () => {
    const store = new EdgeGeometryStore(links, indices, nodes);
    const geometry = createBackgroundEdgeGeometry(store);
    checkAllEndpoints(store, geometry);
    const segments = store.getSegmentCount(0) + store.getSegmentCount(1);
    const vertices = segments + links.length;
    expect(geometry.getAttribute("position").array.byteLength).toBe(vertices * 12);
    expect(geometry.getAttribute("color").array.byteLength).toBe(vertices * 4);
    expect(geometry.getAttribute("color").normalized).toBe(true);
    expect(geometry.index!.array.byteLength).toBe(segments * 8);
    expect(vertices * 16 + segments * 8).toBeLessThan(segments * 48);
    geometry.dispose();
  });

  test("preserves disjoint compact segment data without introducing connections", () => {
    const store = new EdgeGeometryStore([links[0]], indices, nodes, {
      lseg: [2],
      lpx: [0, 1, 50, 51],
      lpy: [0, 0, 0, 0],
      lpz: [0, 0, 0, 0],
    });
    const geometry = createBackgroundEdgeGeometry(store);
    expect(Array.from(geometry.index!.array)).toEqual([0, 1, 2, 3]);
    expect(geometry.getAttribute("position").count).toBe(4);
    checkAllEndpoints(store, geometry);
    geometry.dispose();
  });

  test("hiding disposes once and drops position, color and index allocations", () => {
    const store = new EdgeGeometryStore(links, indices, nodes);
    const geometry = createBackgroundEdgeGeometry(store);
    const lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial());
    let disposed = 0;
    geometry.addEventListener("dispose", () => disposed++);
    expect(releaseBackgroundEdgeGeometry(lines)).toBe(true);
    expect(disposed).toBe(1);
    expect(lines.geometry.getAttribute("position")).toBeUndefined();
    expect(lines.geometry.getAttribute("color")).toBeUndefined();
    expect(lines.geometry.index).toBeNull();
    expect(lines.geometry.drawRange.count).toBe(0);
    const empty = lines.geometry;
    expect(releaseBackgroundEdgeGeometry(lines)).toBe(false);
    expect(lines.geometry).toBe(empty);
    expect(disposed).toBe(1);
    lines.geometry = createBackgroundEdgeGeometry(store);
    checkAllEndpoints(store, lines.geometry);
    releaseBackgroundEdgeGeometry(lines);
    lines.material.dispose();
  });
});
