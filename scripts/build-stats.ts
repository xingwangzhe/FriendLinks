/**
 * 独立构建 /stats.json（用于调试 BFS 加速效果）
 *
 * 用法: bun scripts/build-stats.ts
 * 输出: dist/stats.json
 */
import { resolve } from "node:path";
import { GET } from "../src/pages/stats.json";

async function main() {
  const response = await GET();
  const json = await response.json();

  const outPath = resolve(import.meta.dirname, "..", "dist", "stats.json");
  await Bun.write(outPath, JSON.stringify(json, null, 2));

  console.log(`\n✅ 写入 ${outPath}`);
  console.log(`   站点: ${json.sixDegrees.totalNodes} 节点`);
  console.log(`   主分量: ${json.sixDegrees.mainComponentSize} 节点`);
  console.log(`   最大距离: ${json.sixDegrees.maxEdgeDistance}`);
}

main();
