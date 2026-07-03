import { loadSites } from "../utils/load-sites";
import { printProgress, printDone } from "../utils/progress";
import { bfsAll } from "@xingwangzhe/bfs-rs";

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

  const siteHostSet = new Set<string>();
  for (const s of validSites) siteHostSet.add(getHost(s.url));

  const linkMap = new Map<string, Set<string>>();
  for (const s of validSites) linkMap.set(getHost(s.url), new Set());

  let externalFriendsCount = 0;
  for (const s of validSites) {
    const sourceNorm = getHost(s.url);
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
    coreNodes: { count: validSites.length, uniqueHosts: siteHostSet.size },
    friendNodes: { total: externalHosts.size, externalFriends: externalFriendsCount },
    connections: {
      coreToCore: { total: 0, bidirectional: 0, unidirectional: 0 },
      coreToFriend: externalFriendsCount,
      total: 0,
    },
    overview: { totalNodes: 0, totalConnections: 0 },
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
      if (aLinksB && bLinksA) stats.connections.coreToCore.bidirectional++;
      else stats.connections.coreToCore.unidirectional++;
    }
  }
  stats.connections.total = stats.connections.coreToCore.total + stats.connections.coreToFriend;
  stats.overview.totalConnections = stats.connections.total;
  stats.overview.totalNodes = validSites.length + externalHosts.size;

  // 路由统计
  const linkRoutes: Record<string, number> = {};
  for (const s of validSites) if (s.links) linkRoutes[s.links] = (linkRoutes[s.links] || 0) + 1;
  const linkRoutesSorted = Object.entries(linkRoutes)
    .sort(([, a], [, b]) => b - a)
    .map(([r, c]) => ({ route: r, count: c }));
  printProgress("❷", "路由统计完成", 70);

  // ── 全节点六度分隔统计 (via @xingwangzhe/bfs-rs) ──
  printProgress("❸", "构建全节点图…", 80);

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

  // 找连通分量（TS 一次遍历，O(n+m)，够快无需 Rust）
  const comp = new Int32Array(n).fill(-1);
  const compSizes: number[] = [];
  let compId = 0;
  for (let i = 0; i < n; i++) {
    if (comp[i] !== -1) continue;
    const q = [i];
    comp[i] = compId;
    let head = 0, size = 0;
    while (head < q.length) {
      const u = q[head++];
      size++;
      for (const v of adj[u]) {
        if (comp[v] === -1) { comp[v] = compId; q.push(v); }
      }
    }
    compSizes.push(size);
    compId++;
  }

  // 取最大分量
  const mainCompId = compSizes.indexOf(Math.max(...compSizes));
  const mainNodes: number[] = [];
  for (let i = 0; i < n; i++) if (comp[i] === mainCompId) mainNodes.push(i);
  const M = mainNodes.length;

  // 构建主分量子图的 CSR（仅含主分量节点）
  const mainIdxToGlobal = new Uint32Array(mainNodes);
  const mainGlobalToIdx = new Int32Array(n).fill(-1);
  for (let i = 0; i < M; i++) mainGlobalToIdx[mainNodes[i]] = i;

  let mainEdges = 0;
  for (const u of mainNodes)
    for (const v of adj[u])
      if (mainGlobalToIdx[v] !== -1) mainEdges++;
  const mainAdj = new Uint32Array(mainEdges);
  const mainOffsets = new Uint32Array(M + 1);
  let cur = 0;
  for (let i = 0; i < M; i++) {
    mainOffsets[i] = cur;
    const u = mainNodes[i];
    for (const v of adj[u]) {
      const vi = mainGlobalToIdx[v];
      if (vi !== -1) mainAdj[cur++] = vi;
    }
  }
  mainOffsets[M] = cur;

  printProgress("❸", `主分量 ${M}/${n} 节点, Rust bfsAll…`, 85);

  const startBfs = performance.now();

  // Rust bfsAll: 对主分量所有节点做全量 BFS
  const { results: mainBfsResults } = bfsAll(
    Array.from(mainAdj),
    Array.from(mainOffsets),
    M,
  );

  // 聚合距离分布
  const degreeDist: Record<number, number> = {};
  let maxDist = 0;
  for (const r of mainBfsResults) {
    for (let d = 1; d < r.distances.length; d++) {
      if (r.distances[d] > 0) {
        const dist = r.distances[d];
        degreeDist[dist] = (degreeDist[dist] || 0) + 1;
        if (dist > maxDist) maxDist = dist;
      }
    }
  }
  // 除以 2：每对 (a,b) 被双方各计数一次
  for (const d of Object.keys(degreeDist)) {
    degreeDist[Number(d)] = Math.round(degreeDist[Number(d)] / 2);
  }

  const bfsElapsed = ((performance.now() - startBfs) / 1000).toFixed(1);
  printProgress("❸", `Rust BFS 完成 in ${bfsElapsed}s`, 95);

  const intermediateDist: Record<number, number> = {};
  for (const [d, cnt] of Object.entries(degreeDist)) intermediateDist[Number(d) - 1] = cnt;

  const sixDegreeStats = {
    totalNodes: n,
    mainComponentSize: M,
    componentCount: compId,
    maxEdgeDistance: maxDist,
    maxIntermediateVertices: maxDist - 1,
    edgeDistanceDistribution: degreeDist,
    intermediateVertexDistribution: intermediateDist,
    totalPairsConsidered: (mainNodes.length * (mainNodes.length - 1)) / 2,
  };

  printProgress("❸", "六度分隔完成", 100);

  const finalStats = { ...stats, linkRoutes: linkRoutesSorted, sixDegrees: sixDegreeStats };
  const elapsed = ((performance.now() - start) / 1000).toFixed(1);
  printDone(
    `/stats.json  ${validSites.length} 站点, ${stats.connections.total} 连接, ${n} 节点全量BFS, 耗时 ${elapsed}s`,
  );

  return new Response(JSON.stringify(finalStats), {
    headers: { "Content-Type": "application/json" },
  });
}
