// RankVelt API: POST /api/fetch-page
// Body: { url: string }
// Fetches one page and returns its outgoing links for the Broken Link
// Checker crawl step. The client orchestrates the crawl one page at a
// time so every request stays short.
//
// Safety: http/https only. Hosts that resolve to private, loopback, or
// link-local addresses are rejected. Response size and link count are
// capped, and every request has a hard timeout.

const dns = require('dns').promises;

const TIMEOUT_MS = 8000;
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_LINKS = 400;

function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip.includes(':')) {
    const v = ip.toLowerCase();
    return (
      v === '::1' ||
      v.startsWith('fe80:') ||
      v.startsWith('fc') ||
      v.startsWith('fd') ||
      v === '::'
    );
  }
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) return true;
  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
}

async function assertPublicHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  if (!host || host === 'localhost' || host.endsWith('.localhost')) {
    throw new Error('That host is not allowed.');
  }
  const records = await dns.lookup(host, { all: true }).catch(() => []);
  if (!records.length) throw new Error('Could not resolve that host.');
  if (records.some((r) => isPrivateIp(r.address))) {
    throw new Error('That host resolves to a private address and cannot be fetched.');
  }
}

function extractLinks(html, baseUrl) {
  const links = [];
  const seen = new Set();
  const anchorRe = /<a\s[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = anchorRe.exec(html)) !== null) {
    const rawHref = (m[1] || m[2] || m[3] || '').trim();
    if (!rawHref) continue;
    if (/^(mailto:|tel:|javascript:|data:|#)/i.test(rawHref)) continue;
    let abs;
    try {
      abs = new URL(rawHref, baseUrl);
    } catch {
      continue;
    }
    if (!['http:', 'https:'].includes(abs.protocol)) continue;
    abs.hash = '';
    const href = abs.toString();
    if (seen.has(href)) continue;
    seen.add(href);
    const text = (m[4] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
    links.push({ href, text });
    if (links.length >= MAX_LINKS) break;
  }
  return links;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only.' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    let target = String(body.url || '').trim();
    if (!target) {
      res.status(400).json({ ok: false, error: 'Send a URL.' });
      return;
    }
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target;
    const parsed = new URL(target);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      res.status(400).json({ ok: false, error: 'Only http and https URLs are supported.' });
      return;
    }
    await assertPublicHost(parsed.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response;
    try {
      response = await fetch(parsed.toString(), {
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RankVeltLinkChecker/1.0)',
          Accept: 'text/html,application/xhtml+xml',
        },
      });
    } finally {
      clearTimeout(timer);
    }

    const finalUrl = response.url || parsed.toString();
    const contentType = response.headers.get('content-type') || '';
    if (!/text\/html|application\/xhtml/i.test(contentType)) {
      res.status(200).json({
        ok: true,
        finalUrl,
        status: response.status,
        links: [],
        note: 'That URL did not return an HTML page.',
      });
      return;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const html = buffer.subarray(0, MAX_BYTES).toString('utf8');
    const links = extractLinks(html, finalUrl);
    res.status(200).json({ ok: true, finalUrl, status: response.status, links });
  } catch (err) {
    const message =
      err && err.name === 'AbortError'
        ? 'That page took too long to load.'
        : (err && err.message) || 'Could not fetch that page.';
    res.status(200).json({ ok: false, error: message });
  }
};
