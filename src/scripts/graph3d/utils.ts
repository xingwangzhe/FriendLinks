// 调色板与颜色工具（从 graph/utils.ts 移植）

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
 * 将字符串哈希为 PALETTE 索引
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
 * 节点度数 → 3D 节点尺寸
 */
export function degreeToSize(d: number, maxDegree: number) {
  const MIN = 1;
  const MAX = 6;
  if (!d || d <= 1) return MIN;
  const norm = Math.sqrt(d) / Math.sqrt(Math.max(1, maxDegree));
  return MIN + Math.min(1, norm) * (MAX - MIN);
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function rgbToHex(r: number, g: number, b: number) {
  const hr = (1 << 24) + (r << 16) + (g << 8) + b;
  return "#" + hr.toString(16).slice(1);
}

/**
 * 根据基础色生成 emissive 发光色
 * 将颜色调亮并增加饱和度，用于 Three.js MeshStandardMaterial.emissive
 */
export function getEmissiveColor(baseHex: string, intensity: number): string {
  // intensity: 0-1，越高越亮
  const [r, g, b] = hexToRgb(baseHex);
  // 调亮：向白色混合
  const blend = Math.min(1, intensity * 0.8);
  const er = Math.round(r + (255 - r) * blend);
  const eg = Math.round(g + (255 - g) * blend);
  const eb = Math.round(b + (255 - b) * blend);
  return rgbToHex(er, eg, eb);
}
