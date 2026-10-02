// RankVelt tool page: SSL Checker (free, checks any public website)
// Place at: src/pages/tools/SslChecker.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).

import { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, Lock } from 'lucide-react';

const SSL_FAQS = [
  {
    q: 'What happens to my website when an SSL certificate expires?',
    a: 'Every visitor sees a full page browser warning such as "Your connection is not private" in Chrome or "Warning: Potential Security Risk Ahead" in Firefox. Most people go back instead of clicking through, so traffic, leads, and sales drop immediately. Search engine crawlers can also treat the site as inaccessible, which puts rankings at risk until the certificate is renewed.',
  },
  {
    q: 'How early can an SSL certificate be renewed?',
    a: 'Most certificate authorities let you renew within about 30 days of the expiry date, and many hosts renew automatically well before that. You do not lose the remaining time on the old certificate, because the new validity period is added on top. Renewing early is the safe habit: it leaves room to fix payment problems, validation delays, or installation mistakes before visitors see a warning.',
  },
  {
    q: 'What is the difference between DV, OV, and EV certificates?',
    a: 'DV (Domain Validation) only proves you control the domain. It is issued in minutes and is what free certificates from Let\'s Encrypt provide. OV (Organization Validation) also verifies your business identity, so the organization name appears in the certificate details, and it takes a few days. EV (Extended Validation) is the strictest legal and identity check. All three encrypt traffic the same way; they differ in how much identity checking happens before issuance.',
  },
  {
    q: 'Does Google require HTTPS for SEO?',
    a: 'Google has used HTTPS as a ranking signal since 2014, so a site that only serves HTTP starts at a disadvantage. More importantly, browsers label HTTP pages as "Not secure" in the address bar, which hurts visitor trust and conversions. Pages that collect any form input, login, or payment details should always be served over HTTPS with a valid certificate.',
  },
  {
    q: 'What is a hostname mismatch error?',
    a: 'A hostname mismatch happens when the domain a visitor typed is not listed on the certificate the server presents. For example, the site is opened as www.example.com but the certificate only covers example.com, or an old certificate for a different domain is still installed. Browsers treat this like a broken certificate and show a security warning. The fix is to issue a certificate that lists every hostname the site answers to.',
  },
  {
    q: 'Do I need a separate SSL certificate for every subdomain?',
    a: 'Not always. A wildcard certificate for *.example.com covers any single level of subdomain, such as shop.example.com and blog.example.com, so one certificate can protect all of them. A multi-domain (SAN) certificate can list specific hostnames across different domains. Separate certificates per subdomain also work, but each one has its own expiry date to manage.',
  },
  {
    q: 'What happens if there is a gap during renewal?',
    a: 'If the old certificate expires before the new one is installed, browsers show the expired certificate warning to every visitor until the new certificate is live. The site itself is still running, but most visitors will not get past the warning. On managed platforms such as Vercel or Cloudflare, renewal is automatic and gaps are rare. On manually managed servers, renew early and install the new certificate before the old one runs out.',
  },
  {
    q: 'How long do SSL certificates last?',
    a: 'The industry maximum is about 13 months, so every certificate expires regularly by design. Certificates from Let\'s Encrypt last 90 days and are meant to be renewed automatically by software such as Certbot or your hosting panel. Short lifetimes are intentional: they limit the damage window if a private key is compromised and force healthy renewal automation.',
  },
];

const inputCls =
  'mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50';

const labelCls =
  'block text-[11px] font-black uppercase tracking-[0.18em] text-white/50';

type SslResult = {
  ok: true;
  domain: string;
  valid: boolean;
  authorized: boolean;
  hostnameMatch: boolean;
  issuer: { O?: string; CN?: string };
  subject: { CN?: string };
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  san: string[];
  protocol: string;
};

function cleanDomain(input: string): string {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, '');
  value = value.replace(/^\/\//, '');
  value = value.split('/')[0].split('?')[0].split('#')[0];
  value = value.replace(/:\d+$/, '');
  value = value.replace(/\.+$/, '');
  return value;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function SslChecker() {
  const [domainInput, setDomainInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SslResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQPage JSON-LD built from the same FAQ array rendered below.
  // RouteSeoManager owns the page title and meta tags.
  useEffect(() => {
    document.getElementById('rankvelt-ssl-checker-schema')?.remove();
    const schemaScript = document.createElement('script');
    schemaScript.id = 'rankvelt-ssl-checker-schema';
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: SSL_FAQS.map((faq) => ({
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
    const domain = cleanDomain(raw);
    if (!domain || domain.includes(' ') || !domain.includes('.')) {
      setResult(null);
      setError('Please enter a valid domain, for example rankvelt.com.');
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ssl-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (data && data.ok) {
        setResult(data as SslResult);
      } else {
        setError((data && data.error) || 'The SSL check returned an unexpected result. Please try again.');
      }
    } catch {
      setError('The SSL check could not be completed. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  const expired = result ? result.daysRemaining < 0 : false;
  const daysUrgency = !result
    ? ''
    : expired || result.daysRemaining <= 7
      ? 'text-red-300'
      : result.daysRemaining <= 30
        ? 'text-amber-300'
        : 'text-emerald-300';
  const daysBadgeCls = !result
    ? ''
    : expired || result.daysRemaining <= 7
      ? 'border-red-500/30 bg-red-500/[0.07]'
      : result.daysRemaining <= 30
        ? 'border-amber-400/30 bg-amber-400/[0.07]'
        : 'border-emerald-500/30 bg-emerald-500/[0.07]';
  const hasProblem = result
    ? !result.valid || expired || !result.hostnameMatch || !result.authorized
    : false;
  const statusBadge = !result
    ? null
    : hasProblem
      ? {
          label: 'Problem found',
          cls: 'border-red-500/40 bg-red-500/[0.1] text-red-200',
        }
      : result.daysRemaining <= 30
        ? {
            label: 'Valid, expiring soon',
            cls: 'border-amber-400/40 bg-amber-400/[0.1] text-amber-200',
          }
        : {
            label: 'Certificate valid',
            cls: 'border-emerald-500/40 bg-emerald-500/[0.1] text-emerald-200',
          };
  const daysText = !result
    ? ''
    : expired
      ? `Expired ${Math.abs(result.daysRemaining)} day${Math.abs(result.daysRemaining) === 1 ? '' : 's'} ago`
      : result.daysRemaining === 0
        ? 'Expires today'
        : `${result.daysRemaining} day${result.daysRemaining === 1 ? '' : 's'} left before expiry`;

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
            SSL <span className="text-gradient-gold">Checker</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            Enter any domain to check its SSL certificate: whether it is valid, who issued it,
            which hostnames it covers, and how many days are left before it expires. Catch an
            expiring certificate here instead of in your visitors' browsers.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lock size={20} />
              </span>
              <h2 className="text-xl font-black text-white">Check a certificate</h2>
            </div>

            <div className="mt-6">
              <label className={labelCls}>Domain or website URL</label>
              <input
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runCheck(domainInput);
                }}
                placeholder="rankvelt.com"
                className={inputCls}
              />
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                You can paste a full URL. The protocol, path, and port are removed automatically.
              </p>
            </div>

            <button
              onClick={() => runCheck(domainInput)}
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Checking...' : 'Check SSL Certificate'}
            </button>

            <p className="mt-4 text-xs leading-relaxed text-white/40">
              Try an example:{' '}
              <button
                type="button"
                onClick={() => {
                  setDomainInput('rankvelt.com');
                  runCheck('rankvelt.com');
                }}
                className="font-bold text-primary hover:underline"
              >
                rankvelt.com
              </button>
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm leading-relaxed text-red-300">
                {error}
              </div>
            )}

            {result && statusBadge && (
              <div className="mt-6">
                <div
                  className={`flex flex-col items-start gap-3 rounded-xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${statusBadge.cls}`}
                >
                  <span className="inline-flex items-center gap-2 text-base font-black">
                    <ShieldCheck size={18} />
                    {statusBadge.label}
                  </span>
                  <span className="text-sm font-bold text-white/80">{result.domain}</span>
                </div>

                <div
                  className={`mt-4 rounded-xl border px-4 py-4 ${daysBadgeCls}`}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                    Time remaining
                  </p>
                  <p className={`mt-1 text-2xl font-black ${daysUrgency}`}>{daysText}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    {expired
                      ? 'This certificate has already expired. Renew it immediately, because browsers are warning your visitors right now.'
                      : result.daysRemaining <= 30
                        ? 'Renew within the next few days so there is no gap in coverage.'
                        : 'No action needed right now. Put a reminder in your calendar for 30 days before the expiry date below.'}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">Issuer</p>
                    <p className="mt-1 text-sm font-bold text-white/85">
                      {result.issuer.O || result.issuer.CN || 'Not reported'}
                    </p>
                    {result.issuer.O && result.issuer.CN && (
                      <p className="text-xs text-white/45">{result.issuer.CN}</p>
                    )}
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">Issued to</p>
                    <p className="mt-1 text-sm font-bold text-white/85">
                      {result.subject.CN || result.domain}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">Valid from</p>
                    <p className="mt-1 text-sm font-bold text-white/85">{formatDate(result.validFrom)}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">Valid until</p>
                    <p className="mt-1 text-sm font-bold text-white/85">{formatDate(result.validTo)}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">Connection protocol</p>
                    <p className="mt-1 text-sm font-bold text-white/85">{result.protocol || 'Not reported'}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">Trust checks</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/85">
                      Chain trusted: {result.authorized ? 'Yes' : 'No'}
                      <br />
                      Hostname matches: {result.hostnameMatch ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {result.san.length > 0 && (
                  <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                      Hostnames covered ({result.san.length})
                    </p>
                    <div className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-2">
                      {result.san.map((name) => (
                        <p key={name} className="text-sm text-white/75">
                          {name}
                        </p>
                      ))}
                    </div>
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
                <ShieldCheck size={20} />
              </span>
              <h2 className="text-xl font-black text-white">How it works</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>Enter a domain or paste a full URL. Anything after the domain is stripped away automatically.</li>
              <li>The checker opens a secure connection to the site, reads the certificate it presents, and validates it the same way a browser does.</li>
              <li>Review the expiry date, the issuer, and the list of covered hostnames, then renew or fix anything that is running out or mismatched.</li>
            </ol>
          </div>
        </section>
      <SslCheckerArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {SSL_FAQS.map((f, i) => (
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
                { href: '/tools/robots-txt-generator', name: 'Robots.txt Generator' },
                { href: '/tools/xml-sitemap-generator', name: 'XML Sitemap Generator' },
                { href: '/tools/title-tag-preview', name: 'Title Tag Preview' },
                { href: '/tools/bulk-redirect-generator', name: 'Bulk Redirect Generator' },
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
            <h2 className="text-2xl font-black text-white">Technical Issues Holding Your Rankings Back?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              An expiring certificate is one small technical fault among many. RankVelt checks the
              full technical picture: indexing, speed, structure, and on-page signals. Get a free
              SEO audit and we will show you the gaps first.
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
function SslCheckerArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">THE WARNING SCREEN</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What Visitors See the Day a Certificate Expires</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>An expired certificate does not make your website go dark. The server still runs, the pages still exist, and nothing looks broken from the inside. What changes is the front door. The moment the expiry date passes, every browser that visits your site stops at a full page warning before showing any of your content. Chrome shows "Your connection is not private" with a red warning icon. Firefox says "Warning: Potential Security Risk Ahead". To the average visitor, that screen is indistinguishable from a hacked website.</p>
          <p>Almost nobody clicks through. There is an advanced link that lets determined visitors proceed anyway, but most people simply go back to the search results and choose a competitor. For an online store, checkout stops instantly, because nobody enters card details after a security warning. If you run paid ads to the site, every click you buy lands on that warning screen and the budget burns.</p>
          <p>Search visibility suffers in the same window. Google has used HTTPS as a ranking signal since 2014, and its crawler treats a site with an expired certificate as inaccessible. A short lapse is usually forgiven once the new certificate is live, but an expired site risks being crawled less and seen as unreliable. All of it is preventable: an SSL checker shows the expiry date in seconds, which is why using one regularly is cheap insurance.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">CHAIN OF TRUST</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">The Certificate Chain, Explained Without the Jargon</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>When a browser connects to your site, it does not just check one certificate. It checks a chain. At the bottom is your site's certificate, the one issued for your domain. Above it sits one or more intermediate certificates, which are the authority's way of saying the issuer is legitimate. At the top is a root certificate, preinstalled in browsers and operating systems as part of a guarded trust store. Your certificate is trusted because the chain leads up to a root the browser already trusts.</p>
          <p>The server's job is to present your certificate plus the intermediates during the connection handshake. If the server forgets the intermediates, the browser cannot complete the chain and rejects the connection, even though your certificate itself is perfectly valid. This produces the classic mystery fault: the site looks fine on the owner's modern laptop but shows certificate errors on some phones or older devices whose trust stores would need that missing intermediate to bridge the gap.</p>
          <p>That is what a proper SSL certificate checker verifies on your behalf. It connects the way a browser does, receives whatever chain the server actually sends, and reports whether the chain validates against public trust stores and whether the hostname matches. The "Chain trusted" and "Hostname matches" rows in the report above reflect exactly those two checks. So an unexpired certificate can still fail an SSL test.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">NEVER BE SURPRISED</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Expiry Monitoring Habits That Actually Work</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Every certificate outage has the same shape: the date was knowable months in advance, and nobody looked. The fix is a monitoring habit with two independent layers, because any single reminder can fail silently. The first layer is a calendar reminder set 30 days before expiry, with a second one at 7 days. When the first reminder fires, confirm the renewal path works. When the second fires, confirm the new certificate is actually installed, not just purchased.</p>
          <p>The second layer is automation, verified rather than assumed. Many certificates today are issued by Let's Encrypt and last only 90 days, which makes manual renewal unrealistic. Hosts and tools such as Certbot renew them in the background, and managed platforms like Vercel and Cloudflare handle renewal entirely. But "automatic" deserves a check: after each cycle, the dates on this page should move forward. Run your main domain and every important subdomain through an SSL checker once a month. That catches quiet failures, like a renewal that worked on www but not on the shop subdomain.</p>
          <p>One more administrative detail catches people out: renewal notices go to an email address. If that inbox belongs to a former employee or an old agency, the warnings arrive nowhere. Keep the contact details at your registrar and hosting panel current, and make the monthly check part of the same routine as reviewing your analytics. That small habit removes a whole category of avoidable downtime.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">ONE CERT OR MANY</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Wildcard and Multi-Domain Certificates, Compared Simply</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A standard certificate covers a single hostname, though most issuers include both the bare domain and its www version on the same certificate. That is enough for a simple website. The picture changes when a business grows subdomains: a shop at shop.example.com, help at support.example.com, an app at app.example.com. Issuing a separate certificate for each one works, but each is a separate expiry date and a separate renewal that can fail on its own.</p>
          <p>A wildcard certificate solves this by covering one whole level of subdomains. A certificate for *.example.com protects shop, blog, support, and any other single level name under the domain. It does not cover deeper levels such as checkout.shop.example.com, and the bare domain itself is usually added as an extra name on the same certificate. One expiry date, one renewal, whole subdomain estate covered. The tradeoff is blast radius: because the same private key serves every subdomain, a compromised key affects all of them at once.</p>
          <p>A multi-domain certificate, often called a SAN certificate, takes a different approach: it lists specific hostnames, which can span completely different domains. Agencies and platform operators use them when one server hosts several client sites. Whichever shape you choose, run each hostname through this SSL certificate checker after setup to confirm the coverage matches the structure you have.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">AFTER THE PADLOCK</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Mixed Content: When an HTTPS Page Loads HTTP Resources</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A valid certificate guarantees an encrypted connection. It does not guarantee that everything on the page actually uses that connection. Mixed content happens when a page served over HTTPS asks the browser to load some of its pieces, images, scripts, stylesheets, fonts, or videos, over plain HTTP. The certificate is fine, yet the page misbehaves: browsers block active mixed content such as scripts outright, and images may load with warnings or not at all. The result looks like a broken site even though every SSL test you run comes back green.</p>
          <p>Fixing it means finding every insecure reference and pointing it at its HTTPS version, ideally relative or scheme free URLs inside your own templates. Browsers expose the offenders in their developer tools security panels, and a crawl with an SEO spider will list insecure resources at scale. Keep the distinction clear in your mind: the checker on this page answers "is my SSL valid", while mixed content is a page level audit. You need both checks for a genuinely secure site.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">HSTS IN PLAIN LANGUAGE</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">HSTS: Telling Browsers to Never Use HTTP Again</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Even with HTTPS everywhere, there is a small gap in how visits begin. When someone types your domain without a scheme, the browser may first try plain HTTP and only reach HTTPS after your server redirects it. That first insecure hop can be intercepted, a trick known as SSL stripping, where an attacker silently keeps the visitor on HTTP while relaying traffic. Redirects shrink that window but cannot close it completely.</p>
          <p>HSTS, short for HTTP Strict Transport Security, closes it with a promise. It is a response header your server sends over HTTPS that tells the browser: for the next period, say one year, only ever contact this domain over HTTPS, no exceptions. On every later visit the browser rewrites the request internally before any network traffic happens, so the insecure first hop never occurs. Some sites go further and join browser preload lists, which ship that promise built into the browser itself, protecting even the very first visit.</p>
          <p>The caution is that the promise is strict by design. If you send a long max age while a subdomain still cannot do HTTPS, returning visitors will be locked out of that subdomain with no override button. So roll it out in stages: start with a short duration like a day or a week, confirm every subdomain works securely, then raise the duration, and consider includeSubDomains only after that audit. Preloading is effectively permanent, so treat it as the final step.</p>
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">KNOW THE LIMITS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What an SSL Checker Cannot Tell You</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>An SSL checker reads the certificate your server presents at the moment of the check and validates it the way browsers do. That covers the failures that hurt you most: expiry, hostname mismatch, and a broken chain. But a certificate is one component of a secure setup, and a green result here should not be read as a complete security grade. Several important things sit outside its view.</p>
          <p>It does not score your server's protocol and cipher configuration, and a server can hold a valid certificate while still accepting outdated protocol versions; that needs a deeper configuration scan. It does not see mixed content inside your pages, which is a page level issue as covered above. It also sees only the endpoint it connected to: sites behind a content delivery network have many edge servers, and while inconsistent certificates across them are rare, one check samples one location at one moment. And it cannot watch the calendar for you. A certificate with 40 days left is healthy today and a problem next month if nobody acts.</p>
          <p>Use the tool for what it is: a fast, honest answer to "is my SSL valid right now, and when does that stop being true". Run it after every certificate change and monthly on the hostnames your business depends on, paired with reminders so the expiry date never sneaks up. If the technical side of your site needs a fuller review, indexing, speed, structure, and certificates together, that is exactly what a technical SEO audit covers.</p>
        </div>
      </section>
    </>
  );
}
