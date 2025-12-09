import { initFromUrl } from "./graph/index";

type SearchResult = { id: string; name: string; url?: string };

interface GraphApi {
  find?: (q: string) => SearchResult[];
  focusNodeById?: (id: string) => void;
  focusByDomain?: (domain: string) => void;
  highlightNodesAndNeighbors?: (ids: string[]) => void;
  // Accept either a domain string (domain or full URL) OR array of node ids.
  highlightNodesByDomain?: (domainOrIds: string | string[]) => void;
  clearHighlights?: () => void;
  clearLocalEffects?: () => void;
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
  // Remove only `local` param from URL without causing a reload
  function clearLocalQueryParam() {
    try {
      const u = new URL(location.href);
      if (u.searchParams.has("local")) {
        u.searchParams.delete("local");
        const search = u.search ? `?${u.searchParams.toString()}` : "";
        const newUrl = `${u.pathname}${search}${u.hash || ""}`;
        history.replaceState(null, document.title, newUrl);
        try {
          if (controller && (controller as any).clearLocalEffects) {
            (controller as any).clearLocalEffects();
          } else if (window.__graphApi && window.__graphApi.clearLocalEffects) {
            window.__graphApi.clearLocalEffects();
          } else {
            // Fallback: clear highlights and try to clear focused node highlight
            if (controller && (controller as any).clearAllHighlights) {
              (controller as any).clearAllHighlights();
            } else if (
              window.__graphApi &&
              window.__graphApi.clearAllHighlights
            ) {
              window.__graphApi.clearAllHighlights();
            }
            if (controller && (controller as any).clearHighlights) {
              (controller as any).clearHighlights();
            } else if (window.__graphApi && window.__graphApi.clearHighlights) {
              window.__graphApi.clearHighlights();
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error("clearLocalQueryParam failed:", err);
    }
  }
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
          try {
            clearLocalQueryParam();
          } catch {}
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
        clearLocalQueryParam();
      } catch {}
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
        try {
          clearLocalQueryParam();
        } catch {}
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
          // Prefer the highlighted group API which accepts domain string. If available, call highlightNodesByDomain
          if (controller && (controller as any).highlightNodesByDomain) {
            (controller as any).highlightNodesByDomain(local);
            if (controller && (controller as any).focusByDomain) {
              (controller as any).focusByDomain(local);
            }
          } else if (
            window.__graphApi &&
            window.__graphApi.highlightNodesByDomain
          ) {
            window.__graphApi.highlightNodesByDomain(local);
            if (window.__graphApi.focusByDomain)
              window.__graphApi.focusByDomain(local);
          } else if (controller && (controller as any).focusByDomain) {
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
