import { readFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import { z } from "zod";
import type { Site } from "../../types/site";
import { listYamlFiles } from "./yaml-files";
import { address, mergeSiteRecords, clearIdentityCache } from "./site-identity";
import { clearTopologyCache } from "./graph-topology";
import { deterministicSample } from "./sample";
import {
  artifactKey,
  buildArtifacts,
  buildCacheEnabled,
  contentHash,
  implementationFingerprint,
  type BuildArtifactCache,
} from "./build-artifact-cache";

const httpUrl = z.string().refine((value) => {
  try {
    address(value);
    return true;
  } catch {
    return false;
  }
}, "需要合法 http/https URL");
export const SiteSchema = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    url: httpUrl,
    aliases: z.array(httpUrl).optional(),
    links: z.string().trim().min(1).optional(),
    color: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .optional(),
    favicon: httpUrl.optional(),
    friends: z.array(
      z
        .object({
          name: z.string(),
          url: httpUrl,
          favicon: z.string().optional(),
          description: z.string().optional(),
          avatar: z.string().optional(),
        })
        .passthrough(),
    ),
  })
  .passthrough();
let cache = new Map<string, Promise<Site[]>>();
export function clearCollectionCache() {
  cache = new Map();
  clearIdentityCache();
  clearTopologyCache();
}
export async function readSiteRecords(
  dir: string,
  onProgress?: (current: number, total: number) => void,
  artifactCache: BuildArtifactCache | null = buildCacheEnabled() ? buildArtifacts : null,
) {
  const files = await listYamlFiles(path.resolve(dir));
  const records: Array<{ file: string; site: Site }> = [];
  let parsedCacheKey: string | null = null;
  let sourceText: Map<string, string> | null = null;
  const sourceHashes = new Map<string, string>();
  let previousRecords = new Map<string, { hash: string; site: Site }>();
  let reused = 0;
  if (artifactCache) {
    sourceText = new Map();
    for (let offset = 0; offset < files.length; offset += 128) {
      const batch = await Promise.all(
        files.slice(offset, offset + 128).map(async (file) => [file, await readFile(file, "utf8")] as const),
      );
      for (const [file, text] of batch) {
        sourceText.set(file, text);
        sourceHashes.set(path.relative(path.resolve(dir), file), contentHash(text));
      }
    }
    const implementation = await implementationFingerprint(
      [
        "src/utils/site-collection.ts",
        "src/utils/site-identity.ts",
        "src/utils/yaml-files.ts",
        "src/utils/build-artifact-cache.ts",
      ],
      ["yaml", "zod"],
    );
    parsedCacheKey = implementation ? artifactKey({ directory: path.resolve(dir), implementation }) : null;
    const cached = parsedCacheKey
      ? await artifactCache.read<Array<{ file: string; hash: string; site: Site }>>("yaml", parsedCacheKey)
      : null;
    if (cached) {
      previousRecords = new Map(cached.map((record) => [record.file, record]));
    }
  }
  const errors: string[] = [];
  for (let offset = 0; offset < files.length; offset += 128) {
    const batch = await Promise.all(
      files.slice(offset, offset + 128).map(async (file) => {
        try {
          const relative = path.relative(path.resolve(dir), file);
          const previous = previousRecords.get(relative);
          if (previous && sourceHashes.get(relative) === previous.hash) {
            reused++;
            return { file: relative, site: previous.site };
          }
          const data = YAML.parse(sourceText?.get(file) ?? (await readFile(file, "utf8")));
          const result = SiteSchema.safeParse(data?.site);
          if (!result.success)
            throw new Error(result.error.issues.map((i) => `site.${i.path.join(".")}: ${i.message}`).join("; "));
          return { file: path.relative(path.resolve(dir), file), site: result.data as Site };
        } catch (e) {
          errors.push(`[${file}] ${(e as Error).message}`);
          return null;
        }
      }),
    );
    for (const record of batch) if (record) records.push(record);
    onProgress?.(Math.min(offset + 128, files.length), files.length);
  }
  if (errors.length) throw new Error(`YAML 校验失败 (${errors.length} 文件):\n${errors.sort().join("\n")}`);
  if (parsedCacheKey && artifactCache) {
    console.log(
      `[cache] YAML: ${reused} reused, ${records.length - reused} parsed (${records.length} source records; content hashes verified)`,
    );
    if (reused !== records.length || previousRecords.size !== records.length) {
      await artifactCache.write(
        "yaml",
        parsedCacheKey,
        records.map((record) => ({ ...record, hash: sourceHashes.get(record.file)! })),
      );
    }
  }
  return records;
}
export function loadSiteCollection(
  dir = "links",
  sampleSize = Infinity,
  onProgress?: (current: number, total: number) => void,
): Promise<Site[]> {
  const key = JSON.stringify([path.resolve(dir), sampleSize === Infinity ? "all" : sampleSize]);
  let pending = cache.get(key);
  if (!pending) {
    pending = readSiteRecords(dir, onProgress)
      .then((records) => mergeSiteRecords(records, (sites) => deterministicSample(sites, sampleSize)))
      .catch((error) => {
        if (cache.get(key) === pending) cache.delete(key);
        throw error;
      });
    cache.set(key, pending);
  }
  return pending;
}
