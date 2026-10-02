import type { Site } from "../../types/site";
import { buildTopology } from "./graph-topology";
import { getCollectionInfo } from "./site-identity";

/** Lightweight topology statistics: no simulation or all-pairs BFS. */
export function summarizeTopology(sites: Site[]) {
  const topology = buildTopology(sites);
  const { counts } = getCollectionInfo(sites);
  const coreToCore = { total: 0, bidirectional: 0, unidirectional: 0 };
  let coreToFriend = 0;
  for (const link of topology.links) {
    if (topology.coreIds.has(link.source) && topology.coreIds.has(link.target)) {
      coreToCore.total++;
      if (link.symbol) coreToCore.unidirectional++;
      else coreToCore.bidirectional++;
    } else coreToFriend++;
  }
  const incoming = new Map<string, number>();
  for (const targets of topology.directed.values())
    for (const target of targets) incoming.set(target, (incoming.get(target) ?? 0) + 1);
  const coreDegrees = sites.map((s) => ({
    name: s.name,
    url: s.url,
    inDegree: incoming.get(s.url) ?? 0,
    outDegree: topology.directed.get(s.url)?.size ?? 0,
  }));
  const routes = new Map<string, number>();
  for (const site of sites) routes.set(site.links, (routes.get(site.links) ?? 0) + 1);
  return {
    coreNodes: { count: sites.length },
    friendNodes: { count: topology.nodes.length - sites.length },
    connections: { coreToCore, coreToFriend, total: topology.links.length },
    overview: { totalNodes: topology.nodes.length, totalConnections: topology.links.length },
    totalFriendReferences: sites.reduce((n, s) => n + s.friends.length, 0),
    sourceRecords: counts,
    topLinked: [...coreDegrees].sort((a, b) => b.inDegree - a.inDegree).slice(0, 10),
    topLinking: [...coreDegrees].sort((a, b) => b.outDegree - a.outDegree).slice(0, 10),
    linkRoutes: [...routes].sort(([, a], [, b]) => b - a).map(([route, count]) => ({ route, count })),
  };
}
