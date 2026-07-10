/**
 * 构建后脚本：为 .bin 文件添加内容 hash
 *
 * 执行 astro build 后运行，为 graph-core.bin 和 graph-bezier.bin
 * 计算 SHA256 内容 hash（取前 12 位），重命名文件并注入到 HTML/SW 中。
 *
 * hash 命名原理：
 *   graph-core.bin  →  graph-core.a1b2c3d4e5f6.bin
 *   内容变了 → hash 变了 → URL 变了 → CDN 旧缓存自动失效
 */
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const DIST = path.resolve("dist");

function hashFile(filePath: string, len = 12): string {
  const buf = readFileSync(filePath);
  return createHash("sha256").update(buf).digest("hex").slice(0, len);
}

function main() {
  const corePath = path.join(DIST, "graph-core.bin");
  const bezierPath = path.join(DIST, "graph-bezier.bin");
  const htmlPath = path.join(DIST, "index.html");
  const swPath = path.join(DIST, "sw.js");

  // 检查必要文件是否存在
  const missing: string[] = [];
  for (const p of [corePath, bezierPath, htmlPath]) {
    if (!existsSync(p)) missing.push(p);
  }
  if (missing.length > 0) {
    console.error(
      `[hash-bin-files] 错误：以下文件不存在，请先执行 astro build：\n` +
        missing.map((p) => `  ${path.relative(DIST, p)}`).join("\n"),
    );
    process.exit(1);
  }

  // ── 1. 计算 hash ──
  const coreHash = hashFile(corePath);
  const bezierHash = hashFile(bezierPath);
  console.log(`[hash-bin-files] graph-core.bin  →  graph-core.${coreHash}.bin`);
  console.log(`[hash-bin-files] graph-bezier.bin →  graph-bezier.${bezierHash}.bin`);

  // ── 2. 重命名文件 ──
  renameSync(corePath, path.join(DIST, `graph-core.${coreHash}.bin`));
  renameSync(bezierPath, path.join(DIST, `graph-bezier.${bezierHash}.bin`));

  // ── 3. 注入 hash 到 index.html ──
  let html = readFileSync(htmlPath, "utf-8");
  const hashScript = `<script>window.__BIN_HASHES={core:"${coreHash}",bezier:"${bezierHash}"};</script>`;
  html = html.replace("</head>", `${hashScript}</head>`);
  writeFileSync(htmlPath, html);

  // ── 4. 更新 sw.js 中的 URL 匹配 ──
  if (existsSync(swPath)) {
    let sw = readFileSync(swPath, "utf-8");
    sw = sw.replace(
      /url\.pathname === "\/graph-core\.bin"/,
      `/\\/graph-core\\.[a-f0-9]+\\.bin\$/.test(url.pathname)`,
    );
    writeFileSync(swPath, sw);
    console.log(`[hash-bin-files] sw.js 匹配逻辑已更新`);
  }

  console.log(`[hash-bin-files] ✅ 完成`);
}

main();
