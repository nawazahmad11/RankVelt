import { useState } from "react";
import { Check, Copy, ExternalLink, Loader2, Search, Trash2 } from "lucide-react";

type ScrapedResult = {
  website: string;
  guestPostUrl: string | null;
  emails: string[];
  status: "found" | "not_found" | "error";
  message?: string;
};

const CONCURRENCY_LIMIT = 3; // Process 3 websites at a time

const GuestPostFinder = () => {
  const [urlsInput, setUrlsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapedResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const fetchSingleWebsite = async (siteUrl: string): Promise<ScrapedResult> => {
    try {
      const response = await fetch("/api/find-guest-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: siteUrl }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      return (
        data.result || {
          website: siteUrl,
          guestPostUrl: null,
          emails: [],
          status: "error",
          message: "Empty response",
        }
      );
    } catch (err: any) {
      return {
        website: siteUrl,
        guestPostUrl: null,
        emails: [],
        status: "error",
        message: err.message || "Failed request",
      };
    }
  };

  const handleScan = async () => {
    setErrorMessage("");
    const urls = urlsInput
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      setErrorMessage("Please enter at least one website URL.");
      return;
    }

    setIsLoading(true);
    setResults([]);
    setProgress({ current: 0, total: urls.length });

    const queue = [...urls];
    let completedCount = 0;

    // Worker pool processor
    const worker = async () => {
      while (queue.length > 0) {
        const siteUrl = queue.shift();
        if (!siteUrl) break;

        const res = await fetchSingleWebsite(siteUrl);
        setResults((prev) => [...prev, res]);

        completedCount++;
        setProgress({ current: completedCount, total: urls.length });
      }
    };

    // Run parallel workers based on CONCURRENCY_LIMIT
    const workers = Array.from(
      { length: Math.min(CONCURRENCY_LIMIT, urls.length) },
      () => worker()
    );

    await Promise.all(workers);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setUrlsInput("");
    setResults([]);
    setErrorMessage("");
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <Search size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">Find Guest Post Pages & Emails</h3>
          <p className="text-xs text-white/60">
            Batch-scan 100+ websites in parallel to discover Write-For-Us pages & contacts.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={urlsInput}
          onChange={(e) => setUrlsInput(e.target.value)}
          placeholder="https://example.com&#10;https://another-blog.com&#10;https://fashion-blog.com"
          rows={6}
          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-white placeholder-white/30 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {errorMessage && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Progress Tracker Bar */}
        {isLoading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-white/70">
              <span>Scanning queue...</span>
              <span>
                {progress.current} / {progress.total} Done (
                {Math.round((progress.current / progress.total) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleScan}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-black text-black transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing Queue ({progress.current}/{progress.total})
              </>
            ) : (
              <>
                <Search size={16} />
                Find Write For Us Pages
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-xs font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <Trash2 size={15} />
            Clear
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Guest Post Page</th>
                <th className="px-4 py-3">Found Emails</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {results.map((res, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-4 font-medium text-white">{res.website}</td>
                  <td className="px-4 py-4">
                    {res.status === "found" && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                        Found
                      </span>
                    )}
                    {res.status === "not_found" && (
                      <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-1 text-[10px] font-bold text-yellow-400">
                        Not Found
                      </span>
                    )}
                    {res.status === "error" && (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-400">
                        {res.message || "Error"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {res.guestPostUrl ? (
                      <a
                        href={res.guestPostUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        View Page <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {res.emails.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {res.emails.map((email, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-white/30">No emails</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {res.emails.length > 0 && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(res.emails.join(", "), i)}
                        className="text-white/60 transition-colors hover:text-primary"
                        title="Copy Emails"
                      >
                        {copiedIndex === i ? (
                          <Check size={16} className="text-emerald-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GuestPostFinder;