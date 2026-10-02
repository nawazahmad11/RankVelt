// RankVelt tool page: Bulk Broken Link Checker (100% free, no signup)
// Place at: src/pages/tools/BulkBrokenLinkChecker.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).
// The client orchestrates the crawl and keeps every request small:
// /api/fetch-page loads one page at a time, /api/check-urls verifies
// short batches of links. No document.title or meta tags here,
// RouteSeoManager owns those.

import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Link2,
} from 'lucide-react';

interface CheckResultItem {
  input: string;
  status: number | null;
  finalUrl: string;
  chain: { url: string; status: number }[];
  ms: number;
  error?: string | null;
}

interface LinkRow {
  url: string;
  internal: boolean;
  sources: string[];
  status: number | null;
  checked: boolean;
  finalUrl: string;
  ms: number;
  error: string | null;
}

type Phase = 'idle' | 'crawling' | 'checking' | 'done' | 'error';
type Filter = 'all' | 'broken' | 'internal' | 'external';

const MAX_PAGES = 25;
const CHECK_BATCH = 10;

const CHECKER_FAQS = [
  {
    q: 'How many pages does the free check crawl?',
    a: 'The check starts at the URL you enter and crawls up to 25 pages on the same domain, following internal links as it goes. Every unique link found on those pages, internal and external, is then tested. On a larger site, run the check from a few different starting points, for example your homepage, your blog index, and a product category.',
  },
  {
    q: 'Why do links break in the first place?',
    a: 'Pages get renamed, deleted, or moved during redesigns and migrations. External sites restructure or shut down, so the sources your articles cite quietly disappear. Typos and outdated URL patterns creep in as content ages. Link rot is gradual, which is why a site that was clean a year ago can collect broken links without anyone noticing.',
  },
  {
    q: 'Are broken links on other sites my problem?',
    a: 'Partly. Broken outbound links do not waste your crawl budget, because the requests land on someone else\u2019s server, but they erode reader trust and make your content look stale. The broken links that cost you most are internal ones, and backlinks from other sites pointing at your dead pages. Those are worth a 301 redirect to the closest matching live page.',
  },
  {
    q: 'Which status codes count as broken?',
    a: 'A 404 or 410 means the page is gone. Other 4xx codes and 5xx server errors also count as broken in this report, as does a connection that fails entirely. Redirects (3xx) are not broken by themselves, but long redirect chains are worth cleaning up because they slow visitors down and waste crawler time.',
  },
  {
    q: 'Why does the checker show a 403 for a page that loads fine for me?',
    a: 'Some sites block automated requests from servers, so our checker gets a 403 while your browser loads the page normally. Treat a 403 as "needs a manual look" rather than proof the page is dead. Open it yourself before changing anything on your site.',
  },
  {
    q: 'How often should I check for broken links?',
    a: 'Run a check after any redesign, migration, or URL change, because that is when broken links appear in bulk. For an active site, a monthly pass catches the slow link rot that accumulates the rest of the time. The check is free, so frequency is not a cost question.',
  },
  {
    q: 'Does RankVelt store the URLs I check?',
    a: 'No. The check runs live: your browser sends small batches to our endpoints, the results come back, and they are displayed on this page only. We do not keep a copy of your crawl or your results list, and nothing stays once you close the tab.',
  },
  {
    q: 'Can the checker scan pages behind a login?',
    a: 'No. The checker only visits public pages, just like a search engine crawler that is not signed in. For member areas or admin sections, check those links from inside your CMS, or crawl a staging copy of the site that does not require credentials.',
  },
];

const inputCls =
  'mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50';

const labelCls =
  'block text-[11px] font-black uppercase tracking-[0.18em] text-white/50';

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function hostKey(url: URL): string {
  return url.hostname.replace(/^www\./, '');
}

function classifyHref(href: string, baseUrl: string): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('sms:')
  ) {
    return null;
  }
  try {
    const parsed = new URL(trimmed, baseUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return null;
  }
}

function isBroken(row: LinkRow): boolean {
  if (!row.checked) return false;
  return row.status === null || row.status >= 400;
}

async function fetchPage(url: string): Promise<{
  ok: boolean;
  finalUrl?: string;
  links?: { href: string; text: string }[];
  error?: string;
}> {
  const res = await fetch('/api/fetch-page', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return res.json();
}

async function checkUrlBatch(urls: string[]): Promise<CheckResultItem[]> {
  const res = await fetch('/api/check-urls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  });
  const data = await res.json();
  if (!data || data.ok !== true || !Array.isArray(data.results)) {
    throw new Error((data && data.error) || 'Link check failed.');
  }
  return data.results as CheckResultItem[];
}

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function BulkBrokenLinkChecker() {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [progressText, setProgressText] = useState('');
  const [crawledCount, setCrawledCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const abortedRef = useRef(false);

  // FAQPage JSON-LD built from the same FAQ array rendered below.
  useEffect(() => {
    document.getElementById('rankvelt-broken-link-schema')?.remove();
    const schemaScript = document.createElement('script');
    schemaScript.id = 'rankvelt-broken-link-schema';
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: CHECKER_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, []);

  function stopRun() {
    abortedRef.current = true;
    setProgressText('Stopping after the current request finishes...');
  }

  async function runCheck() {
    const startUrl = normalizeUrl(input);
    if (!startUrl) {
      setErrorMsg('Please enter a valid website URL, for example your homepage address.');
      setPhase('error');
      return;
    }

    abortedRef.current = false;
    setErrorMsg(null);
    setRows([]);
    setFilter('all');
    setCrawledCount(0);
    setCheckedCount(0);
    setPhase('crawling');
    setProgressText('Fetching the starting page...');

    const startHost = hostKey(new URL(startUrl));
    const visited = new Set<string>([startUrl]);
    const queue: string[] = [startUrl];
    const linkMap = new Map<string, { internal: boolean; sources: string[] }>();
    let crawled = 0;
    let firstPageFailed = false;
    let firstPageError = '';

    while (queue.length > 0 && crawled < MAX_PAGES && !abortedRef.current) {
      const pageUrl = queue.shift() as string;
      const attempted = visited.size;
      setProgressText(`Crawling page ${crawled + 1} of up to ${MAX_PAGES}`);
      let pageResult: Awaited<ReturnType<typeof fetchPage>> | null = null;
      try {
        pageResult = await fetchPage(pageUrl);
      } catch {
        pageResult = null;
      }

      if (!pageResult || pageResult.ok !== true) {
        if (crawled === 0 && attempted === 1) {
          firstPageFailed = true;
          firstPageError =
            (pageResult && pageResult.error) ||
            'We could not reach that site from our servers.';
        }
        continue;
      }

      crawled += 1;
      setCrawledCount(crawled);
      const pageBase = pageResult.finalUrl || pageUrl;

      for (const link of pageResult.links || []) {
        const absolute = classifyHref(link.href, pageBase);
        if (!absolute) continue;
        let internal = false;
        try {
          internal = hostKey(new URL(absolute)) === startHost;
        } catch {
          internal = false;
        }
        const existing = linkMap.get(absolute);
        if (!existing) {
          linkMap.set(absolute, { internal, sources: [pageUrl] });
          if (internal && !visited.has(absolute) && visited.size < MAX_PAGES) {
            visited.add(absolute);
            queue.push(absolute);
          }
        } else if (!existing.sources.includes(pageUrl)) {
          existing.sources.push(pageUrl);
        }
      }

      if (queue.length > 0 && crawled < MAX_PAGES && !abortedRef.current) {
        await sleep(120);
      }
    }

    if (firstPageFailed) {
      setErrorMsg(
        `${firstPageError} Check that the address is correct and the site is online, then try again.`,
      );
      setPhase('error');
      return;
    }

    const collected: LinkRow[] = [...linkMap.entries()].map(([url, value]) => ({
      url,
      internal: value.internal,
      sources: value.sources,
      status: null,
      checked: false,
      finalUrl: '',
      ms: 0,
      error: null,
    }));
    setRows(collected);
    setCheckedCount(0);

    if (collected.length === 0) {
      setProgressText('The crawl finished but no checkable links were found on those pages.');
      setPhase('done');
      return;
    }

    setPhase('checking');
    let doneCount = 0;
    for (let i = 0; i < collected.length && !abortedRef.current; i += CHECK_BATCH) {
      const batch = collected.slice(i, i + CHECK_BATCH);
      const batchUrls = batch.map((row) => row.url);
      setProgressText(`Checked ${doneCount} of ${collected.length} links`);
      try {
        const results = await checkUrlBatch(batchUrls);
        const byInput = new Map(results.map((item) => [item.input, item]));
        setRows((prev) =>
          prev.map((row) => {
            const match = byInput.get(row.url);
            if (!match) return row;
            return {
              ...row,
              status: match.status,
              checked: true,
              finalUrl: match.finalUrl || '',
              ms: match.ms || 0,
              error: match.error ?? null,
            };
          }),
        );
      } catch {
        setRows((prev) =>
          prev.map((row) =>
            batchUrls.includes(row.url)
              ? { ...row, checked: true, status: null, error: 'check failed' }
              : row,
          ),
        );
      }
      doneCount += batch.length;
      setCheckedCount(Math.min(doneCount, collected.length));
      setProgressText(
        `Checked ${Math.min(doneCount, collected.length)} of ${collected.length} links`,
      );
    }

    if (abortedRef.current) {
      setProgressText('Check stopped. Partial results are shown below.');
      setPhase('done');
      return;
    }

    setPhase('done');
  }

  const totalLinks = rows.length;
  const brokenLinks = rows.filter(isBroken);
  const brokenCount = brokenLinks.length;

  const visibleRows = rows
    .filter((row) => {
      if (filter === 'broken') return isBroken(row);
      if (filter === 'internal') return row.internal;
      if (filter === 'external') return !row.internal;
      return true;
    })
    .slice(0, 500);

  const progressPercent =
    totalLinks > 0 ? Math.round((checkedCount / totalLinks) * 100) : 0;

  function downloadCsv() {
    const header = ['Link URL', 'Status', 'Type', 'Found On', 'Source Pages'];
    const lines = [header.map(escapeCsv).join(',')];
    for (const row of rows) {
      lines.push(
        [
          escapeCsv(row.url),
          escapeCsv(
            row.checked ? (row.status === null ? 'Error' : String(row.status)) : 'Not checked',
          ),
          escapeCsv(row.internal ? 'Internal' : 'External'),
          escapeCsv(row.sources[0] || ''),
          escapeCsv(String(row.sources.length)),
        ].join(','),
      );
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'rankvelt-broken-link-report.csv';
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }

  function statusBadge(row: LinkRow) {
    if (!row.checked) {
      return (
        <span className="inline-flex rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white/60">
          Queued
        </span>
      );
    }
    if (row.status === null) {
      return (
        <span className="inline-flex rounded-full border border-red-400/25 bg-red-400/[0.1] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-red-200">
          Error
        </span>
      );
    }
    if (row.status >= 500) {
      return (
        <span className="inline-flex rounded-full border border-red-400/25 bg-red-400/[0.1] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-red-200">
          {row.status}
        </span>
      );
    }
    if (row.status >= 400) {
      return (
        <span className="inline-flex rounded-full border border-rose-300/25 bg-rose-300/[0.1] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-rose-100">
          {row.status}
        </span>
      );
    }
    if (row.status >= 300) {
      return (
        <span className="inline-flex rounded-full border border-orange-300/25 bg-orange-300/[0.1] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-orange-100">
          {row.status}
        </span>
      );
    }
    return (
      <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/[0.1] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-200">
        {row.status}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.08] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <a
          href="/tools"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-primary"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Free Tools
        </a>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free RankVelt Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Bulk Broken Link <span className="text-gradient-gold">Checker</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            Enter your website address and this checker crawls up to 25 pages, collects every
            link on them, and tests each one for 404s, server errors, and dead ends. Free, no
            signup, no captcha.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Link2 size={20} />
              </span>
              <h2 className="text-xl font-black text-white">Check a website</h2>
            </div>

            <div className="mt-6">
              <label className={labelCls} htmlFor="blc-url">
                Website URL
              </label>
              <input
                id="blc-url"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://yourwebsite.com"
                spellCheck={false}
                className={inputCls}
              />
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                The free check crawls up to 25 pages on the same domain and tests every unique
                link it finds. Links are checked from RankVelt servers, so a site that blocks
                automated visits may show a few 403 results. Those are worth a quick manual
                look, not an automatic fix.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={runCheck}
                disabled={phase === 'crawling' || phase === 'checking'}
                className="flex-1 rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90 disabled:opacity-50 sm:flex-none sm:px-8"
              >
                {phase === 'crawling' || phase === 'checking'
                  ? 'Checking...'
                  : 'Find Broken Links'}
              </button>
              {(phase === 'crawling' || phase === 'checking') && (
                <button
                  onClick={stopRun}
                  className="rounded-xl border border-red-400/30 bg-red-400/[0.06] px-6 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-red-200 transition-colors hover:border-red-400/50"
                >
                  Stop
                </button>
              )}
            </div>

            {(phase === 'crawling' || phase === 'checking') && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-white/75" aria-live="polite">
                  {progressText}
                </p>
                {phase === 'checking' && totalLinks > 0 && (
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm leading-relaxed text-red-300">
                <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {phase === 'done' && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] px-4 py-3 text-sm leading-relaxed text-emerald-300">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  {progressText ||
                    `Check complete. ${brokenCount} broken link${brokenCount === 1 ? '' : 's'} found.`}
                </span>
              </div>
            )}
          </div>
        </section>

        {rows.length > 0 && (
          <section className="mt-12">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
                  Pages crawled
                </p>
                <p className="mt-2 text-3xl font-black text-white">{crawledCount}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
                  Unique links found
                </p>
                <p className="mt-2 text-3xl font-black text-white">{totalLinks}</p>
              </div>
              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">
                  Broken links
                </p>
                <p className="mt-2 text-3xl font-black text-white">{brokenCount}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['all', 'All links'],
                    ['broken', 'Broken only'],
                    ['internal', 'Internal'],
                    ['external', 'External'],
                  ] as [Filter, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-xl border px-4 py-2.5 text-xs font-black transition-colors ${
                      filter === value
                        ? 'border-primary/50 bg-primary/[0.1] text-primary'
                        : 'border-white/15 bg-black/20 text-white/75 hover:border-primary/35'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
              >
                <Download size={14} />
                Download CSV
              </button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
              <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                    <th className="px-4 py-2">Link URL</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Found on</th>
                    <th className="px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={row.url} className="bg-black/20 text-sm text-white/85">
                      <td className="max-w-[300px] break-all rounded-l-xl px-4 py-4 font-mono text-xs text-white/90">
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-primary"
                        >
                          {row.url}
                        </a>
                        {row.checked && row.error && (
                          <span className="mt-1 block font-sans text-[11px] text-red-300">
                            {row.error}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">{statusBadge(row)}</td>
                      <td className="max-w-[260px] break-all px-4 py-4 font-mono text-xs text-white/70">
                        {row.sources[0] || ''}
                        {row.sources.length > 1 && (
                          <span className="mt-1 block font-sans text-[11px] font-bold text-primary">
                            +{row.sources.length - 1} more
                          </span>
                        )}
                      </td>
                      <td className="rounded-r-xl px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${
                            row.internal
                              ? 'border-blue-400/25 bg-blue-400/[0.1] text-blue-200'
                              : 'border-white/15 bg-white/[0.05] text-white/60'
                          }`}
                        >
                          {row.internal ? 'Internal' : 'External'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleRows.length === 0 && (
                <p className="py-6 text-center text-sm text-white/60">
                  No links match this filter.
                </p>
              )}
              {rows.length > visibleRows.length && filter === 'all' && (
                <p className="mt-2 text-center text-xs text-white/50">
                  Showing the first 500 links. Download the CSV for the full list.
                </p>
              )}
            </div>
          </section>
        )}

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            How To Use This Tool
          </p>
          <h2 className="mt-3 text-center text-3xl font-black text-white">
            Three Steps To A Clean Link Report
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">1</p>
              <h3 className="mt-4 text-xl font-black text-white">Enter your site</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Paste your homepage address above and press Find Broken Links. The checker
                loads that page first, then follows internal links to crawl up to 25 pages of
                the same domain.
              </p>
            </article>
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">2</p>
              <h3 className="mt-4 text-xl font-black text-white">We test every link</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Every unique link collected during the crawl, internal and external, is tested
                in small batches. You watch progress live and can stop at any time without
                losing the results already gathered.
              </p>
            </article>
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">3</p>
              <h3 className="mt-4 text-xl font-black text-white">Fix from the report</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Filter to broken links only, see exactly which page each dead link sits on,
                then update it, redirect the moved page, or remove the link. Download the CSV
                to work through fixes with your team.
              </p>
            </article>
          </div>
        </section>

        <BulkBrokenLinkCheckerArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {CHECKER_FAQS.map((f, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-sm font-bold text-white/85">{f.q}</span>
                  <span className="shrink-0 text-lg text-primary">{openFaq === i ? '-' : '+'}</span>
                </button>
                {openFaq === i && (
                  <p className="pb-4 pr-8 text-sm leading-relaxed text-white/60">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">Related free tools</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { href: '/tools/bulk-http-status-checker', name: 'Bulk HTTP Status Checker' },
                { href: '/tools/bulk-redirect-generator', name: 'Bulk Redirect Generator' },
                { href: '/tools/xml-sitemap-generator', name: 'XML Sitemap Generator' },
                { href: '/tools/robots-txt-generator', name: 'Robots.txt Generator' },
              ].map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
                >
                  {t.name} <span className="text-primary">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-6 text-center sm:p-8">
            <h2 className="text-2xl font-black text-white">Dead Ends Are Only The First Problem We Find</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Fixing the links in this report is a solid start. RankVelt audits go further:
              crawl structure, internal linking, page speed, and the technical issues that hold
              rankings down. Get a free SEO audit and we will show you the gaps first.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/strategy-call"
                className="rounded-xl bg-primary px-6 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
              >
                Get a Free SEO Audit
              </a>
              <a
                href="/tools"
                className="rounded-xl border border-white/15 px-6 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:border-primary/50"
              >
                Browse All Tools
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ==================== SEO ARTICLE ==================== */
function BulkBrokenLinkCheckerArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">WHY IT MATTERS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">The Real Cost of Broken Links on Your Website</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Every website collects dead links over time. A product is discontinued, a blog post is renamed, a partner site restructures, and a link that worked last year quietly stops working. For a visitor, the cost is immediate: they clicked something you recommended and landed on an error page. That dead end interrupts whatever they were about to do, reading your guide, comparing your products, or filling in your contact form, and it tells a first-time visitor that this site is not looked after.</p>
          <p>The search side compounds the problem. Crawlers navigate your site by following links, so every internal link that points at a missing page spends crawl budget on a dead end instead of on the pages you actually want indexed and refreshed. Just as important, the authority that page was supposed to pass never arrives: an internal link is a vote for a specific destination, and a vote cast for a 404 reaches nobody. Enough of those leaks and the pages you care about are quietly under-supported by your own site.</p>
          <p>Google has said for years that some 404 responses are normal and do not damage a site by themselves. The real issue starts when your own pages keep linking to those missing URLs, because then you are spending your crawl resources and your visitors' patience on links you control. That is exactly what a bulk broken link checker is for: finding every dead link you own the source of, so the fix is entirely in your hands.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">TRIAGE</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Internal vs External Broken Links: Where to Start</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>When the report lands, resist the urge to work through it top to bottom. Internal broken links come first: links from your own pages to other pages on your site that no longer exist. They are fully within your control, they waste your own crawl budget, and they break paths that were supposed to move visitors toward products, services, and contact pages. A renamed category or a deleted product line can create hundreds of them at once through your navigation and templates alone.</p>
          <p>External broken links, the ones pointing out to other websites, matter for a different reason. They do not waste your crawl budget, since the wasted request happens on someone else's server, but a reader who clicks your citation and hits a dead page learns not to trust the rest of the page. Older articles are the usual suspects: sources get moved, restructured, or taken offline as the years pass, a process often called link rot. Work through external breaks on your most-read pages first, where the trust damage is largest, then sweep the archives as time allows.</p>
          <p>There is a third bucket this checker cannot see: pages on other sites linking to dead pages on yours. A crawl of your own site cannot discover links that live elsewhere, and those are some of the most valuable breaks to fix, because outside sites already voted for those URLs. Use the Links report in Google Search Console to find dead pages of yours that still carry backlinks, then redirect each one to its closest living equivalent.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">THE WORKFLOW</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to Fix Broken Links, Step by Step</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A website broken link checker gives you the list. The fix that follows depends on why each link died, and there are only four outcomes worth using. Diagnose each one before you touch it, because the wrong fix, like redirecting everything to your homepage, converts a small problem into a soft 404 that Google largely ignores.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Update the link when the destination moved and you know the new address. This is the cleanest fix: edit the source page so the link points at the live URL and no redirect is involved.</li>
            <li>Redirect when the old URL is yours and other pages or sites still link to it. Point it at the closest matching live page, one hop, and leave the redirect in place long term.</li>
            <li>Replace dead external resources with an equivalent. Check whether the same site hosts the material under a new address, look for an archived copy, or link to a better source that says the same thing well.</li>
            <li>Remove the link when nothing suitable exists. Adjust the surrounding sentence so the text still reads naturally, rather than leaving a dangling reference to a source that is gone.</li>
          </ul>
          <p>Work in priority order: internal links on high-traffic pages first, then internal links elsewhere, then external links ordered by how much traffic the source page gets. A dead link buried in a five-year-old post costs you far less than one in your main navigation or your best converting article, so spend your effort where visitors actually travel.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">AFTER A REDESIGN</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Checking Links After Migrations and Redesigns</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Broken links are introduced by change far more than by slow decay. A redesign renames your services section, a CMS migration rewrites every blog URL, a category restructure deletes a path that forty articles used to link to. Each of those events can create more broken links in one afternoon than a year of link rot, and the damage lands exactly when your team is busiest shipping the new site.</p>
          <p>The discipline is to check at two fixed moments. Before launch, crawl the staging version and compare its URL inventory against the live site's, so every old address has a planned destination: a live page, or a deliberate redirect written before go-live rather than after the 404 reports arrive. A bulk 404 checker run over the old URL list the day you launch then confirms each one resolves the way the plan said it would.</p>
          <p>After launch, run this checker on day one and again a week later. The first pass catches configuration mistakes while they are cheap, and the second catches the links your own team added back by habit, old bookmarks, copied templates, and CMS fields that silently kept pointing at the previous URL structure. Treat those two runs as part of the migration itself, not as optional SEO housekeeping.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">THE ROUTINE</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">A Monthly Routine That Keeps Your Site Clean</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Link checking works best as a habit rather than a rescue mission. For an actively edited site, a monthly pass is the right cadence: frequent enough that lists stay short, rare enough that it does not become a chore nobody owns. Put it on the same calendar slot as your other maintenance, and keep the routine identical each time so nothing depends on memory.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Run the full check from your homepage and download the CSV so you have a dated record.</li>
            <li>Sort the broken results internal first, and fix those the same day while the list is in front of you.</li>
            <li>Work through external breaks on your highest-traffic pages, then archive pages as time allows.</li>
            <li>Note what changed in a simple log: the date, the pages you edited, and anything you redirected.</li>
            <li>Spot-check the pages you edited to confirm the new links resolve, and note any 403 results that turned out to be bot protection rather than dead pages.</li>
          </ul>
          <p>The log sounds like overhead until the first regression arrives. When a template edit or a deleted category suddenly creates a cluster of new breaks, a short history tells you exactly when it started and what shipped that week, which turns a vague mystery into a five-minute diagnosis.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">OUTREACH</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Broken Link Building: The Honest Version</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A website broken link checker is mostly a maintenance tool, but it has one legitimate outreach use. When you find a respected page in your niche linking out to a resource that has died, the site owner usually wants to know: the dead link hurts their page too. If you have genuinely published something that covers the same ground at least as well, telling them about the break and mentioning your page as one possible replacement is a fair trade of information, not a trick.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Find relevant pages that link out heavily, resource lists and in-depth guides in your niche, and run them through this checker as starting URLs.</li>
            <li>Confirm each candidate link is truly dead in your own browser, since some 403 results are just bot protection.</li>
            <li>Only suggest your page where it honestly fits the sentence the dead link was supporting.</li>
            <li>Keep the email short: name the page, name the dead link, offer your replacement, and stop.</li>
            <li>Follow up once at most, then let it go.</li>
          </ul>
          <p>Set your expectations honestly before you start. Most outreach emails get no reply, and a page that updates its link will rarely tell you it happened. Treat broken link building as a slow background tactic that occasionally earns a relevant link while you fix your own site, never as a guaranteed pipeline, and never buy links from anyone who promises you one. The maintenance value of finding broken links is certain; the outreach value is a bonus that shows up only sometimes.</p>
        </div>
      </section>
    </>
  );
}
