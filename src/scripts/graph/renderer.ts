import Sigma from "sigma";
import type Graph from "graphology";
import { PALETTE, hashToIndex, degreeToSize, adjustHex } from "./utils";
import type { TooltipApi } from "./tooltip";

/**
 * Create a Sigma renderer for the provided graph and container.
 * Mirrors the configuration used elsewhere: renders labels, custom hover drawing,
 * node/edge reducers to preserve original attributes while providing render-time overrides.
 */
export function createRenderer(
  g: Graph,
  container: HTMLElement,
  isDark: boolean,
): any {
  const renderer = new Sigma(g as any, container, {
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
    // Custom hover drawer to draw a subtle background bubble following original visual style.
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
        context.shadowColor = "#000";

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
        // Text drawing is intentionally omitted here because Sigma draws labels
        // in a separate pass using the node's `labelColor`.
      } catch {
        // ignore drawing errors to avoid breaking the rendering pipeline
      }
    },
  } as any);

  return renderer;
}

/**
 * Wire renderer events (click, enter, leave, mousemove) to graph behavior:
 * - click: open node.url in a new tab
 * - enterNode: show tooltip, highlight node (color + enlarge)
 * - leaveNode: hide tooltip, restore color/size
 * - mousemove: move tooltip with cursor
 *
 * The function expects:
 * - renderer: Sigma renderer instance
 * - g: graphology graph
 * - tooltipApi: a TooltipApi providing { el, show, hide }
 * - originalColors: Map of nodeId -> baseColor (immutable original color)
 * - degreeMap: record of node degrees
 * - maxDegree: maximum degree used by degreeToSize
 * - isDarkRef: object with boolean field `value` to reflect current theme state (mutable)
 */
export function wireRendererEvents(
  renderer: any,
  g: Graph,
  tooltipApi: TooltipApi,
  originalColors: Map<string, string>,
  degreeMap: Record<string, number>,
  maxDegree: number,
  isDarkRef: { value: boolean },
) {
  // click -> open url
  renderer.on("clickNode", (e: any) => {
    try {
      const node = e.node as string;
      const attrs = (g as any).getNodeAttributes(node) as any;
      if (attrs && attrs.url) window.open(attrs.url, "_blank");
    } catch {
      // ignore
    }
  });

  // enter: build tooltip content, show it, highlight node
  renderer.on("enterNode", (e: any) => {
    try {
      const nodeId = e.node as string;
      const attrs = (g as any).getNodeAttributes(nodeId) as any;
      console.log(
        `[hover] node ${nodeId} coordinates: x=${attrs.x}, y=${attrs.y}`,
      );
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
        // 添加样式确保在暗色和亮色背景下都能看清
        a.style.color = isDarkRef.value ? "#87ceeb" : "#0066cc"; // 暗色主题用天蓝色，亮色主题用深蓝色
        a.style.textDecoration = "underline";
        urlEl.appendChild(a);
        content.appendChild(urlEl);
      }

      const clientX =
        e.event && e.event.clientX ? e.event.clientX : window.innerWidth / 2;
      const clientY =
        e.event && e.event.clientY ? e.event.clientY : window.innerHeight / 2;
      tooltipApi.show(content, clientX, clientY);

      // highlight node: compute highlight from baseColor (do not mutate baseColor)
      try {
        const base =
          attrs.baseColor ||
          originalColors.get(nodeId) ||
          PALETTE[hashToIndex(nodeId)];
        const highlight = adjustHex(base, 40);
        (g as any).setNodeAttribute(nodeId, "color", highlight);
        (g as any).setNodeAttribute(nodeId, "size", (attrs.size || 6) * 1.3);
        try {
          renderer.refresh();
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
  });

  // leave: restore color/size and hide tooltip
  renderer.on("leaveNode", (e: any) => {
    try {
      const nodeId = e.node as string;
      const attrs = (g as any).getNodeAttributes(nodeId) as any;
      try {
        const base =
          attrs.baseColor ||
          originalColors.get(nodeId) ||
          PALETTE[hashToIndex(nodeId)];
        const themed = isDarkRef.value ? adjustHex(base, 20) : base;
        (g as any).setNodeAttribute(nodeId, "color", themed);
        if (attrs && attrs.size != null) {
          (g as any).setNodeAttribute(
            nodeId,
            "size",
            degreeToSize(degreeMap[nodeId] || 0, maxDegree),
          );
        }
        try {
          renderer.refresh();
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
    tooltipApi.hide();
  });

  // move tooltip with mouse while it is visible
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
    } catch {
      // ignore
    }
  });
}
