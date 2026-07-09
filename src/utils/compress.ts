/**
 * zstd 压缩工具（@bokuweb/zstd-wasm）
 * 构建端用 compress，客户端用 decompress，统一一个包
 */
import { init, compress as zstdCompressRaw } from "@bokuweb/zstd-wasm";

let _init: Promise<void> | null = null;
function ensureInit(): Promise<void> {
  if (!_init) _init = init();
  return _init;
}

export async function zstdCompress(buf: Buffer): Promise<Buffer> {
  await ensureInit();
  return Buffer.from(zstdCompressRaw(new Uint8Array(buf), 10));
}
