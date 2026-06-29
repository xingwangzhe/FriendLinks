import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import YAML from "yaml";

const TIMEOUT = 12000;
const SITES = ["blog.ybyq.wang","onyi.net","shangjidong.com","kazuhahub.com","gx.gx.cn","idh.cc","blog.zc.wiki","treemoe.cn","hhxg.top","blog.wssss.org","blog.qyus.cn","blog.moyanjdc.top"];

async function extract(page: any, host: string) {
  for (const p of ["https","http"] as const) {
    try {
      await page.goto(`${p}://${host}/friends.html`, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
      await page.waitForTimeout(2000);
      const links = await page.evaluate((ex: string) => {
        const seen = new Set<string>();
        return Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
          .map(a => ({t:(a.textContent||"").trim().slice(0,80), h:a.href}))
          .filter(l => l.h.startsWith("http") && l.t.length > 2 && !l.h.includes(ex))
          .filter(l => { const k = l.h.toLowerCase().replace(/\/$/,""); if (seen.has(k)) return false; seen.add(k); return true; });
      }, host);
      if (links.length >= 2) return links;
    } catch {}
  }
  return [];
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ userAgent: "Mozilla/5.0" });
  let done = 0, written = 0;

  for (const host of SITES) {
    const page = await ctx.newPage();
    const links = await extract(page, host);
    await page.close();
    done++;
    const label = host.padEnd(22);
    if (links.length >= 2) {
      const friends = links.map(f => ({ name: f.t.replace(/[\r\n]+/g," ").replace(/\s+/g," ").trim(), url: f.h }));
      const doc = { site: { name: host, url: `https://${host}/`, description: "友情链接", links: "/friends.html", friends } };
      writeFileSync(`links/${host}.yml`, YAML.stringify(doc, { indent:2, lineWidth:0, defaultStringType:"QUOTE_SINGLE" }), "utf8");
      written++;
      console.log(`[${done}/${SITES.length}] ${label} ✅ ${friends.length} 个`);
    } else {
      console.log(`[${done}/${SITES.length}] ${label} ⏭️ 跳过`);
    }
  }

  await browser.close();
  console.log(`\n写入 ${written} 个`);
}
main();
