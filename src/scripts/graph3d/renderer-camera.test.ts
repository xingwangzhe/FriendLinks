import { describe, expect, mock, spyOn, test } from "bun:test";
import * as THREE from "three/webgpu";
import { animateCamera, dispose, zoomToFit, type RenderContext } from "./renderer";

function withAnimationClock(
  run: (clock: { advance: (time: number) => void; pending: Map<number, FrameRequestCallback> }) => void,
) {
  const requestDescriptor = Object.getOwnPropertyDescriptor(globalThis, "requestAnimationFrame");
  const cancelDescriptor = Object.getOwnPropertyDescriptor(globalThis, "cancelAnimationFrame");
  const pending = new Map<number, FrameRequestCallback>();
  let frame = 0;
  let now = 0;
  const nowSpy = spyOn(performance, "now").mockImplementation(() => now);
  globalThis.requestAnimationFrame = (callback) => {
    pending.set(++frame, callback);
    return frame;
  };
  globalThis.cancelAnimationFrame = (id) => {
    pending.delete(id);
  };
  try {
    run({
      pending,
      advance: (time) => {
        now = time;
        const callbacks = Array.from(pending.values());
        pending.clear();
        for (const callback of callbacks) callback(time);
      },
    });
  } finally {
    nowSpy.mockRestore();
    if (requestDescriptor) Object.defineProperty(globalThis, "requestAnimationFrame", requestDescriptor);
    else Reflect.deleteProperty(globalThis, "requestAnimationFrame");
    if (cancelDescriptor) Object.defineProperty(globalThis, "cancelAnimationFrame", cancelDescriptor);
    else Reflect.deleteProperty(globalThis, "cancelAnimationFrame");
  }
}

function cameraContext(): RenderContext {
  return {
    camera: new THREE.PerspectiveCamera(),
    controls: { target: new THREE.Vector3(), update: mock(() => {}) },
    requestRender: mock(() => {}),
    cancelCameraAnimation: () => {},
    cameraAnimating: false,
    renderer: { dispose: mock(() => {}) },
    nodes: new THREE.InstancedMesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial(), 1),
    linkLines: new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial()),
  } as unknown as RenderContext;
}

describe("camera animation lifecycle", () => {
  test("replacing an animation leaves one frame chain and reaches the latest destination", () => {
    withAnimationClock(({ advance, pending }) => {
      const context = cameraContext();
      animateCamera(context, { x: 100, y: 0, z: 0 }, { x: 10, y: 0, z: 0 }, 1000);
      expect(context.cameraAnimating).toBe(true);
      advance(500);
      expect(context.camera.position.x).toBeCloseTo(87.5);
      const staleCallback = Array.from(pending.values())[0];
      animateCamera(context, { x: -100, y: 10, z: 20 }, { x: -10, y: 0, z: 0 }, 1000);
      expect(pending.size).toBe(1);
      staleCallback(600);
      expect(pending.size).toBe(1);
      advance(1500);
      expect(context.camera.position.toArray()).toEqual([-100, 10, 20]);
      expect(context.controls.target.toArray()).toEqual([-10, 0, 0]);
      expect(context.cameraAnimating).toBe(false);
      expect(pending.size).toBe(0);
      expect(context.requestRender).toHaveBeenCalledTimes(4);
    });
  });

  test("fit and focus share cancellation; disposal stops pending work without resetting the target", () => {
    withAnimationClock(({ advance, pending }) => {
      const context = cameraContext();
      animateCamera(context, { x: 100, y: 0, z: 0 }, { x: 10, y: 20, z: 30 }, 1000);
      zoomToFit(context, [{ id: "a", name: "a", url: "https://a.example", x: 40, y: 50, z: 60 }], 1000, 20);
      expect(pending.size).toBe(1);
      advance(500);
      const target = context.controls.target.toArray();
      dispose(context);
      expect(context.cameraAnimating).toBe(false);
      expect(pending.size).toBe(0);
      advance(2000);
      expect(context.controls.target.toArray()).toEqual(target);
      expect(context.renderer.dispose).toHaveBeenCalledTimes(1);
    });
  });

  test("zero-duration navigation completes immediately without a frame loop", () => {
    withAnimationClock(({ pending }) => {
      const context = cameraContext();
      animateCamera(context, { x: 3, y: 4, z: 5 }, { x: 6, y: 7, z: 8 }, 0);
      expect(context.camera.position.toArray()).toEqual([3, 4, 5]);
      expect(context.cameraAnimating).toBe(false);
      expect(pending.size).toBe(0);
      expect(context.requestRender).toHaveBeenCalledTimes(1);
    });
  });
});
