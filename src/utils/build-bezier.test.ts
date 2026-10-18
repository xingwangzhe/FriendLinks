import { describe, expect, test } from "bun:test";
import { buildBezierPositions, quantize } from "./build-bezier";
import { decode, encode } from "msgpackr";

function assertRoundTrip(values: Float32Array) {
  const encoded = quantize(values);
  expect(encoded.i16.length).toBe(values.length);
  expect(Number.isFinite(encoded.min)).toBe(true);
  expect(Number.isFinite(encoded.max)).toBe(true);
  if (values.length === 0) return;
  expect(encoded.min).toBe(Math.min(...values));
  expect(encoded.max).toBe(Math.max(...values));
  const range = encoded.max - encoded.min;
  for (let index = 0; index < values.length; index++) {
    const decoded = ((encoded.i16[index] + 32768) / 65535) * range + encoded.min;
    expect(Math.abs(decoded - values[index])).toBeLessThanOrEqual(range / 65535 + 1e-10);
  }
}

describe("compact build-time Bezier data", () => {
  test("allocates exactly two scalar coordinates per segment on each axis", () => {
    const positions = buildBezierPositions(3, [0, 1, 2], [1, 2, 0], [100, 200, 17000], [30, 60, 90], [-8, -5, -2]);
    expect(positions.lseg).toEqual([16, 32, 32]);
    const vertexCount = positions.lseg.reduce((total, segments) => total + segments * 2, 0);
    for (const axis of [positions.lpx, positions.lpy, positions.lpz]) {
      expect(axis.length).toBe(vertexCount);
      expect(axis.every(Number.isFinite)).toBe(true);
    }
    // An all-positive axis has no allocation padding introducing false zero bounds.
    expect(quantize(positions.lpx).min).toBeGreaterThan(0);
  });

  test("keeps edge endpoints and shared segment endpoints continuous across invalid edges", () => {
    const srcs = [0, 99, 1, -1, 0.5, 2];
    const tgts = [1, 0, 2, 0, 1, 0];
    const coordinates = [
      [100, 200, 900],
      [-50, 20, 70],
      [10, 30, -60],
    ];
    const positions = buildBezierPositions(3, srcs, tgts, coordinates[0], coordinates[1], coordinates[2]);
    const axes = [positions.lpx, positions.lpy, positions.lpz];
    let offset = 0;
    for (let edge = 0; edge < srcs.length; edge++) {
      const vertexCount = positions.lseg[edge] * 2;
      for (let axis = 0; axis < axes.length; axis++) {
        const values = axes[axis];
        if ([1, 3, 4].includes(edge)) {
          expect([...values.subarray(offset, offset + vertexCount)]).toEqual(Array(vertexCount).fill(0));
        } else {
          expect(values[offset]).toBe(coordinates[axis][srcs[edge]]);
          expect(values[offset + vertexCount - 1]).toBe(coordinates[axis][tgts[edge]]);
          for (let vertex = 1; vertex < vertexCount - 1; vertex += 2)
            expect(values[offset + vertex]).toBe(values[offset + vertex + 1]);
        }
      }
      offset += vertexCount;
    }
    expect(positions.lpx.length).toBe(offset);
  });

  test("empty graphs and zero-length edges retain finite quantization bounds", () => {
    const empty = buildBezierPositions(0, [], [], [], [], []);
    expect(empty.lseg).toEqual([]);
    for (const axis of [empty.lpx, empty.lpy, empty.lpz]) {
      expect(quantize(axis)).toEqual({ i16: new Int16Array(0), min: 0, max: 0 });
      assertRoundTrip(axis);
    }
    const point = buildBezierPositions(1, [0], [0], [7], [0], [-3]);
    expect(point.lseg).toEqual([16]);
    for (const axis of [point.lpx, point.lpy, point.lpz]) assertRoundTrip(axis);
  });

  test("quantizes actual positive, negative and mixed axis ranges within one quantization step", () => {
    for (const values of [
      new Float32Array([101, 115.5, 999.25, 321]),
      new Float32Array([-101, -115.5, -999.25, -321]),
      new Float32Array([-500, -0.5, 0, 1.5, 2000]),
    ])
      assertRoundTrip(values);
    const curve = buildBezierPositions(3, [0, 1], [1, 2], [10, 900, 300], [-700, 500, 100], [1100, -50, 80]);
    for (const axis of [curve.lpx, curve.lpy, curve.lpz]) assertRoundTrip(axis);
  });
});

describe("compact Bezier endpoint encoding", () => {
  test("encodes signed Int16 coordinate bytes without numeric Uint8 conversion", () => {
    const extremes = new Int16Array([-32768, 32767]);
    const extremeBytes = new Uint8Array(extremes.buffer, extremes.byteOffset, extremes.byteLength);
    // msgpackr's default typed-array path converts numeric entries to Uint8 values.
    // The endpoint must supply an explicit byte view of the quantized coordinates.
    expect(Buffer.from(decode(encode(extremes)))).not.toEqual(Buffer.from(extremeBytes));
    expect(Buffer.from(decode(encode(extremeBytes)))).toEqual(Buffer.from(extremeBytes));

    const curve = buildBezierPositions(3, [0, 1], [1, 2], [10, 900, 300], [-700, 500, 100], [1100, -50, 80]);
    const quantized = [quantize(curve.lpx), quantize(curve.lpy), quantize(curve.lpz)];
    const bytes = (values: Int16Array) => new Uint8Array(values.buffer, values.byteOffset, values.byteLength);
    const encoded = encode({
      lseg: curve.lseg,
      lpx: bytes(quantized[0].i16),
      lpx_min: quantized[0].min,
      lpx_max: quantized[0].max,
      lpy: bytes(quantized[1].i16),
      lpy_min: quantized[1].min,
      lpy_max: quantized[1].max,
      lpz: bytes(quantized[2].i16),
      lpz_min: quantized[2].min,
      lpz_max: quantized[2].max,
    });
    const decoded = decode(encoded);
    expect(decoded.lseg).toEqual(curve.lseg);
    for (const [axis, index] of [
      ["lpx", 0],
      ["lpy", 1],
      ["lpz", 2],
    ] as const) {
      const data = decoded[axis] as Uint8Array;
      const restored = new Int16Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
      expect(restored).toEqual(quantized[index].i16);
      expect(decoded[`${axis}_min`]).toBe(quantized[index].min);
      expect(decoded[`${axis}_max`]).toBe(quantized[index].max);
    }
  });
});
