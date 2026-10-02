import type { Site } from "../../types/site";
import { loadSiteCollection, clearCollectionCache } from "./site-collection";
import { isFastMode, getDevSampleSize } from "./sample";
export function clearSitesCache() {
  clearCollectionCache();
}
export function loadSites(dir?: string, onProgress?: (current: number, total: number) => void): Promise<Site[]> {
  return loadSiteCollection(dir, isFastMode() ? getDevSampleSize() : Infinity, onProgress);
}
