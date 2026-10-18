/**
 * 构建端使用 Bun 原生 Zstandard，客户端仍通过 @bokuweb/zstd-wasm 解压。
 * 保持标准 zstd 帧与 level 10，避免 WASM 初始化和输入/输出复制。
 */
import { artifactKey, buildArtifacts, buildCacheEnabled, contentHash } from "./build-artifact-cache";

export async function zstdCompress(buf: Buffer): Promise<Buffer> {
  const level = 10;
  const key = buildCacheEnabled() ? artifactKey({ input: contentHash(buf), level, bun: Bun.version }) : null;
  if (key) {
    const cached = await buildArtifacts.read<Uint8Array>("zstd", key);
    if (cached) {
      console.log(`[cache] zstd hit: ${buf.byteLength} input bytes, ${cached.byteLength} output bytes`);
      return Buffer.from(cached.buffer, cached.byteOffset, cached.byteLength);
    }
  }
  const compressed = await Bun.zstdCompress(buf, { level });
  if (key) await buildArtifacts.write("zstd", key, compressed);
  return compressed;
}
