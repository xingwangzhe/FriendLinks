// Sigma.js + Graphology 渲染实现（解耦版）
import Sigma from "sigma";
import Graph from "graphology";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import type { GraphData } from "../../types/graph";

/*
  目标：将原始的单文件实现拆解为更小的函数，便于阅读与测试。
  注意：保持与原实现相同的公共行为与导出接口（`init`、`initFromUrl`）。
*/

const PALETTE = [
  "#E69F00",
  "#56B4E9",
  "#009E73",
  "#0072B2",
  "#D55E00",
  "#CC79A7",
  "#8C564B",
  "#E377C2",
  "#7F7F7F",
  "#17BECF",
  "#4E79A7",
  "#B1C94E",
];

function hashToIndex(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % PALETTE.length;
}

function degreeToSize(d: number, maxDegree: number) {
  const MIN = 6;
  const MAX = 22;
  if (!d || d <= 1) return MIN;
  const norm = Math.sqrt(d) / Math.sqrt(Math.max(1, maxDegree));
  return Math.round(MIN + Math.min(1, norm) * (MAX - MIN));
}

/* ---------------------------
   Graph / layout construction
   --------------------------- */

type BuildResult = {
  g: Graph;
  degreeMap: Record<string, number>;
  originalColors: Map<string, string>;
  maxDegree: number;
};

function buildGraphFromData(data: GraphData): BuildResult {
  const g = new Graph();
  const nodes = data.nodes || [];
  const links = (data as any).links || [];

  const originalColors: Map<string, string> = new Map();
  const degreeMap: Record<string, number> = {};

  // count degrees
  for (const l of links) {
    const s = l.source ?? l[0];
    const t = l.target ?? l[1];
    if (s) degreeMap[s] = (degreeMap[s] || 0) + 1;
    if (t) degreeMap[t] = (degreeMap[t] || 0) + 1;
  }
  const degreeValues = Object.values(degreeMap);
  const maxDegree = degreeValues.length ? Math.max(...degreeValues) : 1;

  // add nodes with initial radial placement
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const id = n.id;
    const deg = degreeMap[id] || 0;
    const angle = (i / Math.max(1, nodes.length)) * Math.PI * 2;
    const radius =
      100 + (1 - Math.min(1, Math.sqrt(deg) / Math.sqrt(maxDegree))) * 400;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 10;
    const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 10;
    const baseColor = PALETTE[hashToIndex(id)];
    g.addNode(id, {
      label: n.name,
      url: n.url,
      desc: (n as any).desc,
      x,
      y,
      size: degreeToSize(deg, maxDegree),
      color: baseColor,
      baseColor,
    });
    originalColors.set(id, baseColor);
  }

  // add edges
  for (const l of links) {
    const s = l.source ?? l[0];
    const t = l.target ?? l[1];
    if (!s || !t) continue;
    try {
      g.addEdge(s.toString(), t.toString());
    } catch {
      // ignore duplicate/invalid edges
    }
  }

  return { g, degreeMap, originalColors, maxDegree };
}

function startForceAtlas2Worker(g: Graph) {
  try {
    const layout = new FA2Layout(g, {
      settings: {
        barnesHutOptimize: true,
        barnesHutTheta: 0.6,
        gravity: 1,
        slowDown: 10,
        scalingRatio: 2,
      },
    });
    layout.start();
    try {
      (window as any).__graphLayout = (window as any).__graphLayout || {};
      (window as any).__graphLayout.stop = () => layout.stop && layout.stop();
      (window as any).__graphLayout.kill = () => layout.kill && layout.kill();
    } catch {}
    return layout;
  } catch (e) {
    // worker not available
    console.warn("ForceAtlas2 worker unavailable, skipping layout worker.", e);
    return null;
  }
}

/* ---------------------------
   Tooltip utils
   --------------------------- */

type TooltipApi = {
  el: HTMLElement;
  show: (
    content: HTMLElement | string,
    clientX: number,
    clientY: number,
  ) => void;
  hide: () => void;
};

function createOrGetTooltip(): TooltipApi {
  let tooltip: HTMLElement | null = document.getElementById("graph-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "graph-tooltip";
    tooltip.style.position = "fixed";
    tooltip.style.pointerEvents = "none";
    tooltip.style.zIndex = "9999";
    tooltip.style.background = "rgba(0,0,0,0.75)";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "8px 10px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.maxWidth = "320px";
    tooltip.style.fontSize = "13px";
    tooltip.style.display = "none";
    document.body.appendChild(tooltip);
  }

  function show(
    content: HTMLElement | string,
    clientX: number,
    clientY: number,
  ) {
    if (!tooltip) return;
    tooltip.innerHTML = "";
    if (typeof content === "string") {
      const wrapper = document.createElement("div");
      wrapper.innerText = content;
      tooltip.appendChild(wrapper);
    } else {
      tooltip.appendChild(content);
    }
    tooltip.style.left = `${clientX + 12}px`;
    tooltip.style.top = `${clientY + 12}px`;
    tooltip.style.display = "block";
  }

  function hide() {
    if (!tooltip) return;
    tooltip.style.display = "none";
  }

  return { el: tooltip, show, hide };
}

/* ---------------------------
   Theme/color helpers
   --------------------------- */

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function adjustHex(hex: string, percent: number) {
  const [r, g, b] = hexToRgb(hex);
  const amt = Math.round(255 * (percent / 100));
  const nr = Math.max(0, Math.min(255, r + amt));
  const ng = Math.max(0, Math.min(255, g + amt));
  const nb = Math.max(0, Math.min(255, b + amt));
  return rgbToHex(nr, ng, nb);
}

function applyThemeToGraph(
  container: HTMLElement,
  g: Graph,
  tooltip: TooltipApi | null,
  dark: boolean,
  maxDegree: number,
) {
  try {
    const bg = dark ? "#0f1115" : "#ffffff";
    const edgeColor = dark ? "#888" : "#aaa";
    container.style.background = bg;

    g.forEachNode((id: string, attr: any) => {
      const base = attr.baseColor || PALETTE[hashToIndex(id)];
      const newColor = dark ? adjustHex(base, 20) : base;
      try {
        g.setNodeAttribute(id, "color", newColor);
        const labelColor = dark ? "#fff" : "#111";
        g.setNodeAttribute(id, "labelColor", labelColor);
        // Ensure size remains consistent with degree if present
        if (attr.size == null) {
          const degSize = degreeToSize(0, maxDegree);
          g.setNodeAttribute(id, "size", degSize);
        }
      } catch {}
    });

    g.forEachEdge((edge: any) => {
      try {
        g.setEdgeAttribute(edge, "color", edgeColor);
      } catch {}
    });

    if (tooltip && tooltip.el) {
      tooltip.el.style.background = dark
        ? "rgba(0,0,0,0.75)"
        : "rgba(255,255,255,0.95)";
      tooltip.el.style.color = dark ? "#fff" : "#111";
      tooltip.el.style.boxShadow = dark
        ? "0 2px 10px rgba(0,0,0,0.5)"
        : "0 2px 10px rgba(0,0,0,0.08)";
    }
  } catch {}
}

/* ---------------------------
   Renderer + event wiring
   --------------------------- */

function createRendererForGraph(
  g: Graph,
  container: HTMLElement,
  isDark: boolean,
) {
  const renderer = new Sigma(g, container, {
    renderEdgeLabels: false,
    renderLabels: true,
    labelColor: { attribute: "labelColor" },
    allowInvalidContainer: true,
    zIndex: 0,
    nodeReducer: (node: string, data: any) => {
      return {
        ...data,
        labelColor: data.labelColor || (isDark ? "#fff" : "#111"),
      } as any;
    },
    edgeReducer: (edge: string, data: any) => {
      return {
        ...data,
        color: data.color,
      } as any;
    },
    defaultDrawNodeHover: (
      context: CanvasRenderingContext2D,
      data: any,
      settings: any,
    ) => {
      try {
        const size = settings.labelSize;
        const font = settings.labelFont;
        const weight = settings.labelWeight;
        context.font = `${weight} ${size}px ${font}`;
        const bg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
        context.fillStyle = bg;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = isDark ? 8 : 4;
        context.shadowColor = isDark ? "#000" : "#000";

        const PADDING = 2;
        if (typeof data.label === "string") {
          const textWidth = context.measureText(data.label).width;
          const boxWidth = Math.round(textWidth + 5);
          const boxHeight = Math.round(size + 2 * PADDING);
          const radius = Math.max(data.size, size / 2) + PADDING;
          const angleRadian = Math.asin(boxHeight / 2 / radius);
          const xDeltaCoord = Math.sqrt(
            Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)),
          );
          context.beginPath();
          context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
          context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
          context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
          context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
          context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
          context.closePath();
          context.fill();
        } else {
          context.beginPath();
          context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
          context.closePath();
          context.fill();
        }
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
      } catch {
        // ignore drawing errors
      }
    },
  } as any);
  return renderer;
}

function wireRendererEvents(
  renderer: any,
  g: Graph,
  tooltipApi: TooltipApi,
  originalColors: Map<string, string>,
  degreeMap: Record<string, number>,
  maxDegree: number,
  isDarkRef: { value: boolean },
) {
  // click to open url
  renderer.on("clickNode", (e: any) => {
    try {
      const node = e.node as string;
      const attrs = g.getNodeAttributes(node) as any;
      if (attrs && attrs.url) window.open(attrs.url, "_blank");
    } catch {}
  });

  // enter node: show tooltip and highlight
  renderer.on("enterNode", (e: any) => {
    try {
      const nodeId = e.node as string;
      const attrs = g.getNodeAttributes(nodeId) as any;
      const name = attrs.label || nodeId;
      const url = attrs.url || "";
      const desc = attrs.desc || "";

      const content = document.createElement("div");
      content.className = "graph-tooltip-content";
      const titleEl = document.createElement("strong");
      titleEl.className = "graph-tooltip-title";
      titleEl.textContent = name;
      content.appendChild(titleEl);

      if (desc) {
        const descEl = document.createElement("div");
        descEl.className = "graph-tooltip-desc";
        descEl.textContent = desc;
        content.appendChild(descEl);
      }
      if (url) {
        const urlEl = document.createElement("div");
        urlEl.className = "graph-tooltip-url";
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = url;
        urlEl.appendChild(a);
        content.appendChild(urlEl);
      }

      const clientX =
        e.event && e.event.clientX ? e.event.clientX : window.innerWidth / 2;
      const clientY =
        e.event && e.event.clientY ? e.event.clientY : window.innerHeight / 2;
      tooltipApi.show(content, clientX, clientY);

      // highlight node without mutating baseColor
      try {
        const base =
          attrs.baseColor ||
          originalColors.get(nodeId) ||
          PALETTE[hashToIndex(nodeId)];
        const highlight = adjustHex(base, 40);
        g.setNodeAttribute(nodeId, "color", highlight);
        g.setNodeAttribute(nodeId, "size", (attrs.size || 6) * 1.3);
        try {
          renderer.refresh();
        } catch {}
      } catch {}
    } catch {}
  });

  // leave node: restore
  renderer.on("leaveNode", (e: any) => {
    try {
      const nodeId = e.node as string;
      const attrs = g.getNodeAttributes(nodeId) as any;
      try {
        const base =
          attrs.baseColor ||
          originalColors.get(nodeId) ||
          PALETTE[hashToIndex(nodeId)];
        const themed = isDarkRef.value ? adjustHex(base, 20) : base;
        g.setNodeAttribute(nodeId, "color", themed);
        if (attrs && attrs.size != null)
          g.setNodeAttribute(
            nodeId,
            "size",
            degreeToSize(degreeMap[nodeId] || 0, maxDegree),
          );
        try {
          renderer.refresh();
        } catch {}
      } catch {}
    } catch {}
    tooltipApi.hide();
  });

  // move tooltip with mouse
  renderer.on("mousemove", (e: any) => {
    try {
      if (
        tooltipApi &&
        tooltipApi.el &&
        tooltipApi.el.style.display === "block"
      ) {
        const clientX =
          e.event && e.event.clientX ? e.event.clientX : window.innerWidth / 2;
        const clientY =
          e.event && e.event.clientY ? e.event.clientY : window.innerHeight / 2;
        tooltipApi.el.style.left = `${clientX + 12}px`;
        tooltipApi.el.style.top = `${clientY + 12}px`;
      }
    } catch {}
  });
}

/* ---------------------------
   Public API wiring
   --------------------------- */

export function init(data: GraphData) {
  const container = document.getElementById("main");
  if (!container) return;

  // build graph & data structures
  const { g, degreeMap, originalColors, maxDegree } = buildGraphFromData(data);

  // start layout worker if possible
  startForceAtlas2Worker(g);

  // detect theme
  let isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // create renderer
  const renderer = createRendererForGraph(g, container, isDark);

  // tooltip
  const tooltipApi = createOrGetTooltip();

  // wire hover/click events
  const isDarkRef = { value: isDark };
  wireRendererEvents(
    renderer,
    g,
    tooltipApi,
    originalColors,
    degreeMap,
    maxDegree,
    isDarkRef,
  );

  // theme apply helper exposed here so it can be called on toggles / mq changes
  function applyTheme(dark: boolean) {
    try {
      applyThemeToGraph(container, g, tooltipApi, dark, maxDegree);
      isDarkRef.value = dark;
      try {
        renderer.refresh();
      } catch {}
    } catch {}
  }

  // initial theme
  applyTheme(isDark);

  // theme toggle button handling
  const btn = document.getElementById("theme-toggle");
  btn?.addEventListener("click", () => {
    isDark = !isDark;
    applyTheme(isDark);
  });

  // listen to system preference changes
  try {
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener)
        mq.addEventListener("change", (ev: any) => {
          isDark = ev.matches;
          applyTheme(isDark);
        });
    }
  } catch {}

  // helper: find nodes
  function find(query: string) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    const out: any[] = [];
    g.forEachNode((id: string, attr: any) => {
      const name = (attr.label || "").toString().toLowerCase();
      const url = (attr.url || "").toString().toLowerCase();
      if (name.includes(q) || url.includes(q) || id.includes(q)) {
        out.push({
          id,
          name: attr.label || id,
          url: attr.url,
          desc: attr.desc,
        });
      }
    });
    return out;
  }

  // helper: focus node
  function focusNodeById(id: string) {
    try {
      const camera = renderer.getCamera();
      if (!camera) return;
      const pos = g.getNodeAttributes(id) as any;
      if (!pos || pos.x == null || pos.y == null) return;
      camera.animate({ x: pos.x, y: pos.y, ratio: 0.6 }, { duration: 600 });
    } catch {}
  }

  // expose API globally for convenience
  try {
    (window as any).__graphApi = (window as any).__graphApi || {};
    (window as any).__graphApi.find = find;
    (window as any).__graphApi.focusNodeById = focusNodeById;
  } catch {}
}

export async function initFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const data = (await res.json()) as GraphData;
  init(data);
}
