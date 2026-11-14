/**
 * 图数据构建（共享模块，带模块级缓存）
 * 多个端点（graph-core, graph-bezier）复用同一次力导仿真结果
 */
import type { Site } from "../../types/site";
import type { GraphNode, GraphLink, GraphCategory } from "../../types/graph";
import { printProgress, printDone } from "./progress";
import { createSimulation, type SimulationResult } from "@xingwangzhe/force-rs";
import { isFastMode } from "./sample";
import { buildBezierPositions, quantize } from "./build-bezier";
import { buildTopology } from "./graph-topology";
import {
  artifactKey,
  buildArtifacts,
  buildCacheEnabled,
  contentHash,
  implementationFingerprint,
  snapshotArtifactKey,
} from "./build-artifact-cache";

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
  const useCache = buildCacheEnabled();
  const implementation = useCache
    ? await implementationFingerprint(
        [
          "src/utils/build-graph.ts",
          "src/utils/build-bezier.ts",
          "src/utils/bezier.ts",
          "src/utils/graph-topology.ts",
          "src/utils/site-identity.ts",
          "src/utils/sample.ts",
          "src/utils/build-artifact-cache.ts",
        ],
        ["@xingwangzhe/force-rs"],
      )
    : null;
  const cacheKey = implementation
    ? artifactKey({ schema: 2, sites: snapshotArtifactKey(sites), implementation })
    : null;
  if (cacheKey) {
    const cached = await buildArtifacts.read<BuildResult>("graph", cacheKey);
    if (cached) {
      console.log(`[cache] graph hit: ${cached.nid.length} nodes, ${cached.ls.length} edges (verified artifact)`);
      return cached;
    }
    console.log("[cache] graph miss: refreshing graph data");
  }
  const topology = buildTopology(sites);
  const categories: GraphCategory[] = [{ name: "site" }, { name: "friend" }];
  const nodes: GraphNode[] = topology.nodes.map((node) => ({ ...node, favicon: resolveFavicon(node.favicon) }));
  const linksArr: GraphLink[] = topology.links;
  _log("共享身份解析与图拓扑");

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
  const linksFlat = linkSrcTgt.slice(0, li);

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
    algorithm: "fast" as const,
  };

  const FAST = isFastMode();
  const TICKS_MAX = FAST ? 100 : 500;
  const TIME_LIMIT_MS = FAST ? 30000 : 14 * 60 * 1000;

  printDone(`力导仿真就绪 · ${nodes.length} 节点 · θ=${forceOpts.theta}`);
  _log("力导初始化完成");

  const t0 = performance.now();
  console.log(`  [timing]  buildGraph 准备阶段: ${((t0 - _funcStart) / 1000).toFixed(1)}s`);
  const alphaMin = FAST ? 0.03 : 0.001;
  // Descriptions, titles and icons are not force inputs. Reuse the layout when
  // metadata changes, while the outer graph cache still refreshes that metadata.
  const layoutKey = implementation
    ? artifactKey({
        implementation,
        nodeIds: nodes.map((node) => node.id),
        links: contentHash(new Uint8Array(linksFlat.buffer, linksFlat.byteOffset, linksFlat.byteLength)),
        initial: contentHash(new Uint8Array(state.buffer)),
        forceOpts,
        maxTicks: TICKS_MAX,
        alphaMin,
      })
    : null;
  let layout = layoutKey ? await buildArtifacts.read<SimulationResult>("layout", layoutKey) : null;
  if (
    layout &&
    (!(layout.state instanceof Float64Array) ||
      layout.state.length !== state.length ||
      !layout.state.every(Number.isFinite) ||
      layout.stoppedByTime ||
      !Number.isInteger(layout.ticks) ||
      layout.ticks < 0 ||
      layout.ticks > TICKS_MAX)
  )
    layout = null;
  if (layout)
    console.log(`[cache] layout hit: ${n} node positions, ${layout.ticks} ticks (topology and force inputs verified)`);
  else {
    if (layoutKey) console.log("[cache] layout miss: running complete force layout");
    // Rust owns both state buffers, avoiding a ~2.4MB N-API result per tick.
    layout = createSimulation(linksFlat, n).run(state, forceOpts, TICKS_MAX, alphaMin, TIME_LIMIT_MS);
    if (layoutKey && !layout.stoppedByTime) await buildArtifacts.write("layout", layoutKey, layout);
  }
  const { state: s, ticks: actualTicks, stoppedByTime } = layout;
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

  const ladj_off = [...topology.csrOffsets];
  const ladj = [...topology.csrAdj];
  const ndeg = nodes.map((_, index) => ladj_off[index + 1] - ladj_off[index]);
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

  const result: BuildResult = {
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
  // A layout cut short by a wall-time limit must never masquerade as a complete cached layout.
  if (cacheKey && !stoppedByTime) await buildArtifacts.write("graph", cacheKey, result);
  return result;
}

// ── 模块级缓存：避免多个端点重复构建 ──
let _cachedPromises = new WeakMap<Site[], Promise<BuildResult>>();

export function getBuildResult(sites: Site[]): Promise<BuildResult> {
  let promise = _cachedPromises.get(sites);
  if (!promise) {
    promise = buildGraph(sites).catch((error) => {
      _cachedPromises.delete(sites);
      throw error;
    });
    _cachedPromises.set(sites, promise);
  }
  return promise;
}
export function clearBuildCache() {
  _cachedPromises = new WeakMap();
}
