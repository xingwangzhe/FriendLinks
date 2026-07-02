/**
 * 友链过滤器 — 共享模块
 * 被 fetch-*.ts 和 prune-irrelevant.ts 共用
 */

import { createHash } from "node:crypto";
import { JUNK_NAME_PATTERNS, JUNK_NAME_PATTERNS_LEGACY } from "./filter/names";
import { JUNK_URL_PATTERNS } from "./filter/urls";
import { NON_BLOG_DOMAINS } from "./filter/domains";
import { SENSITIVE_DOMAINS } from "./filter/sensitive";
import { SERVICE_SUBDOMAINS } from "./filter/subdomains";
import { PLATFORM_HOSTS } from "./filter/platforms";
import { WHITELIST_DOMAINS } from "./filter/whitelist";

// ─── 预计算加速结构 ──────────────────────────────────────────
const NON_BLOG_SET = new Set(NON_BLOG_DOMAINS);
const SENSITIVE_SET = new Set(SENSITIVE_DOMAINS);
const WHITELIST_SET = new Set(WHITELIST_DOMAINS);

// ─── 过滤函数 ──────────────────────────────────────────────────

export type JunkResult = { junk: boolean; reason?: string };

export function isJunkEntry(f: { name: string; url: string }, siteUrl?: string): boolean {
  return isJunkEntryWithReason(f, siteUrl).junk;
}

export function isJunkEntryWithReason(f: { name: string; url: string }, siteUrl?: string): JunkResult {
  const name = (f.name || "").trim();
  const url = (f.url || "").trim();

  // ── URL 格式检查 ──────────────────────────────────────────
  if (url.includes("https:// https://") || url.includes("http:// http://")) return { junk: true, reason: "URL格式异常(双重协议)" };
  if (/^https?:\/\//i.test(name) && /^https?:\/\//i.test(url)) return { junk: true, reason: "URL格式异常(name=URL)" };
  for (const p of JUNK_URL_PATTERNS) {
    if (p.test(url)) return { junk: true, reason: `URL匹配: ${p.source}` };
  }

  // 无效 URL 格式
  if (/^https?:\/\/\s/.test(url)) return { junk: true, reason: "URL格式: 冒号后空格" };
  if (/^https?:\/\/$/.test(url)) return { junk: true, reason: "URL格式: 无主机" };
  if (/^https?:\/\/#/.test(url)) return { junk: true, reason: "URL格式: 纯锚点" };

  // ── 域名检查 ────────────────────────────────────────────
  let hostname = "";
  let pathname = "";
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    hostname = parsed.hostname.toLowerCase();
    pathname = parsed.pathname;
  } catch { return { junk: true, reason: "URL解析失败" }; }

  // 绝对白名单 — 无论如何不被过滤
  if (WHITELIST_SET.has(hostname) || WHITELIST_SET.has(hostname.replace(/^www\./, ""))) return { junk: false };

  // 友链必须指向首页（无子路由、无查询参数）
  if (pathname !== "/" && pathname !== "") {
    const seg = pathname.split("/").filter(Boolean)[0] || "";
    return { junk: true, reason: `子路由: /${seg}...` };
  }
  if (hostname && new URL(url.startsWith("http") ? url : `https://${url}`).search) return { junk: true, reason: "带查询参数(?xxx)" };

  if (/^api[.-]/i.test(hostname)) return { junk: true, reason: "API子域名" };
  if (SERVICE_SUBDOMAINS.test(hostname)) return { junk: true, reason: "服务子域名" };

  // 非博客域名（明文，支持子域名匹配）— O(1) Set 查找
  const hostParts = hostname.split(".");
  for (let i = 0; i < hostParts.length; i++) {
    const suffix = hostParts.slice(i).join(".");
    if (NON_BLOG_SET.has(suffix)) return { junk: true, reason: `非博客域名: ${suffix}` };
  }

  // 敏感域名（SHA-256 哈希）
  if (SENSITIVE_SET.has(createHash("sha256").update(hostname).digest("hex"))) return { junk: true, reason: "敏感域名" };

  // 仅排除个人绝对无法注册的机构域名
  const instMatch = hostname.match(/\.(edu|gov|mil|go|ac\.(?:uk|jp|za|in|kr|nz|au|th|id|sg|my|ph|pk|bd|lk|np|tw|hk|mo))(\.[a-z]{2})?$/);
  if (instMatch) return { junk: true, reason: `机构域名(.${instMatch[1]}${instMatch[2] || ""})` };

  // IP 地址
  if (/^https?:\/\/(\d{1,3}\.){3}\d{1,3}/.test(url)) return { junk: true, reason: "IP地址" };

  // 自引用
  if (siteUrl && isSelfReference(url, siteUrl)) return { junk: true, reason: "自引用" };

  // ── 名称检查 ────────────────────────────────────────────
  for (const p of JUNK_NAME_PATTERNS) {
    if (p.test(name)) return { junk: true, reason: `名称匹配: ${p.source}` };
  }
  for (const p of JUNK_NAME_PATTERNS_LEGACY) {
    if (p.test(name)) return { junk: true, reason: `名称匹配: ${p.source}` };
  }
  if (/^\d+$/.test(name)) return { junk: true, reason: "纯数字名称" };
  if ([...name].length === 1) return { junk: true, reason: "单字符名称" };

  return { junk: false };
}

export function isSelfReference(url: string, siteUrl: string): boolean {
  try {
    const friendHost = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    const siteHost = new URL(siteUrl).hostname;
    const f = friendHost.replace(/^www\./, "");
    const s = siteHost.replace(/^www\./, "");
    if (f === s) return true;

    const onPlatform = (h: string) => PLATFORM_HOSTS.some(p => h === p || h.endsWith("." + p));
    const regDomain = (h: string) => {
      if (onPlatform(h)) return h;
      const parts = h.split(".");
      return parts.length > 2 ? parts.slice(1).join(".") : h;
    };
    return regDomain(f) === regDomain(s);
  } catch { return false; }
}

export function filterFriends(friends: Array<{ name: string; url: string }>, siteUrl?: string): Array<{ name: string; url: string }> {
  return friends.filter(f => {
    if (!f || typeof f !== "object") return false;
    if (!f.name || !f.url) return false;
    if (isJunkEntry(f, siteUrl)) return false;
    return true;
  });
}
