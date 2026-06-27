/**
 * 3D 球状友链网络图渲染模块
 * 使用 3d-force-graph (Three.js) 替代 sigma.js 2D 渲染
 */

import ForceGraph3D from "3d-force-graph";
import Fuse from "fuse.js";
import * as THREE from "three";
import { PALETTE, hashToIndex, degreeToSize, adjustHex, getEmissiveColor } from "./utils";
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

// 节点视觉状态
type NodeVisualState = {
  scale: number;        // 尺寸放大倍数
  emissiveIntensity: number;  // 发光强度
  opacity: number;       // 透明度
};

// 计算节点视觉状态
function getNodeVisualState(
  nodeId: string,
  hoveredId: string | null,
  focusedId: string | null,
  highlightedSet: Set<string>
): NodeVisualState {
  // 聚焦节点：最强发光 + 最大尺寸
  if (focusedId === nodeId) {
    return { scale: 2.0, emissiveIntensity: 1.2, opacity: 1 };
  }
  // 悬停节点：轻微发光 + 轻微放大
  if (hoveredId === nodeId) {
    return { scale: 1.3, emissiveIntensity: 0.5, opacity: 1 };
  }
  // 高亮组内节点：中等发光 + 中等放大
  if (highlightedSet.size > 0 && highlightedSet.has(nodeId)) {
    return { scale: 1.5, emissiveIntensity: 0.8, opacity: 1 };
  }
  // 高亮组外节点：保持原色但降低透明度
  if (highlightedSet.size > 0) {
    return { scale: 1.0, emissiveIntensity: 0, opacity: 0.4 };
  }
  // 默认状态
  return { scale: 1.0, emissiveIntensity: 0, opacity: 1 };
}

function getBaseColor(node: any): string {
  return (node as any).palColor || PALETTE[hashToIndex(node.id)] || "#888";
}

function themedColor(base: string, isDark: boolean): string {
  return isDark ? adjustHex(base, 20) : base;
}

// ─── 3D 初始化 ──────────────────────────────────────────────────────────

export function init3d(graphData: GraphData) {
  const container = document.getElementById("main");
  if (!container) return null;

  // 清空容器（移除 sigma 遗留的 canvas）
  container.innerHTML = "";

  // ── 1. 计算度数 ──────────────────────────────────────────────────
  const degreeMap: Record<string, number> = {};
  const rawLinks = (graphData as any).links || graphData.links || [];
  for (const l of rawLinks) {
    const s = l.source ?? l[0];
    const t = l.target ?? l[1];
    if (s != null) degreeMap[s] = (degreeMap[s] || 0) + 1;
    if (t != null) degreeMap[t] = (degreeMap[t] || 0) + 1;
  }
  const degValues = Object.values(degreeMap);
  const maxDegree = degValues.length ? Math.max(...degValues) : 1;

  // ── 2. 预处理节点 ────────────────────────────────────────────────
  const rawNodes = graphData.nodes || [];
  const nodes = rawNodes.map((n: any) => ({
    ...n,
    palColor: PALETTE[hashToIndex(n.id)],
  }));

  const links = rawLinks.map((l: any) => ({
    source: l.source ?? l[0],
    target: l.target ?? l[1],
  }));

  // ── 3. 主题检测 ──────────────────────────────────────────────────
  const prefersDark = (): boolean => {
    if (document.documentElement.dataset.theme === "dark") return true;
    if (document.documentElement.dataset.theme === "light") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  };
  const isDarkRef: ThemeRef = { value: prefersDark() };

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
  let lastFocusedId: string | null = null;

  function refreshColors() {
    Graph.refresh();
  }

  // ── 6. Tooltip ──────────────────────────────────────────────────
  const tooltip = createTooltip();

  // ── 7. 创建 3D 图 ────────────────────────────────────────────────
  // 基础尺寸映射
  const baseSizeMap = new Map<string, number>();
  for (const n of nodes) {
    const deg = degreeMap[n.id] || 0;
    baseSizeMap.set(n.id, degreeToSize(deg, maxDegree));
  }

  const Graph = ForceGraph3D()(container, {
    controlType: "orbit",
  })
    .graphData({ nodes, links })
    .width(container.clientWidth)
    .height(container.clientHeight)
    .nodeLabel(null) // 关闭内置标签，使用自定义 tooltip
    .nodeThreeObject((n: any) => {
      const id = n.id;
      const baseColor = themedColor(getBaseColor(n), isDarkRef.value);
      const state = getNodeVisualState(id, hoveredId, focusedId, highlightedSet);
      const baseSize = baseSizeMap.get(id) || 1;
      const size = baseSize * state.scale;

      const geometry = new THREE.SphereGeometry(size, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: state.emissiveIntensity > 0
          ? getEmissiveColor(baseColor, state.emissiveIntensity)
          : baseColor,
        transparent: state.opacity < 1,
        opacity: state.opacity,
      });
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    })
    .linkColor(() =>
      isDarkRef.value ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    )
    .linkWidth(0.2)
    .backgroundColor(isDarkRef.value ? "#0f1115" : "#ffffff")
    .enableNodeDrag(true)
    .enableNavigationControls(true)
    .warmupTicks(0)          // 位置已在构建时算好，客户端直接从那儿开始
    .cooldownTicks(200)
    .cooldownTime(20000)
    .d3AlphaDecay(0.02)
    .d3VelocityDecay(0.3);

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

  // ── 8. 鼠标位置追踪（用于 tooltip） ─────────────────────────────
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

  Graph.onNodeHover((n: any) => {
    lastHoveredId = hoveredId;
    hoveredId = n ? n.id : null;

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
    document.documentElement.dataset.theme = isDarkRef.value
      ? "dark"
      : "light";
    applyTheme();
  };
  if (themeBtn) themeBtn.addEventListener("click", themeHandler);

  function applyTheme() {
    const dark = isDarkRef.value;
    Graph.backgroundColor(dark ? "#0f1115" : "#ffffff");
    Graph.linkColor(() =>
      dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    );
    // 更新 tooltip 样式
    tooltip.el.style.background = dark
      ? "rgba(0,0,0,0.75)"
      : "rgba(255,255,255,0.95)";
    tooltip.el.style.color = dark ? "#fff" : "#111";
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
    lastFocusedId = focusedId;
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
    lastFocusedId = null;
    refreshColors();
  }

  function clearLocalEffects() {
    highlightedSet.clear();
    focusedId = null;
    lastFocusedId = null;
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
      const url = new URL(
        input.startsWith("http") ? input : `https://${input}`,
      );
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

// ─── 从 URL 加载 ─────────────────────────────────────────────────────────

export async function init3dFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const data = (await res.json()) as GraphData;
  return init3d(data);
}
