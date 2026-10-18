import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.resolve("package.json"));
const args = process.argv.slice(2);
const force = args.includes("--force");
const refresh = args.includes("--refresh-cache");
const env = { ...process.env };
if (force) env.FRIENDLINKS_BUILD_CACHE = "0";
else if (refresh) env.FRIENDLINKS_BUILD_CACHE = "refresh";
const astroManifest = require.resolve("astro/package.json");
const astroBin = path.join(path.dirname(astroManifest), "bin/astro.mjs");
const astroVersion = require("astro/package.json").version;
const astroArgs = args.filter((arg) => arg !== "--refresh-cache");
if (refresh && !force) astroArgs.push("--force");
console.log(`[build] Bun ${Bun.version}, Astro ${astroVersion}, artifacts=${env.FRIENDLINKS_BUILD_CACHE || "enabled"}`);
const start = performance.now();
const build = Bun.spawn([process.execPath, astroBin, "build", "--timings", ...astroArgs], {
  env,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
const code = await build.exited;
if (code !== 0) process.exit(code);
const astroEnd = performance.now();
const post = Bun.spawn([process.execPath, path.resolve("scripts/hash-bin-files.ts")], {
  env,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
const postCode = await post.exited;
console.log(
  `[build timing] astro=${((astroEnd - start) / 1000).toFixed(3)}s post=${((performance.now() - astroEnd) / 1000).toFixed(3)}s total=${((performance.now() - start) / 1000).toFixed(3)}s`,
);
process.exit(postCode);
