/**
 * 构建后脚本：为所有构建产物添加 UTC 时间戳标记
 *
 * 执行 astro build 后运行，为以下文件添加 UTC 时间戳（YYYY-MM-DD-HH-mm-ss）：
 *   - _astro/*.js, _astro/*.css, _astro/*.svg, _astro/*.wasm
 *   - graph-core.bin, graph-bezier.bin
 *
 * 同时更新 index.html 和 sw.js 中的引用。
 *
 * 命名示例：
 *   vendor-three.abc123.js  →  vendor-three.2026-07-12-06-02-34.js
 *   graph-core.bin          →  graph-core.2026-07-12-06-02-34.bin
 */
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const ASTRO_DIR = path.join(DIST, "_astro");

/** 生成 UTC 时间戳标记，格式：YYYY-MM-DD-HH-mm-ss */
function timestampTag(): string {
  return new Date().toISOString().replace(/[T:]/g, "-").slice(0, 19);
}

/** 判断文件名是否包含内容 hash（8 位字母数字，base64 URL-safe 字符集） */
function hasContentHash(filename: string): boolean {
  return /\.[a-zA-Z0-9_-]{8}\./.test(filename);
}

/** 用时间戳替换文件名中的内容 hash，返回 [新文件名, 是否变更] */
function replaceHashWithTimestamp(filename: string, ts: string): [string, boolean] {
  const newName = filename.replace(/\.[a-zA-Z0-9_-]{8}(\.(js|css|svg|wasm))$/, `.${ts}$1`);
  if (newName !== filename) return [newName, true];
  // fallback: .bin 文件没有 hash 前缀，直接插入时间戳
  if (/^graph-(core|bezier)\.bin$/.test(filename)) {
    return [filename.replace(/\.bin$/, `.${ts}.bin`), true];
  }
  return [newName, false];
}

function main() {
  const htmlPath = path.join(DIST, "index.html");
  const swPath = path.join(DIST, "sw.js");

  // 检查必要文件是否存在
  if (!existsSync(DIST)) {
    console.error(`[post-build] 错误：dist 目录不存在，请先执行 astro build`);
    process.exit(1);
  }
  if (!existsSync(htmlPath)) {
    console.error(`[post-build] 错误：index.html 不存在，请先执行 astro build`);
    process.exit(1);
  }

  const ts = timestampTag();
  console.log(`[post-build] 构建时间戳（UTC）：${ts}`);

  // ── 1. 收集所有需要重命名的文件 ──
  const renames: { from: string; to: string }[] = [];

  // 1a. _astro/ 目录下的文件
  if (existsSync(ASTRO_DIR)) {
    for (const entry of readdirSync(ASTRO_DIR, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (![".js", ".css", ".svg", ".wasm"].includes(ext)) continue;
      if (!hasContentHash(entry.name)) continue;

      const [newName, changed] = replaceHashWithTimestamp(entry.name, ts);
      if (changed) {
        renames.push({
          from: path.join(ASTRO_DIR, entry.name),
          to: path.join(ASTRO_DIR, newName),
        });
      }
    }
  }

  // 1b. graph-*.bin 文件
  for (const binName of ["graph-core.bin", "graph-bezier.bin"]) {
    const binPath = path.join(DIST, binName);
    if (!existsSync(binPath)) continue;
    const [newName] = replaceHashWithTimestamp(binName, ts);
    renames.push({ from: binPath, to: path.join(DIST, newName) });
  }

  if (renames.length === 0) {
    console.log(`[post-build] ❌ 没有找到需要重命名的文件`);
    process.exit(1);
  }

  // ── 2. 记录重命名映射 ──
  console.log(`[post-build] 共 ${renames.length} 个文件需要重命名：`);
  for (const r of renames) {
    console.log(`  ${path.relative(DIST, r.from)}  →  ${path.relative(DIST, r.to)}`);
  }

  // ── 3. 更新 index.html 中的引用 ──
  let html = readFileSync(htmlPath, "utf-8");
  for (const r of renames) {
    const oldName = path.relative(DIST, r.from);
    const newName = path.relative(DIST, r.to);
    // 替换 HTML 中的旧路径为新路径
    html = html.replaceAll(`/${oldName}`, `/${newName}`);
  }
  // 注入时间戳宏，供客户端 JS 使用
  const tsScript = `<script>window.__BIN_TIMESTAMPS={core:"${ts}",bezier:"${ts}"};</script>`;
  html = html.replace("</head>", `${tsScript}</head>`);
  writeFileSync(htmlPath, html);
  console.log(`[post-build] index.html 引用已更新`);

  // ── 4. 更新 sw.js 中的引用 ──
  if (existsSync(swPath)) {
    let sw = readFileSync(swPath, "utf-8");
    for (const r of renames) {
      const oldName = path.relative(DIST, r.from);
      const newName = path.relative(DIST, r.to);
      sw = sw.replaceAll(`/${oldName}`, `/${newName}`);
    }
    // 更新 graph-core/graph-bezier 的正则匹配
    sw = sw.replace(
      /\/graph-core\.[a-f0-9]+\.bin/,
      `/graph-core.${ts}.bin`,
    );
    writeFileSync(swPath, sw);
    console.log(`[post-build] sw.js 引用已更新`);
  }

  // ── 5. 执行文件重命名 ──
  for (const r of renames) {
    renameSync(r.from, r.to);
  }

  console.log(`[post-build] ✅ 完成 · ${renames.length} 个文件已重命名`);
}

main();
