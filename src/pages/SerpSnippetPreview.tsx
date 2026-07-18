import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Monitor,
  RefreshCcw,
  Search,
  Smartphone,
  Sparkles,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

type DeviceMode = "desktop" | "mobile";

const normaliseDomain = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "rankvelt.com";
  }

  return trimmedValue
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
};

const normalisePath = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "/your-page";
  }

  return trimmedValue.startsWith("/")
    ? trimmedValue
    : `/${trimmedValue}`;
};

const truncateText = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trim()}…`;
};

const getTitleFeedback = (length: number) => {
  if (length === 0) {
    return {
      label: "Add a title to preview your search result.",
      color: "text-white/60",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (length < 45) {
    return {
      label: "A little short — add more useful context if needed.",
      color: "text-yellow-200",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (length > 60) {
    return {
      label: "May truncate on some search results.",
      color: "text-orange-200",
      icon: <AlertTriangle size={14} />,
    };
  }

  return {
    label: "Good title range for editing.",
    color: "text-emerald-300",
    icon: <CheckCircle2 size={14} />,
  };
};

const getDescriptionFeedback = (length: number) => {
  if (length === 0) {
    return {
      label: "Add a description to preview your search result.",
      color: "text-white/60",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (length < 130) {
    return {
      label: "Could explain the page in more detail.",
      color: "text-yellow-200",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (length > 160) {
    return {
      label: "May truncate on some search results.",
      color: "text-orange-200",
      icon: <AlertTriangle size={14} />,
    };
  }

  return {
    label: "Good description range for editing.",
    color: "text-emerald-300",
    icon: <CheckCircle2 size={14} />,
  };
};

const ensureMetaByName = (name: string) => {
  let element = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
};

const ensureMetaByProperty = (property: string) => {
  let element = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  return element;
};

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  document.execCommand("copy");
  document.body.removeChild(textArea);
};

const SerpSnippetPreview = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("rankvelt.com");
  const [pagePath, setPagePath] = useState("/local-seo");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [copyStatus, setCopyStatus] = useState("");

  const titleFeedback = useMemo(
    () => getTitleFeedback(title.length),
    [title.length],
  );

  const descriptionFeedback = useMemo(
    () => getDescriptionFeedback(description.length),
    [description.length],
  );

  const displayUrl = useMemo(() => {
    return `${normaliseDomain(domain)}${normalisePath(pagePath)}`;
  }, [domain, pagePath]);

  const titleLimit = device === "desktop" ? 62 : 48;
  const descriptionLimit = device === "desktop" ? 165 : 132;

  useEffect(() => {
    const pageTitle = "Free SERP Snippet Preview Tool | RankVelt";
    const pageDescription =
      "Preview how your SEO title, readable URL, and meta description may appear in desktop and mobile search results with RankVelt's free SERP snippet preview tool.";

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "website";
    ensureMetaByProperty("og:url").content =
      `${SITE_URL}/tools/serp-snippet-preview`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}/tools/serp-snippet-preview`;

    document.getElementById("rankvelt-serp-preview-schema")?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-serp-preview-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "SERP Snippet Preview Tool",
      url: `${SITE_URL}/tools/serp-snippet-preview`,
      description: pageDescription,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: "RankVelt",
        url: SITE_URL,
      },
    });

    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, []);

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDomain("rankvelt.com");
    setPagePath("/local-seo");
    setDevice("desktop");
    setCopyStatus("");
  };

  const handleCopy = async () => {
    const content = `SEO Title: ${title || "Not added"}
Meta Description: ${description || "Not added"}
URL: https://${displayUrl}`;

    try {
      await copyToClipboard(content);

      setCopyStatus("Snippet metadata copied.");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 2000);
    } catch {
      setCopyStatus("Copy failed. Please copy the text manually.");
    }
  };

  const faqs = [
    {
      question: "Will this SERP preview match Google exactly?",
      answer:
        "No. This is a practical visual preview. Search result appearance can change by search query, location, device, language, available space, and search-engine decisions.",
    },
    {
      question: "Why can Google show a different title or description?",
      answer:
        "Search engines may select title or snippet text from the page when they believe it better matches a search query. Strong on-page headings, useful content, and accurate metadata help improve consistency.",
    },
    {
      question: "Should I create separate SEO titles for desktop and mobile?",
      answer:
        "No. Use one clear title that works across devices. The mobile preview helps you make sure the most important wording appears early in the title.",
    },
    {
      question: "Does the page URL matter in search results?",
      answer:
        "A readable URL can help users understand the page topic before clicking. Keep paths short, meaningful, and connected to the page rather than using unnecessary numbers or filler words.",
    },
    {
      question: "Can I manually add review stars or dates in a search preview?",
      answer:
        "Do not add search-result elements unless they are supported by your visible content and valid technical implementation. Search engines decide whether rich-result features appear.",
    },
    {
      question: "What should I optimise first: metadata or page content?",
      answer:
        "Start with page content and search intent. Then write a title and description that accurately summarise the page. Metadata cannot fix a page that lacks useful content, trust signals, or a clear next step.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-12%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.1] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/65 transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} />
          Back to Free Tools
        </Link>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free SERP Preview Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Google SERP Snippet{" "}
            <span className="text-gradient-gold">Preview</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
            Preview how your page title, readable URL, and meta description may
            appear in search. Use the tool to improve clarity before publishing,
            not to chase an exact Google layout.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Search size={21} />
              </span>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Build Your Search Snippet
                </h2>

                <p className="mt-1 text-sm text-white/65">
                  Add the elements that a visitor may see before clicking.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/65">
                  SEO Title
                </span>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={120}
                  placeholder="Example: Local SEO Services for Small Businesses"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/55"
                />

                <span
                  className={`mt-2 flex items-center gap-2 text-xs font-medium ${titleFeedback.color}`}
                >
                  {titleFeedback.icon}
                  {title.length}/120 characters · {titleFeedback.label}
                </span>
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_0.8fr]">
                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/65">
                    Domain
                  </span>

                  <input
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    placeholder="rankvelt.com"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/55"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/65">
                    URL Path
                  </span>

                  <input
                    value={pagePath}
                    onChange={(event) => setPagePath(event.target.value)}
                    placeholder="/local-seo"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/55"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/65">
                  Meta Description
                </span>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={320}
                  rows={6}
                  placeholder="Explain what the visitor will find on the page, who it helps, and why it is relevant to their search."
                  className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/55"
                />

                <span
                  className={`mt-2 flex items-center gap-2 text-xs font-medium ${descriptionFeedback.color}`}
                >
                  {descriptionFeedback.icon}
                  {description.length}/320 characters ·{" "}
                  {descriptionFeedback.label}
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                <Copy size={15} />
                Copy Snippet Data
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-bold text-white/85 transition-colors hover:border-primary/45 hover:text-primary"
              >
                <RefreshCcw size={15} />
                Reset
              </button>
            </div>

            {copyStatus && (
              <p
                className="mt-4 text-sm font-semibold text-emerald-300"
                aria-live="polite"
              >
                {copyStatus}
              </p>
            )}
          </article>

          <article className="rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Live Search Preview
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  See It Before You Publish
                </h2>
              </div>

              <div className="flex w-fit rounded-xl border border-white/15 bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => setDevice("desktop")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                    device === "desktop"
                      ? "bg-primary text-black"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  <Monitor size={13} />
                  Desktop
                </button>

                <button
                  type="button"
                  onClick={() => setDevice("mobile")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                    device === "mobile"
                      ? "bg-primary text-black"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  <Smartphone size={13} />
                  Mobile
                </button>
              </div>
            </div>

            <div
              className={`mx-auto mt-8 rounded-2xl border border-white/[0.12] bg-white p-5 text-[#202124] shadow-2xl ${
                device === "mobile" ? "max-w-[390px]" : "max-w-full"
              }`}
            >
              <p className="text-sm font-medium text-[#202124]">
                {displayUrl}
              </p>

              <p className="mt-2 text-[20px] font-medium leading-snug text-[#1a0dab]">
                {truncateText(
                  title || "Your Search Result Title Appears Here",
                  titleLimit,
                )}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-[#4d5156]">
                {truncateText(
                  description ||
                    "Your search-result description appears here. Use it to explain the page clearly and help the right visitor understand what they will find before clicking.",
                  descriptionLimit,
                )}
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-white/[0.1] bg-black/25 p-5">
              <h3 className="text-lg font-black text-white">
                Preview Notes
              </h3>

              <div className="mt-4 space-y-4">
                {[
                  "Place the main page topic early in the title.",
                  "Make sure the title matches the page heading and actual content.",
                  "Use a readable URL path that explains the page topic.",
                  "Write description copy for people, not keyword repetition.",
                ].map((item) => (
                  <p
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/75"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">
              How to Use the Preview
            </h2>

            <ol className="mt-6 space-y-4">
              {[
                "Add the SEO title you plan to publish.",
                "Enter your domain and meaningful URL path.",
                "Write a helpful description matching the page content.",
                "Switch between desktop and mobile to check readability.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-black text-black">
                    {index + 1}
                  </span>

                  <p className="pt-0.5 text-sm leading-relaxed text-white/75">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">
              What the Preview Cannot Guarantee
            </h2>

            <ul className="mt-6 space-y-4">
              {[
                "Google may use different page text depending on the search query.",
                "Search-result titles and descriptions can change across devices.",
                "A strong snippet does not replace useful, relevant page content.",
                "Rich-result elements are decided by search engines, not the preview.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/75"
                >
                  <AlertTriangle
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              SERP Preview FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Questions Before You Publish
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 open:border-primary/45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-black text-white sm:text-base">
                  {faq.question}

                  <ArrowRight
                    size={17}
                    className="shrink-0 text-primary transition-transform group-open:rotate-90"
                  />
                </summary>

                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Continue Your SEO Work
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Improve the Page Behind the Snippet
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/75">
                A good search snippet creates the right expectation. Strong SEO
                also requires useful content, a logical internal-linking
                structure, technical health, and a clear conversion path.
              </p>
            </div>

            <Link
              to="/strategy-call?package=SEO%20Opportunity%20Check"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02]"
            >
              Request a Free SEO Check
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            <Link
              to="/local-seo"
              className="group rounded-2xl border border-white/[0.1] bg-black/25 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                Local SEO
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Improve local service pages, Google Business Profile relevance,
                Maps visibility, and qualified customer enquiries.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore Local SEO
                <ArrowRight size={15} />
              </span>
            </Link>

            <Link
              to="/ecommerce-seo"
              className="group rounded-2xl border border-white/[0.1] bg-black/25 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                eCommerce SEO
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Improve Shopify collection pages, product discovery, titles,
                descriptions, and commercial organic traffic.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore eCommerce SEO
                <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SerpSnippetPreview;