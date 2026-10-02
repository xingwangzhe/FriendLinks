import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import YAML from "yaml";
import type { Site } from "../types/site";
import { listYamlFiles } from "../src/utils/yaml-files";
import { loadAuditRules, type AuditRules } from "./lib/audit-rules";
import { classify, type Decision, type PageSignals } from "./lib/audit-classifier";
import { createFetchQueue, fetchPage } from "./lib/audit-fetch";
import { getHost, loadDenyList, normalizeUrl } from "./lib/audit-url";
import { checkReputation, loadReputationCache, saveReputationCache, type ReputationResult } from "./lib/reputation";

interface Options {
  dir: string;
  format: "json" | "jsonl" | "tsv";
  out: string | null;
  rules: string;
  deny: string;
  fetch: boolean;
  reputation: "none" | "google" | "virustotal";
  reputationCache: string;
  concurrency: number;
  intervalCap: number;
  interval: number;
  siteOnly: boolean;
  friendsOnly: boolean;
  host: string | null;
  help: boolean;
}

interface AuditRecord {
  kind: "site" | "friend";
  decision: Decision;
  reasons: string[];
  file?: string;
  name: string;
  description?: string;
  url: string;
  canonicalUrl: string | null;
  host: string | null;
  sourceFiles?: string[];
  sourceSites?: string[];
  references?: number;
  friends?: number;
  signals: Record<string, number | boolean>;
  fetch?: {
    status: number;
    finalUrl: string;
    robotsAllowed: boolean;
    error?: string;
    page?: PageSignals;
  };
  reputation?: ReputationResult;
}

const HELP = `audit-links — 生成友链准入审核报告（只读）

说明:
  该命令只生成启发式审核建议，不会修改 links/。关键词、RSS 和 <article>
  只能将站点作为候选线索；在人工确认原创性、发布索引和永久链接前，
  输出的 review 对应落库状态 unverified。

用法:
  bun run audit [选项]

选项:
  --fetch                 抓取页面元数据（默认关闭）
  --reputation PROVIDER   启用 google 或 virustotal 信誉查询（默认 none）
  --reputation-cache PATH 信誉结果缓存（默认 .audit-reputation.json）
  --format json|jsonl|tsv 输出格式（默认 jsonl）
  --out <path>            写入文件，默认 stdout
  --dir <path>            YAML 目录（默认 links）
  --rules <path>          规则文件（默认 config/audit-rules.yml）
  --deny <path>           deny 列表（默认 config/deny-hosts.txt）
  --concurrency N         抓取并发数（默认 6）
  --interval-cap N        时间窗口内请求数（默认 30）
  --interval MS           请求时间窗口（默认 60000）
  --site-only             只输出站点记录
  --friends-only          只输出去重后的 friend 记录
  --host <hostname>       只输出指定 host
  --help
`;

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    dir: "links",
    format: "jsonl",
    out: null,
    rules: "config/audit-rules.yml",
    deny: "config/deny-hosts.txt",
    fetch: false,
    reputation: "none",
    reputationCache: ".audit-reputation.json",
    concurrency: 6,
    intervalCap: 30,
    interval: 60000,
    siteOnly: false,
    friendsOnly: false,
    host: null,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") opts.help = true;
    else if (arg === "--fetch") opts.fetch = true;
    else if (arg === "--reputation") opts.reputation = (argv[++i] ?? "none") as Options["reputation"];
    else if (arg === "--reputation-cache") opts.reputationCache = argv[++i] ?? opts.reputationCache;
    else if (arg === "--site-only") opts.siteOnly = true;
    else if (arg === "--friends-only") opts.friendsOnly = true;
    else if (arg === "--format") opts.format = (argv[++i] ?? opts.format) as Options["format"];
    else if (arg === "--out") opts.out = argv[++i] ?? null;
    else if (arg === "--dir") opts.dir = argv[++i] ?? opts.dir;
    else if (arg === "--rules") opts.rules = argv[++i] ?? opts.rules;
    else if (arg === "--deny") opts.deny = argv[++i] ?? opts.deny;
    else if (arg === "--concurrency") opts.concurrency = Number(argv[++i]);
    else if (arg === "--interval-cap") opts.intervalCap = Number(argv[++i]);
    else if (arg === "--interval") opts.interval = Number(argv[++i]);
    else if (arg === "--host") opts.host = argv[++i]?.toLowerCase() ?? null;
    else if (arg.startsWith("--format=")) opts.format = arg.slice(9) as Options["format"];
    else if (arg.startsWith("--out=")) opts.out = arg.slice(6);
    else if (arg.startsWith("--dir=")) opts.dir = arg.slice(6);
    else if (arg.startsWith("--rules=")) opts.rules = arg.slice(8);
    else if (arg.startsWith("--deny=")) opts.deny = arg.slice(7);
    else if (arg.startsWith("--reputation=")) opts.reputation = arg.slice(13) as Options["reputation"];
    else if (arg.startsWith("--reputation-cache=")) opts.reputationCache = arg.slice(20);
    else if (arg.startsWith("--host=")) opts.host = arg.slice(7).toLowerCase();
  }
  if (!(["json", "jsonl", "tsv"] as string[]).includes(opts.format)) throw new Error(`未知格式: ${opts.format}`);
  if (!["none", "google", "virustotal"].includes(opts.reputation))
    throw new Error(`未知信誉 provider: ${opts.reputation}`);
  for (const [name, value] of Object.entries({
    concurrency: opts.concurrency,
    intervalCap: opts.intervalCap,
    interval: opts.interval,
  })) {
    if (!Number.isInteger(value) || value <= 0) throw new Error(`--${name} 必须是正整数`);
  }
  return opts;
}

function parseSite(file: string): Site | null {
  try {
    const raw = YAML.parse(readFileSync(file, "utf8")) as { site?: Site };
    return raw.site ?? null;
  } catch {
    return null;
  }
}

function addRecord(records: AuditRecord[], record: AuditRecord, opts: Options) {
  if (opts.siteOnly && record.kind !== "site") return;
  if (opts.friendsOnly && record.kind !== "friend") return;
  if (opts.host && record.host !== opts.host) return;
  records.push(record);
}

function summarize(records: AuditRecord[]) {
  const summary = {
    total: records.length,
    site: 0,
    friend: 0,
    include: 0,
    review: 0,
    exclude: 0,
    reasons: {} as Record<string, number>,
  };
  for (const record of records) {
    summary[record.kind]++;
    summary[record.decision]++;
    for (const reason of record.reasons) summary.reasons[reason] = (summary.reasons[reason] ?? 0) + 1;
  }
  return summary;
}

function render(records: AuditRecord[], format: Options["format"]) {
  if (format === "jsonl") return records.map((record) => JSON.stringify(record)).join("\n") + "\n";
  if (format === "json") return JSON.stringify({ summary: summarize(records), records }, null, 2) + "\n";
  const columns = ["kind", "decision", "reasons", "name", "url", "canonical_url", "host", "file", "references"];
  const rows = records.map((record) => [
    record.kind,
    record.decision,
    record.reasons.join("|"),
    record.name,
    record.url,
    record.canonicalUrl ?? "",
    record.host ?? "",
    record.file ?? record.sourceFiles?.join("|") ?? "",
    String(record.references ?? ""),
  ]);
  return [columns, ...rows].map((row) => row.map((cell) => JSON.stringify(cell)).join("\t")).join("\n") + "\n";
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(HELP);
    return;
  }
  const rules: AuditRules = existsSync(opts.rules)
    ? loadAuditRules(opts.rules)
    : { sensitiveTerms: [], commercialTerms: [], directoryTerms: [], blogTerms: [], platformTerms: [] };
  const deny = loadDenyList(opts.deny);
  const files = await listYamlFiles(opts.dir);
  const records: AuditRecord[] = [];
  const friendMap = new Map<
    string,
    { name: string; url: string; sourceFiles: Set<string>; sourceSites: Set<string>; references: number }
  >();
  for (const file of files) {
    const site = parseSite(file);
    if (!site) {
      addRecord(
        records,
        {
          kind: "site",
          decision: "review",
          reasons: ["invalid-yaml"],
          file: relative(process.cwd(), file),
          name: "",
          url: "",
          canonicalUrl: null,
          host: null,
          friends: 0,
          signals: {},
        },
        opts,
      );
      continue;
    }
    const normalized = normalizeUrl(site.url);
    const classification = classify(site, rules, deny);
    addRecord(
      records,
      {
        kind: "site",
        decision: classification.decision,
        reasons: classification.reasons,
        file: relative(process.cwd(), file),
        name: site.name,
        description: site.description,
        url: site.url,
        canonicalUrl: normalized?.canonical ?? null,
        host: normalized?.host ?? getHost(site.url),
        friends: site.friends.length,
        signals: classification.signals,
      },
      opts,
    );
    for (const friend of site.friends) {
      const friendUrl = normalizeUrl(friend.url);
      if (!friendUrl) continue;
      const key = friendUrl.canonical;
      const current = friendMap.get(key) ?? {
        name: friend.name,
        url: friend.url,
        sourceFiles: new Set(),
        sourceSites: new Set(),
        references: 0,
      };
      current.sourceFiles.add(relative(process.cwd(), file));
      current.sourceSites.add(site.name);
      current.references++;
      friendMap.set(key, current);
    }
  }

  const queue =
    opts.fetch || opts.reputation !== "none"
      ? createFetchQueue(opts.concurrency, opts.intervalCap, opts.interval)
      : null;
  const reputationCache = loadReputationCache(opts.reputationCache);
  const friendEntries = [...friendMap.entries()];
  const friendRecords = await Promise.all(
    friendEntries.map(async ([, friend]) => {
      const normalized = normalizeUrl(friend.url);
      if (!normalized) return null;
      const base = classify(friend, rules, deny);
      let fetchData: AuditRecord["fetch"];
      let reputation: ReputationResult | undefined;
      let classification = base;
      if (queue) {
        fetchData = await queue.add(async () => {
          if (opts.fetch) {
            const result = await fetchPage(normalized.canonical);
            if (result.error || !result.robotsAllowed) return { ...result, page: result.signals };
            classification = classify(friend, rules, deny, result.signals);
            return { ...result, page: result.signals };
          }
          return { status: 0, finalUrl: normalized.canonical, robotsAllowed: true, signals: {} };
        });
        if (fetchData.error)
          classification = {
            ...classification,
            decision: classification.decision === "exclude" ? "exclude" : "review",
            reasons: [...new Set([...classification.reasons, `fetch-error:${fetchData.error}`])],
          };
        if (!fetchData.robotsAllowed)
          classification = {
            ...classification,
            decision: classification.decision === "exclude" ? "exclude" : "review",
            reasons: [...new Set([...classification.reasons, "robots-disallowed"])],
          };
        if (opts.reputation !== "none") {
          const cached = reputationCache[normalized.canonical];
          reputation = cached
            ? { ...cached, cached: true }
            : await checkReputation(opts.reputation, normalized.canonical);
          reputationCache[normalized.canonical] = reputation;
          if (reputation.verdict === "malicious")
            classification = {
              ...classification,
              decision: "exclude",
              reasons: [...new Set([...classification.reasons, `reputation-malicious:${reputation.provider}`])],
            };
          else if (
            reputation.verdict === "suspicious" ||
            reputation.verdict === "unavailable" ||
            reputation.verdict === "unknown"
          )
            classification = {
              ...classification,
              decision: classification.decision === "exclude" ? "exclude" : "review",
              reasons: [
                ...new Set([...classification.reasons, `reputation-${reputation.verdict}:${reputation.provider}`]),
              ],
            };
        }
      }
      return {
        kind: "friend",
        decision: classification.decision,
        reasons: classification.reasons,
        name: friend.name,
        url: friend.url,
        canonicalUrl: normalized.canonical,
        host: normalized.host,
        sourceFiles: [...friend.sourceFiles],
        sourceSites: [...friend.sourceSites],
        references: friend.references,
        signals: classification.signals,
        ...(fetchData && opts.fetch ? { fetch: fetchData } : {}),
        ...(reputation ? { reputation } : {}),
      } satisfies AuditRecord;
    }),
  );
  for (const record of friendRecords) if (record) addRecord(records, record, opts);

  if (opts.reputation !== "none") saveReputationCache(opts.reputationCache, reputationCache);
  const body = render(records, opts.format);
  if (opts.out) {
    mkdirSync(dirname(opts.out), { recursive: true });
    writeFileSync(opts.out, body, "utf8");
    console.error(`[audit] 已写入 ${opts.out}`);
  } else process.stdout.write(body);
  console.error(`[audit] ${JSON.stringify(summarize(records))}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
