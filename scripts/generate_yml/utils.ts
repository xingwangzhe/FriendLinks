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
    return new URL(url).hostname.replace(/^www\./, "");
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
  // Normalize host to lower-case without leading www.
  const hostNorm = host.toLowerCase().replace(/^www\./, "");
  for (const rawItem of set) {
    if (!rawItem) continue;
    // Normalize item: remove protocol and path, strip www.
    const item = String(rawItem)
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/^www\./, "");
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
    const host = url.hostname.replace(/^www\./, "");
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
