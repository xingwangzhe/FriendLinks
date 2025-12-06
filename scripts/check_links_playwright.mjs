#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';

// This script only outputs a JSON file listing unreachable sites for CI
// (does NOT modify any YAML files). Output: `unreachable-sites.json`.

const LINKS_DIR = path.resolve(process.cwd(), 'links');
const OUTPUT_FILE = path.resolve(process.cwd(), 'unreachable-sites.json');
const TIMEOUT_MS = 60000;
const CONCURRENCY = process.env.CONCURRENCY ? Number(process.env.CONCURRENCY) : 8;

const ARGS = process.argv.slice(2);
const DRY = ARGS.includes('--dry') || ARGS.includes('-n');
if (DRY) console.log('Running in dry mode: 仅打印结果，不写入文件');

function isTlsErrorMessage(msg, code) {
  if (!msg && !code) return false;
  const s = (msg || '') + ' ' + (code || '');
  return /certificate|ssl|tls|unable to get local issuer|unable to verify the first certificate|CERT_|ERR_TLS|DEPTH_ZERO_SELF_SIGNED_CERT/i.test(s);
}

async function checkUrlWithBrowser(browser, url, opts = {}) {
  let context;
  const timeout = opts.timeout || TIMEOUT_MS;

  function isTimeoutError(err) {
    if (!err) return false;
    const msg = (err.message || String(err)).toLowerCase();
    const code = (err.code || '').toString().toLowerCase();
    return /timeout|navigation timeout|navigation failed because|net::err_|net::err_connection_reset/i.test(msg) || /timeout/.test(code) || (err.name && err.name.toLowerCase && err.name.toLowerCase().includes('timeout'));
  }

  async function doGoto(page, t) {
    return page.goto(url, { timeout: t, waitUntil: 'domcontentloaded' });
  }

  try {
    context = await browser.newContext({ ignoreHTTPSErrors: false });
    const page = await context.newPage();

    try {
      const resp = await doGoto(page, timeout);
      if (resp) {
        const status = resp.status();
        const req = resp.request();
        const redirectChain = [];
        try {
          let cur = req;
          while (cur && typeof cur.redirectedFrom === 'function' && cur.redirectedFrom()) {
            const prev = cur.redirectedFrom();
            if (!prev) break;
            redirectChain.unshift(prev.url());
            cur = prev;
          }
          if (redirectChain.length > 0) redirectChain.push(req.url());
        } catch {
          // ignore if Playwright API differs
        }

        const finalUrl = page.url();
        const clientRedirect = finalUrl && finalUrl !== url;
        return { ok: status >= 200 && status < 400, status, redirectChain, finalUrl, clientRedirect };
      }
      return { ok: false, error: 'no-response' };
    } catch (err) {
      // If it looks like a timeout, attempt one retry with extended timeout
      if (isTimeoutError(err)) {
        const extended = Math.max(timeout * 4, 120000);
        console.log(`  超时，尝试使用更长超时重试：${extended}ms  url=${url}`);
        try {
          const resp2 = await doGoto(page, extended);
          if (resp2) {
            const status = resp2.status();
            const req = resp2.request();
            const redirectChain = [];
            try {
              let cur = req;
              while (cur && typeof cur.redirectedFrom === 'function' && cur.redirectedFrom()) {
                const prev = cur.redirectedFrom();
                if (!prev) break;
                redirectChain.unshift(prev.url());
                cur = prev;
              }
              if (redirectChain.length > 0) redirectChain.push(req.url());
            } catch {}

            const finalUrl = page.url();
            const clientRedirect = finalUrl && finalUrl !== url;
            console.log(`  重试成功： ${url}  status=${status}`);
            return { ok: status >= 200 && status < 400, status, redirectChain, finalUrl, clientRedirect };
          }
          return { ok: false, error: 'no-response-after-retry' };
        } catch (err2) {
          // fallthrough to return original error info below
          const msg2 = err2 && (err2.message || String(err2)) || String(err2);
          const code2 = err2 && (err2.code || err2.errno) || null;
          return { ok: false, error: msg2, code: code2, isTls: isTlsErrorMessage(msg2, code2) };
        }
      }

      const msg = err && (err.message || String(err)) || String(err);
      const code = err && (err.code || err.errno) || null;
      return { ok: false, error: msg, code, isTls: isTlsErrorMessage(msg, code) };
    }
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
      // save main site url with its name and parent info as extra
      // main's parent is the site itself (so it will appear in parents if referenced)
      addUrl(doc.site.url, file, 'main', { name: doc.site.name, parentName: doc.site.name, parentUrl: doc.site.url });
      const friends = doc.site.friends || [];
      if (Array.isArray(friends)) {
        friends.forEach((f, idx) => {
          if (f && f.url) addUrl(f.url, file, 'friend', { index: idx, name: f.name, parentName: doc.site.name, parentUrl: doc.site.url });
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

  // incremental id for each failure entry
  let failId = 1;

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
            results.push({
              id: failId++,
              url,
              reason: res.error || `status-${res.status || 'unknown'}`,
              status: res.status || null,
              isTls: !!res.isTls,
              redirectChain: res.redirectChain || [],
              finalUrl: res.finalUrl || null,
              clientRedirect: !!res.clientRedirect,
              refs: entry ? entry.refs : []
            });
          }
        } catch (err) {
          const duration = Date.now() - start;
          console.log(`  结果： 不可达  err=${String(err)}  domain=${domain}  time=${duration}ms`);
          const entry = urlMap.get(url);
          results.push({ id: failId++, url, reason: String(err), status: null, isTls: false, redirectChain: [], finalUrl: null, clientRedirect: false, refs: entry ? entry.refs : [] });
        }
      }
    })());
  }

  await Promise.all(workers);
  try { await browser.close(); } catch (e) { console.warn('browser.close failed:', e && e.message ? e.message : e); }

  if (DRY) {
    console.log('不可访问站点（JSON）：');
    // 输出精简后的 JSON
    const compact = buildCompact(results, urlMap);
    console.log(JSON.stringify(compact, null, 2));
    return;
  }

  try {
    const compact = buildCompact(results, urlMap);
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(compact, null, 2), 'utf8');
    console.log('已写入不可访问站点列表（精简）：', OUTPUT_FILE);
  } catch (err) {
    console.error('写入输出文件失败：', err && err.message);
    process.exit(1);
  }
}

function buildCompact(results, urlMap) {
  // Map by url to merge duplicates (should already be unique in results)
  const map = new Map();
  for (const r of results) {
    const entry = urlMap.get(r.url) || { refs: [] };
    const refs = entry.refs || [];

    // determine site name: prefer main site name, else first friend name, else empty
    let name = '';
    let isMain = false;
    for (const ref of refs) {
      if (ref.role === 'main' && ref.extra && ref.extra.name) {
        name = ref.extra.name;
        isMain = true;
        break;
      }
    }
    if (!name) {
      const friendRef = refs.find((f) => f.role === 'friend' && f.extra && f.extra.name);
      if (friendRef) name = friendRef.extra.name || '';
    }

    // parents: collect unique parent sites (parentName + parentUrl) from any ref that points to this URL
    const parents = [];
    const seen = new Set();
    for (const ref of refs) {
      if (ref && ref.extra) {
        const pUrl = ref.extra.parentUrl || ref.extra.siteUrl || null;
        const pName = ref.extra.parentName || ref.extra.name || '';
        if (pUrl) {
          if (!seen.has(pUrl)) {
            seen.add(pUrl);
            parents.push({ name: pName || '', url: pUrl });
          }
        }
      }
    }

    // remove self-parent entries (parent.url === this site's url)
    const filteredParents = parents.filter((p) => p.url !== r.url);

    // preserve failure metadata (id, reason, status, isTls, redirectChain, finalUrl, clientRedirect)
    map.set(r.url, {
      id: r.id || null,
      url: r.url,
      name: name || '',
      isMain: isMain,
      parents: filteredParents,
      reason: r.reason || null,
      status: r.status || null,
      isTls: !!r.isTls,
      redirectChain: Array.isArray(r.redirectChain) ? r.redirectChain : [],
      finalUrl: r.finalUrl || null,
      clientRedirect: !!r.clientRedirect
    });
  }

  const sites = Array.from(map.values());
  return { total: sites.length, sites };
}

run().catch((e) => {
  console.error('Playwright 检测出错：', e && e.message ? e.message : e);
  process.exit(1);
});
