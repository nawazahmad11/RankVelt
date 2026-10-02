// RankVelt tool page: Bulk HTTP Status Checker (100% free, server-side checks via /api/check-urls)
// Place at: src/pages/tools/BulkHttpStatusChecker.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).

import { useEffect, useRef, useState } from "react";

const MAX_URLS = 100;
const BATCH_SIZE = 10;

interface ChainHop {
  url: string;
  status: number;
}

interface CheckResult {
  input: string;
  status: number | null;
  finalUrl: string;
  chain: ChainHop[];
  ms: number;
  error: string | null;
}

type StatusFilter = "all" | "2xx" | "3xx" | "4xx" | "5xx" | "errors";

const HTTP_STATUS_FAQS = [
  {
    q: "What do the HTTP status code families mean?",
    a: "Every response falls into one of five families. 1xx is informational and rarely seen in practice. 2xx means success, and 200 OK is the code you want on live pages. 3xx means redirection, such as a 301 permanent move or a 302 temporary move. 4xx means the request failed on the client side, most often a 404 for a missing page or a 403 for a blocked request. 5xx means the server itself failed, such as a 500 error or a 503 while overloaded. On a healthy site, most important URLs end at a 200 after at most one redirect.",
  },
  {
    q: "How many redirects in a chain are too many?",
    a: "One redirect is normal, for example http to https or the non-www to www version of your domain. Two is usually harmless. Beyond that, every extra hop is another round trip for visitors and crawlers, and very long chains risk being abandoned before the final page ever loads. Treat any chain of three or more hops as something to flatten: open the chain, find the final URL, and point the first URL straight at it.",
  },
  {
    q: "Does this checker use HEAD or GET requests?",
    a: "The checker tries a HEAD request first because it is fast and light: it asks for the status and headers without downloading the page body. Some servers dislike HEAD and answer with a 405 or a misleading status, so whenever a HEAD result looks wrong the checker falls back to a normal GET request. Either way, you see the final status code and every redirect hop in between.",
  },
  {
    q: "Why does a page load fine in my browser but show an error here?",
    a: "The check runs from RankVelt servers, not from your browser, so you are seeing what a server sees. Some websites block automated or data center traffic with a firewall, answer 403 to anything that does not look like a real browser, rate limit by IP address, or show different results by country. An error or 403 here does not prove the page is broken for visitors, but it is worth confirming the odd ones by hand, because crawlers can hit the same walls.",
  },
  {
    q: "What is a soft 404, and how do I spot one?",
    a: "A soft 404 is a missing page that returns a 200 status instead of a real 404. The visitor sees a friendly not found message, but the status code tells search engines the page exists and is fine. In this checker a soft 404 looks like a normal green 200, so the giveaway is in your URL list: run the URLs of deleted products or old posts and check which ones answer 200 when they should not exist anymore. The fix is to return a genuine 404 or 410 for removed pages, or redirect them to a real replacement.",
  },
  {
    q: "How do I fix a redirect chain?",
    a: "Start in the results table. Note the final URL at the end of the chain, then go to wherever the first redirect is configured (your .htaccess, server config, redirect plugin, or CDN rules) and change it so the first URL points directly at that final destination. Repeat for every chain the checker flags. Update internal links to use final URLs too, so your own site stops depending on redirects. Finally, paste the same list back into this tool and confirm everything now takes a single hop.",
  },
  {
    q: "Is the response time in the results the same as page speed?",
    a: "No. The milliseconds shown here measure one thing only: how long the server took to start responding to a single request from our server location. It does not include downloading images, running scripts, or rendering the page. A consistently slow response time is still useful evidence because it points at hosting or server configuration problems, but for real visitor experience you need a dedicated page speed test that loads the full page.",
  },
  {
    q: "How many URLs can I check in one run?",
    a: "Up to 100 URLs per run, one per line. The tool adds https:// automatically when a line has no protocol, skips blank lines, and removes duplicates so each unique URL is checked once. For bigger audits, split the list by site section, for example all blog posts in one run and all product pages in the next, so each result set stays small enough to act on.",
  },
];

const inputCls =
  "mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/55";

const labelCls =
  "text-[10px] font-black uppercase tracking-[0.18em] text-white/75";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function parseUrls(raw: string): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  raw.split("\n").forEach((line) => {
    const normalized = normalizeUrl(line);
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    urls.push(normalized);
  });
  return urls.slice(0, MAX_URLS);
}

function statusFamily(status: number | null): Exclude<StatusFilter, "all" | "errors"> | null {
  if (status === null) return null;
  if (status >= 200 && status < 300) return "2xx";
  if (status >= 300 && status < 400) return "3xx";
  if (status >= 400 && status < 500) return "4xx";
  if (status >= 500 && status < 600) return "5xx";
  return null;
}

function isErrorResult(result: CheckResult): boolean {
  return result.status === null || result.error !== null;
}

function redirectCount(result: CheckResult): number {
  if (!result.chain || result.chain.length === 0) return 0;
  return Math.max(0, result.chain.length - 1);
}

function badgeClass(result: CheckResult): string {
  if (isErrorResult(result)) {
    return "border-white/15 bg-white/[0.06] text-white/60";
  }
  const family = statusFamily(result.status);
  if (family === "2xx") return "border-emerald-400/25 bg-emerald-400/[0.1] text-emerald-200";
  if (family === "3xx") return "border-amber-300/25 bg-amber-300/[0.1] text-amber-100";
  if (family === "4xx") return "border-red-400/25 bg-red-400/[0.1] text-red-200";
  if (family === "5xx") return "border-red-800/40 bg-red-950/60 text-red-300";
  return "border-white/15 bg-white/[0.06] text-white/60";
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

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

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

export default function BulkHttpStatusChecker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<CheckResult[]>([]);
  const [running, setRunning] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [statusMessage, setStatusMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const stopRequested = useRef(false);

  // FAQPage JSON-LD built from the same FAQ array rendered below.
  useEffect(() => {
    document.getElementById("rankvelt-http-status-schema")?.remove();
    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-http-status-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: HTTP_STATUS_FAQS.map((faq) => ({
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

  const counts = {
    "2xx": results.filter((r) => statusFamily(r.status) === "2xx" && !isErrorResult(r)).length,
    "3xx": results.filter((r) => statusFamily(r.status) === "3xx" && !isErrorResult(r)).length,
    "4xx": results.filter((r) => statusFamily(r.status) === "4xx" && !isErrorResult(r)).length,
    "5xx": results.filter((r) => statusFamily(r.status) === "5xx" && !isErrorResult(r)).length,
    errors: results.filter((r) => isErrorResult(r)).length,
  };

  const filteredResults = results.filter((r) => {
    if (filter === "all") return true;
    if (filter === "errors") return isErrorResult(r);
    return statusFamily(r.status) === filter && !isErrorResult(r);
  });

  const runCheck = async () => {
    const urls = parseUrls(input);
    if (urls.length === 0) {
      setStatusMessage("Paste at least one URL above, then run the check.");
      return;
    }
    stopRequested.current = false;
    setRunning(true);
    setResults([]);
    setFilter("all");
    setCheckedCount(0);
    setTotalCount(urls.length);
    setStatusMessage("");

    const collected: CheckResult[] = [];
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      if (stopRequested.current) break;
      const batch = urls.slice(i, i + BATCH_SIZE);
      let batchResults: CheckResult[];
      try {
        const response = await fetch("/api/check-urls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: batch }),
        });
        const data = await response.json();
        if (!response.ok || !data || data.ok !== true || !Array.isArray(data.results)) {
          throw new Error("Unexpected response");
        }
        batchResults = data.results as CheckResult[];
      } catch {
        batchResults = batch.map((url) => ({
          input: url,
          status: null,
          finalUrl: url,
          chain: [],
          ms: 0,
          error: "The check request failed. Please try again.",
        }));
      }
      collected.push(...batchResults);
      setResults([...collected]);
      setCheckedCount(collected.length);
    }

    if (stopRequested.current) {
      setStatusMessage(
        `Check stopped. ${collected.length} of ${urls.length} URLs were checked.`,
      );
    } else {
      setStatusMessage(`Finished. ${collected.length} URLs checked.`);
    }
    setRunning(false);
  };

  const stopCheck = () => {
    stopRequested.current = true;
  };

  const handleClear = () => {
    setInput("");
    setResults([]);
    setCheckedCount(0);
    setTotalCount(0);
    setFilter("all");
    setStatusMessage("");
  };

  const handleCopyResults = async () => {
    if (results.length === 0) return;
    const lines = ["URL\tStatus\tFinal URL\tRedirects\tResponse (ms)\tError"];
    results.forEach((r) => {
      lines.push(
        [
          r.input,
          r.status !== null ? String(r.status) : "Error",
          r.finalUrl,
          String(redirectCount(r)),
          String(r.ms),
          r.error ?? "",
        ].join("\t"),
      );
    });
    try {
      await copyToClipboard(lines.join("\n"));
      setStatusMessage("Results copied. Paste them straight into a spreadsheet.");
      window.setTimeout(() => setStatusMessage(""), 2600);
    } catch {
      setStatusMessage("Copy failed. Please select the table and copy it manually.");
    }
  };

  const handleDownloadCsv = () => {
    if (results.length === 0) return;
    const lines = ["URL,Status,Final URL,Redirects,Response (ms),Error"];
    results.forEach((r) => {
      lines.push(
        [
          escapeCsvCell(r.input),
          escapeCsvCell(r.status !== null ? String(r.status) : "Error"),
          escapeCsvCell(r.finalUrl),
          escapeCsvCell(String(redirectCount(r))),
          escapeCsvCell(String(r.ms)),
          escapeCsvCell(r.error ?? ""),
        ].join(","),
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "rankvelt-http-status-results.csv";
    link.click();
    URL.revokeObjectURL(objectUrl);
    setStatusMessage("CSV downloaded.");
    window.setTimeout(() => setStatusMessage(""), 2600);
  };

  const filterButtons: Array<{ key: StatusFilter; label: string; count: number }> = [
    { key: "all", label: "All", count: results.length },
    { key: "2xx", label: "2xx", count: counts["2xx"] },
    { key: "3xx", label: "3xx", count: counts["3xx"] },
    { key: "4xx", label: "4xx", count: counts["4xx"] },
    { key: "5xx", label: "5xx", count: counts["5xx"] },
    { key: "errors", label: "Errors", count: counts.errors },
  ];

  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

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
            Bulk HTTP Status <span className="text-gradient-gold">Checker</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
            Paste up to 100 URLs and see the exact HTTP status code, the full redirect
            chain, and the server response time for every one of them. Find broken pages,
            redirect chains, and server errors before your visitors and crawlers do.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-5xl">
          <article className="rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <div>
                <h2 className="text-2xl font-black text-white">Add Your URLs</h2>
                <p className="mt-1 text-sm text-white/75">
                  One URL per line. The protocol is optional, https:// is added for you.
                </p>
              </div>
            </div>

            <label className="mt-7 block">
              <span className={labelCls}>URLs to check (up to 100)</span>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={10}
                placeholder={"example.com/old-page\nhttps://example.com/blog/seo-guide\nwww.example.com/products/blue-widget"}
                spellCheck={false}
                disabled={running}
                className={`${inputCls} resize-y font-mono disabled:opacity-60`}
              />
            </label>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={runCheck}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {running ? "Checking..." : "Check Status Codes"}
              </button>
              {running && (
                <button
                  type="button"
                  onClick={stopCheck}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-400/[0.08] px-5 py-3 text-xs font-black text-red-200 transition-colors hover:bg-red-400/[0.16]"
                >
                  Stop
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-black text-white transition-colors hover:border-red-400/45 hover:text-red-300 disabled:opacity-50"
              >
                <ResetIcon />
                Clear
              </button>
            </div>

            {running && (
              <div className="mt-6">
                <div className="flex items-center justify-between gap-4 text-xs font-bold text-white/70">
                  <span>
                    Checked {checkedCount} of {totalCount}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {statusMessage && (
              <p className="mt-4 text-sm font-semibold text-emerald-300">{statusMessage}</p>
            )}

            <p className="mt-5 text-xs leading-relaxed text-white/50">
              Checks run from RankVelt servers, so results show what a server sees, not your
              browser. Some websites block automated requests and may answer 403 or an error
              even though they load fine for visitors.
            </p>
          </article>
        </section>

        {results.length > 0 && (
          <section className="mx-auto mt-12 max-w-5xl rounded-[2rem] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Results Summary
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">2xx OK</p>
                <p className="mt-2 text-3xl font-black text-white">{counts["2xx"]}</p>
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-100">3xx Redirects</p>
                <p className="mt-2 text-3xl font-black text-white">{counts["3xx"]}</p>
              </div>
              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">4xx Client errors</p>
                <p className="mt-2 text-3xl font-black text-white">{counts["4xx"]}</p>
              </div>
              <div className="rounded-2xl border border-red-800/30 bg-red-950/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-300">5xx Server errors</p>
                <p className="mt-2 text-3xl font-black text-white">{counts["5xx"]}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">Errors</p>
                <p className="mt-2 text-3xl font-black text-white">{counts.errors}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => setFilter(btn.key)}
                    className={`rounded-full border px-4 py-2 text-[11px] font-black transition-colors ${
                      filter === btn.key
                        ? "border-primary/50 bg-primary/[0.12] text-primary"
                        : "border-white/15 bg-black/20 text-white/70 hover:border-primary/35 hover:text-white"
                    }`}
                  >
                    {btn.label} ({btn.count})
                  </button>
                ))}
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyResults}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-[11px] font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
                >
                  <CopyIcon />
                  Copy Results
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-[11px] font-black text-white transition-colors hover:border-primary/45 hover:text-primary"
                >
                  <DownloadIcon />
                  Download CSV
                </button>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[880px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                    <th className="px-4 py-2">URL</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Final URL</th>
                    <th className="px-4 py-2">Redirects</th>
                    <th className="px-4 py-2">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((r, index) => {
                    const redirects = redirectCount(r);
                    return (
                      <tr key={`${r.input}-${index}`} className="bg-black/20 text-sm text-white/85">
                        <td className="max-w-[260px] break-all rounded-l-xl px-4 py-4 font-mono text-xs text-white/90">
                          {r.input}
                          {r.error && (
                            <span className="mt-1 block font-sans text-[11px] font-semibold text-red-300">
                              {r.error}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${badgeClass(r)}`}
                          >
                            {r.status !== null ? r.status : "Error"}
                          </span>
                        </td>
                        <td className="max-w-[260px] break-all px-4 py-4 font-mono text-xs text-white/90">
                          {r.finalUrl && r.finalUrl !== r.input ? (
                            <>
                              {r.finalUrl}
                              {redirects > 0 && r.chain && (
                                <span className="mt-1 block font-sans text-[11px] font-semibold text-white/45">
                                  Chain: {r.chain.map((hop) => hop.status).join(" → ")}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="font-sans text-xs text-white/35">Same as input</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-xs font-bold text-white/80">{redirects}</td>
                        <td className="rounded-r-xl px-4 py-4 text-xs font-bold text-white/80">
                          {r.ms} ms
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredResults.length === 0 && (
              <p className="mt-4 text-sm text-white/60">
                No URLs match this filter. Try a different status group above.
              </p>
            )}
          </section>
        )}

        <BulkHttpStatusCheckerArticle />

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {HTTP_STATUS_FAQS.map((f, i) => (
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
                { href: "/tools/bulk-redirect-generator", name: "Bulk Redirect Generator" },
                { href: "/tools/robots-txt-generator", name: "Robots.txt Generator" },
                { href: "/tools/title-tag-preview", name: "Title Tag Preview" },
                { href: "/tools/xml-sitemap-generator", name: "XML Sitemap Generator" },
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
            <h2 className="text-2xl font-black text-white">Status Problems Are Usually Just the Start</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Redirect chains and broken pages are symptoms of a wider technical picture.
              Get a free SEO audit and RankVelt will map the crawl, indexation, and site
              structure issues behind them, then fix the worst ones first.
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
function BulkHttpStatusCheckerArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">HOW IT WORKS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What a Bulk URL Checker Actually Shows You</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Every time a browser or a crawler asks a server for a URL, the server answers with a short numeric code before it sends any content. That code is the server verdict: 200 means here is the page, 301 means it moved permanently, 404 means it is not here. A bulk URL checker sends those requests for a whole list at once and records the code, the redirect path, and the response time for each line.</p>
          <p>This matters because your browser hides almost all of it. You see a finished page, or a friendly error screen, and everything in between stays invisible. An HTTP status code checker shows you the machinery underneath: that the page you just opened quietly took two redirects to get there, or that a deleted product is cheerfully returning a 200 code and pretending to exist.</p>
          <p>Each result in the table above gives you four facts worth acting on: the status code the URL finally settled on, the final destination after any redirects, how many hops the journey took, and how long the server needed to respond. Read together, those four facts tell you whether your URL structure is clean or quietly leaking crawl budget and link value.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">RUNNING A CHECK</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to Check HTTP Status for a Whole List at Once</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Start by exporting the URLs you care about from whatever tool already has them: a Screaming Frog crawl, the Pages report in Google Search Console, your XML sitemap, or a spreadsheet of landing pages. Paste them into the box above, one per line. You can paste bare domains and paths without a protocol, because the tool adds https:// automatically, skips blank lines, and removes duplicates before anything runs.</p>
          <p>The check then contacts each URL from RankVelt servers in small batches and fills the table in as results arrive. Read the summary chips first. On a healthy site they are mostly green 2xx with a handful of amber 3xx for legitimate moves. Then use the filters and work in a sensible order:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Look at 5xx errors first, since a failing server can block crawling entirely</li>
            <li>Fix 4xx responses next, especially 404s that still have internal links pointing at them</li>
            <li>Open the 3xx results and hunt for rows with two or more redirects in the chain</li>
            <li>Save the odd error rows for last and verify them manually in your browser</li>
          </ul>
          <p>That last point matters. Because the requests come from a server rather than your browser, a site that blocks automated traffic can answer 403 or refuse the connection even though it loads perfectly for visitors. Treat those rows as questions to verify by hand, not as verdicts.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">REDIRECT CHAINS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Debugging a Redirect Chain After a Migration</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Redirect chains are usually born during migrations. Your redirect map pointed the old blog URL to its new address, correctly. Then the platform migration added an https hop. Then the www consolidation rule added another. None of these rules is wrong on its own, but stacked together, an old bookmark now takes three redirects before it reaches a page, and every hop is a chance for a crawler to give up or for link signals to dilute.</p>
          <p>The fix is mechanical once you can see the chain. Export the old URL list from your migration map and paste it into this redirect chain checker. Sort your attention by the Redirects column and open the rows with the highest numbers. The chain readout shows you the exact hop sequence, so you can see whether the extra steps are protocol hops (http to https), host hops (non-www to www), or genuinely stale rules left over from a previous redesign.</p>
          <p>Then rewrite the first rule so the original URL points straight at the final destination the chain ends on. Repeat for every flagged row, update internal links to use the final URLs as well, and run the same list through the checker again. When every old URL takes exactly one hop, the migration map is actually doing the job it was written for.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">SILENT SEO PROBLEMS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Status Codes That Quietly Cost You Rankings</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Most status problems do not look like problems. The page loads, the design looks right, nobody complains. The damage happens in the gap between what visitors see and what the status code tells search engines. Three patterns cause most of the harm:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li><strong className="text-white">The 200 that should be a 404.</strong> A discontinued product or deleted post shows a polite not found message but returns a success code. Search engines keep the empty page indexed and keep sending crawlers back to it. Run your retired URLs through this checker: every green 200 on a page that no longer exists is a soft 404 to fix.</li>
            <li><strong className="text-white">The 302 that never grew up.</strong> Temporary redirects are the right tool for a weekend promo. Left in place for two years after a permanent redesign, they tell crawlers the move might be reversed, and consolidation onto the new URL stays weaker than it should be. Convert long-lived 302s to 301s.</li>
            <li><strong className="text-white">The 404 with internal links.</strong> A removed page is only half a problem. If your navigation, footer, or old blog posts still link to it, you are spending crawl budget on a dead end and sending visitors to an error. A bulk check of your own internal URL list surfaces these before a site audit does.</li>
          </ul>
          <p>Server errors belong on the same list. A page that answers 500 or 503 during the hours a crawler visits can drop out of the index even though it works fine when you check it at your desk. That timing mismatch is exactly why a server-side check at a different hour is worth running.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">BEFORE AND AFTER LAUNCH</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Checking URLs Before and After a Site Launch</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A status checker earns its keep twice in any launch: once on staging and once on the live site. Before launch, build a list of your new site's key templates (homepage, main service pages, a sample of products or posts, contact and checkout pages) and run them against the staging address. Every template should answer a direct 200. Anything redirecting on staging will still be redirecting after launch, only now with real traffic flowing through it.</p>
          <p>On launch day, run two lists back to back. The first is your money list: the live URLs that drive revenue and rankings, which should all return 200. The second is the old URL list from your redirect map, where every line should take exactly one 301 hop to its intended replacement. Download both result sets as CSV and keep them. That file is your launch baseline, the proof of what the site looked like on day one.</p>
          <p>A week or two later, compare that baseline with what Google Search Console reports under its Pages indexing data. URLs Google lists as redirected should match the single-hop rows you already verified, and anything newly reported as not found can be checked here in seconds to decide whether it is a real problem or an old URL nobody should care about.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">MONITORING</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Keep a Watchlist of the Pages That Make You Money</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>Status codes are not set and forget. Plugin updates add redirects, retired products start returning 404, hosting changes introduce new server rules, and a page that was a clean 200 in March can be a three-hop chain by June without anyone touching it on purpose. The sites that avoid nasty surprises are the ones that recheck on a schedule instead of waiting for traffic to dip.</p>
          <p>Build a simple watchlist spreadsheet with the URLs that actually matter: your highest revenue landing pages, the pages bringing in the most organic traffic, and the pages with the most external links pointing at them. Ten to fifty URLs is enough for most sites. Paste the list into this HTTP status checker once a month, and again after any migration, redesign, or hosting change, then export the CSV.</p>
          <p>Compare the new export with last month's. You are looking for three kinds of change: a 200 that became a redirect, a redirect that became a chain, and anything new in the 4xx or 5xx groups. Each one is a small fix today and a ranking problem if it sits for a quarter. This ten minute habit is the cheapest technical SEO insurance a site can have.</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">READING RESULTS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to Read a Result Like an SEO</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>A healthy result set has a boring shape: most rows are a direct 200, a few are a single 301 into a 200, and the error groups are empty. Once you know that shape, the anomalies stand out on their own. A row whose chain hops through http, then www, then https is usually a server that applies its rules in separate steps; consolidate them into one redirect at the server level and every URL on the site gets faster at once.</p>
          <p>Other patterns are worth memorizing. A redirect that lands on the homepage for a deleted page is a soft 404 risk wearing a 301 costume. A 302 where the move is clearly permanent weakens consolidation. Mixed results inside one template, where most product pages answer 200 but a few answer 500, usually means a data problem on those specific pages rather than a server-wide fault, and it will not fix itself.</p>
          <p>Use the response time column as a smoke alarm rather than a diagnosis. It measures only how fast the server starts answering, but a URL that is consistently far slower than its neighbors on the same site is pointing at something real. Act in priority order: clear 5xx errors first, then linked 404s, then chains, and keep the exported CSV so the next check has something to be compared against.</p>
        </div>
      </section>
    </>
  );
}
