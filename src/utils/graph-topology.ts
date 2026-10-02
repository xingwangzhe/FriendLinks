import type { Site } from "../../types/site";
import type { GraphNode, GraphLink } from "../../types/graph";
import { getCollectionInfo } from "./site-identity";

export interface GraphTopology {
  nodes: GraphNode[];
  links: GraphLink[];
  coreIds: Set<string>;
  directed: Map<string, Set<string>>;
  adjacency: Map<string, Set<string>>;
  csrAdj: number[];
  csrOffsets: number[];
}
let cache = new WeakMap<Site[], GraphTopology>();
export function clearTopologyCache() {
  cache = new WeakMap();
}
export function buildTopology(sites: Site[]): GraphTopology {
  const cached = cache.get(sites);
  if (cached) return cached;
  const { identity } = getCollectionInfo(sites);
  const coreIds = new Set(sites.map((s) => s.url));
  const nodeMap = new Map<string, GraphNode>();
  const directed = new Map<string, Set<string>>();
  for (const site of sites) {
    nodeMap.set(site.url, {
      id: site.url,
      name: site.name,
      url: site.url,
      desc: site.description,
      ...(site.favicon ? { favicon: site.favicon } : {}),
      ...(site.color ? { color: site.color } : {}),
    });
    directed.set(site.url, new Set());
  }
  for (const site of sites)
    for (const friend of site.friends) {
      const id = identity.targetId(friend.url);
      if (id === site.url) continue;
      if (!nodeMap.has(id))
        nodeMap.set(id, {
          id,
          name: friend.name,
          url: identity.resolve(friend.url) ?? friend.url,
          ...(friend.favicon ? { favicon: friend.favicon } : {}),
        });
      directed.get(site.url)!.add(id);
    }
  const links: GraphLink[] = [];
  const seen = new Set<string>();
  const adjacency = new Map([...nodeMap.keys()].map((id) => [id, new Set<string>()]));
  for (const [source, targets] of directed)
    for (const target of targets) {
      const pair = JSON.stringify([source, target].sort());
      if (seen.has(pair)) continue;
      seen.add(pair);
      const bidirectional = directed.get(target)?.has(source);
      links.push({ source, target, ...(bidirectional ? {} : { symbol: ["none", "arrow"] }) });
      adjacency.get(source)!.add(target);
      adjacency.get(target)!.add(source);
    }
  const nodes = [...nodeMap.values()];
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const csrAdj: number[] = [];
  const csrOffsets: number[] = [];
  for (const node of nodes) {
    csrOffsets.push(csrAdj.length);
    for (const neighbor of adjacency.get(node.id)!) csrAdj.push(index.get(neighbor)!);
  }
  csrOffsets.push(csrAdj.length);
  const result = { nodes, links, coreIds, directed, adjacency, csrAdj, csrOffsets };
  cache.set(sites, result);
  return result;
}
