// RankVelt tool page: Bulk Email Extractor (100% free, no paid APIs)
// Place at: src/pages/tools/BulkEmailExtractor.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).

import { useEffect, useState } from 'react';
import { Sparkles, MailSearch, ShieldCheck } from 'lucide-react';

const EXTRACTOR_FAQS = [
  {
    q: 'Is this bulk email extractor really free?',
    a: 'Yes. The extractor runs on the free tier of GitHub Actions and uses no paid APIs. You bring your own Google Sheet and a free GitHub account, and the worker checks your websites and writes the results back into the sheet.',
  },
  {
    q: 'Which pages does the extractor check on each website?',
    a: 'For each site it loads the homepage, then the most likely contact locations: /contact, /contact-us, /about and /about-us. It also follows up to two relevant links from the homepage and checks likely pages discovered through the sitemap. It stays on the same domain and does not crawl the whole website.',
  },
  {
    q: 'Why did some websites return no email?',
    a: 'Some businesses only use contact forms, hide addresses behind logins, load them with JavaScript, or the site was unreachable during the run. In those cases the row is marked done-no-email, which is honest output: the tool only reports addresses a website actually publishes.',
  },
  {
    q: 'How many websites can I process at once?',
    a: 'Work in batches. The sheet limit is 1500 websites per run, and the worker pauses briefly after every 100 websites to reduce blocking risk. For a large list, split it across several runs or sheets.',
  },
  {
    q: 'Do I need to keep this page open while it runs?',
    a: 'No. Once you press Start, the worker runs in the cloud on GitHub Actions. You can close the page; results keep appearing in your Google Sheet as they are found.',
  },
  {
    q: 'What format does my Google Sheet need?',
    a: 'Use a tab named Websites with three columns in the first row: Website, Emails, Status. Put one website per row in the Website column and leave the rest empty. Share the sheet with the service account email as an Editor.',
  },
  {
    q: 'Can I stop and resume a run?',
    a: 'Yes. You can stop the run from GitHub Actions at any time. Pressing Start again resumes from the rows that are still empty, so no website is checked twice.',
  },
  {
    q: 'Is collecting published emails allowed?',
    a: 'The tool only collects email addresses that businesses publish publicly on their own websites. How you use them is your responsibility: send relevant, permission-aware outreach, include an opt-out, and follow the laws that apply to you, such as CAN-SPAM or GDPR. This is general information, not legal advice.',
  },
];

const inputCls =
  'mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50';

const labelCls =
  'block text-[11px] font-black uppercase tracking-[0.18em] text-white/50';

export default function BulkEmailExtractor() {
  const [sheetInput, setSheetInput] = useState('');
  const [tab, setTab] = useState('Websites');
  const [limit, setLimit] = useState('');
  const [triggerKey, setTriggerKey] = useState(
    () => (typeof localStorage !== 'undefined' ? localStorage.getItem('rv-worker-key') || '' : '')
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQPage JSON-LD built from the same FAQ array rendered below.
  useEffect(() => {
    document.getElementById('rankvelt-email-extractor-schema')?.remove();
    const schemaScript = document.createElement('script');
    schemaScript.id = 'rankvelt-email-extractor-schema';
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: EXTRACTOR_FAQS.map((faq) => ({
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

  function sheetIdFrom(input: string): string {
    const m = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return m ? m[1] : input.trim();
  }

  async function start() {
    const sheetId = sheetIdFrom(sheetInput);
    if (!sheetId) {
      setIsError(true);
      setMessage('Please paste your Google Sheet link or Sheet ID first.');
      return;
    }
    if (!triggerKey.trim()) {
      setIsError(true);
      setMessage('Please enter your private trigger key.');
      return;
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem('rv-worker-key', triggerKey.trim());
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/dispatch-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId,
          tab: tab.trim() || 'Websites',
          limit: limit.trim() || '0',
          key: triggerKey.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start');
      setIsError(false);
      setMessage(data.message + ' You can close this page, the sheet keeps updating on its own.');
    } catch (e: any) {
      setIsError(true);
      setMessage(e.message || 'Something went wrong starting the worker.');
    } finally {
      setBusy(false);
    }
  }

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
            Bulk Email <span className="text-gradient-gold">Extractor</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            Paste a Google Sheet full of websites, press Start, and this tool crawls every
            site, pulls emails from contact pages, and writes them back into your sheet, row
            by row. Free, no paid APIs, no signup.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MailSearch size={20} />
              </span>
              <h2 className="text-xl font-black text-white">Start a run</h2>
            </div>

            <div className="mt-6">
              <label className={labelCls}>Google Sheet link or ID</label>
              <input
                value={sheetInput}
                onChange={(e) => setSheetInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className={inputCls}
              />
            </div>

            <div className="mt-4">
              <label className={labelCls}>
                Trigger key <span className="font-medium normal-case tracking-normal text-white/30">(private, only you know this)</span>
              </label>
              <input
                type="password"
                value={triggerKey}
                onChange={(e) => setTriggerKey(e.target.value)}
                placeholder="Your private trigger key"
                className={inputCls}
              />
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                The page is public for SEO, but nobody can start a run without your key.
                Saved only in your own browser. Share the sheet with the service account
                email as Editor (one time setup, see guide below).
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Tab name</label>
                <input
                  value={tab}
                  onChange={(e) => setTab(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Limit per run</label>
                <input
                  value={limit}
                  onChange={(e) => setLimit(e.target.value.replace(/\D/g, ''))}
                  placeholder="0 = all"
                  className={inputCls}
                />
              </div>
            </div>

            <button
              onClick={start}
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Starting...' : 'Start Extraction'}
            </button>

            {message && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                  isError
                    ? 'border-red-500/30 bg-red-500/[0.07] text-red-300'
                    : 'border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-300'
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck size={20} />
              </span>
              <h2 className="text-xl font-black text-white">How it works</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>Make a Google Sheet with one website per row in column A (header: Website, Emails, Status).</li>
              <li>Paste the sheet link above and press Start. The worker runs on free cloud runners.</li>
              <li>Every 100 websites it pauses briefly so no IP gets blocked. Emails appear in your sheet as they are found.</li>
              <li>Stop anytime. Press Start again and it resumes exactly where it left off, nothing is repeated.</li>
            </ol>

            <h3 className="mt-8 text-lg font-black text-white">One time setup</h3>
            <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>Create a free Google Cloud service account and download its JSON key.</li>
              <li>Share your sheet with the service account email as an Editor.</li>
              <li>Add the JSON key as a GitHub secret named GOOGLE_SERVICE_ACCOUNT_JSON.</li>
              <li>Add GITHUB_TOKEN, GITHUB_REPO and WORKER_TRIGGER_SECRET in Vercel project settings.</li>
            </ol>
          </div>
        </section>
      <BulkEmailExtractorArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {EXTRACTOR_FAQS.map((f, i) => (
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
                { href: '/tools/guest-post-finder', name: 'Guest Post Finder' },
                { href: '/tools/bulk-redirect-generator', name: 'Bulk Redirect Generator' },
                { href: '/tools/title-tag-preview', name: 'Title Tag Preview' },
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
            <h2 className="text-2xl font-black text-white">Need Leads That Actually Convert?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              A list of emails is only the start. RankVelt builds the pages, content, and SEO behind
              outreach that gets replies. Get a free SEO audit and we will show you the gaps first.
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
function BulkEmailExtractorArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">HOW IT WORKS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What a Bulk Email Extractor Actually Does</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A bulk email extractor is a tool that visits a list of websites and pulls out the email addresses published on their pages. Instead of opening hundreds of sites by hand and copying addresses one by one, you give the tool a list of domains and it handles the repetitive visiting and scanning. The tool loads each page, scans the visible text and page source for anything shaped like an email address, and records every match.</p>
          <p>Most extractors look beyond the homepage. A business that wants to hear from customers usually publishes an address on its contact page, and many also list one in the footer, on the about page, or next to individual team members. A capable extractor walks through these likely spots instead of stopping at the front door, and some also check the sitemap for contact and about pages hidden from the navigation.</p>
          <p>It helps to understand what these tools cannot do. They cannot log into private areas, read contact forms, or invent addresses. They only collect addresses a website has chosen to publish in the open. If a company keeps its emails behind a form or a login wall, an honest extractor reports that nothing was found, which is really a strength: every address you receive is one the business intended people to use.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FINDING EMAILS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Where Business Contact Emails Actually Live on Websites</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>If you know where to look, you can predict what an extractor will find before you ever run it. The most common home for a public email is the contact page, usually at addresses like /contact or /contact-us. About pages are the second most common spot, especially for small businesses where the owner writes a personal bio and invites direct messages. Footers come third: many sites repeat a general inbox such as info@ or hello@ at the bottom of every page.</p>
          <p>Team and staff pages deserve special attention. Agencies, law firms, clinics, and software companies often list each person with a direct address, or at least a consistent pattern you can learn from. Press and media pages are another reliable source, since companies want journalists to reach them quickly. Career pages sometimes expose a hiring inbox too, though that address belongs to recruiting rather than sales, and pitching it is a fast way to get ignored.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>The contact page and its regional variants, such as /contact, /contact-us, and /contacts</li>
            <li>About pages, including /about-us, /our-team, and /meet-the-team</li>
            <li>The site footer, which often repeats a general inbox on every page</li>
            <li>Press, media, and newsroom pages built for journalists</li>
            <li>Legal pages, where a privacy or terms page sometimes names a data contact</li>
            <li>The sitemap, which lists pages the navigation menu hides</li>
          </ul>
          <p>Recognizing these patterns also helps you judge list quality. An extractor that only scans homepages will miss most of this. One that walks contact, about, and team pages plus the sitemap will return a much fuller picture of who is actually reachable.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">THE WORKFLOW</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Running a Sheet-Based Extraction, Step by Step</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>This tool takes a different approach from the usual browser extension. Instead of scanning one page at a time while you click around, it works from a Google Sheet and processes your whole list in the background. You put one website per row in the first column, share the sheet with the tool's service account, paste the sheet link into the page above, and press Start. From there the work happens on free cloud runners rather than in your browser tab, so you can close the page and come back later.</p>
          <p>For each website, the worker visits the homepage first, then tries the usual contact and about addresses, follows up to two promising links from the homepage, and pulls a couple of relevant URLs from the sitemap. It stays on the same domain throughout. Every hundred websites it pauses briefly to avoid tripping rate limits, then continues on its own.</p>
          <p>Results land directly in your sheet under three columns: Website, Emails, and Status. A row marked done means at least one address was found. A done-no-email status means the site was reachable but published nothing the extractor could collect. An error status, such as fetch-failed, means the site could not be reached at all, which usually points to a dead domain, a bot blocker, or a server that refuses automated visits.</p>
          <p>Two controls keep large runs manageable. The limit field processes a slice of the list, say five hundred rows, before you start again to continue. Because the worker skips rows that already have a result, stopping and resuming never repeats work. For a few thousand domains, running in slices beats trying to do everything in one go.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">CLEAN PROSPECTING</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Why Building Your Own List Beats Buying a Database</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>It is tempting to buy a ready-made list of fifty thousand emails and start sending the same afternoon. Resist it. Purchased lists are usually stale, full of dead addresses, and shared with dozens of buyers who already burned them. They are also the fastest route to spam complaints, which damage your sending domain's reputation. Rebuilding that reputation takes far longer than building a clean list yourself.</p>
          <p>A list you extract yourself from real websites has three advantages a bought list never will. First, every address traces back to a site you chose, so you know the context: the industry, the company size, the reason they might care about your message. Second, the data is fresh, collected this week rather than scraped years ago. Third, you control the targeting, because the website list itself is your targeting. A list of three hundred carefully chosen local businesses will outperform a bought list of thirty thousand random addresses for almost any outreach goal.</p>
          <p>The website list is where the real work happens and deserves more thought than the extraction itself. Start from sources that already filter for fit: niche business directories, trade show exhibitor lists, industry association members, or trade publication advertisers. A spreadsheet of domains gathered this way is already a qualified prospect list. The extractor simply fills in the contact column you would otherwise complete by hand.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">NO EMAIL FOUND</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What to Do When a Website Has No Email</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Even a good extractor returns empty rows, and that is normal. Some businesses prefer contact forms; others hide addresses behind scripts or bot protection. A done-no-email status is information, not failure: it tells you this prospect needs a different route. Work down a short fallback ladder instead of guessing wildly or writing the row off.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Use the contact form, but write like a human. One specific sentence about their business beats a copied pitch, and forms often reach the owner directly.</li>
            <li>Check LinkedIn for the founder or relevant manager, then send a short connection note rather than a pitch.</li>
            <li>Look for an email pattern. If you found maria@company.com on a partner page, addresses in the same format often follow it. Treat these as leads to verify, not confirmed contacts.</li>
            <li>Try the press or partnerships page, which sometimes lists a different inbox than the main contact page.</li>
            <li>Call, if the business lists a phone number and the deal size justifies it. A two minute call can succeed where ten emails fail.</li>
          </ul>
          <p>Keep these fallback attempts in the same sheet, in a notes column next to the status. Months later, when you wonder why a promising prospect never got a message, that note will tell you exactly what happened and what to try next.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">RESPONSIBLE OUTREACH</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Reaching Out Without Burning Your Sender Reputation</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Extracting emails is the easy half. Sending to them is where most people damage their own domain. An address being publicly listed does not mean its owner asked for your email. The rule that keeps you safe is simple: every message should be relevant, specific, and easy to ignore. Relevance means the recipient's business matches what you offer. Specific means you mention something real about them, not just their first name from a merge tag. Easy to ignore means one clear call to action and a visible way to opt out, with no guilt trip for not replying.</p>
          <p>The technical basics matter as much as the words. Set up SPF, DKIM, and DMARC before your first campaign, warm the domain with low daily volumes, and remove hard bounces immediately. Most email providers publish sender guidelines, and following them is not optional if you want inbox placement. If you are unsure about regional rules such as GDPR in Europe or CAN-SPAM in the United States, read the actual regulations or ask someone qualified. This article is not legal advice.</p>
          <p>Finally, respect the rhythm of outreach. One thoughtful email followed by a single polite follow-up a week later will outperform five aggressive nudges. If someone does not reply to two messages, move on. Persistence past that point stops being follow-up and starts being the behavior that gets domains blocklisted.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FREE VS PAID</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">When a Free Email Extractor Is Enough</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Paid prospecting tools charge per credit or per seat, which makes sense when you need verified direct dials, enrichment data, or intent signals at enterprise scale. But for the common job of turning a list of websites into contact emails, a free extractor covers the whole task. The expensive part of prospecting was never pattern matching. It was the hours of manual clicking, and that is exactly what automation removes.</p>
          <p>A free tool fits best when you already know who you want to reach and you have their domains in a sheet. Local outreach, niche B2B prospecting, partnership research, and link building outreach all follow this shape: a defined universe of websites, one contact column to fill. In these cases paying per email would just tax you for work a simple crawler does in minutes.</p>
          <p>Be honest about the edges, though. No free extractor verifies that an inbox is active, and none can reach addresses hidden behind logins or aggressive bot protection. If your campaign depends on near-perfect deliverability to executives at large enterprises, you will eventually want verification and enrichment services on top. Use the free extractor to build the raw list, then spend your budget verifying the slice that matters most instead of paying to discover addresses you could have collected for nothing.</p>
        </div>
      </section>
    </>
  );
}
