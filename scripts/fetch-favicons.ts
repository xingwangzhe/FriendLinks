import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import YAML from "yaml";

type Friend = { name: string; url: string; favicon?: string };
type SiteDoc = {
  site: {
    name: string;
    description: string;
    url: string;
    favicon?: string;
    friends: Friend[];
  };
};

const LINKS_DIR = "links";

function resolveUrl(base: string, href: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

async function existsUrl(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as Error).name === "AbortError") {
      console.warn(`Timeout for HEAD ${url}`);
    } else {
      console.warn(`HEAD check failed for ${url}:`, (err as Error).message);
    }
    return false;
  }
}

async function fetchPage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as Error).name === "AbortError") {
      console.warn(`Timeout for fetch ${url}`);
    } else {
      console.warn(`Fetch failed for ${url}:`, (err as Error).message);
    }
    return null;
  }
}

const linkRegex =
  /<link[^>]+rel=["']?([^"'>]+)["']?[^>]*href=["']([^"']+)["'][^>]*>/gi;
const ICON_RELATIONS = [
  "icon",
  "shortcut icon",
  "apple-touch-icon",
  "apple-touch-icon-precomposed",
];

async function processYamlFile(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  const doc = YAML.parseDocument(raw);
  const root = doc.toJS() as SiteDoc | undefined;
  if (!root || !root.site || !Array.isArray(root.site.friends)) {
    console.error(
      `YAML format not as expected in ${filePath}: missing site.friends`
    );
    return;
  }

  let updated = false;
  for (const f of root.site.friends) {
    if (f.favicon && f.favicon.trim() !== "") continue; // already has favicon

    const target = f.url;
    console.log("Processing", f.name, target);
    let favicon: string | undefined;

    const html = await fetchPage(target);
    if (html) {
      let m: RegExpExecArray | null;
      while ((m = linkRegex.exec(html))) {
        const rel = (m[1] || "").toLowerCase().trim();
        const href = (m[2] || "").trim();
        if (!rel || !href) continue;
        if (ICON_RELATIONS.includes(rel)) {
          const resolved = resolveUrl(target, href);
          if (resolved) {
            favicon = resolved;
            break;
          }
        }
      }
    }

    if (!favicon) {
      // try /favicon.ico
      try {
        const u = new URL(target).origin + "/favicon.ico";
        const ok = await existsUrl(u);
        if (ok) favicon = u;
      } catch (err) {
        console.warn(
          `Cannot form origin for ${target}:`,
          (err as Error).message
        );
      }
    }

    if (favicon) {
      // 验证favicon URL是否可访问
      const valid = await existsUrl(favicon);
      if (valid) {
        console.log("  -> found and valid", favicon);
        f.favicon = favicon;
        updated = true;
      } else {
        console.log("  -> found but invalid, skipping", favicon);
      }
    } else {
      // 使用回退图标
      try {
        const fallback = "/StreamlinePlumpColorWebFlat.svg";
        console.log("  -> not found, using fallback", fallback);
        f.favicon = fallback;
        updated = true;
      } catch (err) {
        console.warn(
          `Cannot set fallback for ${target}:`,
          (err as Error).message
        );
      }
    }
  }

  if (updated) {
    // write back preserving comments where possible: replace site.friends
    doc.setIn(["site", "friends"], root.site.friends as any);
    await writeFile(filePath, String(doc), "utf8");
    console.log("Updated", filePath);
  } else {
    console.log("No updates needed for", filePath);
  }
}

async function main() {
  const files = await readdir(LINKS_DIR);
  const ymlFiles = files.filter((f) => f.endsWith(".yml"));

  for (const file of ymlFiles) {
    const filePath = join(LINKS_DIR, file);
    await processYamlFile(filePath);
  }

  console.log("All YAML files processed.");
}

main().catch((err) => {
  console.error("Unexpected error:", (err as Error).message);
  process.exit(1);
});
