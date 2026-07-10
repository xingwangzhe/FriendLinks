# Friend-link admission standard (distilled from AGENTS.md)

A `friends[]` entry is admitted only if it is a **personal blog / personal
homepage / personal portfolio with original content**. When in doubt, include
and flag for the user.

## ✅ Allowed
- Personal / tech / life blogs
- Personal portfolios (art, music, code, games)
- Blog-aggregate communities of independents (十年之约, 萌国, …) — only if they
  are themselves an individual's or small-community site

## ❌ Excluded (hard rules)
- **Blog frameworks / themes / tools**: Hexo, Hugo, WordPress, Astro,
  Next.js, VuePress, Docsify, … (e.g. `github.com/withastro/astro`)
- **Commercial sites / product / company pages**
- **CDN / image hosts / short-link services**
- **Hosting platforms / domain registrars** (as the *linked* target)
- **Forums / communities / social-media profiles**: Twitter/X, Facebook,
  Instagram, YouTube channel, Bilibili **space** (`space.bilibili.com/...`),
  AcFun, nicovideo, Douyin, Discord, Telegram, Bluesky, Weibo, Twitch, Reddit,
  Zhihu, Douban, …
- **Pure navigation / aggregate sites with no original content**

## ⚠️ Edge cases seen this session (judgement required)
- **Doc-hosting platforms** (e.g. `yuque.com/<user>` = 语雀): a personal
  knowledge-base on a SaaS doc platform is *not* an independent blog domain →
  usually exclude. Confirm with user.
- **Project documentation sites** (e.g. `docs.twilight.<domain>` "Twilight User
  Manual"): documentation for software, not a personal blog → exclude.
- **OS / distro / software project sites** (archlinux.org, debian.org,
  nixos.org, blender.org, kde.org, gnu.org/emacs, libsdl.org, mozilla/firefox)
  → exclude.
- **Sites whose homepage renders as another brand** (e.g. `thechaseexp.com`
  returning Nintendo HK content) → cannot verify as a personal site; exclude
  and flag for the user to confirm.
- **Self / self-subpages**: the site's own domain and its subpages
  (e.g. `lachrymalfutura.wordpress.com/vn-banners` when the site is
  `lachrymal.net`) → exclude.

## URL hygiene
- Keep only `http(s)` URLs.
- Strip tracking params: `?from=`, `?utm_*`, `?ref=`.
- Prefer the canonical root (e.g. `https://aira.cafe/` not a `?from=` variant).

## Name / description quality
- `name` must be a **non-empty string**. Quote values that look numeric/hex
  (`"61"`, `"0x7f"`); otherwise YAML parses them as numbers and validation
  fails.
- `name` = the friend's display name, not a page `<title>` artifact.
- `description` (on the `site`, not friends) must be a real content summary,
  never the placeholder `友情链接`.
