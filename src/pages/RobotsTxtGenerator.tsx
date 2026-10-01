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
      </div>
    </main>
  );
}
