import { expect, test } from "bun:test";
import { Frustum, Matrix4, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { LabelCandidateIndex } from "./label-candidates";

test("nearby label selection preserves distance, frustum, retention and stable ties", () => {
  let seed = 93;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32) * 20000 - 10000;
  const nodes = Array.from({ length: 10000 }, (_, index) => ({
    id: String(index),
    name: index % 101 === 0 ? "x".repeat(41) : `node ${index}`,
    x: random(),
    y: random(),
    z: random(),
  }));
  // Dense cloud exercises the bounded heap rather than only empty cells.
  for (let i = 0; i < 500; i++) {
    nodes[i].x /= 30;
    nodes[i].y /= 30;
    nodes[i].z = -Math.abs(nodes[i].z / 30);
  }
  nodes[501] = { id: "tie-a", name: "a", x: 0, y: 0, z: -500 };
  nodes[502] = { id: "tie-b", name: "b", x: 0, y: 0, z: -500 };
  nodes[503] = { id: "retained", name: "far", x: 0, y: 0, z: -1200 };
  const index = new LabelCandidateIndex(nodes);
  const camera = new PerspectiveCamera(75, 2, 1, 50000);
  const point = new Vector3();
  const retained = new Set([501, 503, 12]);
  for (const position of [new Vector3(), new Vector3(-250, 0, 0), new Vector3(5000, -3000, 200)]) {
    camera.position.copy(position);
    camera.updateMatrixWorld();
    const frustum = new Frustum().setFromProjectionMatrix(
      new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
    );
    for (const budget of [0, 1, 48, 96, 160, 1000]) {
      const expected = nodes
        .map((node, index) => ({
          index,
          distance: point.set(node.x, node.y, node.z).distanceToSquared(position),
          visible: (node.name || node.id).length <= 40 && frustum.containsPoint(point),
        }))
        .filter((item) => item.visible && item.distance <= (retained.has(item.index) ? 1500 ** 2 : 600 ** 2))
        .sort((a, b) => a.distance - b.distance || a.index - b.index)
        .slice(0, budget)
        .map((item) => item.index);
      expect(index.select(position, frustum, budget, retained)).toEqual(expected);
      expect(index.lastVisited).toBeLessThan(nodes.length / 5);
    }
  }
});

test("label retention radius does not create labels for distant unretained nodes", () => {
  const nodes = [
    { id: "a", x: 0, y: 0, z: -1200 },
    { id: "b", x: 0, y: 0, z: -1200 },
    { id: "c", x: 0, y: 0, z: -1600 },
  ];
  const camera = new PerspectiveCamera(75, 2, 1, 50000);
  const frustum = new Frustum().setFromProjectionMatrix(camera.projectionMatrix);
  const index = new LabelCandidateIndex(nodes);
  expect(index.select(camera.position, frustum, 48, new Set([0, 2]))).toEqual([0]);
  expect(index.select(camera.position, frustum, 48, new Set())).toEqual([]);
});

test("retained labels inside a neighboring cell enter the budget only once", () => {
  const camera = new OrthographicCamera(-1000, 1000, 1000, -1000, 1, 3000);
  const frustum = new Frustum().setFromProjectionMatrix(camera.projectionMatrix);
  const index = new LabelCandidateIndex([
    { id: "retained", x: 500, y: 500, z: -100 },
    { id: "new", x: 0, y: 0, z: -100 },
    { id: "too-far", x: 0, y: 0, z: -800 },
  ]);
  expect(index.select(camera.position, frustum, 48, new Set([0]))).toEqual([1, 0]);
});
