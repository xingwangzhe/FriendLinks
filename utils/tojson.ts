import { readdir, stat, readFile, writeFile, mkdir } from "node:fs/promises";
import YAML from "yaml";
import path from "node:path";
import type { Site } from "../types/site";
import type { GraphNode, GraphLink, GraphCategory } from "../types/graph";

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

// 类型均从 types/ 目录引入，避免重复定义

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

function isFriend(
  obj: unknown
): obj is { name: string; url: string; favicon?: string } {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as any;
  if (!isString(o.name)) return false;
  if (!isValidUrl(o.url)) return false;
  if (o.favicon != null && !isString(o.favicon)) return false; // 允许任何string，包括本地路径
  return true;
}

function isSite(obj: unknown): obj is Site {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as any;
  if (!isString(o.name) || o.name.trim() === "") return false;
  if (!isString(o.description) || o.description.trim() === "") return false;
  if (!isValidUrl(o.url)) return false;
  if (o.favicon != null && !isValidUrl(o.favicon)) return false;
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
  const outPath = path.resolve("public", "all.json");

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

  // 生成 ECharts 力导图数据（关系图）
  const categories: GraphCategory[] = [{ name: "site" }, { name: "friend" }];
  const nodes: GraphNode[] = [];

  // 收集所有站点URL（规范化）
  // 使用 hostname 作为唯一标识（域名天然唯一）
  const siteHostSet = new Set<string>();
  const getHost = (u: string): string => {
    try {
      return new URL(u).hostname.toLowerCase();
    } catch {
      return u.toLowerCase();
    }
  };

  for (const s of validSites) {
    siteHostSet.add(getHost(s.url));
  }

  // site host -> 它友链到的站点 host 集合
  const linkMap = new Map<string, Set<string>>();
  // host -> node id (我们使用 host 作为 id)
  const hostToId = new Map<string, string>();

  // 第一步：创建所有站点节点
  // favicon 回退策略：仅使用 YAML 中提供的 favicon（如果合法）；否则回退到本地 svg
  // 注意：不再使用第三方服务（如 favicon.im）。这样前端只依赖本地或 YAML 明确提供的图标。
  const resolveFavicon = (fav: string | undefined) => {
    const localFallback = "/StreamlinePlumpColorWebFlat.svg";
    if (fav && isValidUrl(fav)) return fav;
    return localFallback;
  };

  for (const s of validSites) {
    const host = getHost(s.url) || s.url;
    const siteId = host;
    const siteIcon = resolveFavicon(s.favicon);
    nodes.push({
      id: siteId,
      name: s.name,
      url: s.url,
      favicon: siteIcon,
      desc: s.description,
    });
    linkMap.set(host, new Set());
    hostToId.set(host, siteId);
  }

  // 第二步：分析友链关系，区分"站点间友链"和"外部友链"
  const externalFriends: Array<{
    siteId: string;
    friend: { name: string; url: string; favicon?: string };
  }> = [];

  for (const s of validSites) {
    const sourceNorm = getHost(s.url);
    for (const f of s.friends) {
      const targetHost = getHost(f.url);
      if (siteHostSet.has(targetHost)) {
        // 指向另一个 yaml 定义站点的友链
        linkMap.get(sourceNorm)!.add(targetHost);
      } else {
        // 这是一个外部友链（没有yaml文件定义的站点）
        externalFriends.push({ siteId: sourceNorm, friend: f });
      }
    }
  }

  // 第三步：创建外部友链节点
  for (const { friend } of externalFriends) {
    const friendHost = getHost(friend.url);
    // 如果该 host 已经存在于主站中，优先使用主站的信息（跳过创建外部节点）
    if (!hostToId.has(friendHost)) {
      const friendId = friendHost || friend.url;
      const friendIcon = resolveFavicon(friend.favicon);
      nodes.push({
        id: friendId,
        name: friend.name,
        url: friend.url,
        favicon: friendIcon,
      });
      hostToId.set(friendHost, friendId);
    }
  }

  // 第四步：生成连线
  const linksArr: GraphLink[] = [];
  const addedSiteLinks = new Set<string>(); // 避免重复添加站点间连线

  // 处理站点间的连线（双向=无箭头，单向=有箭头）
  for (const [sourceHost, targetHosts] of linkMap) {
    for (const targetNorm of targetHosts) {
      const sourceId = hostToId.get(sourceHost)!;
      const targetId = hostToId.get(targetNorm)!;
      const pairKey = [sourceHost, targetNorm].sort().join("<->");

      if (addedSiteLinks.has(pairKey)) continue; // 已处理过这对
      addedSiteLinks.add(pairKey);

      const aLinksB = linkMap.get(sourceHost)?.has(targetNorm);
      const bLinksA = linkMap.get(targetNorm)?.has(sourceHost);

      if (aLinksB && bLinksA) {
        // 双向友链：无箭头
        linksArr.push({ source: sourceId, target: targetId });
      } else if (aLinksB) {
        // A单向链接B：A->B箭头
        linksArr.push({
          source: sourceId,
          target: targetId,
          symbol: ["none", "arrow"],
        });
      } else if (bLinksA) {
        // B单向链接A：B->A箭头
        linksArr.push({
          source: targetId,
          target: sourceId,
          symbol: ["none", "arrow"],
        });
      }
    }
  }

  // 处理外部友链的连线（始终单向箭头）
  for (const { siteId, friend } of externalFriends) {
    const friendHost = getHost(friend.url);
    const friendId = hostToId.get(friendHost)!;
    linksArr.push({
      source: siteId,
      target: friendId,
      symbol: ["none", "arrow"],
    });
  }

  const graph = { nodes, links: linksArr, categories };
  const graphPath = path.resolve("public", "graph.json");
  await writeFile(graphPath, JSON.stringify(graph, null, 2), "utf8");
  console.log(`已生成力导图数据: ${graphPath}`);
}

main();
