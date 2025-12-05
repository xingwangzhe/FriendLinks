/**
 * Entry point for new decoupled graph modules.
 * Exposes `init(data: GraphData)` and `initFromUrl(url: string)` and re-exports utilities.
 *
 * File: FriendLinks/src/scripts/graph/index.ts
 */

import type { GraphData } from "../../../types/graph"; //
import { Decimal } from "decimal.js";
import { buildGraphFromData } from "./builder";
import { startForceAtlas2Worker } from "./layout";
import { createOrGetTooltip } from "./tooltip";
import { createRenderer, wireRendererEvents } from "./renderer";
import { setupThemeHandlers, applyThemeToGraph } from "./theme";
import { adjustHex } from "./utils";

/**
 * Initialize the graph renderer from an in-memory GraphData object.
 * This function wires layout, renderer, tooltip, theme and global API.
 */
export function init(data: GraphData) {
  const container = document.getElementById("main");
  if (!container) return;

  // Build graph and supporting metadata
  const { g, degreeMap, originalColors, maxDegree } = buildGraphFromData(data);

  // Track the last highlighted node for restoration
  let lastHighlightedNode: string | null = null;

  // Start layout worker (if available) - returns controller or null
  const layoutController = startForceAtlas2Worker(g);

  // Determine initial theme (system preference)
  let isDark =
    typeof window !== "undefined" &&
    !!(
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );

  // Create renderer and tooltip
  const renderer = createRenderer(g, container, isDark);
  // Expose renderer on window for interactive debugging (inspector / console)
  try {
    (window as any).__graphRenderer = renderer;
  } catch {}
  const tooltipApi = createOrGetTooltip();

  // Setup theme handlers (applies theme initially and wires toggle / mq changes)
  const themeController = setupThemeHandlers(
    container,
    g,
    tooltipApi,
    maxDegree,
    // onChange callback: refresh renderer when theme changes
    (_dark) => {
      try {
        // refresh renderer to pick labelColor changes from nodeReducer
        renderer.refresh();
      } catch {}
    }
  );

  // Wire renderer events (click, hover, tooltip movement)
  wireRendererEvents(
    renderer,
    g,
    tooltipApi,
    originalColors,
    degreeMap,
    maxDegree,
    themeController.isDarkRef
  );

  // Expose a small global API for convenience (find, focus)
  function find(query: string) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    const out: any[] = [];
    try {
      (g as any).forEachNode((id: string, attr: any) => {
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
    } catch {}
    return out;
  }

  function focusNodeById(id: string) {
    try {
      const pos = (g as any).getNodeAttributes(id) as any;
      if (!pos || pos.x == null || pos.y == null) return;

      // Restore previous highlighted node
      if (lastHighlightedNode && lastHighlightedNode !== id) {
        try {
          const prevAttrs = (g as any).getNodeAttributes(lastHighlightedNode);
          if (prevAttrs) {
            const base =
              originalColors.get(lastHighlightedNode) ||
              prevAttrs.baseColor ||
              "#888";
            const themed = isDark ? adjustHex(base, 20) : base;
            (g as any).setNodeAttribute(lastHighlightedNode, "color", themed);
            const originalSize = degreeMap[lastHighlightedNode]
              ? Math.max(
                  6,
                  Math.min(
                    22,
                    6 +
                      (Math.sqrt(degreeMap[lastHighlightedNode]) /
                        Math.sqrt(maxDegree)) *
                        16
                  )
                )
              : 6;
            (g as any).setNodeAttribute(
              lastHighlightedNode,
              "size",
              originalSize
            );
          }
        } catch {}
      }

      // Log initial camera center and target node coordinates
      try {
        const camera = renderer.camera;
        const state =
          typeof camera.getState === "function"
            ? camera.getState()
            : { x: camera.x, y: camera.y, ratio: camera.ratio };
        console.log("[图表] focusNodeById - 相机初始状态", state);

        console.log("[图表] focusNodeById - 目标节点坐标", {
          id,
          x: pos.x,
          y: pos.y,
          size: pos.size,
        });

        // Container dimensions & center pixel
        const containerEl =
          typeof renderer.getContainer === "function"
            ? renderer.getContainer()
            : container;
        const width = containerEl ? containerEl.clientWidth : window.innerWidth;
        const height = containerEl
          ? containerEl.clientHeight
          : window.innerHeight;
        const centerPixel = { x: width / 2, y: height / 2 };
        console.log("[图表] focusNodeById - 容器尺寸和中心像素", {
          width,
          height,
          centerPixel,
        });

        // If available, convert node graph coords -> viewport (pixel)
        if (typeof renderer.graphToViewport === "function") {
          try {
            const nodeViewport = renderer.graphToViewport({
              x: pos.x,
              y: pos.y,
            });
            console.log(
              "[图表] focusNodeById - 节点图坐标到像素坐标转换",
              nodeViewport
            );
          } catch (err) {
            console.warn("[图表] focusNodeById - graphToViewport 失败:", err);
          }
        } else {
          console.log("[图表] focusNodeById - renderer.graphToViewport 不可用");
        }

        // If available, convert container center pixel -> graph coords
        if (typeof renderer.viewportToGraph === "function") {
          try {
            const centerGraph = renderer.viewportToGraph(centerPixel);
            console.log(
              "[图表] focusNodeById - 容器中心像素到图坐标转换",
              centerGraph
            );
          } catch (err) {
            console.warn("[图表] focusNodeById - viewportToGraph 失败:", err);
          }
        } else {
          console.log("[图表] focusNodeById - renderer.viewportToGraph 不可用");
        }
      } catch {
        // ignore logging errors
      }

      // Directly set camera to the node's position using relative coordinates
      // 禁止直接设置相机到像素坐标，这会导致超大的位置偏移
      const camera = renderer.camera;
      const currentState =
        typeof camera.getState === "function"
          ? camera.getState()
          : {
              x: camera.x,
              y: camera.y,
              angle: camera.angle || 0,
              ratio: camera.ratio,
            };
      // Get node's current pixel position
      const nodePixel = renderer.graphToViewport({ x: pos.x, y: pos.y });
      // Convert to relative coordinates (0 to 1) with high precision
      const containerEl = renderer.getContainer();
      const relX = new Decimal(nodePixel.x).div(containerEl.clientWidth);
      const relY = new Decimal(nodePixel.y).div(containerEl.clientHeight);
      console.log("[图表] focusNodeById - 相对坐标计算", {
        relX: relX.toNumber(),
        relY: relY.toNumber(),
      });
      // Calculate the delta to move node to center (0.5, 0.5), adjusted by current zoom
      const scaleFactor = new Decimal(currentState.ratio);
      const half = new Decimal(0.5);
      const deltaX = half.minus(relX).mul(scaleFactor);
      const deltaY = half.minus(relY).mul(scaleFactor);
      console.log("[图表] focusNodeById - delta 计算", {
        deltaX: deltaX.toNumber(),
        deltaY: deltaY.toNumber(),
        scaleFactor: scaleFactor.toNumber(),
      });
      const newX = new Decimal(currentState.x).minus(deltaX);
      const newY = new Decimal(currentState.y).plus(deltaY);
      console.log("[图表] focusNodeById - 新相机位置计算", {
        newX: newX.toNumber(),
        newY: newY.toNumber(),
      });
      // Calculate target zoom based on node size (larger nodes zoom out more)
      const targetRatio = new Decimal(pos.size).div(50);
      console.log("[图表] focusNodeById - 目标缩放计算", {
        targetRatio: targetRatio.toNumber(),
        nodeSize: pos.size,
      });
      camera.setState({
        x: newX.toNumber(),
        y: newY.toNumber(),
        angle: 0,
        ratio: targetRatio.toNumber(),
      });
      // Refresh renderer to apply changes
      renderer.refresh();

      // Highlight the focused node
      try {
        const base = originalColors.get(id) || pos.baseColor || "#888";
        const highlight = adjustHex(base, 40);
        (g as any).setNodeAttribute(id, "color", highlight);
        (g as any).setNodeAttribute(id, "size", pos.size * 4);
        lastHighlightedNode = id;
        renderer.refresh();
      } catch {}

      // Log after moving camera
      setTimeout(() => {
        try {
          const afterState =
            typeof camera.getState === "function"
              ? camera.getState()
              : { x: camera.x, y: camera.y, ratio: camera.ratio };
          console.log("[图表] focusNodeById - 相机移动后状态", {
            x: afterState.x,
            y: afterState.y,
            ratio: afterState.ratio,
          });
        } catch (_e) {
          console.error("[graph] focusNodeById - logging after failed:", _e);
        }
      }, 650); // slightly after duration
    } catch (_e) {
      console.error("[graph] focusNodeById failed:", _e);
    }
  }

  try {
    (window as any).__graphApi = (window as any).__graphApi || {};
    (window as any).__graphApi.find = find;
    (window as any).__graphApi.focusNodeById = focusNodeById;
  } catch {}

  // Ensure layout controller is exposed for external control if provided
  try {
    if (layoutController) {
      (window as any).__graphLayout = (window as any).__graphLayout || {};
      (window as any).__graphLayout.stop = layoutController.stop;
      (window as any).__graphLayout.kill = layoutController.kill;
      (window as any).__graphLayout.instance = layoutController.layout;
    }
  } catch {}

  // Add temporary button to log camera coordinates
  try {
    const button = document.createElement("button");
    button.textContent = "Log Camera";
    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "1000";
    button.onclick = () => {
      try {
        const state = renderer.camera.getState();
        console.log("[button] current camera coordinates:", {
          x: state.x,
          y: state.y,
          ratio: state.ratio,
        });
      } catch (e) {
        console.error("[button] error logging camera:", e);
      }
    };
    container.appendChild(button);
  } catch (e) {
    console.error("[graph] focusNodeById failed:", e);
  } // Return an object with some handles so callers can programmatically control things
  return {
    graph: g,
    renderer,
    tooltip: tooltipApi,
    layoutController,
    themeController,
    find,
    focusNodeById,
  };
}

/**
 * Initialize graph by fetching JSON from a URL.
 */
export async function initFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const data = (await res.json()) as GraphData;
  return init(data);
}

/* Re-exports for convenience (allow importing helpers from this index) */
export { buildGraphFromData } from "./builder";
export { startForceAtlas2Worker } from "./layout";
export { createOrGetTooltip } from "./tooltip";
export { createRenderer, wireRendererEvents } from "./renderer";
export { setupThemeHandlers, applyThemeToGraph } from "./theme";
export * from "./utils";
