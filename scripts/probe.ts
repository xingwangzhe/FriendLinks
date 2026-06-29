/**
 * 全局友链路由探测脚本
 *
 * 对每个站点依次尝试所有常见友链路由，找到友链最多的那条写入 YAML。
 * 写入前自动经过 filterFriends 过滤。
 *
 * 用法:
 *   bun run scripts/probe.ts                              # 探测所有 links/*.yml 中 friend 指向的子链
 *   bun run scripts/probe.ts https://example.com          # 探测单个站点
 *   bun run scripts/probe.ts --urls url1,url2             # 探测指定站点列表
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { chromium } from "playwright";
import YAML from "yaml";
import { filterFriends } from "./filter";

const TIMEOUT = 15000;
const RENDER_WAIT = 2000;

const ROUTES = [
  "/links", "/link", "/friends", "/friend", "/links.html", "/friends.html",
  "/flink", "/link/", "/friends/", "/friend-links", "/friend_link", "/peers",
  "/friend/link",
  "/page/friendlinks", "/page/friendlinks/",
];

async function probeOne(
  page: any,
  host: string,
): Promise<{ route: string; links: Array<{ name: string; url: string }> } | null> {
  for (const route of ROUTES) {
    for (const proto of ["https", "http"] as const) {
      const url = `${proto}://${host}${route}`;
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
        await page.waitForTimeout(RENDER_WAIT);

        // 检查页面标题和内容是否指示 404/错误页（即使 HTTP 200）
        const pageCheck = await page.evaluate(() => {
          const title = (document.title || "").toLowerCase();
          const body = (document.body?.innerText || "").slice(0, 200).toLowerCase();
          const errorKeywords = ["404", "not found", "page not found", "页面不存在", "页面未找到",
            "页面没有找到", "找不到页面", "无法访问", "error", "页面失效"];
          return errorKeywords.some(k => title.includes(k) || body.includes(k));
        });
        if (pageCheck) continue; // 是错误页，跳过此路由

        const links = await page.evaluate((exHost: string) => {
          const seen = new Set<string>();
          return Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
            .map(a => ({ t: (a.textContent || "").trim().slice(0, 80), h: a.href }))
            .filter(l => l.h.startsWith("http") && l.t.length > 2)
            .filter(l => {
              try { return !new URL(l.h).hostname.includes(exHost); } catch { return true; }
            })
            .filter(l => {
              const key = l.h.toLowerCase().replace(/\/$/, "");
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
        }, host);

        if (links.length >= 3) {
          return { route, links };
        }
      } catch {
        // 超时或无响应，跳过
      }
    }
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  let targets: string[] = [];

  if (args.length === 0) {
    // 默认模式：从已有 links/*.yml 的 friends 中收集子链并去重
    const files = readdirSync("links").filter(f => f.endsWith(".yml"));
    const seen = new Set<string>();
    for (const f of files) {
      try {
        const obj = YAML.parse(readFileSync(`links/${f}`, "utf8"));
        const friends = obj?.site?.friends || [];
        for (const fr of friends) {
          try {
            const host = new URL(fr.url).hostname.replace(/^www\./, "").toLowerCase();
            if (!seen.has(host) && !existsSync(`links/${host}.yml`)) {
              seen.add(host);
              targets.push(host);
            }
          } catch {}
        }
      } catch {}
    }
    // 也加几个已知的热门路由站点
    console.log(`从现有友链中收集到 ${targets.length} 个未收录站点`);
  } else if (args[0] === "--urls") {
    targets = args[1]?.split(",").map(s => {
      try { return new URL(s).hostname.replace(/^www\./, ""); } catch { return s; }
    }) || [];
  } else {
    targets = args.map(s => {
      try { return new URL(s).hostname.replace(/^www\./, ""); } catch { return s; }
    });
  }

  if (targets.length === 0) {
    console.log("没有需要探测的目标");
    process.exit(0);
  }

  // 过滤掉已收录的
  targets = targets.filter(h => !existsSync(`links/${h}.yml`));
  console.log(`实际需要探测: ${targets.length} 个`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  });

  let done = 0, written = 0, failed = 0;

  async function processOne(host: string) {
    const page = await context.newPage();
    let probeResult: Awaited<ReturnType<typeof probeOne>> = null;
    let filtered: Array<{ name: string; url: string }> = [];
    try {
      probeResult = await probeOne(page, host);
      if (probeResult) {
        const raw = probeResult.links.map(f => ({
          name: f.t.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim(),
          url: f.h,
        }));
        filtered = filterFriends(raw, `https://${host}/`);
        if (filtered.length >= 2) {
          const doc = {
            site: { name: host, url: `https://${host}/`, description: "友情链接", links: probeResult.route, friends: filtered },
          };
          writeFileSync(`links/${host}.yml`, YAML.stringify(doc, { indent: 2, lineWidth: 0, defaultStringType: "QUOTE_SINGLE" }), "utf8");
          written++;
        }
      }
    } catch { failed++; }
    await page.close();
    done++;
    const status = probeResult ? `✅ ${probeResult.route} (${filtered.length})` : "⏭️";
    console.log(`[${String(done).padStart(3)}/${targets.length}] ${host.padEnd(24)} ${status}`);
  }

  for (const host of targets) {
    await processOne(host);
  }

  await browser.close();
  console.log(`\n完成: 探测 ${targets.length}, 写入 ${written} 个, 失败 ${failed}`);
}

main();
