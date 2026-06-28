#!/usr/bin/env -S bun --bun run
/**
 * 子链友链路由探测脚本（30并发，串行输出，txt 仅过滤结果）
 * 遍历所有子链，探测友链路由，输出结果到控制台和 txt 文件
 *
 * 结果中 filtered 部分 = 成功找到路由 且 非主站
 *
 * 用法:
 *   bun --bun bunx scripts/probe_subs.ts    # 推荐
 *   bun scripts/probe_subs.ts               # 简洁
 *   ./scripts/probe_subs.ts                 # 直接执行（需 chmod +x）
 */

import { appendFileSync, writeFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import type { BrowserContext } from "playwright";

const LINKS_DIR = path.resolve(process.cwd(), "links");
const OUTPUT_TXT = path.resolve(process.cwd(), "probe_result.txt");
const TIMEOUT = 5000;
const RENDER_WAIT = 2000;
const CONCURRENCY = 30;

const ROUTES = [
  "/links", "/link", "/friends", "/friend", "/links.html", "/friends.html",
  "/flink", "/link/", "/friends/", "/friend-links", "/friend_link", "/peers",
  "/links.html", "/page/friendlinks", "/page/friendlinks/",
  "/yourenzhang", "/yourenzhang/", "/about",
];

interface ProbeResult {
  host: string;
  url: string;
  route: string | null;
  friendsCount: number;
  title: string;
}

interface ProbeOutcome {
  logs: string[];
  result: ProbeResult;
  isMain: boolean;
}

function getHost(u: string): string {
  try { return new URL(u).hostname.toLowerCase().replace(/^www\./, ""); } catch { return ""; }
}

function getBase(u: string): string | null {
  try { const url = new URL(u); return `${url.protocol}//${url.host}`; } catch { return null; }
}

// ---- 串行输出锁 ----
let printLock: Promise<void> = Promise.resolve();
function serialLog(text: string): Promise<void> {
  printLock = printLock.then(() => { console.log(text); });
  return printLock;
}

async function probeOne(context: BrowserContext, subUrl: string, coreHosts: Set<string>): Promise<ProbeOutcome | null> {
  const host = getHost(subUrl);
  const base = getBase(subUrl);
  if (!host || !base) return null;

  let foundRoute: string | null = null;
  let friendsCount = 0;
  let title = "";
  const logs: string[] = [];

  for (const route of ROUTES) {
    for (const proto of ["https", "http"] as const) {
      const pageUrl = `${proto}://${host}${route}`;
      logs.push(`   ${proto}${route}... `);
      const page = await context.newPage();
      let loaded = false;
      try {
        const resp = await page.goto(pageUrl, { waitUntil: "networkidle", timeout: TIMEOUT }).catch(() =>
          page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: TIMEOUT })
        );
        if (resp) {
          loaded = true;
          await page.waitForTimeout(RENDER_WAIT);
          const status = resp.status();
          const ct = (resp.headers()["content-type"] || "").toLowerCase();
          const ctOk = !ct.includes("octet-stream") && !ct.includes("image/");
          if ((status >= 200 && status < 400) && ctOk) {
            const anchors = await page.evaluate((ex: string) => {
              return Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
                .map(a => ({ t: (a.textContent || '').trim(), h: a.getAttribute('href') }))
                .filter(l => l.t && l.h && l.h.startsWith('http') && !l.h.includes(ex))
                .filter(l => l.t.length > 1 && l.t.length < 100);
            }, host);
            logs[logs.length - 1] += `${anchors.length}链接`;
            if (anchors.length >= 2) {
              foundRoute = route;
              friendsCount = anchors.length;
              title = await page.title().catch(() => "");
              await page.close();
              break;
            }
          } else {
            logs[logs.length - 1] += `✗ status=${status} ct=${ct}`;
          }
        } else {
          logs[logs.length - 1] += `✗ 无响应`;
        }
      } catch {
        if (!loaded) logs[logs.length - 1] += `✗ 超时/失败`;
      }
      await page.close();
    }
    if (foundRoute) break;
  }

  if (!foundRoute) {
    for (const proto of ["https", "http"] as const) {
      const pageUrl = `${proto}://${host}`;
      logs.push(`   首页 ${proto}... `);
      const page = await context.newPage();
      let loaded = false;
      try {
        const resp = await page.goto(pageUrl, { waitUntil: "networkidle", timeout: TIMEOUT }).catch(() =>
          page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: TIMEOUT })
        );
        if (resp) {
          loaded = true;
          await page.waitForTimeout(RENDER_WAIT);
          const status = resp.status();
          const ctOk = !((resp.headers()["content-type"] || "").toLowerCase().includes("octet-stream"));
          if ((resp.ok() || (status >= 300 && status < 400)) && ctOk) {
            const anchors = await page.evaluate((ex: string) => {
              return Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
                .map(a => ({ t: (a.textContent || '').trim(), h: a.getAttribute('href') }))
                .filter(l => l.t && l.h && l.h.startsWith('http') && !l.h.includes(ex))
                .filter(l => l.t.length > 1 && l.t.length < 100);
            }, host);
            logs[logs.length - 1] += `${anchors.length}链接`;
            if (anchors.length >= 2) {
              foundRoute = "/";
              friendsCount = anchors.length;
              title = await page.title().catch(() => "");
            }
          } else {
            logs[logs.length - 1] += `✗ status=${status}`;
          }
        } else {
          logs[logs.length - 1] += `✗ 无响应`;
        }
      } catch {
        if (!loaded) logs[logs.length - 1] += `✗ 超时/失败`;
      }
      await page.close();
      if (foundRoute) break;
    }
  }

  const isMain = coreHosts.has(host);
  const tag = isMain ? "🟡已是主站" : foundRoute ? "🟢可新增" : "⚪未找到路由";
  const extra = foundRoute
    ? ` route=${foundRoute} ${friendsCount}友链 "${title.substring(0, 50)}"`
    : "";
  logs.push(`结果: ${tag}${extra}`);

  return {
    logs,
    result: { host, url: base, route: foundRoute, friendsCount, title: title.substring(0, 80) },
    isMain,
  };
}

async function main() {
  console.log("=".repeat(70));
  console.log("子链友链路由探测（30并发 · 串行输出）");
  console.log("=".repeat(70));
  console.log("");

  // 1. 收集主站 host
  const files = (await readdir(LINKS_DIR)).filter(f => f.endsWith(".yml") || f.endsWith(".yaml"));
  const coreHosts = new Set<string>();
  const allSubUrls = new Set<string>();

  for (const file of files) {
    try {
      const doc = YAML.parse(await readFile(path.join(LINKS_DIR, file), "utf8")) as Record<string, any>;
      if (!doc?.site) continue;
      const h = getHost(doc.site.url);
      if (h) coreHosts.add(h);
      if (Array.isArray(doc.site.friends)) {
        for (const f of doc.site.friends) {
          if (f.url) allSubUrls.add(f.url);
        }
      }
    } catch {}
  }

  const probeUrls = Array.from(allSubUrls)
    .filter(u => !coreHosts.has(getHost(u)));

  console.log(`主站: ${coreHosts.size} | 子链总数: ${allSubUrls.size} | 待探测: ${probeUrls.length}`);
  console.log("");

  // 初始化 txt（清空写表头）
  writeFileSync(OUTPUT_TXT, "可新增的主站列表\n" + "=".repeat(60) + "\n格式: host | 路由 | 友链数 | 标题\n\n", "utf8");

  // 2. 启动浏览器
  const pw = await import("playwright");
  const browser = await pw.chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    locale: "zh-CN",
  });

  // 3. 30 并发探测
  const queue: string[] = [...probeUrls];
  let done = 0;
  let successCount = 0;

  async function worker() {
    while (true) {
      const subUrl = queue.shift();
      if (!subUrl) break;

      const curIdx = ++done;
      const ret = await probeOne(context, subUrl, coreHosts);
      if (!ret) continue;

      // 串行输出（不影响并发探测）
      await serialLog(`[${curIdx}/${probeUrls.length}] ${getHost(subUrl)}`);
      for (const line of ret.logs) {
        await serialLog(line);
      }

      // txt 写入：仅过滤结果（可新增且非主站）
      if (!ret.isMain && ret.result.route) {
        successCount++;
        const line = `${ret.result.host} | ${ret.result.route} | ${ret.result.friendsCount} | ${ret.result.title}\n`;
        appendFileSync(OUTPUT_TXT, line, "utf8");
      }
    }
  }

  const poolSize = Math.min(CONCURRENCY, queue.length);
  const workers = Array.from({ length: poolSize }, () => worker());
  await Promise.all(workers);

  await browser.close();

  // 4. 汇总
  console.log("\n" + "=".repeat(70));
  console.log(`探测完成！共处理 ${done} 个子链`);
  console.log(`可新增主站: ${successCount} 个`);
  console.log("=".repeat(70));
  console.log(`\n结果已保存到: ${OUTPUT_TXT}`);
  console.log("\n完成！");
}

main().catch(e => { console.error("错误:", e); process.exit(1); });
