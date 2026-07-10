/**
 * 3D 博客宇宙渲染模块（Three.js InstancedMesh）
 * 使用 Three.js 原生 InstancedMesh 替代 3d-force-graph
 */
import FlexSearch from "flexsearch";
import * as THREE from "three";
import { decode } from "msgpackr";
import type { decompress as ZstdDecompressFn } from "@bokuweb/zstd-wasm";
import { adjustHex, createTextSprite, hashToIndex, PALETTE } from "./utils";
import { MAX_EDGE_SEGMENTS } from "../../utils/bezier";
import {
  animateCamera,
  createRenderer,
  EDGE_SEGMENTS,
  nodeSize,
  setNodeColor,
  updateAllNodePositions,
  updateLinkPositions,
  type NodeState,
  type RenderContext,
} from "./renderer";
import { createInteraction } from "./interaction";
import { findShortestPath } from "./pathfinder";
import type { GraphData } from "../../../types/graph";

// ─── 常量 ──────────────────────────────────────────────────────────

const FOCUS_NODE_SCALE = 1.5;
const DEFAULT_MAX_OVERLAY_EDGES = 300;

/** 贝塞尔段数缓存，供 buildOverlay 使用 */
let _cachedLseg: number[] | null = null;

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
    el.style.position = "fixed";
    el.style.pointerEvents = "none";
    el.style.zIndex = "9999";
    el.style.background = "rgba(0,0,0,0.75)";
    el.style.color = "#fff";
    el.style.padding = "8px 10px";
    el.style.borderRadius = "6px";
    el.style.maxWidth = "320px";
    el.style.fontSize = "13px";
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

// ─── 可拖拽面板 ─────────────────────────────────────────────────────

function makeDraggable(el: HTMLElement, handle: HTMLElement) {
  let isDragging = false;
  let startX = 0,
    startY = 0;
  let origLeft = 0,
    origRight = 0,
    origTop = 0,
    origBottom = 0;

  function initPos() {
    const cs = getComputedStyle(el);
    origLeft = parseFloat(cs.left) || 0;
    origRight = parseFloat(cs.right) || 0;
    origTop = parseFloat(cs.top) || 0;
    origBottom = parseFloat(cs.bottom) || 0;
  }

  handle.style.cursor = "grab";
  handle.addEventListener("mousedown", (e) => {
    if ((e.target as HTMLElement).tagName === "BUTTON") return;
    e.preventDefault();
    isDragging = true;
    handle.style.cursor = "grabbing";
    initPos();
    startX = e.clientX;
    startY = e.clientY;
    // 如果使用了 transform（如 translateY(-50%)），拖拽时移除并换算为 top
    const xf = getComputedStyle(el).transform;
    if (xf && xf !== "none") {
      const rect = el.getBoundingClientRect();
      el.style.top = rect.top + "px";
      el.style.left = rect.left + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
      el.style.transform = "none";
      origLeft = rect.left;
      origTop = rect.top;
      origRight = 0;
      origBottom = 0;
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    // Switch to left/top based positioning if currently right/bottom
    if (origRight > 0 && origLeft === 0) {
      el.style.removeProperty("right");
      const initLeft = window.innerWidth - el.offsetWidth - origRight;
      el.style.left = initLeft + dx + "px";
    } else {
      el.style.left = origLeft + dx + "px";
    }
    if (origBottom > 0 && origTop === 0) {
      el.style.removeProperty("bottom");
      const initTop = window.innerHeight - el.offsetHeight - origBottom;
      el.style.top = initTop + dy + "px";
    } else {
      el.style.top = origTop + dy + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      handle.style.cursor = "grab";
    }
  });
}

// ─── 初始化 ──────────────────────────────────────────────────────────

export async function init3d(graphData: GraphData) {
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

  // ── 4. 搜索索引（FlexSearch full 分词，CJK 友好）──
  const searchIndex = new FlexSearch.Index({
    tokenize: "full",
    cache: true,
  });
  const searchStore = new Map<string, { id: string; name: string; url: string; description: string }>();
  for (const n of nodes) {
    const id = n.id;
    if (!id) continue;
    const name = n.name || id;
    const url = n.url || "";
    const desc = n.desc || "";
    // 中文按字索引 + 拼音辅助：name 和 url 和 desc 一起索引
    const text = `${name} ${url} ${desc} ${id}`;
    searchIndex.add(id, text);
    const existing = searchStore.get(id);
    if (existing) {
      // 重复 ID 的节点合并名称
      if (name && !existing.name.includes(name)) {
        // 更新名称（保留更完整的）
        if (name.length > existing.name.length) existing.name = name;
      }
    } else {
      searchStore.set(id, { id, name, url, description: desc });
    }
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

  // ── 6d. 节点索引映射 ──
  const linkArr = links as Array<{ source: string; target: string }>;
  const nodeIdToIndex = new Map<string, number>();
  nodes.forEach((n, i) => nodeIdToIndex.set(n.id, i));

  // ── 6e. 可复用对象（聚焦缩放 / 导航用，避免 GC）──
  const _focusScaleMatrix = new THREE.Matrix4();
  const _focusScalePos = new THREE.Vector3();
  const _focusScaleQuat = new THREE.Quaternion();
  const _focusScaleSz = new THREE.Vector3();

  // ── 7. 渲染器 ──
  const ctx: RenderContext = await createRenderer(container, nodes.length, linkArr.length);

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
    applyBezierData(ctx, _bezier, linkArr, nodeIdToIndex, nodes, maxOverlayEdges.value, linkOpacity.value);
  } else {
    updateLinkPositions(ctx, linkArr, nodeIdToIndex, nodes, linkOpacity.value);
  }

  // ── bezier 懒加载（首次交互时触发）──
  let _bezierLoaded = !!_bezier;
  let _bezierLoading = false;

  async function loadBezierLazy() {
    if (_bezierLoaded || _bezierLoading) return;
    _bezierLoading = true;
    try {
      const h = (window as any).__BIN_HASHES;
      const bezierUrl = h?.bezier ? `/graph-bezier.${h.bezier}.bin` : "/graph-bezier.bin";
      const res = await fetch(bezierUrl);
      if (!res.ok) return;
      const buf = await res.arrayBuffer();
      const raw = await maybeDecompress(new Uint8Array(buf));
      const bezierData = decode(raw) as any;
      if (!bezierData.lpx) return;

      const asI16 = (arr: any) =>
        arr instanceof Int16Array ? arr : new Int16Array(arr.buffer, arr.byteOffset, arr.byteLength / 2);
      const bz = {
        lseg: bezierData.lseg,
        lpx: dequantize(asI16(bezierData.lpx), bezierData.lpx_min, bezierData.lpx_max),
        lpy: dequantize(asI16(bezierData.lpy), bezierData.lpy_min, bezierData.lpy_max),
        lpz: dequantize(asI16(bezierData.lpz), bezierData.lpz_min, bezierData.lpz_max),
      };
      applyBezierData(ctx, bz, linkArr, nodeIdToIndex, nodes, maxOverlayEdges.value, linkOpacity.value);
      _bezierLoaded = true;
      _needsRender = true;
    } catch {
      // 静默降级为直线
    }
  }

  function refreshLinkColors() {
    (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = linkOpacity.value;
    saveVal("link_opacity", linkOpacity.value);
    _needsRender = true;
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
  const LABEL_CREATE_DIST = 600; // 创建标签的最大相机距离
  const nodeIdToLabelIndex = new Map<string, number>(); // 反查 label index
  nodes.forEach((n, i) => nodeIdToLabelIndex.set(n.id, i));

  function ensureLabels() {
    const show = labelShow.value;
    if (!show || focusedId) return; // 聚焦时关闭默认标签，避免与屏幕空间标签重叠
    const camPos = ctx.camera.position;

    for (let i = 0; i < nodes.length; i++) {
      if (labelsCreated.has(i)) continue;
      const n = nodes[i];
      if (n.x == null) continue;
      const dx = n.x - camPos.x,
        dy = (n.y || 0) - camPos.y,
        dz = (n.z || 0) - camPos.z;
      const sqDist = dx * dx + dy * dy + dz * dz;
      if (sqDist > LABEL_CREATE_DIST * LABEL_CREATE_DIST) continue;

      labelsCreated.add(i);
      const name = n.name || n.id;
      if (name.length > 40) continue;
      const sz = nodeSize(degreeMap[n.id] || 1, maxDegree);
      const worldHeight = 12;
      const sprite = createTextSprite(name, worldHeight, 48);
      const offset = sz + worldHeight * 0.5 + 2;
      sprite.position.set(n.x!, n.y! + offset, n.z!);
      (sprite as any)._nodePos = { x: n.x, y: n.y, z: n.z };
      (sprite as any)._nodeIndex = i; // 记录节点索引用于销毁
      (sprite as any)._lastNear = performance.now();
      labelGroup.add(sprite);
    }
  }

  // 定期销毁远离相机的标签（每 10 秒，距离 > 2000 超过 20 秒）
  let _lastPrune = 0;
  const PRUNE_DIST = 1500;
  const PRUNE_DELAY = 20000;
  function pruneLabels() {
    const now = performance.now();
    if (now - _lastPrune < 10000) return;
    _lastPrune = now;

    const toRemove: THREE.Sprite[] = [];
    for (const child of labelGroup.children) {
      const sprite = child as THREE.Sprite;
      const np = (sprite as any)._nodePos;
      if (!np) continue;
      const dx = np.x - ctx.camera.position.x;
      const dy = np.y - ctx.camera.position.y;
      const dz = np.z - ctx.camera.position.z;
      const sqDist = dx * dx + dy * dy + dz * dz;
      if (sqDist < PRUNE_DIST * PRUNE_DIST) {
        (sprite as any)._lastNear = now;
      } else if (now - ((sprite as any)._lastNear || now) > PRUNE_DELAY) {
        toRemove.push(sprite);
      }
    }
    for (const sprite of toRemove) {
      const idx = (sprite as any)._nodeIndex;
      if (idx != null) labelsCreated.delete(idx);
      sprite.material.map?.dispose();
      sprite.material.dispose();
      labelGroup.remove(sprite);
    }
  }

  // ── 9. 控制面板 ──
  let MOVE_SPEED = 15;
  function createControlPanel() {
    let panel = document.getElementById("graph-control-panel") as HTMLElement | null;
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "graph-control-panel";

    // 标题栏（可拖拽 + X 关闭）
    const header = document.createElement("div");
    header.className = "cp-header";
    header.style.cssText =
      "display:flex;align-items:center;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,0.08);cursor:grab;user-select:none;";
    const titleEl = document.createElement("span");
    titleEl.textContent = "控制面板";
    titleEl.style.cssText = "font-size:13px;color:#aaa;flex:1;";
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.cssText =
      "background:none;border:none;color:#aaa;cursor:pointer;font-size:16px;padding:0 4px;line-height:1;";
    closeBtn.addEventListener("click", () => {
      panel!.style.display = "none";
    });
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    panel.appendChild(header);

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
      slider.min = min;
      slider.max = max;
      slider.step = step;
      slider.value = defaultValue;
      slider.style.cssText = "width:100%;accent-color:#4a9eff;";
      const val = document.createElement("span");
      val.textContent = defaultValue + (unit || "");
      val.style.cssText = "font-size:11px;color:#aaa;margin-left:6px;";
      slider.addEventListener("input", () => {
        const v = parseFloat(slider.value);
        val.textContent = slider.value + (unit || "");
        onChange(v);
      });
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;";
      row.appendChild(slider);
      row.appendChild(val);
      parent.appendChild(label);
      parent.appendChild(row);
    }

    addSliderRow(panel, "连线透明度", "0", "1", "0.05", String(linkOpacity.value), (v) => {
      linkOpacity.value = v;
      refreshLinkColors();
    });
    addSliderRow(panel, "飞船速度", "5", "100", "5", String(MOVE_SPEED), (v) => {
      MOVE_SPEED = v;
    });

    {
      const lbl = document.createElement("label");
      lbl.textContent = "节点标签";
      lbl.style.cssText = "font-size:12px;color:#aaa;display:block;margin-bottom:4px;margin-top:10px;";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = labelShow.value;
      cb.style.cssText = "accent-color:#4a9eff;margin-right:6px;";
      const cbLabel = document.createElement("span");
      cbLabel.textContent = cb.checked ? "显示" : "隐藏";
      cbLabel.style.cssText = "font-size:12px;color:#ccc;";
      cb.addEventListener("change", () => {
        labelShow.value = cb.checked;
        saveVal("label_show", cb.checked);
        cbLabel.textContent = cb.checked ? "显示" : "隐藏";
        if (cb.checked) ensureLabels(); // 开启时立即创建视野内标签
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
        ctx.linkLines.geometry.setDrawRange(0, v * MAX_EDGE_SEGMENTS * 2);
        if (focusedId) {
          buildNeighborLabels(focusedId);
          // 同步重建 overlay 管道，使上限生效
          const fn = nodes.find((n) => n.id === focusedId);
          if (fn) buildOverlay(focusedId, new THREE.Color(fn._cDefault));
        }
        _needsRender = true;
      },
      "",
    );

    const hint = document.createElement("div");
    hint.textContent = "右键点击节点聚焦 · 左键打开链接 · 拖拽旋转/平移";
    hint.style.cssText = "font-size:10px;color:#666;margin-top:10px;text-align:center;";
    panel.appendChild(hint);
    panel.style.cssText = `position:fixed;
      bottom:var(--cp-bottom,70px);right:var(--cp-right,16px);
      left:var(--cp-left,auto);top:var(--cp-top,auto);
      width:var(--cp-width,auto);border-radius:var(--cp-border-radius,8px);
      transform:var(--cp-transform,none);
      z-index:9998;
      background:rgba(30,30,40,0.85);backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,0.1);
      padding:0 14px 10px;min-width:160px;display:none;font-family:sans-serif;overflow:hidden;`;
    document.body.appendChild(panel);
    makeDraggable(panel, header);
    return panel;
  }

  const controlPanel = createControlPanel();
  function togglePanel() {
    controlPanel.style.display = controlPanel.style.display === "none" ? "block" : "none";
  }
  (window as any).__toggleOpacityPanel = togglePanel;

  // ── 10. 邻居面板 ──
  function createNeighborPanelStyle() {
    if (document.getElementById("neighbor-panel-style")) return;
    const style = document.createElement("style");
    style.id = "neighbor-panel-style";
    style.textContent = `
      #neighbor-panel { position:fixed;
        right:0; bottom:0; top:auto; left:auto; transform:none;
        width:660px; max-height:75vh;
        z-index:9997;
        background:var(--card-bg,rgba(20,20,30,0.9));
        backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.1);
        border-radius:8px 0 0 0;
        overflow:hidden; font-family:sans-serif; transition:width 0.3s; }
      @media (max-width: 640px) {
        #neighbor-panel { right:0; top:auto; transform:none; bottom:0; left:0; width:100%; max-height:60vh; border-radius:12px 12px 0 0; }
      }
      @media (min-width: 641px) and (max-width: 1024px) {
        #neighbor-panel { width:540px; }
      }
      #neighbor-panel.hidden { display:none; }
      #neighbor-panel.collapsed { width:36px; }
      #neighbor-panel.collapsed .np-body,
      #neighbor-panel.collapsed .np-node-name,
      #neighbor-panel.collapsed .np-title,
      #neighbor-panel.collapsed .np-search,
      #neighbor-panel.collapsed .np-hint { display:none; }
      #neighbor-panel.collapsed .np-header { border-bottom:none; padding:0; }
      #neighbor-panel.collapsed .np-collapse-btn { transform:rotate(180deg); margin:4px auto; display:block; }
      #neighbor-panel.collapsed .np-close-btn { display:none; }
      .np-header { display:flex; align-items:center; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,0.08); cursor:grab; user-select:none; }
      .np-title { font-size:13px; color:#aaa; flex:1; }
      .np-collapse-btn, .np-close-btn { background:none; border:none; color:#aaa; cursor:pointer; font-size:14px; padding:2px 6px; }
      .np-node-name { padding:8px 12px; font-size:14px; color:#fff; border-bottom:1px solid rgba(255,255,255,0.05); }
      .np-search { padding:6px 12px; border-bottom:1px solid rgba(255,255,255,0.05); }
      .np-search input { width:100%; box-sizing:border-box; padding:5px 8px; border:1px solid rgba(255,255,255,0.15);
        border-radius:4px; background:rgba(255,255,255,0.08); color:#eee; font-size:12px; outline:none; }
      .np-search input::placeholder { color:#666; }
      .np-search input:focus { border-color:#4a9eff; }
		      .np-body { overflow-y:auto; max-height:45vh; display:grid; grid-template-columns:repeat(3,1fr); gap:0 4px; align-content:start; }
		      .np-section { display:flex; flex-direction:column; gap:1px; }
		      .np-section-title { font-size:11px; color:#888; padding:6px 6px 4px; border-bottom:1px solid rgba(255,255,255,0.04); font-weight:600; text-align:center; }
		      .np-item { display:flex; flex-direction:row; align-items:center; gap:4px; padding:5px 6px; cursor:pointer; border-radius:3px; }
		      .np-item:hover { background:rgba(255,255,255,0.08); }
		      .np-item-link { flex-shrink:0; display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; cursor:pointer; color:#666; border-radius:2px; }
		      .np-item-link:hover { color:#4a9eff; background:rgba(74,158,255,0.12); }
		      .np-item-content { display:flex; flex-direction:column; flex:1; min-width:0; }
		      .np-item-name { font-size:12px; color:#eee; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
		      .np-item-url { font-size:10px; color:#888; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
	      .np-empty { padding:20px; text-align:center; color:#666; font-size:13px; grid-column:1/-1; }
	      .np-search-count { font-size:11px; color:#888; padding:4px 12px; text-align:right; border-bottom:1px solid rgba(255,255,255,0.03); grid-column:1/-1; }
		      .np-hint { font-size:10px; color:#555; padding:6px 12px; text-align:center; border-top:1px solid rgba(255,255,255,0.04); line-height:1.4; display:none; grid-column:1/-1; }
	    `;
    document.head.appendChild(style);
  }

  function createNeighborPanel(): HTMLElement {
    let panel = document.getElementById("neighbor-panel") as HTMLElement | null;
    if (panel) return panel;
    createNeighborPanelStyle();
    panel = document.createElement("div");
    panel.id = "neighbor-panel";
    panel.classList.add("hidden");
    const header = document.createElement("div");
    header.className = "np-header";
    const title = document.createElement("div");
    title.className = "np-title";
    title.textContent = "邻居节点";
    const collapseBtn = document.createElement("button");
    collapseBtn.className = "np-collapse-btn";
    collapseBtn.textContent = "◀";
    const closeBtn = document.createElement("button");
    closeBtn.className = "np-close-btn";
    closeBtn.textContent = "×";
    header.appendChild(title);
    header.appendChild(collapseBtn);
    header.appendChild(closeBtn);
    const nodeName = document.createElement("div");
    nodeName.className = "np-node-name";
    const searchWrap = document.createElement("div");
    searchWrap.className = "np-search";
    const searchInput = document.createElement("input");
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
    panel.appendChild(header);
    panel.appendChild(nodeName);
    panel.appendChild(searchWrap);
    panel.appendChild(countInfo);
    panel.appendChild(body);
    panel.appendChild(hint);
    collapseBtn.addEventListener("click", () => panel!.classList.toggle("collapsed"));
    closeBtn.addEventListener("click", () => panel!.classList.add("hidden"));
    // 拖拽
    makeDraggable(panel, header);
    // 搜索过滤
    let _categories: {
      mutual: Array<{ id: string; name: string; url: string }>;
      outgoing: Array<{ id: string; name: string; url: string }>;
      incoming: Array<{ id: string; name: string; url: string }>;
    } = { mutual: [], outgoing: [], incoming: [] };
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
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
        const linkIcon = document.createElement("span");
        linkIcon.className = "np-item-link";
        linkIcon.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
        linkIcon.title = "打开网站";
        linkIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          window.open(entry.url, "_blank", "noopener");
        });
        item.appendChild(linkIcon);
        // 文本内容（名称 + URL）
        const content = document.createElement("div");
        content.className = "np-item-content";
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
      neighborPanel.classList.add("hidden");
      return;
    }
    if (!neighborPanel.classList.contains("collapsed")) neighborPanel.classList.remove("hidden");
    const focusedNode = nodes.find((n) => n.id === nodeId);
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
      const node = nodes.find((n) => n.id === nid);
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
    const limit = maxOverlayEdges.value;
    const shown = arr.length > limit ? arr.slice(0, limit) : arr;

    for (const nid of shown) {
      const node = nodes.find((n) => n.id === nid);
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
    const fNode = nodes.find((n) => n.id === nodeId);
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
      const node = nodes.find((n) => n.id === id);
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
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: new THREE.Color(0xffd700),
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    pathOverlayGroup.add(core);

    // 光晕管道（外发光，半透明，大一圈）
    const glowGeom = new THREE.TubeGeometry(curve, tubeRes, tubeRadius * 2.5, radialSegs, false);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: new THREE.Color(0xffd700),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    pathOverlayGroup.add(glow);

    ctx.scene.add(pathOverlayGroup);
  }

  function refreshPathNodeColors() {
    if (!pathNodeIds) return;
    const pathSet = new Set(pathNodeIds);
    for (let i = 0; i < nodes.length; i++) {
      const nd = nodes[i];
      if (pathSet.has(nd.id)) {
        if (pathStepIndex >= 0 && nd.id === pathNodeIds[pathStepIndex]) {
          setNodeColor(ctx, i, adjustHex(nd._cDefault, 70));
        } else {
          setNodeColor(ctx, i, "#FF8C00");
        }
      } else {
        setNodeColor(ctx, i, nd._cDefault);
      }
    }
  }

  function showShortestPath(fromId: string, toId: string): string[] | null {
    const path = findShortestPath(neighborMap, fromId, toId);
    if (!path) return null;
    clearOldPathState();
    focusedId = null;
    highlightedSet.clear();
    _needsRender = true;
    updateNeighborPanel(null);
    pathNodeIds = path;
    pathStepIndex = 0;
    refreshPathNodeColors();
    buildOverlay(null, 0xffffff); // 清除聚焦叠加线
    // 路径模式下隐藏普通连线，只显示金色路径管道
    (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = 0;
    buildPathOverlay(path);
    const first = nodes.find((n) => n.id === path[0]);
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
    pathStepIndex++;
    refreshPathNodeColors();
    const nid = pathNodeIds[pathStepIndex];
    const n = nodes.find((nd) => nd.id === nid);
    if (n && n.x != null) {
      const pad = 200;
      animateCamera(ctx, { x: n.x + pad, y: n.y! + pad * 0.5, z: n.z! + pad }, { x: n.x!, y: n.y!, z: n.z! }, 600);
    }
    return true;
  }

  function stepPathPrev(): boolean {
    if (!pathNodeIds || pathStepIndex <= 0) return false;
    pathStepIndex--;
    refreshPathNodeColors();
    const nid = pathNodeIds[pathStepIndex];
    const n = nodes.find((nd) => nd.id === nid);
    if (n && n.x != null) {
      const pad = 200;
      animateCamera(ctx, { x: n.x + pad, y: n.y! + pad * 0.5, z: n.z! + pad }, { x: n.x!, y: n.y!, z: n.z! }, 600);
    }
    return true;
  }

  function clearPath() {
    clearOldPathState();
    _needsRender = true;
    refreshAllNodeColors();
    (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = linkOpacity.value;
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
    for (let i = 0; i < nodes.length; i++) {
      const nd = nodes[i];
      let color: string;
      const isFocused = focusedId === nd.id;
      if (pathNodeIds && pathStepIndex >= 0 && nd.id === pathNodeIds[pathStepIndex]) {
        color = adjustHex(nd._cDefault, 70);
      } else if (pathNodeIds && pathNodeIds.includes(nd.id)) {
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
      setNodeColor(ctx, i, color);

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
  }

  // ── 13. 动画循环 ──
  let _lastCamPos = { x: 0, y: 0, z: 0 };
  let _queryCamMove = true;
  let _lblFrameSkip = 0;
  let _lblCreateSkip = 0;

  // FPS 监控
  let _fpsFrames = 0;
  let _fpsLastTime = performance.now();
  let _fpsDisplay: HTMLElement | null = null;

  function updateFPS() {
    _fpsFrames++;
    const now = performance.now();
    if (now - _fpsLastTime >= 1000) {
      const fps = Math.round(_fpsFrames / ((now - _fpsLastTime) / 1000));
      _fpsFrames = 0;
      _fpsLastTime = now;
      if (!_fpsDisplay) {
        _fpsDisplay = document.createElement("div");
        _fpsDisplay.style.cssText =
          "position:absolute;top:0;left:50%;transform:translateX(-50%);z-index:10000;background:rgba(0,0,0,0.7);color:#0f0;padding:4px 8px;border-radius:4px;font:12px monospace;";
        document.getElementById("main")?.appendChild(_fpsDisplay);
      }
      const nodeCount = ctx.nodes.count;
      const labelCount = labelGroup.children.length;
      _fpsDisplay.textContent = `FPS:${fps} | nodes:${nodeCount} | labels:${labelCount}`;
    }
  }

  let _lastTime = performance.now();
  let _needsRender = true;
  let _idleFrames = 0;

  // 用户交互（相机/悬停等）触发即时渲染
  ctx.controls.addEventListener("change", () => {
    _needsRender = true;
    _idleFrames = 0;
  });

  function animateLoop() {
    requestAnimationFrame(animateLoop);
    const now = performance.now();
    _lastTime = now;

    // 标签：只在每 10 帧或空闲时才检查创建
    if (++_lblCreateSkip >= 10 || _idleFrames > 120) {
      _lblCreateSkip = 0;
      ensureLabels();
      pruneLabels();
    }

    updateFPS();

    const camPos = ctx.camera.position;
    const camMoved =
      Math.abs(camPos.x - _lastCamPos.x) > 1 ||
      Math.abs(camPos.y - _lastCamPos.y) > 1 ||
      Math.abs(camPos.z - _lastCamPos.z) > 1;

    if (camMoved || _queryCamMove) {
      _lastCamPos.x = camPos.x;
      _lastCamPos.y = camPos.y;
      _lastCamPos.z = camPos.z;
      _queryCamMove = false;
      _needsRender = true;
      _idleFrames = 0;

      // 标签淡出（每 3 帧才跑一次，减少 CPU 消耗）
      _lblFrameSkip++;
      if (_lblFrameSkip >= 3 && labelGroup.children.length > 0) {
        _lblFrameSkip = 0;
        ensureLabels();
        const show = labelShow.value;
        for (const child of labelGroup.children) {
          const sprite = child as THREE.Sprite;
          const np = (sprite as any)._nodePos;
          if (!np) continue;
          if (!show || focusedId) {
            sprite.visible = false;
            continue;
          }
          const dx = np.x - camPos.x,
            dy = np.y - camPos.y,
            dz = np.z - camPos.z;
          const sqDist = dx * dx + dy * dy + dz * dz;
          if (sqDist > LABEL_MAX_FADE_START * LABEL_MAX_FADE_START) {
            sprite.visible = false;
          } else if (sqDist < LABEL_FADE_FULL * LABEL_FADE_FULL) {
            sprite.visible = true;
            sprite.material.opacity = 1;
          } else {
            sprite.visible = true;
            sprite.material.opacity =
              (LABEL_MAX_FADE_START - Math.sqrt(sqDist)) / (LABEL_MAX_FADE_START - LABEL_FADE_FULL);
          }
        }
      }
    }

    // 聚焦标签：屏幕空间缩放 + 相机相对定位
    if (neighborLabelGroup.children.length > 0) {
      const fovRad = (ctx.camera.fov * Math.PI) / 180;
      const count = neighborLabelGroup.children.length;
      const _camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(ctx.camera.quaternion);
      const _nodeRadius = nodeSize(1, 1);
      for (const child of neighborLabelGroup.children) {
        const sprite = child as THREE.Sprite;
        const isFocused = (sprite as any)._isFocused;
        const np = (sprite as any)._nodePos3d;
        if (np) {
          const sign = (sprite as any)._neighborId === null && !isFocused ? -1 : 1;
          const offset = isFocused ? _nodeRadius + 20 : _nodeRadius + 14;
          sprite.position.set(
            np.x + _camUp.x * offset * sign,
            np.y + _camUp.y * offset * sign,
            np.z + _camUp.z * offset * sign,
          );
        }
        const dist = ctx.camera.position.distanceTo(sprite.position);
        const fraction = isFocused ? 0.04 / (1 + count / 50) : 0.03 / (1 + count / 60);
        const worldH = Math.max(0.1, 2 * dist * Math.tan(fovRad / 2) * fraction);
        const curScale = sprite.scale;
        const aspect = curScale.y > 0 ? curScale.x / curScale.y : 1;
        sprite.scale.set(worldH * aspect, worldH, 1);
      }
    }

    // 飞船模式 / OrbitControls
    if (isFlyMode) {
      flyLoop();
    } else {
      ctx.controls.update();
      if (Math.abs(flyExitRoll) > 0.0001) {
        ctx.camera.rotateZ(flyExitRoll);
        flyExitRoll *= 0.92;
      } else {
        flyExitRoll = 0;
      }
    }

    // ── 空闲计数（每帧 +1，用户交互重置）──
    _idleFrames++;

    // ── 渲染节流 ──
    // 空闲时逐步降低渲染帧率，减少 GPU 负担（尤其是 Bloom 后处理）
    if (_needsRender) {
      _needsRender = false;
      ctx.renderer.render(ctx.scene, ctx.camera);
    } else {
      // 空闲逐渐降帧：<1s 60fps, 1-3s 30fps, 3-10s 15fps, >10s 8fps
      const throttleStep = _idleFrames < 60 ? 0 : _idleFrames < 180 ? 1 : _idleFrames < 600 ? 3 : 6;
      if (throttleStep === 0 || _idleFrames % (throttleStep + 1) === 0) {
        ctx.renderer.render(ctx.scene, ctx.camera);
      }
    }
  }

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
    const sprite = hitTestNeighborSprite(event);
    if (sprite && (sprite as any)._neighborUrl) {
      event.stopImmediatePropagation();
      window.open((sprite as any)._neighborUrl, "_blank");
    }
  });

  // 右键 → 聚焦邻居节点
  ctx.renderer.domElement.addEventListener("contextmenu", (event: MouseEvent) => {
    const sprite = hitTestNeighborSprite(event);
    if (sprite && (sprite as any)._neighborId) {
      event.preventDefault();
      event.stopImmediatePropagation();
      focusNode((sprite as any)._neighborId);
    }
  });

  // ── 14. 交互事件 ──
  const tooltip = createTooltip();
  const interaction = createInteraction(ctx, nodes);

  // 高亮叠加线网（hover/focus 时显示，预构建 mesh 池，避免 GC）
  const overlayGroup = new THREE.Group();
  overlayGroup.visible = false;
  ctx.scene.add(overlayGroup);

  // ── 共享几何体 ──
  const sharedHaloGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
  const sharedCoreGeom = new THREE.CylinderGeometry(0.18, 0.18, 1, 6);
  const up_v = new THREE.Vector3(0, 1, 0);
  const quat_v = new THREE.Quaternion();
  const mid_v = new THREE.Vector3();
  const start_v = new THREE.Vector3();
  const end_v = new THREE.Vector3();
  const dir_v = new THREE.Vector3();

  // ── 共享材质（hover 和 focus 共用，运行时切换颜色/亮度）──
  const overlayHaloMat = new THREE.MeshStandardMaterial({
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  const overlayCoreMat = new THREE.MeshStandardMaterial({
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });

  // ── 预构建 mesh 池 ──
  const POOL_SIZE = 500 * EDGE_SEGMENTS; // 池容量，显示上限由滑条控制
  const overlayHaloPool: THREE.Mesh[] = [];
  const overlayCorePool: THREE.Mesh[] = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    const halo = new THREE.Mesh(sharedHaloGeom, overlayHaloMat);
    const core = new THREE.Mesh(sharedCoreGeom, overlayCoreMat);
    halo.visible = false;
    core.visible = false;
    overlayGroup.add(halo);
    overlayGroup.add(core);
    overlayHaloPool.push(halo);
    overlayCorePool.push(core);
  }
  let _overlayPoolUsed = 0; // 当前已使用的 mesh 数量

  function buildOverlay(nodeId: string | null, color: THREE.ColorRepresentation) {
    // 重置池
    for (let i = 0; i < _overlayPoolUsed; i++) {
      overlayHaloPool[i].visible = false;
      overlayCorePool[i].visible = false;
    }
    _overlayPoolUsed = 0;

    if (!nodeId) {
      overlayGroup.visible = false;
      return;
    }

    const baseColor = new THREE.Color(color);
    const isFocus = focusedId === nodeId;
    overlayHaloMat.color.copy(baseColor);
    overlayHaloMat.emissive.copy(baseColor);
    overlayHaloMat.emissiveIntensity = isFocus ? 0.8 : 0.4;
    overlayHaloMat.opacity = isFocus ? 0.5 : 0.25;
    overlayCoreMat.color.copy(baseColor);
    overlayCoreMat.emissive.copy(baseColor);
    overlayCoreMat.emissiveIntensity = isFocus ? 1.2 : 0.7;
    overlayCoreMat.opacity = 1;

    const focusScale = isFocus ? 2 : 1;

    const linkPos = ctx.linkLines.geometry.attributes.position.array as Float32Array;
    const FLOATS_PER_EDGE = EDGE_SEGMENTS * 2 * 3; // buffer stride (fixed)
    const lseg = _cachedLseg; // per-edge actual segment counts
    let edgeCount = 0;
    let poolIdx = 0;

    for (let i = 0; i < links.length && edgeCount < maxOverlayEdges.value; i++) {
      if (links[i].source !== nodeId && links[i].target !== nodeId) continue;
      edgeCount++;
      const base = i * FLOATS_PER_EDGE;
      const segs = lseg ? lseg[i] || 6 : EDGE_SEGMENTS;

      for (let j = 0; j < segs && poolIdx < POOL_SIZE; j++) {
        const segBase = base + j * 6;
        start_v.set(linkPos[segBase], linkPos[segBase + 1], linkPos[segBase + 2]);
        end_v.set(linkPos[segBase + 3], linkPos[segBase + 4], linkPos[segBase + 5]);
        dir_v.subVectors(end_v, start_v);
        const segLen = dir_v.length();
        if (segLen < 0.01) continue;
        dir_v.normalize();
        mid_v.addVectors(start_v, end_v).multiplyScalar(0.5);
        quat_v.setFromUnitVectors(up_v, dir_v);

        const halo = overlayHaloPool[poolIdx];
        const core = overlayCorePool[poolIdx];
        poolIdx++;

        halo.position.copy(mid_v);
        halo.quaternion.copy(quat_v);
        halo.scale.set(focusScale, segLen, focusScale);
        halo.visible = true;

        core.position.copy(mid_v);
        core.quaternion.copy(quat_v);
        core.scale.set(focusScale * 0.36, segLen, focusScale * 0.36);
        core.visible = true;
      }
    }
    _overlayPoolUsed = poolIdx;
    overlayGroup.visible = true;
  }

  interaction.onHover = (n: any) => {
    // 首次交互时触发 bezier 懒加载
    if (!_bezierLoaded && !_bezierLoading && n) {
      loadBezierLazy();
    }
    const newHoveredId = n ? n.id : null;
    if (lastHoveredId === newHoveredId) return;
    const prevId = hoveredId;
    hoveredId = newHoveredId;
    lastHoveredId = newHoveredId;
    _needsRender = true;
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
      content.className = "graph-tooltip-content";
      const titleEl = document.createElement("strong");
      titleEl.textContent = n.name || n.id;
      content.appendChild(titleEl);
      if (n.desc) {
        const d = document.createElement("div");
        d.textContent = n.desc;
        content.appendChild(d);
      }
      if (n.url) {
        const a = document.createElement("a");
        a.href = n.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = n.url;
        a.style.color = "#87ceeb";
        content.appendChild(a);
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

  ctx.renderer.domElement.addEventListener("mousemove", (e: MouseEvent) => {
    (window as any).__lastMouseX = e.clientX;
    (window as any).__lastMouseY = e.clientY;
  });

  interaction.onClick = (n: any) => {
    if ((window as any).__touchLongPress) return;
    if (n.url) window.open(n.url, "_blank");
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

  let _lastFocusedId: string | null = null;

  function focusNodeById(id: string) {
    // 恢复上一个聚焦节点尺寸
    if (focusedId && focusedId !== id) {
      restoreNodeScale(focusedId);
    }
    _lastFocusedId = focusedId;
    focusedId = id;
    _needsRender = true;
    refreshAllNodeColors();
    const focusNode = nodes.find((n) => n.id === id);
    const focusOverlayColor = focusNode ? new THREE.Color(focusNode._cDefault) : new THREE.Color(0xffdd44);
    buildOverlay(id, focusOverlayColor);
    updateNeighborPanel(id);
    buildNeighborLabels(id);
    const node = nodes.find((n) => n.id === id);
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
    _needsRender = true;
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
    _needsRender = true;
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
  let flyExitRoll = 0; // 退出飞船时保留的翻滚角
  const SHIFT_MULTIPLIER = 3;
  const MOUSE_SENSITIVITY = 0.003;
  const RETICLE_SPRING = 30;
  const RETICLE_DAMPING = 12;
  const reticleOffset = { x: 0, y: 0 };
  const reticleVelocity = { x: 0, y: 0 };
  let rollVelocity = 0; // Q/E 横滚速度（带阻尼平滑）
  let flyCrosshair: HTMLElement | null = null;
  let flyControlPanel: HTMLElement | null = null;
  let flyOnKeyDown: ((e: KeyboardEvent) => void) | null = null;
  let flyOnKeyUp: ((e: KeyboardEvent) => void) | null = null;
  let flyOnMouseMove: ((e: MouseEvent) => void) | null = null;
  let autoHoverId: string | null = null;

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
    const k = e.key.toLowerCase();
    if (k === "x" && down) {
      e.preventDefault();
      exitFlyMode();
      return;
    }
    if (["w", "a", "s", "d", "r", "f", "q", "e", "shift"].includes(k)) {
      e.preventDefault();
      flyKeys[k] = down;
    }
    if (k === " " && down) {
      e.preventDefault();
      flyAutoPilot = !flyAutoPilot;
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
    if (!document.pointerLockElement) document.body.style.cursor = "default";
    else document.body.style.cursor = "none";
  }
  function flyReLock() {
    if (isFlyMode && !document.pointerLockElement) ctx.renderer.domElement.requestPointerLock?.();
  }

  // 预分配向量（避免 GC）
  const _camPos_v = new THREE.Vector3();
  const _forward_v = new THREE.Vector3();
  const _toNode_v = new THREE.Vector3();

  function updateAutoHover(_nodes: any[], cam: THREE.Camera) {
    cam.updateMatrixWorld(true);
    (cam as THREE.PerspectiveCamera).getWorldPosition(_camPos_v);
    (cam as THREE.PerspectiveCamera).getWorldDirection(_forward_v);

    let bestScore = -Infinity;
    let bestNode: any = null;

    for (const node of nodes) {
      if (node.x == null) continue;
      _toNode_v.set(node.x - _camPos_v.x, (node.y || 0) - _camPos_v.y, (node.z || 0) - _camPos_v.z);
      const dist = _toNode_v.length();
      if (dist > 100000) continue;
      const dot = _forward_v.dot(_toNode_v) / dist;
      if (dot < 0.85) continue; // 31° 窄锥体
      const score = dot / (1 + dist * 0.005);
      if (score > bestScore) {
        bestScore = score;
        bestNode = node;
      }
    }

    const newId = bestNode ? bestNode.id : null;
    if (newId === autoHoverId) return;
    autoHoverId = newId;

    if (flyCrosshair) flyCrosshair.classList.toggle("locked", !!newId);
    tooltip.hide();

    if (bestNode) {
      const content = document.createElement("div");
      content.className = "graph-tooltip-content";
      const titleEl = document.createElement("strong");
      titleEl.className = "graph-tooltip-title";
      titleEl.textContent = bestNode.name || bestNode.id;
      content.appendChild(titleEl);
      if (bestNode.desc) {
        const descEl = document.createElement("div");
        descEl.className = "graph-tooltip-desc";
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
        a.style.color = "#87ceeb";
        a.style.textDecoration = "underline";
        urlEl.appendChild(a);
        content.appendChild(urlEl);
      }
      tooltip.show(content, window.innerWidth / 2 - 160, window.innerHeight / 2 + 20);
    }
  }

  function flyLoop() {
    if (!isFlyMode) return;
    const cam = ctx.camera;

    // 弹簧力：偏移越大回中力越强
    const ax = -RETICLE_SPRING * reticleOffset.x - RETICLE_DAMPING * reticleVelocity.x;
    const ay = -RETICLE_SPRING * reticleOffset.y - RETICLE_DAMPING * reticleVelocity.y;
    reticleVelocity.x += ax * 0.016;
    reticleVelocity.y += ay * 0.016;
    reticleOffset.x += reticleVelocity.x * 0.016;
    reticleOffset.y += reticleVelocity.y * 0.016;

    // 准星偏移 → 相机本地轴旋转
    const rotScale = 0.15;
    cam.rotateY(-reticleOffset.x * rotScale);
    cam.rotateX(reticleOffset.y * rotScale);
    if (cam.rotation.x > 1.48) cam.rotation.x = 1.48;
    if (cam.rotation.x < -1.48) cam.rotation.x = -1.48;

    // 更新准星 DOM
    if (flyCrosshair) {
      const x = Math.round(reticleOffset.x),
        y = Math.round(reticleOffset.y);
      flyCrosshair.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }

    // WASD 飞行 + Q/E 横滚
    const speed = (flyKeys.shift ? SHIFT_MULTIPLIER : 1) * MOVE_SPEED;
    if (flyAutoPilot || flyKeys.w) cam.translateZ(-speed);
    if (!flyAutoPilot && flyKeys.s) cam.translateZ(speed);
    if (flyKeys.a) cam.translateX(-speed);
    if (flyKeys.d) cam.translateX(speed);
    if (flyKeys.r) cam.translateY(speed);
    if (flyKeys.f) cam.translateY(-speed);
    // Q/E 横滚：带加速和阻尼的平滑过渡
    const ROLL_ACCEL = 0.008; // 每帧角加速度
    const ROLL_DAMPING = 0.88; // 松手后衰减系数
    const MAX_ROLL = 0.06; // 最大横滚角速度 (rad/frame)
    if (flyKeys.q) rollVelocity += ROLL_ACCEL;
    if (flyKeys.e) rollVelocity -= ROLL_ACCEL;
    if (!flyKeys.q && !flyKeys.e) rollVelocity *= ROLL_DAMPING;
    rollVelocity = Math.max(-MAX_ROLL, Math.min(MAX_ROLL, rollVelocity));
    cam.rotateZ(rollVelocity);

    updateAutoHover(nodes, ctx.camera);
  }

  function createFlyControlPanel(): HTMLElement {
    let panel = document.getElementById("fly-control-panel") as HTMLElement | null;
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "fly-control-panel";
    panel.style.cssText = `
      position:fixed;
      bottom:var(--fp-bottom,70px); left:var(--fp-left,16px);
      right:var(--fp-right,auto); top:var(--fp-top,auto);
      width:var(--fp-width,auto); max-width:var(--fp-max-width,220px);
      border-radius:var(--fp-border-radius,8px);
      z-index:9998;
      background:rgba(16,16,24,0.88);backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,0.08);
      padding:0 12px 8px;font-family:sans-serif;font-size:12px;color:#ccc;
      display:none;line-height:1.6;overflow:hidden;
    `;
    panel.innerHTML = `
      <div class="fp-header" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;cursor:grab;user-select:none;">
        <span style="font-weight:600;color:#fff;font-size:13px;">🚀 飞行控制</span>
        <div style="display:flex;gap:4px;">
          <button class="fp-toggle-btn" style="background:none;border:none;color:#888;cursor:pointer;font-size:14px;padding:0 4px;">−</button>
          <button class="fp-close-btn" style="background:none;border:none;color:#888;cursor:pointer;font-size:16px;padding:0 4px;line-height:1;">×</button>
        </div>
      </div>
      <div id="fly-panel-body">
        <div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 飞行</div>
        <div><kbd>R</kbd> 上升 · <kbd>F</kbd> 下降</div>
        <div><kbd>Q</kbd><kbd>E</kbd> 横滚</div>
        <div><kbd>Shift</kbd> 加速 3×</div>
        <div><kbd>Space</kbd> 自动驾驶 <span id="fly-autopilot-status" style="color:#888;">OFF</span></div>
        <div style="margin-top:4px;border-top:1px solid rgba(255,200,100,0.25);padding-top:4px;color:#ffc864;font-weight:700;"><kbd style="background:rgba(255,200,100,0.25);color:#ffc864;">X</kbd> 退出飞船模式</div>
        <div style="color:#888;margin-top:2px;">准星瞄准 · 左键打开 · 惯性视角</div>
      </div>
      <style>
        #fly-control-panel kbd { display:inline-block;background:rgba(255,255,255,0.1);border-radius:3px;padding:0 5px;font-size:11px;color:#fff;margin:0 1px; }
      </style>
    `;
    document.body.appendChild(panel);
    const header = panel.querySelector(".fp-header") as HTMLElement;
    const toggle = panel.querySelector(".fp-toggle-btn") as HTMLElement;
    const closeBtn = panel.querySelector(".fp-close-btn") as HTMLElement;
    const bodyEl = panel.querySelector("#fly-panel-body") as HTMLElement;
    if (toggle && bodyEl) {
      toggle.addEventListener("click", () => {
        const collapsed = bodyEl.style.display === "none";
        bodyEl.style.display = collapsed ? "block" : "none";
        toggle.textContent = collapsed ? "−" : "+";
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        panel!.style.display = "none";
      });
    }
    if (header) makeDraggable(panel, header);
    return panel;
  }

  function enterFlyMode() {
    isFlyMode = true;
    ctx.controls.enabled = false;
    reticleOffset.x = 0;
    reticleOffset.y = 0;
    reticleVelocity.x = 0;
    reticleVelocity.y = 0;
    ctx.renderer.domElement.requestPointerLock?.();
    document.addEventListener("pointerlockchange", onPointerLockChange);
    ctx.renderer.domElement.addEventListener("click", flyReLock);
    // 切换旋转顺序前保存朝向，避免视觉闪烁
    const savedQuat = ctx.camera.quaternion.clone();
    ctx.camera.rotation.order = "YXZ";
    ctx.camera.quaternion.copy(savedQuat);
    flyCrosshair = createCrosshair();
    flyCrosshair.style.display = "block";
    document.body.style.cursor = "none";
    flyOnKeyDown = (e) => handleFlyKey(e, true);
    flyOnKeyUp = (e) => handleFlyKey(e, false);
    document.addEventListener("keydown", flyOnKeyDown);
    document.addEventListener("keyup", flyOnKeyUp);
    flyOnMouseMove = (e: MouseEvent) => {
      reticleVelocity.x += e.movementX * MOUSE_SENSITIVITY;
      reticleVelocity.y -= e.movementY * MOUSE_SENSITIVITY;
      const maxV = 200;
      reticleVelocity.x = Math.max(-maxV, Math.min(maxV, reticleVelocity.x));
      reticleVelocity.y = Math.max(-maxV, Math.min(maxV, reticleVelocity.y));
    };
    ctx.renderer.domElement.addEventListener("mousemove", flyOnMouseMove);

    (interaction as any).setFlyMode?.(true);

    flyControlPanel = createFlyControlPanel();
    flyControlPanel.style.display = "block";
    // 同步按钮文字
    const flyBtn = document.getElementById("fly-toggle");
    if (flyBtn) flyBtn.textContent = "🌐 球幕模式";
  }

  function exitFlyMode() {
    isFlyMode = false;
    // 保存当前翻滚角度，切回球幕后持续保留
    flyExitRoll = ctx.camera.rotation.z;
    // 同步 OrbitControls target 到当前视线方向
    const lookTarget = new THREE.Vector3();
    ctx.camera.getWorldDirection(lookTarget);
    lookTarget.multiplyScalar(200).add(ctx.camera.position);
    ctx.controls.target.copy(lookTarget);
    ctx.controls.enabled = true;
    if (flyOnKeyDown) document.removeEventListener("keydown", flyOnKeyDown);
    if (flyOnKeyUp) document.removeEventListener("keyup", flyOnKeyUp);
    if (flyOnMouseMove) ctx.renderer.domElement.removeEventListener("mousemove", flyOnMouseMove);
    ctx.renderer.domElement.removeEventListener("click", flyReLock);
    flyOnKeyDown = flyOnKeyUp = flyOnMouseMove = null;
    document.removeEventListener("pointerlockchange", onPointerLockChange);
    try {
      document.exitPointerLock?.();
    } catch {}
    if (flyCrosshair) {
      flyCrosshair.style.display = "none";
      flyCrosshair = null;
    }
    if (flyControlPanel) {
      flyControlPanel.style.display = "none";
      flyControlPanel = null;
    }
    (interaction as any).setFlyMode?.(false);
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
  animateLoop();

  // ── 18. Resize ──
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      ctx.renderer.setSize(width, height);
      ctx.camera.aspect = width / height;
      ctx.camera.updateProjectionMatrix();
    }
  });
  ro.observe(container);

  // ── 19. 公开 API ──
  function find(query: string) {
    if (!query?.trim()) return [];
    const q = query.trim().toLowerCase();
    const ids = searchIndex.search(q, 12) as string[];
    return ids.map((id) => searchStore.get(id)).filter(Boolean) as Array<{
      id: string;
      name: string;
      url: string;
      description: string;
    }>;
  }

  function getGraphData() {
    return { nodes, links };
  }

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
    loadBezierLazy, // 对外暴露，供 index-client 在需要时提前触发
    ctx,
    updateLinkOpacity(v: number) {
      linkOpacity.value = v;
      refreshLinkColors();
    },
  };
  (window as any).__graphApi = (window as any).__graphApi || {};
  Object.assign((window as any).__graphApi, api); // merge，不用 Object.assign 合并
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
  const pos = ctx.linkLines.geometry.attributes.position.array as Float32Array;
  const { lseg, lpx, lpy, lpz: _lpz } = bezier;

  // 从紧凑格式解包到固定尺寸的 GPU buffer（MAX_EDGE_SEGMENTS 段/边）
  const MAX_VERTS_PER_EDGE = MAX_EDGE_SEGMENTS * 2;
  let srcVert = 0;
  for (let i = 0; i < linkArr.length; i++) {
    const segs = lseg[i] || 6;
    const srcVerts = segs * 2;
    const dstBaseVert = i * MAX_VERTS_PER_EDGE;
    const copyVerts = Math.min(MAX_VERTS_PER_EDGE, srcVerts);

    for (let j = 0; j < copyVerts; j++) {
      const srcIdx = srcVert + j;
      pos[(dstBaseVert + j) * 3] = lpx[srcIdx] ?? 0;
      pos[(dstBaseVert + j) * 3 + 1] = lpy[srcIdx] ?? 0;
      pos[(dstBaseVert + j) * 3 + 2] = _lpz[srcIdx] ?? 0;
    }
    if (copyVerts < MAX_VERTS_PER_EDGE) {
      const li = srcVert + copyVerts - 1;
      const lx = lpx[li] ?? 0,
        ly = lpy[li] ?? 0,
        lz = _lpz[li] ?? 0;
      for (let j = copyVerts; j < MAX_VERTS_PER_EDGE; j++) {
        pos[(dstBaseVert + j) * 3] = lx;
        pos[(dstBaseVert + j) * 3 + 1] = ly;
        pos[(dstBaseVert + j) * 3 + 2] = lz;
      }
    }
    srcVert += srcVerts;
  }

  // 设置边颜色（源→目标渐变）
  const colArr = ctx.linkLines.geometry.attributes.color.array as Float32Array;
  for (let i = 0; i < linkArr.length; i++) {
    const l = linkArr[i];
    const si = nodeIdToIndex.get(l.source);
    const ti = nodeIdToIndex.get(l.target);
    const srcCol = new THREE.Color(si != null ? (nodes[si] as any)._cDefault || "#ffffff" : "#ffffff");
    const tgtCol = new THREE.Color(ti != null ? (nodes[ti] as any)._cDefault || "#ffffff" : "#ffffff");
    for (let j = 0; j < MAX_EDGE_SEGMENTS; j++) {
      const t0 = j / MAX_EDGE_SEGMENTS;
      const t1 = (j + 1) / MAX_EDGE_SEGMENTS;
      const base = (i * MAX_EDGE_SEGMENTS + j) * 6;
      colArr[base] = srcCol.r + (tgtCol.r - srcCol.r) * t0;
      colArr[base + 1] = srcCol.g + (tgtCol.g - srcCol.g) * t0;
      colArr[base + 2] = srcCol.b + (tgtCol.b - srcCol.b) * t0;
      colArr[base + 3] = srcCol.r + (tgtCol.r - srcCol.r) * t1;
      colArr[base + 4] = srcCol.g + (tgtCol.g - srcCol.g) * t1;
      colArr[base + 5] = srcCol.b + (tgtCol.b - srcCol.b) * t1;
    }
  }

  ctx.linkLines.geometry.attributes.color.needsUpdate = true;
  ctx.linkLines.geometry.attributes.position.needsUpdate = true;
  ctx.linkLines.geometry.setDrawRange(0, maxOverlayEdges * MAX_EDGE_SEGMENTS * 2);
  (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = linkOpacity;

  // 填充 edgeRefs
  ctx.edgeRefs = linkArr.map((l) => {
    const si = nodeIdToIndex.get(l.source);
    const ti = nodeIdToIndex.get(l.target);
    const sn = si != null ? nodes[si] : null;
    const tn = ti != null ? nodes[ti] : null;
    return {
      sx: sn?.x ?? 0,
      sy: sn?.y ?? 0,
      sz: sn?.z ?? 0,
      ex: tn?.x ?? 0,
      ey: tn?.y ?? 0,
      ez: tn?.z ?? 0,
      cx: 0,
      cy: 0,
      cz: 0,
    };
  });

  // 缓存 lseg 供 overlay 使用
  _cachedLseg = lseg;
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
  const core = decode(coreRaw) as any;
  const data = core.nid ? expandCompact(core) : (core as GraphData);

  // 合并贝塞尔数据（可选，缺失时 init3d 内部走 updateLinkPositions 回退）
  if (bezierBuf) {
    try {
      const bezierRaw = await maybeDecompress(new Uint8Array(bezierBuf));
      const bezier = decode(bezierRaw) as any;
      if (bezier.lpx) {
        // msgpackr 将 Int16Array 解码为 Uint8Array（原始字节），
        // 需通过 buffer 重解释为 Int16Array，而非逐元素拷贝
        const asI16 = (arr: any) =>
          arr instanceof Int16Array ? arr : new Int16Array(arr.buffer, arr.byteOffset, arr.byteLength / 2);
        (data as any).bezier = {
          lseg: bezier.lseg,
          lpx: dequantize(asI16(bezier.lpx), bezier.lpx_min, bezier.lpx_max),
          lpy: dequantize(asI16(bezier.lpy), bezier.lpy_min, bezier.lpy_max),
          lpz: dequantize(asI16(bezier.lpz), bezier.lpz_min, bezier.lpz_max),
        };
      }
    } catch {
      // bezier 解码/反量化失败，静默降级
    }
  }

  return init3d(data);
}
