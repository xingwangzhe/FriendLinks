#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import yaml from "yaml";
import { chromium } from "playwright";
import type { Browser } from "playwright";

import type { SeedEntry } from "./types";
import {
  hostnameFromUrl,
  sanitizeLabel,
  hostMatchesSet,
  extractFriendName,
} from "./utils";
import { findFriendPageAnchors } from "./finder";
import { createAsyncWriter } from "./writer";
import { IGNORED_HOSTS, AGGREGATORS, FRIEND_PAGE_CANDIDATES } from "./types";

export async function mainCLI(): Promise<void> {
  const args = process.argv.slice(2);
  const depthArgIndex = args.findIndex((a) => a.startsWith("--depth="));
  const depth =
    depthArgIndex >= 0 ? Number(args[depthArgIndex].split("=")[1]) || 2 : 2;
  const dryRun = args.includes("--dry-run") || args.includes("-d");
  const verbose = args.includes("--verbose") || args.includes("-v");
  const visitedFileArgIndex = args.findIndex((a) =>
    a.startsWith("--visited-file=")
  );
  const resume = args.includes("--resume") || args.includes("--continue");
  const asyncWrite = args.includes("--async-write");
  const writeConcurrencyArgIndex = args.findIndex((a) =>
    a.startsWith("--write-concurrency=")
  );
  const writeConcurrency =
    writeConcurrencyArgIndex >= 0
      ? Number(args[writeConcurrencyArgIndex].split("=")[1]) || 4
      : 4;

  const linksDir = path.resolve(process.cwd(), "links");
  const outDir = linksDir;
  const { enqueueWrite, flushWrites, queuedWrites } = createAsyncWriter(
    verbose,
    writeConcurrency
  );

  const files = await fs.readdir(linksDir).catch(() => [] as string[]);
  if (global) console.log(`Found ${files.length} files in ${linksDir}`);
  const seeds: string[] = [];
  const seedHosts = new Set<string>();
  for (const f of files) {
    // Explicitly skip JSON files such as visited.json and any non-YAML files
    if (f === "visited.json" || f.endsWith(".json")) continue;
    if (!f.endsWith(".yml") && !f.endsWith(".yaml")) continue;
    const content = await fs.readFile(path.join(linksDir, f), "utf8");
    try {
      const data = yaml.parse(content) as SeedEntry;
      if (data?.site?.friends && data.site.friends.length > 0) {
        for (const friend of data.site.friends) {
          if (!friend?.url) continue;
          const hFull = hostnameFromUrl(friend.url);
          const h = hFull;
          if (!h) continue;
          if (
            hostMatchesSet(h, IGNORED_HOSTS) ||
            hostMatchesSet(h, AGGREGATORS)
          )
            continue;
          if (seedHosts.has(h)) continue;
          const filename = path.join(outDir, `${h}.yml`);
          const fileExists = await fs
            .access(filename)
            .then(() => true)
            .catch(() => false);
          if (fileExists) continue;
          seedHosts.add(h);
          seeds.push(friend.url);
        }
      } else if (data?.site?.url) {
        const hFull = hostnameFromUrl(data.site.url);
        const h = hFull;
        if (h && !seedHosts.has(h)) {
          const filename = path.join(outDir, `${h}.yml`);
          const fileExists = await fs
            .access(filename)
            .then(() => true)
            .catch(() => false);
          if (!fileExists) {
            seedHosts.add(h);
            seeds.push(data.site.url);
          }
        }
      }
    } catch (err) {
      if (global) console.warn("Failed to parse yaml", f, err);
    }
  }

  // Load visited hosts from visited.json (if present) and exclude them from initial seeds
  const visitedFromFile = new Set<string>();
  try {
    const prev = await fs
      .readFile(path.join(outDir, "visited.json"), "utf8")
      .catch(() => "");
    if (prev) {
      const arr: string[] = JSON.parse(prev || "[]");
      for (const h of arr) visitedFromFile.add(h);
      if (global)
        console.log(`Loaded ${arr.length} visited hosts from visited.json`);
    }
  } catch (err) {
    if (global) console.warn(`Failed to read visited.json`, err);
  }

  // Filter seeds to remove already visited hosts
  if (visitedFromFile.size > 0 && seeds.length > 0) {
    const before = seeds.length;
    for (let i = seeds.length - 1; i >= 0; i--) {
      const h = hostnameFromUrl(seeds[i]);
      if (!h) continue;
      if (visitedFromFile.has(h)) seeds.splice(i, 1);
    }
    if (global)
      console.log(
        `Filtered seeds ${before} -> ${seeds.length} after removing visited hosts`
      );
  }
  if (global) {
    console.log(
      `Discovered ${seeds.length} seed URLs (unique hosts: ${seedHosts.size})`
    );
    if (seeds.length > 0)
      console.log(`  Sample seeds: ${seeds.slice(0, 10).join(", ")}`);
  }

  const discovered = new Map<string, string | null>();
  const visited = new Set<string>();

  // Merge visitedFromFile (loaded earlier) into runtime visited set so we skip already-visited hosts
  try {
    // `visitedFromFile` may be undefined in older versions, guard access
    // @ts-ignore
    if (
      typeof visitedFromFile !== "undefined" &&
      visitedFromFile instanceof Set
    ) {
      // @ts-ignore
      for (const h of visitedFromFile) visited.add(h);
      if (global)
        console.log(
          `Initialized visited set with ${visited.size} hosts from visited.json`
        );
    }
  } catch (e) {
    if (global) console.warn("Failed to merge visitedFromFile into visited", e);
  }

  async function loadVisitedFile(filePath: string): Promise<Set<string>> {
    try {
      const content = await fs.readFile(filePath, "utf8");
      const arr: string[] = JSON.parse(content || "[]");
      if (verbose)
        console.log(`Loaded ${arr.length} visited hosts from ${filePath}`);
      return new Set(arr);
    } catch {
      if (verbose)
        console.log(
          `No visited-file at ${filePath} or failed to parse; starting fresh`
        );
      return new Set<string>();
    }
  }

  async function saveVisitedFile(filePath: string, set: Set<string>) {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      // Read existing visited file (if any) and merge to avoid overwriting concurrent entries
      let existing = new Set<string>();
      try {
        const prev = await fs.readFile(filePath, "utf8").catch(() => "");
        if (prev) {
          const arr: string[] = JSON.parse(prev || "[]");
          for (const v of arr) existing.add(v);
        }
      } catch {
        // ignore parse/read errors, treat as empty
      }
      // Merge incoming set
      for (const v of set) existing.add(v);
      const arr = Array.from(existing.values());
      const tmp = `${filePath}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(arr, null, 2), "utf8");
      await fs.rename(tmp, filePath);
      if (verbose)
        console.log(`Saved ${arr.length} visited hosts to ${filePath}`);
    } catch (err) {
      console.warn(`Failed to persist visited-file ${filePath}`, err);
    }
  }

  const visitedFileArg =
    visitedFileArgIndex >= 0 ? args[visitedFileArgIndex].split("=")[1] : null;
  const visitedFile = visitedFileArg
    ? path.isAbsolute(visitedFileArg)
      ? visitedFileArg
      : path.resolve(process.cwd(), visitedFileArg)
    : path.join(outDir, "visited.json");

  if (resume) {
    const prev = await loadVisitedFile(visitedFile).catch(
      () => new Set<string>()
    );
    for (const h of prev) visited.add(h);
  }
  for (const seed of seeds) {
    const hFull = hostnameFromUrl(seed);
    if (hFull) discovered.set(hFull, seed);
  }

  if (global)
    console.log(
      `Starting BFS with ${discovered.size} seeds, depth=${depth}, dryRun=${dryRun}`
    );

  const queue: Array<{ url: string; depth: number }> = [];
  for (const seed of seeds) queue.push({ url: seed, depth: 0 });

  const browser = await chromium.launch();

  // Helper: try to fetch the main site's title (root origin) to use as site.name
  async function fetchSiteMainName(
    browser: Browser,
    pageUrl: string,
    verboseFlag = false
  ) {
    try {
      const urlObj = new URL(pageUrl);
      const origin = urlObj.origin;
      const page = await browser.newPage();
      try {
        await page
          .goto(origin, { waitUntil: "domcontentloaded", timeout: 5000 })
          .catch(() => {});
        const metaTitle = await page
          .evaluate(() => {
            const sel =
              document.querySelector('meta[property="og:site_name"]') ||
              document.querySelector('meta[property="og:title"]') ||
              document.querySelector('meta[name="title"]') ||
              document.querySelector("title");
            return sel
              ? sel.getAttribute
                ? sel.getAttribute("content") || sel.textContent
                : sel.textContent
              : null;
          })
          .catch(() => null);
        await page.close();
        const candidate =
          (metaTitle && String(metaTitle).trim()) || urlObj.hostname;
        const cleaned = sanitizeLabel(candidate) || urlObj.hostname;
        return extractFriendName(cleaned, origin);
      } catch (e) {
        try {
          await page.close();
        } catch {}
        if (verboseFlag) console.warn("fetchSiteMainName inner error", e);
        return urlObj.hostname;
      }
    } catch (e) {
      if (verboseFlag) console.warn("fetchSiteMainName failed", e);
      return pageUrl;
    }
  }

  try {
    while (queue.length > 0) {
      const { url, depth: curDepth } = queue.shift()!;
      if (global)
        console.log(
          `Queue pop: ${url} (depth=${curDepth}, remaining=${queue.length})`
        );
      if (curDepth > depth) continue;
      const baseHostFull = hostnameFromUrl(url);
      const baseHost = baseHostFull;
      if (!baseHost) continue;
      if (visited.has(baseHost)) {
        if (verbose)
          console.log(`Skipping ${baseHost} because we've already visited it`);
        continue;
      }
      visited.add(baseHost);
      if (!dryRun && visitedFile) {
        await saveVisitedFile(visitedFile, visited);
      }

      if (global) console.log(`Crawling (${curDepth}) ${url}`);

      let targetAnchors = null as any;
      let pageMeta: { title?: string; description?: string } | undefined;

      for (const c of FRIEND_PAGE_CANDIDATES) {
        const attempt = new URL(c, url).href;
        if (global) console.log("Trying candidate friend page:", attempt);
        const found = await findFriendPageAnchors(
          browser as Browser,
          attempt,
          baseHost,
          verbose
        );
        if (found && found.anchors && found.anchors.length > 0) {
          targetAnchors = found.anchors;
          pageMeta = found.meta;
          break;
        }
      }

      if (!targetAnchors) {
        const found = await findFriendPageAnchors(
          browser as Browser,
          url,
          baseHost,
          verbose
        );
        if (found && found.anchors && found.anchors.length > 0) {
          targetAnchors = found.anchors;
          pageMeta = found.meta;
        }
      }

      if (!targetAnchors || targetAnchors.length === 0) {
        if (global) console.log(`No friend anchors found for ${url}`);
        continue;
      }

      const friendsList = targetAnchors
        .map((a: any) => {
          const hFull = hostnameFromUrl(a.href);
          const h = hFull;
          if (!h) return null;
          if (h === baseHost) return null;
          if (
            hostMatchesSet(h, IGNORED_HOSTS) ||
            hostMatchesSet(h, AGGREGATORS)
          )
            return null;
          const nm = extractFriendName(a.text || null, a.href) || h;
          return { name: nm, url: a.href } as { name: string; url: string };
        })
        .filter(Boolean) as { name: string; url: string }[];

      const baseFilename = path.join(outDir, `${baseHost}.yml`);
      const baseYamlExists =
        (await fs
          .access(baseFilename)
          .then(() => true)
          .catch(() => false)) || queuedWrites.has(baseFilename);
      if (!baseYamlExists && friendsList.length > 0) {
        // Prefer the site's main/root title instead of the friend-list page title
        const siteMainName =
          (await fetchSiteMainName(browser, url, !!global)) || undefined;
        const siteNameRaw = siteMainName || pageMeta?.title || url;
        const siteName = sanitizeLabel(siteNameRaw) || baseHost;
        const siteDescRaw = pageMeta?.description ?? siteNameRaw;
        const siteDesc = sanitizeLabel(siteDescRaw) || siteName;
        const yamlObj = {
          site: {
            name: siteName,
            url,
            description: siteDesc,
            friends: friendsList,
          },
        };
        const yamlContent = yaml.stringify(yamlObj);
        if (!dryRun) {
          if (asyncWrite) enqueueWrite(baseFilename, yamlContent);
          else {
            await fs.writeFile(baseFilename, yamlContent, "utf8");
            if (global)
              console.log(`Wrote base YAML for ${baseHost} -> ${baseFilename}`);
          }
        } else if (global) {
          console.log(
            `[DRY] Would write base YAML for ${baseHost} -> ${baseFilename}`
          );
        }
      }

      for (const anchor of targetAnchors) {
        const anchorHostFull = hostnameFromUrl(anchor.href);
        const anchorHost = anchorHostFull;
        if (!anchorHost) continue;
        if (anchorHost === baseHost) continue;
        if (
          hostMatchesSet(anchorHost, IGNORED_HOSTS) ||
          hostMatchesSet(anchorHost, AGGREGATORS)
        )
          continue;

        const anchorFilename = path.join(outDir, `${anchorHost}.yml`);
        const anchorYamlExists =
          (await fs
            .access(anchorFilename)
            .then(() => true)
            .catch(() => false)) || queuedWrites.has(anchorFilename);
        if (anchorYamlExists) {
          if (global)
            console.log(
              `Skipping ${anchorHost}: yaml already present (${anchorFilename})`
            );
          continue;
        }

        if (!discovered.has(anchorHost) && !visited.has(anchorHost)) {
          discovered.set(anchorHost, anchor.href);
          queue.push({ url: anchor.href, depth: curDepth + 1 });
          if (global)
            console.log(`Enqueued ${anchor.href} (host=${anchorHost})`);
        }
      }

      await new Promise((r) => setTimeout(r, 500));
    }
  } finally {
    await browser.close();
    if (asyncWrite) await flushWrites();
    if (!dryRun && visitedFile) {
      await saveVisitedFile(visitedFile, visited);
    }
  }

  if (verbose) console.log("Crawling finished. Discovered:", discovered.size);
}

// This module exports `mainCLI`. The CLI entrypoint is
// `scripts/generate_yml/generate-yml-from-friends.ts` which calls `mainCLI()`.
