import { loadSites } from "../utils/sites";
import { getBuildResult } from "../utils/build-graph";
import { encode } from "msgpackr";
import { printProgress, printDone } from "../utils/progress";
import { isFastMode } from "../utils/sample";
import { zstdCompress } from "../utils/compress";

export async function GET() {
  const startTime = performance.now();
  printProgress("❶", "加载站点数据…", 0);
  const sites = await loadSites();
  printDone(`${sites.length} 个站点`);
  const data = await getBuildResult(sites);

  const bezier = {
    lseg: data.lseg,
    lpx: data.lpx,
    lpx_min: data.lpx_min,
    lpx_max: data.lpx_max,
    lpy: data.lpy,
    lpy_min: data.lpy_min,
    lpy_max: data.lpy_max,
    lpz: data.lpz,
    lpz_min: data.lpz_min,
    lpz_max: data.lpz_max,
  };

  const encoded = Buffer.from(encode(bezier) as any);
  const body = isFastMode() ? encoded : await zstdCompress(encoded);
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  printDone(
    `/graph-bezier.bin 完成 · ${data.ls.length} 边 · ${(body.length / 1024 / 1024).toFixed(1)}MB · 耗时 ${elapsed}s`,
  );
  return new Response(body as BodyInit, {
    headers: { "Content-Type": "application/octet-stream" },
  });
}
