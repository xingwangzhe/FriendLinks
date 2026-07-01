import { loadSites } from "../utils/load-sites";
import type { GraphNode, GraphLink, GraphCategory } from "../../types/graph";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force-3d";
import { encode } from "msgpackr";
import { printProgress, printDone } from "../utils/progress";

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
  const startTime = performance.now();

  printProgress("❶", "加载友链数据…", 0);
  const validSites = await loadSites();
  printProgress("❶", `已加载 ${validSites.length} 个站点`, 100);
  printDone("站点加载完成");

  // ── dev 模式快速验证：只取 500 随机节点 ───────────────────────
  let sites = validSites;
  if (import.meta.env.DEV && sites.length > 100) {
    const shuffled = [...sites].sort(() => Math.random() - 0.5);
    sites = shuffled.slice(0, 100);
    console.error(`  ⚠ DEV 模式：从 ${validSites.length} 个站点中随机抽取 ${sites.length} 个快速验证`);
  }

  const categories: GraphCategory[] = [{ name: "site" }, { name: "friend" }];
  const nodes: GraphNode[] = [];
  const siteHostSet = new Set<string>();

  for (const s of sites) {
    siteHostSet.add(getHost(s.url));
  }

  const linkMap = new Map<string, Set<string>>();
  const hostToId = new Map<string, string>();

  for (const s of sites) {
    const host = getHost(s.url) || s.url;
    const siteId = host;
    const siteIcon = resolveFavicon(s.favicon);
    nodes.push({
      id: siteId,
      name: s.name,
      url: s.url,
      favicon: siteIcon,
      desc: s.description,
      ...(s.color ? { color: s.color } : {}),
    });
    linkMap.set(host, new Set());
    hostToId.set(host, siteId);
  }

  const externalFriends: Array<{
    siteId: string;
    friend: { name: string; url: string; favicon?: string };
  }> = [];

  for (const s of sites) {
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

  // ── 构建时 3D 力导布局（d3-force-3d） ─────────────────────────
  printProgress("❷", `构建图… ${nodes.length} 节点, ${linksArr.length} 边`, 0);
  const simNodes = nodes.map((n) => Object.assign({}, n));
  const simLinks = linksArr.map((l) => ({
    source: typeof l.source === "string" ? l.source : (l as any).source,
    target: typeof l.target === "string" ? l.target : (l as any).target,
  }));

  // 三轴等强微弱居中，保持 3D 散布
  const sim = forceSimulation(simNodes as any, 3)
    .force(
      "link",
      forceLink(simLinks as any)
        .id((d: any) => d.id)
        .distance(350),
    )
    .force("charge", forceManyBody().strength(-800).theta(1.5))
    .force("center", forceCenter(0, 0, 0).strength(0.005))
    .alphaDecay(0.04)
    .velocityDecay(0.5);

  printProgress("❷", "图构建完成", 100);
  printDone("图构建完成");

  const FAST = import.meta.env.DEV || !!process.env.MINIBUILD;
  const TICKS = FAST ? 40 : 100;
  const TICK_LOG = FAST ? 8 : 10;
  sim.alphaMin(FAST ? 0.08 : 0.05);
  const alphaMin = sim.alphaMin();
  let actualTicks = 0;
  for (let i = 0; i < TICKS; i++) {
    sim.tick();
    actualTicks++;
    // alpha 降至阈值以下 → 系统已收敛，提前结束
    if (sim.alpha() < alphaMin) break;
    if (i % TICK_LOG === 0) {
      const pct = Math.round(((i + 1) / TICKS) * 100);
      printProgress("❸", `力导仿真 ${i + 1}/${TICKS}`, pct);
    }
  }
  sim.stop();
  printDone(`力导仿真完成（${actualTicks} tick）`);

  // ── 列式紧凑输出（含预计算 3D 位置） ─────────────────────────
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
    nnm.push(n.name ?? "");
    nur.push(n.url);
    nfa.push(n.favicon ?? "");
    nde.push(n.desc ?? "");
    nx.push(n.x ?? 0);
    ny.push(n.y ?? 0);
    nz.push(n.z ?? 0);
  }

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

  const compact = { nid, nnm, nur, nfa, nde, nx, ny, nz, ls, lt, c: categories };
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  printDone(`完成，耗时 ${elapsed}s`);
  return new Response(encode(compact) as unknown as BodyInit, {
    headers: { "Content-Type": "application/octet-stream" },
  });
}
