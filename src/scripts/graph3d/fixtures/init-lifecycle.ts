// Runs in a separate process so module mocks cannot replace the real renderer
// in camera/geometry tests. The graph entry points below remain unmocked.
import { mock } from "bun:test";
import { strict as assert } from "node:assert";
import { encode } from "msgpackr";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => (resolve = done));
  return { promise, resolve };
}

const scenario = process.argv[2];
const rendererRequests: ReturnType<typeof deferred<any>>[] = [];
const activated: string[] = [];
const released: string[] = [];
const domLookups: string[] = [];
const initReached = deferred<void>();
const finishWasmInit = deferred<void>();
const activeBoundary = new Error("Reached active renderer setup");
const graph = {
  nodes: [{ id: "a", name: "A", url: "https://a.example", x: 0, y: 0, z: 0 }],
  links: [],
  categories: [],
  adjacency: {},
};

Object.defineProperty(globalThis, "document", {
  value: {
    getElementById(id: string) {
      domLookups.push(id);
      return { innerHTML: "" };
    },
  },
  configurable: true,
});

mock.module("../../ui/windows", () => ({
  registerPanel() {},
  showPanel() {},
  hidePanel() {},
  destroyPanel() {},
  togglePanel() {},
}));
mock.module("../renderer", () => ({
  createRenderer() {
    const request = deferred<any>();
    rendererRequests.push(request);
    return request.promise;
  },
  setRenderQuality(context: { id: string }) {
    activated.push(context.id);
    // Successful initialization goes on to scene/UI construction. Stop at this
    // observable boundary: rejected stale initializations must never reach it.
    throw activeBoundary;
  },
  dispose(context: { id: string }) {
    released.push(`renderer:${context.id}`);
  },
  animateCamera() {},
  setLinkOpacity() {},
  nodeSize() {},
  setNodeColor() {},
  updateAllNodePositions() {},
  updateLinkPositions() {},
}));
mock.module("@bokuweb/zstd-wasm", () => ({
  async init() {
    initReached.resolve();
    await finishWasmInit.promise;
  },
  decompress: () => encode(graph),
}));

function renderer(id: string) {
  return {
    id,
    controls: { dispose: () => released.push(`controls:${id}`) },
    renderer: { domElement: { remove: () => released.push(`canvas:${id}`) } },
  };
}

const { init3d, init3dFromUrl } = await import("../index");

if (scenario === "aborted-before-start") {
  const controller = new AbortController();
  const reason = new DOMException("Already timed out", "AbortError");
  controller.abort(reason);
  await assert.rejects(init3d(graph, controller.signal), (error) => error === reason);
  assert.deepEqual(domLookups, []);
  assert.equal(rendererRequests.length, 0);
} else if (scenario === "abort-during-wasm") {
  globalThis.fetch = Object.assign(async () => new Response(Uint8Array.from([0x28, 0xb5, 0x2f, 0xfd])), {
    preconnect() {},
  });
  const controller = new AbortController();
  const pending = init3dFromUrl("https://graph.example/core.bin", controller.signal);
  await initReached.promise;
  const reason = new DOMException("Loading timed out", "AbortError");
  controller.abort(reason);
  finishWasmInit.resolve();
  await assert.rejects(pending, (error) => error === reason);
  assert.deepEqual(domLookups, []);
  assert.equal(rendererRequests.length, 0);
} else if (scenario === "abort-during-renderer") {
  const controller = new AbortController();
  const pending = init3d(graph, controller.signal);
  assert.equal(rendererRequests.length, 1);
  const reason = new DOMException("Loading timed out", "AbortError");
  controller.abort(reason);
  rendererRequests[0].resolve(renderer("aborted"));
  await assert.rejects(pending, (error) => error === reason);
  assert.deepEqual(activated, []);
  assert.deepEqual(released, ["controls:aborted", "renderer:aborted", "canvas:aborted"]);
} else if (scenario === "newer-renderer-wins") {
  const oldInitialization = init3d(graph);
  const newInitialization = init3d(graph);
  assert.equal(rendererRequests.length, 2);
  // The second request completes first. Only it may proceed to scene setup.
  rendererRequests[1].resolve(renderer("latest"));
  await assert.rejects(newInitialization, (error) => error === activeBoundary);
  rendererRequests[0].resolve(renderer("stale"));
  assert.equal(await oldInitialization, null);
  assert.deepEqual(activated, ["latest"]);
  assert.deepEqual(released, ["controls:stale", "renderer:stale", "canvas:stale"]);
} else {
  throw new Error(`Unknown lifecycle scenario: ${scenario}`);
}

console.log(`passed: ${scenario}`);
