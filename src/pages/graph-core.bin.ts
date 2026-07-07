import { getBuildResult } from "../utils/build-graph";
import { encode } from "msgpackr";
import { printDone } from "../utils/progress";

export async function GET() {
  const startTime = performance.now();
  const data = await getBuildResult();

  const compact = {
    nid: data.nid,
    nnm: data.nnm,
    nur: data.nur,
    nfa: data.nfa,
    nde: data.nde,
    nx: data.nx,
    ny: data.ny,
    nz: data.nz,
    ls: data.ls,
    lt: data.lt,
    c: data.categories,
    // 预计算邻接表
    ndeg: data.ndeg,
    ladj_off: data.ladj_off,
    ladj: data.ladj,
    // 不包含贝塞尔数据（分离到 graph-bezier.bin）
  };

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  printDone(`/graph-core.bin 完成 · ${data.nodes.length} 节点 · ${data.linksArr.length} 边 · 耗时 ${elapsed}s`);
  return new Response(encode(compact) as unknown as BodyInit, {
    headers: { "Content-Type": "application/octet-stream" },
  });
}
