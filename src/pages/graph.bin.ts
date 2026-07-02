import { loadSites } from "../utils/load-sites";
import type { GraphNode, GraphLink, GraphCategory } from "../../types/graph";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force-3d";
import { encode } from "msgpackr";
import { printProgress, printDone, printTick } from "../utils/progress";

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

  printProgress("❶", "加载站点数据…", 0);
  const validSites = await loadSites();
  printProgress("❶", `${validSites.length} 个站点`, 100);
  printDone(`${validSites.length} 个站点加载完成`);

  // ── dev 模式快速验证：只取 500 随机节点 ───────────────────────
  let sites = validSites;
  if (import.meta.env.DEV && sites.length > 100) {
    const shuffled = [...sites].sort(() => Math.random() - 0.5);
    sites = shuffled.slice(0, 100);
    console.error(`  ⚠ DEV 模式：${validSites.length} 站点中抽样 ${sites.length} 个`);
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
  printProgress("❷", `${nodes.length} 节点 · ${linksArr.length} 边 · 构建中…`, 0);
  const simNodes = nodes.map((n) => Object.assign({}, n));
  const simLinks = linksArr.map((l) => ({
    source: typeof l.source === "string" ? l.source : (l as any).source,
    target: typeof l.target === "string" ? l.target : (l as any).target,
  }));

  // ── Vercel 适配：30k 节点每 tick ~60s，超时 20min → 最多 15 tick ──
  const REPULSION = 3000;
  const LINK_DISTANCE = 500;
  const CENTER_STRENGTH = 0.005;
  const sim = forceSimulation(simNodes as any, 3)
    .force(
      "link",
      forceLink(simLinks as any)
        .id((d: any) => d.id)
        .distance(LINK_DISTANCE),
    )
    .force("charge", forceManyBody().strength(-REPULSION).theta(0.8))
    .force("center", forceCenter(0, 0, 0).strength(CENTER_STRENGTH))
    .alphaDecay(0.12)
    .velocityDecay(0.35);

  printProgress("❷", `力导仿真就绪 · ${nodes.length} 节点 · θ=0.8 · 15 tick · 斥力${REPULSION}`, 100);
  printDone(`图构建完成 · ${nodes.length} 节点 · ${linksArr.length} 边`);

  const FAST = import.meta.env.DEV || !!process.env.MINIBUILD;
  const TICKS = FAST ? 100 : 15;
  const TICK_LOG = FAST ? 5 : 3;
  sim.alphaMin(FAST ? 0.03 : 0.005);
  const alphaMin = sim.alphaMin();
  let actualTicks = 0;
  for (let i = 0; i < TICKS; i++) {
    sim.tick();
    actualTicks++;
    if (i % TICK_LOG === 0) {
      printTick(i + 1, TICKS, sim.alpha(), nodes.length);
    }
    if (sim.alpha() < alphaMin) break;
  }
  if (actualTicks % TICK_LOG !== 1) {
    printTick(actualTicks, TICKS, sim.alpha(), nodes.length);
  }
  sim.stop();
  printDone(`力导仿真完成 · ${actualTicks} tick · α=${sim.alpha().toFixed(4)}`);

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
  printDone(`/graph.bin 完成 · ${nodes.length} 节点 · ${linksArr.length} 边 · 耗时 ${elapsed}s`);
  return new Response(encode(compact) as unknown as BodyInit, {
    headers: { "Content-Type": "application/octet-stream" },
  });
}
