// RankVelt tool page: UTM Builder (100% free, browser-only)
// Place at: src/pages/tools/UtmBuilder.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).

import { useEffect, useMemo, useState } from "react";

const SITE_URL = "https://rankvelt.com";
const PAGE_PATH = "/tools/utm-builder";
const PAGE_DESCRIPTION =
  "Build clean UTM campaign URLs in seconds. Add utm_source, utm_medium, utm_campaign, utm_term, and utm_content, or tag a whole list of URLs in bulk. Free, runs in your browser.";

type Mode = "single" | "bulk";

interface UtmFields {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

interface BulkRow {
  raw: string;
  finalUrl: string;
  error: string;
}

const PRESETS: Array<{ name: string; source: string; medium: string }> = [
  { name: "Google Ads", source: "google", medium: "cpc" },
  { name: "Meta / Facebook", source: "facebook", medium: "paid_social" },
  { name: "X", source: "twitter", medium: "paid_social" },
  { name: "LinkedIn", source: "linkedin", medium: "paid_social" },
  { name: "Newsletter", source: "newsletter", medium: "email" },
  { name: "Organic Social", source: "social", medium: "organic" },
];

function buildUtmUrl(baseUrl: string, fields: UtmFields): BulkRow {
  const raw = baseUrl.trim();
  if (!raw) {
    return { raw, finalUrl: "", error: "Add a website URL first." };
  }
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { raw, finalUrl: "", error: "The website URL must use http or https." };
    }
    const values: Array<[string, string]> = [
      ["utm_source", fields.source],
      ["utm_medium", fields.medium],
      ["utm_campaign", fields.campaign],
      ["utm_term", fields.term],
      ["utm_content", fields.content],
    ];
    values.forEach(([name, value]) => {
      const trimmed = value.trim();
      if (trimmed) {
        // set() replaces any existing parameter with the same name instead of duplicating it.
        parsed.searchParams.set(name, trimmed);
      }
    });
    return { raw, finalUrl: parsed.toString(), error: "" };
  } catch {
    return { raw, finalUrl: "", error: "That website URL could not be understood. Check it and try again." };
  }
}

function copyToClipboard(value: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(value);
  }
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

const UtmFaqs = [
  {
    q: "Are UTM parameters case sensitive?",
    a: "Yes. Google Analytics reads the values exactly as written, so utm_source=Facebook, utm_source=facebook, and utm_source=FB become three separate sources in your reports. The parameter names themselves must also be lowercase (utm_source, not UTM_SOURCE). The safest habit: type every UTM value in lowercase, every time.",
  },
  {
    q: "What is the difference between utm_source and utm_medium?",
    a: "Source answers who sent the visitor: the platform, publisher, or placement, such as google, facebook, or newsletter. Medium answers how the visit traveled: the channel type, such as cpc, email, or paid_social. Every link combines one source with one medium, which is why GA4 reports traffic as source / medium pairs.",
  },
  {
    q: "Where do UTM reports appear in GA4?",
    a: "Open Reports, then Acquisition, then Traffic acquisition. Change the primary dimension to Session source, Session medium, or Session campaign to see your tagged traffic, and add Session content or Session term as secondary dimensions for creative and keyword detail. The User acquisition report shows the same fields for a visitor's first ever touch.",
  },
  {
    q: "Should I add UTM parameters to internal links on my own website?",
    a: "No. When a visitor clicks an internal link that carries UTMs, GA4 replaces the original source and medium with the ones on that link and starts a new session. A visitor who arrived from a paid ad suddenly looks like they came from your homepage banner, and the ad loses credit for the conversion. Reserve UTMs for links that live outside your site.",
  },
  {
    q: "Do UTM parameters affect SEO?",
    a: "No. UTM parameters do not change page content, and search engines do not rank a page higher or lower because a link to it carries tracking tags. Tagged URLs are treated as the same page as the clean URL, especially when the page's canonical tag points to the clean version. Just never use UTM links as the internal links search engines crawl.",
  },
  {
    q: "How do I keep campaign names consistent across a team?",
    a: "Agree on a short written convention before anyone builds links: lowercase values, hyphens between words, one fixed list of mediums, and campaign names that include a date or season. Use presets for the common channels and log every published link in a shared tracking sheet, so new team members copy the pattern instead of inventing their own.",
  },
  {
    q: "When should I use utm_term and utm_content?",
    a: "Use utm_term for the paid search keyword when you tag ads manually, which is most useful on networks like Bing Ads; Google Ads auto-tagging already captures keyword detail for Google campaigns. Use utm_content to tell links apart when they share a destination, such as two creatives in one ad set or the header and footer links in one email.",
  },
  {
    q: "What happens if my URL already has query parameters?",
    a: "The builder merges them. Existing parameters stay untouched, the UTM values you enter are added, and if the URL already contains a parameter with the same name, it is replaced instead of duplicated. A fragment at the end of the URL (the part after #) stays exactly where it belongs, after the query string.",
  },
];

const inputCls =
  "mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55";

const labelCls =
  "text-[10px] font-black uppercase tracking-[0.18em] text-white/75";

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0 text-primary">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function DemoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6v6H9z" />
    </svg>
  );
}

export default function UtmBuilder() {
  const [mode, setMode] = useState<Mode>("single");
  const [baseUrl, setBaseUrl] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const [copyError, setCopyError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQPage JSON-LD built from the same FAQ array rendered below.
  useEffect(() => {
    document.getElementById("rankvelt-utm-builder-schema")?.remove();
    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-utm-builder-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: UtmFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    });
    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, []);

  const fields: UtmFields = { source, medium, campaign, term, content };

  const singleResult = useMemo(() => buildUtmUrl(baseUrl, fields), [baseUrl, source, medium, campaign, term, content]);

  const bulkRows = useMemo<BulkRow[]>(() => {
    return bulkInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => buildUtmUrl(line, fields));
  }, [bulkInput, source, medium, campaign, term, content]);

  const validBulkRows = useMemo(() => bulkRows.filter((row) => !row.error), [bulkRows]);
  const invalidBulkCount = bulkRows.length - validBulkRows.length;

  const applyPreset = (preset: { source: string; medium: string }) => {
    setSource(preset.source);
    setMedium(preset.medium);
  };

  const handleCopy = async (key: string, value: string) => {
    if (!value) {
      return;
    }
    try {
      await copyToClipboard(value);
      setCopyError("");
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(""), 2200);
    } catch {
      setCopyError("Copy failed. Please copy the URL manually.");
    }
  };

  const handleReset = () => {
    setBaseUrl("");
    setBulkInput("");
    setSource("");
    setMedium("");
    setCampaign("");
    setTerm("");
    setContent("");
    setCopiedKey("");
    setCopyError("");
  };

  const loadDemo = () => {
    setMode("single");
    setBaseUrl("https://example.com/spring-sale");
    setSource("facebook");
    setMedium("paid_social");
    setCampaign("spring-sale-2026");
    setTerm("");
    setContent("hero-video");
  };

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-12%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.1] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <a
          href="/tools"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-primary"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Free Tools
        </a>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            Free Campaign URL Builder
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            UTM <span className="text-gradient-gold">Builder</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Build clean, copy-ready campaign URLs with utm_source, utm_medium, utm_campaign,
            utm_term, and utm_content. Tag one link at a time or a whole list in bulk. Free, no
            signup, and nothing you type leaves your browser.
          </p>
        </section>

        <section className="mt-12 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LinkIcon />
              </span>
              <div>
                <h2 className="text-2xl font-black text-white">Build Your Tracking Link</h2>
                <p className="mt-1 text-sm text-white/75">
                  The final URL updates live as you type.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <span className={labelCls}>Mode</span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("single")}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      mode === "single"
                        ? "border-primary/50 bg-primary/[0.1] text-primary"
                        : "border-white/15 bg-black/20 text-white/80 hover:border-primary/35"
                    }`}
                  >
                    <span className="block text-sm font-black">Single URL</span>
                    <span className="mt-1 block text-xs text-white/75">
                      One destination, one tracking link
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("bulk")}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      mode === "bulk"
                        ? "border-primary/50 bg-primary/[0.1] text-primary"
                        : "border-white/15 bg-black/20 text-white/80 hover:border-primary/35"
                    }`}
                  >
                    <span className="block text-sm font-black">Bulk URLs</span>
                    <span className="mt-1 block text-xs text-white/75">
                      Many destinations, one campaign
                    </span>
                  </button>
                </div>
              </div>

              {mode === "single" ? (
                <label className="block">
                  <span className={labelCls}>Website URL (required)</span>
                  <input
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://example.com/spring-sale"
                    spellCheck={false}
                    className={inputCls}
                  />
                  {baseUrl.trim() !== "" && singleResult.error && (
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-red-300">
                      {singleResult.error}
                    </p>
                  )}
                </label>
              ) : (
                <label className="block">
                  <span className={labelCls}>Website URLs (one per line)</span>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    rows={8}
                    placeholder={"https://example.com/spring-sale\nhttps://example.com/blog/gift-guide\nhttps://example.com/signup"}
                    spellCheck={false}
                    className={`${inputCls} resize-y font-mono`}
                  />
                </label>
              )}

              <div>
                <span className={labelCls}>Channel presets</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`rounded-full border px-3.5 py-2 text-xs font-black transition-colors ${
                        source === preset.source && medium === preset.medium
                          ? "border-primary/50 bg-primary/[0.12] text-primary"
                          : "border-white/15 bg-black/20 text-white/80 hover:border-primary/35 hover:text-white"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Presets fill Campaign Source and Medium with the values most teams standardize on. Adjust them freely.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>Campaign Source (utm_source)</span>
                  <input
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="facebook"
                    spellCheck={false}
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Medium (utm_medium)</span>
                  <input
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    placeholder="paid_social"
                    spellCheck={false}
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="block">
                <span className={labelCls}>Campaign Name (utm_campaign)</span>
                <input
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="spring-sale-2026"
                  spellCheck={false}
                  className={inputCls}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>Campaign Term (utm_term)</span>
                  <input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="running-shoes"
                    spellCheck={false}
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Campaign Content (utm_content)</span>
                  <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="hero-video"
                    spellCheck={false}
                    className={inputCls}
                  />
                </label>
              </div>

              <p className="text-xs leading-relaxed text-white/70">
                Tip: keep every value lowercase with hyphens between words. GA4 treats Facebook and facebook as two different sources.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={loadDemo}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/35 bg-primary/[0.08] px-4 py-3 text-xs font-black text-primary transition-colors hover:bg-primary/[0.14]"
                >
                  <DemoIcon />
                  Load Example
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-3 text-xs font-black text-white transition-colors hover:border-red-400/45 hover:text-red-300"
                >
                  <ResetIcon />
                  Clear All
                </button>
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {mode === "single" ? "Your Campaign URL" : "Generated URLs"}
                </p>
                <h2 className="mt-3 text-2xl font-black text-white">
                  {mode === "single" ? "Copy and Publish" : "Review, Then Copy All"}
                </h2>
              </div>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-primary">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>

            {mode === "single" ? (
              <>
                <textarea
                  readOnly
                  value={singleResult.error ? singleResult.error : singleResult.finalUrl}
                  spellCheck={false}
                  aria-label="Generated campaign URL"
                  className="mt-7 min-h-[170px] w-full resize-y rounded-2xl border border-white/[0.12] bg-[#080808] p-5 font-mono text-xs leading-relaxed text-emerald-200 outline-none"
                />
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!singleResult.finalUrl}
                    onClick={() => handleCopy("single", singleResult.finalUrl)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                  >
                    <CopyIcon />
                    {copiedKey === "single" ? "Copied" : "Copy URL"}
                  </button>
                </div>
                {copiedKey === "single" && (
                  <p className="mt-4 text-sm font-semibold text-emerald-300">Campaign URL copied to your clipboard.</p>
                )}
                <p className="mt-5 text-xs leading-relaxed text-white/70">
                  Existing query parameters are kept, a UTM parameter already in the URL is replaced instead of duplicated, and any #fragment stays at the end.
                </p>
              </>
            ) : (
              <>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
                      Links ready
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">{validBulkRows.length}</p>
                  </div>
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">
                      Need a fix
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">{invalidBulkCount}</p>
                  </div>
                </div>

                <div className="mt-5 max-h-[340px] space-y-3 overflow-y-auto pr-1">
                  {bulkRows.length === 0 && (
                    <p className="rounded-2xl border border-white/[0.12] bg-[#080808] p-5 text-xs leading-relaxed text-white/60">
                      Add one website URL per line on the left and the campaign fields above. Every generated link appears here with its own copy button.
                    </p>
                  )}
                  {bulkRows.map((row, index) => (
                    <div
                      key={`${row.raw}-${index}`}
                      className="rounded-2xl border border-white/[0.12] bg-[#080808] p-4"
                    >
                      {row.error ? (
                        <p className="break-all font-mono text-xs leading-relaxed text-red-300">
                          {row.raw}: {row.error}
                        </p>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <p className="break-all font-mono text-xs leading-relaxed text-emerald-200">
                            {row.finalUrl}
                          </p>
                          <button
                            type="button"
                            aria-label={`Copy generated URL ${index + 1}`}
                            onClick={() => handleCopy(`row-${index}`, row.finalUrl)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 bg-white/[0.04] px-3 py-2 text-[10px] font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
                          >
                            <CopyIcon />
                            {copiedKey === `row-${index}` ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={validBulkRows.length === 0}
                    onClick={() =>
                      handleCopy("all", validBulkRows.map((row) => row.finalUrl).join("\n"))
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                  >
                    <CopyIcon />
                    {copiedKey === "all" ? "Copied" : "Copy All"}
                  </button>
                </div>
                {copiedKey === "all" && (
                  <p className="mt-4 text-sm font-semibold text-emerald-300">All generated URLs copied to your clipboard.</p>
                )}
              </>
            )}

            {copyError && (
              <p className="mt-4 text-sm font-semibold text-red-300">{copyError}</p>
            )}
          </aside>
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            How To Use This Tool
          </p>
          <h2 className="mt-3 text-center text-3xl font-black text-white">
            Three Steps To a Trackable Campaign Link
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">1</p>
              <h3 className="mt-4 text-xl font-black text-white">Add your destination</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Paste the page you want traffic to land on. For a launch, switch to Bulk URLs and
                paste every destination, one per line, so the whole campaign gets tagged in a
                single pass.
              </p>
            </article>
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">2</p>
              <h3 className="mt-4 text-xl font-black text-white">Set the campaign fields</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Tap a channel preset, then add the campaign name. Use term for paid search
                keywords and content for creative variants. Keep values lowercase so GA4 groups
                them into one clean row.
              </p>
            </article>
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">3</p>
              <h3 className="mt-4 text-xl font-black text-white">Copy, publish, log it</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Copy the generated URL into your ad, email, or post. Then record it in your
                shared tracking sheet next to the date and owner, so next quarter's report still
                makes sense.
              </p>
            </article>
          </div>
        </section>

        <UtmBuilderArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {UtmFaqs.map((f, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-sm font-bold text-white/85">{f.q}</span>
                  <span className="shrink-0 text-lg text-primary">{openFaq === i ? "-" : "+"}</span>
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
                { href: "/tools/title-tag-preview", name: "Title Tag Preview" },
                { href: "/tools/bulk-redirect-generator", name: "Bulk Redirect Generator" },
                { href: "/tools/bulk-email-extractor", name: "Bulk Email Extractor" },
                { href: "/tools/open-graph-preview", name: "Open Graph Preview" },
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
            <h2 className="text-2xl font-black text-white">Traffic You Cannot Attribute Is Budget You Cannot Defend</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Clean campaign tracking is one piece of a measurable growth system. Get a free SEO
              audit and RankVelt will review your analytics setup, landing pages, and search
              visibility in one pass.
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
function UtmBuilderArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Campaign Tracking Basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What UTM Parameters Do and Why Marketers Rely on Them</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            UTM parameters are short tags added to the end of a URL. The name comes from Urchin Tracking
            Module, after the Urchin analytics software that Google acquired and turned into Google
            Analytics. When someone clicks a tagged link, your analytics tool reads the tags and records
            exactly where the visit came from: which platform sent it, which channel it belongs to, and
            which campaign it was part of. The destination page never changes. Only the label on the
            visit gets more precise.
          </p>
          <p>
            They exist because the alternative is guessing. Browsers do pass referrer information, but it
            disappears constantly: email apps hand clicks to browsers without context, social apps open
            links inside their own web views, and moving from an HTTPS page to an HTTP page strips the
            referrer entirely. Untagged campaign traffic falls into the Direct bucket or gets misfiled,
            so a launch email and a LinkedIn post can look identical in the report. UTM tags make every
            inbound campaign describe itself, in its own words, the moment the page loads.
          </p>
          <p>
            A UTM builder turns that idea into a fill-in form because hand-typing parameters is where the
            errors creep in. One transposed letter creates a brand new row in the report, and nobody
            notices until the numbers are presented. The builder above handles the mechanical parts:
            merging tags into URLs that already carry parameters, replacing a tag instead of duplicating
            it, and keeping the fragment at the end where it belongs.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The Five Parameters</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">One Job per Parameter: A Practical Decision Guide</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A campaign URL has five possible UTM parameters, but only three belong on almost every link:
            source, medium, and campaign. Term and content are specialists. Add them only when knowing
            the answer would change a decision you actually make, because every extra field is another
            chance for the team to disagree on what belongs in it.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong className="text-white">utm_source</strong> names the platform or publisher sending the click: google, facebook, newsletter, a partner's name. Pick one name per platform and never improvise a second spelling.</li>
            <li><strong className="text-white">utm_medium</strong> names the channel type: cpc, email, paid_social, display, referral. Draw it from a short fixed list that the whole team shares.</li>
            <li><strong className="text-white">utm_campaign</strong> names the initiative so every channel rolls up into one view: spring-sale, product-launch, webinar-series. Add a month, quarter, or year when the campaign repeats.</li>
            <li><strong className="text-white">utm_term</strong> names the paid keyword when you tag search ads manually. It earns its keep on networks without automatic tagging; inside Google Ads, auto-tagging already carries this detail.</li>
            <li><strong className="text-white">utm_content</strong> names the creative or link variant when several links share one destination: hero-video, text-link, version-b. This is the A/B testing field.</li>
          </ul>
          <p>
            The working test is simple. If two links would land in the same report row and you would treat
            them identically, they do not need separate term or content values. If you plan to kill the
            losing creative next week, they do. Parameters exist to support decisions, not to decorate
            URLs.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Naming Conventions</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Naming Conventions That Keep GA4 Reports Clean</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            GA4 reads UTM values literally, character for character. That single fact drives most of the
            discipline in this article. Facebook, facebook, and FB are three different sources, and no
            setting merges them after the data lands. The cheapest fix is lowercase discipline: decide
            that every value is typed in lowercase, always, and mixed-case rows simply stop appearing.
            Make it a habit in the builder, not a cleanup job in a spreadsheet later.
          </p>
          <p>
            Pick one separator and stay with it. Hyphens read cleanly inside campaign names, so
            spring-sale-2026 scans well in a report; underscores between ideas are an acceptable
            alternative. What breaks reports is variety: spaces turn into %20 strings or get encoded
            differently by different tools, and characters like ampersands or question marks can split a
            URL in the wrong place. Plain letters, numbers, and one separator character will survive
            every platform the link passes through.
          </p>
          <p>
            The medium field is where teams drift most. One person writes cpc, another writes paid-search,
            a third writes ppc, and suddenly the paid search channel is fractured across three rows that
            no chart can total. Write down a fixed vocabulary of mediums (six to eight covers most
            businesses), match it to the channel groupings you report on, and treat adding a new one as a
            team decision rather than a personal choice. Campaign names get the same treatment: describe
            the initiative and its timing, like launch-webinar-march, instead of names like promo1 or
            test that nobody can decode a quarter later.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Working in Bulk</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Building UTM Links in Bulk for Real Campaigns</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Real campaigns rarely need one link. A launch needs the landing page, the pricing page, and
            the signup page tagged for email, plus the same three for paid social, plus partner
            placements. Built by hand, that is dozens of URLs and dozens of chances to typo one value and
            quietly split the campaign in the report. This is the job bulk mode exists for.
          </p>
          <p>
            The workflow is mechanical on purpose. Paste one destination per line, set the campaign fields
            once, and the same tags are applied to every URL with the merging rules handled for you.
            Review the generated rows, copy them individually or all at once, and the set is ready to
            drop into ad platforms and email tools. Because every link comes from one field set, the
            campaign rolls up perfectly instead of arriving as near-duplicates.
          </p>
          <p>
            The craft is in deciding what varies. When each ad points to a different page, hold campaign
            constant and let utm_content carry the creative difference, so you can compare pages and
            creatives independently. When one page runs across five platforms, hold campaign constant
            again and let source and medium do the separating. Keep the initiative glued together with a
            single campaign value and GA4 can show you the whole launch, then let you drill into any slice
            of it.
          </p>
          <p>
            Before the set ships, click one generated link yourself and confirm the tags survive the trip.
            Some ad platforms and link shorteners append their own parameters or strip yours, and it is
            far cheaper to discover that with a single test click than in the first campaign report.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Avoiding Dirty Data</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Common UTM Mistakes That Quietly Corrupt Reports</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Bad UTM data never announces itself. There is no warning banner in GA4; the report simply
            shows more rows, thinner numbers, and channels that refuse to add up. These are the patterns
            behind most of it.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Inventing a new medium for every campaign. Social, social-media, sm, and paid social variants until the channel view is meaningless. Mediums come from the fixed list or not at all.</li>
            <li>Abbreviating platforms one month and spelling them out the next. fb, ig, and tw might save a second today and cost an hour of report archaeology later.</li>
            <li>Typing campaign names with capitals and spaces. The report fills with %20 strings and split rows, and two halves of one campaign never meet.</li>
            <li>Stuffing creative details into utm_campaign. Every ad becomes its own campaign, the rollup view disappears, and comparing channels turns into spreadsheet work.</li>
            <li>Naming the same initiative differently per channel, like spring-sale on email and Spring Sale 26 on ads, so the cross-channel total exists nowhere.</li>
            <li>Publishing links without clicking them. Redirects, shorteners, and platform wrappers can drop parameters before the page loads; a ten second test click catches what a report audit finds next month.</li>
          </ul>
          <p>
            None of these are knowledge problems. They are consistency problems, and they are solved at the
            moment the link is built: one builder, one convention, one vocabulary. Prevention is the only
            cure, because GA4 stores what arrived and offers no merge tool for values you wish had matched.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Team Workflow</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Documenting Campaigns So the Next Marketer Can Read Them</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A perfectly tagged URL that nobody recorded becomes a riddle in next quarter's report. Keep a
            shared tracking sheet with one row per published link: the date, the destination, the source,
            medium, and campaign values, and who built it. It takes a minute per campaign and saves hours
            when someone asks why a source called partner-newsletter appears in March and never again.
            The sheet also doubles as the convention document, because the examples in it are the ones
            the team actually used.
          </p>
          <p>
            Presets do the other half of the documentation work. The channel buttons above encode the
            agreed source and medium pairs, so a new team member produces compliant links on their first
            day without memorizing anything. When a platform changes or a new channel appears, update
            the preset once and every future link follows. Governance that lives inside the tool beats
            governance that lives in a document nobody opens.
          </p>
          <p>
            Put together, the division of labor is simple. The builder guarantees syntax: valid URLs,
            merged parameters, nothing duplicated. The convention guarantees meaning: the same words for
            the same things, every time. Spend ten minutes agreeing on the convention before your next
            launch, build every link with the tool above, and your campaign reports stay trustworthy
            enough to make budget decisions on.
          </p>
        </div>
      </section>
    </>
  );
}
