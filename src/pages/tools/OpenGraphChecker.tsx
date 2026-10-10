// META: title="Free Open Graph Checker: Preview Social Share Tags" (max 60 chars, include target keyword)
// META: description="Check Open Graph tags on any URL free: preview how the page looks when shared, with missing-tag warnings. No signup." (max 160 chars, include target keyword)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Search,
  Share2,
  Sparkles,
  TriangleAlert,
  XCircle,
} from "lucide-react";

type FetchPhase = "idle" | "loading" | "done" | "error";

type OgResult = {
  finalUrl: string;
  status: number | null;
  tags: Record<string, string>;
  pageTitle: string;
  metaDescription: string;
  imageAbs: string | null;
  imageSize: { w: number; h: number } | null;
  imageLoadState: "pending" | "loaded" | "failed" | "none";
};

type CheckStatus = "ok" | "warn" | "missing";

type CheckItem = {
  key: string;
  label: string;
  status: CheckStatus;
  detail: string;
  fix: string;
};

const OPEN_GRAPH_CHECKER_FAQS = [
  {
    q: "What is Open Graph and what does OG mean in SEO?",
    a: "Open Graph is a standard created by Facebook that lets any page define how it appears when shared on social platforms. Tags like og:title, og:description, and og:image live in your page HTML and control the headline, description, and image of the share preview. In SEO work, OG refers to these tags, and checking them is part of making sure your content earns clicks when it travels beyond Google.",
  },
  {
    q: "Why does my page share with the wrong image or title?",
    a: "The most common causes are missing tags, so the platform guesses from your page content, and cached previews, so the platform shows an old version it stored earlier. Relative image URLs that the platform cannot resolve and images blocked by hotlink protection also break previews. Run the page through this open graph test, fix what is flagged, then force a fresh scrape in each platform's debugger tool.",
  },
  {
    q: "What is the right Open Graph image size?",
    a: "The widely recommended size is 1200 by 630 pixels, which is a 1.91 to 1 ratio that displays sharply on Facebook and LinkedIn. Images smaller than 600 by 315 pixels may be ignored or shown as a small thumbnail instead of a large preview. Keep the file under a few megabytes, use JPG or PNG, and always serve the image from an absolute https URL.",
  },
  {
    q: "What is the difference between og:title and my SEO title tag?",
    a: "The SEO title tag is written for search results, often with keywords near the front, while og:title is written for humans scrolling a social feed. They can be identical, and many sites set og:title to match the page title as a default. Writing a slightly more curiosity-driven og:title is fine, but keep it honest, because a mismatch between the preview and the page hurts trust.",
  },
  {
    q: "Do I still need Twitter card tags if I have Open Graph tags?",
    a: "Yes, at least twitter:card. X reads Open Graph tags as a fallback for the title, description, and image, so you do not need to duplicate all of them. But without an explicit twitter:card tag, X chooses the card style itself, which is often the small summary card. Setting twitter:card to summary_large_image gives you the large image preview most brands want.",
  },
  {
    q: "I fixed my tags but Facebook still shows the old preview. Why?",
    a: "Facebook caches share previews, so fixing your HTML is not enough on its own. Open Facebook's Sharing Debugger, paste your URL, and use its scrape function to force Facebook to re-read the page. LinkedIn has a similar Post Inspector. After a fresh scrape, test the share again in a new post, because old posts keep the preview they were created with.",
  },
  {
    q: "What does og:type do, and when should I use article?",
    a: "The og:type tag tells platforms what kind of object the page represents. Use website for homepages, landing pages, and general content, and article for blog posts and news stories. The article type unlocks extra tags like article:published_time and article:author that enrich how content appears. Using the wrong type will not break your preview, but the right type gives platforms better structured information.",
  },
  {
    q: "Can this checker read tags on pages that need a login?",
    a: "No. This tool reads the public HTML of a page, the same HTML any visitor or search crawler would receive. Pages behind a login, a paywall, or bot protection will not return their real tags to the fetcher. For those pages, view the page source in your own logged-in browser and search for og: to inspect the tags manually.",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Enter the page URL",
    text: "Paste any public page address into the input above. The tool accepts URLs with or without https, and normalizes them automatically before fetching.",
  },
  {
    title: "The page HTML is fetched",
    text: "Your URL is sent to a server-side fetch proxy that downloads the public HTML. This avoids browser cross-origin limits and shows you what a social crawler would receive.",
  },
  {
    title: "Tags are extracted and checked",
    text: "The tool parses the HTML and pulls out og:title, og:description, og:image, og:url, og:type, twitter:card, and every other meta tag present. Each recommended tag is then graded as present, missing, or needing attention.",
  },
  {
    title: "Review the preview and the fix list",
    text: "See a realistic mock of how the page will look when shared, check the actual dimensions of your og:image, and work through the missing-tag warnings. Each warning includes the exact HTML snippet to add.",
  },
  {
    title: "Fix, republish, and recheck",
    text: "Add the missing tags to your page, clear any platform caches with their debugger tools, then run the URL through this checker again to confirm everything is green.",
  },
];

function measureImage(src: string): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = window.setTimeout(() => resolve(null), 9000);
    img.onload = () => {
      window.clearTimeout(timer);
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

function resolveAbs(maybeRelative: string, base: string): string | null {
  try {
    return new URL(maybeRelative, base).href;
  } catch {
    return null;
  }
}

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function buildChecks(result: OgResult): CheckItem[] {
  const t = result.tags;
  const checks: CheckItem[] = [];

  const ogTitle = t["og:title"] || "";
  if (!ogTitle) {
    checks.push({
      key: "og:title",
      label: "og:title",
      status: "missing",
      detail:
        "No og:title found. Without it, platforms guess the headline from your page content, and the guess is often wrong or truncated awkwardly.",
      fix: '<meta property="og:title" content="Your compelling page title" />',
    });
  } else if (ogTitle.length > 60) {
    checks.push({
      key: "og:title",
      label: "og:title",
      status: "warn",
      detail: `Your og:title is ${ogTitle.length} characters. Social platforms truncate long titles at around 60 characters, so put the important words first.`,
      fix: '<meta property="og:title" content="Shorter, front-loaded headline under 60 characters" />',
    });
  } else {
    checks.push({
      key: "og:title",
      label: "og:title",
      status: "ok",
      detail: `Present and a good length (${ogTitle.length} characters).`,
      fix: "",
    });
  }

  const ogDesc = t["og:description"] || "";
  if (!ogDesc) {
    checks.push({
      key: "og:description",
      label: "og:description",
      status: "missing",
      detail:
        "No og:description found. Shares will show a random text snippet from your page instead of a message you wrote for the feed.",
      fix: '<meta property="og:description" content="One or two sentences that make someone want to click." />',
    });
  } else if (ogDesc.length > 200) {
    checks.push({
      key: "og:description",
      label: "og:description",
      status: "warn",
      detail: `Your og:description is ${ogDesc.length} characters. Keep it under about 200 characters so it is not cut off mid-sentence in the preview.`,
      fix: '<meta property="og:description" content="A tighter description under 200 characters." />',
    });
  } else {
    checks.push({
      key: "og:description",
      label: "og:description",
      status: "ok",
      detail: `Present and a good length (${ogDesc.length} characters).`,
      fix: "",
    });
  }

  const ogImage = t["og:image"] || "";
  if (!ogImage) {
    checks.push({
      key: "og:image",
      label: "og:image",
      status: "missing",
      detail:
        "No og:image found. Pages without a share image get a plain text link or no preview at all, and those earn far fewer clicks.",
      fix: '<meta property="og:image" content="https://example.com/images/share-image.jpg" />',
    });
  } else if (!isAbsoluteHttpUrl(ogImage)) {
    checks.push({
      key: "og:image",
      label: "og:image",
      status: "warn",
      detail:
        "Your og:image is a relative URL. Social crawlers require an absolute URL starting with https:// to fetch the image reliably.",
      fix: '<meta property="og:image" content="https://example.com/images/share-image.jpg" />',
    });
  } else if (result.imageLoadState === "failed") {
    checks.push({
      key: "og:image",
      label: "og:image",
      status: "warn",
      detail:
        "The checker could not download your og:image. The URL may be wrong, the server may block hotlinking, or the file may be missing. Open the image URL in a browser to verify it loads.",
      fix: '<meta property="og:image" content="https://example.com/images/share-image.jpg" />',
    });
  } else if (result.imageSize && (result.imageSize.w < 1200 || result.imageSize.h < 630)) {
    checks.push({
      key: "og:image",
      label: "og:image",
      status: "warn",
      detail: `Your og:image is ${result.imageSize.w} by ${result.imageSize.h} pixels, smaller than the recommended 1200 by 630. Small images can render blurry or fall back to a thumbnail layout.`,
      fix: '<meta property="og:image" content="https://example.com/images/share-image-1200x630.jpg" />',
    });
  } else {
    const sizeNote =
      result.imageSize != null
        ? ` Image measures ${result.imageSize.w} by ${result.imageSize.h} pixels.`
        : "";
    checks.push({
      key: "og:image",
      label: "og:image",
      status: "ok",
      detail: `Present as an absolute URL.${sizeNote}`,
      fix: "",
    });
  }

  const ogUrl = t["og:url"] || "";
  if (!ogUrl) {
    checks.push({
      key: "og:url",
      label: "og:url",
      status: "missing",
      detail:
        "No og:url found. This tag tells platforms the canonical address for the page so likes, shares, and comments consolidate on one URL instead of splitting across variants.",
      fix: '<meta property="og:url" content="https://example.com/your-page/" />',
    });
  } else if (!isAbsoluteHttpUrl(ogUrl)) {
    checks.push({
      key: "og:url",
      label: "og:url",
      status: "warn",
      detail:
        "Your og:url is a relative URL. Use the full absolute canonical address starting with https://.",
      fix: '<meta property="og:url" content="https://example.com/your-page/" />',
    });
  } else {
    checks.push({
      key: "og:url",
      label: "og:url",
      status: "ok",
      detail: "Present as an absolute URL.",
      fix: "",
    });
  }

  const ogType = t["og:type"] || "";
  if (!ogType) {
    checks.push({
      key: "og:type",
      label: "og:type",
      status: "missing",
      detail:
        "No og:type found. Add it so platforms know what kind of page this is. Use website for general pages and article for blog posts and news.",
      fix: '<meta property="og:type" content="website" />',
    });
  } else if (ogType !== "website" && ogType !== "article") {
    checks.push({
      key: "og:type",
      label: "og:type",
      status: "warn",
      detail: `Your og:type is "${ogType}". Stick to website or article unless you have a specific reason for another value.`,
      fix: '<meta property="og:type" content="website" />',
    });
  } else {
    checks.push({
      key: "og:type",
      label: "og:type",
      status: "ok",
      detail: `Set to "${ogType}".`,
      fix: "",
    });
  }

  const twitterCard = t["twitter:card"] || "";
  if (!twitterCard) {
    checks.push({
      key: "twitter:card",
      label: "twitter:card",
      status: "missing",
      detail:
        "No twitter:card found. X falls back to Open Graph tags for the title and image, but without this tag it chooses the card layout itself, often the small summary card.",
      fix: '<meta name="twitter:card" content="summary_large_image" />',
    });
  } else if (twitterCard === "summary") {
    checks.push({
      key: "twitter:card",
      label: "twitter:card",
      status: "warn",
      detail:
        'You use the small "summary" card. Switch to "summary_large_image" for a large clickable image preview on X.',
      fix: '<meta name="twitter:card" content="summary_large_image" />',
    });
  } else {
    checks.push({
      key: "twitter:card",
      label: "twitter:card",
      status: "ok",
      detail: `Set to "${twitterCard}".`,
      fix: "",
    });
  }

  return checks;
}

function OpenGraphChecker() {
  const [urlInput, setUrlInput] = useState("");
  const [phase, setPhase] = useState<FetchPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OgResult | null>(null);
  const [copiedFix, setCopiedFix] = useState<string | null>(null);

  useEffect(() => {
    const id = "rankvelt-open-graph-checker-schema";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: "Open Graph Checker",
          url: "https://www.rankvelt.com/tools/open-graph-checker",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "FAQPage",
          mainEntity: OPEN_GRAPH_CHECKER_FAQS.map((f) => ({
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

  const analyze = async () => {
    setPhase("loading");
    setError(null);
    setResult(null);

    let target = urlInput.trim();
    if (!target) {
      setError("Please enter a URL to check.");
      setPhase("error");
      return;
    }
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }
    try {
      new URL(target);
    } catch {
      setError(
        "That URL does not look valid. Include the domain, for example example.com/page.",
      );
      setPhase("error");
      return;
    }

    let data: {
      ok?: boolean;
      html?: string;
      finalUrl?: string;
      status?: number;
      error?: string;
    };
    try {
      const res = await fetch("/api/fetch-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      data = (await res.json()) as typeof data;
    } catch {
      setError(
        "Could not reach the fetch service. Check your connection and try again.",
      );
      setPhase("error");
      return;
    }

    if (!data || data.ok !== true || typeof data.html !== "string") {
      setError(
        data && data.error
          ? data.error
          : "The page could not be fetched. It may block automated requests, require a login, or be temporarily down.",
      );
      setPhase("error");
      return;
    }

    try {
      const doc = new DOMParser().parseFromString(data.html, "text/html");
      const tags: Record<string, string> = {};
      doc.querySelectorAll("meta").forEach((m) => {
        const key = (
          m.getAttribute("property") ||
          m.getAttribute("name") ||
          ""
        )
          .trim()
          .toLowerCase();
        if (!key || key in tags) return;
        tags[key] = (m.getAttribute("content") || "").trim();
      });

      const finalUrl =
        typeof data.finalUrl === "string" && data.finalUrl
          ? data.finalUrl
          : target;
      const titleEl = doc.querySelector("title");
      const rawOgImage = tags["og:image"] || "";
      const imageAbs = rawOgImage ? resolveAbs(rawOgImage, finalUrl) : null;

      const parsed: OgResult = {
        finalUrl,
        status: typeof data.status === "number" ? data.status : null,
        tags,
        pageTitle: titleEl ? (titleEl.textContent || "").trim() : "",
        metaDescription: tags["description"] || "",
        imageAbs,
        imageSize: null,
        imageLoadState: imageAbs ? "pending" : "none",
      };
      setResult(parsed);
      setPhase("done");

      if (imageAbs) {
        const size = await measureImage(imageAbs);
        setResult((prev) =>
          prev
            ? {
                ...prev,
                imageSize: size,
                imageLoadState: size ? "loaded" : "failed",
              }
            : prev,
        );
      }
    } catch {
      setError(
        "The page HTML could not be parsed. Try again or check a different URL.",
      );
      setPhase("error");
    }
  };

  const copyFix = async (key: string, snippet: string) => {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = snippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedFix(key);
    window.setTimeout(() => setCopiedFix(null), 2500);
  };

  const checks = result ? buildChecks(result) : [];
  const okCount = checks.filter((c) => c.status === "ok").length;
  const issues = checks.filter((c) => c.status !== "ok");

  const previewTitle =
    (result?.tags["og:title"] || "") ||
    result?.pageTitle ||
    result?.finalUrl ||
    "";
  const previewDesc =
    (result?.tags["og:description"] || "") ||
    result?.metaDescription ||
    "No description found. Add an og:description tag to control this text.";
  const domain = (() => {
    try {
      return result ? new URL(result.finalUrl).hostname : "";
    } catch {
      return "";
    }
  })();
  const tagEntries = result ? Object.entries(result.tags) : [];

  const statusIcon = (status: CheckStatus) =>
    status === "ok" ? (
      <CheckCircle2 size={18} className="shrink-0 text-emerald-300" />
    ) : status === "warn" ? (
      <TriangleAlert size={18} className="shrink-0 text-amber-300" />
    ) : (
      <XCircle size={18} className="shrink-0 text-red-300" />
    );

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
            Free SEO Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Free Open Graph <span className="text-gradient-gold">Checker</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Check Open Graph tags on any URL free with this open graph
            checker. Enter a page address to preview how it looks when shared
            on Facebook, LinkedIn, and X, and get warnings for missing tags.
            Use it as an open graph debugger and OG tester before you publish
            or promote any page.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Page to Check
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Enter Any Public URL
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
                The URL is fetched through a server proxy so the tool can read
                the public page HTML, the same HTML a social crawler receives.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white/75">
              <Globe size={14} />
              Public pages only
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={urlInput}
              onChange={(event) => setUrlInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") analyze();
              }}
              placeholder="https://example.com/blog/your-article"
              spellCheck={false}
              autoComplete="off"
              inputMode="url"
              className="w-full flex-1 rounded-xl border border-white/15 bg-black/30 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55"
            />
            <button
              type="button"
              onClick={analyze}
              disabled={phase === "loading"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={15} />
              {phase === "loading" ? "Checking..." : "Check Tags"}
            </button>
          </div>

          {phase === "error" && error && (
            <p
              className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-400/[0.07] p-4 text-sm leading-relaxed text-red-200"
              role="alert"
            >
              <TriangleAlert size={16} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          {result && phase === "done" && (
            <div className="mt-8 space-y-8">
              <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.1] bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Checked Page
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-white/85 sm:text-sm">
                    {result.finalUrl}
                  </p>
                  {result.status !== null && (
                    <p className="mt-1 text-xs text-white/60">
                      HTTP status: {result.status}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${
                      okCount === checks.length
                        ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-200"
                        : "border-amber-400/25 bg-amber-400/[0.08] text-amber-200"
                    }`}
                  >
                    {okCount === checks.length ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <TriangleAlert size={14} />
                    )}
                    {okCount} of {checks.length} tags OK
                  </span>
                  <a
                    href={result.finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
                  >
                    <ExternalLink size={14} />
                    Open Page
                  </a>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Share2 size={21} />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      Share Preview
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-white">
                      How This Page Looks When Shared
                    </h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.1] bg-black/20 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                      Facebook / LinkedIn style
                    </p>
                    <div className="mt-4 overflow-hidden rounded-xl border border-white/15 bg-[#0b0b0b]">
                      {result.imageLoadState === "loaded" && result.imageAbs ? (
                        <img
                          src={result.imageAbs}
                          alt="Open Graph share preview"
                          className="aspect-[1.91/1] w-full object-cover"
                        />
                      ) : result.imageLoadState === "pending" ? (
                        <div className="aspect-[1.91/1] w-full animate-pulse bg-white/[0.06]" />
                      ) : (
                        <div className="flex aspect-[1.91/1] w-full flex-col items-center justify-center gap-2 bg-white/[0.04] text-white/50">
                          <ImageIcon size={28} />
                          <p className="px-6 text-center text-xs leading-relaxed">
                            No share image available. Add an og:image tag to
                            unlock the large preview.
                          </p>
                        </div>
                      )}
                      <div className="p-4">
                        {domain && (
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                            {domain}
                          </p>
                        )}
                        <p className="mt-1 text-base font-bold leading-snug text-white">
                          {previewTitle || "No title found"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/65">
                          {previewDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.1] bg-black/20 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                      X (Twitter) style
                    </p>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0b]">
                      {result.imageLoadState === "loaded" && result.imageAbs ? (
                        <img
                          src={result.imageAbs}
                          alt="X card preview"
                          className="aspect-[1.91/1] w-full object-cover"
                        />
                      ) : result.imageLoadState === "pending" ? (
                        <div className="aspect-[1.91/1] w-full animate-pulse bg-white/[0.06]" />
                      ) : (
                        <div className="flex aspect-[1.91/1] w-full flex-col items-center justify-center gap-2 bg-white/[0.04] text-white/50">
                          <ImageIcon size={28} />
                          <p className="px-6 text-center text-xs leading-relaxed">
                            X will show a small card without an image. Set
                            twitter:card and og:image for the large preview.
                          </p>
                        </div>
                      )}
                      <div className="rounded-b-2xl border-t border-white/10 p-4">
                        <p className="text-base font-bold leading-snug text-white">
                          {previewTitle || "No title found"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/65">
                          {previewDesc}
                        </p>
                        {domain && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-white/45">
                            <Globe size={12} />
                            {domain}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Tag Audit
                </p>
                <h3 className="mt-1 text-2xl font-black text-white">
                  Recommended Tags: Present, Missing, or Needs Attention
                </h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {checks.map((check) => (
                    <div
                      key={check.key}
                      className={`rounded-2xl border p-5 ${
                        check.status === "ok"
                          ? "border-emerald-400/20 bg-emerald-400/[0.05]"
                          : check.status === "warn"
                            ? "border-amber-400/25 bg-amber-400/[0.05]"
                            : "border-red-400/25 bg-red-400/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {statusIcon(check.status)}
                        <code className="font-mono text-sm font-black text-white">
                          {check.label}
                        </code>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">
                        {check.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {issues.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Fix Guidance
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    Copy-Paste Snippets for Each Issue
                  </h3>
                  <div className="mt-5 space-y-4">
                    {issues.map((issue) => (
                      <div
                        key={issue.key}
                        className="rounded-2xl border border-white/[0.1] bg-black/20 p-5"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            {statusIcon(issue.status)}
                            <code className="font-mono text-sm font-black text-white">
                              {issue.label}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyFix(issue.key, issue.fix)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
                          >
                            <Copy size={14} />
                            {copiedFix === issue.key ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-white/75">
                          {issue.detail}
                        </p>
                        <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-emerald-200">
                          {issue.fix}
                        </pre>
                        <p className="mt-2 text-xs leading-relaxed text-white/55">
                          Add this inside the{" "}
                          <code className="font-mono">&lt;head&gt;</code> of
                          your page, then recheck the URL.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <details className="group rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-black text-white">
                  All {tagEntries.length} meta tags found on this page
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/30">
                  {tagEntries.length > 0 ? (
                    <table className="w-full text-left text-xs">
                      <tbody>
                        {tagEntries.map(([key, value]) => (
                          <tr
                            key={key}
                            className="border-b border-white/[0.06] align-top last:border-0"
                          >
                            <td className="w-1/3 break-all px-4 py-3 font-mono font-bold text-primary">
                              {key}
                            </td>
                            <td className="break-all px-4 py-3 text-white/75">
                              {value || (
                                <span className="italic text-white/40">
                                  empty
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-4 text-sm text-white/60">
                      No meta tags were found in this page's HTML.
                    </p>
                  )}
                </div>
              </details>
            </div>
          )}
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Check Any Page in 5 Steps
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

        <OpenGraphCheckerArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Open Graph FAQs
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Questions Before You Start
            </h2>
          </div>
          <div className="mt-8 space-y-3">
            {OPEN_GRAPH_CHECKER_FAQS.map((faq) => (
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
                href="/tools/open-graph-preview"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Open Graph Preview <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/meta-tag-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Meta Tag Generator <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/meta-title-description-checker"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Meta Title Description Checker{" "}
                <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/title-tag-preview"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Title Tag Preview <span className="text-primary">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-4xl rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Beyond Social Previews
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">
                Fix the Technical Issues Holding Your Traffic Back
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Share previews are one detail in a much bigger picture. A
                professional audit finds the metadata, speed, and structural
                issues that quietly cost you clicks every week.
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

export default OpenGraphChecker;

function OpenGraphCheckerArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Open Graph, Explained
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What Is Open Graph and What Does OG Mean in SEO?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Open Graph is a metadata standard that Facebook introduced so any
            web page could control how it appears when shared on social
            platforms. You add a small set of meta tags to your page HTML,
            and Facebook, LinkedIn, Slack, Discord, WhatsApp, and many other
            platforms read them to build the preview card: the image, the
            headline, and the description people see before they click. When
            SEOs say OG, they mean these tags, as in og:title, og:description,
            and og:image.
          </p>
          <p>
            Open Graph is not a Google ranking factor. Google does not use
            og:title to rank your page. Its value is indirect but very real:
            every share of your content is a small advertisement, and the
            quality of that advertisement decides whether people click.
            A page with a sharp image and a clear headline earns
            dramatically more visits from the same number of shares than a
            page that shows up as a bare link with guessed text.
          </p>
          <p>
            The standard works because it is shared. One set of tags feeds
            Facebook, LinkedIn, Pinterest, Slack, Teams, Discord, WhatsApp,
            and Telegram, which means a single implementation covers most of
            the places your links travel. X, formerly Twitter, is the notable
            exception: it reads Open Graph tags as a fallback but has its
            own Twitter card tags for controlling the card format, which is
            why a complete setup includes both. When people ask what is OG
            in SEO, the practical answer is that these tags are how you
            control the advertisement that every share of your content
            becomes.
          </p>
          <p>
            Most free OG checkers on the web are thin: an input box, a raw
            tag dump, and no explanation of what to fix. This page pairs a
            real open graph test with a visual preview and specific
            copy-paste fixes, because seeing your actual share card next to
            the missing tags makes the problem and the solution obvious in
            seconds.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Why It Matters
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why Your Social Share Preview Directly Affects Clicks
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Think about how you decide what to click in a social feed. You
            scan the image, read the headline, and make a judgment in about
            a second. Your audience does exactly the same with your links.
            A broken preview, a stretched logo, or a headline cut off
            mid-word signals low quality before anyone reads a word of your
            content. A polished preview signals that the page behind it is
            worth the click.
          </p>
          <p>
            This matters most for content that earns shares: blog posts,
            guides, product launches, case studies, and tools. Each of those
            pages can be shared dozens or hundreds of times by people you
            will never meet, in feeds you will never see. You cannot control
            who shares, but Open Graph lets you control what their share
            looks like. That is leverage: one-time setup work that improves
            every future share.
          </p>
          <p>
            There is also a trust dimension. When someone shares your article
            and the preview shows the wrong image, perhaps an ad banner or a
            staff photo the crawler grabbed at random, it can embarrass the
            person who shared it. People notice, and they share your content
            less readily next time. Clean, intentional previews make sharing
            feel safe, which compounds over time into more distribution.
          </p>
          <p>
            Finally, consider messaging apps. A huge share of link traffic
            now moves through WhatsApp, Telegram, Slack, and Discord, where
            the preview card is often the entire pitch. Nobody writes a
            persuasive caption when forwarding a link in chat; the card does
            the persuading. If your og tags are missing, your link arrives as
            a naked URL, and naked URLs get ignored.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          The Core Tags
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          The 5 Open Graph Tags Every Page Needs
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The Open Graph protocol defines many tags, but five do almost all
            of the work. The og:title tag sets the headline of the share
            card. Keep it under about 60 characters and front-load the
            important words, because platforms truncate long titles. It can
            match your SEO title tag, or you can write a slightly more
            human version for the feed, as long as it honestly describes the
            page.
          </p>
          <p>
            The og:description tag sets the one or two sentences under the
            headline. Aim for under 200 characters and write it as a pitch,
            not a keyword list. Tell the reader what they get from clicking:
            the answer, the guide, the tool, the result. This is the highest
            leverage sentence on the card after the title.
          </p>
          <p>
            The og:image tag is the most visually important and the most
            commonly broken. It must be an absolute URL starting with
            https://, because social crawlers will not resolve relative
            paths reliably. The recommended size is 1200 by 630 pixels, a
            1.91 to 1 ratio that fills the large card layout on Facebook and
            LinkedIn. This checker actually downloads your image and reports
            its real dimensions, so you can see immediately if it is too
            small.
          </p>
          <p>
            The og:url tag declares the canonical address of the page, which
            keeps likes, shares, and comments consolidated on one URL even
            when the page is reachable through tracking parameters or
            variants. The og:type tag declares what the page is: website for
            general pages, article for blog posts and news. The article type
            unlocks extra tags for publish time and authorship. Together,
            these five tags give you a complete, professional share presence.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Twitter Cards
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Twitter Cards: The Companion Every OG Setup Needs
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            X runs its own card system alongside Open Graph. The good news is
            that X reads your og:title, og:description, and og:image as
            fallbacks, so you do not need to duplicate every tag with a
            twitter: version. The one tag you should always add explicitly
            is twitter:card, because it controls the layout X chooses for
            your link.
          </p>
          <p>
            Set twitter:card to summary_large_image for the big clickable
            image card that dominates the timeline. The alternative value,
            summary, produces a small thumbnail card that is easy to scroll
            past. Many sites skip this tag entirely and then wonder why
            their links look small on X while looking great on Facebook. A
            twitter card checker, which is exactly what the tag audit above
            includes, catches this in one glance.
          </p>
          <p>
            If you want finer control on X, you can add twitter:title,
            twitter:description, and twitter:image to override the Open Graph
            fallbacks specifically for that platform. Most sites do not need
            this level of control; one strong set of OG tags plus
            twitter:card covers nearly every case. Only add the overrides
            when you have a genuine reason for X to show something different
            from every other platform.
          </p>
          <p>
            One X-specific gotcha: the platform validates cards when a URL is
            first shared, and it caches aggressively. After adding or fixing
            your tags, use X's card validator to refresh the cache before
            judging the result. As with Facebook, old posts keep the preview
            they were born with, so test with a fresh post.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Image Size
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Open Graph Image Size and Technical Requirements
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            If you are asking what is an open graph image, it is simply the
            single image file that represents your page inside share previews
            across the social web. The most common question about it is what
            size to use, and the answer is consistent across the major
            platforms: 1200 by 630 pixels. That 1.91 to 1 ratio fills the large link
            preview on Facebook and LinkedIn without cropping surprises, and
            it is sharp on high-density phone screens. Anything much smaller
            risks a blurry render or a downgrade to the small thumbnail
            layout.
          </p>
          <p>
            Facebook's documented minimum is 200 by 200 pixels, but the
            practical minimum for the large preview is 600 by 315. Treat
            those numbers as floors, not targets. Design at 1200 by 630,
            keep the file under a few megabytes so crawlers fetch it
            quickly, and use JPG for photographs or PNG for graphics with
            text. Keep important text and logos inside a safe central area,
            because some platforms crop the edges slightly on mobile.
          </p>
          <p>
            Technical requirements beyond size trip up more implementations
            than size itself. The image URL must be absolute and served over
            https. The server must allow the social crawler to download it,
            which means no hotlink protection that blocks Facebook's or
            LinkedIn's crawlers, and no authentication wall. This checker's
            image test catches these failures directly: if it cannot
            download your og:image, a social crawler probably cannot either.
          </p>
          <p>
            You can also declare the dimensions explicitly with
            og:image:width and og:image:height tags. These are optional, but
            they help crawlers reserve the right layout before the image
            finishes downloading, which speeds up preview rendering. If you
            add them, make sure the numbers match the actual file; wrong
            dimensions are worse than none, because they cause layout
            distortion in some renderers.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Debugging
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why Pages Share With the Wrong Image, Title, or No Preview
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            When a share looks wrong, the cause is almost always one of a
            short list. Missing tags are first: without og:image, the
            platform picks whatever image its crawler finds, which might be
            a favicon, an ad, or nothing at all. Run an open graph check
            before anything else, because guessing at causes without seeing
            the actual tags wastes hours.
          </p>
          <p>
            Stale cache is second. Social platforms store the preview from
            the first time a URL was shared, and they do not re-read your
            page on every share. If you fixed your tags but the old preview
            persists, that is expected behavior, not a bug. Facebook's
            Sharing Debugger and LinkedIn's Post Inspector both offer a
            re-scrape function that forces a fresh read; use them every time
            you change tags.
          </p>
          <p>
            Third, check what the crawler actually receives. JavaScript-heavy
            sites sometimes serve social crawlers a different page than
            human visitors see, and if your tags are injected by client-side
            JavaScript after load, many crawlers will never see them.
            Open Graph tags belong in the server-rendered HTML head. This
            tool fetches the raw HTML like a crawler does, so if a tag is
            missing here, it is missing for the platforms too.
          </p>
          <p>
            Fourth, look for redirect and canonical confusion. If your page
            redirects, the crawler follows the redirect and reads the tags
            of the destination, which may be a generic homepage with generic
            tags. Make sure og:url matches the final canonical address, and
            check the final URL this tool reports against the page you
            intended to test.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Mistakes
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Common Open Graph Mistakes This Checker Flags
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The single most frequent mistake is the relative image URL: an
            og:image like /images/share.jpg that works fine in a browser but
            means nothing to a crawler fetching your page from outside.
            Always use the full https address. The second is the logo
            problem: using a small square logo as the share image, which
            then stretches awkwardly across a 1.91 to 1 card. Design a
            dedicated share image instead of reusing the logo file.
          </p>
          <p>
            Duplicate and conflicting tags come next. Some themes and SEO
            plugins each inject their own Open Graph tags, and when two
            og:title tags exist, platforms may use either one. If this
            checker's full tag list shows duplicates, disable Open Graph
            output in all but one source, usually your SEO plugin, and keep
            a single authority for these tags.
          </p>
          <p>
            Another quiet killer is the noindex or blocked page. If your
            staging site or a page blocked by robots rules gets shared, the
            crawler may be refused and the preview fails entirely. Always
            test the production URL, not staging. Similarly, pages that
            require login return a login screen's tags to the crawler, which
            is why this tool only supports public pages and says so
            honestly instead of pretending.
          </p>
          <p>
            Finally, do not forget the description. Teams obsess over the
            image and title, then leave og:description empty, and the card
            fills with the first sentences of the page, often navigation
            text or a cookie notice. A deliberate two-sentence description
            takes a minute to write and completes the card. Work through the
            fix list above in order, and recheck until every recommended tag
            shows green.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Next Steps
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to Read Your Results and What to Fix First
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Start with the preview, because it shows the user-facing reality.
            If the card looks wrong there, the tag audit below it tells you
            exactly why. Fix in this order: og:image first, since the image
            dominates the card and drives most of the click decision; then
            og:title and og:description, the words that close the deal; then
            og:url and og:type, the structural tags; and finally
            twitter:card for the X layout.
          </p>
          <p>
            Each issue in the fix list includes a copy-paste snippet sized
            for the head of your page. If you use WordPress, add these
            through your SEO plugin's social settings rather than editing
            theme files, so updates do not wipe them out. On custom sites,
            put them in the shared head template with per-page values for
            the title, description, and image.
          </p>
          <p>
            After fixing, clear the platform caches before re-testing.
            Re-scrape in Facebook's Sharing Debugger and LinkedIn's Post
            Inspector, wait a few minutes, then run the URL through this og
            check again and confirm the preview renders as intended. Share
            the link in a private test post or message to see the real card
            exactly as your audience will see it.
          </p>
          <p>
            Make this part of your publishing checklist. Every new article,
            landing page, and product page should ship with its five core
            tags, a 1200 by 630 image, and twitter:card set, verified with
            one run of this checker before promotion begins. Ten minutes at
            publish time protects every share the page will ever earn.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Share2 size={21} />
          </span>
          <div>
            <h2 className="text-2xl font-black text-white">
              Quick Recap: The Open Graph Essentials
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
              <p>
                Every page needs og:title, og:description, og:image, og:url,
                and og:type, plus twitter:card set to summary_large_image
                for the best X preview.
              </p>
              <p>
                Use a 1200 by 630 pixel image served from an absolute https
                URL, keep titles under 60 characters and descriptions under
                200, and put the tags in your server-rendered HTML head.
              </p>
              <p>
                When a preview looks wrong, check the tags first, then force
                a fresh scrape in each platform's debugger, because cached
                previews do not update on their own.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
