#!/usr/bin/env python3
"""friend-link-finder: locate and extract candidate friend links from a site.

Given a base URL, this script:
  1. Crawls the URL (and common link-page paths) with `crwl -o markdown`.
  2. Extracts (name, url) pairs from markdown links.
  3. If too few links are found (client-rendered SPA), downloads the page HTML
     + JS bundle and applies heuristics to recover friend data.

It outputs candidate (name, url) pairs. The AGENTS.md admission standard is
applied separately by the agent (see references/filtering.md). A small
first-pass exclusion drops obvious social-media/profile domains to reduce noise.

Usage:
    find_friends.py <base-url> [--json]
"""
import sys
import re
import json
import subprocess
import urllib.parse
import urllib.request

# First-pass noise reduction only. The agent applies the full AGENTS.md standard.
EXCLUSION_DOMAINS = {
    "twitter.com", "x.com", "facebook.com", "instagram.com", "t.co",
    "youtube.com", "youtu.be", "bilibili.com", "space.bilibili.com", "acfun.cn",
    "nicovideo.jp", "douyin.com", "tiktok.com", "discord.gg", "discord.com",
    "github.com", "gitlab.com", "bsky.app", "telegram.me", "t.me", "weibo.com",
    "twitch.tv", "steamcommunity.com", "reddit.com", "zhihu.com", "douban.com",
}

CANDIDATE_PATHS = [
    "", "/links", "/links.html", "/friends", "/friends/",
    "/link", "/blogroll", "/linkpage", "/about", "/about/",
]


def run(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=90).stdout
    except Exception:
        return ""


def crawl_markdown(url):
    return run(["crwl", url, "-o", "markdown"])


def http_get(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode("utf-8", "replace")
    except Exception:
        return ""


def domain_of(url):
    try:
        return urllib.parse.urlparse(url).netloc.lower().lstrip("www.")
    except Exception:
        return ""


def strip_tracking(url):
    return url.split("?")[0].rstrip("/") or url


def extract_md_links(md):
    out = []
    # Remove image markup first so its ![alt](url) can't be mistaken for a link.
    md = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", md)
    # Match markdown link targets: ](url). Then resolve the matching '[' that
    # opens this link, skipping any nested brackets.
    for m in re.finditer(r"\]\((https?://[^)\s]+)\)", md):
        url = m.group(1).strip()
        end = m.start()  # position of the closing ']'
        i = end - 1
        depth = 0
        open_pos = None
        while i >= 0:
            c = md[i]
            if c == "]":
                depth += 1
            elif c == "[":
                if depth > 0:
                    depth -= 1
                else:
                    # ignore image openers (![)
                    if not (i > 0 and md[i - 1] == "!"):
                        open_pos = i
                        break
            i -= 1
        if open_pos is None:
            continue
        text = md[open_pos + 1 : end]
        text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)  # drop image markup
        text = re.sub(r"\s+", " ", text).strip()
        text = text.replace('"', "").replace("'", "")
        if url and text:
            out.append((text, url))
    return out


def spa_extract(base, html):
    out = []
    scripts = re.findall(r'<script[^>]+src="([^"]+\.js)"', html)
    js_urls = []
    for s in scripts:
        if s.startswith("//"):
            s = "https:" + s
        elif s.startswith("/"):
            s = urllib.parse.urljoin(base + "/", s.lstrip("/"))
        js_urls.append(s)
    js = ""
    for u in js_urls[:6]:
        js += http_get(u) + "\n"
    if not js:
        return out
    # React/Vue-style objects: {title:"X", ..., link:"Y"}. Supports ", ', and `
    # (backtick template literals, e.g. name:`...`). The value matcher
    # (?:(?!\1).)*? stops at the matching quote, so values may contain other
    # quote types (e.g. an apostrophe in a name like WZQ'02).
    Q = r"(['\"\x60])"
    # Only match name/title BEFORE the link — this avoids cross-object false
    # matches (a later object's name wrongly paired with an earlier link).
    # Friend data almost always lists the name before the URL.
    for m in re.finditer(
        r"(?:title|name)\s*:\s*" + Q + r"((?:(?!\1).)*)[^}]*?(?:link|url|blog)\s*:\s*\1((?:(?!\1).)*)",
        js,
    ):
        out.append((m.group(2).strip(), m.group(3).strip()))
    return out


def main():
    if len(sys.argv) < 2:
        print("usage: find_friends.py <base-url> [--json]", file=sys.stderr)
        sys.exit(1)
    base = sys.argv[1].rstrip("/")
    results = []
    seen = set()
    tried = set()

    for p in CANDIDATE_PATHS:
        u = base if p == "" else base + p
        if u in tried:
            continue
        tried.add(u)
        for (text, url) in extract_md_links(crawl_markdown(u)):
            d = domain_of(url)
            if d in EXCLUSION_DOMAINS:
                continue
            key = (text.lower(), strip_tracking(url))
            if key in seen:
                continue
            seen.add(key)
            results.append({"name": text, "url": strip_tracking(url), "source": u})

    if len(results) < 3:
        html = http_get(base)
        if html:
            for (text, url) in spa_extract(base, html):
                d = domain_of(url)
                if d in EXCLUSION_DOMAINS:
                    continue
                key = (text.lower(), strip_tracking(url))
                if key in seen:
                    continue
                seen.add(key)
                results.append(
                    {"name": text, "url": strip_tracking(url), "source": "spa:" + domain_of(base)}
                )

    if "--json" in sys.argv:
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        for r in results:
            print(f'{r["name"]}\t{r["url"]}')


if __name__ == "__main__":
    main()
