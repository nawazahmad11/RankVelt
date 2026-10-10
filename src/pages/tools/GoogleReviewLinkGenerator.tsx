// META: title="Free Google Review Link Generator for Local Businesses" (max 60 chars, include target keyword)
// META: description="Create a direct Google review link free: paste your Place ID and get a shareable review link plus QR code. No signup." (max 160 chars, include target keyword)

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Link2,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

const QR_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
const PLACE_ID_FINDER_URL =
  "https://developers.google.com/maps/documentation/places/web-service/place-id";

type QrLibState = "loading" | "ready" | "failed";

const GOOGLE_REVIEW_LINK_GENERATOR_FAQS = [
  {
    q: "How do I find my Google Place ID?",
    a: "Google offers a free Place ID Finder in its Maps Platform documentation. Type your business name into the finder, select the correct listing, and copy the Place ID it shows. Paste that ID into this tool and your direct review link is generated instantly. If you run multiple locations, repeat the process for each one so every branch gets its own link.",
  },
  {
    q: "How does a direct Google review link help me get more reviews?",
    a: "A direct link removes the steps where most customers give up. Instead of searching for your business, opening your profile, and hunting for the write-a-review button, one tap takes them straight to the review form. Businesses that ask with a link at the right moment, such as right after a completed service, get far more finished reviews than businesses that only say leave us a review. More genuine reviews build trust with future customers and strengthen your local presence.",
  },
  {
    q: "Will the review link work on phones and tablets?",
    a: "Yes. The link opens Google's mobile-friendly review flow on phones, tablets, and desktops. The QR code version is especially useful in person, because a customer just points their phone camera at it and the review form opens. Always test the link on your own phone before printing it, so you see exactly what your customers will see.",
  },
  {
    q: "Do customers need a Google account to leave a review?",
    a: "Yes, Google requires reviewers to be signed in to a Google account. That is actually good for you, because it makes fake reviews harder and keeps your rating credible. When you send a link for a Google review, mention briefly that they will be asked to sign in first, so nobody is surprised. Most people on Android phones are already signed in.",
  },
  {
    q: "What is the QR code for, and where should I put it?",
    a: "The QR code is the same review link in a scannable form, useful anywhere a phone is in someone's hand. Put it on the counter, on receipts, on table tents, on packaging, or on a thank-you card handed over at checkout. Pair it with a short honest line like enjoyed your visit, scan to share your experience, and never with anything that pushes only happy customers to review.",
  },
  {
    q: "Is it against Google's rules to ask for reviews this way?",
    a: "Asking for honest reviews is allowed. What Google prohibits is review gating, which means steering only happy customers toward reviews while blocking unhappy ones, and offering payment, discounts, or freebies in exchange for reviews. Fake reviews and review stations that mass-produce ratings from one device can also trigger removals. Use one link for everyone, ask consistently, and let the feedback be genuine.",
  },
  {
    q: "Why does the link ask me to sign in when I open it myself?",
    a: "That is normal. Google shows a sign-in prompt to anyone who is not already signed into a Google account in that browser. Your customers will see the same prompt, then land on the review form for your business. If you manage the business, do not review your own listing, because Google can detect and remove owner reviews.",
  },
  {
    q: "My review link stopped working. What should I do?",
    a: "First, confirm your Place ID is still correct by looking it up again in Google's Place ID Finder. Listings that were merged, renamed, or moved sometimes get a new Place ID, which breaks the old link. Regenerate the link here with the current ID and replace it everywhere you published the old one. If the ID is correct and the link still fails, check that your Google Business Profile is still verified and published.",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Find your Google Place ID",
    text: "Use Google's free Place ID Finder to look up your business listing and copy the Place ID it shows. A Place ID is a short text code that uniquely identifies your business on Google Maps. It takes about two minutes and costs nothing.",
  },
  {
    title: "Paste the Place ID into the tool",
    text: "Paste the ID into the input above. This generator validates the format and builds your direct review URL instantly, using Google's official review link structure. No signup and nothing is sent to any server; everything happens in your browser.",
  },
  {
    title: "Copy the link or download the QR code",
    text: "Use the copy button to grab your shareable review link, or download the QR code as a PNG for print. Both point to the same destination: the review form for your business. Test the link on your own phone first so you know exactly what customers will see.",
  },
  {
    title: "Share it where customers see it",
    text: "Add the link to receipts, email signatures, post-service SMS messages, thank-you pages, and review request emails. Put the QR code on your counter, on table tents, or on packaging. The closer the ask is to the moment of a good experience, the more reviews you collect.",
  },
  {
    title: "Ask everyone and reply to every review",
    text: "Ask every customer the same way and never filter for only happy ones, because review gating violates Google's policy. Reply to each review you receive, positive or negative. Thoughtful replies show future customers that you take feedback seriously.",
  },
];

const WHERE_TO_USE = [
  {
    title: "Receipts and invoices",
    text: "Print the link or QR code on every receipt, invoice, or packing slip so the ask travels home with the customer.",
  },
  {
    title: "Post-service SMS or email",
    text: "Send the link in a short thank-you message within a day of the visit, while the experience is still fresh.",
  },
  {
    title: "Email signature",
    text: "Add a one-line review request with the link to the signature of every customer-facing team member.",
  },
  {
    title: "Counter and table displays",
    text: "Place the QR code where waiting customers can see it, such as the counter, a table tent, or near the exit.",
  },
  {
    title: "Thank-you page",
    text: "After an online booking or purchase, show the review link on the confirmation page and in the confirmation email.",
  },
  {
    title: "Review request emails",
    text: "Send a dedicated follow-up email a few days after service with a single clear button that opens your review link.",
  },
];

function validatePlaceId(value: string): boolean {
  return /^[A-Za-z0-9_-]{10,}$/.test(value.trim());
}

function GoogleReviewLinkGenerator() {
  const [placeId, setPlaceId] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrLibState, setQrLibState] = useState<QrLibState>("loading");
  const qrRef = useRef<HTMLDivElement>(null);

  const trimmed = placeId.trim();
  const hasInput = trimmed.length > 0;
  const isValid = validatePlaceId(placeId);
  const reviewLink = isValid
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(trimmed)}`
    : "";

  useEffect(() => {
    const w = window as unknown as { QRCode?: unknown };
    if (w.QRCode) {
      setQrLibState("ready");
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-qr-lib="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => setQrLibState("ready"));
      existing.addEventListener("error", () => setQrLibState("failed"));
      return;
    }
    const script = document.createElement("script");
    script.src = QR_CDN;
    script.async = true;
    script.setAttribute("data-qr-lib", "true");
    script.onload = () => setQrLibState("ready");
    script.onerror = () => setQrLibState("failed");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const el = qrRef.current;
    if (!el) return;
    el.innerHTML = "";
    if (!reviewLink || qrLibState !== "ready") return;
    try {
      const w = window as unknown as {
        QRCode: new (
          target: HTMLElement,
          opts: {
            text: string;
            width: number;
            height: number;
            correctLevel: number;
          },
        ) => unknown;
        QRCodeStatic: { CorrectLevel: { M: number } };
      };
      const QRCodeCtor = w.QRCode as unknown as new (
        target: HTMLElement,
        opts: { text: string; width: number; height: number; correctLevel?: number },
      ) => unknown;
      new QRCodeCtor(el, {
        text: reviewLink,
        width: 200,
        height: 200,
      });
    } catch {
      setQrLibState("failed");
    }
  }, [reviewLink, qrLibState]);

  useEffect(() => {
    const id = "rankvelt-google-review-link-generator-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: "Google Review Link Generator",
          url: "https://www.rankvelt.com/tools/google-review-link-generator",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "FAQPage",
          mainEntity: GOOGLE_REVIEW_LINK_GENERATOR_FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  const copyLink = async () => {
    if (!reviewLink) return;
    try {
      await navigator.clipboard.writeText(reviewLink);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = reviewLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  const downloadQr = () => {
    const el = qrRef.current;
    if (!el) return;
    const canvas = el.querySelector("canvas");
    const img = el.querySelector("img");
    const dataUrl = canvas
      ? canvas.toDataURL("image/png")
      : img?.getAttribute("src") || "";
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "google-review-qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-12%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.1] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} />
          Back to Free Tools
        </Link>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free Local SEO Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Free Google Review Link{" "}
            <span className="text-gradient-gold">Generator</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Use this free Google review link generator to create a direct
            Google review link for your business. Paste your Place ID and get a
            shareable review link plus a QR code in seconds. Learn how to
            generate a Google review link, how to share it with customers, and
            where to place it for the best results.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Your Business
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Paste Your Google Place ID
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
                Everything runs in your browser. Your Place ID is never sent to
                a server by this tool.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-200">
              <ShieldCheck size={14} />
              Browser-only tool
            </span>
          </div>

          <div className="mt-6">
            <label
              htmlFor="place-id-input"
              className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75"
            >
              Google Place ID
            </label>
            <input
              id="place-id-input"
              value={placeId}
              onChange={(event) => setPlaceId(event.target.value)}
              placeholder="Example: ChIJN1t_tDeuEmsRUsoyG83frY"
              spellCheck={false}
              autoComplete="off"
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3.5 font-mono text-sm text-white outline-none placeholder:font-sans placeholder:text-white/40 focus:border-primary/55"
            />
            {hasInput && !isValid && (
              <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-red-300">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                That does not look like a valid Place ID. Place IDs are at
                least 10 characters long and contain only letters, numbers,
                dashes, and underscores. Copy it again from Google's Place ID
                Finder.
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-white/60">
              Do not know your Place ID? Use Google's free{" "}
              <a
                href={PLACE_ID_FINDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary underline underline-offset-2"
              >
                Place ID Finder
                <ExternalLink size={12} className="ml-1 inline" />
              </a>{" "}
              to look up your business and copy the ID it shows.
            </p>
          </div>

          {reviewLink && (
            <div className="mt-7 rounded-2xl border border-primary/25 bg-primary/[0.05] p-5 sm:p-6">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                <Link2 size={14} />
                Your Google Review Link
              </p>
              <p className="mt-3 break-all rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs leading-relaxed text-white sm:text-sm">
                {reviewLink}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
                >
                  <Copy size={15} />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={reviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
                >
                  <ExternalLink size={15} />
                  Test the Link
                </a>
              </div>
              {copied && (
                <p
                  className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-300"
                  aria-live="polite"
                >
                  <CheckCircle2 size={16} />
                  Link copied. You can now paste it into emails, SMS messages,
                  or your website.
                </p>
              )}

              <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="mx-auto w-fit rounded-2xl border border-white/10 bg-white p-4">
                  {qrLibState === "ready" ? (
                    <div ref={qrRef} aria-label="QR code for your Google review link" />
                  ) : qrLibState === "loading" ? (
                    <div className="flex h-[200px] w-[200px] items-center justify-center text-center text-xs leading-relaxed text-black/60">
                      Loading QR code library...
                    </div>
                  ) : (
                    <div className="flex h-[200px] w-[200px] items-center justify-center p-4 text-center text-xs leading-relaxed text-black/70">
                      The QR code library could not load. Copy the link above
                      and use any QR code generator instead.
                    </div>
                  )}
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    <QrCode size={14} />
                    Scannable QR Code
                  </p>
                  <h3 className="mt-2 text-lg font-black text-white">
                    Print It for In-Person Reviews
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    This QR code opens the same review link. Customers point
                    their phone camera at it and land directly on your review
                    form, with no typing and no searching.
                  </p>
                  {qrLibState === "ready" && (
                    <button
                      type="button"
                      onClick={downloadQr}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
                    >
                      <Download size={15} />
                      Download QR Code (PNG)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MapPin size={21} />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Distribution Playbook
              </p>
              <h2 className="mt-1 text-2xl font-black text-white">
                Where to Use Your Review Link
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {WHERE_TO_USE.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/[0.1] bg-black/20 p-5"
              >
                <h3 className="text-sm font-black text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/75">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              From Place ID to More Reviews in 5 Steps
            </h2>
          </div>
          <ol className="mt-8 space-y-4">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 sm:gap-5 sm:p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-black text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-base font-black text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <GoogleReviewLinkGeneratorArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Google Review Link FAQs
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Questions Before You Start
            </h2>
          </div>
          <div className="mt-8 space-y-3">
            {GOOGLE_REVIEW_LINK_GENERATOR_FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 open:border-primary/45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-black text-white sm:text-base">
                  {faq.q}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">Related free tools</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="/tools/local-seo-checklist"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Local SEO Checklist <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/bulk-qr-code-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Bulk QR Code Generator <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/business-name-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Business Name Generator <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/meta-tag-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Meta Tag Generator <span className="text-primary">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-4xl rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Want More Local Customers?
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">
                Turn Reviews Into a Real Local Growth Engine
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                A review link is one piece of local SEO. A complete plan covers
                your Google Business Profile, local service pages, review
                replies, and the technical foundations that help nearby
                customers find you first.
              </p>
            </div>
            <Link
              to="/strategy-call"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02]"
            >
              Get a Free SEO Audit
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 text-sm font-black text-primary"
            >
              Browse All Tools
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default GoogleReviewLinkGenerator;

function GoogleReviewLinkGeneratorArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          The Basics
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What a Google Review Link Is and Why Local Businesses Need One
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A Google review link is a special URL that opens the review form
            for your business directly, skipping every step in between. When a
            customer taps it, they land on the screen where they pick a star
            rating and write their feedback. There is no searching for your
            business name, no opening your profile, and no hunting for the
            small write-a-review button that many customers never find.
          </p>
          <p>
            That shortcut matters because review collection is a game of
            friction. Every extra step loses people. A customer who had a
            great experience at 2 PM may fully intend to review you, but by
            8 PM the moment has passed. Learning how to create a Google review
            link and putting it in front of customers at the right time turns
            good intentions into published reviews, which is exactly what a
            Google business review link generator is built for.
          </p>
          <p>
            Reviews shape local buying decisions every day. Shoppers compare
            star ratings in the map pack, read recent reviews before calling,
            and treat a business with dozens of thoughtful replies very
            differently from one with three stale reviews. A steady flow of
            genuine reviews also feeds the prominence signal Google uses to
            rank local results, so review generation is not just reputation
            work, it is local SEO work. For more on how reviews connect to
            modern local visibility, read our guide to{" "}
            <Link
              to="/blog/local-seo-ai-overviews"
              className="font-bold text-primary underline underline-offset-2"
            >
              Google reviews and local visibility
            </Link>
            .
          </p>
          <p>
            Most competing review link tools are a bare input box with no
            guidance. They give you the URL and leave you guessing about
            where it goes, how to ask, and what Google allows. This page is
            different: the generator above plus the full guide below walk you
            from finding your Place ID to a review process you can run every
            week without breaking any rules.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Find Your Place ID
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to Find Your Google Review Link the Manual Way
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Every Google review link is built from a Place ID, a unique code
            Google assigns to your business listing. If you are wondering how
            to find a Google review link without a tool, the answer starts
            there: find the Place ID, then build the URL around it. The link
            format is always the same, a fixed Google address with your Place
            ID as a parameter.
          </p>
          <p>
            The reliable way to get your Place ID is Google's free Place ID
            Finder in the Maps Platform documentation. Type your business name
            into the finder, select the correct listing from the suggestions,
            and copy the Place ID shown on the map details. Be careful to pick
            the right location if your business has several branches, because
            each branch has its own ID and reviews go to the listing the ID
            belongs to.
          </p>
          <p>
            There are older tricks floating around, like searching for your
            business on Google Maps and copying the ID from the page source,
            but those methods are fragile and often produce the wrong value.
            The official finder is free, takes about two minutes, and always
            returns the current ID. That is why the generator on this page
            asks for the Place ID directly: once you have it, the rest is
            instant.
          </p>
          <p>
            Keep your Place IDs in a safe list if you run multiple locations.
            When you open a new branch or when Google merges duplicate
            listings, the Place ID can change, and an old review link will
            silently stop working. Checking the finder once or twice a year
            takes minutes and prevents a dead link sitting on hundreds of
            printed receipts.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Build Your Link
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to Generate a Google Review Link With This Tool
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Once you have your Place ID, learning how to generate a Google
            review link takes seconds. Paste the ID into the generator above,
            and the tool validates the format and builds your direct review
            URL using Google's official review link structure. The result is
            a long URL that you can copy with one click or turn into a QR
            code for print.
          </p>
          <p>
            The tool checks that your input looks like a real Place ID before
            building anything, so a typo or a half-copied value gets flagged
            instead of producing a broken link. Everything runs in your
            browser, which means your Place ID never leaves your device and
            there is no account to create. If the validation message appears,
            go back to the Place ID Finder and copy the full ID again, making
            sure no spaces or extra characters came along.
          </p>
          <p>
            Before you share the link anywhere, test it. Open it in a private
            browser window and confirm it lands on the review form for the
            correct business. Test it on a phone too, since most customers
            will open it there. Two minutes of testing now saves you from
            discovering a wrong link after it is printed on a thousand
            flyers.
          </p>
          <p>
            Some businesses shorten their review link with a URL shortener to
            make it look cleaner on printed material. That is optional and
            usually unnecessary now, because the QR code handles the print
            case better than a shortened link ever could. If you do shorten
            it, keep a record of the original full link so you can rebuild it
            if the shortener ever goes down.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Distribution
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to Send a Google Review Link So Customers Actually Use It
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Generating the link is the easy half. The results come from how
            you send a Google review link and, more importantly, when. The
            golden rule is timing: ask when the positive experience is fresh.
            A restaurant that sends the link with the digital receipt, a
            plumber who texts it after finishing the job, and a clinic that
            emails it the next morning all catch customers at peak goodwill.
            Ask a month later and the response rate collapses.
          </p>
          <p>
            The message around the link matters as much as the link itself.
            Keep it short, personal, and honest. Something like, thanks for
            visiting us today, your feedback helps other customers find us,
            followed by the link, works far better than a long corporate
            email. One clear call to action beats three competing buttons
            every time.
          </p>
          <p>
            Cover both digital and physical touchpoints. Digitally, add the
            link to post-service SMS messages, thank-you emails, the order
            confirmation page, and the email signatures of customer-facing
            staff. Physically, the QR code version belongs on receipts,
            table tents, the counter, packaging, and any thank-you card you
            hand over. Different customers respond to different channels, so
            the businesses that collect the most reviews are the ones that
            show up in several places without being pushy in any of them.
          </p>
          <p>
            Make the ask a process, not a campaign. A one-week review push
            creates a spike that fades; a simple checklist that your team
            follows after every job creates a steady stream. Assign someone
            to own it, review the numbers monthly, and refresh any printed
            material that looks tired. Consistency beats intensity in review
            generation, and it is the consistent stream of recent reviews
            that customers and Google both notice.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          QR Codes
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Using a QR Code to Collect Reviews In Person
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The QR code this tool generates is your review link in scannable
            form, and it solves the biggest problem with in-person review
            requests: typing. Nobody wants to type a long URL from a receipt
            into their phone. With a QR code, the customer points the camera,
            taps the notification, and the review form opens. That is the
            difference between an ask that works and an ask that gets
            forgotten.
          </p>
          <p>
            Placement decides whether the QR code gets scanned. Put it where
            customers wait or linger: the checkout counter, a table tent, the
            waiting area, near the exit, or on the receipt they are already
            holding. Pair it with a short honest line such as, enjoyed your
            visit, scan to share your experience. Avoid any wording that
            suggests only happy customers should scan, because that is review
            gating and it violates Google's policy.
          </p>
          <p>
            Print quality matters more than people expect. A QR code that is
            too small, printed on a glossy surface with glare, or placed on
            a curved bottle where it distorts will not scan reliably. Print
            it at least a few centimeters across, test the scan from a normal
            standing distance under your actual lighting, and reprint
            anything that looks faded. A code that fails to scan is worse
            than no code at all, because it teaches customers that your
            requests do not work.
          </p>
          <p>
            If you need many codes, for example one per branch or per
            campaign, generate each from that location's own Place ID so
            reviews land on the right listing. Keep a simple spreadsheet
            mapping each printed code to its location and the date it went
            live. When a Place ID changes or a branch closes, you will know
            exactly which materials to update.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Avoid Trouble
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Mistakes That Can Get Your Reviews Filtered or Removed
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The fastest way to lose reviews you already earned is to break
            Google's rules while collecting them. Review gating is the most
            common violation: it means sending happy customers to Google
            while quietly diverting unhappy ones elsewhere, often through a
            survey that only shows the Google link to people who rate you
            highly. Google explicitly prohibits this, and filtered reviews
            can vanish in bulk when it is detected. Use one link for every
            customer, no exceptions.
          </p>
          <p>
            Incentives are the second trap. Offering discounts, freebies, or
            contest entries in exchange for reviews is against policy, even
            when you say the review can be honest. Google treats paid and
            incentivized reviews as misleading, and competitors or customers
            do report them. The safe incentive is a great experience worth
            writing about, not a coupon for writing about it.
          </p>
          <p>
            Fake reviews are the third, and they include reviewing your own
            business, asking friends or staff to post reviews for locations
            they never visited, and buying reviews from sellers. Google's
            detection keeps improving, and mass removals are common enough
            that purchased reviews are money thrown away. A smaller number
            of genuine reviews always outperforms a large number of fake
            ones, because real reviews contain the specific details future
            customers actually read.
          </p>
          <p>
            Finally, avoid review stations: a tablet at your counter where
            dozens of customers log reviews from the same device and
            location. Google can flag clusters of reviews from one device,
            and the whole batch may be filtered. Let customers use their own
            phones with your link or QR code. It looks natural because it is
            natural, and natural is what survives.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Keep the Momentum
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What to Do After Reviews Start Coming In
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Collecting the review is only half the job. Replying to it is the
            other half, and it is the part most businesses skip. Respond to
            every review, positive and negative, within a few days. Thank
            happy customers by name and mention something specific from
            their review. For critical reviews, acknowledge the issue calmly,
            avoid arguing in public, and move the resolution to a private
            channel. Future customers read your replies as a preview of how
            you treat people when things go wrong.
          </p>
          <p>
            Treat reviews as free market research. When several reviewers
            mention the same strength, feature it in your marketing. When
            several mention the same complaint, fix the underlying problem
            before asking for more reviews, because amplifying a broken
            experience only produces more negative reviews. A monthly skim
            of new reviews, looking for patterns rather than individual
            comments, turns feedback into an operations tool.
          </p>
          <p>
            Showcase your best reviews where they influence decisions: on
            your website's homepage and service pages, in proposals, and in
            local landing pages. Real customer words carry more weight than
            any claim you write about yourself. Just make sure any review
            you quote is genuine, recent, and presented accurately, and
            never edit a customer's words to make them sound better.
          </p>
          <p>
            Finally, keep the pipeline running. Review recency matters: a
            business whose newest review is two years old looks dormant even
            with a high average rating. A simple monthly check, how many new
            reviews arrived, how many got replies, and whether the ask
            process is still running, keeps the system alive. Pair that with
            the rest of your local SEO foundations and your review link
            becomes one part of a visibility engine instead of a one-time
            trick.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Star size={21} />
          </span>
          <div>
            <h2 className="text-2xl font-black text-white">
              Quick Recap: How to Share a Google Review Link the Right Way
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
              <p>
                Find your Place ID with Google's free finder, generate the
                link with the tool above, and test it on your phone before
                sharing it anywhere.
              </p>
              <p>
                Send the link within a day of a good experience through SMS,
                email, receipts, and your website, and put the QR code where
                in-person customers can scan it.
              </p>
              <p>
                Ask every customer the same way, never offer incentives, reply
                to every review, and review your process monthly to keep new
                feedback flowing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
