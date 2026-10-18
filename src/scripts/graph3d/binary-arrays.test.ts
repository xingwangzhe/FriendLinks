import { describe, expect, test } from "bun:test";
import { decode, encode } from "msgpackr";
import { asInt16 } from "./binary-arrays";

describe("compact signed coordinate bytes", () => {
  const coordinates = new Int16Array([-32768, -1234, 0, 1234, 32767]);
  const bytes = new Uint8Array(coordinates.buffer, coordinates.byteOffset, coordinates.byteLength);

  test("retains existing Int16 values and aligned byte views without copying", () => {
    expect(asInt16(coordinates)).toBe(coordinates);
    const aligned = new Uint8Array(bytes.length + 4);
    aligned.set(bytes, 2);
    const restored = asInt16(aligned.subarray(2, 2 + bytes.length));
    expect(restored).toEqual(coordinates);
    expect(restored.buffer).toBe(aligned.buffer);
    expect(restored.byteOffset).toBe(2);
  });

  test("recovers an odd-offset byte slice without surrounding sentinel bytes", () => {
    const unaligned = new Uint8Array(bytes.length + 2).fill(0x55);
    unaligned.set(bytes, 1);
    const restored = asInt16(unaligned.subarray(1, 1 + bytes.length));
    expect(restored).toEqual(coordinates);
    expect(restored.buffer).not.toBe(unaligned.buffer);
    unaligned.fill(0);
    expect(restored).toEqual(coordinates);
  });

  test("decodes MessagePack binary at an odd byte offset", () => {
    const message = encode({ lpx: bytes, lpx_min: -500, lpx_max: 900 });
    let decoded: { lpx: Uint8Array } | undefined;
    for (const prefix of [0, 1]) {
      const framed = new Uint8Array(message.length + prefix + 1);
      framed.set(message, prefix);
      const candidate = decode(framed.subarray(prefix, prefix + message.length)) as { lpx: Uint8Array };
      if (candidate.lpx.byteOffset % 2 === 1) {
        decoded = candidate;
        break;
      }
    }
    expect(decoded).toBeDefined();
    expect(decoded!.lpx.byteOffset % 2).toBe(1);
    expect(asInt16(decoded!.lpx)).toEqual(coordinates);
  });

  test("rejects truncated or non-binary coordinate data", () => {
    expect(() => asInt16(new Uint8Array([1, 2, 3]))).toThrow(RangeError);
    expect(() => asInt16([-1, 2])).toThrow(TypeError);
    expect(() => asInt16(null)).toThrow(TypeError);
    expect(asInt16(new Uint8Array(0))).toEqual(new Int16Array(0));
  });
});
