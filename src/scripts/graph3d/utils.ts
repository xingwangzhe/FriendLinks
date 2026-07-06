// 调色板与颜色工具（从 graph/utils.ts 移植）

import * as THREE from "three";

export const PALETTE = [
  "#FF6B6B", // 亮红
  "#4ECDC4", // 青绿
  "#45B7D1", // 天蓝
  "#96CEB4", // 薄荷绿
  "#FFEAA7", // 浅黄
  "#DDA0DD", // 梅紫
  "#98D8C8", // 浅青
  "#F7DC6F", // 金黄
  "#BB8FCE", // 淡紫
  "#85C1E9", // 淡蓝
  "#F0B27A", // 杏色
  "#82E0AA", // 翠绿
  "#F1948A", // 鲑红
  "#7FB3D8", // 钢蓝
  "#AED6F1", // 粉蓝
  "#A3E4D7", // 海绿
  "#FAD7A0", // 蜜橙
  "#D2B4DE", // 薰衣草
  "#FF8C94", // 珊瑚
  "#96E6A1", // 嫩绿
  "#81ECEC", // 亮青
  "#FFA07A", // 亮鲑
  "#C8A2C8", // 紫罗兰
  "#87CEEB", // 天蓝
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
  const MIN = 2;
  const MAX = 10;
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
 * 按百分比调亮/调暗 hex 颜色（HSL 模式，保持饱和度）
 */
export function adjustHex(hex: string, percent: number) {
  const [r, g, b] = hexToRgb(hex);
  // 转为 HSL
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const mx = Math.max(rn, gn, bn), mn = Math.min(rn, gn, bn);
  const l = (mx + mn) / 2;
  const s = mx === mn ? 0 : l > 0.5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn);
  // 只调亮度(l)，不调饱和度(s)
  let newL = l + (percent / 100);
  newL = Math.max(0, Math.min(1, newL));
  // HSL → RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  if (mx === mn) {
    const gv = Math.round(newL * 255);
    return rgbToHex(gv, gv, gv);
  }
  const q = newL < 0.5 ? newL * (1 + s) : newL + s - newL * s;
  const p = 2 * newL - q;
  const rc = hue2rgb(p, q, rn > gn ? (rn > bn ? (gn - bn) / (mx - mn) : -1/3) : (gn > bn ? (bn - rn) / (mx - mn) + 2/3 : 0));
  const gc = hue2rgb(p, q, 1/3);
  const bc = hue2rgb(p, q, 2/3);
  return rgbToHex(Math.round(rc * 255), Math.round(gc * 255), Math.round(bc * 255));
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

// ─── Canvas Sprite 文字标签 ─────────────────────────────────────────────────

/**
 * 用 Canvas 2D 渲染文字，生成 THREE.Sprite
 * 纯系统字体，零外部依赖，自动 billboarding
 */
export function createTextSprite(text: string, worldHeight = 5, fontSize = 48): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  ctx.font = `${fontSize}px sans-serif`;
  const m = ctx.measureText(text);
  const pw = fontSize * 0.25;
  const ph = fontSize * 0.125;
  canvas.width = Math.max(2, Math.ceil(m.width + pw * 2));
  canvas.height = Math.max(2, Math.ceil(fontSize * 1.3 + ph * 2));

  ctx.fillStyle = "#ffffff";
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;

  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(mat);
  const h = worldHeight;
  sprite.scale.set(h * (canvas.width / canvas.height), h, 1);
  sprite.renderOrder = 999;

  return sprite;
}
