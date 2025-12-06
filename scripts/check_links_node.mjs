#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import UserAgent from 'user-agents';
import axios from 'axios';
import YAML from 'yaml';

const LINKS_DIR = path.resolve(process.cwd(), 'links');
const TIMEOUT_MS = 20000;
const RETRIES = 3;

const ARGS = process.argv.slice(2);
const DRY = ARGS.includes('--dry') || ARGS.includes('-n');
if (DRY) console.log('Running in dry mode: 不会写入或提交任何文件');

function extractUrl(content) {
  const m = content.match(/^\s*url:\s*["']?([^"'\n]+)["']?/m);
  return m ? m[1].trim() : null;
}

async function tryRequest(url) {
  const ua = new UserAgent().toString();
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      // Try HEAD first
      const headRes = await axios.head(url, {
        timeout: TIMEOUT_MS,
        maxRedirects: 5,
        headers: { 'User-Agent': ua, Referer: 'https://www.google.com' },
        validateStatus: null,
      });
      // If HEAD returns error status, try GET because some servers respond differently to HEAD
      if (headRes.status >= 200 && headRes.status < 400) {
        return { ok: true, status: headRes.status };
      }
      // fallback to GET to verify real page
      const getRes = await axios.get(url, {
        timeout: TIMEOUT_MS,
        maxRedirects: 5,
        headers: { 'User-Agent': ua, Referer: 'https://www.google.com' },
        validateStatus: null,
      });
      return { ok: getRes.status >= 200 && getRes.status < 400, status: getRes.status };
    } catch (err) {
      if (attempt < RETRIES) {
        const wait = 500 * attempt;
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      // Normalize error info for later classification (TLS vs network)
      const msg = err && (err.message || String(err)) || String(err);
      const code = err && (err.code || err.errno) || null;
      const isTls = /certificate|ssl|tls|unable to get local issuer|unable to verify the first certificate|CERT_/i.test(msg) || (code && /CERT_|UNABLE_TO_VERIFY|ERR_TLS|DEPTH_ZERO_SELF_SIGNED_CERT/i.test(String(code)));
      return { ok: false, error: msg, code: code, isTls };
    }
  }
}

function commentOutContent(original, reason) {
  const lines = original.split(/\r?\n/);
  const header = `# 已被 weekly-site-check 禁用: ${reason}`;
  const commented = lines.map((l) => (l.trim() === '' ? '#' : '# ' + l));
  return [header, ...commented].join('\n') + '\n';
}

async function run() {
  console.log('使用 axios 扫描 links 目录：', LINKS_DIR);
  let files;
  try {
    files = await fs.readdir(LINKS_DIR);
  } catch (err) {
    console.error('无法读取 links 目录：', err);
    process.exit(1);
  }

  const ymlFiles = files.filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

  // Build URL map with weight and references
  // weight: main site = 10, friend = 1
  const urlMap = new Map();
  function addUrl(url, file, role, extra) {
    if (!url) return;
    const key = url.trim();
    const weight = role === 'main' ? 10 : 1;
    const existing = urlMap.get(key);
    if (existing) {
      if (weight > existing.weight) existing.weight = weight;
      existing.refs.push({ file, role, extra });
    } else {
      urlMap.set(key, { url: key, weight, refs: [{ file, role, extra }] });
    }
  }

  const fileYAMLs = {};
  for (const file of ymlFiles) {
    const p = path.join(LINKS_DIR, file);
    let content;
    try {
      content = await fs.readFile(p, 'utf8');
    } catch (err) {
      console.warn('读取失败', p, err);
      continue;
    }
    fileYAMLs[file] = { content };
    const firstNonEmpty = content.split(/\r?\n/).find((l) => l.trim() !== '');
    if (firstNonEmpty && firstNonEmpty.trim().startsWith('# 已被 weekly-site-check 禁用')) {
      console.log(file, '已被检查器禁用，跳过整个文件');
      fileYAMLs[file].doc = null;
      continue;
    }
    let doc;
    try {
      doc = YAML.parse(content);
    } catch (err) {
      console.warn('解析 YAML 失败，跳过：', file, err);
      fileYAMLs[file].doc = null;
      continue;
    }
    fileYAMLs[file].doc = doc;
    if (doc && doc.site) {
      const mainUrl = doc.site.url;
      addUrl(mainUrl, file, 'main');
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
    return;
  }

  const urls = Array.from(urlMap.values()).map((v) => v.url);
  console.log('待检测 URL 数量（去重后）：', urls.length);

  // 并发设置（可通过环境变量 CONCURRENCY 调整）
  const CONCURRENCY = process.env.CONCURRENCY ? Number(process.env.CONCURRENCY) : 100;
  console.log('并发数：', CONCURRENCY);

  function chunkArray(arr, size) {
    const res = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  }

  // helper: 批量检查一组 URL，返回 Map(url -> result)
  async function checkUrlList(urlList) {
    const out = new Map();
    const chunks = chunkArray(urlList, CONCURRENCY);
    for (const chunk of chunks) {
      await Promise.all(chunk.map(async (url) => {
        const refs = urlMap.get(url).refs.map(r => `${r.role}@${r.file}`).join(', ');
        const domain = (() => { try { return new URL(url).hostname } catch { return url } })();
        const start = Date.now();
        try {
          console.log(`检测 URL： ${url}  引用于： ${refs}`);
          const res = await tryRequest(url);
          const duration = Date.now() - start;
          out.set(url, res);
          const statusPart = res.status ? `status=${res.status}` : `err=${res.error}`;
          console.log(`  结果： ${res.ok ? '正常' : '不可达'}  ${statusPart}  domain=${domain}  time=${duration}ms`);
        } catch (err) {
          const duration = Date.now() - start;
          out.set(url, { ok: false, error: String(err) });
          console.log(`  结果： 不可达  err=${String(err)}  domain=${domain}  time=${duration}ms`);
        }
      }));
    }
    return out;
  }

  // Phase 1: 只检测主站（weight >= 10），若主站不可用，则后续跳过该文件内的友链检测
  const mainUrls = Array.from(urlMap.values()).filter(v => v.weight >= 10).map(v => v.url);
  console.log('主站数量：', mainUrls.length);
  const mainResults = await checkUrlList(mainUrls);

  // 记录哪些文件的主站不可用，先把这些文件标记为 fullDisable
  const fileMainOk = new Map(); // file -> boolean
  for (const [url, entry] of urlMap.entries()) {
    if (entry.weight >= 10) {
      for (const ref of entry.refs) {
        if (ref.role === 'main') {
          const ok = mainResults.get(url) ? mainResults.get(url).ok : false;
          fileMainOk.set(ref.file, Boolean(ok));
        }
      }
    }
  }

  // Phase 2: 仅检测所属文件主站可用的友链
  const friendUrlsToCheck = [];
  for (const [url, entry] of urlMap.entries()) {
    // skip if this url is a main (we already checked it)
    if (entry.weight >= 10) continue;
    // keep this friend URL if at least one of its referencing files has main OK
    const refsKeep = entry.refs.filter(r => fileMainOk.get(r.file) !== false);
    if (refsKeep.length > 0) friendUrlsToCheck.push(url);
  }
  // 去重
  const uniqueFriendUrls = Array.from(new Set(friendUrlsToCheck));
  console.log('将要检测的友链数量（排除主站不可用的文件的友链）：', uniqueFriendUrls.length);
  const friendResults = await checkUrlList(uniqueFriendUrls);

  // 合并结果：先放主站结果，再把友链结果合入
  const results = new Map();
  for (const [u, r] of mainResults.entries()) results.set(u, r);
  for (const [u, r] of friendResults.entries()) results.set(u, r);

  // 收集 TLS 疑似问题的 URL，导出供 Playwright 复查
  const tlsSuspects = [];
  for (const [url, res] of results.entries()) {
    if (res && res.isTls) {
      const entry = urlMap.get(url);
      tlsSuspects.push({ url, refs: entry ? entry.refs : [] });
    }
  }
  if (tlsSuspects.length > 0) {
    try {
      await fs.writeFile('.playwright_tls_targets.json', JSON.stringify(tlsSuspects, null, 2), 'utf8');
      console.log('已将 TLS 疑似目标写入： .playwright_tls_targets.json （请用 Playwright 复查）');
    } catch (err) {
      console.warn('写入 .playwright_tls_targets.json 失败：', err);
    }
  } else {
    console.log('未发现 TLS/证书疑似问题。');
  }

  const modifiedFiles = new Map();
  for (const [url, entry] of urlMap.entries()) {
    const res = results.get(url) || { ok: false, error: 'no-result', isTls: false };
    for (const ref of entry.refs) {
      const file = ref.file;
      if (!modifiedFiles.has(file)) modifiedFiles.set(file, { fullDisable: false, disableFriendIndexes: new Set(), reasons: [] });
      const rec = modifiedFiles.get(file);
      if (ref.role === 'main') {
        if (!res.ok) {
          rec.fullDisable = true;
          rec.reasons.push({ type: 'main', url, reason: res.status ? `http-status-${res.status}` : res.error });
        }
      } else {
        if (!res.ok) {
          rec.disableFriendIndexes.add(ref.extra.index);
          rec.reasons.push({ type: 'friend', url, index: ref.extra.index, name: ref.extra.name, reason: res.status ? `http-status-${res.status}` : res.error });
        }
      }
    }
  }

  const filesToWrite = [];
  for (const [file, rec] of modifiedFiles.entries()) {
    const p = path.join(LINKS_DIR, file);
    const orig = fileYAMLs[file] && fileYAMLs[file].content;
    const doc = fileYAMLs[file] && fileYAMLs[file].doc;
    if (!orig) continue;
    if (rec.fullDisable) {
      console.log(file, '主站不可用，将注释整个文件，原因：', rec.reasons.filter(r=>r.type==='main').map(r=>r.reason).join('; '));
      const newC = commentOutContent(orig, rec.reasons.map(r=>r.reason).join('; '));
      if (DRY) {
        console.log('[DRY] 将注释文件：', p);
      } else {
        await fs.writeFile(p, newC, 'utf8');
      }
      filesToWrite.push(file);
      continue;
    }
    if (doc && doc.site && Array.isArray(doc.site.friends)) {
      let changed = false;
      const friends = doc.site.friends.map((f, idx) => {
        if (rec.disableFriendIndexes.has(idx)) {
          changed = true;
          const reason = rec.reasons.find(r => r.type==='friend' && r.index===idx);
          const note = reason ? reason.reason : 'unreachable';
          return { ...f, disabled: true, _disabled_reason: note };
        }
        return f;
      });
      if (changed) {
        doc.site.friends = friends;
        const out = YAML.stringify(doc);
        if (DRY) {
          console.log('[DRY] 将修改文件(只禁用部分友链)：', p, ' 禁用索引：', Array.from(rec.disableFriendIndexes).join(', '));
        } else {
          await fs.writeFile(p, out, 'utf8');
        }
        filesToWrite.push(file);
      }
    }
  }

  if (filesToWrite.length === 0) {
    console.log('无需更改。');
    return;
  }

  console.log('将修改的文件：', filesToWrite.join(', '));
  if (DRY) {
    console.log('[DRY] 未写入 .modified_links.txt');
    return;
  }

  try {
    await fs.writeFile('.modified_links.txt', filesToWrite.join('\n') + '\n', 'utf8');
    console.log('已将修改文件列表写入： .modified_links.txt');
  } catch (err) {
    console.error('写入修改列表失败：', err);
    process.exit(1);
  }
}

run();
