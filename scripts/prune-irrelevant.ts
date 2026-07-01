/**
 * 友链无关条目剔除脚本
 *
 * 遍历 links/*.yml，剔除爬虫误抓的非友链条目。
 * 过滤规则定义在 scripts/filter/ 目录下。
 *
 * 用法: bun scripts/prune-irrelevant.ts
 */

import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";
import { isJunkEntryWithReason } from "./filter";

// ─── 主流程 ────────────────────────────────────────────────────

async function main() {
  const dir = resolve("links");
  const files = readdirSync(dir).filter((f) => f.endsWith(".yml"));

  let totalRemoved = 0;
  let totalFiles = 0;
  let totalFilesChanged = 0;

  // 并发处理（Bun 原生异步 I/O）
  const CONCURRENCY = 64;
  const queue = [...files];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (true) {
      const file = queue.shift();
      if (!file) break;

      const filePath = resolve(dir, file);
      const text = await Bun.file(filePath).text();
      let obj: any;
      try { obj = YAML.parse(text); } catch { continue; }
      if (!obj?.site) continue;

      const site = obj.site;
      if (!Array.isArray(site.friends)) continue;

      const before = site.friends.map((f: any) => `${f.name || ""}  ${f.url || ""}`);
      const { cleaned, removed, reasons } = cleanupFriends(site.friends, site.url);

      if (removed > 0) {
        const after = new Set(cleaned.map((f: any) => `${f.name || ""}  ${f.url || ""}`));
        const removedEntries = before.filter((e: string) => !after.has(e));
        // 缓冲输出避免交错
        let out = `\n📄 ${file} 剔除 ${removed} 条:\n`;
        for (const e of removedEntries) {
          const lastSpace = e.lastIndexOf("  ");
          const name = e.slice(0, lastSpace);
          const url = e.slice(lastSpace + 2);
          const reason = reasons.get(url) || "";
          out += `   ❌ ${name.padEnd(28)} ${url.padEnd(42)} [${reason}]\n`;
        }
        process.stdout.write(out);
      }

      if (cleaned.length === 0) {
        try { await Bun.file(filePath).delete(); } catch {}
        if (removed > 0 || site.friends.length > 0) totalFilesChanged++;
      } else if (removed > 0) {
        site.friends = cleaned;
        const output = YAML.stringify(obj, {
          indent: 2,
          lineWidth: 0,
          defaultStringType: "QUOTE_SINGLE",
        });
        await Bun.write(filePath, output);
        totalFilesChanged++;
      }

      totalRemoved += removed;
      totalFiles++;
    }
  });
  await Promise.all(workers);

  console.log(`\n扫描文件: ${totalFiles}`);
  console.log(`修改文件: ${totalFilesChanged}`);
  console.log(`剔除条目: ${totalRemoved}`);
}

function cleanupFriends(friends: any[], siteUrl?: string): { cleaned: any[]; removed: number; reasons: Map<string, string> } {
  const reasons = new Map<string, string>();
  const filtered: any[] = [];
  for (const f of friends) {
    if (!f || typeof f !== "object") continue;
    if (!(f.name && f.url)) continue;
    const result = isJunkEntryWithReason(f, siteUrl);
    if (result.junk) {
      reasons.set(f.url, result.reason || "未知原因");
    } else {
      filtered.push(f);
    }
  }
  const removedCount = friends.length - filtered.length;
  const { deduped: hostDeduped, removed: hostDuped } = deduplicateByHost(filtered);
  for (const r of hostDuped) reasons.set(r.url, "同域名重复(保留最短路径)");
  const { deduped, removed: urlDuped } = deduplicate(hostDeduped);
  for (const r of urlDuped) reasons.set(r.url, "URL完全重复");
  return { cleaned: deduped, removed: removedCount + hostDuped.length + urlDuped.length, reasons };
}

function deduplicateByHost(friends: any[]): { deduped: any[]; removed: any[] } {
  const best = new Map<string, { entry: any; pathLen: number }>();
  const removed: any[] = [];
  for (const f of friends) {
    const url = (f.url || "").trim();
    try {
      const u = new URL(url.startsWith("http") ? url : `https://${url}`);
      const host = u.hostname.toLowerCase();
      const pathLen = u.pathname.replace(/\/$/, "").split("/").filter(Boolean).length;
      const existing = best.get(host);
      if (!existing || pathLen < existing.pathLen) {
        if (existing) removed.push(existing.entry);
        best.set(host, { entry: f, pathLen });
      } else {
        removed.push(f);
      }
    } catch {}
  }
  return { deduped: Array.from(best.values()).map(v => v.entry), removed };
}

function deduplicate(friends: any[]): { deduped: any[]; removed: any[] } {
  const seen = new Set<string>();
  const deduped: any[] = [];
  const removed: any[] = [];
  for (const f of friends) {
    const url = (f.url || "").trim().toLowerCase();
    if (url && seen.has(url)) { removed.push(f); continue; }
    seen.add(url);
    deduped.push(f);
  }
  return { deduped, removed };
}

main();
