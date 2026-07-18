import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Copy,
  Download,
  FileCode2,
  FileText,
  Globe2,
  ListPlus,
  RefreshCcw,
  Search,
  Sparkles,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

type SitemapAnalysis = {
  validUrls: string[];
  invalidEntries: string[];
  offDomainUrls: string[];
  duplicateCount: number;
};

const normaliseSiteUrl = (value: string) => {
  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return "";
  }

  try {
    const candidate = /^https?:\/\//i.test(cleanedValue)
      ? cleanedValue
      : `https://${cleanedValue}`;

    const parsedUrl = new URL(candidate);

    if (
      parsedUrl.protocol !== "https:" &&
      parsedUrl.protocol !== "http:"
    ) {
      return "";
    }

    return parsedUrl.origin;
  } catch {
    return "";
  }
};

const cleanUrl = (value: string) => {
  try {
    const parsedUrl = new URL(value);

    if (
      parsedUrl.protocol !== "https:" &&
      parsedUrl.protocol !== "http:"
    ) {
      return "";
    }

    parsedUrl.hash = "";

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
};

const parseInputEntries = (value: string) => {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const resolveSitemapUrl = (
  entry: string,
  websiteUrl: string,
) => {
  const cleanedEntry = entry.trim();

  if (!cleanedEntry) {
    return "";
  }

  try {
    if (cleanedEntry.startsWith("/") && websiteUrl) {
      return cleanUrl(new URL(cleanedEntry, websiteUrl).toString());
    }

    if (
      websiteUrl &&
      !/^https?:\/\//i.test(cleanedEntry) &&
      !cleanedEntry.startsWith("www.") &&
      !cleanedEntry.includes(".")
    ) {
      return cleanUrl(
        new URL(
          `/${cleanedEntry.replace(/^\/+/, "")}`,
          websiteUrl,
        ).toString(),
      );
    }

    if (/^https?:\/\//i.test(cleanedEntry)) {
      return cleanUrl(cleanedEntry);
    }

    if (cleanedEntry.startsWith("www.")) {
      return cleanUrl(`https://${cleanedEntry}`);
    }

    return cleanUrl(`https://${cleanedEntry}`);
  } catch {
    return "";
  }
};

const escapeXml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
    question: "What pages should I include in an XML sitemap?",
    answer:
      "Include canonical, indexable pages that you want search engines to discover, such as important service pages, product pages, category pages, articles, location pages, and key supporting resources.",
  },
  {
    question: "Should I include noindex, redirect, or 404 URLs?",
    answer:
      "No. Do not include pages that are blocked from indexing, redirect to another URL, return errors, or duplicate another preferred canonical URL.",
  },
  {
    question: "Does an XML sitemap guarantee Google indexing?",
    answer:
      "No. A sitemap helps search engines discover the URLs you consider important, but it does not guarantee that every URL will be crawled, indexed, or shown in search results.",
  },
  {
    question: "Should I include URLs with tracking parameters?",
    answer:
      "Usually no. Add the clean canonical page URL rather than campaign, tracking, filter, sort, session, or duplicate parameter variations.",
  },
  {
    question: "Should I add a last modified date for every URL?",
    answer:
      "Only include a last modified date when it is accurate. Do not use a fresh date simply because you regenerated the sitemap if the page content itself has not meaningfully changed.",
  },
  {
    question: "Where should I publish my sitemap file?",
    answer:
      "Publish the file on your domain, commonly as sitemap.xml. You can then submit it in Google Search Console and reference its location in your robots.txt file.",
  },
];

const XmlSitemapGenerator = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [urlsInput, setUrlsInput] = useState("");
  const [includeLastModified, setIncludeLastModified] =
    useState(false);
  const [lastModifiedDate, setLastModifiedDate] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const resolvedWebsiteUrl = useMemo(
    () => normaliseSiteUrl(websiteUrl),
    [websiteUrl],
  );

  const sitemapAnalysis = useMemo<SitemapAnalysis>(() => {
    const entries = parseInputEntries(urlsInput);
    const seenUrls = new Set<string>();

    const validUrls: string[] = [];
    const invalidEntries: string[] = [];
    const offDomainUrls: string[] = [];

    let duplicateCount = 0;

    const baseHostname = resolvedWebsiteUrl
      ? new URL(resolvedWebsiteUrl).hostname.replace(/^www\./, "")
      : "";

    entries.forEach((entry) => {
      const resolvedUrl = resolveSitemapUrl(
        entry,
        resolvedWebsiteUrl,
      );

      if (!resolvedUrl) {
        invalidEntries.push(entry);
        return;
      }

      try {
        const resolvedHostname = new URL(resolvedUrl).hostname.replace(
          /^www\./,
          "",
        );

        if (baseHostname && resolvedHostname !== baseHostname) {
          offDomainUrls.push(resolvedUrl);
          return;
        }
      } catch {
        invalidEntries.push(entry);
        return;
      }

      if (seenUrls.has(resolvedUrl)) {
        duplicateCount += 1;
        return;
      }

      seenUrls.add(resolvedUrl);
      validUrls.push(resolvedUrl);
    });

    return {
      validUrls,
      invalidEntries,
      offDomainUrls,
      duplicateCount,
    };
  }, [resolvedWebsiteUrl, urlsInput]);

  const sitemapOutput = useMemo(() => {
    const lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];

    if (!sitemapAnalysis.validUrls.length) {
      lines.push("  <!-- Add at least one valid canonical URL above. -->");
    }

    sitemapAnalysis.validUrls.forEach((url) => {
      lines.push("  <url>");
      lines.push(`    <loc>${escapeXml(url)}</loc>`);

      if (includeLastModified && lastModifiedDate) {
        lines.push(`    <lastmod>${lastModifiedDate}</lastmod>`);
      }

      lines.push("  </url>");
    });

    lines.push("</urlset>");

    return lines.join("\n");
  }, [
    includeLastModified,
    lastModifiedDate,
    sitemapAnalysis.validUrls,
  ]);

  const validationNotes = useMemo(() => {
    const notes: string[] = [];

    if (!resolvedWebsiteUrl) {
      notes.push(
        "Add your main website URL first. It lets the tool convert relative paths such as /local-seo into full sitemap URLs.",
      );
    }

    if (!sitemapAnalysis.validUrls.length) {
      notes.push(
        "Add at least one canonical, indexable URL before downloading the sitemap.",
      );
    }

    if (sitemapAnalysis.invalidEntries.length) {
      notes.push(
        `${sitemapAnalysis.invalidEntries.length} invalid URL entr${
          sitemapAnalysis.invalidEntries.length === 1 ? "y was" : "ies were"
        } found and excluded from the generated sitemap.`,
      );
    }

    if (sitemapAnalysis.offDomainUrls.length) {
      notes.push(
        `${sitemapAnalysis.offDomainUrls.length} off-domain URL${
          sitemapAnalysis.offDomainUrls.length === 1 ? " was" : "s were"
        } excluded because they do not match the website domain.`,
      );
    }

    if (sitemapAnalysis.duplicateCount) {
      notes.push(
        `${sitemapAnalysis.duplicateCount} duplicate URL${
          sitemapAnalysis.duplicateCount === 1 ? " was" : "s were"
        } removed automatically.`,
      );
    }

    if (includeLastModified && !lastModifiedDate) {
      notes.push(
        "Add an accurate last modified date or turn off the last modified option.",
      );
    }

    if (includeLastModified && lastModifiedDate) {
      notes.push(
        "Use the same last modified date only when every URL in this batch genuinely changed on that date.",
      );
    }

    return notes;
  }, [
    includeLastModified,
    lastModifiedDate,
    resolvedWebsiteUrl,
    sitemapAnalysis,
  ]);

  useEffect(() => {
    const pageTitle = "Free XML Sitemap Generator | RankVelt";

    const pageDescription =
      "Create a clean XML sitemap from your canonical website URLs. Check duplicates, invalid entries, off-domain URLs, copy the XML, and download sitemap.xml with RankVelt's free generator.";

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "website";
    ensureMetaByProperty("og:url").content =
      `${SITE_URL}/tools/xml-sitemap-generator`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}/tools/xml-sitemap-generator`;

    document
      .getElementById("rankvelt-xml-sitemap-schema")
      ?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-xml-sitemap-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: "XML Sitemap Generator",
          url: `${SITE_URL}/tools/xml-sitemap-generator`,
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

  const appendUrlPaths = (paths: string[]) => {
    if (!resolvedWebsiteUrl) {
      setCopyStatus(
        "Add your website URL first, then use the quick page-path buttons.",
      );

      window.setTimeout(() => {
        setCopyStatus("");
      }, 2600);

      return;
    }

    const existingEntries = parseInputEntries(urlsInput);

    const additionalEntries = paths.filter(
      (path) => !existingEntries.includes(path),
    );

    if (!additionalEntries.length) {
      return;
    }

    setUrlsInput((currentValue) => {
      const trimmedValue = currentValue.trim();

      return trimmedValue
        ? `${trimmedValue}\n${additionalEntries.join("\n")}`
        : additionalEntries.join("\n");
    });
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(sitemapOutput);

      setCopyStatus("XML sitemap copied successfully.");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 2000);
    } catch {
      setCopyStatus("Copy failed. Please copy the XML manually.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([sitemapOutput], {
      type: "application/xml;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = "sitemap.xml";
    link.click();

    URL.revokeObjectURL(objectUrl);
  };

  const handleReset = () => {
    setWebsiteUrl("");
    setUrlsInput("");
    setIncludeLastModified(false);
    setLastModifiedDate("");
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
            XML Sitemap{" "}
            <span className="text-gradient-gold">Generator</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Turn your important canonical page URLs into a clean XML sitemap.
            Review invalid, duplicate, and off-domain URLs before downloading
            your sitemap.xml file.
          </p>
        </section>

        <section className="mt-12 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ListPlus size={21} />
              </span>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Add Your Sitemap URLs
                </h2>

                <p className="mt-1 text-sm text-white/75">
                  Use only live, canonical URLs that should be discoverable in
                  search.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  Main Website URL
                </span>

                <input
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                />

                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Add your main site URL first, then you can paste absolute
                  URLs or simple paths such as <code>/local-seo</code>.
                </p>
              </label>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  Canonical URLs or Page Paths
                </span>

                <textarea
                  value={urlsInput}
                  onChange={(event) => setUrlsInput(event.target.value)}
                  rows={12}
                  placeholder={`https://example.com/\nhttps://example.com/about\n/local-seo\n/ecommerce-seo\n/blog/example-guide`}
                  className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary/55"
                />

                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Add one URL or path per line. Comma-separated values also
                  work. Do not add redirects, noindex URLs, 404 pages, filtered
                  URLs, or tracking parameters.
                </p>
              </label>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  Quick Website Paths
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "/",
                    "/about",
                    "/services",
                    "/contact",
                    "/blog",
                    "/privacy-policy",
                  ].map((path) => (
                    <button
                      key={path}
                      type="button"
                      onClick={() => appendUrlPaths([path])}
                      className="rounded-full border border-primary/25 bg-primary/[0.06] px-3 py-2 text-[10px] font-black text-primary transition-colors hover:bg-primary/[0.14]"
                    >
                      Add {path}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.1] bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-white">
                      Include Last Modified Date
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-white/70">
                      Use this only when the date accurately reflects real page
                      modifications.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setIncludeLastModified((current) => !current)
                    }
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      includeLastModified ? "bg-primary" : "bg-white/20"
                    }`}
                    aria-pressed={includeLastModified}
                    aria-label="Toggle last modified date"
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                        includeLastModified ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {includeLastModified && (
                  <label className="mt-5 block">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                      Shared Accurate Last Modified Date
                    </span>

                    <input
                      type="date"
                      value={lastModifiedDate}
                      onChange={(event) =>
                        setLastModifiedDate(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary/55"
                    />
                  </label>
                )}
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Generated sitemap.xml
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  Review Before Publishing
                </h2>
              </div>

              <FileCode2 className="text-primary" size={23} />
            </div>

            <textarea
              readOnly
              value={sitemapOutput}
              spellCheck={false}
              aria-label="Generated XML sitemap"
              className="mt-7 min-h-[390px] w-full resize-y rounded-2xl border border-white/[0.12] bg-[#080808] p-5 font-mono text-xs leading-relaxed text-emerald-200 outline-none"
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                <Copy size={15} />
                Copy XML
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
              >
                <Download size={15} />
                Download sitemap.xml
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

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
                  Included
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {sitemapAnalysis.validUrls.length}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-400/20 bg-orange-400/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-200">
                  Invalid
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {sitemapAnalysis.invalidEntries.length}
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">
                  Off-domain
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {sitemapAnalysis.offDomainUrls.length}
                </p>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/[0.1] bg-black/25 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Review Notes
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
              Use Canonical URLs
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Each sitemap entry should represent the preferred version of that
              page, not alternate, redirecting, filtered, or duplicate URLs.
            </p>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-6">
            <ClipboardCheck className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Publish at a Stable URL
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Publish the file at a stable sitemap location, commonly{" "}
              <code>/sitemap.xml</code>, then submit it through Search Console.
            </p>
          </article>

          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <FileText className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Keep It Updated
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              A manually managed sitemap is suitable for a small website, but a
              growing site should ideally generate it automatically through its
              CMS or website software.
            </p>
          </article>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              XML Sitemap FAQs
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
                Improve Site Discovery & Structure
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                A sitemap supports discovery, but strong SEO also depends on
                crawlable internal links, useful content, clear canonical
                handling, logical site architecture, and a technically healthy
                website.
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
                Improve technical foundations, service-page structure, content
                clarity, and qualified organic lead pathways.
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
                Improve Shopify collections, product discovery, site
                architecture, and organic commercial visibility.
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

export default XmlSitemapGenerator;