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

type PreviewMode = "desktop" | "mobile";

const normaliseUrl = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "rankvelt.com/your-page";
  }

  return trimmedValue
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
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
      color: "text-white/70",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (length < 45) {
    return {
      label: "A little short. Add useful context where needed.",
      color: "text-yellow-200",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (length > 60) {
    return {
      label: "May truncate in some search results.",
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
      color: "text-white/70",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (length < 130) {
    return {
      label: "Could provide more useful context.",
      color: "text-yellow-200",
      icon: <AlertTriangle size={14} />,
    };
  }

  if (length > 160) {
    return {
      label: "May truncate in some search results.",
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

const MetaTitleDescriptionChecker = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [copyStatus, setCopyStatus] = useState("");

  const titleFeedback = useMemo(
    () => getTitleFeedback(title.length),
    [title.length],
  );

  const descriptionFeedback = useMemo(
    () => getDescriptionFeedback(description.length),
    [description.length],
  );

  const titleLimit = previewMode === "desktop" ? 62 : 48;
  const descriptionLimit = previewMode === "desktop" ? 165 : 132;

  const displayUrl = useMemo(() => normaliseUrl(pageUrl), [pageUrl]);

  useEffect(() => {
    const pageTitle =
      "Free Meta Title & Description Checker with SERP Preview | RankVelt";

    const pageDescription =
      "Check meta title and description length, clarity, and desktop or mobile SERP preview with RankVelt's free SEO metadata checker.";

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "website";
    ensureMetaByProperty("og:url").content =
      `${SITE_URL}/tools/meta-title-description-checker`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}/tools/meta-title-description-checker`;

    document
      .getElementById("rankvelt-meta-checker-schema")
      ?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-meta-checker-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: "Meta Title & Description Checker with SERP Preview",
          url: `${SITE_URL}/tools/meta-title-description-checker`,
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
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the difference between a page title and an H1 heading?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A page title is used in the browser tab and may appear in search results. An H1 is the main visible heading on the page. They can be similar, but do not have to be identical.",
              },
            },
            {
              "@type": "Question",
              name: "Will this SERP preview match Google exactly?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. It is a practical visual guide. Search engines can change result appearance by query, device, location, language, and available space.",
              },
            },
            {
              "@type": "Question",
              name: "Can Google rewrite my title or meta description?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Search engines can choose other page text when they believe it better matches a query. Clear metadata and useful page content improve consistency.",
              },
            },
          ],
        },
      ],
    });

    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, []);

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setPageUrl("");
    setPreviewMode("desktop");
    setCopyStatus("");
  };

  const handleCopy = async () => {
    const content = `SEO Title: ${title || "Not added"}
Meta Description: ${description || "Not added"}
Page URL: https://${displayUrl}`;

    try {
      await copyToClipboard(content);

      setCopyStatus("Metadata copied successfully.");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 2000);
    } catch {
      setCopyStatus("Copy failed. Please copy the content manually.");
    }
  };

  const faqs = [
    {
      question:
        "What is the difference between a page title and an H1 heading?",
      answer:
        "A page title appears in the browser tab and may appear in search results. An H1 is the main visible heading on the page. Both should accurately describe the page, but they do not need to be exactly the same.",
    },
    {
      question:
        "Will the desktop or mobile SERP preview match Google exactly?",
      answer:
        "No. The preview is a visual editing guide. Search-result appearance can vary by query, location, device, language, available space, and search-engine decisions.",
    },
    {
      question:
        "Can search engines rewrite my title or meta description?",
      answer:
        "Yes. Search engines can select other text from the page when they believe it better matches a user's query. Clear titles, descriptions, headings, and useful page content provide a stronger starting point.",
    },
    {
      question:
        "Do meta descriptions directly improve rankings?",
      answer:
        "Meta descriptions are mainly useful for helping the right visitor understand the page before clicking. Focus on clarity, relevance, and accurate page summaries instead of treating descriptions as a direct ranking shortcut.",
    },
    {
      question:
        "Should every important page have a unique title and description?",
      answer:
        "Usually yes. Important indexable pages should have metadata that reflects their own purpose. Reusing the same title and description across unrelated service, product, or location pages can make a website less clear.",
    },
    {
      question:
        "Should I add my brand name to every SEO title?",
      answer:
        "It is often useful on important pages. Put the main topic first, then include the brand name when it fits naturally and does not make the title confusing or overly long.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-12%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.1] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} />
          Back to Free Tools
        </Link>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free SEO Metadata Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Meta Title, Description &{" "}
            <span className="text-gradient-gold">SERP Preview</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
            Write your SEO title, page URL, and meta description in one place.
            Check character guidance and preview how the snippet may look on
            desktop and mobile before publishing.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-[1.04fr_0.96fr]">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Search size={21} />
              </span>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Check Your Metadata
                </h2>

                <p className="mt-1 text-sm text-white/70">
                  Use the feedback as a writing guide, not a ranking guarantee.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                  SEO Page Title
                </span>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={120}
                  placeholder="Example: Local SEO Services for Small Businesses | RankVelt"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                />

                <span
                  className={`mt-2 flex items-center gap-2 text-xs font-medium ${titleFeedback.color}`}
                >
                  {titleFeedback.icon}
                  {title.length}/120 characters · {titleFeedback.label}
                </span>
              </label>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                  Meta Description
                </span>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={320}
                  rows={6}
                  placeholder="Write a useful summary of the page. Explain what a visitor will find, who it helps, and why it matters."
                  className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                />

                <span
                  className={`mt-2 flex items-center gap-2 text-xs font-medium ${descriptionFeedback.color}`}
                >
                  {descriptionFeedback.icon}
                  {description.length}/320 characters ·{" "}
                  {descriptionFeedback.label}
                </span>
              </label>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                  Page URL
                </span>

                <input
                  value={pageUrl}
                  onChange={(event) => setPageUrl(event.target.value)}
                  placeholder="https://rankvelt.com/local-seo"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                <Copy size={15} />
                Copy Metadata
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-bold text-white/90 transition-colors hover:border-primary/45 hover:text-primary"
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
                  Live SERP Preview
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  See It Before You Publish
                </h2>
              </div>

              <div className="flex w-fit rounded-xl border border-white/15 bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                    previewMode === "desktop"
                      ? "bg-primary text-black"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  <Monitor size={13} />
                  Desktop
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                    previewMode === "mobile"
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
                previewMode === "mobile" ? "max-w-[390px]" : "max-w-full"
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
                  "Put the main topic near the beginning of the title.",
                  "Make the title match the visible page heading and content.",
                  "Use a readable URL that explains the page topic.",
                  "Write the description for people instead of keyword repetition.",
                ].map((item) => (
                  <p
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/80"
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
              A Better Metadata Workflow
            </h2>

            <ol className="mt-6 space-y-4">
              {[
                "Identify the page's main topic and the search intent it should satisfy.",
                "Write useful page content and a clear visible heading first.",
                "Create a title that describes the page without keyword stuffing.",
                "Write a natural description that explains what visitors will find.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-black text-black">
                    {index + 1}
                  </span>

                  <p className="pt-0.5 text-sm leading-relaxed text-white/80">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">
              Avoid These Common Issues
            </h2>

            <ul className="mt-6 space-y-4">
              {[
                "Using the same title and description across different service or product pages.",
                "Repeating location names and keywords until the metadata sounds unnatural.",
                "Writing descriptions that do not match the actual page content.",
                "Trying to fix weak page content with metadata alone.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/80"
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
              Metadata & SERP FAQs
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

                <p className="mt-4 text-sm leading-relaxed text-white/80">
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

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Better metadata gives the right visitor a clearer expectation.
                Strong SEO also needs useful content, internal linking,
                technical health, and a clear conversion path.
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
              to="/business-seo"
              className="group rounded-2xl border border-white/[0.1] bg-black/25 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                Business SEO
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Improve service pages, technical foundations, content clarity,
                and organic lead-generation pathways.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore Business SEO
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

              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Improve Shopify collection pages, product discovery, metadata,
                internal linking, and commercial organic traffic.
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

export default MetaTitleDescriptionChecker;