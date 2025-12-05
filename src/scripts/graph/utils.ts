// Utility helpers for graph rendering (palette, sizing, color helpers)

export const PALETTE = [
  "#E69F00",
  "#56B4E9",
  "#009E73",
  "#0072B2",
  "#D55E00",
  "#CC79A7",
  "#8C564B",
  "#E377C2",
  "#7F7F7F",
  "#17BECF",
  "#4E79A7",
  "#B1C94E",
];

/**
 * Convert a string into an index within PALETTE using a stable hash.
 */
export function hashToIndex(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % PALETTE.length;
}

/**
 * Map node degree to a visual node size.
 * d: node degree
 * maxDegree: maximum degree in the graph (used to normalize)
 */
export function degreeToSize(d: number, maxDegree: number) {
  const MIN = 6;
  const MAX = 22;
  if (!d || d <= 1) return MIN;
  const norm = Math.sqrt(d) / Math.sqrt(Math.max(1, maxDegree));
  return Math.round(MIN + Math.min(1, norm) * (MAX - MIN));
}

/**
 * Convert hex color string to RGB tuple.
 * Accepts formats like '#rrggbb' (no alpha support needed here).
 */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return [((bigint >> 16) & 255), ((bigint >> 8) & 255), (bigint & 255)];
}

/**
 * Convert RGB components to hex string '#rrggbb'
 */
export function rgbToHex(r: number, g: number, b: number) {
  const hr = (1 << 24) + (r << 16) + (g << 8) + b;
  return "#" + hr.toString(16).slice(1);
}

/**
 * Adjust a hex color by adding a percentage of white.
 * percent: positive to make lighter, negative to make darker (range roughly -100..100)
 * Implementation uses additive approach capped to [0,255].
 */
export function adjustHex(hex: string, percent: number) {
  const [r, g, b] = hexToRgb(hex);
  const amt = Math.round(255 * (percent / 100));
  const nr = Math.max(0, Math.min(255, r + amt));
  const ng = Math.max(0, Math.min(255, g + amt));
  const nb = Math.max(0, Math.min(255, b + amt));
  return rgbToHex(nr, ng, nb);
}
