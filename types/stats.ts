import type { summarizeTopology } from "../src/utils/graph-statistics";

/** Public response from /stats.json, shared with the statistics panel. */
export type StatsData = ReturnType<typeof summarizeTopology> & {
  sixDegrees: {
    totalNodes: number;
    mainComponentSize: number;
    componentCount: number;
    isolatedCount: number;
    compSizeDistribution: Array<{ label: string; count: number }>;
    maxEdgeDistance: number;
    maxIntermediateVertices: number;
    avgPathLength: number;
    edgeDistanceDistribution: Record<number, number>;
    intermediateVertexDistribution: Record<number, number>;
    totalPairsConsidered: number;
  };
};
