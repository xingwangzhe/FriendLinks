import { loadSites } from "../utils/sites";
import { printProgress, printDone } from "../utils/progress";
import { bfsMergedHistogram } from "@xingwangzhe/bfs-rs";

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
  const validSites = await loadSites(undefined, (i, total) => {
    const pct = Math.round((i / total) * 100);
    printProgress("❶", `${i}/${total} 站点已加载`, pct);
  });
  printDone(`${validSites.length} 站点加载完成`);

  const siteHostSet = new Set<string>();
  for (const s of validSites) siteHostSet.add(getHost(s.url));

  const linkMap = new Map<string, Set<string>>();
  for (const s of validSites) linkMap.set(getHost(s.url), new Set());

  let externalFriendsCount = 0;
  let totalFriendReferences = 0;
  for (const s of validSites) {
    const sourceNorm = getHost(s.url);
    totalFriendReferences += s.friends.length;
    for (const f of s.friends) {
      const targetHost = getHost(f.url);
      if (siteHostSet.has(targetHost)) linkMap.get(sourceNorm)!.add(targetHost);
      else externalFriendsCount++;
    }
  }

  const externalHosts = new Set<string>();
  for (const s of validSites)
    for (const f of s.friends) {
      const h = getHost(f.url);
      if (!siteHostSet.has(h)) externalHosts.add(h);
    }

  const stats = {
    coreNodes: { count: validSites.length },
    friendNodes: { count: externalHosts.size },
    connections: {
      coreToCore: { total: 0, bidirectional: 0, unidirectional: 0 },
      coreToFriend: externalFriendsCount,
      total: 0,
    },
    overview: {
      totalNodes: validSites.length + externalHosts.size,
      totalConnections: 0,
    },
    totalFriendReferences,
  };

  printProgress("❷", "计算核心节点连接…", 0);
  const processedCoreLinks = new Set<string>();
  const linkMapEntries = [...linkMap.entries()];
  let linkProgress = 0;
  for (const [sourceHost, targetHosts] of linkMapEntries) {
    for (const targetNorm of targetHosts) {
      const pairKey = [sourceHost, targetNorm].sort().join("<->");
      if (processedCoreLinks.has(pairKey)) continue;
      processedCoreLinks.add(pairKey);
      if (sourceHost === targetNorm) continue;
      const aLinksB = linkMap.get(sourceHost)?.has(targetNorm);
      const bLinksA = linkMap.get(targetNorm)?.has(sourceHost);
      stats.connections.coreToCore.total++;
      if (aLinksB && bLinksA) stats.connections.coreToCore.bidirectional++;
      else stats.connections.coreToCore.unidirectional++;
    }
    linkProgress++;
    if (linkProgress % 500 === 0 || linkProgress === linkMapEntries.length) {
      const pct = Math.round((linkProgress / linkMapEntries.length) * 100);
      printProgress("❷", `核心连接 ${linkProgress}/${linkMapEntries.length}`, pct);
    }
  }
  stats.connections.total = stats.connections.coreToCore.total + stats.connections.coreToFriend;
  stats.overview.totalConnections = stats.connections.total;

  // 路由统计
  const linkRoutes: Record<string, number> = {};
  for (const s of validSites) if (s.links) linkRoutes[s.links] = (linkRoutes[s.links] || 0) + 1;
  const linkRoutesSorted = Object.entries(linkRoutes)
    .sort(([, a], [, b]) => b - a)
    .map(([r, c]) => ({ route: r, count: c }));
  printProgress("❷", "路由统计完成", 100);

  // ── 全节点六度分隔统计 (via @xingwangzhe/bfs-rs) ──
  printProgress("❸", "构建全节点图…", 0);

  const urlSet = new Set<string>();
  const urlToName = new Map<string, string>();
  for (const s of validSites) {
    urlSet.add(s.url);
    urlToName.set(s.url, s.name);
    for (const f of s.friends ?? []) {
      urlSet.add(f.url);
      if (!urlToName.has(f.url)) urlToName.set(f.url, f.name);
    }
  }
  const allUrls = [...urlSet];
  const n = allUrls.length;
  const urlToIdx = new Map<string, number>();
  allUrls.forEach((u, i) => urlToIdx.set(u, i));

  // 构建 CSR 邻接表
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const s of validSites) {
    const si = urlToIdx.get(s.url)!;
    for (const f of s.friends ?? []) {
      const ti = urlToIdx.get(f.url)!;
      adj[si].push(ti);
      adj[ti].push(si);
    }
  }

  // 转为压缩邻接表 (CSR) 给 bfs-rs
  const adjFlat = new Uint32Array(adj.reduce((sum, a) => sum + a.length, 0));
  const offsets = new Uint32Array(n + 1);
  let cursor = 0;
  for (let i = 0; i < n; i++) {
    offsets[i] = cursor;
    for (const v of adj[i]) {
      adjFlat[cursor++] = v;
    }
  }
  offsets[n] = cursor;

  printProgress("❸", `全量 ${n} 节点, Rust bfsMergedHistogram…`, 10);

  const startBfs = performance.now();
  const adjArr = Array.from(adjFlat);
  const offArr = Array.from(offsets);

  // Rust 侧一次调用，Mutex 合并全部直方图
  const merged = bfsMergedHistogram(adjArr, offArr, n);

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
      for (const v of adj[u]) {
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

  const mainComponentSize = Math.max(...compSizes);

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
    compSizeDistribution,
    maxEdgeDistance: merged.maxDistance,
    maxIntermediateVertices: merged.maxDistance - 1,
    edgeDistanceDistribution: degreeDist,
    intermediateVertexDistribution: intermediateDist,
    totalPairsConsidered: (n * (n - 1)) / 2,
  };

  const finalStats = { ...stats, linkRoutes: linkRoutesSorted, sixDegrees: sixDegreeStats };
  const elapsed = ((performance.now() - start) / 1000).toFixed(1);
  printDone(
    `/stats.json  ${validSites.length} 站点, ${totalFriendReferences} 友链引用, ${stats.connections.total} 连接, ${n} 节点全量BFS, 耗时 ${elapsed}s`,
  );

  return new Response(JSON.stringify(finalStats), {
    headers: { "Content-Type": "application/json" },
  });
}
