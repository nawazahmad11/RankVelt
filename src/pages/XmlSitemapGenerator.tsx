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

        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">Related free tools</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="/tools/robots-txt-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Robots.txt Generator <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/bulk-redirect-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Bulk Redirect Generator <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/schema-markup-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Schema Generator <span className="text-primary">→</span>
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

      <XmlSitemapGeneratorArticle />
      </div>
    </main>
  );
};

export default XmlSitemapGenerator;

/* ==================== SEO ARTICLE (Phase 1) ==================== */
function XmlSitemapGeneratorArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          XML Sitemap Generator
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What a Sitemap Does, and What It Cannot Do
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            An XML sitemap is a list of the pages you most want search engines
            to find, written in a format crawlers can read quickly. It helps
            discovery: a new page with few internal links gets noticed sooner
            when it sits in your sitemap.xml. It does not force anything.
            Google still decides what to crawl and index based on quality,
            links, and demand, so treat the file as a well-organized
            suggestion, not a guarantee.
          </p>
          <p>
            This generator turns the URLs you enter into a valid urlset,
            checks them for duplicates and off-domain mistakes, and lets you
            download a clean sitemap.xml. That is the right division of labor.
            You decide which pages matter; the tool handles the syntax so a
            stray character or broken tag does not quietly invalidate the
            whole file.
          </p>
          <p>
            Sitemaps earn their keep most clearly on new websites with no
            backlinks yet, on large sites where some pages sit many clicks
            from the homepage, and on pages that are rich in images or video
            but light on text. A small site that is fully interlinked may see
            little change, and that is normal. The file costs you an hour at
            most; the discovery shortcut it gives crawlers is worth it
            whenever your internal links do not yet do the job alone.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Before You Generate
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Your CMS May Already Build One
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Honesty first: if your site runs on WordPress, an SEO plugin or
            WordPress itself likely publishes a sitemap already, and Shopify
            serves an automatic sitemap for every store. Building a second
            one by hand on those platforms adds maintenance and can create a
            conflicting file. Check yoursite.com/sitemap.xml before you
            build anything.
          </p>
          <p>
            A manual sitemap generator earns its place on static sites,
            custom-coded sites, microsites, and quick launches where no CMS
            manages the file for you. It is also the right tool when you
            create XML sitemap files after a migration and need a precise,
            hand-picked URL list today rather than whenever a plugin gets
            configured. Decide which pages deserve discovery, generate the
            file, and you control exactly what search engines are told to
            look at.
          </p>
          <p>
            If your CMS already publishes a sitemap, open it and read what
            is actually inside before deciding anything. Auto-generated files
            sometimes list attachment pages, thin archive pages, or other
            URLs you would never choose by hand. When that happens, fix the
            plugin or CMS settings rather than running a second manual file
            alongside it. One accurate sitemap, kept current, is the goal,
            whichever tool produces it.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          File Limits
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          The 50,000 URL and 50MB Rules
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            One sitemap file can hold at most 50,000 URLs, and the
            uncompressed file cannot exceed 50MB. Those are protocol limits,
            and search engines will simply stop reading beyond them. If your
            URL list grows past either ceiling, split it into several files
            grouped by section, such as pages, posts, and products, and
            connect them with a sitemap index file that lists each child
            sitemap.
          </p>
          <p>
            Splitting has a practical benefit beyond size. Separate files make
            troubleshooting easier: when Search Console reports fetch problems
            or a drop in discovered URLs, you can see which section is
            affected instead of digging through one enormous file. For most
            small and mid-sized sites, one tidy file stays far below the
            limits, and that is fine. The limits matter the day you stop
            checking, so keep the file lean and current.
          </p>
          <p>
            While you are looking at the file contents, skip the decorative
            fields. Google ignores the priority and changefreq values
            entirely, so this generator leaves them out rather than filling
            your file with numbers that mean nothing. The one optional field
            Google does use is lastmod, the date a page last changed in a
            meaningful way. If that date is consistently accurate, Google may
            use it to schedule recrawls. If every URL suddenly carries
            today&apos;s date though nothing changed, the field loses
            credibility for the whole site, and engines learn to ignore it.
            That is why this tool applies one shared date to a batch only,
            and why you should use it only when that batch genuinely changed
            together.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          URL Quality
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          A Sitemap Is a List of Your Priorities
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Every URL in your sitemap sends a message: this page is
            canonical, indexable, and worth crawling. Keep that message
            consistent. Include only live URLs that return a successful
            response, use the HTTPS version, and match the preferred canonical
            address exactly, including trailing slash choices. Redirects,
            error pages, parameterized duplicates, and noindex pages
            contradict the message and waste crawler attention.
          </p>
          <p>
            Also keep the sitemap in step with your internal linking. A page
            listed in the sitemap but linked from nowhere still looks
            unimportant, because crawlers weigh both signals. If a page
            matters enough to list, it matters enough to link from relevant
            content. When URLs change, update both the links and the file
            together; stale sitemap entries pointing at old addresses are
            worse than a slightly shorter list.
          </p>
          <p>
            Think of it as a three-way agreement. Your sitemap names a
            preferred URL, your canonical tag names the same URL, and your
            internal links point to that same URL. When all three agree,
            crawlers get one clear instruction. When they disagree, Google
            picks its own version, and it may not pick the one you wanted.
            Most sitemap problems are really consistency problems wearing a
            technical disguise.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Robots.txt
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Your Sitemap and Robots.txt Must Agree
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            These two files talk to the same crawlers, so they should not
            contradict each other. Listing a URL in your sitemap while
            robots.txt blocks crawling of that path sends a mixed signal: you
            are highlighting a page the crawler is not allowed to read. Before
            submitting, scan for overlaps and remove blocked URLs from the
            sitemap, or remove the block if the page should be crawlable
            after all.
          </p>
          <p>
            Then use robots.txt as a free announcement channel. Add one line,
            Sitemap: followed by the full address of your file, and every
            crawler that reads robots.txt learns where the map lives without
            waiting for a Search Console submission. You may list more than
            one sitemap line if you run split files. It takes ten seconds and
            helps engines beyond Google as well.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Specialized Sitemaps
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Image, Video, and News Sitemaps
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Plain URL sitemaps cover most websites, but the protocol has
            extensions for media. An image sitemap points search engines at
            important images they might miss, which helps image search
            discovery for portfolios, product catalogs, and galleries. A
            video sitemap does the same for hosted video, and a news sitemap
            is reserved for recently published articles on news sites.
          </p>
          <p>
            Most small websites do not need any of these on day one. Add them
            when the media is a real traffic channel for you, not because a
            checklist mentioned them. A plain, accurate sitemap.xml submitted
            and referenced in robots.txt already covers the discovery job;
            extensions are an optimization for later, not a launch
            requirement.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Submission
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Submit It, Then Watch the Report
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            When you submit a sitemap to Google and other engines, the steps
            are short. Upload the downloaded sitemap.xml to your site root so
            it loads at yoursite.com/sitemap.xml. In Google Search Console,
            open the Sitemaps section, enter the file name, and submit. Do the
            same in Bing Webmaster Tools; one submission there also supports
            other engines that draw on Bing. Then return after a few days and
            read the status, looking for fetch errors and how many URLs were
            discovered.
          </p>
          <p>
            Treat that report as feedback, not a scoreboard. Discovered URLs
            that sit unindexed usually point to thin content or weak internal
            links, and the sitemap has done its job by surfacing the problem.
            Fix the pages, keep the file accurate as the site changes, and
            resubmit only when the list meaningfully changes. A small, honest
            sitemap maintained over time beats a bloated one uploaded once and
            forgotten.
          </p>
          <p>
            Build a small maintenance habit around the file. When you
            publish a new important page, add its URL here and to your
            navigation or related content. When you remove or move a page,
            take the old address out the same day. A manual sitemap goes
            stale silently, and a stale sitemap quietly teaches crawlers that
            your list cannot be trusted. Five minutes of upkeep whenever the
            site changes keeps the file doing its job for years.
          </p>
          <p>
            If the report shows an error instead of a success, do not
            resubmit blindly. A fetch failure usually means the address is
            wrong, the file returns an error response, or robots.txt blocks
            the file itself. Open the sitemap address in your browser first
            and confirm it loads. Parse errors point to malformed XML, most
            often an unescaped character in a URL, which is exactly what a
            generator protects you from. Fix the cause, then submit once.
          </p>
        </div>
      </section>
    </>
  );
}
