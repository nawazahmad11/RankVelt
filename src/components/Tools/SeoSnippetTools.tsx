import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  FileText,
  Link2,
  Monitor,
  RefreshCcw,
  Search,
  Smartphone,
  TriangleAlert,
} from "lucide-react";

const copyText = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

const getLengthState = (
  length: number,
  preferredMin: number,
  preferredMax: number,
) => {
  if (length === 0) {
    return {
      label: "Add content",
      tone: "text-white/45",
      icon: <TriangleAlert size={14} />,
    };
  }

  if (length < preferredMin) {
    return {
      label: "Could be more descriptive",
      tone: "text-yellow-300",
      icon: <TriangleAlert size={14} />,
    };
  }

  if (length > preferredMax) {
    return {
      label: "May truncate in some results",
      tone: "text-orange-300",
      icon: <TriangleAlert size={14} />,
    };
  }

  return {
    label: "Healthy editing range",
    tone: "text-emerald-300",
    icon: <CheckCircle2 size={14} />,
  };
};

const normaliseUrl = (value: string) => {
  const cleanValue = value.trim();

  if (!cleanValue) {
    return "rankvelt.com";
  }

  return cleanValue
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
};

const truncateText = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, limit - 1).trim()}…`;
};

export const MetaTitleDescriptionChecker = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const titleState = useMemo(() => getLengthState(title.length, 45, 60), [title]);
  const descriptionState = useMemo(
    () => getLengthState(description.length, 140, 160),
    [description],
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPageUrl("");
    setCopied(false);
  };

  const handleCopy = async () => {
    const content = `Title: ${title || "Not added"}\nDescription: ${
      description || "Not added"
    }\nURL: ${normaliseUrl(pageUrl)}`;

    const wasCopied = await copyText(content);

    if (wasCopied) {
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText size={20} />
            </span>

            <div>
              <h3 className="text-xl font-black text-white">
                Check Your Page Metadata
              </h3>

              <p className="mt-1 text-xs text-white/45">
                Use this as a practical editing guide, not a ranking guarantee.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Page Title
              </span>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                placeholder="Example: Local SEO Services for Small Businesses | RankVelt"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary/45"
              />

              <span className={`mt-2 flex items-center gap-2 text-xs ${titleState.tone}`}>
                {titleState.icon}
                {title.length}/120 characters · {titleState.label}
              </span>
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Meta Description
              </span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={320}
                rows={5}
                placeholder="Write a useful description that explains what the page offers, who it helps, and why a visitor should click."
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary/45"
              />

              <span
                className={`mt-2 flex items-center gap-2 text-xs ${descriptionState.tone}`}
              >
                {descriptionState.icon}
                {description.length}/320 characters · {descriptionState.label}
              </span>
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Page URL
              </span>

              <input
                value={pageUrl}
                onChange={(event) => setPageUrl(event.target.value)}
                placeholder="https://rankvelt.com/local-seo"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary/45"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
            >
              <Copy size={15} />
              {copied ? "Copied" : "Copy Metadata"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-xs font-bold text-white/70 transition-colors hover:border-primary/35 hover:text-primary"
            >
              <RefreshCcw size={15} />
              Reset
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-white/[0.02] to-purple-500/[0.08] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-primary">
              <Search size={20} />
            </span>

            <div>
              <h3 className="text-xl font-black text-white">
                Quick Preview
              </h3>

              <p className="mt-1 text-xs text-white/45">
                A visual guide for your title and description.
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.95] p-5 text-[#202124] shadow-2xl">
            <p className="text-sm text-[#202124]">
              {normaliseUrl(pageUrl)}
            </p>

            <p className="mt-2 text-xl font-medium leading-snug text-[#1a0dab]">
              {truncateText(title || "Your SEO Page Title Appears Here", 65)}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#4d5156]">
              {truncateText(
                description ||
                  "Your meta description appears here. Write a useful summary that helps visitors understand the page before they click.",
                165,
              )}
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm leading-relaxed text-white/65">
            <p className="flex gap-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
              Write a unique title that matches the page's main purpose.
            </p>

            <p className="flex gap-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
              Describe the actual content instead of repeating keywords.
            </p>

            <p className="flex gap-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
              Keep your page URL readable and connected to the topic.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export const SerpSnippetPreview = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("rankvelt.com");
  const [path, setPath] = useState("/local-seo");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const displayUrl = useMemo(() => {
    const safeDomain = normaliseUrl(domain);
    const safePath = path.startsWith("/") ? path : `/${path}`;

    return `${safeDomain}${safePath}`;
  }, [domain, path]);

  const titleLimit = device === "desktop" ? 62 : 48;
  const descriptionLimit = device === "desktop" ? 165 : 132;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Link2 size={20} />
            </span>

            <div>
              <h3 className="text-xl font-black text-white">
                Build a Search Preview
              </h3>

              <p className="mt-1 text-xs text-white/45">
                Preview how your page may look before publishing metadata.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                SEO Title
              </span>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Local SEO Services for Small Businesses"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-primary/45"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Domain
              </span>

              <input
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="rankvelt.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-primary/45"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                URL Path
              </span>

              <input
                value={path}
                onChange={(event) => setPath(event.target.value)}
                placeholder="/local-seo"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-primary/45"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Meta Description
              </span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="Describe the page clearly, naturally, and in a way that makes a relevant visitor want to click."
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-white/25 focus:border-primary/45"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-white/[0.02] to-purple-500/[0.08] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-white">Snippet Preview</h3>
              <p className="mt-1 text-xs text-white/45">
                Search engines can choose different title or snippet text.
              </p>
            </div>

            <div className="flex rounded-xl border border-white/10 bg-black/25 p-1">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  device === "desktop"
                    ? "bg-primary text-black"
                    : "text-white/55 hover:text-white"
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
                    : "text-white/55 hover:text-white"
                }`}
              >
                <Smartphone size={13} />
                Mobile
              </button>
            </div>
          </div>

          <div
            className={`mx-auto mt-8 rounded-2xl border border-white/[0.08] bg-white p-5 text-[#202124] shadow-2xl ${
              device === "mobile" ? "max-w-[390px]" : "max-w-full"
            }`}
          >
            <p className="text-sm text-[#202124]">{displayUrl}</p>

            <p className="mt-2 text-[20px] font-medium leading-snug text-[#1a0dab]">
              {truncateText(
                title || "Your Search Result Title Will Appear Here",
                titleLimit,
              )}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#4d5156]">
              {truncateText(
                description ||
                  "Your search-result description will appear here. Use it to explain what the visitor will find on the page and why it is relevant.",
                descriptionLimit,
              )}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              Preview Notes
            </p>

            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
              <li className="flex gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                Use the preview to edit clarity, not to chase an exact pixel number.
              </li>

              <li className="flex gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                Keep the title aligned with the visible page heading and content.
              </li>

              <li className="flex gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                Make descriptions useful enough that the correct visitor understands the page.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};