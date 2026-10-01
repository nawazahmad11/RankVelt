// RankVelt tool page: SERP Snippet Preview (100% free, runs in your browser)
// Place at: src/pages/tools/SerpSnippetPreview.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).

import { useMemo, useState } from 'react';
import {
  Sparkles,
  Search,
  Monitor,
  Smartphone,
  Copy,
  Check,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Link2,
  ArrowRight,
} from 'lucide-react';

const inputCls =
  'mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50';

const labelCls =
  'block text-[11px] font-black uppercase tracking-[0.18em] text-white/50';

// Google renders titles at 20px Arial and descriptions at 14px Arial.
const TITLE_FONT = '20px Arial';
const TITLE_FONT_BOLD = 'bold 20px Arial';
const DESC_FONT = '14px Arial';
const DESC_FONT_BOLD = 'bold 14px Arial';

// Pixel budgets observed on Google results pages (2026).
const TITLE_PX_DESKTOP = 600;
const TITLE_PX_MOBILE = 920; // titles wrap to two lines on mobile
const DESC_PX_DESKTOP = 920;
const DESC_PX_MOBILE = 680;

// ---------- canvas text measurement (SSR safe) ----------
let canvasEl: HTMLCanvasElement | null = null;
function getCtx(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!canvasEl) canvasEl = document.createElement('canvas');
  return canvasEl.getContext('2d');
}
function textWidth(text: string, font: string): number {
  const ctx = getCtx();
  if (!ctx) return text.length * 7;
  ctx.font = font;
  return ctx.measureText(text).width;
}

// ---------- keyword bolding (Google bolds query-matching terms) ----------
function keywordRanges(text: string, keyword: string): Array<[number, number]> {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return [];
  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];
  let i = 0;
  while (i <= lower.length - kw.length) {
    const idx = lower.indexOf(kw, i);
    if (idx === -1) break;
    ranges.push([idx, idx + kw.length]);
    i = idx + kw.length;
  }
  return ranges;
}
function isBoldAt(pos: number, ranges: Array<[number, number]>): boolean {
  return ranges.some(([s, e]) => pos >= s && pos < e);
}

// Width of text with bold keyword segments (bold glyphs are wider).
function richWidth(
  text: string,
  keyword: string,
  plainFont: string,
  boldFont: string
): number {
  if (!text) return 0;
  const ranges = keywordRanges(text, keyword);
  let w = 0;
  let prevBold: boolean | null = null;
  let run = '';
  const flush = () => {
    if (run) {
      w += textWidth(run, prevBold ? boldFont : plainFont);
      run = '';
    }
  };
  for (let i = 0; i < text.length; i++) {
    const b = isBoldAt(i, ranges);
    if (prevBold === null) prevBold = b;
    if (b !== prevBold) {
      flush();
      prevBold = b;
    }
    run += text[i];
  }
  flush();
  return w;
}

// Truncate rich text to a pixel budget using per-character widths.
function truncateRich(
  text: string,
  keyword: string,
  plainFont: string,
  boldFont: string,
  maxWidth: number
): { display: string; truncated: boolean } {
  if (!text) return { display: '', truncated: false };
  if (richWidth(text, keyword, plainFont, boldFont) <= maxWidth) {
    return { display: text, truncated: false };
  }
  const ranges = keywordRanges(text, keyword);
  const widths: number[] = [];
  const ctx = getCtx();
  for (let i = 0; i < text.length; i++) {
    if (ctx) {
      ctx.font = isBoldAt(i, ranges) ? boldFont : plainFont;
      widths.push(ctx.measureText(text[i]).width);
    } else {
      widths.push(7);
    }
  }
  const ellipsisW = textWidth('...', plainFont);
  const prefix: number[] = [0];
  for (const wd of widths) prefix.push(prefix[prefix.length - 1] + wd);
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (prefix[mid] + ellipsisW <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  const cut = text.slice(0, lo).replace(/\s+$/, '');
  return { display: cut + '...', truncated: true };
}

// Split text into bold/plain segments for rendering.
function splitSegments(
  text: string,
  keyword: string
): Array<{ text: string; bold: boolean }> {
  const core = text.endsWith('...') ? text.slice(0, -3) : text;
  const kw = keyword.trim().toLowerCase();
  if (!kw) return [{ text: core, bold: false }];
  const lower = core.toLowerCase();
  const segs: Array<{ text: string; bold: boolean }> = [];
  let i = 0;
  while (i < core.length) {
    const idx = lower.indexOf(kw, i);
    if (idx === -1) {
      segs.push({ text: core.slice(i), bold: false });
      break;
    }
    if (idx > i) segs.push({ text: core.slice(i, idx), bold: false });
    segs.push({ text: core.slice(idx, idx + kw.length), bold: true });
    i = idx + kw.length;
  }
  return segs;
}

function renderRichText(display: string, keyword: string) {
  const hasEllipsis = display.endsWith('...');
  const segs = splitSegments(display, keyword);
  return (
    <>
      {segs.map((s, i) =>
        s.bold ? (
          <b key={i} className="font-bold">
            {s.text}
          </b>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
      {hasEllipsis && <span>...</span>}
    </>
  );
}

function parseUrl(raw: string): { host: string; path: string } {
  try {
    const u = new URL(raw.trim());
    const host = u.hostname.replace(/^www\./, '');
    const path = (u.pathname === '/' ? '' : u.pathname) + u.search;
    return { host, path };
  } catch {
    return { host: '', path: '' };
  }
}

function deriveSiteName(host: string): string {
  if (!host) return '';
  const first = host.split('.')[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function faviconColor(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 65%, 42%)`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------- FAQs (mirrors the FAQPage JSON-LD below) ----------
const faqs: Array<{ q: string; a: string }> = [
  {
    q: 'How many characters should my title tag be?',
    a: 'Aim for 50 to 60 characters. That range fits comfortably inside Google\u2019s desktop display limit on most pages. But the honest answer is that Google measures pixel width, not characters: about 600 pixels on desktop using Arial at 20px. A title full of wide letters like W and M can get cut at 45 characters, while a title of narrow letters can survive past 65. Use the pixel preview above instead of counting characters by hand.',
  },
  {
    q: 'Why does Google rewrite my title tag?',
    a: 'Google rewrites titles when yours is too long, stuffed with keywords, missing, boilerplate across many pages, or a poor match for the search query. Portent\u2019s 2022 study found Google rewriting roughly one in three titles, and the pattern still holds. You reduce rewrites by keeping the title under the pixel limit, matching it to the page\u2019s H1 and actual content, putting the primary keyword near the front, and writing one unique title per page.',
  },
  {
    q: 'Does the meta description affect Google rankings?',
    a: 'No. Google has confirmed the meta description is not a direct ranking factor. But it is your free ad copy in the search results: a relevant, specific, well-written description earns more clicks at the same ranking position. More clicks at the same position means more traffic without needing to rank higher, which is why descriptions are worth the effort.',
  },
  {
    q: 'How long should a meta description be?',
    a: 'Keep it between 150 and 160 characters, which maps to roughly 920 pixels on desktop and 680 pixels on mobile. Google cuts longer descriptions with an ellipsis, often mid-sentence. Write the most important message and the call to action in the first 120 characters so nothing critical gets cut on small screens.',
  },
  {
    q: 'Why is Google not showing my meta description?',
    a: 'Google frequently substitutes its own snippet, pulled from your page content, when it judges your description irrelevant to the search query, too short, duplicated across pages, or stuffed with keywords. If you leave the description blank, Google always picks the text itself, and the result is usually a poor pitch. A unique, query-relevant description that honestly summarizes the page is the best way to get Google to use yours.',
  },
  {
    q: 'What is the pixel limit for title tags?',
    a: 'About 580 to 600 pixels on desktop, where the title renders on a single line in Arial at 20px. On mobile the title can wrap to a second line, giving roughly 920 pixels of total budget. Because letters have different widths, the only reliable check is measuring your actual text in the same font Google uses, which is what this tool does.',
  },
  {
    q: 'How does Google display the site name and favicon?',
    a: 'Google shows a small favicon plus your site name on the top line of the result, the URL breadcrumb below it, then the blue title link, then the description. Google picks the site name from your WebSite structured data first, then from Open Graph site_name, then falls back to your domain name. The favicon comes from your site\u2019s icon files and must be crawlable by Google.',
  },
  {
    q: 'Do I need a separate title for desktop and mobile?',
    a: 'No. There is only one title tag per page. Mobile simply gives it more room because the title wraps onto a second line. Optimize for the tighter desktop limit (600 pixels) and the title will render in full on both. The one mobile-specific habit worth building: keep the key message early, because mobile users skim the first line before anything else.',
  },
  {
    q: 'Is this title tag preview tool free?',
    a: 'Yes. It is completely free with no signup, no account, and no usage limits. Everything runs in your browser: your titles and URLs are measured locally and never sent to a server, so you can safely preview drafts of unreleased pages and client work.',
  },
  {
    q: 'Can I copy the HTML meta tags for my website?',
    a: 'Yes. The \u201CCopy HTML meta tags\u201D button generates a ready-to-paste title tag and meta description tag from whatever you typed. Paste them into your page\u2019s head section, or into the SEO fields of WordPress (Yoast, Rank Math), Shopify, Webflow, or any other CMS, then publish.',
  },
];

const relatedTools = [
  {
    href: '/tools/open-graph-preview',
    name: 'Open Graph Preview',
    desc: 'Check how the same page looks when shared on social, not just in Google.',
  },
  {
    href: '/tools/schema-markup-generator',
    name: 'Schema Markup Generator',
    desc: 'Add structured data that can earn star ratings and other rich results.',
  },
  {
    href: '/tools/bulk-redirect-generator',
    name: 'Bulk Redirect Generator',
    desc: 'Keep every snippet intact when URLs change during a migration.',
  },
  {
    href: '/tools/robots-txt-generator',
    name: 'Robots.txt Generator',
    desc: 'Make sure Google can crawl the pages behind your snippets.',
  },
  {
    href: '/tools/meta-title-description-checker',
    name: 'Meta Title Checker',
    desc: 'Check any live page for missing or overlong titles and descriptions.',
  },
  {
    href: '/tools',
    name: 'All Free SEO Tools',
    desc: 'Browse the full RankVelt toolbox for technical and on-page SEO.',
  },
];

export default function SerpSnippetPreview() {
  const [siteName, setSiteName] = useState('RankVelt');
  const [url, setUrl] = useState('https://rankvelt.com/tools/title-tag-preview');
  const [keyword, setKeyword] = useState('title tag preview');
  const [title, setTitle] = useState(
    'Free Title Tag Preview Tool: See Your Google Snippet'
  );
  const [description, setDescription] = useState(
    'Preview your title tag and meta description exactly as Google shows them. Free pixel-accurate SERP simulator with desktop and mobile views.'
  );
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const titleLimit = device === 'desktop' ? TITLE_PX_DESKTOP : TITLE_PX_MOBILE;
  const descLimit = device === 'desktop' ? DESC_PX_DESKTOP : DESC_PX_MOBILE;

  const titlePx = useMemo(
    () => richWidth(title, keyword, TITLE_FONT, TITLE_FONT_BOLD),
    [title, keyword]
  );
  const descPx = useMemo(
    () => richWidth(description, keyword, DESC_FONT, DESC_FONT_BOLD),
    [description, keyword]
  );
  const titleShown = useMemo(
    () => truncateRich(title, keyword, TITLE_FONT, TITLE_FONT_BOLD, titleLimit),
    [title, keyword, titleLimit]
  );
  const descShown = useMemo(
    () => truncateRich(description, keyword, DESC_FONT, DESC_FONT_BOLD, descLimit),
    [description, keyword, descLimit]
  );

  const { host, path } = useMemo(() => parseUrl(url), [url]);
  const displaySiteName = siteName.trim() || deriveSiteName(host) || 'Example Site';
  const breadcrumb =
    host +
    (path
      ? ' \u203A ' + path.split('/').filter(Boolean).join(' \u203A ')
      : '');
  const shownBreadcrumb = breadcrumb || 'example.com \u203A page';
  const faviconInitial = (displaySiteName.charAt(0) || 'E').toUpperCase();

  const titleOver = titlePx > titleLimit;
  const descOver = descPx > descLimit;

  const kw = keyword.trim().toLowerCase();
  const kwInTitle = kw ? title.toLowerCase().includes(kw) : false;
  const kwInDesc = kw ? description.toLowerCase().includes(kw) : false;

  function barColor(px: number, limit: number): string {
    if (px > limit) return 'bg-red-500';
    if (px >= limit * 0.85) return 'bg-amber-400';
    return 'bg-emerald-500';
  }
  function charStatus(
    len: number,
    min: number,
    max: number
  ): { label: string; cls: string } {
    if (len === 0) return { label: 'empty', cls: 'text-white/40' };
    if (len < min)
      return { label: 'a bit short', cls: 'text-amber-300' };
    if (len <= max) return { label: 'ideal range', cls: 'text-emerald-300' };
    return { label: 'long, check pixels', cls: 'text-amber-300' };
  }
  const titleChar = charStatus(title.length, 50, 60);
  const descChar = charStatus(description.length, 150, 160);

  const health: Array<{ ok: boolean; warn?: boolean; label: string }> = [
    {
      ok: !titleOver,
      label: titleOver
        ? `Title will be truncated on ${device} (${Math.round(titlePx)} px, limit ${titleLimit} px)`
        : `Title fits the ${device} limit (${Math.round(titlePx)} px of ${titleLimit} px)`,
    },
    {
      ok: title.length >= 50 && title.length <= 60,
      warn: title.length > 0 && (title.length < 50 || title.length > 60),
      label:
        'Title in the 50-60 character sweet spot (pixels matter more, see above)',
    },
    {
      ok: !descOver,
      label: descOver
        ? `Description will be cut on ${device} (${Math.round(descPx)} px, limit ${descLimit} px)`
        : `Description fits the ${device} limit (${Math.round(descPx)} px of ${descLimit} px)`,
    },
    {
      ok: description.length >= 120 && description.length <= 160,
      warn:
        description.length > 0 &&
        (description.length < 120 || description.length > 160),
      label: 'Description between 120 and 160 characters',
    },
  ];
  if (kw) {
    health.push({
      ok: kwInTitle,
      label: 'Primary keyword appears in the title',
    });
    health.push({
      ok: kwInDesc,
      label: 'Primary keyword appears in the description',
    });
  }

  async function copyTags() {
    const html =
      `<title>${escapeHtml(title.trim())}</title>\n` +
      `<meta name="description" content="${escapeHtml(description.trim())}" />`;
    try {
      await navigator.clipboard.writeText(html);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.08] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free RankVelt Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Free <span className="text-gradient-gold">Title Tag Preview</span>{' '}
            Tool
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            See exactly how your title tag and meta description will look in
            Google search results before you publish. Pixel-accurate truncation,
            desktop and mobile views, free with no signup. Everything runs in
            your browser, nothing is uploaded.
          </p>
        </section>

        {/* Tool UI */}
        <section className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Search size={20} />
                </span>
                <h2 className="text-xl font-black text-white">
                  SERP snippet preview
                </h2>
              </div>
              <div
                className="flex rounded-xl border border-white/[0.08] bg-black/30 p-1"
                role="group"
                aria-label="Preview device"
              >
                <button
                  type="button"
                  onClick={() => setDevice('desktop')}
                  aria-pressed={device === 'desktop'}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition-colors ${
                    device === 'desktop'
                      ? 'bg-primary text-black'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Monitor size={14} />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  aria-pressed={device === 'mobile'}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition-colors ${
                    device === 'mobile'
                      ? 'bg-primary text-black'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Smartphone size={14} />
                  Mobile
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="rv-site-name">
                  Site name{' '}
                  <span className="font-medium normal-case tracking-normal text-white/30">
                    (optional)
                  </span>
                </label>
                <input
                  id="rv-site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Your brand name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="rv-keyword">
                  Target keyword{' '}
                  <span className="font-medium normal-case tracking-normal text-white/30">
                    (gets bolded like Google does)
                  </span>
                </label>
                <input
                  id="rv-keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. title tag preview"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelCls} htmlFor="rv-url">
                Page URL
              </label>
              <input
                id="rv-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className={inputCls}
              />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <label className={labelCls} htmlFor="rv-title">
                  Title tag
                </label>
                <span className="text-xs text-white/40">
                  {title.length} characters{' '}
                  <span className={titleChar.cls}>({titleChar.label})</span>
                </span>
              </div>
              <input
                id="rv-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your page title (50-60 characters is ideal)"
                className={inputCls}
              />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <label className={labelCls} htmlFor="rv-desc">
                  Meta description
                </label>
                <span className="text-xs text-white/40">
                  {description.length} characters{' '}
                  <span className={descChar.cls}>({descChar.label})</span>
                </span>
              </div>
              <textarea
                id="rv-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Your meta description (150-160 characters is ideal)"
                rows={3}
                className={inputCls + ' resize-y'}
              />
            </div>

            {/* Truncation alerts */}
            {(titleOver || descOver) && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm leading-relaxed text-red-300">
                <span className="font-bold">Truncation warning:</span>{' '}
                {titleOver &&
                  `your title is ${Math.round(titlePx)} px wide and Google will cut it on ${device} (limit ${titleLimit} px). `}
                {descOver &&
                  `your description is ${Math.round(descPx)} px wide and Google will cut it on ${device} (limit ${descLimit} px).`}
              </div>
            )}
            {!titleOver && !descOver && (title || description) && (
              <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] px-4 py-3 text-sm leading-relaxed text-emerald-300">
                <span className="font-bold">Looks good:</span> your snippet
                fits the {device} display limits, no truncation expected.
              </div>
            )}

            {/* Google-style preview */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40 p-6">
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                Google {device} preview
              </p>
              <div
                className={`mx-auto w-full rounded-lg bg-white p-5 text-left ${
                  device === 'desktop' ? 'max-w-[600px]' : 'max-w-[360px]'
                }`}
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: faviconColor(displaySiteName) }}
                    aria-hidden="true"
                  >
                    {faviconInitial}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] leading-tight text-[#202124]">
                      {displaySiteName}
                    </div>
                    <div className="truncate text-[12px] leading-tight text-[#4d5156]">
                      {shownBreadcrumb}
                    </div>
                  </div>
                </div>
                <div className="mt-1.5 text-[20px] leading-[1.3] text-[#1a0dab]">
                  {titleShown.display ? (
                    renderRichText(titleShown.display, keyword)
                  ) : (
                    <span className="text-[#1a0dab]/40">
                      Your page title here
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] leading-[1.58] text-[#4d5156]">
                  {descShown.display ? (
                    renderRichText(descShown.display, keyword)
                  ) : (
                    <span className="text-[#4d5156]/50">
                      Your meta description will appear here. Keep it under 160
                      characters and make it earn the click.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Pixel meters */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-black uppercase tracking-[0.14em] text-white/50">
                    Title width
                  </span>
                  <span className="text-white/60">
                    {Math.round(titlePx)} / {titleLimit} px
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${barColor(titlePx, titleLimit)}`}
                    style={{
                      width: `${Math.min(100, (titlePx / titleLimit) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/40">
                  Google truncates titles by pixel width, not character count.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-black uppercase tracking-[0.14em] text-white/50">
                    Description width
                  </span>
                  <span className="text-white/60">
                    {Math.round(descPx)} / {descLimit} px
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${barColor(descPx, descLimit)}`}
                    style={{
                      width: `${Math.min(100, (descPx / descLimit) * 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/40">
                  Limit shown is for the selected device ({device}).
                </p>
              </div>
            </div>

            {/* Snippet health checklist */}
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/30 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                Snippet health check
              </p>
              <ul className="mt-3 space-y-2.5">
                {health.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    {h.ok ? (
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />
                    ) : h.warn ? (
                      <AlertTriangle
                        size={17}
                        className="mt-0.5 shrink-0 text-amber-400"
                      />
                    ) : (
                      <XCircle
                        size={17}
                        className="mt-0.5 shrink-0 text-red-400"
                      />
                    )}
                    <span
                      className={
                        h.ok ? 'text-white/70' : 'text-white/85 font-medium'
                      }
                    >
                      {h.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={copyTags}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied to clipboard' : 'Copy HTML meta tags'}
            </button>
            <p className="mt-2 text-center text-xs text-white/40">
              Generates a ready-to-paste &lt;title&gt; and meta description tag
              pair for your page.
            </p>
          </div>
        </section>

        {/* How to use */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lightbulb size={20} />
              </span>
              <h2 className="text-xl font-black text-white">
                How to use this tool
              </h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>
                Enter your page URL and site name (leave site name blank to
                auto-fill it from the URL). Add your target keyword so the
                preview bolds it exactly like Google does.
              </li>
              <li>
                Write your title tag. Watch the pixel bar: keep it under 600 px
                on desktop, and keep the primary keyword near the front.
              </li>
              <li>
                Write your meta description like ad copy: one clear benefit and
                one call to action, 150 to 160 characters, key message in the
                first 120.
              </li>
              <li>
                Toggle between desktop and mobile, confirm nothing truncates,
                then press Copy HTML meta tags and paste them into your CMS.
              </li>
            </ol>
          </div>
        </section>

        {/* Pixels not characters */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">
              Google measures pixels, not characters
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              A title of 55 wide characters (W, M, capitals) can be truncated
              while 65 narrow characters render in full. That is why character
              counters lie and pixel measurement tells the truth. These are the
              budgets this tool checks against:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.14em] text-white/40">
                    <th className="py-2 pr-4 font-black">Element</th>
                    <th className="py-2 pr-4 font-black">Desktop</th>
                    <th className="py-2 pr-4 font-black">Mobile</th>
                    <th className="py-2 font-black">Character proxy</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/[0.06]">
                    <td className="py-2.5 pr-4 font-bold text-white">
                      Title tag
                    </td>
                    <td className="py-2.5 pr-4">~600 px, one line</td>
                    <td className="py-2.5 pr-4">~920 px, two lines</td>
                    <td className="py-2.5">50 to 60 chars</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-bold text-white">
                      Meta description
                    </td>
                    <td className="py-2.5 pr-4">~920 px</td>
                    <td className="py-2.5 pr-4">~680 px</td>
                    <td className="py-2.5">150 to 160 chars</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              One more detail most checkers miss: bold text is wider than
              regular text. Google bolds the words matching the search query,
              so a title sitting at 595 pixels can overflow once the keywords
              turn bold. This preview bolds your target keyword so you see the
              true worst case before you publish.
            </p>
          </div>
        </section>

        {/* Rewrite + description tips */}
        <section className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">
              Keep Google from rewriting your title
            </h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>
                Stay under the 600 px desktop limit so length alone never
                triggers a rewrite.
              </li>
              <li>
                Make the title agree with the page H1; a mismatch tells Google
                one of them is wrong.
              </li>
              <li>
                Put the primary keyword near the front, where searchers and
                Google look first.
              </li>
              <li>
                Write one unique title per page. Boilerplate repeated
                site-wide gets replaced.
              </li>
              <li>
                Never stuff keywords. Stuffed titles are rewritten almost on
                sight.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">
              Descriptions that earn the click
            </h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>
                Write it as ad copy: lead with the visitor outcome, not your
                company name.
              </li>
              <li>
                Include one clear call to action (learn, compare, download,
                book).
              </li>
              <li>
                Work the primary keyword in naturally; Google bolds the match
                and eyes follow bold.
              </li>
              <li>
                Keep the critical message inside the first 120 characters for
                mobile.
              </li>
              <li>
                Never duplicate descriptions across pages; duplicates get
                ignored by Google.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-white/[0.06]">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span className="text-sm font-bold text-white/85">
                        {f.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-primary transition-transform ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {open && (
                      <p className="pb-5 text-sm leading-relaxed text-white/60">
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related tools */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Link2 size={20} />
              </span>
              <h2 className="text-xl font-black text-white">
                Related RankVelt tools
              </h2>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {relatedTools.map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  className="group rounded-xl border border-white/[0.08] bg-black/30 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-white">
                      {t.name}
                    </span>
                    <ArrowRight
                      size={15}
                      className="shrink-0 text-white/30 transition-colors group-hover:text-primary"
                    />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50">
                    {t.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-6 text-center sm:p-10">
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Titles are only half the click equation
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              A clean snippet cannot save thin content, slow pages, or missing
              schema. Get a full on-page SEO audit and we will fix the titles,
              the descriptions, and everything behind them.
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
      <TitleTagPreviewArticle />
      </div>
    </main>
  );
}

/* ==================== SEO ARTICLE ==================== */
// RankVelt SEO article: Title Tag Preview (~1500 words)
// Companion article rendered below the tool UI on /tools/title-tag-preview.
// The tool's own FAQ accordion covers the basics (pixel limits, rewrites,
// meta descriptions); this article goes deeper into title craft, Google's
// documented rewrite triggers, brand placement, and CTR optimization.
// No em or en dashes used anywhere.

const sectionCls = 'mt-10';
const h2Cls = 'text-2xl font-black tracking-tight text-white sm:text-3xl';
const pCls = 'mt-4 text-[15px] leading-[1.8] text-white/65';
const ulCls = 'mt-4 space-y-2.5 text-[15px] leading-[1.8] text-white/65';
const codeCls =
  'mt-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/50 p-4 font-mono text-[13px] leading-relaxed text-emerald-200';

const titleArticleFaqs: Array<{ q: string; a: string }> = [
  {
    q: 'Should the keyword go at the start of the title?',
    a: 'Yes, in most cases. Keywords near the front carry slightly more weight and they survive truncation. If a long title gets cut on desktop, the first 50 characters are what the searcher sees. Put the distinguishing words first and the brand last, and the title keeps working even when shortened.',
  },
  {
    q: 'Where should I put my brand name in the title?',
    a: 'At the end for most pages, separated by a pipe, dash, or colon: "Topic Phrase | Brand". The homepage is the exception, where brand-first is natural. Google sometimes strips the brand when it rewrites a title, but John Mueller has advised keeping it anyway, because it helps confirm the site name Google shows above the title link.',
  },
  {
    q: 'Title tag vs H1: should they be identical?',
    a: 'They can be similar but they serve different readers. The title tag is written for the searcher scanning results, so it carries the keyword, a qualifier, and the brand. The H1 is written for the reader already on the page, so it can be more natural. Google uses both as title-link sources, so keep them aligned in meaning even when the wording differs.',
  },
  {
    q: 'Do emojis in title tags help click-through rates?',
    a: 'They can stand out, but they are risky. Emojis eat pixel budget fast, render inconsistently across devices, and Google may strip them or rewrite the title around them. If emojis fit your brand voice, test one page first and check how Google actually displays it before rolling them out site-wide.',
  },
  {
    q: 'Why did Google remove my brand from the title?',
    a: 'Google routinely drops what it considers a redundant site name, especially when the name already appears above the title link. This is documented behavior, not a penalty. Keep the brand in your title anyway: it costs little pixel budget at the end.',
  },
  {
    q: 'How long until a title change shows in search results?',
    a: 'Google says changes take a few days to a few weeks to reflect, depending on how often the page is recrawled. High-traffic pages update faster. If the old title lingers for a week, that is normal. Verify the new title is actually in your HTML first, then be patient before changing it again.',
  },
  {
    q: 'Can two pages share the same title tag?',
    a: 'They should not. Duplicate titles are one of Google\'s documented rewrite triggers: when many pages share boilerplate titles, Google invents its own from headings and page content. Every page deserves a unique title describing what makes it different, even on large sites where templates generate them.',
  },
  {
    q: 'Should I update the year in my titles every January?',
    a: 'Only if the content is genuinely current. A 2026 in the title of a freshly updated guide is accurate and consistently lifts clicks. But stamping a new year on stale content is the "obsolete title" pattern Google rewrites, and readers notice. Update the content first, then the title earns the year.',
  },
  {
    q: 'Do title tags affect AI Overviews and AI search?',
    a: 'Indirectly but meaningfully. AI Overviews and AI search engines cite pages whose titles and content clearly match the query, and a precise title helps retrieval systems understand what the page covers. The same clarity that wins clicks in classic search helps your page get selected and cited in AI answers.',
  },
  {
    q: 'Is it worth rewriting titles on pages that already rank?',
    a: 'Yes, when the goal is clicks rather than rankings. A page at position 3 with a dull title can gain real traffic from a better title without moving a spot. Change one variable at a time, note the date, and watch Search Console click-through rate for that page over the next few weeks before deciding.',
  },
];

function TitleTagPreviewArticle() {
  return (
    <article className="mx-auto mt-16 max-w-4xl">
      <section className={sectionCls}>
        <h2 className={h2Cls}>The highest-leverage line on your page</h2>
        <p className={pCls}>
          A title tag is a single line of HTML in your page's head section,
          and it is the hardest working sentence in SEO. It becomes the blue
          clickable headline in Google's results and the browser tab label.
          Google confirms the
          title element is by far the most-used source for the displayed
          title link, ahead of headings, og:title, and prominent page text. A title tag preview tool exists for one
          reason: to show you exactly how that line renders before a single
          searcher ever sees it.
        </p>
        <p className={pCls}>
          What makes titles tricky is that writing them is easy and writing
          them well is not. The difference between a title that gets scanned
          past and one that gets clicked is rarely the ranking position. It
          is pixel budget, word order, and specificity.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Pixels, not characters: how Google truncates</h2>
        <p className={pCls}>
          Google states plainly that there is no character limit on the title
          element. The title link is truncated as needed to fit the device
          width. On desktop the title renders on a single line in Arial at
          about 20px, giving roughly 580 to 600 pixels before Google cuts it
          with an ellipsis. On mobile the title can wrap to a second line,
          which stretches the budget to about 920 pixels total.
        </p>
        <p className={pCls}>
          The familiar "50 to 60 characters" guidance is a community
          heuristic for the desktop limit, not a Google rule. A lowercase i
          is far narrower than an uppercase W, so a title full of wide
          letters can truncate at 45 characters while a narrow one survives
          past 65. That is why character counters mislead and pixel
          measurement does not: the preview above measures your actual text
          the way Google renders it. Keep the distinguishing words inside
          the first 50 characters and treat everything after as a bonus.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Why Google rewrites titles, and how to avoid it</h2>
        <p className={pCls}>
          Google does not always use your title tag. When it rewrote titles
          at scale in 2021, it documented exactly which patterns trigger a
          rewrite. Treat this list as a lint checklist for every title you
          write:
        </p>
        <ul className={ulCls + ' list-disc pl-6'}>
          <li>
            <strong className="text-white/85">Half-empty titles</strong> like
            "| Site Name", where the descriptive part is missing.
          </li>
          <li>
            <strong className="text-white/85">Obsolete titles</strong>, such as
            a year that no longer matches the page's content.
          </li>
          <li>
            <strong className="text-white/85">Inaccurate titles</strong> that
            promise something the page does not deliver.
          </li>
          <li>
            <strong className="text-white/85">Micro-boilerplate</strong>, the
            same title repeated across many pages with tiny variations.
          </li>
          <li>
            <strong className="text-white/85">Redundant site names</strong>,
            where the brand adds nothing beyond what Google already shows.
          </li>
          <li>
            <strong className="text-white/85">Language mismatch</strong>,
            where the title is written in a different language than the page.
          </li>
        </ul>
        <p className={pCls}>
          The pattern is consistent: Google rewrites titles that fail at
          describing the specific page. A unique, descriptive, honest title
          that matches the H1 and the page content is the strongest
          protection you have. Length alone is not a documented trigger: an
          overlong title gets truncated, not rewritten.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Keep the brand: Mueller's advice on rewrites</h2>
        <p className={pCls}>
          When site owners noticed Google stripping brand names from titles,
          some concluded the brand should be dropped from the title tag.
          Google's John Mueller advised the opposite: he would not assume
          the rewritten version is better, and keeping the site name helps
          confirm the site name Google displays above the title link.
          Chasing Google's rewrite is a losing game since it varies by
          query. Write the best title for humans, put the brand at the end,
          and let Google do what it does.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Anatomy of a title that earns the click</h2>
        <p className={pCls}>
          A strong title follows a simple shape: the distinguishing thing
          first, a qualifier the searcher would type, then the brand. "Air
          Max 90 Running Shoes, Men's | Acme" beats "Acme | Footwear |
          Products" because the first three words already answer the
          searcher's question. Front-loading the keyword also protects you
          against truncation: whatever survives the pixel cut still makes
          sense.
        </p>
        <p className={pCls}>
          Specificity signals consistently test well in click-through
          experiments. Numbers, current years, and bracketed qualifiers like
          [2026 Guide] or (Free Tool) create visual separation in a wall of
          links. Keep separators simple: pipes, dashes, and colons all work. Write in title case or sentence case consistently, avoid ALL
          CAPS, and never stuff the keyword twice.
        </p>
        <pre className={codeCls}>{`<title>Free Robots.txt Generator | RankVelt</title>
<meta name="description" content="Build a valid robots.txt file in seconds. Add user-agent rules, allow and disallow paths, and your sitemap URL with live preview. Free, no signup.">`}</pre>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Title tag vs H1 vs og:title: three jobs</h2>
        <p className={pCls}>
          These three often get confused because they can contain similar
          words. The title tag is written for the searcher scanning results,
          so it carries the keyword, a qualifier, and the brand in minimal
          space. The H1 is written for the reader already on the page, so it
          can be warmer and more descriptive. The og:title controls how the
          page looks when shared on social platforms, where curiosity can
          matter more than keyword precision. Google may pull the displayed
          title from any of them, so keep all three aligned in meaning even
          when the wording differs. When they contradict each other, you are
          inviting a rewrite.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>The meta description: your free ad copy</h2>
        <p className={pCls}>
          Google has confirmed the meta description is not a direct ranking
          factor, which leads some people to skip it. That is a mistake. The
          description is the only advertising copy you get in the search
          results for free, and at a fixed ranking position, a better pitch
          means more traffic with no ranking change at all. Write it as a
          pitch, not a summary: start with the benefit, include the primary
          keyword naturally so it bolds against the query, add a call to
          action. Put the critical message in the first 120 characters
          as a safety margin for mobile, where the budget shrinks to about
          680 pixels. And accept what you cannot control: Google rewrites
          descriptions frequently. A unique, honest, query-relevant
          description is simply the version most likely to survive.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>One title for both devices</h2>
        <p className={pCls}>
          There is only one title tag per page, so there is no separate
          mobile title. Mobile just gives the same title more room because
          it wraps to a second line. Optimize for the tighter desktop budget
          of about 600 pixels; a title that fits there renders in full
          everywhere. The one mobile habit worth building is front-loading
          the key message, because mobile searchers skim the first line
          before anything else.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Preview before you publish</h2>
        <p className={pCls}>
          The workflow that prevents truncation surprises is simple. Draft
          the title and description, paste them into the preview above, and
          check the pixel bars on desktop and mobile. Confirm the keyword
          sits in the first 50 characters and nothing critical hangs past
          the cutoff. Copy the generated HTML into your page head or CMS,
          publish, and give Google a few days to reflect the change. For
          the crawl side, see the{' '}
          <a href="/tools/robots-txt-generator" className="text-primary underline underline-offset-2 hover:opacity-80">
            Robots.txt Generator
          </a>{' '}
          guide, and for the social side, the{' '}
          <a href="/tools/open-graph-preview" className="text-primary underline underline-offset-2 hover:opacity-80">
            Open Graph Preview
          </a>{' '}
          companion article.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-white/[0.06]">
          {titleArticleFaqs.map((f, i) => (
            <div key={i} className="py-4">
              <h3 className="text-[15px] font-bold text-white/90">{f.q}</h3>
              <p className="mt-2 text-sm leading-[1.8] text-white/60">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
