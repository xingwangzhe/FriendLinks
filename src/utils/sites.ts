/**
 * 站点加载模块
 *
 * 在 Astro 构建/SSR 上下文中使用 Content Collection API，
 * 替代旧的手动 YAML 解析方式，获得类型安全、Schema 校验和 Astro 内置缓存。
 *
 * CLI 脚本（scripts/）仍使用下方 export 的 loadSitesLegacy 回退到手动解析，
 * 或维持对 load-sites.ts 的直接引用。
 */
import { getCollection } from "astro:content";
import type { Site } from "../../types/site";
import { deterministicSample, isFastMode, getDevSampleSize } from "./sample";
import { printProgress, printDone } from "./progress";

// ── 模块级缓存 ──
let _cachedSites: Site[] | null = null;

export function clearSitesCache() {
  _cachedSites = null;
}

/**
 * 通过 Content Collection 加载所有站点。
 * 在 DEV / MINIBUILD 模式下自动采样 100 个站点。
 * 模块级缓存避免多个端点重复加载。
 */
export async function loadSites(
  _dir?: string,
  onProgress?: (current: number, total: number) => void,
): Promise<Site[]> {
  if (_cachedSites) {
    onProgress?.(_cachedSites.length, _cachedSites.length);
    return _cachedSites;
  }

  printProgress("❶", "通过 Content Collections 加载站点…", 0);

  // getCollection('sites') — 由 Astro Content Layer 驱动
  const entries = await getCollection("sites");
  let allSites: Site[] = entries.map((entry) => entry.data.site);

  // DEV 模式采样
  if (isFastMode() && allSites.length > getDevSampleSize()) {
    allSites = deterministicSample(allSites, getDevSampleSize());
  }

  onProgress?.(allSites.length, allSites.length);
  printDone(`${allSites.length} 个站点 (Content Collections)`);

  _cachedSites = allSites;
  return allSites;
}
