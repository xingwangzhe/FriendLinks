import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { BuildArtifactCache } from "./build-artifact-cache";
import { readSiteRecords } from "./site-collection";

test("parsed record cache detects edits, additions, renames, deletions and invalid YAML", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "friendlinks-records-"));
  const links = path.join(root, "links");
  const cache = new BuildArtifactCache(path.join(root, "cache"));
  const source = (name: string) =>
    JSON.stringify({ site: { name, description: "test", url: `https://${name}.test`, friends: [] } });
  try {
    await mkdir(path.join(links, "unverified"), { recursive: true });
    await writeFile(path.join(links, "a.yml"), source("a"));
    await writeFile(path.join(links, "b.yml"), source("b"));
    await writeFile(path.join(links, "unverified/invalid.yml"), "not valid YAML: [");
    const read = () => readSiteRecords(links, undefined, cache);
    const original = await read();
    expect(await read()).toEqual(original);
    // Same-length edits must invalidate even when file metadata is unchanged.
    await writeFile(path.join(links, "a.yml"), source("c"));
    expect((await read()).map((record) => record.site.name)).toEqual(["c", "b"]);
    await rename(path.join(links, "a.yml"), path.join(links, "z.yml"));
    await rm(path.join(links, "b.yml"));
    await writeFile(path.join(links, "d.yaml"), source("d"));
    expect((await read()).map((record) => [record.file, record.site.name])).toEqual([
      ["d.yaml", "d"],
      ["z.yml", "c"],
    ]);
    await writeFile(path.join(links, "z.yml"), "site: { name: broken }");
    await expect(read()).rejects.toThrow("YAML 校验失败");
    await writeFile(path.join(links, "z.yml"), source("fixed"));
    expect((await read()).map((record) => record.site.name)).toEqual(["d", "fixed"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
