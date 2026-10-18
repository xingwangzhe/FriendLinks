import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { loadSiteCollection } from "../src/utils/site-collection";
import { buildTopology } from "../src/utils/graph-topology";

// This exports topology and initial coordinates only: no simulation or all-pairs BFS.
const output = path.resolve(process.argv[2] || "/tmp/friendlinks-build-bench-20261018/fixture.json");
const started = performance.now();
const sites = await loadSiteCollection("links", Infinity);
const topology = buildTopology(sites);
const nodes = topology.nodes;
const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]));
const linksFlat = topology.links.flatMap((link) => [nodeIndex.get(link.source)!, nodeIndex.get(link.target)!]);
const state = new Array<number>(nodes.length * 6 + 1).fill(0);
const rollAngle = Math.PI * (3 - Math.sqrt(5));
const yawAngle = (Math.PI * 20) / (9 + Math.sqrt(221));
for (let i = 0; i < nodes.length; i++) {
  const radius = 10 * Math.cbrt(0.5 + i);
  state[i * 6] = radius * Math.sin(i * rollAngle) * Math.cos(i * yawAngle);
  state[i * 6 + 1] = radius * Math.cos(i * rollAngle);
  state[i * 6 + 2] = radius * Math.sin(i * rollAngle) * Math.sin(i * yawAngle);
}
state[state.length - 1] = 1;
const fixture = {
  schemaVersion: 1,
  siteCount: sites.length,
  nodeCount: nodes.length,
  edgeCount: topology.links.length,
  nodeIds: nodes.map((node) => node.id),
  adjFlat: Array.from(topology.csrAdj),
  offsets: Array.from(topology.csrOffsets),
  linksFlat,
  initialState: state,
  options: {
    repulsion: 30000,
    linkDistance: 500,
    centerStrength: 0.015,
    theta: 0.8,
    velocityDecay: 0.1,
    alphaDecay: 0.02,
    algorithm: "fast",
  },
};
const text = JSON.stringify(fixture);
await mkdir(path.dirname(output), { recursive: true });
await Bun.write(output, text);
console.log(
  JSON.stringify({
    output,
    sites: sites.length,
    nodes: nodes.length,
    edges: topology.links.length,
    sha256: createHash("sha256").update(text).digest("hex"),
    elapsedMs: performance.now() - started,
  }),
);
