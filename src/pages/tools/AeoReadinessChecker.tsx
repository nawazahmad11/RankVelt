// RankVelt tool page: AEO Readiness Checker (free, scores any public page)
// Place at: src/pages/tools/AeoReadinessChecker.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).

import { useEffect, useState } from 'react';
import { Sparkles, Bot, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const AEO_FAQS = [
  {
    q: 'What is AEO (answer engine optimization)?',
    a: 'AEO is the practice of structuring your pages so AI answer engines, such as ChatGPT, Google AI Overviews, and Perplexity, can understand, trust, and cite them. Where SEO focuses on ranking in a list of links, AEO focuses on being the source an AI answer is built from. The two share the same foundations: crawlable pages, clear writing, and honest information. AEO adds answer-first structure, question-led headings, and machine readable data so your facts can be lifted and quoted accurately.',
  },
  {
    q: 'How is AEO different from SEO?',
    a: 'SEO aims to rank a page in search results so people click through. AEO aims to have the page used inside an AI generated answer, often with your brand named as the source. In practice the work overlaps heavily: both reward clear titles, logical headings, and useful content. The difference is emphasis. AEO puts the direct answer at the very top of the page, phrases headings the way people ask questions, and uses structured data to label facts for machines. A page can rank well and still be hard for an AI to quote, which is the gap AEO closes.',
  },
  {
    q: 'Can this checker guarantee my page will be cited by ChatGPT or AI Overviews?',
    a: 'No, and you should be careful with any tool or agency that promises otherwise. This checker measures readiness signals inside your page code: structure, answers, structured data, and clarity. It cannot see your brand mentions across the web, your competitors, or how each engine assembles answers on a given day. A high score means your page is easy to understand and quote. Citations also depend on off-site trust and the engine itself, which no on-page tool controls.',
  },
  {
    q: 'What is a good AEO readiness score?',
    a: 'As a rough guide, pages scoring 80 or above have the core signals in place: clear titles, one H1, an answer-first opening, structured data, and question-led sections. Scores between 50 and 79 usually mean the basics exist but one or two high impact items are missing, such as an FAQ section or structured data. Below 50, the page is hard for an answer engine to use and needs structural work first. Treat the score as a prioritized fix list, not a grade to chase for its own sake.',
  },
  {
    q: 'Does adding schema markup guarantee AI answers will use my page?',
    a: 'No. Structured data helps machines understand what a page is and connect it to your business, but it does not force any engine to cite you. Engines still choose sources based on clarity, relevance, and trust. Schema works best when it honestly describes content that is visible on the page, such as marking up real questions and answers with FAQPage data. Markup that describes things the page does not actually say is a spam signal and can backfire in regular search too.',
  },
  {
    q: 'How often should I check my pages for AEO readiness?',
    a: 'Check your most important pages after any significant rewrite, and re-check them every few months as part of normal site maintenance. AI answers change as engines update how they select sources, and your own pages change as you edit them. A quick pass with this checker after publishing a new service or location page takes a minute and catches missing titles, absent structured data, and thin content before they cost you visibility.',
  },
  {
    q: 'What should I fix first to improve my AEO readiness?',
    a: 'Start with the answer-first opening: add a short paragraph near the top that directly answers the main question the page exists for. Then convert your subheadings into the questions customers actually ask, and make sure each one is followed by a complete answer. After that, add honest structured data that matches the page, publish your prices and facts plainly, and expand thin pages until they genuinely cover the topic. Those steps improve the page for human readers at the same time.',
  },
  {
    q: 'Is AEO replacing SEO?',
    a: 'No. AI answer engines still rely on search indexes to find candidate sources, so the pages that rank and get crawled are the pages available to be cited. Weak SEO means the engine may never see your page at all. AEO is better understood as a layer on top of SEO: SEO earns the place in the index, AEO makes the page easy to quote once it is there. Businesses that abandon SEO fundamentals to chase AEO tactics usually end up weaker in both.',
  },
];

const inputCls =
  'mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50';

const labelCls =
  'block text-[11px] font-black uppercase tracking-[0.18em] text-white/50';

type CheckStatus = 'pass' | 'warn' | 'fail';

type CheckResult = {
  id: string;
  name: string;
  status: CheckStatus;
  weight: number;
  earned: number;
  detail: string;
};

type FetchResponse = {
  ok: boolean;
  finalUrl?: string;
  status?: number;
  html?: string;
  truncated?: boolean;
  error?: string;
};

type Analysis = {
  checks: CheckResult[];
  score: number;
  band: string;
  finalUrl: string;
  httpStatus: number | null;
  truncated: boolean;
};

const BONUS_SCHEMA_TYPES = [
  'FAQPage',
  'Article',
  'LocalBusiness',
  'Organization',
  'Product',
  'Service',
  'BreadcrumbList',
];

const QUESTION_STARTERS = [
  'what',
  'how',
  'why',
  'when',
  'which',
  'can',
  'do',
  'does',
  'is',
  'are',
];

function normalizeUrl(raw: string): string | null {
  let value = raw.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = 'https://' + value;
  try {
    const parsed = new URL(value);
    if (!parsed.hostname.includes('.')) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function wordCount(text: string): number {
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  return words.length === 1 && words[0] === '' ? 0 : words.length;
}

function isQuestionHeading(text: string): boolean {
  const clean = text.trim().toLowerCase();
  if (clean.endsWith('?')) return true;
  const first = clean.split(/\s+/)[0]?.replace(/[^a-z]/g, '') || '';
  return QUESTION_STARTERS.includes(first);
}

function collectSchemaTypes(node: unknown, into: Set<string>): void {
  if (Array.isArray(node)) {
    node.forEach((item) => collectSchemaTypes(item, into));
    return;
  }
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    const type = obj['@type'];
    if (typeof type === 'string') into.add(type);
    if (Array.isArray(type)) {
      type.forEach((t) => {
        if (typeof t === 'string') into.add(t);
      });
    }
    if (obj['@graph']) collectSchemaTypes(obj['@graph'], into);
  }
}

function makeCheck(
  id: string,
  name: string,
  status: CheckStatus,
  weight: number,
  detail: string,
): CheckResult {
  const earned = status === 'pass' ? weight : status === 'warn' ? Math.round(weight / 2) : 0;
  return { id, name, status, weight, earned, detail };
}

function analyzeHtml(html: string): CheckResult[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;
  const checks: CheckResult[] = [];

  // Structured data first, before scripts are stripped for text checks.
  const schemaTypes = new Set<string>();
  let jsonLdRaw = '';
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    const text = script.textContent || '';
    jsonLdRaw += text + '\n';
    try {
      collectSchemaTypes(JSON.parse(text), schemaTypes);
    } catch {
      // Invalid JSON-LD is ignored here; validity is a separate audit.
    }
  });

  // Clean clone for visible text measurement.
  const clone = body.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll('script, style, noscript, template, iframe, svg')
    .forEach((el) => el.remove());
  const visibleText = clone.textContent || '';
  const totalWords = wordCount(visibleText);

  // 1. Title tag
  const title = (doc.title || '').trim();
  if (!title) {
    checks.push(makeCheck('title', 'Title tag', 'fail', 10, 'No title tag found on the page.'));
  } else if (title.length >= 30 && title.length <= 65) {
    checks.push(
      makeCheck('title', 'Title tag', 'pass', 10, `"${title}" (${title.length} characters)`),
    );
  } else {
    checks.push(
      makeCheck(
        'title',
        'Title tag',
        'warn',
        10,
        `"${title}" is ${title.length} characters. Aim for 30 to 65 so the topic stays clear in results.`,
      ),
    );
  }

  // 2. Meta description
  const metaDesc = (
    doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  ).trim();
  if (!metaDesc) {
    checks.push(
      makeCheck('meta', 'Meta description', 'fail', 8, 'No meta description found.'),
    );
  } else if (metaDesc.length < 50) {
    checks.push(
      makeCheck(
        'meta',
        'Meta description',
        'warn',
        8,
        `Present but only ${metaDesc.length} characters. A fuller summary helps engines frame the page.`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'meta',
        'Meta description',
        'pass',
        8,
        `Present, ${metaDesc.length} characters: "${metaDesc.slice(0, 110)}${metaDesc.length > 110 ? '...' : ''}"`,
      ),
    );
  }

  // 3. Exactly one H1
  const h1s = Array.from(doc.querySelectorAll('h1'));
  if (h1s.length === 1) {
    checks.push(
      makeCheck(
        'h1',
        'Single H1',
        'pass',
        8,
        `One H1 found: "${(h1s[0].textContent || '').trim().slice(0, 90)}"`,
      ),
    );
  } else if (h1s.length === 0) {
    checks.push(makeCheck('h1', 'Single H1', 'fail', 8, 'No H1 heading found on the page.'));
  } else {
    checks.push(
      makeCheck(
        'h1',
        'Single H1',
        'warn',
        8,
        `${h1s.length} H1 headings found. One clear H1 states the page topic unambiguously.`,
      ),
    );
  }

  // 4. Heading structure
  const subHeadings = Array.from(doc.querySelectorAll('h2, h3'));
  const questionSubCount = subHeadings.filter((h) =>
    isQuestionHeading(h.textContent || ''),
  ).length;
  const hasEnoughSubs = subHeadings.length >= 3;
  const hasQuestion = questionSubCount >= 1;
  if (hasEnoughSubs && hasQuestion) {
    checks.push(
      makeCheck(
        'headings',
        'Heading structure',
        'pass',
        10,
        `${subHeadings.length} subheadings, ${questionSubCount} phrased as questions.`,
      ),
    );
  } else if (hasEnoughSubs || hasQuestion) {
    checks.push(
      makeCheck(
        'headings',
        'Heading structure',
        'warn',
        10,
        `${subHeadings.length} subheadings, ${questionSubCount} phrased as questions. Aim for at least 3 subheadings and at least one question-led heading.`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'headings',
        'Heading structure',
        'fail',
        10,
        `Only ${subHeadings.length} subheadings and none phrased as questions. Engines map questions to headings, so structure matters.`,
      ),
    );
  }

  // 5. Answer-ready opening: a 40 to 120 word paragraph before the first H2
  const flow = Array.from(body.querySelectorAll('p, h2'));
  const openingParas: number[] = [];
  for (const el of flow) {
    if (el.tagName === 'H2') break;
    if (el.tagName === 'P') openingParas.push(wordCount(el.textContent || ''));
  }
  const goodOpening = openingParas.find((w) => w >= 40 && w <= 120);
  if (goodOpening !== undefined) {
    checks.push(
      makeCheck(
        'opening',
        'Answer-ready opening',
        'pass',
        14,
        `A ${goodOpening} word paragraph appears before the first H2, ready to be lifted as a direct answer.`,
      ),
    );
  } else if (openingParas.length > 0) {
    checks.push(
      makeCheck(
        'opening',
        'Answer-ready opening',
        'warn',
        14,
        `Text appears before the first H2, but no paragraph falls in the 40 to 120 word answer range (found: ${openingParas.join(', ')} words).`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'opening',
        'Answer-ready opening',
        'fail',
        14,
        'No paragraph appears before the first H2. Add a short direct answer near the top of the page.',
      ),
    );
  }

  // 6. Structured data
  if (schemaTypes.size > 0) {
    const found = Array.from(schemaTypes);
    const bonus = BONUS_SCHEMA_TYPES.filter((t) => schemaTypes.has(t));
    checks.push(
      makeCheck(
        'schema',
        'Structured data (JSON-LD)',
        'pass',
        12,
        `Types found: ${found.join(', ')}${bonus.length > 0 ? `. High value types present: ${bonus.join(', ')}` : ''}.`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'schema',
        'Structured data (JSON-LD)',
        'fail',
        12,
        'No JSON-LD structured data found. Add honest markup such as Article, LocalBusiness, or FAQPage where it matches the page.',
      ),
    );
  }

  // 7. FAQ signals
  const questionHeadings = subHeadings.filter((h) =>
    (h.textContent || '').trim().endsWith('?'),
  ).length;
  const hasFaqSchema = schemaTypes.has('FAQPage');
  if (hasFaqSchema || questionHeadings >= 3) {
    checks.push(
      makeCheck(
        'faq',
        'FAQ signals',
        'pass',
        10,
        `${questionHeadings} question headings found${hasFaqSchema ? ', plus FAQPage structured data' : ''}.`,
      ),
    );
  } else if (questionHeadings >= 1) {
    checks.push(
      makeCheck(
        'faq',
        'FAQ signals',
        'warn',
        10,
        `Only ${questionHeadings} question heading${questionHeadings === 1 ? '' : 's'} found and no FAQPage data. A small FAQ section gives engines ready made answers.`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'faq',
        'FAQ signals',
        'warn',
        10,
        'No question headings or FAQPage data found. Pages that answer common questions directly are easier to cite.',
      ),
    );
  }

  // 8. Lists
  const lists = Array.from(doc.querySelectorAll('ul, ol')).filter(
    (list) => list.querySelectorAll('li').length >= 2,
  );
  if (lists.length > 0) {
    checks.push(
      makeCheck(
        'lists',
        'Lists for scannability',
        'pass',
        6,
        `${lists.length} list${lists.length === 1 ? '' : 's'} found. Lists make steps and facts easy to extract.`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'lists',
        'Lists for scannability',
        'fail',
        6,
        'No bullet or numbered lists found. Steps, inclusions, and comparisons are easier to quote as lists.',
      ),
    );
  }

  // 9. Canonical
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  if (canonical.trim()) {
    checks.push(makeCheck('canonical', 'Canonical link', 'pass', 6, canonical.trim()));
  } else {
    checks.push(
      makeCheck(
        'canonical',
        'Canonical link',
        'fail',
        6,
        'No canonical link found. A canonical tells engines which URL is the authoritative version.',
      ),
    );
  }

  // 10. Open Graph
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogDesc =
    doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
  if (ogTitle.trim() && ogDesc.trim()) {
    checks.push(
      makeCheck(
        'og',
        'Open Graph tags',
        'pass',
        6,
        'og:title and og:description are both present.',
      ),
    );
  } else if (ogTitle.trim() || ogDesc.trim()) {
    checks.push(
      makeCheck(
        'og',
        'Open Graph tags',
        'warn',
        6,
        `Only ${ogTitle.trim() ? 'og:title' : 'og:description'} is present. Add both so shared and surfaced versions of the page carry a clear summary.`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'og',
        'Open Graph tags',
        'fail',
        6,
        'No Open Graph title or description found.',
      ),
    );
  }

  // 11. Author and date signals (warn only)
  const authorSignals: string[] = [];
  if (doc.querySelector('meta[name="author"]')) authorSignals.push('author meta tag');
  if (/datePublished/i.test(jsonLdRaw)) authorSignals.push('datePublished in structured data');
  if (/"author"\s*:/i.test(jsonLdRaw)) authorSignals.push('author in structured data');
  if (doc.querySelector('time')) authorSignals.push('time element');
  if (authorSignals.length > 0) {
    checks.push(
      makeCheck(
        'author',
        'Author and date signals',
        'pass',
        4,
        `Found: ${authorSignals.join(', ')}. Freshness and authorship help engines judge trust.`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'author',
        'Author and date signals',
        'warn',
        4,
        'No author or date signals detected. Named authors and visible dates help engines assess accountability.',
      ),
    );
  }

  // 12. Content depth
  if (totalWords >= 600) {
    checks.push(
      makeCheck(
        'depth',
        'Content depth',
        'pass',
        6,
        `${totalWords} words of visible text. Substantive pages give engines enough material to trust and quote.`,
      ),
    );
  } else if (totalWords >= 300) {
    checks.push(
      makeCheck(
        'depth',
        'Content depth',
        'warn',
        6,
        `${totalWords} words of visible text. Below roughly 600 words, pages often read as thin to answer engines.`,
      ),
    );
  } else {
    checks.push(
      makeCheck(
        'depth',
        'Content depth',
        'fail',
        6,
        `Only ${totalWords} words of visible text. Very thin pages rarely earn citations.`,
      ),
    );
  }

  return checks;
}

function bandFor(score: number): string {
  if (score >= 80) return 'Ready';
  if (score >= 50) return 'Getting there';
  return 'Needs work';
}

export default function AeoReadinessChecker() {
  const [urlInput, setUrlInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQPage JSON-LD built from the same FAQ array rendered below.
  // RouteSeoManager owns the page title and meta tags.
  useEffect(() => {
    document.getElementById('rankvelt-aeo-checker-schema')?.remove();
    const schemaScript = document.createElement('script');
    schemaScript.id = 'rankvelt-aeo-checker-schema';
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: AEO_FAQS.map((faq) => ({
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

  async function runCheck(raw: string) {
    const url = normalizeUrl(raw);
    if (!url) {
      setAnalysis(null);
      setError('Please enter a valid page URL, for example https://www.rankvelt.com/local-seo.');
      return;
    }
    setBusy(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch('/api/fetch-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as FetchResponse;
      if (data && data.ok && typeof data.html === 'string') {
        const checks = analyzeHtml(data.html);
        const score = checks.reduce((sum, c) => sum + c.earned, 0);
        setAnalysis({
          checks,
          score,
          band: bandFor(score),
          finalUrl: data.finalUrl || url,
          httpStatus: typeof data.status === 'number' ? data.status : null,
          truncated: Boolean(data.truncated),
        });
      } else {
        setError((data && data.error) || 'The AEO check returned an unexpected result. Please try again.');
      }
    } catch {
      setError('The AEO check could not be completed. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  const bandCls =
    analysis === null
      ? ''
      : analysis.band === 'Ready'
        ? 'border-emerald-500/40 bg-emerald-500/[0.1] text-emerald-200'
        : analysis.band === 'Getting there'
          ? 'border-amber-400/40 bg-amber-400/[0.1] text-amber-200'
          : 'border-red-500/40 bg-red-500/[0.1] text-red-200';

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
            AEO Readiness <span className="text-gradient-gold">Checker</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            Enter any page URL to score how ready it is to be understood and cited by AI answer
            engines like ChatGPT, Google AI Overviews, and Perplexity. The checker reads the page
            itself: its answers, headings, structured data, and clarity signals.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bot size={20} />
              </span>
              <h2 className="text-xl font-black text-white">Check a page</h2>
            </div>

            <div className="mt-6">
              <label className={labelCls}>Page URL</label>
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runCheck(urlInput);
                }}
                placeholder="https://www.rankvelt.com/local-seo"
                className={inputCls}
              />
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                Paste a full page URL. If the protocol is missing, https is added automatically.
              </p>
            </div>

            <button
              onClick={() => runCheck(urlInput)}
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Checking...' : 'Check AEO Readiness'}
            </button>

            <p className="mt-4 text-xs leading-relaxed text-white/40">
              Try an example:{' '}
              <button
                type="button"
                onClick={() => {
                  setUrlInput('https://www.rankvelt.com/local-seo');
                  runCheck('https://www.rankvelt.com/local-seo');
                }}
                className="font-bold text-primary hover:underline"
              >
                rankvelt.com/local-seo
              </button>
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm leading-relaxed text-red-300">
                {error}
              </div>
            )}

            {analysis && (
              <div className="mt-6">
                <div
                  className={`flex flex-col items-start gap-3 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${bandCls}`}
                >
                  <span className="inline-flex items-center gap-2 text-base font-black">
                    <Bot size={18} />
                    {analysis.band}
                  </span>
                  <span className="text-3xl font-black">
                    {analysis.score}
                    <span className="text-base font-bold text-white/60"> / 100</span>
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                    Page checked
                  </p>
                  <p className="mt-1 break-all text-sm font-bold text-white/85">
                    {analysis.finalUrl}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    {analysis.httpStatus !== null
                      ? `The server answered with HTTP ${analysis.httpStatus}. `
                      : ''}
                    {analysis.truncated
                      ? 'Only the first part of the page HTML was returned, so a few checks may be incomplete. '
                      : ''}
                    Scores are calculated in your browser from the page code itself.
                  </p>
                </div>

                <div className="mt-4 space-y-2.5">
                  {analysis.checks.map((check) => (
                    <div
                      key={check.id}
                      className="flex gap-3 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5"
                    >
                      <span className="mt-0.5 shrink-0">
                        {check.status === 'pass' ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : check.status === 'warn' ? (
                          <AlertTriangle size={18} className="text-amber-300" />
                        ) : (
                          <XCircle size={18} className="text-red-400" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-bold text-white/85">{check.name}</p>
                          <p className="text-xs font-bold text-white/40">
                            {check.earned} / {check.weight} points
                          </p>
                        </div>
                        <p className="mt-1 break-words text-xs leading-relaxed text-white/50">
                          {check.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                  <p className="text-xs leading-relaxed text-white/50">
                    Read this score honestly: it measures readiness signals on the page itself,
                    such as clear answers, structure, and structured data. It cannot measure
                    whether AI engines actually cite the page, because that also depends on your
                    brand presence across the web and on each engine's own choices. Use the rows
                    above as a fix list, starting with the failed checks worth the most points.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bot size={20} />
              </span>
              <h2 className="text-xl font-black text-white">How it works</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>Paste the URL of any public page: a service page, a location page, or an article.</li>
              <li>The checker fetches the page and runs twelve readiness checks in your browser, covering titles, headings, answer blocks, structured data, and content depth.</li>
              <li>Review the score and the per check details, then fix the failed and warning rows first. Those are the signals answer engines rely on most.</li>
            </ol>
          </div>
        </section>
      <AeoReadinessCheckerArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {AEO_FAQS.map((f, i) => (
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
                { href: '/tools/title-tag-preview', name: 'Title Tag Preview' },
                { href: '/tools/schema-markup-generator', name: 'Schema Markup Generator' },
                { href: '/tools/open-graph-preview', name: 'Open Graph Preview' },
                { href: '/tools/meta-title-description-checker', name: 'Meta Title & Description Checker' },
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
            <h2 className="text-2xl font-black text-white">Want Your Pages Cited in AI Answers?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              This checker shows what a single page is missing. RankVelt's AEO service goes
              further: answer-first rewrites, structured data, and entity consistency across your
              site and profiles, so AI engines have a clear, trustworthy source to cite. Start
              with a free audit and see the gaps first.
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
function AeoReadinessCheckerArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">AEO VS SEO</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">SEO Gets You Found. AEO Gets You Quoted.</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Search engine optimization, SEO, is about earning a place in the list of links a search engine shows. Answer engine optimization, AEO, is about what happens one step later: when a tool like ChatGPT, Google AI Overviews, or Perplexity builds an answer out of sources it found, AEO decides whether your page is one of those sources and whether your brand gets named. The ranking gets you into the library. AEO makes your page the one that gets quoted from it.</p>
          <p>The foundations are shared. Both reward pages that load cleanly, state their topic plainly, and answer real questions with honest information. Where they differ is in what good looks like at the top of the page. Traditional SEO tolerates a slow build: a brand story, some scene setting, the useful answer a few scrolls down. An answer engine scanning that page finds nothing it can lift in the first moments, so it moves on to a competitor whose answer came first.</p>
          <p>That is why this checker reads a page the way an answer engine does. It looks for a title that states the topic, a direct answer near the top, headings phrased as questions, and facts presented in a form that survives being quoted out of context. None of this replaces SEO. It finishes the job SEO starts.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">HOW AI ENGINES CHOOSE</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How AI Answer Engines Pick Their Sources</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>When someone asks an AI assistant a question, the system first retrieves candidate pages, usually drawing on a search index much like a normal results page. Then it reads. It is looking for passages that answer the question directly and can stand alone: a definition, a short explanation, a set of steps. A paragraph that only makes sense after reading everything above it is hard to quote. A paragraph that answers the question in its first sentence can be lifted as it is.</p>
          <p>Specific, checkable statements travel best. Saying who a service is for, what a process involves, and what is included gives the engine facts it can repeat with confidence. Vague marketing language gives it nothing to hold. Consistency matters just as much: when your business name, services, and facts match across your website, your profiles, and other sites that mention you, the machine treats the information as settled. Contradictions quietly lower that confidence.</p>
          <p>Off-site signals still count. Brand mentions, reviews, and references on other websites all shape whether an engine trusts you enough to cite you. But the on-page half of the equation is entirely in your control, and it is the half this checker measures: whether the page itself is easy to understand, extract, and attribute.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">ANATOMY OF A CITABLE PAGE</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">The Anatomy of a Page AI Engines Can Cite</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A citable page starts plainly. The title tag and the single H1 say exactly what the page covers, in the words a customer would use. Immediately after, before any subheading, comes a short paragraph that answers the main question the page exists for. Aim for roughly 40 to 120 words: long enough to be a complete answer, short enough to be quoted whole. This opening block is the single most valuable real estate on the page, for AI engines and for impatient human readers alike.</p>
          <p>Below it, the body is organized as a series of answered questions. Each subheading poses one question or names one subtopic, and the text under it answers completely before moving on. Lists carry the steps, inclusions, and comparisons, because a list can be extracted without surgery. Facts sit near the top of each section rather than buried at the end of long stories.</p>
          <p>Around that core sits the housekeeping this checker also scores: a canonical link identifying the authoritative URL, Open Graph tags so the page summarizes itself when shared, visible author and date signals, and enough real content depth to count as a resource rather than a thin landing page. None of these elements is exotic. Together they make a page an engine can use without guessing.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">MACHINE READABLE CLUES</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Structured Data: Labels for Machines</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Structured data, usually written as JSON-LD, is a set of labels embedded in your page that describe it in machine terms. Instead of hoping an engine works out that a block of text is a question with an answer, FAQPage markup says so explicitly. Article markup identifies a piece of writing and its author and dates. LocalBusiness markup connects services to a real business with a place and a phone number. Organization, Product, Service, and BreadcrumbList each label a different kind of fact.</p>
          <p>These labels help engines disambiguate. Many businesses share similar names and services, and a paragraph alone does not always make clear which entity a fact belongs to. Structured data ties the page to the business, the business to its profiles, and the profiles back to the page, forming the consistent entity picture that answer engines lean on when deciding what is safe to repeat.</p>
          <p>Two cautions keep the practice honest. First, markup must describe content that is actually visible on the page; labeling invisible content is a spam signal in ordinary search and earns no trust anywhere. Second, schema is a clarity layer, not a citation guarantee. Think of it as a name tag at a conference: it helps the right conversation start, but what you say still decides whether anyone quotes you.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">QUESTIONS, ANSWER FIRST</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Why Question Headings and Answer-First Paragraphs Work</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>People speak to answer engines in questions: how much does this cost, how long does it take, what is included, is it worth it. A heading written as that same question is a label the engine can match to the query with almost no interpretation. The answer sitting directly beneath it then becomes the obvious extraction candidate. This is the same logic that made featured snippets valuable in classic search, applied to a wider set of surfaces.</p>
          <p>Answer-first writing is an old discipline. Journalism calls it the inverted pyramid: the essential facts open the piece, and detail, background, and nuance follow in descending order of importance. On the web it serves two readers at once. Human visitors decide in seconds whether a page respects their time, and the ones that answer first earn the scroll. Machines make the same judgment mechanically, preferring passages that resolve a question without demanding the whole page as context.</p>
          <p>The practical rewrite is simple. Take your most important service or location page and read only its headings and first paragraph. If a stranger could not tell what the page offers and why it matters from that skim, restructure it: one direct answer paragraph at the top, then question-led sections, each opening with its own short answer before the detail. Run the page through this checker before and after, and the difference is visible in the score rows.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">HONEST LIMITS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What No AEO Checker Can Promise</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Let us be direct about what the number on this page is. The score measures readiness signals inside one page: its structure, answers, markup, and depth. It cannot see how often your brand is mentioned across the web, how strong your competitors are, or which sources a given engine favors this month. A page can score 95 and still go uncited because the engine trusts a larger brand for that question. A low score, on the other hand, almost always explains an absence, because the engine had nothing clean to quote.</p>
          <p>Anyone who guarantees AI citations is selling a certainty that does not exist. Answers vary with phrasing, location, and timing, and the engines change how they select sources without notice. The honest goal of AEO is narrower and achievable: remove every on-page reason an engine might skip you, state your facts so clearly that quoting you is the path of least resistance, and keep earning off-site trust over time.</p>
          <p>It is equally important not to overcorrect. AEO is not a replacement channel that lets you abandon search. Answer engines lean on search indexes to find their candidates, so the ranking and crawling you earn through normal SEO is the admission ticket. Treat AEO as the finishing layer on solid SEO, and the two reinforce each other. Neglect the base, and there is nothing for the finishing layer to finish.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">YOUR NEXT 30 DAYS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">A Practical 30 Day AEO Improvement Plan</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Week one is diagnosis and housekeeping. Run your five most valuable pages, usually your main services and locations, through this checker. Fix the mechanical failures first: missing or bloated titles, absent meta descriptions, multiple H1 headings, missing canonical links, and empty Open Graph tags. These are short edits with permanent value, and they often move several score rows at once.</p>
          <p>Week two is rewriting. Give each priority page its answer-first opening paragraph, then convert subheadings into the questions customers actually ask, making sure every heading is followed by a complete short answer before the supporting detail. Week three is depth and data: expand thin pages until they genuinely cover their topic, present steps and inclusions as lists, and add honest structured data, FAQPage where the page visibly answers questions, Article on guides, LocalBusiness where the page represents a location.</p>
          <p>Week four is trust and consistency. Add visible author and date signals, check that your business name, services, and contact facts read identically on your site and your profiles, and re-run the checker to confirm the gains held. Then pick the next five pages. If you would rather have this handled as an ongoing program, that is exactly the work RankVelt does inside its AEO service: <a href="/strategy-call" className="font-bold text-primary hover:underline">book a free audit</a> and we will show you the gaps on your priority pages first.</p>
        </div>
      </section>
    </>
  );
}
