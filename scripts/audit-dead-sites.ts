import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { addBlacklistDomain, enforceBlacklist } from "../src/utils/blacklist";
import { listYamlFiles } from "../src/utils/yaml-files";

const DEFAULT_SEED = "20261114";
const DEFAULT_REPORT_DIR = ".audit-dead-sites/2026-11-14";
const DEFAULT_PROXY = process.env.AUDIT_PROXY ?? "http://127.0.0.1:7897";
const USER_AGENT = "FriendLinks-dead-site-audit/1.0 (+mailto:xingwangzhe@outlook.com)";
const CHECK_HOST_TIMEOUT_MS = 25_000;
const CHECK_HOST_POLL_MS = 1_500;
const CHECK_HOST_MAX_POLLS = 12;

type SampleSite = {
  file: string;
  name: string;
  url: string;
  domain: string;
  friendCount: number;
};

type SampleFile = {
  generatedAt: string;
  seed: string;
  algorithm: string;
  sourceFiles: number;
  candidates: number;
  duplicateDomains: number;
  sampleSize: number;
  sites: SampleSite[];
};

type LocalProbe = {
  checkedAt: string;
  status: "reachable" | "failed";
  httpStatus: number | null;
  effectiveUrl: string | null;
  remoteIp: string | null;
  error: string | null;
  attempts: number;
  durationMs: number;
};

type DnsProbe = {
  status: "resolved" | "nxdomain" | "nodata" | "unknown";
  addresses: string[];
  statusCode: number | null;
  error: string | null;
};

type CheckHostNode = {
  node: string;
  location: string;
  result: "ok" | "failed" | "unknown";
  detail: string;
};

type GlobalProbe = {
  checkedAt: string;
  apiStatus: "ok" | "error" | "rate-limited";
  reachable: boolean | null;
  error: string | null;
  nodes: CheckHostNode[];
  reportUrl: string | null;
};

type AuditRecord = SampleSite & {
  local: LocalProbe;
  dns: DnsProbe | null;
  global: GlobalProbe | null;
  classification: "local-reachable" | "global-reachable" | "dead" | "resolving-but-unreachable" | "inconclusive";
};

type AuditFile = {
  generatedAt: string;
  proxy: string | null;
  globalApi: string;
  total: number;
  records: AuditRecord[];
};

type CommandOptions = {
  reportDir: string;
  seed: string;
  size: number;
  concurrency: number;
  retries: number;
  limit: number | null;
  proxy: string | null;
  globalLimit: number | null;
};

type CurlResult = {
  code: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
};

function readOption(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  return args[index + 1];
}

function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function positiveInteger(value: string | undefined, fallback: number, label: string): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new Error(`${label} 必须是正整数`);
  return parsed;
}

function parseOptions(args: string[]): CommandOptions {
  const limitValue = readOption(args, "--limit");
  const proxyValue = readOption(args, "--proxy");
  return {
    reportDir: readOption(args, "--report-dir") ?? DEFAULT_REPORT_DIR,
    seed: readOption(args, "--seed") ?? DEFAULT_SEED,
    size: positiveInteger(readOption(args, "--size"), 1000, "--size"),
    concurrency: positiveInteger(readOption(args, "--concurrency"), 24, "--concurrency"),
    retries: positiveInteger(readOption(args, "--retries"), 2, "--retries"),
    limit: limitValue === undefined ? null : positiveInteger(limitValue, 1000, "--limit"),
    proxy: proxyValue === "off" ? null : (proxyValue ?? DEFAULT_PROXY),
    globalLimit:
      readOption(args, "--global-limit") === undefined
        ? null
        : positiveInteger(readOption(args, "--global-limit"), 100, "--global-limit"),
  };
}

function normalizeSiteUrl(value: string): { url: string; domain: string } {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`不支持非 HTTP(S) URL: ${value}`);
  }
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  return {
    url: url.toString(),
    domain: url.hostname.replace(/\.$/, ""),
  };
}

function sampleRank(seed: string, site: SampleSite): string {
  return createHash("sha256").update(`${seed}\0${site.domain}\0${site.file}`).digest("hex");
}

async function makeSample(options: CommandOptions): Promise<SampleFile> {
  const files = await listYamlFiles(path.resolve("links"));
  const candidates: SampleSite[] = [];
  const seenDomains = new Set<string>();
  let duplicates = 0;

  for (const file of files) {
    const document = parse(await readFile(file, "utf8")) as {
      site?: { name?: unknown; url?: unknown; friends?: unknown };
    };
    const site = document.site;
    if (!site || typeof site.url !== "string") continue;
    const normalized = normalizeSiteUrl(site.url);
    const friends = Array.isArray(site.friends) ? site.friends.length : 0;
    if (friends >= 10) continue;
    if (seenDomains.has(normalized.domain)) {
      duplicates++;
      continue;
    }
    seenDomains.add(normalized.domain);
    candidates.push({
      file: path.relative(process.cwd(), file).split(path.sep).join("/"),
      name: typeof site.name === "string" ? site.name : normalized.domain,
      url: normalized.url,
      domain: normalized.domain,
      friendCount: friends,
    });
  }

  if (candidates.length < options.size) {
    throw new Error(`合格站点只有 ${candidates.length} 个，少于抽样数 ${options.size}`);
  }

  const sites = candidates
    .map((site) => ({ site, rank: sampleRank(options.seed, site) }))
    .sort((a, b) => a.rank.localeCompare(b.rank))
    .slice(0, options.size)
    .map(({ site }) => site);

  return {
    generatedAt: new Date().toISOString(),
    seed: options.seed,
    algorithm: "按 sha256(seed + NUL + domain + NUL + source file) 升序取前 N 个；域名去重",
    sourceFiles: files.length,
    candidates: candidates.length,
    duplicateDomains: duplicates,
    sampleSize: sites.length,
    sites,
  };
}

async function runCommand(command: string, args: string[], timeoutMs: number): Promise<CurlResult> {
  const process = Bun.spawn([command, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    process.kill();
  }, timeoutMs);
  const [stdout, stderr, code] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);
  clearTimeout(timer);
  return { code, stdout, stderr, timedOut };
}

function curlArgs(proxy: string | null, extra: string[]): string[] {
  const args = [
    "--silent",
    "--show-error",
    "--location",
    "--max-redirs",
    "8",
    "--connect-timeout",
    "7",
    "--max-time",
    "14",
    "--user-agent",
    USER_AGENT,
    "--compressed",
    "--output",
    "/dev/null",
    "--write-out",
    "%{http_code}\t%{url_effective}\t%{remote_ip}\t%{time_total}",
  ];
  if (proxy) args.push("--proxy", proxy);
  return [...args, ...extra];
}

function parseCurlOutput(output: string): {
  httpStatus: number | null;
  effectiveUrl: string | null;
  remoteIp: string | null;
} {
  const line = output.trim().split("\n").at(-1) ?? "";
  const [status, effectiveUrl, remoteIp] = line.split("\t");
  const parsedStatus = Number(status);
  return {
    httpStatus: Number.isSafeInteger(parsedStatus) && parsedStatus > 0 ? parsedStatus : null,
    effectiveUrl: effectiveUrl || null,
    remoteIp: remoteIp || null,
  };
}

function probeUrls(site: SampleSite): string[] {
  const normalized = new URL(site.url);
  const origin = normalized.origin;
  const alternate = normalized.protocol === "https:" ? "http:" : "https:";
  const values = [site.url, `${origin}/`, `${alternate}//${normalized.host}/`];
  return [...new Set(values)];
}

async function localProbe(site: SampleSite, proxy: string | null, retries: number): Promise<LocalProbe> {
  const started = performance.now();
  let attempts = 0;
  let lastError = "无 HTTP 响应";
  for (const url of probeUrls(site)) {
    for (let attempt = 0; attempt < retries; attempt++) {
      attempts++;
      const result = await runCommand(
        "curl",
        curlArgs(proxy, ["--range", "0-4095", "--max-filesize", "4194304", url]),
        16_000,
      );
      const parsed = parseCurlOutput(result.stdout);
      if (parsed.httpStatus !== null) {
        return {
          checkedAt: new Date().toISOString(),
          status: "reachable",
          ...parsed,
          error: null,
          attempts,
          durationMs: Math.round(performance.now() - started),
        };
      }
      lastError = (result.timedOut ? "curl 超时" : result.stderr.trim()) || lastError;
      if (attempt + 1 < retries) await Bun.sleep(250);
    }
  }
  return {
    checkedAt: new Date().toISOString(),
    status: "failed",
    httpStatus: null,
    effectiveUrl: null,
    remoteIp: null,
    error: lastError,
    attempts,
    durationMs: Math.round(performance.now() - started),
  };
}

async function fetchJson(
  url: string,
  proxy: string | null,
  timeoutMs: number,
  accept = "application/json",
): Promise<unknown> {
  const args = [
    "--silent",
    "--show-error",
    "--location",
    "--max-redirs",
    "8",
    "--connect-timeout",
    "7",
    "--max-time",
    String(Math.max(1, Math.ceil(timeoutMs / 1000))),
    "--user-agent",
    USER_AGENT,
    "--compressed",
    "--header",
    `Accept: ${accept}`,
  ];
  if (proxy) args.push("--proxy", proxy);
  const result = await runCommand("curl", [...args, url], timeoutMs);
  if (result.code !== 0) {
    throw new Error((result.timedOut ? "curl 超时: " : "curl 失败: ") + result.stderr.trim());
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`响应不是 JSON: ${result.stdout.slice(0, 160)}`);
  }
}

async function dnsProbe(domain: string, proxy: string | null): Promise<DnsProbe> {
  const addresses: string[] = [];
  let statusCode: number | null = null;
  try {
    for (const type of ["A", "AAAA"]) {
      const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
      const response = (await fetchJson(url, proxy, 12_000, "application/dns-json")) as {
        Status?: number;
        Answer?: Array<{ type?: number; data?: string }>;
      };
      if (typeof response.Status === "number") statusCode = response.Status;
      for (const answer of response.Answer ?? []) {
        if ((answer.type === 1 || answer.type === 28) && typeof answer.data === "string") {
          addresses.push(answer.data);
        }
      }
    }
  } catch (error) {
    return {
      status: "unknown",
      addresses,
      statusCode,
      error: (error as Error).message,
    };
  }
  if (addresses.length > 0) return { status: "resolved", addresses, statusCode, error: null };
  if (statusCode === 3) return { status: "nxdomain", addresses, statusCode, error: null };
  return { status: "nodata", addresses, statusCode, error: null };
}

function nodeLocation(value: unknown): string {
  if (!Array.isArray(value)) return "unknown";
  return value
    .slice(0, 3)
    .filter((part) => typeof part === "string")
    .join("/");
}

function parseCheckHostResult(nodes: Record<string, unknown>, results: Record<string, unknown>): CheckHostNode[] {
  return Object.keys(nodes).map((node) => {
    const raw = results[node];
    if (!Array.isArray(raw) || raw.length === 0) {
      return { node, location: nodeLocation(nodes[node]), result: "unknown", detail: "未返回结果" };
    }
    const first = raw[0];
    const detail = raw
      .slice(1)
      .filter((part) => typeof part === "string" || typeof part === "number")
      .map(String)
      .join(" ");
    return {
      node,
      location: nodeLocation(nodes[node]),
      result: first === 1 ? "ok" : "failed",
      detail,
    };
  });
}

async function globalProbe(site: SampleSite, proxy: string | null): Promise<GlobalProbe> {
  const checkedAt = new Date().toISOString();
  try {
    const requestUrl = `https://check-host.net/check-http?host=${encodeURIComponent(site.url)}&max_nodes=5`;
    const request = (await fetchJson(requestUrl, proxy, CHECK_HOST_TIMEOUT_MS)) as {
      ok?: number;
      request_id?: string;
      permanent_link?: string;
      nodes?: Record<string, unknown>;
      error?: string;
    };
    if (request.ok !== 1 || !request.request_id || !request.nodes) {
      const message = request.error ?? "check-host 没有返回 request_id";
      return {
        checkedAt,
        apiStatus: message.toLowerCase().includes("limit") ? "rate-limited" : "error",
        reachable: null,
        error: message,
        nodes: [],
        reportUrl: request.permanent_link ?? null,
      };
    }

    let results: Record<string, unknown> = {};
    for (let poll = 0; poll < CHECK_HOST_MAX_POLLS; poll++) {
      if (poll > 0) await Bun.sleep(CHECK_HOST_POLL_MS);
      results = (await fetchJson(
        `https://check-host.net/check-result/${encodeURIComponent(request.request_id)}`,
        proxy,
        CHECK_HOST_TIMEOUT_MS,
      )) as Record<string, unknown>;
      const values = Object.values(results);
      if (values.length >= Object.keys(request.nodes).length && values.every((value) => value !== null)) break;
    }
    const nodes = parseCheckHostResult(request.nodes, results);
    const reachable = nodes.some((node) => node.result === "ok");
    return {
      checkedAt,
      apiStatus: nodes.some((node) => node.result === "unknown") ? "error" : "ok",
      reachable,
      error: nodes.some((node) => node.result === "unknown") ? "部分节点未返回结果" : null,
      nodes,
      reportUrl: request.permanent_link ?? null,
    };
  } catch (error) {
    return {
      checkedAt,
      apiStatus: "error",
      reachable: null,
      error: (error as Error).message,
      nodes: [],
      reportUrl: null,
    };
  }
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
  onProgress?: (done: number, total: number) => void,
): Promise<R[]> {
  const results: R[] = [];
  results.length = items.length;
  let next = 0;
  let done = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
      done++;
      onProgress?.(done, items.length);
    }
  });
  await Promise.all(workers);
  return results;
}

function classify(record: Omit<AuditRecord, "classification">): AuditRecord["classification"] {
  if (record.local.status === "reachable") return "local-reachable";
  if (record.global?.reachable === true) return "global-reachable";
  if (record.global?.reachable === null || !record.global) return "inconclusive";
  if (record.dns?.status === "unknown") return "inconclusive";
  if (record.dns && (record.dns.status === "nxdomain" || record.dns.status === "nodata")) return "dead";
  return "resolving-but-unreachable";
}

async function runChecks(options: CommandOptions): Promise<AuditFile> {
  const samplePath = path.join(options.reportDir, "sample.json");
  const sample = JSON.parse(await readFile(samplePath, "utf8")) as SampleFile;
  const selected = options.limit ? sample.sites.slice(0, options.limit) : sample.sites;
  const started = performance.now();

  const localResults = await mapPool(
    selected,
    options.concurrency,
    (site) => localProbe(site, options.proxy, options.retries),
    (done, total) => {
      if (done % 50 === 0 || done === total) {
        console.log(`[local] ${done}/${total} (${Math.round((performance.now() - started) / 1000)}s)`);
      }
    },
  );

  const failed = selected
    .map((site, index) => ({ site, index, local: localResults[index] }))
    .filter(({ local }) => local.status === "failed");
  const limitedFailed = options.globalLimit ? failed.slice(0, options.globalLimit) : failed;
  const globalResults = new Map<number, GlobalProbe>();
  const dnsResults = new Map<number, DnsProbe>();

  await mapPool(
    limitedFailed,
    3,
    async ({ site, index }) => {
      const [global, dns] = await Promise.all([globalProbe(site, options.proxy), dnsProbe(site.domain, options.proxy)]);
      globalResults.set(index, global);
      dnsResults.set(index, dns);
    },
    (done, total) => {
      if (done % 10 === 0 || done === total) {
        console.log(`[global] ${done}/${total} (${Math.round((performance.now() - started) / 1000)}s)`);
      }
    },
  );

  const records = selected.map((site, index): AuditRecord => {
    const local = localResults[index];
    const global = globalResults.get(index) ?? null;
    const dns = dnsResults.get(index) ?? null;
    return {
      ...site,
      local,
      global,
      dns,
      classification: classify({ ...site, local, global, dns }),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    proxy: options.proxy,
    globalApi: "https://check-host.net/check-http (最多 5 个海外节点)",
    total: records.length,
    records,
  };
}

function countBy<T extends string>(values: T[]): Record<T, number> {
  return values.reduce(
    (counts, value) => {
      counts[value] = (counts[value] ?? 0) + 1;
      return counts;
    },
    {} as Record<T, number>,
  );
}

function makeSummary(audit: AuditFile) {
  const classifications = countBy(audit.records.map((record) => record.classification));
  const localStatuses = countBy(audit.records.map((record) => record.local.status));
  const globalChecked = audit.records.filter((record) => record.global !== null).length;
  const globalReachable = audit.records.filter((record) => record.global?.reachable === true).length;
  const globalFailed = audit.records.filter((record) => record.global?.reachable === false).length;
  const dead = audit.records.filter((record) => record.classification === "dead");
  return {
    generatedAt: audit.generatedAt,
    proxy: audit.proxy,
    globalApi: audit.globalApi,
    total: audit.total,
    localStatuses,
    globalChecked,
    globalReachable,
    globalFailed,
    classifications,
    deadDomains: dead.map((record) => ({
      domain: record.domain,
      sourceFile: record.file,
      dnsStatus: record.dns?.status ?? null,
      dnsAddresses: record.dns?.addresses ?? [],
      global: record.global
        ? {
            reachable: record.global.reachable,
            apiStatus: record.global.apiStatus,
            reportUrl: record.global.reportUrl,
          }
        : null,
    })),
  };
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function applyDeadSites(options: CommandOptions): Promise<void> {
  if (!hasFlag(process.argv.slice(2), "--confirm")) {
    throw new Error("apply 需要 --confirm，避免误清理");
  }
  const resultPath = path.join(options.reportDir, "results.json");
  const audit = JSON.parse(await readFile(resultPath, "utf8")) as AuditFile;
  const dead = audit.records.filter((record) => record.classification === "dead");
  if (dead.length === 0) {
    console.log("没有完全失效站点，无需写入黑名单");
    return;
  }

  const added = [];
  for (const site of dead) {
    const result = await addBlacklistDomain({
      value: site.domain,
      reason: "全渠道无HTTP响应且无公开DNS地址（2026-11-14审计）",
    });
    added.push({
      domain: site.domain,
      file: result.record.file,
      hash: result.record.hash,
      existing: result.existing,
    });
    console.log(`${result.existing ? "已存在" : "已加入"} ${result.record.file} ${site.domain}`);
  }

  const cleanup = await enforceBlacklist({ rootDir: process.cwd() });
  const output = {
    generatedAt: new Date().toISOString(),
    deadDomains: dead.map((site) => ({
      domain: site.domain,
      file: site.file,
      dnsStatus: site.dns?.status ?? null,
    })),
    added,
    cleanup,
  };
  await writeJson(path.join(options.reportDir, "apply.json"), output);
  console.log(
    `黑名单新增 ${added.filter((item) => !item.existing).length}，删除主站 ${cleanup.mainSitesDeleted}，移除友链 ${cleanup.childLinksRemoved}`,
  );
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = parseOptions(args);
  if (command === "sample") {
    const sample = await makeSample(options);
    await writeJson(path.join(options.reportDir, "sample.json"), sample);
    console.log(
      `抽样完成：${sample.sampleSize} 个域名，候选 ${sample.candidates}，来源 YAML ${sample.sourceFiles}，重复域名 ${sample.duplicateDomains}`,
    );
    return;
  }
  if (command === "check") {
    const audit = await runChecks(options);
    const summary = makeSummary(audit);
    await writeJson(path.join(options.reportDir, "results.json"), audit);
    await writeJson(path.join(options.reportDir, "summary.json"), summary);
    console.log(JSON.stringify(summary.classifications, null, 2));
    console.log(`结果已写入 ${path.join(options.reportDir, "summary.json")}`);
    return;
  }
  if (command === "apply") {
    await applyDeadSites(options);
    return;
  }
  console.log(`用法:
  bun scripts/audit-dead-sites.ts sample [--size 1000] [--seed 20261114] [--report-dir DIR]
  bun scripts/audit-dead-sites.ts check [--report-dir DIR] [--concurrency 24] [--retries 2] [--proxy URL|off]
  bun scripts/audit-dead-sites.ts apply --confirm [--report-dir DIR]`);
  process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
