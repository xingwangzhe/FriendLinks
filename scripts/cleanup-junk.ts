/**
 * 友链垃圾条目清理脚本
 *
 * 遍历 links/*.yml，剔除爬虫误抓的非友链条目。
 *
 * 用法: bun scripts/cleanup-junk.ts
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";

// ─── 垃圾名称模式（大小写不敏感） ──────────────────────────────

const JUNK_NAME_PATTERNS: RegExp[] = [
  // 备案号
  /备案/i, /beian/i, /icp/i, /公网安备/i,
  // 技术框架（独立成条目，非友链）
  /^(Astro|Hexo|Valaxy|Vue(\.js)?|React|Next\.js|Nuxt|Hugo|WordPress|Typecho)$/i,
  /^(Butterfly|Volantis|Fluid|Clarity|Pure|Waline|Twikoo|Giscus)$/i,
  /^(Theme:?\s|主题:)/i,
  /^Markdown Guide$/i,
  // 部署/云服务
  /^(Vercel|Cloudflare|Netlify|EdgeOne)$/i,
  // 社交平台（独立名称）
  /^(QQ|QQ群\s*\d+|GitHub|Github|Gitee|Twitter|知乎|B站|哔哩哔哩|bilibili|网易云音乐)$/i,
  // 赞助
  /^(Sponsor|赞助|Donate)/i,
  // 联盟/导航
  /^开往$/i, /^Travelling$/i,
  // 订阅/RSS/评论
  /^(订阅|RSS|Feed)/i,
  /^(订阅本文评论|订阅本站评论)$/i,
  // 萌ICP
  /^萌ICP备/i,
  // 项目/操作类
  /^(项目主页|Create A Pull Request|Visit)$/i,
  // 本站自指
  /本站|本网站|本博客/i,
  // 友链页面自身
  /^(友链|友情链接|申请友链|Links?|申请链接)$/i,
  // 首页/关于
  /^(首页|关于|关于我|about|home)$/i,
  // 404/错误
  /^(404|页面未找到|Redirect|Redirecting)$/i,
  // Powered by / Theme by
  /^Theme by|^Powered by|^Proudly powered/i,
  // 服务类
  /图床|网盘|CDN|短链|短网址|云盘|存储/,
  // 监控/状态
  /监控|Monitor|Status|Uptime|状态/,
  // 加速/API
  /文件加速|加速|API接口|接口/,
  // 工具类
  /工具|助手|导航/,
  // 随机/开往（变体）
  /随机|开往项目/i,
];

// ─── 垃圾 URL 模式 ─────────────────────────────────────────────

const JUNK_URL_PATTERNS: RegExp[] = [
  /beian\./i,
  /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?|$)/i,
  /rss\.xml/i,
  // 项目仓库而非个人博客
  /github\.com\/(withastro|YunYouJun|walinejs)\//i,
  // mailto 协议
  /^mailto:/i,
];

// ─── 清理函数 ─────────────────────────────────────────────────

function isJunkEntry(f: { name: string; url: string }, siteUrl?: string): boolean {
  const name = (f.name || "").trim();
  const url = (f.url || "").trim();

  // URL 双重协议
  if (url.includes("https:// https://") || url.includes("http:// http://")) return true;

  // 名称以 URL 开头（图片/文件链接被解析成了名称）
  if (/^https?:\/\//i.test(name) && /^https?:\/\//i.test(url)) return true;

  // 名称匹配垃圾模式
  for (const p of JUNK_NAME_PATTERNS) {
    if (p.test(name)) return true;
  }

  // URL 匹配垃圾模式
  for (const p of JUNK_URL_PATTERNS) {
    if (p.test(url)) return true;
  }

  // 域名以 api 开头（如 api.xxx.com，非友链，通常是接口服务）
  try {
    const hostname = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    if (/^api[.-]/i.test(hostname)) return true;
    // 知名非博客服务子域名：cloud/img/cdn/static/git/status/monitor/nav/wiki
    if (/^(cloud|img|cdn|static|assets|media|files?|dl|download|upload|git|status|monitor|nav|wiki|help|support|m|mobile)[.-]/i.test(hostname)) return true;
  } catch {}

  // 知名非博客平台域名
  try {
    const hostname = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
    const nonBlogDomains = [
      "github.com", "gitee.com", "gitlab.com", "bitbucket.org",
      "travellings.cn", "www.travellings.cn", "rss.travellings.cn", "rss-source.travellings.cn",
      "beian.miit.gov.cn", "beian.mps.gov.cn", "www.beian.gov.cn",
      "icp.gov.moe", "icp.gs", "travel.moe", "moicp.cn", "icp.cab", "icp.n3v.cn",
      "vercel.com", "netlify.app", "netlify.com", "cloudflare.com",
      "zhihu.com", "www.zhihu.com",
      "bilibili.com", "space.bilibili.com", "www.bilibili.com",
      "twitter.com", "x.com",
      "music.163.com",
      "github.io", "pages.dev", "vercel.app", "r2.dev",
      "guides.github.com",
      // 博客聚合/导航/圈子（非个人博客）
      "boyouquan.com", "www.boyouquan.com",
      "blogsclub.org", "www.blogsclub.org",
      "blogplanet.cn", "www.blogplanet.cn",
      "blogscn.fun",
      "blog114.com",
      "boke.lu",
      "bokequan.cn",
      "blogtalk.org",
      "storeweb.cn",
      "haozhan.wang",
      "zhblogs.net", "www.zhblogs.net",
      "foreverblog.cn", "www.foreverblog.cn",
      "rmbk.cc", "www.rmbk.cc",
      "jiuchan.org", "hi.jiuchan.org",
      "bloginc.cn",
      "findblog.net", "www.findblog.net",
      "morerss.com",
      "dogerolls.com",
      "boringbay.com",
      // 社交/分享
      "facebook.com", "www.facebook.com",
      "reddit.com",
      "linkedin.com", "www.linkedin.com",
      "pinterest.com",
      "telegram.me", "t.me",
      "whatsapp.com", "api.whatsapp.com",
      "tumblr.com", "www.tumblr.com",
      "blogger.com", "www.blogger.com",
      "douban.com", "www.douban.com",
      "weibo.com", "service.weibo.com",
      "qq.com", "connect.qq.com",
      "qzone.qq.com",
    ];
    if (nonBlogDomains.some(d => hostname === d || hostname.endsWith("." + d))) return true;
  } catch {}

  // 自引用：友链的域名与站点自身域名相同
  if (siteUrl && isSelfReference(url, siteUrl)) return true;

  // IP 地址 URL
  if (/^https?:\/\/(\d{1,3}\.){3}\d{1,3}/.test(url)) return true;

  // 纯数字名称
  if (/^\d+$/.test(name)) return true;

  // 单字符名称（绝大多数是爬虫解析错误）
  if ([...name].length === 1) return true;

  return false;
}

function isSelfReference(url: string, siteUrl: string): boolean {
  try {
    const friendHost = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    const siteHost = new URL(siteUrl).hostname;
    // 去掉 www. 前缀再比一次，增加匹配率
    const friendHostNorm = friendHost.replace(/^www\./, "");
    const siteHostNorm = siteHost.replace(/^www\./, "");
    return friendHostNorm === siteHostNorm;
  } catch {
    return false;
  }
}

function isHealthyEntry(f: { name: string; url: string }): boolean {
  const name = (f.name || "").trim();
  const url = (f.url || "").trim();
  if (!name || !url) return false;
  return true;
}

function deduplicate(friends: any[]): { deduped: any[]; removed: number } {
  const seen = new Set<string>();
  const deduped: any[] = [];
  let removed = 0;
  for (const f of friends) {
    const url = (f.url || "").trim().toLowerCase();
    if (url && seen.has(url)) {
      removed++;
      continue;
    }
    seen.add(url);
    deduped.push(f);
  }
  return { deduped, removed };
}

function cleanupFriends(friends: any[], siteUrl?: string): { cleaned: any[]; removed: number } {
  // 第一步：剔除垃圾条目
  const filtered = friends.filter((f) => {
    if (!f || typeof f !== "object") return false;
    if (!isHealthyEntry(f)) return false;
    if (isJunkEntry(f, siteUrl)) return false;
    return true;
  });

  const removedCount = friends.length - filtered.length;

  // 第二步：去重（同文件内相同 URL 只保留一个）
  const { deduped, removed: dupRemoved } = deduplicate(filtered);

  return { cleaned: deduped, removed: removedCount + dupRemoved };
}

// ─── 主流程 ────────────────────────────────────────────────────

function main() {
  const dir = resolve("links");
  const files = readdirSync(dir).filter((f) => f.endsWith(".yml"));

  let totalRemoved = 0;
  let totalFiles = 0;
  let totalFilesChanged = 0;

  for (const file of files) {
    const filePath = resolve(dir, file);
    const text = readFileSync(filePath, "utf8");
    const obj = YAML.parse(text);
    if (!obj?.site) continue;

    const site = obj.site;
    if (!Array.isArray(site.friends)) continue;

    const { cleaned, removed } = cleanupFriends(site.friends, site.url);
    totalRemoved += removed;

    if (removed > 0) {
      site.friends = cleaned;
      const output = YAML.stringify(obj, {
        indent: 2,
        lineWidth: 0,
        defaultStringType: "QUOTE_SINGLE",
      });
      writeFileSync(filePath, output, "utf8");
      totalFilesChanged++;
    }

    totalFiles++;
  }

  console.log(`扫描文件: ${totalFiles}`);
  console.log(`修改文件: ${totalFilesChanged}`);
  console.log(`剔除条目: ${totalRemoved}`);
}

main();
