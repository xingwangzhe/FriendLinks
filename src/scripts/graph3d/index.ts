/**
 * 3D 博客宇宙渲染模块（Three.js InstancedMesh）
 * 使用 Three.js 原生 InstancedMesh 替代 3d-force-graph
 */
import FlexSearch from "flexsearch";
import * as THREE from "three";
import { decode } from "msgpackr";
import { PALETTE, hashToIndex, adjustHex, createTextSprite } from "./utils";
import {
  createRenderer,
  setNodeColor,
  updateAllNodePositions,
  updateLinkPositions,
  animateCamera,
  createParticles,
  updateParticles,
  EDGE_SEGMENTS,
  type RenderContext,
  type NodeState,
} from "./renderer";
import { createInteraction } from "./interaction";
import { findShortestPath } from "./pathfinder";
import type { GraphData } from "../../../types/graph";

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

// ─── 初始化 ──────────────────────────────────────────────────────────

export function init3d(graphData: GraphData) {
  const container = document.getElementById("main");
  if (!container) return null;

  container.innerHTML = "";

  // ── 1. 度数 ──
  const degreeMap: Record<string, number> = {};
  const rawLinks = graphData.links || [];
  for (const l of rawLinks) {
    const link = l as any;
    const s = link.source ?? link[0];
    const t = link.target ?? link[1];
    if (s != null) degreeMap[s] = (degreeMap[s] || 0) + 1;
    if (t != null) degreeMap[t] = (degreeMap[t] || 0) + 1;
  }

  // ── 2. 节点预处理 ──
  const rawNodes = graphData.nodes || [];
  const nodes = rawNodes.map((n: any) => {
    const base = n.color || PALETTE[hashToIndex(n.id)];
    return Object.assign({}, n, {
      palColor: base,
      _cDefault: adjustHex(base, 20),
      _cHover: adjustHex(base, 40),
      _cFocus: adjustHex(base, 60),
      _cHighlight: adjustHex(base, 35),
      _cDimmed: adjustHex(base, -15),
    });
  });

  // ── 4. 搜索索引（FlexSearch，37k+ 节点毫秒级响应）──
  const searchIndex = new FlexSearch.Index({ tokenize: "forward" });
  const searchStore = new Map<string, { id: string; name: string; url: string }>();
  for (const n of nodes) {
    const id = n.id;
    const text = `${n.name || ""} ${n.url || ""} ${n.id}`;
    searchIndex.add(id, text);
    searchStore.set(id, { id, name: n.name || id, url: n.url || "" });
  }

  // ── 5. 状态 ──
  let hoveredId: string | null = null;
  let lastHoveredId: string | null = null;
  let focusedId: string | null = null;
  let highlightedSet = new Set<string>();
  let pathNodeIds: string[] | null = null;
  let pathStepIndex = -1;
  let pathOverlayGroup: THREE.Group | null = null;

  // ── 6. 邻居映射 ──
  const links = rawLinks.map((l: any) => ({
    source: typeof l.source === "object" && l.source !== null ? (l.source.id ?? l.source) : l.source,
    target: typeof l.target === "object" && l.target !== null ? (l.target.id ?? l.target) : l.target,
  }));
  const neighborMap = new Map<string, Set<string>>();
  for (const l of links) {
    if (!neighborMap.has(l.source)) neighborMap.set(l.source, new Set());
    if (!neighborMap.has(l.target)) neighborMap.set(l.target, new Set());
    neighborMap.get(l.source)!.add(l.target);
    neighborMap.get(l.target)!.add(l.source);
  }

  // ── 6b. 连线透明度控制 ──
  const STORAGE_KEY = "friendlinks_link_opacity";
  const saved = (() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v !== null) {
        const n = parseFloat(v);
        if (!isNaN(n) && n >= 0 && n <= 1) return n;
      }
    } catch {}
    return 0;
  })();
  const linkOpacity = { value: saved };
  function saveOpacity(v: number) {
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch {}
  }

  // ── 6c. 节点索引映射 ──
  const linkArr = links as Array<{ source: string; target: string }>;
  const nodeIdToIndex = new Map<string, number>();
  nodes.forEach((n, i) => nodeIdToIndex.set(n.id, i));

  // ── 7. 渲染器 ──
  const ctx: RenderContext = createRenderer(container, nodes.length, linkArr.length);

  const nodeStates: NodeState[] = nodes.map((n: any) => ({
    _cDefault: n._cDefault,
    _cHover: n._cHover,
    _cFocus: n._cFocus,
    _cHighlight: n._cHighlight,
    _cDimmed: n._cDimmed,
  }));

  updateAllNodePositions(ctx, nodes, nodeStates);
  updateLinkPositions(ctx, linkArr, nodeIdToIndex, nodes, linkOpacity.value);
  createParticles(ctx);

  function refreshLinkColors() {
    (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = linkOpacity.value;
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
  const nodeIdToLabelIndex = new Map<string, number>(); // 反查 label index
  nodes.forEach((n, i) => nodeIdToLabelIndex.set(n.id, i));

  function ensureLabels() {
    const show = labelShow.value;
    if (!show) return;
    const camPos = ctx.camera.position;

    for (let i = 0; i < nodes.length; i++) {
      if (labelsCreated.has(i)) continue;
      const n = nodes[i];
      if (n.x == null) continue;
      const dx = n.x - camPos.x,
        dy = (n.y || 0) - camPos.y,
        dz = (n.z || 0) - camPos.z;
      const sqDist = dx * dx + dy * dy + dz * dz;
      if (sqDist > 200 * 200) continue;

      labelsCreated.add(i);
      const name = n.name || n.id;
      if (name.length > 40) continue;
      const sprite = createTextSprite(name);
      sprite.position.set(n.x!, n.y! + 12, n.z!);
      (sprite as any)._nodePos = { x: n.x, y: n.y, z: n.z };
      (sprite as any)._nodeIndex = i; // 记录节点索引用于销毁
      (sprite as any)._lastNear = performance.now();
      labelGroup.add(sprite);
    }
  }

  // 定期销毁远离相机的标签（每 10 秒，距离 > 600 超过 30 秒）
  let _lastPrune = 0;
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
      if (sqDist < 600 * 600) {
        (sprite as any)._lastNear = now;
      } else if (now - ((sprite as any)._lastNear || now) > 30000) {
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

  const labelShow = { value: true };

  // ── 9. 控制面板 ──
  let MOVE_SPEED = 5;
  function createControlPanel() {
    let panel = document.getElementById("graph-control-panel") as HTMLElement | null;
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "graph-control-panel";

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
      saveOpacity(v);
      refreshLinkColors();
    });
    addSliderRow(panel, "飞船速度", "5", "100", "5", String(MOVE_SPEED), (v) => {
      MOVE_SPEED = v;
    });
    addSliderRow(panel, "泛光强度", "0", "2", "0.05", String(ctx.bloomPass.strength), (v) => {
      ctx.bloomPass.strength = v;
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

    const hint = document.createElement("div");
    hint.textContent = "⚙️ 左键拖拽旋转 · 右键拖拽平移 · 滚轮缩放";
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
      padding:10px 14px;min-width:160px;display:none;font-family:sans-serif;`;
    document.body.appendChild(panel);
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
        right:var(--np-right,0); top:var(--np-top,50%);
        transform:var(--np-transform,translateY(-50%));
        bottom:var(--np-bottom,auto); left:var(--np-left,auto);
        width:var(--np-width,280px); max-height:var(--np-max-height,75vh);
        z-index:9997;
        background:var(--card-bg,rgba(20,20,30,0.9));
        backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.1);
        border-radius:var(--np-border-radius,8px 0 0 8px);
        overflow:hidden; font-family:sans-serif; transition:width 0.3s; }
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
      .np-header { display:flex; align-items:center; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,0.08); }
      .np-title { font-size:13px; color:#aaa; flex:1; }
      .np-collapse-btn, .np-close-btn { background:none; border:none; color:#aaa; cursor:pointer; font-size:14px; padding:2px 6px; }
      .np-node-name { padding:8px 12px; font-size:14px; color:#fff; border-bottom:1px solid rgba(255,255,255,0.05); }
      .np-search { padding:6px 12px; border-bottom:1px solid rgba(255,255,255,0.05); }
      .np-search input { width:100%; box-sizing:border-box; padding:5px 8px; border:1px solid rgba(255,255,255,0.15);
        border-radius:4px; background:rgba(255,255,255,0.08); color:#eee; font-size:12px; outline:none; }
      .np-search input::placeholder { color:#666; }
      .np-search input:focus { border-color:#4a9eff; }
      .np-body { overflow-y:auto; max-height:45vh; }
      .np-item { display:flex; flex-direction:column; padding:8px 12px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.03); }
      .np-item:hover { background:rgba(255,255,255,0.05); }
      .np-item-name { font-size:13px; color:#eee; }
      .np-item-url { font-size:11px; color:#888; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .np-empty { padding:20px; text-align:center; color:#666; font-size:13px; }
      .np-search-count { font-size:11px; color:#888; padding:4px 12px; text-align:right; border-bottom:1px solid rgba(255,255,255,0.03); }
      .np-hint { font-size:10px; color:#555; padding:6px 12px; text-align:center; border-top:1px solid rgba(255,255,255,0.04); line-height:1.4; display:none; }
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
    hint.textContent = "邻居过多时3D场景仅随机显示部分节点标签，全部节点均可在本面板搜索";
    panel.appendChild(header);
    panel.appendChild(nodeName);
    panel.appendChild(searchWrap);
    panel.appendChild(countInfo);
    panel.appendChild(body);
    panel.appendChild(hint);
    collapseBtn.addEventListener("click", () => panel!.classList.toggle("collapsed"));
    closeBtn.addEventListener("click", () => panel!.classList.add("hidden"));
    // 搜索过滤
    let _allEntries: Array<{ id: string; name: string; url: string }> = [];
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      renderNeighborList(body, countInfo, _allEntries, q);
    });
    // 保存引用供 updateNeighborPanel 使用
    (panel as any)._setEntries = (entries: typeof _allEntries) => {
      _allEntries = entries;
      searchInput.value = "";
      renderNeighborList(body, countInfo, entries, "");
      hint.style.display = entries.length > 30 ? "block" : "none";
    };
    document.body.appendChild(panel);
    return panel;
  }
  const neighborPanel = createNeighborPanel();

  // 渲染邻居列表（支持搜索过滤）
  function renderNeighborList(
    body: HTMLElement,
    countEl: HTMLElement,
    entries: Array<{ id: string; name: string; url: string }>,
    query: string,
  ) {
    body.innerHTML = "";
    const filtered = query
      ? entries.filter(
          (e) => e.name.toLowerCase().includes(query) || e.url.toLowerCase().includes(query),
        )
      : entries;
    countEl.textContent = query
      ? `${filtered.length} / ${entries.length}`
      : `${entries.length} 个邻居`;
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "np-empty";
      empty.textContent = query ? "无匹配结果" : "无邻居节点";
      body.appendChild(empty);
      return;
    }
    for (const entry of filtered) {
      const item = document.createElement("div");
      item.className = "np-item";
      item.dataset.id = entry.id;
      const nm = document.createElement("div");
      nm.className = "np-item-name";
      nm.textContent = entry.name;
      const ur = document.createElement("div");
      ur.className = "np-item-url";
      ur.textContent = entry.url;
      item.appendChild(nm);
      item.appendChild(ur);
      item.addEventListener("click", () => focusNodeById(entry.id));
      body.appendChild(item);
    }
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
    const neighborIds = neighborMap.get(nodeId);
    if (!neighborIds || neighborIds.size === 0) {
      (neighborPanel as any)._setEntries?.([]);
      return;
    }
    const entries: Array<{ id: string; name: string; url: string }> = [];
    for (const nid of neighborIds) {
      const node = nodes.find((n) => n.id === nid);
      if (node) entries.push({ id: nid, name: node.name || nid, url: node.url || "" });
    }
    entries.sort((a, b) => a.url.localeCompare(b.url));
    (neighborPanel as any)._setEntries?.(entries);
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

  /** 根据邻居总数计算应显示的标签数量 */
  function calcVisibleLabelCount(total: number): number {
    let visible: number;
    if (total <= 30) visible = total;
    else if (total <= 80) visible = Math.round(total * 0.7);
    else if (total <= 200) visible = Math.round(total * 0.4);
    else visible = Math.round(total * 0.2);
    return Math.max(10, Math.min(total, visible, 80));
  }

  function buildNeighborLabels(nodeId: string) {
    clearNeighborLabels();
    const neighborIds = neighborMap.get(nodeId);
    if (!neighborIds || neighborIds.size === 0) return;

    // 随机打乱，公平选择显示节点
    const shuffled = Array.from(neighborIds);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const maxLabels = calcVisibleLabelCount(shuffled.length);
    const top = shuffled.slice(0, maxLabels);
    const hidden = shuffled.length - maxLabels;

    for (const nid of top) {
      const node = nodes.find((n) => n.id === nid);
      if (!node || node.x == null) continue;
      const name = node.name || node.id;
      if (name.length > 40) continue;
      const sprite = createTextSprite(name, 1, 96);
      sprite.position.set(node.x, (node.y || 0) + 10, node.z || 0);
      (sprite as any)._neighborId = nid;
      (sprite as any)._neighborUrl = node.url || "";
      neighborLabelGroup.add(sprite);
    }

    // 隐藏节点统计标签
    if (hidden > 0) {
      const focusNode = nodes.find((n) => n.id === nodeId);
      if (focusNode && focusNode.x != null) {
        const moreSprite = createTextSprite(`+${hidden} 隐藏`, 1, 56);
        moreSprite.position.set(focusNode.x, (focusNode.y || 0) - 36, focusNode.z || 0);
        (moreSprite as any)._neighborId = null;
        (moreSprite as any)._neighborUrl = "";
        neighborLabelGroup.add(moreSprite);
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
    const sharedCoreGeom = new THREE.CylinderGeometry(0.3, 0.3, 1, 6);
    const sharedHaloGeom = new THREE.CylinderGeometry(0.8, 0.8, 1, 6);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: new THREE.Color(0xffd700),
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: new THREE.Color(0xffd700),
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    for (let i = 0; i < path.length - 1; i++) {
      const a = nodes.find((n) => n.id === path[i]);
      const b = nodes.find((n) => n.id === path[i + 1]);
      if (!a || !b || a.x == null || b.x == null) continue;
      const start = new THREE.Vector3(a.x, a.y!, a.z!);
      const end = new THREE.Vector3(b.x, b.y!, b.z!);
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(end, start);
      const len = dir.length();
      if (len < 0.01) continue;
      dir.normalize();
      quat.setFromUnitVectors(up, dir);
      const halo = new THREE.Mesh(sharedHaloGeom, haloMat);
      halo.position.copy(mid);
      halo.quaternion.copy(quat);
      halo.scale.set(1, len, 1);
      const core = new THREE.Mesh(sharedCoreGeom, coreMat);
      core.position.copy(mid);
      core.quaternion.copy(quat);
      core.scale.set(1, len, 1);
      pathOverlayGroup.add(halo);
      pathOverlayGroup.add(core);
    }
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
      if (pathNodeIds && pathStepIndex >= 0 && nd.id === pathNodeIds[pathStepIndex]) {
        color = adjustHex(nd._cDefault, 70);
      } else if (pathNodeIds && pathNodeIds.includes(nd.id)) {
        color = "#FF8C00";
      } else if (focusedId === nd.id) {
        color = nd._cFocus;
      } else if (highlightedSet.size > 0 && highlightedSet.has(nd.id)) {
        color = nd._cHighlight;
      } else if (highlightedSet.size > 0) {
        color = nd._cDimmed;
      } else {
        color = nd._cDefault;
      }
      setNodeColor(ctx, i, color);
    }
  }

  // ── 13. 动画循环 ──
  let _lastCamPos = { x: 0, y: 0, z: 0 };
  let _queryCamMove = true;
  let _lblFrameSkip = 0;

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
          "position:fixed;bottom:8px;left:8px;z-index:10000;background:rgba(0,0,0,0.7);color:#0f0;padding:4px 8px;border-radius:4px;font:12px monospace;";
        // 移动端移到右下避免遮挡
        const fpsMq = window.matchMedia("(max-width:640px)");
        function updateFpsPos(mq: MediaQueryList | MediaQueryListEvent) {
          _fpsDisplay!.style.left = mq.matches ? "auto" : "8px";
          _fpsDisplay!.style.right = mq.matches ? "8px" : "auto";
        }
        fpsMq.addEventListener("change", updateFpsPos);
        updateFpsPos(fpsMq);
        document.body.appendChild(_fpsDisplay);
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
    const delta = Math.min((now - _lastTime) / 1000, 0.1);
    _lastTime = now;

    // 按需创建标签
    ensureLabels();
    pruneLabels();

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
          if (!show) {
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

    // 邻居大字标签：屏幕空间恒定大小
    if (neighborLabelGroup.children.length > 0) {
      const fovRad = (ctx.camera.fov * Math.PI) / 180;
      const count = neighborLabelGroup.children.length;
      const targetFraction = 0.05 / (1 + count / 50);
      for (const child of neighborLabelGroup.children) {
        const sprite = child as THREE.Sprite;
        const dist = ctx.camera.position.distanceTo(sprite.position);
        const worldH = Math.max(0.1, 2 * dist * Math.tan(fovRad / 2) * targetFraction);
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

    // 粒子 CPU 更新（轻量，每帧都跑）
    updateParticles(ctx, delta);
    // 粒子在动 → 需要渲染
    _needsRender = true;

    // ── 渲染节流 ──
    // 空闲时逐步降低渲染帧率，减少 GPU 负担（尤其是 Bloom 后处理）
    if (!_needsRender) {
      _idleFrames++;
    }
    if (_needsRender) {
      _needsRender = false;
      _idleFrames = 0;
      ctx.composer.render();
    } else {
      _idleFrames++;
      // 空闲逐渐降帧：<1s 60fps, 1-3s 30fps, 3-10s 15fps, >10s 8fps
      const throttleStep =
        _idleFrames < 60 ? 0 :
        _idleFrames < 180 ? 1 :
        _idleFrames < 600 ? 3 :
        6;
      if (throttleStep === 0 || (_idleFrames % (throttleStep + 1)) === 0) {
        ctx.composer.render();
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
      focusNodeById((sprite as any)._neighborId);
    }
  });

  // ── 14. 交互事件 ──
  const tooltip = createTooltip();
  const interaction = createInteraction(ctx, nodes);

  // 高亮叠加线网（hover/focus 时显示）
  const overlayGroup = new THREE.Group();
  overlayGroup.visible = false;
  ctx.scene.add(overlayGroup);

  const sharedHaloGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
  const sharedCoreGeom = new THREE.CylinderGeometry(0.18, 0.18, 1, 6);
  const sharedFocusHaloGeom = new THREE.CylinderGeometry(1.0, 1.0, 1, 6);
  const sharedFocusCoreGeom = new THREE.CylinderGeometry(0.36, 0.36, 1, 6);
  const up_v = new THREE.Vector3(0, 1, 0);
  const quat_v = new THREE.Quaternion();
  const mid_v = new THREE.Vector3();
  const start_v = new THREE.Vector3();
  const end_v = new THREE.Vector3();
  const dir_v = new THREE.Vector3();

  function buildOverlay(nodeId: string | null, color: THREE.ColorRepresentation) {
    while (overlayGroup.children.length > 0) {
      const child = overlayGroup.children[0] as THREE.Mesh;
      child.geometry = undefined as any;
      if (child.material) (child.material as THREE.Material).dispose();
      overlayGroup.remove(child);
    }
    if (!nodeId) {
      overlayGroup.visible = false;
      return;
    }

    const baseColor = new THREE.Color(color);
    const coreMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    const haloMat = new THREE.MeshStandardMaterial({
      color: baseColor.clone(),
      emissive: baseColor.clone(),
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });

    const linkPos = ctx.linkLines.geometry.attributes.position.array as Float32Array;
    const FLOATS_PER_EDGE = EDGE_SEGMENTS * 2 * 3;
    for (let i = 0; i < links.length; i++) {
      if (links[i].source !== nodeId && links[i].target !== nodeId) continue;
      const base = i * FLOATS_PER_EDGE;
      // 曲线起点 = 第 1 段第 1 个顶点
      start_v.set(linkPos[base], linkPos[base + 1], linkPos[base + 2]);
      // 曲线终点 = 最后 1 段第 2 个顶点
      const lastSegOffset = FLOATS_PER_EDGE - 3;
      end_v.set(linkPos[base + lastSegOffset], linkPos[base + lastSegOffset + 1], linkPos[base + lastSegOffset + 2]);
      dir_v.subVectors(end_v, start_v);
      const len = dir_v.length();
      if (len < 0.01) continue;
      dir_v.normalize();
      mid_v.addVectors(start_v, end_v).multiplyScalar(0.5);
      quat_v.setFromUnitVectors(up_v, dir_v);

      const isFocus = color === 0xffdd44;
      const hGeom = isFocus ? sharedFocusHaloGeom : sharedHaloGeom;
      const cGeom = isFocus ? sharedFocusCoreGeom : sharedCoreGeom;

      const halo = new THREE.Mesh(hGeom, haloMat);
      halo.position.copy(mid_v);
      halo.quaternion.copy(quat_v);
      halo.scale.set(1, len, 1);
      const core = new THREE.Mesh(cGeom, coreMat);
      core.position.copy(mid_v);
      core.quaternion.copy(quat_v);
      core.scale.set(1, len, 1);
      overlayGroup.add(halo);
      overlayGroup.add(core);
    }
    overlayGroup.visible = true;
  }

  interaction.onHover = (n: any) => {
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
      if (!focusedId && !pathNodeIds) buildOverlay(n.id, 0xeeeeee);
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
      tooltip.show(content, (window as any).__lastMouseX || 0, (window as any).__lastMouseY || 0);
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

  // ── 15. 聚焦 + 搜索 ──
  let _lastFocusedId: string | null = null;

  function focusNodeById(id: string) {
    _lastFocusedId = focusedId;
    focusedId = id;
    _needsRender = true;
    refreshAllNodeColors();
    buildOverlay(id, 0xffdd44);
    updateNeighborPanel(id);
    buildNeighborLabels(id);
    const node = nodes.find((n) => n.id === id);
    if (node && node.x != null) {
      const pad = Math.max(300, (degreeMap[id] || 0) * 15);
      animateCamera(
        ctx,
        { x: node.x + pad, y: node.y! + pad * 0.5, z: node.z! + pad },
        { x: node.x!, y: node.y!, z: node.z! },
        800,
      );
    }
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
    if (node) focusNodeById(node.id);
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
    if (!document.pointerLockElement) exitFlyMode();
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
      if (dist > 2500) continue;
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
    const ROLL_ACCEL = 0.008;   // 每帧角加速度
    const ROLL_DAMPING = 0.88;  // 松手后衰减系数
    const MAX_ROLL = 0.06;      // 最大横滚角速度 (rad/frame)
    if (flyKeys.q) rollVelocity += ROLL_ACCEL;
    if (flyKeys.e) rollVelocity -= ROLL_ACCEL;
    if (!flyKeys.q && !flyKeys.e) rollVelocity *= ROLL_DAMPING;
    rollVelocity = Math.max(-MAX_ROLL, Math.min(MAX_ROLL, rollVelocity));
    cam.rotateZ(rollVelocity);

    if (flyAutoPilot) updateAutoHover(nodes, ctx.camera);
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
      padding:8px 12px;font-family:sans-serif;font-size:12px;color:#ccc;
      display:none;line-height:1.6;
    `;
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-weight:600;color:#fff;font-size:13px;">🚀 飞行控制</span>
        <button id="fly-panel-toggle" style="background:none;border:none;color:#888;cursor:pointer;font-size:14px;">−</button>
      </div>
      <div id="fly-panel-body">
        <div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 飞行</div>
        <div><kbd>R</kbd> 上升 · <kbd>F</kbd> 下降</div>
        <div><kbd>Q</kbd><kbd>E</kbd> 横滚</div>
        <div><kbd>Shift</kbd> 加速 3×</div>
        <div><kbd>Space</kbd> 自动驾驶 <span id="fly-autopilot-status" style="color:#888;">OFF</span></div>
        <div style="color:#888;margin-top:4px;border-top:1px solid rgba(255,255,255,0.06);padding-top:4px;">准星瞄准 · 左键打开 · 惯性视角</div>
      </div>
      <style>
        #fly-control-panel kbd { display:inline-block;background:rgba(255,255,255,0.1);border-radius:3px;padding:0 5px;font-size:11px;color:#fff;margin:0 1px; }
      </style>
    `;
    document.body.appendChild(panel);
    const toggle = panel.querySelector("#fly-panel-toggle") as HTMLElement;
    const bodyEl = panel.querySelector("#fly-panel-body") as HTMLElement;
    if (toggle && bodyEl) {
      toggle.addEventListener("click", () => {
        const collapsed = bodyEl.style.display === "none";
        bodyEl.style.display = collapsed ? "block" : "none";
        toggle.textContent = collapsed ? "−" : "+";
      });
    }
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
    ctx.camera.rotation.order = "YXZ";
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
      ctx.composer.setSize(width, height);
      ctx.camera.aspect = width / height;
      ctx.camera.updateProjectionMatrix();
    }
  });
  ro.observe(container);

  // ── 19. 公开 API ──
  function find(query: string) {
    if (!query?.trim()) return [];
    const ids = searchIndex.search(query.trim(), { limit: 12 });
    return ids.map((id) => searchStore.get(id as string)).filter(Boolean) as Array<{
      id: string;
      name: string;
      url: string;
    }>;
  }

  function getGraphData() {
    return { nodes, links };
  }

  const api = {
    find,
    focusNodeById,
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

// ─── 紧凑格式展开 ────────────────────────────────────────────────────

function expandCompact(c: any): GraphData {
  const { nid, nnm, nur, nfa, nde, nx, ny, nz } = c;
  const nodes = nid.map((_id: string, i: number) => ({
    id: nid[i],
    name: nnm[i],
    url: nur[i],
    favicon: nfa[i],
    desc: nde[i],
    ...(nx ? { x: nx[i], y: ny[i], z: nz[i] } : {}),
  }));
  const links = (c.ls || []).map((s: number, i: number) => ({
    source: nid[s],
    target: nid[c.lt[i]],
  }));
  return { nodes, links, categories: c.c || [], adjacency: {} };
}

export async function init3dFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const raw = decode(buf) as any;
  const data = raw.nid ? expandCompact(raw) : (raw as GraphData);
  return init3d(data);
}
