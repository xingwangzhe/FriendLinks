/**
 * BFS 最短路径查找（无向无权图）
 * @param neighborMap 邻接表 Map<nodeId, Set<neighborId>>
 * @param from 起点节点 ID
 * @param to 终点节点 ID
 * @returns 从 from 到 to 的最短路径节点 ID 数组（包含两端），无路径返回 null
 */
export function findShortestPath(neighborMap: Map<string, Set<string>>, from: string, to: string): string[] | null {
  if (from === to) return [from];

  const parent = new Map<string, string | undefined>([[from, undefined]]);
  const queue: string[] = [from];

  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    const neighbors = neighborMap.get(current);
    if (!neighbors) continue;

    for (const neighbor of neighbors) {
      if (parent.has(neighbor)) continue;
      parent.set(neighbor, current);
      if (neighbor === to) {
        // 回溯构建路径
        const path: string[] = [];
        let node: string | undefined = to;
        while (node !== undefined) {
          path.push(node);
          node = parent.get(node);
        }
        return path.reverse();
      }
      queue.push(neighbor);
    }
  }
  return null;
}
