import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import YAML from "yaml";

const TIMEOUT = 12000;
const SITES = ["blog.ovofish.com","blog.thatcoder.cn","seaepoch.com","blog.hesiy.cn","bioez.xyz","wjlin0.com","blog.xanz.xyz","irithys.com","blog.xomoe.cn","lanzlz.cn","nvmnode.com"];

async function extract(page: any, host: string): Promise<{ links: Array<{ name: string; url: string }>; status: string }> {
  for (const p of ["https", "http"] as const) {
    try {
      await page.goto(`${p}://${host}/friends/`, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
      await page.waitForTimeout(2000);
      // 检查是否错误页
      const isError = await page.evaluate(() => {
        const t = (document.title || "").toLowerCase();
        const b = (document.body?.innerText || "").slice(0, 200).toLowerCase();
        return ["404", "not found", "page not found", "页面不存在", "页面未找到", "找不到页面"].some(k => t.includes(k) || b.includes(k));
      }).catch(() => false);
      if (isError) return { links: [], status: "错误页" };

      const links = await page.evaluate((ex: string) => {
        const seen = new Set<string>();
        return Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
          .map(a => ({t:(a.textContent||"").trim().slice(0,80), h:a.href}))
          .filter(l => l.h.startsWith("http") && l.t.length > 2 && !l.h.includes(ex))
          .filter(l => { const k = l.h.toLowerCase().replace(/\/$/,""); if (seen.has(k)) return false; seen.add(k); return true; });
      }, host);
      if (links.length >= 2) return { links, status: "ok" };
      return { links, status: `仅 ${links.length} 个外链` };
    } catch (e: any) {
      // 继续试下一个协议
    }
  }
  return { links: [], status: "无法访问" };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ userAgent: "Mozilla/5.0" });
  let done = 0, written = 0;

  for (const host of SITES) {
    const page = await ctx.newPage();
    const { links, status } = await extract(page, host);
    await page.close();
    done++;
    const label = host.padEnd(22);
    if (status === "ok" && links.length >= 2) {
      const friends = links.map(f => ({ name: f.t.replace(/[\r\n]+/g," ").replace(/\s+/g," ").trim(), url: f.h }));
      const doc = { site: { name: host, url: `https://${host}/`, description: "友情链接", links: "/friends/", friends } };
      writeFileSync(`links/${host}.yml`, YAML.stringify(doc, { indent:2, lineWidth:0, defaultStringType:"QUOTE_SINGLE" }), "utf8");
      written++;
      console.log(`[${done}/${SITES.length}] ${label} ✅ ${friends.length} 个`);
    } else {
      console.log(`[${done}/${SITES.length}] ${label} ⏭️ ${status}`);
    }
  }

  await browser.close();
  console.log(`\n写入 ${written} 个`);
}
main();
