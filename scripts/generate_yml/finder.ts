import type { Browser } from "playwright";
import type { Anchor } from "./types";
import { looksLikeFriendLink, isLikelyNonBlog, isDebugEnabled } from "./utils";

export async function findFriendPageAnchors(
  browser: Browser,
  pageUrl: string,
  baseHost: string,
  verbose = false
): Promise<Anchor[] | null> {
  const ctx = await browser.newContext({});
  const page = await ctx.newPage();
  try {
    await page.goto(pageUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    // detect pages that return 200 but actually show a 404 / not-found message
    const bodyTextRaw = (await page.textContent("body")) || "";
    const bodyText = bodyTextRaw.toLowerCase();
    const negativeIndicators = [
      "404",
      "not found",
      "404 not found",
      "页面不存在",
      "页面未找到",
      "找不到",
      "未找到",
      "页面不存在或已删除",
    ];
    const dbg = verbose || isDebugEnabled();
    for (const ind of negativeIndicators) {
      if (bodyText.includes(ind)) {
        if (dbg)
          console.log(
            `Skipping ${pageUrl} because page body contains indicator: "${ind}"`
          );
        return null;
      }
    }

    const anchors: Anchor[] = await page.$$eval("a", (anchors) =>
      anchors.map((a) => ({
        href: (a as HTMLAnchorElement).href,
        text:
          (a as HTMLAnchorElement).innerText ||
          (a as HTMLAnchorElement).title ||
          (a as HTMLAnchorElement).textContent ||
          "",
      }))
    );

    const friendAnchors = anchors.filter(
      (a) =>
        looksLikeFriendLink(a.href, a.text, baseHost) &&
        !isLikelyNonBlog(a.href, a.text ?? "")
    );
    if (dbg)
      console.log(
        `Found ${friendAnchors.length} friend-like anchors on ${pageUrl}`
      );
    if (dbg && friendAnchors.length > 0) {
      for (const a of friendAnchors) {
        console.log(`  -> ${a.href}  [${(a.text || "").slice(0, 80)}]`);
      }
    }
    return friendAnchors;
  } catch (err) {
    const dbg = verbose || isDebugEnabled();
    if (dbg) console.warn(`Failed to open ${pageUrl}:`, err);
    return null;
  } finally {
    try {
      await ctx.close();
    } catch {
      // ignore close errors
    }
  }
}
