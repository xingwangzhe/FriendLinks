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
  isDebugEnabled,
  hostMatchesSet,
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

  const dbgGlobal = verbose || isDebugEnabled();
  const { enqueueWrite, flushWrites, queuedWrites } = createAsyncWriter(
    verbose,
    writeConcurrency
  );

  const files = await fs.readdir(linksDir).catch(() => [] as string[]);
  if (dbgGlobal) console.log(`Found ${files.length} files in ${linksDir}`);
  const seeds: string[] = [];
  const seedHosts = new Set<string>();
  for (const f of files) {
    if (!f.endsWith(".yml") && !f.endsWith(".yaml")) continue;
    const content = await fs.readFile(path.join(linksDir, f), "utf8");
    try {
      const data = yaml.parse(content) as SeedEntry;
      if (data?.site?.friends && data.site.friends.length > 0) {
        for (const friend of data.site.friends) {
          if (!friend?.url) continue;
          const h = hostnameFromUrl(friend.url);
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
        const h = hostnameFromUrl(data.site.url);
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
      if (dbgGlobal) console.warn("Failed to parse yaml", f, err);
    }
  }

  if (dbgGlobal) {
    console.log(
      `Discovered ${seeds.length} seed URLs (unique hosts: ${seedHosts.size})`
    );
    if (seeds.length > 0)
      console.log(`  Sample seeds: ${seeds.slice(0, 10).join(", ")}`);
  }

  const discovered = new Map<string, string | null>();
  const visited = new Set<string>();

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
      const arr = Array.from(set.values());
      const tmp = `${filePath}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(arr, null, 2), "utf8");
      await fs.rename(tmp, filePath);
      if (verbose)
        console.log(`Saved ${arr.length} visited hosts to ${filePath}`);
    } catch {
      console.warn(`Failed to persist visited-file ${filePath}`);
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
    const h = hostnameFromUrl(seed);
    if (h) discovered.set(h, seed);
  }

  if (dbgGlobal)
    console.log(
      `Starting BFS with ${discovered.size} seeds, depth=${depth}, dryRun=${dryRun}`
    );

  const queue: Array<{ url: string; depth: number }> = [];
  for (const seed of seeds) queue.push({ url: seed, depth: 0 });

  const browser = await chromium.launch();

  try {
    while (queue.length > 0) {
      const { url, depth: curDepth } = queue.shift()!;
      if (dbgGlobal)
        console.log(
          `Queue pop: ${url} (depth=${curDepth}, remaining=${queue.length})`
        );
      if (curDepth > depth) continue;
      const baseHost = hostnameFromUrl(url);
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

      if (dbgGlobal) console.log(`Crawling (${curDepth}) ${url}`);

      let targetAnchors = null as any;
      let pageMeta: { title?: string; description?: string } | undefined;

      for (const c of FRIEND_PAGE_CANDIDATES) {
        const attempt = new URL(c, url).href;
        if (dbgGlobal) console.log("Trying candidate friend page:", attempt);
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
        if (dbgGlobal) console.log(`No friend anchors found for ${url}`);
        continue;
      }

      const friendsList = targetAnchors
        .map((a: any) => {
          const h = hostnameFromUrl(a.href);
          if (!h) return null;
          if (h === baseHost) return null;
          if (
            hostMatchesSet(h, IGNORED_HOSTS) ||
            hostMatchesSet(h, AGGREGATORS)
          )
            return null;
          const nm = sanitizeLabel(a.text || h) || h;
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
        const siteNameRaw = pageMeta?.title ?? url;
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
            if (dbgGlobal)
              console.log(`Wrote base YAML for ${baseHost} -> ${baseFilename}`);
          }
        } else if (dbgGlobal) {
          console.log(
            `[DRY] Would write base YAML for ${baseHost} -> ${baseFilename}`
          );
        }
      }

      for (const anchor of targetAnchors) {
        const anchorHost = hostnameFromUrl(anchor.href);
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
          if (dbgGlobal)
            console.log(
              `Skipping ${anchorHost}: yaml already present (${anchorFilename})`
            );
          continue;
        }

        if (!discovered.has(anchorHost) && !visited.has(anchorHost)) {
          discovered.set(anchorHost, anchor.href);
          queue.push({ url: anchor.href, depth: curDepth + 1 });
          if (dbgGlobal)
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
