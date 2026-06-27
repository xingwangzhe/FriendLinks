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

function getBaseColor(node: any): string {
  return (node as any).palColor || PALETTE[hashToIndex(node.id)] || "#888";
}

function themedColor(base: string, isDark: boolean): string {
  return isDark ? adjustHex(base, 20) : base;
}

// 创建发光圈纹理
function createGlowTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, color + "00"); // 中心透明
  gradient.addColorStop(0.4, color + "40"); // 中间半透明
  gradient.addColorStop(1, color + "00"); // 边缘透明
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
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
      const isHighlighted = focusedId === id || hoveredId === id || (highlightedSet.size > 0 && highlightedSet.has(id));
      const highlightLevel = focusedId === id ? 3 : hoveredId === id ? 2 : highlightedSet.has(id) ? 1 : 0;
      
      const group = new THREE.Group();
      
      // 主体球体
      const size = degreeToSize(degreeMap[id] || 0, maxDegree);
      const geometry = new THREE.SphereGeometry(size, 8, 8);
      const material = new THREE.MeshLambertMaterial({
        color: isHighlighted ? adjustHex(baseColor, highlightLevel * 20) : baseColor,
        transparent: true,
        opacity: 1.0,
      });
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);
      
      // 发光圈（仅高亮节点显示）- 多层涟漪效果
      if (isHighlighted) {
        const baseOpacity = 0.4 + highlightLevel * 0.15;
        
        // 内层光圈（3倍）
        const glowTexture1 = createGlowTexture(baseColor);
        const glowMaterial1 = new THREE.SpriteMaterial({
          map: glowTexture1,
          transparent: true,
          opacity: baseOpacity,
          blending: THREE.AdditiveBlending,
        });
        const glowSprite1 = new THREE.Sprite(glowMaterial1);
        glowSprite1.scale.set(size * 6, size * 6, 1);
        group.add(glowSprite1);
        
        // 中层光圈（6倍）
        const glowTexture2 = createGlowTexture(baseColor);
        const glowMaterial2 = new THREE.SpriteMaterial({
          map: glowTexture2,
          transparent: true,
          opacity: baseOpacity * 0.6,
          blending: THREE.AdditiveBlending,
        });
        const glowSprite2 = new THREE.Sprite(glowMaterial2);
        glowSprite2.scale.set(size * 12, size * 12, 1);
        group.add(glowSprite2);
        
        // 外层光圈（10倍）- 宇宙级涟漪
        const glowTexture3 = createGlowTexture(baseColor);
        const glowMaterial3 = new THREE.SpriteMaterial({
          map: glowTexture3,
          transparent: true,
          opacity: baseOpacity * 0.3,
          blending: THREE.AdditiveBlending,
        });
        const glowSprite3 = new THREE.Sprite(glowMaterial3);
        glowSprite3.scale.set(size * 20, size * 20, 1);
        group.add(glowSprite3);
      }
      
      return group;
    })
    .linkColor(() =>
      isDarkRef.value ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    )
    .linkWidth(0.2)
    .linkDirectionalParticles(1)
    .linkDirectionalParticleWidth(0.5)
    .linkDirectionalParticleSpeed(0.005)
    .backgroundColor(isDarkRef.value ? "#0f1115" : "#ffffff")
    .enableNodeDrag(true)
    .enableNavigationControls(true)
    .nodeOpacity(1.0)
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

  // 涟漪波动动画
  let animationTime = 0;
  function animateRipples() {
    animationTime += 0.02;
    const currentData = Graph.graphData() as any;
    if (currentData.nodes) {
      for (const node of currentData.nodes) {
        if (node.__threeObj && node.__threeObj.children.length > 1) {
          const sprites = node.__threeObj.children.slice(1);
          // 内层波动
          if (sprites[0]) {
            const scale1 = 6 + Math.sin(animationTime * 2) * 0.5;
            sprites[0].scale.set(scale1, scale1, 1);
            sprites[0].material.opacity = (0.4 + (focusedId === node.id ? 0.45 : hoveredId === node.id ? 0.3 : 0.15)) * (0.8 + Math.sin(animationTime * 3) * 0.2);
          }
          // 中层波动
          if (sprites[1]) {
            const scale2 = 12 + Math.sin(animationTime * 1.5 + 1) * 1;
            sprites[1].scale.set(scale2, scale2, 1);
            sprites[1].material.opacity = (0.4 + (focusedId === node.id ? 0.45 : hoveredId === node.id ? 0.3 : 0.15)) * 0.6 * (0.8 + Math.sin(animationTime * 2 + 1) * 0.2);
          }
          // 外层波动
          if (sprites[2]) {
            const scale3 = 20 + Math.sin(animationTime + 2) * 2;
            sprites[2].scale.set(scale3, scale3, 1);
            sprites[2].material.opacity = (0.4 + (focusedId === node.id ? 0.45 : hoveredId === node.id ? 0.3 : 0.15)) * 0.3 * (0.8 + Math.sin(animationTime * 1.5 + 2) * 0.2);
          }
        }
      }
    }
    requestAnimationFrame(animateRipples);
  }
  animateRipples();

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
