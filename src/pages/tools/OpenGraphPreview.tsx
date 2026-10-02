// OG-VERSION-1
// RankVelt tool page: Open Graph Preview (100% free, browser only)
// Place at: src/pages/tools/OpenGraphPreview.tsx
// Styled to match the RankVelt dark theme (same shell as other tool pages).
// React only. No external dependencies. No backend required.

import { useEffect, useMemo, useState } from "react";

const inputCls =
  "mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50";

const labelCls =
  "block text-[11px] font-black uppercase tracking-[0.18em] text-white/50";

const WORKER_KEY = "rv-og-worker";

type ImgState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ok"; width: number; height: number }
  | { state: "error" };

type CheckStatus = "pass" | "warn" | "fail";
interface Check {
  label: string;
  status: CheckStatus;
  detail: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, '&quot;');
}

function domainOf(url: string): string {
  try {
    return new URL(url.trim()).hostname.replace(/^www\./, "");
  } catch {
    return "yourdomain.com";
  }
}

const SAMPLE = {
  title: "RankVelt: AI-First SEO for US Businesses",
  description:
    "Technical SEO, local SEO and content that gets US businesses ranked on Google and cited by AI search. Free audit included.",
  image: "https://rankvelt.com/og-image.png",
  url: "https://rankvelt.com/",
};

const SITE_URL = "https://rankvelt.com";

const OG_FAQS: { q: string; a: string }[] = [
  {
    q: "What is an Open Graph checker?",
    a: "An Open Graph checker is a free tool that inspects the Open Graph meta tags on any webpage and shows you how that page will look when shared on social media. It validates your og:title, og:description, og:image, og:url and other tags, flags missing or broken ones, and renders live previews of the link cards for Facebook, X (Twitter) and LinkedIn so you can fix problems before you share.",
  },
  {
    q: "What are the required Open Graph tags?",
    a: "The Open Graph protocol defines four required tags: og:title (the title shown in the preview), og:type (the kind of object, usually \"website\" or \"article\"), og:image (the preview image URL) and og:url (the canonical URL of the page). In practice you should also always set og:description and og:site_name. Pages missing any of the four required tags may render with a small thumbnail, a wrong title, or no rich preview at all on some platforms.",
  },
  {
    q: "What is the ideal og:image size?",
    a: "Use 1200 x 630 pixels (a 1.91:1 ratio). That size renders crisply on Facebook, LinkedIn, X, Discord and WhatsApp. Keep the file under 8 MB for Facebook and LinkedIn (under 5 MB is safer), and under 300 KB if WhatsApp previews matter to you, since WhatsApp is pickier about large files. Always use an absolute HTTPS URL for og:image, and add og:image:width and og:image:height so crawlers do not have to download the image to learn its dimensions.",
  },
  {
    q: "What is the difference between Open Graph tags and Twitter Cards?",
    a: "Open Graph tags (og:) were created by Facebook and are now read by Facebook, LinkedIn, WhatsApp, Discord, Slack and most other platforms. Twitter Cards (twitter:) are X specific. X falls back to your og: tags when twitter: tags are missing, but it only renders the large image card when twitter:card is set to \"summary_large_image\". Best practice: set both. Keep og: tags as the base and add twitter:card, plus twitter:title, twitter:description and twitter:image if you want X specific copy.",
  },
  {
    q: "Why is my link showing the wrong image or an old title?",
    a: "Almost always caching. Facebook, LinkedIn and X cache link previews for days or weeks after the first scrape. Updating your tags does not update old shares until each platform re-scrapes the URL. Use the Facebook Sharing Debugger to force a re-scrape, and the LinkedIn Post Inspector to refresh LinkedIn\u2019s cache. If the preview is still wrong after a re-scrape, check that og:image is an absolute HTTPS URL that returns a 200 status, and that no redirect chain or login wall blocks the crawler.",
  },
  {
    q: "How do I force Facebook or LinkedIn to refresh my link preview?",
    a: "Paste the URL into the Facebook Sharing Debugger and click \"Scrape Again\" until the fetched tags match your page. For LinkedIn, paste the URL into the LinkedIn Post Inspector, which shows exactly what LinkedIn sees and refreshes its cache. Note that previously published posts keep their old preview; only new shares pick up the refreshed version.",
  },
  {
    q: "Why does my preview look different on X than on Facebook?",
    a: "Each platform crops and truncates differently. X\u2019s large image card uses a 2:1 crop, Facebook uses 1.91:1, and LinkedIn crops to roughly 1.91:1 but displays at a smaller size. Title truncation also differs: Facebook cuts titles around 60 characters, X around 70. That is why one 1200 x 630 image with centered safe content and a title under 60 characters is the safest universal setup.",
  },
  {
    q: "Do Open Graph tags help SEO?",
    a: "Not directly. Google has said social shares are not a ranking factor, and og: tags do not change how Google indexes your page. They help indirectly: better looking previews get more clicks and shares, which brings more traffic, more brand searches and more chances of earning backlinks. Think of OG tags as conversion optimization for your social traffic, not a ranking tactic.",
  },
  {
    q: "Can I test Open Graph tags on a localhost or staging site?",
    a: "Yes, with a manual entry tool like this one. URL based checkers and the official platform debuggers can only fetch publicly reachable pages, so they cannot see localhost or password protected staging. Paste your planned og:title, og:description and og:image URL into the manual mode on this page and you will see exactly how the cards will render once the page goes live.",
  },
  {
    q: "What does og:type do, and which value should I use?",
    a: "og:type tells platforms what kind of object the page represents. Use \"website\" for homepages, landing pages and tool pages, and \"article\" for blog posts and news (article unlocks extra properties like article:published_time and article:author). If you omit og:type, platforms default to \"website\", so an explicit value is mostly about correctness and unlocking article specific features.",
  },
];

export default function OpenGraphPreview() {
  const [mode, setMode] = useState<"manual" | "url">("manual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Manual tag fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [ogType, setOgType] = useState("website");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");

  // URL mode state
  const [urlInput, setUrlInput] = useState("");
  const [workerEndpoint, setWorkerEndpoint] = useState(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem(WORKER_KEY) || "" : ""
  );
  const [endpointDraft, setEndpointDraft] = useState(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem(WORKER_KEY) || "" : ""
  );
  const [endpointSaved, setEndpointSaved] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchNote, setFetchNote] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [imgInfo, setImgInfo] = useState<ImgState>({ state: "idle" });
  const [copied, setCopied] = useState(false);

  // FAQPage JSON-LD built from the same FAQ array rendered below.
  useEffect(() => {
    document.getElementById("rankvelt-open-graph-schema")?.remove();
    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-open-graph-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: OG_FAQS.map((faq) => ({
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

  // Verify the og:image actually loads and read its real dimensions.
  // Reading naturalWidth/naturalHeight needs no canvas, so no CORS issues.
  useEffect(() => {
    const src = imageUrl.trim();
    if (!/^https?:\/\/.+/i.test(src)) {
      setImgInfo({ state: "idle" });
      return;
    }
    setImgInfo({ state: "loading" });
    let cancelled = false;
    const t = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        if (!cancelled)
          setImgInfo({ state: "ok", width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        if (!cancelled) setImgInfo({ state: "error" });
      };
      img.src = src;
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [imageUrl]);

  const checks: Check[] = useMemo(() => {
    const list: Check[] = [];
    const t = title.trim();
    const d = description.trim();
    const img = imageUrl.trim();
    const u = pageUrl.trim();

    if (!t) list.push({ label: "og:title", status: "fail", detail: "Missing. Platforms will guess a title, usually badly." });
    else if (t.length > 60)
      list.push({ label: "og:title", status: "warn", detail: `${t.length} characters. Facebook truncates around 60.` });
    else list.push({ label: "og:title", status: "pass", detail: `${t.length}/60 characters. Good.` });

    if (!d) list.push({ label: "og:description", status: "warn", detail: "Missing. Add one or two compelling sentences." });
    else if (d.length > 200)
      list.push({ label: "og:description", status: "warn", detail: `${d.length} characters. X truncates around 200.` });
    else list.push({ label: "og:description", status: "pass", detail: `${d.length}/200 characters. Good.` });

    if (!img) list.push({ label: "og:image", status: "fail", detail: "Missing. No image means a plain text link card." });
    else if (!/^https?:\/\/.+/i.test(img))
      list.push({ label: "og:image", status: "fail", detail: "Must be an absolute URL starting with https://, not a relative path." });
    else {
      if (!/^https:\/\//i.test(img))
        list.push({ label: "og:image", status: "warn", detail: "Not HTTPS. Many platforms refuse to display http:// images." });
      if (imgInfo.state === "error")
        list.push({ label: "og:image loads", status: "fail", detail: "The image URL did not load. Check the URL for typos or hotlink blocking." });
      else if (imgInfo.state === "ok") {
        const { width, height } = imgInfo;
        if (width < 600 || height < 315)
          list.push({ label: "og:image size", status: "fail", detail: `${width}x${height}. Under Facebook's 600x315 minimum, renders as a tiny thumbnail.` });
        else if (width < 1200 || height < 630)
          list.push({ label: "og:image size", status: "warn", detail: `${width}x${height}. Works, but 1200x630 is the recommended size for crisp cards.` });
        else
          list.push({ label: "og:image size", status: "pass", detail: `${width}x${height}. Meets the 1200x630 recommendation.` });
      } else if (imgInfo.state === "loading")
        list.push({ label: "og:image loads", status: "warn", detail: "Checking the image URL..." });
      else list.push({ label: "og:image", status: "pass", detail: "Absolute URL. Format looks valid." });
    }

    if (!u) list.push({ label: "og:url", status: "warn", detail: "Missing. Set it to the canonical URL so shares consolidate correctly." });
    else if (!/^https?:\/\/.+/i.test(u))
      list.push({ label: "og:url", status: "fail", detail: "Must be an absolute URL." });
    else list.push({ label: "og:url", status: "pass", detail: "Absolute URL. Good." });

    list.push({ label: "og:type", status: "pass", detail: `Set to "${ogType}". Use "article" for blog posts.` });

    if (twitterCard === "summary_large_image")
      list.push({ label: "twitter:card", status: "pass", detail: "Large image card enabled for X." });
    else
      list.push({ label: "twitter:card", status: "warn", detail: "\"summary\" renders a small thumbnail on X. Use \"summary_large_image\" for the big card." });

    return list;
  }, [title, description, imageUrl, pageUrl, ogType, twitterCard, imgInfo]);

  const score = useMemo(() => {
    let s = 100;
    for (const c of checks) {
      if (c.status === "fail") s -= 15;
      else if (c.status === "warn") s -= 5;
    }
    return Math.max(0, s);
  }, [checks]);

  function buildMetaHtml(): string {
    const lines: string[] = [];
    const t = title.trim();
    const d = description.trim();
    const img = imageUrl.trim();
    const u = pageUrl.trim();
    if (t) lines.push(`<meta property="og:title" content="${escapeHtml(t)}" />`);
    if (d) lines.push(`<meta property="og:description" content="${escapeHtml(d)}" />`);
    lines.push(`<meta property="og:type" content="${escapeHtml(ogType)}" />`);
    if (u) lines.push(`<meta property="og:url" content="${escapeHtml(u)}" />`);
    if (img) {
      lines.push(`<meta property="og:image" content="${escapeHtml(img)}" />`);
      if (imgInfo.state === "ok") {
        lines.push(`<meta property="og:image:width" content="${imgInfo.width}" />`);
        lines.push(`<meta property="og:image:height" content="${imgInfo.height}" />`);
      }
    }
    lines.push(`<meta name="twitter:card" content="${escapeHtml(twitterCard)}" />`);
    return lines.join("\n");
  }

  async function copyHtml() {
    const html = buildMetaHtml();
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = html;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {
        setCopied(false);
      }
      document.body.removeChild(ta);
    }
    setTimeout(() => setCopied(false), 2500);
  }

  function loadSample() {
    setTitle(SAMPLE.title);
    setDescription(SAMPLE.description);
    setImageUrl(SAMPLE.image);
    setPageUrl(SAMPLE.url);
    setOgType("website");
    setTwitterCard("summary_large_image");
  }

  function saveEndpoint() {
    const v = endpointDraft.trim().replace(/\/$/, "");
    if (typeof localStorage !== "undefined") localStorage.setItem(WORKER_KEY, v);
    setWorkerEndpoint(v);
    setEndpointSaved(true);
    setTimeout(() => setEndpointSaved(false), 2500);
  }

  async function fetchViaWorker() {
    const ep = workerEndpoint.trim().replace(/\/$/, "");
    const target = urlInput.trim();
    if (!ep || !target) return;
    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      setFetchError("That does not look like a valid URL. Include https:// at the start.");
      return;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      setFetchError("Only http and https URLs can be checked.");
      return;
    }
    setFetching(true);
    setFetchError(null);
    setFetchNote(null);
    try {
      const res = await fetch(ep + "?url=" + encodeURIComponent(parsed.toString()));
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "The worker returned an error.");
      const tags: Record<string, string> = data.tags || {};
      const get = (k: string) => (typeof tags[k] === "string" ? tags[k] : "");
      const found = Object.keys(tags).length;
      if (found === 0) {
        setFetchError("The page loaded but no og: or twitter: meta tags were found in its HTML.");
        return;
      }
      if (get("og:title")) setTitle(get("og:title"));
      if (get("og:description")) setDescription(get("og:description"));
      if (get("og:image")) setImageUrl(get("og:image"));
      if (get("og:url")) setPageUrl(get("og:url"));
      if (get("og:type") === "article" || get("og:type") === "website") setOgType(get("og:type"));
      if (get("twitter:card") === "summary" || get("twitter:card") === "summary_large_image")
        setTwitterCard(get("twitter:card"));
      setFetchNote(`Loaded ${found} meta tags from ${parsed.hostname}. Switching to manual mode so you can edit and preview them.`);
      setMode("manual");
    } catch (e: any) {
      setFetchError(e.message || "Could not reach the worker. Check the endpoint URL and try again.");
    } finally {
      setFetching(false);
    }
  }

  const domain = domainOf(pageUrl);
  const imgSrc = /^https?:\/\/.+/i.test(imageUrl.trim()) ? imageUrl.trim() : "";
  const imgBroken = imgInfo.state === "error";

  const scoreColor =
    score >= 85 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.08] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            Free RankVelt Tool
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Open Graph <span className="text-gradient-gold">Checker</span> &amp; Preview Tool
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            See exactly how your link cards render on Facebook, X and LinkedIn before you
            share. Catch missing tags, bad image sizes and truncated copy, then copy the
            fixed HTML.
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
            No signup. No tracking. Everything runs in your browser.
          </p>
        </section>

        {/* Tool */}
        <section className="mx-auto mt-12 max-w-6xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            {/* Mode tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMode("manual")}
                className={`rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] transition-colors ${
                  mode === "manual"
                    ? "bg-primary text-black"
                    : "border border-white/[0.08] bg-black/30 text-white/60 hover:text-white"
                }`}
              >
                Enter tags manually
              </button>
              <button
                onClick={() => setMode("url")}
                className={`rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] transition-colors ${
                  mode === "url"
                    ? "bg-primary text-black"
                    : "border border-white/[0.08] bg-black/30 text-white/60 hover:text-white"
                }`}
              >
                Enter URL
              </button>
              <button
                onClick={loadSample}
                className="ml-auto rounded-xl border border-white/[0.08] bg-black/30 px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-white"
              >
                Load sample
              </button>
            </div>

            {mode === "url" && (
              <div className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-5">
                <h2 className="text-sm font-black uppercase tracking-[0.14em] text-amber-300">
                  About URL fetching
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  Browsers block direct fetching of other websites (CORS), so this tool
                  cannot scrape a URL on its own. URL mode works through a tiny Cloudflare
                  Worker proxy you deploy (free tier is plenty). The worker code ships with
                  this tool. Paste your worker endpoint below to unlock URL fetching, or
                  use manual mode, which works right now with zero setup, even for
                  localhost and staging drafts.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelCls}>Worker endpoint</label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        value={endpointDraft}
                        onChange={(e) => setEndpointDraft(e.target.value)}
                        placeholder="https://og-proxy.yourname.workers.dev"
                        className={inputCls + " sm:flex-1"}
                      />
                      <button
                        onClick={saveEndpoint}
                        className="rounded-xl border border-white/[0.08] bg-black/40 px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                      >
                        {endpointSaved ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Page URL to check</label>
                    <input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/blog/my-post"
                      className={inputCls}
                    />
                  </div>
                </div>
                <button
                  onClick={fetchViaWorker}
                  disabled={!workerEndpoint.trim() || !urlInput.trim() || fetching}
                  className="mt-4 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {fetching
                    ? "Fetching..."
                    : !workerEndpoint.trim()
                      ? "Save a worker endpoint first"
                      : "Fetch tags"}
                </button>
                {fetchError && (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm leading-relaxed text-red-300">
                    {fetchError}
                  </div>
                )}
                {fetchNote && (
                  <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] px-4 py-3 text-sm leading-relaxed text-emerald-300">
                    {fetchNote}
                  </div>
                )}
              </div>
            )}

            {mode === "manual" && (
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-5">
                {/* Fields */}
                <div className="space-y-4 lg:col-span-3">
                  <div>
                    <label className={labelCls}>
                      og:title{" "}
                      <span className={title.trim().length > 60 ? "text-amber-400" : "text-white/30"}>
                        ({title.trim().length}/60)
                      </span>
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="The headline shown on the card"
                      className={inputCls}
                    />
                    {title.trim().length > 60 && (
                      <p className="mt-1.5 text-xs text-amber-400">
                        Over 60 characters. Facebook will truncate this title.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>
                      og:description{" "}
                      <span className={description.trim().length > 200 ? "text-amber-400" : "text-white/30"}>
                        ({description.trim().length}/200)
                      </span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="One or two compelling sentences"
                      rows={3}
                      className={inputCls + " resize-none"}
                    />
                    {description.trim().length > 200 && (
                      <p className="mt-1.5 text-xs text-amber-400">
                        Over 200 characters. X will truncate this description.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>og:image URL</label>
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://yourdomain.com/og-image.png"
                      className={inputCls}
                    />
                    {imgInfo.state === "ok" && (
                      <p className="mt-1.5 text-xs text-emerald-400">
                        Image loads. Actual size: {imgInfo.width} x {imgInfo.height}px.
                      </p>
                    )}
                    {imgInfo.state === "error" && (
                      <p className="mt-1.5 text-xs text-red-400">
                        This image URL did not load. Check it for typos.
                      </p>
                    )}
                    {imgInfo.state === "loading" && (
                      <p className="mt-1.5 text-xs text-white/40">Checking image...</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>og:url</label>
                      <input
                        value={pageUrl}
                        onChange={(e) => setPageUrl(e.target.value)}
                        placeholder="https://yourdomain.com/page"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>og:type</label>
                      <select value={ogType} onChange={(e) => setOgType(e.target.value)} className={inputCls}>
                        <option value="website">website</option>
                        <option value="article">article</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>twitter:card</label>
                    <select
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value)}
                      className={inputCls}
                    >
                      <option value="summary_large_image">summary_large_image (big card)</option>
                      <option value="summary">summary (small thumbnail)</option>
                    </select>
                  </div>
                </div>

                {/* Tag health */}
                <div className="lg:col-span-2">
                  <div className="rounded-xl border border-white/[0.08] bg-black/30 p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white/70">
                        Tag health
                      </h2>
                      <span className={`text-3xl font-black ${scoreColor}`}>{score}</span>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {checks.map((c, i) => (
                        <li key={i} className="flex gap-2.5 text-sm">
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                              c.status === "pass"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : c.status === "warn"
                                  ? "bg-amber-500/15 text-amber-400"
                                  : "bg-red-500/15 text-red-400"
                            }`}
                          >
                            {c.status === "pass" ? "OK" : c.status === "warn" ? "!" : "X"}
                          </span>
                          <span>
                            <span className="font-bold text-white/85">{c.label}: </span>
                            <span className="text-white/55">{c.detail}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={copyHtml}
                      className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
                    >
                      {copied ? "Copied to clipboard" : "Copy meta tags HTML"}
                    </button>
                    <p className="mt-2.5 text-xs leading-relaxed text-white/40">
                      Generates the full corrected tag block, including detected image
                      dimensions, ready to paste into your page head.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Live previews */}
        <section className="mx-auto mt-10 max-w-6xl">
          <h2 className="text-center text-xl font-black uppercase tracking-[0.14em] text-white/80">
            Live previews
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-white/45">
            These cards update as you type and mimic how each platform crops, truncates
            and styles your link.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Facebook */}
            <div>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                Facebook
              </p>
              <div className="overflow-hidden rounded-lg border border-black/20 bg-white">
                <div className="flex aspect-[1.91/1] items-center justify-center bg-[#e4e6eb]">
                  {imgSrc && !imgBroken ? (
                    <img src={imgSrc} alt="OG preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-4 text-center text-xs text-[#65676b]">
                      {imgBroken ? "Image failed to load" : "No image set"}
                    </span>
                  )}
                </div>
                <div className="bg-[#f0f2f5] px-3 py-2.5">
                  <div className="truncate text-[11px] uppercase tracking-wide text-[#65676b]">
                    {domain}
                  </div>
                  <div className="truncate text-[15px] font-semibold leading-snug text-[#050505]">
                    {title.trim() || "Your page title appears here"}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[#65676b]">
                    {description.trim() || "Your description appears here. Keep it under 200 characters so it never truncates."}
                  </div>
                </div>
              </div>
            </div>

            {/* X */}
            <div>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                X (Twitter)
              </p>
              <div className="overflow-hidden rounded-2xl border border-[#2f3336] bg-black">
                <div className="flex aspect-[2/1] items-center justify-center bg-[#16181c]">
                  {imgSrc && !imgBroken ? (
                    <img src={imgSrc} alt="OG preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-4 text-center text-xs text-[#71767b]">
                      {imgBroken ? "Image failed to load" : "No image set"}
                    </span>
                  )}
                </div>
                <div className="px-4 py-3">
                  <div className="line-clamp-2 text-[15px] font-bold leading-snug text-[#e7e9ea]">
                    {title.trim() || "Your page title appears here"}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-[15px] leading-snug text-[#71767b]">
                    {description.trim() || "Your description appears here."}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[14px] text-[#71767b]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span className="truncate">{domain}</span>
                  </div>
                </div>
              </div>
              {twitterCard === "summary" && (
                <p className="mt-2 text-xs text-amber-400">
                  Note: "summary" card type shows a small thumbnail on X, not this large layout.
                </p>
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                LinkedIn
              </p>
              <div className="overflow-hidden rounded-lg border border-black/20 bg-white">
                <div className="flex aspect-[1.91/1] items-center justify-center bg-[#e8e8e8]">
                  {imgSrc && !imgBroken ? (
                    <img src={imgSrc} alt="OG preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-4 text-center text-xs text-[rgba(0,0,0,0.6)]">
                      {imgBroken ? "Image failed to load" : "No image set"}
                    </span>
                  )}
                </div>
                <div className="px-3 py-2.5">
                  <div className="line-clamp-2 text-[14px] font-semibold leading-snug text-[rgba(0,0,0,0.9)]">
                    {title.trim() || "Your page title appears here"}
                  </div>
                  <div className="mt-0.5 truncate text-[12px] text-[rgba(0,0,0,0.6)]">
                    {domain}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                LinkedIn feed cards show the title and domain only, no description.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-10 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-white/[0.06]">
              {OG_FAQS.map((f, i) => (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-white/85">{f.q}</span>
                    <span className="shrink-0 text-lg text-primary">
                      {openFaq === i ? "-" : "+"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="pb-4 pr-8 text-sm leading-relaxed text-white/60">{f.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      <OpenGraphPreviewArticle />

      <section className="mx-auto mt-8 max-w-4xl">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
          <h2 className="text-xl font-black text-white">Related free tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { href: "/tools/title-tag-preview", name: "Title Tag Preview" },
              { href: "/tools/robots-txt-generator", name: "Robots.txt Generator" },
              { href: "/tools/xml-sitemap-generator", name: "XML Sitemap Generator" },
              { href: "/tools/bulk-redirect-generator", name: "Bulk Redirect Generator" },
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
          <h2 className="text-2xl font-black text-white">Shared Links Not Converting?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            A broken preview is usually a symptom of wider on-page and technical gaps. Get a free
            SEO audit and RankVelt will check your tags, structure, and speed in one pass.
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
function OpenGraphPreviewArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Why Previews Break</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Why Your Link Preview Breaks When the Page Loads Fine</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The confusing thing about broken link previews is that the page itself works perfectly. You open it in your
            browser, the image loads, everything looks right. Then you share the link and get a gray box or no card at all.
            The reason: the preview is not made by your browser. It is made by a crawler on Facebook's, LinkedIn's, or X's
            servers, working in a much harsher environment than your browser.
          </p>
          <p>
            Your browser has cookies, a logged-in session, JavaScript, and a warm cache. The social crawler has none of that.
            It fetches your raw HTML, reads the meta tags, then fetches the image URL separately. If your image only works
            for logged-in users, needs JavaScript to render, or depends on a cookie, the crawler sees nothing and the card
            comes out empty.
          </p>
          <p>
            The usual suspects, in rough order of frequency: a relative image URL like /images/card.jpg instead of a full
            https://yoursite.com/images/card.jpg. An image behind authentication or a staging password. Hotlink protection
            or a firewall blocking unfamiliar user agents. A slow server, so the crawler gives up. A redirect chain on the
            image URL itself, which many crawlers will not follow.
          </p>
          <p>
            This is where a manual open graph checker earns its keep. URL-based checkers only fetch public pages, so they
            cannot help with localhost, staging, or login-walled pages. Pasting your planned tags into a manual preview shows
            exactly what the card will look like once the page is public, before any crawler ever sees it.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Is og:image an absolute https:// URL? Relative URLs are the top offender.</li>
            <li>Does the image URL return 200 for a logged-out visitor?</li>
            <li>Is the image behind auth, a firewall, or hotlink protection?</li>
                      </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Image Dimensions</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Exact Image Sizes for Every Network</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            One image size rules them all: 1200 by 630 pixels, a 1.91 to 1 ratio. It renders crisply on Facebook, LinkedIn,
            X, Slack, Discord, and most messaging apps. Design at exactly that size and you cover the common case with a
            single asset, which is why every open graph image tester uses it as the baseline.
          </p>
          <p>
            But the common case is not every case. X's large card crops to 2:1, slightly wider than Facebook's 1.91:1, so keep
            faces, headlines, and logos inside a centered safe zone with generous margins. LinkedIn displays cards smaller
            than Facebook does, so fine print legible at 1200 pixels turns to mush in the feed: use big type and high
            contrast, and assume nobody will zoom in.
          </p>
          <p>
            File size has limits too. Stay under 8 MB for Facebook and LinkedIn, and treat 5 MB as the practical ceiling.
            WhatsApp is the picky one: keep preview images well under 300 KB if WhatsApp shares matter, because it routinely
            refuses larger files. Heavy images risk the crawler timing out and rendering no image at all.
          </p>
          <p>
            Two tags most people skip make everything more reliable: og:image:width and og:image:height. With explicit
            dimensions, crawlers lay out the card without downloading the image first, which speeds up rendering. Add
            og:image:alt too: it is the accessible description and the fallback text when the image cannot load.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>1200 x 630 px canvas, centered safe zone, big readable type.</li>
            <li>Absolute https:// URL on a publicly reachable, fast server.</li>
            <li>Under 5 MB as a rule; under 300 KB if WhatsApp previews matter.</li>
                      </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Twitter Cards</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Twitter Cards: Summary vs Summary Large Image</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            X reads your Open Graph tags as a fallback, but the card layout is controlled by one X-specific tag:
            twitter:card. The summary card shows a small square thumbnail beside the text; summary_large_image shows a big
            wide image above it. If twitter:card is missing, you usually get the small card even with a perfect 1200 by 630
            og:image, which is why shares look underwhelming on X while looking great on Facebook.
          </p>
          <p>
            For most marketing content, including blog posts, product pages, and landing pages, summary_large_image is the
            right choice: the large visual dominates the timeline and earns the click. The small summary card suits utility
            content where the image is secondary, like documentation or status updates. Match the card type to the content
            instead of defaulting to whatever the template included.
          </p>
          <p>
            You can set X-specific title, description, and image with twitter:title, twitter:description, and twitter:image
            when you want different copy on X than everywhere else. Most sites do not need this: X falls back to og:title,
            og:description, and og:image automatically. Keep og: tags as the single source of truth and add overrides only
            when X genuinely needs different wording.
          </p>
          <p>
            One more X quirk: the official card validator was retired, so you cannot force-refresh X's cache the way you can
            with Facebook's debugger. X re-crawls on its own schedule and mistakes linger. Use a fresh URL or a cache-busting
            query parameter while testing, and get tags right before the first real share, because that first scrape sets the
            cached version.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Use summary_large_image for visual, marketing-led content.</li>
            <li>Keep og: tags as the base layer; X falls back to them automatically.</li>
                        <li>Finalize tags before the first share, since X offers no manual refresh.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Titles and Descriptions</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Writing Titles and Descriptions That Survive Truncation</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Every platform truncates, and every platform truncates at a different length. Facebook cuts titles at around 60
            characters, X at around 70, LinkedIn somewhere in between, and descriptions get roughly 110 to 200 characters
            depending on the network. A 120-character title is wasted effort if half of it never renders.
          </p>
          <p>
            The fix is front-loading: put the important words first. Write every social title as if only the first 55
            characters will ever be seen, because on some network, those will be the only characters seen. Branded openers
            that bury the point lose to titles that state the value immediately.
          </p>
          <p>
            Descriptions follow the same logic. Lead with the benefit or the differentiator, not the throat-clearing. A
            description that opens with what the page does and who it is for outperforms a polite welcome message, because
            the welcome gets cut and the benefit is what earns the click. Every word before the truncation point should earn
            its place.
          </p>
          <p>
            Keep text out of the image itself, or at least out of the edges. Platforms crop differently, messaging apps
            shrink aggressively, and baked-in text becomes unreadable the moment it shrinks. If the image must carry words,
            keep them large, centered, and few: a short headline and a logo, never a paragraph.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Titles under 60 characters with key words inside the first 55.</li>
            <li>Descriptions of 110 to 155 characters that lead with the benefit.</li>
                        <li>Preview the same tags for Facebook, X, and LinkedIn before publishing.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Cache Busting</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Beating the Cache: Forcing Platforms to Re-scrape</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The maddening scenario: you fix the tags, share the link again, and the old broken preview stares back. Nothing
            is wrong with your tags anymore. The platform cached the earlier scrape and has no reason to fetch again.
            Updating your HTML does not update the cache. You must ask each platform explicitly to re-scrape, which is what
            every open graph debugger workflow is built around.
          </p>
          <p>
            Facebook gives you the Sharing Debugger. Paste the URL and it shows what the crawler actually sees: fetched tags,
            the image it found, and warnings worth fixing. Re-scrape until the preview matches your page. It is also the
            fastest way to confirm a fix worked, because you see the crawler's view instead of guessing from the share
            dialog.
          </p>
          <p>
            LinkedIn has the Post Inspector for the same job: paste the URL, see what LinkedIn sees, and the inspection
            refreshes the cached version. One gotcha: LinkedIn caches aggressively, and the inspector sometimes needs two or
            three runs before the new image sticks. Re-run rather than assuming your tags are still wrong.
          </p>
          <p>
            Two caveats surprise people every time. Already-published posts keep their old preview forever: refreshing the
            cache only affects new shares. And while developing, dodge the cache entirely with versioned URLs: test with a
            ?v=2 style parameter instead of fighting yesterday's scrape of the same address.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Fix tags first, then re-scrape in the Facebook Sharing Debugger.</li>
            <li>Re-run the LinkedIn Post Inspector, twice if the image does not stick.</li>
                        <li>Use versioned test URLs while developing to sidestep stale cache.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Platform Quirks</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">LinkedIn, WhatsApp, and Slack: The Quirky Ones</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Facebook and X get the attention, but the strangest preview behavior lives elsewhere. LinkedIn is strictest about
            caching and least forgiving about image problems: it wants the same 1200 by 630 image, displays it smaller than
            Facebook does, and often shows no image at all rather than a degraded one when something is off. If LinkedIn
            looks broken while Facebook looks fine, check image accessibility and re-run the Post Inspector first.
          </p>
          <p>
            WhatsApp is the size snob. It builds previews on the sender's phone and simply skips images that are too large or
            slow. If WhatsApp shares matter for your audience, keep the preview image small and light, well under 300 KB, on
            a fast server. A multi-megabyte hero image that shines on Facebook may produce no preview at all in a chat.
          </p>
          <p>
            Slack unfurls with its own logic: it prefers og: tags but falls back to the title tag and first suitable image
            when they are missing, which is why Slack previews sometimes look fine with no Open Graph setup at all. Discord
            renders rich embeds in its dark UI, and Telegram behaves much like WhatsApp: small, fast images win and heavy
            ones get skipped.
          </p>
          <p>
            You cannot perfect one setup for every network, but one disciplined setup avoids the common failures: an absolute
            HTTPS image URL at 1200 by 630, under 5 MB and lighter when WhatsApp matters,
            explicit og:image:width and og:image:height, and an honest title under 60 characters. That renders acceptably
            everywhere, which beats perfect on one network and broken on three others.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>One 1200 x 630 image on an absolute HTTPS URL served by a fast host.</li>
            <li>Explicit og:image:width and og:image:height on every page.</li>
            <li>Titles under 60 characters and front-loaded descriptions.</li>
                      </ul>
        </div>
      </section>
    </>
  );
}
