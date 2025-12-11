import {
  IGNORED_HOSTS,
  AGGREGATORS,
  RESOURCE_EXT_REGEX,
  NON_BLOG_TEXT_INDICATORS,
} from "./types";

// Sanitize label text (trim, collapse whitespace, decode a few HTML entities)
export function sanitizeLabel(text: string): string {
  if (!text) return "";
  let out = text.replace(/\s+/g, " ").trim();
  out = out
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  out = out.slice(0, 200).trim();
  return out;
}

export function hostnameFromUrl(url: string): string | null {
  try {
    // Return the full hostname (preserve subdomains like `www`)
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isLikelyNonBlog(href: string, text?: string): boolean {
  if (!href) return true;
  const host = hostnameFromUrl(href);
  if (!host) return true;
  if (hostMatchesSet(host, IGNORED_HOSTS)) return true;
  if (hostMatchesSet(host, AGGREGATORS)) return true;
  if (RESOURCE_EXT_REGEX.test(href)) return true;
  if (text) {
    const t = text.toLowerCase();
    if (NON_BLOG_TEXT_INDICATORS.some((i) => t.includes(i))) return true;
  }
  return false;
}

// Match host against a set of domain fragments using suffix match so subdomains match.
export function hostMatchesSet(host: string, set: Set<string>): boolean {
  if (!host) return false;
  // Normalize host to lower-case (do not strip subdomains like `www`)
  const hostNorm = host.toLowerCase();
  for (const rawItem of set) {
    if (!rawItem) continue;
    // Normalize item: remove protocol and path, strip www.
    const item = String(rawItem)
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0];
    if (!item) continue;
    // Use substring matching so entries like "example" or "example.com/path" match hosts containing them.
    if (hostNorm.includes(item) || item.includes(hostNorm)) return true;
  }
  return false;
}

export function looksLikeFriendLink(
  href: string,
  text: string | null,
  baseHost: string
): boolean {
  if (!href) return false;
  try {
    const url = new URL(href, `http://${baseHost}`);
    const host = url.hostname.toLowerCase();
    if (host === baseHost) {
      const internalNonBlogSegments = [
        "/archives",
        "/tags",
        "/author",
        "/category",
        "/categories",
      ];
      if (internalNonBlogSegments.some((seg) => url.pathname.startsWith(seg)))
        return false;
    }
    const textLower = (text || "").toLowerCase();
    const linkKeyWords = [
      "友链",
      "友情链接",
      "友",
      "friend",
      "blogroll",
      "blogrolls",
      "friends",
      "links",
      "blog links",
    ];
    if (linkKeyWords.some((k) => textLower.includes(k))) return true;
    if (host && host !== baseHost) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length <= 2) return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function isDebugEnabled(): boolean {
  return Boolean(
    process.env.DEBUG_GENERATOR === "1" ||
      process.env.DEBUG === "1" ||
      process.env.VERBOSE === "1"
  );
}

/**
 * Extract a clean friend name from anchor text (or href fallback).
 * Strategy (lightweight, no extra deps):
 * - sanitize input via `sanitizeLabel`
 * - remove embedded URLs
 * - split on common separators and choose the longest meaningful segment
 * - strip stray punctuation, control chars, emojis (best-effort)
 * - fallback to hostname from href when result is empty or too short
 */
export function extractFriendName(text: string | null, href: string): string {
  const fallbackHost = (() => {
    try {
      return new URL(href).hostname.toLowerCase();
    } catch {
      return href || "";
    }
  })();

  let s = sanitizeLabel(text || "");

  // If the anchor text is empty, fallback early
  if (!s) return fallbackHost;

  // Remove inline URLs like http://... or https://... or www.example.com
  s = s.replace(/https?:\/\/[^\s]+/gi, "");
  s = s.replace(/www\.[^\s]+/gi, "");

  // Split on common separators and pick the most plausible segment
  const sepRe = new RegExp("[|\\-–—:：·•/\\\\<>\\[\\]\\(\\)]+");
  const parts = s
    .split(sepRe)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length > 1) {
    // prefer segment with the most letters (avoid segments that are just numbers or punctuation)
    parts.sort((a, b) => {
      const score = (x: string) => x.replace(/[^\p{L}\p{N}_-]/gu, "").length;
      return score(b) - score(a);
    });
    s = parts[0];
  }

  // (skip explicit control char stripping to avoid unicode escape issues in regex)

  // Remove leftover URLs or weird tokens
  s = s.replace(/https?:\/\/[^\s]+/gi, "");
  // Keep ASCII word chars, apostrophes, CJK range, dots, hyphen, underscore and spaces; remove other symbols
  // Allow both straight apostrophe (') and right single quote (’ U+2019)
  s = s.replace(/[^\w._\u4e00-\u9fff\s\-\u2019']/g, "");

  s = s.trim();

  // If the cleaned string is too short (1 char) or empty, fallback to host
  if (!s || s.length <= 1) return fallbackHost;

  // Finally, limit length to reasonable size
  if (s.length > 60) s = s.slice(0, 60).trim();

  return s;
}
