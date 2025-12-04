import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { TooltipComponent, TitleComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { GraphData } from "../../types/graph";

echarts.use([GraphChart, TooltipComponent, TitleComponent, CanvasRenderer]);

// 类型统一从 types/graph.ts 引入

export function init(data: GraphData) {
  const el = document.getElementById("main");
  if (!el) return;
  const chart = echarts.init(el);

  const option: echarts.EChartsCoreOption = {
    title: { text: "友链关系图" },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const d = params?.data || {};
        const name = d.name || "";
        const url = d.value || "";
        const desc = d.desc;
        const lines = [
          `<strong>${name}</strong>`,
          desc ? `<div style="max-width:320px;color:#666">${desc}</div>` : "",
          url ? `<div style="color:#888">${url}</div>` : "",
        ].filter(Boolean);
        return lines.join("");
      },
    },
    // 不展示分类图例
    series: [
      {
        id: "main-graph",
        type: "graph",
        layout: "force",
        roam: true,
        draggable: true,
        label: { show: true, position: "right" },
        force: { repulsion: 150, edgeLength: 80 },
        focusNodeAdjacency: true,
        emphasis: {
          focus: "adjacency",
          lineStyle: { opacity: 1, width: 2 },
          itemStyle: { opacity: 1 },
        },
        blur: {
          lineStyle: { opacity: 0.1 },
          itemStyle: { opacity: 0.2 },
        },
        // 不使用分类，统一样式
        data: data.nodes.map((n) => ({
          id: n.id,
          name: n.name,
          // 不再使用分类字段
          value: n.url,
          desc: (n as any).desc,
          // 初始显示为圆形占位符，图标由并发加载队列按需替换
          symbol: "circle",
          symbolSize: 28,
        })),
        links: data.links,
        lineStyle: { color: "#aaa" },
        itemStyle: { color: "#5470C6" },
      },
    ],
  };

  chart.setOption(option);

  // ======= 优化：有控制的并发加载图标（favicon） =======
  // 避免同时发起过多请求，防止浏览器/API 限流
  const CONCURRENCY = 6; // 可根据需要调整
  const CACHE_KEY = "faviconLoadCache_v1";
  const cacheRaw = localStorage.getItem(CACHE_KEY);
  const faviconLoadCache: Record<string, { ok: boolean; ts: number }> = cacheRaw
    ? JSON.parse(cacheRaw)
    : {};

  function saveCache() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(faviconLoadCache));
    } catch {
      // ignore storage write errors
    }
  }

  function loadImage(url: string) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("img load error"));
      img.src = url;
    });
  }

  async function attemptLoadImage(
    url: string,
    retries = 2,
    delayMs = 250
  ): Promise<void> {
    for (let i = 0; i <= retries; i++) {
      try {
        await loadImage(url);
        return;
      } catch {
        if (i === retries) throw new Error(`load fail ${url}`);
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
      }
    }
  }

  function createQueue(limit: number) {
    const q: Array<() => Promise<void>> = [];
    let running = 0;
    async function next() {
      if (running >= limit || q.length === 0) return;
      const task = q.shift()!;
      running++;
      try {
        await task();
      } catch {
        // swallow error for single task
      }
      running--;
      next();
    }
    return function enqueue(task: () => Promise<void>) {
      q.push(task);
      next();
    };
  }

  const enqueue = createQueue(CONCURRENCY);
  // 批量更新到 ECharts，减少频繁 setOption
  const updateMap = new Map<string, string>();
  let flushTimer: number | undefined;
  function scheduleFlush() {
    if (flushTimer != null) return;
    flushTimer = window.setTimeout(() => {
      const updates: any[] = [];
      updateMap.forEach((symbol, id) => {
        const raw = idToRaw[id] || {};
        updates.push({
          id,
          symbol,
          name: raw.name,
          value: raw.value,
          desc: raw.desc,
        });
      });
      if (updates.length) {
        chart.setOption({
          series: [
            {
              id: "main-graph",
              data: updates,
            },
          ],
        });
      }
      updateMap.clear();
      flushTimer = undefined;
    }, 250);
  }

  // 加载所有节点的 favicon（仅对具有 favicon 字段的节点）
  const nodes = data.nodes;
  // 建立 id -> 原始节点数据映射（用于在局部更新时保留 name/value/desc 等字段，避免丢失 tooltip 信息）
  const idToRaw: Record<
    string,
    { name?: string; value?: string; desc?: string }
  > = {};
  nodes.forEach((n) => {
    idToRaw[n.id] = {
      name: n.name,
      value: (n as any).url || (n as any).value,
      desc: (n as any).desc,
    };
  });
  for (const n of nodes) {
    if (!n.favicon) continue;
    const url = n.favicon;
    // 如果已在 cache 且成功过，直接设置符号
    const localFallback = "/StreamlinePlumpColorWebFlat.svg";
    if (faviconLoadCache[url]?.ok) {
      updateMap.set(n.id, `image://${url}`);
      scheduleFlush();
      continue;
    }

    // 如果缓存中标记为失败，直接使用本地图标避免重复请求
    if (faviconLoadCache[url]?.ok === false) {
      updateMap.set(n.id, `image://${localFallback}`);
      scheduleFlush();
      continue;
    }

    enqueue(async () => {
      try {
        await attemptLoadImage(url);
        faviconLoadCache[url] = { ok: true, ts: Date.now() };
        saveCache();
        updateMap.set(n.id, `image://${url}`);
        scheduleFlush();
      } catch {
        // 失败则记缓存并用本地图标替换圆形
        faviconLoadCache[url] = { ok: false, ts: Date.now() };
        saveCache();
        updateMap.set(n.id, `image://${localFallback}`);
        scheduleFlush();
      }
    });
  }

  // 亮暗切换：通过按钮切换色板与背景
  const btn = document.getElementById("theme-toggle");
  let isDark = false;
  const lightColor = "#5470C6";
  const darkColor = "#9aa4ff";
  const lightBg = "#ffffff";
  const darkBg = "#0f1115";

  function applyTheme() {
    const nodeColor = isDark ? darkColor : lightColor;
    const backgroundColor = isDark ? darkBg : lightBg;
    chart.setOption({
      backgroundColor,
      series: [
        {
          id: "main-graph",
          itemStyle: { color: nodeColor },
          lineStyle: { color: isDark ? "#888" : "#aaa" },
          emphasis: {
            lineStyle: { opacity: 1, width: 2 },
            itemStyle: { opacity: 1 },
          },
          blur: { lineStyle: { opacity: 0.1 }, itemStyle: { opacity: 0.2 } },
        },
      ],
    });
  }

  btn?.addEventListener("click", () => {
    isDark = !isDark;
    applyTheme();
  });
  // 初始化按系统偏好设置
  isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme();

  // 使用 ECharts 内置的相邻高亮机制，避免重载/抖动
  // focusNodeAdjacency 已开启，无需手动过滤和 setOption

  chart.on("click", (params: any) => {
    const url = params?.data?.value as string | undefined;
    if (url) window.open(url, "_blank");
  });

  window.addEventListener("resize", () => chart.resize());
}

export async function initFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const data = (await res.json()) as GraphData;
  init(data);
}
