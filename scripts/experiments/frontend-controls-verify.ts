/**
 * End-to-end flight and panel verification in the real system Chrome.
 *
 * Run a dev server first:
 *   DEV_SAMPLE_SIZE=420 bun run dev --host 127.0.0.1 --port 4322
 *   VERIFY_URL=http://127.0.0.1:4322/ bun run verify:controls
 *
 * The script intentionally leaves the Chrome tab open for manual inspection.
 */
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const url = process.env.VERIFY_URL ?? "http://127.0.0.1:4322/";
const cdpPort = Number(process.env.VERIFY_CDP_PORT ?? 9224);
const profile = process.env.VERIFY_CHROME_PROFILE ?? "/tmp/friendlinks-controls-verify";
const reportPath = process.env.VERIFY_REPORT
  ? resolve(process.env.VERIFY_REPORT)
  : resolve("reports/frontend-performance-2026-11-14/flight-controls-verify.json");
const screenshotPath = resolve("reports/frontend-performance-2026-11-14/flight-hud.png");
const aboutScreenshotPath = resolve("reports/frontend-performance-2026-11-14/native-dialog-about.png");
const controlScreenshotPath = resolve("reports/frontend-performance-2026-11-14/native-dialog-control.png");

type Vec3 = [number, number, number];
type Quat = [number, number, number, number];
type CameraState = {
  position: Vec3;
  quaternion: Quat;
  right: Vec3;
  up: Vec3;
  forward: Vec3;
};
type CheckResult = { name: string; pass: boolean; details: unknown };

function sleep(ms: number) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function round(value: number) {
  return Number(value.toFixed(6));
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function length(a: Vec3) {
  return Math.hypot(a[0], a[1], a[2]);
}

function quaternionDistance(a: Quat, b: Quat) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]);
}

async function cdpReady(port: number) {
  try {
    return (await fetch(`http://127.0.0.1:${port}/json/version`)).ok;
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

async function waitForGraph(page: Page) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__graphApi?.getPerformanceStats !== undefined, undefined, {
    timeout: 90_000,
  });
  await page.waitForTimeout(700);
}

async function cameraState(page: Page): Promise<CameraState> {
  return page.evaluate(() => {
    const camera = window.__graphApi!.ctx!.camera as unknown as {
      position: { toArray: () => number[] };
      quaternion: { toArray: () => number[] };
      matrixWorld: { elements: number[] };
      updateMatrixWorld: (force?: boolean) => void;
    };
    camera.updateMatrixWorld(true);
    const e = camera.matrixWorld.elements;
    return {
      position: camera.position.toArray() as [number, number, number],
      quaternion: camera.quaternion.toArray() as [number, number, number, number],
      right: [e[0], e[1], e[2]],
      up: [e[4], e[5], e[6]],
      forward: [-e[8], -e[9], -e[10]],
    };
  });
}

async function resetCamera(page: Page, state: CameraState) {
  await page.evaluate(
    ({ position, quaternion }) => {
      const camera = window.__graphApi!.ctx!.camera as unknown as {
        position: { fromArray: (array: number[]) => void };
        quaternion: { fromArray: (array: number[]) => void };
        rotation: { order: string };
        updateMatrixWorld: (force?: boolean) => void;
      };
      camera.position.fromArray(position);
      camera.quaternion.fromArray(quaternion);
      camera.rotation.order = "YXZ";
      camera.updateMatrixWorld(true);
    },
    { position: state.position, quaternion: state.quaternion },
  );
}

async function pressKey(page: Page, key: string, durationMs = 320) {
  await page.keyboard.down(key);
  await sleep(durationMs);
  await page.keyboard.up(key);
  await sleep(60);
}

async function pressShiftForward(page: Page, durationMs = 360) {
  await page.keyboard.down("Shift");
  await page.keyboard.down("w");
  await sleep(durationMs);
  await page.keyboard.up("w");
  await page.keyboard.up("Shift");
  await sleep(60);
}

async function ensurePointerLock(page: Page) {
  let native = false;
  try {
    await page.waitForFunction(() => window.__graphApi!.getPerformanceStats!().pointerLocked, undefined, {
      timeout: 2_500,
    });
    native = true;
  } catch {}
  await page.evaluate(() => {
    try {
      document.exitPointerLock?.();
    } catch {}
  });
  await sleep(120);
  await page.evaluate(() => {
    const canvas = document.querySelector<HTMLElement>("#main canvas");
    if (!canvas) throw new Error("Canvas unavailable for pointer-lock fallback");
    Object.defineProperty(document, "pointerLockElement", {
      configurable: true,
      get: () => canvas,
    });
    Object.defineProperty(canvas, "requestPointerLock", {
      configurable: true,
      value: async () => {},
    });
    Object.defineProperty(document, "exitPointerLock", {
      configurable: true,
      value: () => {},
    });
    document.dispatchEvent(new Event("pointerlockchange"));
  });
  await page.waitForFunction(() => window.__graphApi!.getPerformanceStats!().pointerLocked);
  return native ? "native-then-mocked" : "mocked";
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
  await waitForGraph(page);
  await page.evaluate(() => {
    (window as unknown as { __verifyKeys: unknown[] }).__verifyKeys = [];
    for (const type of ["keydown", "keyup"] as const) {
      document.addEventListener(
        type,
        (event) => {
          (window as unknown as { __verifyKeys: unknown[] }).__verifyKeys.push({
            type,
            code: event.code,
            key: event.key,
            target: (event.target as HTMLElement | null)?.tagName,
            active: (document.activeElement as HTMLElement | null)?.id,
          });
        },
        true,
      );
    }
  });

  const checks: CheckResult[] = [];
  const check = (name: string, pass: boolean, details: unknown) => {
    checks.push({ name, pass, details });
  };
  const initialCamera = await cameraState(page);

  await page.locator("#about-toggle").click();
  await page.waitForFunction(() => Boolean(document.querySelector("dialog.app-panel[open]")));
  const aboutPanel = await page.evaluate(() => {
    const dialog = document.querySelector<HTMLDialogElement>("dialog.app-panel[open]");
    return {
      open: Boolean(dialog?.open),
      content: Boolean(dialog?.querySelector("#about-dialog")),
      winbox: document.querySelectorAll(".wb-window, .wb-body, .app-window").length,
    };
  });
  check("关于面板使用原生 dialog", aboutPanel.open && aboutPanel.content && aboutPanel.winbox === 0, aboutPanel);
  await page.screenshot({ path: aboutScreenshotPath, fullPage: false });
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.app-panel[open]"));
  check("Escape 关闭面板", true, {});

  await page.locator("#opacity-toggle").click();
  await page.waitForFunction(() => Boolean(document.querySelector("dialog.app-panel[open] #graph-control-panel")));
  const speedUi = await page.evaluate(() => {
    const slider = document.getElementById("flight-speed-slider") as HTMLInputElement | null;
    const stats = window.__graphApi!.getPerformanceStats!();
    return {
      min: Number(slider?.min),
      max: Number(slider?.max),
      value: Number(slider?.value),
      autoAttr: Number(slider?.dataset.autoSpeed),
      minExpected: stats.flightSpeedMin,
      maxExpected: stats.flightSpeedMax,
      valueExpected: stats.flightSpeed,
      autoExpected: stats.flightAutoSpeed,
      nodeCount: stats.flightSpeedCount,
      volume: stats.flightSpeedVolume,
    };
  });
  check(
    "速度滑块随节点数量与体积密度更新",
    speedUi.min === speedUi.minExpected &&
      speedUi.max === speedUi.maxExpected &&
      speedUi.value === speedUi.valueExpected &&
      speedUi.autoAttr === speedUi.autoExpected &&
      speedUi.autoExpected > 120 &&
      speedUi.nodeCount > 0 &&
      speedUi.volume > 0,
    speedUi,
  );
  await page.evaluate(() => {
    const slider = document.getElementById("flight-speed-slider") as HTMLInputElement;
    slider.value = slider.min;
    slider.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const changedSpeed = await page.evaluate(() => window.__graphApi!.getPerformanceStats!().flightSpeed);
  await page.locator("#flight-speed-reset").click();
  const resetSpeed = await page.evaluate(() => window.__graphApi!.getPerformanceStats!());
  check(
    "速度滑块可调整并恢复自动基准",
    changedSpeed === speedUi.minExpected && resetSpeed.flightSpeed === resetSpeed.flightAutoSpeed,
    {
      changedSpeed,
      resetSpeed: resetSpeed.flightSpeed,
      autoSpeed: resetSpeed.flightAutoSpeed,
    },
  );
  await page.screenshot({ path: controlScreenshotPath, fullPage: false });
  check("控制面板挂载到 dialog", true, {});
  await page.locator("dialog.app-panel[open] .app-panel-close").click();
  await page.waitForFunction(() => !document.querySelector("dialog.app-panel[open]"));

  await page.locator("#fly-toggle").click();
  const pointerLockMode = await ensurePointerLock(page);
  const hud = await page.evaluate(() => {
    const element = document.getElementById("fly-hud");
    if (!element) return null;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      hidden: element.hidden,
      pointerEvents: style.pointerEvents,
      height: rect.height,
      width: rect.width,
      legacyPanel: Boolean(document.getElementById("fly-control-panel")),
      winbox: document.querySelectorAll(".wb-window, .wb-body, .app-window").length,
      exitHighlight: getComputedStyle(document.querySelector(".fly-hud-exit")!).color,
    };
  });
  check(
    "飞行 HUD 轻量且不拦截指针",
    Boolean(hud) &&
      !hud!.hidden &&
      hud!.pointerEvents === "none" &&
      hud!.height <= 96 &&
      !hud!.legacyPanel &&
      hud!.winbox === 0,
    hud,
  );

  await resetCamera(page, initialCamera);
  const beforeLook = await cameraState(page);
  await page.evaluate(() => {
    const canvas = document.querySelector<HTMLElement>("#main canvas");
    canvas?.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        movementX: 160,
        movementY: -80,
      }),
    );
  });
  await sleep(80);
  const afterLook = await cameraState(page);
  const lookPositionChange = length(subtract(afterLook.position, beforeLook.position));
  const lookRotationChange = quaternionDistance(afterLook.quaternion, beforeLook.quaternion);
  check("鼠标只转向不位移", lookPositionChange < 1e-6 && lookRotationChange > 0.01, {
    positionChange: round(lookPositionChange),
    rotationChange: round(lookRotationChange),
  });

  const movementCases: Array<{
    label: string;
    key: string;
    axis: "forward" | "right" | "up";
    sign: 1 | -1;
  }> = [
    { label: "W 前进", key: "w", axis: "forward", sign: 1 },
    { label: "S 后退", key: "s", axis: "forward", sign: -1 },
    { label: "A 左移", key: "a", axis: "right", sign: -1 },
    { label: "D 右移", key: "d", axis: "right", sign: 1 },
    { label: "R 上升", key: "r", axis: "up", sign: 1 },
    { label: "F 下降", key: "f", axis: "up", sign: -1 },
  ];
  const movementReport: Record<string, unknown> = {};
  for (const movement of movementCases) {
    await resetCamera(page, initialCamera);
    const before = await cameraState(page);
    await pressKey(page, movement.key);
    const after = await cameraState(page);
    const delta = subtract(after.position, before.position);
    const axisValue = dot(delta, before[movement.axis]);
    movementReport[movement.label] = {
      distance: round(length(delta)),
      axisValue: round(axisValue),
    };
    check(movement.label, axisValue * movement.sign > 0.02, movementReport[movement.label]);
  }

  await resetCamera(page, initialCamera);
  const normalStart = await cameraState(page);
  await pressKey(page, "w", 360);
  const normalEnd = await cameraState(page);
  const normalDistance = length(subtract(normalEnd.position, normalStart.position));

  await resetCamera(page, initialCamera);
  const shiftStart = await cameraState(page);
  await pressShiftForward(page, 360);
  const shiftEnd = await cameraState(page);
  const shiftDistance = length(subtract(shiftEnd.position, shiftStart.position));
  const shiftRatio = normalDistance > 0 ? shiftDistance / normalDistance : 0;
  check("Shift 约 3 倍速", shiftRatio > 2.2 && shiftRatio < 4.5, {
    normalDistance: round(normalDistance),
    shiftDistance: round(shiftDistance),
    ratio: round(shiftRatio),
  });

  await resetCamera(page, initialCamera);
  await pressKey(page, "q", 400);
  const qCamera = await cameraState(page);
  await page.waitForFunction(() => window.__graphApi!.getPerformanceStats!().flightRollVelocity === 0, undefined, {
    timeout: 4_000,
  });
  await resetCamera(page, initialCamera);
  await page.keyboard.down("e");
  await sleep(120);
  const eHeld = await page.evaluate(() => ({
    stats: window.__graphApi!.getPerformanceStats!(),
    active: (document.activeElement as HTMLElement | null)?.id,
  }));
  await sleep(280);
  await page.keyboard.up("e");
  await sleep(60);
  const eCamera = await cameraState(page);
  await page.waitForFunction(() => window.__graphApi!.getPerformanceStats!().flightRollVelocity === 0, undefined, {
    timeout: 4_000,
  });
  const rollStats = await page.evaluate(() => window.__graphApi!.getPerformanceStats!());
  check(
    "Q/E 横滚方向相反",
    qCamera.up[0] < -0.03 &&
      eCamera.up[0] > 0.03 &&
      rollStats.flightKeys.length === 0 &&
      rollStats.flightRollVelocity === 0,
    {
      qUpX: round(qCamera.up[0]),
      eUpX: round(eCamera.up[0]),
      keys: rollStats.flightKeys,
      velocity: rollStats.flightRollVelocity,
      eHeld: eHeld.stats.flightKeys,
      eActive: eHeld.active,
    },
  );

  await page.waitForFunction(
    () => {
      const stats = window.__graphApi!.getPerformanceStats!();
      return !stats.pendingFrame && !stats.pendingLabelTask && stats.flightRollVelocity === 0;
    },
    undefined,
    { timeout: 5_000 },
  );
  await sleep(300);
  const idleStart = await page.evaluate(() => window.__graphApi!.getPerformanceStats!().frames);
  await sleep(700);
  const idleEnd = await page.evaluate(() => window.__graphApi!.getPerformanceStats!().frames);
  check("无输入后停止绘帧", idleEnd - idleStart === 0, { frameDelta: idleEnd - idleStart });

  await page.screenshot({ path: screenshotPath, fullPage: false });
  await page.keyboard.press("x");
  await page.waitForFunction(() => document.getElementById("fly-hud")?.hidden === true);
  const exited = await page.evaluate(() => ({
    hudHidden: document.getElementById("fly-hud")?.hidden === true,
    buttonText: document.getElementById("fly-toggle")?.textContent?.trim(),
  }));
  check("X 退出飞船模式", exited.hudHidden && exited.buttonText === "🚀 飞船模式", exited);

  const failed = checks.filter((entry) => !entry.pass);
  const report = {
    command: "bun run verify:controls",
    url,
    environment: {
      bun: Bun.version,
      browser: await page.evaluate(() => navigator.userAgent),
      viewport: await page.evaluate(() => [window.innerWidth, window.innerHeight]),
      pointerLockMode,
    },
    checks,
    movementReport,
    keyLog: await page.evaluate(() => (window as unknown as { __verifyKeys?: unknown[] }).__verifyKeys ?? []),
    consoleErrors,
    screenshot: screenshotPath,
    aboutScreenshot: aboutScreenshotPath,
    controlScreenshot: controlScreenshotPath,
  };
  await mkdir(dirname(reportPath), { recursive: true });
  await Bun.write(reportPath, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ ...report, reportPath }, null, 2));
  process.exit(failed.length || consoleErrors.length ? 1 : 0);
}

await main();
