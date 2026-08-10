import { lookup } from "node:dns/promises";
import { existsSync, readFileSync } from "node:fs";
import ipaddr from "ipaddr.js";

const TRACKING_PARAMS = /^(utm_|fbclid$|gclid$|ref$|from$|source$|spm$)/i;

export interface DenyList {
  exact: Set<string>;
  suffixes: string[];
}

export interface NormalizedUrl {
  original: string;
  canonical: string;
  hostname: string;
  host: string;
}

export interface UrlSafety {
  safe: boolean;
  reasons: string[];
}

export function stripWww(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

export function getHost(value: string): string | null {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname || null;
  } catch {
    return null;
  }
}

export function normalizeUrl(value: string): NormalizedUrl | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMS.test(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
    return {
      original: value,
      canonical: url.toString(),
      hostname: url.hostname,
      host: stripWww(url.hostname),
    };
  } catch {
    return null;
  }
}

function isPrivateAddress(value: string): boolean {
  if (!ipaddr.isValid(value)) return false;
  const range = ipaddr.parse(value).range();
  return new Set([
    "unspecified",
    "loopback",
    "private",
    "uniqueLocal",
    "linkLocal",
    "carrierGradeNat",
    "reserved",
    "benchmarking",
    "broadcast",
    "as112",
    "as112v6",
    "ipv4Mapped",
  ]).has(range);
}

export function checkUrlSafety(value: string): UrlSafety {
  const reasons: string[] = [];
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { safe: false, reasons: ["invalid-url"] };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") reasons.push("unsupported-protocol");
  if (url.username || url.password) reasons.push("url-credentials");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    reasons.push("private-hostname");
  }
  if (ipaddr.isValid(hostname) && isPrivateAddress(hostname)) reasons.push("private-ip");
  if (hostname === "169.254.169.254" || hostname === "metadata.google.internal") reasons.push("cloud-metadata");
  return { safe: reasons.length === 0, reasons };
}

export async function checkNetworkSafety(value: string): Promise<UrlSafety> {
  const result = checkUrlSafety(value);
  if (!result.safe) return result;
  const url = new URL(value);
  if (ipaddr.isValid(url.hostname)) return result;
  try {
    const addresses = await lookup(url.hostname, { all: true, verbatim: true });
    for (const address of addresses) {
      if (isPrivateAddress(address.address)) result.reasons.push("private-dns-address");
    }
  } catch {
    result.reasons.push("dns-failed");
  }
  return { safe: result.reasons.length === 0, reasons: result.reasons };
}

export function loadDenyList(path: string): DenyList {
  const exact = new Set<string>();
  const suffixes: string[] = [];
  if (!existsSync(path)) return { exact, suffixes };
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const token = line.trim().toLowerCase();
    if (!token || token.startsWith("#")) continue;
    if (token.startsWith(".")) suffixes.push(token);
    else exact.add(stripWww(token));
  }
  return { exact, suffixes };
}

export function deniedReason(host: string, deny: DenyList): string | null {
  const normalized = stripWww(host);
  if (deny.exact.has(normalized) || deny.exact.has(host)) return "deny-host-exact";
  const suffix = deny.suffixes.find((item) => host.endsWith(item) || normalized.endsWith(item));
  return suffix ? `deny-host-suffix:${suffix}` : null;
}
