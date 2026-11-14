import { expect, test } from "bun:test";
import { PerspectiveCamera, Vector3 } from "three";
import {
  applyFlightLook,
  applyFlightRoll,
  applyFlightTranslation,
  computeFlightSpeed,
  DEFAULT_FLIGHT_LOOK_SENSITIVITY,
  flightActionForKeyEvent,
  isEditableFlightTarget,
  levelFlightCamera,
} from "./flight-controls";

function spread(count: number, extent: number) {
  return Array.from({ length: count }, (_, index) => ({
    x: (((index * 37) % count) / count) * extent,
    y: (((index * 61) % count) / count) * extent,
    z: (((index * 89) % count) / count) * extent,
  }));
}

function direction(camera: PerspectiveCamera) {
  camera.updateMatrixWorld();
  return camera.getWorldDirection(new Vector3());
}

test("flight look rotates immediately in the mouse direction", () => {
  const camera = new PerspectiveCamera();
  const pixels = 100;
  const angle = pixels * DEFAULT_FLIGHT_LOOK_SENSITIVITY;

  expect(applyFlightLook(camera, pixels, 0)).toBe(true);
  const right = direction(camera);
  expect(right.x).toBeCloseTo(Math.sin(angle), 6);
  expect(right.y).toBeCloseTo(0, 6);
  expect(right.z).toBeCloseTo(-Math.cos(angle), 6);

  expect(applyFlightLook(camera, 0, -pixels)).toBe(true);
  expect(direction(camera).y).toBeGreaterThan(0);
});

test("flight look ignores empty and invalid pointer deltas", () => {
  const camera = new PerspectiveCamera();
  camera.rotateZ(0.35);
  const before = camera.quaternion.clone();

  expect(applyFlightLook(camera, 0, 0)).toBe(false);
  expect(applyFlightLook(camera, Number.NaN, 12)).toBe(false);
  expect(camera.quaternion.equals(before)).toBe(true);
});

test("flight look applies yaw around the rolled ship's local up axis", () => {
  const camera = new PerspectiveCamera();
  camera.rotateZ(0.4);
  const before = direction(camera);
  const localRight = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

  applyFlightLook(camera, 150, 0);
  const after = direction(camera);

  expect(after.clone().sub(before).dot(localRight)).toBeGreaterThan(0.1);
});

test("leaving flight mode levels the horizon without changing the look direction", () => {
  const camera = new PerspectiveCamera();
  camera.rotateY(0.7);
  camera.rotateX(0.4);
  camera.rotateZ(0.55);
  const before = direction(camera);

  levelFlightCamera(camera);

  const after = direction(camera);
  const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  expect(after.dot(before)).toBeGreaterThan(0.9999);
  expect(right.y).toBeCloseTo(0, 5);
});

test("physical WASD controls map to translation actions even when key labels change", () => {
  expect(flightActionForKeyEvent({ code: "KeyW", key: "z" })).toBe("w");
  expect(flightActionForKeyEvent({ code: "KeyA", key: "q" })).toBe("a");
  expect(flightActionForKeyEvent({ code: "KeyS", key: "s" })).toBe("s");
  expect(flightActionForKeyEvent({ code: "KeyD", key: "d" })).toBe("d");
  expect(flightActionForKeyEvent({ code: "ShiftLeft", key: "Shift" })).toBe("shift");
  expect(flightActionForKeyEvent({ code: "Space", key: " " })).toBe(" ");
  expect(flightActionForKeyEvent({ code: "KeyX", key: "x" })).toBe("x");
  expect(flightActionForKeyEvent({ code: "Unknown", key: "r" })).toBe("r");
});

test("panel focus does not block flight keys but editable controls do", () => {
  const title = {
    closest(selector: string) {
      return selector === ".app-panel" ? {} : null;
    },
  } as unknown as EventTarget;
  const input = {
    closest(selector: string) {
      return selector.includes("input") ? {} : null;
    },
  } as unknown as EventTarget;
  expect(isEditableFlightTarget(title)).toBe(false);
  expect(isEditableFlightTarget(input)).toBe(true);
  expect(isEditableFlightTarget(null)).toBe(false);
});

test("W moves forward at frame-rate-independent speed and diagonal input is normalized", () => {
  const camera = new PerspectiveCamera();
  const forward = applyFlightTranslation(camera, { w: true }, false, 30, 0.5);
  expect(forward).toBeCloseTo(1.5, 8);
  expect(camera.position.z).toBeCloseTo(-1.5, 8);

  camera.position.set(0, 0, 0);
  const diagonal = applyFlightTranslation(camera, { w: true, d: true }, false, 30, 0.05);
  expect(diagonal).toBeCloseTo(1.5, 8);
  expect(camera.position.length()).toBeCloseTo(1.5, 8);
  expect(camera.position.x).toBeGreaterThan(0);
  expect(camera.position.z).toBeLessThan(0);
});

test("R/F move vertically and auto-forward never overrides explicit reverse", () => {
  const camera = new PerspectiveCamera();
  applyFlightTranslation(camera, { r: true }, false, 30, 0.05);
  expect(camera.position.y).toBeCloseTo(1.5, 8);
  camera.position.set(0, 0, 0);
  applyFlightTranslation(camera, { s: true }, true, 30, 0.05);
  expect(camera.position.z).toBeCloseTo(1.5, 8);
});

test("Q and E roll around the local Z axis in opposite directions", () => {
  const left = new PerspectiveCamera();
  let leftVelocity = 0;
  for (let frame = 0; frame < 30; frame++) leftVelocity = applyFlightRoll(left, leftVelocity, 1, 1 / 60);
  const leftUp = new Vector3(0, 1, 0).applyQuaternion(left.quaternion);
  expect(leftUp.x).toBeLessThan(-0.1);

  const right = new PerspectiveCamera();
  let rightVelocity = 0;
  for (let frame = 0; frame < 30; frame++) rightVelocity = applyFlightRoll(right, rightVelocity, -1, 1 / 60);
  const rightUp = new Vector3(0, 1, 0).applyQuaternion(right.quaternion);
  expect(rightUp.x).toBeGreaterThan(0.1);
});

test("auto flight speed scales with distribution volume at fixed node count", () => {
  const compact = computeFlightSpeed(spread(100, 1000));
  const spacious = computeFlightSpeed(spread(100, 2000));
  expect(spacious.volume).toBeGreaterThan(compact.volume * 7);
  expect(spacious.speed).toBeGreaterThan(compact.speed);
});

test("auto flight speed falls as node density rises in a fixed volume", () => {
  const sparse = computeFlightSpeed(spread(100, 10_000));
  const dense = computeFlightSpeed(spread(800, 10_000));
  expect(dense.density).toBeGreaterThan(sparse.density * 7);
  expect(dense.speed).toBeLessThan(sparse.speed);
});

test("auto flight speed clamps empty, flat, and oversized graphs", () => {
  expect(computeFlightSpeed([]).speed).toBe(120);
  const flat = Array.from({ length: 100 }, (_, index) => ({ x: index * 10, y: 0, z: 0 }));
  expect(computeFlightSpeed(flat).speed).toBeGreaterThanOrEqual(120);
  expect(computeFlightSpeed(spread(10, 1_000_000), { max: 5000 }).speed).toBe(5000);
});
