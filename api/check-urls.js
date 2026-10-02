// RankVelt API: POST /api/check-urls
// Body: { urls: string[] } (max 20 per request)
// Returns status, redirect chain, and response time for each URL.
// Used by the Bulk HTTP Status Checker and the Broken Link Checker.
//
// Safety: http/https only. Hosts that resolve to private, loopback, or
// link-local addresses are rejected so the endpoint cannot be used to
// probe internal networks. Each request has a hard timeout.

import { promises as dns } from 'node:dns';

const MAX_URLS = 20;
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 10;

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
    throw new Error('That host resolves to a private address and cannot be checked.');
  }
}

function normalizeUrl(raw) {
  let u = String(raw || '').trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  const parsed = new URL(u);
  if (!['http:', 'https:'].includes(parsed.protocol)) return null;
  return parsed.toString();
}

async function fetchOnce(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RankVeltStatusChecker/1.0)',
        Accept: '*/*',
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function checkOne(input) {
  const started = Date.now();
  const result = { input, status: null, finalUrl: input, chain: [], ms: 0, error: null };
  try {
    const startUrl = normalizeUrl(input);
    if (!startUrl) throw new Error('Invalid URL.');
    await assertPublicHost(new URL(startUrl).hostname);

    let current = startUrl;
    let method = 'HEAD';
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      let res = await fetchOnce(current, method);
      if ((res.status === 405 || res.status === 501) && method === 'HEAD') {
        method = 'GET';
        res = await fetchOnce(current, method);
      }
      result.chain.push({ url: current, status: res.status });
      result.status = res.status;
      result.finalUrl = current;

      const location = res.headers.get('location');
      const isRedirect = [301, 302, 303, 307, 308].includes(res.status);
      if (!isRedirect || !location) break;
      if (hop === MAX_REDIRECTS) {
        result.error = 'Too many redirects.';
        break;
      }
      current = new URL(location, current).toString();
      if (res.status === 303) method = 'GET';
    }
  } catch (err) {
    result.error =
      err && err.name === 'AbortError'
        ? 'Timed out.'
        : (err && err.message) || 'Check failed.';
  }
  result.ms = Date.now() - started;
  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only.' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const urls = Array.isArray(body.urls) ? body.urls.slice(0, MAX_URLS) : [];
    if (!urls.length) {
      res.status(400).json({ ok: false, error: 'Send at least one URL.' });
      return;
    }
    const results = await Promise.all(urls.map(checkOne));
    res.status(200).json({ ok: true, results });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err && err.message) || 'Server error.' });
  }
}
