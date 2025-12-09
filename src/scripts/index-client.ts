import { initFromUrl } from "./graph/index";

type SearchResult = { id: string; name: string; url?: string };

interface GraphApi {
  find?: (q: string) => SearchResult[];
  focusNodeById?: (id: string) => void;
  focusByDomain?: (domain: string) => void;
  highlightNodesAndNeighbors?: (ids: string[]) => void;
  highlightNodesByDomain?: (ids: string[]) => void;
  clearHighlights?: () => void;
}

declare global {
  interface Window {
    __graphApi?: GraphApi;
  }
}

(async () => {
  const controller = await initFromUrl("/graph.json");

  const input = document.getElementById(
    "graph-search"
  ) as HTMLInputElement | null;
  const results = document.getElementById("graph-search-results");
  const clearBtn = document.getElementById(
    "graph-search-clear"
  ) as HTMLButtonElement | null;
  function render(list: SearchResult[]) {
    if (!results) return;
    results.innerHTML = "";
    if (!list.length) {
      results.style.display = "none";
      try {
        if (controller && (controller as any).clearHighlights) {
          (controller as any).clearHighlights();
        } else if (window.__graphApi && window.__graphApi.clearHighlights) {
          window.__graphApi.clearHighlights();
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }
    for (const it of list) {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `<div style="font-weight:600">${
        it.name
      }</div><div style="font-size:12px;color:var(--muted,#666)">${
        it.url ?? ""
      }</div>`;
      el.onclick = () => {
        try {
          // First, clear previous highlights and then highlight node + neighbors (contour overlay)
          try {
            if (controller && (controller as any).clearHighlights) {
              (controller as any).clearHighlights();
            } else if (window.__graphApi && window.__graphApi.clearHighlights) {
              window.__graphApi.clearHighlights();
            }
          } catch {}
          if (controller && (controller as any).highlightNodesAndNeighbors) {
            (controller as any).highlightNodesAndNeighbors([it.id]);
          } else if (
            window.__graphApi &&
            window.__graphApi.highlightNodesAndNeighbors
          ) {
            window.__graphApi.highlightNodesAndNeighbors([it.id]);
          }

          // Then focus the node (camera)
          if (controller && (controller as any).focusNodeById) {
            (controller as any).focusNodeById(it.id);
          } else if (window.__graphApi && window.__graphApi.focusNodeById) {
            window.__graphApi.focusNodeById(it.id);
          }
        } catch (err) {
          console.error(err);
        }
        results.style.display = "none";
      };
      results.appendChild(el);
    }
    results.style.display = "block";
  }

  if (input) {
    input.addEventListener("input", (ev: Event) => {
      const target = ev.target as HTMLInputElement | null;
      const v = target && target.value ? target.value.trim() : "";
      // toggle clear button visibility
      try {
        if (clearBtn) {
          if (v) {
            clearBtn.style.display = "flex";
            clearBtn.setAttribute("aria-hidden", "false");
          } else {
            clearBtn.style.display = "none";
            clearBtn.setAttribute("aria-hidden", "true");
          }
        }
      } catch {}
      if (!v) {
        render([]);
        return;
      }
      try {
        const list: SearchResult[] =
          controller && (controller as any).find
            ? (controller as any).find(v)
            : window.__graphApi && window.__graphApi.find
            ? window.__graphApi.find(v)
            : [];
        render((list || []).slice(0, 12));
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Clear button interaction
  if (clearBtn && input) {
    // initial state
    try {
      clearBtn.style.display =
        input.value && input.value.trim() ? "flex" : "none";
      clearBtn.setAttribute(
        "aria-hidden",
        clearBtn.style.display === "none" ? "true" : "false"
      );
    } catch {}
    clearBtn.addEventListener("click", () => {
      try {
        input.value = "";
        render([]);
        // call clearHighlights on controller or window.__graphApi
        if (controller && (controller as any).clearHighlights) {
          (controller as any).clearHighlights();
        } else if (window.__graphApi && window.__graphApi.clearHighlights) {
          window.__graphApi.clearHighlights();
        }
        // hide results
        if (results) results.style.display = "none";
        // hide button
        clearBtn.style.display = "none";
        clearBtn.setAttribute("aria-hidden", "true");
        input.focus();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // 支持通过 ?local=<url> 聚焦到对应域名节点
  try {
    const params = new URLSearchParams(location.search);
    const local = params.get("local");
    if (local) {
      setTimeout(() => {
        try {
          if (controller && (controller as any).focusByDomain) {
            (controller as any).focusByDomain(local);
          } else if (window.__graphApi && window.__graphApi.focusByDomain) {
            window.__graphApi.focusByDomain(local);
          }
        } catch (err) {
          console.error(err);
        }
      }, 600);
    }
  } catch (err) {
    console.error(err);
  }
})();
