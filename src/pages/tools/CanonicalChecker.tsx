// META: title="Free Canonical Checker: Verify Canonical Tags on Any URL"
// META: description="Check the canonical tag on any page free: see if it is self-referencing, missing, or pointing elsewhere. No signup."

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Link2,
  Loader2,
  Search,
  Tags,
  XCircle,
} from 'lucide-react';

const CANONICALCHECKER_FAQS = [
  {
    q: 'What does this canonical checker do?',
    a: 'This free canonical tag checker fetches any URL you enter and reads the canonical link tag in its HTML. It tells you whether a canonical is present or missing, whether it is an absolute or relative URL, whether it is self-referencing or points to a different page, and it warns you if the page contains more than one canonical tag. You also see the final URL and HTTP status for context.',
  },
  {
    q: 'What is a self-referencing canonical?',
    a: 'A self-referencing canonical is a canonical tag that points to the page own URL, for example a product page whose canonical is the product page itself. This is the recommended default for almost every page because it protects against duplicate content caused by URL parameters, tracking codes, and HTTP/HTTPS or www variants. If the checker shows your canonical as self-referencing and absolute, that is the ideal result for a unique page.',
  },
  {
    q: 'Is it bad if a page has no canonical tag?',
    a: 'A missing canonical is not an emergency, but it is a missed layer of protection. Without one, search engines must guess which version of a URL is the original whenever duplicates appear, such as paginated pages, filtered category pages, or URLs with tracking parameters. Adding a self-referencing canonical to every page is a simple safeguard that most SEO plugins and CMS platforms can apply automatically.',
  },
  {
    q: 'Can a canonical tag point to a different page?',
    a: 'Yes, and that is its main job in duplicate content situations. When two pages are near duplicates, the weaker page can carry a canonical pointing to the stronger page, telling search engines to consolidate ranking signals there. Just make sure the target page is genuinely similar: pointing a canonical at an unrelated page is treated as a mistake and is usually ignored by search engines.',
  },
  {
    q: 'Should canonical URLs be absolute or relative?',
    a: 'Always use absolute URLs in canonical tags, including the protocol and domain, like https://example.com/page rather than /page. Google officially recommends absolute canonicals because relative ones are easier to misinterpret, especially on sites served across multiple domains or subdomains. If this checker flags a relative canonical, convert it to the full absolute URL.',
  },
  {
    q: 'Why does the checker warn about multiple canonical tags?',
    a: 'When a page contains two or more canonical tags, search engines receive conflicting instructions and typically pick one unpredictably, or ignore both. This usually happens when an SEO plugin and the theme each add their own canonical, or when a canonical is hardcoded in the template and also injected by a plugin. The fix is to leave exactly one canonical tag in the page head.',
  },
  {
    q: 'How is a canonical tag different from a 301 redirect?',
    a: 'A canonical tag is a hint, not a directive: the page stays live and users can still visit it, while search engines are asked to treat another URL as the original. A 301 redirect physically sends users and crawlers to the new URL and passes most of the ranking signals. Use redirects for permanently moved or deleted pages, and canonicals for duplicates that must stay accessible, like filtered or paginated views.',
  },
  {
    q: 'Does this tool store the URLs I check?',
    a: 'No. The URL you enter is used only to fetch the page HTML for the check, and nothing is saved or logged by the tool itself. The check runs entirely in your browser session, so you can audit your own pages, client pages, or competitor pages without a signup or account.',
  },
];

interface CheckResult {
  finalUrl: string;
  status: number;
  canonicals: string[];
}

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url) return url;
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

function resolveCanonical(value: string, base: string): string {
  try {
    return new URL(value, base).href;
  } catch {
    return value;
  }
}

function stripFragment(url: string): string {
  return url.split('#')[0];
}

function CanonicalChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const id = 'rankvelt-canonical-checker-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Canonical Checker',
          url: 'https://www.rankvelt.com/tools/canonical-checker',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: CANONICALCHECKER_FAQS.map((f) => ({
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

  async function runCheck() {
    setError(null);
    setResult(null);
    const target = normalizeUrl(url);
    if (!target) {
      setError('Please enter a URL to check.');
      return;
    }
    try {
      new URL(target);
    } catch {
      setError('That does not look like a valid URL. Check the address and try again.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/fetch-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'The page could not be fetched.');
      }
      const doc = new DOMParser().parseFromString(data.html || '', 'text/html');
      const links = Array.from(doc.querySelectorAll('link[rel]'));
      const canonicals = links
        .filter((el) =>
          (el.getAttribute('rel') || '').split(/\s+/).some((t) => t.toLowerCase() === 'canonical')
        )
        .map((el) => el.getAttribute('href') || '');
      setResult({
        finalUrl: data.finalUrl || target,
        status: data.status || 0,
        canonicals,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Something went wrong while fetching the page. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function verdict() {
    if (!result) return null;
    const { canonicals, finalUrl } = result;
    if (canonicals.length === 0) {
      return {
        kind: 'warning' as const,
        title: 'Canonical tag missing',
        body: 'This page has no canonical tag. Add a self-referencing absolute canonical to protect the page against duplicate URL variants.',
      };
    }
    if (canonicals.length > 1) {
      return {
        kind: 'error' as const,
        title: `${canonicals.length} canonical tags found`,
        body: 'Multiple canonical tags send conflicting signals. Keep exactly one canonical tag in the page head so search engines get a single clear instruction.',
      };
    }
    const raw = canonicals[0].trim();
    if (!raw) {
      return {
        kind: 'error' as const,
        title: 'Canonical tag is empty',
        body: 'The canonical tag exists but has no href value. An empty canonical is useless: fill it with the full absolute URL of the preferred page version.',
      };
    }
    const resolved = resolveCanonical(raw, finalUrl);
    const isAbsolute = /^https?:\/\//i.test(raw);
    const selfRef =
      stripFragment(resolved).toLowerCase() === stripFragment(finalUrl).toLowerCase();
    if (!isAbsolute) {
      return {
        kind: 'warning' as const,
        title: selfRef ? 'Self-referencing but relative' : 'Relative canonical URL',
        body: 'The canonical uses a relative URL. Convert it to an absolute URL with the full protocol and domain to avoid misinterpretation.',
      };
    }
    if (selfRef) {
      return {
        kind: 'ok' as const,
        title: 'Self-referencing canonical detected',
        body: 'This page points its canonical at itself with an absolute URL. That is the correct setup for a unique page.',
      };
    }
    return {
      kind: 'info' as const,
      title: 'Canonical points to a different page',
      body: 'This page asks search engines to treat another URL as the original. That is correct for near duplicates, but make sure the target page is genuinely similar content.',
    };
  }

  const v = verdict();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24">
      <section className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
          Free SEO Tool
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
          Free Canonical Checker: Verify Canonical Tags on Any URL
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/75">
          Our free canonical tag checker reads the canonical URL of any page in seconds. You will
          see whether the canonical is missing, self-referencing, or pointing elsewhere, whether
          it uses an absolute or relative URL, and whether the page has conflicting multiple
          canonical tags. No signup, no install, just paste the URL.
        </p>

        <div className="mt-8 rounded-xl border border-white/[0.08] bg-black/20 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runCheck();
                }}
                placeholder="https://example.com/page"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              onClick={runCheck}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              {loading ? 'Checking...' : 'Check Canonical'}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && v && (
            <div className="mt-6 space-y-6">
              <div
                className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${
                  v.kind === 'ok'
                    ? 'border-green-500/30 bg-green-500/10 text-green-200'
                    : v.kind === 'error'
                      ? 'border-red-500/30 bg-red-500/10 text-red-200'
                      : v.kind === 'warning'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                        : 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                }`}
              >
                {v.kind === 'ok' ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                ) : v.kind === 'error' ? (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                )}
                <div>
                  <p className="font-bold">{v.title}</p>
                  <p className="mt-1">{v.body}</p>
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-white/75">
                <p className="break-all">
                  <span className="font-bold text-white/60">Checked URL: </span>
                  {result.finalUrl}
                </p>
                <p className="mt-2">
                  <span className="font-bold text-white/60">HTTP status: </span>
                  {result.status || 'N/A'}
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                  <Tags className="h-5 w-5 text-primary" />
                  Canonical tag details
                </h3>
                {result.canonicals.length === 0 ? (
                  <p className="mt-3 text-sm text-white/60">
                    No link tag with rel="canonical" was found in the page head.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {result.canonicals.map((c, i) => {
                      const raw = c.trim();
                      const isAbsolute = /^https?:\/\//i.test(raw);
                      const resolved = raw ? resolveCanonical(raw, result.finalUrl) : '(empty)';
                      const selfRef =
                        raw &&
                        stripFragment(resolved).toLowerCase() ===
                          stripFragment(result.finalUrl).toLowerCase();
                      return (
                        <li
                          key={i}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4"
                        >
                          <code className="block break-all text-sm text-white">
                            &lt;link rel="canonical" href="{raw || '(empty)'}" /&gt;
                          </code>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span
                              className={`rounded px-2 py-1 font-bold ${
                                isAbsolute
                                  ? 'bg-green-500/20 text-green-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {isAbsolute ? 'Absolute URL' : 'Relative URL'}
                            </span>
                            {raw && (
                              <span
                                className={`rounded px-2 py-1 font-bold ${
                                  selfRef
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}
                              >
                                {selfRef ? 'Self-referencing' : 'Points elsewhere'}
                              </span>
                            )}
                          </div>
                          {raw && (
                            <p className="mt-2 break-all text-xs text-white/60">
                              Resolved: {resolved}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {result.canonicals.length > 1 && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                      Multiple canonical tags found. Search engines will treat this as
                      conflicting guidance. Remove all but one canonical tag.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to check a canonical tag on any page
        </h2>
        <div className="mt-8 space-y-6">
          {[
            {
              title: 'Paste the page URL',
              body: 'Enter the full address of the page you want to inspect, including https://. You can check your own pages, client pages, or competitor pages. Any publicly accessible URL works.',
            },
            {
              title: 'We fetch the page and extract the canonical',
              body: 'The checker requests the page HTML and searches the head section for every link tag with rel="canonical". It reads each one exactly as a search engine crawler would see it on the first pass.',
            },
            {
              title: 'Get a plain verdict',
              body: 'You get a clear verdict: missing, empty, self-referencing, pointing elsewhere, or multiple conflicting tags. The verdict explains what the result means and what to do about it in plain language.',
            },
            {
              title: 'Inspect the raw tag details',
              body: 'The details section shows the exact canonical markup, whether the URL is absolute or relative, whether it resolves to the page itself or somewhere else, and the resolved URL for relative tags.',
            },
            {
              title: 'Fix and verify',
              body: 'Correct the canonical in your CMS, SEO plugin, or template, then run the check again to confirm. When auditing a whole site, check each major template, since canonical issues are usually template level and repeat across hundreds of pages.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex gap-5 rounded-xl border border-white/[0.08] bg-black/20 p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-black text-black">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CanonicalCheckerArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Frequently asked questions about canonical tags
        </h2>
        <div className="mt-8 space-y-3">
          {CANONICALCHECKER_FAQS.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.08] bg-black/20"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-bold text-white">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-primary transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-white/75">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Keep auditing
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Related free tools</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              slug: 'h1-checker',
              title: 'H1 Checker',
              desc: 'Count H1 tags on any page and list every heading in document order.',
            },
            {
              slug: 'meta-title-description-checker',
              title: 'Meta Title & Description Checker',
              desc: 'Check title tags and meta descriptions on any page with length guidance.',
            },
            {
              slug: 'robots-txt-generator',
              title: 'Robots.txt Generator',
              desc: 'Generate a correct robots.txt file for your site in seconds.',
            },
            {
              slug: 'xml-sitemap-generator',
              title: 'XML Sitemap Generator',
              desc: 'Create an XML sitemap to help search engines crawl your site.',
            },
          ].map((t) => (
            <a
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group rounded-xl border border-white/[0.08] bg-black/20 p-5 transition hover:border-primary/50"
            >
              <h3 className="font-bold text-white group-hover:text-primary">{t.title}</h3>
              <p className="mt-2 text-sm text-white/60">{t.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/[0.08] bg-black/20 p-8 text-center sm:p-12">
        <Tags className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
          Canonicals are one piece of the puzzle
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/75">
          Duplicate content is only one thing that can hold your rankings back. Get a free SEO
          audit from RankVelt and see every technical issue on your site, explained in plain
          language with clear next steps.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/strategy-call"
            className="rounded-lg bg-primary px-8 py-3 font-bold text-black transition hover:opacity-90"
          >
            Get a Free SEO Audit
          </a>
          <a
            href="/tools"
            className="rounded-lg border border-white/[0.08] px-8 py-3 font-bold text-white transition hover:border-primary/50"
          >
            Browse All Tools
          </a>
        </div>
      </section>
    </main>
  );
}

function CanonicalCheckerArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What is a canonical tag?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A canonical tag is a small piece of HTML in the head of a page that names the
            preferred version of that page. It looks like this:{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">&lt;link rel="canonical" href="https://example.com/page" /&gt;</code>.
            It tells search engines which URL should receive the ranking credit when the same
            or very similar content can be reached through more than one address.
          </p>
          <p>
            Duplicate URLs appear constantly without anyone doing anything wrong. A category
            page with sorting options, a product page with a session parameter, or the same
            page served with and without www are all duplicates in the eyes of a crawler.
            The canonical tag is how you vote for the one true version among them.
          </p>
          <p>
            It is important to understand that a canonical is a strong hint, not a command.
            Search engines usually respect it, but they can choose a different canonical if
            the pages are not similar or if other signals disagree. Getting canonical tag SEO
            right means giving search engines consistent, honest signals across your site.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Why it matters
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why canonical tags matter for SEO and your business
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Without canonicals, ranking signals get split. Imagine a product page that can be
            reached through four different URLs. Links and authority flow to all four
            versions, so none of them ranks as well as a single consolidated page would. A
            correct canonical URL tells search engines to pool those signals on the version
            you chose.
          </p>
          <p>
            The business cost of ignoring this is quiet but real. Pages compete with their own
            duplicates for the same queries, which drags down visibility for product and
            category pages that should be earning revenue. On ecommerce sites especially, one
            bad canonical setup on a template can affect thousands of product URLs at once.
          </p>
          <p>
            There is also a crawl efficiency angle. When search engines do not have to crawl
            dozens of duplicate variants of every page, they spend their crawl budget on your
            pages that actually matter: new products, new articles, updated landing pages.
            Clean canonicalization is one of the foundations of a site that scales.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Using the tool
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to check canonical tags with this canonical checker
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Finding the canonical by hand means viewing the page source and searching for
            rel="canonical", which is tedious when you audit many pages. This canonical URL
            checker does it for you: paste any URL and it reports the exact canonical markup,
            whether it is absolute or relative, whether it is self-referencing or points
            elsewhere, and whether multiple canonicals are fighting each other.
          </p>
          <p>
            Like any honest canonical link checker, it reads the HTML the server sends, which
            is what crawlers see on their first pass. The final URL and HTTP status are shown
            alongside the result, so you can tell whether you are checking the page you
            intended or a redirect target.
          </p>
          <p>
            Make this part of your regular audits. Run a <a href="/blog/website-redesign-seo-checklist" className="text-primary underline">canonical audit</a> after
            redesigns, platform migrations, and SEO plugin changes, since those are the
            moments when canonicals break or duplicate. On Shopify stores, where variant
            URLs multiply fast, keep an eye on <a href="/blog/shopify-seo-checklist" className="text-primary underline">canonical tags</a> as part of your
            routine checks.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Reading results
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to read your canonical check results
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The best result is a self-referencing canonical with an absolute URL. That means
            the page points at itself using the full address, which is the recommended
            default for every unique page. If you see this on a page that has no duplicates,
            there is nothing to fix.
          </p>
          <p>
            A canonical pointing to a different page is correct when the two pages are near
            duplicates, such as a filtered view canonicalizing to the main category page. Read
            it critically: if the target page is unrelated content, the canonical will be
            ignored and you have a setup error to fix.
          </p>
          <p>
            Treat relative canonicals and multiple canonicals as bugs, not preferences.
            Relative canonicals should be rewritten as absolute URLs to remove any ambiguity.
            Multiple canonical tags should be reduced to exactly one, usually by removing the
            duplicate added by a theme or a second SEO plugin. A missing canonical deserves a
            self-referencing tag added through your CMS or SEO plugin.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Common canonical tag mistakes on real websites
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The most frequent mistake is pointing every page at the homepage. Site owners do
            this thinking it concentrates authority, but it actually tells search engines that
            every page is a duplicate of the homepage. The result is usually that the
            canonicals are ignored and the pages keep competing with each other.
          </p>
          <p>
            The second classic is the plugin pileup: an SEO plugin adds one canonical while
            the theme hardcodes another. Both render in the head, and crawlers receive
            conflicting instructions. If this checker ever shows two canonical tags on your
            pages, inspect your theme and plugin settings and disable one source.
          </p>
          <p>
            Other common errors include canonicals pointing to redirected URLs instead of the
            final destination, canonical chains where page A points to B and B points to C,
            and canonicals on paginated series that all point to page one, which can hide the
            deeper pages from the index. Each of these is easy to spot once you check
            regularly.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Best practices
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Canonical tag SEO best practices
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Start with the default that fits almost every page: a self-referencing canonical
            using the absolute URL. Most modern SEO plugins can add this automatically to every
            page, post, product, and category. Turn that setting on once and most of your
            canonical work is done.
          </p>
          <p>
            Reserve cross-page canonicals for genuine near duplicates: syndicated copies,
            printer friendly versions, filtered or sorted views, and landing page variants
            used for testing. The canonical target should be the version you want in the
            search results, and the content should be substantially the same. Never canonical
            a page to an unrelated page just to concentrate link equity.
          </p>
          <p>
            Keep your signals consistent. The canonical URL should match the URL you use in
            your sitemap and internal links, it should return a 200 status rather than
            redirecting, and it should use HTTPS if that is your site standard. Mixed signals
            give search engines a reason to pick a different canonical than the one you
            declared.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Action plan
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          When to act on canonical issues
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Fix multiple canonical tags and homepage pointing canonicals immediately. These
            are actively harmful configurations that confuse crawlers on every page they
            touch, and they are usually template level, so one fix repairs the whole site.
          </p>
          <p>
            Add missing canonicals and convert relative canonicals to absolute as your next
            pass. These are protective fixes rather than emergencies, but they close the gaps
            that URL parameters, tracking codes, and duplicate variants exploit over time.
          </p>
          <p>
            Review cross-page canonicals whenever you restructure content: after merging
            pages, retiring products, or launching filtered navigation. A canonical that made
            sense last year may now point at a page that no longer exists or no longer
            matches. A quick canonical check of your important templates each quarter keeps
            the whole system honest.
          </p>
        </div>
      </section>
    </>
  );
}

export default CanonicalChecker;
