#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
let playwright;
try {
  // dynamic import so missing playwright gives a nice error
  playwright = await import('playwright');
} catch (err) {
  console.error('请先安装 Playwright：npm install playwright --save-dev，并在 CI 中运行 `npx playwright install --with-deps`');
  process.exit(2);
}

const TARGETS = path.resolve(process.cwd(), '.playwright_tls_targets.json');
const OUT_JSON = path.resolve(process.cwd(), '.playwright_tls_results.json');
const OUT_RESTORE = path.resolve(process.cwd(), '.playwright_tls_restore.txt');

async function run() {
  let raw;
  try {
    raw = await fs.readFile(TARGETS, 'utf8');
  } catch (err) {
    console.error('无法读取 TLS 目标文件：', TARGETS, err.message);
    process.exit(1);
  }
  let targets;
  try {
    targets = JSON.parse(raw);
  } catch (err) {
    console.error('解析 TLS 目标 JSON 失败：', err.message);
    process.exit(1);
  }
  if (!Array.isArray(targets) || targets.length === 0) {
    console.log('没有要复查的 TLS 目标。');
    return;
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: false });
  const page = await context.newPage();
  const results = [];
  const restored = [];

  for (const t of targets) {
    const url = t.url;
    console.log('Playwright 复查：', url);
    try {
      // 尝试导航（如果证书不被信任，会抛出错误）
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // 如果成功，记录为可恢复
      results.push({ url, ok: true });
      restored.push(url);
      console.log('  浏览器可达：', url);
    } catch (err) {
      const msg = err && (err.message || String(err)) || String(err);
      results.push({ url, ok: false, error: msg });
      console.log('  浏览器不可达（可能是证书问题或其他）：', msg.split('\n')[0]);
    }
  }

  await browser.close();

  try {
    await fs.writeFile(OUT_JSON, JSON.stringify(results, null, 2), 'utf8');
    console.log('已写入 Playwright 复查结果：', OUT_JSON);
  } catch (err) {
    console.warn('写入 Playwright 结果失败：', err.message);
  }

  try {
    if (restored.length > 0) {
      await fs.writeFile(OUT_RESTORE, restored.join('\n') + '\n', 'utf8');
      console.log('写入可恢复 URL 列表：', OUT_RESTORE);
    } else {
      // ensure file removed if exists
      try { await fs.unlink(OUT_RESTORE); } catch (e) {}
      console.log('没有可恢复的 URL。');
    }
  } catch (err) {
    console.warn('写入 restore 列表失败：', err.message);
  }
}

run().catch((e) => {
  console.error('Playwright 复查出错：', e);
  process.exit(1);
});
