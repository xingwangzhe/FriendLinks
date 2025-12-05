import { initFromUrl } from "./graph.ts";

(async () => {
  await initFromUrl("/graph.json");

  const input = document.getElementById("graph-search");
  const results = document.getElementById("graph-search-results");
  function render(list) {
    if (!results) return;
    results.innerHTML = "";
    if (!list.length) {
      results.style.display = "none";
      return;
    }
    for (const it of list) {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `<div style="font-weight:600">${it.name}</div><div style="font-size:12px;color:var(--muted,#666)">${it.url}</div>`;
      el.onclick = () => {
        try {
          if (window.__graphApi && window.__graphApi.focusNodeById) {
            window.__graphApi.focusNodeById(it.id);
          }
        } catch (e) {
          console.error(e);
        }
        results.style.display = "none";
      };
      results.appendChild(el);
    }
    results.style.display = "block";
  }

  if (input) {
    input.addEventListener("input", (ev) => {
      const v = ev.target && ev.target.value ? ev.target.value.trim() : "";
      if (!v) {
        render([]);
        return;
      }
      try {
        const list =
          window.__graphApi && window.__graphApi.find
            ? window.__graphApi.find(v)
            : [];
        render(list.slice(0, 12));
      } catch (e) {
        console.error(e);
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
          if (window.__graphApi && window.__graphApi.focusByDomain) {
            window.__graphApi.focusByDomain(local);
          }
        } catch (e) {
          console.error(e);
        }
      }, 600);
    }
  } catch (e) {}
})();
