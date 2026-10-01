// RankVelt tool page: Bulk Redirect Generator (100% free, browser-only)
// Place at: src/pages/tools/BulkRedirectGenerator.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).

import { useEffect, useMemo, useState } from "react";

const SITE_URL = "https://rankvelt.com";
const PAGE_PATH = "/tools/bulk-redirect-generator";
const PAGE_DESCRIPTION =
  "Generate bulk 301 or 302 redirect rules in seconds. Paste old and new URLs, get Apache .htaccess, Nginx, or Cloudflare output. Free, runs in your browser.";

type OutputFormat = "apache" | "nginx" | "cloudflare" | "plain";
type RedirectCode = "301" | "302";
type InputMode = "twoLists" | "pairs";
type RowStatus = "ready" | "review" | "invalid";

interface RedirectRow {
  id: string;
  rawOld: string;
  rawNew: string;
  oldPath: string;
  newUrl: string;
  status: RowStatus;
  notes: string[];
}

const PAIR_DELIMITERS = ["->", "=>", "\t", ",", "|", ";"];

const HEADER_TOKENS = new Set([
  "oldurl",
  "oldurls",
  "sourceurl",
  "sourceurls",
  "fromurl",
  "fromurls",
  "oldpath",
  "old",
  "source",
  "from",
]);

const HEADER_TOKENS_NEW = new Set([
  "newurl",
  "newurls",
  "targeturl",
  "targeturls",
  "tourl",
  "newpath",
  "new",
  "target",
  "to",
]);

function stripQuotes(value: string): string {
  return value.trim().replace(/^["']+|["']+$/g, "");
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function looksLikeHeader(oldValue: string, newValue: string): boolean {
  const a = oldValue.toLowerCase().replace(/[^a-z]/g, "");
  const b = newValue.toLowerCase().replace(/[^a-z]/g, "");
  return HEADER_TOKENS.has(a) && HEADER_TOKENS_NEW.has(b);
}

function splitPairLine(line: string): { oldValue: string; newValue: string } | null {
  for (const delimiter of PAIR_DELIMITERS) {
    const index = line.indexOf(delimiter);
    if (index !== -1) {
      return {
        oldValue: stripQuotes(line.slice(0, index)),
        newValue: stripQuotes(line.slice(index + delimiter.length)),
      };
    }
  }
  return null;
}

function parseSource(value: string): { oldPath: string; error: string; hasQuery: boolean } {
  const cleaned = stripQuotes(value);
  if (!cleaned) {
    return { oldPath: "", error: "Source URL is empty.", hasQuery: false };
  }
  try {
    if (isAbsoluteUrl(cleaned)) {
      const parsed = new URL(cleaned);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { oldPath: "", error: "Source URL must use http or https.", hasQuery: false };
      }
      const hasQuery = parsed.search.length > 0;
      const path = parsed.pathname || "/";
      if (path === "/") {
        return { oldPath: "", error: "Redirecting the homepage itself is not useful. Use a real page path.", hasQuery };
      }
      return { oldPath: decodeURI(path), error: "", hasQuery };
    }
    let path = cleaned;
    if (!path.startsWith("/")) {
      path = `/${path}`;
    }
    if (/\s/.test(path)) {
      return { oldPath: "", error: "Source URL contains spaces and is not a valid path.", hasQuery: false };
    }
    if (path === "/") {
      return { oldPath: "", error: "Redirecting the homepage itself is not useful. Use a real page path.", hasQuery: false };
    }
    return { oldPath: path, error: "", hasQuery: false };
  } catch {
    return { oldPath: "", error: "Source URL could not be understood.", hasQuery: false };
  }
}

function parseTarget(value: string): { newUrl: string; error: string } {
  const cleaned = stripQuotes(value);
  if (!cleaned) {
    return { newUrl: "", error: "Target URL is empty." };
  }
  if (isAbsoluteUrl(cleaned)) {
    try {
      const parsed = new URL(cleaned);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { newUrl: "", error: "Target URL must use http or https." };
      }
      return { newUrl: cleaned, error: "" };
    } catch {
      return { newUrl: "", error: "Target URL could not be understood." };
    }
  }
  let path = cleaned;
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  if (/\s/.test(path)) {
    return { newUrl: "", error: "Target URL contains spaces and is not a valid path." };
  }
  return { newUrl: path, error: "" };
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

const pageFaqs = [
  {
    question: "What does a bulk redirect generator do?",
    answer:
      "It converts a list of old-to-new URL pairs into ready-to-use redirect rules for your server. Instead of writing hundreds of RewriteRule or redirect lines by hand, you paste two columns (old URL, new URL) and get clean, escaped output for Apache .htaccess, Nginx, or Cloudflare in seconds.",
  },
  {
    question: "Should I use a 301 or a 302 redirect?",
    answer:
      "Use 301 (permanent) for URL changes that are not coming back: migrations, redesigns, domain moves, deleted pages with replacements. Use 302 (temporary) only for short-term situations like A/B tests or temporary promos. Google treats 301 as the signal to pass ranking signals to the new URL, so 301 is the right default for almost every bulk redirect job.",
  },
  {
    question: "What is the difference between Redirect and RewriteRule in .htaccess?",
    answer:
      "Redirect is the simple mod_alias directive (Redirect 301 /old-page https://example.com/new-page). RewriteRule is the mod_rewrite directive (RewriteRule ^old-page$ https://example.com/new-page [R=301,L]). If your .htaccess already uses RewriteRule (WordPress and most CMS setups do), keep everything in mod_rewrite. Mixing the two modules on the same request can cause rules to fight each other and produce unexpected results.",
  },
  {
    question: "Where do I paste the rules in my .htaccess file?",
    answer:
      "Paste them near the top of the file, after RewriteEngine On and before any catch-all rules (such as the WordPress BEGIN WordPress block). Apache processes rules top to bottom, so a catch-all placed earlier will swallow your redirects. Back up your current .htaccess before making changes.",
  },
  {
    question: "Can I redirect all my old pages to the homepage?",
    answer:
      "You can, but you should not. Redirect each old URL to the closest matching new page. Google treats mass redirects to the homepage as soft 404s, which means ranking signals are lost anyway, and visitors land on a page that does not answer what they were looking for.",
  },
  {
    question: "What is a redirect chain and why should I avoid it?",
    answer:
      "A redirect chain is when URL A redirects to URL B, which redirects to URL C. Every extra hop slows the page down for users and forces crawlers to spend more crawl budget. Map each old URL directly to its final destination. This tool also flags when the same old URL appears more than once so you do not create loops.",
  },
  {
    question: "How many redirects can I generate at once?",
    answer:
      "The tool handles thousands of rules. It runs entirely in your browser, so there is no upload limit from our side. That said, if your list grows into the tens of thousands, consider database or server-level redirects (for example in Nginx server config rather than .htaccess), because a giant .htaccess file is read on every single request and can slow the server down.",
  },
  {
    question: "Do 301 redirects pass full link equity?",
    answer:
      "Google has confirmed that 301 redirects pass ranking signals, and modern guidance treats them as passing essentially the full value of the original page. The important part is that the redirect points to a relevant page and stays in place long term. A redirect that points to unrelated content or gets removed after a few weeks will not preserve your rankings.",
  },
  {
    question: "What is the Cloudflare bulk redirect CSV format?",
    answer:
      "Cloudflare bulk redirects expect a CSV with Source URL, Target URL, Status, and parameters like whether to preserve the query string. This tool generates that CSV for you, so you can import hundreds of redirects into Cloudflare without writing them by hand in the dashboard.",
  },
  {
    question: "How do I test my redirects after adding them?",
    answer:
      "Check a sample of old URLs in a browser and confirm they land on the right page with a 301 status. Then crawl the full old URL list with a tool like Screaming Frog, or use a bulk HTTP status checker, to confirm every URL returns exactly one 301 hop to the correct final destination. Watch Google Search Console for 404 spikes in the weeks after launch.",
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

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-primary transition-transform group-open:rotate-180">
      <polyline points="6 9 12 15 18 9" />
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

export default function BulkRedirectGenerator() {
  const [inputMode, setInputMode] = useState<InputMode>("twoLists");
  const [oldUrlsInput, setOldUrlsInput] = useState("");
  const [newUrlsInput, setNewUrlsInput] = useState("");
  const [pairsInput, setPairsInput] = useState("");
  const [sourceDomain, setSourceDomain] = useState("");
  const [redirectCode, setRedirectCode] = useState<RedirectCode>("301");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("apache");
  const [copyStatus, setCopyStatus] = useState("");

  const rows = useMemo<RedirectRow[]>(() => {
    const collected: Array<{ oldValue: string; newValue: string }> = [];

    if (inputMode === "twoLists") {
      const oldLines = oldUrlsInput.split("\n").map((l) => l.trim()).filter(Boolean);
      const newLines = newUrlsInput.split("\n").map((l) => l.trim()).filter(Boolean);
      const maxLen = Math.max(oldLines.length, newLines.length);
      for (let i = 0; i < maxLen; i += 1) {
        collected.push({
          oldValue: oldLines[i] ?? "",
          newValue: newLines[i] ?? "",
        });
      }
    } else {
      const lines = pairsInput.split("\n").map((l) => l.trim()).filter(Boolean);
      lines.forEach((line) => {
        const split = splitPairLine(line);
        if (!split) {
          collected.push({ oldValue: line, newValue: "" });
        } else {
          collected.push({ oldValue: split.oldValue, newValue: split.newValue });
        }
      });
    }

    const parsed: RedirectRow[] = [];
    collected.forEach((entry, index) => {
      if (!entry.oldValue && !entry.newValue) {
        return;
      }
      if (looksLikeHeader(entry.oldValue, entry.newValue)) {
        return;
      }
      const notes: string[] = [];
      let status: RowStatus = "ready";

      const source = parseSource(entry.oldValue);
      const target = parseTarget(entry.newValue);

      if (source.error) {
        status = "invalid";
        notes.push(source.error);
      }
      if (target.error) {
        status = "invalid";
        notes.push(target.error);
      }
      if (status === "ready") {
        if (source.hasQuery) {
          status = "review";
          notes.push(
            "The source URL contains a query string. Apache RewriteRule matches the path only, so handle parameters with a RewriteCond or strip them deliberately.",
          );
        }
        const normOld = source.oldPath.toLowerCase();
        const normNew = target.newUrl.toLowerCase();
        if (normOld === normNew || target.newUrl === source.oldPath) {
          status = "review";
          notes.push("The old and new URL are the same, so no redirect is needed for this row.");
        }
      }

      parsed.push({
        id: `row-${index}`,
        rawOld: entry.oldValue,
        rawNew: entry.newValue,
        oldPath: source.oldPath,
        newUrl: target.newUrl,
        status,
        notes,
      });
    });

    const seen = new Set<string>();
    parsed.forEach((row) => {
      if (!row.oldPath || row.status === "invalid") {
        return;
      }
      const key = row.oldPath.toLowerCase();
      if (seen.has(key)) {
        row.status = "review";
        row.notes.push("This source URL appears more than once. Keep one final target only to avoid conflicts.");
      } else {
        seen.add(key);
      }
    });

    return parsed;
  }, [inputMode, oldUrlsInput, newUrlsInput, pairsInput]);

  const readyRows = useMemo(() => rows.filter((r) => r.status !== "invalid"), [rows]);
  const invalidRows = useMemo(() => rows.filter((r) => r.status === "invalid"), [rows]);
  const reviewRows = useMemo(() => rows.filter((r) => r.status === "review"), [rows]);

  const generatedOutput = useMemo(() => {
    if (!readyRows.length) {
      return "# Paste redirect pairs on the left to generate output.";
    }

    if (outputFormat === "apache") {
      const lines = [
        `# Bulk ${redirectCode} redirects generated by RankVelt`,
        "# Paste near the top of your .htaccess file, after RewriteEngine On,",
        "# and before any catch-all rules. Test on staging first.",
        "RewriteEngine On",
        "",
      ];
      readyRows.forEach((row) => {
        lines.push(
          `RewriteRule ^${escapeRegex(row.oldPath.slice(1))}$ ${row.newUrl} [R=${redirectCode},L]`,
        );
      });
      return lines.join("\n");
    }

    if (outputFormat === "nginx") {
      const lines = [
        `# Bulk ${redirectCode} redirects generated by RankVelt`,
        "# Place inside the relevant server block, then run: nginx -t",
        "# before reloading. Test on staging first.",
        "",
      ];
      readyRows.forEach((row) => {
        lines.push(`location = ${row.oldPath} {`);
        lines.push(`  return ${redirectCode} ${row.newUrl};`);
        lines.push("}");
        lines.push("");
      });
      return lines.join("\n").trim();
    }

    if (outputFormat === "cloudflare") {
      const domain = stripQuotes(sourceDomain).replace(/\/+$/, "");
      const lines = [
        ['"Source URL"', '"Target URL"', '"Status"', '"Preserve query string"'].join(","),
      ];
      readyRows.forEach((row) => {
        let sourceUrl = row.oldPath;
        if (!isAbsoluteUrl(sourceUrl) && domain) {
          const cleanDomain = isAbsoluteUrl(domain) ? domain : `https://${domain}`;
          sourceUrl = `${cleanDomain}${row.oldPath}`;
        }
        lines.push(
          [
            escapeCsvCell(sourceUrl),
            escapeCsvCell(row.newUrl),
            escapeCsvCell(redirectCode),
            escapeCsvCell("false"),
          ].join(","),
        );
      });
      return lines.join("\n");
    }

    return readyRows.map((row) => `${row.oldPath} -> ${row.newUrl}`).join("\n");
  }, [readyRows, outputFormat, redirectCode, sourceDomain]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(generatedOutput);
      setCopyStatus("Redirect output copied successfully.");
      window.setTimeout(() => setCopyStatus(""), 2200);
    } catch {
      setCopyStatus("Copy failed. Please copy the output manually.");
    }
  };

  const handleDownload = () => {
    const meta: Record<OutputFormat, { filename: string; type: string }> = {
      apache: { filename: "rankvelt-htaccess-redirect-rules.txt", type: "text/plain;charset=utf-8" },
      nginx: { filename: "rankvelt-nginx-redirect-rules.conf", type: "text/plain;charset=utf-8" },
      cloudflare: { filename: "rankvelt-cloudflare-bulk-redirects.csv", type: "text/csv;charset=utf-8" },
      plain: { filename: "rankvelt-redirect-list.txt", type: "text/plain;charset=utf-8" },
    };
    const blob = new Blob([generatedOutput], { type: meta[outputFormat].type });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = meta[outputFormat].filename;
    link.click();
    URL.revokeObjectURL(objectUrl);
    setCopyStatus("File downloaded.");
    window.setTimeout(() => setCopyStatus(""), 2200);
  };

  const handleReset = () => {
    setOldUrlsInput("");
    setNewUrlsInput("");
    setPairsInput("");
    setSourceDomain("");
    setRedirectCode("301");
    setOutputFormat("apache");
    setCopyStatus("");
  };

  const loadDemoData = () => {
    setInputMode("twoLists");
    setOldUrlsInput(
      "/old-services.html\n/old-blog/seo-tips\nhttps://example.com/old-contact\n/products/blue-widget",
    );
    setNewUrlsInput(
      "https://example.com/services/\nhttps://example.com/blog/seo-tips/\nhttps://example.com/contact/\nhttps://example.com/shop/blue-widget/",
    );
    setCopyStatus("Demo redirect list loaded.");
  };

  useEffect(() => {
    // RouteSeoManager is the single source of truth for document.title and
    // meta tags. This effect only injects the page JSON-LD schema.
    document.getElementById("rankvelt-bulk-redirect-schema")?.remove();
    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-bulk-redirect-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: "Bulk Redirect Generator",
          url: `${SITE_URL}${PAGE_PATH}`,
          description: PAGE_DESCRIPTION,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "RankVelt", url: SITE_URL },
        },
        {
          "@type": "FAQPage",
          mainEntity: pageFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    });
    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, []);

  const statusStyles: Record<RowStatus, { label: string; className: string }> = {
    ready: {
      label: "Ready",
      className: "border-emerald-400/25 bg-emerald-400/[0.1] text-emerald-200",
    },
    review: {
      label: "Review",
      className: "border-orange-300/25 bg-orange-300/[0.1] text-orange-100",
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
            Free Technical SEO Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Bulk Redirect <span className="text-gradient-gold">Generator</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Paste a list of old and new URLs and generate bulk 301 or 302 redirect
            rules for Apache .htaccess, Nginx, or Cloudflare in seconds. Free, no
            signup, and your URL list never leaves your browser.
          </p>
        </section>

        <section className="mt-12 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              <div>
                <h2 className="text-2xl font-black text-white">Add Your URL Pairs</h2>
                <p className="mt-1 text-sm text-white/75">
                  Paste from a spreadsheet or type one pair per line.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <span className={labelCls}>Input style</span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInputMode("twoLists")}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      inputMode === "twoLists"
                        ? "border-primary/50 bg-primary/[0.1] text-primary"
                        : "border-white/15 bg-black/20 text-white/80 hover:border-primary/35"
                    }`}
                  >
                    <span className="block text-sm font-black">Two lists</span>
                    <span className="mt-1 block text-xs text-white/75">
                      Old URLs and new URLs, one per line
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("pairs")}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      inputMode === "pairs"
                        ? "border-primary/50 bg-primary/[0.1] text-primary"
                        : "border-white/15 bg-black/20 text-white/80 hover:border-primary/35"
                    }`}
                  >
                    <span className="block text-sm font-black">Paired lines</span>
                    <span className="mt-1 block text-xs text-white/75">
                      old -&gt; new, comma, or tab separated
                    </span>
                  </button>
                </div>
              </div>

              {inputMode === "twoLists" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelCls}>Old URLs (one per line)</span>
                    <textarea
                      value={oldUrlsInput}
                      onChange={(e) => setOldUrlsInput(e.target.value)}
                      rows={10}
                      placeholder={"/old-services.html\n/old-blog/seo-tips"}
                      spellCheck={false}
                      className={`${inputCls} resize-y font-mono`}
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>New URLs (one per line)</span>
                    <textarea
                      value={newUrlsInput}
                      onChange={(e) => setNewUrlsInput(e.target.value)}
                      rows={10}
                      placeholder={"https://example.com/services/\nhttps://example.com/blog/seo-tips/"}
                      spellCheck={false}
                      className={`${inputCls} resize-y font-mono`}
                    />
                  </label>
                </div>
              ) : (
                <label className="block">
                  <span className={labelCls}>Old and new URL pairs (one pair per line)</span>
                  <textarea
                    value={pairsInput}
                    onChange={(e) => setPairsInput(e.target.value)}
                    rows={10}
                    placeholder={"/old-services.html -> https://example.com/services/\n/old-contact, https://example.com/contact/"}
                    spellCheck={false}
                    className={`${inputCls} resize-y font-mono`}
                  />
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Accepted separators: -&gt;, =&gt;, comma, tab, | or semicolon. A header row is skipped automatically.
                  </p>
                </label>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className={labelCls}>Redirect type</span>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {(["301", "302"] as RedirectCode[]).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setRedirectCode(code)}
                        className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                          redirectCode === code
                            ? "border-primary/50 bg-primary/[0.1] text-primary"
                            : "border-white/15 bg-black/20 text-white/80 hover:border-primary/35"
                        }`}
                      >
                        <span className="block text-sm font-black">{code}</span>
                        <span className="mt-1 block text-xs text-white/75">
                          {code === "301" ? "Permanent move" : "Temporary move"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className={labelCls}>Output format</span>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                    className={`${inputCls} appearance-none`}
                  >
                    <option value="apache">Apache .htaccess (RewriteRule)</option>
                    <option value="nginx">Nginx (rewrite rules)</option>
                    <option value="cloudflare">Cloudflare bulk redirect CSV</option>
                    <option value="plain">Plain text list</option>
                  </select>
                </div>
              </div>

              {outputFormat === "cloudflare" && (
                <label className="block">
                  <span className={labelCls}>Source domain (optional, for Cloudflare CSV)</span>
                  <input
                    value={sourceDomain}
                    onChange={(e) => setSourceDomain(e.target.value)}
                    placeholder="https://example.com"
                    spellCheck={false}
                    className={inputCls}
                  />
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Cloudflare imports need full URLs. If your sources are paths only, add your domain here and we will build them for you.
                  </p>
                </label>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={loadDemoData}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/35 bg-primary/[0.08] px-4 py-3 text-xs font-black text-primary transition-colors hover:bg-primary/[0.14]"
                >
                  <DemoIcon />
                  Load Demo List
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-3 text-xs font-black text-white transition-colors hover:border-red-400/45 hover:text-red-300"
                >
                  <ResetIcon />
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
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-primary">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
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
                <CopyIcon />
                Copy Output
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
              >
                <DownloadIcon />
                Download File
              </button>
            </div>

            {copyStatus && (
              <p className="mt-4 text-sm font-semibold text-emerald-300">{copyStatus}</p>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
                  Rules generated
                </p>
                <p className="mt-2 text-3xl font-black text-white">{readyRows.length}</p>
              </div>
              <div className="rounded-2xl border border-orange-300/20 bg-orange-300/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-100">
                  Needs review
                </p>
                <p className="mt-2 text-3xl font-black text-white">{reviewRows.length}</p>
              </div>
              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">
                  Invalid
                </p>
                <p className="mt-2 text-3xl font-black text-white">{invalidRows.length}</p>
              </div>
            </div>
          </aside>
        </section>

        {rows.length > 0 && (
          <section className="mt-12 rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Validation Results
                </p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  Check Each Pair Before Deployment
                </h2>
              </div>
            </div>

            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                    <th className="px-4 py-2">Old URL</th>
                    <th className="px-4 py-2">New URL</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const style = statusStyles[row.status];
                    return (
                      <tr key={row.id} className="bg-black/20 text-sm text-white/85">
                        <td className="max-w-[240px] break-all rounded-l-xl px-4 py-4 font-mono text-xs text-white/90">
                          {row.rawOld || "missing"}
                        </td>
                        <td className="max-w-[240px] break-all px-4 py-4 font-mono text-xs text-white/90">
                          {row.rawNew || "missing"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${style.className}`}
                          >
                            {style.label}
                          </span>
                        </td>
                        <td className="max-w-[320px] rounded-r-xl px-4 py-4 text-xs leading-relaxed text-white/75">
                          {row.notes.length ? row.notes.join(" ") : "Looks ready for output."}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            How To Use This Tool
          </p>
          <h2 className="mt-3 text-center text-3xl font-black text-white">
            Three Steps To Clean Redirect Rules
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">1</p>
              <h3 className="mt-4 text-xl font-black text-white">Prepare your list</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Export your old URLs from your CMS or a crawler like Screaming Frog, then build a
                two-column spreadsheet: old URL on the left, the closest matching new URL on the
                right. Copy both columns straight into the tool.
              </p>
            </article>
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">2</p>
              <h3 className="mt-4 text-xl font-black text-white">Choose format and generate</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Pick 301 or 302, then choose Apache .htaccess, Nginx, Cloudflare CSV, or plain
                text. The tool escapes regex characters, anchors every rule, and flags duplicates
                and problem rows automatically.
              </p>
            </article>
            <article className="rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-primary">3</p>
              <h3 className="mt-4 text-xl font-black text-white">Deploy and test</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Copy or download the output, back up your current config, and add the rules on
                staging first. Then crawl the old URL list to confirm every URL returns a single
                redirect hop to the right destination.
              </p>
            </article>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            Redirect Guide
          </p>
          <h2 className="mt-3 text-center text-3xl font-black text-white">
            What To Know Before You Redirect At Scale
          </h2>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-white/80">
            <article>
              <h3 className="text-xl font-black text-white">What a 301 redirect is and why it matters</h3>
              <p className="mt-3">
                A 301 redirect is a permanent redirect: a server instruction that says this page has
                moved, go here instead. The browser or crawler requests the old URL, the server
                answers with a 301 status code plus the new address, and the visitor lands on the
                right page automatically. Google transfers the ranking signals from the old URL to
                the new one, which is what protects years of backlink authority and ranking history
                during a migration. A site move without redirects is one of the fastest ways to
                lose organic traffic overnight.
              </p>
            </article>

            <article>
              <h3 className="text-xl font-black text-white">When you need bulk redirects</h3>
              <p className="mt-3">
                Single redirects are easy, since most CMS plugins handle one or two. Bulk redirects
                become necessary when URLs change at scale: website redesigns that rename slugs,
                domain moves from an old brand to a new one, CMS changes like WordPress to
                Shopify, merging two websites, or consolidating thin and outdated pages into
                stronger ones. In every case you end up with a spreadsheet of old and new URLs,
                and this tool turns that spreadsheet into server-ready rules in one step.
              </p>
            </article>

            <article>
              <h3 className="text-xl font-black text-white">Apache .htaccess: use RewriteRule consistently</h3>
              <p className="mt-3">
                Apache offers the simple mod_alias form (Redirect 301 /old-page /new-page) and the
                mod_rewrite form (RewriteRule ^old-page$ /new-page [R=301,L]). If your .htaccess
                already uses RewriteRule, which WordPress and most PHP setups do, keep everything
                in mod_rewrite. Apache processes the two modules in different phases, so mixing
                them for the same URLs can cause rules to conflict in ways that are hard to debug.
                RewriteRule patterns also need care: dots must be escaped and patterns anchored
                with ^ and $, otherwise a rule for old-services also matches old-services-page-2.
                This generator escapes and anchors every rule automatically.
              </p>
            </article>

            <article>
              <h3 className="text-xl font-black text-white">Nginx and Cloudflare formats</h3>
              <p className="mt-3">
                Nginx has no .htaccess. Redirects go in the server block using the return
                directive with an exact location match, which is faster than rewrite rules for
                simple redirects. Always run nginx -t to test syntax before reloading, because one
                bad character in a config can take down every site on that server. If your DNS
                runs through Cloudflare, you can skip the server entirely and manage redirects at
                the edge with a CSV import, which keeps your origin config small even with
                thousands of rules.
              </p>
            </article>

            <article>
              <h3 className="text-xl font-black text-white">Mistakes that hurt SEO</h3>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Redirecting everything to the homepage. Google treats this as a soft 404 and ranking signals are lost. Map each URL to its closest equivalent.",
                  "Creating redirect chains. Old URL to intermediate URL to final URL wastes crawl budget and adds latency. Point every source directly at its final destination.",
                  "Mixing Redirect and RewriteRule in the same file. Pick one module and stay consistent.",
                  "Forgetting to escape regex. An unescaped dot matches any character and can redirect pages you never intended to touch.",
                  "Placing rules below catch-all rules. Default CMS blocks capture requests before your rules ever run, so redirects go near the top.",
                  "Ignoring query strings. Decide deliberately whether parameters should be preserved or dropped.",
                  "Removing redirects too early. Keep migration redirects live for at least a year. External links keep sending traffic to old URLs for years.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <CheckIcon />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h3 className="text-xl font-black text-white">How to test your redirects</h3>
              <p className="mt-3">
                Start small: add the rules to staging, open five to ten old URLs in a browser with
                developer tools open, and confirm you see a single 301 landing on the correct page.
                Then scale up: crawl your full old URL list and verify every one returns exactly
                one redirect hop to the right destination, with no chains, loops, or 404s at the
                end. After launch, watch Google Search Console for 404 spikes and track rankings
                and organic traffic for the affected pages over the next four to six weeks.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Related Free Tools
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Keep Building Your Migration Toolkit
            </h2>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-3">
            <a
              href="/tools/redirect-mapping-generator"
              className="group rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                Redirect Mapping Generator
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Plan the old-to-new URL map first, then generate the server rules here.
              </p>
            </a>
            <a
              href="/tools/xml-sitemap-generator"
              className="group rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                XML Sitemap Generator
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Rebuild your sitemap with the new URLs after a migration goes live.
              </p>
            </a>
            <a
              href="/tools/robots-txt-generator"
              className="group rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">
                Robots.txt Generator
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Make sure crawlers can reach your new URL structure after the move.
              </p>
            </a>
          </div>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Bulk Redirect FAQs
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
                  <ChevronIcon />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/80">{faq.answer}</p>
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
                Protect Your Rankings During a Website Move
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Redirect rules are only one migration task. A safe move also needs redirect
                mapping, crawlability review, canonical handling, internal link updates, sitemap
                review, and careful post-launch monitoring.
              </p>
            </div>
            <a
              href="/strategy-call"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02]"
            >
              Request a Free SEO Check
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            <a
              href="/business-seo"
              className="group rounded-2xl border border-white/[0.1] bg-black/25 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">Business SEO</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Technical SEO audits, migration planning, and redirect strategy for business sites.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore Business SEO
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>
            <a
              href="/ecommerce-seo"
              className="group rounded-2xl border border-white/[0.1] bg-black/25 p-5 transition-all hover:border-primary/45 hover:bg-primary/[0.05]"
            >
              <h3 className="text-lg font-black text-white group-hover:text-primary">eCommerce SEO</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Platform migrations, URL restructuring, and technical SEO for online stores.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Explore eCommerce SEO
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>
          </div>
        </section>
      <BulkRedirectGeneratorArticle />
      </div>
    </main>
  );
}

/* ==================== SEO ARTICLE ==================== */
function BulkRedirectGeneratorArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Migration Scenarios</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">When a Bulk 301 Redirect Is the Right Move</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Most redirect jobs start with a spreadsheet and a deadline. A redesign renames fifty URLs overnight. A rebrand
            moves every page to a new domain. Two blogs merge into one. HTTP gives way to HTTPS site-wide. The
            old addresses do not vanish: backlinks point to them, bookmarks reference them, and the index still lists
            them. A bulk 301 redirect moves all that value to the new addresses in one controlled operation.
          </p>
          <p>
            The domain move is the classic case. When an old brand domain becomes a new one, every product, category, and blog
            page needs a forwarding address. That is realistic for ten pages and miserable for ten thousand, which is why bulk
            generation exists: one old URL per line, one new URL per line, and the tool writes every rule in your server's
            syntax.
          </p>
          <p>
            Redesigns and CMS migrations are the second big trigger. Moving from WordPress to Shopify, or from a legacy CMS to
            anything modern, almost always changes URL patterns. Date-based blog URLs like /blog/2019/05/my-post become
            /blog/my-post. Product URLs lose their .html endings. Category paths get flattened. A bulk 301 redirect generator
            turns the whole mapping into server-ready code in seconds.
          </p>
          <p>
            Then there are the quieter jobs that still deserve bulk treatment. Merging thin pages into one strong page.
            Cleaning up trailing-slash inconsistencies. Consolidating www and non-www onto one canonical host. Retiring a
            campaign microsite whose pages now live on the main domain. Each unhandled one leaks a little traffic and
            authority, and together they add up.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>A redesign, rebrand, or domain change that alters URL patterns.</li>
            <li>A CMS migration that renames paths or removes file extensions.</li>
            <li>Search Console 404s for URLs that already have replacements.</li>
                      </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Status Codes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">301 vs 302: Picking the Right Status Code for Each Job</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The difference between a 301 and a 302 is intent. A 301 says this page has moved permanently, so update your
            records. A 302 says this move is temporary, so keep the old address on file. Browsers cache 301 responses
            aggressively and search engines transfer ranking signals to the new URL. With a 302, search engines keep ranking
            the old URL because they expect it to come back.
          </p>
          <p>
            For bulk redirect work, 301 is the default in the vast majority of cases. Migrations, redesigns, domain moves,
            deleted pages with replacements, HTTP to HTTPS upgrades: all permanent, all 301. If you are generating hundreds
            of rules for a site move, you almost certainly want every one of them to be a 301.
          </p>
          <p>
            The 302 has its place, and it is always short term. Splitting traffic for an A/B test. Sending visitors to a
            temporary promo page during a sale. Routing around a page that is down for maintenance. In each case the old URL
            is coming back, so you do not want search engines to forget it or pass its signals away.
          </p>
          <p>
            The expensive mistake is choosing wrong by accident. In Apache mod_rewrite, a bare [R] flag with no number means
            302, not 301. Plenty of migrations shipped with [R,L] everywhere while rankings never transferred. Always write [R=301,L] explicitly
            for permanent moves instead of trusting memory across hundreds of lines.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Permanent change, redesign, domain move, or deleted page with a replacement: use 301.</li>
            <li>A/B test, temporary promo, or maintenance page: use 302.</li>
            <li>Unsure but the change is meant to last: start with 301.</li>
                      </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Apache Syntax</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Writing htaccess Redirects That Do Not Break Your Site</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A single misplaced character in .htaccess can take down an entire site with a 500 error, which is why generated
            rules beat hand-written ones. But even generated rules need to land in the right spot. Understanding the syntax of
            a redirect url in htaccess helps you spot problems before they go live.
          </p>
          <p>
            Apache offers two ways to write htaccess redirects. The mod_alias way is the plain Redirect directive: Redirect
            301 /old-page https://example.com/new-page. The mod_rewrite way is a RewriteRule: RewriteRule ^old-page$
            https://example.com/new-page [R=301,L]. The practical rule: if your .htaccess already uses RewriteRule, which
            WordPress and most PHP setups do, keep everything in mod_rewrite. Mixing the two modules means they process the
            same request independently, and rules can override each other in confusing ways.
          </p>
          <p>
            RewriteRule patterns are regular expressions, and that is where hand-written rules go wrong. Dots must be
            escaped, so page.html becomes page\.html, otherwise the dot matches any character. Anchors matter: ^old-page$
            matches exactly that path, while an unanchored old-page would also match /old-page-2. A generator handles the
            escaping and anchoring for you.
          </p>
          <p>
            Where to put redirect in .htaccess matters as much as syntax. Paste rules near the top, after RewriteEngine On and
            before catch-all rules like the WordPress block. Apache reads top to bottom, and an earlier catch-all will swallow
            requests before your redirects see them. Within your redirect block, put specific rules above general ones.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Back up the current .htaccess before touching anything.</li>
            <li>Use one module style for every rule, never a mix of Redirect and RewriteRule.</li>
            <li>Escape dots and special regex characters in every pattern.</li>
                      </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Nginx and Cloudflare</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Nginx and Cloudflare: Same Redirect Map, Different Syntax</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Not every site runs Apache. On Nginx there is no .htaccess: redirects live in the server block, and the syntax
            differs. The simplest form is return 301 https://example.com/new-page; inside a location block matching the old
            path. For pattern-based redirects, Nginx uses rewrite ^/old-page$ https://example.com/new-page permanent; where
            the word permanent is what makes the response a 301.
          </p>
          <p>
            The placement logic rhymes with Apache even though the syntax differs. Nginx evaluates location blocks by
            specificity, so exact matches beat prefix matches. As with .htaccess, generated rules save you from regex typos,
            but you still need to reload Nginx after editing the config, and you still want a backup of the working
            configuration first.
          </p>
          <p>
            Cloudflare users get a third option needing no server access. Cloudflare Bulk Redirects accept a CSV upload with
            source URL, target URL, status code, and options like preserving the query string. The redirects run at the edge
            before traffic reaches your origin. For teams without server access, or a domain with no hosting attached, this is
            often the cleanest path.
          </p>
          <p>
            Decide upfront whether query strings should carry over. A redirect from /product?id=123 to /products/123 that
            silently drops the query string can break tracking and pagination. Cloudflare's import lets you set query-string
            preservation per rule; in Apache and Nginx you control it with flags. Keep the choice consistent across the whole
            list.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Apache shared hosting or VPS: use the .htaccess output format.</li>
            <li>Nginx server: use the server-block return or rewrite output format.</li>
            <li>No server access, or a parked domain: use the Cloudflare CSV output.</li>
                      </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Chains and Loops</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Redirect Chains, Loops, and Other Silent Killers</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A redirect chain is a relay race nobody asked for: /a redirects to /b, and /b redirects to /c. Each hop adds
            latency and forces crawlers to spend extra budget. Chains appear when a migration map is built from current URLs
            without checking whether those URLs already redirect elsewhere. The fix: point every old URL directly at its
            final destination.
          </p>
          <p>
            Loops are chains that bite their own tail. The classic version is a trailing-slash fight: one rule strips
            trailing slashes while the server adds them back to real directories, and the browser spins until it reports too
            many redirects. Another is two rules pointing at each other, or a www-to-non-www rule fighting an opposite rule
            written months earlier. Test folder URLs and both www variants specifically.
          </p>
          <p>
            Duplicates are the quieter problem. The same old URL appearing twice with different destinations means one rule
            silently wins and the other never runs. Case differences like /About versus /about can create two rules for what
            the server treats as one path. Normalizing case and de-duplicating before generating output prevents a category
            of mystery behavior that is painful to debug live.
          </p>
          <p>
            Query strings deserve their own check. Tracking parameters like utm_source can make one page look like dozens of
            URLs in an analytics export. Building your map from raw analytics data without normalizing parameters produces
            hundreds of redundant rules. Settle the query-string policy first, then build the map.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Map every old URL straight to its final destination: exactly one hop.</li>
            <li>Confirm no destination URL is also a source elsewhere in the list.</li>
            <li>Test trailing-slash behavior and both www variants after deploying.</li>
                      </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Testing and Monitoring</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Testing Your Redirects Before and After Launch</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Never trust a redirect list you have not tested. Start small: pick old URLs covering each pattern in your map and
            check them with curl -I https://example.com/old-page. You want a 301 Moved Permanently status and a Location
            header pointing at the right new URL. Then open that new URL and confirm it returns 200, not another redirect.
          </p>
          <p>
            For the full list, spot checks are not enough. Run old URLs through a crawler in list mode: tools like Screaming
            Frog accept a URL list and report the status code and target for each one. Every old URL should return exactly
            one 301 or 302 and land on the intended destination, with no chains or loops. Fix failures in the map,
            regenerate, and re-test until the list is clean.
          </p>
          <p>
            The work is not done at launch. Watch the Search Console Pages report for 404 spikes after a migration: each
            unexpected 404 is an old URL you missed and earns a new rule. Submit the new sitemap so engines discover the new
            addresses faster, and check Performance to confirm traffic is flowing to them.
          </p>
          <p>
            Finally, resist the urge to clean up too soon. Keep redirect rules in place for at least a year, ideally
            permanently. Other sites keep linking to your old URLs, bookmarks never update, and email archives are full of
            ancient links. Removing redirects early quietly throws away traffic you already paid for with the migration
            effort.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Sample URLs return a single correct 301 when checked with curl.</li>
            <li>The full old-URL list is crawled: no chains, no loops, no 404s.</li>
            <li>The new sitemap is submitted in Search Console.</li>
                      </ul>
        </div>
      </section>
    </>
  );
}
