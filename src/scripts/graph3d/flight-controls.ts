import { Vector3, type Camera } from "three";

/** Raw pointer-lock deltas can spike during focus changes; keep one event bounded. */
const MAX_LOOK_DELTA = 250;

/** Radians per CSS pixel. About 0.126° per pixel at the default value. */
export const DEFAULT_FLIGHT_LOOK_SENSITIVITY = 0.0022;
export const MAX_FLIGHT_ROLL_RATE = 1.4;
export const MIN_AUTO_FLIGHT_SPEED = 120;
export const MAX_AUTO_FLIGHT_SPEED = 12_000;
export const FLIGHT_SPEED_STRIDE = 0.65;
const ROLL_RESPONSE = 10;

export type FlightAction = "w" | "a" | "s" | "d" | "r" | "f" | "q" | "e" | "shift" | " " | "x";
export type FlightTranslationInput = Pick<Record<FlightAction, boolean>, "w" | "a" | "s" | "d" | "r" | "f">;
export type FlightSpeedNode = { x?: number | null; y?: number | null; z?: number | null };
export type FlightSpeedProfile = {
  speed: number;
  count: number;
  volume: number;
  density: number;
  spacing: number;
  extent: [number, number, number];
  radius: number;
};

const ACTIONS_BY_CODE: Record<string, FlightAction> = {
  KeyW: "w",
  KeyA: "a",
  KeyS: "s",
  KeyD: "d",
  KeyR: "r",
  KeyF: "f",
  KeyQ: "q",
  KeyE: "e",
  ShiftLeft: "shift",
  ShiftRight: "shift",
  Space: " ",
  KeyX: "x",
};

const ACTIONS_BY_KEY: Record<string, FlightAction> = {
  w: "w",
  a: "a",
  s: "s",
  d: "d",
  r: "r",
  f: "f",
  q: "q",
  e: "e",
  shift: "shift",
  " ": " ",
  x: "x",
};

/** Prefer physical key codes so Shift and non-Latin layouts do not break flight controls. */
export function flightActionForKeyEvent(event: Pick<KeyboardEvent, "code" | "key">): FlightAction | null {
  return ACTIONS_BY_CODE[event.code] ?? ACTIONS_BY_KEY[event.key.toLowerCase()] ?? null;
}

/** Only text-editing controls may swallow flight keys; panel chrome focus must not. */
export function isEditableFlightTarget(target: EventTarget | null): boolean {
  const element = target as { closest?: (selector: string) => unknown } | null;
  return (
    typeof element?.closest === "function" &&
    element.closest("input, textarea, select, [contenteditable], [contenteditable='true']") !== null
  );
}

/** Move in camera-local space. Diagonal input is normalized so it cannot exceed base speed. */
export function applyFlightTranslation(
  camera: Camera,
  input: Partial<FlightTranslationInput>,
  autoForward: boolean,
  speed: number,
  dt: number,
  target = new Vector3(),
): number {
  if (!Number.isFinite(speed) || !Number.isFinite(dt) || dt <= 0) return 0;
  target.set(
    (input.d ? 1 : 0) - (input.a ? 1 : 0),
    (input.r ? 1 : 0) - (input.f ? 1 : 0),
    input.s ? 1 : autoForward || input.w ? -1 : 0,
  );
  if (target.lengthSq() === 0) return 0;
  const distance = Math.max(0, speed) * Math.min(dt, 0.05);
  target.normalize().multiplyScalar(distance).applyQuaternion(camera.quaternion);
  camera.position.add(target);
  return distance;
}

/** Smoothly approach the requested roll rate and rotate around the ship's local Z axis. */
export function applyFlightRoll(
  camera: Camera,
  velocity: number,
  input: number,
  dt: number,
  maxRate = MAX_FLIGHT_ROLL_RATE,
  response = ROLL_RESPONSE,
): number {
  if (!Number.isFinite(dt) || dt <= 0) return velocity;
  const target = Math.max(-1, Math.min(1, input)) * maxRate;
  const next = velocity + (target - velocity) * (1 - Math.exp(-response * Math.min(dt, 0.05)));
  camera.rotateZ(next * Math.min(dt, 0.05));
  return Math.abs(next) < 1e-5 ? 0 : next;
}

/**
 * Apply pointer-lock mouse movement directly to the camera orientation.
 * Positive X looks right; negative Y (mouse up) looks up. There is deliberately
 * no reticle spring or delayed rotation: a flight game should respond instantly.
 */
export function applyFlightLook(
  camera: Camera,
  movementX: number,
  movementY: number,
  sensitivity = DEFAULT_FLIGHT_LOOK_SENSITIVITY,
): boolean {
  if (!Number.isFinite(movementX) || !Number.isFinite(movementY) || !Number.isFinite(sensitivity)) return false;
  const dx = Math.max(-MAX_LOOK_DELTA, Math.min(MAX_LOOK_DELTA, movementX));
  const dy = Math.max(-MAX_LOOK_DELTA, Math.min(MAX_LOOK_DELTA, movementY));
  if (dx === 0 && dy === 0) return false;

  camera.rotateY(-dx * sensitivity);
  camera.rotateX(-dy * sensitivity);
  camera.updateMatrixWorld();
  return true;
}

/**
 * Derive a traversal speed from graph scale and spatial density.
 *
 * The bounding volume and node count give a characteristic spacing
 * `cbrt(volume / count)`. Moving at roughly one spacing every 1.5 seconds
 * keeps large sparse universes traversable without turning dense clusters
 * into a blur.
 */
export function computeFlightSpeed(
  nodes: readonly FlightSpeedNode[],
  options: { min?: number; max?: number; stride?: number } = {},
): FlightSpeedProfile {
  const min = options.min ?? MIN_AUTO_FLIGHT_SPEED;
  const max = options.max ?? MAX_AUTO_FLIGHT_SPEED;
  const stride = options.stride ?? FLIGHT_SPEED_STRIDE;
  let count = 0;
  const low = [Infinity, Infinity, Infinity];
  const high = [-Infinity, -Infinity, -Infinity];
  for (const node of nodes) {
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y) || !Number.isFinite(node.z)) continue;
    const position = [node.x!, node.y!, node.z!];
    count++;
    for (let axis = 0; axis < 3; axis++) {
      low[axis] = Math.min(low[axis], position[axis]);
      high[axis] = Math.max(high[axis], position[axis]);
    }
  }
  if (count < 2) {
    return {
      speed: min,
      count,
      volume: 0,
      density: 0,
      spacing: min / Math.max(stride, Number.EPSILON),
      extent: [0, 0, 0],
      radius: 0,
    };
  }
  const extent = high.map((value, axis) => Math.max(1, value - low[axis])) as [number, number, number];
  const volume = extent[0] * extent[1] * extent[2];
  const spacing = Math.cbrt(volume / count);
  const radius = 0.5 * Math.hypot(...extent);
  const speed = Math.round(Math.min(max, Math.max(min, spacing * Math.max(0, stride))));
  return {
    speed,
    count,
    volume,
    density: count / volume,
    spacing,
    extent,
    radius,
  };
}
