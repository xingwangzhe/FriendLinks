import { existsSync, readFileSync, writeFileSync } from "node:fs";

export type ReputationVerdict = "safe" | "malicious" | "suspicious" | "unknown" | "unavailable";

export interface ReputationResult {
  provider: "google" | "virustotal";
  verdict: ReputationVerdict;
  categories: string[];
  checkedAt: string;
  cached: boolean;
  error?: string;
}

type Cache = Record<string, ReputationResult>;

export function loadReputationCache(path: string): Cache {
  if (!existsSync(path)) return {};
  try {
    const value = JSON.parse(readFileSync(path, "utf8")) as Cache;
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export function saveReputationCache(path: string, cache: Cache) {
  writeFileSync(path, JSON.stringify(cache, null, 2) + "\n", "utf8");
}

function unavailable(provider: ReputationResult["provider"], error: string): ReputationResult {
  return {
    provider,
    verdict: "unavailable",
    categories: [],
    checkedAt: new Date().toISOString(),
    cached: false,
    error,
  };
}

async function requestJson(url: string, init: RequestInit): Promise<{ response: Response; value: any }> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
  let value: any = null;
  try {
    value = await response.json();
  } catch {
    value = null;
  }
  return { response, value };
}

async function queryGoogle(url: string, apiKey: string): Promise<ReputationResult> {
  const provider = "google" as const;
  try {
    const { response, value } = await requestJson(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { clientId: "friendlinks-audit", clientVersion: "1.0" },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
      },
    );
    if (!response.ok) return unavailable(provider, `http-${response.status}`);
    const matches = Array.isArray(value?.matches) ? value.matches : [];
    return {
      provider,
      verdict: matches.length ? "malicious" : "safe",
      categories: matches.map((match: any) => String(match.threatType)).slice(0, 8),
      checkedAt: new Date().toISOString(),
      cached: false,
    };
  } catch (error) {
    return unavailable(provider, (error as Error).message);
  }
}

async function queryVirusTotal(url: string, apiKey: string): Promise<ReputationResult> {
  const provider = "virustotal" as const;
  try {
    const id = Buffer.from(url).toString("base64url");
    const { response, value } = await requestJson(`https://www.virustotal.com/api/v3/urls/${id}`, {
      headers: { "x-apikey": apiKey },
    });
    if (response.status === 404)
      return { provider, verdict: "unknown", categories: [], checkedAt: new Date().toISOString(), cached: false };
    if (!response.ok) return unavailable(provider, `http-${response.status}`);
    const stats = value?.data?.attributes?.last_analysis_stats ?? {};
    const malicious = Number(stats.malicious ?? 0);
    const suspicious = Number(stats.suspicious ?? 0);
    const verdict: ReputationVerdict = malicious > 0 ? "malicious" : suspicious > 0 ? "suspicious" : "safe";
    return {
      provider,
      verdict,
      categories: [`malicious:${malicious}`, `suspicious:${suspicious}`],
      checkedAt: new Date().toISOString(),
      cached: false,
    };
  } catch (error) {
    return unavailable(provider, (error as Error).message);
  }
}

export async function checkReputation(provider: "google" | "virustotal", url: string): Promise<ReputationResult> {
  const apiKey = provider === "google" ? process.env.GOOGLE_SAFE_BROWSING_API_KEY : process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey)
    return unavailable(
      provider,
      provider === "google" ? "missing-GOOGLE_SAFE_BROWSING_API_KEY" : "missing-VIRUSTOTAL_API_KEY",
    );
  return provider === "google" ? queryGoogle(url, apiKey) : queryVirusTotal(url, apiKey);
}

export type ReputationCache = Cache;
