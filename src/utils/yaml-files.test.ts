import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { listYamlFiles, listYamlFilesSync } from "./yaml-files";

describe("YAML file discovery", () => {
  let rootDir: string;

  beforeEach(() => {
    rootDir = mkdtempSync(join(tmpdir(), "friendlinks-yaml-files-"));
    mkdirSync(join(rootDir, "category"));
    mkdirSync(join(rootDir, "category", "unverified"));
    mkdirSync(join(rootDir, "unverified"));

    writeFileSync(join(rootDir, "root.yml"), "site: {}\n");
    writeFileSync(join(rootDir, "category", "nested.yaml"), "site: {}\n");
    writeFileSync(join(rootDir, "category", "ignored.txt"), "not YAML\n");
    writeFileSync(join(rootDir, "category", "unverified", "nested-candidate.yml"), "site: {}\n");
    writeFileSync(join(rootDir, "unverified", "candidate.yml"), "site: {}\n");
  });

  afterEach(() => {
    rmSync(rootDir, { recursive: true, force: true });
  });

  const relativeFiles = (root: string, files: string[]) => files.map((file) => relative(root, file));

  test("reads YAML files from the root and ordinary nested directories", () => {
    expect(relativeFiles(rootDir, listYamlFilesSync(rootDir))).toEqual(["category/nested.yaml", "root.yml"]);
  });

  test("skips every nested unverified directory", async () => {
    expect(relativeFiles(rootDir, await listYamlFiles(rootDir))).not.toContain("unverified/candidate.yml");
    expect(relativeFiles(rootDir, await listYamlFiles(rootDir))).not.toContain(
      "category/unverified/nested-candidate.yml",
    );
  });

  test("reads candidates when unverified is the explicit scan root", async () => {
    const unverifiedDir = join(rootDir, "unverified");
    expect(relativeFiles(unverifiedDir, await listYamlFiles(unverifiedDir))).toEqual(["candidate.yml"]);
  });

  test("returns the same stable order from synchronous and asynchronous scans", async () => {
    const syncFiles = listYamlFilesSync(rootDir);
    const asyncFiles = await listYamlFiles(rootDir);
    expect(asyncFiles).toEqual(syncFiles);
    expect(asyncFiles).toEqual([...asyncFiles].sort());
  });
});
