interface RenderSchedulerOptions {
  requestFrame: (callback: FrameRequestCallback) => number;
  cancelFrame: (handle: number) => void;
  /** Return true while camera damping, flight, or another animation needs more frames. */
  onFrame: (timestamp: number) => boolean;
  isVisible?: () => boolean;
  /** Infinity follows every browser RAF while frames are needed. */
  maxFps?: number;
}

export interface RenderScheduler {
  request: () => void;
  pause: () => void;
  resume: () => void;
  dispose: () => void;
  setMaxFps: (maxFps: number) => void;
  readonly pending: boolean;
}

function frameInterval(maxFps: number): number {
  if (maxFps === Infinity) return 0;
  if (!Number.isFinite(maxFps) || maxFps <= 0) {
    throw new RangeError("maxFps must be a positive finite number or Infinity");
  }
  return 1000 / maxFps;
}

/** Coalesces invalidations and stops requesting browser frames as soon as the scene is still. */
export function createRenderScheduler({
  requestFrame,
  cancelFrame,
  onFrame,
  isVisible = () => true,
  maxFps = 60,
}: RenderSchedulerOptions): RenderScheduler {
  let interval = frameInterval(maxFps);
  let handle: number | null = null;
  let needsFrame = false;
  let inFrame = false;
  let paused = false;
  let disposed = false;
  let nextFrameTime: number | null = null;

  function schedule(): void {
    if (!disposed && !paused && !inFrame && needsFrame && handle === null && isVisible()) {
      handle = requestFrame(tick);
    }
  }

  function tick(timestamp: number): void {
    handle = null;
    if (disposed || paused || !isVisible()) return;

    // Keep the invalidation until a frame is actually rendered. Browsers drive
    // this throttle with RAF; an idle scene never needs a polling timer.
    if (nextFrameTime !== null && timestamp + 0.01 < nextFrameTime) {
      schedule();
      return;
    }

    // Preserve the cadence across fractional refresh intervals (e.g. 45 FPS on
    // a 60 Hz display), but reset it after a long idle or background interval.
    nextFrameTime =
      nextFrameTime === null || timestamp - nextFrameTime >= interval ? timestamp + interval : nextFrameTime + interval;
    needsFrame = false;
    inFrame = true;
    let keepAnimating = false;
    try {
      keepAnimating = onFrame(timestamp);
    } finally {
      inFrame = false;
      // request() may have invalidated the scene from inside onFrame().
      needsFrame ||= keepAnimating;
      schedule();
    }
  }

  function request(): void {
    if (disposed) return;
    needsFrame = true;
    schedule();
  }

  function cancelPending(): void {
    if (handle !== null) {
      cancelFrame(handle);
      handle = null;
    }
  }

  return {
    request,
    pause() {
      paused = true;
      cancelPending();
    },
    resume() {
      if (disposed) return;
      paused = false;
      nextFrameTime = null;
      request();
    },
    dispose() {
      disposed = true;
      needsFrame = false;
      cancelPending();
    },
    setMaxFps(value: number) {
      interval = frameInterval(value);
      nextFrameTime = null;
    },
    get pending() {
      return handle !== null;
    },
  };
}
