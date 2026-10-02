import type { Site } from "../../types/site";
import { loadSiteCollection, clearCollectionCache } from "./site-collection";
import { isFastMode, getDevSampleSize } from "./sample";
export function isValidUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
export function clearSiteCache() {
  clearCollectionCache();
}
export function loadSites(dir?: string, onProgress?: (current: number, total: number) => void): Promise<Site[]> {
  return loadSiteCollection(dir, isFastMode() ? getDevSampleSize() : Infinity, onProgress);
}
