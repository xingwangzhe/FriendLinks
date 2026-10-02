# Friend-link admission standard

This file mirrors the canonical admission policy in the repository `AGENTS.md`.
Apply it to both a candidate `site` and every candidate `friends[]` entry. A
listing in a blog aggregator is discovery evidence only; it is never automatic
proof that the target qualifies.

## Decisions and destinations

- `include`: the candidate is verified as a blog or blog aggregator. Store a
  blog under `links/` (or an appropriate verified category) and an aggregator
  under `links/aggregators/`.
- `unverified`: the site cannot be classified confidently because it is
  unreachable, its authorship/originality is unclear, or it has mixed purposes.
  Store the candidate under `links/unverified/`, with review evidence in YAML
  comments. This directory is excluded from normal graph loading.
- `exclude`: the site clearly belongs to an excluded type. Do not create a YAML
  node, including an empty placeholder node.

When evidence is incomplete, use `unverified`; do not add the candidate to the
verified graph first.

## Review order and reason labels

Review every candidate in this order:

1. Verify the URL, public accessibility, safety, redirects, and canonical
   domain.
2. Check whether the site satisfies the blog-aggregator definition.
3. Otherwise locate a publishing index and inspect at least one qualifying
   original permalink.
4. Confirm the operator and the site's primary purpose.
5. Choose `include`, `unverified`, or `exclude`, then write only to the matching
   destination.

Use these shared reason labels in candidate comments and audit notes:

```text
homepage-only
single-page-only
portfolio-only
no-qualifying-post
no-post-index
non-original-content
template-demo
knowledge-base-only
generic-directory
forum-primary
social-profile
tool-or-product-primary
framework-or-theme
corporate-or-institutional
content-scraper
aggregator-no-attribution
aggregator-not-blog-focused
unverifiable
```

## Blog (`blog`)

A blog is defined by actual publishing behavior, not by its title, theme,
framework, RSS feed, custom domain, or use of an `<article>` element. It must
satisfy all of the following:

1. It is operated by an identifiable individual, pen name, or small independent
   non-institutional creative team.
2. It has a discoverable Blog, Posts, Articles, Notes, Journal, Writing,
   Archive, or equivalent publishing entry point.
3. It has at least **one** qualifying original publication.
4. The publication is publicly readable, substantive, and has its own stable,
   directly addressable permalink. A section or anchor on a one-page homepage
   is not a separate publication.
5. Publishing is a first-class purpose or a clearly independent section of the
   site, not an incidental paragraph on a resume, portfolio, or product page.

The following do **not** count as qualifying publications:

- About, resume/CV, contact, disclaimer, privacy, or terms pages;
- project cards, screenshots, portfolio tiles, or ordinary case showcases;
- README files, API documentation, manuals, FAQs, or knowledge-base fragments;
- product changelogs, release notes, company news, or marketing copy;
- bare bookmarks or link collections without substantive author commentary;
- automated reposts, social-feed mirrors, full-content scraping, or RSS copies;
- `Hello World`, theme demos, starter posts, or template placeholders.

### Blog edge cases

- A one-document personal homepage, link-in-bio, online resume, or portfolio
  without a qualifying publication is excluded.
- A single-page application is not automatically a one-page homepage. It may
  qualify when it provides stable article routes and a real publishing index.
- A portfolio qualifies only when its `/blog`, `/posts`, `/notes`, or equivalent
  section independently satisfies the blog requirements.
- Photography, comics, podcasts, video, newsletters, microblogs, digital
  gardens, and linklogs may qualify. At least one original item must have a
  permalink and public index plus author context, creative commentary, show
  notes, or substantive annotation. Bare galleries, platform jump pages, and
  fragment dumps are excluded.
- A small edited multi-author publication may qualify. Open-posting forums,
  Q&A sites, wikis, and social communities do not.
- Inactivity is not disqualifying while the original archive remains public.
- RSS, comments, dates, a custom domain, a particular framework, and a fixed
  posting frequency are neither required nor sufficient evidence.
- An individual publication hosted on GitHub Pages, WordPress.com, or another
  platform may qualify; the platform homepage or user social profile does not.
- Ads, sponsorships, donations, and optional memberships are not automatically
  commercial. Exclude sites whose primary purpose is sales, lead generation,
  SEO, product promotion, or institutional communication.

## Blog aggregator (`blog-aggregator`)

A blog aggregator is a public service whose core function is discovering,
indexing, organizing, searching, connecting, or aggregating multiple independent
blogs or their publications.

It must satisfy all of the following:

1. It genuinely covers multiple independent sources. There is no fixed numeric
   threshold; count alone never turns a personal blogroll into an aggregator.
2. It provides a stable public directory, article stream, member list, OPML,
   webring, search, random discovery, relationship graph, or equivalent ongoing
   discovery mechanism.
3. It identifies the source blog or author and links to the canonical source
   site or original publication.
4. Its main scope is independent blogs, not arbitrary tools, products, news,
   downloads, social profiles, or commercial sites.
5. It does not hide attribution, impersonate authors, capture traffic through
   internal full-text mirrors, or operate as a content farm.

An aggregator does not need to publish original articles of its own. Automated
RSS aggregation is acceptable when attribution and canonical outbound links are
clear. Every extracted `friends[]` target still requires an independent review
under this policy.

Exclude general web directories, generic news aggregators, search engines,
private/general RSS readers, hosting or site-building platforms, paid-ranking
directories, SEO link farms, forums, chat/social communities, unattributed
scrapers, and ordinary personal friend-link pages. A mixed site qualifies only
when its blog discovery section is an independent first-class service with a
stable canonical entry point.

## Hard exclusions

- Single-document personal homepages, link-in-bio pages, and online resumes;
- portfolios without a qualifying blog section;
- blog frameworks, themes, templates, tools, demos, and project documentation;
- company, government, school, institutional, product, store, and large media
  sites, including their SEO/content-marketing blogs;
- CDNs, image hosts, short-link services, hosting providers, and registrars;
- forums, Q&A, wikis, open communities, chat services, and social-media profiles;
- general navigation, content farms, unattributed mirrors, and scraper sites;
- parked domains, sale pages, empty sites, and default templates;
- the source site's own duplicate pages, mirrors, and obsolete domains.

## Signals are not proof

The following may help locate a candidate but cannot decide admission alone:
the words “blog” or “portfolio”, RSS/Atom, dates, `<article>` elements,
`BlogPosting` metadata, multiple pages, or use of Hexo/Hugo/WordPress/Astro.
Inspect the publishing index and at least one actual permalink.

## URL and metadata hygiene

- Keep only public `http(s)` URLs and prefer HTTPS where available.
- Strip tracking parameters such as `utm_*`, `from`, and `ref` while preserving
  functional query parameters.
- Prefer the author-recognized canonical URL; keep only one of mirrors, legacy
  domains, protocol variants, and language duplicates for the same publication.
- `name` must be a non-empty string. Quote numeric/hex-looking YAML names such
  as `"61"` and `"0x7f"`.
- Use the real site/person name rather than a page-title artifact.
- Use a real site content summary for `description`, never `友情链接`.
- A verified blog with no outgoing friend page may use `friends: []`; an
  unverified or excluded site may not be kept as an empty placeholder.
