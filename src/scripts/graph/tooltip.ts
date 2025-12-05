/**
 * Tooltip manager for the graph renderer.
 *
 * Provides a small API to create (or reuse) a single tooltip DOM element and
 * show/hide/update it. The created element is appended to document.body and
 * can be styled by callers via the returned `el` reference.
 *
 * Usage:
 *   const tt = createOrGetTooltip();
 *   tt.show('<div>hello</div>', x, y);
 *   tt.hide();
 */
export type TooltipApi = {
  el: HTMLElement;
  show: (content: HTMLElement | string, clientX: number, clientY: number) => void;
  hide: () => void;
};

/**
 * Create or return an existing tooltip element with sensible default styles.
 * The function is idempotent: repeated calls return the same TooltipApi.
 */
export function createOrGetTooltip(): TooltipApi {
  let tooltip = document.getElementById("graph-tooltip") as HTMLElement | null;

  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "graph-tooltip";

    // Default inline styles chosen to be unobtrusive but visible.
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

  function show(content: HTMLElement | string, clientX: number, clientY: number) {
    if (!tooltip) return;
    // Clear previous content
    tooltip.innerHTML = "";
    if (typeof content === "string") {
      const wrapper = document.createElement("div");
      wrapper.innerText = content;
      tooltip.appendChild(wrapper);
    } else {
      tooltip.appendChild(content);
    }
    // Position slightly offset from cursor
    tooltip.style.left = `${clientX + 12}px`;
    tooltip.style.top = `${clientY + 12}px`;
    tooltip.style.display = "block";
  }

  function hide() {
    if (!tooltip) return;
    tooltip.style.display = "none";
  }

  return {
    el: tooltip,
    show,
    hide,
  };
}
