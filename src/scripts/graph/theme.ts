// Theme utilities for graph rendering: apply theme colors to graph nodes/edges and tooltip,
// and provide a helper to wire system preference and toggle button listeners.
import type Graph from "graphology";
import { PALETTE, hashToIndex, degreeToSize, adjustHex } from "./utils";
import type { TooltipApi } from "./tooltip";

/**
 * Apply theme (dark or light) to the graph container, nodes, edges and tooltip.
 *
 * - container: HTMLElement that hosts the renderer (used for background)
 * - g: graphology Graph instance
 * - tooltip: TooltipApi returned by createOrGetTooltip (or null)
 * - dark: whether to apply dark theme
 * - maxDegree: used to recalculate node sizes when needed
 */
export function applyThemeToGraph(
  container: HTMLElement,
  g: Graph,
  tooltip: TooltipApi | null,
  dark: boolean,
  maxDegree: number,
): void {
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

        // Ensure size exists and remains consistent with degree if missing
        if (attr.size == null) {
          const degSize = degreeToSize(0, maxDegree);
          g.setNodeAttribute(id, "size", degSize);
        }
      } catch {
        // ignore per-node errors to keep UI stable
      }
    });

    g.forEachEdge((edge: any) => {
      try {
        g.setEdgeAttribute(edge, "color", edgeColor);
      } catch {
        // ignore per-edge errors
      }
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
  } catch {
    // swallow errors to avoid breaking the application if theming fails
  }
}

/**
 * Helper to initialize and manage theme state:
 * - detects system preference
 * - applies initial theme
 * - wires #theme-toggle button (if present) to toggle theme
 * - listens to prefers-color-scheme changes
 *
 * Returns an object with:
 * - isDarkRef: a mutable object holding current theme in `value`
 * - stop: function to remove listeners and cleanup
 *
 * Usage:
 *   const controller = setupThemeHandlers(container, g, tooltip, maxDegree, (dark) => { renderer.refresh(); });
 *   // later: controller.stop();
 */
export function setupThemeHandlers(
  container: HTMLElement,
  g: Graph,
  tooltip: TooltipApi | null,
  maxDegree: number,
  onChange?: (dark: boolean) => void,
): {
  isDarkRef: { value: boolean };
  stop: () => void;
} {
  let isDark =
    typeof window !== "undefined" &&
    !!(
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  const isDarkRef = { value: isDark };

  // apply initial theme
  applyThemeToGraph(container, g, tooltip, isDark, maxDegree);
  try {
    if (onChange) onChange(isDark);
  } catch {}

  // theme toggle button
  const btn = (() => {
    try {
      return document.getElementById("theme-toggle");
    } catch {
      return null;
    }
  })();
  const btnHandler = () => {
    isDark = !isDark;
    isDarkRef.value = isDark;
    applyThemeToGraph(container, g, tooltip, isDark, maxDegree);
    try {
      if (onChange) onChange(isDark);
    } catch {}
  };
  if (btn) {
    try {
      btn.addEventListener("click", btnHandler);
    } catch {}
  }

  // listen to system preference changes
  let mq: MediaQueryList | null = null;
  const mqHandler = (ev: MediaQueryListEvent | MediaQueryList) => {
    try {
      const matched = "matches" in ev ? ev.matches : false;
      isDark = matched;
      isDarkRef.value = isDark;
      applyThemeToGraph(container, g, tooltip, isDark, maxDegree);
      try {
        if (onChange) onChange(isDark);
      } catch {}
    } catch {}
  };

  try {
    if (window.matchMedia) {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      // modern API
      if ((mq as any).addEventListener) {
        (mq as any).addEventListener("change", mqHandler);
      } else if ((mq as any).addListener) {
        // legacy API
        (mq as any).addListener(mqHandler);
      }
    }
  } catch {
    mq = null;
  }

  const stop = () => {
    // remove button listener
    if (btn) {
      try {
        btn.removeEventListener("click", btnHandler);
      } catch {}
    }
    // remove mq listener
    if (mq) {
      try {
        if ((mq as any).removeEventListener) {
          (mq as any).removeEventListener("change", mqHandler);
        } else if ((mq as any).removeListener) {
          (mq as any).removeListener(mqHandler);
        }
      } catch {}
    }
  };

  return { isDarkRef, stop };
}
