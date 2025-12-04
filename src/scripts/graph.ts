import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import {
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  GraphChart,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
]);

type Node = { id: string; name: string; category: number; url: string };
type Link = { source: string; target: string };
type Category = { name: string };
type GraphData = {
  nodes: Node[];
  links: Link[];
  categories: Category[];
  adjacency: Record<string, { neighbors: string[] }>;
};

export function init(data: GraphData) {
  const el = document.getElementById("main");
  if (!el) return;
  const chart = echarts.init(el);

  const option: echarts.EChartsCoreOption = {
    title: { text: "友链关系图" },
    tooltip: { trigger: "item" },
    legend: [{ data: data.categories.map((c) => c.name) }],
    series: [
      {
        id: "main-graph",
        type: "graph",
        layout: "force",
        roam: true,
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
        categories: data.categories,
        data: data.nodes.map((n) => ({
          id: n.id,
          name: n.name,
          category: n.category,
          value: n.url,
        })),
        links: data.links,
        lineStyle: { color: "#aaa" },
      },
    ],
  };

  chart.setOption(option);

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
