// RankVelt tool page: Website Speed Test (free, tests any public URL)
// Place at: src/pages/tools/WebsiteSpeedTest.tsx
// Styled to match the RankVelt dark theme (same shell as SslChecker.tsx).

import { useEffect, useState } from 'react';
import { Sparkles, Gauge, Timer, Smartphone, Monitor } from 'lucide-react';

const SPEED_FAQS = [
  {
    q: 'How much does this website speed test cost?',
    a: 'The test is free. Enter any public URL, choose mobile or desktop, and you get a full performance report with a performance score, lab metrics, and a list of improvement opportunities. There is no account to create and no limit built into the page, although very heavy use may hit Google\'s own rate limits upstream.',
  },
  {
    q: 'How often should I test my website speed?',
    a: 'Test after every meaningful change: a redesign, a theme update, a new plugin, a new ad or chat script, or a hosting move. Outside of changes, a monthly check on your homepage and your top landing pages is a healthy habit. Speed drifts slowly as pages collect scripts, images, and embeds, so a regular check catches the drift before visitors do.',
  },
  {
    q: 'Should I test mobile or desktop speed?',
    a: 'Test mobile first, because that is how most visitors arrive and because Google evaluates your pages using mobile performance. Mobile tests use a slower processor and a throttled connection, so mobile scores are almost always lower than desktop scores for the same page. Run the desktop test as a second view, but make decisions based on the mobile result.',
  },
  {
    q: 'What is a good website speed score?',
    a: 'A performance score of 90 or above is generally a healthy place to be, 50 to 89 means there is real room to improve, and below 50 usually points to problems visitors can feel. Treat the score as a summary, not a verdict: read the individual metrics underneath it, especially Largest Contentful Paint and Cumulative Layout Shift, because one bad metric can hide behind a decent average.',
  },
  {
    q: 'Does website speed affect Google rankings?',
    a: 'Yes, but with honest limits. Core Web Vitals are part of Google\'s page experience signals, so a page that is slow for real visitors can be held back, especially when competing pages are similar in relevance. Speed will not rescue weak content, though. A fast page with the wrong answer still loses to a relevant page. Think of speed as removing a handicap, not as a ranking shortcut.',
  },
  {
    q: 'Why does my score change every time I run the test?',
    a: 'No two page loads are identical. Server response times vary, third party scripts load in different orders, ad auctions fill differently, and the simulated network in a lab test is an average rather than your exact conditions. A swing of a few points between runs is normal. Judge your speed by the pattern across several runs and by field data from real visitors, not by a single test.',
  },
  {
    q: 'My score is low. What should I fix first?',
    a: 'Fix in this order: oversized images, slow server response, then heavy or blocking scripts. Images are usually the largest win, because resizing and compressing them cuts download time on every visit. After that, check what your server and host are doing, then audit third party scripts and embeds. The opportunities list in your report is ordered by estimated savings, so work from the top of that list down.',
  },
  {
    q: 'How is this different from PageSpeed Insights?',
    a: 'Under the hood it is the same Google technology. This tool runs Google\'s Lighthouse engine through the PageSpeed Insights API and presents the results in a simpler report on RankVelt. PageSpeed Insights itself offers more technical depth for developers. If you run both, use the same device strategy, or the scores will not be comparable, because mobile and desktop tests measure different conditions.',
  },
];

const inputCls =
  'mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50';

const labelCls =
  'block text-[11px] font-black uppercase tracking-[0.18em] text-white/50';

type LabMetric = {
  title: string;
  displayValue: string;
  numericValue: number;
  score: number | null;
} | null;

type FieldMetric = {
  percentile: number;
  category: string;
} | null;

type FieldData = {
  overallCategory: string;
  lcp: FieldMetric;
  cls: FieldMetric;
  inp: FieldMetric;
  fcp: FieldMetric;
} | null;

type Opportunity = {
  title: string;
  savingsMs: number;
  displayValue: string;
};

type SpeedResult = {
  ok: true;
  testedUrl: string;
  finalUrl: string;
  strategy: string;
  score: number | null;
  lab: {
    lcp: LabMetric;
    cls: LabMetric;
    tbt: LabMetric;
    fcp: LabMetric;
    speedIndex: LabMetric;
  };
  field: FieldData;
  opportunities: Opportunity[];
  fetchTime: string;
};

function normalizeUrl(input: string): string | null {
  let value = input.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }
  try {
    const url = new URL(value);
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function scoreBand(score: number | null): { label: string; cls: string; textCls: string } {
  if (score === null) {
    return {
      label: 'No score returned',
      cls: 'border-white/15 bg-white/[0.05]',
      textCls: 'text-white/70',
    };
  }
  if (score >= 90) {
    return {
      label: 'Good',
      cls: 'border-emerald-500/40 bg-emerald-500/[0.08]',
      textCls: 'text-emerald-300',
    };
  }
  if (score >= 50) {
    return {
      label: 'Needs improvement',
      cls: 'border-amber-400/40 bg-amber-400/[0.08]',
      textCls: 'text-amber-300',
    };
  }
  return {
    label: 'Poor',
    cls: 'border-red-500/40 bg-red-500/[0.08]',
    textCls: 'text-red-300',
  };
}

type MetricStatus = 'good' | 'warn' | 'bad' | 'na';

function metricStatus(
  key: 'lcp' | 'cls' | 'tbt' | 'fcp' | 'speedIndex',
  metric: LabMetric,
): MetricStatus {
  if (!metric || typeof metric.numericValue !== 'number') return 'na';
  const value = metric.numericValue;
  if (key === 'lcp') return value <= 2500 ? 'good' : value <= 4000 ? 'warn' : 'bad';
  if (key === 'cls') return value <= 0.1 ? 'good' : value <= 0.25 ? 'warn' : 'bad';
  if (key === 'tbt') return value <= 200 ? 'good' : value <= 600 ? 'warn' : 'bad';
  if (key === 'fcp') return value <= 1800 ? 'good' : value <= 3000 ? 'warn' : 'bad';
  return value <= 3400 ? 'good' : value <= 5800 ? 'warn' : 'bad';
}

const statusStyles: Record<MetricStatus, { dot: string; text: string; label: string }> = {
  good: { dot: 'bg-emerald-400', text: 'text-emerald-300', label: 'Good' },
  warn: { dot: 'bg-amber-400', text: 'text-amber-300', label: 'Needs work' },
  bad: { dot: 'bg-red-400', text: 'text-red-300', label: 'Poor' },
  na: { dot: 'bg-white/30', text: 'text-white/50', label: 'No data' },
};

const labMetricMeta: {
  key: 'lcp' | 'cls' | 'tbt' | 'fcp' | 'speedIndex';
  name: string;
  hint: string;
}[] = [
  { key: 'lcp', name: 'Largest Contentful Paint', hint: 'Main content visible. Good is 2.5 seconds or under.' },
  { key: 'fcp', name: 'First Contentful Paint', hint: 'First text or image appears. Good is 1.8 seconds or under.' },
  { key: 'speedIndex', name: 'Speed Index', hint: 'How quickly the page visually fills in. Good is 3.4 seconds or under.' },
  { key: 'tbt', name: 'Total Blocking Time', hint: 'Main thread blocked by scripts. Good is 200 milliseconds or under.' },
  { key: 'cls', name: 'Cumulative Layout Shift', hint: 'Content jumping around as the page loads. Good is 0.1 or under.' },
];

function fieldMetricValue(kind: 'time' | 'cls', metric: FieldMetric): string {
  if (!metric) return 'No data';
  if (kind === 'cls') return metric.percentile.toFixed(2);
  const ms = metric.percentile;
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${Math.round(ms)} ms`;
}

function fieldCategoryCls(category: string): string {
  const value = (category || '').toUpperCase();
  if (value === 'FAST') return 'text-emerald-300';
  if (value === 'AVERAGE') return 'text-amber-300';
  if (value === 'SLOW') return 'text-red-300';
  return 'text-white/60';
}

function formatSavings(ms: number): string {
  if (!ms || ms <= 0) return '';
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${Math.round(ms)} ms`;
}

function formatFetchTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function WebsiteSpeedTest() {
  const [urlInput, setUrlInput] = useState('');
  const [busy, setBusy] = useState<null | 'mobile' | 'desktop'>(null);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQPage JSON-LD built from the same FAQ array rendered below.
  // RouteSeoManager owns the page title and meta tags.
  useEffect(() => {
    document.getElementById('rankvelt-website-speed-test-schema')?.remove();
    const schemaScript = document.createElement('script');
    schemaScript.id = 'rankvelt-website-speed-test-schema';
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: SPEED_FAQS.map((faq) => ({
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

  async function runTest(raw: string, strategy: 'mobile' | 'desktop') {
    const url = normalizeUrl(raw);
    if (!url) {
      setResult(null);
      setError('Please enter a valid website URL, for example https://rankvelt.com.');
      return;
    }
    setBusy(strategy);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/speed-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, strategy }),
      });
      const data = await res.json();
      if (data && data.ok) {
        setResult(data as SpeedResult);
      } else {
        setError((data && data.error) || 'The speed test returned an unexpected result. Please try again.');
      }
    } catch {
      setError('The speed test could not be completed. Please check your connection and try again.');
    } finally {
      setBusy(null);
    }
  }

  const band = result ? scoreBand(result.score) : null;

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.08] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <section className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free RankVelt Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Website <span className="text-gradient-gold">Speed Test</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            Enter any page URL to measure how fast it loads and how stable it feels. You get a
            performance score, the core lab metrics behind it, real visitor data where Google
            has it, and a prioritized list of what to fix first.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Gauge size={20} />
              </span>
              <h2 className="text-xl font-black text-white">Test a page</h2>
            </div>

            <div className="mt-6">
              <label className={labelCls}>Website URL</label>
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runTest(urlInput, 'mobile');
                }}
                placeholder="https://rankvelt.com"
                className={inputCls}
              />
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                Test a specific page, not just the homepage. Product pages, landing pages, and
                checkout pages are where speed usually costs the most.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => runTest(urlInput, 'mobile')}
                disabled={busy !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Smartphone size={17} />
                {busy === 'mobile' ? 'Testing...' : 'Test Mobile'}
              </button>
              <button
                onClick={() => runTest(urlInput, 'desktop')}
                disabled={busy !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:border-primary/50 disabled:opacity-50"
              >
                <Monitor size={17} />
                {busy === 'desktop' ? 'Testing...' : 'Test Desktop'}
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white/40">
              A full test can take up to about a minute. Try an example:{' '}
              <button
                type="button"
                onClick={() => {
                  setUrlInput('rankvelt.com');
                  runTest('rankvelt.com', 'mobile');
                }}
                className="font-bold text-primary hover:underline"
              >
                rankvelt.com (mobile)
              </button>
            </p>

            {busy !== null && (
              <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm leading-relaxed text-white/60">
                Running the {busy} test now. Google loads the page, records the timings, and
                builds your report. This usually takes under a minute.
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm leading-relaxed text-red-300">
                {error}
              </div>
            )}

            {result && band && (
              <div className="mt-6">
                <div
                  className={`flex flex-col items-center gap-4 rounded-xl border px-4 py-6 text-center ${band.cls}`}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                    Performance score ({result.strategy})
                  </p>
                  <p className={`text-6xl font-black leading-none ${band.textCls}`}>
                    {result.score === null ? 'N/A' : result.score}
                  </p>
                  <p className={`text-sm font-black uppercase tracking-[0.18em] ${band.textCls}`}>
                    {band.label}
                  </p>
                  <p className="max-w-xl text-xs leading-relaxed text-white/50">
                    Tested URL: {result.finalUrl || result.testedUrl}
                    <br />
                    Tested on {formatFetchTime(result.fetchTime)}. Scores from 90 to 100 are
                    good, 50 to 89 need improvement, and below 50 is poor.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {labMetricMeta.map((meta) => {
                    const metric = result.lab[meta.key];
                    const status = metricStatus(meta.key, metric);
                    const style = statusStyles[status];
                    return (
                      <div
                        key={meta.key}
                        className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                            {meta.name}
                          </p>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${style.text}`}>
                            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                            {style.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xl font-black text-white/90">
                          {metric ? metric.displayValue : 'No data'}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-white/45">{meta.hint}</p>
                      </div>
                    );
                  })}
                </div>

                {result.field ? (
                  <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                        Real visitor data (field data)
                      </p>
                      <p className={`text-sm font-black ${fieldCategoryCls(result.field.overallCategory)}`}>
                        Overall: {result.field.overallCategory || 'Not rated'}
                      </p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-white/45">
                      This section is different from the lab test above. It comes from real
                      Chrome visitors to this page, collected over the past 28 days. These are
                      observed values from actual devices and networks, not a simulation.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                      {(
                        [
                          { name: 'Largest Contentful Paint', value: fieldMetricValue('time', result.field.lcp), category: result.field.lcp?.category },
                          { name: 'Cumulative Layout Shift', value: fieldMetricValue('cls', result.field.cls), category: result.field.cls?.category },
                          { name: 'Interaction to Next Paint', value: fieldMetricValue('time', result.field.inp), category: result.field.inp?.category },
                          { name: 'First Contentful Paint', value: fieldMetricValue('time', result.field.fcp), category: result.field.fcp?.category },
                        ] as const
                      ).map((item) => (
                        <div key={item.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                            {item.name}
                          </p>
                          <p className="mt-1 text-base font-black text-white/85">{item.value}</p>
                          <p className={`text-xs font-bold ${fieldCategoryCls(item.category || '')}`}>
                            {item.category || 'No rating'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-xs leading-relaxed text-white/50">
                      No real visitor data is available for this page yet. Google only publishes
                      field data for pages that receive enough Chrome traffic, so newer or
                      low-traffic pages show lab results only. That is normal, not an error.
                    </p>
                  </div>
                )}

                {result.opportunities.length > 0 && (
                  <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                      Fix first: biggest estimated savings
                    </p>
                    <div className="mt-3 space-y-3">
                      {result.opportunities.map((opp, i) => (
                        <div
                          key={`${opp.title}-${i}`}
                          className="flex items-start justify-between gap-4 border-b border-white/[0.05] pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-bold text-white/85">{opp.title}</p>
                            {opp.displayValue && (
                              <p className="mt-0.5 text-xs leading-relaxed text-white/45">
                                {opp.displayValue}
                              </p>
                            )}
                          </div>
                          {opp.savingsMs > 0 && (
                            <span className="shrink-0 rounded-lg border border-primary/25 bg-primary/[0.07] px-2.5 py-1 text-xs font-black text-primary">
                              Save {formatSavings(opp.savingsMs)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-white/40">
                      Savings are estimates from the lab test. Fix them in order, then run the
                      test again to confirm the improvement.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Timer size={20} />
              </span>
              <h2 className="text-xl font-black text-white">How it works</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>Enter the full URL of the page you want to test. Your homepage, a product page, or a landing page all work.</li>
              <li>Google's Lighthouse engine loads the page on a simulated mobile or desktop setup, records how it renders, and scores the result from 0 to 100.</li>
              <li>Where Google has enough real visitor data for the page, that field data appears next to the lab result, along with a prioritized list of fixes.</li>
            </ol>
          </div>
        </section>
      <WebsiteSpeedTestArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {SPEED_FAQS.map((f, i) => (
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
                { href: '/tools/ssl-checker', name: 'SSL Checker' },
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
            <h2 className="text-2xl font-black text-white">Slow Pages Quietly Costing You Customers?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              A speed test shows you the problem. Fixing it takes technical work across images,
              scripts, hosting, and templates. RankVelt audits the full technical picture and
              fixes the faults in priority order. Get a free SEO audit and we will show you the
              gaps first.
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
function WebsiteSpeedTestArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">THE LOADING METER</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What a Website Speed Test Actually Measures</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A website speed test loads your page the way a visitor's browser does, and writes down what happens, millisecond by millisecond. It records when the first text or image appears, when the main content becomes visible, how long the page keeps shifting around as pieces load, and how long the browser's main thread stays too busy to react to a tap or a click. Those raw timings are then combined into a performance score from 0 to 100.</p>
          <p>This tool runs that test with Lighthouse, Google's open source auditing engine, on a simulated device and network. The simulation is deliberate: everyone who runs the same test gets roughly the same conditions, which makes results comparable between pages and between runs. What you receive is a diagnosis, not a grade for your whole website. It covers one page, one load, under one set of conditions. That is exactly why it is useful: change something, run the test again, and you can see whether the change helped.</p>
          <p>A good way to use the test is to stop thinking of it as a verdict and start treating it as a checklist generator. The score tells you whether a problem exists, the metrics tell you what kind of problem it is, and the opportunities list tells you where the largest wins are hiding. Test your homepage first for a baseline, then test the pages that actually make money: product pages, pricing pages, booking and checkout pages. Those are rarely the fastest pages on a site, and they are where a slow load quietly costs the most.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">CORE WEB VITALS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">LCP, CLS, and INP Explained in Plain Language</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Three of these timings matter most, and Google calls them the Core Web Vitals. Largest Contentful Paint, or LCP, measures how long it takes for the main content of the page, usually the headline, hero image, or main product image, to become visible. Under 2.5 seconds counts as good. Cumulative Layout Shift, or CLS, measures stability: if buttons, text, and banners jump around while the page loads, the score climbs, and anything above 0.1 needs attention. Interaction to Next Paint, or INP, measures responsiveness: tap a button, and INP is the delay before anything visibly happens. Under 200 milliseconds is the target.</p>
          <p>There is one subtlety worth understanding. INP can only be measured on real visits, because a lab test has nobody tapping. In the lab report above you will see Total Blocking Time, or TBT, instead. TBT measures how long scripts keep the main thread frozen during load, and a page with heavy blocking time will almost always feel sluggish when a real visitor interacts with it. Treat TBT as the lab stand-in for INP: if TBT is poor, real world responsiveness needs work even before field data proves it.</p>
          <p>The supporting metrics round out the picture. First Contentful Paint is the moment the first text or image appears, the point where a visitor stops staring at a blank screen. Speed Index measures how quickly the visible area fills in, which is often closer to how people judge speed than any single milestone. None of these numbers exists in isolation: a page can paint early and still feel broken if the layout keeps jumping. Reading them together is what turns a score into understanding.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">TWO LENSES</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Lab Data vs Field Data: Two Ways of Seeing Speed</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Every report has two possible lenses. Lab data is the test itself: controlled, repeatable, and available for any page at any time, including a page you have not published yet. Its weakness is that no simulation matches your real audience. Your visitors use cheaper phones, faster phones, hotel wifi, and congested mobile networks, often at the same moment your server is under load from everyone else.</p>
          <p>Field data is the other lens. Google collects anonymized timing data from real Chrome users and publishes it for pages that get enough traffic, covering a rolling window of the past 28 days. That is the data shown in the field section of your report, and it is the version Google uses when it evaluates page experience for rankings. The two lenses work together: field data tells you whether real visitors have a problem, and lab data tells you why, because only the lab shows you which script, image, or request is responsible.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">READING THE SCORE</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What a Good Score Means, and What It Does Not</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A score of 90 or above means the page loaded quickly and stably under the test conditions, and that is genuinely worth having. But the score is a weighted blend of several metrics, which means one weak area can hide behind strong ones. A page can score well while its layout still shifts badly, or while real visitors on slower phones struggle. Always read the individual metrics under the headline number before you celebrate or panic.</p>
          <p>The score also depends on choices you control here: the mobile test simulates a mid range phone on a throttled connection, so it will nearly always score lower than the desktop test for the same page. Neither is the true score. They are two views of the same page under different conditions. And a perfect 100 is not a finish line. It says nothing about whether the content answers the visitor's question, whether the page works on assistive technology, or whether your checkout is trustworthy. Speed removes friction. It does not create value by itself.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">THE USUAL SUSPECTS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">The Most Common Causes of Slow Pages</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Most slow pages are slow for ordinary reasons. The biggest is images: photos uploaded at full camera resolution, displayed at a fraction of their size, in formats heavier than they need to be. Next come scripts. Every chat widget, analytics tag, ad network, heatmap, and social embed adds weight and competes for the browser's attention, and pages quietly accumulate them over years. Render blocking stylesheets and scripts in the head of the page delay the first paint, because the browser refuses to show anything until they arrive.</p>
          <p>The server itself is the other half of the story. If the host is slow to respond, every other optimization waits behind it, because nothing can render before the first byte arrives. Add unoptimized web fonts that block text, long redirect chains, no browser caching, and no image compression, and you have the standard picture: not one dramatic fault, but ten small taxes on every visit. The opportunities list in your report is valuable precisely because it names the specific taxes your page is paying.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FIX IN ORDER</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Fixing Speed in Priority Order</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Work in the order the report suggests, largest savings first. Start with images: resize them to the size they are actually displayed, compress them, use modern formats such as WebP, and lazy load anything below the first screen. This single step is usually responsible for the largest improvement, because images dominate the weight of most pages. Next, check server response: a faster host, full page caching, and a content delivery network for distant visitors all shrink the wait before rendering even begins.</p>
          <p>Then deal with scripts and styles. Remove tags nobody uses anymore, defer scripts that do not need to run immediately, and stop third party embeds from loading until the visitor interacts with them. Fonts come fourth: load only the weights you actually use, and let text appear in a fallback font while the web font downloads instead of staying invisible. If working through that list yourself sounds like a second job, that is exactly the kind of technical cleanup RankVelt handles inside a free SEO audit, where your speed faults are listed alongside indexing and content issues in one prioritized plan.</p>
          <p>Finally, verify instead of assuming. After each fix, run this test again on the same device setting and compare the metric you targeted. Change one thing at a time where possible, because batching five fixes into one deploy makes it impossible to know which one worked. Keep a simple record of the date, the change, and the before and after numbers. A month later, that record is the difference between an opinion about your site's speed and evidence.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">SEO OR CONVERSION</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">When Speed Is an SEO Problem and When It Is a Conversion Problem</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Speed affects your business through two different doors. The SEO door is real but narrower than often claimed. Core Web Vitals are a ranking signal, so a page that fails them for real visitors can lose ground to similar pages that pass. But relevance still dominates: slow and relevant usually beats fast and irrelevant. Where speed becomes a hard SEO problem is at extremes, when pages are so slow that visitors abandon them and crawlers waste budget crawling a very large site.</p>
          <p>The conversion door is wider. Every extra second of waiting is a chance for a visitor to leave, compare a competitor, or abandon a checkout, and on mobile that patience is shortest. This is why the same report deserves two readings: check the field data to see if search visibility is at risk, and check the lab metrics to see where the buying journey leaks. One last honesty note: a single test run is a sample, not a measurement of your average day. Scores move a few points with server mood and third party scripts, so test after changes, compare like for like, and trust the trend over several runs.</p>
        </div>
      </section>
    </>
  );
}
