import { getBuildResult } from "../utils/build-graph";
import { encode } from "msgpackr";
import { printDone } from "../utils/progress";

export async function GET() {
  const startTime = performance.now();
  const data = await getBuildResult();

  // 保持 Float32Array，msgpackr 编码为紧凑二进制（4 字节/值）
  // 不转 Array.from()，避免膨胀为 float64
  const bezier = {
    lseg: data.lseg,
    lpx: data.lpx,
    lpy: data.lpy,
    lpz: data.lpz,
  };

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  printDone(`/graph-bezier.bin 完成 · ${data.ls.length} 边 · 耗时 ${elapsed}s`);
  return new Response(encode(bezier) as unknown as BodyInit, {
    headers: { "Content-Type": "application/octet-stream" },
  });
}
