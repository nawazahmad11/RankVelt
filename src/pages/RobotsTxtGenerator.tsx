// RankVelt tool page: Robots.txt Generator (100% free, browser only)
// Place at: src/pages/tools/RobotsTxtGenerator.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx and BulkEmailExtractor.tsx).
// No external dependencies beyond React.

import { useEffect, useMemo, useRef, useState } from "react";

interface RuleGroup {
  id: number;
  userAgent: string;
  customAgent: string;
  agentMode: "preset" | "custom";
  allows: string[];
  disallows: string[];
  crawlDelay: string;
  aiBot: boolean;
}

const PRESET_BOTS = [
  "*",
  "Googlebot",
  "Bingbot",
  "Googlebot-Image",
  "DuckDuckBot",
  "YandexBot",
  "Baiduspider",
];

const AI_BOTS = [
  { agent: "GPTBot", label: "GPTBot (OpenAI training)" },
  { agent: "ChatGPT-User", label: "ChatGPT-User (user browsing)" },
  { agent: "OAI-SearchBot", label: "OAI-SearchBot (ChatGPT Search)" },
  { agent: "ClaudeBot", label: "ClaudeBot (Anthropic)" },
  { agent: "anthropic-ai", label: "anthropic-ai (Anthropic training)" },
  { agent: "Google-Extended", label: "Google-Extended (Gemini training)" },
  { agent: "CCBot", label: "CCBot (Common Crawl)" },
  { agent: "PerplexityBot", label: "PerplexityBot (Perplexity search)" },
  { agent: "Bytespider", label: "Bytespider (ByteDance)" },
  { agent: "Meta-ExternalAgent", label: "Meta-ExternalAgent (Meta AI)" },
];

const inputCls =
  "mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50";

const labelCls =
  "block text-[11px] font-black uppercase tracking-[0.18em] text-white/50";

function effectiveAgent(g: RuleGroup): string {
  return g.agentMode === "custom" ? g.customAgent.trim() : g.userAgent;
}

function buildRobotsTxt(groups: RuleGroup[], sitemap: string): string {
  const lines: string[] = [];
  groups.forEach((g, i) => {
    const agent = effectiveAgent(g) || "*";
    if (i > 0) lines.push("");
    lines.push(`User-agent: ${agent}`);
    g.allows
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((p) => lines.push(`Allow: ${p}`));
    g.disallows
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((p) => lines.push(`Disallow: ${p}`));
    if (g.crawlDelay.trim()) lines.push(`Crawl-delay: ${g.crawlDelay.trim()}`);
  });
  const sm = sitemap.trim();
  if (sm) {
    lines.push("");
    lines.push(`Sitemap: ${sm}`);
  }
  return lines.join("\n");
}

interface Warning {
  level: "error" | "warn" | "info";
  text: string;
}

function validate(groups: RuleGroup[], sitemap: string): Warning[] {
  const out: Warning[] = [];
  groups.forEach((g, i) => {
    const n = i + 1;
    const agent = effectiveAgent(g);
    if (!agent) {
      out.push({
        level: "error",
        text: `Rule block ${n} has no user-agent set. It will render as "User-agent: *".`,
      });
    }
    const check = (p: string, kind: "Allow" | "Disallow") => {
      const t = p.trim();
      if (!t) return;
      if (!t.startsWith("/")) {
        out.push({
          level: "error",
          text: `Rule block ${n} (${agent || "*"}): ${kind} path "${t}" must start with a forward slash, for example "/admin/".`,
        });
      }
      if (kind === "Disallow" && t === "/") {
        out.push({
          level: "error",
          text: `Rule block ${n} (${agent || "*"}): "Disallow: /" blocks the ENTIRE site for this crawler. Only use this for staging sites.`,
        });
      }
      if (/\s/.test(t)) {
        out.push({
          level: "warn",
          text: `Rule block ${n} (${agent || "*"}): path "${t}" contains a space. Crawlers may read it incorrectly.`,
        });
      }
    };
    g.allows.forEach((p) => check(p, "Allow"));
    g.disallows.forEach((p) => check(p, "Disallow"));
    const allowSet = new Set(g.allows.map((p) => p.trim()).filter(Boolean));
    g.disallows.forEach((p) => {
      const t = p.trim();
      if (t && allowSet.has(t)) {
        out.push({
          level: "warn",
          text: `Rule block ${n} (${agent || "*"}): "${t}" appears in both Allow and Disallow. For an exact match the Allow wins, but you should clean this up.`,
        });
      }
    });
    if (g.crawlDelay.trim() && !/^\d+$/.test(g.crawlDelay.trim())) {
      out.push({
        level: "error",
        text: `Rule block ${n} (${agent || "*"}): crawl-delay must be a whole number of seconds, for example "5".`,
      });
    }
    const emptyBlock =
      g.allows.every((p) => !p.trim()) && g.disallows.every((p) => !p.trim());
    if (emptyBlock && agent === "*") {
      out.push({
        level: "info",
        text: `Rule block ${n} allows everything ("User-agent: *" with no rules). That is the default for most sites.`,
      });
    }
  });
  const sm = sitemap.trim();
  if (sm && !/^https?:\/\/.+/i.test(sm)) {
    out.push({
      level: "warn",
      text: "The sitemap URL should be a full absolute URL starting with https://, for example \"https://example.com/sitemap.xml\".",
    });
  }
  out.push({
    level: "info",
    text: "Reminder: Googlebot ignores Crawl-delay. Robots.txt is a request, not security; never rely on it to protect private content.",
  });
  return out;
}

const SITE_URL = "https://rankvelt.com";

const FAQS: { q: string; a: string }[] = [
  {
    q: "What does a robots.txt generator do?",
    a: "It builds a valid robots.txt file for you without hand-writing the syntax. You pick which crawlers the rules apply to, add Allow and Disallow paths, include your sitemap, and the tool outputs correctly formatted text you can upload to your site.",
  },
  {
    q: "Where do I upload the robots.txt file?",
    a: "Upload it to the root directory of your domain so it is reachable at yourdomain.com/robots.txt. Crawlers only look in that one location, and each subdomain needs its own separate file.",
  },
  {
    q: "What does \"User-agent: *\" mean?",
    a: "The asterisk is a wildcard that applies the rule block to every crawler: Google, Bing, DuckDuckGo, AI bots, and the rest. A separate block for a named crawler like Googlebot overrides the wildcard block for that crawler.",
  },
  {
    q: "What is the difference between Allow and Disallow?",
    a: "Disallow tells crawlers not to visit matching paths, while Allow reopens a specific path inside a blocked area. Allow only matters when it is more specific than a Disallow; when both match equally, the longer, more specific rule wins.",
  },
  {
    q: "Can robots.txt keep my data secure?",
    a: "No. Robots.txt is a public, voluntary request, not a security mechanism. Anyone can read it and malicious bots ignore it. Use passwords or authentication for anything that must stay private.",
  },
  {
    q: "Can robots.txt remove a page from Google search results?",
    a: "Not reliably. A blocked crawler cannot see a noindex tag, so the URL can stay indexed as a bare link. To remove a page, allow crawling and use a noindex meta tag or X-Robots-Tag header instead.",
  },
  {
    q: "What is crawl-delay, and does Google honor it?",
    a: "Crawl-delay asks crawlers to pause a set number of seconds between requests. Googlebot ignores it entirely. Bing and several smaller crawlers do honor it, so it is useful if non-Google bots are hammering your server.",
  },
  {
    q: "How do I add my sitemap to robots.txt?",
    a: "Add a line like \"Sitemap: https://yourdomain.com/sitemap.xml\" at the end of the file. You can include more than one Sitemap line. This helps search engines discover your pages faster, especially on new sites.",
  },
  {
    q: "How do I test my robots.txt file?",
    a: "In Google Search Console, open Settings and the robots.txt report to see the version Google fetched, then test individual URLs against your rules. Bing Webmaster Tools has a similar tester. Also load yourdomain.com/robots.txt in a browser to confirm it serves the right plain text.",
  },
  {
    q: "Does every subdomain need its own robots.txt file?",
    a: "Yes. Crawlers treat each subdomain as a separate host, so blog.yourdomain.com needs its own file. The same applies to staging subdomains, which you typically want fully blocked until launch.",
  },
];

const RELATED = [
  { href: "/tools/xml-sitemap-generator", name: "XML Sitemap Generator" },
  { href: "/tools/bulk-redirect-generator", name: "Bulk Redirect Generator" },
  { href: "/tools/title-tag-preview", name: "Title Tag Preview" },
  { href: "/tools/open-graph-preview", name: "Open Graph Preview" },
];

function RuleBlockEditor({
  group,
  index,
  onChange,
  onRemove,
}: {
  group: RuleGroup;
  index: number;
  onChange: (patch: Partial<RuleGroup>) => void;
  onRemove: () => void;
}) {
  const [newAllow, setNewAllow] = useState("");
  const [newDisallow, setNewDisallow] = useState("");

  function addPath(kind: "allows" | "disallows", value: string) {
    const t = value.trim();
    if (!t) return;
    onChange({ [kind]: [...group[kind], t] } as Partial<RuleGroup>);
    if (kind === "allows") setNewAllow("");
    else setNewDisallow("");
  }

  function removePath(kind: "allows" | "disallows", path: string) {
    onChange({ [kind]: group[kind].filter((p) => p !== path) } as Partial<RuleGroup>);
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white/80">
          Rule block {index + 1}
          {group.aiBot && (
            <span className="ml-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] normal-case tracking-normal text-purple-300">
              AI crawler
            </span>
          )}
        </h3>
        <button
          onClick={onRemove}
          className="rounded-lg border border-white/10 px-2.5 py-1 text-xs font-bold text-white/50 transition-colors hover:border-red-500/40 hover:text-red-300"
        >
          Remove
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>User-agent</label>
          <div className="mt-1 flex gap-2">
            <select
              value={group.agentMode === "custom" ? "__custom__" : group.userAgent}
              onChange={(e) => {
                if (e.target.value === "__custom__") onChange({ agentMode: "custom" });
                else onChange({ agentMode: "preset", userAgent: e.target.value });
              }}
              className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
            >
              {PRESET_BOTS.map((b) => (
                <option key={b} value={b} className="bg-black">
                  {b === "*" ? "* (all crawlers)" : b}
                </option>
              ))}
              <option value="__custom__" className="bg-black">
                Custom...
              </option>
            </select>
          </div>
          {group.agentMode === "custom" && (
            <input
              value={group.customAgent}
              onChange={(e) => onChange({ customAgent: e.target.value })}
              placeholder="e.g. GPTBot"
              className={inputCls}
            />
          )}
        </div>
        <div>
          <label className={labelCls}>Crawl-delay (seconds, optional)</label>
          <input
            value={group.crawlDelay}
            onChange={(e) => onChange({ crawlDelay: e.target.value.replace(/[^\d]/g, "") })}
            placeholder="e.g. 5"
            inputMode="numeric"
            className={inputCls}
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-white/35">
            Googlebot ignores this; Bing and smaller crawlers may honor it.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Allow paths</label>
          <div className="mt-1 flex gap-2">
            <input
              value={newAllow}
              onChange={(e) => setNewAllow(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPath("allows", newAllow)}
              placeholder="/images/logos/"
              className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50"
            />
            <button
              onClick={() => addPath("allows", newAllow)}
              className="shrink-0 rounded-xl bg-white/10 px-4 text-sm font-bold text-white transition-colors hover:bg-white/15"
            >
              Add
            </button>
          </div>
          {group.allows.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {group.allows.map((p) => (
                <li
                  key={p}
                  className="flex items-center justify-between gap-2 rounded-lg bg-emerald-500/[0.08] px-3 py-1.5 font-mono text-xs text-emerald-300"
                >
                  <span className="truncate">{p}</span>
                  <button
                    onClick={() => removePath("allows", p)}
                    className="text-white/40 hover:text-red-300"
                    aria-label={`Remove allow path ${p}`}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className={labelCls}>Disallow paths</label>
          <div className="mt-1 flex gap-2">
            <input
              value={newDisallow}
              onChange={(e) => setNewDisallow(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPath("disallows", newDisallow)}
              placeholder="/admin/"
              className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50"
            />
            <button
              onClick={() => addPath("disallows", newDisallow)}
              className="shrink-0 rounded-xl bg-white/10 px-4 text-sm font-bold text-white transition-colors hover:bg-white/15"
            >
              Add
            </button>
          </div>
          {group.disallows.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {group.disallows.map((p) => (
                <li
                  key={p}
                  className="flex items-center justify-between gap-2 rounded-lg bg-red-500/[0.08] px-3 py-1.5 font-mono text-xs text-red-300"
                >
                  <span className="truncate">{p}</span>
                  <button
                    onClick={() => removePath("disallows", p)}
                    className="text-white/40 hover:text-red-300"
                    aria-label={`Remove disallow path ${p}`}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RobotsTxtGenerator() {
  // FAQPage JSON-LD built from the same FAQ array rendered below.
  useEffect(() => {
    document.getElementById("rankvelt-robots-txt-schema")?.remove();
    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-robots-txt-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
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

  const idRef = useRef(2);

  const makeGroup = (partial: Partial<RuleGroup> = {}): RuleGroup => ({
    id: idRef.current++,
    userAgent: "*",
    customAgent: "",
    agentMode: "preset",
    allows: [],
    disallows: [],
    crawlDelay: "",
    aiBot: false,
    ...partial,
  });

  const [groups, setGroups] = useState<RuleGroup[]>(() => [
    { id: 1, userAgent: "*", customAgent: "", agentMode: "preset", allows: [], disallows: [], crawlDelay: "", aiBot: false },
  ]);
  const [sitemap, setSitemap] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const output = useMemo(() => buildRobotsTxt(groups, sitemap), [groups, sitemap]);
  const warnings = useMemo(() => validate(groups, sitemap), [groups, sitemap]);
  const aiSelected = useMemo(
    () => new Set(groups.filter((g) => g.aiBot).map((g) => effectiveAgent(g))),
    [groups]
  );

  function patchGroup(id: number, patch: Partial<RuleGroup>) {
    setGroups((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  function removeGroup(id: number) {
    setGroups((gs) => (gs.length > 1 ? gs.filter((g) => g.id !== id) : gs));
  }

  function addGroup() {
    setGroups((gs) => [...gs, makeGroup()]);
  }

  function applyPreset(kind: "allow" | "block" | "wordpress") {
    if (kind === "allow") {
      setGroups([makeGroup()]);
    } else if (kind === "block") {
      setGroups([makeGroup({ disallows: ["/"] })]);
    } else {
      setGroups([
        makeGroup({
          userAgent: "*",
          allows: ["/wp-admin/admin-ajax.php"],
          disallows: ["/wp-admin/", "/wp-includes/", "/wp-content/plugins/", "/wp-content/themes/", "/readme.html", "/?s="],
        }),
      ]);
    }
  }

  function toggleAiBot(agent: string) {
    setGroups((gs) => {
      if (gs.some((g) => g.aiBot && effectiveAgent(g) === agent)) {
        return gs.filter((g) => !(g.aiBot && effectiveAgent(g) === agent));
      }
      return [...gs, makeGroup({ agentMode: "custom", customAgent: agent, disallows: ["/"], aiBot: true })];
    });
  }

  async function copyOutput() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(output);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = output;
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
    }
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setGroups([
      { id: idRef.current++, userAgent: "*", customAgent: "", agentMode: "preset", allows: [], disallows: [], crawlDelay: "", aiBot: false },
    ]);
    setSitemap("");
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.08] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            Free RankVelt Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Free <span className="text-gradient-gold">Robots.txt</span> Generator
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            Build a valid robots.txt file in seconds. Add user-agent rules, allow and
            disallow paths, block AI training crawlers, and include your sitemap, with a
            live preview and safety warnings. Free, no signup, everything runs in your browser.
          </p>
        </section>

        {/* Tool UI */}
        <section className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-white">Build your file</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => applyPreset("allow")}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-white/70 transition-colors hover:border-primary/40 hover:text-white"
                >
                  Allow All
                </button>
                <button
                  onClick={() => applyPreset("wordpress")}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-white/70 transition-colors hover:border-primary/40 hover:text-white"
                >
                  WordPress
                </button>
                <button
                  onClick={() => applyPreset("block")}
                  className="rounded-xl border border-red-500/25 bg-red-500/[0.06] px-3.5 py-2 text-xs font-bold text-red-300 transition-colors hover:border-red-500/50"
                >
                  Block All
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-white/70 transition-colors hover:border-primary/40 hover:text-white"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {groups.map((g, i) => (
                <RuleBlockEditor
                  key={g.id}
                  group={g}
                  index={i}
                  onChange={(patch) => patchGroup(g.id, patch)}
                  onRemove={() => removeGroup(g.id)}
                />
              ))}
            </div>

            <button
              onClick={addGroup}
              className="mt-4 w-full rounded-xl border border-dashed border-white/15 bg-transparent px-4 py-3 text-sm font-bold text-white/60 transition-colors hover:border-primary/40 hover:text-white"
            >
              + Add another user-agent block
            </button>

            {/* AI crawler blocking */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/20 p-4 sm:p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white/80">
                Block AI training crawlers
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                One click adds a "Disallow: /" block for each selected AI bot. Blocking
                training bots (GPTBot, CCBot) does not necessarily remove you from AI
                search answers; blocking retrieval bots (OAI-SearchBot, PerplexityBot)
                can. Choose intentionally.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {AI_BOTS.map((b) => {
                  const on = aiSelected.has(b.agent);
                  return (
                    <button
                      key={b.agent}
                      onClick={() => toggleAiBot(b.agent)}
                      className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                        on
                          ? "border-purple-500/50 bg-purple-500/[0.12] text-purple-200"
                          : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white/80"
                      }`}
                    >
                      <span className="font-mono">{b.label}</span>
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                          on ? "border-purple-400 bg-purple-500 text-white" : "border-white/25 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sitemap */}
            <div className="mt-6">
              <label className={labelCls}>Sitemap URL (optional)</label>
              <input
                value={sitemap}
                onChange={(e) => setSitemap(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                inputMode="url"
                className={inputCls}
              />
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/35">
                Added as a "Sitemap:" line so crawlers can discover your pages faster.
              </p>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="mt-6 space-y-2">
                {warnings.map((w, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                      w.level === "error"
                        ? "border-red-500/30 bg-red-500/[0.07] text-red-300"
                        : w.level === "warn"
                          ? "border-amber-500/30 bg-amber-500/[0.07] text-amber-200"
                          : "border-sky-500/25 bg-sky-500/[0.06] text-sky-200"
                    }`}
                  >
                    <span className="mr-2 font-black uppercase text-[10px] tracking-[0.18em]">
                      {w.level === "error" ? "Error" : w.level === "warn" ? "Warning" : "Note"}
                    </span>
                    {w.text}
                  </div>
                ))}
              </div>
            )}

            {/* Preview */}
            <div className="mt-6">
              <label className={labelCls}>Live preview</label>
              <pre className="mt-1 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-white/[0.08] bg-black/50 p-4 font-mono text-[13px] leading-relaxed text-emerald-200">
                {output || "Your robots.txt will appear here."}
              </pre>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={copyOutput}
                className="rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
              >
                {copied ? "Copied!" : "Copy robots.txt"}
              </button>
              <button
                onClick={download}
                className="rounded-xl border border-primary/40 bg-primary/[0.08] px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/[0.14]"
              >
                Download robots.txt
              </button>
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">How to use this generator</h2>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>
                Pick a preset or start from the default allow-all template. Add a rule
                block for each crawler you want to treat differently, choosing
                Googlebot, Bingbot, or a custom user-agent like GPTBot.
              </li>
              <li>
                Add Allow and Disallow paths to each block, set a crawl-delay if needed,
                optionally block AI training crawlers with one click, and paste your
                sitemap URL. Watch the live preview and fix any warnings.
              </li>
              <li>
                Copy the text or download it as robots.txt, upload it to your site root
                (https://yourdomain.com/robots.txt), then test it in Google Search
                Console under Settings before relying on it.
              </li>
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Nothing leaves your browser. The tool never fetches your site, so it cannot
              validate that your paths exist. After publishing, confirm important pages
              still crawl in Search Console.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-white/[0.06]">
              {FAQS.map((f, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-white/85">{f.q}</span>
                    <span className="shrink-0 text-lg text-primary">
                      {openFaq === i ? "-" : "+"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="pb-4 pr-8 text-sm leading-relaxed text-white/60">{f.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related tools */}
        <section className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-xl font-black text-white">Related free tools</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {RELATED.map((t) => (
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
      <RobotsTxtGeneratorArticle />
      </div>
    </main>
  );
}

/* ==================== SEO ARTICLE ==================== */
// RankVelt SEO article: Robots.txt Generator (~1500 words)
// Companion article rendered below the tool UI on /tools/robots-txt-generator.
// The tool's own FAQ accordion stays short and practical; this article goes
// deeper into parsing rules, wildcards, crawl budget, platform playbooks, and
// AI crawlers. No em or en dashes used anywhere.

const sectionCls = 'mt-10';
const h2Cls = 'text-2xl font-black tracking-tight text-white sm:text-3xl';
const pCls = 'mt-4 text-[15px] leading-[1.8] text-white/65';
const ulCls = 'mt-4 space-y-2.5 text-[15px] leading-[1.8] text-white/65';
const codeCls =
  'mt-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/50 p-4 font-mono text-[13px] leading-relaxed text-emerald-200';

const faqs: Array<{ q: string; a: string }> = [
  {
    q: 'Which rule wins when Allow and Disallow both match a URL?',
    a: 'The longest, most specific matching rule wins, and line order does not matter. So Disallow: /images/ loses to Allow: /images/logos/ for URLs inside the logos folder. On a rare exact tie, Google lets the Allow win. These behaviors are formalized in RFC 9309, which Google published in 2022 to document how its parser actually works.',
  },
  {
    q: 'Do I need a robots.txt file if I want everything crawled?',
    a: 'Strictly, no. A missing file is treated as full permission, and a file with only "User-agent: *" and an empty "Disallow:" line means the same. Still, publishing a minimal file silences 404 noise in your logs and gives you a place for the Sitemap line, which genuinely helps discovery on newer sites with few backlinks.',
  },
  {
    q: 'Why do only * and $ work as wildcards?',
    a: 'Because the robots exclusion protocol only ever defined those two. The asterisk matches any sequence of characters, including nothing, and the dollar sign marks the end of a URL, but only as the last character of the rule. Regex features like character classes are not supported, so Disallow: /page?.html would be read literally, question mark included.',
  },
  {
    q: 'Can I block one file type across the whole site?',
    a: 'Yes: Disallow: /*.pdf$ blocks every URL ending in .pdf while leaving other pages alone. The dollar sign does the real work. Without it, the rule would block any URL merely containing ".pdf", including a blog post about PDF tips. Always test broad patterns against your important URLs before shipping.',
  },
  {
    q: 'What happens if robots.txt returns a server error?',
    a: 'Google treats 5xx errors conservatively: Googlebot assumes crawling is not allowed and backs off, and prolonged failures can hurt visibility. A 404 is the opposite, meaning no rules, crawl everything. This is why uptime monitoring should cover your robots.txt URL, not just your homepage.',
  },
  {
    q: 'Should I disallow my CSS and JavaScript folders?',
    a: 'No. That advice is a leftover from the early 2000s. Google renders pages the way visitors see them and needs your CSS and JS to do it. If crawlers cannot load those files, Google sees a broken page and rankings can suffer. Keep asset folders and CDNs fully crawlable.',
  },
  {
    q: 'How do I block a staging site without risking the launch?',
    a: 'Use Disallow: / for every crawler on the staging host, remembering each hostname needs its own file. Then put a "check robots.txt" step on your written go-live checklist and verify the production file in Search Console on launch day. The classic disaster is a staging file copied to production during a deploy.',
  },
  {
    q: 'Does blocking a bot in robots.txt stop AI model training?',
    a: 'It stops compliant bots, which covers the major AI crawlers. But robots.txt is voluntary: scrapers that ignore it will keep coming, and already-scraped content cannot be unlearned. Treat robots.txt as your declared policy, then add real protection like authentication for anything that must stay out of training data.',
  },
  {
    q: 'Can I put more than one Sitemap line in robots.txt?',
    a: 'Yes, one per line, and crawlers read all of them. Each must be an absolute URL starting with https://, and in practice each sitemap should live on the same host as the robots.txt file. A sitemap index file is usually cleaner than many individual lines.',
  },
  {
    q: 'Do comments work in robots.txt?',
    a: 'Yes. Lines starting with # are ignored by crawlers, and blank lines are ignored too. A note like "# Staging block, remove on launch" next to Disallow: / has saved many sites. Keep the file short overall, since long files are harder to debug.',
  },
];

function RobotsTxtGeneratorArticle() {
  return (
    <article className="mx-auto mt-16 max-w-4xl">
      <section className={sectionCls}>
        <h2 className={h2Cls}>What a robots.txt file actually does</h2>
        <p className={pCls}>
          A robots.txt file is a plain text file at the root of your website,
          at an address like https://yourdomain.com/robots.txt. It tells
          search engine crawlers which parts of your site they may visit and
          which they should skip. When Googlebot, Bingbot, or an AI crawler
          arrives at your domain, this is the first file it requests, which
          makes it the first impression your site gives every search engine.
        </p>
        <p className={pCls}>
          Two facts matter more than anything else. First, robots.txt is a
          suggestion, not a command: compliant bots honor it, malicious bots
          ignore it. Second, Disallow controls crawling, not indexing. A
          blocked page can still appear in search results as a bare link if
          other pages link to it, because the crawler never reaches the
          noindex tag on it. Keep those two facts in mind and most robots.txt
          confusion disappears.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>How Google really reads the file</h2>
        <p className={pCls}>
          In 2022 Google formalized its parsing behavior in RFC 9309. These
          are the rules that decide which of your lines actually win:
        </p>
        <ul className={ulCls + ' list-disc pl-6'}>
          <li>
            <strong className="text-white/85">One group wins, no inheritance.</strong>{' '}
            A crawler follows only its most specific matching user-agent
            block. With a Googlebot block and a wildcard block present,
            Googlebot uses only its own block.
          </li>
          <li>
            <strong className="text-white/85">Longest match wins, order is irrelevant.</strong>{' '}
            When Allow and Disallow both match, the more specific rule wins
            wherever it sits. On an exact tie, Allow wins.
          </li>
          <li>
            <strong className="text-white/85">Directives are case insensitive, paths are not.</strong>{' '}
            USER-AGENT works like user-agent, but /Admin/ and /admin/ are
            different paths.
          </li>
          <li>
            <strong className="text-white/85">A 404 means crawl everything.</strong>{' '}
            A missing file grants full permission, while a 5xx server error
            makes Googlebot back off. Errors on this URL are more dangerous
            than a missing file.
          </li>
        </ul>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Wildcards and pattern matching, used without fear</h2>
        <p className={pCls}>
          The protocol supports exactly two special characters. The asterisk
          (*) matches any sequence of characters, including nothing at all.
          The dollar sign ($) marks the end of a URL, but only as the last
          character of a rule. Nothing else from regular expressions works.
        </p>
        <p className={pCls}>
          Matching is prefix based, which creates the classic trap: Disallow:
          /admin also blocks /administrator and /admins, because they share
          the prefix. If you mean only the folder, write Disallow: /admin/
          with the trailing slash. The end anchor is your precision tool:
          Disallow: /*.pdf$ blocks every PDF while leaving a blog post about
          PDFs alone, because the URL must actually end there.
        </p>
        <pre className={codeCls}>{`User-agent: *
Disallow: /admin/
Disallow: /*?sort=
Disallow: /*.pdf$
Allow: /admin/public-docs/

Sitemap: https://yourdomain.com/sitemap.xml`}</pre>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>The Sitemap line: the fastest indexing win</h2>
        <p className={pCls}>
          The Sitemap directive is not a rule, it is a pointer, and it is
          global: it applies to all crawlers regardless of nearby
          user-agent blocks. One line pointing at your XML sitemap tells
          every crawler where your important pages live. For a new site with
          few backlinks, this is often the fastest way to get pages
          discovered. You can list multiple sitemaps, one per line, each as
          an absolute https:// URL, though a single sitemap index file is
          usually cleaner.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Crawl budget: when this file moves the needle</h2>
        <p className={pCls}>
          Google gives every site limited crawling attention, and robots.txt
          is how you aim it. For a small site with a few hundred pages,
          budget is rarely the bottleneck. For large sites with faceted
          navigation or endless parameter combinations, it is very real: every
          crawl wasted on a filtered search page is stolen from a page that
          earns revenue. Small sites should stay minimal (block admin, block
          internal search, point to the sitemap, stop). Ecommerce sites
          should be aggressive with patterns like /*?sort= and /*?filter=.
          One caveat: Crawl-delay never slows Googlebot, which ignores it
          entirely. It only affects Bing and smaller crawlers.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Mistakes that take sites offline in search</h2>
        <ul className={ulCls + ' list-disc pl-6'}>
          <li>
            <strong className="text-white/85">The staging leak.</strong> A
            staging Disallow: / gets copied to production during launch and
            traffic falls to zero. Put robots.txt on your go-live checklist.
          </li>
          <li>
            <strong className="text-white/85">The trailing slash ambush.</strong>{' '}
            Disallow: /admin blocks /administrator too. Decide whether you
            mean the folder (/admin/) or the prefix (/admin).
          </li>
          <li>
            <strong className="text-white/85">Blocking CSS and JavaScript.</strong>{' '}
            Google renders pages like visitors see them. Blocked assets mean
            Google sees a broken page.
          </li>
          <li>
            <strong className="text-white/85">Using Disallow as a noindex.</strong>{' '}
            A blocked crawler cannot read the page's noindex tag, so the URL
            can linger in the index. Allow crawling and use noindex instead.
          </li>
          <li>
            <strong className="text-white/85">Advertising private paths.</strong>{' '}
            The file is public. Listing /secret-portal/ tells the internet it
            exists. Use authentication for real security.
          </li>
        </ul>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Platform playbooks: WordPress, Shopify, Wix, custom</h2>
        <p className={pCls}>
          <strong className="text-white/85">WordPress</strong> generates a
          default file if you provide none, but a custom one gives real
          control: block /wp-admin/, /wp-includes/, plugin and theme folders,
          and internal search (/?s=), while allowing
          /wp-admin/admin-ajax.php. That Allow matters, because blocking it
          breaks AJAX features and Google needs it to render pages. The
          WordPress preset in the tool above builds this in one click.{' '}
          <strong className="text-white/85">Shopify and Wix</strong> manage
          robots.txt for you with limited customization (Shopify's
          robots.txt.liquid template, Wix's editor on paid plans), so add
          rules surgically rather than replacing the platform's tuned file.{' '}
          <strong className="text-white/85">Custom sites</strong> are entirely
          your responsibility: keep the file minimal and correct.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>AI crawlers: training bots vs retrieval bots</h2>
        <p className={pCls}>
          The distinction that matters is between training crawlers, which
          collect data to build AI models, and retrieval crawlers, which
          fetch live pages to answer queries and cite sources. Blocking a
          training bot does not remove you from AI search answers; blocking a
          retrieval bot can. Many publishers now block the trainers while
          staying open to retrieval.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full min-w-[520px] text-left text-[13px] leading-relaxed text-white/65">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-[0.14em] text-white/40">
                <th className="px-4 py-3">User-agent</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              <tr><td className="px-4 py-2.5 font-mono text-white/80">GPTBot</td><td className="px-4 py-2.5">OpenAI</td><td className="px-4 py-2.5">Model training</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-white/80">OAI-SearchBot</td><td className="px-4 py-2.5">OpenAI</td><td className="px-4 py-2.5">ChatGPT Search retrieval</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-white/80">ChatGPT-User</td><td className="px-4 py-2.5">OpenAI</td><td className="px-4 py-2.5">User-triggered browsing</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-white/80">Google-Extended</td><td className="px-4 py-2.5">Google</td><td className="px-4 py-2.5">Gemini training (no effect on Search rankings)</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-white/80">ClaudeBot / anthropic-ai</td><td className="px-4 py-2.5">Anthropic</td><td className="px-4 py-2.5">Training and crawling</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-white/80">CCBot</td><td className="px-4 py-2.5">Common Crawl</td><td className="px-4 py-2.5">Dataset used by many AI companies</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-white/80">PerplexityBot</td><td className="px-4 py-2.5">Perplexity</td><td className="px-4 py-2.5">Search retrieval and citations</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-white/80">Bytespider</td><td className="px-4 py-2.5">ByteDance</td><td className="px-4 py-2.5">Training</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-white/80">Meta-ExternalAgent</td><td className="px-4 py-2.5">Meta</td><td className="px-4 py-2.5">AI products</td></tr>
            </tbody>
          </table>
        </div>
        <p className={pCls}>
          The generator above has a one-click panel for blocking training
          crawlers. Verify each provider's current documentation before
          publishing, because bot names and behavior keep changing.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Write it, test it, ship it</h2>
        <p className={pCls}>
          Never publish a robots.txt change without testing. In Google Search
          Console, open Settings and the robots.txt report to see the exact
          version Google last fetched, then test individual URLs against your
          rules. Bing Webmaster Tools has its own tester. Manually, load
          https://yourdomain.com/robots.txt in a browser and confirm it serves
          plain text with a 200 status. Then watch coverage and crawl stats
          for a week. This is the one file that can turn off all of Google
          with a single misplaced slash, so it deserves the care of a deploy.
        </p>
        <p className={pCls}>
          Continue with the{' '}
          <a href="/tools/xml-sitemap-generator" className="text-primary underline underline-offset-2 hover:opacity-80">
            XML Sitemap Generator
          </a>{' '}
          for the sitemap your file points to, the{' '}
          <a href="/tools/bulk-redirect-generator" className="text-primary underline underline-offset-2 hover:opacity-80">
            Bulk Redirect Generator
          </a>{' '}
          for migration-safe URL changes, and the{' '}
          <a href="/tools/title-tag-preview" className="text-primary underline underline-offset-2 hover:opacity-80">
            Title Tag Preview
          </a>{' '}
          to polish what searchers see once crawlers reach your pages.
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className={h2Cls}>Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-white/[0.06]">
          {faqs.map((f, i) => (
            <div key={i} className="py-4">
              <h3 className="text-[15px] font-bold text-white/90">{f.q}</h3>
              <p className="mt-2 text-sm leading-[1.8] text-white/60">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
