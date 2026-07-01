/**
 * 3D 球状友链网络图渲染模块
 * 使用 3d-force-graph (Three.js) 替代 sigma.js 2D 渲染
 */

import ForceGraph3D from "3d-force-graph";
import Fuse from "fuse.js";
import * as THREE from "three";
import { decode } from "msgpackr";
import { PALETTE, hashToIndex, degreeToSize, adjustHex, createNodeLOD, updateLODColor } from "./utils";
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
      el.style.left = `${x + 12}px`;
      el.style.top = `${y + 12}px`;
      el.style.display = "block";
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

  // 清空容器（移除 sigma 遗留的 canvas）
  container.innerHTML = "";

  // ── 1. 计算度数 ──────────────────────────────────────────────────
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

  // ── 主题：强制暗色宇宙模式 ────────────────────────────────
  const isDark = true;

  // ── 3. 预处理节点 & 预计算颜色 ────────────────────────────────
  const rawNodes = graphData.nodes || [];
  const nodes = rawNodes.map((n: any) => {
    const base = n.color || PALETTE[hashToIndex(n.id)];
    return Object.assign({}, n, {
      palColor: base,
      _cDefault: adjustHex(base, 20), // 暗色模式下调亮 20%
      _cHover: adjustHex(base, 40),
      _cFocus: adjustHex(base, 60),
      _cHighlight: adjustHex(base, 20),
    });
  });

  const links = rawLinks.map((l: any) => ({
    source: l.source ?? l[0],
    target: l.target ?? l[1],
  }));

  // ── 4. 搜索索引 ──────────────────────────────────────────────────
  const fuse = new Fuse(nodes, {
    keys: ["name", "url", "id"],
    threshold: 0.3,
    includeScore: true,
  });

  // ── 5. 高亮状态 ──────────────────────────────────────────────────
  let hoveredId: string | null = null;
  let lastHoveredId: string | null = null;
  let focusedId: string | null = null;
  let highlightedSet = new Set<string>();

  let _lastFocusedId: string | null = null;

  // ── 路径查找状态（独立于 focus/highlight）──────────────────
  let pathNodeIds: string[] | null = null; // 当前最短路径节点 ID 序列
  let pathStepIndex = -1; // 当前步进到的节点在 pathNodeIds 中的索引，-1 表示未步进
  let pathOverlayGroup: THREE.Group | null = null; // 路径管道 + 箭头的叠加组

  // ── 6. Tooltip ──────────────────────────────────────────────────
  const tooltip = createTooltip();

  // 构建邻居映射
  const neighborMap = new Map<string, Set<string>>();
  for (const l of links) {
    const src = typeof l.source === "object" ? l.source.id : l.source;
    const tgt = typeof l.target === "object" ? l.target.id : l.target;
    if (!neighborMap.has(src)) neighborMap.set(src, new Set());
    if (!neighborMap.has(tgt)) neighborMap.set(tgt, new Set());
    neighborMap.get(src)!.add(tgt);
    neighborMap.get(tgt)!.add(src);
  }

  // ── 6b. 连线透明度控制（持久化） ──────────────────────────────
  const STORAGE_KEY = "friendlinks_link_opacity";
  const saved = (() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v !== null) {
        const n = parseFloat(v);
        if (!isNaN(n) && n >= 0 && n <= 1) return n;
      }
    } catch {}
    return 0; // 默认透明，用户通过面板自行调节
  })();

  const linkOpacity = { value: saved };

  function saveOpacity(v: number) {
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch {}
  }

  function createControlPanel() {
    let panel = document.getElementById("graph-control-panel") as HTMLElement | null;
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = "graph-control-panel";

    const label = document.createElement("label");
    label.textContent = "连线透明度";
    label.style.cssText = "font-size:12px;color:#aaa;display:block;margin-bottom:4px;";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.05";
    slider.value = String(linkOpacity.value);
    slider.style.cssText = "width:100%;accent-color:#4a9eff;";

    const valueDisplay = document.createElement("span");
    valueDisplay.textContent = slider.value;
    valueDisplay.style.cssText = "font-size:11px;color:#aaa;margin-left:6px;";

    slider.addEventListener("input", () => {
      const v = parseFloat(slider.value);
      linkOpacity.value = v;
      valueDisplay.textContent = slider.value;
      saveOpacity(v);
      // 触发连线颜色刷新
      refreshLinkColors();
    });

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display:flex;align-items:center;";
    wrapper.appendChild(slider);
    wrapper.appendChild(valueDisplay);

    const hint = document.createElement("div");
    hint.textContent = "⚙️ 持久化保存，下次自动恢复";
    hint.style.cssText = "font-size:10px;color:#666;margin-top:6px;text-align:center;";

    panel.appendChild(label);
    panel.appendChild(wrapper);
    panel.appendChild(hint);

    panel.style.cssText = `
      position:fixed;bottom:70px;right:16px;z-index:9998;
      background:rgba(30,30,40,0.85);
      backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,0.1);
      border-radius:8px;
      padding:10px 14px;
      min-width:150px;
      display:none;
      font-family:sans-serif;
    `;

    document.body.appendChild(panel);
    return panel;
  }

  const controlPanel = createControlPanel();

  function togglePanel() {
    controlPanel.style.display = controlPanel.style.display === "none" ? "block" : "none";
  }

  // 暴露 toggle 方法给外部使用
  (window as any).__toggleOpacityPanel = togglePanel;

  // ── 7b. 邻居节点右侧面板 ──────────────────────────────────────────

  function createNeighborPanelStyle() {
    const id = "neighbor-panel-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      #neighbor-panel {
        position: fixed; right: 0; top: 50%; transform: translateY(-50%);
        width: 280px; max-height: 75vh;
        background: var(--card-bg, rgba(30,30,40,0.92));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid var(--border, rgba(255,255,255,0.1));
        border-right: none;
        border-radius: 8px 0 0 8px;
        z-index: 9997;
        display: flex; flex-direction: column;
        font-family: sans-serif;
        box-shadow: -4px 0 24px rgba(0,0,0,0.2);
        transition: width 0.25s ease, transform 0.25s ease;
        overflow: hidden;
      }
      #neighbor-panel.hidden { display: none; }
      #neighbor-panel.collapsed { width: 36px; }
      #neighbor-panel.collapsed .np-body,
      #neighbor-panel.collapsed .np-node-name,
      #neighbor-panel.collapsed .np-title { display: none; }
      #neighbor-panel.collapsed .np-header { border-bottom: none; padding: 0; }
      #neighbor-panel.collapsed .np-collapse-btn {
        width: 36px; height: 36px; border-radius: 8px 0 0 8px; border: none;
        font-size: 14px; margin: 0;
      }
      #neighbor-panel.collapsed .np-close-btn { display: none; }
      .np-header {
        padding: 8px 10px 6px;
        border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
        flex-shrink: 0;
      }
      .np-title-row {
        display: flex; align-items: center; gap: 4px;
      }
      .np-title {
        font-size: 11px; font-weight: 600;
        color: var(--muted, #aaa);
        text-transform: uppercase; letter-spacing: 0.5px;
        flex: 1;
      }
      .np-node-name {
        font-size: 13px; font-weight: 600;
        color: var(--text-color, #fff);
        padding: 3px 0 0 0;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .np-collapse-btn, .np-close-btn {
        background: none; border: none; border-radius: 4px;
        color: var(--muted, #888); cursor: pointer;
        font-size: 12px; width: 22px; height: 22px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: background 0.15s;
      }
      .np-collapse-btn:hover, .np-close-btn:hover {
        background: rgba(255,255,255,0.08);
        color: var(--text-color, #fff);
      }
      .np-body {
        flex: 1; overflow-y: auto;
        padding: 2px 0;
        max-height: 55vh;
      }
      .np-body::-webkit-scrollbar { width: 4px; }
      .np-body::-webkit-scrollbar-thumb {
        background: var(--border, rgba(255,255,255,0.15));
        border-radius: 2px;
      }
      .np-item {
        padding: 6px 10px; cursor: pointer;
        border-bottom: 1px solid var(--border, rgba(255,255,255,0.04));
        transition: background 0.12s;
      }
      .np-item:hover { background: rgba(255,255,255,0.06); }
      .np-item-name {
        font-size: 13px; font-weight: 600;
        color: var(--text-color, #fff);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .np-item-url {
        font-size: 11px;
        color: var(--muted, #888);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        margin-top: 1px;
      }
      .np-empty {
        padding: 16px 10px; font-size: 12px;
        color: var(--muted, #888); text-align: center;
      }
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

    // header
    const header = document.createElement("div");
    header.className = "np-header";

    const titleRow = document.createElement("div");
    titleRow.className = "np-title-row";

    const title = document.createElement("span");
    title.className = "np-title";
    title.textContent = "邻居节点";

    const collapseBtn = document.createElement("button");
    collapseBtn.className = "np-collapse-btn";
    collapseBtn.textContent = "◀";
    collapseBtn.title = "收起面板";

    const closeBtn = document.createElement("button");
    closeBtn.className = "np-close-btn";
    closeBtn.textContent = "×";
    closeBtn.title = "关闭面板";

    titleRow.appendChild(title);
    titleRow.appendChild(collapseBtn);
    titleRow.appendChild(closeBtn);

    const nodeName = document.createElement("div");
    nodeName.className = "np-node-name";

    header.appendChild(titleRow);
    header.appendChild(nodeName);

    // body
    const body = document.createElement("div");
    body.className = "np-body";

    panel.appendChild(header);
    panel.appendChild(body);

    // interactions
    collapseBtn.addEventListener("click", () => {
      panel!.classList.toggle("collapsed");
      collapseBtn.textContent = panel!.classList.contains("collapsed") ? "▶" : "◀";
      collapseBtn.title = panel!.classList.contains("collapsed") ? "展开面板" : "收起面板";
    });

    closeBtn.addEventListener("click", () => {
      panel!.classList.add("hidden");
    });

    document.body.appendChild(panel);
    return panel;
  }

  const neighborPanel = createNeighborPanel();

  function updateNeighborPanel(nodeId: string | null) {
    if (!neighborPanel) return;
    if (!nodeId) {
      neighborPanel.classList.add("hidden");
      return;
    }

    // If collapse is active, don't auto-expand — keep collapsed state
    if (!neighborPanel.classList.contains("collapsed")) {
      neighborPanel.classList.remove("hidden");
    }

    const gd = Graph.graphData() as any;
    const focusedNode = gd.nodes?.find((n: any) => n.id === nodeId);
    const nameEl = neighborPanel.querySelector(".np-node-name");
    if (nameEl) {
      nameEl.textContent = focusedNode ? focusedNode.name || focusedNode.id : nodeId;
    }

    const body = neighborPanel.querySelector(".np-body") as HTMLElement;
    if (!body) return;
    body.innerHTML = "";

    const neighborIds = neighborMap.get(nodeId);
    if (!neighborIds || neighborIds.size === 0) {
      const empty = document.createElement("div");
      empty.className = "np-empty";
      empty.textContent = "无邻居节点";
      body.appendChild(empty);
      return;
    }

    // Collect neighbor data
    const entries: Array<{ id: string; name: string; url: string }> = [];
    for (const nid of neighborIds) {
      const node = gd.nodes?.find((n: any) => n.id === nid);
      if (node) {
        entries.push({
          id: nid,
          name: node.name || nid,
          url: node.url || "",
        });
      }
    }

    // Sort by URL dictionary order
    entries.sort((a, b) => a.url.localeCompare(b.url));

    for (const entry of entries) {
      const item = document.createElement("div");
      item.className = "np-item";
      item.dataset.id = entry.id;

      const nameEl_ = document.createElement("div");
      nameEl_.className = "np-item-name";
      nameEl_.textContent = entry.name;

      const urlEl = document.createElement("div");
      urlEl.className = "np-item-url";
      urlEl.textContent = entry.url;

      item.appendChild(nameEl_);
      item.appendChild(urlEl);

      item.addEventListener("click", () => {
        focusNodeById(entry.id);
      });

      body.appendChild(item);
    }
  }

  // ── 7. 创建 3D 图 ────────────────────────────────────────────────

  // 7a ─ 构建合并的 LineSegments ──────────────────────────────────
  const linkPosArr = new Float32Array(links.length * 2 * 3);

  // 用预计算坐标填充初始位置
  for (let i = 0; i < links.length; i++) {
    const srcId = links[i].source;
    const tgtId = links[i].target;
    const srcNode = nodes.find((n: any) => n.id === srcId);
    const tgtNode = nodes.find((n: any) => n.id === tgtId);
    if (srcNode && tgtNode) {
      const idx = i * 6;
      linkPosArr[idx] = srcNode.x || 0;
      linkPosArr[idx + 1] = srcNode.y || 0;
      linkPosArr[idx + 2] = srcNode.z || 0;
      linkPosArr[idx + 3] = tgtNode.x || 0;
      linkPosArr[idx + 4] = tgtNode.y || 0;
      linkPosArr[idx + 5] = tgtNode.z || 0;
    }
  }

  // ── 基础线网（始终可见，透明度由滑块控制） ──────────────────
  const baseLinkGeom = new THREE.BufferGeometry();
  baseLinkGeom.setAttribute("position", new THREE.BufferAttribute(linkPosArr, 3));

  const baseLinkMat = new THREE.LineBasicMaterial({
    color: isDark ? 0x555555 : 0xbbbbbb,
    transparent: true,
    opacity: linkOpacity.value,
    depthWrite: false,
  });

  const baseLinkSegments = new THREE.LineSegments(baseLinkGeom, baseLinkMat);

  // ── 叠加线网（hover/focus 时显示，粗管+荧光） ──────────────
  const LINK_THICKNESS = 0.35;
  const sharedCoreGeom = new THREE.CylinderGeometry(LINK_THICKNESS * 0.3, LINK_THICKNESS * 0.3, 1, 5);
  const sharedHaloGeom = new THREE.CylinderGeometry(LINK_THICKNESS * 1.8, LINK_THICKNESS * 1.8, 1, 8);

  // 路径管道 + 箭头共享几何体（金黄色，比 hover/focus 管道略细）
  const PATH_TUBE_THICKNESS = 0.25;
  const sharedPathCoreGeom = new THREE.CylinderGeometry(PATH_TUBE_THICKNESS * 0.3, PATH_TUBE_THICKNESS * 0.3, 1, 5);
  const sharedPathHaloGeom = new THREE.CylinderGeometry(PATH_TUBE_THICKNESS * 1.5, PATH_TUBE_THICKNESS * 1.5, 1, 8);
  const sharedArrowGeom = new THREE.ConeGeometry(0.4, 1.0, 6, 8);

  const overlayGroup = new THREE.Group();
  overlayGroup.visible = false;

  // 合并成组供 linkThreeObject 使用
  const linkGroup = new THREE.Group();
  linkGroup.add(baseLinkSegments);
  linkGroup.add(overlayGroup);

  let linkObjCreated = false;

  // 7b ─ 颜色刷新函数 ──────────────────────────────────────────
  /** 基础线网透明度始终跟随滑块，不受 hover/focus 影响 */
  function refreshLinkColors() {
    baseLinkMat.opacity = linkOpacity.value;
    baseLinkMat.needsUpdate = true;
  }

  /** 构建叠加线网：粗管 + 荧光光晕 */
  function buildOverlay(nodeId: string | null, color: THREE.ColorRepresentation) {
    // 清除旧的叠加线段
    while (overlayGroup.children.length > 0) {
      const child = overlayGroup.children[0] as THREE.Mesh;
      child.geometry = undefined as any; // 共享几何体不在此 dispose
      if (child.material) (child.material as THREE.Material).dispose();
      overlayGroup.remove(child);
    }

    if (!nodeId) {
      overlayGroup.visible = false;
      return;
    }

    const baseColor = new THREE.Color(color);

    // 核心材质（细、亮、高荧光）
    const coreMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });

    // 光晕材质（粗、半透明、柔光）
    const haloColor = baseColor.clone();
    const haloMat = new THREE.MeshStandardMaterial({
      color: haloColor,
      emissive: haloColor,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });

    const up = new THREE.Vector3(0, 1, 0);
    const start = new THREE.Vector3();
    const end = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const mid = new THREE.Vector3();
    const quat = new THREE.Quaternion();

    for (let i = 0; i < links.length; i++) {
      const srcStr = typeof links[i].source === "object" ? links[i].source.id : links[i].source;
      const tgtStr = typeof links[i].target === "object" ? links[i].target.id : links[i].target;

      if (srcStr === nodeId || tgtStr === nodeId) {
        const baseIdx = i * 6;
        start.set(linkPosArr[baseIdx], linkPosArr[baseIdx + 1], linkPosArr[baseIdx + 2]);
        end.set(linkPosArr[baseIdx + 3], linkPosArr[baseIdx + 4], linkPosArr[baseIdx + 5]);

        dir.subVectors(end, start);
        const length = dir.length();
        if (length < 0.01) continue;
        dir.normalize();

        mid.addVectors(start, end).multiplyScalar(0.5);
        quat.setFromUnitVectors(up, dir);

        // 光晕层（宽、透）
        const haloMesh = new THREE.Mesh(sharedHaloGeom, haloMat);
        haloMesh.position.copy(mid);
        haloMesh.quaternion.copy(quat);
        haloMesh.scale.set(1, length, 1);
        overlayGroup.add(haloMesh);

        // 核心层（细、亮）
        const coreMesh = new THREE.Mesh(sharedCoreGeom, coreMat);
        coreMesh.position.copy(mid);
        coreMesh.quaternion.copy(quat);
        coreMesh.scale.set(1, length, 1);
        overlayGroup.add(coreMesh);
      }
    }

    overlayGroup.visible = true;
  }

  /** 清除路径状态（不触发颜色刷新） */
  function clearOldPathState() {
    pathNodeIds = null;
    pathStepIndex = -1;
    if (pathOverlayGroup) {
      while (pathOverlayGroup.children.length > 0) {
        const child = pathOverlayGroup.children[0] as THREE.Mesh;
        if (child.material) (child.material as THREE.Material).dispose();
        pathOverlayGroup.remove(child);
      }
      overlayGroup.remove(pathOverlayGroup);
      pathOverlayGroup = null;
    }
  }

  /** 渲染路径叠加线网：黄色管道 + 方向箭头 */
  function buildPathOverlay(pathIds: string[]) {
    // 清除旧路径叠加
    if (pathOverlayGroup) {
      while (pathOverlayGroup.children.length > 0) {
        const child = pathOverlayGroup.children[0] as THREE.Mesh;
        if (child.material) (child.material as THREE.Material).dispose();
        pathOverlayGroup.remove(child);
      }
      overlayGroup.remove(pathOverlayGroup);
      pathOverlayGroup = null;
    }

    if (!pathIds || pathIds.length < 2) return;

    pathOverlayGroup = new THREE.Group();

    const pathColor = new THREE.Color("#FFD700"); // 金黄色

    // 管道材质
    const coreMat = new THREE.MeshStandardMaterial({
      color: pathColor,
      emissive: pathColor,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const haloMat = new THREE.MeshStandardMaterial({
      color: pathColor,
      emissive: pathColor,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });

    // 箭头材质
    const arrowMat = new THREE.MeshStandardMaterial({
      color: pathColor,
      emissive: pathColor,
      emissiveIntensity: 0.5,
      depthWrite: false,
    });

    const up = new THREE.Vector3(0, 1, 0);
    const start = new THREE.Vector3();
    const end = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const mid = new THREE.Vector3();
    const quat = new THREE.Quaternion();

    // 查找节点的 3D 坐标
    const gd = Graph.graphData() as any;
    const nodePosMap = new Map<string, THREE.Vector3>();
    if (gd.nodes) {
      for (const nd of gd.nodes) {
        if (nd.x != null) {
          nodePosMap.set(nd.id, new THREE.Vector3(nd.x, nd.y, nd.z));
        }
      }
    }

    for (let i = 0; i < pathIds.length - 1; i++) {
      const srcPos = nodePosMap.get(pathIds[i]);
      const tgtPos = nodePosMap.get(pathIds[i + 1]);
      if (!srcPos || !tgtPos) continue;

      start.copy(srcPos);
      end.copy(tgtPos);

      dir.subVectors(end, start);
      const length = dir.length();
      if (length < 0.01) continue;
      dir.normalize();

      mid.addVectors(start, end).multiplyScalar(0.5);
      quat.setFromUnitVectors(up, dir);

      // 光晕管道
      const haloMesh = new THREE.Mesh(sharedPathHaloGeom, haloMat);
      haloMesh.position.copy(mid);
      haloMesh.quaternion.copy(quat);
      haloMesh.scale.set(1, length, 1);
      pathOverlayGroup.add(haloMesh);

      // 核心管道
      const coreMesh = new THREE.Mesh(sharedPathCoreGeom, coreMat);
      coreMesh.position.copy(mid);
      coreMesh.quaternion.copy(quat);
      coreMesh.scale.set(1, length, 1);
      pathOverlayGroup.add(coreMesh);

      // 箭头（圆锥）：放在中点偏目标 60% 处，锥尖指向目标
      const arrowPos = new THREE.Vector3().copy(start).addScaledVector(dir, length * 0.6);
      const arrowMesh = new THREE.Mesh(sharedArrowGeom, arrowMat);
      arrowMesh.position.copy(arrowPos);
      arrowMesh.quaternion.copy(quat);
      pathOverlayGroup.add(arrowMesh);
    }

    overlayGroup.add(pathOverlayGroup);
    overlayGroup.visible = true;
  }

  /** 刷新路径节点颜色（路径节点使用橙色系，步进节点最亮） */
  function refreshPathNodeColors() {
    const gd = Graph.graphData() as any;
    if (!gd.nodes || !pathNodeIds) return;
    const pathSet = new Set(pathNodeIds);
    for (const nd of gd.nodes) {
      if (pathSet.has(nd.id)) {
        if (pathStepIndex >= 0 && nd.id === pathNodeIds[pathStepIndex]) {
          setNodeColor(nd, adjustHex(nd.palColor, 70));
        } else {
          setNodeColor(nd, "#FF8C00");
        }
      } else {
        // 非路径节点恢复默认颜色，清除之前聚焦/高亮的残留色
        setNodeColor(nd, nd._cDefault);
      }
    }
  }

  /** 相机飞到指定路径节点 */
  function focusPathStepNode(id: string) {
    const gd = Graph.graphData() as any;
    const node = gd.nodes?.find((n: any) => n.id === id);
    if (!node || node.x == null) return;
    const padding = 120;
    Graph.cameraPosition(
      { x: node.x + padding, y: node.y + padding * 0.5, z: node.z + padding },
      { x: node.x, y: node.y, z: node.z },
      500,
    );
  }

  // 7c ─ 创建 Graph（颜色在 graphData 之后设置）───────────────
  const Graph = ForceGraph3D()(container, {
    controlType: "orbit",
  })
    .graphData({ nodes, links })
    .width(container.clientWidth)
    .height(container.clientHeight)
    .nodeLabel(null)
    .nodeColor((n: any) => {
      const id = n.id;
      // 路径步进节点最高优先级
      if (pathNodeIds && pathStepIndex >= 0 && id === pathNodeIds[pathStepIndex]) return adjustHex(n.palColor, 70);
      // 路径节点次优先级
      if (pathNodeIds && pathNodeIds.includes(id)) return "#FF8C00";
      // 原有优先级
      if (focusedId === id) return n._cFocus;
      if (highlightedSet.size > 0 && highlightedSet.has(id)) return n._cHighlight;
      return n._cDefault;
    })
    .nodeVal((n: any) => {
      const deg = degreeMap[n.id] || 0;
      const baseSize = degreeToSize(deg, maxDegree);
      if (focusedId === n.id) return baseSize * 1.5;
      return baseSize;
    })
    .linkThreeObject(() => {
      if (!linkObjCreated) {
        linkObjCreated = true;
        return linkGroup;
      }
      return new THREE.Object3D();
    })
    .linkPositionUpdate(() => false)
    .backgroundColor(isDark ? "#0f1115" : "#ffffff")
    .enableNodeDrag(false)
    .enableNavigationControls(true)
    .nodeOpacity(1.0)
    .warmupTicks(0)
    .cooldownTicks(0)
    .cooldownTime(0)
    .d3AlphaDecay(0.02)
    .d3VelocityDecay(0.3);

  // 初始颜色（必须在 graphData 之后调用，否则框架会重置）
  refreshLinkColors();

  // ── 8. LOD 替换：将默认球体替换为多层级细节模型 ──────────
  let lodsCreated = false;

  /** 刷新所有节点颜色（替代 Graph.nodeColor()，兼容 LOD） */
  function refreshAllNodeColors() {
    const gd = Graph.graphData() as any;
    if (!gd.nodes) return;
    for (const nd of gd.nodes) {
      let color: string;
      // 路径步进节点最高优先级
      if (pathNodeIds && pathStepIndex >= 0 && nd.id === pathNodeIds[pathStepIndex]) {
        color = adjustHex(nd.palColor, 70);
      } else if (pathNodeIds && pathNodeIds.includes(nd.id)) {
        color = "#FF8C00";
      } else if (focusedId === nd.id) {
        color = nd._cFocus;
      } else if (highlightedSet.size > 0 && highlightedSet.has(nd.id)) {
        color = nd._cHighlight;
      } else {
        color = nd._cDefault;
      }
      setNodeColor(nd, color);
    }
  }

  function initLODs() {
    if (lodsCreated) return;
    const gd = Graph.graphData() as any;
    if (!gd.nodes || gd.nodes.length === 0) {
      requestAnimationFrame(initLODs);
      return;
    }
    const first = gd.nodes[0];
    if (!first.__threeObj || !first.__threeObj.children[0]) {
      requestAnimationFrame(initLODs);
      return;
    }
    for (const node of gd.nodes) {
      if (!node.__threeObj || !node.__threeObj.children[0]) continue;
      const oldMesh = node.__threeObj.children[0] as THREE.Mesh;
      if ((oldMesh as any).isLOD) continue; // 已经是 LOD，跳过
      const currentColor = "#" + oldMesh.material.color.getHex().toString(16).padStart(6, "0");
      const lod = createNodeLOD(currentColor);
      // 保持旧 mesh 的 scale（由 nodeVal 设置）
      lod.scale.copy(oldMesh.scale);
      node.__threeObj.children[0] = lod;
      (node as any).__lod = lod;
      // 清理旧材质（几何体由 3d-force-graph 管理，不 dispose）
      if (oldMesh.material) {
        (oldMesh.material as THREE.Material).dispose();
      }
      // 隐藏 3d-force-graph 自动创建的 Sprite 装饰（不再需要）
      for (let i = 1; i < node.__threeObj.children.length; i++) {
        if (node.__threeObj.children[i]) node.__threeObj.children[i].visible = false;
      }
    }
    lodsCreated = true;
  }
  requestAnimationFrame(initLODs);

  // 位置已由构建时预计算，cooldownTicks(0) 冻结仿真

  // 渲染后自动适配视角
  requestAnimationFrame(() => {
    try {
      Graph.zoomToFit(400, 80);
    } catch {}
  });

  // 自适应容器尺寸变化
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      Graph.width(width).height(height);
    }
  });
  ro.observe(container);

  // 叠加线自适应缩放 + LOD 更新
  let lastInteraction = performance.now();
  let frameSkip = 0;
  const FRAME_SKIP_IDLE = 2;

  function animateRipples() {
    const now = performance.now();
    const idle = now - lastInteraction > 2000;

    if (idle) {
      frameSkip++;
      if (frameSkip < FRAME_SKIP_IDLE) {
        requestAnimationFrame(animateRipples);
        return;
      }
      frameSkip = 0;
    }

    const currentData = Graph.graphData() as any;

    // 叠加线自适应
    if (overlayGroup.visible && overlayGroup.children.length > 0) {
      try {
        const cam = Graph.cameraPosition();
        const dist = Math.sqrt(cam.x * cam.x + cam.y * cam.y + cam.z * cam.z);
        const scale = dist / 600;
        const clamped = Math.max(0.5, Math.min(scale, 5));
        for (const child of overlayGroup.children) {
          if (child === pathOverlayGroup) continue;
          const mesh = child as THREE.Mesh;
          const curScale = mesh.scale;
          mesh.scale.set(clamped, curScale.y, clamped);
        }
      } catch {}
    }

    // 路径叠加线
    if (pathOverlayGroup && pathOverlayGroup.children.length > 0) {
      try {
        const cam = Graph.cameraPosition();
        const dist = Math.sqrt(cam.x * cam.x + cam.y * cam.y + cam.z * cam.z);
        const pathScale = dist / 700;
        const pathClamped = Math.max(0.4, Math.min(pathScale, 4));
        for (const child of pathOverlayGroup.children) {
          const mesh = child as THREE.Mesh;
          const curScale = mesh.scale;
          mesh.scale.set(pathClamped, curScale.y, pathClamped);
        }
      } catch {}
    }

    // LOD 更新
    if (lodsCreated && currentData.nodes) {
      const sceneCam = Graph.camera() as THREE.PerspectiveCamera;
      if (sceneCam) {
        for (const node of currentData.nodes) {
          if (node.__lod) (node.__lod as THREE.LOD).update(sceneCam);
        }
      }
    }

    // 飞船模式：更新相机位置
    if (isFlyMode) {
      const cam = Graph.camera() as THREE.PerspectiveCamera;
      if (cam) {
        const dt = 1; // 每帧移动量
        const speed = (flyKeys.shift ? 3 : 1) * MOVE_SPEED * dt;
        if (flyKeys.w) cam.translateZ(-speed);
        if (flyKeys.s) cam.translateZ(speed);
        if (flyKeys.a) cam.translateX(-speed);
        if (flyKeys.d) cam.translateX(speed);
        if (flyKeys.r) cam.translateY(speed);
        if (flyKeys.f) cam.translateY(-speed);
        if (flyKeys.q) cam.rotateZ(speed * 0.03);
        if (flyKeys.e) cam.rotateZ(-speed * 0.03);
      }
    }

    requestAnimationFrame(animateRipples);
  }

  // 监听交互事件，重置空闲计时器
  const interactionEvents = ["mousemove", "mousedown", "wheel", "touchstart", "touchmove"];
  for (const evt of interactionEvents) {
    container.addEventListener(
      evt,
      () => {
        lastInteraction = performance.now();
      },
      { passive: true },
    );
  }

  animateRipples();

  // 阻止右键默认菜单
  container.addEventListener("contextmenu", (e: MouseEvent) => {
    e.preventDefault();
  });
  let mouseX = 0;
  let mouseY = 0;
  container.addEventListener("mousemove", (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ── 9. 交互事件 ──────────────────────────────────────────────────

  // ── 长按检测（移动端替代右键聚焦）────────────────────────────
  let _touchStartTime = 0;
  const _isTouchDevice = "ontouchstart" in window;

  container.addEventListener("touchstart", () => {
    _touchStartTime = Date.now();
  });

  Graph.onNodeClick((n: any) => {
    if (_isTouchDevice && _touchStartTime > 0) {
      const dt = Date.now() - _touchStartTime;
      if (dt > 400) {
        // 长按 → 聚焦
        focusNodeById(n.id);
        return;
      }
    }
    // 短按/点击 → 打开链接
    if (n.url) window.open(n.url, "_blank");
  });

  Graph.onNodeRightClick((n: any) => {
    focusNodeById(n.id);
  });

  function setNodeColor(node: any, color: string) {
    if (!node || !node.__threeObj) return;
    const obj = node.__threeObj.children[0];
    if (obj && (obj as any).isLOD) {
      updateLODColor(obj as THREE.LOD, color);
    } else if (obj && obj.material && obj.material.color) {
      obj.material.color.set(color);
    }
  }

  Graph.onNodeHover((n: any) => {
    const newHoveredId = n ? n.id : null;
    if (lastHoveredId === newHoveredId) return;

    const prevId = hoveredId;
    hoveredId = newHoveredId;
    lastHoveredId = newHoveredId;

    const gd = Graph.graphData() as any;
    const prevNode = gd.nodes?.find((nd: any) => nd.id === prevId);
    const currNode = n;

    if (prevNode) setNodeColor(prevNode, prevNode._cDefault);
    if (currNode) setNodeColor(currNode, currNode._cHover);

    // 更新叠加线网（聚焦/路径模式下不显示悬停叠加线）
    if (focusedId || pathNodeIds) {
      // 聚焦/路径模式下悬停不改变叠加线
    } else if (n) {
      buildOverlay(n.id, isDark ? 0xeeeeee : 0x888888);
    } else {
      buildOverlay(null, 0xffffff);
    }

    if (n) {
      const content = document.createElement("div");
      content.className = "graph-tooltip-content";
      const titleEl = document.createElement("strong");
      titleEl.className = "graph-tooltip-title";
      titleEl.textContent = n.name || n.id;
      content.appendChild(titleEl);

      if (n.desc) {
        const descEl = document.createElement("div");
        descEl.className = "graph-tooltip-desc";
        descEl.textContent = n.desc;
        content.appendChild(descEl);
      }
      if (n.url) {
        const urlEl = document.createElement("div");
        urlEl.className = "graph-tooltip-url";
        const a = document.createElement("a");
        a.href = n.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = n.url;
        a.style.color = isDark ? "#87ceeb" : "#0066cc";
        a.style.textDecoration = "underline";
        urlEl.appendChild(a);
        content.appendChild(urlEl);
      }
      tooltip.show(content, mouseX, mouseY);
    } else {
      tooltip.hide();
    }
  });

  // ── 12. 飞船飞行模式 ────────────────────────────────────────────
  const MOVE_SPEED = 12;
  const MOUSE_SENSITIVITY = 0.003;

  const flyKeys: Record<string, boolean> = {};
  let isFlyMode = false;
  let isPointerLocked = false;
  let spaceshipObj: THREE.Group | null = null;

  function createSpaceship(): THREE.Group {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x88bbff,
      emissive: 0x224488,
      emissiveIntensity: 0.15,
      shininess: 80,
    });
    const darkMat = new THREE.MeshPhongMaterial({ color: 0x445566, shininess: 40 });
    const glassMat = new THREE.MeshPhongMaterial({
      color: 0x88ddff,
      emissive: 0x4488cc,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.5,
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff8800 });

    // 机身
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 1.8, 8), bodyMat);
    body.rotation.x = Math.PI / 2;
    body.position.z = -0.2;
    group.add(body);

    // 机头
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.8, 8), bodyMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = -1.1;
    group.add(nose);

    // 机翼
    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.5), darkMat);
    wing.position.set(0, -0.18, 0.3);
    group.add(wing);
    const wing2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.5), darkMat);
    wing2.position.set(0, 0.18, 0.3);
    group.add(wing2);

    // 驾驶舱
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), glassMat);
    cockpit.position.set(0, 0.28, -0.6);
    cockpit.scale.set(1, 0.6, 1.3);
    group.add(cockpit);

    // 尾翼
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.3), darkMat);
    tail.position.set(0, 0.1, 1.0);
    group.add(tail);

    // 引擎光
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.03, 0.2, 6), glowMat);
    glow.position.set(0, 0, 1.0);
    group.add(glow);

    group.scale.set(1, 1, 1);
    return group;
  }

  function handleKey(e: KeyboardEvent, down: boolean) {
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d", "r", "f", "q", "e", "shift"].includes(k)) {
      e.preventDefault();
      flyKeys[k] = down;
    }
  }

  let flyKeyDownHandler: ((e: KeyboardEvent) => void) | null = null;
  let flyKeyUpHandler: ((e: KeyboardEvent) => void) | null = null;
  let flyPointerMoveHandler: ((e: MouseEvent) => void) | null = null;
  let flyPointerLockChangeHandler: (() => void) | null = null;
  let flyClickHandler: (() => void) | null = null;

  function enterFlyMode() {
    Graph.enableNavigationControls(false);
    isFlyMode = true;

    // 创建飞船挂到相机下
    const cam = Graph.camera() as THREE.PerspectiveCamera;
    spaceshipObj = createSpaceship();
    spaceshipObj.position.set(0, -0.6, -1.2);
    cam.add(spaceshipObj);

    // 键盘
    flyKeyDownHandler = (e) => handleKey(e, true);
    flyKeyUpHandler = (e) => handleKey(e, false);
    document.addEventListener("keydown", flyKeyDownHandler);
    document.addEventListener("keyup", flyKeyUpHandler);

    // Pointer Lock 鼠标环顾
    flyClickHandler = () => {
      if (!isPointerLocked) container.requestPointerLock();
    };
    flyPointerLockChangeHandler = () => {
      isPointerLocked = !!document.pointerLockElement;
    };
    flyPointerMoveHandler = (e: MouseEvent) => {
      if (!isPointerLocked || !isFlyMode) return;
      const cam2 = Graph.camera() as THREE.PerspectiveCamera;
      if (cam2) {
        cam2.rotateY(-e.movementX * MOUSE_SENSITIVITY);
        cam2.rotateX(-e.movementY * MOUSE_SENSITIVITY);
      }
    };
    container.addEventListener("click", flyClickHandler);
    document.addEventListener("pointerlockchange", flyPointerLockChangeHandler);
    document.addEventListener("mousemove", flyPointerMoveHandler);
  }

  function exitFlyMode() {
    isFlyMode = false;
    Graph.enableNavigationControls(true);

    if (spaceshipObj) {
      const cam = Graph.camera() as THREE.PerspectiveCamera;
      cam.remove(spaceshipObj);
      spaceshipObj = null;
    }

    if (flyKeyDownHandler) document.removeEventListener("keydown", flyKeyDownHandler);
    if (flyKeyUpHandler) document.removeEventListener("keyup", flyKeyUpHandler);
    if (flyClickHandler) container.removeEventListener("click", flyClickHandler);
    if (flyPointerLockChangeHandler) document.removeEventListener("pointerlockchange", flyPointerLockChangeHandler);
    if (flyPointerMoveHandler) document.removeEventListener("mousemove", flyPointerMoveHandler);
    flyKeyDownHandler = flyKeyUpHandler = flyPointerMoveHandler = flyPointerLockChangeHandler = flyClickHandler = null;

    if (document.pointerLockElement) document.exitPointerLock();
    isPointerLocked = false;
  }

  function toggleFlightMode(): boolean {
    if (isFlyMode) exitFlyMode();
    else enterFlyMode();
    return isFlyMode;
  }

  // ── 11. API ──────────────────────────────────────────────────────

  function find(query: string) {
    if (!query?.trim()) return [];
    const results = fuse.search(query.trim());
    return results.map((r) => ({
      id: r.item.id,
      name: (r.item as any).name || r.item.id,
      url: (r.item as any).url,
    }));
  }

  function focusNodeById(id: string) {
    _lastFocusedId = focusedId;
    focusedId = id;
    // 刷新节点颜色
    refreshAllNodeColors();
    // 聚焦叠加线网（金色）
    buildOverlay(id, isDark ? 0xffdd44 : 0xff9900);
    // 更新右侧邻居面板
    updateNeighborPanel(id);

    const currentData = Graph.graphData() as any;
    const node = currentData.nodes?.find((n: any) => n.id === id);
    if (!node || node.x == null) return;

    const padding = Math.max(100, degreeMap[id] ? degreeMap[id] * 5 : 100);
    Graph.cameraPosition(
      {
        x: node.x + padding,
        y: node.y + padding * 0.5,
        z: node.z + padding,
      },
      { x: node.x, y: node.y, z: node.z },
      800,
    );
  }

  function highlightNodesAndNeighbors(ids: string[]) {
    highlightedSet.clear();
    for (const id of ids) {
      highlightedSet.add(id);
      for (const l of links) {
        const src = typeof l.source === "object" ? l.source.id : l.source;
        const tgt = typeof l.target === "object" ? l.target.id : l.target;
        if (src === id && tgt) highlightedSet.add(String(tgt));
        if (tgt === id && src) highlightedSet.add(String(src));
      }
    }
    refreshAllNodeColors();
    refreshLinkColors();
  }

  function clearHighlights() {
    highlightedSet.clear();
    focusedId = null;
    updateNeighborPanel(null);
    // 如果有悬停，恢复悬停叠加线网
    if (hoveredId) {
      buildOverlay(hoveredId, isDark ? 0xeeeeee : 0x888888);
    } else {
      buildOverlay(null, 0xffffff);
    }
    refreshAllNodeColors();
    if (hoveredId) {
      const gd = Graph.graphData() as any;
      const h = gd.nodes?.find((nd: any) => nd.id === hoveredId);
      if (h) setNodeColor(h, h._cHover);
    }
  }

  function clearLocalEffects() {
    clearOldPathState(); // 清理路径状态
    highlightedSet.clear();
    focusedId = null;
    _lastFocusedId = null;
    hoveredId = null;
    lastHoveredId = null;
    tooltip.hide();
    updateNeighborPanel(null);
    buildOverlay(null, 0xffffff); // 清除叠加线网
    // 恢复所有节点到默认颜色
    const gd = Graph.graphData() as any;
    if (gd.nodes) {
      for (const nd of gd.nodes) {
        setNodeColor(nd, nd._cDefault);
      }
    }
  }

  function focusByDomain(urlOrHost: string) {
    if (!urlOrHost) return;
    const input = urlOrHost.trim().toLowerCase();
    let targetHost = input;
    try {
      const url = new URL(input.startsWith("http") ? input : `https://${input}`);
      targetHost = url.hostname.toLowerCase();
    } catch {
      targetHost = input;
    }

    const currentData = Graph.graphData() as any;
    const matched =
      currentData.nodes?.filter((n: any) => {
        const nodeUrl = (n.url || "").toString().toLowerCase();
        let nodeHost = nodeUrl;
        try {
          nodeHost = new URL(nodeUrl.startsWith("http") ? nodeUrl : `https://${nodeUrl}`).hostname.toLowerCase();
        } catch {}
        return nodeHost === targetHost || nodeUrl.includes(targetHost);
      }) ?? [];

    if (matched.length > 0) {
      // 只聚焦搜索到的节点，不点亮所有邻居（否则节点密密麻麻一团乱麻）
      clearHighlights();
      focusNodeById(matched[0].id);
    }
  }

  function getGraphData() {
    return Graph.graphData();
  }

  /** 查找并高亮两个节点之间的最短路径 */
  function showShortestPath(fromId: string, toId: string): string[] | null {
    const path = findShortestPath(neighborMap, fromId, toId);
    if (!path) return null;

    // 清理旧状态
    clearOldPathState();
    // 清理聚焦/高亮状态，避免与路径高亮视觉冲突
    focusedId = null;
    _lastFocusedId = null;
    highlightedSet.clear();
    updateNeighborPanel(null);

    pathNodeIds = path;
    pathStepIndex = 0; // 默认步进到起点

    // 高亮路径节点
    refreshPathNodeColors();
    // 清除原有的 hover/focus 叠加线
    buildOverlay(null, 0xffffff);
    // 渲染路径管道 + 箭头
    buildPathOverlay(path);

    // 相机飞到起点
    const gd = Graph.graphData() as any;
    const firstNode = gd.nodes?.find((n: any) => n.id === path[0]);
    if (firstNode && firstNode.x != null) {
      const padding = 120;
      Graph.cameraPosition(
        { x: firstNode.x + padding, y: firstNode.y + padding * 0.5, z: firstNode.z + padding },
        { x: firstNode.x, y: firstNode.y, z: firstNode.z },
        600,
      );
    }

    return path;
  }

  /** 步进到路径上的下一个节点 */
  function stepPathNext(): boolean {
    if (!pathNodeIds || pathStepIndex >= pathNodeIds.length - 1) return false;
    pathStepIndex++;
    refreshPathNodeColors();
    focusPathStepNode(pathNodeIds[pathStepIndex]);
    return true;
  }

  /** 步进到路径上的上一个节点 */
  function stepPathPrev(): boolean {
    if (!pathNodeIds || pathStepIndex <= 0) return false;
    pathStepIndex--;
    refreshPathNodeColors();
    focusPathStepNode(pathNodeIds[pathStepIndex]);
    return true;
  }

  /** 清除路径状态 */
  function clearPath() {
    clearOldPathState();
    refreshAllNodeColors();
    if (hoveredId) {
      buildOverlay(hoveredId, isDark ? 0xeeeeee : 0x888888);
    } else {
      buildOverlay(null, 0xffffff);
    }
  }

  /** 获取当前路径信息 */
  function getPathInfo() {
    if (!pathNodeIds) return null;
    return {
      path: pathNodeIds,
      totalSteps: pathNodeIds.length,
      currentStep: pathStepIndex,
      currentId: pathStepIndex >= 0 ? pathNodeIds[pathStepIndex] : null,
    };
  }

  const api = {
    find,
    focusNodeById,
    focusByDomain,
    highlightNodesAndNeighbors,
    clearHighlights,
    clearLocalEffects,
    updateNeighborPanel,
    toggleFlightMode,
    getGraphData,
    showShortestPath,
    stepPathNext,
    stepPathPrev,
    clearPath,
    getPathInfo,
    _graph: Graph,
  };

  try {
    (window as any).__graphApi = (window as any).__graphApi || {};
    Object.assign((window as any).__graphApi, api);
    (window as any).__graph3d = Graph;
  } catch {}

  return api;
}

// ─── 紧凑格式展开 ─────────────────────────────────────────────────────────

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

// ─── 从 URL 加载 ─────────────────────────────────────────────────────────

export async function init3dFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const raw = decode(buf) as any;
  const data = raw.nid ? expandCompact(raw) : (raw as GraphData);
  return init3d(data);
}
