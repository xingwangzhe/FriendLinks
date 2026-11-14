import type { Site } from "../../types/site";

export interface SiteRecord {
  file: string;
  site: Site;
}
export interface SourceCounts {
  rawRecords: number;
  mergedRecords: number;
  rawFriendReferences: number;
  totalRawRecords: number;
  totalLogicalSites: number;
}

/** Identity keys ignore transport and fragments, but retain non-default ports and query strings. */
export function address(value: string) {
  const url = new URL(value.trim());
  if (!["http:", "https:"].includes(url.protocol)) throw new Error(`无效站点地址: ${value}`);
  url.hash = "";
  const host = url.host.toLowerCase();
  const path = url.pathname.replace(/\/+$/, "") || "/";
  return { host, path, query: url.search, key: `${host}${path}${url.search}`, url: url.href };
}

export class SiteIdentity {
  private entries = new Map<string, Array<{ path: string; query: string; canonical: string }>>();
  private hostSites = new Map<string, Set<string>>();
  constructor(sites: Site[]) {
    const claims = new Map<string, string>();
    for (const site of sites)
      for (const value of [site.url, ...(site.aliases ?? [])]) {
        const a = address(value);
        const prior = claims.get(a.key);
        if (prior && prior !== site.url) throw new Error(`同义地址冲突: ${value} → ${prior} / ${site.url}`);
        if (prior) continue;
        claims.set(a.key, site.url);
        const entries = this.entries.get(a.host) ?? [];
        entries.push({ path: a.path, query: a.query, canonical: site.url });
        this.entries.set(a.host, entries);
        const owners = this.hostSites.get(a.host) ?? new Set<string>();
        owners.add(site.url);
        this.hostSites.set(a.host, owners);
      }
    for (const entries of this.entries.values())
      entries.sort((a, b) => b.path.length - a.path.length || Number(Boolean(b.query)) - Number(Boolean(a.query)));
  }
  resolve(value: string): string | undefined {
    const a = address(value);
    return this.entries
      .get(a.host)
      ?.find((e) =>
        e.query
          ? e.path === a.path && e.query === a.query
          : e.path === "/" || e.path === a.path || a.path.startsWith(e.path + "/"),
      )?.canonical;
  }
  externalId(value: string): string {
    const a = address(value);
    return (this.hostSites.get(a.host)?.size ?? 0) > 1 ? `https://${a.key}` : a.host;
  }
  targetId(value: string): string {
    return this.resolve(value) ?? this.externalId(value);
  }
}

interface CollectionInfo {
  identity: SiteIdentity | null;
  counts: SourceCounts;
}
export interface ResolvedCollectionInfo {
  identity: SiteIdentity;
  counts: SourceCounts;
}
let collectionInfo = new WeakMap<Site[], CollectionInfo>();
export function clearIdentityCache() {
  collectionInfo = new WeakMap();
}
export function restoreCollectionCounts(sites: Site[], counts: SourceCounts) {
  collectionInfo.set(sites, { identity: null, counts });
}
export function getCollectionInfo(sites: Site[]): ResolvedCollectionInfo {
  let info = collectionInfo.get(sites);
  if (!info) {
    info = {
      identity: null,
      counts: {
        rawRecords: sites.length,
        mergedRecords: 0,
        rawFriendReferences: sites.reduce((n, s) => n + s.friends.length, 0),
        totalRawRecords: sites.length,
        totalLogicalSites: sites.length,
      },
    };
    collectionInfo.set(sites, info);
  }
  info.identity ??= new SiteIdentity(sites);
  return info as ResolvedCollectionInfo;
}

export function mergeSiteRecords(input: SiteRecord[], sample?: (sites: Site[]) => Site[]): Site[] {
  const records = [...input].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
  const groups = new Map<string, SiteRecord[]>();
  for (const record of records) {
    try {
      const key = address(record.site.url).key;
      if (record.site.aliases !== undefined && !Array.isArray(record.site.aliases))
        throw new Error("aliases 必须为数组");
      for (const alias of record.site.aliases ?? []) address(alias);
      const group = groups.get(key) ?? [];
      group.push(record);
      groups.set(key, group);
    } catch (e) {
      throw new Error(`[${record.file}] ${(e as Error).message}`);
    }
  }
  const claims = new Map<string, Set<string>>();
  for (const [key, group] of groups)
    for (const record of group)
      for (const alias of record.site.aliases ?? []) {
        const aliasKey = address(alias).key;
        if (aliasKey === key) continue;
        const owners = claims.get(aliasKey) ?? new Set<string>();
        owners.add(key);
        claims.set(aliasKey, owners);
      }
  const terminals = new Map<string, string>();
  const visiting = new Set<string>();
  const describe = (key: string) =>
    `${key} [${(groups.get(key) ?? []).map((r) => r.file).join(", ") || [...(claims.get(key) ?? [])].flatMap((k) => (groups.get(k) ?? []).map((r) => r.file)).join(", ")}]`;
  function terminal(key: string): string {
    if (terminals.has(key)) return terminals.get(key)!;
    if (visiting.has(key)) throw new Error(`同义地址迁移环: ${[...visiting, key].map(describe).join(" → ")}`);
    visiting.add(key);
    const roots = new Set([...(claims.get(key) ?? [])].map(terminal));
    if (roots.size > 1) throw new Error(`同义地址冲突: ${describe(key)} → ${[...roots].map(describe).join(" / ")}`);
    const root = [...roots][0] ?? key;
    visiting.delete(key);
    terminals.set(key, root);
    return root;
  }
  for (const key of [...groups.keys(), ...claims.keys()]) terminal(key);
  const mergedGroups = new Map<string, SiteRecord[]>();
  for (const [key, group] of groups) {
    const root = terminal(key);
    const list = mergedGroups.get(root) ?? [];
    list.push(...group);
    mergedGroups.set(root, list);
  }
  const provenance = new Map<string, SiteRecord[]>();
  const sites: Site[] = [];
  for (const [root, group] of mergedGroups) {
    const ordered = [...group].sort(
      (a, b) =>
        Number(address(b.site.url).key === root) - Number(address(a.site.url).key === root) ||
        (a.file < b.file ? -1 : a.file > b.file ? 1 : 0),
    );
    const primary = ordered[0];
    const site: Site = { ...primary.site, url: address(primary.site.url).url, friends: [] };
    for (const field of ["favicon", "color"] as const)
      if (!site[field]) site[field] = ordered.find((r) => r.site[field])?.site[field];
    if (
      ordered.some((r) =>
        ["name", "description", "links", "color", "favicon"].some(
          (k) =>
            (r.site as unknown as Record<string, unknown>)[k] !==
            (primary.site as unknown as Record<string, unknown>)[k],
        ),
      )
    )
      console.warn(
        `[合并提示] ${site.url}: 主记录 ${primary.file}；元数据差异 ${ordered.map((r) => r.file).join(", ")}`,
      );
    site.links ||= ordered.find((record) => record.site.links)?.site.links ?? "/links";
    const aliases = new Map<string, string>();
    for (const r of ordered)
      for (const value of [r.site.url, ...(r.site.aliases ?? [])]) {
        const a = address(value);
        if (a.key !== root && !aliases.has(a.key)) aliases.set(a.key, a.url);
      }
    if (aliases.size) site.aliases = [...aliases.values()].sort();
    else delete site.aliases;
    site.friends = ordered.flatMap((r) => r.site.friends.map((f) => ({ ...f })));
    sites.push(site);
    provenance.set(site.url, ordered);
  }
  sites.sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0));
  const identity = new SiteIdentity(sites);
  for (const site of sites) {
    const friends = new Map<string, Site["friends"][number]>();
    for (const friend of site.friends) {
      const canonical = identity.resolve(friend.url);
      const key = identity.targetId(friend.url);
      if (key === site.url || friends.has(key)) continue;
      friends.set(key, { ...friend, url: canonical ?? address(friend.url).url });
    }
    site.friends = [...friends.values()];
  }
  const selected = sample ? sample(sites) : sites;
  const selectedRecords = selected.flatMap((s) => provenance.get(s.url)!);
  collectionInfo.set(selected, {
    identity,
    counts: {
      rawRecords: selectedRecords.length,
      mergedRecords: selectedRecords.length - selected.length,
      rawFriendReferences: selectedRecords.reduce((n, r) => n + r.site.friends.length, 0),
      totalRawRecords: records.length,
      totalLogicalSites: sites.length,
    },
  });
  return selected;
}
