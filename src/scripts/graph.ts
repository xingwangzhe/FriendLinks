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
        force: { repulsion: 750, edgeLength: 240 },
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
  // 选择对比稳定、与背景无关的 12 色（避免纯黑/白及极浅色）
  const PALETTE = [
    "#E69F00",
    "#56B4E9",
    "#009E73",
    "#0072B2",
    "#D55E00",
    "#CC79A7",
    "#8C564B",
    "#E377C2",
    "#7F7F7F",
    "#17BECF",
    "#4E79A7",
    "#B1C94E",
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

  // 改善拖拽体验：在画布上显示抓手光标并在按下时切换为抓握
  try {
    const zr = chart.getZr();
    zr.on("mousedown", (_e: any) => {
      // 只有在空白区域或画布上按下时切换为抓握（避免影响节点拖动视觉）
      (el as HTMLElement).style.cursor = "grabbing";
    });
    zr.on("mouseup", (_e: any) => {
      (el as HTMLElement).style.cursor = "grab";
    });
    zr.on("globalout", () => {
      (el as HTMLElement).style.cursor = "default";
    });
  } catch {
    // 若 getZr 不可用则忽略
  }

  // 亮暗切换：通过按钮切换色板与背景
  const btn = document.getElementById("theme-toggle");
  let isDark = false;
  const lightBg = "#ffffff";
  const darkBg = "#0f1115";

  function applyTheme() {
    const backgroundColor = isDark ? darkBg : lightBg;
    chart.setOption({
      backgroundColor,
      series: [
        {
          id: "main-graph",
          // 不覆盖节点的 itemStyle.color，保留基于 PALETTE 的颜色映射
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

  // 暴露搜索与聚焦 API 到全局，供页面顶部搜索框调用
  function find(query: string) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    const out: Array<any> = [];
    for (const n of nodes) {
      const name = (n.name || "").toString().toLowerCase();
      const url = ((n as any).url || (n as any).value || "")
        .toString()
        .toLowerCase();
      let hostname = "";
      try {
        hostname = new URL(url).hostname;
      } catch {
        hostname = "";
      }
      if (
        name.includes(q) ||
        url.includes(q) ||
        hostname.includes(q) ||
        n.id.includes(q)
      ) {
        out.push({
          id: n.id,
          name: n.name,
          url: (n as any).url || (n as any).value,
          desc: (n as any).desc,
        });
      }
    }
    return out;
  }

  function getNodeLayout(id: string) {
    try {
      const seriesModel =
        (chart.getModel &&
          (chart.getModel() as any).getSeriesByIndex &&
          (chart.getModel() as any).getSeriesByIndex(0)) ||
        null;
      const graph =
        seriesModel &&
        (seriesModel.getGraph
          ? seriesModel.getGraph()
          : seriesModel.graph || null);
      const node = graph && (graph.getNodeById ? graph.getNodeById(id) : null);
      if (node && node.getLayout) return node.getLayout();
    } catch {}
    // fallback to saved positions
    const r = idToRaw[id];
    if (r && r.x != null && r.y != null) return [r.x, r.y];
    return null;
  }

  function focusNodeById(id: string, zoom = 1.4) {
    try {
      const layout = getNodeLayout(id);
      if (!layout) return;
      const zr = chart.getZr && chart.getZr();
      let pixel: any = null;
      try {
        pixel = chart.convertToPixel
          ? chart.convertToPixel({ seriesIndex: 0 }, layout as any)
          : null;
      } catch {}
      const elRect = (el as HTMLElement).getBoundingClientRect();
      if (!pixel) {
        // fallback：根据布局尝试估算
        pixel = [
          elRect.width / 2 + (layout[0] || 0) * 0.001,
          elRect.height / 2 + (layout[1] || 0) * 0.001,
        ];
      }

      try {
        const vp =
          zr &&
          zr.painter &&
          zr.painter.getViewportRoot &&
          zr.painter.getViewportRoot();
        if (vp) {
          const cx = elRect.width / 2;
          const cy = elRect.height / 2;
          const curPos = vp.position || [0, 0];
          const dx = cx - pixel[0];
          const dy = cy - pixel[1];
          vp.position = [(curPos[0] || 0) + dx, (curPos[1] || 0) + dy];
          // set scale if API available
          try {
            if (typeof zoom === "number" && zoom > 0) {
              vp.scale = zoom;
              vp.scaleX = zoom;
              vp.scaleY = zoom;
            }
          } catch {}
          if (zr && zr.refresh) {
            zr.refresh();
          }
        }
      } catch {
        // ignore viewport failures
      }

      // 高亮目标节点（视觉提示）
      try {
        const seriesOpt =
          (chart.getOption && (chart.getOption().series || [])) || [];
        const data = (seriesOpt[0] && seriesOpt[0].data) || [];
        const dataIndex = data.findIndex((d: any) => d && d.id === id);
        if (dataIndex >= 0 && chart.dispatchAction) {
          chart.dispatchAction({
            type: "highlight",
            seriesId: "main-graph",
            dataIndex,
          });
          setTimeout(
            () =>
              chart.dispatchAction &&
              chart.dispatchAction({
                type: "downplay",
                seriesId: "main-graph",
                dataIndex,
              }),
            3000
          );
        }
      } catch {}
    } catch (e) {
      console.error(e);
    }
  }

  function focusByDomain(u: string) {
    try {
      let host = u || "";
      try {
        host = new URL(u).hostname;
      } catch {
        /* maybe user passed hostname */
      }
      host = (host || u || "").toLowerCase();
      if (!host) return;
      // 尝试匹配 url 或 id
      for (const n of nodes) {
        const url = ((n as any).url || (n as any).value || "")
          .toString()
          .toLowerCase();
        let hostname = "";
        try {
          hostname = new URL(url).hostname;
        } catch {}
        if (hostname === host || url.includes(host) || n.id === host) {
          focusNodeById(n.id);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // attach to window for external use
  try {
    (window as any).__graphApi = (window as any).__graphApi || {};
    (window as any).__graphApi.find = find;
    (window as any).__graphApi.focusNodeById = focusNodeById;
    (window as any).__graphApi.focusByDomain = focusByDomain;
  } catch {}
}

export async function initFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`获取图数据失败: ${res.status}`);
  const data = (await res.json()) as GraphData;
  init(data);
}
