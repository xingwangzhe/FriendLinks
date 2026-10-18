import { describe, expect, test } from "bun:test";
import { findShortestPath } from "./pathfinder";

/** Previous implementation, retained only for small randomized differential cases. */
function reference(neighborMap: Map<string, Set<string>>, from: string, to: string): string[] | null {
  if (from === to) return [from];
  const visited = new Set([from]);
  const parent = new Map<string, string>();
  const queue = [from];
  while (queue.length) {
    const current = queue.shift()!;
    for (const neighbor of neighborMap.get(current) ?? []) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      parent.set(neighbor, current);
      if (neighbor === to) {
        const path: string[] = [];
        let node: string | undefined = to;
        while (node !== undefined) {
          path.unshift(node);
          node = parent.get(node);
        }
        return path;
      }
      queue.push(neighbor);
    }
  }
  return null;
}

describe("shortest path", () => {
  test("retains same-node, missing-node, empty ID and Set insertion-order behavior", () => {
    expect(findShortestPath(new Map(), "missing", "missing")).toEqual(["missing"]);
    expect(findShortestPath(new Map(), "from", "to")).toBeNull();
    const graph = new Map([
      ["", new Set(["b", "a", ""])],
      ["a", new Set(["", "target"])],
      ["b", new Set(["target"])],
    ]);
    expect(findShortestPath(graph, "", "target")).toEqual(["", "b", "target"]);
    graph.set("", new Set(["a", "b"]));
    expect(findShortestPath(graph, "", "target")).toEqual(["", "a", "target"]);
    expect(findShortestPath(graph, "target", "")).toBeNull();
    expect(findShortestPath(graph, "b", "target")).toEqual(["b", "target"]);
  });

  test("matches the previous BFS on random directed and undirected adjacency maps", () => {
    let state = 0x621f0823;
    const random = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 0x100000000;
    };
    for (let trial = 0; trial < 120; trial++) {
      const size = 2 + Math.floor(random() * 30);
      const ids = Array.from({ length: size }, (_, index) => (index ? `node-${index}` : ""));
      const graph = new Map(ids.map((id) => [id, new Set<string>()]));
      for (let edge = 0; edge < size * 3; edge++) {
        const from = ids[Math.floor(random() * size)];
        const to = ids[Math.floor(random() * size)];
        graph.get(from)!.add(to);
        if (trial % 2) graph.get(to)!.add(from);
      }
      // Some targets have no adjacency entry; references to them remain valid.
      if (trial % 3 === 0) graph.delete(ids.at(-1)!);
      for (let query = 0; query < 20; query++) {
        const from = query === 0 ? "absent-from" : ids[Math.floor(random() * size)];
        const to = query === 1 ? "absent-to" : ids[Math.floor(random() * size)];
        expect(findShortestPath(graph, from, to)).toEqual(reference(graph, from, to));
      }
    }
  });

  test("searches a wide frontier and preserves the path through its final entry", () => {
    const children = Array.from({ length: 16384 }, (_, index) => `child-${index}`);
    const graph = new Map([
      ["root", new Set(children)],
      [children.at(-1)!, new Set(["target"])],
    ]);
    expect(findShortestPath(graph, "root", "target")).toEqual(["root", children.at(-1)!, "target"]);
    expect(findShortestPath(graph, "root", "unreachable")).toBeNull();
  });

  test("reconstructs an entire long chain in start-to-end order", () => {
    const length = 16384;
    const ids = Array.from({ length }, (_, index) => `node-${index}`);
    const graph = new Map(ids.slice(0, -1).map((id, index) => [id, new Set([ids[index + 1]])]));
    expect(findShortestPath(graph, ids[0], ids.at(-1)!)).toEqual(ids);
    expect(findShortestPath(graph, ids.at(-1)!, ids[0])).toBeNull();
  });
});
