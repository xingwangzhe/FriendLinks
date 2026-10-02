export type { Site } from "./site";
export type Friend = import("./site").Site["friends"][number];

export type GraphNode = {
  id: string;
  name: string;
  url: string;
  favicon?: string;
  desc?: string;
  color?: string;
  x?: number;
  y?: number;
  z?: number;
};
export type GraphLink = { source: string; target: string; symbol?: string[] };
export type GraphCategory = { name: string };
export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
  categories: GraphCategory[];
  adjacency: Record<string, { neighbors: string[] }>;
  bezier?: { lseg: number[]; lpx: number[]; lpy: number[]; lpz: number[] } | null;
};
