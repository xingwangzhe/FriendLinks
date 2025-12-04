import { readdir, stat, readFile, writeFile, mkdir } from "node:fs/promises";
import YAML from "yaml";
import path from "node:path";

async function listYamlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await listYamlFiles(full)));
    } else if (
      e.isFile() &&
      (e.name.endsWith(".yml") || e.name.endsWith(".yaml"))
    ) {
      files.push(full);
    }
  }
  return files;
}

type Friend = { name: string; url: string };
type Site = {
  name: string;
  description: string;
  url: string;
  friends: Friend[];
};

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

function isFriend(obj: unknown): obj is Friend {
  return (
    !!obj &&
    typeof obj === "object" &&
    isString((obj as any).name) &&
    isValidUrl((obj as any).url)
  );
}

function isSite(obj: unknown): obj is Site {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as any;
  if (!isString(o.name) || o.name.trim() === "") return false;
  if (!isString(o.description) || o.description.trim() === "") return false;
  if (!isValidUrl(o.url)) return false;
  const friends = o.friends;
  if (friends == null) return false;
  if (!Array.isArray(friends)) return false;
  return friends.every(isFriend);
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
      // 详细字段提示
      const o = site as any;
      if (!o || typeof o !== "object") {
        console.error(" - site: 需要对象");
      } else {
        if (!isString(o.name) || o.name.trim() === "")
          console.error(" - site.name: 需要非空字符串");
        if (!isString(o.description) || o.description.trim() === "")
          console.error(" - site.description: 需要非空字符串");
        if (!isValidUrl(o.url))
          console.error(" - site.url: 需要合法 http/https URL");
        if (!Array.isArray(o.friends))
          console.error(" - site.friends: 需要数组");
        else {
          o.friends.forEach((f: any, idx: number) => {
            if (!isFriend(f))
              console.error(
                ` - site.friends[${idx}]: 需要 { name: string; url: url }`
              );
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

async function main() {
  const inputDir = path.resolve("links");
  const outPath = path.resolve("links", "all.json");

  try {
    const st = await stat(inputDir);
    if (!st.isDirectory()) {
      console.error("输入路径不是目录：", inputDir);
      process.exit(1);
    }
  } catch {
    console.error("目录不存在：", inputDir);
    process.exit(1);
  }

  const files = await listYamlFiles(inputDir);
  if (files.length === 0) {
    console.log("未找到 YAML 文件。");
    return;
  }

  const validSites: Site[] = [];
  for (const f of files) {
    const site = await parseAndValidate(f);
    if (site) validSites.push(site);
  }

  const output = { count: validSites.length, sites: validSites };
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(output, null, 2), "utf8");
  console.log(
    `已生成: ${outPath}（有效文件数: ${validSites.length}/${files.length}）`
  );
}

// 作为脚本执行
if (require.main === module) {
  // Bun/Node 兼容：Bun 支持 require.main 判定
  main();
}
