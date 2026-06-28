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

  // ── 6b. 连线透明度控制 ─────────────────────────────────────────
  const linkOpacity = { value: 1.0 }; // 0~1

  function createControlPanel() {
    // 复用已存在的面板
    let panel = document.getElementById("graph-control-panel") as HTMLElement | null;
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = "graph-control-panel";

    const label = document.createElement("label");
    label.textContent = "连线透明度";
    label.style.cssText = "font-size:12px;color:var(--muted,#888);display:block;margin-bottom:4px;";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.05";
    slider.value = String(linkOpacity.value);
    slider.style.cssText = "width:100%;accent-color:var(--primary,#4a9eff);";

    const valueDisplay = document.createElement("span");
    valueDisplay.textContent = slider.value;
    valueDisplay.style.cssText = "font-size:11px;color:var(--muted,#888);margin-left:6px;";

    slider.addEventListener("input", () => {
      linkOpacity.value = parseFloat(slider.value);
      valueDisplay.textContent = slider.value;
      Graph.refresh(); // 触发 linkColor 重新计算
    });

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display:flex;align-items:center;";
    wrapper.appendChild(slider);
    wrapper.appendChild(valueDisplay);

    panel.appendChild(label);
    panel.appendChild(wrapper);

    // 悬浮在右下角
    panel.style.cssText = `
      position:fixed;bottom:70px;right:16px;z-index:9998;
      background:var(--card-bg,rgba(30,30,40,0.85));
      backdrop-filter:blur(8px);
      border:1px solid var(--border,rgba(255,255,255,0.1));
      border-radius:8px;
      padding:10px 14px;
      min-width:140px;
      display:none;
      font-family:sans-serif;
    `;

    document.body.appendChild(panel);
    return panel;
  }

  const controlPanel = createControlPanel();

  // 短按控制面板切换显示
  let panelTimeout: ReturnType<typeof setTimeout> | null = null;
  function showPanel() {
    controlPanel.style.display = "block";
    if (panelTimeout) clearTimeout(panelTimeout);
    panelTimeout = setTimeout(() => {
      controlPanel.style.display = "none";
    }, 5000);
  }
  controlPanel.addEventListener("mouseenter", () => {
    if (panelTimeout) clearTimeout(panelTimeout);
  });
  controlPanel.addEventListener("mouseleave", () => {
    panelTimeout = setTimeout(() => {
      controlPanel.style.display = "none";
    }, 2000);
  });

  // 双击空白区域显示控制面板
  container.addEventListener("dblclick", (e) => {
    // 确保不是点在节点上
    const target = e.target as HTMLElement;
    if (!target.closest(".clickable")) showPanel();
  });

  // ── 7. 创建 3D 图 ────────────────────────────────────────────────

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
    // ── 连线：用 linkVisibility 精确控制显隐 ───────────────────
    .linkVisibility((l: any) => {
      const src = typeof l.source === "object" ? l.source.id : l.source;
      const tgt = typeof l.target === "object" ? l.target.id : l.target;

      if (focusedId) return src === focusedId || tgt === focusedId;
      if (hoveredId) return src === hoveredId || tgt === hoveredId;
      if (highlightedSet.size > 0) return highlightedSet.has(src) || highlightedSet.has(tgt);

      return false; // 默认全隐藏
    })
    .linkColor((l: any) => {
      const src = typeof l.source === "object" ? l.source.id : l.source;
      const tgt = typeof l.target === "object" ? l.target.id : l.target;
      const dark = isDarkRef.value;
      const a = linkOpacity.value;

      if (focusedId && (src === focusedId || tgt === focusedId)) {
        return `rgba(255,${dark ? 220 : 180},${dark ? 80 : 30},${a})`;
      }
      if (hoveredId && !focusedId && (src === hoveredId || tgt === hoveredId)) {
        return `rgba(200,200,200,${a})`;
      }
      return `rgba(200,200,200,${Math.min(a, 0.4)})`;
    })
    .linkWidth((l: any) => {
      const src = typeof l.source === "object" ? l.source.id : l.source;
      const tgt = typeof l.target === "object" ? l.target.id : l.target;
      if (focusedId && (src === focusedId || tgt === focusedId)) return 2.0;
      return 0.8;
    })
    .linkDirectionalParticles(0) // 关闭粒子
    .backgroundColor(isDarkRef.value ? "#0f1115" : "#ffffff")
    .enableNodeDrag(true)
    .enableNavigationControls(true)
    .nodeOpacity(1.0)
    .warmupTicks(0)
    .cooldownTicks(0)
    .cooldownTime(0)
    .d3AlphaDecay(0.02)
    .d3VelocityDecay(0.3);

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
        focusNodeById(n.id);
        return;
      }
    }
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

    Graph.refresh(); // 触发 linkVisibility / linkColor 重新计算

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
    const gd = Graph.graphData() as any;
    if (gd.nodes) {
      for (const nd of gd.nodes) {
        nd._cDefault = dark ? adjustHex(nd.palColor, 20) : nd.palColor;
      }
    }
    Graph.nodeColor((n: any) => {
      const id = n.id;
      if (focusedId === id) return n._cFocus;
      if (highlightedSet.size > 0 && highlightedSet.has(id)) return n._cHighlight;
      return n._cDefault;
    });
    Graph.refresh();
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
    Graph.nodeColor((n: any) => {
      if (focusedId === n.id) return n._cFocus;
      if (highlightedSet.size > 0 && highlightedSet.has(n.id)) return n._cHighlight;
      return n._cDefault;
    });
    Graph.refresh();

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
    Graph.refresh();
  }

  function clearHighlights() {
    highlightedSet.clear();
    focusedId = null;
    Graph.nodeColor((n: any) => {
      if (highlightedSet.size > 0 && highlightedSet.has(n.id)) return n._cHighlight;
      return n._cDefault;
    });
    Graph.refresh();
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
    Graph.nodeColor((n: any) => n._cDefault);
    Graph.refresh();
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
