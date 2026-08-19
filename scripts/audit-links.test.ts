import { describe, expect, test } from "bun:test";
import { classify } from "./lib/audit-classifier";
import { loadAuditRules } from "./lib/audit-rules";
import { checkUrlSafety, deniedReason, loadDenyList, normalizeUrl } from "./lib/audit-url";

describe("audit URL helpers", () => {
  test("normalizes tracking parameters and host", () => {
    const result = normalizeUrl("https://WWW.Example.com/blog/?utm_source=test&x=1#post");
    expect(result?.host).toBe("example.com");
    expect(result?.canonical).toBe("https://www.example.com/blog?x=1");
  });

  test("rejects private endpoints", () => {
    expect(checkUrlSafety("http://127.0.0.1/admin").reasons).toContain("private-ip");
    expect(checkUrlSafety("http://localhost").reasons).toContain("private-hostname");
  });

  test("matches exact and suffix deny rules", () => {
    const deny = loadDenyList("config/deny-hosts.txt");
    expect(deniedReason("github.com", deny)).toBe("deny-host-exact");
    expect(deniedReason("demo.pages.dev", deny)).toBe("deny-host-suffix:.pages.dev");
  });
});

describe("audit classifier", () => {
  const rules = loadAuditRules("config/audit-rules.yml");
  const deny = loadDenyList("config/deny-hosts.txt");

  test("marks sensitive content for exclusion", () => {
    const result = classify({ name: "NSFW", description: "成人内容", url: "https://example.com" }, rules, deny);
    expect(result.decision).toBe("exclude");
    expect(result.reasons.some((reason) => reason.startsWith("sensitive-keyword:"))).toBe(true);
  });

  test("keeps directory signals for review", () => {
    const result = classify({ name: "博客导航", description: "博客列表", url: "https://example.com" }, rules, deny);
    expect(result.decision).toBe("review");
    expect(result.reasons.some((reason) => reason.startsWith("directory-signal:"))).toBe(true);
  });

  test("does not treat portfolio alone as blog evidence", () => {
    const result = classify(
      { name: "Personal Portfolio", description: "Selected design work", url: "https://example.com" },
      rules,
      deny,
    );

    expect(result.decision).toBe("review");
    expect(result.signals.blogTerms).toBe(0);
    expect(result.reasons).toContain("no-blog-signal");
  });

  test("keeps blog keywords as candidates for manual review", () => {
    const result = classify(
      { name: "My Blog", description: "Original posts and articles", url: "https://example.com" },
      rules,
      deny,
    );

    expect(result.signals.blogTerms).toBeGreaterThan(0);
    expect(result.decision).toBe("review");
  });

  test("does not treat RSS or article counts as verified content", () => {
    const result = classify({ name: "Personal Site", url: "https://example.com" }, rules, deny, {
      hasFeed: true,
      articleCount: 3,
    });

    expect(result.reasons).toContain("blog-feed");
    expect(result.reasons).toContain("article-signal");
    expect(result.decision).toBe("review");
  });

  test("does not let blog keywords override a hard exclusion", () => {
    const result = classify(
      { name: "My Blog", description: "Posts and articles", url: "https://github.com" },
      rules,
      deny,
    );

    expect(result.signals.blogTerms).toBeGreaterThan(0);
    expect(result.decision).toBe("exclude");
    expect(result.reasons).toContain("deny-host-exact");
  });
});
