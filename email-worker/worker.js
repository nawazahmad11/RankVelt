#!/usr/bin/env node
/*
 * RankVelt Email Lead Worker - 100% free, no paid APIs.
 *
 * Extracts emails from websites listed in a Google Sheet.
 *   node worker.js --mode=extract --sheet=SHEET_ID [--tab=Websites] [--limit=500]
 *
 * Sheet layout (tab "Websites"):
 *   A: Website   B: Emails (comma separated)   C: Status
 *
 * Auth: set GOOGLE_SERVICE_ACCOUNT_JSON env var (the whole JSON key),
 * or GOOGLE_SERVICE_ACCOUNT_FILE pointing at the downloaded key file.
 * Share the sheet with the service account email as Editor.
 */

const fs = require('fs');

// ---------------------------------------------------------------- args

function parseArgs() {
  const out = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
    else if (a.startsWith('--')) out[a.slice(2)] = true;
  }
  return out;
}
const ARGS = parseArgs();

const LIMIT = ARGS.limit ? parseInt(ARGS.limit, 10) : 0;
const SHEET_ID_RAW = ARGS.sheet || process.env.SHEET_ID || '';
const TAB = ARGS.tab || process.env.SHEET_TAB || 'Websites';

const EXTRACT_CONCURRENCY = parseInt(process.env.EXTRACT_CONCURRENCY || '5', 10);
const BATCH_PAUSE_EVERY = parseInt(process.env.BATCH_PAUSE_EVERY || '100', 10);
const BATCH_PAUSE_MS = parseInt(process.env.BATCH_PAUSE_MS || '90000', 10);
const FLUSH_EVERY = 20;

function sheetIdFrom(input) {
  const m = String(input).match(/\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : String(input).trim();
}
const SHEET_ID = sheetIdFrom(SHEET_ID_RAW);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Hard cap around any network op: even if a socket/DNS lookup hangs in a way
// AbortController cannot cancel, the worker keeps moving and the row is marked.
async function withTimeout(promise, ms, label) {
  let t;
  const timeout = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error('timeout: ' + label)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(t);
  }
}

// Quote a tab name for A1 notation: 'My Tab'!A2:C
function rq(tab, range) {
  return `'${String(tab).replace(/'/g, "''")}'!${range}`;
}

// ---------------------------------------------------------------- sheets

let sheetsClient = null;
async function sheets() {
  if (sheetsClient) return sheetsClient;
  const { google } = require('googleapis');
  let credentials = null;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else {
    const p = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || './service-account.json';
    credentials = JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

async function readRange(range) {
  const s = await sheets();
  const res = await s.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range });
  return res.data.values || [];
}

const pendingWrites = [];
async function flushWrites() {
  if (!pendingWrites.length) return;
  const s = await sheets();
  const data = pendingWrites.splice(0).map((w) => ({ range: w.range, values: w.values }));
  await s.spreadsheets.values.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: { valueInputOption: 'RAW', data },
  });
}
function queueWrite(range, values) {
  pendingWrites.push({ range, values });
}

async function ensureTab(title, headers) {
  const s = await sheets();
  try {
    await s.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: rq(title, 'A1:Z1') });
    return;
  } catch (e) {
    // tab does not exist, create it
  }
  await s.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: { requests: [{ addSheet: { properties: { title } } }] },
  });
  queueWrite(rq(title, `A1:${String.fromCharCode(64 + headers.length)}1`), [headers]);
  await flushWrites();
}

// ---------------------------------------------------------------- extraction

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const BAD_TLDS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'css', 'js', 'json', 'xml', 'pdf', 'zip', 'mp4']);

function normalizeUrl(raw) {
  let u = String(raw || '').trim().replace(/\/+$/, '');
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try {
    const parsed = new URL(u);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.origin + (parsed.pathname === '/' ? '' : parsed.pathname);
  } catch {
    return null;
  }
}

let lastFetchError = '';
async function fetchHtml(url, timeoutMs = 15000, maxBytes = 2000000, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
      });
      if (!res.ok || !res.body) {
        lastFetchError = 'http-' + res.status;
        // 4xx (block/deny) won't clear on retry; 5xx might, so retry those.
        if (res.status >= 500 && attempt < retries) {
          await sleep(2000 * (attempt + 1));
          continue;
        }
        return null;
      }
    const ct = res.headers.get('content-type') || '';
    if (!/text\/html|text\/plain/.test(ct)) return null;
    // stream with a hard size cap so one giant page cannot blow up memory
    const reader = res.body.getReader();
    const chunks = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        try { await reader.cancel(); } catch { /* ignore */ }
        break;
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks).toString('utf8');
  } catch (e) {
    lastFetchError = e && e.name === 'AbortError' ? 'timeout' : 'network-error';
    if (attempt < retries) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    return null;
  } finally {
    clearTimeout(t);
  }
  }
}

function extractEmails(html) {
  const out = new Set();
  const clean = String(html)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&');
  for (const m of clean.matchAll(EMAIL_RE)) {
    let e = m[0].toLowerCase();
    if (e.length > 254 || e.includes('..')) continue;
    const tld = e.split('.').pop();
    if (BAD_TLDS.has(tld)) continue;
    const at = e.indexOf('@');
    const local = e.slice(0, at);
    const domain = e.slice(at + 1);
    if (!local || !domain || !domain.includes('.')) continue;
    if (/^[.-]|[.-]$/.test(local) || /^[.-]|[.-]$/.test(domain)) continue;
    out.add(e);
  }
  return out;
}

const CONTACT_PATHS = ['/contact', '/contact-us', '/about', '/about-us'];

// True when a URL looks like a contact/about page: one of its path segments
// starts with contact or about (covers /contact, /contact-us, /contact_us.asp,
// /about, /about-us ... but NOT /articles/all-about-x).
function looksLikeContactPage(urlObj) {
  return urlObj.pathname.toLowerCase().split('/').filter(Boolean)
    .map((s) => s.replace(/\.(asp|html?|php)$/, ''))
    .some((s) => /^(contact|about)([-_].*)?$/.test(s));
}

function sitemapContactUrls(xml, origin, maxUrls = 2) {
  const out = [];
  for (const m of String(xml).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
    if (out.length >= maxUrls) break;
    try {
      const u = new URL(m[1].trim(), origin);
      if (u.origin !== origin) continue; // never crawl another domain
      if (looksLikeContactPage(u)) {
        const clean = u.href.split('#')[0];
        if (!out.includes(clean)) out.push(clean);
      }
    } catch { /* ignore bad urls */ }
  }
  return out;
}

async function extractSite(rawUrl) {
  const base = normalizeUrl(rawUrl);
  if (!base) return { emails: [], status: 'error: bad-url' };

  let homeHtml = await fetchHtml(base);
  let usedBase = base;
  if (!homeHtml && base.startsWith('https://')) {
    usedBase = base.replace(/^https:/, 'http:');
    homeHtml = await fetchHtml(usedBase);
  }
  if (!homeHtml) return { emails: [], status: 'error: fetch-failed' + (lastFetchError ? ' (' + lastFetchError + ')' : '') };

  const origin = new URL(usedBase).origin;
  const urls = new Set([usedBase]);
  for (const p of CONTACT_PATHS) urls.add(origin + p);
  // discover contact/about links on the homepage (max 2 extra pages, same site only)
  let found = 0;
  for (const m of homeHtml.matchAll(/href=["']([^"']+)["']/gi)) {
    if (found >= 2) break;
    const href = m[1];
    if (href.startsWith('mailto:') || href.startsWith('#') || /^javascript:/i.test(href)) continue;
    try {
      const abs = new URL(href, usedBase);
      if (abs.origin !== origin) continue; // never crawl another domain
      if (!looksLikeContactPage(abs)) continue;
      urls.add(abs.href.split('#')[0]);
      found++;
    } catch { /* ignore */ }
  }
  // one cheap sitemap lookup per site to catch odd contact-page URLs
  const sm = await fetchHtml(origin + '/sitemap.xml', 10000, 500000, 0);
  for (const u of sitemapContactUrls(sm || '', origin)) urls.add(u);

  const all = new Set();
  let first = true;
  for (const u of urls) {
    // homepage already fetched; sub-pages get a shorter budget (10s, 1 retry)
    const html = first ? homeHtml : await fetchHtml(u, 10000, 2000000, 1);
    first = false;
    if (!html) continue;
    for (const e of extractEmails(html)) all.add(e);
    if (all.size >= 25) break;
  }
  const emails = [...all].slice(0, 25);
  return { emails, status: emails.length ? 'done' : 'done-no-email' };
}

async function runExtract() {
  const rows = await readRange(rq(TAB, 'A2:C'));
  const jobs = [];
  rows.forEach((r, i) => {
    const website = (r[0] || '').trim();
    const emails = (r[1] || '').trim();
    const status = (r[2] || '').trim();
    if (!website) return;
    if (emails || status === 'done' || status === 'done-no-email') return; // resume: skip finished
    jobs.push({ row: i + 2, website });
  });

  const todo = LIMIT > 0 ? jobs.slice(0, LIMIT) : jobs;
  console.log(`Extract: ${todo.length} websites to process (${jobs.length} pending in sheet).`);

  let doneCount = 0;
  let lastPauseAt = 0;
  let idx = 0;
  let pausePromise = null;

  // One shared pause: when the batch limit is hit, EVERY worker waits,
  // otherwise only the worker that noticed would sleep and the rest
  // would keep hammering sites, defeating the IP protection.
  async function maybePause() {
    if (doneCount - lastPauseAt < BATCH_PAUSE_EVERY) return;
    lastPauseAt = doneCount;
    if (!pausePromise) {
      pausePromise = (async () => {
        await flushWrites();
        const secs = Math.round(BATCH_PAUSE_MS / 1000);
        console.log(`  ...${doneCount} sites done, pausing ${secs}s to protect the IP (all workers waiting)...`);
        await sleep(BATCH_PAUSE_MS);
        pausePromise = null;
      })();
    }
    await pausePromise;
  }

  async function workerFn() {
    while (idx < todo.length) {
      const job = todo[idx++];
      let result;
      try {
        result = await withTimeout(extractSite(job.website), 120000, job.website);
      } catch (e) {
        result = { emails: [], status: 'error: ' + String(e.message || e).slice(0, 80) };
      }
      queueWrite(rq(TAB, `B${job.row}:C${job.row}`), [[result.emails.join(', '), result.status]]);
      doneCount++;

      if (doneCount % FLUSH_EVERY === 0) {
        await flushWrites();
        console.log(`  ...${doneCount}/${todo.length} done, progress saved to sheet`);
      }
      await maybePause();
    }
  }

  await Promise.all(Array.from({ length: EXTRACT_CONCURRENCY }, workerFn));
  await flushWrites();
  console.log(`Extract finished: ${doneCount} websites processed.`);
}

// ---------------------------------------------------------------- main

async function main() {
  if (!SHEET_ID) {
    console.error('ERROR: sheet id missing. Use --sheet=SHEET_ID or SHEET_ID env var.');
    process.exit(1);
  }
  console.log(`RankVelt Email Lead Worker | mode=extract | sheet=${SHEET_ID} | tab=${TAB}`);
  await runExtract();
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(async (err) => {
      console.error('FATAL:', err && err.message ? err.message : err);
      try { await flushWrites(); } catch { /* ignore */ }
      process.exit(1);
    });
}

module.exports = { extractEmails, normalizeUrl, extractSite, parseArgs: parseArgs, withTimeout, sheetIdFrom };
