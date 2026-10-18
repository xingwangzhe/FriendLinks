import { describe, test, expect } from "bun:test";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { BuildArtifactCache, artifactKey, implementationFingerprint } from "./build-artifact-cache";
import { encode, decode } from "msgpackr";

describe("verified build artifacts", () => {
  test("roundtrips real arrays and rejects corruption or different inputs", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "friendlinks-cache-"));
    try {
      const cache = new BuildArtifactCache(dir);
      const key = artifactKey({ topology: [0, 1, 2], binaryDigest: "first" });
      const value = {
        ids: ["a", "b"],
        positions: [0.1, -2.4],
        histogram: [12, 4],
        bytes: new Int16Array([-32768, 32767]),
      };
      await cache.write("graph", key, value);
      const restored = await cache.read<typeof value>("graph", key);
      expect(restored?.ids).toEqual(value.ids);
      expect(restored?.positions).toEqual(value.positions);
      expect(restored?.histogram).toEqual(value.histogram);
      expect(
        Array.from(new Uint8Array(restored!.bytes.buffer, restored!.bytes.byteOffset, restored!.bytes.byteLength)),
      ).toEqual(Array.from(new Uint8Array(value.bytes.buffer)));
      expect(await cache.read("graph", artifactKey({ topology: [0, 1, 2], binaryDigest: "changed" }))).toBeNull();
      const file = path.join(dir, (await readdir(dir))[0]);
      const bytes = await readFile(file);
      const envelope = decode(await Bun.zstdDecompress(bytes));
      envelope.payload[0] ^= 1;
      await writeFile(file, await Bun.zstdCompress(encode(envelope)));
      expect(await cache.read("graph", key)).toBeNull();
      await writeFile(file, bytes.subarray(0, 8));
      expect(await cache.read("graph", key)).toBeNull();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
  test("invalidates same-version local native rebuilds, loader changes and source changes", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "friendlinks-fingerprint-"));
    try {
      const packageDir = path.join(dir, "node_modules/test-native");
      await mkdir(packageDir, { recursive: true });
      await writeFile(path.join(dir, "package.json"), "{}");
      await writeFile(path.join(dir, "pipeline.ts"), "original");
      await writeFile(
        path.join(packageDir, "package.json"),
        JSON.stringify({ name: "test-native", version: "1.0.0", main: "index.js" }),
      );
      await writeFile(path.join(packageDir, "index.js"), "module.exports = {};");
      await writeFile(path.join(packageDir, "test.node"), "first binary");
      const fingerprint = () => implementationFingerprint(["pipeline.ts"], ["test-native"], dir);
      const original = await fingerprint();
      expect(original).not.toBeNull();
      expect(await fingerprint()).toBe(original);
      await writeFile(path.join(packageDir, "test.node"), "second binary");
      const rebuilt = await fingerprint();
      expect(rebuilt).not.toBe(original);
      await writeFile(path.join(packageDir, "index.js"), "module.exports = { changed: true };");
      const loader = await fingerprint();
      expect(loader).not.toBe(rebuilt);
      await writeFile(path.join(dir, "pipeline.ts"), "changed pipeline");
      expect(await fingerprint()).not.toBe(loader);
      expect(await implementationFingerprint(["missing.ts"], [], dir)).toBeNull();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
