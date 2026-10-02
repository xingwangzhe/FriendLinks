import { lookup } from "node:dns/promises";
import * as cheerio from "cheerio";
import PQueue from "p-queue";
import robotsParser from "robots-parser";
import { checkNetworkSafety } from "./audit-url";
import type { PageSignals } from "./audit-classifier";

export interface FetchResult {
  status: number;
  finalUrl: string;
  signals: PageSignals;
  robotsAllowed: boolean;
  error?: string;
}

const USER_AGENT = "FriendLinks-audit/1.0 (+https://github.com/xingwangzhe/FriendLinks)";
const MAX_BODY_BYTES = 2 * 1024 * 1024;

async function readLimitedBody(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("response-too-large");
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

async function fetchRobots(url: URL): Promise<{ allowed: boolean; error?: string }> {
  const robotsUrl = `${url.origin}/robots.txt`;
  try {
    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { allowed: true };
    const parser = robotsParser(robotsUrl, await readLimitedBody(response));
    return { allowed: parser.isAllowed(url.toString(), USER_AGENT) !== false };
  } catch (error) {
    return { allowed: true, error: (error as Error).message };
  }
}

export async function fetchPage(value: string): Promise<FetchResult> {
  const safety = await checkNetworkSafety(value);
  if (!safety.safe) {
    return {
      status: 0,
      finalUrl: value,
      signals: {},
      robotsAllowed: false,
      error: safety.reasons.join(","),
    };
  }
  const url = new URL(value);
  const robots = await fetchRobots(url);
  if (!robots.allowed) return { status: 0, finalUrl: value, signals: {}, robotsAllowed: false };
  try {
    const response = await fetch(value, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const finalSafety = await checkNetworkSafety(response.url);
    if (!finalSafety.safe) throw new Error(finalSafety.reasons.join(","));
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return { status: response.status, finalUrl: response.url, signals: {}, robotsAllowed: true, error: "not-html" };
    }
    const html = await readLimitedBody(response);
    const $ = cheerio.load(html);
    const articleCount = $("article").length;
    const externalLinkCount = $("a[href]").filter((_, el) => {
      try {
        return new URL($(el).attr("href")!, response.url).hostname !== new URL(response.url).hostname;
      } catch {
        return false;
      }
    }).length;
    return {
      status: response.status,
      finalUrl: response.url,
      robotsAllowed: true,
      signals: {
        title: $("title").first().text().trim() || undefined,
        description: $("meta[name=description]").attr("content")?.trim() || undefined,
        canonical: $("link[rel=canonical]").attr("href") || undefined,
        hasFeed: $("link[type*=rss], link[type*=atom], link[href*=rss], link[href*=atom]").length > 0,
        articleCount,
        externalLinkCount,
      },
    };
  } catch (error) {
    return { status: 0, finalUrl: value, signals: {}, robotsAllowed: true, error: (error as Error).message };
  }
}

export function createFetchQueue(concurrency: number, intervalCap: number, interval: number) {
  return new PQueue({ concurrency, intervalCap, interval, timeout: 20000 });
}

export async function resolveHost(host: string): Promise<string[]> {
  try {
    return (await lookup(host, { all: true })).map((entry) => entry.address);
  } catch {
    return [];
  }
}
