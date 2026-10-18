import { Vector3, type Frustum } from "three";

interface LabelNode {
  id: string;
  name?: string;
  x?: number;
  y?: number;
  z?: number;
}

interface Candidate {
  index: number;
  distance: number;
}

const CELL_SIZE = 600;
const CREATE_DISTANCE_SQ = CELL_SIZE * CELL_SIZE;
const RETAIN_DISTANCE_SQ = 1500 * 1500;

function farther(a: Candidate, b: Candidate) {
  return a.distance > b.distance || (a.distance === b.distance && a.index > b.index);
}

/** Static graph positions: visit nearby cells and retain only the nearest label budget. */
export class LabelCandidateIndex {
  private readonly cells = new Map<string, number[]>();
  private readonly heap: Candidate[] = [];
  private readonly point = new Vector3();
  lastVisited = 0;

  constructor(private readonly nodes: readonly LabelNode[]) {
    nodes.forEach((node, index) => {
      if (node.x == null || !Number.isFinite(node.x) || (node.name || node.id).length > 40) return;
      const key = this.key(node.x, node.y ?? 0, node.z ?? 0);
      const cell = this.cells.get(key);
      if (cell) cell.push(index);
      else this.cells.set(key, [index]);
    });
  }

  private key(x: number, y: number, z: number) {
    return `${Math.floor(x / CELL_SIZE)},${Math.floor(y / CELL_SIZE)},${Math.floor(z / CELL_SIZE)}`;
  }

  select(camera: Vector3, frustum: Frustum, budget: number, retained: ReadonlySet<number>): number[] {
    const heap = this.heap;
    heap.length = 0;
    this.lastVisited = 0;
    if (budget <= 0) return [];
    const consider = (index: number, retainOnly: boolean) => {
      this.lastVisited++;
      const node = this.nodes[index];
      this.point.x = node.x!;
      this.point.y = node.y ?? 0;
      this.point.z = node.z ?? 0;
      const dx = this.point.x - camera.x;
      const dy = this.point.y - camera.y;
      const dz = this.point.z - camera.z;
      const distance = dx * dx + dy * dy + dz * dz;
      if (retainOnly ? distance <= CREATE_DISTANCE_SQ : distance > CREATE_DISTANCE_SQ) return;
      const range = retained.has(index) ? RETAIN_DISTANCE_SQ : CREATE_DISTANCE_SQ;
      if (distance > range || !frustum.containsPoint(this.point)) return;
      const candidate = { index, distance };
      if (heap.length < budget) {
        let cursor = heap.push(candidate) - 1;
        while (cursor > 0) {
          const parent = (cursor - 1) >> 1;
          if (!farther(heap[cursor], heap[parent])) break;
          [heap[cursor], heap[parent]] = [heap[parent], heap[cursor]];
          cursor = parent;
        }
      } else if (farther(heap[0], candidate)) {
        heap[0] = candidate;
        let cursor = 0;
        while (cursor * 2 + 1 < heap.length) {
          let child = cursor * 2 + 1;
          if (child + 1 < heap.length && farther(heap[child + 1], heap[child])) child++;
          if (!farther(heap[child], heap[cursor])) break;
          [heap[cursor], heap[child]] = [heap[child], heap[cursor]];
          cursor = child;
        }
      }
    };
    const minX = Math.floor((camera.x - CELL_SIZE) / CELL_SIZE);
    const maxX = Math.floor((camera.x + CELL_SIZE) / CELL_SIZE);
    const minY = Math.floor((camera.y - CELL_SIZE) / CELL_SIZE);
    const maxY = Math.floor((camera.y + CELL_SIZE) / CELL_SIZE);
    const minZ = Math.floor((camera.z - CELL_SIZE) / CELL_SIZE);
    const maxZ = Math.floor((camera.z + CELL_SIZE) / CELL_SIZE);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          for (const index of this.cells.get(`${x},${y},${z}`) || []) consider(index, false);
        }
      }
    }
    // Existing labels have a wider exit radius to avoid texture churn at the creation boundary.
    for (const index of retained) consider(index, true);
    return heap.sort((a, b) => a.distance - b.distance || a.index - b.index).map((entry) => entry.index);
  }
}
