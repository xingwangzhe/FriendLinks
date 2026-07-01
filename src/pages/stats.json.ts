import { loadSites } from "../utils/load-sites";
import { printProgress, printDone } from "../utils/progress";

function getHost(u: string): string {
  try {
    return new URL(u).hostname.toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

export async function GET() {
  const start = performance.now();

  printProgress("❶", "加载友链数据…", 0);
  const validSites = await loadSites();
  printProgress("❶", `已加载 ${validSites.length} 个站点`, 20);

  const siteHostSet = new Set<string>();
  for (const s of validSites) {
    siteHostSet.add(getHost(s.url));
  }

  const linkMap = new Map<string, Set<string>>();
  for (const s of validSites) {
    linkMap.set(getHost(s.url), new Set());
  }

  let externalFriendsCount = 0;
  for (const s of validSites) {
    const sourceNorm = getHost(s.url);
    for (const f of s.friends) {
      const targetHost = getHost(f.url);
      if (siteHostSet.has(targetHost)) {
        linkMap.get(sourceNorm)!.add(targetHost);
      } else {
        externalFriendsCount++;
      }
    }
  }

  // 统计外部友链节点的唯一数量
  const externalHosts = new Set<string>();
  for (const s of validSites) {
    for (const f of s.friends) {
      const targetHost = getHost(f.url);
      if (!siteHostSet.has(targetHost)) {
        externalHosts.add(targetHost);
      }
    }
  }
  printProgress("❶", "链接映射构建完成", 40);

  const stats = {
    coreNodes: {
      count: validSites.length,
      uniqueHosts: siteHostSet.size,
    },
    friendNodes: {
      total: externalHosts.size,
      externalFriends: externalFriendsCount,
    },
    connections: {
      coreToCore: {
        total: 0,
        bidirectional: 0,
        unidirectional: 0,
      },
      coreToFriend: externalFriendsCount,
      total: 0,
    },
    overview: {
      totalNodes: 0,
      totalConnections: 0,
    },
  };

  printProgress("❷", "计算核心节点连接…", 50);
  const processedCoreLinks = new Set<string>();
  for (const [sourceHost, targetHosts] of linkMap) {
    for (const targetNorm of targetHosts) {
      const pairKey = [sourceHost, targetNorm].sort().join("<->");
      if (processedCoreLinks.has(pairKey)) continue;
      processedCoreLinks.add(pairKey);
      if (sourceHost === targetNorm) continue;

      const aLinksB = linkMap.get(sourceHost)?.has(targetNorm);
      const bLinksA = linkMap.get(targetNorm)?.has(sourceHost);

      stats.connections.coreToCore.total++;
      if (aLinksB && bLinksA) {
        stats.connections.coreToCore.bidirectional++;
      } else {
        stats.connections.coreToCore.unidirectional++;
      }
    }
  }

  stats.connections.total = stats.connections.coreToCore.total + stats.connections.coreToFriend;
  stats.overview.totalConnections = stats.connections.total;
  stats.overview.totalNodes = validSites.length + externalHosts.size;
  printProgress("❷", "连接统计完成", 75);

  // 统计友链页面路由分布
  const linkRoutes: Record<string, number> = {};
  for (const s of validSites) {
    if (s.links) {
      linkRoutes[s.links] = (linkRoutes[s.links] || 0) + 1;
    }
  }
  const linkRoutesSorted = Object.entries(linkRoutes)
    .sort(([, a], [, b]) => b - a)
    .map(([route, count]) => ({ route, count }));

  const statsWithRoutes = { ...stats, linkRoutes: linkRoutesSorted };
  printProgress("❷", "路由统计完成", 100);

  // ── 六度分隔统计 ──────────────────────────────────────────
  printProgress("❸", "六度分隔分析…", 85);

  let sixDegreeStats: any = null;

  // 尝试读取预计算缓存
  try {
    const cachedPath = "../../dist/six-degrees.json";
    sixDegreeStats = JSON.parse(await Bun.file(new URL(cachedPath, import.meta.url)).text());
  } catch {}

  // 缓存不存在时采样估算
  if (!sixDegreeStats) {
    const degreeDist: Record<number, number> = {};
    let maxDegreeSep = 0, totalPairs = 0;

    const coreUrls = [...linkMap.keys()];
    const coreIndex = new Map<string, number>();
    coreUrls.forEach((u, i) => coreIndex.set(u, i));
    const coreAdj: number[][] = Array.from({ length: coreUrls.length }, () => []);
    for (const [src, targets] of linkMap) {
      const si = coreIndex.get(src)!;
      for (const t of targets) {
        const ti = coreIndex.get(t);
        if (ti != null) coreAdj[si].push(ti);
      }
    }

    const sampCount = Math.min(100, coreUrls.length);
    const degSorted = coreUrls
      .map((u, i) => ({ idx: i, deg: linkMap.get(u)!.size }))
      .sort((a, b) => b.deg - a.deg)
      .slice(0, sampCount);

    for (const { idx: start } of degSorted) {
      const dist = new Int32Array(coreUrls.length).fill(-1);
      dist[start] = 0;
      const q: number[] = [start]; let head = 0;
      while (head < q.length) { const u = q[head++]; for (const v of coreAdj[u]) { if (dist[v] === -1) { dist[v] = dist[u] + 1; q.push(v); } } }
      for (let i = 0; i < dist.length; i++) {
        if (i === start || dist[i] === -1) continue;
        totalPairs++;
        const d = dist[i]; if (d > maxDegreeSep) maxDegreeSep = d;
        degreeDist[d] = (degreeDist[d] || 0) + 1;
      }
    }
    const intermediateVertices: Record<number, number> = {};
    for (const [d, cnt] of Object.entries(degreeDist)) intermediateVertices[Number(d) - 1] = cnt;

    sixDegreeStats = {
      maxEdgeDistance: maxDegreeSep,
      maxIntermediateVertices: maxDegreeSep - 1,
      distribution: degreeDist,
      intermediateVertexDistribution: intermediateVertices,
      _note: "采样估算, 完整数据: bun scripts/analyze_six_degrees.ts",
    };
  }

  const finalStats = { ...statsWithRoutes, sixDegrees: sixDegreeStats };

  const elapsed = ((performance.now() - start) / 1000).toFixed(1);
  printDone(`/stats.json  ${validSites.length} 站点，${stats.connections.total} 连接，耗时 ${elapsed}s`);

  return new Response(JSON.stringify(finalStats), {
    headers: { "Content-Type": "application/json" },
  });
}
