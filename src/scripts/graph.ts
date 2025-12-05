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
        force: { repulsion: 150, edgeLength: 240 },
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

  // ======= 改为使用色盲友好的 12 色调色板，完全放弃网站图标 =======
  // 使用稳定哈希将节点映射到 12 色中的一种，保证颜色在刷新间稳定
  const PALETTE = [
    "#E69F00",
    "#56B4E9",
    "#009E73",
    "#F0E442",
    "#0072B2",
    "#D55E00",
    "#CC79A7",
    "#000000",
    "#8C564B",
    "#E377C2",
    "#7F7F7F",
    "#17BECF",
  ];

  function hashToIndex(s: string) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h % PALETTE.length;
  }

  const nodes = data.nodes;
  // 建立 id -> 原始节点数据映射并在后续读取位置
  const idToRaw: Record<string, any> = {};
  nodes.forEach((n) => {
    idToRaw[n.id] = {
      name: n.name,
      value: (n as any).url || (n as any).value,
      desc: (n as any).desc,
      x: undefined,
      y: undefined,
    };
  });

  // 读取图表中已计算的位置，保存在 idToRaw 以便后续局部更新不触发重布局
  try {
    const current = chart.getOption();
    const seriesData =
      ((current.series as any[]) || []).find((s) => s && s.id === "main-graph")
        ?.data || [];
    for (const d of seriesData) {
      if (d && d.id && (d.x != null || d.y != null)) {
        idToRaw[d.id] = Object.assign(idToRaw[d.id] || {}, { x: d.x, y: d.y });
      }
    }
  } catch {
    // ignore if getOption not available
  }

  // 批量用颜色替换节点（不使用图标），保留位置以避免触发重布局
  const colorUpdates: any[] = nodes.map((n) => {
    const raw = idToRaw[n.id] || {};
    const color = PALETTE[hashToIndex(n.id)];
    const item: any = {
      id: n.id,
      name: raw.name,
      value: raw.value,
      desc: raw.desc,
      symbol: "circle",
      symbolSize: 28,
      itemStyle: { color },
    };
    if (raw.x != null && raw.y != null) {
      item.x = raw.x;
      item.y = raw.y;
      item.fixed = true;
    }
    return item;
  });

  chart.setOption({
    series: [
      {
        id: "main-graph",
        data: colorUpdates,
      },
    ],
  });

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
