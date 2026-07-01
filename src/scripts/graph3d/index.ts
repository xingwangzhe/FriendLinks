/**
 * 3D 球状友链网络图渲染模块
 * 使用 Three.js 原生 InstancedMesh 替代 3d-force-graph
 */
import Fuse from "fuse.js";
import * as THREE from "three";
import { decode } from "msgpackr";
import { PALETTE, hashToIndex, degreeToSize, adjustHex, createTextSprite } from "./utils";
import {
  createRenderer,
  setNodeColor,
  updateAllNodePositions,
  updateLinkPositions,
  zoomToFit,
  animateCamera,
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
      el.style.left = `${x + 12}px`;
      el.style.top = `${y + 12}px`;
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
  const degValues = Object.values(degreeMap);
  const maxDegree = degValues.length ? Math.max(...degValues) : 1;

  // ── 2. 节点预处理 ──
  const rawNodes = graphData.nodes || [];
  const nodes = rawNodes.map((n: any) => {
    const base = n.color || PALETTE[hashToIndex(n.id)];
    return Object.assign({}, n, {
      palColor: base,
      _cDefault: adjustHex(base, 20),
      _cHover: adjustHex(base, 40),
      _cFocus: adjustHex(base, 60),
      _cHighlight: adjustHex(base, 20),
    });
  });

  // ── 4. 搜索索引 ──
  const fuse = new Fuse(nodes, {
    keys: ["name", "url", "id"],
    threshold: 0.3,
    includeScore: true,
  });

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
    source: typeof l.source === "object" && l.source !== null ? l.source.id ?? l.source : l.source,
    target: typeof l.target === "object" && l.target !== null ? l.target.id ?? l.target : l.target,
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
    try { localStorage.setItem(STORAGE_KEY, String(v)); } catch {}
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
  }));

  updateAllNodePositions(ctx, nodes, degreeMap, maxDegree, nodeStates);
  updateLinkPositions(ctx, linkArr, nodeIdToIndex, nodes, linkOpacity.value);

  function refreshLinkColors() {
    (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = linkOpacity.value;
  }

  // ── 8. 标签系统 ──
  const labelGroup = new THREE.Group();
  labelGroup.name = "labels";
  ctx.scene.add(labelGroup);

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
      const dx = n.x - camPos.x, dy = (n.y || 0) - camPos.y, dz = (n.z || 0) - camPos.z;
      const sqDist = dx * dx + dy * dy + dz * dz;
      if (sqDist > 200 * 200) continue;

      labelsCreated.add(i);
      const name = n.name || n.id;
      if (name.length > 40) continue;
      const deg = degreeMap[n.id] || 0;
      const nodeSize = degreeToSize(deg, maxDegree);
      const sprite = createTextSprite(name);
      sprite.position.set(n.x!, n.y! + nodeSize / 2 + 10, n.z!);
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
      min: string, max: string, step: string,
      defaultValue: string,
      onChange: (v: number) => void,
      unit?: string,
    ) {
      const label = document.createElement("label");
      label.textContent = title;
      label.style.cssText = "font-size:12px;color:#aaa;display:block;margin-bottom:4px;margin-top:10px;";
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = min; slider.max = max; slider.step = step;
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
      row.appendChild(slider); row.appendChild(val);
      parent.appendChild(label); parent.appendChild(row);
    }

    addSliderRow(panel, "连线透明度", "0", "1", "0.05", String(linkOpacity.value), (v) => {
      linkOpacity.value = v; saveOpacity(v); refreshLinkColors();
    });
    addSliderRow(panel, "飞船速度", "5", "100", "5", String(MOVE_SPEED), (v) => { MOVE_SPEED = v; });

    {
      const lbl = document.createElement("label");
      lbl.textContent = "节点标签";
      lbl.style.cssText = "font-size:12px;color:#aaa;display:block;margin-bottom:4px;margin-top:10px;";
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = labelShow.value;
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
      row.appendChild(cb); row.appendChild(cbLabel);
      panel.appendChild(lbl); panel.appendChild(row);
    }

    const hint = document.createElement("div");
    hint.textContent = "⚙️ 滚动滚轮可缩放，右键拖拽可旋转";
    hint.style.cssText = "font-size:10px;color:#666;margin-top:10px;text-align:center;";
    panel.appendChild(hint);
    panel.style.cssText = `position:fixed;bottom:70px;right:16px;z-index:9998;
      background:rgba(30,30,40,0.85);backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,0.1);border-radius:8px;
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
      #neighbor-panel { position:fixed; right:0; top:50%; transform:translateY(-50%);
        z-index:9997; width:280px; max-height:75vh; background:var(--card-bg,rgba(20,20,30,0.9));
        backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.1); border-radius:8px 0 0 8px;
        overflow:hidden; font-family:sans-serif; transition:width 0.3s; }
      #neighbor-panel.hidden { display:none; }
      #neighbor-panel.collapsed { width:36px; }
      #neighbor-panel.collapsed .np-body,
      #neighbor-panel.collapsed .np-node-name,
      #neighbor-panel.collapsed .np-title { display:none; }
      #neighbor-panel.collapsed .np-header { border-bottom:none; padding:0; }
      #neighbor-panel.collapsed .np-collapse-btn { transform:rotate(180deg); margin:4px auto; display:block; }
      #neighbor-panel.collapsed .np-close-btn { display:none; }
      .np-header { display:flex; align-items:center; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,0.08); }
      .np-title { font-size:13px; color:#aaa; flex:1; }
      .np-collapse-btn, .np-close-btn { background:none; border:none; color:#aaa; cursor:pointer; font-size:14px; padding:2px 6px; }
      .np-node-name { padding:8px 12px; font-size:14px; color:#fff; border-bottom:1px solid rgba(255,255,255,0.05); }
      .np-body { overflow-y:auto; max-height:55vh; }
      .np-item { display:flex; flex-direction:column; padding:8px 12px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.03); }
      .np-item:hover { background:rgba(255,255,255,0.05); }
      .np-item-name { font-size:13px; color:#eee; }
      .np-item-url { font-size:11px; color:#888; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .np-empty { padding:20px; text-align:center; color:#666; font-size:13px; }
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
    const header = document.createElement("div"); header.className = "np-header";
    const title = document.createElement("div"); title.className = "np-title"; title.textContent = "邻居节点";
    const collapseBtn = document.createElement("button"); collapseBtn.className = "np-collapse-btn"; collapseBtn.textContent = "◀";
    const closeBtn = document.createElement("button"); closeBtn.className = "np-close-btn"; closeBtn.textContent = "×";
    header.appendChild(title); header.appendChild(collapseBtn); header.appendChild(closeBtn);
    const nodeName = document.createElement("div"); nodeName.className = "np-node-name";
    const body = document.createElement("div"); body.className = "np-body";
    panel.appendChild(header); panel.appendChild(nodeName); panel.appendChild(body);
    collapseBtn.addEventListener("click", () => panel!.classList.toggle("collapsed"));
    closeBtn.addEventListener("click", () => panel!.classList.add("hidden"));
    document.body.appendChild(panel);
    return panel;
  }
  const neighborPanel = createNeighborPanel();

  function updateNeighborPanel(nodeId: string | null) {
    if (!neighborPanel) return;
    if (!nodeId) { neighborPanel.classList.add("hidden"); return; }
    if (!neighborPanel.classList.contains("collapsed")) neighborPanel.classList.remove("hidden");
    const focusedNode = nodes.find((n) => n.id === nodeId);
    const nameEl = neighborPanel.querySelector(".np-node-name");
    if (nameEl) nameEl.textContent = focusedNode ? focusedNode.name || focusedNode.id : nodeId;
    const body = neighborPanel.querySelector(".np-body") as HTMLElement;
    if (!body) return;
    body.innerHTML = "";
    const neighborIds = neighborMap.get(nodeId);
    if (!neighborIds || neighborIds.size === 0) {
      const empty = document.createElement("div"); empty.className = "np-empty"; empty.textContent = "无邻居节点";
      body.appendChild(empty); return;
    }
    const entries: Array<{ id: string; name: string; url: string }> = [];
    for (const nid of neighborIds) {
      const node = nodes.find((n) => n.id === nid);
      if (node) entries.push({ id: nid, name: node.name || nid, url: node.url || "" });
    }
    entries.sort((a, b) => a.url.localeCompare(b.url));
    for (const entry of entries) {
      const item = document.createElement("div"); item.className = "np-item"; item.dataset.id = entry.id;
      const nm = document.createElement("div"); nm.className = "np-item-name"; nm.textContent = entry.name;
      const ur = document.createElement("div"); ur.className = "np-item-url"; ur.textContent = entry.url;
      item.appendChild(nm); item.appendChild(ur);
      item.addEventListener("click", () => focusNodeById(entry.id));
      body.appendChild(item);
    }
  }

  // ── 11. 路径查找 ──
  function clearOldPathState() {
    pathNodeIds = null; pathStepIndex = -1;
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
    clearOldPathState();
    if (path.length < 2) return;
    pathOverlayGroup = new THREE.Group();
    const sharedCoreGeom = new THREE.CylinderGeometry(0.3, 0.3, 1, 6);
    const sharedHaloGeom = new THREE.CylinderGeometry(0.8, 0.8, 1, 6);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: new THREE.Color(0xffd700), emissiveIntensity: 0.7, transparent: true, opacity: 1, depthWrite: false });
    const haloMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: new THREE.Color(0xffd700), emissiveIntensity: 0.4, transparent: true, opacity: 0.25, depthWrite: false });
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
      halo.position.copy(mid); halo.quaternion.copy(quat); halo.scale.set(1, len, 1);
      const core = new THREE.Mesh(sharedCoreGeom, coreMat);
      core.position.copy(mid); core.quaternion.copy(quat); core.scale.set(1, len, 1);
      pathOverlayGroup.add(halo); pathOverlayGroup.add(core);
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
    focusedId = null; highlightedSet.clear();
    updateNeighborPanel(null);
    pathNodeIds = path; pathStepIndex = 0;
    refreshPathNodeColors();
    buildOverlay(null, 0xffffff); // 清除聚焦叠加线
    // 路径模式下隐藏普通连线，只显示金色路径管道
    (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = 0;
    buildPathOverlay(path);
    const first = nodes.find((n) => n.id === path[0]);
    if (first && first.x != null) {
      const pad = 200;
      animateCamera(ctx, { x: first.x + pad, y: first.y! + pad * 0.5, z: first.z! + pad }, { x: first.x!, y: first.y!, z: first.z! }, 800);
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
    refreshAllNodeColors();
    (ctx.linkLines.material as THREE.LineBasicMaterial).opacity = linkOpacity.value;
  }

  function getPathInfo() {
    if (!pathNodeIds) return null;
    return { path: pathNodeIds, totalSteps: pathNodeIds.length, currentStep: pathStepIndex, currentId: pathStepIndex >= 0 ? pathNodeIds[pathStepIndex] : null };
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
        _fpsDisplay.style.cssText = "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:10000;background:rgba(0,0,0,0.7);color:#0f0;padding:4px 8px;border-radius:4px;font:12px monospace;";
        document.body.appendChild(_fpsDisplay);
      }
      const nodeCount = ctx.nodes.count;
      const labelCount = labelGroup.children.length;
      _fpsDisplay.textContent = `FPS:${fps} | nodes:${nodeCount} | labels:${labelCount}`;
    }
  }

  function animateLoop() {
    requestAnimationFrame(animateLoop);

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
      _lastCamPos.x = camPos.x; _lastCamPos.y = camPos.y; _lastCamPos.z = camPos.z;
      _queryCamMove = false;

      // 标签淡出（每 3 帧才跑一次，减少 CPU 消耗）
      _lblFrameSkip++;
      if (_lblFrameSkip >= 3 && labelGroup.children.length > 0) {
        _lblFrameSkip = 0;
        ensureLabels(); // 相机移动时检查是否有新节点进入视野
        const show = labelShow.value;
        for (const child of labelGroup.children) {
          const sprite = child as THREE.Sprite;
          const np = (sprite as any)._nodePos;
          if (!np) continue;
          if (!show) { sprite.visible = false; continue; }
          const dx = np.x - camPos.x, dy = np.y - camPos.y, dz = np.z - camPos.z;
          const sqDist = dx * dx + dy * dy + dz * dz;
          if (sqDist > LABEL_MAX_FADE_START * LABEL_MAX_FADE_START) {
            sprite.visible = false;
          } else if (sqDist < LABEL_FADE_FULL * LABEL_FADE_FULL) {
            sprite.visible = true; sprite.material.opacity = 1;
          } else {
            sprite.visible = true;
            sprite.material.opacity = (LABEL_MAX_FADE_START - Math.sqrt(sqDist)) / (LABEL_MAX_FADE_START - LABEL_FADE_FULL);
          }
        }
      }
    }

    // 飞船模式（独立控制，不与 OrbitControls 冲突）
    if (isFlyMode) {
      flyLoop();
    } else {
      ctx.controls.update();
    }

    ctx.renderer.render(ctx.scene, ctx.camera);
  }

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
    if (!nodeId) { overlayGroup.visible = false; return; }

    const baseColor = new THREE.Color(color);
    const coreMat = new THREE.MeshStandardMaterial({
      color: baseColor, emissive: baseColor, emissiveIntensity: 0.7, transparent: true, opacity: 1, depthWrite: false,
    });
    const haloMat = new THREE.MeshStandardMaterial({
      color: baseColor.clone(), emissive: baseColor.clone(), emissiveIntensity: 0.4, transparent: true, opacity: 0.25, depthWrite: false,
    });

    const linkPos = ctx.linkLines.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < links.length; i++) {
      if (links[i].source !== nodeId && links[i].target !== nodeId) continue;
      const j = i * 6;
      start_v.set(linkPos[j], linkPos[j + 1], linkPos[j + 2]);
      end_v.set(linkPos[j + 3], linkPos[j + 4], linkPos[j + 5]);
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
      halo.position.copy(mid_v); halo.quaternion.copy(quat_v); halo.scale.set(1, len, 1);
      const core = new THREE.Mesh(cGeom, coreMat);
      core.position.copy(mid_v); core.quaternion.copy(quat_v); core.scale.set(1, len, 1);
      overlayGroup.add(halo); overlayGroup.add(core);
    }
    overlayGroup.visible = true;
  }

  interaction.onHover = (n: any) => {
    const newHoveredId = n ? n.id : null;
    if (lastHoveredId === newHoveredId) return;
    const prevId = hoveredId;
    hoveredId = newHoveredId; lastHoveredId = newHoveredId;
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
      const titleEl = document.createElement("strong"); titleEl.textContent = n.name || n.id;
      content.appendChild(titleEl);
      if (n.desc) { const d = document.createElement("div"); d.textContent = n.desc; content.appendChild(d); }
      if (n.url) { const a = document.createElement("a"); a.href = n.url; a.target = "_blank"; a.rel = "noopener"; a.textContent = n.url; a.style.color = "#87ceeb"; content.appendChild(a); }
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
    _lastFocusedId = focusedId; focusedId = id;
    refreshAllNodeColors();
    buildOverlay(id, 0xffdd44);
    updateNeighborPanel(id);
    const node = nodes.find((n) => n.id === id);
    if (node && node.x != null) {
      const pad = Math.max(100, (degreeMap[id] || 0) * 5);
      animateCamera(ctx, { x: node.x + pad, y: node.y! + pad * 0.5, z: node.z! + pad }, { x: node.x!, y: node.y!, z: node.z! }, 800);
    }
  }

  function highlightNodesAndNeighbors(ids: string[]) {
    highlightedSet = new Set(ids);
    for (const id of ids) {
      const nbrs = neighborMap.get(id);
      if (nbrs) for (const nb of nbrs) highlightedSet.add(nb);
    }
    refreshAllNodeColors();
  }

  function clearHighlights() {
    highlightedSet.clear();
    if (focusedId) { focusedId = null; updateNeighborPanel(null); buildOverlay(null, 0xffffff); }
    refreshAllNodeColors();
  }

  function focusByDomain(domain: string) {
    const node = nodes.find((n) => {
      try { return new URL(n.url).hostname === domain; } catch { return false; }
    });
    if (node) focusNodeById(node.id);
  }

  // ── 16. 飞船模式 ──
  let isFlyMode = false;
  const flyKeys: Record<string, boolean> = {};
  let flyAutoPilot = false;
  const SHIFT_MULTIPLIER = 3;
  const MOUSE_SENSITIVITY = 0.003;
  const RETICLE_SPRING = 30;
  const RETICLE_DAMPING = 12;
  const reticleOffset = { x: 0, y: 0 };
  const reticleVelocity = { x: 0, y: 0 };
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
    el.style.cssText = "position:fixed;top:50%;left:50%;pointer-events:none;z-index:10000;transform:translate(-50%,-50%);display:none;";
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
      if (score > bestScore) { bestScore = score; bestNode = node; }
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
        a.href = bestNode.url; a.target = "_blank"; a.rel = "noopener noreferrer";
        a.textContent = bestNode.url; a.style.color = "#87ceeb"; a.style.textDecoration = "underline";
        urlEl.appendChild(a); content.appendChild(urlEl);
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
      const x = Math.round(reticleOffset.x), y = Math.round(reticleOffset.y);
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
    if (flyKeys.q) cam.rotateZ(speed * 0.003);
    if (flyKeys.e) cam.rotateZ(-speed * 0.003);

    if (flyAutoPilot) updateAutoHover(nodes, ctx.camera);
  }

  function createFlyControlPanel(): HTMLElement {
    let panel = document.getElementById("fly-control-panel") as HTMLElement | null;
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "fly-control-panel";
    panel.style.cssText = `
      position:fixed;bottom:70px;left:16px;z-index:9998;
      background:rgba(16,16,24,0.88);backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,0.08);border-radius:8px;
      padding:8px 12px;font-family:sans-serif;font-size:12px;color:#ccc;
      display:none;max-width:220px;line-height:1.6;
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
    reticleOffset.x = 0; reticleOffset.y = 0;
    reticleVelocity.x = 0; reticleVelocity.y = 0;
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
  }

  function exitFlyMode() {
    isFlyMode = false;
    // 同步 OrbitControls target 到当前视线方向，避免切回时相机跳动
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
    try { document.exitPointerLock?.(); } catch {}
    if (flyCrosshair) { flyCrosshair.style.display = "none"; flyCrosshair = null; }
    if (flyControlPanel) { flyControlPanel.style.display = "none"; flyControlPanel = null; }
    (interaction as any).setFlyMode?.(false);
    document.body.style.cursor = "";
  }

  function toggleFlightMode(): boolean {
    if (isFlyMode) exitFlyMode(); else enterFlyMode();
    return isFlyMode;
  }

  // ── 17. 启动 ──
  zoomToFit(ctx, nodes, 400, 80);
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
    return fuse.search(query.trim()).map((r) => ({
      id: r.item.id, name: (r.item as any).name || r.item.id, url: (r.item as any).url,
    }));
  }

  function getGraphData() {
    return { nodes, links };
  }

  const api = {
    find, focusNodeById, highlightNodesAndNeighbors, clearHighlights, focusByDomain,
    toggleFlightMode, showShortestPath, stepPathNext, stepPathPrev, clearPath, getPathInfo, getGraphData,
    ctx,
    updateLinkOpacity(v: number) { linkOpacity.value = v; refreshLinkColors(); },
  };
  (window as any).__graphApi = (window as any).__graphApi || {};
  Object.assign((window as any).__graphApi, api);
  return api;
}

// ─── 紧凑格式展开 ────────────────────────────────────────────────────

function expandCompact(c: any): GraphData {
  const { nid, nnm, nur, nfa, nde, nx, ny, nz } = c;
  const nodes = nid.map((_id: string, i: number) => ({
    id: nid[i], name: nnm[i], url: nur[i], favicon: nfa[i], desc: nde[i],
    ...(nx ? { x: nx[i], y: ny[i], z: nz[i] } : {}),
  }));
  const links = (c.ls || []).map((s: number, i: number) => ({
    source: nid[s], target: nid[c.lt[i]],
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
