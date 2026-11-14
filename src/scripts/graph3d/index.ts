import { registerPanel, showPanel, hidePanel, destroyPanel, togglePanel as toggleWindow } from "../ui/windows";
/**
 * 3D 博客宇宙渲染模块（Three.js InstancedMesh）
 * 使用 Three.js 原生 InstancedMesh 替代 3d-force-graph
 */
import * as THREE from "three";
import { decode } from "msgpackr";
import type { decompress as ZstdDecompressFn } from "@bokuweb/zstd-wasm";
import { adjustHex, createTextSprite, hashToIndex, PALETTE } from "./utils";
import { createRenderScheduler } from "./render-scheduler";
import { asInt16 } from "./binary-arrays";
import { LabelCandidateIndex } from "./label-candidates";
import {
  animateCamera,
  dispose as disposeRenderer,
  createRenderer,
  setLinkOpacity,
  setRenderQuality,
  type RenderQuality,
  nodeSize,
  setNodeColor,
  updateAllNodePositions,
  updateLinkPositions,
  type NodeState,
  type RenderContext,
} from "./renderer";
import { createInteraction } from "./interaction";
import { findShortestPath } from "./pathfinder";
import {
  applyFlightLook,
  applyFlightRoll,
  applyFlightTranslation,
  computeFlightSpeed,
  flightActionForKeyEvent,
  isEditableFlightTarget,
  levelFlightCamera,
  type FlightAction,
} from "./flight-controls";
import type { GraphData } from "../../../types/graph";

// ─── 常量 ──────────────────────────────────────────────────────────

const FOCUS_NODE_SCALE = 1.5;
const DEFAULT_MAX_OVERLAY_EDGES = 300;

// ─── Tooltip ─────────────────────────────────────────────────────────────

type TooltipApi = {
  el: HTMLElement;
  show: (content: HTMLElement, x: number, y: number) => void;
  hide: () => void;
};

function createTooltip(): TooltipApi {
  let el = document.getElementById("graph-tooltip") as HTMLElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = "graph-tooltip";
    el.className = "card bg-base-200 border border-base-300 shadow-xl text-base-content";
    el.setAttribute("role", "tooltip");
    el.style.display = "none";
    document.body.appendChild(el);
  }

  return {
    el,
    show(content, x, y) {
      if (!el) return;
      el.innerHTML = "";
      el.appendChild(content);
      el.style.display = "block";
      el.style.maxWidth = `${Math.min(320, window.innerWidth - 16)}px`;
      el.style.maxHeight = `${Math.max(1, window.innerHeight - 16)}px`;
      // 自适应：不超出视口边界
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const tw = Math.min(el.scrollWidth || 280, vw - 16);
      const th = el.scrollHeight || 100;
      let lx = Math.min(x + 12, vw - tw - 8);
      let ly = Math.min(y + 12, vh - th - 8);
      if (lx < 8) lx = 8;
      if (ly < 8) ly = 8;
      el.style.left = `${lx}px`;
      el.style.top = `${ly}px`;
      if (tw !== parseInt(el.style.maxWidth)) el.style.maxWidth = `${Math.min(320, vw - 16)}px`;
    },
    hide() {
      if (el) el.style.display = "none";
    },
  };
}

function appendMiddleClickHint(content: HTMLElement): void {
  const hint = document.createElement("div");
  hint.className = "flex items-center gap-2 text-[11px] opacity-60";
  const key = document.createElement("kbd");
  key.className = "kbd kbd-xs";
  key.textContent = "中键";
  hint.append(key, document.createTextNode("在新标签页打开网站"));
  content.appendChild(hint);
}

// ─── 可拖拽面板 ─────────────────────────────────────────────────────

// ─── 初始化 ──────────────────────────────────────────────────────────

let disposeActiveGraph: (() => void) | null = null;
let graphGeneration = 0;
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    graphGeneration++;
    disposeActiveGraph?.();
  });

export async function init3d(graphData: GraphData, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const generation = ++graphGeneration;
  disposeActiveGraph?.();
  const container = document.getElementById("main");
  if (!container) return null;

  container.innerHTML = "";

  // ── 1. 度数（优先用预计算数据，否则运行时计算）──
  const adjacency: any = graphData.adjacency || {};
  const preDeg: number[] | undefined = adjacency.ndeg;
  const preAdjOff: number[] | undefined = adjacency.ladj_off;
  const preAdj: number[] | undefined = adjacency.ladj;
  const hasPreAdj = preDeg && preAdjOff && preAdj;

  // ── 2. 节点预处理 ──
  const rawNodes = graphData.nodes || [];
  const rawLinks = graphData.links || [];

  const degreeMap: Record<string, number> = {};
  if (hasPreAdj) {
    for (let i = 0; i < rawNodes.length; i++) {
      degreeMap[rawNodes[i].id] = preDeg![i] || 0;
    }
  } else {
    for (const l of rawLinks) {
      const link = l as any;
      const s = link.source ?? link[0];
      const t = link.target ?? link[1];
      if (s != null) degreeMap[s] = (degreeMap[s] || 0) + 1;
      if (t != null) degreeMap[t] = (degreeMap[t] || 0) + 1;
    }
  }

  const nodes = rawNodes.map((n: any) => {
    const base = n.color || PALETTE[hashToIndex(n.id)];
    return Object.assign({}, n, {
      palColor: base,
      _cDefault: base, // 本色，最高饱和度
      _cHover: adjustHex(base, 15), // 略亮
      _cFocus: adjustHex(base, 30), // 更亮
      _cHighlight: adjustHex(base, 20), // 中等亮
      _cDimmed: adjustHex(base, -20), // 变暗
    });
  });

  // ── 4. 首次非空搜索时才建立 Orama 索引 ──
  let searchIndexReady = false;
  let searchIndexPromise: ReturnType<typeof buildSearchIndex> | null = null;

  function assertSearchActive() {
    if (disposed) throw new DOMException("Graph was disposed", "AbortError");
  }

  async function buildSearchIndex() {
    const { createGraphSearchIndex } = await import("../graph-search");
    assertSearchActive();
    return createGraphSearchIndex(nodes, () => !disposed);
  }

  function getSearchIndex() {
    if (!searchIndexPromise) {
      searchIndexPromise = buildSearchIndex()
        .then((index) => {
          assertSearchActive();
          searchIndexReady = true;
          return index;
        })
        .catch((error) => {
          searchIndexPromise = null;
          searchIndexReady = false;
          throw error;
        });
    }
    return searchIndexPromise;
  }

  // ── 5. 状态 ──
  let hoveredId: string | null = null;
  let lastHoveredId: string | null = null;
  let focusedId: string | null = null;
  let highlightedSet = new Set<string>();
  let pathNodeIds: string[] | null = null;
  let pathStepIndex = -1;
  let pathOverlayGroup: THREE.Group | null = null;

  // ── 5b. 标准化链接数组（供 overlay、linkArr 等处使用）──
  const links = rawLinks.map((l: any) => ({
    source: typeof l.source === "object" && l.source !== null ? (l.source.id ?? l.source) : l.source,
    target: typeof l.target === "object" && l.target !== null ? (l.target.id ?? l.target) : l.target,
  }));

  // ── 5c. 有向邻居映射（区分双向/单向）──
  // rawLinks 的 symbol 字段：无 symbol = 双向链接，有 symbol = 单向
  const outgoingMap = new Map<string, Set<string>>();
  const incomingMap = new Map<string, Set<string>>();
  for (const l of rawLinks) {
    const source = l.source as string;
    const target = l.target as string;
    if (!outgoingMap.has(source)) outgoingMap.set(source, new Set());
    if (!incomingMap.has(target)) incomingMap.set(target, new Set());
    outgoingMap.get(source)!.add(target);
    incomingMap.get(target)!.add(source);
    // 无 symbol = 双向链接：反向也加一条
    if (!l.symbol) {
      if (!outgoingMap.has(target)) outgoingMap.set(target, new Set());
      if (!incomingMap.has(source)) incomingMap.set(source, new Set());
      outgoingMap.get(target)!.add(source);
      incomingMap.get(source)!.add(target);
    }
  }

  // ── 6. 邻居映射 ──
  const neighborMap = new Map<string, Set<string>>();
  if (hasPreAdj) {
    // 从预计算邻接表直接构建，O(N)
    for (let i = 0; i < rawNodes.length; i++) {
      const nid = rawNodes[i].id;
      const off = preAdjOff![i];
      const end = preAdjOff![i + 1];
      const nbrs = new Set<string>();
      for (let j = off; j < end; j++) {
        nbrs.add(rawNodes[preAdj![j]].id);
      }
      neighborMap.set(nid, nbrs);
    }
  } else {
    for (const l of links) {
      if (!neighborMap.has(l.source)) neighborMap.set(l.source, new Set());
      if (!neighborMap.has(l.target)) neighborMap.set(l.target, new Set());
      neighborMap.get(l.source)!.add(l.target);
      neighborMap.get(l.target)!.add(l.source);
    }
  }

  // ── 6b. 控制面板持久化 ──
  const STORAGE_PREFIX = "friendlinks_";
  function loadVal<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(STORAGE_PREFIX + key);
      if (v !== null) return JSON.parse(v) as T;
    } catch {}
    return fallback;
  }
  function saveVal(key: string, val: unknown) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
    } catch {}
  }

  const linkOpacity = { value: loadVal("link_opacity", 0) };
  const labelShow = { value: loadVal("label_show", true) };
  const maxOverlayEdges = { value: loadVal("max_overlay_edges", DEFAULT_MAX_OVERLAY_EDGES) };

  // ── 6c. 最大度数 ──
  const maxDegree = Math.max(...Object.values(degreeMap), 1);
  const savedQuality = loadVal<string>("render_quality", "low");
  let quality: RenderQuality = savedQuality === "high" || savedQuality === "balanced" ? savedQuality : "low";
  let unlimitedFps = loadVal<unknown>("unlimited_fps", true) !== false;
  const qualityOptions = {
    low: { fps: 30, labels: 48, neighbors: 40 },
    balanced: { fps: 45, labels: 96, neighbors: 100 },
    high: { fps: 60, labels: 160, neighbors: 300 },
  };

  // ── 6d. 节点索引映射 ──
  const linkArr = links as Array<{ source: string; target: string }>;
  const nodeIdToIndex = new Map<string, number>();
  nodes.forEach((n, i) => nodeIdToIndex.set(n.id, i));
  function getNode(id: string) {
    const index = nodeIdToIndex.get(id);
    return index === undefined ? undefined : nodes[index];
  }
  // Build incident-edge lookup once; hovering no longer scans the whole graph.
  const incidentEdges = new Map<string, number[]>();
  links.forEach((link, i) => {
    for (const id of new Set([link.source, link.target])) {
      const edges = incidentEdges.get(id) || [];
      edges.push(i);
      incidentEdges.set(id, edges);
    }
  });

  // ── 6e. 可复用对象（聚焦缩放 / 导航用，避免 GC）──
  const _focusScaleMatrix = new THREE.Matrix4();
  const _focusScalePos = new THREE.Vector3();
  const _focusScaleQuat = new THREE.Quaternion();
  const _focusScaleSz = new THREE.Vector3();

  // ── 7. 渲染器 ──
  const ctx: RenderContext = await createRenderer(container, nodes.length, linkArr.length);
  if (signal?.aborted || generation !== graphGeneration) {
    ctx.controls.dispose();
    disposeRenderer(ctx);
    ctx.renderer.domElement.remove();
    signal?.throwIfAborted();
    return null;
  }
  let disposed = false;
  const lazyAbort = new AbortController();

  setRenderQuality(ctx, quality);
  const perfStats = {
    frames: 0,
    labelScans: 0,
    labelCandidatesVisited: 0,
    autoHoverScans: 0,
    autoHoverCandidates: 0,
    autoHoverCpuMs: 0,
    labelCreates: 0,
    overlayBuilds: 0,
  };
  // We own the frame loop, so retain the last frame's real draw counters until the next frame.
  ctx.renderer.info.autoReset = false;
  let renderCpuMs = 0;
  function requestRender() {
    ctx.requestRender();
  }

  const nodeStates: NodeState[] = nodes.map((n: any) => ({
    _cDefault: n._cDefault,
    _cHover: n._cHover,
    _cFocus: n._cFocus,
    _cHighlight: n._cHighlight,
    _cDimmed: n._cDimmed,
  }));

  updateAllNodePositions(ctx, nodes, nodeStates, degreeMap, maxDegree);

  // ── 连线位置：优先使用构建时预计算的贝塞尔数据，否则运行时计算 ──
  const _bezier = (graphData as any).bezier;
  if (_bezier) {
    applyBezierData(
      ctx,
      _bezier,
      linkArr,
      nodeIdToIndex,
      nodes,
      maxOverlayEdges.value,
      pathNodeIds ? 0 : linkOpacity.value,
    );
  } else {
    updateLinkPositions(ctx, linkArr, nodeIdToIndex, nodes, linkOpacity.value);
  }

  // ── 可选预计算曲线：仅由显式 API 请求，常规交互使用运行时曲线采样 ──
  let _bezierLoaded = !!_bezier;
  let _bezierLoading = false;

  async function loadBezierLazy() {
    if (_bezierLoaded || _bezierLoading) return;
    _bezierLoading = true;
    try {
      const h = (window as any).__BIN_TIMESTAMPS;
      const bezierUrl = h?.bezier ? `/graph-bezier.${h.bezier}.bin` : "/graph-bezier.bin";
      const res = await fetch(bezierUrl, { signal: lazyAbort.signal });
      if (!res.ok) return;
      const buf = await res.arrayBuffer();
      if (disposed) return;
      const raw = await maybeDecompress(new Uint8Array(buf));
      const bezierData = decode(raw) as any;
      if (!bezierData.lpx) return;

      const compactVertexCount = (bezierData.lseg as number[]).reduce((total, count) => total + count * 2, 0);
      const bz = {
        lseg: bezierData.lseg,
        lpx: dequantize(
          asInt16(bezierData.lpx).subarray(0, compactVertexCount),
          bezierData.lpx_min,
          bezierData.lpx_max,
        ),
        lpy: dequantize(
          asInt16(bezierData.lpy).subarray(0, compactVertexCount),
          bezierData.lpy_min,
          bezierData.lpy_max,
        ),
        lpz: dequantize(
          asInt16(bezierData.lpz).subarray(0, compactVertexCount),
          bezierData.lpz_min,
          bezierData.lpz_max,
        ),
      };
      if (disposed) return;
      applyBezierData(
        ctx,
        bz,
        linkArr,
        nodeIdToIndex,
        nodes,
        maxOverlayEdges.value,
        pathNodeIds ? 0 : linkOpacity.value,
      );
      _bezierLoaded = true;
      const activeId = focusedId || hoveredId;
      if (activeId && !pathNodeIds) buildOverlay(activeId, getNode(activeId)?._cDefault || "#ffffff");
      requestRender();
    } catch {
      // Keep the runtime curve on network/decode failure, and allow a later retry.
    } finally {
      _bezierLoading = false;
    }
  }

  function refreshLinkColors() {
    setLinkOpacity(ctx, pathNodeIds ? 0 : linkOpacity.value);
    saveVal("link_opacity", linkOpacity.value);
    requestRender();
  }

  // ── 8. 标签系统 ──
  const labelGroup = new THREE.Group();
  labelGroup.name = "labels";
  ctx.scene.add(labelGroup);

  // ── 8b. 邻居大字标签（聚焦时显示，屏幕空间恒定大小）──
  const neighborLabelGroup = new THREE.Group();
  neighborLabelGroup.name = "neighborLabels";
  neighborLabelGroup.renderOrder = 999;
  ctx.scene.add(neighborLabelGroup);

  let labelsCreated = new Set<number>(); // 改为 Set 追踪已创建的节点索引
  const LABEL_MAX_FADE_START = 3000;
  const LABEL_FADE_FULL = 1000;

  const labelFrustum = new THREE.Frustum();
  const labelProjection = new THREE.Matrix4();
  const labelPoint = new THREE.Vector3();
  const labelCandidates = new LabelCandidateIndex(nodes);
  function removeLabel(sprite: THREE.Sprite) {
    labelsCreated.delete((sprite as any)._nodeIndex);
    sprite.material.map?.dispose();
    sprite.material.dispose();
    labelGroup.remove(sprite);
  }
  // Called only after camera/settings changes. Bound both textures and creation per frame.
  function ensureLabels(): boolean {
    labelGroup.visible = labelShow.value && !focusedId;
    if (!labelGroup.visible) return false;
    perfStats.labelScans++;
    const budget = qualityOptions[quality].labels;
    const camPos = ctx.camera.position;
    ctx.camera.updateMatrixWorld();
    labelProjection.multiplyMatrices(ctx.camera.projectionMatrix, ctx.camera.matrixWorldInverse);
    labelFrustum.setFromProjectionMatrix(labelProjection, ctx.camera.coordinateSystem);
    const selected = labelCandidates.select(camPos, labelFrustum, budget, labelsCreated);
    perfStats.labelCandidatesVisited += labelCandidates.lastVisited;
    const retained = new Set(selected);
    for (const child of labelGroup.children.slice()) {
      if (!retained.has((child as any)._nodeIndex)) removeLabel(child as THREE.Sprite);
    }
    const missing = selected.filter((index) => !labelsCreated.has(index));
    const count = Math.min(4, missing.length);
    for (let j = 0; j < count; j++) {
      const i = missing[j],
        n = nodes[i];
      const sprite = createTextSprite(n.name || n.id, 12, 48);
      sprite.position.set(n.x!, (n.y ?? 0) + nodeSize(1, 1) + 8, n.z ?? 0);
      (sprite as any)._nodePos = { x: n.x!, y: n.y ?? 0, z: n.z ?? 0 };
      (sprite as any)._nodeIndex = i;
      labelsCreated.add(i);
      labelGroup.add(sprite);
      perfStats.labelCreates++;
    }
    return count < missing.length;
  }

  // ── 9. 控制面板 ──
  const flightSpeedProfile = computeFlightSpeed(nodes);
  const autoFlightSpeed = flightSpeedProfile.speed;
  const flightSpeedMin = Math.max(50, Math.round(autoFlightSpeed * 0.35));
  const flightSpeedMax = Math.max(flightSpeedMin + 100, Math.round(autoFlightSpeed * 2.5));
  const flightSpeedStep = 1;
  const savedSpeedScaleRaw = Number(loadVal<unknown>("flight_speed_scale", 1));
  const savedSpeedScale = Number.isFinite(savedSpeedScaleRaw) ? Math.min(2.5, Math.max(0.35, savedSpeedScaleRaw)) : 1;
  let MOVE_SPEED = Math.min(flightSpeedMax, Math.max(flightSpeedMin, Math.round(autoFlightSpeed * savedSpeedScale)));
  function createControlPanel() {
    let panel = document.getElementById("graph-control-panel") as HTMLElement | null;
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "graph-control-panel";
    panel.className = "panel-content control-panel";
    panel.hidden = true;

    function addSliderRow(
      parent: HTMLElement,
      title: string,
      min: string,
      max: string,
      step: string,
      defaultValue: string,
      onChange: (v: number) => void,
      unit?: string,
    ) {
      const label = document.createElement("label");
      label.textContent = title;
      label.style.cssText = "font-size:12px;color:#aaa;display:block;margin-bottom:4px;margin-top:10px;";
      const slider = document.createElement("input");
      slider.type = "range";
      slider.className = "range range-primary range-sm";
      slider.setAttribute("aria-label", title);
      slider.setAttribute("with-tooltip", "");
      slider.min = min;
      slider.max = max;
      slider.step = step;
      slider.value = defaultValue;
      slider.style.cssText = "flex:1 1 auto;min-width:0;accent-color:#4a9eff;";
      const val = document.createElement("span");
      val.textContent = defaultValue + (unit || "");
      val.style.cssText = "flex:none;white-space:nowrap;font-size:11px;color:#aaa;margin-left:6px;";
      slider.addEventListener("input", () => {
        const v = Number(slider.value);
        val.textContent = slider.value + (unit || "");
        onChange(v);
      });
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;";
      row.appendChild(slider);
      row.appendChild(val);
      parent.appendChild(label);
      parent.appendChild(row);
      return { slider, valueEl: val, row };
    }

    const qualityLabel = document.createElement("label");
    qualityLabel.className = "label mt-2";
    qualityLabel.textContent = "渲染画质";
    const qualitySelect = document.createElement("select");
    qualitySelect.className = "select select-bordered select-sm w-full";
    qualitySelect.setAttribute("aria-label", "渲染画质");
    for (const [value, text] of [
      ["low", "节能（推荐低配设备）"],
      ["balanced", "均衡"],
      ["high", "清晰"],
    ]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      qualitySelect.appendChild(option);
    }
    qualitySelect.value = quality;
    qualitySelect.addEventListener("change", () => {
      quality = qualitySelect.value as RenderQuality;
      saveVal("render_quality", quality);
      setRenderQuality(ctx, quality);
      renderScheduler.setMaxFps(unlimitedFps ? Infinity : qualityOptions[quality].fps);
      labelsDirty = true;
      if (focusedId) buildNeighborLabels(focusedId);
      requestRender();
    });
    panel.append(qualityLabel, qualitySelect);

    const fpsLabel = document.createElement("label");
    fpsLabel.className = "label mt-2";
    fpsLabel.textContent = "帧率上限";
    const fpsSelect = document.createElement("select");
    fpsSelect.className = "select select-bordered select-sm w-full";
    fpsSelect.setAttribute("aria-label", "帧率上限");
    for (const [value, text] of [
      ["unlimited", "无限制（跟随屏幕刷新率）"],
      ["auto", "跟随画质（30 / 45 / 60 FPS）"],
    ]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      fpsSelect.appendChild(option);
    }
    fpsSelect.value = unlimitedFps ? "unlimited" : "auto";
    fpsSelect.addEventListener("change", () => {
      unlimitedFps = fpsSelect.value === "unlimited";
      saveVal("unlimited_fps", unlimitedFps);
      renderScheduler.setMaxFps(unlimitedFps ? Infinity : qualityOptions[quality].fps);
      requestRender();
    });
    const fpsHint = document.createElement("p");
    fpsHint.className = "mt-1 text-xs text-base-content/60";
    fpsHint.textContent = "仅影响活动帧率，静止时自动停绘。";
    panel.append(fpsLabel, fpsSelect, fpsHint);

    addSliderRow(panel, "连线透明度", "0", "1", "0.05", String(linkOpacity.value), (v) => {
      linkOpacity.value = v;
      saveVal("link_opacity", v);
      refreshLinkColors();
    });
    const speedControl = addSliderRow(
      panel,
      "飞船速度",
      String(flightSpeedMin),
      String(flightSpeedMax),
      String(flightSpeedStep),
      String(MOVE_SPEED),
      (v) => {
        MOVE_SPEED = v;
        saveVal("flight_speed_scale", v / autoFlightSpeed);
      },
      " 单位/秒",
    );
    speedControl.slider.id = "flight-speed-slider";
    speedControl.slider.dataset.autoSpeed = String(autoFlightSpeed);
    const speedHint = document.createElement("div");
    speedHint.className = "mt-1 flex flex-wrap items-center justify-between gap-3 text-xs text-base-content/60";
    const speedHintText = document.createElement("span");
    speedHintText.textContent = `自动基准 ${autoFlightSpeed.toLocaleString()} 单位/秒 · ${flightSpeedProfile.count.toLocaleString()} 个星球按分布体积推算`;
    const speedReset = document.createElement("button");
    speedReset.type = "button";
    speedReset.id = "flight-speed-reset";
    speedReset.className = "btn btn-ghost btn-xs";
    speedReset.textContent = "恢复自动";
    speedReset.title = "恢复按当前星球数量和分布体积计算的自动速度";
    speedReset.addEventListener("click", () => {
      MOVE_SPEED = autoFlightSpeed;
      speedControl.slider.value = String(autoFlightSpeed);
      speedControl.valueEl.textContent = `${autoFlightSpeed} 单位/秒`;
      saveVal("flight_speed_scale", 1);
    });
    speedHint.append(speedHintText, speedReset);
    panel.appendChild(speedHint);

    {
      const lbl = document.createElement("label");
      lbl.textContent = "节点标签";
      lbl.style.cssText = "font-size:12px;color:#aaa;display:block;margin-bottom:4px;margin-top:10px;";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "toggle toggle-primary";
      cb.setAttribute("aria-label", "节点标签");
      cb.checked = labelShow.value;

      cb.textContent = "节点标签";
      cb.style.cssText = "accent-color:#4a9eff;margin-right:6px;";
      const cbLabel = document.createElement("span");
      cbLabel.textContent = cb.checked ? "显示" : "隐藏";
      cbLabel.style.cssText = "font-size:12px;color:#ccc;";
      cb.addEventListener("change", () => {
        labelShow.value = cb.checked;
        saveVal("label_show", cb.checked);
        cbLabel.textContent = cb.checked ? "显示" : "隐藏";
        labelsDirty = true;
        labelGroup.visible = cb.checked && !focusedId;
        requestRender();
      });
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;";
      row.appendChild(cb);
      row.appendChild(cbLabel);
      panel.appendChild(lbl);
      panel.appendChild(row);
    }

    addSliderRow(
      panel,
      "连线数上限",
      "10",
      "500",
      "10",
      String(maxOverlayEdges.value),
      (v) => {
        maxOverlayEdges.value = v;
        saveVal("max_overlay_edges", v);

        if (focusedId) {
          buildNeighborLabels(focusedId);
          // 同步重建 overlay 管道，使上限生效
          const fn = getNode(focusedId!);
          if (fn) buildOverlay(focusedId, new THREE.Color(fn._cDefault));
        }
        requestRender();
      },
      "",
    );

    const hint = document.createElement("div");
    hint.textContent = "右键点击节点聚焦 · 左键打开链接 · 拖拽旋转/平移";
    hint.className = "text-xs opacity-50 mt-3 text-center";
    panel.appendChild(hint);
    document.body.appendChild(panel);
    registerPanel(panel);
    return panel;
  }

  const controlPanel = createControlPanel();
  function togglePanel() {
    toggleWindow(controlPanel.id, document.getElementById("opacity-toggle") || undefined);
  }
  (window as any).__toggleOpacityPanel = togglePanel;

  // ── 10. 邻居面板 ──
  function createNeighborPanel(): HTMLElement {
    let panel = document.getElementById("neighbor-panel") as HTMLElement | null;
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "neighbor-panel";
    panel.className = "panel-content neighbor-panel-content";
    panel.hidden = true;
    const nodeName = document.createElement("div");
    nodeName.className = "np-node-name";
    const searchWrap = document.createElement("div");
    searchWrap.className = "np-search";
    const searchInput = document.createElement("input");
    searchInput.className = "input input-bordered w-full";
    searchInput.setAttribute("aria-label", "搜索邻居");
    searchInput.type = "text";
    searchInput.placeholder = "搜索邻居…";
    searchWrap.appendChild(searchInput);
    const countInfo = document.createElement("div");
    countInfo.className = "np-search-count";
    const body = document.createElement("div");
    body.className = "np-body";
    const hint = document.createElement("div");
    hint.className = "np-hint";
    hint.textContent = "连线数上限可在控制面板调整，超出部分不显示标签";
    panel.appendChild(nodeName);
    panel.appendChild(searchWrap);
    panel.appendChild(countInfo);
    panel.appendChild(body);
    panel.appendChild(hint);
    // 搜索过滤
    let _categories: {
      mutual: Array<{ id: string; name: string; url: string }>;
      outgoing: Array<{ id: string; name: string; url: string }>;
      incoming: Array<{ id: string; name: string; url: string }>;
    } = { mutual: [], outgoing: [], incoming: [] };
    searchInput.addEventListener("input", () => {
      const q = (searchInput.value || "").trim().toLowerCase();
      renderNeighborCategories(body, countInfo, _categories, q);
    });
    // 保存引用供 updateNeighborPanel 使用
    (panel as any)._setCategories = (cats: typeof _categories) => {
      _categories = cats;
      searchInput.value = "";
      const total = cats.mutual.length + cats.outgoing.length + cats.incoming.length;
      renderNeighborCategories(body, countInfo, cats, "");
      hint.style.display = total > maxOverlayEdges.value ? "block" : "none";
    };
    document.body.appendChild(panel);
    registerPanel(panel);
    return panel;
  }
  const neighborPanel = createNeighborPanel();

  // 渲染邻居列表（三段式：双链 / 单链指向 / 被指向，支持搜索过滤）
  /** CJK 友好的搜索匹配：多策略级联 */
  function matchEntry(entry: { id: string; name: string; url: string }, q: string): boolean {
    const name = entry.name.toLowerCase();
    const url = entry.url.toLowerCase();

    // 1. 直接子串匹配（CJK 精确匹配靠这个）
    if (name.includes(q) || url.includes(q)) return true;

    // 2. 顺序字符匹配（"bk" → "Book"，"博" → "博客"）
    let qi = 0;
    for (let i = 0; i < name.length && qi < q.length; i++) {
      if (name[i] === q[qi]) qi++;
    }
    if (qi === q.length) return true;

    // 3. 空格分隔词的起始匹配（"te" → "Tech Blog"）
    const words = name.split(/[\s_-]+/);
    if (words.some((w) => w.startsWith(q) || (w.length > 2 && w.includes(q)))) return true;

    // 4. 各单词首字母缩写匹配（"tb" → "Tech Blog"）
    const initials = words.map((w) => w[0] || "").join("");
    if (initials.includes(q)) return true;

    return false;
  }

  function renderNeighborCategories(
    body: HTMLElement,
    countEl: HTMLElement,
    categories: {
      mutual: Array<{ id: string; name: string; url: string }>;
      outgoing: Array<{ id: string; name: string; url: string }>;
      incoming: Array<{ id: string; name: string; url: string }>;
    },
    query: string,
  ) {
    body.innerHTML = "";
    const total = categories.mutual.length + categories.outgoing.length + categories.incoming.length;

    function filter(arr: Array<{ id: string; name: string; url: string }>) {
      if (!query) return arr;
      const q = query.toLowerCase().trim();
      return arr.filter((e) => matchEntry(e, q));
    }

    const mutualFiltered = filter(categories.mutual);
    const outgoingFiltered = filter(categories.outgoing);
    const incomingFiltered = filter(categories.incoming);
    const totalFiltered = mutualFiltered.length + outgoingFiltered.length + incomingFiltered.length;

    countEl.textContent = query ? `${totalFiltered} / ${total} 个关联节点` : `${total} 个关联节点`;

    if (totalFiltered === 0) {
      const empty = document.createElement("div");
      empty.className = "np-empty";
      empty.textContent = query ? "无匹配结果" : "无关联节点";
      body.appendChild(empty);
      return;
    }

    function renderColumn(title: string, icon: string, entries: Array<{ id: string; name: string; url: string }>) {
      const col = document.createElement("div");
      col.className = "np-section";
      const secTitle = document.createElement("div");
      secTitle.className = "np-section-title";
      secTitle.innerHTML = `<span>${icon} ${title}</span><span class="count">${entries.length}</span>`;
      col.appendChild(secTitle);
      for (const entry of entries) {
        const item = document.createElement("div");
        item.className = "np-item";
        item.dataset.id = entry.id;
        // 链接图标：点击直接打开网站，不触发聚焦
        const linkIcon = document.createElement("button");
        linkIcon.className = "btn btn-ghost btn-xs np-item-link";
        linkIcon.setAttribute("aria-label", `打开 ${entry.name} 网站`);
        linkIcon.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
        linkIcon.title = "打开网站";
        linkIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          window.open(entry.url, "_blank", "noopener");
        });
        item.appendChild(linkIcon);
        // 文本内容（名称 + URL）
        const content = document.createElement("button");
        content.className = "btn btn-ghost h-auto np-item-content";
        content.setAttribute("aria-label", `聚焦 ${entry.name}`);
        const nm = document.createElement("div");
        nm.className = "np-item-name";
        nm.textContent = entry.name;
        const ur = document.createElement("div");
        ur.className = "np-item-url";
        ur.textContent = entry.url;
        content.appendChild(nm);
        content.appendChild(ur);
        item.appendChild(content);
        // 点击条目聚焦节点
        item.addEventListener("click", () => focusNode(entry.id));
        col.appendChild(item);
      }
      body.appendChild(col);
    }

    renderColumn("双链", "🔄", mutualFiltered);
    renderColumn("单链", "➡️", outgoingFiltered);
    renderColumn("被指", "⬅️", incomingFiltered);
  }

  function updateNeighborPanel(nodeId: string | null) {
    if (!neighborPanel) return;
    if (!nodeId) {
      hidePanel(neighborPanel.id);
      return;
    }
    showPanel(neighborPanel.id);
    const focusedNode = getNode(nodeId);
    const nameEl = neighborPanel.querySelector(".np-node-name");
    if (nameEl) nameEl.textContent = focusedNode ? focusedNode.name || focusedNode.id : nodeId;
    const body = neighborPanel.querySelector(".np-body") as HTMLElement;
    if (!body) return;
    const outgoing = outgoingMap.get(nodeId) || new Set();
    const incoming = incomingMap.get(nodeId) || new Set();
    const allIds = new Set([...outgoing, ...incoming]);
    if (allIds.size === 0) {
      (neighborPanel as any)._setCategories?.({ mutual: [], outgoing: [], incoming: [] });
      return;
    }
    const mutual: Array<{ id: string; name: string; url: string }> = [];
    const outgoingOnly: Array<{ id: string; name: string; url: string }> = [];
    const incomingOnly: Array<{ id: string; name: string; url: string }> = [];
    for (const nid of allIds) {
      const node = getNode(nid);
      if (!node) continue;
      const entry = { id: nid, name: node.name || nid, url: node.url || "" };
      const inOut = outgoing.has(nid);
      const inIn = incoming.has(nid);
      if (inOut && inIn) mutual.push(entry);
      else if (inOut && !inIn) outgoingOnly.push(entry);
      else incomingOnly.push(entry);
    }
    mutual.sort((a, b) => a.url.localeCompare(b.url));
    outgoingOnly.sort((a, b) => a.url.localeCompare(b.url));
    incomingOnly.sort((a, b) => a.url.localeCompare(b.url));
    (neighborPanel as any)._setCategories?.({ mutual, outgoing: outgoingOnly, incoming: incomingOnly });
  }

  // ── 10b. 邻居大字标签（密度感知：巨型节点自动缩减标签量）──

  function clearNeighborLabels() {
    while (neighborLabelGroup.children.length > 0) {
      const sprite = neighborLabelGroup.children[0] as THREE.Sprite;
      if (sprite.material) {
        (sprite.material as THREE.SpriteMaterial).map?.dispose();
        sprite.material.dispose();
      }
      neighborLabelGroup.remove(sprite);
    }
  }

  function buildNeighborLabels(nodeId: string) {
    clearNeighborLabels();
    const neighborIds = neighborMap.get(nodeId);
    if (!neighborIds || neighborIds.size === 0) return;

    const arr = Array.from(neighborIds);
    // 显示全部邻居，上限由滑条控制
    const limit = Math.min(maxOverlayEdges.value, qualityOptions[quality].neighbors);
    const shown = arr.length > limit ? arr.slice(0, limit) : arr;

    for (const nid of shown) {
      const node = getNode(nid);
      if (!node || node.x == null) continue;
      const name = node.name || node.id;
      if (name.length > 40) continue;
      const sprite = createTextSprite(name, 1, 36);
      (sprite as any)._nodePos3d = { x: node.x!, y: node.y || 0, z: node.z || 0 };
      (sprite as any)._neighborId = nid;
      (sprite as any)._neighborUrl = node.url || "";
      neighborLabelGroup.add(sprite);
    }

    // 被聚焦节点自己的标签
    const fNode = getNode(nodeId);
    if (fNode && fNode.x != null) {
      const fName = fNode.name || fNode.id;
      if (fName.length <= 40) {
        const fSprite = createTextSprite(fName, 1, 44);
        (fSprite as any)._nodePos3d = { x: fNode.x!, y: fNode.y || 0, z: fNode.z || 0 };
        (fSprite as any)._neighborId = nodeId;
        (fSprite as any)._isFocused = true;
        neighborLabelGroup.add(fSprite);
      }
    }
  }

  // ── 11. 路径查找 ──
  function clearOldPathState() {
    pathNodeIds = null;
    pathStepIndex = -1;
    clearNeighborLabels();
    if (pathOverlayGroup) {
      while (pathOverlayGroup.children.length > 0) {
        const child = pathOverlayGroup.children[0] as THREE.Mesh;
        if (child.geometry) child.geometry.dispose();
        if (child.material) (child.material as THREE.Material).dispose();
        pathOverlayGroup.remove(child);
      }
      ctx.scene.remove(pathOverlayGroup);
      pathOverlayGroup = null;
    }
  }

  function buildPathOverlay(path: string[]) {
    if (path.length < 2) return;
    pathOverlayGroup = new THREE.Group();

    // 收集路径途经节点的 3D 坐标
    const pts: THREE.Vector3[] = [];
    for (const id of path) {
      const node = getNode(id);
      if (node && node.x != null) {
        pts.push(new THREE.Vector3(node.x, node.y ?? 0, node.z ?? 0));
      }
    }
    if (pts.length < 2) return;

    // CatmullRomCurve3 — 一条平滑曲线穿过所有途经节点
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeRes = 64; // 沿曲线分段数（越高越平滑）
    const tubeRadius = 0.6; // 管道半径
    const radialSegs = 8; // 圆周分段

    // 核心管道（亮金色）
    const coreGeom = new THREE.TubeGeometry(curve, tubeRes, tubeRadius, radialSegs, false);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffd700).multiplyScalar(0.7),
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    pathOverlayGroup.add(core);

    // 光晕管道（外发光，半透明，大一圈）
    const glowGeom = new THREE.TubeGeometry(curve, tubeRes, tubeRadius * 2.5, radialSegs, false);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffd700).multiplyScalar(0.3),
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    pathOverlayGroup.add(glow);

    ctx.scene.add(pathOverlayGroup);
  }

  function refreshPathNodeColors(previousStep?: number) {
    if (!pathNodeIds) return;
    if (previousStep !== undefined) {
      const previous = nodeIdToIndex.get(pathNodeIds[previousStep]);
      const current = nodeIdToIndex.get(pathNodeIds[pathStepIndex]);
      if (previous !== undefined) setNodeColor(ctx, previous, "#FF8C00");
      if (current !== undefined) setNodeColor(ctx, current, adjustHex(nodes[current]._cDefault, 70));
      requestRender();
      return;
    }
    const pathSet = new Set(pathNodeIds);
    for (let i = 0; i < nodes.length; i++) {
      const nd = nodes[i];
      if (pathSet.has(nd.id)) {
        if (pathStepIndex >= 0 && nd.id === pathNodeIds[pathStepIndex]) {
          setNodeColor(ctx, i, adjustHex(nd._cDefault, 70), false);
        } else {
          setNodeColor(ctx, i, "#FF8C00", false);
        }
      } else {
        setNodeColor(ctx, i, nd._cDefault, false);
      }
    }
    if (ctx.nodes.instanceColor) ctx.nodes.instanceColor.needsUpdate = true;
  }

  function showShortestPath(fromId: string, toId: string): string[] | null {
    const path = findShortestPath(neighborMap, fromId, toId);
    if (!path) return null;
    clearOldPathState();
    if (focusedId) restoreNodeScale(focusedId);
    focusedId = null;
    highlightedSet.clear();
    labelsDirty = true;
    requestRender();
    updateNeighborPanel(null);
    pathNodeIds = path;
    pathStepIndex = 0;
    refreshPathNodeColors();
    buildOverlay(null, 0xffffff); // 清除聚焦叠加线
    // 路径模式下隐藏普通连线，只显示金色路径管道
    setLinkOpacity(ctx, 0);
    buildPathOverlay(path);
    const first = getNode(path[0]);
    if (first && first.x != null) {
      const pad = 200;
      animateCamera(
        ctx,
        { x: first.x + pad, y: first.y! + pad * 0.5, z: first.z! + pad },
        { x: first.x!, y: first.y!, z: first.z! },
        800,
      );
    }
    return path;
  }

  function stepPathNext(): boolean {
    if (!pathNodeIds || pathStepIndex >= pathNodeIds.length - 1) return false;
    const previousStep = pathStepIndex++;
    refreshPathNodeColors(previousStep);
    const nid = pathNodeIds[pathStepIndex];
    const n = getNode(nid);
    if (n && n.x != null) {
      const pad = 200;
      animateCamera(ctx, { x: n.x + pad, y: n.y! + pad * 0.5, z: n.z! + pad }, { x: n.x!, y: n.y!, z: n.z! }, 600);
    }
    return true;
  }

  function stepPathPrev(): boolean {
    if (!pathNodeIds || pathStepIndex <= 0) return false;
    const previousStep = pathStepIndex--;
    refreshPathNodeColors(previousStep);
    const nid = pathNodeIds[pathStepIndex];
    const n = getNode(nid);
    if (n && n.x != null) {
      const pad = 200;
      animateCamera(ctx, { x: n.x + pad, y: n.y! + pad * 0.5, z: n.z! + pad }, { x: n.x!, y: n.y!, z: n.z! }, 600);
    }
    return true;
  }

  function clearPath() {
    clearOldPathState();
    labelsDirty = true;
    requestRender();
    refreshAllNodeColors();
    setLinkOpacity(ctx, pathNodeIds ? 0 : linkOpacity.value);
  }

  function getPathInfo() {
    if (!pathNodeIds) return null;
    return {
      path: pathNodeIds,
      totalSteps: pathNodeIds.length,
      currentStep: pathStepIndex,
      currentId: pathStepIndex >= 0 ? pathNodeIds[pathStepIndex] : null,
    };
  }

  // ── 12. 颜色管理 ──
  function refreshAllNodeColors() {
    const pathSet = pathNodeIds ? new Set(pathNodeIds) : null;
    for (let i = 0; i < nodes.length; i++) {
      const nd = nodes[i];
      let color: string;
      const isFocused = focusedId === nd.id;
      if (pathNodeIds && pathStepIndex >= 0 && nd.id === pathNodeIds[pathStepIndex]) {
        color = adjustHex(nd._cDefault, 70);
      } else if (pathSet?.has(nd.id)) {
        color = "#FF8C00";
      } else if (isFocused) {
        color = nd._cFocus;
      } else if (highlightedSet.size > 0 && highlightedSet.has(nd.id)) {
        color = nd._cHighlight;
      } else if (highlightedSet.size > 0) {
        color = nd._cDimmed;
      } else {
        color = nd._cDefault;
      }
      setNodeColor(ctx, i, color, false);

      // 聚焦节点放大 1.5x
      if (isFocused) {
        const deg = degreeMap[nd.id] || 1;
        const baseSz = nodeSize(deg, maxDegree);
        const bigSz = baseSz * FOCUS_NODE_SCALE;
        _focusScaleSz.set(bigSz, bigSz, bigSz);
        _focusScalePos.set(nd.x ?? 0, nd.y ?? 0, nd.z ?? 0);
        _focusScaleMatrix.compose(_focusScalePos, _focusScaleQuat, _focusScaleSz);
        ctx.nodes.setMatrixAt(i, _focusScaleMatrix);
        ctx.nodes.instanceMatrix.needsUpdate = true;
      }
    }
    if (ctx.nodes.instanceColor) ctx.nodes.instanceColor.needsUpdate = true;
  }

  // ── 13. 按需渲染：相机、画质和内容变化唤醒，静止时不申请下一帧 ──
  let labelsDirty = true;
  let labelsPending = false;
  let lastLabelScan = -Infinity;
  let labelScanTimer: ReturnType<typeof setTimeout> | null = null;
  let lastFrameTime = 0;
  let lastAutoHover = -Infinity;
  const cameraUp = new THREE.Vector3();
  const lastCameraPosition = new THREE.Vector3(Infinity, Infinity, Infinity);
  const lastCameraQuaternion = new THREE.Quaternion();
  const fpsDisplay = document.createElement("div");
  fpsDisplay.style.cssText =
    "position:absolute;top:0;left:50%;transform:translateX(-50%);z-index:10000;background:rgba(0,0,0,0.7);color:#0f0;padding:4px 8px;border-radius:4px;font:12px monospace;pointer-events:none;";
  container.appendChild(fpsDisplay);
  let fpsFrames = 0,
    fpsSince = performance.now();
  function hasFlightControlInput() {
    return !!(flyKeys.w || flyKeys.a || flyKeys.s || flyKeys.d || flyKeys.r || flyKeys.f || flyKeys.q || flyKeys.e);
  }
  function flightActive() {
    return (
      isFlyMode &&
      document.pointerLockElement === ctx.renderer.domElement &&
      (flyAutoPilot || hasFlightControlInput() || Math.abs(rollVelocity) > 1e-5)
    );
  }
  const renderScheduler = createRenderScheduler({
    requestFrame: requestAnimationFrame,
    cancelFrame: cancelAnimationFrame,
    isVisible: () => !document.hidden,
    maxFps: unlimitedFps ? Infinity : qualityOptions[quality].fps,
    onFrame(now) {
      const dt = lastFrameTime ? Math.min(0.05, (now - lastFrameTime) / 1000) : 1 / 60;
      lastFrameTime = now;
      let moving = false;
      if (isFlyMode) {
        moving = flightActive();
        if (moving) flyLoop(dt);
        if (!moving || now - lastAutoHover >= 120) {
          updateAutoHover();
          lastAutoHover = now;
        }
      } else {
        ctx.controls.dampingFactor = 1 - Math.pow(1 - 0.08, dt * 60);
        ctx.controls.update();
      }
      const cameraChanged =
        !lastCameraPosition.equals(ctx.camera.position) || !lastCameraQuaternion.equals(ctx.camera.quaternion);
      if (cameraChanged) {
        lastCameraPosition.copy(ctx.camera.position);
        lastCameraQuaternion.copy(ctx.camera.quaternion);
        labelsDirty = true;
        if (!isFlyMode) moving = true;
      }
      labelGroup.visible = labelShow.value && !focusedId;
      if (labelsDirty || labelsPending) {
        if (now - lastLabelScan >= 150) {
          if (labelScanTimer !== null) clearTimeout(labelScanTimer);
          labelScanTimer = null;
          labelsPending = ensureLabels();
          lastLabelScan = now;
          labelsDirty = false;
        }
      }
      // Reposition sprites only on a changed camera; quaternion catches orbit/roll in place.
      {
        for (const child of labelGroup.children) {
          const sprite = child as THREE.Sprite,
            np = (sprite as any)._nodePos;
          const dist = labelPoint.set(np.x, np.y, np.z).distanceTo(ctx.camera.position);
          sprite.visible = labelShow.value && !focusedId && dist < LABEL_MAX_FADE_START;
          sprite.material.opacity = Math.max(
            0,
            Math.min(1, (LABEL_MAX_FADE_START - dist) / (LABEL_MAX_FADE_START - LABEL_FADE_FULL)),
          );
        }
      }
      if (neighborLabelGroup.children.length) {
        const count = neighborLabelGroup.children.length;
        cameraUp.set(0, 1, 0).applyQuaternion(ctx.camera.quaternion);
        const fovScale = 2 * Math.tan((ctx.camera.fov * Math.PI) / 360);
        const viewHeight = Math.max(1, container.clientHeight);
        for (const child of neighborLabelGroup.children) {
          const sprite = child as THREE.Sprite,
            np = (sprite as any)._nodePos3d;
          const isFocused = (sprite as any)._isFocused;
          const offset = nodeSize(1, 1) + (isFocused ? 20 : 14);
          sprite.position.set(np.x + cameraUp.x * offset, np.y + cameraUp.y * offset, np.z + cameraUp.z * offset);
          const dist = ctx.camera.position.distanceTo(sprite.position);
          const pixelHeight = isFocused ? 24 : Math.max(12, 20 / (1 + count / 100));
          const worldH = Math.max(0.1, (dist * fovScale * pixelHeight) / viewHeight);
          const aspect = sprite.scale.y > 0 ? sprite.scale.x / sprite.scale.y : 1;
          sprite.scale.set(worldH * aspect, worldH, 1);
        }
      }
      ctx.renderer.info.reset();
      const renderStart = performance.now();
      ctx.renderer.render(ctx.scene, ctx.camera);
      renderCpuMs = performance.now() - renderStart;
      perfStats.frames++;
      fpsFrames++;
      // Label creation is spread over small batches. A deferred task wakes the
      // next batch without redrawing identical GPU frames while waiting for it.
      if ((labelsDirty || labelsPending) && labelScanTimer === null) {
        labelScanTimer = setTimeout(
          () => {
            labelScanTimer = null;
            requestRender();
          },
          Math.max(0, 150 - (now - lastLabelScan)),
        );
      }
      const continuing = moving || flightActive();
      if (!continuing) {
        fpsDisplay.textContent = `空闲停绘 | nodes:${nodes.length} | labels:${labelGroup.children.length}`;
        fpsFrames = 0;
        fpsSince = now;
        lastFrameTime = 0;
      } else if (now - fpsSince >= 1000) {
        fpsDisplay.textContent = `FPS:${Math.round((fpsFrames * 1000) / (now - fpsSince))} | nodes:${nodes.length} | labels:${labelGroup.children.length}`;
        fpsFrames = 0;
        fpsSince = now;
      }
      return continuing;
    },
  });
  ctx.requestRender = renderScheduler.request;
  ctx.controls.addEventListener("change", requestRender);
  function onVisibilityChange() {
    lastFrameTime = 0;
    if (document.hidden) {
      if (labelScanTimer !== null) clearTimeout(labelScanTimer);
      labelScanTimer = null;
      renderScheduler.pause();
    } else {
      labelsDirty = true;
      renderScheduler.resume();
    }
  }
  document.addEventListener("visibilitychange", onVisibilityChange);

  // ── 13b. 邻居大字标签点击/右键（独立 Raycaster，在节点交互之前注册）──
  const spriteRaycaster = new THREE.Raycaster();
  const spriteMouse = new THREE.Vector2();

  function hitTestNeighborSprite(event: MouseEvent): THREE.Sprite | null {
    if (neighborLabelGroup.children.length === 0) return null;
    const rect = ctx.renderer.domElement.getBoundingClientRect();
    spriteMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    spriteMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    spriteRaycaster.setFromCamera(spriteMouse, ctx.camera);
    const hits = spriteRaycaster.intersectObjects(neighborLabelGroup.children);
    return hits.length > 0 ? (hits[0].object as THREE.Sprite) : null;
  }

  // 左键 → 打开邻居 URL
  ctx.renderer.domElement.addEventListener("click", (event: MouseEvent) => {
    if (isFlyMode && document.pointerLockElement !== ctx.renderer.domElement) return;
    const sprite = hitTestNeighborSprite(event);
    if (sprite && (sprite as any)._neighborUrl) {
      event.stopImmediatePropagation();
      window.open((sprite as any)._neighborUrl, "_blank");
    }
  });

  // 右键 → 聚焦邻居节点
  ctx.renderer.domElement.addEventListener("contextmenu", (event: MouseEvent) => {
    if (isFlyMode && document.pointerLockElement !== ctx.renderer.domElement) return;
    const sprite = hitTestNeighborSprite(event);
    if (sprite && (sprite as any)._neighborId) {
      event.preventDefault();
      event.stopImmediatePropagation();
      focusNode((sprite as any)._neighborId);
    }
  });

  // ── 14. 交互事件 ──
  const tooltip = createTooltip();
  const interaction = createInteraction(ctx, nodes, FOCUS_NODE_SCALE);

  // 高亮叠加线网：按需创建两批实例化圆柱。
  const overlayGroup = new THREE.Group();
  overlayGroup.visible = false;
  ctx.scene.add(overlayGroup);

  // ── 共享几何体 ──
  // Adjacent segments meet; their interior end caps add overdraw with no visible benefit.
  const sharedHaloGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 6, 1, true);
  const sharedCoreGeom = new THREE.CylinderGeometry(0.18, 0.18, 1, 6, 1, true);
  const up_v = new THREE.Vector3(0, 1, 0);
  const quat_v = new THREE.Quaternion();
  const mid_v = new THREE.Vector3();
  const start_v = new THREE.Vector3();
  const end_v = new THREE.Vector3();
  const dir_v = new THREE.Vector3();

  // ── 共享材质（hover 和 focus 共用，运行时切换颜色/亮度）──
  const overlayHaloMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  const overlayCoreMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });

  let overlayHalo: THREE.InstancedMesh | null = null;
  let overlayCore: THREE.InstancedMesh | null = null;
  let overlayCapacity = 0;
  const overlayTransform = new THREE.Object3D();
  function reserveOverlay(capacity: number) {
    if (capacity <= overlayCapacity) return;
    if (overlayHalo && overlayCore) {
      overlayGroup.remove(overlayHalo, overlayCore);
      overlayHalo.dispose();
      overlayCore.dispose();
    }
    overlayCapacity = capacity;
    overlayHalo = new THREE.InstancedMesh(sharedHaloGeom, overlayHaloMat, capacity);
    overlayCore = new THREE.InstancedMesh(sharedCoreGeom, overlayCoreMat, capacity);
    overlayHalo.name = "overlay-halo";
    overlayCore.name = "overlay-core";
    overlayHalo.frustumCulled = overlayCore.frustumCulled = false;
    overlayHalo.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    overlayCore.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    overlayGroup.add(overlayHalo, overlayCore);
  }

  function buildOverlay(nodeId: string | null, color: THREE.ColorRepresentation) {
    perfStats.overlayBuilds++;
    if (!nodeId || !ctx.edgeStore) {
      overlayGroup.visible = false;
      return;
    }
    const edges = (incidentEdges.get(nodeId) || []).slice(0, maxOverlayEdges.value);
    if (!edges.length) {
      overlayGroup.visible = false;
      return;
    }
    reserveOverlay(edges.reduce((count, index) => count + ctx.edgeStore!.getSegmentCount(index), 0));
    const halo = overlayHalo!,
      core = overlayCore!;
    const baseColor = new THREE.Color(color);
    const isFocus = focusedId === nodeId;
    overlayHaloMat.color.copy(baseColor).multiplyScalar(isFocus ? 0.8 : 0.4);
    overlayHaloMat.opacity = isFocus ? 0.5 : 0.25;
    overlayCoreMat.color.copy(baseColor).multiplyScalar(isFocus ? 1.2 : 0.7);
    const focusScale = isFocus ? 2 : 1;
    let count = 0;
    for (const edgeIndex of edges) {
      const sample = ctx.edgeStore.sampleEdge(edgeIndex);
      for (let j = 0; j < sample.segmentCount; j++) {
        const base = j * 6,
          pos = sample.positions;
        start_v.set(pos[base], pos[base + 1], pos[base + 2]);
        end_v.set(pos[base + 3], pos[base + 4], pos[base + 5]);
        dir_v.subVectors(end_v, start_v);
        const len = dir_v.length();
        if (len < 0.01) continue;
        quat_v.setFromUnitVectors(up_v, dir_v.multiplyScalar(1 / len));
        mid_v.addVectors(start_v, end_v).multiplyScalar(0.5);
        overlayTransform.position.copy(mid_v);
        overlayTransform.quaternion.copy(quat_v);
        overlayTransform.scale.set(focusScale, len, focusScale);
        overlayTransform.updateMatrix();
        halo.setMatrixAt(count, overlayTransform.matrix);
        overlayTransform.scale.set(focusScale * 0.36, len, focusScale * 0.36);
        overlayTransform.updateMatrix();
        core.setMatrixAt(count, overlayTransform.matrix);
        count++;
      }
    }
    halo.count = core.count = count;
    halo.instanceMatrix.needsUpdate = core.instanceMatrix.needsUpdate = true;
    overlayGroup.visible = count > 0;
  }

  interaction.onHover = (n: any) => {
    const newHoveredId = n ? n.id : null;
    if (lastHoveredId === newHoveredId) return;
    const prevId = hoveredId;
    hoveredId = newHoveredId;
    lastHoveredId = newHoveredId;
    requestRender();
    if (prevId) {
      const pi = nodeIdToIndex.get(prevId);
      if (pi != null) setNodeColor(ctx, pi, nodes[pi]._cDefault);
    }
    if (n) {
      const ci = nodeIdToIndex.get(n.id);
      if (ci != null) setNodeColor(ctx, ci, nodes[ci]._cHover);
      if (!focusedId && !pathNodeIds) {
        const hoverColor = n ? new THREE.Color(n._cDefault || 0xeeeeee) : 0xeeeeee;
        buildOverlay(n.id, hoverColor);
      }
    } else {
      if (!focusedId && !pathNodeIds) buildOverlay(null, 0xffffff);
    }
    if (n) {
      const content = document.createElement("div");
      content.className = "card-body gap-2 p-4";
      const titleEl = document.createElement("strong");
      titleEl.className = "card-title text-sm leading-snug break-words";
      titleEl.textContent = n.name || n.id;
      content.appendChild(titleEl);
      if (n.desc) {
        const d = document.createElement("div");
        d.className = "text-xs leading-relaxed opacity-75 line-clamp-4";
        d.textContent = n.desc;
        content.appendChild(d);
      }
      if (n.url) {
        const a = document.createElement("a");
        a.href = n.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = n.url;
        a.className = "link link-primary text-xs break-all";
        content.appendChild(a);
        if (!isFlyMode) appendMiddleClickHint(content);
      }
      tooltip.show(
        content,
        isFlyMode ? window.innerWidth / 2 - 160 : (window as any).__lastMouseX || 0,
        isFlyMode ? window.innerHeight / 2 + 20 : (window as any).__lastMouseY || 0,
      );
    } else {
      tooltip.hide();
    }
  };

  ctx.renderer.domElement.addEventListener(
    "mousemove",
    (e: MouseEvent) => {
      (window as any).__lastMouseX = e.clientX;
      (window as any).__lastMouseY = e.clientY;
    },
    { capture: true },
  );

  interaction.onClick = (n: any) => {
    if ((window as any).__touchLongPress) return;
    if (n.url) window.open(n.url, "_blank");
  };
  interaction.onMiddleClick = (n: any) => {
    if (n.url) window.open(n.url, "_blank", "noopener,noreferrer");
  };
  interaction.onRightClick = (n: any) => {
    if (focusedId === n.id) {
      clearHighlights();
    } else {
      focusNodeById(n.id);
    }
  };

  // ── 15. 聚焦（统一入口）──

  /** 对外统一聚焦入口：总是先清除旧状态，再聚焦 */
  function focusNode(id: string) {
    clearHighlights();
    focusNodeById(id);
  }

  function focusNodeById(id: string) {
    // 恢复上一个聚焦节点尺寸
    if (focusedId && focusedId !== id) {
      restoreNodeScale(focusedId);
    }
    focusedId = id;
    labelsDirty = true;
    requestRender();
    refreshAllNodeColors();
    const focusNode = getNode(id);
    const focusOverlayColor = focusNode ? new THREE.Color(focusNode._cDefault) : new THREE.Color(0xffdd44);
    buildOverlay(id, focusOverlayColor);
    updateNeighborPanel(id);
    buildNeighborLabels(id);
    const node = getNode(id);
    if (node && node.x != null) {
      const pad = 250;
      animateCamera(
        ctx,
        { x: node.x + pad, y: node.y! + pad * 0.5, z: node.z! + pad },
        { x: node.x!, y: node.y!, z: node.z! },
        800,
      );
    }
  }

  /** 恢复节点到原始尺寸 */
  function restoreNodeScale(id: string) {
    const idx = nodeIdToIndex.get(id);
    if (idx == null) return;
    const nd = nodes[idx];
    if (nd.x == null) return;
    const deg = degreeMap[id] || 1;
    const sz = nodeSize(deg, maxDegree);
    _focusScaleSz.set(sz, sz, sz);
    _focusScalePos.set(nd.x, nd.y ?? 0, nd.z ?? 0);
    _focusScaleMatrix.compose(_focusScalePos, _focusScaleQuat, _focusScaleSz);
    ctx.nodes.setMatrixAt(idx, _focusScaleMatrix);
    ctx.nodes.instanceMatrix.needsUpdate = true;
  }

  function highlightNodesAndNeighbors(ids: string[]) {
    highlightedSet = new Set(ids);
    for (const id of ids) {
      const nbrs = neighborMap.get(id);
      if (nbrs) for (const nb of nbrs) highlightedSet.add(nb);
    }
    labelsDirty = true;
    requestRender();
    refreshAllNodeColors();
  }

  function clearHighlights() {
    highlightedSet.clear();
    if (focusedId) {
      // 恢复原节点尺寸
      restoreNodeScale(focusedId);
      focusedId = null;
      updateNeighborPanel(null);
      buildOverlay(null, 0xffffff);
      clearNeighborLabels();
    }
    labelsDirty = true;
    requestRender();
    refreshAllNodeColors();
  }

  function focusByDomain(domain: string) {
    const node = nodes.find((n) => {
      try {
        // 支持两种模式：
        //   ?local=example.com       → 按 hostname 匹配
        //   ?local=https://example.com → 按完整 URL 匹配
        const url = new URL(n.url);
        if (domain.startsWith("http://") || domain.startsWith("https://")) {
          return n.url === domain || url.href === domain;
        }
        return url.hostname === domain;
      } catch {
        return false;
      }
    });
    if (node) focusNode(node.id);
  }

  // ── 16. 飞船模式 ──
  let isFlyMode = false;
  const flyKeys: Record<string, boolean> = {};
  let flyAutoPilot = false;
  const SHIFT_MULTIPLIER = 3;
  let rollVelocity = 0; // Q/E 横滚速度（带阻尼平滑）
  let flyCrosshair: HTMLElement | null = null;
  let flyOnKeyDown: ((e: KeyboardEvent) => void) | null = null;
  let flyOnKeyUp: ((e: KeyboardEvent) => void) | null = null;
  let flyOnMouseMove: ((e: MouseEvent) => void) | null = null;
  let flyOnBlur: (() => void) | null = null;
  let autoHoverId: string | null = null;
  let pointerLockError: string | null = null;
  const _flightMove = new THREE.Vector3();

  function updatePointerLockStatus(message?: string) {
    const status = document.getElementById("fly-pointer-status");
    if (status)
      status.textContent =
        message ||
        (document.pointerLockElement === ctx.renderer.domElement
          ? "鼠标已锁定 · 移动鼠标转向 · Esc 释放后暂停飞行"
          : "点击宇宙画面锁定鼠标；WASD 只负责平移");
  }

  function createCrosshair(): HTMLElement {
    let el = document.getElementById("fly-crosshair");
    if (el) return el;
    el = document.createElement("div");
    el.id = "fly-crosshair";
    el.style.cssText =
      "position:fixed;top:50%;left:50%;pointer-events:none;z-index:10000;transform:translate(-50%,-50%);display:none;";
    el.innerHTML = `<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" fill="none" stroke="#0f0" stroke-width="1.5" opacity="0.7"/><circle cx="10" cy="10" r="2" fill="#0f0" opacity="0.9"/></svg>`;
    document.body.appendChild(el);
    return el;
  }

  function handleFlyKey(e: KeyboardEvent, down: boolean) {
    if (!isFlyMode) return;
    if (down && isEditableFlightTarget(e.target)) return;
    const action = flightActionForKeyEvent(e);
    if (!action) return;
    if (action === "x" && down) {
      e.preventDefault();
      exitFlyMode();
      return;
    }
    if (down && document.pointerLockElement !== ctx.renderer.domElement) return;
    if (["w", "a", "s", "d", "r", "f", "q", "e", "shift"].includes(action)) {
      e.preventDefault();
      if (flyKeys[action] === down) return;
      flyKeys[action] = down;
      requestRender();
    }
    if (action === " " && down && !e.repeat) {
      e.preventDefault();
      flyAutoPilot = !flyAutoPilot;
      requestRender();
      const statusEl = document.getElementById("fly-autopilot-status");
      if (statusEl) {
        statusEl.textContent = flyAutoPilot ? "ON" : "OFF";
        statusEl.style.color = flyAutoPilot ? "#4f8" : "#888";
      }
    }
  }

  function onPointerLockChange() {
    if (!isFlyMode) return;
    // ESC 不再退出飞船模式，只是临时释放鼠标
    // 点击 canvas 重新锁定，按 X 或点击按钮退出
    if (document.pointerLockElement !== ctx.renderer.domElement) {
      document.body.style.cursor = "default";
      for (const key of Object.keys(flyKeys)) flyKeys[key] = false;
      rollVelocity = 0;
      requestRender();
    } else {
      pointerLockError = null;
      document.body.style.cursor = "none";
      requestRender();
    }
    updatePointerLockStatus();
  }
  async function flyReLock() {
    if (!isFlyMode || disposed || !ctx.renderer.domElement.isConnected || document.pointerLockElement) return;
    if (!ctx.renderer.domElement.requestPointerLock) {
      updatePointerLockStatus("当前浏览器不支持鼠标锁定，请使用轨道模式浏览");
      return;
    }
    try {
      await ctx.renderer.domElement.requestPointerLock();
    } catch (error) {
      pointerLockError = error instanceof DOMException ? error.name : "PointerLockError";
      document.body.style.cursor = "default";
      updatePointerLockStatus(
        pointerLockError === "WrongDocumentError"
          ? "请先激活浏览器窗口，再点击宇宙画面锁定鼠标"
          : "鼠标未锁定，请再次点击宇宙画面；仍失败可退出飞船模式",
      );
    }
  }

  function updateAutoHover() {
    const started = performance.now();
    perfStats.autoHoverScans++;
    const bestNode = interaction.pickAtCenter();
    perfStats.autoHoverCandidates += interaction.lastPickCandidateCount;

    const newId = bestNode ? bestNode.id : null;
    if (newId === autoHoverId) {
      perfStats.autoHoverCpuMs += performance.now() - started;
      return;
    }
    autoHoverId = newId;

    if (flyCrosshair) flyCrosshair.classList.toggle("locked", !!newId);
    tooltip.hide();

    if (bestNode) {
      const content = document.createElement("div");
      content.className = "card-body gap-2 p-4";
      const titleEl = document.createElement("strong");
      titleEl.className = "card-title text-sm leading-snug break-words";
      titleEl.textContent = bestNode.name || bestNode.id;
      content.appendChild(titleEl);
      if (bestNode.desc) {
        const descEl = document.createElement("div");
        descEl.className = "text-xs leading-relaxed opacity-75 line-clamp-4";
        descEl.textContent = bestNode.desc;
        content.appendChild(descEl);
      }
      if (bestNode.url) {
        const urlEl = document.createElement("div");
        const a = document.createElement("a");
        a.href = bestNode.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = bestNode.url;
        a.className = "link link-primary text-xs break-all";

        urlEl.appendChild(a);
        content.appendChild(urlEl);
      }
      tooltip.show(content, window.innerWidth / 2 - 160, window.innerHeight / 2 + 20);
    }
    perfStats.autoHoverCpuMs += performance.now() - started;
  }

  function flyLoop(dt: number) {
    if (!isFlyMode) return;
    const cam = ctx.camera;
    applyFlightTranslation(
      cam,
      flyKeys as Partial<Record<FlightAction, boolean>>,
      flyAutoPilot,
      (flyKeys.shift ? SHIFT_MULTIPLIER : 1) * MOVE_SPEED,
      dt,
      _flightMove,
    );
    const rollInput = (flyKeys.q ? 1 : 0) - (flyKeys.e ? 1 : 0);
    rollVelocity = applyFlightRoll(cam, rollVelocity, rollInput, dt);
  }

  function enterFlyMode() {
    ctx.cancelCameraAnimation();
    requestRender();
    isFlyMode = true;
    ctx.controls.enabled = false;
    rollVelocity = 0;
    document.addEventListener("pointerlockchange", onPointerLockChange);
    ctx.renderer.domElement.addEventListener("click", flyReLock);
    // 切换旋转顺序前保存朝向，避免视觉闪烁
    const savedQuat = ctx.camera.quaternion.clone();
    ctx.camera.rotation.order = "YXZ";
    ctx.camera.quaternion.copy(savedQuat);
    flyCrosshair = createCrosshair();
    flyCrosshair.style.display = "block";
    document.body.style.cursor = document.pointerLockElement === ctx.renderer.domElement ? "none" : "default";
    flyOnKeyDown = (e) => handleFlyKey(e, true);
    flyOnKeyUp = (e) => handleFlyKey(e, false);
    document.addEventListener("keydown", flyOnKeyDown);
    document.addEventListener("keyup", flyOnKeyUp);
    flyOnMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== ctx.renderer.domElement) return;
      if (applyFlightLook(ctx.camera, e.movementX, e.movementY)) {
        labelsDirty = true;
        requestRender();
      }
    };
    ctx.renderer.domElement.addEventListener("mousemove", flyOnMouseMove);
    flyOnBlur = () => {
      for (const key of Object.keys(flyKeys)) flyKeys[key] = false;
      rollVelocity = 0;
      requestRender();
    };
    window.addEventListener("blur", flyOnBlur);

    interaction.setFlyMode(true);

    const hud = document.getElementById("fly-hud");
    if (hud) hud.hidden = false;
    // 同步按钮文字
    const flyBtn = document.getElementById("fly-toggle");
    if (flyBtn) flyBtn.textContent = "🌐 球幕模式";
    updatePointerLockStatus();
    void flyReLock();
  }

  function exitFlyMode() {
    requestRender();
    isFlyMode = false;
    // 同步 OrbitControls target 到当前视线方向
    const lookTarget = new THREE.Vector3();
    ctx.camera.getWorldDirection(lookTarget);
    levelFlightCamera(ctx.camera);
    lookTarget.multiplyScalar(200).add(ctx.camera.position);
    ctx.controls.target.copy(lookTarget);
    ctx.controls.enabled = true;
    if (flyOnKeyDown) document.removeEventListener("keydown", flyOnKeyDown);
    if (flyOnKeyUp) document.removeEventListener("keyup", flyOnKeyUp);
    if (flyOnMouseMove) ctx.renderer.domElement.removeEventListener("mousemove", flyOnMouseMove);
    if (flyOnBlur) window.removeEventListener("blur", flyOnBlur);
    ctx.renderer.domElement.removeEventListener("click", flyReLock);
    flyOnKeyDown = flyOnKeyUp = flyOnMouseMove = flyOnBlur = null;
    document.removeEventListener("pointerlockchange", onPointerLockChange);
    try {
      document.exitPointerLock?.();
    } catch {}
    if (flyCrosshair) {
      flyCrosshair.style.display = "none";
      flyCrosshair = null;
    }
    const hud = document.getElementById("fly-hud");
    if (hud) hud.hidden = true;
    interaction.setFlyMode(false);
    // 同步按钮文字
    const flyBtn = document.getElementById("fly-toggle");
    if (flyBtn) flyBtn.textContent = "🚀 飞船模式";
    document.body.style.cursor = "";
  }

  function toggleFlightMode(): boolean {
    if (isFlyMode) exitFlyMode();
    else enterFlyMode();
    return isFlyMode;
  }

  // ── 17. 启动 ──
  // 初始视角：星系密度中心附近，四周可见星点
  {
    let cx = 0,
      cy = 0,
      cz = 0,
      tw = 0;
    for (const n of nodes) {
      const w = degreeMap[n.id] ? Math.max(1, degreeMap[n.id]) : 1;
      cx += (n.x ?? 0) * w;
      cy += (n.y ?? 0) * w;
      cz += (n.z ?? 0) * w;
      tw += w;
    }
    const center = new THREE.Vector3(cx / tw, cy / tw, cz / tw);
    ctx.camera.position.set(center.x + 300, center.y + 200, center.z + 300);
    ctx.controls.target.copy(center);
    ctx.controls.update();
  }
  requestRender();

  // ── 18. Resize ──
  ctx.renderer.domElement.addEventListener("pointerdown", () => ctx.cancelCameraAnimation());
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) continue;
      ctx.renderer.setSize(width, height);
      ctx.camera.aspect = width / height;
      ctx.camera.updateProjectionMatrix();
      labelsDirty = true;
      requestRender();
    }
  });
  ro.observe(container);

  // ── 19. 公开 API ──
  async function find(query: string, signal?: AbortSignal) {
    if (!query?.trim() || disposed || signal?.aborted) return [];
    try {
      const index = await getSearchIndex();
      if (disposed || signal?.aborted) return [];
      const results = await index.find(query);
      return disposed || signal?.aborted ? [] : results;
    } catch (error) {
      if (disposed && error instanceof DOMException && error.name === "AbortError") return [];
      throw error;
    }
  }

  function getGraphData() {
    return { nodes, links };
  }

  function disposeGraph() {
    if (disposed) return;
    disposed = true;
    searchIndexPromise = null;
    searchIndexReady = false;
    if (isFlyMode) exitFlyMode();
    lazyAbort.abort();
    ctx.controls.dispose();
    renderScheduler.dispose();
    if (labelScanTimer !== null) clearTimeout(labelScanTimer);
    labelScanTimer = null;
    document.removeEventListener("visibilitychange", onVisibilityChange);
    ctx.controls.removeEventListener("change", requestRender);
    ro.disconnect();
    interaction.dispose();
    clearOldPathState();
    clearNeighborLabels();
    for (const child of labelGroup.children.slice()) removeLabel(child as THREE.Sprite);
    overlayHalo?.dispose();
    overlayCore?.dispose();
    sharedHaloGeom.dispose();
    sharedCoreGeom.dispose();
    overlayHaloMat.dispose();
    overlayCoreMat.dispose();
    for (const id of ["graph-control-panel", "neighbor-panel"]) {
      destroyPanel(id);
      document.getElementById(id)?.remove();
    }
    tooltip.el.remove();
    document.getElementById("fly-crosshair")?.remove();
    disposeRenderer(ctx);
    ctx.renderer.domElement.remove();
    fpsDisplay.remove();
    if (window.__graphApi === api) delete window.__graphApi;
    if (disposeActiveGraph === disposeGraph) disposeActiveGraph = null;
  }
  disposeActiveGraph = disposeGraph;

  const api = {
    find,
    focusNode,
    focusNodeById, // 内部使用，不走 clearHighlights
    highlightNodesAndNeighbors,
    clearHighlights,
    focusByDomain,
    toggleFlightMode,
    showShortestPath,
    stepPathNext,
    stepPathPrev,
    clearPath,
    getPathInfo,
    getGraphData,
    loadBezierLazy, // 可选显式加载；常规悬停、聚焦和背景线显示均使用运行时采样
    ctx,
    dispose: disposeGraph,
    getPerformanceStats() {
      let sceneObjects = 0;
      ctx.scene.traverse(() => sceneObjects++);
      return {
        ...perfStats,
        searchIndexReady,
        searchIndexLoading: searchIndexPromise !== null && !searchIndexReady,
        bezierLoaded: _bezierLoaded,
        bezierLoading: _bezierLoading,
        sceneObjects,
        pendingFrame: renderScheduler.pending,
        pendingLabelTask: labelScanTimer !== null,
        pointerLocked: document.pointerLockElement === ctx.renderer.domElement,
        pointerLockError,
        flightMode: isFlyMode,
        flightKeys: Object.keys(flyKeys).filter((key) => flyKeys[key]),
        flightRollVelocity: rollVelocity,
        flightSpeed: MOVE_SPEED,
        flightAutoSpeed: autoFlightSpeed,
        flightSpeedMin,
        flightSpeedMax,
        flightSpeedCount: flightSpeedProfile.count,
        flightSpeedVolume: flightSpeedProfile.volume,
        flightSpeedSpacing: flightSpeedProfile.spacing,
        quality,
        fpsLimit: unlimitedFps ? "unlimited" : qualityOptions[quality].fps,
        pixelRatio: ctx.renderer.getPixelRatio(),
        drawCalls: ctx.renderer.info.render.drawCalls,
        triangles: ctx.renderer.info.render.triangles,
        lines: ctx.renderer.info.render.lines,
        renderCpuMs,
        // Three.js accounting, not a measurement of total device VRAM.
        rendererTrackedBytes: ctx.renderer.info.memory.total,
        backgroundBytes:
          (ctx.linkLines.geometry.getAttribute("position")?.array.byteLength || 0) +
          (ctx.linkLines.geometry.getAttribute("color")?.array.byteLength || 0) +
          (ctx.linkLines.geometry.index?.array.byteLength || 0),
        overlayInstances: overlayGroup.visible ? overlayHalo?.count || 0 : 0,
        labels: labelGroup.children.length,
        neighborLabels: neighborLabelGroup.children.length,
      };
    },
    updateLinkOpacity(v: number) {
      linkOpacity.value = v;
      saveVal("link_opacity", v);
      refreshLinkColors();
    },
  };
  (window as any).__graphApi = api;
  return api;
}

/**
 * 应用贝塞尔曲线数据到连线几何体（从预构建数据手动解包）
 * 可用于初始加载或懒加载后更新连线
 */
export function applyBezierData(
  ctx: RenderContext,
  bezier: { lseg: number[]; lpx: Float32Array; lpy: Float32Array; lpz: Float32Array },
  linkArr: Array<{ source: string; target: string }>,
  nodeIdToIndex: Map<string, number>,
  nodes: any[],
  maxOverlayEdges: number,
  linkOpacity: number,
) {
  void maxOverlayEdges;
  updateLinkPositions(ctx, linkArr, nodeIdToIndex, nodes, linkOpacity, bezier);
}

/** Int16 → Float32 反量化 */
function dequantize(i16: Int16Array, min: number, max: number): Float32Array {
  const range = max - min || 1;
  const out = new Float32Array(i16.length);
  for (let i = 0; i < i16.length; i++) {
    out[i] = min + (range * (i16[i] + 32768)) / 65535;
  }
  return out;
}

// ─── 紧凑格式展开 ────────────────────────────────────────────────────

export function expandCompact(c: any): GraphData {
  const { nid, nnm, nur, nfa, nde, nx, ny, nz, ndeg, ladj_off, ladj } = c;
  const nodes = nid.map((_id: string, i: number) => ({
    id: nid[i],
    name: nnm[i],
    url: nur[i],
    favicon: nfa[i],
    desc: nde[i],
    ...(nx ? { x: nx[i], y: ny[i], z: nz[i] } : {}),
    ...(ndeg ? { _degree: ndeg[i] } : {}),
  }));
  const links = (c.ls || []).map((s: number, i: number) => {
    const l: { source: string; target: string; symbol?: string[] } = {
      source: nid[s],
      target: nid[c.lt[i]],
    };
    // lsym[i] === 1 表示单向（旧数据无 lsym 时默认双向）
    if (c.lsym?.[i]) l.symbol = ["none", "arrow"];
    return l;
  });
  return {
    nodes,
    links,
    categories: c.c || [],
    adjacency: ndeg ? { ndeg, ladj_off, ladj } : {},
    bezier: null,
  };
}

/** zstd magic bytes: 0x28 0xB5 0x2F 0xFD */
function isZstd(buf: Uint8Array): boolean {
  return buf.length >= 4 && buf[0] === 0x28 && buf[1] === 0xb5 && buf[2] === 0x2f && buf[3] === 0xfd;
}

let _zstdInit: Promise<typeof ZstdDecompressFn> | null = null;
async function ensureZstd(): Promise<typeof ZstdDecompressFn> {
  if (!_zstdInit) {
    _zstdInit = (async () => {
      const mod = await import("@bokuweb/zstd-wasm");
      await mod.init();
      return mod.decompress;
    })();
  }
  return _zstdInit;
}

export async function maybeDecompress(buf: Uint8Array): Promise<Uint8Array> {
  if (isZstd(buf)) {
    const decompress = await ensureZstd();
    return decompress(buf);
  }
  return buf;
}

export async function init3dFromUrl(coreUrl: string, signal?: AbortSignal, bezierUrl?: string) {
  const [coreRes, bezierRes] = await Promise.all([
    fetch(coreUrl, { signal }),
    bezierUrl ? fetch(bezierUrl, { signal }).catch(() => null) : Promise.resolve(null),
  ]);

  if (!coreRes.ok) {
    throw new Error(`获取图数据失败: ${coreRes.status}`);
  }

  const [coreBuf, bezierBuf] = await Promise.all([
    coreRes.arrayBuffer(),
    bezierRes?.ok ? bezierRes.arrayBuffer() : Promise.resolve(null),
  ]);

  // zstd 延迟初始化：仅在检测到 magic bytes 时动态加载 WASM
  const coreRaw = await maybeDecompress(new Uint8Array(coreBuf));
  signal?.throwIfAborted();
  const core = decode(coreRaw) as any;
  const data = core.nid ? expandCompact(core) : (core as GraphData);

  // 合并贝塞尔数据（可选，缺失时 init3d 内部走 updateLinkPositions 回退）
  if (bezierBuf) {
    try {
      const bezierRaw = await maybeDecompress(new Uint8Array(bezierBuf));
      const bezier = decode(bezierRaw) as any;
      if (bezier.lpx) {
        // Binary payloads may begin at an odd byte offset in the MessagePack frame.
        (data as any).bezier = {
          lseg: bezier.lseg,
          lpx: dequantize(asInt16(bezier.lpx), bezier.lpx_min, bezier.lpx_max),
          lpy: dequantize(asInt16(bezier.lpy), bezier.lpy_min, bezier.lpy_max),
          lpz: dequantize(asInt16(bezier.lpz), bezier.lpz_min, bezier.lpz_max),
        };
      }
    } catch {
      // bezier 解码/反量化失败，静默降级
    }
  }

  signal?.throwIfAborted();
  return init3d(data, signal);
}
