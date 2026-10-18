import { yieldToMainThread } from "./ui/yield-to-main";

export interface SearchNode {
  id: string;
  name?: string;
  url?: string;
  desc?: string;
}
export interface SearchHit {
  id: string;
  name: string;
  url: string;
}

function isCJK(code: number) {
  return (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf);
}
function cjkBigrams(text: string): string[] {
  const result: string[] = [];
  for (let index = 0; index < text.length - 1; index++)
    if (isCJK(text.charCodeAt(index)) && isCJK(text.charCodeAt(index + 1))) result.push(text.slice(index, index + 2));
  return result;
}
export function buildSearchText(name: string, url: string, description: string) {
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    host = url;
  }
  const parts = host.split(".");
  const tokens = new Set<string>();
  tokens.add(host);
  if (parts.length >= 2) tokens.add(parts[0]);
  tokens.add(name);
  for (const bigram of cjkBigrams(name)) tokens.add(bigram);
  if (description) for (const bigram of cjkBigrams(description)) tokens.add(bigram);
  return [...tokens].join(" ");
}

/** Call only on first nonempty search; no database or timers exist before this call. */
export async function createGraphSearchIndex(nodes: readonly SearchNode[], isActive: () => boolean = () => true) {
  const assertActive = () => {
    if (!isActive()) throw new DOMException("Graph was disposed", "AbortError");
  };
  assertActive();
  const { create, insert, search } = await import("@orama/orama");
  assertActive();
  // Only BM25 ranking is used. Property-sort indexes are never queried.
  const database = create({
    schema: { id: "string", name: "string", url: "string", searchText: "string" },
    sort: { enabled: false },
    components: {
      tokenizer: {
        language: "space",
        stemmer: false,
        stopWords: false,
        tokenize(text: string) {
          return text.split(/\s+/).filter(Boolean);
        },
      },
    } as any,
  });
  const insertedIds = new Set<string>();
  let insertedCount = 0;
  for (const node of nodes) {
    assertActive();
    const id = node.id;
    if (!id || insertedIds.has(id)) continue;
    insertedIds.add(id);
    // Orama 3's methods are synchronous when no asynchronous plugins are installed.
    const insertion = insert(database, {
      id,
      name: node.name || id,
      url: node.url || "",
      searchText: buildSearchText(node.name || id, node.url || "", node.desc || ""),
    });
    if (insertion instanceof Promise) await insertion;
    if (++insertedCount % 128 === 0) await yieldToMainThread();
  }
  assertActive();
  return {
    documents: insertedCount,
    async find(query: string): Promise<SearchHit[]> {
      assertActive();
      if (!query?.trim()) return [];
      const results = await search(database, { term: query.trim(), limit: 12 });
      return results.hits.map(({ document }) => ({ id: document.id, name: document.name, url: document.url }));
    },
  };
}
