/**
 * Entry point for new decoupled graph modules.
 * Exposes `init(data: GraphData)` and `initFromUrl(url: string)` and re-exports utilities.
 *
 * File: FriendLinks/src/scripts/graph/index.ts
 */

import type { GraphData } from "../../../types/graph"; //
import { Decimal } from "decimal.js";
import Fuse from "fuse.js";
import { buildGraphFromData } from "./builder";
import { startForceAtlas2Worker } from "./layout";
import { createOrGetTooltip } from "./tooltip";
import { fitViewportToNodes } from "@sigma/utils";
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

  // Build search index for nodes
  const nodesList: any[] = [];
  (g as any).forEachNode((id: string, attr: any) => {
    nodesList.push({
      id,
      name: attr.label || id,
      url: attr.url,
      desc: attr.desc,
    });
  });
  const fuse = new Fuse(nodesList, {
    keys: ["name", "url", "id"],
    threshold: 0.3, // Allow some fuzziness
    includeScore: true,
  });

  // Track the last highlighted node for restoration
  let lastHighlightedNode: string | null = null;
  // Track a highlighted group (search results + neighbors)
  let highlightedGroup: Set<string> = new Set();
  type HighlightState = {
    nodeAttrs: Map<string, { color?: string; size?: number }>;
    edgeAttrs: Map<string, { color?: string }>;
    contourCleanup?: (() => void) | null;
  };
  const highlightStack: HighlightState[] = [];

  async function pushHighlightState(toHighlight: Set<string>) {
    const prevNodeAttrs = new Map<string, { color?: string; size?: number }>();
    const prevEdgeAttrs = new Map<string, { color?: string }>();
    try {
      // We intentionally do NOT change node attributes here: highlight is provided
      // via a contour overlay only (no color/size change for nodes nor edges).

      // We purposely do NOT change edges here either; the contour overlay will
      // visually highlight the group without mutating edge colors.

      // Optionally create a contour layer around the highlighted nodes
      let contourCleanup: (() => void) | null = null;
      try {
        // Use dynamic import to avoid hard dependency and type issues.
        const layerWebgl = await import("@sigma/layer-webgl");
        const {
          createContoursProgram: createProgram,
          bindWebGLLayer: bindLayer,
        } = layerWebgl as any;
        const nodesArr = [...toHighlight];
        if (nodesArr.length) {
          const nodeColor =
            (originalColors.get(nodesArr[0]) as string) || "#fff";
          const program = createProgram(nodesArr, {
            radius: 150,
            border: { color: nodeColor, thickness: 8 },
            levels: [
              {
                color: "#00000000",
                threshold: 0.5,
              },
            ],
          });
          contourCleanup = bindLayer(
            `highlight-contour`,
            renderer as any,
            program as any
          ) as any;
        }
      } catch (err) {
        // If the layer isn't available or fails, we silently continue.
        console.error("Contour layer creation failed:", err);
        contourCleanup = null;
      }

      highlightStack.push({
        nodeAttrs: prevNodeAttrs,
        edgeAttrs: prevEdgeAttrs,
        contourCleanup,
      });
      highlightedGroup = new Set(toHighlight);
      try {
        renderer.refresh();
      } catch {}
    } catch (e) {
      console.error("pushHighlightState failed:", e);
    }
  }

  function popHighlightState() {
    if (!highlightStack.length) return;
    const state = highlightStack.pop() as HighlightState;
    try {
      // Remove contour layer if present for this state
      try {
        if (state.contourCleanup) {
          state.contourCleanup();
        }
      } catch {}
      state.nodeAttrs.forEach((val, node) => {
        try {
          if (val.color != null)
            (g as any).setNodeAttribute(node, "color", val.color);
          if (val.size != null)
            (g as any).setNodeAttribute(node, "size", val.size);
        } catch {}
      });
      state.edgeAttrs.forEach((val, edge) => {
        try {
          if (val.color != null)
            (g as any).setEdgeAttribute(edge, "color", val.color);
        } catch {}
      });
      // rebuild highlightedGroup from stack (last state)
      if (!highlightStack.length) {
        highlightedGroup.clear();
      } else {
        const last = highlightStack[highlightStack.length - 1];
        highlightedGroup = new Set(
          [...last.nodeAttrs.keys()].filter((k) => (g as any).hasNode(k))
        );
      }
      try {
        renderer.refresh();
      } catch {}
    } catch (e) {
      console.error("popHighlightState failed:", e);
    }
  }

  // clearAllHighlights is defined later and exposed on the API (avoid duplicate def)

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
    const q = (query || "").trim();
    if (!q) return [];
    try {
      const results = fuse.search(q);
      return results.map((result) => result.item);
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  function focusByDomain(urlOrHost: string) {
    if (!urlOrHost) return;
    const input = urlOrHost.trim().toLowerCase();
    let targetHost = input;
    try {
      // Try to extract hostname from URL
      const url = new URL(
        input.startsWith("http") ? input : `https://${input}`
      );
      targetHost = url.hostname.toLowerCase();
    } catch {
      // If not a valid URL, use as-is
      targetHost = input;
    }

    // 新增：收集所有匹配节点id
    const matchedIds: string[] = [];
    try {
      (g as any).forEachNode((id: string, attr: any) => {
        const nodeUrl = (attr.url || "").toString().toLowerCase();
        let nodeHost = nodeUrl;
        try {
          const url = new URL(
            nodeUrl.startsWith("http") ? nodeUrl : `https://${nodeUrl}`
          );
          nodeHost = url.hostname.toLowerCase();
        } catch {
          // Use as-is if not valid URL
        }
        // First, try exact hostname match
        if (nodeHost === targetHost) {
          matchedIds.push(id);
          return;
        }
        // Then, try contains match in the full URL
        if (nodeUrl.includes(targetHost)) {
          matchedIds.push(id);
          return;
        }
      });
    } catch (e) {
      console.error("Error in focusByDomain:", e);
    }

    if (matchedIds.length) {
      // 先高亮所有匹配节点（群组轮廓）
      highlightNodesByDomain(matchedIds);
      // 再聚焦第一个节点
      focusNodeById(matchedIds[0]);
    } else {
      console.warn("No node found for domain:", urlOrHost);
    }
  }

  // 新增API：高亮所有同域名节点（群组轮廓）
  async function highlightNodesByDomain(ids: string[] = []) {
    try {
      // 只高亮传入的节点，不包含邻居
      const toHighlight = new Set<string>(ids);
      await pushHighlightState(toHighlight);
    } catch (e) {
      console.error("highlightNodesByDomain failed:", e);
    }
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
        const _state =
          typeof camera.getState === "function"
            ? camera.getState()
            : { x: camera.x, y: camera.y, ratio: camera.ratio };
        // console.log("[图表] focusNodeById - 相机初始状态", state);

        // console.log("[图表] focusNodeById - 目标节点坐标", {
        //   id,
        //   x: pos.x,
        //   y: pos.y,
        //   size: pos.size,
        // });

        // Container dimensions & center pixel
        const containerEl =
          typeof renderer.getContainer === "function"
            ? renderer.getContainer()
            : container;
        const _width = containerEl
          ? containerEl.clientWidth
          : window.innerWidth;
        const _height = containerEl
          ? containerEl.clientHeight
          : window.innerHeight;
        const _centerPixel = { x: _width / 2, y: _height / 2 };
        // console.log("[图表] focusNodeById - 容器尺寸和中心像素", {
        //   width,
        //   height,
        //   centerPixel,
        // });

        // If available, convert node graph coords -> viewport (pixel)
        if (typeof renderer.graphToViewport === "function") {
          try {
            const _nodeViewport = renderer.graphToViewport({
              x: pos.x,
              y: pos.y,
            });
            // console.log(
            //   "[图表] focusNodeById - 节点图坐标到像素坐标转换",
            //   nodeViewport
            // );
          } catch {
            // console.warn("[图表] focusNodeById - graphToViewport 失败:", err);
          }
        } else {
          // console.log("[图表] focusNodeById - renderer.graphToViewport 不可用");
        }

        // If available, convert container center pixel -> graph coords
        if (typeof renderer.viewportToGraph === "function") {
          try {
            const _centerGraph = renderer.viewportToGraph(_centerPixel);
            // console.log(
            //   "[图表] focusNodeById - 容器中心像素到图坐标转换",
            //   centerGraph
            // );
          } catch {
            // console.warn("[图表] focusNodeById - viewportToGraph 失败:", err);
          }
        } else {
          // console.log("[图表] focusNodeById - renderer.viewportToGraph 不可用");
        }
      } catch {
        // ignore logging errors
      }

      // Prepare camera reference for logging/fallback and use official utility to fit viewport to the target node(s).
      const camera = renderer.camera;
      try {
        // `fitViewportToNodes` accepts the renderer and an iterable of node ids
        // Graphology's `filterNodes` returns an array of node ids for the predicate.
        const nodesToFit: string[] = (g as any).filterNodes
          ? (g as any).filterNodes((n: string) => n === id)
          : [id];
        // Use animation for smooth user experience.
        fitViewportToNodes(renderer as any, nodesToFit, { animate: true });
      } catch (err) {
        console.error(
          "fitViewportToNodes failed, falling back to manual move:",
          err
        );
        // If the utility fails for any reason, keep existing behavior: center node without zoom change
        try {
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
          const nodePixel = renderer.graphToViewport({ x: pos.x, y: pos.y });
          const containerEl = renderer.getContainer();
          const relX = new Decimal(nodePixel.x).div(containerEl.clientWidth);
          const relY = new Decimal(nodePixel.y).div(containerEl.clientHeight);
          const scaleFactor = new Decimal(currentState.ratio);
          const half = new Decimal(0.5);
          const deltaX = half.minus(relX).mul(scaleFactor);
          const deltaY = half.minus(relY).mul(scaleFactor);
          const newX = new Decimal(currentState.x).minus(deltaX);
          const newY = new Decimal(currentState.y).plus(deltaY);
          camera.setState({
            x: newX.toNumber(),
            y: newY.toNumber(),
            angle: 0,
            ratio: currentState.ratio,
          });
          renderer.refresh();
        } catch (e) {
          console.error("fallback move failed:", e);
        }
      }

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
    (window as any).__graphApi.focusByDomain = focusByDomain;
    (window as any).__graphApi.focusNodeById = focusNodeById;
    (window as any).__graphApi.highlightNodesAndNeighbors = (
      ids: string[] = []
    ) => highlightNodesAndNeighbors(ids);
    (window as any).__graphApi.highlightNodesByDomain = (ids: string[] = []) =>
      highlightNodesByDomain(ids);
    (window as any).__graphApi.clearHighlights = () => clearHighlights();
    (window as any).__graphApi.popHighlight = () => popHighlightState();
    (window as any).__graphApi.clearAllHighlights = () => clearAllHighlights();
  } catch {}

  function clearHighlights() {
    if (!highlightStack.length) return;
    try {
      popHighlightState();
    } catch (e) {
      console.error("clearHighlights failed:", e);
    }
  }

  function clearAllHighlights() {
    try {
      while (highlightStack.length) popHighlightState();
    } catch (e) {
      console.error("clearAllHighlights failed:", e);
    }
  }

  // Deprecated function removed: clearHighlightsDeprecated

  async function highlightNodesAndNeighbors(ids: string[] = []) {
    try {
      // Build the set of nodes to highlight: selected + their neighbors
      const toHighlight = new Set<string>();
      for (const id of ids) {
        if (!(g as any).hasNode) continue;
        if (!(g as any).hasNode(id)) continue;
        toHighlight.add(id);
        try {
          (g as any).forEachNeighbor(id, (neighbor: string) => {
            toHighlight.add(neighbor);
          });
        } catch {}
      }

      // Push a highlight state onto the stack: this will dim others and
      // highlight the selected nodes + neighbors. Using the stack allows
      // temporary overlays (e.g., hover) to be popped to restore previous state.
      await pushHighlightState(toHighlight);
    } catch (e) {
      console.error("highlightNodesAndNeighbors failed:", e);
    }
  }

  // Ensure layout controller is exposed for external control if provided
  try {
    if (layoutController) {
      (window as any).__graphLayout = (window as any).__graphLayout || {};
      (window as any).__graphLayout.stop = layoutController.stop;
      (window as any).__graphLayout.kill = layoutController.kill;
      (window as any).__graphLayout.instance = layoutController.layout;
    }
  } catch {}

  // Return an object with some handles so callers can programmatically control things
  return {
    graph: g,
    renderer,
    tooltip: tooltipApi,
    layoutController,
    themeController,
    find,
    focusByDomain,
    focusNodeById,
    highlightNodesAndNeighbors,
    highlightNodesByDomain,
    clearHighlights,
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
