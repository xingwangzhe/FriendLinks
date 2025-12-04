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
          symbol: n.favicon ? `image://${n.favicon}` : "circle",
          symbolSize: 28,
        })),
        links: data.links,
        lineStyle: { color: "#aaa" },
        itemStyle: { color: "#5470C6" },
      },
    ],
  };

  chart.setOption(option);

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
