import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Copy,
  Download,
  FileCode2,
  Globe2,
  ListPlus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

type CrawlMode = "allow" | "block";

const normaliseUrl = (value: string) => {
  const cleanValue = value.trim();

  if (!cleanValue) {
    return "";
  }

  if (/^https?:\/\//i.test(cleanValue)) {
    return cleanValue.replace(/\/+$/, "");
  }

  return `https://${cleanValue.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const convertToPath = (value: string) => {
  const cleanValue = value.trim();

  if (!cleanValue || cleanValue.startsWith("#")) {
    return "";
  }

  try {
    if (/^https?:\/\//i.test(cleanValue)) {
      const parsedUrl = new URL(cleanValue);
      return `${parsedUrl.pathname}${parsedUrl.search}` || "/";
    }
  } catch {
    return "";
  }

  return cleanValue.startsWith("/")
    ? cleanValue
    : `/${cleanValue.replace(/^\/+/, "")}`;
};

const parsePaths = (value: string) => {
  return Array.from(
    new Set(
      value
        .split(/[\n,]/)
        .map((item) => convertToPath(item))
        .filter(Boolean),
    ),
  );
};

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const ensureMetaByName = (name: string) => {
  let meta = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }

  return meta;
};

const ensureMetaByProperty = (property: string) => {
  let meta = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }

  return meta;
};

const pageFaqs = [
  {
    question: "What does a robots.txt file do?",
    answer:
      "A robots.txt file gives crawler-access instructions for parts of a website. It can help guide crawlers away from selected URLs, folders, search pages, or staging paths.",
  },
  {
    question: "Does robots.txt remove a page from Google search results?",
    answer:
      "Not reliably. Robots.txt controls crawling, not guaranteed indexing. For a page that must stay out of Google Search, use an appropriate noindex method or protect the page with authentication.",
  },
  {
    question: "Should I block every low-value page in robots.txt?",
    answer:
      "No. Only block pages when there is a clear crawl-management reason. Important public pages, CSS files, JavaScript files, images, and pages that need a noindex tag should normally remain crawlable.",
  },
  {
    question: "Should I include my sitemap in robots.txt?",
    answer:
      "Usually yes, when your website has a working XML sitemap. Adding a sitemap line makes it easier for crawlers to discover the sitemap location.",
  },
  {
    question: "Can robots.txt protect private customer or admin information?",
    answer:
      "No. Robots.txt is publicly accessible and should not be treated as a security feature. Use passwords, authentication, permissions, or server-side protection for private content.",
  },
  {
    question: "How do I test my robots.txt file?",
    answer:
      "Publish it at the root of your domain as /robots.txt, then review it with crawler-testing tools and check that your important public pages remain accessible to search engines.",
  },
];

const RobotsTxtGenerator = () => {
  const [siteUrl, setSiteUrl] = useState("");
  const [userAgent, setUserAgent] = useState("*");
  const [crawlMode, setCrawlMode] = useState<CrawlMode>("allow");
  const [disallowInput, setDisallowInput] = useState("");
  const [allowInput, setAllowInput] = useState("");
  const [includeSitemap, setIncludeSitemap] = useState(true);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const disallowPaths = useMemo(
    () => parsePaths(disallowInput),
    [disallowInput],
  );

  const allowPaths = useMemo(() => parsePaths(allowInput), [allowInput]);

  const resolvedSiteUrl = useMemo(() => normaliseUrl(siteUrl), [siteUrl]);

  const resolvedSitemapUrl = useMemo(() => {
    const customSitemapUrl = normaliseUrl(sitemapUrl);

    if (customSitemapUrl) {
      return customSitemapUrl;
    }

    if (resolvedSiteUrl) {
      return `${resolvedSiteUrl}/sitemap.xml`;
    }

    return "";
  }, [resolvedSiteUrl, sitemapUrl]);

  const robotsOutput = useMemo(() => {
    const lines: string[] = [
      "# robots.txt generated with RankVelt",
      "# Review all rules before publishing on a live website.",
      "",
      `User-agent: ${userAgent || "*"}`,
    ];

    if (crawlMode === "block") {
      lines.push("Disallow: /");
    } else {
      lines.push("Allow: /");
    }

    if (crawlMode === "allow") {
      disallowPaths.forEach((path) => {
        lines.push(`Disallow: ${path}`);
      });
    }

    allowPaths.forEach((path) => {
      lines.push(`Allow: ${path}`);
    });

    if (includeSitemap && resolvedSitemapUrl) {
      lines.push("");
      lines.push(`Sitemap: ${resolvedSitemapUrl}`);
    }

    return lines.join("\n");
  }, [
    allowPaths,
    crawlMode,
    disallowPaths,
    includeSitemap,
    resolvedSitemapUrl,
    userAgent,
  ]);

  const validationNotes = useMemo(() => {
    const notes: string[] = [];

    if (!resolvedSiteUrl) {
      notes.push(
        "Add your live website URL so the generator can create the correct sitemap line.",
      );
    }

    if (crawlMode === "block") {
      notes.push(
        "This setting blocks the entire website from the selected crawler. Use it only for a staging site or an intentional crawler lock-down.",
      );
    }

    if (crawlMode === "allow" && !disallowPaths.length) {
      notes.push(
        "No specific paths are blocked. This is fine for many simple public websites.",
      );
    }

    if (disallowPaths.length) {
      notes.push(
        "Do not block pages that need a robots meta noindex directive, because crawlers need access to read that directive.",
      );
    }

    if (includeSitemap && !resolvedSitemapUrl) {
      notes.push(
        "Add a working sitemap URL or disable the sitemap line before downloading the file.",
      );
    }

    return notes;
  }, [
    crawlMode,
    disallowPaths.length,
    includeSitemap,
    resolvedSiteUrl,
    resolvedSitemapUrl,
  ]);

  useEffect(() => {
    const pageTitle = "Free Robots.txt Generator | RankVelt";
    const pageDescription =
      "Create a practical robots.txt file with crawler rules, path exclusions, allow rules, and a sitemap line using RankVelt's free robots.txt generator.";

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "website";
    ensureMetaByProperty("og:url").content =
      `${SITE_URL}/tools/robots-txt-generator`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}/tools/robots-txt-generator`;

    document
      .getElementById("rankvelt-robots-generator-schema")
      ?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-robots-generator-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: "Robots.txt Generator",
          url: `${SITE_URL}/tools/robots-txt-generator`,
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
          mainEntity: pageFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
      ],
    });

    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, []);

  const appendDisallowPath = (path: string) => {
    const existingPaths = parsePaths(disallowInput);

    if (existingPaths.includes(path)) {
      return;
    }

    setDisallowInput((currentValue) => {
      const trimmedValue = currentValue.trim();

      return trimmedValue ? `${trimmedValue}\n${path}` : path;
    });
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(robotsOutput);

      setCopyStatus("robots.txt content copied successfully.");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 2000);
    } catch {
      setCopyStatus("Copy failed. Please copy the text manually.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([robotsOutput], {
      type: "text/plain;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = "robots.txt";
    link.click();

    URL.revokeObjectURL(objectUrl);
  };

  const handleReset = () => {
    setSiteUrl("");
    setUserAgent("*");
    setCrawlMode("allow");
    setDisallowInput("");
    setAllowInput("");
    setIncludeSitemap(true);
    setSitemapUrl("");
    setCopyStatus("");
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
            Free Technical SEO Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Robots.txt{" "}
            <span className="text-gradient-gold">Generator</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Create a clean robots.txt starter file with crawler instructions,
            path exclusions, optional allow rules, and a sitemap reference for
            your live website.
          </p>
        </section>

        <section className="mt-12 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bot size={21} />
              </span>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Configure Your Crawler Rules
                </h2>

                <p className="mt-1 text-sm text-white/75">
                  Add only paths you genuinely want crawlers to avoid.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  Website URL
                </span>

                <input
                  value={siteUrl}
                  onChange={(event) => setSiteUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  User Agent
                </span>

                <select
                  value={userAgent}
                  onChange={(event) => setUserAgent(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary/55"
                >
                  <option value="*">All Crawlers (*)</option>
                  <option value="Googlebot">Googlebot</option>
                  <option value="Bingbot">Bingbot</option>
                </select>
              </label>

              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  Crawl Access
                </span>

                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setCrawlMode("allow")}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      crawlMode === "allow"
                        ? "border-primary/50 bg-primary/[0.1]"
                        : "border-white/15 bg-black/20 hover:border-primary/35"
                    }`}
                  >
                    <CheckCircle2
                      size={18}
                      className={
                        crawlMode === "allow"
                          ? "text-primary"
                          : "text-white/50"
                      }
                    />

                    <p className="mt-3 text-sm font-black text-white">
                      Allow Public Crawling
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-white/70">
                      Suitable for a normal public website.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCrawlMode("block")}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      crawlMode === "block"
                        ? "border-red-400/50 bg-red-400/[0.08]"
                        : "border-white/15 bg-black/20 hover:border-red-400/35"
                    }`}
                  >
                    <ShieldAlert
                      size={18}
                      className={
                        crawlMode === "block"
                          ? "text-red-300"
                          : "text-white/50"
                      }
                    />

                    <p className="mt-3 text-sm font-black text-white">
                      Block Entire Website
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-white/70">
                      Only for staging or intentional lock-down.
                    </p>
                  </button>
                </div>
              </div>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  Paths to Disallow
                </span>

                <textarea
                  value={disallowInput}
                  onChange={(event) => setDisallowInput(event.target.value)}
                  rows={6}
                  placeholder={`/search/\n/admin/\n/private/`}
                  className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                />

                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Add one path per line. Example: <code>/search/</code> or{" "}
                  <code>/private/</code>
                </p>
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  "/search/",
                  "/admin/",
                  "/staging/",
                  "/preview/",
                ].map((path) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => appendDisallowPath(path)}
                    className="rounded-full border border-primary/25 bg-primary/[0.06] px-3 py-2 text-[10px] font-black text-primary transition-colors hover:bg-primary/[0.14]"
                  >
                    Add {path}
                  </button>
                ))}
              </div>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  Allow Exceptions
                </span>

                <textarea
                  value={allowInput}
                  onChange={(event) => setAllowInput(event.target.value)}
                  rows={4}
                  placeholder={`/public-file.pdf\n/help/`}
                  className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                />

                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Use only when you need an explicit exception for a path.
                </p>
              </label>

              <div className="rounded-2xl border border-white/[0.1] bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-white">
                      Include Sitemap Line
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-white/70">
                      Adds your XML sitemap location to the generated file.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIncludeSitemap((current) => !current)}
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      includeSitemap ? "bg-primary" : "bg-white/20"
                    }`}
                    aria-pressed={includeSitemap}
                    aria-label="Toggle sitemap line"
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                        includeSitemap ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {includeSitemap && (
                  <label className="mt-5 block">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                      Sitemap URL
                    </span>

                    <input
                      value={sitemapUrl}
                      onChange={(event) => setSitemapUrl(event.target.value)}
                      placeholder={
                        resolvedSiteUrl
                          ? `${resolvedSiteUrl}/sitemap.xml`
                          : "https://example.com/sitemap.xml"
                      }
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                    />

                    <p className="mt-2 text-xs leading-relaxed text-white/70">
                      Leave empty to automatically use{" "}
                      <span className="font-semibold text-white/85">
                        /sitemap.xml
                      </span>{" "}
                      from your website URL.
                    </p>
                  </label>
                )}
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Generated robots.txt
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  Review Before Publishing
                </h2>
              </div>

              <FileCode2 className="text-primary" size={23} />
            </div>

            <textarea
              readOnly
              value={robotsOutput}
              spellCheck={false}
              aria-label="Generated robots.txt file"
              className="mt-7 min-h-[355px] w-full resize-y rounded-2xl border border-white/[0.12] bg-[#080808] p-5 font-mono text-xs leading-relaxed text-emerald-200 outline-none"
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                <Copy size={15} />
                Copy robots.txt
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
              >
                <Download size={15} />
                Download File
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-red-400/45 hover:text-red-300"
              >
                <RefreshCcw size={15} />
                Reset
              </button>
            </div>

            {copyStatus && (
              <p className="mt-4 text-sm font-semibold text-emerald-300">
                {copyStatus}
              </p>
            )}

            <div className="mt-8 rounded-2xl border border-white/[0.1] bg-black/25 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Safety Check
              </p>

              <ul className="mt-4 space-y-3">
                {validationNotes.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/80"
                  >
                    <Search
                      size={16}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <Globe2 className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Use the Root Location
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Publish the final file at the root of your website so it is
              available at <code>/robots.txt</code>.
            </p>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-6">
            <ClipboardCheck className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Review Public Pages
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Do not accidentally block service pages, blog posts, assets, or
              other URLs that should remain accessible to search crawlers.
            </p>
          </article>

          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <ShieldAlert className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Do Not Use It for Security
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Sensitive pages and files require authentication or proper
              server-side protection. Robots.txt is publicly visible.
            </p>
          </article>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Robots.txt FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Questions Before You Publish
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-3">
            {pageFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/[0.1] bg-white/[0.03] p-5 open:border-primary/45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-black text-white sm:text-base">
                  {faq.question}

                  <ChevronDown
                    size={18}
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
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
                Continue Your Technical SEO Work
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Improve Crawling, Indexing & Site Structure
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Robots.txt is only one technical SEO setting. Better organic
                performance also depends on useful pages, sitemap coverage,
                crawlable internal links, page quality, and a healthy website
                structure.
              </p>
            </div>

            <Link
              to="/strategy-call?package=Technical%20SEO%20Opportunity%20Check"
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
                Improve technical foundations, content clarity, service-page
                structure, and qualified organic lead generation.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore Business SEO
                <ArrowRight size={15} />
              </span>
            </Link>

            <Link
              to="/local-seo"
              className="group rounded-2xl border border-white/[0.1] bg-black/25 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                Local SEO
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Improve local service pages, business information, Maps
                visibility, and qualified customer enquiries.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore Local SEO
                <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RobotsTxtGenerator;