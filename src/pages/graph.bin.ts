import { loadSites } from "../utils/load-sites";
import type { GraphNode, GraphLink, GraphCategory } from "../../types/graph";
import { encode } from "msgpackr";
import { printProgress, printDone } from "../utils/progress";
import { simTick } from "@xingwangzhe/force-rs";

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
  const validSites = await loadSites(undefined, (i, total) => {
    const pct = Math.round((i / total) * 100);
    printProgress("❶", `${i}/${total} 站点已加载`, pct);
  });
  printDone(`${validSites.length} 个站点`);

  const sites = validSites;

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

  // ── 构建时 3D 力导布局（@xingwangzhe/force-rs, Barnes-Hut） ─────────
  printProgress("❷", `${nodes.length} 节点 · ${linksArr.length} 边 · 力导仿真中…`, 0);

  const n = nodes.length;
  const state = new Float64Array(n * 6 + 1);

  // d3-force golden-ratio spiral initialization
  const initialRadius = 10;
  const rollAngle = Math.PI * (3 - Math.sqrt(5));
  const yawAngle = Math.PI * 20 / (9 + Math.sqrt(221));
  for (let i = 0; i < n; i++) {
    const b = i * 6;
    const radius = initialRadius * Math.cbrt(0.5 + i);
    const roll = i * rollAngle;
    const yaw = i * yawAngle;
    state[b] = radius * Math.sin(roll) * Math.cos(yaw);
    state[b + 1] = radius * Math.cos(roll);
    state[b + 2] = radius * Math.sin(roll) * Math.sin(yaw);
  }
  state[state.length - 1] = 1.0;

  const idMap = new Map<string, number>();
  nodes.forEach((nd, i) => idMap.set(nd.id, i));
  const linkSrcTgt = new Uint32Array(linksArr.length * 2);
  let li = 0;
  for (const l of linksArr) {
    const si = idMap.get(typeof l.source === "string" ? l.source : (l as any).source);
    const ti = idMap.get(typeof l.target === "string" ? l.target : (l as any).target);
    if (si != null && ti != null) { linkSrcTgt[li++] = si; linkSrcTgt[li++] = ti; }
  }
  const linksFlat = Array.from(linkSrcTgt.slice(0, li));

  const REPULSION = 30000;
  const LINK_DISTANCE = 500;
  const CENTER_STRENGTH = 0.015;
  const forceOpts = { repulsion: REPULSION, linkDistance: LINK_DISTANCE, centerStrength: CENTER_STRENGTH, theta: 0.8, velocityDecay: 0.10, alphaDecay: 0.02 };

  const FAST = import.meta.env.DEV || !!process.env.MINIBUILD;
  const TICKS_MAX = FAST ? 100 : 500;
  const TICK_LOG = FAST ? 5 : 10;
  const TIME_LIMIT_MS = FAST ? 30000 : 14 * 60 * 1000;
  const TICK_LOG_NEAR_END_MS = 30000;

  printDone(`力导仿真就绪 · ${nodes.length} 节点 · θ=${forceOpts.theta}`);

  const t0 = performance.now();
  const alphaMin = FAST ? 0.03 : 0.001;
  let actualTicks = 0;
  let stoppedByTime = false;

  let s: number[] = Array.from(state);
  for (let i = 0; i < TICKS_MAX; i++) {
    s = simTick(s, linksFlat, n, forceOpts);
    actualTicks++;
    const elapsed = performance.now() - t0;
    const tickPct = Math.round((i / TICKS_MAX) * 100);
    if (i % TICK_LOG === 0 || elapsed > TIME_LIMIT_MS - TICK_LOG_NEAR_END_MS) {
      printProgress("❷", `tick ${i + 1}/${TICKS_MAX}  α=${s[s.length - 1].toFixed(4)}  ${n} 节点`, tickPct);
    }
    if (s[s.length - 1] < alphaMin) break;
    if (elapsed > TIME_LIMIT_MS) { stoppedByTime = true; break; }
  }
  const totalSec = ((performance.now() - t0) / 1000).toFixed(1);
  printDone(`力导仿真完成 · ${actualTicks} tick · ${totalSec}s${stoppedByTime ? " (时间上限)" : ""}`);

  for (let i = 0; i < n; i++) {
    const b = i * 6;
    (nodes[i] as any).x = s[b];
    (nodes[i] as any).y = s[b + 1];
    (nodes[i] as any).z = s[b + 2];
  }

  // ── 列式紧凑输出（含预计算 3D 位置） ─────────────────────────
  const nid: string[] = [];
  const nnm: string[] = [];
  const nur: string[] = [];
  const nfa: string[] = [];
  const nde: string[] = [];
  const nx: number[] = [];
  const ny: number[] = [];
  const nz: number[] = [];
  for (const n of nodes) {
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
