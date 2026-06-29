/**
 * 3D 球状友链网络图渲染模块
 * 使用 3d-force-graph (Three.js) 替代 sigma.js 2D 渲染
 */

import ForceGraph3D from "3d-force-graph";
import Fuse from "fuse.js";
import * as THREE from "three";
import { PALETTE, hashToIndex, degreeToSize, adjustHex } from "./utils";
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

// ─── Color state ─────────────────────────────────────────────────────────

type ThemeRef = { value: boolean }; // true = dark

// ─── 3D 初始化 ──────────────────────────────────────────────────────────

export function init3d(graphData: GraphData) {
  const container = document.getElementById("main");
  if (!container) return null;

  // 清空容器（移除 sigma 遗留的 canvas）
  container.innerHTML = "";

  // ── 1. 计算度数 ──────────────────────────────────────────────────
  const degreeMap: Record<string, number> = {};
  const rawLinks = graphData.links || [];
  for (const l of rawLinks) {
    const s = l.source ?? l[0];
    const t = l.target ?? l[1];
    if (s != null) degreeMap[s] = (degreeMap[s] || 0) + 1;
    if (t != null) degreeMap[t] = (degreeMap[t] || 0) + 1;
  }
  const degValues = Object.values(degreeMap);
  const maxDegree = degValues.length ? Math.max(...degValues) : 1;

  // ── 2. 主题检测 ────────────────────────────────────────────────
  const prefersDark = (): boolean => {
    if (document.documentElement.dataset.theme === "dark") return true;
    if (document.documentElement.dataset.theme === "light") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  };
  const isDarkRef: ThemeRef = { value: prefersDark() };

  // ── 3. 预处理节点 & 预计算颜色 ────────────────────────────────
  const rawNodes = graphData.nodes || [];
  const isDark = isDarkRef.value;
  const nodes = rawNodes.map((n: any) => {
    const base = PALETTE[hashToIndex(n.id)];
    return Object.assign({}, n, {
      palColor: base,
      _cDefault: isDark ? adjustHex(base, 20) : base,
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
    try { localStorage.setItem(STORAGE_KEY, String(v)); } catch {}
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
      linkPosArr[idx]     = srcNode.x || 0;
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
    color: isDarkRef.value ? 0x555555 : 0xbbbbbb,
    transparent: true,
    opacity: linkOpacity.value,
    depthWrite: false,
  });

  const baseLinkSegments = new THREE.LineSegments(baseLinkGeom, baseLinkMat);

  // ── 叠加线网（hover/focus 时显示） ────────────────────────────
  const overlayPosArr = new Float32Array(links.length * 2 * 3);
  const overlayGeom = new THREE.BufferGeometry();
  overlayGeom.setAttribute("position", new THREE.BufferAttribute(overlayPosArr, 3));
  overlayGeom.setDrawRange(0, 0); // 默认不绘制任何线段

  const overlayMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });

  const overlaySegments = new THREE.LineSegments(overlayGeom, overlayMat);
  overlaySegments.visible = false;

  // 合并成组供 linkThreeObject 使用
  const linkGroup = new THREE.Group();
  linkGroup.add(baseLinkSegments);
  linkGroup.add(overlaySegments);

  let linkObjCreated = false;

  // 7b ─ 颜色刷新函数 ──────────────────────────────────────────
  /** 基础线网透明度始终跟随滑块，不受 hover/focus 影响 */
  function refreshLinkColors() {
    baseLinkMat.opacity = linkOpacity.value;
    baseLinkMat.needsUpdate = true;
  }

  /** 构建叠加线网：只包含与指定节点相连的连线 */
  function buildOverlay(nodeId: string | null, color: THREE.ColorRepresentation) {
    if (!nodeId) {
      overlaySegments.visible = false;
      return;
    }

    const pos = overlayGeom.attributes.position.array as Float32Array;
    let count = 0;

    for (let i = 0; i < links.length; i++) {
      const srcStr = typeof links[i].source === "object" ? links[i].source.id : links[i].source;
      const tgtStr = typeof links[i].target === "object" ? links[i].target.id : links[i].target;

      if (srcStr === nodeId || tgtStr === nodeId) {
        const baseIdx = i * 6;
        const overlayIdx = count * 6;

        pos[overlayIdx]     = linkPosArr[baseIdx];
        pos[overlayIdx + 1] = linkPosArr[baseIdx + 1];
        pos[overlayIdx + 2] = linkPosArr[baseIdx + 2];
        pos[overlayIdx + 3] = linkPosArr[baseIdx + 3];
        pos[overlayIdx + 4] = linkPosArr[baseIdx + 4];
        pos[overlayIdx + 5] = linkPosArr[baseIdx + 5];

        count++;
      }
    }

    overlayMat.color.set(color);
    overlayGeom.setDrawRange(0, count * 2);
    overlayGeom.attributes.position.needsUpdate = true;
    overlaySegments.visible = true;
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
    .backgroundColor(isDarkRef.value ? "#0f1115" : "#ffffff")
    .enableNodeDrag(true)
    .enableNavigationControls(true)
    .nodeOpacity(1.0)
    .warmupTicks(0)
    .cooldownTicks(0)
    .cooldownTime(0)
    .d3AlphaDecay(0.02)
    .d3VelocityDecay(0.3);

  // 初始颜色（必须在 graphData 之后调用，否则框架会重置）
  refreshLinkColors();

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

  // 涟漪波动动画（仅保留 1 层）
  let animationTime = 0;
  let ripplesInited = false;
  function animateRipples() {
    animationTime += 0.02;
    const currentData = Graph.graphData() as any;
    if (currentData.nodes) {
      if (!ripplesInited) {
        for (const node of currentData.nodes) {
          if (node.__threeObj) {
            for (let i = 2; i < node.__threeObj.children.length; i++) {
              node.__threeObj.children[i].visible = false;
            }
          }
        }
        ripplesInited = true;
      }
      const sinA2 = Math.sin(animationTime * 2);
      const sinA3 = Math.sin(animationTime * 3);
      for (const node of currentData.nodes) {
        if (node.__threeObj && node.__threeObj.children.length > 1) {
          const sprite = node.__threeObj.children[1];
          if (sprite) {
            const s = 6 + sinA2 * 0.5;
            sprite.scale.setScalar(s);
            sprite.material.opacity =
              (0.4 + (focusedId === node.id ? 0.45 : hoveredId === node.id ? 0.3 : 0.15)) *
              (0.8 + sinA3 * 0.2);
          }
        }
      }
    }
    requestAnimationFrame(animateRipples);
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

  function withRef(url: string): string {
    try {
      const u = new URL(url);
      const ref = window.location.origin;
      u.searchParams.set("ref", ref);
      return u.href;
    } catch {
      return url;
    }
  }

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
    if (n.url) window.open(withRef(n.url), "_blank");
  });

  Graph.onNodeRightClick((n: any) => {
    focusNodeById(n.id);
  });

  function setNodeColor(node: any, color: string) {
    if (!node || !node.__threeObj) return;
    const mesh = node.__threeObj.children[0];
    if (mesh && mesh.material && mesh.material.color) {
      mesh.material.color.set(color);
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

    // 更新叠加线网（聚焦优先，聚焦时不显示悬停叠加线）
    if (focusedId) {
      // 聚焦状态下悬停不改变叠加线
    } else if (n) {
      buildOverlay(n.id, isDarkRef.value ? 0xeeeeee : 0x888888);
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
        a.href = withRef(n.url);
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = n.url;
        a.style.color = isDarkRef.value ? "#87ceeb" : "#0066cc";
        a.style.textDecoration = "underline";
        urlEl.appendChild(a);
        content.appendChild(urlEl);
      }
      tooltip.show(content, mouseX, mouseY);
    } else {
      tooltip.hide();
    }
  });

  // ── 10. 主题切换 ─────────────────────────────────────────────────
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  const mqHandler = (e: MediaQueryListEvent | MediaQueryList) => {
    const dark = "matches" in e ? e.matches : false;
    if (!document.documentElement.dataset.theme) {
      isDarkRef.value = dark;
      applyTheme();
    }
  };
  if (mq?.addEventListener) {
    mq.addEventListener("change", mqHandler as any);
  } else if (mq?.addListener) {
    (mq as any).addListener(mqHandler);
  }

  const themeBtn = document.getElementById("theme-toggle");
  const themeHandler = () => {
    isDarkRef.value = !isDarkRef.value;
    document.documentElement.dataset.theme = isDarkRef.value ? "dark" : "light";
    applyTheme();
  };
  if (themeBtn) themeBtn.addEventListener("click", themeHandler);

  function applyTheme() {
    const dark = isDarkRef.value;
    Graph.backgroundColor(dark ? "#0f1115" : "#ffffff");
    // 更新基础线网颜色适配主题
    baseLinkMat.color.set(dark ? 0x555555 : 0xbbbbbb);
    baseLinkMat.needsUpdate = true;
    // 更新所有节点的默认颜色
    const gd = Graph.graphData() as any;
    if (gd.nodes) {
      for (const nd of gd.nodes) {
        nd._cDefault = dark ? adjustHex(nd.palColor, 20) : nd.palColor;
      }
    }
    // 刷新节点颜色
    Graph.nodeColor((n: any) => {
      const id = n.id;
      if (focusedId === id) return n._cFocus;
      if (highlightedSet.size > 0 && highlightedSet.has(id)) return n._cHighlight;
      return n._cDefault;
    });
    // 刷新基础线网透明度
    refreshLinkColors();
    // 如果叠加线网可见，重建以匹配主题
    if (overlaySegments.visible) {
      if (focusedId) {
        buildOverlay(focusedId, dark ? 0xffdd44 : 0xff9900);
      } else if (hoveredId) {
        buildOverlay(hoveredId, dark ? 0xeeeeee : 0x888888);
      }
    }
    // 更新 tooltip 样式
    tooltip.el.style.background = dark ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.95)";
    tooltip.el.style.color = dark ? "#fff" : "#111";

    if (hoveredId && gd.nodes) {
      const hovered = gd.nodes.find((nd: any) => nd.id === hoveredId);
      if (hovered) setNodeColor(hovered, hovered._cHover);
    }
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
    Graph.nodeColor((n: any) => {
      if (focusedId === n.id) return n._cFocus;
      if (highlightedSet.size > 0 && highlightedSet.has(n.id)) return n._cHighlight;
      return n._cDefault;
    });
    // 聚焦叠加线网（金色）
    buildOverlay(id, isDarkRef.value ? 0xffdd44 : 0xff9900);

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
    Graph.nodeColor((n: any) => {
      if (focusedId === n.id) return n._cFocus;
      if (highlightedSet.size > 0 && highlightedSet.has(n.id)) return n._cHighlight;
      return n._cDefault;
    });
    refreshLinkColors();
  }

  function clearHighlights() {
    highlightedSet.clear();
    focusedId = null;
    // 如果有悬停，恢复悬停叠加线网
    if (hoveredId) {
      buildOverlay(hoveredId, isDarkRef.value ? 0xeeeeee : 0x888888);
    } else {
      buildOverlay(null, 0xffffff);
    }
    Graph.nodeColor((n: any) => {
      if (highlightedSet.size > 0 && highlightedSet.has(n.id)) return n._cHighlight;
      return n._cDefault;
    });
    if (hoveredId) {
      const gd = Graph.graphData() as any;
      const h = gd.nodes?.find((nd: any) => nd.id === hoveredId);
      if (h) setNodeColor(h, h._cHover);
    }
  }

  function clearLocalEffects() {
    highlightedSet.clear();
    focusedId = null;
    _lastFocusedId = null;
    hoveredId = null;
    lastHoveredId = null;
    tooltip.hide();
    buildOverlay(null, 0xffffff); // 清除叠加线网
    Graph.nodeColor((n: any) => n._cDefault);
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
          nodeHost = new URL(
            nodeUrl.startsWith("http") ? nodeUrl : `https://${nodeUrl}`,
          ).hostname.toLowerCase();
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

  const api = {
    find,
    focusNodeById,
    focusByDomain,
    highlightNodesAndNeighbors,
    clearHighlights,
    clearLocalEffects,
    getGraphData,
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
  return { nodes, links, categories: c.c || [] };
}

// ─── 从 URL 加载 ─────────────────────────────────────────────────────────

export async function init3dFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const raw = await res.json();
  const data = raw.nid ? expandCompact(raw) : (raw as GraphData);
  return init3d(data);
}
