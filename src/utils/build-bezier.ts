import { bezier2, calcControlOffset, calcSegmentCount } from "./bezier";

/** One scalar per vertex per axis; each line segment has two vertices. */
export function buildBezierPositions(
  nCount: number,
  srcs: number[],
  tgts: number[],
  px: number[],
  py: number[],
  pz: number[],
) {
  const edgeCount = srcs.length;
  const lseg = new Uint8Array(edgeCount);
  const validIndex = (index: number) => Number.isInteger(index) && index >= 0 && index < nCount;
  let vertexCount = 0;
  for (let i = 0; i < edgeCount; i++) {
    const si = srcs[i];
    const ti = tgts[i];
    if (!validIndex(si) || !validIndex(ti)) {
      lseg[i] = 6;
      vertexCount += lseg[i] * 2;
      continue;
    }
    const dx = px[ti] - px[si],
      dy = py[ti] - py[si],
      dz = pz[ti] - pz[si];
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    lseg[i] = calcSegmentCount(len);
    vertexCount += lseg[i] * 2;
  }

  const lpx = new Float32Array(vertexCount);
  const lpy = new Float32Array(vertexCount);
  const lpz = new Float32Array(vertexCount);
  let cursor = 0;
  for (let i = 0; i < edgeCount; i++) {
    const si = srcs[i];
    const ti = tgts[i];
    if (!validIndex(si) || !validIndex(ti)) {
      cursor += lseg[i] * 2;
      continue;
    }
    const sx = px[si],
      sy = py[si],
      sz = pz[si];
    const ex = px[ti],
      ey = py[ti],
      ez = pz[ti];
    const dx = ex - sx,
      dy = ey - sy,
      dz = ez - sz;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    const off = calcControlOffset(dx, dy, dz, len);
    const bend = len * 0.15;
    const cx = (sx + ex) / 2 + off.ox * bend;
    const cy = (sy + ey) / 2 + off.oy * bend;
    const cz = (sz + ez) / 2 + off.oz * bend;

    const segs = lseg[i];
    for (let j = 0; j < segs; j++) {
      const t0 = j / segs;
      const t1 = (j + 1) / segs;
      lpx[cursor] = bezier2(sx, cx, ex, t0);
      lpy[cursor] = bezier2(sy, cy, ey, t0);
      lpz[cursor] = bezier2(sz, cz, ez, t0);
      cursor++;
      lpx[cursor] = bezier2(sx, cx, ex, t1);
      lpy[cursor] = bezier2(sy, cy, ey, t1);
      lpz[cursor] = bezier2(sz, cz, ez, t1);
      cursor++;
    }
  }

  return { lseg: Array.from(lseg), lpx, lpy, lpz };
}

/** Float32 → Int16; empty geometry uses finite bounds for portable serialization. */
export function quantize(arr: Float32Array): { i16: Int16Array; min: number; max: number } {
  if (arr.length === 0) return { i16: new Int16Array(0), min: 0, max: 0 };
  let min = Infinity,
    max = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  const range = max - min || 1;
  const i16 = new Int16Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    i16[i] = Math.round(((arr[i] - min) / range) * 65535 - 32768);
  }
  return { i16, min, max };
}
