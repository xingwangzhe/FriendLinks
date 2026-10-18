import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { decode } from "msgpackr";
import { contentHash } from "../src/utils/build-artifact-cache";
import { bezier2, calcControlOffset } from "../src/utils/bezier";
import { asInt16 } from "../src/scripts/graph3d/binary-arrays";

const current = path.resolve(process.argv[2] || "dist");
const baseline = process.argv[3] ? path.resolve(process.argv[3]) : null;
function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
async function binary(directory: string, kind: string) {
  const matches = (await readdir(directory)).filter(
    (name) => name.startsWith(`graph-${kind}.`) && name.endsWith(".bin"),
  );
  assert(matches.length === 1, `Expected one ${kind} binary in ${directory}`);
  return decode(await Bun.zstdDecompress(await readFile(path.join(directory, matches[0]))));
}
const core = await binary(current, "core");
const bezier = await binary(current, "bezier");
const all = JSON.parse(await readFile(path.join(current, "all.json"), "utf8"));
const stats = JSON.parse(await readFile(path.join(current, "stats.json"), "utf8"));
assert(core.nid.length === stats.overview.totalNodes, "Node count differs between core and stats");
assert(core.ls.length === stats.connections.total, "Edge count differs between core and stats");
assert(core.ls.length === bezier.lseg.length, "Bezier edge count differs from graph");
assert(Array.isArray(all) && all.length === stats.coreNodes.count, "Site count differs between all.json and stats");
assert(core.lt.length === core.ls.length, "Source and target edge counts differ");
for (let edge = 0; edge < core.ls.length; edge++) {
  for (const endpoint of [core.ls[edge], core.lt[edge]])
    assert(Number.isInteger(endpoint) && endpoint >= 0 && endpoint < core.nid.length, `Invalid edge endpoint: ${edge}`);
  assert(
    Number.isInteger(bezier.lseg[edge]) && bezier.lseg[edge] > 0 && bezier.lseg[edge] <= 32,
    `Invalid Bezier segment count: ${edge}`,
  );
}
const vertices = bezier.lseg.reduce((sum: number, segments: number) => sum + segments * 2, 0);
for (const axis of ["x", "y", "z"]) {
  assert(bezier[`lp${axis}`].byteLength === vertices * 2, `Bezier ${axis} has padding/truncated vertices`);
  assert(
    Number.isFinite(bezier[`lp${axis}_min`]) &&
      Number.isFinite(bezier[`lp${axis}_max`]) &&
      bezier[`lp${axis}_min`] <= bezier[`lp${axis}_max`],
    `Invalid Bezier ${axis} quantization bounds`,
  );
  assert(
    core[`n${axis}`].length === core.nid.length && core[`n${axis}`].every(Number.isFinite),
    `Invalid ${axis} node positions`,
  );
}
const axes = ["x", "y", "z"];
const buffers = axes.map((axis) => asInt16(bezier[`lp${axis}`]));
let cursor = 0,
  checkedSegments = 0;
for (let edge = 0; edge < core.ls.length; edge++) {
  const segments = bezier.lseg[edge];
  if (edge % Math.max(1, Math.floor(core.ls.length / 128)) === 0) {
    const source = axes.map((axis) => core[`n${axis}`][core.ls[edge]]);
    const target = axes.map((axis) => core[`n${axis}`][core.lt[edge]]);
    const delta = source.map((value, i) => target[i] - value);
    const length = Math.hypot(...delta) || 1;
    const offset = calcControlOffset(delta[0], delta[1], delta[2], length);
    const bend = length * 0.15;
    const control = source.map((value, i) => (value + target[i]) / 2 + [offset.ox, offset.oy, offset.oz][i] * bend);
    for (let segment = 0; segment < segments; segment++) {
      for (let endpoint = 0; endpoint < 2; endpoint++) {
        for (let axis = 0; axis < 3; axis++) {
          const min = bezier[`lp${axes[axis]}_min`],
            max = bezier[`lp${axes[axis]}_max`];
          const range = max - min || 1;
          const value = min + (range * (buffers[axis][cursor + segment * 2 + endpoint] + 32768)) / 65535;
          const expected = bezier2(source[axis], control[axis], target[axis], (segment + endpoint) / segments);
          assert(
            Math.abs(value - expected) <= range / 65535 + Math.abs(expected) * 2e-7 + 1e-6,
            `Bezier mismatch edge=${edge} segment=${segment} axis=${axis}`,
          );
        }
      }
      checkedSegments++;
    }
  }
  cursor += segments * 2;
}
let positionDifference: unknown = null;
if (baseline) {
  assert(
    contentHash(await readFile(path.join(baseline, "all.json"))) ===
      contentHash(await readFile(path.join(current, "all.json"))),
    "all.json changed",
  );
  assert(
    JSON.stringify(JSON.parse(await readFile(path.join(baseline, "stats.json"), "utf8"))) === JSON.stringify(stats),
    "Exact statistics changed",
  );
  const previous = await binary(baseline, "core");
  for (const field of ["nid", "nnm", "nur", "nfa", "nde", "ls", "lt", "lsym", "c", "ndeg", "ladj_off", "ladj"]) {
    assert(JSON.stringify(previous[field]) === JSON.stringify(core[field]), `Core topology/metadata changed: ${field}`);
  }
  let squaredDifference = 0,
    squaredReference = 0,
    maxDifference = 0;
  for (const axis of axes)
    for (let i = 0; i < core.nid.length; i++) {
      const a = core[`n${axis}`][i],
        b = previous[`n${axis}`][i];
      const delta = a - b;
      squaredDifference += delta * delta;
      squaredReference += b * b;
      maxDifference = Math.max(maxDifference, Math.abs(delta));
    }
  positionDifference = {
    relativeRms: Math.sqrt(squaredDifference / (squaredReference || 1)),
    maxAbsolute: maxDifference,
  };
}
const assets = await verifyAssetReferences(current);
console.log(
  JSON.stringify({
    current,
    baseline,
    sites: all.length,
    nodes: core.nid.length,
    edges: core.ls.length,
    bezierVertices: vertices,
    checkedSegments,
    positionDifference,
    ...assets,
    statsSha256: contentHash(JSON.stringify(stats)),
    allSha256: contentHash(JSON.stringify(all)),
  }),
);

/** Check concrete resources, plus the timestamped binaries selected by the HTML runtime macro. */
async function verifyAssetReferences(directory: string) {
  const html = await readFile(path.join(directory, "index.html"), "utf8");
  const macro = html.match(/window\.__BIN_TIMESTAMPS\s*=\s*(\{[^;]*\})\s*;/)?.[1];
  const timestamps = new Map<string, string>();
  if (macro) {
    for (const match of macro.matchAll(/\b(core|bezier)\s*:\s*["']([a-zA-Z0-9_-]+)["']/g))
      timestamps.set(match[1], match[2]);
    assert(timestamps.size === 2, "Incomplete binary timestamp macro");
  }

  async function files(relative = ""): Promise<string[]> {
    const entries = await readdir(path.join(directory, relative), { withFileTypes: true });
    const nested = await Promise.all(
      entries
        .filter((entry) => !entry.name.startsWith("."))
        .map(async (entry) => {
          const filename = path.join(relative, entry.name);
          if (entry.isDirectory()) return files(filename);
          return entry.isFile() && /\.(?:html|js|css)$/.test(filename) ? [filename] : [];
        }),
    );
    return nested.flat();
  }

  const references: Array<{ from: string; reference: string; target: string; timestampFallback: boolean }> = [];
  const seen = new Set<string>();
  async function check(from: string, reference: string) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(reference)) return;
    const pathname = reference.split(/[?#]/, 1)[0];
    if (!pathname || /[{}]/.test(pathname)) return;
    const key = `${from}\0${pathname}`;
    if (seen.has(key)) return;
    seen.add(key);
    let target = pathname.startsWith("/")
      ? path.resolve(directory, pathname.slice(1))
      : pathname.startsWith("_astro/")
        ? path.resolve(directory, pathname)
        : path.resolve(directory, path.dirname(from), pathname);
    assert(target.startsWith(directory + path.sep), `Resource escapes output directory: ${from} -> ${reference}`);
    let timestampFallback = false;
    const binaryFallback = pathname.match(/^\/?graph-(core|bezier)\.bin$/)?.[1];
    if (binaryFallback && timestamps.has(binaryFallback)) {
      target = path.join(directory, `graph-${binaryFallback}.${timestamps.get(binaryFallback)}.bin`);
      timestampFallback = true;
    }
    try {
      assert((await stat(target)).isFile(), `Resource is not a file: ${target}`);
    } catch {
      throw new Error(`Missing emitted asset: ${from} -> ${reference} (${path.relative(directory, target)})`);
    }
    references.push({ from, reference, target: path.relative(directory, target), timestampFallback });
  }

  for (const [kind, timestamp] of timestamps) await check("index.html", `/graph-${kind}.${timestamp}.bin`);
  for (const file of await files()) {
    const content = await readFile(path.join(directory, file), "utf8");
    // Covers HTML attributes, static/dynamic imports, Vite preload lists, new URL(), and quoted CSS URLs.
    for (const match of content.matchAll(
      /["'`(]([^\s"'`(){};]+\.(?:js|css|wasm|bin|svg)(?:[?#][^\s"'`(){};]*)?)(?=["'`)])/g,
    ))
      await check(file, match[1]);
    // CSS also permits unquoted URLs, including assets such as fonts.
    if (file.endsWith(".css"))
      for (const match of content.matchAll(/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^"'()\s]+))\s*\)/g))
        await check(file, match[1] ?? match[2] ?? match[3]);
  }
  return {
    checkedAssetReferences: references.length,
    timestampFallbackReferences: references.filter((entry) => entry.timestampFallback).length,
  };
}
