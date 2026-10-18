import { describe, expect, spyOn, test } from "bun:test";
import * as THREE from "three/webgpu";
import type { GraphNode } from "../../../types/graph";
import { bezier2, calcControlOffset, calcSegmentCount, MAX_EDGE_SEGMENTS } from "../../utils/bezier";
import { EdgeGeometryStore } from "./edge-geometry";
import { setLinkOpacity, updateLinkPositions, type RenderContext } from "./renderer";

const nodes: GraphNode[] = [
  { id: "a", name: "a", url: "https://a.example", x: 10, y: 20, z: 30 },
  { id: "b", name: "b", url: "https://b.example", x: 2010, y: 1020, z: 530 },
  { id: "c", name: "c", url: "https://c.example", x: 100010, y: -2000, z: 300 },
];
const indices = new Map(nodes.map((node, index) => [node.id, index]));
const links = [
  { source: "a", target: "b" },
  { source: "b", target: "c" },
];

function createContext(): RenderContext {
  return {
    linkLines: new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial()),
    edgeStore: null,
    requestRender: () => {},
  } as unknown as RenderContext;
}

describe("on-demand edge geometry", () => {
  test("runtime samples preserve curve endpoints, shape and contiguous segments", () => {
    const store = new EdgeGeometryStore(links, indices, nodes);
    const sample = store.sampleEdge(0);
    const length = Math.hypot(2000, 1000, 500);
    expect(sample.segmentCount).toBe(calcSegmentCount(length));
    expect(Array.from(sample.positions.subarray(0, 3))).toEqual([10, 20, 30]);
    expect(Array.from(sample.positions.subarray(sample.segmentCount * 6 - 3, sample.segmentCount * 6))).toEqual([
      2010, 1020, 530,
    ]);
    const offset = calcControlOffset(2000, 1000, 500, length);
    const midpoint = sample.segmentCount / 2;
    expect(sample.positions[midpoint * 6]).toBeCloseTo(bezier2(10, 1010 + offset.ox * length * 0.15, 2010, 0.5), 3);
    for (let i = 1; i < sample.segmentCount; i++) {
      expect(Array.from(sample.positions.subarray(i * 6, i * 6 + 3))).toEqual(
        Array.from(sample.positions.subarray(i * 6 - 3, i * 6)),
      );
    }
    expect(store.sampleEdge(1).segmentCount).toBe(MAX_EDGE_SEGMENTS);
  });

  test("compact curves retain variable edge offsets without fixed-stride padding", () => {
    const store = new EdgeGeometryStore(links, indices, nodes, {
      lseg: [1, 2],
      lpx: new Float32Array([1, 2, 10, 11, 11, 12]),
      lpy: new Float32Array([3, 4, 20, 21, 21, 22]),
      lpz: new Float32Array([5, 6, 30, 31, 31, 32]),
    });
    const second = store.sampleEdge(1);
    expect(second.segmentCount).toBe(2);
    expect(Array.from(second.positions.subarray(0, 12))).toEqual([10, 20, 30, 11, 21, 31, 11, 21, 31, 12, 22, 32]);
    expect(store.sampleEdge(0)).toBe(second);
    expect(Array.from(second.positions.subarray(0, 6))).toEqual([1, 3, 5, 2, 4, 6]);
  });

  test("truncated compact input falls back to a complete runtime curve", () => {
    const store = new EdgeGeometryStore(links, indices, nodes, {
      lseg: [1, 2],
      lpx: [1],
      lpy: [1],
      lpz: [1],
    });
    expect(store.sampleEdge(0).segmentCount).toBe(calcSegmentCount(Math.hypot(2000, 1000, 500)));
    expect(Array.from(store.sampleEdge(0).positions.subarray(0, 3))).toEqual([10, 20, 30]);
  });

  test("missing endpoints and invalid indices have no drawable segments", () => {
    const store = new EdgeGeometryStore([{ source: "a", target: "missing" }], indices, nodes);
    expect(store.sampleEdge(0).segmentCount).toBe(0);
    expect(store.sampleEdge(-1).segmentCount).toBe(0);
    expect(store.sampleEdge(10).segmentCount).toBe(0);
  });

  test("hidden background allocates no graph buffers; revealing includes edges beyond the overlay limit", () => {
    const context = createContext();
    const manyLinks = Array.from({ length: 501 }, () => links[0]);
    updateLinkPositions(context, manyLinks, indices, nodes, 0);
    expect(context.linkLines.visible).toBe(false);
    expect(context.linkLines.geometry.getAttribute("position")).toBeUndefined();
    expect(context.linkLines.geometry.getAttribute("color")).toBeUndefined();
    const sampleSpy = spyOn(context.edgeStore!, "sampleVertices");
    setLinkOpacity(context, 0);
    expect(sampleSpy).not.toHaveBeenCalled();
    setLinkOpacity(context, 0.5);
    const segments = calcSegmentCount(Math.hypot(2000, 1000, 500));
    expect(context.linkLines.visible).toBe(true);
    expect(context.linkLines.geometry.drawRange.count).toBe(501 * segments * 2);
    expect(context.linkLines.geometry.getAttribute("position").array.length).toBe(501 * (segments + 1) * 3);
    expect(sampleSpy).toHaveBeenCalledTimes(501);
    const geometry = context.linkLines.geometry;
    const position = geometry.getAttribute("position");
    const index = geometry.index!;
    const original = context.edgeStore!.sampleEdge(0).positions;
    for (let endpoint = 0; endpoint < segments * 2; endpoint++) {
      for (let axis = 0; axis < 3; axis++) {
        expect(position.array[index.array[endpoint] * 3 + axis]).toBe(original[endpoint * 3 + axis]);
      }
    }
    sampleSpy.mockClear();
    const disposeSpy = spyOn(geometry, "dispose");
    setLinkOpacity(context, 0);
    expect(disposeSpy).toHaveBeenCalledTimes(1);
    expect(context.linkLines.geometry.getAttribute("position")).toBeUndefined();
    expect(context.linkLines.geometry.getAttribute("color")).toBeUndefined();
    expect(context.linkLines.geometry.index).toBeNull();
    setLinkOpacity(context, 0.25);
    expect(context.linkLines.geometry).not.toBe(geometry);
    expect(context.linkLines.geometry.drawRange.count).toBe(501 * segments * 2);
    expect(sampleSpy).toHaveBeenCalledTimes(501);
  });
});
