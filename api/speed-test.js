// RankVelt API: POST /api/speed-test
// Body: { url: string, strategy: "mobile" | "desktop" }
// Runs a Google PageSpeed Insights test server-side so no API key is
// exposed in the browser. A free Google API key in PAGESPEED_API_KEY
// raises the quota; without one Google applies its small shared limit.
//
// Safety: http/https only. Hosts that resolve to private, loopback, or
// link-local addresses are rejected before any test runs.

import { promises as dns } from 'node:dns';

export const config = { maxDuration: 60 };

const PSI_TIMEOUT_MS = 55000;

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
    throw new Error('That host resolves to a private address and cannot be tested.');
  }
}

function metric(audits, id) {
  const a = audits && audits[id];
  if (!a) return null;
  return {
    title: a.title || id,
    displayValue: a.displayValue || null,
    numericValue: typeof a.numericValue === 'number' ? a.numericValue : null,
    score: typeof a.score === 'number' ? a.score : null,
  };
}

function fieldMetric(loadingExperience, id) {
  const m =
    loadingExperience &&
    loadingExperience.metrics &&
    loadingExperience.metrics[id];
  if (!m) return null;
  return {
    percentile: typeof m.percentile === 'number' ? m.percentile : null,
    category: m.category || null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only.' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    let target = String(body.url || '').trim();
    if (!target) {
      res.status(400).json({ ok: false, error: 'Send a URL to test.' });
      return;
    }
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target;
    const parsed = new URL(target);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      res.status(400).json({ ok: false, error: 'Only http and https URLs are supported.' });
      return;
    }
    const strategy = body.strategy === 'desktop' ? 'desktop' : 'mobile';
    await assertPublicHost(parsed.hostname);

    const psiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    psiUrl.searchParams.set('url', parsed.toString());
    psiUrl.searchParams.set('strategy', strategy);
    psiUrl.searchParams.set('category', 'performance');
    if (process.env.PAGESPEED_API_KEY) {
      psiUrl.searchParams.set('key', process.env.PAGESPEED_API_KEY);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PSI_TIMEOUT_MS);
    let payload;
    try {
      const response = await fetch(psiUrl.toString(), {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      payload = await response.json().catch(() => null);
      if (!response.ok || !payload || payload.error) {
        const googleMessage =
          (payload && payload.error && payload.error.message) || '';
        if (response.status === 429 || /quota|rate/i.test(googleMessage)) {
          res.status(200).json({
            ok: false,
            error: 'The free speed test limit is busy right now. Please wait a minute and try again.',
          });
          return;
        }
        res.status(200).json({
          ok: false,
          error: googleMessage
            ? 'Google could not test that page: ' + googleMessage
            : 'Google could not test that page. Check the URL and try again.',
        });
        return;
      }
    } finally {
      clearTimeout(timer);
    }

    const lighthouse = payload.lighthouseResult || {};
    const audits = lighthouse.audits || {};
    const performanceCategory = (lighthouse.categories || {}).performance || {};
    const score =
      typeof performanceCategory.score === 'number'
        ? Math.round(performanceCategory.score * 100)
        : null;

    const opportunities = Object.values(audits)
      .filter(
        (a) =>
          a &&
          a.details &&
          a.details.type === 'opportunity' &&
          typeof a.details.overallSavingsMs === 'number' &&
          a.details.overallSavingsMs >= 50
      )
      .sort((x, y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
      .slice(0, 8)
      .map((a) => ({
        title: a.title,
        savingsMs: Math.round(a.details.overallSavingsMs),
        displayValue: a.displayValue || null,
      }));

    const field = payload.loadingExperience || null;
    res.status(200).json({
      ok: true,
      testedUrl: parsed.toString(),
      finalUrl: lighthouse.finalDisplayedUrl || lighthouse.finalUrl || parsed.toString(),
      strategy,
      score,
      lab: {
        lcp: metric(audits, 'largest-contentful-paint'),
        cls: metric(audits, 'cumulative-layout-shift'),
        tbt: metric(audits, 'total-blocking-time'),
        fcp: metric(audits, 'first-contentful-paint'),
        speedIndex: metric(audits, 'speed-index'),
      },
      field: field
        ? {
            overallCategory: field.overall_category || null,
            lcp: fieldMetric(field, 'LARGEST_CONTENTFUL_PAINT_MS'),
            cls: fieldMetric(field, 'CUMULATIVE_LAYOUT_SHIFT_SCORE'),
            inp: fieldMetric(field, 'INTERACTION_TO_NEXT_PAINT'),
            fcp: fieldMetric(field, 'FIRST_CONTENTFUL_PAINT_MS'),
          }
        : null,
      opportunities,
      fetchTime: lighthouse.fetchTime || null,
    });
  } catch (err) {
    const message =
      err && err.name === 'AbortError'
        ? 'The speed test took too long. Please try again.'
        : (err && err.message) || 'Could not run the speed test.';
    res.status(200).json({ ok: false, error: message });
  }
}
