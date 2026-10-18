import { expect, spyOn, test } from "bun:test";
import type { GraphNode } from "../../../types/graph";
import { bezier2, calcControlOffset, calcSegmentCount } from "../../utils/bezier";
import { EdgeGeometryStore } from "./edge-geometry";

test("unique runtime vertices expand to the exact previous Float32 samples", () => {
  const nodes: GraphNode[] = Array.from({ length: 81 }, (_, index) => ({
    id: `${index}`,
    name: `${index}`,
    url: "https://example.com",
    x: Math.sin(index * 1.7) * index * 173,
    y: Math.cos(index * 2.3) * index * 51,
    z: index * index * 3.14,
  }));
  const links = nodes.slice(1).map((node) => ({ source: "0", target: node.id }));
  const indices = new Map(nodes.map((node, index) => [node.id, index]));
  const store = new EdgeGeometryStore(links, indices, nodes);
  let oldVertices = 0;
  let sharedVertices = 0;
  for (let edge = 0; edge < links.length; edge++) {
    const source = nodes[0];
    const target = nodes[edge + 1];
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
    const expected = new Float32Array(segments * 6);
    for (let segment = 0; segment < segments; segment++) {
      for (let endpoint = 0; endpoint < 2; endpoint++) {
        const t = (segment + endpoint) / segments;
        const base = segment * 6 + endpoint * 3;
        expected[base] = bezier2(sx, cx, ex, t);
        expected[base + 1] = bezier2(sy, cy, ey, t);
        expected[base + 2] = bezier2(sz, cz, ez, t);
      }
    }
    const unique = store.sampleVertices(edge);
    expect(unique.vertexCount).toBe(segments + 1);
    expect(store.getVertexCount(edge)).toBe(unique.vertexCount);
    const sample = store.sampleEdge(edge);
    expect(sample.positions.slice(0, sample.segmentCount * 6)).toEqual(expected);
    oldVertices += segments * 2;
    sharedVertices += unique.vertexCount;
  }
  expect(sharedVertices).toBeLessThan(oldVertices * 0.54);
});

test("compact unique vertices preserve discontinuous segments and Float32 equivalence", () => {
  const store = new EdgeGeometryStore(
    [
      { source: "unused", target: "unused" },
      { source: "unused", target: "unused" },
    ],
    new Map(),
    [],
    {
      lseg: [2, 2],
      lpx: [1, 2, 10, 20, 30, 31, 31 + 1e-9, 32],
      lpy: [0, 1, 2, 3, 0, 1, 1, 2],
      lpz: [0, 0, 0, 0, 0, 0, 0, 0],
    },
  );
  expect(store.getVertexCount(0)).toBe(4);
  expect(Array.from(store.sampleVertices(0).positions.slice(0, 12))).toEqual([1, 0, 0, 2, 1, 0, 10, 2, 0, 20, 3, 0]);
  expect(Array.from(store.sampleEdge(0).positions.slice(0, 12))).toEqual([1, 0, 0, 2, 1, 0, 10, 2, 0, 20, 3, 0]);
  expect(store.getVertexCount(1)).toBe(3);
  expect(Array.from(store.sampleVertices(1).positions.slice(0, 9))).toEqual([30, 0, 0, 31, 1, 0, 32, 2, 0]);
  expect(Array.from(store.sampleEdge(1).positions.slice(0, 12))).toEqual([30, 0, 0, 31, 1, 0, 31, 1, 0, 32, 2, 0]);
});

test("rebuilding static edge samples reuses endpoint lookups and invalid edges stay empty", () => {
  const nodes: GraphNode[] = [
    { id: "a", name: "a", url: "https://a.example", x: 0 },
    { id: "b", name: "b", url: "https://b.example", x: 1000 },
  ];
  const indices = new Map(nodes.map((node, index) => [node.id, index]));
  const lookup = spyOn(indices, "get");
  const store = new EdgeGeometryStore([{ source: "a", target: "b" }], indices, nodes);
  store.getSegmentCount(0);
  store.getVertexCount(0);
  store.sampleVertices(0);
  store.sampleEdge(0);
  expect(lookup).toHaveBeenCalledTimes(2);
  lookup.mockRestore();
  expect(store.getVertexCount(-1)).toBe(0);
  expect(store.sampleVertices(10).vertexCount).toBe(0);
  expect(store.sampleEdge(10).segmentCount).toBe(0);
});
