// META: title="Free Meta Tag Generator & Checker for Any Page" (max 60 chars, include target keyword)
// META: description="Generate SEO meta tags and check any page's meta tags free: title, description, Open Graph and Twitter cards. No signup." (max 160 chars, include target keyword)

import { useEffect, useState } from 'react';
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Code2,
  Copy,
  ChevronDown,
  ArrowRight,
  FileSearch,
  PencilLine,
  Link2,
  Share2,
} from 'lucide-react';

const META_TAG_GENERATOR_FAQS = [
  {
    q: 'What does a meta tag generator do?',
    a: 'A meta tag generator turns the text you type, your page title, description, and social sharing details, into ready-to-paste HTML meta tags. Instead of hand-writing tags and risking syntax errors, you fill in a form and get clean code you can drop into your page head. It also helps you keep titles and descriptions within the lengths that display well in search results.',
  },
  {
    q: 'How do I check a website\'s meta tags?',
    a: 'Paste the page URL into the Checker tab above and the tool fetches the page HTML, then extracts the title tag, meta description, canonical tag, Open Graph tags, and Twitter card tags. Each tag is shown with its character length and a pass or warning status. You can check any public page, including competitor pages, to see how they write their tags.',
  },
  {
    q: 'What is the ideal meta title length?',
    a: 'Aim for roughly 50 to 60 characters. Google measures titles by pixel width rather than characters, so a title around 55 characters usually displays in full while longer titles get cut off with an ellipsis. This checker flags titles under 30 characters as short and titles over 60 as at risk of truncation.',
  },
  {
    q: 'What is the ideal meta description length?',
    a: 'Aim for roughly 150 to 160 characters. Descriptions in this range usually display in full on desktop search results, while longer ones get truncated. Meta descriptions are not a direct ranking factor, but a clear, compelling description earns more clicks, which is the whole point of writing one.',
  },
  {
    q: 'What are Open Graph tags and why do they matter?',
    a: 'Open Graph tags (og:title, og:description, og:image) control how your page looks when someone shares it on Facebook, LinkedIn, WhatsApp, and most other platforms. Without them, social networks guess your title and image, often picking something ugly or irrelevant. The core set is og:title, og:description, og:image, og:url, and og:type.',
  },
  {
    q: 'What is the difference between Open Graph tags and Twitter cards?',
    a: 'Open Graph is the standard most social platforms read, while Twitter cards are X\'s own format (twitter:card, twitter:title, and so on). In practice, X falls back to Open Graph tags when Twitter-specific tags are missing, so many sites set Open Graph tags plus twitter:card to control the layout. This tool checks both sets so you can see exactly what each network will use.',
  },
  {
    q: 'Do I still need a meta keywords tag?',
    a: 'No. Google has ignored the meta keywords tag for ranking for many years, and most search engines do the same. The generator includes it as an optional field only because a few internal site search tools still read it. Leave it empty for normal SEO work; it will not help your rankings either way.',
  },
  {
    q: 'Why does my page show the wrong title or image when shared on social media?',
    a: 'The usual causes are missing Open Graph tags, an og:image that is too small or blocked, or a cached old version of your tags on the social network\'s side. First check your tags with the Checker tab above to confirm they exist and the image URL is absolute and reachable. Then use each network\'s own debugger to refresh its cache of your page.',
  },
];

interface GeneratorFields {
  pageTitle: string;
  pageDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: 'summary' | 'summary_large_image';
}

const EMPTY_FIELDS: GeneratorFields = {
  pageTitle: '',
  pageDescription: '',
  keywords: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogUrl: '',
  twitterCard: 'summary_large_image',
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildMetaTags(f: GeneratorFields): string {
  const lines: string[] = [];
  if (f.pageTitle.trim()) lines.push(`<title>${escapeAttr(f.pageTitle.trim())}</title>`);
  if (f.pageDescription.trim())
    lines.push(`<meta name="description" content="${escapeAttr(f.pageDescription.trim())}" />`);
  if (f.keywords.trim())
    lines.push(`<meta name="keywords" content="${escapeAttr(f.keywords.trim())}" />`);
  const ogTitle = f.ogTitle.trim() || f.pageTitle.trim();
  const ogDesc = f.ogDescription.trim() || f.pageDescription.trim();
  if (ogTitle) lines.push(`<meta property="og:title" content="${escapeAttr(ogTitle)}" />`);
  if (ogDesc) lines.push(`<meta property="og:description" content="${escapeAttr(ogDesc)}" />`);
  lines.push(`<meta property="og:type" content="website" />`);
  if (f.ogUrl.trim()) lines.push(`<meta property="og:url" content="${escapeAttr(f.ogUrl.trim())}" />`);
  if (f.ogImage.trim()) lines.push(`<meta property="og:image" content="${escapeAttr(f.ogImage.trim())}" />`);
  lines.push(`<meta name="twitter:card" content="${f.twitterCard}" />`);
  if (ogTitle) lines.push(`<meta name="twitter:title" content="${escapeAttr(ogTitle)}" />`);
  if (ogDesc) lines.push(`<meta name="twitter:description" content="${escapeAttr(ogDesc)}" />`);
  if (f.ogImage.trim())
    lines.push(`<meta name="twitter:image" content="${escapeAttr(f.ogImage.trim())}" />`);
  return lines.join('\n');
}

function titleStatus(len: number): { label: string; tone: string } {
  if (len === 0) return { label: 'Missing', tone: 'text-red-400' };
  if (len < 30) return { label: 'Too short', tone: 'text-amber-400' };
  if (len <= 60) return { label: 'Good length', tone: 'text-primary' };
  return { label: 'May be truncated', tone: 'text-amber-400' };
}

function descStatus(len: number): { label: string; tone: string } {
  if (len === 0) return { label: 'Missing', tone: 'text-red-400' };
  if (len < 120) return { label: 'Short', tone: 'text-amber-400' };
  if (len <= 170) return { label: 'Good length', tone: 'text-primary' };
  return { label: 'May be truncated', tone: 'text-amber-400' };
}

interface MetaCheckResult {
  finalUrl: string;
  status: number;
  title: string;
  description: string;
  canonical: string;
  og: { name: string; content: string }[];
  twitter: { name: string; content: string }[];
}

const REQUIRED_OG = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'];
const REQUIRED_TW = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];

function analyzeMetaTags(html: string, finalUrl: string, status: number): MetaCheckResult {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const title = (doc.querySelector('title')?.textContent || '').trim();
  const description =
    doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  const canonical =
    doc.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() || '';
  const og = Array.from(doc.querySelectorAll('meta[property^="og:"]')).map((m) => ({
    name: m.getAttribute('property') || '',
    content: (m.getAttribute('content') || '').trim(),
  }));
  const twitter = Array.from(doc.querySelectorAll('meta[name^="twitter:"]')).map((m) => ({
    name: m.getAttribute('name') || '',
    content: (m.getAttribute('content') || '').trim(),
  }));
  return { finalUrl, status, title, description, canonical, og, twitter };
}

function TagRow({ name, content, present }: { name: string; content: string; present: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-black/40 p-4">
      {present ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs font-bold text-white">{name}</p>
        {present ? (
          <p className="mt-1 break-words text-sm text-white/75">{content || '(empty content)'}</p>
        ) : (
          <p className="mt-1 text-sm text-red-300/90">Not found on this page.</p>
        )}
      </div>
    </div>
  );
}

function MetaTagGeneratorArticle() {
  return (
    <div>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">What it is</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What are meta tags and why do they matter?</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Meta tags are snippets of HTML that live in the head section of a page and describe the page to
            search engines and social networks. The most important ones are the title tag and the meta
            description, because they directly control how your page appears in Google search results. Open
            Graph tags and Twitter card tags do the same job for social shares.
          </p>
          <p>
            A free meta tag generator removes the fiddly work of writing this code by hand. You fill in a
            simple form with your title, description, and sharing details, and the tool outputs clean HTML you
            can paste into your page. That matters because one misplaced quote or unclosed tag can silently
            break your tags, and you might never notice until your shares look wrong for months.
          </p>
          <p>
            The other half of this tool is the meta tag checker. It answers the question of how to check a
            website's meta tags without digging through page source. Paste any URL and it extracts the title,
            description, canonical tag, and social tags, then flags length problems and missing tags. It works
            on your own pages and on competitor pages alike.
          </p>
          <p>
            Together, generating tags correctly and checking them regularly covers the full lifecycle: write
            them well once, verify they are live, and recheck after redesigns or CMS changes. Meta tags are
            small, but they sit at the top of every page and influence every click decision a searcher makes.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Title tags</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to write a meta title that ranks and gets clicks</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The title tag is the single most important on-page element for most pages. Google uses it as a
            strong relevance signal, and it is also the blue clickable headline in search results. A good
            title does both jobs: it tells Google what the page is about and it makes a human want to click.
          </p>
          <p>
            A meta title length checker keeps you in the safe zone of roughly 50 to 60 characters. Google
            actually measures pixel width, not characters, so wide letters like W eat more space than narrow
            ones. Titles around 55 characters usually display in full. Longer titles get cut off with an
            ellipsis, which can hide your most persuasive words.
          </p>
          <p>
            Put the primary keyword near the front of the title, because both Google and scanners weight the
            beginning more heavily. Then add a reason to click: a benefit, a number, a year, or a
            differentiator. "Meta Tag Generator: Free Tool to Create and Check Tags" works harder than
            "Tags | Our Tools | Company Name", because it says what the page does and for whom.
          </p>
          <p>
            Every page needs a unique title. Duplicate titles across dozens of pages confuse Google about
            which page should rank and waste the chance to target different queries. When you run a <a href="/blog/website-redesign-seo-checklist" className="text-primary underline">title tag audit</a> on
            a site, duplicate and missing titles are usually the first big wins you find. Write each title
            for its specific page and its specific searcher.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Descriptions</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to write meta descriptions that earn clicks</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The meta description is the short paragraph under your title in search results. Google has said
            it is not a direct ranking factor, so stuffing keywords into it does not help you rank. Its real
            job is conversion: turning an impression into a click. A page ranking third with a great
            description can out-click the result above it.
          </p>
          <p>
            Keep descriptions around 150 to 160 characters so they display in full on desktop. Front-load the
            value: say what the page offers and why it is better than the other results. Active language
            beats passive language. "Check any page's meta tags free in seconds, no signup" beats "This is a
            tool for meta tags."
          </p>
          <p>
            Match the description to the search intent behind the page. A product page description should
            mention the product, a key benefit, and something trust-building like free shipping or a
            guarantee. A tool page should say what the tool does and that it is free. A blog post should
            promise the specific answer or outcome the reader will get.
          </p>
          <p>
            Be honest: Google rewrites descriptions frequently, sometimes pulling text from the page instead.
            A well-written description still gets used often enough to be worth the effort, and the exercise
            of writing one forces you to clarify what each page is actually for. If you cannot write a
            compelling description for a page, that is a sign the page itself needs sharper focus.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Social tags</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Open Graph and Twitter cards: control how your page looks when shared</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            When someone shares your page on Facebook, LinkedIn, WhatsApp, or Slack, those platforms look for
            Open Graph tags to build the preview card: the title, the description, and the image. An open
            graph tester shows you whether those tags exist and what values they carry. Without them, the
            platform guesses, and it often guesses badly, showing a cropped logo, a random image, or no image
            at all.
          </p>
          <p>
            The essential og tags are og:title, og:description, og:image, og:url, and og:type. The og:image is
            the one most people get wrong. Use an absolute URL (starting with https://), an image at least
            1200 by 630 pixels for the best display, and a file that loads fast. A broken or relative image
            URL is one of the most common reasons shares look broken.
          </p>
          <p>
            Twitter cards are X's own format. The key tag is twitter:card, usually set to summary_large_image
            for a big visual preview. X falls back to your Open Graph tags for the title, description, and
            image when Twitter-specific tags are missing, so a solid Open Graph setup plus twitter:card
            covers you on nearly every network. An og tag test that checks both sets, like the one on this
            page, shows you the complete picture.
          </p>
          <p>
            After fixing social tags, remember that networks cache link previews. Your corrected tags will
            not show up on old shares until each network refreshes its cache. Use the platform's own debugger
            tools to force a refresh after you publish fixes, otherwise you will think the fix did not work
            when it actually did.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Checker guide</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to check a website's meta tags properly</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Checking meta tags means verifying four things: the title tag, the meta description, the
            canonical tag, and the social tags. Paste the URL into the Checker tab above and the tool pulls
            each one out of the page HTML. The title and description come with character counts and plain
            length verdicts, so you know immediately whether truncation is a risk.
          </p>
          <p>
            Read the title first. Ask three questions: is it unique to this page, is it within the safe
            length, and would a stranger click it? Then read the description the same way. Then check the
            canonical tag: it should point to the page's own preferred URL (a self-referencing canonical) or
            to the master version if this page is a deliberate duplicate.
          </p>
          <p>
            For the social section, confirm that every recommended Open Graph tag is present and that the
            og:image URL is absolute and actually loads. Missing og:image is the single most common social
            tag problem on small business sites. Then confirm twitter:card exists so X renders a proper
            preview card instead of a plain link.
          </p>
          <p>
            Run this check after every redesign, migration, or CMS change, because those are the moments when
            tags silently break. Templates get replaced, plugins get swapped, and suddenly half the site has
            no descriptions. A two-minute check per key page catches that before months of ugly search
            listings and broken shares pile up.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Common meta tag mistakes to avoid</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Missing title tags and duplicate titles are the biggest offenders. Every page without a title
            forces Google to invent one, and it usually invents something bland. Duplicate titles across
            product or location pages are even worse, because they actively confuse ranking. Both are easy to
            find with a checker and easy to fix with a generator.
          </p>
          <p>
            Keyword-stuffed titles are the next classic: "Cheap Shoes | Buy Shoes Online | Best Shoe Store |
            Shoes Sale". This reads as spam to humans and does not impress Google either. One natural use of
            the primary keyword plus a compelling reason to click beats a list of variations every time.
          </p>
          <p>
            On the social side, the classic mistakes are relative og:image URLs (like "/images/share.jpg"
            instead of the full https:// address), images that are too small and render blurry, and no
            og:description at all, which leaves the share preview with a blank or auto-generated snippet.
            All three take minutes to fix once you know they exist.
          </p>
          <p>
            Finally, many sites set their tags once and never look again. Content changes, products get
            renamed, campaigns end, and the tags go stale. Treat meta tags as living copy: review your most
            important pages quarterly, and always recheck after template or platform changes.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Best practices</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Meta tag best practices checklist</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Start with the fundamentals: every indexable page gets a unique title around 50 to 60 characters
            and a unique description around 150 to 160 characters. Put the primary keyword near the front of
            the title, write the description as ad copy for the click, and never leave these to auto-generated
            defaults if you can write something better by hand.
          </p>
          <p>
            Then cover social sharing: a complete Open Graph set on every page, with an absolute og:image URL
            at 1200 by 630 pixels, plus twitter:card set to summary_large_image. If your CMS lets you set a
            custom share image per page, use it for important pages: product launches, key blog posts, and
            landing pages earn more shares with a purpose-made image than with a generic logo.
          </p>
          <p>
            Keep the technical details clean. Use one title tag per page, one meta description, and one
            canonical tag. Escape special characters properly in your HTML so quotes inside your copy do not
            break the tag syntax. The generator on this page handles escaping for you automatically.
          </p>
          <p>
            Finally, verify everything is actually live. Tags in your CMS draft mean nothing until they render
            in the published HTML. Check a sample of pages with the checker after publishing, test one share
            on each major network, and refresh the social caches. That final verification loop is what
            separates sites with clean tags from sites that think they have clean tags.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Next steps</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What to do after auditing your meta tags</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Fix the highest-traffic pages first. Export your list of problem pages, sort by the traffic or
            revenue each page drives, and rewrite titles and descriptions from the top down. A better title on
            a page that already ranks on page one can move the click-through needle within weeks.
          </p>
          <p>
            Then fix the patterns. If the checker shows that every blog post is missing descriptions, the fix
            is not fifty manual rewrites, it is a better template plus a publishing checklist. Solve the
            system, then backfill the backlog in traffic order.
          </p>
          <p>
            Measure what changed. Watch click-through rate in Google Search Console for the pages you rewrote,
            comparing the weeks before and after. Titles and descriptions are one of the few SEO changes where
            you can see results quickly, which makes them perfect for proving the value of on-page work to
            stakeholders.
          </p>
          <p>
            Meta tags are the doorway, not the house. Once your tags are clean, the next wins usually live in
            headings, page speed, and content depth. Keep auditing outward from the tags, one layer at a time,
            and the whole site compounds.
          </p>
        </div>
      </section>
    </div>
  );
}

const RELATED_META = [
  { slug: 'meta-title-description-checker', name: 'Meta Title and Description Checker', desc: 'Audit title and description tags on any URL.' },
  { slug: 'title-tag-preview', name: 'Title Tag Preview', desc: 'Preview how your title looks in Google results.' },
  { slug: 'open-graph-preview', name: 'Open Graph Preview', desc: 'Preview your social share card before publishing.' },
  { slug: 'open-graph-checker', name: 'Open Graph Checker', desc: 'Check Open Graph tags on any page.' },
];

function GeneratorMode() {
  const [fields, setFields] = useState<GeneratorFields>(EMPTY_FIELDS);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof GeneratorFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setCopied(false);
  };

  const output = buildMetaTags(fields);
  const tLen = fields.pageTitle.trim().length;
  const dLen = fields.pageDescription.trim().length;
  const tStat = titleStatus(tLen);
  const dStat = descStatus(dLen);

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable, user can select manually */
    }
  };

  const inputCls =
    'w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none';

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-bold text-white">Page title</label>
            <span className={`text-xs font-bold ${tStat.tone}`}>
              {tLen} chars, {tStat.label.toLowerCase()}
            </span>
          </div>
          <input
            value={fields.pageTitle}
            onChange={(e) => set('pageTitle', e.target.value)}
            placeholder="Free Meta Tag Generator & Checker for Any Page"
            className={inputCls}
            maxLength={200}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-bold text-white">Meta description</label>
            <span className={`text-xs font-bold ${dStat.tone}`}>
              {dLen} chars, {dStat.label.toLowerCase()}
            </span>
          </div>
          <textarea
            value={fields.pageDescription}
            onChange={(e) => set('pageDescription', e.target.value)}
            placeholder="Generate SEO meta tags and check any page's meta tags free: title, description, Open Graph and Twitter cards. No signup."
            rows={3}
            className={inputCls}
            maxLength={400}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-white">
            Meta keywords <span className="font-normal text-white/40">(optional, ignored by Google)</span>
          </label>
          <input
            value={fields.keywords}
            onChange={(e) => set('keywords', e.target.value)}
            placeholder="meta tag generator, check meta tags"
            className={inputCls}
          />
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <Share2 className="h-4 w-4 text-primary" /> Open Graph (social sharing)
          </p>
          <div className="space-y-3">
            <input
              value={fields.ogTitle}
              onChange={(e) => set('ogTitle', e.target.value)}
              placeholder="OG title (defaults to page title)"
              className={inputCls}
            />
            <input
              value={fields.ogDescription}
              onChange={(e) => set('ogDescription', e.target.value)}
              placeholder="OG description (defaults to meta description)"
              className={inputCls}
            />
            <input
              value={fields.ogImage}
              onChange={(e) => set('ogImage', e.target.value)}
              placeholder="OG image URL (absolute, e.g. https://.../share.jpg)"
              className={inputCls}
            />
            <input
              value={fields.ogUrl}
              onChange={(e) => set('ogUrl', e.target.value)}
              placeholder="Page URL (absolute, e.g. https://example.com/page)"
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-white">Twitter card type</label>
          <select
            value={fields.twitterCard}
            onChange={(e) => set('twitterCard', e.target.value)}
            className={`${inputCls} appearance-none`}
          >
            <option value="summary_large_image">summary_large_image (big image preview)</option>
            <option value="summary">summary (small image preview)</option>
          </select>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-bold text-white">
            <Code2 className="h-4 w-4 text-primary" /> Generated HTML
          </p>
          <button
            onClick={copyOutput}
            disabled={!output}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-black transition hover:opacity-90 disabled:opacity-40"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
        </div>
        <pre className="max-h-[520px] min-h-[320px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/[0.08] bg-black/60 p-4 font-mono text-xs leading-relaxed text-white/80">
          {output || '// Fill in the form and your meta tags will appear here.'}
        </pre>
        <p className="mt-2 text-xs text-white/40">
          Paste this inside the &lt;head&gt; section of your page. Special characters are escaped
          automatically.
        </p>
      </div>
    </div>
  );
}

function CheckerMode() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<MetaCheckResult | null>(null);

  const runCheck = async () => {
    const target = url.trim();
    if (!target) {
      setError('Please enter a URL to check.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/fetch-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!data.ok || !data.html) {
        throw new Error('Could not fetch that page. Check the URL and try again.');
      }
      setResult(analyzeMetaTags(data.html, data.finalUrl || target, data.status || 0));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong while fetching the page.');
    } finally {
      setLoading(false);
    }
  };

  const tStat = result ? titleStatus(result.title.length) : null;
  const dStat = result ? descStatus(result.description.length) : null;

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') runCheck();
          }}
          placeholder="https://example.com/page"
          className="w-full flex-1 rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
        />
        <button
          onClick={runCheck}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? 'Checking...' : 'Check Meta Tags'}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <p className="break-all text-xs text-white/60">
            Checked: {result.finalUrl}
            {result.status > 0 && ` (HTTP ${result.status})`}
          </p>

          <div>
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-white/60">Title tag</h3>
            {result.title ? (
              <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4">
                <p className="text-base font-bold text-white">{result.title}</p>
                <p className={`mt-2 text-xs font-bold ${tStat?.tone}`}>
                  {result.title.length} characters, {tStat?.label.toLowerCase()} (ideal is 50 to 60)
                </p>
              </div>
            ) : (
              <TagRow name="title" content="" present={false} />
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-white/60">Meta description</h3>
            {result.description ? (
              <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4">
                <p className="text-sm leading-relaxed text-white/80">{result.description}</p>
                <p className={`mt-2 text-xs font-bold ${dStat?.tone}`}>
                  {result.description.length} characters, {dStat?.label.toLowerCase()} (ideal is 150 to 160)
                </p>
              </div>
            ) : (
              <TagRow name='meta name="description"' content="" present={false} />
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-white/60">Canonical</h3>
            {result.canonical ? (
              <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-black/40 p-4">
                <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="break-all font-mono text-xs text-white/80">{result.canonical}</p>
                  <p className="mt-1 text-xs text-white/60">
                    {result.canonical === result.finalUrl
                      ? 'Self-referencing canonical. This is the recommended setup.'
                      : 'Points to a different URL. Make sure that is intentional.'}
                  </p>
                </div>
              </div>
            ) : (
              <TagRow name='link rel="canonical"' content="" present={false} />
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-white/60">Open Graph tags</h3>
            <div className="space-y-2">
              {REQUIRED_OG.map((name) => {
                const found = result.og.find((t) => t.name === name);
                return <TagRow key={name} name={name} content={found?.content || ''} present={!!found} />;
              })}
              {result.og
                .filter((t) => !REQUIRED_OG.includes(t.name))
                .map((t, i) => (
                  <TagRow key={`${t.name}-${i}`} name={t.name} content={t.content} present={true} />
                ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-white/60">Twitter card tags</h3>
            <div className="space-y-2">
              {REQUIRED_TW.map((name) => {
                const found = result.twitter.find((t) => t.name === name);
                return <TagRow key={name} name={name} content={found?.content || ''} present={!!found} />;
              })}
              {result.twitter
                .filter((t) => !REQUIRED_TW.includes(t.name))
                .map((t, i) => (
                  <TagRow key={`${t.name}-${i}`} name={t.name} content={t.content} present={true} />
                ))}
            </div>
            {result.twitter.length === 0 && (
              <p className="mt-2 text-xs text-white/50">
                No Twitter tags found. X will fall back to your Open Graph tags, so add at least
                twitter:card for a proper preview.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MetaTagGenerator() {
  const [mode, setMode] = useState<'generator' | 'checker'>('generator');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const id = 'rankvelt-meta-tag-generator-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Meta Tag Generator and Checker',
          url: 'https://www.rankvelt.com/tools/meta-tag-generator',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: META_TAG_GENERATOR_FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <section className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Free SEO Tool</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Free Meta Tag Generator and Checker for Any Page
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
          Two tools in one. Generate clean SEO meta tags with the form below, including Open Graph and
          Twitter card tags with automatic length guidance, or switch to the checker to audit any live
          page's title, meta description, canonical, and social tags. Free, no signup.
        </p>

        <div className="mt-8 inline-flex rounded-xl border border-white/[0.08] bg-black/40 p-1">
          <button
            onClick={() => setMode('generator')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${
              mode === 'generator' ? 'bg-primary text-black' : 'text-white/75 hover:text-white'
            }`}
          >
            <PencilLine className="h-4 w-4" />
            Generator
          </button>
          <button
            onClick={() => setMode('checker')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${
              mode === 'checker' ? 'bg-primary text-black' : 'text-white/75 hover:text-white'
            }`}
          >
            <FileSearch className="h-4 w-4" />
            Checker
          </button>
        </div>

        {mode === 'generator' ? <GeneratorMode /> : <CheckerMode />}
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How the meta tag generator and checker work</h2>
        <div className="mt-8 space-y-4">
          {[
            {
              title: 'Pick a mode',
              text: 'Use the Generator tab to create new meta tags from scratch, or the Checker tab to audit the tags on any live page. Both are free and need no account.',
            },
            {
              title: 'Fill in the generator form',
              text: 'Type your page title, meta description, and optional keywords, then add your Open Graph details and pick a Twitter card type. Character counts update live with length guidance.',
            },
            {
              title: 'Copy the clean HTML',
              text: 'The tool builds properly escaped HTML you can paste straight into your page head. Open Graph fields fall back to your title and description if you leave them blank.',
            },
            {
              title: 'Or audit any URL',
              text: 'In Checker mode, paste a page URL. The tool fetches the HTML, extracts the title, description, canonical, and social tags, and flags length issues and missing tags.',
            },
          ].map((step, i) => (
            <div key={step.title} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-black/20 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MetaTagGeneratorArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Meta tag generator FAQs</h2>
        <div className="mt-8 space-y-3">
          {META_TAG_GENERATOR_FAQS.map((faq, i) => (
            <div key={faq.q} className="rounded-2xl border border-white/[0.08] bg-black/20">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-bold text-white">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-primary transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && <p className="px-5 pb-5 text-sm leading-relaxed text-white/75">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Keep optimizing</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Related free tools</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {RELATED_META.map((t) => (
            <a
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group rounded-2xl border border-white/[0.08] bg-black/20 p-5 transition hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white group-hover:text-primary">{t.name}</h3>
                <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="mt-2 text-sm text-white/60">{t.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <div className="rounded-2xl border border-primary/25 bg-primary/[0.07] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Want a full SEO audit, not just meta tags?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Meta tags are one piece of on-page SEO. Our free audit reviews your titles, headings, speed,
            technical issues, and content, then shows you exactly what to fix first.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/strategy-call"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
            >
              Get a Free SEO Audit
            </a>
            <a
              href="/tools"
              className="rounded-xl border border-white/[0.08] bg-black/40 px-6 py-3 text-sm font-bold text-white transition hover:border-white/20"
            >
              Browse All Tools
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
