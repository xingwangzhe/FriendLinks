import { loadSites } from "../utils/sites";
import { printProgress, printDone } from "../utils/progress";

export async function GET() {
  const start = performance.now();

  printProgress("❶", "加载友链数据…", 0);
  const sites = await loadSites(undefined, (i, total) => {
    const pct = Math.round((i / total) * 100);
    printProgress("❶", `${i}/${total} 站点已加载`, pct);
  });

  const elapsed = ((performance.now() - start) / 1000).toFixed(1);
  printDone(`/all.json  ${sites.length} 站点，耗时 ${elapsed}s`);

  return new Response(JSON.stringify(sites), {
    headers: { "Content-Type": "application/json" },
  });
}
