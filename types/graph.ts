export type Friend = { name: string; url: string; favicon?: string };
export type Site = {
  name: string;
  description: string;
  url: string;
  favicon?: string;
  friends: Friend[];
};

export type GraphNode = {
  id: string;
  name: string;
  url: string;
  favicon?: string;
  desc?: string;
};
export type GraphLink = { source: string; target: string; symbol?: string[] };
export type GraphCategory = { name: string };
export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
  categories: GraphCategory[];
  adjacency: Record<string, { neighbors: string[] }>;
};
