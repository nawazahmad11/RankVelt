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
  Globe2,
  Link2,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

type RedirectFormat = "csv" | "apache" | "nginx";
type RedirectStatus = "valid" | "review" | "invalid";

type RedirectMapping = {
  id: string;
  originalLine: string;
  oldUrl: string;
  newUrl: string;
  oldPath: string;
  status: RedirectStatus;
  reason: string;
};

type MappingAnalysis = {
  mappings: RedirectMapping[];
  validCount: number;
  reviewCount: number;
  invalidCount: number;
  duplicateCount: number;
};

const normaliseBaseUrl = (value: string) => {
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

const normaliseUrl = (value: string, baseUrl: string) => {
  const cleanedValue = value.trim().replace(/^["']|["']$/g, "");

  if (!cleanedValue) {
    return "";
  }

  try {
    if (/^https?:\/\//i.test(cleanedValue)) {
      const parsedUrl = new URL(cleanedValue);

      if (
        parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:"
      ) {
        return "";
      }

      parsedUrl.hash = "";

      return parsedUrl.toString().replace(/\/$/, "");
    }

    if (baseUrl) {
      const path = cleanedValue.startsWith("/")
        ? cleanedValue
        : `/${cleanedValue.replace(/^\/+/, "")}`;

      const parsedUrl = new URL(path, baseUrl);
      parsedUrl.hash = "";

      return parsedUrl.toString().replace(/\/$/, "");
    }

    if (cleanedValue.startsWith("www.")) {
      const parsedUrl = new URL(`https://${cleanedValue}`);
      parsedUrl.hash = "";

      return parsedUrl.toString().replace(/\/$/, "");
    }

    if (cleanedValue.includes(".")) {
      const parsedUrl = new URL(`https://${cleanedValue}`);
      parsedUrl.hash = "";

      return parsedUrl.toString().replace(/\/$/, "");
    }

    return "";
  } catch {
    return "";
  }
};

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const getPathname = (url: string) => {
  try {
    return new URL(url).pathname || "/";
  } catch {
    return "/";
  }
};

const getSearch = (url: string) => {
  try {
    return new URL(url).search;
  } catch {
    return "";
  }
};

const escapeCsv = (value: string) => {
  return `"${value.replace(/"/g, '""')}"`;
};

const splitMappingLine = (line: string) => {
  const delimiters = ["->", "=>", "\t", ","];

  for (const delimiter of delimiters) {
    const delimiterIndex = line.indexOf(delimiter);

    if (delimiterIndex !== -1) {
      return {
        oldValue: line.slice(0, delimiterIndex).trim(),
        newValue: line
          .slice(delimiterIndex + delimiter.length)
          .trim(),
      };
    }
  }

  return null;
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
    question: "What is a redirect mapping?",
    answer:
      "A redirect mapping is a documented list showing where each old URL should send users and search engines after a page move, redesign, migration, URL cleanup, or website restructure.",
  },
  {
    question: "Should I use a 301 or 308 redirect?",
    answer:
      "Both 301 and 308 are permanent redirect status codes. Choose the format that your CMS, server, hosting environment, or developer supports correctly and test the result after implementation.",
  },
  {
    question: "Can I redirect every old page to the homepage?",
    answer:
      "Usually no. Redirect an old URL to the closest useful equivalent page whenever possible. Sending unrelated pages to the homepage can create a poor user experience and may not preserve the original page intent.",
  },
  {
    question: "What is a redirect chain?",
    answer:
      "A redirect chain happens when one URL redirects to another URL, which then redirects again. Try to map each old URL directly to its final destination instead of creating unnecessary hops.",
  },
  {
    question: "Should I include URLs that already return 404?",
    answer:
      "Review each case individually. Redirect only when there is a closely relevant replacement page. A page with no useful equivalent may be better left as a proper not-found response rather than redirected to an unrelated page.",
  },
  {
    question: "How long should website redirects remain active?",
    answer:
      "Keep redirects active long enough for users, search engines, external links, bookmarks, and historical traffic to transition. Avoid removing migration redirects too quickly after a major URL or domain move.",
  },
];

const RedirectMappingGenerator = () => {
  const [oldSiteUrl, setOldSiteUrl] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [redirectCode, setRedirectCode] = useState<"301" | "308">(
    "301",
  );
  const [redirectFormat, setRedirectFormat] =
    useState<RedirectFormat>("csv");
  const [mappingsInput, setMappingsInput] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const resolvedOldSite = useMemo(
    () => normaliseBaseUrl(oldSiteUrl),
    [oldSiteUrl],
  );

  const resolvedNewSite = useMemo(
    () => normaliseBaseUrl(newSiteUrl),
    [newSiteUrl],
  );

  const mappingAnalysis = useMemo<MappingAnalysis>(() => {
    const lines = mappingsInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const preparedMappings: RedirectMapping[] = [];

    const oldSiteHost = resolvedOldSite
      ? getHostname(resolvedOldSite)
      : "";

    const newSiteHost = resolvedNewSite
      ? getHostname(resolvedNewSite)
      : "";

    lines.forEach((line, index) => {
      const splitLine = splitMappingLine(line);

      if (!splitLine) {
        preparedMappings.push({
          id: `mapping-${index}`,
          originalLine: line,
          oldUrl: "",
          newUrl: "",
          oldPath: "",
          status: "invalid",
          reason:
            "Use one mapping per line in this format: old-url -> new-url",
        });

        return;
      }

      const oldHeader = splitLine.oldValue
        .toLowerCase()
        .replace(/\s+/g, "");

      const newHeader = splitLine.newValue
        .toLowerCase()
        .replace(/\s+/g, "");

      const looksLikeHeader =
        index === 0 &&
        ["oldurl", "sourceurl", "fromurl", "oldpath"].includes(
          oldHeader,
        ) &&
        ["newurl", "targeturl", "tourl", "newpath"].includes(
          newHeader,
        );

      if (looksLikeHeader) {
        return;
      }

      const oldUrl = normaliseUrl(splitLine.oldValue, resolvedOldSite);
      const newUrl = normaliseUrl(splitLine.newValue, resolvedNewSite);

      if (!oldUrl || !newUrl) {
        preparedMappings.push({
          id: `mapping-${index}`,
          originalLine: line,
          oldUrl,
          newUrl,
          oldPath: "",
          status: "invalid",
          reason:
            "One or both URLs could not be understood. Add a valid absolute URL or provide the correct base website URL above.",
        });

        return;
      }

      const oldHostname = getHostname(oldUrl);
      const newHostname = getHostname(newUrl);
      const oldPath = getPathname(oldUrl);

      const reviewReasons: string[] = [];

      if (oldSiteHost && oldHostname !== oldSiteHost) {
        reviewReasons.push(
          "The source URL does not match the Old Website URL.",
        );
      }

      if (newSiteHost && newHostname !== newSiteHost) {
        reviewReasons.push(
          "The target URL does not match the New Website URL.",
        );
      }

      if (oldUrl === newUrl) {
        reviewReasons.push(
          "The old and new URL are the same, so no redirect appears necessary.",
        );
      }

      if (getSearch(oldUrl)) {
        reviewReasons.push(
          "The source URL contains query parameters. Review this redirect manually before implementation.",
        );
      }

      preparedMappings.push({
        id: `mapping-${index}`,
        originalLine: line,
        oldUrl,
        newUrl,
        oldPath,
        status: reviewReasons.length ? "review" : "valid",
        reason: reviewReasons.length
          ? reviewReasons.join(" ")
          : "Direct URL mapping looks ready for implementation review.",
      });
    });

    const seenOldUrls = new Set<string>();
    let duplicateCount = 0;

    const mappings = preparedMappings.map((mapping) => {
      if (!mapping.oldUrl || mapping.status === "invalid") {
        return mapping;
      }

      if (seenOldUrls.has(mapping.oldUrl)) {
        duplicateCount += 1;

        return {
          ...mapping,
          status: "review" as RedirectStatus,
          reason:
            "This source URL appears more than once in the redirect list. Keep one final target only.",
        };
      }

      seenOldUrls.add(mapping.oldUrl);

      return mapping;
    });

    const validCount = mappings.filter(
      (mapping) => mapping.status === "valid",
    ).length;

    const reviewCount = mappings.filter(
      (mapping) => mapping.status === "review",
    ).length;

    const invalidCount = mappings.filter(
      (mapping) => mapping.status === "invalid",
    ).length;

    return {
      mappings,
      validCount,
      reviewCount,
      invalidCount,
      duplicateCount,
    };
  }, [mappingsInput, resolvedNewSite, resolvedOldSite]);

  const validMappings = useMemo(() => {
    return mappingAnalysis.mappings.filter(
      (mapping) => mapping.status === "valid",
    );
  }, [mappingAnalysis.mappings]);

  const generatedOutput = useMemo(() => {
    if (!validMappings.length) {
      return "# Add valid redirect mappings to generate output.";
    }

    if (redirectFormat === "csv") {
      const rows = [
        ["Old URL", "New URL", "Redirect Code"],
        ...validMappings.map((mapping) => [
          mapping.oldUrl,
          mapping.newUrl,
          redirectCode,
        ]),
      ];

      return rows
        .map((row) => row.map((column) => escapeCsv(column)).join(","))
        .join("\n");
    }

    if (redirectFormat === "apache") {
      const lines = [
        "# Apache redirect rules",
        "# Review and test before placing in .htaccess or server configuration.",
        "",
      ];

      validMappings.forEach((mapping) => {
        lines.push(
          `Redirect ${redirectCode} ${mapping.oldPath} ${mapping.newUrl}`,
        );
      });

      return lines.join("\n");
    }

    const lines = [
      "# Nginx redirect rules",
      "# Place inside the relevant server block and test before deployment.",
      "",
    ];

    validMappings.forEach((mapping) => {
      lines.push(`location = ${mapping.oldPath} {`);
      lines.push(`  return ${redirectCode} ${mapping.newUrl};`);
      lines.push("}");
      lines.push("");
    });

    return lines.join("\n").trim();
  }, [redirectCode, redirectFormat, validMappings]);

  const validationNotes = useMemo(() => {
    const notes: string[] = [];

    if (!resolvedOldSite) {
      notes.push(
        "Add your old website URL to safely convert relative old paths into full URLs.",
      );
    }

    if (!resolvedNewSite) {
      notes.push(
        "Add your new website URL to safely convert relative new paths into full URLs.",
      );
    }

    if (!mappingAnalysis.mappings.length) {
      notes.push(
        "Add at least one old-to-new URL pair before downloading redirect rules.",
      );
    }

    if (mappingAnalysis.reviewCount) {
      notes.push(
        `${mappingAnalysis.reviewCount} mapping${
          mappingAnalysis.reviewCount === 1 ? " needs" : "s need"
        } manual review before implementation.`,
      );
    }

    if (mappingAnalysis.invalidCount) {
      notes.push(
        `${mappingAnalysis.invalidCount} invalid mapping${
          mappingAnalysis.invalidCount === 1 ? " was" : "s were"
        } excluded from the generated output.`,
      );
    }

    if (mappingAnalysis.duplicateCount) {
      notes.push(
        `${mappingAnalysis.duplicateCount} duplicate source URL${
          mappingAnalysis.duplicateCount === 1 ? " was" : "s were"
        } found. Each old URL should map to one final destination.`,
      );
    }

    if (validMappings.length) {
      notes.push(
        "Test each redirect after implementation and confirm the final destination loads correctly without an extra redirect hop.",
      );
    }

    return notes;
  }, [
    mappingAnalysis.duplicateCount,
    mappingAnalysis.invalidCount,
    mappingAnalysis.mappings.length,
    mappingAnalysis.reviewCount,
    resolvedNewSite,
    resolvedOldSite,
    validMappings.length,
  ]);

  useEffect(() => {
    const pageTitle = "Free Redirect Mapping Generator | RankVelt";

    const pageDescription =
      "Create a practical old URL to new URL redirect map. Generate CSV, Apache, or Nginx redirect rules with RankVelt's free Redirect Mapping Generator.";

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "website";
    ensureMetaByProperty("og:url").content =
      `${SITE_URL}/tools/redirect-mapping-generator`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}/tools/redirect-mapping-generator`;

    document
      .getElementById("rankvelt-redirect-mapping-schema")
      ?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-redirect-mapping-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: "Redirect Mapping Generator",
          url: `${SITE_URL}/tools/redirect-mapping-generator`,
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

  const loadDemoData = () => {
    setOldSiteUrl("https://old-example.com");
    setNewSiteUrl("https://new-example.com");

    setMappingsInput(
      `/old-local-seo -> /local-seo
/old-services -> /services
/old-blog/seo-tips -> /blog/local-seo-tips
https://old-example.com/contact-us -> https://new-example.com/contact`,
    );

    setCopyStatus("Demo redirect map loaded.");
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(generatedOutput);

      setCopyStatus("Redirect output copied successfully.");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 2200);
    } catch {
      setCopyStatus("Copy failed. Please copy the output manually.");
    }
  };

  const handleDownload = () => {
    const extension =
      redirectFormat === "csv"
        ? "csv"
        : redirectFormat === "apache"
          ? "txt"
          : "conf";

    const filename =
      redirectFormat === "csv"
        ? "redirect-map.csv"
        : redirectFormat === "apache"
          ? "apache-redirect-rules.txt"
          : "nginx-redirect-rules.conf";

    const contentType =
      redirectFormat === "csv"
        ? "text/csv;charset=utf-8"
        : "text/plain;charset=utf-8";

    const blob = new Blob([generatedOutput], {
      type: contentType,
    });

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = filename.replace(/\.[^/.]+$/, `.${extension}`);
    link.click();

    URL.revokeObjectURL(objectUrl);
  };

  const handleReset = () => {
    setOldSiteUrl("");
    setNewSiteUrl("");
    setRedirectCode("301");
    setRedirectFormat("csv");
    setMappingsInput("");
    setCopyStatus("");
  };

  const statusStyles: Record<
    RedirectStatus,
    {
      label: string;
      className: string;
    }
  > = {
    valid: {
      label: "Ready",
      className:
        "border-emerald-400/25 bg-emerald-400/[0.1] text-emerald-200",
    },
    review: {
      label: "Review",
      className:
        "border-orange-300/25 bg-orange-300/[0.1] text-orange-100",
    },
    invalid: {
      label: "Invalid",
      className: "border-red-400/25 bg-red-400/[0.1] text-red-200",
    },
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
            Redirect Mapping{" "}
            <span className="text-gradient-gold">Generator</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Build a direct old URL to new URL redirect map for redesigns,
            migrations, URL cleanups, CMS changes, and website restructuring.
          </p>
        </section>

        <section className="mt-12 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Link2 size={21} />
              </span>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Add Redirect Pairs
                </h2>

                <p className="mt-1 text-sm text-white/75">
                  Add one old-to-new URL mapping per line.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                    Old Website URL
                  </span>

                  <input
                    value={oldSiteUrl}
                    onChange={(event) => setOldSiteUrl(event.target.value)}
                    placeholder="https://old-example.com"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                    New Website URL
                  </span>

                  <input
                    value={newSiteUrl}
                    onChange={(event) => setNewSiteUrl(event.target.value)}
                    placeholder="https://new-example.com"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                    Redirect Type
                  </span>

                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRedirectCode("301")}
                      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                        redirectCode === "301"
                          ? "border-primary/50 bg-primary/[0.1] text-primary"
                          : "border-white/15 bg-black/20 text-white/80 hover:border-primary/35"
                      }`}
                    >
                      <span className="block text-sm font-black">301</span>
                      <span className="mt-1 block text-xs text-white/75">
                        Permanent move
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRedirectCode("308")}
                      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                        redirectCode === "308"
                          ? "border-primary/50 bg-primary/[0.1] text-primary"
                          : "border-white/15 bg-black/20 text-white/80 hover:border-primary/35"
                      }`}
                    >
                      <span className="block text-sm font-black">308</span>
                      <span className="mt-1 block text-xs text-white/75">
                        Permanent move
                      </span>
                    </button>
                  </div>
                </div>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                    Download Format
                  </span>

                  <select
                    value={redirectFormat}
                    onChange={(event) =>
                      setRedirectFormat(
                        event.target.value as RedirectFormat,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-primary/55"
                  >
                    <option value="csv">CSV Redirect Map</option>
                    <option value="apache">Apache Redirect Rules</option>
                    <option value="nginx">Nginx Redirect Rules</option>
                  </select>

                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Choose CSV for planning or server rules for technical review.
                  </p>
                </label>
              </div>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                  Old URL → New URL Mappings
                </span>

                <textarea
                  value={mappingsInput}
                  onChange={(event) => setMappingsInput(event.target.value)}
                  rows={13}
                  placeholder={`/old-service -> /new-service
/old-contact -> /contact
https://old-example.com/old-page -> https://new-example.com/new-page`}
                  className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm leading-relaxed text-white outline-none placeholder:text-white/40 focus:border-primary/55"
                />

                <p className="mt-2 text-xs leading-relaxed text-white/75">
                  Accepted separators: <code>→</code> is not supported. Use{" "}
                  <code>-&gt;</code>, <code>=&gt;</code>, comma, or tab.
                </p>
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={loadDemoData}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/35 bg-primary/[0.08] px-4 py-3 text-xs font-black text-primary transition-colors hover:bg-primary/[0.14]"
                >
                  <ClipboardCheck size={15} />
                  Load Demo Map
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-3 text-xs font-black text-white transition-colors hover:border-red-400/45 hover:text-red-300"
                >
                  <RefreshCcw size={15} />
                  Reset
                </button>
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Generated Redirect Output
                </p>

                <h2 className="mt-3 text-2xl font-black text-white">
                  Review Before Implementation
                </h2>
              </div>

              <FileCode2 className="text-primary" size={23} />
            </div>

            <textarea
              readOnly
              value={generatedOutput}
              spellCheck={false}
              aria-label="Generated redirect output"
              className="mt-7 min-h-[360px] w-full resize-y rounded-2xl border border-white/[0.12] bg-[#080808] p-5 font-mono text-xs leading-relaxed text-emerald-200 outline-none"
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                <Copy size={15} />
                Copy Output
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
              >
                <Download size={15} />
                Download File
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
                  Ready
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {mappingAnalysis.validCount}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-300/20 bg-orange-300/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-100">
                  Review
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {mappingAnalysis.reviewCount}
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">
                  Invalid
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {mappingAnalysis.invalidCount}
                </p>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/[0.1] bg-black/25 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Implementation Notes
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

        {mappingAnalysis.mappings.length > 0 && (
          <section className="mt-12 rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck size={21} />
              </span>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Redirect Mapping Review
                </p>

                <h2 className="mt-1 text-2xl font-black text-white">
                  Check Each URL Before Deployment
                </h2>
              </div>
            </div>

            <div className="mt-7 overflow-x-auto">
              <table className="min-w-[950px] w-full border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                    <th className="px-4 py-2">Old URL</th>
                    <th className="px-4 py-2">New URL</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Review Note</th>
                  </tr>
                </thead>

                <tbody>
                  {mappingAnalysis.mappings.map((mapping) => {
                    const style = statusStyles[mapping.status];

                    return (
                      <tr
                        key={mapping.id}
                        className="bg-black/20 text-sm text-white/85"
                      >
                        <td className="max-w-[250px] rounded-l-xl px-4 py-4 font-mono text-xs break-all text-white/90">
                          {mapping.oldUrl || mapping.originalLine}
                        </td>

                        <td className="max-w-[250px] px-4 py-4 font-mono text-xs break-all text-white/90">
                          {mapping.newUrl || "—"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${style.className}`}
                          >
                            {style.label}
                          </span>
                        </td>

                        <td className="max-w-[330px] rounded-r-xl px-4 py-4 text-xs leading-relaxed text-white/75">
                          {mapping.reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mt-16 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <Globe2 className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Match Intent Closely
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Redirect each old URL to the closest useful replacement page so
              users can still find relevant information after a website change.
            </p>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] via-white/[0.03] to-purple-500/[0.1] p-6">
            <Link2 className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Keep Redirects Direct
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Map old URLs straight to the final destination rather than routing
              visitors and crawlers through multiple intermediate redirects.
            </p>
          </article>

          <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
            <AlertTriangle className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              Test Before Launch
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Check important redirects in a browser, crawl the old URL list,
              and confirm that every final target loads correctly without loops
              or accidental chains.
            </p>
          </article>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Redirect Mapping FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Questions Before You Launch
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
                Planning a Website Migration?
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Protect SEO Value During a Website Change
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Redirect mapping is only one migration task. A successful move
                also needs technical checks, crawlability review, canonical
                handling, internal-link updates, sitemap review, and careful
                post-launch monitoring.
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
                Improve technical foundations, service-page structure, site
                clarity, and organic lead-generation pathways.
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
                Improve Shopify site structure, collection-page discovery,
                product visibility, and technical SEO planning.
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
                href="/tools/bulk-redirect-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Bulk Redirect Generator <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/xml-sitemap-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                XML Sitemap Generator <span className="text-primary">→</span>
              </a>
              <a
                href="/tools/robots-txt-generator"
                className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/40 hover:text-white"
              >
                Robots.txt Generator <span className="text-primary">→</span>
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

      <RedirectMappingGeneratorArticle />
      </div>
    </main>
  );
};

export default RedirectMappingGenerator;

/* ==================== SEO ARTICLE (Phase 1) ==================== */
function RedirectMappingGeneratorArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Planning First</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Redirect Mapping Is the Planning Step, Not the Server Rule</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Redirect mapping is the planning step that comes before any server file changes. Your redirect map records every old URL, its chosen destination, its redirect type, and which rows still need a decision. It is a website migration seo deliverable, not a config file. Implementation, meaning the actual .htaccess, Nginx, or Cloudflare rule syntax, is a separate job, and RankVelt has a Bulk Redirect Generator for that output step. This page focuses on the decisions that have to be right before anyone writes rules.</p>
          <p>That separation matters in practice. When teams skip the mapping stage, developers end up guessing pairings under deadline pressure, and guessed pairings are how you get redirect chains, mismatched topics, and retired pages quietly pointed at the homepage. A completed redirect map gives developers one reviewed source of truth. Every row has already been checked for duplicates, query strings, and host mismatches before implementation begins.</p>
          <p>This tool supports that planning review. You paste old and new URL pairs, choose 301 or 308, and the tool flags rows that need attention: duplicate old URLs, sources with query parameters, and targets on the wrong host. The CSV export is the spreadsheet you share with stakeholders, while the Apache and Nginx exports are ready for technical review after the decisions are made.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">URL Inventory</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Start With a Complete Inventory of the Old Site</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>You cannot redirect URLs you do not know exist, and no single export lists them all. Build the inventory from four sources and merge them into one spreadsheet.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>A full crawl of the current site, which finds everything reachable through navigation and internal links.</li>
            <li>A Search Console export of URLs with clicks or impressions, which catches orphaned pages that still earn visits.</li>
            <li>Server access logs, which show what is actually being requested, including old addresses people still reach from bookmarks and email links.</li>
            <li>Your backlink profile, which lists the pages other websites link to and therefore the highest priority rows in the whole map.</li>
          </ul>
          <p>Deduplicate the merged list and expect surprises. Parameter variants, legacy campaign pages, and forgotten sections usually make the real inventory larger than anyone estimated. That number often changes the launch plan, which is exactly why the inventory comes first. Normalize the variants as you merge: the www and non-www versions, http and https, and trailing slash differences can all describe the same page, and treating them as separate rows produces conflicting targets later. Paste the cleaned old URL column into this generator and start assigning destinations row by row.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Intent Matching</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Map by Intent, Not by URL Similarity</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>The fastest way to damage a migration is to match URLs by text similarity. An old page and a new page can share words in the path while serving completely different visitor intent, and search engines judge the pairing by content, not spelling.</p>
          <p>Match on what the visitor wanted to accomplish. A service page maps to the equivalent service page. A how-to article maps to the guide that now covers that task. A location page maps to the same city on the new structure. String matching would pair an old SEO tips article with a new design tips article because the words look close, but one reader wants search advice and the other wants design examples.</p>
          <p>Give your url mapping spreadsheet five columns: Old URL, New URL, Intent match, Priority, and Verified. The Intent match column forces a human judgment on every row instead of a formula guess, and the Verified column tracks which rows have been tested on staging. This generator keeps that review visible at scale by flagging duplicate source URLs and rows containing query parameters, both of which usually signal intent problems worth a manual look.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Missing Equivalents</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">When an Old Page Has No New Equivalent</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Some rows have no successor. A discontinued product line, a closed service area, or a retired campaign page may have nothing on the new site that honestly replaces it. Forcing a destination for these rows is where redirect maps go wrong.</p>
          <p>You have three honest options, and the right one depends on the page.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Redirect to the closest category or parent service page when a visitor following the old link would still find something useful there.</li>
            <li>Return a 410 Gone status when the page was removed deliberately and nothing similar exists. A 410 tells crawlers the removal is permanent, so the URL leaves the index faster than a fresh 404 would.</li>
            <li>Leave a clean 404 when the removal is temporary or uncertain, and make sure the error page offers navigation to real sections of the site.</li>
          </ul>
          <p>What devalues the map is filling these rows with the homepage just to make the spreadsheet look complete. Search engines frequently treat a redirect from a specific page to an unrelated homepage as a soft 404, which means the row transfers little value while still sending a visitor somewhere they did not choose. An honest 410 or a well chosen category page is a stronger answer than a complete looking map.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Prioritization</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Prioritize the URLs That Carry the Most Risk</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Before you sort anything, export your current Search Console performance data and your analytics landing page report, and save both outside the project folder. That baseline is what lets you prove after launch whether a dip is normal reprocessing or a real mapping gap, and you cannot recreate it once the old site is gone. With the baseline saved, sort the spreadsheet by external links first and search clicks second, and work from the top down.</p>
          <p>Not every row carries equal risk, so work the map in priority order instead of alphabetical order. If the launch deadline arrives early, the rows that matter most should already be finished and verified.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>First priority: URLs with external links pointing at them. A page with modest traffic but several referring domains loses real link equity if it starts returning 404, and that equity is far harder to rebuild than a ranking you can reoptimize later.</li>
            <li>Second priority: pages with organic clicks or impressions in recent months, especially landing pages that convert. These carry visible business value.</li>
            <li>Third priority: URLs with no backlinks, no search impressions, and no recent requests in the server log. Many of these can be retired deliberately or handled after launch without damage.</li>
          </ul>
          <p>This is also where your 301 redirect plan stays realistic. Permanent redirects are the default for rows you map, but the plan should name which rows you intentionally leave unmapped and why. A short written reason per retired row prevents someone from quietly redirecting it to the homepage during implementation week.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Staging QA</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Test Every Row of the Map on Staging</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Staging is where the map gets tested against reality. Request every old URL in the spreadsheet and confirm each one returns a single permanent redirect, a 301 or 308 depending on your stack, landing on the intended destination in one hop. Automate this check if the map is large, because hand testing a sample will miss the one broken pattern that affects hundreds of rows.</p>
          <p>Status code alone is not enough. Open the destination and check content parity: does the new page cover the same topic at similar depth? A correct 301 pointing at a thin category page still fails the intent test for visitors and for search engines.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Canonical tags on staging point at final new URLs, never at staging domains.</li>
            <li>No staging noindex tags or robots.txt blocks are present that could ship to production.</li>
            <li>The staging XML sitemap lists only new URLs, with no old or staging addresses mixed in.</li>
            <li>Internal links on the new site point at new URLs, not at old ones that will redirect.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Post-Launch</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Monitor the Map After Launch in Search Console</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>After launch, Search Console becomes your monitoring dashboard. Submit the new XML sitemap immediately, and if the domain changed, use the Change of Address tool only after the redirects are live and verified. Watch the indexed page count daily during the first week and compare it against the pre-migration baseline you exported. A new indexed count that stalls well below the old total signals a technical block, not normal patience.</p>
          <p>Work the 404 reports in priority order. When Search Console reports not found errors, check whether the URL had backlinks or traffic in your inventory. Rows that matter get a proper redirect added. Rows that were retired deliberately can stay as they are, but record the decision so nobody re-adds a guess later. Check crawl stats too: healthy crawling of new URLs within the first days means the migration is being picked up, long before rankings tell you anything useful.</p>
          <p>Expect some ranking fluctuation while Google recrawls and reassociates every URL. That noise is normal and usually settles as processing completes. What is not normal is a steady rise in crawl errors or pages dropping out of the index week after week, and both point back to gaps in the redirect map. Keeping the map updated as a living document makes those gaps easy to find and fix.</p>
        </div>
      </section>
    </>
  );
}
