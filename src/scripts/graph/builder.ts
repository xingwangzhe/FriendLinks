import Graph from "graphology";
import type { GraphData } from "../../../types/graph";
import { PALETTE, hashToIndex, degreeToSize } from "./utils";

/**
 * The result returned from buildGraphFromData.
 */
export type BuildResult = {
  g: Graph;
  degreeMap: Record<string, number>;
  originalColors: Map<string, string>;
  maxDegree: number;
};

/**
 * Build a graphology Graph from GraphData.
 *
 * Responsibilities:
 * - Compute node degrees (degreeMap) and maxDegree
 * - Place nodes with a simple radial initial placement (so layout has a reasonable start)
 * - Assign visual attributes: label, url, desc, x, y, size, color, baseColor
 * - Add edges (ignoring invalid/duplicate edges)
 *
 * Note: This function is pure in the sense it only mutates the returned Graph instance.
 */
export function buildGraphFromData(data: GraphData): BuildResult {
  const g = new Graph();
  const nodes = data.nodes || [];
  const links = (data as any).links || [];

  const originalColors: Map<string, string> = new Map();
  const degreeMap: Record<string, number> = {};

  // Count degrees
  for (const l of links) {
    const s = l.source ?? l[0];
    const t = l.target ?? l[1];
    if (s) degreeMap[s] = (degreeMap[s] || 0) + 1;
    if (t) degreeMap[t] = (degreeMap[t] || 0) + 1;
  }

  const degreeValues = Object.values(degreeMap);
  const maxDegree = degreeValues.length ? Math.max(...degreeValues) : 1;

  // Add nodes with an initial radial placement
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const id = n.id;
    const deg = degreeMap[id] || 0;

    // simple radial placement with slight jitter
    const angle = (i / Math.max(1, nodes.length)) * Math.PI * 2;
    const radius =
      100 + (1 - Math.min(1, Math.sqrt(deg) / Math.sqrt(maxDegree))) * 400;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 10;
    const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 10;

    const baseColor = PALETTE[hashToIndex(id)];
    // 如果已有相同 id 的节点，说明输入数据存在重复，跳过以避免抛错
    if ((g as any).hasNode && (g as any).hasNode(id)) {
      try {
        const existingAttrs = (g as any).getNodeAttributes
          ? (g as any).getNodeAttributes(id)
          : null;
        originalColors.set(
          id,
          (existingAttrs && existingAttrs.baseColor) || baseColor
        );
      } catch {
        originalColors.set(id, baseColor);
      }
      continue;
    }

    // Add node with attributes expected by renderer
    g.addNode(id, {
      label: n.name,
      url: n.url,
      desc: (n as any).desc,
      x,
      y,
      size: degreeToSize(deg, maxDegree),
      color: baseColor,
      baseColor,
    });

    originalColors.set(id, baseColor);
  }

  // Add edges (silently ignore invalid/duplicate edges)
  for (const l of links) {
    const s = l.source ?? l[0];
    const t = l.target ?? l[1];
    if (!s || !t) continue;
    try {
      g.addEdge(s.toString(), t.toString());
    } catch {
      // ignore errors (e.g., duplicate edges or invalid nodes)
    }
  }

  return { g, degreeMap, originalColors, maxDegree };
}
