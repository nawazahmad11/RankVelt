import {
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
  } from "react";
  import {
    AlertTriangle,
    CheckCircle2,
    Clipboard,
    Download,
    FileText,
    Filter,
    MailCheck,
    ShieldCheck,
    Trash2,
    Upload,
  } from "lucide-react";
  
  type EmailStatus =
    | "likely_deliverable"
    | "invalid_format"
    | "duplicate"
    | "disposable"
    | "role_based"
    | "domain_or_mx_missing"
    | "needs_review";
  
  type EmailResult = {
    email: string;
    status: EmailStatus;
    reason: string;
    action: "Keep" | "Review" | "Remove";
    suggestion?: string;
  };
  
  type ApiResponse = {
    results: EmailResult[];
    checked: number;
    summary: {
      keep: number;
      review: number;
      remove: number;
    };
  };
  
  const STATUS_CONFIG: Record<
    EmailStatus,
    {
      label: string;
      badgeClass: string;
    }
  > = {
    likely_deliverable: {
      label: "Likely Deliverable",
      badgeClass:
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    },
    invalid_format: {
      label: "Invalid Format",
      badgeClass: "border-red-400/25 bg-red-400/10 text-red-300",
    },
    duplicate: {
      label: "Duplicate",
      badgeClass: "border-orange-400/25 bg-orange-400/10 text-orange-300",
    },
    disposable: {
      label: "Disposable Email",
      badgeClass: "border-red-400/25 bg-red-400/10 text-red-300",
    },
    role_based: {
      label: "Role-Based Address",
      badgeClass: "border-yellow-400/25 bg-yellow-400/10 text-yellow-200",
    },
    domain_or_mx_missing: {
      label: "Domain or MX Missing",
      badgeClass: "border-red-400/25 bg-red-400/10 text-red-300",
    },
    needs_review: {
      label: "Needs Review",
      badgeClass: "border-orange-400/25 bg-orange-400/10 text-orange-300",
    },
  };
  
  const extractEmails = (value: string) => {
    const matches = value.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    );
  
    return Array.from(
      new Set((matches || []).map((email) => email.trim().toLowerCase())),
    );
  };
  
  const csvEscape = (value: string) => {
    return `"${value.replace(/"/g, '""')}"`;
  };
  
  const BulkEmailVerifier = () => {
    const [rawEmails, setRawEmails] = useState("");
    const [results, setResults] = useState<EmailResult[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [notice, setNotice] = useState("");
    const [filter, setFilter] = useState<"all" | "keep" | "review" | "remove">(
      "all",
    );
  
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const parsedEmails = useMemo(() => extractEmails(rawEmails), [rawEmails]);
  
    const summary = useMemo(() => {
      return results.reduce(
        (current, result) => {
          if (result.action === "Keep") {
            current.keep += 1;
          }
  
          if (result.action === "Review") {
            current.review += 1;
          }
  
          if (result.action === "Remove") {
            current.remove += 1;
          }
  
          return current;
        },
        {
          keep: 0,
          review: 0,
          remove: 0,
        },
      );
    }, [results]);
  
    const visibleResults = useMemo(() => {
      if (filter === "all") {
        return results;
      }
  
      const targetAction =
        filter === "keep" ? "Keep" : filter === "review" ? "Review" : "Remove";
  
      return results.filter((result) => result.action === targetAction);
    }, [filter, results]);
  
    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
  
      if (!file) {
        return;
      }
  
      const validFile =
        file.name.toLowerCase().endsWith(".csv") ||
        file.name.toLowerCase().endsWith(".txt");
  
      if (!validFile) {
        setErrorMessage("Please upload a CSV or TXT file containing email addresses.");
        return;
      }
  
      try {
        const fileText = await file.text();
        const extractedEmails = extractEmails(fileText);
  
        if (!extractedEmails.length) {
          setErrorMessage("No email addresses were found in this file.");
          return;
        }
  
        setRawEmails(extractedEmails.join("\n"));
        setErrorMessage("");
        setNotice(`${extractedEmails.length} email address(es) loaded from ${file.name}.`);
      } catch {
        setErrorMessage("The selected file could not be read. Try a simple CSV or TXT file.");
      }
    };
  
    const handleVerify = async () => {
      setErrorMessage("");
      setNotice("");
  
      if (!parsedEmails.length) {
        setErrorMessage("Paste at least one email address or upload a CSV/TXT file.");
        return;
      }
  
      if (parsedEmails.length > 100) {
        setErrorMessage(
          `This free version checks up to 100 emails at a time. Your list currently contains ${parsedEmails.length}.`,
        );
        return;
      }
  
      setIsChecking(true);
      setResults([]);
  
      try {
        const response = await fetch("/api/verify-emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emails: parsedEmails,
          }),
        });
  
        const contentType = response.headers.get("content-type") || "";
  
        if (!contentType.includes("application/json")) {
          throw new Error(
            "The email-check API is not available in the normal Vite development server.",
          );
        }
  
        const responseData = (await response.json()) as ApiResponse & {
          error?: string;
        };
  
        if (!response.ok) {
          throw new Error(
            responseData.error || "The email list could not be checked right now.",
          );
        }
  
        setResults(responseData.results);
        setNotice(
          `${responseData.checked} email address(es) checked. The application does not save your list.`,
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "The email check failed.";
  
        if (message.includes("normal Vite development server")) {
          setErrorMessage(
            "Meta and SERP tools work with npm run dev. For Bulk Email Verifier, test with npx vercel dev or deploy the project to Vercel first.",
          );
        } else {
          setErrorMessage(message);
        }
      } finally {
        setIsChecking(false);
      }
    };
  
    const copyCleanedEmails = async () => {
      const cleanedEmails = results
        .filter((result) => result.action === "Keep")
        .map((result) => result.email)
        .join("\n");
  
      if (!cleanedEmails) {
        setErrorMessage("There are no Keep results available to copy yet.");
        return;
      }
  
      try {
        await navigator.clipboard.writeText(cleanedEmails);
        setNotice("Keep-list email addresses copied.");
      } catch {
        setErrorMessage("Copy failed. Please select the email addresses manually.");
      }
    };
  
    const downloadReport = () => {
      if (!results.length) {
        setErrorMessage("Run a check before downloading a report.");
        return;
      }
  
      const rows = [
        ["Email", "Status", "Reason", "Recommended Action", "Suggestion"],
        ...results.map((result) => [
          result.email,
          STATUS_CONFIG[result.status].label,
          result.reason,
          result.action,
          result.suggestion || "",
        ]),
      ];
  
      const csvContent = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
  
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
  
      link.href = objectUrl;
      link.download = "rankvelt-bulk-email-check-report.csv";
      link.click();
  
      URL.revokeObjectURL(objectUrl);
    };
  
    const clearAll = () => {
      setRawEmails("");
      setResults([]);
      setErrorMessage("");
      setNotice("");
      setFilter("all");
  
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
  
    return (
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MailCheck size={20} />
              </span>
  
              <div>
                <h3 className="text-xl font-black text-white">
                  Check an Email List
                </h3>
  
                <p className="mt-1 text-xs text-white/45">
                  Maximum 100 emails per run in the free version.
                </p>
              </div>
            </div>
  
            <label className="mt-6 block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Paste Emails
              </span>
  
              <textarea
                value={rawEmails}
                onChange={(event) => {
                  setRawEmails(event.target.value);
                  setErrorMessage("");
                }}
                rows={10}
                placeholder={`hello@example.com\nsales@company.com\nname@domain.com`}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-4 font-mono text-sm text-white outline-none placeholder:text-white/20 focus:border-primary/45"
              />
            </label>
  
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span
                className={`text-xs font-bold ${
                  parsedEmails.length > 100 ? "text-red-300" : "text-white/45"
                }`}
              >
                {parsedEmails.length} unique email address(es) detected
              </span>
  
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                className="hidden"
                onChange={handleFileUpload}
              />
  
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 text-xs font-black text-primary transition-colors hover:text-white"
              >
                <Upload size={15} />
                Upload CSV or TXT
              </button>
            </div>
  
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleVerify}
                disabled={isChecking}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={15} />
                {isChecking ? "Checking List..." : "Check Email List"}
              </button>
  
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-xs font-bold text-white/70 transition-colors hover:border-red-400/35 hover:text-red-300"
              >
                <Trash2 size={15} />
                Clear
              </button>
            </div>
  
            {errorMessage && (
              <div className="mt-5 rounded-xl border border-red-400/25 bg-red-400/[0.08] p-4 text-sm leading-relaxed text-red-200">
                {errorMessage}
              </div>
            )}
  
            {notice && (
              <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] p-4 text-sm leading-relaxed text-emerald-100">
                {notice}
              </div>
            )}
          </section>
  
          <aside className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-white/[0.02] to-purple-500/[0.08] p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              What This Free Check Looks At
            </p>
  
            <ul className="mt-6 space-y-4">
              {[
                "Basic email-format validation.",
                "Duplicate addresses within your submitted list.",
                "Common domain typo checks such as gmial.com.",
                "Disposable email-domain checks.",
                "Role-based mailbox identification such as info@ or support@.",
                "Domain and mail-server MX-record lookup.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
  
            <div className="mt-7 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-primary" size={18} />
  
                <p className="text-xs leading-relaxed text-white/60">
                  This tool does not send SMTP probes and does not claim to prove
                  that a specific inbox exists. “Likely Deliverable” means the
                  address passed available format and domain or MX checks.
                </p>
              </div>
            </div>
          </aside>
        </div>
  
        {results.length > 0 && (
          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                  List Results
                </p>
  
                <h3 className="mt-2 text-2xl font-black text-white">
                  Review Your Email Quality Signals
                </h3>
              </div>
  
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyCleanedEmails}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.08] px-4 py-3 text-xs font-black text-emerald-200"
                >
                  <Clipboard size={14} />
                  Copy Keep List
                </button>
  
                <button
                  type="button"
                  onClick={downloadReport}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-black text-black"
                >
                  <Download size={14} />
                  Download CSV
                </button>
              </div>
            </div>
  
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Keep
                </p>
                <p className="mt-2 text-3xl font-black text-white">{summary.keep}</p>
              </div>
  
              <div className="rounded-2xl border border-orange-400/15 bg-orange-400/[0.05] p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-orange-200">
                  Review
                </p>
                <p className="mt-2 text-3xl font-black text-white">{summary.review}</p>
              </div>
  
              <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-red-200">
                  Remove
                </p>
                <p className="mt-2 text-3xl font-black text-white">{summary.remove}</p>
              </div>
            </div>
  
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Filter size={15} className="text-primary" />
  
              {(
                [
                  ["all", "All"],
                  ["keep", "Keep"],
                  ["review", "Review"],
                  ["remove", "Remove"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                    filter === value
                      ? "border-primary/40 bg-primary/[0.1] text-primary"
                      : "border-white/10 bg-black/20 text-white/45 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
  
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-[780px] w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-wider text-white/35">
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Reason</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
  
                <tbody>
                  {visibleResults.map((result) => {
                    const status = STATUS_CONFIG[result.status];
  
                    return (
                      <tr
                        key={`${result.email}-${result.status}`}
                        className="bg-black/20 text-sm text-white/70"
                      >
                        <td className="rounded-l-xl px-3 py-4 font-mono text-xs text-white">
                          {result.email}
                          {result.suggestion && (
                            <span className="mt-1 block font-sans text-[10px] text-primary">
                              Suggestion: {result.suggestion}
                            </span>
                          )}
                        </td>
  
                        <td className="px-3 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${status.badgeClass}`}
                          >
                            {status.label}
                          </span>
                        </td>
  
                        <td className="max-w-[280px] px-3 py-4 text-xs leading-relaxed text-white/55">
                          {result.reason}
                        </td>
  
                        <td className="rounded-r-xl px-3 py-4">
                          <span
                            className={`text-xs font-black ${
                              result.action === "Keep"
                                ? "text-emerald-300"
                                : result.action === "Review"
                                  ? "text-orange-200"
                                  : "text-red-300"
                            }`}
                          >
                            {result.action}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    );
  };
  
  export default BulkEmailVerifier;