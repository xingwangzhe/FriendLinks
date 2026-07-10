/**
 * 图数据构建（共享模块，带模块级缓存）
 * 多个端点（graph-core, graph-bezier）复用同一次力导仿真结果
 */
import type { Site } from "../../types/site";
import type { GraphNode, GraphLink, GraphCategory } from "../../types/graph";
import { printProgress, printDone } from "./progress";
import { simTick } from "@xingwangzhe/force-rs";
import { isFastMode } from "./sample";
import { bezier2, calcControlOffset, calcSegmentCount } from "./bezier";

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

export interface BuildResult {
  nodes: GraphNode[];
  linksArr: GraphLink[];
  categories: GraphCategory[];
  nid: string[];
  nnm: string[];
  nur: string[];
  nfa: string[];
  nde: string[];
  nx: number[];
  ny: number[];
  nz: number[];
  ls: number[];
  lt: number[];
  /** 有向标记，1=单向，0=双向（缺失时默认双向） */
  lsym: number[];
  /** 预计算度数 + 邻接表（flat 数组） */
  ndeg: number[];
  ladj_off: number[];
  ladj: number[];
  /** 预计算贝塞尔连线位置（Int16 量化） */
  lseg: number[];
  lpx: Int16Array;
  lpx_min: number;
  lpx_max: number;
  lpy: Int16Array;
  lpy_min: number;
  lpy_max: number;
  lpz: Int16Array;
  lpz_min: number;
  lpz_max: number;
}

async function buildGraph(sites: Site[]): Promise<BuildResult> {
  const startTime = performance.now();
  const _funcStart = startTime;
  const _log = (label: string) =>
    console.log(`  [timing]  ${label}: ${((performance.now() - _funcStart) / 1000).toFixed(1)}s`);

  printProgress("❶", `构建图数据 (${sites.length} 个站点)…`, 0);
  const validSites = sites;
  const categories: GraphCategory[] = [{ name: "site" }, { name: "friend" }];
  const nodes: GraphNode[] = [];
  const siteHostSet = new Set<string>();

  for (const s of sites) {
    siteHostSet.add(getHost(s.url));
  }

  // linkMap: 用 site URL（唯一）做 key，value 是该站点 friend 的 hostname 集合
  const linkMap = new Map<string, Set<string>>();
  // hostToId: hostname → 第一个匹配站点的 URL（hostname 级查找用）
  const hostToId = new Map<string, string>();
  // siteUrlMap: 标准化 URL → site URL（精确匹配用，优先于 hostname）
  const siteUrlMap = new Map<string, string>();

  for (const s of sites) {
    const host = getHost(s.url) || s.url;
    const siteId = s.url;
    const siteIcon = resolveFavicon(s.favicon);
    nodes.push({
      id: siteId,
      name: s.name,
      url: s.url,
      favicon: siteIcon,
      desc: s.description,
      ...(s.color ? { color: s.color } : {}),
    });
    linkMap.set(siteId, new Set());
    if (!hostToId.has(host)) {
      hostToId.set(host, siteId);
    }
    // 标准化 URL（去尾斜杠）作为精确匹配键
    siteUrlMap.set(siteId.replace(/\/+$/, ""), siteId);
  }
  _log("构建核心节点+linkMap");

  const externalFriends: Array<{
    siteId: string;
    friend: { name: string; url: string; favicon?: string };
  }> = [];

  for (const s of sites) {
    const sourceId = s.url;
    for (const f of s.friends) {
      const targetHost = getHost(f.url);
      // 优先精确 URL 匹配，再降级到 hostname 匹配
      const exactTarget = siteUrlMap.get(f.url.replace(/\/+$/, ""));
      if (exactTarget) {
        linkMap.get(sourceId)!.add(getHost(exactTarget));
      } else if (siteHostSet.has(targetHost)) {
        linkMap.get(sourceId)!.add(targetHost);
      } else {
        externalFriends.push({ siteId: sourceId, friend: f });
      }
    }
  }
  _log("处理友链关系");

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
  _log("创建外部友链节点");

  const linksArr: GraphLink[] = [];
  const addedSiteLinks = new Set<string>();

  // 预计算 hostname → URLs 反查表，避免内层循环 O(n) 扫描
  const hostToUrls = new Map<string, string[]>();
  for (const [url, hosts] of linkMap) {
    const h = getHost(url);
    if (!hostToUrls.has(h)) hostToUrls.set(h, []);
    hostToUrls.get(h)!.push(url);
  }

  for (const [sourceId, targetHosts] of linkMap) {
    for (const targetNorm of targetHosts) {
      const targetId = hostToId.get(targetNorm)!;
      const sourceHost = getHost(sourceId);
      const pairKey = [sourceHost, targetNorm].sort().join("<->");

      if (addedSiteLinks.has(pairKey)) continue;
      addedSiteLinks.add(pairKey);

      const aLinksB = linkMap.get(sourceId)?.has(targetNorm);
      // 利用反查表 O(1) 判断另一站点是否也指向此站点
      const bLinksA = (hostToUrls.get(targetNorm) ?? []).some(
        (otherUrl) => otherUrl !== sourceId && linkMap.get(otherUrl)?.has(sourceHost),
      );

      if (aLinksB && bLinksA) {
        linksArr.push({ source: sourceId, target: targetId });
      } else if (aLinksB) {
        linksArr.push({ source: sourceId, target: targetId, symbol: ["none", "arrow"] });
      } else if (bLinksA) {
        linksArr.push({ source: targetId, target: sourceId, symbol: ["none", "arrow"] });
      }
    }
  }

  for (const { siteId, friend } of externalFriends) {
    const friendHost = getHost(friend.url);
    const friendId = hostToId.get(friendHost)!;
    linksArr.push({ source: siteId, target: friendId, symbol: ["none", "arrow"] });
  }
  _log("构建 linksArr");

  // ── 构建时 3D 力导布局 ──
  printProgress("❷", `${nodes.length} 节点 · ${linksArr.length} 边 · 力导仿真中…`, 0);

  const n = nodes.length;
  const state = new Float64Array(n * 6 + 1);

  const initialRadius = 10;
  const rollAngle = Math.PI * (3 - Math.sqrt(5));
  const yawAngle = (Math.PI * 20) / (9 + Math.sqrt(221));
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
    if (si != null && ti != null) {
      linkSrcTgt[li++] = si;
      linkSrcTgt[li++] = ti;
    }
  }
  const linksFlat = Array.from(linkSrcTgt.slice(0, li));

  const REPULSION = 30000;
  const LINK_DISTANCE = 500;
  const CENTER_STRENGTH = 0.015;
  const forceOpts = {
    repulsion: REPULSION,
    linkDistance: LINK_DISTANCE,
    centerStrength: CENTER_STRENGTH,
    theta: 0.8,
    velocityDecay: 0.1,
    alphaDecay: 0.02,
  };

  const FAST = isFastMode();
  const TICKS_MAX = FAST ? 100 : 500;
  const TICK_LOG = FAST ? 5 : 10;
  const TIME_LIMIT_MS = FAST ? 30000 : 14 * 60 * 1000;
  const TICK_LOG_NEAR_END_MS = 30000;

  printDone(`力导仿真就绪 · ${nodes.length} 节点 · θ=${forceOpts.theta}`);
  _log("力导初始化完成");

  const t0 = performance.now();
  console.log(`  [timing]  buildGraph 准备阶段: ${((t0 - _funcStart) / 1000).toFixed(1)}s`);
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
    if (elapsed > TIME_LIMIT_MS) {
      stoppedByTime = true;
      break;
    }
  }
  const totalSec = ((performance.now() - t0) / 1000).toFixed(1);
  printDone(`力导仿真完成 · ${actualTicks} tick · ${totalSec}s${stoppedByTime ? " (时间上限)" : ""}`);

  for (let i = 0; i < n; i++) {
    const b = i * 6;
    (nodes[i] as any).x = s[b];
    (nodes[i] as any).y = s[b + 1];
    (nodes[i] as any).z = s[b + 2];
  }

  const _simEnd = performance.now();

  // ── 列式紧凑数据 ──
  const nid: string[] = [];
  const nnm: string[] = [];
  const nur: string[] = [];
  const nfa: string[] = [];
  const nde: string[] = [];
  const nx: number[] = [];
  const ny: number[] = [];
  const nz: number[] = [];
  for (const nd of nodes) {
    nid.push(nd.id);
    nnm.push(nd.name ?? "");
    nur.push(nd.url);
    nfa.push(nd.favicon ?? "");
    nde.push(nd.desc ?? "");
    nx.push(nd.x ?? 0);
    ny.push(nd.y ?? 0);
    nz.push(nd.z ?? 0);
  }

  const idIndex = new Map<string, number>();
  nid.forEach((id, i) => idIndex.set(id, i));
  const ls: number[] = [];
  const lt: number[] = [];
  const lsym: number[] = [];
  for (const l of linksArr) {
    const si = idIndex.get(l.source);
    const ti = idIndex.get(l.target);
    if (si != null && ti != null) {
      ls.push(si);
      lt.push(ti);
      lsym.push(l.symbol ? 1 : 0);
    }
  }

  // ── 预计算邻接表 ──
  function buildAdjacency(nodeCount: number, srcs: number[], tgts: number[]) {
    const ndeg = new Uint16Array(nodeCount);
    for (let i = 0; i < srcs.length; i++) {
      ndeg[srcs[i]]++;
      ndeg[tgts[i]]++;
    }
    const ladj_off = new Uint32Array(nodeCount + 1);
    for (let i = 0; i < nodeCount; i++) {
      ladj_off[i + 1] = ladj_off[i] + ndeg[i];
    }
    const totalNeighborSlots = ladj_off[nodeCount];
    const ladj = new Uint32Array(totalNeighborSlots);
    const fillPtr = new Uint32Array(nodeCount);
    for (let i = 0; i < srcs.length; i++) {
      const tgt = tgts[i];
      ladj[ladj_off[srcs[i]] + fillPtr[srcs[i]]++] = tgt;
      ladj[ladj_off[tgt] + fillPtr[tgt]++] = srcs[i];
    }
    return { ndeg: Array.from(ndeg), ladj_off: Array.from(ladj_off), ladj: Array.from(ladj) };
  }

  // ── 预计算贝塞尔曲线 ──
  function buildBezierPositions(
    nCount: number,
    srcs: number[],
    tgts: number[],
    px: number[],
    py: number[],
    pz: number[],
  ) {
    const edgeCount = srcs.length;
    const lseg = new Uint8Array(edgeCount);
    let totalFloats = 0;
    for (let i = 0; i < edgeCount; i++) {
      const si = srcs[i];
      const ti = tgts[i];
      if (si >= nCount || ti >= nCount) {
        lseg[i] = 6;
        totalFloats += 6 * 2 * 3;
        continue;
      }
      const dx = px[ti] - px[si],
        dy = py[ti] - py[si],
        dz = pz[ti] - pz[si];
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      lseg[i] = calcSegmentCount(len);
      totalFloats += lseg[i] * 2 * 3;
    }

    const lpx = new Float32Array(totalFloats);
    const lpy = new Float32Array(totalFloats);
    const lpz = new Float32Array(totalFloats);
    let cursor = 0;

    for (let i = 0; i < edgeCount; i++) {
      const si = srcs[i];
      const ti = tgts[i];
      if (si >= nCount || ti >= nCount) {
        cursor += lseg[i] * 2 * 3;
        continue;
      }
      const sx = px[si],
        sy = py[si],
        sz = pz[si];
      const ex = px[ti],
        ey = py[ti],
        ez = pz[ti];
      const dx = ex - sx,
        dy = ey - sy,
        dz = ez - sz;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const off = calcControlOffset(dx, dy, dz, len);
      const bend = len * 0.15;
      const cx = (sx + ex) / 2 + off.ox * bend;
      const cy = (sy + ey) / 2 + off.oy * bend;
      const cz = (sz + ez) / 2 + off.oz * bend;

      const segs = lseg[i];
      for (let j = 0; j < segs; j++) {
        const t0 = j / segs;
        const t1 = (j + 1) / segs;
        lpx[cursor] = bezier2(sx, cx, ex, t0);
        lpy[cursor] = bezier2(sy, cy, ey, t0);
        lpz[cursor] = bezier2(sz, cz, ez, t0);
        cursor++;
        lpx[cursor] = bezier2(sx, cx, ex, t1);
        lpy[cursor] = bezier2(sy, cy, ey, t1);
        lpz[cursor] = bezier2(sz, cz, ez, t1);
        cursor++;
      }
    }

    return { lseg: Array.from(lseg), lpx, lpy, lpz };
  }

  /** Float32 → Int16 量化：精度 1/65535 范围，肉眼不可见 */
  function quantize(arr: Float32Array): { i16: Int16Array; min: number; max: number } {
    let min = Infinity,
      max = -Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] < min) min = arr[i];
      if (arr[i] > max) max = arr[i];
    }
    const range = max - min || 1;
    const i16 = new Int16Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      i16[i] = Math.round(((arr[i] - min) / range) * 65535 - 32768);
    }
    return { i16, min, max };
  }

  const { ndeg, ladj_off, ladj } = buildAdjacency(nid.length, ls, lt);
  const _dataEnd = performance.now();
  const rawBezier = buildBezierPositions(nid.length, ls, lt, nx, ny, nz);
  const qx = quantize(rawBezier.lpx);
  const qy = quantize(rawBezier.lpy);
  const qz = quantize(rawBezier.lpz);
  const _bezierEnd = performance.now();
  console.log(`  [timing]  力导+紧凑数据: ${((_dataEnd - _simEnd) / 1000).toFixed(1)}s`);
  console.log(`  [timing]  bezier 计算+量化: ${((_bezierEnd - _dataEnd) / 1000).toFixed(1)}s`);

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  printDone(`图数据构建完成 · ${nodes.length} 节点 · ${linksArr.length} 边 · 耗时 ${elapsed}s`);

  return {
    nodes,
    linksArr,
    categories,
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
    lsym,
    ndeg,
    ladj_off,
    ladj,
    lseg: rawBezier.lseg,
    lpx: qx.i16,
    lpx_min: qx.min,
    lpx_max: qx.max,
    lpy: qy.i16,
    lpy_min: qy.min,
    lpy_max: qy.max,
    lpz: qz.i16,
    lpz_min: qz.min,
    lpz_max: qz.max,
  };
}

// ── 模块级缓存：避免多个端点重复构建 ──
let _cachedPromise: Promise<BuildResult> | null = null;

export function getBuildResult(sites: Site[]): Promise<BuildResult> {
  if (!_cachedPromise) {
    _cachedPromise = buildGraph(sites);
  }
  return _cachedPromise;
}

/** 清除构建缓存（用于测试/重构建） */
export function clearBuildCache() {
  _cachedPromise = null;
}
