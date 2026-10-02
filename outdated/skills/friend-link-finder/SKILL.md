---
name: friend-link-finder
description: >-
  Locate a website's friend-links (友链 / blogroll) page or section, crawl it
  with `crwl -o markdown`, extract the friend-link list, filter out items that
  fail the FriendLinks project's AGENTS.md admission standard, route candidates
  with insufficient evidence to `links/unverified/`, and emit data in the
  project's links/*.yml Site format (single site node + its friends as edges).
  Use when a user gives a URL and asks to add / update / overwrite a site's
  friend links, or to find a blog's link page.
---

# Friend Link Finder

## Overview

Given a site URL, classify it first, then produce or refresh a verified
`links/<domain>.yml`, a verified `links/aggregators/<domain>.yml`, or an
unresolved `links/unverified/<domain>.yml` entry for the FriendLinks project:
one `site` node plus its admitted `friends` as outgoing edges.
The hard parts are (1) *finding* the links page and (2) *recovering* the list
when the page is a client-rendered SPA that `crwl -o markdown` can't see. This
skill covers both, then defers final admission decisions to
[references/filtering.md](references/filtering.md).

## Workflow

### 1. Normalize the target
- If the given URL is already a links/friends page (`/links`, `/friends`,
  `/link`, `/blogroll`, `/links.html`, …), crawl it directly.
- If it's a site root, probe common paths before assuming none exist:
  `/links` `/links.html` `/friends` `/friends/` `/link` `/blogroll`
  `/linkpage` `/about`. A site may keep friends on `/about`.

### 2. Crawl
Use the project's preferred tool:
```bash
crwl <url> -o markdown
```
- If the markdown shows a real friends section (a list of `[name](url)` pairs
  that look like personal sites), parse it directly (Step 3).
- If it's only a boot/loading screen, or has no friend links, treat it as an
  **SPA** and go to Step 4.

### 3. Parse markdown friends
Extract `[(name)](url)` pairs and markdown bullet links. Keep pairs where the
URL is `http(s)` and the name is non-empty. These are candidates.
(Helper: `scripts/find_friends.py <url>` does Steps 1–3 + SPA fallback and
prints `name<TAB>url`.)

### 4. SPA extraction (when markdown is empty)
The page renders client-side. Recover the data from the JS bundle:
```bash
curl -sL <url> -o /tmp/page.html
JS=$(grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' /tmp/page.html | head -1)
curl -sL "<url-without-path>$JS" -o /tmp/app.js
```
Then search `app.js` for friend data. Observed shapes:
- **React data array**: `KR=[{title:"…",link:"https://…"}, …]` — pull
  `title`/`name` + `link`/`url`/`blog` pairs.
- **Vue markdown modules**: `friends/xxx.md` imports with frontmatter
  `{name:"…", blog:"https://…", github:"…"}` — pull `name` + `blog`.
- **Tracking-param links**: `?from=<domain>` or `?ref=` URLs are friend links;
  grab the nearby `title`/`name`.
Strip `?from=` / `?utm_` tracking params from the final URLs.

### 5. Filter (per AGENTS.md)
Apply the three-state admission standard in `references/filtering.md` to the
target site and to every extracted friend independently:

- `include`: evidence establishes a qualifying `blog` or `blog-aggregator`;
- `unverified`: access, authorship, originality, site type, or primary purpose
  cannot be established; preserve it under `links/unverified/` for review;
- `exclude`: a hard exclusion is confirmed, so do not create a node.

Do not treat RSS, `<article>`, dates, page titles, framework fingerprints, or
blog-like keywords as proof by themselves. Strip tracking parameters before
comparing or writing URLs.

### 6. Build / overwrite the YAML
Structure (filename = site domain, e.g. `aira.cafe.yml`):
```yaml
site:
  name: real site/person name (NOT a page title artifact)
  description: real content description (NOT the placeholder "友情链接")
  url: canonical site url
  links: the links-page route (e.g. /links)
  friends:
    - name: friend display name
      url: clean friend url
```
- Write a verified blog to the appropriate normal `links/` category and a
  verified aggregator to `links/aggregators/`.
- Write an `unverified` candidate to `links/unverified/<domain>.yml`. Keep the
  normal Site schema and record the reason label, evidence URLs, and review date
  in leading YAML comments; do not add unsupported `review` or `type` fields.
- **Overwrite** when the file exists ("覆盖更新"): rewrite it from the
  fresh crawl without changing its admission state unless the new evidence
  justifies that change.
- A site that has no friend-link page may use `friends: []` only after its own
  content independently proves that it is a qualifying blog. Never create an
  empty node merely to retain a non-blog or unresolved site.

### 7. Validate & format
```bash
bun run validate                       # validate formal graph data
bun run validate links/unverified      # validate candidates when applicable
bun run fmt <file>                     # format the new/changed file
```

### 8. Report
Summarize included, unverified, and excluded candidates and the filtering
rationale. **Do not `git push`** (AGENTS.md). Ask before committing.

## Pitfalls

- **Placeholder name/description**: pages often render the `<title>` (e.g.
  `Home - AIRA`, `目录 << .\icu` — a broken Hugo template) or `友情链接` as
  name/description. Replace with the real persona/site name and a real
  description derived from the site's content/about page.
- **Numeric YAML names**: values like `61`, `1900`, `0x7f` parse as **numbers**
  (and `0x7f` → `127`) and fail validation (`name` must be a string). **Quote
  them**: `"61"`, `"0x7f"`. Always quote names that look like numbers/hex.
- **SPA needs the JS bundle**, not markdown — see Step 4.
- **Social spaces are not friend links**: `space.bilibili.com/...`,
  `twitter.com/...`, etc. are profiles to exclude.
- **Tracking params**: drop `?from=` / `?utm_` from friend URLs.
