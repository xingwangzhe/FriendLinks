import { describe, expect, test } from "bun:test";
import { createRenderScheduler, type RenderScheduler } from "./render-scheduler";

function fakeAnimationFrames() {
  let nextHandle = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  return {
    requestFrame(callback: FrameRequestCallback) {
      const handle = nextHandle++;
      callbacks.set(handle, callback);
      return handle;
    },
    cancelFrame(handle: number) {
      callbacks.delete(handle);
    },
    frame(timestamp: number) {
      const current = [...callbacks.values()];
      callbacks.clear();
      for (const callback of current) callback(timestamp);
    },
    get size() {
      return callbacks.size;
    },
  };
}

describe("demand-driven render scheduler", () => {
  test("coalesces repeated invalidations and requests no frames while idle", () => {
    const raf = fakeAnimationFrames();
    const rendered: number[] = [];
    const scheduler = createRenderScheduler({
      ...raf,
      onFrame(timestamp) {
        rendered.push(timestamp);
        return false;
      },
    });

    expect(raf.size).toBe(0);
    scheduler.request();
    scheduler.request();
    scheduler.request();
    expect(raf.size).toBe(1);
    expect(scheduler.pending).toBe(true);
    raf.frame(0);
    raf.frame(1000);
    expect(rendered).toEqual([0]);
    expect(raf.size).toBe(0);
    expect(scheduler.pending).toBe(false);
  });

  test("retains an invalidation raised while rendering", () => {
    const raf = fakeAnimationFrames();
    let calls = 0;
    let scheduler: RenderScheduler;
    scheduler = createRenderScheduler({
      ...raf,
      onFrame() {
        calls++;
        if (calls === 1) scheduler.request();
        return false;
      },
    });

    scheduler.request();
    raf.frame(0);
    expect(calls).toBe(1);
    expect(raf.size).toBe(1);
    raf.frame(1000 / 60);
    expect(calls).toBe(2);
    expect(raf.size).toBe(0);
  });

  test("animates only while onFrame requests continuation", () => {
    const raf = fakeAnimationFrames();
    let calls = 0;
    const scheduler = createRenderScheduler({ ...raf, onFrame: () => ++calls < 3 });

    scheduler.request();
    raf.frame(0);
    raf.frame(1000 / 60);
    raf.frame(2000 / 60);
    raf.frame(3000 / 60);
    expect(calls).toBe(3);
    expect(raf.size).toBe(0);
  });

  test("pause cancels RAF, and resume renders immediately even within the FPS interval", () => {
    const raf = fakeAnimationFrames();
    let calls = 0;
    const scheduler = createRenderScheduler({ ...raf, maxFps: 30, onFrame: () => ++calls < 3 });

    scheduler.request();
    raf.frame(0);
    scheduler.pause();
    scheduler.request();
    expect(raf.size).toBe(0);
    expect(scheduler.pending).toBe(false);
    raf.frame(1);
    expect(calls).toBe(1);
    scheduler.resume();
    raf.frame(2);
    expect(calls).toBe(2);
    expect(raf.size).toBe(1);
  });

  test("hidden scenes stop scheduling and resume with their latest invalidation", () => {
    const raf = fakeAnimationFrames();
    let visible = true;
    let calls = 0;
    const scheduler = createRenderScheduler({
      ...raf,
      isVisible: () => visible,
      onFrame: () => {
        calls++;
        return false;
      },
    });

    scheduler.request();
    visible = false;
    raf.frame(0);
    scheduler.request();
    expect(calls).toBe(0);
    expect(raf.size).toBe(0);
    visible = true;
    scheduler.resume();
    raf.frame(1);
    expect(calls).toBe(1);
    expect(raf.size).toBe(0);
  });

  test("throttles animation without starving pending changes or rounding 45 FPS down to 30", () => {
    for (const maxFps of [30, 45, 60]) {
      const raf = fakeAnimationFrames();
      let calls = 0;
      const scheduler = createRenderScheduler({
        ...raf,
        maxFps,
        onFrame: () => {
          calls++;
          return true;
        },
      });

      scheduler.request();
      for (let frame = 0; frame < 120; frame++) raf.frame((frame * 1000) / 60);
      expect(calls).toBeGreaterThanOrEqual(maxFps * 2 - 1);
      expect(calls).toBeLessThanOrEqual(maxFps * 2);
      scheduler.dispose();
      expect(raf.size).toBe(0);
    }
  });

  test("does not lose a single change requested before the next permitted frame", () => {
    const raf = fakeAnimationFrames();
    const rendered: number[] = [];
    const scheduler = createRenderScheduler({
      ...raf,
      maxFps: 30,
      onFrame(timestamp) {
        rendered.push(timestamp);
        return false;
      },
    });

    scheduler.request();
    raf.frame(0);
    scheduler.request();
    raf.frame(1000 / 60);
    expect(rendered).toEqual([0]);
    expect(raf.size).toBe(1);
    raf.frame(2000 / 60);
    expect(rendered).toEqual([0, 2000 / 60]);
    expect(raf.size).toBe(0);
  });

  test("updates the FPS limit and never restarts after disposal", () => {
    const raf = fakeAnimationFrames();
    let calls = 0;
    const scheduler = createRenderScheduler({
      ...raf,
      maxFps: 30,
      onFrame: () => {
        calls++;
        return true;
      },
    });

    scheduler.request();
    raf.frame(0);
    scheduler.setMaxFps(60);
    raf.frame(1000 / 60);
    expect(calls).toBe(2);
    scheduler.dispose();
    scheduler.request();
    scheduler.resume();
    raf.frame(1000);
    expect(calls).toBe(2);
    expect(scheduler.pending).toBe(false);
    expect(raf.size).toBe(0);
    expect(() => scheduler.setMaxFps(0)).toThrow(RangeError);
  });

  test("unlimited animation renders every browser RAF on 144 Hz and 240 Hz displays", () => {
    for (const refreshRate of [144, 240]) {
      const raf = fakeAnimationFrames();
      const rendered: number[] = [];
      const scheduler = createRenderScheduler({
        ...raf,
        maxFps: Infinity,
        onFrame(timestamp) {
          rendered.push(timestamp);
          return true;
        },
      });
      const timestamps = Array.from({ length: refreshRate * 2 }, (_, frame) => (frame * 1000) / refreshRate);
      scheduler.request();
      for (const timestamp of timestamps) raf.frame(timestamp);
      expect(rendered).toEqual(timestamps);
      expect(raf.size).toBe(1);
      scheduler.dispose();
      expect(raf.size).toBe(0);
    }
  });

  test("switches from a finite cap to unlimited and back without dropping pending animation", () => {
    const raf = fakeAnimationFrames();
    const rendered: number[] = [];
    const scheduler = createRenderScheduler({
      ...raf,
      maxFps: 30,
      onFrame(timestamp) {
        rendered.push(timestamp);
        return true;
      },
    });
    scheduler.request();
    raf.frame(0);
    raf.frame(1000 / 240);
    expect(rendered).toEqual([0]);
    expect(scheduler.pending).toBe(true);

    scheduler.setMaxFps(Infinity);
    for (let frame = 2; frame <= 4; frame++) raf.frame((frame * 1000) / 240);
    expect(rendered).toEqual([0, 2000 / 240, 3000 / 240, 4000 / 240]);

    scheduler.setMaxFps(60);
    for (let frame = 5; frame <= 9; frame++) raf.frame((frame * 1000) / 240);
    expect(rendered).toEqual([0, 2000 / 240, 3000 / 240, 4000 / 240, 5000 / 240, 9000 / 240]);
    scheduler.dispose();
  });

  test("unlimited mode still stops when idle, suspends when hidden and cancels pending frames", () => {
    const raf = fakeAnimationFrames();
    let visible = true;
    let animating = false;
    let calls = 0;
    const scheduler = createRenderScheduler({
      ...raf,
      maxFps: Infinity,
      isVisible: () => visible,
      onFrame() {
        calls++;
        return animating;
      },
    });
    scheduler.request();
    scheduler.request();
    raf.frame(0);
    raf.frame(1000 / 240);
    expect(calls).toBe(1);
    expect(raf.size).toBe(0);

    animating = true;
    scheduler.request();
    visible = false;
    raf.frame(2000 / 240);
    scheduler.request();
    expect(calls).toBe(1);
    expect(scheduler.pending).toBe(false);
    expect(raf.size).toBe(0);

    visible = true;
    scheduler.resume();
    raf.frame(3000 / 240);
    expect(calls).toBe(2);
    expect(raf.size).toBe(1);
    scheduler.pause();
    expect(raf.size).toBe(0);
    raf.frame(4000 / 240);
    expect(calls).toBe(2);
    scheduler.resume();
    raf.frame(5000 / 240);
    expect(calls).toBe(3);
    expect(raf.size).toBe(1);
    scheduler.dispose();
    scheduler.request();
    scheduler.resume();
    raf.frame(6000 / 240);
    expect(calls).toBe(3);
    expect(raf.size).toBe(0);
  });

  test("rejects invalid initial and updated caps while retaining the active cap", () => {
    for (const maxFps of [0, -1, NaN, -Infinity]) {
      const raf = fakeAnimationFrames();
      expect(() => createRenderScheduler({ ...raf, maxFps, onFrame: () => false })).toThrow(RangeError);
      let calls = 0;
      const scheduler = createRenderScheduler({
        ...raf,
        maxFps: Infinity,
        onFrame: () => {
          calls++;
          return true;
        },
      });
      scheduler.request();
      raf.frame(0);
      expect(() => scheduler.setMaxFps(maxFps)).toThrow(RangeError);
      raf.frame(1000 / 240);
      expect(calls).toBe(2);
      scheduler.dispose();
    }
  });
});
