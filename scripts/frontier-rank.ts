/**
 * frontier-rank — 递归扫描 links 目录下所有 .yml，找出「被友链引用但尚未建节点」的域名，
 * 按入度（被多少已收录站点链到）排序，并做 L1 硬排除标记。
 *
 * 用法（请在仓库根目录执行）：
 *
 *   bun run scripts/frontier-rank.ts
 *   bun run scripts/frontier-rank.ts --top 50
 *   bun run scripts/frontier-rank.ts --min 5 --format tsv
 *   bun run scripts/frontier-rank.ts --json > frontier.json
 *   bun run scripts/frontier-rank.ts --include-denied --top 100
 *   bun run scripts/frontier-rank.ts --out reports/frontier.tsv --format tsv
 *   bun run scripts/frontier-rank.ts --top 30 --probe-feed
 *
 * 选项：
 *   --top N            只输出入度最高的 N 条（默认 100；0 = 全部）
 *   --min N            最低入度（默认 1）
 *   --include-denied   包含命中 deny-hosts 的域名（默认排除）
 *   --format table|tsv|json   输出格式（默认 table）
 *   --out <path>       写入文件（默认 stdout）
 *   --deny <path>      deny 列表路径（默认 config/deny-hosts.txt）
 *   --probe-feed       对输出结果探测常见 feed 路径（HEAD，较慢）
 *   --help             帮助
 *
 * 不自动写 yml、不自动爬取；仅生成扩网优先队列。
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { loadSites, clearSiteCache } from "../src/utils/load-sites";

// ─── CLI ───────────────────────────────────────────────────────────

type Format = "table" | "tsv" | "json";

interface Options {
  top: number;
  min: number;
  includeDenied: boolean;
  format: Format;
  out: string | null;
  denyPath: string;
  probeFeed: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    top: 100,
    min: 1,
    includeDenied: false,
    format: "table",
    out: null,
    denyPath: join(process.cwd(), "config/deny-hosts.txt"),
    probeFeed: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") opts.help = true;
    else if (a === "--include-denied") opts.includeDenied = true;
    else if (a === "--probe-feed") opts.probeFeed = true;
    else if (a === "--top") opts.top = Number(argv[++i] ?? 100);
    else if (a === "--min") opts.min = Number(argv[++i] ?? 1);
    else if (a === "--format") opts.format = (argv[++i] as Format) ?? "table";
    else if (a === "--out") opts.out = argv[++i] ?? null;
    else if (a === "--deny") opts.denyPath = argv[++i] ?? opts.denyPath;
    else if (a.startsWith("--top=")) opts.top = Number(a.slice(6));
    else if (a.startsWith("--min=")) opts.min = Number(a.slice(6));
    else if (a.startsWith("--format=")) opts.format = a.slice(9) as Format;
    else if (a.startsWith("--out=")) opts.out = a.slice(6);
    else if (a.startsWith("--deny=")) opts.denyPath = a.slice(7);
  }

  if (!["table", "tsv", "json"].includes(opts.format)) {
    console.error(`未知 --format: ${opts.format}（可用 table|tsv|json）`);
    process.exit(2);
  }
  if (Number.isNaN(opts.top) || opts.top < 0) {
    console.error("--top 必须是 >= 0 的整数（0 表示全部）");
    process.exit(2);
  }
  if (Number.isNaN(opts.min) || opts.min < 0) {
    console.error("--min 必须是 >= 0 的整数");
    process.exit(2);
  }
  return opts;
}

const HELP = `frontier-rank — 按入度排序「友链引用但未建节点」的域名

用法:
  bun run scripts/frontier-rank.ts [选项]
  bun run frontier   # 若已在 package.json 注册

选项:
  --top N             输出前 N 条（默认 100；0=全部）
  --min N             最低入度（默认 1）
  --include-denied    包含 L1 deny 命中项
  --format table|tsv|json
  --out <path>        写到文件
  --deny <path>       deny 列表（默认 config/deny-hosts.txt）
  --probe-feed        探测 /atom.xml /feed /rss.xml 等（需网络）
  --help
`;

// ─── Host 规范化 ───────────────────────────────────────────────────

function getHost(u: string): string | null {
  try {
    const h = new URL(u).hostname.toLowerCase();
    return h || null;
  } catch {
    return null;
  }
}

/** 去掉常见 www. 前缀，便于与文件名 / 互链对齐 */
function stripWww(host: string): string {
  return host.replace(/^www\./, "");
}

// ─── Deny list ─────────────────────────────────────────────────────

interface DenyList {
  exact: Set<string>;
  /** host.endsWith(suffix)，suffix 含前导点，如 .github.io */
  suffixes: string[];
}

function loadDenyList(path: string): DenyList {
  const exact = new Set<string>();
  const suffixes: string[] = [];
  if (!existsSync(path)) {
    console.error(`⚠ deny 列表不存在: ${path}（将不使用 L1 排除）`);
    return { exact, suffixes };
  }
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const raw = line.trim();
    if (!raw || raw.startsWith("#")) continue;
    const token = raw.toLowerCase();
    if (token.startsWith(".")) suffixes.push(token);
    else exact.add(stripWww(token));
  }
  return { exact, suffixes };
}

function isDenied(host: string, deny: DenyList): string | null {
  const h = stripWww(host);
  if (deny.exact.has(h) || deny.exact.has(host)) return "exact";
  for (const s of deny.suffixes) {
    if (host.endsWith(s) || h.endsWith(s)) return `suffix:${s}`;
  }
  return null;
}

// ─── dead.txt（可选）───────────────────────────────────────────────

function loadDeadHosts(path: string): Set<string> {
  const set = new Set<string>();
  if (!existsSync(path)) return set;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim().toLowerCase();
    // 仅接受纯 hostname 行（跳过标题、空行、注释）
    if (!t || t.startsWith("#") || t.includes(" ") || !t.includes(".")) continue;
    if (/^[a-z0-9._-]+$/.test(t)) set.add(stripWww(t));
  }
  return set;
}

// ─── Feed probe（可选）─────────────────────────────────────────────

const FEED_PATHS = [
  "/atom.xml",
  "/feed",
  "/feed.xml",
  "/rss.xml",
  "/rss",
  "/index.xml",
  "/feed/atom",
  "/atom",
];

async function probeFeed(host: string): Promise<string | null> {
  const bases = [`https://${host}`, `https://www.${host}`];
  for (const base of bases) {
    for (const p of FEED_PATHS) {
      const url = base + p;
      try {
        const res = await fetch(url, {
          method: "HEAD",
          redirect: "follow",
          signal: AbortSignal.timeout(8000),
          headers: { "User-Agent": "FriendLinks-frontier-rank/1.0" },
        });
        if (res.ok) return url;
      } catch {
        /* try next */
      }
    }
  }
  return null;
}

// ─── 主逻辑 ────────────────────────────────────────────────────────

interface FrontierEntry {
  host: string;
  /** 建议 yml 文件名（不含 .yml） */
  suggestedFile: string;
  degree: number;
  /** 引用方站点名（最多保留若干） */
  sources: string[];
  /** 友链里出现过的展示名（样本） */
  names: string[];
  denied: string | null;
  dead: boolean;
  feedUrl?: string | null;
}

/** 进度/诊断一律打 stderr，避免被 `> file` 或管道吃掉 */
function log(...args: unknown[]) {
  console.error(...args);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(HELP);
    process.exit(0);
  }

  log("[frontier-rank] 启动");
  log(`[frontier-rank] cwd=${process.cwd()}`);
  log(
    `[frontier-rank] 参数: top=${opts.top} min=${opts.min} format=${opts.format}` +
      ` includeDenied=${opts.includeDenied} probeFeed=${opts.probeFeed}`,
  );

  const deny = loadDenyList(opts.denyPath);
  log(
    `[frontier-rank] deny 列表: ${opts.denyPath}` +
      ` (exact=${deny.exact.size}, suffix=${deny.suffixes.length})`,
  );
  const dead = loadDeadHosts(join(process.cwd(), "dead.txt"));
  log(`[frontier-rank] dead.txt: ${dead.size} 条`);

  log("[frontier-rank] 加载 links/**/*.yml …（约数千文件，可能需数秒）");
  const t0 = performance.now();
  clearSiteCache();
  const sites = await loadSites("links");
  const tLoad = performance.now() - t0;
  if (sites.length === 0) {
    log("未加载到任何站点，请确认在仓库根目录运行且 links/ 存在");
    process.exit(1);
  }
  log(`[frontier-rank] 已加载 ${sites.length} 个站点 (${(tLoad / 1000).toFixed(2)}s)`);

  // 已有节点：site.url 的 hostname + stripWww 变体
  const existing = new Set<string>();
  const hostToSiteName = new Map<string, string>();
  for (const s of sites) {
    const h = getHost(s.url);
    if (!h) continue;
    existing.add(h);
    existing.add(stripWww(h));
    hostToSiteName.set(h, s.name);
    hostToSiteName.set(stripWww(h), s.name);
  }
  log(`[frontier-rank] 已有节点 hostname 键: ${existing.size}`);

  // 入度统计
  type Acc = {
    degree: number;
    sources: Set<string>;
    names: Set<string>;
  };
  const missing = new Map<string, Acc>();

  log("[frontier-rank] 扫描 friends 出边 …");
  const t1 = performance.now();
  let friendEdges = 0;
  for (const s of sites) {
    const sourceHost = getHost(s.url) ?? s.name;
    for (const f of s.friends ?? []) {
      friendEdges++;
      const fh = getHost(f.url);
      if (!fh) continue;
      const key = stripWww(fh);
      // 已是节点则跳过
      if (existing.has(fh) || existing.has(key)) continue;

      let acc = missing.get(key);
      if (!acc) {
        acc = { degree: 0, sources: new Set(), names: new Set() };
        missing.set(key, acc);
      }
      acc.degree += 1;
      if (acc.sources.size < 8) acc.sources.add(s.name || sourceHost);
      const nm = (f.name || "").trim();
      if (nm && acc.names.size < 5) acc.names.add(nm);
    }
  }
  log(
    `[frontier-rank] friends 边 ${friendEdges} 条 · 缺失域名 ${missing.size} 个` +
      ` (${((performance.now() - t1) / 1000).toFixed(2)}s)`,
  );

  let rows: FrontierEntry[] = [];
  let skippedLowDegree = 0;
  let skippedDenied = 0;
  for (const [host, acc] of missing) {
    if (acc.degree < opts.min) {
      skippedLowDegree++;
      continue;
    }
    const denied = isDenied(host, deny);
    if (denied && !opts.includeDenied) {
      skippedDenied++;
      continue;
    }
    rows.push({
      host,
      suggestedFile: host,
      degree: acc.degree,
      sources: [...acc.sources],
      names: [...acc.names],
      denied,
      dead: dead.has(host),
    });
  }

  rows.sort((a, b) => b.degree - a.degree || a.host.localeCompare(b.host));
  const beforeTop = rows.length;
  if (opts.top > 0) rows = rows.slice(0, opts.top);
  log(
    `[frontier-rank] 过滤后 ${beforeTop} 行` +
      ` (跳过低入度 ${skippedLowDegree} · 跳过 deny ${skippedDenied})` +
      ` → 输出 ${rows.length} 行`,
  );

  if (opts.probeFeed) {
    log(`[frontier-rank] 探测 feed 中（${rows.length} 个，可能较慢）…`);
    let i = 0;
    for (const row of rows) {
      i++;
      if (row.denied || row.dead) {
        row.feedUrl = null;
        continue;
      }
      process.stderr.write(`  [${i}/${rows.length}] ${row.host} … `);
      row.feedUrl = await probeFeed(row.host);
      process.stderr.write(row.feedUrl ? `✓ ${row.feedUrl}\n` : "—\n");
    }
  }

  // 统计摘要
  const totalMissing = missing.size;
  const deniedCount = [...missing.keys()].filter((h) => isDenied(h, deny)).length;
  const summary = {
    sites: sites.length,
    uniqueMissingHosts: totalMissing,
    deniedAmongMissing: deniedCount,
    outputRows: rows.length,
    minDegree: opts.min,
    includeDenied: opts.includeDenied,
  };

  log(
    `[frontier-rank] 摘要: sites=${summary.sites}` +
      ` missing=${summary.uniqueMissingHosts}` +
      ` denied=${summary.deniedAmongMissing}` +
      ` out=${summary.outputRows}`,
  );
  log("[frontier-rank] 写出结果 …");

  let body: string;
  if (opts.format === "json") {
    body = JSON.stringify({ summary, frontier: rows }, null, 2) + "\n";
  } else if (opts.format === "tsv") {
    const header = [
      "degree",
      "host",
      "suggested_file",
      "denied",
      "dead",
      "feed",
      "names",
      "sources",
    ].join("\t");
    const lines = rows.map((r) =>
      [
        r.degree,
        r.host,
        r.suggestedFile,
        r.denied ?? "",
        r.dead ? "1" : "0",
        r.feedUrl ?? "",
        r.names.join("|"),
        r.sources.join("|"),
      ].join("\t"),
    );
    body = [header, ...lines].join("\n") + "\n";
  } else {
    const lines: string[] = [];
    lines.push("Frontier 排名（无 yml 节点，按入度降序）");
    lines.push("─".repeat(72));
    lines.push(
      `已收录站点 ${summary.sites} · 缺失域名 ${summary.uniqueMissingHosts}` +
        ` · deny 命中 ${summary.deniedAmongMissing} · 本表 ${summary.outputRows} 行`,
    );
    lines.push("─".repeat(72));
    lines.push(
      pad("度", 5) +
        pad("域名", 36) +
        pad("标记", 10) +
        (opts.probeFeed ? pad("feed", 6) : "") +
        "样本名 / 引用来源",
    );
    for (const r of rows) {
      const flag = r.denied ? "DENY" : r.dead ? "DEAD" : "";
      const feed = opts.probeFeed ? (r.feedUrl ? "yes" : "no") : "";
      const sample = [
        r.names.slice(0, 2).join(", "),
        r.sources.slice(0, 2).join(", "),
      ]
        .filter(Boolean)
        .join(" ← ");
      lines.push(
        pad(String(r.degree), 5) +
          pad(r.host, 36) +
          pad(flag, 10) +
          (opts.probeFeed ? pad(feed, 6) : "") +
          sample,
      );
    }
    lines.push("─".repeat(72));
    lines.push("建议：优先处理高入度且无 DENY/DEAD 的域名 → find_friends.py / friend-link-finder");
    lines.push(`  python3 skills/friend-link-finder/scripts/find_friends.py https://<host>`);
    body = lines.join("\n") + "\n";
  }

  if (opts.out) {
    mkdirSync(dirname(opts.out), { recursive: true });
    writeFileSync(opts.out, body, "utf8");
    log(`[frontier-rank] 已写入文件: ${opts.out} (${body.length} bytes)`);
  } else {
    // 表格/TSV/JSON 本体走 stdout，便于管道
    process.stdout.write(body);
    log(`[frontier-rank] 已打印到 stdout (${body.length} bytes)`);
  }
  log("[frontier-rank] 完成");
}

function pad(s: string, n: number): string {
  if (s.length >= n) return s.slice(0, n - 1) + " ";
  return s + " ".repeat(n - s.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
