// 调色板与颜色工具（从 graph/utils.ts 移植）

import * as THREE from "three";

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
 * 按百分比调亮/调暗 hex 颜色
 */
export function adjustHex(hex: string, percent: number) {
  const [r, g, b] = hexToRgb(hex);
  const amt = Math.round(255 * (percent / 100));
  const nr = Math.max(0, Math.min(255, r + amt));
  const ng = Math.max(0, Math.min(255, g + amt));
  const nb = Math.max(0, Math.min(255, b + amt));
  return rgbToHex(nr, ng, nb);
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

// ─── LOD (Level of Detail) ─────────────────────────────────────────────────

/** LOD 距离阈值 */
export const LOD_DISTANCES = {
  NEAR: 200,
  MID: 500,
} as const;

/** 全局共享的 LOD 几何体（半径=1，实际尺寸由 scale 控制） */
let _sharedLODGeoms: { near: THREE.SphereGeometry; mid: THREE.SphereGeometry; far: THREE.SphereGeometry } | null = null;

export function getSharedLODGeometries() {
  if (!_sharedLODGeoms) {
    _sharedLODGeoms = {
      near: new THREE.SphereGeometry(1, 16, 16), // 高细节
      mid: new THREE.SphereGeometry(1, 8, 8), // 中细节
      far: new THREE.SphereGeometry(1, 4, 4), // 低细节
    };
  }
  return _sharedLODGeoms;
}

/**
 * 为单个节点创建 THREE.LOD 对象（3 个细节层级）
 * @param baseColor hex 颜色字符串 (如 "#ff6600")
 * @returns THREE.LOD 实例，可直接替换 node.__threeObj.children[0]
 */
export function createNodeLOD(baseColor: string): THREE.LOD {
  const geoms = getSharedLODGeometries();
  const color = new THREE.Color(baseColor);

  // 近层：标准材质 + 高分段球体
  const meshNear = new THREE.Mesh(
    geoms.near,
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.6,
      metalness: 0.1,
    }),
  );

  // 中层：Lambert 漫反射 + 中分段球体
  const meshMid = new THREE.Mesh(geoms.mid, new THREE.MeshLambertMaterial({ color }));

  // 远层：Basic 无光照 + 低分段球体（最省 GPU）
  const meshFar = new THREE.Mesh(geoms.far, new THREE.MeshBasicMaterial({ color }));

  const lod = new THREE.LOD();
  lod.addLevel(meshNear, LOD_DISTANCES.NEAR);
  lod.addLevel(meshMid, LOD_DISTANCES.MID);
  lod.addLevel(meshFar, Infinity);

  return lod;
}

/**
 * 更新 LOD 对象内所有层级的材质颜色
 */
export function updateLODColor(lod: THREE.LOD, color: string): void {
  const c = new THREE.Color(color);
  for (let i = 0; i < lod.levels.length; i++) {
    const obj = lod.levels[i].object;
    if (obj instanceof THREE.Mesh && obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        if ("color" in mat) {
          (mat as THREE.MeshBasicMaterial).color.copy(c);
        }
      }
    }
  }
}
