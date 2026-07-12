type SearchResult = { id: string; name: string; url?: string };

(async () => {
  // ── 首屏加载蒙版 ──────────────────────────────────────────────
  const loadingEl = document.getElementById("loading-overlay");
  const textEl = document.getElementById("loading-text");
  const timeEl = document.getElementById("loading-time");
  const barEl = document.getElementById("loading-bar");
  const FETCH_TIMEOUT = 20000;

  const startTime = Date.now();
  let timer: ReturnType<typeof setInterval> | null = null;
  function updateTime() {
    const ms = Date.now() - startTime;
    if (timeEl) timeEl.textContent = `${Math.floor(ms / 1000)}s ${ms % 1000}ms`;
  }

  let controller: any = null;

  function showError(msg: string) {
    if (timer) clearInterval(timer);
    if (textEl) textEl.textContent = msg;
    if (timeEl) timeEl.textContent = "";
    if (barEl) barEl.style.width = "0%";
    let retryBtn = document.getElementById("loading-retry") as HTMLElement | null;
    if (!retryBtn) {
      retryBtn = document.createElement("button");
      retryBtn.id = "loading-retry";
      retryBtn.textContent = "重试";
      retryBtn.style.cssText =
        "margin-top:12px;padding:8px 24px;border:1px solid #4a9eff;border-radius:6px;" +
        "background:transparent;color:#4a9eff;cursor:pointer;font-size:14px;";
      retryBtn.addEventListener("click", () => {
        retryBtn?.remove();
        if (barEl) barEl.style.width = "0%";
        controller = null;
        startLoading();
      });
      loadingEl?.appendChild(retryBtn);
    }
  }

  async function startLoading() {
    if (textEl) textEl.textContent = "加载模块中...";
    timer = setInterval(updateTime, 50);

    try {
      const abort = new AbortController();
      const timeoutId = setTimeout(() => abort.abort(), FETCH_TIMEOUT);

      // 并行加载 Three.js 模块和下载图数据
      const modPromise = import("./graph3d/index");
      const timestamps = (window as any).__BIN_TIMESTAMPS;
      const coreUrl = timestamps ? `/graph-core.${timestamps.core}.bin` : "/graph-core.bin";
      const fetchPromise = fetch(coreUrl, { signal: abort.signal }).then((r) => {
        if (!r.ok) throw new Error(`获取图数据失败: ${r.status}`);
        return r.arrayBuffer();
      });

      const [mod, coreBuf] = await Promise.all([modPromise, fetchPromise]);
      clearTimeout(timeoutId);

      if (textEl) textEl.textContent = "下载图数据中...";
      if (barEl) barEl.style.width = "30%";

      // 解码数据
      const { init3d, maybeDecompress, expandCompact } = mod;
      const { decode } = await import("msgpackr");
      const coreRaw = await maybeDecompress(new Uint8Array(coreBuf));
      const core = decode(coreRaw);
      const data = core.nid ? expandCompact(core) : core;

      // 初始不加载 bezier.bin，首次交互时懒加载
      controller = init3d(data);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        showError("下载超时，请检查网络后重试");
      } else {
        showError(`加载失败: ${err?.message || "未知错误"}`);
      }
      return;
    }

    if (textEl) textEl.textContent = "渲染 3D 场景中...";
    if (barEl) barEl.style.width = "70%";

    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    if (barEl) barEl.style.width = "100%";
    updateTime();

    if (timer) clearInterval(timer);
    setTimeout(() => {
      if (loadingEl) loadingEl.classList.add("hidden");
    }, 400);
  }

  await startLoading();

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
      }</div><div style="font-size:12px;color:var(--text-color,#e6eef8)">${it.url ?? ""}</div>`;
      el.onclick = () => {
        try {
          try {
            clearLocalQueryParam();
          } catch {}
          // 统一聚焦：先清除旧状态再聚焦
          const focus = (controller as any).focusNode || (window as any).__graphApi?.focusNode;
          if (focus) {
            focus(it.id);
          } else if ((controller as any).focusNodeById) {
            (controller as any).focusNodeById(it.id);
          } else if ((window as any).__graphApi?.focusNodeById) {
            (window as any).__graphApi.focusNodeById(it.id);
          }
          // 聚焦后再高亮邻居
          if (controller && (controller as any).highlightNodesAndNeighbors) {
            (controller as any).highlightNodesAndNeighbors([it.id]);
          } else if (window.__graphApi && window.__graphApi.highlightNodesAndNeighbors) {
            window.__graphApi.highlightNodesAndNeighbors([it.id]);
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
      searchTimer = setTimeout(async () => {
        searchTimer = null;
        try {
          clearLocalQueryParam();
        } catch {}
        try {
          let list: SearchResult[] = [];
          if (controller && (controller as any).find) {
            list = (controller as any).find(v);
          } else if (window.__graphApi && window.__graphApi.find) {
            list = window.__graphApi.find(v);
          }
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

  // 随机博客按钮
  const randomBtn = document.getElementById("btn-random");
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      try {
        const data = (controller as any).getGraphData?.() || (window as any).__graphApi?.getGraphData?.();
        const nodes = data?.nodes;
        if (nodes && nodes.length > 0) {
          const idx = Math.floor(Math.random() * nodes.length);
          const node = nodes[idx];
          if (node?.id) {
            const focus = (controller as any).focusNode || (window as any).__graphApi?.focusNode;
            if (focus) {
              focus(node.id);
            }
          }
        }
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
