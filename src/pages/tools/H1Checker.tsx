// META: title="Free H1 Checker: Find H1 Tags on Any Page"
// META: description="Check H1 tags on any URL free: count H1s, list every heading in order, and spot multiple-H1 and missing-H1 issues. No signup."

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Heading1,
  Link2,
  ListOrdered,
  Loader2,
  Search,
  XCircle,
} from 'lucide-react';

const H1CHECKER_FAQS = [
  {
    q: 'What does this H1 checker do?',
    a: 'This free H1 checker fetches any URL you enter and scans its HTML for all heading tags from H1 to H6. It counts how many H1 tags the page has, lists every heading in document order, and flags common problems such as a missing H1, multiple H1s, empty headings, and skipped heading levels. You also see the final URL and the HTTP status code, which helps you confirm the page actually loads before you audit it.',
  },
  {
    q: 'How many H1 tags should a page have?',
    a: 'The widely accepted best practice is one H1 tag per page. A single H1 gives the page a clear main topic for search engines and assistive technology. Having two or more H1s is not an automatic penalty, but it usually means the page is confusing about its topic, often because of a theme that prints the logo or a banner title as an H1. If the tool finds more than one, keep the one that describes the page content and demote the others to H2.',
  },
  {
    q: 'Is it a problem if a page has no H1 tag?',
    a: 'A missing H1 is one of the most common on page issues, and it is worth fixing. Without an H1, search engines and screen readers lose the strongest on page signal about what the page is about. The fix is simple: add one clear, descriptive H1 near the top of the content that summarizes the page topic. Use this checker after the fix to confirm the H1 is detected and appears only once.',
  },
  {
    q: 'What are skipped heading levels, and do they matter?',
    a: 'A skipped level happens when headings jump from one level to another without the step in between, for example an H2 followed directly by an H4. This breaks the logical outline of the page. It is a smaller SEO issue than a missing H1, but it matters for accessibility because screen readers use heading levels to navigate. The fix is usually just renaming the heading tags so the hierarchy runs in order.',
  },
  {
    q: 'Why does my page show a different number of headings than this tool?',
    a: 'The checker reads the HTML returned by the server, which is the same HTML Googlebot sees on the first crawl. Headings added later by JavaScript may not appear in this scan, which can actually be a useful warning: if important headings only exist after scripts run, some crawlers and tools may miss them. For critical content, prefer headings that are present in the raw HTML.',
  },
  {
    q: 'Can I use this H1 checker to audit a whole website?',
    a: 'Yes. Run the tool on each important template one by one: the homepage, category pages, product or service pages, and blog posts. Issues often come from the template itself, such as every page inheriting two H1s, so fixing one template can fix hundreds of pages at once. Record the results in a spreadsheet and prioritize high traffic pages first.',
  },
  {
    q: 'What is the difference between the H1 and the title tag?',
    a: 'The title tag appears in the browser tab and in search results, while the H1 is the visible headline on the page itself. They can be similar but should not always be identical: the title tag can target the search query, and the H1 can speak to the reader once they land. Both should describe the same topic, and both should be unique on every page.',
  },
  {
    q: 'Does this tool store the URLs I check?',
    a: 'No. The URL you enter is used only to fetch the page HTML for the check, and nothing is saved or logged by the tool itself. The check runs entirely in your browser session. You can audit competitor pages, client pages, or your own site without any signup or account.',
  },
];

interface HeadingItem {
  level: number;
  text: string;
}

interface CheckResult {
  finalUrl: string;
  status: number;
  headings: HeadingItem[];
  issues: { type: 'error' | 'warning'; message: string }[];
}

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url) return url;
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

function H1Checker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const id = 'rankvelt-h1-checker-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free H1 Checker',
          url: 'https://www.rankvelt.com/tools/h1-checker',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: H1CHECKER_FAQS.map((f) => ({
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
      const nodes = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headings: HeadingItem[] = Array.from(nodes).map((el) => ({
        level: parseInt(el.tagName.substring(1), 10),
        text: (el.textContent || '').trim().replace(/\s+/g, ' '),
      }));
      const issues: CheckResult['issues'] = [];
      const h1s = headings.filter((h) => h.level === 1);
      if (h1s.length === 0) {
        issues.push({
          type: 'error',
          message:
            'No H1 tag found. Every page should have exactly one H1 that describes the main topic of the page.',
        });
      } else if (h1s.length > 1) {
        issues.push({
          type: 'error',
          message: `Found ${h1s.length} H1 tags. Keep one H1 as the main topic and change the others to H2 or remove them.`,
        });
      }
      const emptyCount = headings.filter((h) => h.text.length === 0).length;
      if (emptyCount > 0) {
        issues.push({
          type: 'warning',
          message: `${emptyCount} empty heading${emptyCount > 1 ? 's' : ''} found. Headings with no text add nothing for SEO and can confuse screen readers.`,
        });
      }
      let prev = 0;
      let skipped = false;
      for (const h of headings) {
        if (prev > 0 && h.level > prev + 1) {
          skipped = true;
          break;
        }
        prev = h.level;
      }
      if (skipped) {
        issues.push({
          type: 'warning',
          message:
            'Skipped heading levels detected (for example H2 jumping to H4). Keep headings in order: H1, then H2, then H3.',
        });
      }
      setResult({
        finalUrl: data.finalUrl || target,
        status: data.status || 0,
        headings,
        issues,
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

  const h1Count = result ? result.headings.filter((h) => h.level === 1).length : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24">
      <section className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
          Free SEO Tool
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
          Free H1 Checker: Find H1 Tags on Any Page
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/75">
          Our free H1 tag checker scans any URL and shows every heading on the page in order,
          from H1 to H6. You will learn how to check H1 tags in seconds, see the exact count of
          H1s, and spot issues like multiple H1 tags, a missing H1, empty headings, and broken
          heading structure. No signup, no install, just paste the URL.
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
              {loading ? 'Checking...' : 'Check H1 Tags'}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-widest text-white/60">H1 tags found</p>
                  <p className={`mt-2 text-3xl font-black ${h1Count === 1 ? 'text-green-400' : 'text-amber-400'}`}>
                    {h1Count}
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-widest text-white/60">Total headings</p>
                  <p className="mt-2 text-3xl font-black text-white">{result.headings.length}</p>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-widest text-white/60">HTTP status</p>
                  <p className="mt-2 text-3xl font-black text-white">{result.status || 'N/A'}</p>
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-white/75">
                <p className="break-all">
                  <span className="font-bold text-white/60">Checked URL: </span>
                  {result.finalUrl}
                </p>
              </div>

              {result.issues.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white">Issues found</h3>
                  {result.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${
                        issue.type === 'error'
                          ? 'border-red-500/30 bg-red-500/10 text-red-200'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                      }`}
                    >
                      {issue.type === 'error' ? (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                      )}
                      <p>{issue.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>
                    Heading structure looks healthy: exactly one H1, no empty headings, and no
                    skipped levels.
                  </p>
                </div>
              )}

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                  <ListOrdered className="h-5 w-5 text-primary" />
                  All headings in document order
                </h3>
                {result.headings.length === 0 ? (
                  <p className="mt-3 text-sm text-white/60">
                    No heading tags were found in the page HTML.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {result.headings.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                      >
                        <span
                          className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-black ${
                            h.level === 1
                              ? 'bg-primary text-black'
                              : 'bg-white/10 text-white/75'
                          }`}
                        >
                          H{h.level}
                        </span>
                        <span className="text-sm text-white/75">
                          {h.text || <span className="italic text-amber-300">(empty heading)</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
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
          How to check H1 tags on any page
        </h2>
        <div className="mt-8 space-y-6">
          {[
            {
              title: 'Paste the page URL',
              body: 'Enter the full address of the page you want to audit, including https://. You can check your own pages, client pages, or competitor pages. The tool works with any publicly accessible URL.',
            },
            {
              title: 'We fetch and parse the page HTML',
              body: 'The checker requests the page and reads its raw HTML, which is the same source search engine crawlers see on their first pass. It then extracts every H1 through H6 tag in the order they appear in the document.',
            },
            {
              title: 'Review the counts and issue flags',
              body: 'You get an H1 count, a total heading count, and the HTTP status code. If the page has zero H1s, multiple H1s, empty headings, or skipped levels, each issue is flagged with an explanation of why it matters.',
            },
            {
              title: 'Read the full heading outline',
              body: 'The complete list shows every heading with its level badge, so you can see the page outline at a glance. Look for a single clear H1 followed by logical H2 and H3 sections, which is the shape of a well structured page.',
            },
            {
              title: 'Fix and recheck',
              body: 'Edit the page in your CMS or code to fix any flagged issues, then run the check again to confirm. When auditing a site, repeat this on each important template, since heading issues usually come from the template rather than individual pages.',
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

      <H1CheckerArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Frequently asked questions about H1 tags
        </h2>
        <div className="mt-8 space-y-3">
          {H1CHECKER_FAQS.map((f, i) => (
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
              slug: 'canonical-checker',
              title: 'Canonical Checker',
              desc: 'Verify the canonical tag on any URL: present, missing, or pointing elsewhere.',
            },
            {
              slug: 'meta-title-description-checker',
              title: 'Meta Title & Description Checker',
              desc: 'Check title tags and meta descriptions on any page with length guidance.',
            },
            {
              slug: 'title-tag-preview',
              title: 'Title Tag Preview',
              desc: 'Preview how your title tag looks in Google search results.',
            },
            {
              slug: 'bulk-http-status-checker',
              title: 'Bulk HTTP Status Checker',
              desc: 'Check status codes for many URLs at once and find broken pages fast.',
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
        <Heading1 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
          Heading issues are only the start
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/75">
          A clean heading structure is one part of a healthy site. Get a free SEO audit from
          RankVelt and see every issue holding your rankings back, from technical errors to
          content gaps.
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

function H1CheckerArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What is an H1 tag?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            An H1 tag is the HTML element that marks the main headline of a page. In the code it
            looks like this: <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">&lt;h1&gt;Your headline here&lt;/h1&gt;</code>.
            Browsers render it as the largest heading by default, and search engines treat it as
            the strongest on page signal about the page topic.
          </p>
          <p>
            Below the H1 sit the subheadings: H2 for major sections, H3 for subsections under
            each H2, and H4 through H6 for deeper nesting. Together these are called SEO H tags,
            and a well built page uses them to form a logical outline, exactly like the chapter
            and section titles of a book.
          </p>
          <p>
            This outline does two jobs. For readers, it makes long pages scannable and easy to
            skim. For search engines and assistive technology like screen readers, it explains
            the hierarchy of the content: what is the main idea, what supports it, and what
            belongs inside which section. That is why heading SEO matters far beyond styling.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Why it matters
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why H1 tags matter for SEO and your business
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Google has repeatedly confirmed that heading tags are used to understand page
            structure and content. They are not the most powerful ranking factor on their own,
            but they shape how well a page communicates its topic. A page with a clear,
            descriptive H1 tag for SEO helps Google match it to the right queries, which is the
            foundation of ranking for anything.
          </p>
          <p>
            The business impact shows up in concrete ways. When each page has one strong H1 that
            matches what searchers are looking for, click through rates improve because the
            snippet and the page feel consistent. Bounce rates tend to fall because visitors
            immediately see the headline they expected. And content teams write better pages
            when the heading outline forces them to organize their thinking before publishing.
          </p>
          <p>
            There is also an accessibility angle that many site owners miss. Screen reader users
            navigate pages by jumping between headings, and a missing or duplicated H1 makes
            that navigation confusing. Accessible pages reach more people, and accessibility is
            increasingly part of how quality is judged online. Getting the heading structure
            right is one of the cheapest wins in technical SEO.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Using the tool
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to find H1 tags on a page with this checker
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Manually checking headings means opening the page source and searching for
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">&lt;h1&gt;</code>
            tags, which is slow and error prone on large pages. This H1 tag checker automates
            the whole process: paste any URL, and it returns the H1 count, the full heading
            outline in document order, and automatic flags for the most common problems.
          </p>
          <p>
            The checker reads the HTML exactly as a search engine crawler receives it from the
            server. That makes it honest about what is really there. If a heading is injected
            by JavaScript after the page loads, the tool will not see it, which tells you
            something valuable: crawlers may have the same blind spot, so important headings
            should live in the raw HTML.
          </p>
          <p>
            Use the tool regularly, not just once. Run a <a href="/blog/website-redesign-seo-checklist" className="text-primary underline">heading audit</a> on
            your key templates after any redesign, theme change, or migration, because these
            are the moments when heading structure silently breaks. Five minutes of checking
            can catch issues that would otherwise sit on your site for months.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Reading results
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to read your H1 checker results
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Start with the H1 count. The number you want is exactly one. If the tool reports
            zero, the page has no main headline, and adding one is your top priority. If it
            reports two or more, you have multiple H1 tags competing for the topic, and you
            should keep the strongest one and demote the rest to H2.
          </p>
          <p>
            Next, scan the full heading list in document order. It should read like a table of
            contents: one H1, followed by H2 sections, with H3 items nested under the right H2.
            If the order jumps around, the outline is broken and the page will be harder for
            both readers and crawlers to follow.
          </p>
          <p>
            Pay attention to the warning flags. Empty headings are usually leftover template
            code, such as a heading element that only appears when a banner is published, and
            they should be removed or given real text. Skipped levels, like an H2 followed
            directly by an H4, are easy to fix by renumbering the tags. Finally, check the
            HTTP status and final URL: a page that redirects or errors needs attention before
            any heading work matters.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Common H1 mistakes we see on real websites
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The most common mistake is the missing H1. It happens when a theme uses a styled
            div for the visible headline instead of a real H1, or when a page builder makes the
            main title a plain paragraph. The page looks fine to visitors but has no headline
            in the code. This H1 checker catches it instantly.
          </p>
          <p>
            The second most common is the duplicate H1, usually caused by the site logo or a
            hero banner carrying an H1 on every page. On a blog, that can mean the site name is
            the H1 and the article title is also an H1, which dilutes the topic signal. Check
            your template files: one small change there can fix the issue across the whole site.
          </p>
          <p>
            Other frequent problems include H1s stuffed with keywords instead of written for
            humans, identical H1s reused across many pages, and H1 text that does not match
            the title tag or the page content. A good rule: if you read the H1 aloud and a
            stranger could guess what the page is about, it is probably right.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Best practices
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          H1 tag SEO best practices for a strong heading structure
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Write one clear, descriptive H1 per page and place it near the top of the main
            content. Include the topic or keyword the page targets, but write it as a natural
            headline a human would click. Keep it focused: twenty to seventy characters is a
            practical range for most pages.
          </p>
          <p>
            Build a <a href="/blog/structured-website-design" className="text-primary underline">semantic heading structure</a> beneath
            it. Use a single H1, H2 tags for the main sections, and H3 tags for subsections.
            Do not use headings for styling: if you want big bold text that is not a real
            section title, use CSS instead. Every heading should earn its place by describing
            the content that follows it.
          </p>
          <p>
            Keep every H1 unique across your site, and make sure it agrees with the title tag
            and the page content. On blog posts, the article title is usually the natural H1.
            On product or service pages, the H1 should name the offer clearly. Avoid generic
            headlines like "Welcome" or "Our Services" as your H1, because they tell search
            engines nothing about the page.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Action plan
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          When to act on heading issues
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Fix a missing H1 or multiple H1s immediately on pages that matter: your homepage,
            main service or category pages, and any page that already gets organic traffic.
            These are high impact fixes that take minutes and remove ambiguity about what
            each page is about.
          </p>
          <p>
            Treat skipped levels and empty headings as second priority. Fix them when you are
            already editing the page, or batch them during a template cleanup. They are real
            quality issues, especially for accessibility, but they rarely move rankings on
            their own.
          </p>
          <p>
            Make heading checks part of your publishing workflow. Add the H1 check to your
            pre-publish checklist for every new page and post, and re-run a full audit after
            redesigns, theme updates, or CMS migrations. Heading SEO is not a one time task;
            it is maintenance that keeps your site's structure clean as it grows.
          </p>
        </div>
      </section>
    </>
  );
}

export default H1Checker;
