/**
 * 站点加载模块
 *
 * 使用 Node.js 原生 fs 读取 links/*.yml，
 * yaml 包解析 + Zod 校验，无 Content Collection 依赖。
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { z } from "zod";
import type { Site } from "../../types/site";
import { printProgress, printDone } from "./progress";
import { deterministicSample, isFastMode, getDevSampleSize } from "./sample";

// ── Zod Schema ──

const FriendSchema = z.object({
  name: z.coerce.string(),
  url: z.string(),
  favicon: z.string().optional(),
});

const RawSiteSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  favicon: z.string().optional().catch(undefined),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .catch(undefined),
  links: z.string().catch("/links"),
  friends: z.array(FriendSchema).catch([]),
});

const YamlSchema = z.object({
  site: RawSiteSchema,
});

// ── 模块级缓存 ──
let _cachedSites: Site[] | null = null;

export function clearSitesCache() {
  _cachedSites = null;
}

/**
 * 加载所有站点数据。
 * 使用 Node.js readdirSync/readFileSync 原生读取 + yaml 解析 + Zod 校验。
 */
export async function loadSites(
  _dir?: string,
  onProgress?: (current: number, total: number) => void,
): Promise<Site[]> {
  if (_cachedSites) {
    onProgress?.(_cachedSites.length, _cachedSites.length);
    return _cachedSites;
  }

  printProgress("❶", "加载友链数据…", 0);

  const linksDir = _dir || join(process.cwd(), "links");
  let files: string[];
  try {
    files = readdirSync(linksDir).filter((f) => f.endsWith(".yml")).sort();
  } catch {
    printDone("无法读取 links 目录");
    return [];
  }

  let allSites: Site[] = [];
  let warnings = 0;

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = join(linksDir, fileName);

    let text: string;
    try {
      text = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    let raw: unknown;
    try {
      raw = YAML.parse(text);
    } catch {
      continue;
    }

    const result = YamlSchema.safeParse(raw);
    if (result.success) {
      allSites.push(result.data.site as unknown as Site);
    } else {
      for (const issue of result.error.issues) {
        console.warn(`⚠️  [${fileName}] ${issue.path.join(".")}: ${issue.message}`);
        warnings++;
      }
    }

    if (onProgress) onProgress(i + 1, files.length);
  }

  // DEV 模式采样
  if (isFastMode() && allSites.length > getDevSampleSize()) {
    allSites = deterministicSample(allSites, getDevSampleSize());
  }

  onProgress?.(files.length, files.length);
  printDone(
    `${allSites.length} 个站点${warnings > 0 ? ` (${warnings} 个警告)` : ""}`,
  );

  _cachedSites = allSites;
  return allSites;
}
