import { describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import YAML from "yaml";
import { mergeSiteRecords, getCollectionInfo, type SiteRecord } from "./site-identity";
import { buildTopology } from "./graph-topology";
import { summarizeTopology } from "./graph-statistics";
import { loadSiteCollection, clearCollectionCache } from "./site-collection";
import { deterministicSample } from "./sample";
import type { Site } from "../../types/site";
const record = (url: string, file = url, extra: Partial<Site> = {}): SiteRecord => ({
  file,
  site: { name: file, description: file, url, links: "/links", friends: [], ...extra },
});
const friend = (url: string, description = "") => ({ name: url, url, description });
describe("site identity and topology", () => {
  test("duplicate primaries preserve metadata priority, optional fields and friend union", () => {
    const sites = mergeSiteRecords([
      record("https://a.test/", "z", { color: "#123456", friends: [friend("https://x.test/two")] }),
      record("http://a.test", "a", { friends: [friend("https://x.test/one", "primary"), friend("https://b.test")] }),
    ]);
    expect(sites).toHaveLength(1);
    expect(sites[0].name).toBe("a");
    expect(sites[0].color).toBe("#123456");
    expect(sites[0].friends).toHaveLength(2);
    expect(sites[0].friends[0].description).toBe("primary");
    expect(getCollectionInfo(sites).counts).toMatchObject({ rawRecords: 2, mergedRecords: 1, rawFriendReferences: 3 });
  });
  test("multi-level migrations preserve union, resolve references and eliminate self links", () => {
    const sites = mergeSiteRecords([
      record("https://old.test/", "old", { friends: [friend("https://x.test")] }),
      record("https://middle.test/", "middle", { aliases: ["https://old.test/"], friends: [friend("https://y.test")] }),
      record("https://new.test/", "new", {
        aliases: ["https://middle.test/"],
        friends: [friend("https://old.test/path")],
      }),
      record("https://other.test/", "other", {
        friends: [friend("http://old.test/post"), friend("https://new.test/")],
      }),
    ]);
    expect(sites).toHaveLength(2);
    const current = sites.find((s) => s.url === "https://new.test/")!;
    expect(current.aliases).toEqual(["https://middle.test/", "https://old.test/"]);
    expect(current.friends).toHaveLength(2);
    expect(sites.find((s) => s.url === "https://other.test/")!.friends.map((f) => f.url)).toEqual([
      "https://new.test/",
    ]);
    expect(buildTopology(sites).links.some((l) => l.source === l.target)).toBe(false);
  });
  test("conflicts and cycles contain files and addresses; invalid aliases fail", () => {
    expect(() =>
      mergeSiteRecords([
        record("https://a.test", "a.yml", { aliases: ["https://old.test"] }),
        record("https://b.test", "b.yml", { aliases: ["https://old.test"] }),
      ]),
    ).toThrow(/同义地址冲突.*old.test.*a.yml.*b.yml/);
    expect(() =>
      mergeSiteRecords([
        record("https://a.test", "a.yml", { aliases: ["https://b.test"] }),
        record("https://b.test", "b.yml", { aliases: ["https://a.test"] }),
      ]),
    ).toThrow(/迁移环.*a.yml.*b.yml/);
    expect(() => mergeSiteRecords([record("https://a.test", "bad.yml", { aliases: ["ftp://old.test"] })])).toThrow(
      /bad.yml/,
    );
  });
  test("explicit hosts, scoped paths, query entries, longest matching and ports", () => {
    const sites = mergeSiteRecords([
      record("https://host.test/", "root"),
      record("https://host.test/blog", "blog", { aliases: ["https://old.test/notes"] }),
      record("https://host.test/blog/deep", "deep"),
      record("https://host.test/search?q=1", "query"),
      record("https://host.test:8443/", "port"),
      record("https://www.host.test/", "www"),
    ]);
    const id = getCollectionInfo(sites).identity;
    expect(id.resolve("http://host.test/blog/post#fragment")).toBe("https://host.test/blog");
    expect(id.resolve("https://host.test/blog/deep/post")).toBe("https://host.test/blog/deep");
    expect(id.resolve("https://host.test/blogger")).toBe("https://host.test/");
    expect(id.resolve("https://old.test/notes/post")).toBe("https://host.test/blog");
    expect(id.resolve("https://old.test/notebook")).toBeUndefined();
    expect(id.resolve("https://host.test/search?q=1#x")).toBe("https://host.test/search?q=1");
    expect(id.resolve("https://host.test/search?q=2")).toBe("https://host.test/");
    expect(id.resolve("http://host.test:8443/a")).toBe("https://host.test:8443/");
    expect(id.resolve("https://www.host.test/a")).toBe("https://www.host.test/");
    expect(id.resolve("https://other.test")).toBeUndefined();
  });
  test("unmatched multi-column hosts keep full URL; edges and statistics share identity", () => {
    const sites = mergeSiteRecords([
      record("https://h.test/a", "a", {
        friends: [
          friend("https://h.test/b/p"),
          friend("https://h.test/b"),
          friend("https://h.test/a/self"),
          friend("https://h.test/unknown"),
          friend("https://external.test/one"),
          friend("https://external.test/two"),
        ],
      }),
      record("https://h.test/b", "b", { friends: [friend("https://h.test/a")] }),
    ]);
    const topology = buildTopology(sites),
      stats = summarizeTopology(sites);
    expect(topology.nodes.map((n) => n.id)).toEqual([
      "https://h.test/a",
      "https://h.test/b",
      "https://h.test/unknown",
      "external.test",
    ]);
    expect(topology.links).toHaveLength(3);
    expect(topology.links.filter((l) => !l.symbol)).toHaveLength(1);
    expect(topology.links.filter((l) => l.symbol)).toHaveLength(2);
    expect(topology.adjacency.get("https://h.test/a")?.size).toBe(3);
    expect(topology.csrOffsets.at(-1)).toBe(6);
    expect(stats.overview).toEqual({ totalNodes: 4, totalConnections: 3 });
    expect(stats.connections.coreToCore).toEqual({ total: 1, bidirectional: 1, unidirectional: 0 });
    expect(stats.totalFriendReferences).toBe(4);
  });
  test("all identities are established before deterministic sampling", () => {
    const records = [
      record("https://a.test", "a", { aliases: ["https://old.test"], friends: [friend("https://b.test/path")] }),
      record("https://old.test", "old"),
      record("https://b.test", "b"),
    ];
    const full = mergeSiteRecords(records),
      sample = mergeSiteRecords(records, (s) => deterministicSample(s, 1));
    expect(sample.map((s) => s.url)).toEqual(deterministicSample(full, 1).map((s) => s.url));
    expect(getCollectionInfo(sample).counts.totalLogicalSites).toBe(2);
    expect(getCollectionInfo(sample).identity.resolve("https://old.test/post")).toBe("https://a.test/");
  });
  test("directory/sample cache isolation, invalidation and validation exit status", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "site-identity-"));
    try {
      for (const child of ["one", "two"]) await mkdir(path.join(dir, child));
      await writeFile(path.join(dir, "one/a.yml"), YAML.stringify({ site: record("https://a.test").site }));
      await writeFile(path.join(dir, "one/b.yml"), YAML.stringify({ site: record("https://b.test").site }));
      await writeFile(path.join(dir, "two/c.yml"), YAML.stringify({ site: record("https://c.test").site }));
      const full = await loadSiteCollection(path.join(dir, "one"));
      expect(full).toHaveLength(2);
      expect(await loadSiteCollection(path.join(dir, "one"), 1)).toHaveLength(1);
      expect((await loadSiteCollection(path.join(dir, "two")))[0].url).toBe("https://c.test/");
      const firstTopology = buildTopology(full);
      clearCollectionCache();
      expect(buildTopology(full)).not.toBe(firstTopology);
      await writeFile(
        path.join(dir, "two/bad.yml"),
        YAML.stringify({ site: record("https://bad.test", "bad", { aliases: ["not-url"] }).site }),
      );
      const result = await Bun.$`bun run scripts/validate-links.ts ${path.join(dir, "two")}`.quiet().nothrow();
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr.toString()).toContain("bad.yml");
    } finally {
      clearCollectionCache();
      await rm(dir, { recursive: true, force: true });
    }
  });
});

test("real all.json loader and six-degree adjacency use the same logical identity", async () => {
  const { GET } = await import("../pages/all.json");
  const { buildGraph, findPath } = await import("../../tools/six-degrees");
  const dir = await mkdtemp(path.join(tmpdir(), "site-endpoint-")),
    previous = process.cwd();
  try {
    await mkdir(path.join(dir, "links"));
    const fixtures = [
      record("https://new.test", "new", {
        aliases: ["https://old.test"],
        friends: [friend("https://b.test/entry"), friend("https://outside.test/page")],
      }),
      record("https://old.test", "old", { friends: [friend("https://b.test")] }),
      record("https://b.test", "b"),
    ];
    for (const r of fixtures)
      await writeFile(path.join(dir, "links", r.file + ".yml"), YAML.stringify({ site: r.site }));
    clearCollectionCache();
    process.chdir(dir);
    const response = await GET(),
      sites = await loadSiteCollection("links");
    expect(await response.json()).toEqual(sites);
    expect(sites).toHaveLength(2);
    const graph = buildGraph(sites),
      topology = buildTopology(sites);
    expect(graph.csrAdj).toEqual(topology.csrAdj);
    expect(graph.csrOffsets).toEqual(topology.csrOffsets);
    expect(graph.nodes.map((n) => n.id)).toEqual(topology.nodes.map((n) => n.id));
    expect(findPath(graph, "https://old.test/post", "https://b.test/entry")).toEqual([
      "https://new.test/",
      "https://b.test/",
    ]);
  } finally {
    process.chdir(previous);
    clearCollectionCache();
    await rm(dir, { recursive: true, force: true });
  }
});
