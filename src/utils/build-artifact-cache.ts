import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { availableParallelism } from "node:os";
import path from "node:path";
import { Packr, decode } from "msgpackr";
const packr = new Packr({ moreTypes: true, useRecords: false });

const SCHEMA = 1;
export function buildCacheEnabled() {
  return import.meta.env?.PROD === true && process.env.FRIENDLINKS_BUILD_CACHE !== "0";
}
export function contentHash(value: string | Uint8Array) {
  return createHash("sha256").update(value).digest("hex");
}
export function artifactKey(value: unknown) {
  return contentHash(JSON.stringify(value));
}
const snapshotKeys = new WeakMap<object, string>();
/** Reuse one content digest for an immutable in-memory snapshot across endpoints. */
export function snapshotArtifactKey(value: object): string {
  const cached = snapshotKeys.get(value);
  if (cached) return cached;
  const key = artifactKey(value);
  snapshotKeys.set(value, key);
  return key;
}
export async function implementationFingerprint(files: string[], packages: string[] = [], root = process.cwd()) {
  try {
    const require = createRequire(path.resolve(root, "package.json"));
    const parts: unknown[] = [["runtime", Bun.version, process.platform, process.arch]];
    // Thread reductions can change floating-point rounding; native overrides must
    // never reuse an artifact created by the package's bundled implementation.
    if (packages.some((name) => name.startsWith("@xingwangzhe/"))) {
      parts.push(["rayonThreads", process.env.RAYON_NUM_THREADS ?? availableParallelism()]);
      if (process.platform === "linux") {
        const report = process.report?.getReport() as { header?: { glibcVersionRuntime?: string } } | undefined;
        parts.push(["libc", report?.header?.glibcVersionRuntime ?? "musl-or-unknown"]);
      }
      const override = process.env.NAPI_RS_NATIVE_LIBRARY_PATH;
      if (override) parts.push(["nativeOverride", override, contentHash(await readFile(override))]);
    }
    for (const file of files) parts.push([file, contentHash(await readFile(path.resolve(root, file)))]);
    for (const name of packages) {
      const manifest = require.resolve(`${name}/package.json`);
      const dir = path.dirname(manifest);
      parts.push([name, contentHash(await readFile(manifest))]);
      const entrypoint = require.resolve(name);
      parts.push([name, "entrypoint", contentHash(await readFile(entrypoint))]);
      // Local builds keep the npm version unchanged: hash the binaries, not only the version.
      for (const file of (await readdir(dir)).filter((entry) => entry.endsWith(".node")).sort()) {
        parts.push([name, file, contentHash(await readFile(path.join(dir, file)))]);
      }
    }
    return artifactKey(parts);
  } catch {
    return null;
  }
}

export class BuildArtifactCache {
  constructor(private readonly directory = path.resolve("node_modules/.cache/friendlinks-build/v1")) {}

  private filename(namespace: string, key: string) {
    if (!/^[a-z-]+$/.test(namespace) || !/^[a-f0-9]{64}$/.test(key)) throw new Error("Invalid build cache key");
    return path.join(this.directory, `${namespace}-${key}.bin`);
  }
  async read<T>(namespace: string, key: string): Promise<T | null> {
    if (process.env.FRIENDLINKS_BUILD_CACHE === "refresh") return null;
    try {
      const bytes = await readFile(this.filename(namespace, key));
      const entry = decode(await Bun.zstdDecompress(bytes));
      if (entry.schema !== SCHEMA || entry.key !== key || contentHash(entry.payload) !== entry.sha256) return null;
      return decode(entry.payload) as T;
    } catch {
      return null;
    }
  }
  async write(namespace: string, key: string, value: unknown) {
    const target = this.filename(namespace, key);
    const temporary = `${target}.${process.pid}.${crypto.randomUUID()}.tmp`;
    try {
      await mkdir(this.directory, { recursive: true });
      const payload = packr.pack(value);
      const entry = packr.pack({ schema: SCHEMA, key, sha256: contentHash(payload), payload });
      await Bun.write(temporary, await Bun.zstdCompress(entry, { level: 1 }));
      await rename(temporary, target);
    } catch {
      // A cache cannot turn a correct build into a failure; real computations still run.
      await rm(temporary, { force: true }).catch(() => {});
    }
  }
}
export const buildArtifacts = new BuildArtifactCache();
