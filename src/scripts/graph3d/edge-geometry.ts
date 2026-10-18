import type { GraphNode } from "../../../types/graph";
import { calcControlOffset, calcSegmentCount, MAX_EDGE_SEGMENTS } from "../../utils/bezier";

export interface CompactBezierData {
  lseg: ArrayLike<number>;
  lpx: ArrayLike<number>;
  lpy: ArrayLike<number>;
  lpz: ArrayLike<number>;
}

export interface EdgeSample {
  /** Reused until the next sampleEdge call; each segment occupies six XYZ floats. */
  positions: Float32Array;
  segmentCount: number;
}

export interface EdgeVertexSample {
  /** Reused by the next sampleVertices call; only vertexCount * 3 values are used. */
  positions: Float32Array;
  segmentCount: number;
  /** Usually segmentCount + 1; disjoint compact segments retain both endpoints. */
  vertexCount: number;
}

/**
 * Keep compact server data compact, and sample runtime curves only on demand.
 * Hidden background links need no full-graph position or color buffers.
 */
export class EdgeGeometryStore {
  readonly edgeCount: number;
  private readonly sample: EdgeSample = {
    positions: new Float32Array(MAX_EDGE_SEGMENTS * 6),
    segmentCount: 0,
  };
  private readonly vertices: EdgeVertexSample = {
    positions: new Float32Array(MAX_EDGE_SEGMENTS * 6),
    segmentCount: 0,
    vertexCount: 0,
  };
  private readonly compact?: CompactBezierData;
  private readonly offsets?: Uint32Array;
  private runtimeSegmentCounts?: Uint8Array;
  private endpointIndices?: Uint32Array;
  private compactVertexCounts?: Uint8Array;

  constructor(
    readonly links: readonly { source: string; target: string }[],
    readonly nodeIdToIndex: ReadonlyMap<string, number>,
    readonly nodes: readonly GraphNode[],
    compact?: CompactBezierData,
  ) {
    this.edgeCount = links.length;
    if (!compact || compact.lseg.length < links.length) return;

    // Offset once when compact data arrives; never expand/pad every edge to 32 segments.
    const offsets = new Uint32Array(links.length + 1);
    let vertexCount = 0;
    for (let i = 0; i < links.length; i++) {
      const segments = compact.lseg[i];
      if (!Number.isInteger(segments) || segments < 1 || segments > MAX_EDGE_SEGMENTS) return;
      vertexCount += segments * 2;
      if (vertexCount > 0xffffffff) return;
      offsets[i + 1] = vertexCount;
    }
    if (compact.lpx.length < vertexCount || compact.lpy.length < vertexCount || compact.lpz.length < vertexCount)
      return;
    this.compact = compact;
    this.offsets = offsets;
  }

  getSegmentCount(index: number): number {
    if (!Number.isInteger(index) || index < 0 || index >= this.edgeCount) return 0;
    if (this.compact) return this.compact.lseg[index];
    // The store describes the same static layout as the GPU graph. A new layout
    // creates a new store; hover and background rebuilds reuse these tiny caches.
    if (!this.runtimeSegmentCounts) {
      this.runtimeSegmentCounts = new Uint8Array(this.edgeCount);
      this.endpointIndices = new Uint32Array(this.edgeCount * 2);
    }
    const cached = this.runtimeSegmentCounts[index];
    if (cached) return cached === 255 ? 0 : cached;
    const link = this.links[index];
    const si = this.nodeIdToIndex.get(link.source);
    const ti = this.nodeIdToIndex.get(link.target);
    const source = si == null ? undefined : this.nodes[si];
    const target = ti == null ? undefined : this.nodes[ti];
    if (!source || !target || si == null || ti == null) {
      this.runtimeSegmentCounts[index] = 255;
      return 0;
    }
    this.endpointIndices![index * 2] = si;
    this.endpointIndices![index * 2 + 1] = ti;
    const segments = calcSegmentCount(
      Math.hypot(
        (target.x ?? 0) - (source.x ?? 0),
        (target.y ?? 0) - (source.y ?? 0),
        (target.z ?? 0) - (source.z ?? 0),
      ),
    );
    this.runtimeSegmentCounts[index] = segments;
    return segments;
  }

  getVertexCount(index: number): number {
    const segments = this.getSegmentCount(index);
    if (!segments) return 0;
    if (!this.compact || !this.offsets) return segments + 1;
    this.compactVertexCounts ??= new Uint8Array(this.edgeCount);
    if (this.compactVertexCounts[index]) return this.compactVertexCounts[index];
    const start = this.offsets[index];
    let vertexCount = segments + 1;
    // Normal curves share adjacent endpoints. Preserve arbitrary disjoint
    // compact input as separate vertices instead of silently joining its gaps.
    for (let segment = 1; segment < segments; segment++) {
      const vertex = start + segment * 2;
      if (
        Math.fround(this.compact.lpx[vertex - 1]) !== Math.fround(this.compact.lpx[vertex]) ||
        Math.fround(this.compact.lpy[vertex - 1]) !== Math.fround(this.compact.lpy[vertex]) ||
        Math.fround(this.compact.lpz[vertex - 1]) !== Math.fround(this.compact.lpz[vertex])
      ) {
        vertexCount = segments * 2;
        break;
      }
    }
    this.compactVertexCounts[index] = vertexCount;
    return vertexCount;
  }

  /** Unique curve vertices let indexed background lines share adjacent endpoints. */
  sampleVertices(index: number): EdgeVertexSample {
    const sample = this.vertices;
    const segments = this.getSegmentCount(index);
    sample.segmentCount = segments;
    sample.vertexCount = this.getVertexCount(index);
    if (!segments) return sample;
    const positions = sample.positions;
    if (this.compact && this.offsets) {
      const start = this.offsets[index];
      const shared = sample.vertexCount === segments + 1;
      for (let vertex = 0; vertex < sample.vertexCount; vertex++) {
        const source = start + (shared && vertex > 0 ? vertex * 2 - 1 : vertex);
        const destination = vertex * 3;
        positions[destination] = this.compact.lpx[source];
        positions[destination + 1] = this.compact.lpy[source];
        positions[destination + 2] = this.compact.lpz[source];
      }
      return sample;
    }

    const source = this.nodes[this.endpointIndices![index * 2]];
    const target = this.nodes[this.endpointIndices![index * 2 + 1]];
    const sx = source.x ?? 0,
      sy = source.y ?? 0,
      sz = source.z ?? 0;
    const ex = target.x ?? 0,
      ey = target.y ?? 0,
      ez = target.z ?? 0;
    const dx = ex - sx,
      dy = ey - sy,
      dz = ez - sz;
    const length = Math.hypot(dx, dy, dz) || 1;
    const offset = calcControlOffset(dx, dy, dz, length);
    const bend = length * 0.15;
    const cx = (sx + ex) / 2 + offset.ox * bend;
    const cy = (sy + ey) / 2 + offset.oy * bend;
    const cz = (sz + ez) / 2 + offset.oz * bend;
    for (let vertex = 0; vertex <= segments; vertex++) {
      const t = vertex / segments;
      const u = 1 - t;
      const startWeight = u * u;
      const controlWeight = 2 * u * t;
      const endWeight = t * t;
      const base = vertex * 3;
      positions[base] = startWeight * sx + controlWeight * cx + endWeight * ex;
      positions[base + 1] = startWeight * sy + controlWeight * cy + endWeight * ey;
      positions[base + 2] = startWeight * sz + controlWeight * cz + endWeight * ez;
    }
    return sample;
  }

  sampleEdge(index: number): EdgeSample {
    const vertices = this.sampleVertices(index);
    const sample = this.sample;
    sample.segmentCount = vertices.segmentCount;
    const shared = vertices.vertexCount === vertices.segmentCount + 1;
    for (let segment = 0; segment < sample.segmentCount; segment++) {
      const source = (shared ? segment : segment * 2) * 3;
      const target = source + 3;
      const base = segment * 6;
      sample.positions[base] = vertices.positions[source];
      sample.positions[base + 1] = vertices.positions[source + 1];
      sample.positions[base + 2] = vertices.positions[source + 2];
      sample.positions[base + 3] = vertices.positions[target];
      sample.positions[base + 4] = vertices.positions[target + 1];
      sample.positions[base + 5] = vertices.positions[target + 2];
    }
    return sample;
  }
}
