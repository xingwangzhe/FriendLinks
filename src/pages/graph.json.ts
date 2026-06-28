import { loadSites } from "../utils/load-sites";
import type { GraphNode, GraphLink, GraphCategory } from "../types/graph";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force-3d";

function getHost(u: string): string {
  try {
    return new URL(u).hostname.toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

function isValidUrl(u: unknown): u is string {
  if (typeof u !== "string") return false;
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const resolveFavicon = (fav: string | undefined) => {
  const localFallback = "/StreamlinePlumpColorWebFlat.svg";
  if (fav && isValidUrl(fav)) return fav;
  return localFallback;
};

export async function GET() {
  const validSites = await loadSites();

  const categories: GraphCategory[] = [{ name: "site" }, { name: "friend" }];
  const nodes: GraphNode[] = [];
  const siteHostSet = new Set<string>();

  for (const s of validSites) {
    siteHostSet.add(getHost(s.url));
  }

  const linkMap = new Map<string, Set<string>>();
  const hostToId = new Map<string, string>();

  for (const s of validSites) {
    const host = getHost(s.url) || s.url;
    const siteId = host;
    const siteIcon = resolveFavicon(s.favicon);
    nodes.push({
      id: siteId,
      name: s.name,
      url: s.url,
      favicon: siteIcon,
      desc: s.description,
    });
    linkMap.set(host, new Set());
    hostToId.set(host, siteId);
  }

  const externalFriends: Array<{
    siteId: string;
    friend: { name: string; url: string; favicon?: string };
  }> = [];

  for (const s of validSites) {
    const sourceNorm = getHost(s.url);
    for (const f of s.friends) {
      const targetHost = getHost(f.url);
      if (siteHostSet.has(targetHost)) {
        linkMap.get(sourceNorm)!.add(targetHost);
      } else {
        externalFriends.push({ siteId: sourceNorm, friend: f });
      }
    }
  }

  for (const { friend } of externalFriends) {
    const friendHost = getHost(friend.url);
    if (!hostToId.has(friendHost)) {
      const friendId = friendHost || friend.url;
      const friendIcon = resolveFavicon(friend.favicon);
      nodes.push({
        id: friendId,
        name: friend.name,
        url: friend.url,
        favicon: friendIcon,
      });
      hostToId.set(friendHost, friendId);
    }
  }

  const linksArr: GraphLink[] = [];
  const addedSiteLinks = new Set<string>();

  for (const [sourceHost, targetHosts] of linkMap) {
    for (const targetNorm of targetHosts) {
      const sourceId = hostToId.get(sourceHost)!;
      const targetId = hostToId.get(targetNorm)!;
      const pairKey = [sourceHost, targetNorm].sort().join("<->");

      if (addedSiteLinks.has(pairKey)) continue;
      addedSiteLinks.add(pairKey);

      const aLinksB = linkMap.get(sourceHost)?.has(targetNorm);
      const bLinksA = linkMap.get(targetNorm)?.has(sourceHost);

      if (aLinksB && bLinksA) {
        linksArr.push({ source: sourceId, target: targetId });
      } else if (aLinksB) {
        linksArr.push({
          source: sourceId,
          target: targetId,
          symbol: ["none", "arrow"],
        });
      } else if (bLinksA) {
        linksArr.push({
          source: targetId,
          target: sourceId,
          symbol: ["none", "arrow"],
        });
      }
    }
  }

  for (const { siteId, friend } of externalFriends) {
    const friendHost = getHost(friend.url);
    const friendId = hostToId.get(friendHost)!;
    linksArr.push({
      source: siteId,
      target: friendId,
      symbol: ["none", "arrow"],
    });
  }

  // ── 构建时 3D 力导布局 ────────────────────────────────────────
  // 为每个节点生成初始随机位置
  // eslint-disable-next-line oxc/no-map-spread
  const simNodes = nodes.map((n, i) => ({
    ...n,
    // 球面初始分布，避免全从原点开始
    x: Math.sin(i) * 200,
    y: Math.cos(i * 1.3) * 200,
    z: Math.sin(i * 0.7) * 200,
  }));

  const simLinks = linksArr.map((l) => ({
    source: typeof l.source === "string" ? l.source : (l as any).source,
    target: typeof l.target === "string" ? l.target : (l as any).target,
  }));

  // 运行 3D 力导仿真（充分收敛，避免客户端再跑）
  const simulation = forceSimulation(simNodes as any)
    .force(
      "link",
      forceLink(simLinks as any)
        .id((d: any) => d.id)
        .distance(40),
    )
    .force("charge", forceManyBody().strength(-60))
    .force("center", forceCenter(0, 0, 0))
    .alphaDecay(0.005)
    .velocityDecay(0.4);

  // 跑足够多的 ticks 让布局完全收敛
  for (let i = 0; i < 2000; i++) {
    simulation.tick();
  }
  simulation.stop();

  // 提取计算后的位置 → 列式紧凑格式（减少 JSON 体积 ~50%）
  const nid: string[] = [];
  const nnm: string[] = [];
  const nur: string[] = [];
  const nfa: string[] = [];
  const nde: string[] = [];
  const nx: number[] = [];
  const ny: number[] = [];
  const nz: number[] = [];

  for (const n of simNodes) {
    nid.push(n.id);
    nnm.push(n.name);
    nur.push(n.url);
    nfa.push(n.favicon);
    nde.push(n.desc ?? "");
    nx.push(n.x);
    ny.push(n.y);
    nz.push(n.z);
  }

  // 连接用索引而非字符串 ID
  const idIndex = new Map<string, number>();
  nid.forEach((id, i) => idIndex.set(id, i));

  const ls: number[] = [];
  const lt: number[] = [];
  for (const l of linksArr) {
    const si = idIndex.get(l.source);
    const ti = idIndex.get(l.target);
    if (si != null && ti != null) {
      ls.push(si);
      lt.push(ti);
    }
  }

  const compact = {
    nid,
    nnm,
    nur,
    nfa,
    nde,
    nx,
    ny,
    nz,
    ls,
    lt,
    c: categories,
  };

  return new Response(JSON.stringify(compact), {
    headers: { "Content-Type": "application/json" },
  });
}
