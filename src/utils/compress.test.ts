import { beforeAll, describe, expect, test } from "bun:test";
import { decompress, init } from "@bokuweb/zstd-wasm";
import { zstdCompress } from "./compress";

beforeAll(async () => {
  await init();
});

describe("build compression and browser decompression", () => {
  const binary = Buffer.alloc(1024 * 1024);
  let state = 0x12345678;
  for (let index = 0; index < binary.length; index++) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    binary[index] = state & 255;
  }

  const cases = [
    { name: "empty", input: Buffer.alloc(0) },
    { name: "small UTF-8 metadata", input: Buffer.from('{"name":"博客宇宙","nodes":8570}') },
    { name: "every byte value", input: Buffer.from(Array.from({ length: 256 }, (_, index) => index)) },
    { name: "large deterministic binary", input: binary },
  ];

  for (const { name, input } of cases) {
    test(`${name} round-trips through the browser WASM decoder`, async () => {
      const compressed = await zstdCompress(input);
      expect(Buffer.isBuffer(compressed)).toBe(true);
      expect([...compressed.subarray(0, 4)]).toEqual([0x28, 0xb5, 0x2f, 0xfd]);
      expect(Buffer.from(decompress(compressed))).toEqual(input);
      expect(Bun.zstdDecompressSync(compressed)).toEqual(input);
    });
  }
});
