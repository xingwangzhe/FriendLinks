#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';

// This script only outputs a JSON file listing unreachable sites for CI
// (does NOT modify any YAML files). Output: `unreachable-sites.json`.

const LINKS_DIR = path.resolve(process.cwd(), 'links');
const OUTPUT_FILE = path.resolve(process.cwd(), 'unreachable-sites.json');
const TIMEOUT_MS = 30000;
const CONCURRENCY = process.env.CONCURRENCY ? Number(process.env.CONCURRENCY) : 8;

const ARGS = process.argv.slice(2);
const DRY = ARGS.includes('--dry') || ARGS.includes('-n');
if (DRY) console.log('Running in dry mode: 仅打印结果，不写入文件');

function isTlsErrorMessage(msg, code) {
  if (!msg && !code) return false;
  const s = (msg || '') + ' ' + (code || '');
  return /certificate|ssl|tls|unable to get local issuer|unable to verify the first certificate|CERT_|ERR_TLS|DEPTH_ZERO_SELF_SIGNED_CERT/i.test(s);
}

async function checkUrlWithBrowser(browser, url) {
  let context;
  try {
    context = await browser.newContext({ ignoreHTTPSErrors: false });
    const page = await context.newPage();
    const resp = await page.goto(url, { timeout: TIMEOUT_MS, waitUntil: 'domcontentloaded' });
    if (resp) {
      const status = resp.status();
      return { ok: status >= 200 && status < 400, status };
    }
    return { ok: false, error: 'no-response' };
  } catch (err) {
    const msg = err && (err.message || String(err)) || String(err);
    const code = err && (err.code || err.errno) || null;
    return { ok: false, error: msg, code, isTls: isTlsErrorMessage(msg, code) };
    } finally {
    if (context) {
      try { await context.close(); } catch (e) { console.warn('context.close failed:', e && e.message ? e.message : e); }
    }
  }
}

async function run() {
  console.log('扫描 links 目录：', LINKS_DIR);
  let files;
  try {
    files = await fs.readdir(LINKS_DIR);
  } catch (err) {
    console.error('无法读取 links 目录：', err.message || err);
    process.exit(1);
  }

  const ymlFiles = files.filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
  const urlMap = new Map();

  function addUrl(url, file, role, extra) {
    if (!url) return;
    const key = url.trim();
    const existing = urlMap.get(key);
    if (existing) {
      existing.refs.push({ file, role, extra });
    } else {
      urlMap.set(key, { url: key, refs: [{ file, role, extra }] });
    }
  }

  for (const file of ymlFiles) {
    const p = path.join(LINKS_DIR, file);
    let content;
    try {
      content = await fs.readFile(p, 'utf8');
    } catch (err) {
      console.warn('读取失败', p, err && err.message);
      continue;
    }
    let doc;
    try {
      doc = YAML.parse(content);
    } catch (err) {
      console.warn('解析 YAML 失败，跳过：', file, err && err.message);
      continue;
    }
    if (doc && doc.site) {
      addUrl(doc.site.url, file, 'main');
      const friends = doc.site.friends || [];
      if (Array.isArray(friends)) {
        friends.forEach((f, idx) => {
          if (f && f.url) addUrl(f.url, file, 'friend', { index: idx, name: f.name });
        });
      }
    }
  }

  if (urlMap.size === 0) {
    console.log('没有发现要检测的 URL');
    if (!DRY) await fs.writeFile(OUTPUT_FILE, JSON.stringify([], null, 2), 'utf8');
    return;
  }

  const urls = Array.from(urlMap.values()).map((v) => v.url);
  console.log('待检测 URL 数量（去重后）：', urls.length);

  let playwright;
  try {
    playwright = await import('playwright');
  } catch (err) {
    console.error('请先安装 Playwright：npm i -D playwright', err && err.message ? err.message : err);
    process.exit(2);
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const results = [];

  const queue = [...urls];
  const workers = [];
  for (let i = 0; i < Math.min(CONCURRENCY, queue.length); i++) {
    workers.push((async () => {
      while (queue.length) {
        const url = queue.shift();
        if (!url) break;
        const domain = (() => { try { return new URL(url).hostname } catch { return url } })();
        const start = Date.now();
        try {
          console.log(`检测 URL： ${url}  domain=${domain}`);
          const res = await checkUrlWithBrowser(browser, url);
          const duration = Date.now() - start;
          console.log(`  结果： ${res.ok ? '正常' : '不可达'}  ${res.status ? `status=${res.status}` : `err=${res.error}`}  time=${duration}ms`);
          if (!res.ok) {
            const entry = urlMap.get(url);
            results.push({ url, reason: res.error || `status-${res.status || 'unknown'}`, status: res.status || null, isTls: !!res.isTls, refs: entry ? entry.refs : [] });
          }
        } catch (err) {
          const duration = Date.now() - start;
          console.log(`  结果： 不可达  err=${String(err)}  domain=${domain}  time=${duration}ms`);
          const entry = urlMap.get(url);
          results.push({ url, reason: String(err), status: null, isTls: false, refs: entry ? entry.refs : [] });
        }
      }
    })());
  }

  await Promise.all(workers);
  try { await browser.close(); } catch (e) { console.warn('browser.close failed:', e && e.message ? e.message : e); }

  if (DRY) {
    console.log('不可访问站点（JSON）：');
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  try {
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf8');
    console.log('已写入不可访问站点列表：', OUTPUT_FILE);
  } catch (err) {
    console.error('写入输出文件失败：', err && err.message);
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Playwright 检测出错：', e && e.message ? e.message : e);
  process.exit(1);
});
