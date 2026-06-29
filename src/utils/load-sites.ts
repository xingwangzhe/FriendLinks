import { readdir, readFile } from "node:fs/promises";
import YAML from "yaml";
import path from "node:path";
import type { Site } from "../../types/site";

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isValidUrl(u: unknown): u is string {
  if (!isString(u)) return false;
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidHexColor(c: unknown): c is string {
  if (!isString(c)) return false;
  return /^#[0-9a-fA-F]{6}$/.test(c);
}

function isFriend(obj: unknown): obj is { name: string; url: string; favicon?: string } {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as any;
  if (!isString(o.name)) return false;
  if (!isValidUrl(o.url)) return false;
  if (o.favicon != null && !isString(o.favicon)) return false;
  return true;
}

function isSite(obj: unknown): obj is Site {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as any;
  if (!isString(o.name) || o.name.trim() === "") return false;
  if (!isString(o.description) || o.description.trim() === "") return false;
  if (!isValidUrl(o.url)) return false;
  if (o.color != null && !isValidHexColor(o.color)) return false;
  if (!isString(o.links) || o.links.trim() === "") return false;
  if (o.favicon != null && !isValidUrl(o.favicon)) return false;
  const friends = o.friends;
  if (friends == null) return false;
  if (!Array.isArray(friends)) return false;
  return friends.every(isFriend);
}

async function listYamlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await listYamlFiles(full)));
    } else if (e.isFile() && (e.name.endsWith(".yml") || e.name.endsWith(".yaml"))) {
      files.push(full);
    }
  }
  return files;
}

async function parseAndValidate(file: string): Promise<Site | null> {
  try {
    const text = await readFile(file, "utf8");
    const obj = YAML.parse(text);
    if (!obj || typeof obj !== "object") {
      console.error(`[类型错误] ${file}: 根节点不是对象`);
      return null;
    }
    const site = (obj as any).site;
    if (!isSite(site)) {
      console.error(`[类型错误] ${file}: 不符合 Site 类型`);
      const o = site as any;
      if (!o || typeof o !== "object") {
        console.error(" - site: 需要对象");
      } else {
        if (!isString(o.name) || o.name.trim() === "") console.error(" - site.name: 需要非空字符串");
        if (!isString(o.description) || o.description.trim() === "")
          console.error(" - site.description: 需要非空字符串");
        if (!isValidUrl(o.url)) console.error(" - site.url: 需要合法 http/https URL");
        if (!isString(o.links) || o.links.trim() === "")
          console.error(" - site.links: 需要非空字符串（友链路由，如 /links /link /friends）");
        if (!Array.isArray(o.friends)) console.error(" - site.friends: 需要数组");
        else {
          o.friends.forEach((f: any, idx: number) => {
            if (!isFriend(f)) console.error(` - site.friends[${idx}]: 需要 { name: string; url: url }`);
          });
        }
      }
      return null;
    }
    return site;
  } catch (e) {
    console.error(`[解析失败] ${file}:`, (e as Error).message);
    return null;
  }
}

export async function loadSites(dir?: string): Promise<Site[]> {
  const inputDir = dir ?? path.resolve("links");
  const files = await listYamlFiles(inputDir);
  if (files.length === 0) {
    console.log("未找到 YAML 文件。");
    return [];
  }
  const validSites: Site[] = [];
  for (const f of files) {
    const site = await parseAndValidate(f);
    if (site) validSites.push(site);
  }
  return validSites;
}
