/**
 * 六度分隔分析工具
 * 加载友链 YAML，构建邻接图，通过 bfs-rs (Rust) 精确计算全图最短路径。
 *
 * 用法：
 *   bun run tools/six-degrees.ts                    # 打印统计
 *   bun run tools/six-degrees.ts path A B           # 查找 A→B 最短路径
 *   bun run tools/six-degrees.ts neighbors A        # 列出 A 的邻居
 *   bun run tools/six-degrees.ts dist A             # A 的距离分布
 *
 * 被其他脚本 import：
 *   import { buildGraph, findPath, getStats } from "../tools/six-degrees";
 */

import path from "node:path";
import { loadSites } from "../src/utils/load-sites";
import { createBfsGraph, type BfsGraph } from "@xingwangzhe/bfs-rs";
import type { Site } from "../types/site";

// ═══════════════════════════════════════════════════════════════════
// 类型
// ═══════════════════════════════════════════════════════════════════

export interface GraphNode {
  id: string; // hostname
  name: string;
  url: string;
}

export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  /** 度数分布: degree → node count */
  degreeDistribution: Map<number, number>;
  maxDegree: number;
  maxDegreeNodes: GraphNode[];
  /** 连通分量数 */
  componentCount: number;
  largestComponentSize: number;
  /** 全图精确直径（最长最短路径，仅可达对） */
  diameter: number;
  /** 全图精确平均最短路径（仅可达对） */
  averagePathLength: number;
  /** 孤立节点数（度数为 0） */
  isolatedCount: number;
  /** 距离分布: distance → pair count（可达对） */
  distanceDistribution: Map<number, number>;
  /** 总可达对数量 */
  reachablePairs: number;
  /** 连通分量大小分布（分桶） */
  compSizeDistribution: Array<{ label: string; count: number }>;
}

export interface NeighborMap {
  adjacency: Map<string, Set<string>>;
  nodeMap: Map<string, GraphNode>;
  /** hostname → index (for CSR conversion) */
  nodeIndex: Map<string, number>;
  nodes: GraphNode[];
  /** CSR 格式邻接数组（全图） */
  csrAdj: number[];
  csrOffsets: number[];
  /** 预处理后的 Rust BFS 图句柄 */
  bfsGraph: BfsGraph;
  /** 连通分量：每个节点属于哪个分量（hostname → componentIndex） */
  componentOf: Map<string, number>;
  /** 连通分量列表 */
  components: string[][];
}

// ═══════════════════════════════════════════════════════════════════
// 核心函数
// ═══════════════════════════════════════════════════════════════════

function getHost(u: string): string {
  try {
    return new URL(u).hostname.toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

/**
 * 从站点列表构建邻接图（含 CSR 格式，可直接喂给 bfs-rs）
 */
export function buildGraph(sites: Site[]): NeighborMap {
  const adjacency = new Map<string, Set<string>>();
  const nodeMap = new Map<string, GraphNode>();
  const siteHostSet = new Set<string>();

  for (const s of sites) {
    siteHostSet.add(getHost(s.url));
  }

  for (const s of sites) {
    const host = getHost(s.url);
    nodeMap.set(host, { id: host, name: s.name, url: s.url });
    adjacency.set(host, new Set());
  }

  for (const s of sites) {
    const sourceHost = getHost(s.url);
    for (const f of s.friends) {
      const targetHost = getHost(f.url);
      if (siteHostSet.has(targetHost)) {
        adjacency.get(sourceHost)!.add(targetHost);
        adjacency.get(targetHost)!.add(sourceHost); // 无向图：反向边
      }
    }
  }

  // 构建 node → index 映射 + CSR
  const nodes = [...nodeMap.values()];
  const nodeIndex = new Map<string, number>();
  nodes.forEach((n, i) => nodeIndex.set(n.id, i));

  const { csrAdj, csrOffsets } = buildCSR(adjacency, nodeIndex);
  const bfsGraph = createBfsGraph(new Uint32Array(csrAdj), new Uint32Array(csrOffsets), nodes.length);

  // 连通分量（预计算，供路径查找和统计剪枝使用）
  const components = findComponents(adjacency);
  components.sort((a, b) => b.length - a.length);
  const componentOf = new Map<string, number>();
  for (let ci = 0; ci < components.length; ci++) {
    for (const id of components[ci]) componentOf.set(id, ci);
  }

  return { adjacency, nodeMap, nodeIndex, nodes, csrAdj, csrOffsets, bfsGraph, componentOf, components };
}

/**
 * Map<string, Set<string>> → CSR 格式
 */
function buildCSR(
  adjacency: Map<string, Set<string>>,
  nodeIndex: Map<string, number>,
): { csrAdj: number[]; csrOffsets: number[] } {
  const n = adjacency.size;
  const offsets = new Array<number>(n + 1);
  const adj: number[] = [];

  let cursor = 0;
  for (const [id, neighbors] of adjacency) {
    offsets[nodeIndex.get(id)!] = cursor;
    for (const nb of neighbors) {
      adj.push(nodeIndex.get(nb)!);
      cursor++;
    }
  }
  offsets[n] = cursor;

  return { csrAdj: adj, csrOffsets: offsets };
}

/**
 * 精确最短路径（Rust BFS，到目标即停止）
 * 剪枝：先检查连通分量，不在同一分量直接返回 null
 */
export function findPath(graph: NeighborMap, fromHost: string, toHost: string): string[] | null {
  // 剪枝：不同分量 → 无路径
  const fromComp = graph.componentOf.get(fromHost);
  const toComp = graph.componentOf.get(toHost);
  if (fromComp == null || toComp == null || fromComp !== toComp) return null;
  if (fromHost === toHost) return [fromHost];

  const fromIdx = graph.nodeIndex.get(fromHost);
  const toIdx = graph.nodeIndex.get(toHost);
  if (fromIdx == null || toIdx == null) return null;

  const result = graph.bfsGraph.path(fromIdx, toIdx);
  if (result.distance < 0) return null;

  return result.path.map((idx) => graph.nodes[idx].id);
}

/**
 * 精确全图统计（Rust 16 核并行 all-pairs BFS histogram）
 * 剪枝：先计算连通分量，仅对主分量运行 Rust BFS；小分量跳过。
 */
export function getStats(graph: NeighborMap): GraphStats {
  const { adjacency, nodeMap, components } = graph;

  // 度数分布 (JS 足够)
  const degreeDistribution = new Map<number, number>();
  let maxDegree = 0;
  let isolatedCount = 0;
  for (const [, nbrs] of adjacency) {
    const deg = nbrs.size;
    degreeDistribution.set(deg, (degreeDistribution.get(deg) || 0) + 1);
    if (deg > maxDegree) maxDegree = deg;
    if (deg === 0) isolatedCount++;
  }

  const maxDegreeNodes: GraphNode[] = [];
  for (const [id, nbrs] of adjacency) {
    if (nbrs.size === maxDegree) {
      const node = nodeMap.get(id);
      if (node) maxDegreeNodes.push(node);
    }
  }

  let edgeCount = 0;
  for (const [, nbrs] of adjacency) edgeCount += nbrs.size;
  edgeCount = Math.floor(edgeCount / 2);

  // 距离分布（合并所有分量）
  const distanceDistribution = new Map<number, number>();
  let maxDiameter = 0;
  let totalOrderedPairs = 0;
  let totalOrderedDistance = 0;

  // 剪枝：仅对大型分量（≥100 节点）运行 Rust BFS
  const BIG_THRESHOLD = 100;

  for (const comp of components) {
    if (comp.length < 2) continue; // 孤立节点无可达对

    if (comp.length >= BIG_THRESHOLD) {
      // 构建该分量的子图 CSR，喂给 Rust BFS
      const { csrAdj, csrOffsets } = buildComponentCSR(adjacency, nodeMap, comp);
      const merged = createBfsGraph(
        new Uint32Array(csrAdj),
        new Uint32Array(csrOffsets),
        comp.length,
      ).mergedHistogram();

      if (merged.maxDistance > maxDiameter) maxDiameter = merged.maxDistance;

      for (let d = 0; d < merged.histogram.length; d++) {
        const count = merged.histogram[d]; // ordered pair count
        if (count > 0) {
          const prev = distanceDistribution.get(d + 1) || 0;
          distanceDistribution.set(d + 1, prev + count);
          totalOrderedDistance += (d + 1) * count;
          totalOrderedPairs += count;
        }
      }
    } else {
      // 小型分量：JS 精确计算（分量内全对 BFS）
      const compSet = new Set(comp);
      const subNeighborMap = new Map<string, Set<string>>();
      for (const id of comp) {
        subNeighborMap.set(id, new Set());
        for (const nb of adjacency.get(id) || []) {
          if (compSet.has(nb)) subNeighborMap.get(id)!.add(nb);
        }
      }

      let compMaxDist = 0;
      for (const id of comp) {
        const dist = bfsDistances(subNeighborMap, id);
        for (const [other, d] of dist) {
          if (other === id) continue;
          if (d > compMaxDist) compMaxDist = d;
          const prev = distanceDistribution.get(d) || 0;
          distanceDistribution.set(d, prev + 1);
          totalOrderedDistance += d;
          totalOrderedPairs += 1;
        }
      }

      if (compMaxDist > maxDiameter) maxDiameter = compMaxDist;
    }
  }

  const reachablePairs = Math.floor(totalOrderedPairs / 2);
  const averagePathLength = reachablePairs > 0 ? totalOrderedDistance / 2 / reachablePairs : 0;

  // 转为 unordered pair 分布（用于返回）
  const unorderedDist = new Map<number, number>();
  for (const [d, count] of distanceDistribution) {
    unorderedDist.set(d, Math.floor(count / 2));
  }

  // 分量大小分布
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
    const cnt = components.filter((c) => c.length >= b.min && c.length <= b.max).length;
    if (cnt > 0) compSizeDistribution.push({ label: b.label, count: cnt });
  }

  return {
    nodeCount: adjacency.size,
    edgeCount,
    degreeDistribution,
    maxDegree,
    maxDegreeNodes,
    componentCount: components.length,
    largestComponentSize: components[0]?.length ?? 0,
    diameter: maxDiameter,
    averagePathLength,
    isolatedCount,
    distanceDistribution: unorderedDist,
    reachablePairs,
    compSizeDistribution,
  };
}

/**
 * 为连通分量构建子图 CSR（仅含分量内节点）
 */
function buildComponentCSR(
  adjacency: Map<string, Set<string>>,
  nodeMap: Map<string, GraphNode>,
  component: string[],
): { csrAdj: number[]; csrOffsets: number[] } {
  const localIdx = new Map<string, number>();
  component.forEach((id, i) => localIdx.set(id, i));

  const n = component.length;
  const offsets = new Array<number>(n + 1);
  const adj: number[] = [];

  let cursor = 0;
  for (const id of component) {
    offsets[localIdx.get(id)!] = cursor;
    for (const nb of adjacency.get(id) || []) {
      const li = localIdx.get(nb);
      if (li != null) {
        adj.push(li);
        cursor++;
      }
    }
  }
  offsets[n] = cursor;

  return { csrAdj: adj, csrOffsets: offsets };
}

/**
 * BFS 距离图（到所有可达节点的距离）—— 仅用于小型分量
 */
function bfsDistances(adjacency: Map<string, Set<string>>, start: string): Map<string, number> {
  const dist = new Map<string, number>();
  const queue: string[] = [start];
  dist.set(start, 0);
  while (queue.length > 0) {
    const current = queue.shift()!;
    const d = dist.get(current)!;
    for (const nb of adjacency.get(current) || []) {
      if (!dist.has(nb)) {
        dist.set(nb, d + 1);
        queue.push(nb);
      }
    }
  }
  return dist;
}

/**
 * 单节点距离分布（剪枝：仅在同分量内可达）
 */
export function getDistanceDistribution(
  graph: NeighborMap,
  host: string,
): {
  histogram: number[];
  maxDistance: number;
} | null {
  const idx = graph.nodeIndex.get(host);
  if (idx == null) return null;
  return graph.bfsGraph.oneHistogram(idx);
}

/**
 * 找出连通分量
 */
export function findComponents(adjacency: Map<string, Set<string>>): string[][] {
  const visited = new Set<string>();
  const components: string[][] = [];

  for (const id of adjacency.keys()) {
    if (visited.has(id)) continue;
    const comp: string[] = [];
    const queue = [id];
    visited.add(id);
    while (queue.length > 0) {
      const current = queue.shift()!;
      comp.push(current);
      for (const nb of adjacency.get(current) || []) {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }
    components.push(comp);
  }
  return components;
}

/**
 * 计算每个节点的度数
 */
export function computeDegrees(adjacency: Map<string, Set<string>>): Map<string, number> {
  const degrees = new Map<string, number>();
  for (const [id, neighbors] of adjacency) {
    degrees.set(id, neighbors.size);
  }
  return degrees;
}

// ═══════════════════════════════════════════════════════════════════
// 格式化
// ═══════════════════════════════════════════════════════════════════

function formatStats(stats: GraphStats): string {
  const lines: string[] = [];
  lines.push(`节点数：${stats.nodeCount}`);
  lines.push(`边数（无向）：${stats.edgeCount}`);
  lines.push(`孤立节点：${stats.isolatedCount}`);
  lines.push(`最大度数：${stats.maxDegree}`);
  const topNames = stats.maxDegreeNodes
    .slice(0, 5)
    .map((n) => `${n.name}(${n.id})`)
    .join("、");
  lines.push(`最大度节点：${topNames}`);
  lines.push(`连通分量数：${stats.componentCount}`);
  lines.push(`最大连通分量：${stats.largestComponentSize} 节点`);
  lines.push(`\n全图直径（最远两点距离）：${stats.diameter} 步`);
  lines.push(`精确平均最短路径（全图可达对）：${stats.averagePathLength.toFixed(2)} 步`);
  lines.push(`总可达对：${stats.reachablePairs.toLocaleString()}`);

  // 度数分布 Top 10
  const degSorted = [...stats.degreeDistribution.entries()].sort((a, b) => b[0] - a[0]);
  lines.push(`\n度数分布 (Top 10)：`);
  for (const [deg, count] of degSorted.slice(0, 10)) {
    lines.push(`  deg=${deg}: ${count} 节点`);
  }

  // 距离分布
  const distSorted = [...stats.distanceDistribution.entries()].sort((a, b) => a[0] - b[0]);
  lines.push(`\n距离分布（全图可达对）：`);
  for (const [dist, count] of distSorted) {
    const pct = stats.reachablePairs > 0 ? ((count / stats.reachablePairs) * 100).toFixed(1) : "0.0";
    lines.push(`  ${dist} 步: ${count.toLocaleString()} 对 (${pct}%)`);
  }

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  console.log("加载友链数据…");
  const sites = await loadSites(path.resolve("links"));
  console.log(`已加载 ${sites.length} 个站点`);

  const graph = buildGraph(sites);

  if (cmd === "path") {
    const [from, to] = [args[1], args[2]];
    if (!from || !to) {
      console.error("用法: bun run tools/six-degrees.ts path <hostnameA> <hostnameB>");
      process.exit(1);
    }
    const route = findPath(graph, from, to);
    if (route) {
      console.log(`\n${from} → ${to}: ${route.length - 1} 步`);
      for (const id of route) {
        const node = graph.nodeMap.get(id);
        console.log(`  ${node?.name || id}  (${id})`);
      }
    } else {
      console.log(`\n${from} 和 ${to} 之间没有路径`);
    }
  } else if (cmd === "neighbors") {
    const host = args[1];
    if (!host) {
      console.error("用法: bun run tools/six-degrees.ts neighbors <hostname>");
      process.exit(1);
    }
    const nbrs = graph.adjacency.get(host);
    if (!nbrs) {
      console.log(`未找到节点: ${host}`);
    } else {
      console.log(`\n${host} 的邻居 (${nbrs.size} 个)：`);
      for (const nb of nbrs) {
        const node = graph.nodeMap.get(nb);
        console.log(`  ${node?.name || nb}  (${nb})`);
      }
    }
  } else if (cmd === "dist") {
    const host = args[1];
    if (!host) {
      console.error("用法: bun run tools/six-degrees.ts dist <hostname>");
      process.exit(1);
    }
    const result = getDistanceDistribution(graph, host);
    if (!result) {
      console.log(`未找到节点: ${host}`);
    } else {
      console.log(`\n${host} 的距离分布 (max=${result.maxDistance})：`);
      for (let d = 0; d < result.histogram.length; d++) {
        if (result.histogram[d] > 0) {
          console.log(`  ${d + 1} 步: ${result.histogram[d]} 个节点`);
        }
      }
    }
  } else {
    console.log("精确计算全图最短路径（Rust 16核并行）…");
    const t0 = performance.now();
    const stats = getStats(graph);
    const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
    console.log(`\n${formatStats(stats)}`);
    console.log(`\n计算耗时: ${elapsed}s`);
  }
}

// 仅在直接运行时执行 CLI，被 import 时跳过
const isMain = process.argv[1]?.includes("/tools/six-degrees.ts");
if (isMain) {
  main().catch(console.error);
}
