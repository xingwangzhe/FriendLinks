/** Experiment only: include worker startup/cloning in parse time, with identical pre-read inputs. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { listYamlFiles } from "../../src/utils/yaml-files";
import { parseSources, parseWithWorkers, type Source } from "./yaml-parse-common";

const mode = process.argv[2] ?? "single";
if (!["single", "2", "4", "fixture"].includes(mode)) throw new Error("Use single, 2, 4 or fixture");
const fixtures: Source[] = [
  {
    index: 0,
    file: "/fixture/a.yml",
    relative: "a.yml",
    text: "site: { name: A, description: Test, url: 'https://a.test', friends: [] }",
  },
  {
    index: 1,
    file: "/fixture/b.yaml",
    relative: "b.yaml",
    text: "site: { name: B, description: Test, url: 'https://b.test', aliases: ['http://b.test'], friends: [{ name: A, url: 'https://a.test' }] }",
  },
  { index: 2, file: "/fixture/c.yml", relative: "c.yml", text: "site: { name: broken }" },
  { index: 3, file: "/fixture/d.yml", relative: "d.yml", text: "site: [" },
];
if (mode === "fixture") {
  const expected = JSON.stringify(parseSources(fixtures));
  for (const count of [2, 4]) {
    const actual = JSON.stringify(await parseWithWorkers(fixtures, count));
    if (actual !== expected) throw new Error(`Fixture worker count ${count}: results/errors/order differ`);
  }
  console.log(
    JSON.stringify({ fixture: true, validRecords: 2, invalidRecords: 2, workerCounts: [2, 4], exactMatch: true }),
  );
  process.exit(0);
}
const root = path.resolve("links");
const startRead = performance.now();
const files = await listYamlFiles(root);
const sources: Source[] = [];
for (let offset = 0; offset < files.length; offset += 128) {
  sources.push(
    ...(await Promise.all(
      files.slice(offset, offset + 128).map(async (file, index) => ({
        index: offset + index,
        file,
        relative: path.relative(root, file),
        text: await readFile(file, "utf8"),
      })),
    )),
  );
}
const readMs = performance.now() - startRead;
const rssBefore = process.memoryUsage.rss();
const started = performance.now();
const results = mode === "single" ? parseSources(sources) : await parseWithWorkers(sources, Number(mode));
const parseMs = performance.now() - started;
const records = results.flatMap((result) => (result.record ? [result.record] : []));
const errors = results.flatMap((result) => (result.error ? [result.error] : [])).sort();
const outputSha256 = createHash("sha256").update(JSON.stringify(records)).digest("hex");
const errorSha256 = createHash("sha256").update(JSON.stringify(errors)).digest("hex");
const status = await readFile("/proc/self/status", "utf8");
console.log(
  JSON.stringify({
    mode,
    runtime: Bun.version,
    files: files.length,
    textBytes: sources.reduce((total, source) => total + Buffer.byteLength(source.text), 0),
    readMs,
    parseMs,
    rssBeforeBytes: rssBefore,
    rssAfterBytes: process.memoryUsage.rss(),
    vmHwmKiB: Number(status.match(/^VmHWM:\s+(\d+)/m)?.[1]),
    records: records.length,
    errors,
    outputSha256,
    errorSha256,
    workerStartupAndCloningIncluded: true,
    smolWorkers: process.env.YAML_WORKER_SMOL !== "0",
  }),
);
