import { loadSites } from "../utils/sites";
import { printProgress, printDone } from "../utils/progress";
import { createBfsGraph } from "@xingwangzhe/bfs-rs";
import { buildTopology } from "../utils/graph-topology";
import { summarizeTopology } from "../utils/graph-statistics";
import type { StatsData } from "../../types/stats";
import { getCollectionInfo } from "../utils/site-identity";
import {
  artifactKey,
  buildArtifacts,
  buildCacheEnabled,
  implementationFingerprint,
  snapshotArtifactKey,
} from "../utils/build-artifact-cache";

export async function GET() {
  const start = performance.now();
  printProgress("❶", "加载友链数据…", 0);
  const validSites = await loadSites(undefined, (i, total) => {
    const pct = Math.round((i / total) * 100);
    printProgress("❶", `${i}/${total} 站点已加载`, pct);
  });
  printDone(`${validSites.length} 站点加载完成`);

  const implementation = buildCacheEnabled()
    ? await implementationFingerprint(
        [
          "src/pages/stats.json.ts",
          "src/utils/graph-statistics.ts",
          "src/utils/graph-topology.ts",
          "src/utils/site-identity.ts",
          "src/utils/build-artifact-cache.ts",
        ],
        ["@xingwangzhe/bfs-rs"],
      )
    : null;
  const cacheKey = implementation
    ? artifactKey({
        schema: 2,
        sites: snapshotArtifactKey(validSites),
        sourceCounts: getCollectionInfo(validSites).counts,
        implementation,
      })
    : null;
  if (cacheKey) {
    const cached = await buildArtifacts.read<StatsData>("stats", cacheKey);
    if (cached) {
      console.log(`[cache] stats hit: ${cached.overview.totalNodes} nodes (verified exact histogram)`);
      return new Response(JSON.stringify(cached), { headers: { "Content-Type": "application/json" } });
    }
    console.log("[cache] stats miss: computing exact all-source BFS");
  }
  const stats = summarizeTopology(validSites);
  const { totalFriendReferences } = stats;
  const topology = buildTopology(validSites);
  const n = topology.nodes.length;
  const adjFlat = new Uint32Array(topology.csrAdj);
  const offsets = new Uint32Array(topology.csrOffsets);

  printProgress("❸", `全量 ${n} 节点, Rust bfsMergedHistogram…`, 10);

  const startBfs = performance.now();
  // Rust 侧一次调用，使用 prepared graph 避免 typed array → JS Array 转换
  const merged = createBfsGraph(adjFlat, offsets, n).mergedHistogram();

  const degreeDist: Record<number, number> = {};
  for (let d = 0; d < merged.histogram.length; d++) {
    degreeDist[d + 1] = Math.round(merged.histogram[d] / 2);
  }

  const bfsElapsed = ((performance.now() - startBfs) / 1000).toFixed(1);
  printProgress("❸", `Rust BFS 完成 in ${bfsElapsed}s`, 30);

  // 连通分量统计
  const comp = new Int32Array(n).fill(-1);
  const compSizes: number[] = [];
  let compId = 0;
  for (let i = 0; i < n; i++) {
    if (comp[i] !== -1) continue;
    const q = [i];
    comp[i] = compId;
    let head = 0,
      size = 0;
    while (head < q.length) {
      const u = q[head++];
      size++;
      for (let edge = offsets[u]; edge < offsets[u + 1]; edge++) {
        const v = adjFlat[edge];
        if (comp[v] === -1) {
          comp[v] = compId;
          q.push(v);
        }
      }
    }
    compSizes.push(size);
    compId++;
    if (compId % 200 === 0) {
      printProgress("❸", `连通分量分析 ${compId} 个`, 30 + Math.round((compId / n) * 70));
    }
  }

  const mainComponentSize = compSizes.length ? Math.max(...compSizes) : 0;
  const isolatedCount = compSizes.filter((s) => s === 1).length;

  // 从 BFS 直方图计算平均最短路径
  let totalOrderedDist = 0;
  let totalOrderedPairs = 0;
  for (let d = 0; d < merged.histogram.length; d++) {
    const cnt = merged.histogram[d];
    if (cnt > 0) {
      totalOrderedDist += (d + 1) * cnt;
      totalOrderedPairs += cnt;
    }
  }
  const avgPathLength =
    totalOrderedPairs > 0 ? Math.round((totalOrderedDist / 2 / (totalOrderedPairs / 2)) * 100) / 100 : 0;

  // 分量大小分布（分桶）
  const sizeBuckets = [
    { label: "1 (孤立)", min: 1, max: 1 },
    { label: "2-5", min: 2, max: 5 },
    { label: "6-20", min: 6, max: 20 },
    { label: "21-100", min: 21, max: 100 },
    { label: "101-1000", min: 101, max: 1000 },
    { label: "1000+", min: 1001, max: Infinity },
  ];
  const compSizeDistribution: Array<{ label: string; count: number }> = [];
  for (const b of sizeBuckets) {
    const cnt = compSizes.filter((s) => s >= b.min && s <= b.max).length;
    if (cnt > 0) compSizeDistribution.push({ label: b.label, count: cnt });
  }

  const intermediateDist: Record<number, number> = {};
  for (const [d, cnt] of Object.entries(degreeDist)) intermediateDist[Number(d) - 1] = cnt;

  const sixDegreeStats = {
    totalNodes: n,
    mainComponentSize: mainComponentSize,
    componentCount: compId,
    isolatedCount,
    compSizeDistribution,
    maxEdgeDistance: merged.maxDistance,
    maxIntermediateVertices: Math.max(0, merged.maxDistance - 1),
    avgPathLength,
    edgeDistanceDistribution: degreeDist,
    intermediateVertexDistribution: intermediateDist,
    totalPairsConsidered: (n * (n - 1)) / 2,
  };

  const finalStats: StatsData = {
    ...stats,
    sixDegrees: sixDegreeStats,
  };
  const elapsed = ((performance.now() - start) / 1000).toFixed(1);
  printDone(
    `/stats.json  ${validSites.length} 站点, ${totalFriendReferences} 友链引用, ${stats.connections.total} 连接, ${n} 节点全量BFS, 耗时 ${elapsed}s`,
  );

  if (cacheKey) await buildArtifacts.write("stats", cacheKey, finalStats);
  return new Response(JSON.stringify(finalStats), {
    headers: { "Content-Type": "application/json" },
  });
}
