import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export const BLACKLIST_DIR = "blacklist";
export const BLACKLIST_FILE_PATTERN = /^[1-9]\d*\.json$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const DOMAIN_LIKE_REASON_PATTERN = /(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?\.)+[\p{L}]{2,63}(?![\p{L}\p{N}-])/u;
const IPV4_REASON_PATTERN = /(?:^|[^\d])(?:\d{1,3}\.){3}\d{1,3}(?!\d)/;

export type BlacklistEntry = {
  domainLength: number;
  hash: string;
  reason: string;
};

export type BlacklistRecord = BlacklistEntry & {
  file: string;
  sequence: number;
};

export type BlacklistIndex = {
  directory: string;
  records: BlacklistRecord[];
  byHash: Map<string, BlacklistRecord>;
};

export type BlacklistHit = {
  file: string;
  scope: "site" | "friend";
  domain: string;
  hash: string;
  reason: string;
  entryFile: string;
  sourceSiteDomain?: string;
  sourceSiteName?: string;
  friendName?: string;
};

export type BlacklistEnforcementResult = {
  filesScanned: number;
  mainSitesDeleted: number;
  childLinksRemoved: number;
  hits: BlacklistHit[];
};

/** Normalize a URL or bare host to the lowercase hostname used for hashing. */
export function normalizeBlacklistDomain(value: string): string {
  const input = value.trim();
  if (!input) throw new Error("黑名单域名不能为空");
  const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(input);
  const url = new URL(hasScheme ? input : `https://${input}`);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`黑名单只接受 HTTP(S) URL 或域名: ${value}`);
  }
  const domain = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!domain) throw new Error(`无法从 URL 提取域名: ${value}`);
  return domain;
}

export function blacklistDomainHash(value: string): { domain: string; hash: string } {
  const domain = normalizeBlacklistDomain(value);
  return {
    domain,
    hash: createHash("sha256").update(domain).digest("hex"),
  };
}

export function normalizeBlacklistReason(value: string): string {
  const reason = value.trim();
  if (!reason) throw new Error("排除原因不能为空");
  if (reason.includes("://") || DOMAIN_LIKE_REASON_PATTERN.test(reason) || IPV4_REASON_PATTERN.test(reason)) {
    throw new Error("黑名单原因不能包含 URL、域名或 IP 明文");
  }
  return reason;
}

function sequenceFromFilename(filename: string): number {
  if (!BLACKLIST_FILE_PATTERN.test(filename)) {
    throw new Error(`黑名单文件名必须是从 1 开始的纯数字序号: ${filename}`);
  }
  const sequence = Number(filename.slice(0, -".json".length));
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new Error(`黑名单序号超出安全整数范围: ${filename}`);
  }
  return sequence;
}

function parseBlacklistEntry(value: unknown, filename: string): BlacklistEntry {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`黑名单 ${filename} 必须是 JSON 对象`);
  }
  const record = value as Record<string, unknown>;
  if (!Number.isSafeInteger(record.domainLength) || (record.domainLength as number) < 1) {
    throw new Error(`黑名单 ${filename} 的 domainLength 必须是正整数`);
  }
  if (typeof record.hash !== "string" || !SHA256_PATTERN.test(record.hash.toLowerCase())) {
    throw new Error(`黑名单 ${filename} 的 hash 必须是 64 位十六进制 SHA-256`);
  }
  if (typeof record.reason !== "string") {
    throw new Error(`黑名单 ${filename} 的 reason 不能为空`);
  }
  return {
    domainLength: record.domainLength as number,
    hash: record.hash.toLowerCase(),
    reason: normalizeBlacklistReason(record.reason),
  };
}

export async function loadBlacklist(directory = BLACKLIST_DIR): Promise<BlacklistIndex> {
  const resolved = path.resolve(directory);
  let entries;
  try {
    entries = await readdir(resolved, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`黑名单目录不存在: ${resolved}`);
    }
    throw error;
  }

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
    .map((entry) => ({ filename: entry.name, sequence: sequenceFromFilename(entry.name) }))
    .sort((a, b) => a.sequence - b.sequence);

  const records: BlacklistRecord[] = [];
  const byHash = new Map<string, BlacklistRecord>();
  for (const { filename, sequence } of files) {
    const file = path.join(resolved, filename);
    let parsed: unknown;
    try {
      parsed = JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      throw new Error(`无法解析黑名单 ${filename}: ${(error as Error).message}`);
    }
    const entry = parseBlacklistEntry(parsed, filename);
    const duplicate = byHash.get(entry.hash);
    if (duplicate) throw new Error(`黑名单 ${filename} 与 ${duplicate.file} 的 hash 重复`);
    const record = { ...entry, file: filename, sequence };
    records.push(record);
    byHash.set(record.hash, record);
  }
  return { directory: resolved, records, byHash };
}

export function findBlacklistHit(
  value: string,
  index: BlacklistIndex,
): (BlacklistEntry & { domain: string; file: string; sequence: number }) | null {
  const { domain, hash } = blacklistDomainHash(value);
  const entry = index.byHash.get(hash);
  if (!entry) return null;
  if (entry.domainLength !== domain.length) {
    throw new Error(
      `黑名单 ${entry.file} 的 domainLength=${entry.domainLength} 与命中域名 ${domain} 的长度 ${domain.length} 不一致`,
    );
  }
  return {
    domain,
    domainLength: entry.domainLength,
    hash: entry.hash,
    reason: entry.reason,
    file: entry.file,
    sequence: entry.sequence,
  };
}

export async function addBlacklistDomain(options: {
  value: string;
  reason: string;
  directory?: string;
}): Promise<{ record: BlacklistRecord; existing: boolean }> {
  const reason = normalizeBlacklistReason(options.reason);
  const directory = path.resolve(options.directory ?? BLACKLIST_DIR);
  await mkdir(directory, { recursive: true });
  const index = await loadBlacklist(directory);
  const { domain, hash } = blacklistDomainHash(options.value);
  const existing = index.byHash.get(hash);
  if (existing) return { record: existing, existing: true };

  let sequence = (index.records.at(-1)?.sequence ?? 0) + 1;
  while (sequence <= Number.MAX_SAFE_INTEGER) {
    const filename = `${sequence}.json`;
    const file = path.join(directory, filename);
    const entry: BlacklistEntry = { domainLength: domain.length, hash, reason };
    try {
      await writeFile(file, `${JSON.stringify(entry, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
      return { record: { ...entry, file: filename, sequence }, existing: false };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      sequence++;
    }
  }
  throw new Error("黑名单序号已耗尽");
}

async function listAllYamlFiles(root: string): Promise<string[]> {
  const files: string[] = [];
  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && /\.ya?ml$/i.test(entry.name)) files.push(fullPath);
    }
  }
  await walk(root);
  return files.sort();
}

function scalarString(node: unknown): string | null {
  if (!YAML.isScalar(node) || typeof node.value !== "string") return null;
  return node.value;
}

function displayDomain(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    return normalizeBlacklistDomain(value);
  } catch {
    return value;
  }
}

function safeHit(value: string | null, index: BlacklistIndex) {
  if (!value) return null;
  try {
    return findBlacklistHit(value, index);
  } catch (error) {
    if (error instanceof TypeError || error instanceof RangeError) return null;
    if (error instanceof Error && error.message.startsWith("黑名单只接受")) return null;
    if (error instanceof Error && error.message.startsWith("无法从 URL")) return null;
    throw error;
  }
}

export async function enforceBlacklist(
  options: {
    rootDir?: string;
    linksDir?: string;
    blacklistDir?: string;
    onHit?: (hit: BlacklistHit) => void;
  } = {},
): Promise<BlacklistEnforcementResult> {
  const rootDir = path.resolve(options.rootDir ?? process.cwd());
  const linksDir = path.resolve(rootDir, options.linksDir ?? "links");
  const index = await loadBlacklist(path.resolve(rootDir, options.blacklistDir ?? BLACKLIST_DIR));
  const result: BlacklistEnforcementResult = {
    filesScanned: 0,
    mainSitesDeleted: 0,
    childLinksRemoved: 0,
    hits: [],
  };
  if (index.records.length === 0) return result;

  const files = await listAllYamlFiles(linksDir);
  for (const file of files) {
    result.filesScanned++;
    const relative = path.relative(rootDir, file).split(path.sep).join("/");
    const document = YAML.parseDocument(await readFile(file, "utf8"));
    const site = document.get("site", true);
    if (!YAML.isMap(site)) continue;

    const siteUrl = scalarString(site.get("url", true));
    const sourceSiteName = scalarString(site.get("name", true)) ?? undefined;
    const sourceSiteDomain = displayDomain(siteUrl);
    const siteDomains = [siteUrl];
    const aliases = site.get("aliases", true);
    if (YAML.isSeq(aliases)) {
      for (const alias of aliases.items) siteDomains.push(scalarString(alias));
    }
    const mainHit = siteDomains.map((domain) => safeHit(domain, index)).find(Boolean);
    if (mainHit) {
      const hit: BlacklistHit = {
        file: relative,
        scope: "site",
        domain: mainHit.domain,
        hash: mainHit.hash,
        reason: mainHit.reason,
        entryFile: mainHit.file,
      };
      result.hits.push(hit);
      options.onHit?.(hit);
      await rm(file);
      result.mainSitesDeleted++;
      continue;
    }

    const friends = site.get("friends", true);
    if (!YAML.isSeq(friends)) continue;
    const friendHits: BlacklistHit[] = [];
    for (let friendIndex = friends.items.length - 1; friendIndex >= 0; friendIndex--) {
      const friend = friends.items[friendIndex];
      if (!YAML.isMap(friend)) continue;
      const friendName = scalarString(friend.get("name", true)) ?? undefined;
      const friendHit = safeHit(scalarString(friend.get("url", true)), index);
      if (!friendHit) continue;
      friendHits.push({
        file: relative,
        scope: "friend",
        domain: friendHit.domain,
        hash: friendHit.hash,
        reason: friendHit.reason,
        entryFile: friendHit.file,
        sourceSiteDomain,
        sourceSiteName,
        friendName,
      });
      friends.items.splice(friendIndex, 1);
    }
    if (friendHits.length === 0) continue;
    const output = document.toString({ lineWidth: 0 });
    await writeFile(file, output.endsWith("\n") ? output : `${output}\n`, "utf8");
    for (const hit of friendHits.reverse()) {
      result.hits.push(hit);
      options.onHit?.(hit);
      result.childLinksRemoved++;
    }
  }
  return result;
}
