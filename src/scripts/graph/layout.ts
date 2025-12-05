// Start/stop helper for ForceAtlas2 layout worker
// Keeps behavior resilient if the worker package is unavailable.
//
// Exports:
// - startForceAtlas2Worker(g, opts?) -> { layout, stop, kill } | null
//
// Notes:
// - This module intentionally avoids throwing on missing worker support;
//   it logs a warning and returns null so callers can continue rendering.
//
// - The returned object exposes `stop` and `kill` methods which are safe to call
//   (no-op if underlying methods are unavailable). The layout instance (if any)
//   is also returned for callers that want direct access.

import FA2Layout from "graphology-layout-forceatlas2/worker";
import type Graph from "graphology";

export type ForceAtlas2Controller = {
  layout: any | null;
  stop: () => void;
  kill: () => void;
};

/**
 * Start a ForceAtlas2 layout in a dedicated worker (if available).
 *
 * @param g - graphology Graph instance
 * @param opts - optional settings that will be shallow-merged into defaults.settings
 * @returns controller object containing { layout, stop, kill } or null when worker fails
 */
export function startForceAtlas2Worker(
  g: Graph,
  opts?: {
    settings?: Record<string, unknown>;
  },
): ForceAtlas2Controller | null {
  if (!g) return null;

  try {
    const defaultSettings = {
      barnesHutOptimize: true,
      barnesHutTheta: 0.6,
      gravity: 1,
      slowDown: 10,
      scalingRatio: 2,
    };

    const layout = new FA2Layout(g, {
      settings: {
        ...defaultSettings,
        ...(opts && opts.settings ? opts.settings : {}),
      },
    });

    // Start the worker-based layout
    if (typeof layout.start === "function") {
      layout.start();
    }

    // Controller helpers
    const stop = () => {
      try {
        layout && typeof layout.stop === "function" && layout.stop();
      } catch (e) {
        // swallow errors to keep UI stable
      }
    };
    const kill = () => {
      try {
        layout && typeof layout.kill === "function" && layout.kill();
      } catch (e) {
        // swallow errors
      }
    };

    // Expose on window for debugging / external control (non-breaking)
    try {
      (window as any).__graphLayout = (window as any).__graphLayout || {};
      (window as any).__graphLayout.stop = stop;
      (window as any).__graphLayout.kill = kill;
      // also keep a reference to the layout instance
      (window as any).__graphLayout.instance = layout;
    } catch {
      // ignore if accessing window fails in some environments
    }

    return { layout, stop, kill };
  } catch (e) {
    // Worker or package unavailable: log and continue gracefully
    // Keep API stable by returning null so callers can fall back.
    // Use console.warn to avoid failing loudly in production.
    // eslint-disable-next-line no-console
    console.warn("ForceAtlas2 worker unavailable, skipping layout worker.", e);
    return null;
  }
}
