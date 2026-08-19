import { readdirSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const UNVERIFIED_DIR = "unverified";

function isYamlFile(name: string): boolean {
  return /\.ya?ml$/i.test(name);
}

/**
 * Recursively lists YAML files in a stable order.
 *
 * `unverified` is excluded when encountered below the scan root. Passing an
 * `unverified` directory as the root still lists its candidates explicitly.
 */
export function listYamlFilesSync(rootDir: string): string[] {
  const files: string[] = [];

  function walk(dir: string): void {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== UNVERIFIED_DIR) walk(fullPath);
      } else if (entry.isFile() && isYamlFile(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return files.sort();
}

/** Async counterpart of {@link listYamlFilesSync}. */
export async function listYamlFiles(rootDir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== UNVERIFIED_DIR) await walk(fullPath);
        } else if (entry.isFile() && isYamlFile(entry.name)) {
          files.push(fullPath);
        }
      }),
    );
  }

  await walk(rootDir);
  return files.sort();
}
