/**
 * Entry point for new decoupled graph modules.
 * Exposes `init(data: GraphData)` and `initFromUrl(url: string)` and re-exports utilities.
 *
 * File: FriendLinks/src/scripts/graph/index.ts
 */

import type { GraphData } from "../../../types/graph"; //
import { buildGraphFromData } from "./builder";
import { startForceAtlas2Worker } from "./layout";
import { createOrGetTooltip } from "./tooltip";
import { createRenderer, wireRendererEvents } from "./renderer";
import { setupThemeHandlers, applyThemeToGraph } from "./theme";

/**
 * Initialize the graph renderer from an in-memory GraphData object.
 * This function wires layout, renderer, tooltip, theme and global API.
 */
export function init(data: GraphData) {
  const container = document.getElementById("main");
  if (!container) return;

  // Build graph and supporting metadata
  const { g, degreeMap, originalColors, maxDegree } = buildGraphFromData(data);

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
  const tooltipApi = createOrGetTooltip();

  // Setup theme handlers (applies theme initially and wires toggle / mq changes)
  const themeController = setupThemeHandlers(
    container,
    g,
    tooltipApi,
    maxDegree,
    // onChange callback: refresh renderer when theme changes
    (dark) => {
      try {
        // refresh renderer to pick labelColor changes from nodeReducer
        renderer.refresh();
      } catch {}
    },
  );

  // Wire renderer events (click, hover, tooltip movement)
  wireRendererEvents(
    renderer,
    g,
    tooltipApi,
    originalColors,
    degreeMap,
    maxDegree,
    themeController.isDarkRef,
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
      const camera = (renderer as any).getCamera();
      if (!camera) return;
      const pos = (g as any).getNodeAttributes(id) as any;
      if (!pos || pos.x == null || pos.y == null) return;
      camera.animate({ x: pos.x, y: pos.y, ratio: 0.6 }, { duration: 600 });
    } catch {}
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

  // Return an object with some handles so callers can programmatically control things
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
