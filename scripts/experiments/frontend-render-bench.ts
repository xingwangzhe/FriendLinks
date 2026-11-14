/**
 * Browser benchmark for the real system Chrome build.
 *
 * Run a dev server first:
 *   DEV_SAMPLE_SIZE=500 bun run dev --host 127.0.0.1
 *   BENCH_URL=http://127.0.0.1:4322/ bun run bench:ui
 *
 * This launches a dedicated system Chrome profile with CDP enabled, measures
 * real RAF/render counters, and intentionally leaves the tab open.
 */
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const url = process.env.BENCH_URL ?? "http://127.0.0.1:4322/";
const cdpPort = Number(process.env.BENCH_CDP_PORT ?? 9223);
const profile = process.env.BENCH_CHROME_PROFILE ?? "/tmp/friendlinks-render-bench";
const output = process.env.BENCH_REPORT
  ? resolve(process.env.BENCH_REPORT)
  : resolve("reports/frontend-performance-2026-11-14/browser-benchmark.json");

type Stats = ReturnType<NonNullable<NonNullable<Window["__graphApi"]>["getPerformanceStats"]>>;

type CameraState = {
  position: [number, number, number];
  quaternion: [number, number, number, number];
};

function sleep(ms: number) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function cdpReady(port: number) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);
    return response.ok;
  } catch {
    return false;
  }
}

async function launchSystemChrome() {
  if (await cdpReady(cdpPort)) return;
  const chrome = Bun.spawn(
    [
      "/usr/bin/google-chrome",
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--window-size=1600,900",
      url,
    ],
    { stdin: "ignore", stdout: "ignore", stderr: "ignore" },
  );
  chrome.unref();
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await cdpReady(cdpPort)) return;
    await sleep(100);
  }
  throw new Error(`System Chrome CDP did not start on ${cdpPort}`);
}

async function getStats(page: Page): Promise<Stats> {
  return page.evaluate(() => window.__graphApi!.getPerformanceStats!() as Stats);
}

async function getCamera(page: Page): Promise<CameraState> {
  return page.evaluate(() => {
    const camera = window.__graphApi!.ctx!.camera;
    return {
      position: camera.position.toArray() as [number, number, number],
      quaternion: camera.quaternion.toArray() as [number, number, number, number],
    };
  });
}

function changed(a: number[], b: number[]) {
  return a.some((value, index) => Math.abs(value - b[index]) > 1e-8);
}

async function waitForStableIdle(page: Page, timeoutMs = 5_000) {
  const started = performance.now();
  while (performance.now() - started < timeoutMs) {
    const current = await getStats(page);
    if (
      !current.pendingFrame &&
      !current.pendingLabelTask &&
      current.flightRollVelocity === 0 &&
      current.flightKeys.length === 0
    ) {
      const frames = current.frames;
      await sleep(300);
      const stable = await getStats(page);
      if (stable.frames === frames) {
        return {
          timeToIdleMs: performance.now() - started,
          frameDelta: stable.frames - frames,
          stats: stable,
        };
      }
    }
    await sleep(100);
  }
  throw new Error(`scene did not reach a stable idle state within ${timeoutMs}ms`);
}

async function main() {
  await launchSystemChrome();
  const browser: Browser = await chromium.connectOverCDP(`http://127.0.0.1:${cdpPort}`);
  const context = browser.contexts()[0] ?? (await browser.newContext({ viewport: { width: 1600, height: 900 } }));
  const page = context.pages().find((candidate) => candidate.url().startsWith(url)) ?? (await context.newPage());
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.bringToFront();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__graphApi !== undefined, undefined, { timeout: 90_000 });
  const initialIdle = await waitForStableIdle(page, 10_000);

  const initial = initialIdle.stats;
  await sleep(1500);
  const idleEnd = await getStats(page);

  await page.locator("#fly-toggle").click();
  try {
    await page.waitForFunction(() => window.__graphApi!.getPerformanceStats!().pointerLocked, undefined, {
      timeout: 2_500,
    });
  } catch {
    await page.locator("canvas").click({ position: { x: 800, y: 450 } });
    await page.waitForFunction(() => window.__graphApi!.getPerformanceStats!().pointerLocked, undefined, {
      timeout: 5_000,
    });
  }

  const beforeLook = await getCamera(page);
  await page.mouse.move(850, 450);
  await page.mouse.move(1250, 320, { steps: 12 });
  await page.waitForTimeout(120);
  const afterLook = await getCamera(page);

  const mouseOnlyFrames = (await getStats(page)).frames;
  const mouseOnlyIdle = await waitForStableIdle(page);

  const beforeMove = await getCamera(page);
  const movementStart = await getStats(page);
  const movementStartTime = performance.now();
  await page.keyboard.down("w");
  await sleep(1500);
  await page.keyboard.up("w");
  const movementEndTime = performance.now();
  const movementEnd = await getStats(page);
  const afterMove = await getCamera(page);

  const settledStart = await getStats(page);
  const settledStartTime = performance.now();
  const settled = await waitForStableIdle(page);
  const settledEnd = settled.stats;

  await mkdir(dirname(output), { recursive: true });
  await page.screenshot({ path: dirname(output) + "/flight-benchmark.png" });
  const report = {
    command: "bun run bench:ui",
    url,
    environment: {
      bun: Bun.version,
      playwright: "1.65.1",
      browser: await page.evaluate(() => navigator.userAgent),
      viewport: await page.evaluate(() => [window.innerWidth, window.innerHeight]),
      devicePixelRatio: await page.evaluate(() => window.devicePixelRatio),
    },
    initial,
    initialIdle: {
      timeToIdleMs: initialIdle.timeToIdleMs,
      idleFrameDelta: initialIdle.frameDelta,
    },
    idle: {
      durationMs: 1500,
      frameDelta: idleEnd.frames - initial.frames,
      labelScanDelta: idleEnd.labelScans - initial.labelScans,
      pendingFrame: idleEnd.pendingFrame,
      pendingLabelTask: idleEnd.pendingLabelTask,
    },
    mouseLook: {
      positionChanged: changed(beforeLook.position, afterLook.position),
      orientationChanged: changed(beforeLook.quaternion, afterLook.quaternion),
      cameraBefore: beforeLook,
      cameraAfter: afterLook,
      timeToIdleMs: mouseOnlyIdle.timeToIdleMs,
      residualFramesBeforeIdle: mouseOnlyIdle.stats.frames - mouseOnlyFrames,
      idleFrameDelta: mouseOnlyIdle.frameDelta,
    },
    forwardMovement: {
      durationMs: movementEndTime - movementStartTime,
      frameDelta: movementEnd.frames - movementStart.frames,
      labelScanDelta: movementEnd.labelScans - movementStart.labelScans,
      positionChanged: changed(beforeMove.position, afterMove.position),
      distance: Math.hypot(
        afterMove.position[0] - beforeMove.position[0],
        afterMove.position[1] - beforeMove.position[1],
        afterMove.position[2] - beforeMove.position[2],
      ),
      cameraBefore: beforeMove,
      cameraAfter: afterMove,
      stats: movementEnd,
    },
    settled: {
      durationMs: performance.now() - settledStartTime,
      timeToIdleMs: settled.timeToIdleMs,
      frameDelta: settledEnd.frames - settledStart.frames,
      idleFrameDelta: settled.frameDelta,
      labelScanDelta: settledEnd.labelScans - settledStart.labelScans,
      pendingFrame: settledEnd.pendingFrame,
      pendingLabelTask: settledEnd.pendingLabelTask,
    },
    consoleErrors,
  };
  const checks = {
    idleStopsRendering: idleEnd.frames === initial.frames,
    mouseOnlyLooks: !report.mouseLook.positionChanged && report.mouseLook.orientationChanged,
    mouseReturnsToIdle: report.mouseLook.idleFrameDelta === 0,
    forwardMoves: report.forwardMovement.positionChanged && report.forwardMovement.distance > 0,
    releaseReturnsToIdle: report.settled.idleFrameDelta === 0,
    noConsoleErrors: consoleErrors.length === 0,
  };
  Object.assign(report, { checks });
  await Bun.write(output, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report));
  process.exit(Object.values(checks).every(Boolean) ? 0 : 1);
}

await main();
