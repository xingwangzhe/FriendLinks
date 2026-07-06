/**
 * 批量更新站点名称和描述
 *
 * 扫描 links/*.yml，对名称=域名、描述=占位符 的站点，
 * 访问首页提取 <title> 和 <meta description> 并更新 YAML。
 *
 * 用法: bun run scripts/update-site-names.ts
 * 测试前 N 个: LIMIT=20 bun run scripts/update-site-names.ts
 * 跳过已更新的: SKIP_EXISTING=1 bun run scripts/update-site-names.ts
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "yaml";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const linksDir = join(__dirname, "..", "links");

const LIMIT = Number(process.env.LIMIT) || 0;

const PLACEHOLDER_DESCS = new Set([
  "友情链接",
  "friends",
  "personal blog",
  "blog",
  "",
  "links",
  "friend",
  "friends links",
  "blog description",
  "description",
]);

// Generic/useless titles to skip
const SKIP_TITLES = new Set([
  "home",
  "index",
  "blog",
  "about",
  "untitled",
  "new blog",
  "my blog",
  "personal blog",
  "home page",
  "welcome",
]);

// Commercial keywords that indicate not a personal blog
const COMMERCIAL_KEYWORDS = [
  "网站建设",
  "服务商",
  "公司",
  "有限公司",
  "外包",
  "代运营",
  "推广",
  "营销",
  "seo",
  "小程序开发",
  "模板建站",
  "企业建站",
  "官方站",
  "官方商城",
  "品牌官网",
  "电商",
  "购物",
];

function isPlaceholderDesc(desc: unknown): boolean {
  if (typeof desc !== "string") return true;
  return PLACEHOLDER_DESCS.has(desc.trim().toLowerCase()) || desc.trim() === "";
}

function isDomainName(name: string, url: string): boolean {
  try {
    const parsed = new URL(url);
    let domain = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const nameClean = name.toLowerCase().trim().replace(/\/$/, "");
    return nameClean === domain || nameClean === domain.split(".")[0];
  } catch {
    return false;
  }
}

function cleanTitle(title: string): string | null {
  let t = title.trim();
  if (!t) return null;

  const lower = t.toLowerCase();

  // Skip generic/useless titles
  if (SKIP_TITLES.has(lower)) return null;

  // Skip if contains commercial keywords
  for (const kw of COMMERCIAL_KEYWORDS) {
    if (lower.includes(kw)) return null;
  }

  // Skip very long titles (SEO spam)
  if (t.length > 80) return null;

  // Remove common separators and keep the first meaningful part
  // e.g. "Blog Name | Tagline" -> "Blog Name"
  // e.g. "Tagline — Blog Name" -> try keeping the last part
  const separators = [
    / \| /,
    / — /,
    / – /,
    / :: /,
    / « /,
    / » /,
  ];
  for (const sep of separators) {
    const parts = t.split(sep).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      // Pick the shortest non-generic part as the name
      const nonGeneric = parts.filter(
        (p) => !SKIP_TITLES.has(p.toLowerCase()),
      );
      if (nonGeneric.length > 0) {
        // Pick the shortest (usually the name, not the tagline)
        nonGeneric.sort((a, b) => a.length - b.length);
        t = nonGeneric[0];
      } else {
        t = parts[0];
      }
      break;
    }
  }

  // After cleaning, check again for generic titles
  if (SKIP_TITLES.has(t.toLowerCase())) return null;

  // If after cleaning it's still a domain-like name, skip
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(t)) {
    return null;
  }

  return t;
}

interface FileInfo {
  path: string;
  url: string;
  currentName: string;
  currentDesc?: string;
}

// Collect files that need updating
const filesToUpdate: FileInfo[] = [];

for (const fname of readdirSync(linksDir)) {
  if (!fname.endsWith(".yml")) continue;
  if (fname.startsWith("_")) continue;

  const fpath = join(linksDir, fname);
  let raw: string;
  try {
    raw = readFileSync(fpath, "utf-8");
  } catch {
    continue;
  }

  let data: any;
  try {
    data = yaml.parse(raw);
  } catch {
    continue;
  }

  const site = data?.site;
  if (!site) continue;

  const name = site.name;
  const url = site.url;
  const desc = site.description;

  if (!name || !url) continue;
  if (typeof name !== "string" || typeof url !== "string") continue;

  if (isDomainName(name, url) && isPlaceholderDesc(desc)) {
    filesToUpdate.push({
      path: fpath,
      url,
      currentName: name,
      currentDesc: typeof desc === "string" ? desc : undefined,
    });
  }
}

const toProcess = LIMIT > 0 ? filesToUpdate.slice(0, LIMIT) : filesToUpdate;

console.log(
  `Found ${filesToUpdate.length} files to update, processing ${toProcess.length}...`,
);

const BATCH_SIZE = 50;
const TIMEOUT_MS = 10000;

let updated = 0;
let failed = 0;
let skipped = 0;

async function fetchAndUpdate(item: FileInfo): Promise<void> {
  const fileName = item.path.split("/").pop() || "";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(item.url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      failed++;
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const pageTitle = $("title").first().text().trim();
    if (!pageTitle) {
      skipped++;
      return;
    }

    const newName = cleanTitle(pageTitle);
    if (!newName || isDomainName(newName, item.url)) {
      skipped++;
      return;
    }

    // Extract meta description
    let newDesc =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";
    newDesc = newDesc.trim();
    // Limit description length
    if (newDesc.length > 200) {
      newDesc = newDesc.slice(0, 200);
    }

    // Read & update YAML
    const content = readFileSync(item.path, "utf-8");
    const data = yaml.parse(content);
    data.site.name = newName;
    if (newDesc) {
      data.site.description = newDesc;
    }

    // Preserve field order: name, url, description, links, friends
    const output = yaml.stringify(data, {
      lineWidth: 0,
      indent: 2,
    });

    writeFileSync(item.path, output, "utf-8");
    updated++;
    console.log(
      `  ✓ ${fileName}: "${item.currentName}" → "${newName}"`,
    );
  } catch {
    failed++;
  }
}

async function main() {
  const startTime = Date.now();

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(batch.map(fetchAndUpdate));

    const done = Math.min(i + BATCH_SIZE, toProcess.length);
    if (done % 50 === 0 || done >= toProcess.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      console.log(
        `  [${elapsed}s] ${done}/${toProcess.length}` +
          ` (✓${updated} ✗${failed} —${skipped})`,
      );
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\nDone in ${elapsed}s!`);
  console.log(`  Processed: ${toProcess.length}`);
  console.log(`  Updated:   ${updated}`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Skipped:   ${skipped}`);
}

main().catch(console.error);
