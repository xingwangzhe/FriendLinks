#!/usr/bin/env node
import { promises as fs } from "fs";
import path from "path";
import YAML from "yaml";

async function listYamlFiles(dir: string) {
  const names = await fs.readdir(dir);
  return names.filter((n) => n.endsWith(".yml") || n.endsWith(".yaml"));
}

function removeKey(obj: any, key: string) {
  if (!obj || typeof obj !== "object") return false;
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    delete obj[key];
    return true;
  }
  return false;
}

async function processFile(dir: string, file: string) {
  const full = path.join(dir, file);
  const raw = await fs.readFile(full, "utf8");
  const doc = YAML.parseDocument(raw, {
    keepCstNodes: true,
    keepNodeTypes: true,
  });

  let changed = false;
  const root = doc.toJSON() as any;
  if (root && typeof root === "object") {
    if (root.site && typeof root.site === "object") {
      if (removeKey(root.site, "favicon")) changed = true;
      if (Array.isArray(root.site.friends)) {
        for (const f of root.site.friends) {
          if (f && typeof f === "object") {
            if (removeKey(f, "favicon")) changed = true;
          }
        }
      }
    }
  }

  if (!changed) return { file, changed: false };

  // Recreate YAML document from modified object but preserve some formatting
  const newDoc = new YAML.Document();
  newDoc.contents = root;
  newDoc.options.indent = 2;
  const out = String(newDoc);
  await fs.writeFile(full, out, "utf8");
  return { file, changed: true };
}

async function main() {
  const dir = path.join(process.cwd(), "links");
  try {
    const files = await listYamlFiles(dir);
    if (!files.length) {
      console.log("No YAML files found in links/");
      return;
    }

    const results = await Promise.allSettled(
      files.map((f) => processFile(dir, f))
    );
    let changedCount = 0;
    for (const r of results) {
      if (r.status === "fulfilled") {
        if (r.value.changed) {
          console.log(`Updated: ${r.value.file}`);
          changedCount++;
        }
      } else {
        console.error(`Error processing file: ${(r as any).reason}`);
      }
    }
    console.log(`Done. ${changedCount} file(s) updated.`);
  } catch (e) {
    console.error("Fatal:", e);
    process.exit(1);
  }
}

// Run main with robust error reporting when executed as a script
(async () => {
  try {
    await main();
  } catch (err: any) {
    // Print full error stack when available to aid debugging
    if (err && err.stack) console.error("Fatal:", err.stack);
    else console.error("Fatal:", err);
    process.exit(1);
  }
})();
