/**
 * 3D 球状友链网络图渲染模块
 * 使用 3d-force-graph (Three.js) 替代 sigma.js 2D 渲染
 */

import ForceGraph3D from "3d-force-graph";
import Fuse from "fuse.js";
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

  // ── 2. 主题检测（提前定义，供预计算颜色使用）────────────────────
  const prefersDark = (): boolean => {
    if (document.documentElement.dataset.theme === "dark") return true;
    if (document.documentElement.dataset.theme === "light") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  };
  const isDarkRef: ThemeRef = { value: prefersDark() };

  // ── 3. 预处理节点 & 预计算颜色 ─────────────────────────────────
  const rawNodes = graphData.nodes || [];
  const isDark = isDarkRef.value;
  const nodes = rawNodes.map((n: any) => {
    const base = PALETTE[hashToIndex(n.id)];
    return {
      ...n,
      palColor: base,
      // 预计算所有颜色变体，避免 hover/focus 时重复计算 adjustHex
      _cDefault: isDark ? adjustHex(base, 20) : base,
      _cHover: adjustHex(base, 40),
      _cFocus: adjustHex(base, 60),
      _cHighlight: adjustHex(base, 20),
    };
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

  // 记录上次聚焦节点以便恢复颜色
  let _lastFocusedId: string | null = null;

  function refreshColors() {
    Graph.refresh();
  }

  // ── 6. Tooltip ──────────────────────────────────────────────────
  const tooltip = createTooltip();

  // 构建邻居映射（用于连线高亮）
  const neighborMap = new Map<string, Set<string>>();
  for (const l of links) {
    const src = typeof l.source === "object" ? l.source.id : l.source;
    const tgt = typeof l.target === "object" ? l.target.id : l.target;
    if (!neighborMap.has(src)) neighborMap.set(src, new Set());
    if (!neighborMap.has(tgt)) neighborMap.set(tgt, new Set());
    neighborMap.get(src)!.add(tgt);
    neighborMap.get(tgt)!.add(src);
  }

  // ── 7. 创建 3D 图 ────────────────────────────────────────────────
  const Graph = ForceGraph3D()(container, {
    controlType: "orbit",
  })
    .graphData({ nodes, links })
    .width(container.clientWidth)
    .height(container.clientHeight)
    .nodeLabel(null) // 关闭内置标签，使用自定义 tooltip
    .nodeColor((n: any) => {
      const id = n.id;
      // 聚焦节点：最强高亮
      if (focusedId === id) return n._cFocus;
      // 悬停节点：中等高亮
      if (hoveredId === id) return n._cHover;
      // 高亮组内节点：轻微高亮
      if (highlightedSet.size > 0) {
        return highlightedSet.has(id) ? n._cHighlight : (isDarkRef.value ? "#2a2a2a" : "#e0e0e0");
      }
      return n._cDefault;
    })
    .nodeVal((n: any) => {
      const deg = degreeMap[n.id] || 0;
      const baseSize = degreeToSize(deg, maxDegree);
      // 聚焦节点：放大 1.5 倍
      if (focusedId === n.id) return baseSize * 1.5;
      return baseSize;
    })
    .linkColor((l: any) => {
      const src = typeof l.source === "object" ? l.source.id : l.source;
      const tgt = typeof l.target === "object" ? l.target.id : l.target;
      const isConnectedToFocus = focusedId && (src === focusedId || tgt === focusedId);
      const isConnectedToHover = hoveredId && (src === hoveredId || tgt === hoveredId);
      const isConnectedToHighlight =
        highlightedSet.size > 0 && (highlightedSet.has(src) || highlightedSet.has(tgt));

      if (isConnectedToFocus) {
        return isDarkRef.value ? "rgba(255,220,80,0.95)" : "rgba(255,180,30,0.95)";
      }
      if (isConnectedToHover) {
        return isDarkRef.value ? "rgba(255,255,255,0.5)" : "rgba(100,100,100,0.5)";
      }
      if (isConnectedToHighlight) {
        return isDarkRef.value ? "rgba(255,255,255,0.3)" : "rgba(150,150,150,0.3)";
      }
      return isDarkRef.value ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    })
    .linkWidth((l: any) => {
      const src = typeof l.source === "object" ? l.source.id : l.source;
      const tgt = typeof l.target === "object" ? l.target.id : l.target;
      const isConnectedToFocus = focusedId && (src === focusedId || tgt === focusedId);
      return isConnectedToFocus ? 2.5 : 0.4;
    })
    .linkDirectionalParticles(1)
    .linkDirectionalParticleWidth(0.5)
    .linkDirectionalParticleSpeed(0.005)
    .backgroundColor(isDarkRef.value ? "#0f1115" : "#ffffff")
    .enableNodeDrag(true)
    .enableNavigationControls(true)
    .nodeOpacity(1.0)
    .warmupTicks(0)    // 位置已在构建时精确算好，客户端不额外跑
    .cooldownTicks(0)
    .cooldownTime(0)
    .d3AlphaDecay(0.99) // 仿真立即冻结
    .d3VelocityDecay(0.99);

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

  // 涟漪波动动画（性能优化：缓存 sprite 引用，预计算 Math.sin）
  let animationTime = 0;
  let spriteCache: Array<{ baseOpacity: number; sprites: any[] }> = [];
  let spritesBuilt = false;

  function buildSpriteCache() {
    spriteCache = [];
    const currentData = Graph.graphData() as any;
    if (!currentData.nodes) return;
    for (const node of currentData.nodes) {
      if (node.__threeObj && node.__threeObj.children.length > 1) {
        spriteCache.push({
          baseOpacity: 0.4 + 0.15,
          sprites: node.__threeObj.children.slice(1),
        });
      }
    }
    spritesBuilt = true;
  }

  function animateRipples() {
    animationTime += 0.02;

    // 首次渲染后构建 sprite 缓存
    if (!spritesBuilt) {
      buildSpriteCache();
    }

    // 预计算公共三角函数值（每个节点共享）
    const sinA2 = Math.sin(animationTime * 2);
    const sinA15p1 = Math.sin(animationTime * 1.5 + 1);
    const sinAp2 = Math.sin(animationTime + 2);

    for (let i = 0; i < spriteCache.length; i++) {
      const { sprites } = spriteCache[i];
      if (sprites[0]) sprites[0].scale.setScalar(6 + sinA2 * 0.5);
      if (sprites[1]) sprites[1].scale.setScalar(12 + sinA15p1);
      if (sprites[2]) sprites[2].scale.setScalar(20 + sinAp2 * 2);
    }

    requestAnimationFrame(animateRipples);
  }
  animateRipples();

  // 阻止右键默认菜单，用于右键聚焦节点
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
  Graph.onNodeClick((n: any) => {
    if (n.url) window.open(n.url, "_blank");
  });

  Graph.onNodeRightClick((n: any) => {
    focusNodeById(n.id);
  });

  Graph.onNodeHover((n: any) => {
    const newHoveredId = n ? n.id : null;
    if (lastHoveredId === newHoveredId) return; // 同一个节点，不重复处理

    lastHoveredId = hoveredId;
    hoveredId = newHoveredId;

    if (n) {
      // 显示 tooltip
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
        a.style.color = isDarkRef.value ? "#87ceeb" : "#0066cc";
        a.style.textDecoration = "underline";
        urlEl.appendChild(a);
        content.appendChild(urlEl);
      }
      tooltip.show(content, mouseX, mouseY);
    } else {
      tooltip.hide();
    }

    refreshColors();
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
    Graph.linkColor(() => (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"));
    // 更新 tooltip 样式
    tooltip.el.style.background = dark ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.95)";
    tooltip.el.style.color = dark ? "#fff" : "#111";
    // 重新计算默认颜色（主题相关）
    const gd = Graph.graphData() as any;
    if (gd.nodes) for (const n of gd.nodes) n._cDefault = dark ? adjustHex(n.palColor, 20) : n.palColor;
    // 刷新节点颜色
    refreshColors();
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
    // 恢复上次聚焦节点的颜色
    _lastFocusedId = focusedId;
    focusedId = id;
    refreshColors();

    // 获取节点在 3D 空间中的位置
    const currentData = Graph.graphData() as any;
    const node = currentData.nodes?.find((n: any) => n.id === id);
    if (!node || node.x == null) return;

    const padding = Math.max(100, degreeMap[id] ? degreeMap[id] * 5 : 100);
    // 从上方和侧面看向目标节点
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
      // 添加邻居节点
      for (const l of links) {
        const src = typeof l.source === "object" ? l.source.id : l.source;
        const tgt = typeof l.target === "object" ? l.target.id : l.target;
        if (src === id && tgt) highlightedSet.add(String(tgt));
        if (tgt === id && src) highlightedSet.add(String(src));
      }
    }
    refreshColors();
  }

  function clearHighlights() {
    highlightedSet.clear();
    focusedId = null;
    _lastFocusedId = null;
    refreshColors();
  }

  function clearLocalEffects() {
    highlightedSet.clear();
    focusedId = null;
    _lastFocusedId = null;
    hoveredId = null;
    lastHoveredId = null;
    tooltip.hide();
    refreshColors();
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
      // 高亮所有匹配节点
      highlightNodesAndNeighbors(matched.map((n: any) => n.id));
      // 聚焦第一个
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

  // 暴露到全局用于调试
  try {
    (window as any).__graphApi = (window as any).__graphApi || {};
    Object.assign((window as any).__graphApi, api);
    (window as any).__graph3d = Graph;
  } catch {}

  return api;
}

// ─── 紧凑格式展开 ─────────────────────────────────────────────────────────

function expandCompact(c: any): GraphData {
  const { nid, nnm, nur, nfa, nde, nx, ny, nz, ls, lt } = c;
  const nodes = nid.map((_id: string, i: number) => ({
    id: nid[i],
    name: nnm[i],
    url: nur[i],
    favicon: nfa[i],
    desc: nde[i],
    x: nx[i],
    y: ny[i],
    z: nz[i],
  }));
  const links = ls.map((s: number, i: number) => ({
    source: nid[s],
    target: nid[lt[i]],
  }));
  return { nodes, links, categories: c.c || [] };
}

// ─── 从 URL 加载 ─────────────────────────────────────────────────────────

export async function init3dFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const raw = await res.json();
  // 自动检测：紧凑格式（有 nid 字段）vs 传统格式
  const data = raw.nid ? expandCompact(raw) : (raw as GraphData);
  return init3d(data);
}
