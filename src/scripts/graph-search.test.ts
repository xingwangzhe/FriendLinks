import { expect, test } from "bun:test";
import { create, insert, search } from "@orama/orama";
import { buildSearchText, createGraphSearchIndex, type SearchNode } from "./graph-search";

const nodes: SearchNode[] = Array.from({ length: 270 }, (_, index) => ({
  id: `https://blog-${index}.test/`,
  name: index % 2 ? `星空博客 ${index}` : `Developer notes ${index}`,
  url: `https://www.blog-${index}.test/path`,
  desc: index % 3 ? "前端开发与宇宙探索" : "Rust and TypeScript development",
}));
nodes.push(
  { ...nodes[0], name: "duplicate must not replace first" },
  { id: "" },
  { id: "fallback-id", url: "invalid URL" },
);

test("disabling unused property sorting preserves complete ranked search hits", async () => {
  const reference = create({
    schema: { id: "string", name: "string", url: "string", searchText: "string" },
    components: {
      tokenizer: {
        language: "space",
        stemmer: false,
        stopWords: false,
        tokenize: (text: string) => text.split(/\s+/).filter(Boolean),
      },
    } as any,
  });
  const withoutSorting = create({
    schema: reference.schema,
    sort: { enabled: false },
    components: { tokenizer: reference.tokenizer } as any,
  });
  const seen = new Set<string>();
  for (const node of nodes) {
    if (!node.id || seen.has(node.id)) continue;
    seen.add(node.id);
    const document = {
      id: node.id,
      name: node.name || node.id,
      url: node.url || "",
      searchText: buildSearchText(node.name || node.id, node.url || "", node.desc || ""),
    };
    await insert(reference, document);
    insert(withoutSorting, document);
  }
  const optimized = await createGraphSearchIndex(nodes);
  expect(optimized.documents).toBe(seen.size);
  for (const query of [
    "星空",
    "博客",
    "前端",
    "宇宙",
    "Developer",
    "notes",
    "blog-10",
    "blog-10.test",
    "fallback-id",
    "invalid",
    "Rust",
    "not-found",
    "星空 博客",
    "  notes  ",
  ]) {
    const expected = (await search(reference, { term: query.trim(), limit: 12 })).hits.map(({ document }) => ({
      id: document.id,
      name: document.name,
      url: document.url,
    }));
    expect(await optimized.find(query)).toEqual(expected);
    const scores = async (database: typeof reference) =>
      (await search(database, { term: query.trim(), limit: 12 })).hits.map(({ id, score }) => ({ id, score }));
    expect(await scores(withoutSorting)).toEqual(await scores(reference));
  }
  expect(await optimized.find("   ")).toEqual([]);
});

test("index construction stops when the graph is disposed and a fresh attempt can succeed", async () => {
  let checks = 0;
  await expect(createGraphSearchIndex(nodes, () => ++checks < 10)).rejects.toMatchObject({ name: "AbortError" });
  const retried = await createGraphSearchIndex(nodes.slice(0, 2));
  expect(retried.documents).toBe(2);
  expect(await retried.find("notes")).toHaveLength(1);
});
