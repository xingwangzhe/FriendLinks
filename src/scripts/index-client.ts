type SearchResult = { id: string; name: string; url?: string };

(async () => {
  // ── 首屏加载蒙版 ──────────────────────────────────────────────
  const loadingEl = document.getElementById("loading-overlay");
  const textEl = document.getElementById("loading-text");
  const timeEl = document.getElementById("loading-time");
  const barEl = document.getElementById("loading-bar");

  const startTime = Date.now();
  let timer: ReturnType<typeof setInterval> | null = null;
  function updateTime() {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    if (timeEl) timeEl.textContent = `${elapsed}s`;
  }

  // 动态导入 3D 图模块，实现代码分割
  if (textEl) textEl.textContent = "加载模块中...";
  timer = setInterval(updateTime, 100);

  const { init3dFromUrl } = await import("./graph3d/index");

  if (textEl) textEl.textContent = "下载图数据中...";
  if (barEl) barEl.style.width = "30%";

  const controller = await init3dFromUrl("/graph.bin");

  if (textEl) textEl.textContent = "渲染 3D 场景中...";
  if (barEl) barEl.style.width = "70%";

  // 等待至少两帧让 Three.js 完成首屏渲染
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));

  if (barEl) barEl.style.width = "100%";
  updateTime();

  // 淡出蒙版
  if (timer) clearInterval(timer);
  setTimeout(() => {
    if (loadingEl) loadingEl.classList.add("hidden");
  }, 400);

  const input = document.getElementById("graph-search") as HTMLInputElement | null;
  const results = document.getElementById("graph-search-results");
  const clearBtn = document.getElementById("graph-search-clear") as HTMLButtonElement | null;
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
            } else if ((window as any).__graphApi?.clearAllHighlights) {
              (window as any).__graphApi.clearAllHighlights();
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
      }</div><div style="font-size:12px;color:var(--muted,#666)">${it.url ?? ""}</div>`;
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
          } else if (window.__graphApi && window.__graphApi.highlightNodesAndNeighbors) {
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
    let searchTimer: ReturnType<typeof setTimeout> | null = null;
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
        if (searchTimer) {
          clearTimeout(searchTimer);
          searchTimer = null;
        }
        render([]);
        return;
      }
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        searchTimer = null;
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
      }, 150);
    });
  }

  // Clear button interaction
  if (clearBtn && input) {
    // initial state
    try {
      clearBtn.style.display = input.value && input.value.trim() ? "flex" : "none";
      clearBtn.setAttribute("aria-hidden", clearBtn.style.display === "none" ? "true" : "false");
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
          } else if (window.__graphApi && window.__graphApi.highlightNodesByDomain) {
            window.__graphApi.highlightNodesByDomain(local);
            if (window.__graphApi.focusByDomain) window.__graphApi.focusByDomain(local);
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

// 移动端菜单切换
const menuToggle = document.getElementById("menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const group = document.querySelector(".top-buttons-group");
    if (group) {
      group.classList.toggle("open");
    }
  });
  // 点击菜单外关闭
  document.addEventListener("click", (e) => {
    const group = document.querySelector(".top-buttons-group");
    if (group && group.classList.contains("open") && !(e.target as HTMLElement).closest(".top-buttons")) {
      group.classList.remove("open");
    }
  });
}

export {};
