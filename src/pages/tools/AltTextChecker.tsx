// META: title="Free Alt Text Checker: Find Missing Image Alt Attributes" (max 60 chars, include target keyword)
// META: description="Audit any page for missing image alt text free: see every image, its alt status, and fix guidance. No signup." (max 160 chars, include target keyword)

import { useEffect, useState } from 'react';
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
  ChevronDown,
  ArrowRight,
  Copy,
  Download,
} from 'lucide-react';

const ALT_TEXT_CHECKER_FAQS = [
  {
    q: 'What is an alt attribute in SEO?',
    a: 'An alt attribute is an HTML attribute on an image tag that provides a text alternative for the image. Search engines cannot see images the way humans do, so they read the alt text to understand what the image shows. Screen readers also read alt text aloud for visually impaired users. Good alt text helps with image SEO, accessibility, and sometimes even regular page rankings.',
  },
  {
    q: 'What is the difference between a missing alt attribute and an empty alt attribute?',
    a: 'A missing alt attribute means the image tag has no alt attribute at all, so screen readers may read out the file name instead, which is a poor experience. An empty alt attribute (alt="") tells screen readers to skip the image entirely, which is correct for purely decorative images like dividers or background flourishes. This checker reports both separately so you can tell real problems apart from intentional decorative images.',
  },
  {
    q: 'How many images should have alt text on a page?',
    a: 'Every meaningful image should have descriptive alt text, which means product photos, infographics, charts, team photos, and any image that adds information to the page. Only purely decorative images should use an empty alt attribute. A good target is 100 percent of informative images carrying descriptive alt text, with only decoration deliberately left empty.',
  },
  {
    q: 'How long should alt text be?',
    a: 'Most accessibility and SEO guides recommend keeping alt text under about 125 characters. The goal is a short, specific description of what the image shows, not a paragraph. If you need more detail, like for a complex chart, put the longer explanation in the visible text near the image and keep the alt text concise.',
  },
  {
    q: 'Should I put keywords in alt text?',
    a: 'Write alt text for humans first and include your target keyword only when it describes the image naturally. Repeating the same keyword in every image alt attribute on a page looks like keyword stuffing and can hurt more than it helps. Each image should describe what it actually shows, in plain words.',
  },
  {
    q: 'Does alt text affect Google Image search rankings?',
    a: 'Yes, alt text is one of the strongest signals Google uses to understand an image, and it directly influences Google Images rankings along with the file name, the surrounding text, and the page context. Informative images with clear alt text can send meaningful traffic from image search, especially for product and how-to content.',
  },
  {
    q: 'Why do some images on my page show as missing alt when I added alt text in my CMS?',
    a: 'This usually happens with images added by plugins, themes, or page builders that do not save the alt field, images loaded lazily with JavaScript, or images served through a CDN that strips attributes. Run the URL again after fixing things in your CMS and check the page source to see what the server actually sends. If the alt text appears in the source but not in the checker, the image may be injected by JavaScript after the page loads.',
  },
  {
    q: 'Do background images set with CSS need alt text?',
    a: 'No. CSS background images are decorative by nature and are ignored by screen readers, so they do not need alt attributes. This checker only audits HTML image tags, which are the images that matter for both accessibility and image SEO.',
  },
];

interface AltImage {
  src: string;
  displaySrc: string;
  alt: string | null;
  status: 'good' | 'empty' | 'missing';
}

interface AltCheckResult {
  finalUrl: string;
  status: number;
  total: number;
  good: number;
  empty: number;
  missing: number;
  score: number;
  images: AltImage[];
}

function analyzeAltText(html: string, finalUrl: string, status: number): AltCheckResult {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const imgs = Array.from(doc.getElementsByTagName('img'));
  const images: AltImage[] = imgs.map((img) => {
    const raw = img.getAttribute('src') || img.getAttribute('data-src') || '';
    let displaySrc = raw;
    try {
      displaySrc = new URL(raw, finalUrl).toString();
    } catch {
      displaySrc = raw || '(no src found)';
    }
    const hasAlt = img.hasAttribute('alt');
    const alt = hasAlt ? (img.getAttribute('alt') ?? '') : null;
    const imgStatus: AltImage['status'] = !hasAlt ? 'missing' : alt.trim() === '' ? 'empty' : 'good';
    return { src: raw, displaySrc, alt, status: imgStatus };
  });
  const total = images.length;
  const good = images.filter((i) => i.status === 'good').length;
  const empty = images.filter((i) => i.status === 'empty').length;
  const missing = images.filter((i) => i.status === 'missing').length;
  const score = total === 0 ? 100 : Math.round(((good + empty * 0.5) / total) * 100);
  return { finalUrl, status, total, good, empty, missing, score, images };
}

function scoreLabel(score: number): { label: string; tone: string } {
  if (score >= 90) return { label: 'Excellent', tone: 'text-primary' };
  if (score >= 70) return { label: 'Good', tone: 'text-primary' };
  if (score >= 40) return { label: 'Needs work', tone: 'text-amber-400' };
  return { label: 'Poor', tone: 'text-red-400' };
}

function AltTextCheckerArticle() {
  return (
    <div>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">What it is</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What is an alt attribute in SEO?</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The alt attribute is a piece of HTML that sits inside an image tag and describes what the image
            shows. A simple example looks like this: &lt;img src="running-shoes.jpg" alt="Red running shoes
            on a track"&gt;. When the image cannot be displayed, the browser shows this text instead. More
            importantly, search engines and screen readers read it to understand the image.
          </p>
          <p>
            An alt text checker scans a page and reports which images have descriptive alt text, which have an
            empty alt attribute, and which are missing the attribute completely. That three-way split matters,
            because a missing attribute and an intentionally empty one are very different situations. The first
            is usually a mistake. The second is often correct, because purely decorative images should be
            hidden from screen readers with alt="".
          </p>
          <p>
            Alt attributes SEO is one of the most overlooked parts of image SEO. Site owners spend hours on
            keywords and links, then publish pages full of images named IMG_4829.jpg with no alt text at all.
            Every one of those images is a missed chance to tell Google what the page contains and a missed
            chance to appear in Google Images results.
          </p>
          <p>
            Running a regular image audit with an image alt text checker keeps this problem under control,
            especially on large sites where content teams publish images every day. It takes one minute to
            check a page and a few minutes to fix what you find, which makes alt text one of the
            highest-return small fixes in all of on-page SEO.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Why it matters</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Why image alt text matters for SEO and accessibility</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Alt text matters for two big reasons, and both have business impact. The first is accessibility.
            People who use screen readers depend on alt text to understand images. When images have no alt
            text, the reader may announce a meaningless file name or skip the content entirely. Beyond being
            the right thing to do, accessibility problems can lead to legal complaints in some regions and
            always lead to a worse experience for real visitors.
          </p>
          <p>
            The second reason is search traffic. Google Images is a large source of visits for many sites,
            especially eCommerce stores, food blogs, travel sites, and anyone with visual products. Alt text is
            one of the clearest signals Google has about what an image depicts. Pages with strong image
            optimization SEO tend to collect image search traffic that their competitors miss completely.
          </p>
          <p>
            There is also a quieter third benefit. Images fail to load more often than people think, on slow
            connections, with ad blockers, or when a CDN has a bad moment. Good alt text keeps the page
            understandable even when the pictures do not appear. That small resilience improves user
            experience in exactly the situations where visitors are most likely to leave.
          </p>
          <p>
            For eCommerce, the stakes are even higher. Your product images are your storefront. Descriptive
            product image alt text helps each product photo rank in image search and helps visually impaired
            shoppers understand what they are considering buying. If you sell visually, alt text is part of
            the sales copy, not just a technical checkbox.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Image SEO</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How Google uses alt text for image SEO</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Google cannot look at a picture and understand it the way you do. It combines several signals to
            figure out what an image shows: the alt text, the file name, the caption and text around the
            image, the page title, and structured data. Of these, alt text is the most direct statement of
            what the image contains, because you write it yourself.
          </p>
          <p>
            When Google indexes your images, clear alt text helps it match them to the right searches. A
            photo with the file name "photo1.jpg" and no alt text is nearly invisible to image search. The
            same photo with the file name "blue-ceramic-vase.jpg" and the alt text "Handmade blue ceramic
            vase on a wooden table" has a real chance of ranking for related queries and sending shoppers to
            your page.
          </p>
          <p>
            Alt text also supports the ranking of the page itself. Relevant, descriptive image alt text
            reinforces the topic of the page in the same way that good headings do. It is not a magic ranking
            factor that will carry a weak page, but across dozens of pages it adds up to a clearer topical
            signal, which is exactly what image optimization SEO is about.
          </p>
          <p>
            One honest note: Google has said that for ranking, alt text is treated more like anchor text,
            a hint about the image, not a keyword field to stuff. That is why natural descriptions beat
            keyword lists every time. Write for the person who cannot see the image, and the SEO benefit
            follows.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How to use it</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to use this alt text checker</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Using the tool is simple. Paste the full URL of any public page into the input box above and press
            the check button. The tool fetches the page HTML and examines every image tag it finds. Within
            seconds you get a score, counts of images with good alt text, empty alt text, and missing alt
            attributes, plus a full list of every image with its source and status.
          </p>
          <p>
            Read the score first, then the counts. A page can have a high score and still need attention if
            the few missing images are the important ones, like the hero image or product photos. Use the
            filter buttons to show only the images with missing alt text, and fix those first. They are the
            highest value fixes on the page.
          </p>
          <p>
            Empty alt attributes deserve a quick review, not an automatic fix. Look at each one and ask
            whether the image adds meaning. A decorative divider or a background flourish should keep its
            empty alt. A product photo, chart, or team picture with empty alt needs real descriptive text.
          </p>
          <p>
            After you fix the issues in your CMS, run the URL through the checker again to confirm the fixes
            took effect. This is especially useful on large sites, where themes and plugins sometimes strip
            alt attributes that editors carefully added. A quick recheck catches those silent failures.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Fixing issues</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to fix missing alt text the right way</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Good alt text describes the image specifically and briefly. "Dog" is weak. "Golden retriever
            puppy playing with a red ball in a garden" is strong. Include the details a person would need to
            understand the image without seeing it, and stop there. Most alt text should fit comfortably under
            125 characters.
          </p>
          <p>
            In WordPress, you add alt text in the media library or in the image block settings in the editor.
            In Shopify, you add it in the product image settings, where it is often labeled "alt text". In
            most page builders, clicking the image opens a settings panel with an alt text field. The label
            varies, but the field is almost always there. The most common reason for missing alt text is not
            that the CMS lacks the field, it is that nobody fills it in during publishing.
          </p>
          <p>
            For decorative images, keep alt="" and move on. Do not write alt text like "decorative blue line"
            for a divider. That forces screen reader users to listen to noise. The empty attribute is the
            correct, accessible choice, and this checker counts it as acceptable rather than as an error.
          </p>
          <p>
            For product images, describe the product as a shopper would see it: the item, its color, its key
            visible features, and any variant shown. Strong <a href="/blog/high-converting-product-pages" className="text-primary underline">product image alt text</a> doubles
            as sales support, because it feeds image search with exactly the kind of specific queries buyers
            type. Make alt text part of your product publishing checklist, not an afterthought.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Common alt text mistakes that hurt image optimization</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The most common mistake is keyword stuffing: repeating the target keyword in every image on the
            page. "Buy cheap running shoes, best running shoes, running shoes sale" as alt text helps nobody
            and reads as spam. Use the keyword only where it genuinely describes the image, and let the rest
            of the images carry natural descriptions.
          </p>
          <p>
            The second mistake is redundancy with the caption. If the visible caption already says "Our team
            at the 2025 company retreat", the alt text does not need to repeat it word for word. Add the
            visual detail the caption lacks, or use a shorter description. Screen reader users hear both, so
            repetition wastes their time.
          </p>
          <p>
            The third mistake is writing alt text that starts with "image of" or "picture of". Screen readers
            already announce that the element is an image, so those words add nothing. Start directly with the
            description: "Sunset over the Santorini caldera", not "Image of a sunset over the Santorini
            caldera".
          </p>
          <p>
            The fourth mistake is leaving file names as the only text. Some themes fall back to showing the
            file name when alt text is missing, so visitors and screen readers hear "IMG_4829_final_v2.jpg".
            Descriptive file names help a little with image SEO, but they are no substitute for real alt text
            written for humans.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Best practices</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Alt text best practices checklist</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Use this checklist whenever you publish or audit a page. First, every informative image gets
            unique, specific alt text, and every decorative image gets alt="". Second, keep each description
            under about 125 characters and focused on what the image shows. Third, include keywords only when
            they fit naturally, never as a stuffed list.
          </p>
          <p>
            Fourth, make alt text unique across the page. Ten product photos should not all share the same alt
            text. Describe what makes each image different: the angle, the color variant, the detail shown.
            Fifth, do not put important text only inside images. If an infographic contains key facts, those
            facts should also exist as real text on the page, with the alt text giving a concise summary.
          </p>
          <p>
            Sixth, pair alt text with descriptive file names before upload. "blue-ceramic-vase.jpg" with good
            alt text beats "IMG_4829.jpg" with good alt text, because the file name is another signal Google
            reads. Seventh, compress your images so they load fast. Alt text helps Google understand images,
            but heavy unoptimized files still hurt the page experience, so run key images through an image
            compressor as part of the same workflow.
          </p>
          <p>
            Finally, schedule a regular <a href="/blog/website-redesign-seo-checklist" className="text-primary underline">image audit</a> for
            your most important pages: homepage, top product and category pages, and posts that earn image
            search traffic. Alt text decays as teams publish, redesign, and migrate. A five-minute check every
            quarter keeps the whole site clean.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Next steps</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">When to act on your alt text checker results</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Act immediately when important images are missing alt text. Hero images, product photos, and
            infographics that earn links deserve alt text today, because each one is a small traffic and
            accessibility opportunity sitting unclaimed. Start with the pages that already rank or already get
            image search impressions, since improvements there pay off fastest.
          </p>
          <p>
            Act soon, in a batch, when you find a pattern. If the checker shows that every blog post from the
            last year is missing alt text, that is a process problem, not a one-page problem. Fix the
            template or train the team, then work through the backlog in order of traffic. A spreadsheet of
            URLs with missing counts, straight from repeated checks, makes the backlog easy to manage.
          </p>
          <p>
            Relax, slightly, about decorative images with empty alt text. Those are correct and need no
            action. Your goal is not a perfect score for its own sake. Your goal is that every image which
            carries meaning also carries a description. When the checker shows only intentional empty alt
            attributes left, the page is in good shape.
          </p>
          <p>
            After alt text, the next highest-value image work is usually file size. Large images slow pages
            down and hurt both rankings and conversions. Pair your alt text fixes with compression and proper
            sizing, and each image on the page will be fully optimized: understandable to Google, accessible
            to everyone, and fast to load.
          </p>
        </div>
      </section>
    </div>
  );
}

const RELATED_ALT = [
  { slug: 'image-compressor', name: 'Image Compressor', desc: 'Compress and convert images to fast WebP files.' },
  { slug: 'h1-checker', name: 'H1 Checker', desc: 'Audit heading structure on any page.' },
  { slug: 'meta-title-description-checker', name: 'Meta Title and Description Checker', desc: 'Check title and description tags on any URL.' },
  { slug: 'website-speed-test', name: 'Website Speed Test', desc: 'Test page speed and find what slows it down.' },
];

export default function AltTextChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AltCheckResult | null>(null);
  const [filter, setFilter] = useState<'all' | 'missing' | 'empty' | 'good'>('all');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const id = 'rankvelt-alt-text-checker-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Alt Text Checker',
          url: 'https://www.rankvelt.com/tools/alt-text-checker',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: ALT_TEXT_CHECKER_FAQS.map((f) => ({
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

  const runCheck = async () => {
    const target = url.trim();
    if (!target) {
      setError('Please enter a URL to check.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setFilter('all');
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
      setResult(analyzeAltText(data.html, data.finalUrl || target, data.status || 0));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong while fetching the page.');
    } finally {
      setLoading(false);
    }
  };

  const copyReport = async () => {
    if (!result) return;
    const lines = [
      `Alt text audit: ${result.finalUrl}`,
      `Total images: ${result.total}`,
      `Descriptive alt text: ${result.good}`,
      `Empty alt (decorative): ${result.empty}`,
      `Missing alt attribute: ${result.missing}`,
      `Score: ${result.score}/100`,
      '',
      ...result.images.map(
        (img, i) => `${i + 1}. [${img.status.toUpperCase()}] ${img.displaySrc}${img.alt ? ` | alt="${img.alt}"` : ''}`
      ),
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard in this browser.');
    }
  };

  const downloadCsv = () => {
    if (!result) return;
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      'src,alt_status,alt_text',
      ...result.images.map((img) => `${esc(img.displaySrc)},${img.status},${esc(img.alt ?? '')}`),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'alt-text-audit.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const filtered = result
    ? result.images.filter((img) => (filter === 'all' ? true : img.status === filter))
    : [];
  const score = result ? scoreLabel(result.score) : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <section className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Free SEO Tool</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Free Alt Text Checker: Find Missing Image Alt Attributes
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
          Enter any page URL and this free alt text checker audits every image on the page. You will see the
          total image count, how many images are missing alt attributes, how many use intentionally empty
          alt text, and a full list of each image with its alt status, so you can fix image SEO and
          accessibility issues with confidence.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
            {loading ? 'Checking...' : 'Check Alt Text'}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/[0.08] bg-black/40 px-5 py-4">
                <p className="text-[11px] uppercase tracking-widest text-white/60">Alt text score</p>
                <p className="mt-1 text-3xl font-black text-white">
                  {result.score}
                  <span className="text-base text-white/50">/100</span>
                </p>
                {score && <p className={`mt-1 text-sm font-bold ${score.tone}`}>{score.label}</p>}
              </div>
              <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <ImageIcon className="h-4 w-4" />
                    <p className="text-[11px] uppercase tracking-widest">Total images</p>
                  </div>
                  <p className="mt-1 text-2xl font-black text-white">{result.total}</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <p className="text-[11px] uppercase tracking-widest">Descriptive alt</p>
                  </div>
                  <p className="mt-1 text-2xl font-black text-white">{result.good}</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <p className="text-[11px] uppercase tracking-widest">Empty alt</p>
                  </div>
                  <p className="mt-1 text-2xl font-black text-white">{result.empty}</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <p className="text-[11px] uppercase tracking-widest">Missing alt</p>
                  </div>
                  <p className="mt-1 text-2xl font-black text-white">{result.missing}</p>
                </div>
              </div>
            </div>

            <p className="mt-4 break-all text-xs text-white/60">
              Checked: {result.finalUrl}
              {result.status > 0 && ` (HTTP ${result.status})`}
            </p>

            {result.total === 0 ? (
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40 p-6 text-sm text-white/75">
                No image tags were found in the HTML of this page. The page may load its images with
                JavaScript after the initial HTML loads, or it may genuinely contain no images. If you
                expected images, check the page source in your browser to confirm they are present in the
                raw HTML.
              </div>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {(
                    [
                      ['all', `All (${result.total})`],
                      ['missing', `Missing (${result.missing})`],
                      ['empty', `Empty (${result.empty})`],
                      ['good', `Good (${result.good})`],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                        filter === key
                          ? 'border-primary bg-primary text-black'
                          : 'border-white/[0.08] bg-black/40 text-white/75 hover:border-white/20'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={copyReport}
                      className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/40 px-4 py-1.5 text-xs font-bold text-white/75 transition hover:border-white/20"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? 'Copied!' : 'Copy report'}
                    </button>
                    <button
                      onClick={downloadCsv}
                      className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/40 px-4 py-1.5 text-xs font-bold text-white/75 transition hover:border-white/20"
                    >
                      <Download className="h-3.5 w-3.5" />
                      CSV
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {filtered.length === 0 && (
                    <p className="rounded-xl border border-white/[0.08] bg-black/40 p-4 text-sm text-white/60">
                      No images match this filter.
                    </p>
                  )}
                  {filtered.map((img, i) => (
                    <div
                      key={`${img.displaySrc}-${i}`}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-black/40 p-4"
                    >
                      {img.status === 'good' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />}
                      {img.status === 'empty' && <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />}
                      {img.status === 'missing' && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />}
                      <div className="min-w-0 flex-1">
                        <p className="break-all text-xs text-white/60">{img.displaySrc}</p>
                        {img.status === 'good' && (
                          <p className="mt-1 text-sm text-white/80">
                            <span className="font-bold text-primary">alt=</span>"{img.alt}"
                          </p>
                        )}
                        {img.status === 'empty' && (
                          <p className="mt-1 text-sm text-amber-300/90">
                            Empty alt attribute. Fine if decorative, add a description if the image carries meaning.
                          </p>
                        )}
                        {img.status === 'missing' && (
                          <p className="mt-1 text-sm text-red-300/90">
                            No alt attribute. Add a short, specific description of the image.
                          </p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                          img.status === 'good'
                            ? 'bg-primary/15 text-primary'
                            : img.status === 'empty'
                              ? 'bg-amber-400/15 text-amber-300'
                              : 'bg-red-400/15 text-red-300'
                        }`}
                      >
                        {img.status}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How the alt text checker works</h2>
        <div className="mt-8 space-y-4">
          {[
            {
              title: 'Enter the page URL',
              text: 'Paste the full address of any public page, including the https:// part. The tool works on any page that is publicly reachable, no login or signup needed.',
            },
            {
              title: 'The tool fetches and parses the HTML',
              text: 'Your URL is sent to our server, which fetches the raw HTML of the page and returns it. Your browser then parses every image tag and reads each src and alt attribute.',
            },
            {
              title: 'Every image gets a status',
              text: 'Each image is marked as good (descriptive alt text present), empty (alt="" which is correct for decorative images), or missing (no alt attribute at all). Relative image paths are resolved to full URLs.',
            },
            {
              title: 'You get a score and a fix list',
              text: 'The summary shows totals and a score out of 100. Use the filters to focus on missing alt text first, then review empty ones, and export the list as CSV for your backlog.',
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

      <AltTextCheckerArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Alt text checker FAQs</h2>
        <div className="mt-8 space-y-3">
          {ALT_TEXT_CHECKER_FAQS.map((faq, i) => (
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
          {RELATED_ALT.map((t) => (
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
            Want a full SEO audit, not just alt text?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Alt text is one piece of on-page SEO. Our free audit reviews your titles, headings, speed,
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
