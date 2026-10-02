import type { AuditRules } from "./audit-rules";
import { checkUrlSafety, deniedReason, type DenyList, normalizeUrl } from "./audit-url";

export type Decision = "include" | "review" | "exclude";

export interface PageSignals {
  title?: string;
  description?: string;
  canonical?: string;
  hasFeed?: boolean;
  articleCount?: number;
  externalLinkCount?: number;
}

export interface Classification {
  decision: Decision;
  reasons: string[];
  signals: Record<string, number | boolean>;
}

function findTerms(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  return terms.filter((term) => lower.includes(term));
}

export function classify(
  value: { name: string; description?: string; url: string },
  rules: AuditRules,
  deny: DenyList,
  page?: PageSignals,
): Classification {
  const normalized = normalizeUrl(value.url);
  const reasons: string[] = [];
  const signals: Record<string, number | boolean> = {};
  if (!normalized) return { decision: "exclude", reasons: ["invalid-url"], signals };

  const safety = checkUrlSafety(value.url);
  reasons.push(...safety.reasons);
  const denyHit = deniedReason(normalized.hostname, deny);
  if (denyHit) reasons.push(denyHit);

  const text = [value.name, value.description ?? "", value.url, page?.title ?? "", page?.description ?? ""]
    .join(" ")
    .toLowerCase();
  const sensitive = findTerms(text, rules.sensitiveTerms);
  const commercial = findTerms(text, rules.commercialTerms);
  const directory = findTerms(text, rules.directoryTerms);
  const platform = findTerms(text, rules.platformTerms);
  const blog = findTerms(text, rules.blogTerms);
  signals.sensitiveTerms = sensitive.length;
  signals.commercialTerms = commercial.length;
  signals.directoryTerms = directory.length;
  signals.platformTerms = platform.length;
  signals.blogTerms = blog.length;
  if (sensitive.length) reasons.push(`sensitive-keyword:${sensitive.slice(0, 3).join(",")}`);
  if (commercial.length) reasons.push(`commercial-signal:${commercial.slice(0, 3).join(",")}`);
  if (directory.length) reasons.push(`directory-signal:${directory.slice(0, 3).join(",")}`);
  if (platform.length) reasons.push(`platform-signal:${platform.slice(0, 3).join(",")}`);

  if (page?.hasFeed) {
    reasons.push("blog-feed");
    signals.hasFeed = true;
  }
  if (page?.articleCount) {
    reasons.push("article-signal");
    signals.articleCount = page.articleCount;
  }
  if (page?.externalLinkCount != null) signals.externalLinkCount = page.externalLinkCount;
  if (!blog.length && !page?.hasFeed && !(page?.articleCount ?? 0)) reasons.push("no-blog-signal");

  const hasHardExclude = safety.reasons.length > 0 || sensitive.length > 0 || Boolean(denyHit);
  // This classifier only sees metadata and heuristic page signals. None of
  // them proves authorship, originality, a stable post index, or a qualifying
  // permalink, so a non-excluded candidate still requires manual review.
  return {
    decision: hasHardExclude ? "exclude" : "review",
    reasons: [...new Set(reasons)],
    signals,
  };
}
