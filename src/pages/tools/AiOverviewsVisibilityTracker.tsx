import React, { useEffect, useMemo, useRef, useState } from "react";

/*
  AI Overviews Visibility Tracker by RankVelt (rankvelt.com)
  A guided manual AI Overview tracker. No server, no signup.
  All data is stored in the visitor's browser (localStorage).
  Plan: rankvelt-ai-overviews-manual-tracker-plan-oct2026.md
*/

const STORAGE_KEY = "rankvelt_aio_tracker_v1";
const DRAFT_KEY = "rankvelt_aio_tracker_draft_v1";
const TOOL_URL = "https://www.rankvelt.com/tools/ai-overviews-visibility-tracker";

type Prominence = "first" | "among" | "last" | "";
type Accuracy = "correct" | "partly" | "wrong" | "";

interface Competitor {
  id: string;
  name: string;
  domain: string;
}

interface QueryItem {
  id: string;
  text: string;
  targetUrl: string;
  tag: string;
}

interface Check {
  overview: boolean | null;
  cited: boolean | null;
  mentioned: boolean | null;
  prominence: Prominence;
  accuracy: Accuracy;
  accuracyNote: string;
  citedUrl: string;
  competitorIds: string[];
  otherDomains: string;
  note: string;
}

interface Session {
  id: string;
  dateISO: string;
  surface: string;
  country: string;
  device: string;
  signedIn: string;
  checks: Record<string, Check>;
}

interface Project {
  id: string;
  brand: string;
  domain: string;
  market: string;
  competitors: Competitor[];
  queries: QueryItem[];
  sessions: Session[];
}

interface TrackerData {
  version: number;
  activeProjectId: string;
  projects: Project[];
}

const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

const emptyCheck = (): Check => ({
  overview: null,
  cited: null,
  mentioned: null,
  prominence: "",
  accuracy: "",
  accuracyNote: "",
  citedUrl: "",
  competitorIds: [],
  otherDomains: "",
  note: "",
});

function sampleProject(): Project {
  const compA: Competitor = { id: "c1", name: "PipePro Local", domain: "pipeprolocal.com" };
  const compB: Competitor = { id: "c2", name: "City Plumb Co", domain: "cityplumbco.com" };
  const qs: QueryItem[] = [
    { id: "q1", text: "best plumber in dallas", targetUrl: "", tag: "service" },
    { id: "q2", text: "how to fix a leaking water heater", targetUrl: "", tag: "problem" },
    { id: "q3", text: "emergency plumber near me", targetUrl: "", tag: "service" },
    { id: "q4", text: "how much does drain cleaning cost", targetUrl: "", tag: "problem" },
    { id: "q5", text: "tankless vs tank water heater", targetUrl: "", tag: "comparison" },
    { id: "q6", text: "plumber for burst pipe dallas", targetUrl: "", tag: "service" },
    { id: "q7", text: "why is my water bill so high", targetUrl: "", tag: "problem" },
    { id: "q8", text: "best plumbing company for remodels", targetUrl: "", tag: "comparison" },
  ];
  const mk = (
    overview: boolean,
    cited: boolean,
    mentioned: boolean,
    prominence: Prominence,
    accuracy: Accuracy,
    competitorIds: string[]
  ): Check => ({
    ...emptyCheck(),
    overview,
    cited,
    mentioned,
    prominence,
    accuracy,
    competitorIds,
  });
  const prev: Session = {
    id: "s1",
    dateISO: new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10),
    surface: "AI Overviews",
    country: "United States",
    device: "Desktop",
    signedIn: "Signed out",
    checks: {
      q1: mk(true, false, true, "among", "correct", ["c1"]),
      q2: mk(true, true, true, "first", "correct", []),
      q3: mk(true, false, false, "", "", ["c1", "c2"]),
      q4: mk(true, false, true, "last", "partly", ["c2"]),
      q5: mk(false, false, false, "", "", []),
      q6: mk(true, true, true, "among", "correct", ["c1"]),
      q7: mk(true, false, false, "", "", ["c2"]),
      q8: mk(true, false, true, "among", "correct", ["c1"]),
    },
  };
  const curr: Session = {
    id: "s2",
    dateISO: new Date().toISOString().slice(0, 10),
    surface: "AI Overviews",
    country: "United States",
    device: "Desktop",
    signedIn: "Signed out",
    checks: {
      q1: mk(true, true, true, "first", "correct", ["c1"]),
      q2: mk(true, true, true, "first", "correct", []),
      q3: mk(true, false, false, "", "", ["c1"]),
      q4: mk(true, false, true, "among", "correct", ["c2"]),
      q5: mk(true, false, true, "last", "correct", ["c2"]),
      q6: mk(true, false, true, "among", "correct", ["c1"]),
      q7: mk(true, false, false, "", "", ["c1", "c2"]),
      q8: mk(true, false, true, "among", "partly", ["c1"]),
    },
  };
  return {
    id: "sample",
    brand: "Sunrise Plumbing (Sample)",
    domain: "sunriseplumbing.example",
    market: "Dallas, United States",
    competitors: [compA, compB],
    queries: qs,
    sessions: [prev, curr],
  };
}

function blankProject(): Project {
  return {
    id: uid(),
    brand: "",
    domain: "",
    market: "",
    competitors: [],
    queries: [],
    sessions: [],
  };
}

function loadData(): TrackerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TrackerData;
      if (parsed && parsed.version === 1 && Array.isArray(parsed.projects) && parsed.projects.length) {
        return parsed;
      }
    }
  } catch (e) {
    /* storage unavailable or corrupted: fall through to a fresh start */
  }
  const sample = sampleProject();
  return { version: 1, activeProjectId: sample.id, projects: [sample] };
}

interface Metrics {
  checked: number;
  withOverview: number;
  presenceRate: number;
  citationRate: number;
  mentionRate: number;
  score: number | null;
  yourCitations: number;
  competitorCitations: number;
  shareOfVoice: number | null;
  firstShare: number | null;
  accuracyRate: number | null;
  accuracyIssues: { query: string; level: string; note: string }[];
}

function computeMetrics(project: Project, session: Session | undefined): Metrics {
  const out: Metrics = {
    checked: 0,
    withOverview: 0,
    presenceRate: 0,
    citationRate: 0,
    mentionRate: 0,
    score: null,
    yourCitations: 0,
    competitorCitations: 0,
    shareOfVoice: null,
    firstShare: null,
    accuracyRate: null,
    accuracyIssues: [],
  };
  if (!session) return out;
  let cited = 0;
  let mentioned = 0;
  let appearances = 0;
  let firsts = 0;
  let accTotal = 0;
  let accCorrect = 0;
  for (const q of project.queries) {
    const c = session.checks[q.id];
    if (!c || c.overview === null) continue;
    out.checked += 1;
    if (!c.overview) continue;
    out.withOverview += 1;
    if (c.cited) {
      cited += 1;
      out.yourCitations += 1;
    }
    if (c.mentioned) mentioned += 1;
    if (c.cited || c.mentioned) {
      appearances += 1;
      if (c.prominence === "first") firsts += 1;
    }
    if (c.competitorIds && c.competitorIds.length) {
      out.competitorCitations += c.competitorIds.length;
    }
    if (c.mentioned && c.accuracy) {
      accTotal += 1;
      if (c.accuracy === "correct") accCorrect += 1;
      else
        out.accuracyIssues.push({
          query: q.text,
          level: c.accuracy === "wrong" ? "Wrong" : "Partly wrong",
          note: c.accuracyNote || "",
        });
    }
  }
  if (out.checked) out.presenceRate = Math.round((out.withOverview / out.checked) * 100);
  if (out.withOverview) {
    out.citationRate = Math.round((cited / out.withOverview) * 100);
    out.mentionRate = Math.round((mentioned / out.withOverview) * 100);
    out.score = Math.round(out.citationRate * 0.7 + out.mentionRate * 0.3);
  }
  const sovBase = out.yourCitations + out.competitorCitations;
  if (sovBase) out.shareOfVoice = Math.round((out.yourCitations / sovBase) * 100);
  if (appearances) out.firstShare = Math.round((firsts / appearances) * 100);
  if (accTotal) out.accuracyRate = Math.round((accCorrect / accTotal) * 100);
  return out;
}

function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const csvCell = (v: string | number) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const STARTER_TEMPLATES: { label: string; items: string[] }[] = [
  {
    label: "Category questions",
    items: ["best [service] in [city]", "best [service] company near me", "top rated [service] in [city]"],
  },
  {
    label: "Problem questions",
    items: ["how to fix [common problem]", "why does [problem] happen", "how much does [service] cost"],
  },
  {
    label: "Comparison questions",
    items: ["[your brand] vs [competitor]", "[option a] vs [option b]", "is [your brand] good for [use case]"],
  },
];

const CSS = `
.aio-wrap{--cream:#FBF6EE;--teal:#0E7C7B;--teal-dark:#0A5E5D;--navy:#0F2A43;--amber:#E8A33D;--ink:#22303C;--muted:#5C6B76;--line:#E7DCC8;--card:#FFFFFF;max-width:1080px;margin:0 auto;padding:24px 16px 56px;font-family:inherit;color:var(--ink)}
.aio-wrap *{box-sizing:border-box}
.aio-hero{background:var(--navy);color:#fff;border-radius:16px;padding:28px 26px;margin-bottom:18px}
.aio-hero h1{margin:0 0 8px;font-size:30px;line-height:1.2;color:#fff}
.aio-hero p{margin:0;color:#D7E3EC;font-size:16px;max-width:720px}
.aio-badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.aio-badge{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:999px;padding:4px 12px;font-size:13px}
.aio-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}
.aio-tab{border:1px solid var(--line);background:#fff;border-radius:999px;padding:9px 18px;font-size:15px;cursor:pointer;color:var(--navy)}
.aio-tab.on{background:var(--teal);border-color:var(--teal);color:#fff;font-weight:600}
.aio-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;margin-bottom:16px}
.aio-card h2{margin:0 0 10px;font-size:21px;color:var(--navy)}
.aio-card h3{margin:14px 0 6px;font-size:17px;color:var(--navy)}
.aio-card p{margin:0 0 10px;line-height:1.55}
.aio-muted{color:var(--muted);font-size:14px}
.aio-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}
.aio-metric{background:var(--cream);border:1px solid var(--line);border-radius:12px;padding:16px}
.aio-metric .num{font-size:32px;font-weight:700;color:var(--navy)}
.aio-metric .lbl{font-size:14px;color:var(--muted)}
.aio-metric .delta{font-size:13px;margin-top:4px}
.aio-up{color:var(--teal-dark);font-weight:600}
.aio-down{color:#B3543F;font-weight:600}
.aio label{display:block;font-size:14px;font-weight:600;color:var(--navy);margin:12px 0 5px}
.aio input[type=text],.aio input[type=url],.aio textarea,.aio select{width:100%;border:1px solid var(--line);border-radius:9px;padding:10px 12px;font-size:15px;background:#fff;color:var(--ink)}
.aio textarea{min-height:90px}
.aio-btn{background:var(--teal);color:#fff;border:none;border-radius:10px;padding:11px 20px;font-size:15px;font-weight:600;cursor:pointer}
.aio-btn:hover{background:var(--teal-dark)}
.aio-btn.sec{background:#fff;color:var(--teal-dark);border:1px solid var(--teal)}
.aio-btn.ghost{background:#fff;color:var(--navy);border:1px solid var(--line)}
.aio-btn.amber{background:var(--amber);color:var(--navy)}
.aio-btn:disabled{opacity:.5;cursor:not-allowed}
.aio-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.aio-qrow{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin-bottom:8px;background:#fff}
.aio-qrow .grow{flex:1}
.aio-pill{display:inline-block;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:600}
.aio-pill.cited{background:#DFF2EF;color:var(--teal-dark)}
.aio-pill.mention{background:#FBEED3;color:#7A5510}
.aio-pill.absent{background:#F6E3DE;color:#8C4232}
.aio-pill.none{background:#EFEDE8;color:var(--muted)}
.aio-big{width:100%;text-align:left;border:2px solid var(--line);background:#fff;border-radius:12px;padding:14px 16px;font-size:16px;cursor:pointer;margin-bottom:8px}
.aio-big.on{border-color:var(--teal);background:#EFF7F6;font-weight:600}
.aio-prog{height:10px;background:#EFE9DB;border-radius:99px;overflow:hidden;margin:10px 0 16px}
.aio-prog i{display:block;height:100%;background:var(--teal)}
.aio-table{width:100%;border-collapse:collapse;font-size:14px}
.aio-table th,.aio-table td{border-bottom:1px solid var(--line);padding:8px 6px;text-align:left;vertical-align:top}
.aio-saved{font-size:13px;color:var(--teal-dark)}
.aio-toast{background:var(--navy);color:#fff;border-radius:10px;padding:10px 16px;font-size:14px}
.aio-article{max-width:820px;margin:34px auto 0}
.aio-article h2{color:var(--navy);font-size:24px;margin:30px 0 10px}
.aio-article h3{color:var(--navy);font-size:18px;margin:20px 0 6px}
.aio-article p{line-height:1.65;margin:0 0 12px}
.aio-article a{color:var(--teal-dark);font-weight:600}
.aio-faq{border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin-bottom:8px;background:#fff}
.aio-faq summary{cursor:pointer;font-weight:600;color:var(--navy)}
.aio-report{background:#fff}
@media print{body *{visibility:hidden}#aio-report,#aio-report *{visibility:visible}#aio-report{position:absolute;left:0;top:0;width:100%;padding:24px}}
`;

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this AI overview tracker really free?",
    a: "Yes. It is free, needs no signup, and stores your data in your own browser. Nothing is locked behind an email form.",
  },
  {
    q: "Does the tool check Google automatically?",
    a: "No, and it says so openly. Google offers no API for AI Overview data, so this tool guides your manual check instead. You see exactly what a real searcher sees, and the tool handles the scoring, trends and reports.",
  },
  {
    q: "How do I track my rankings in AI Overviews?",
    a: "AI Overviews do not have classic rankings. What you track instead is whether an Overview appears, whether you are cited, whether your brand is mentioned, how prominent you are, and who else is cited. This tool records all five in a guided weekly check.",
  },
  {
    q: "What is the best AI overviews rank tracker?",
    a: "It depends on your scale. Paid platforms suit teams tracking hundreds of questions across markets. For a small business or a single brand, a guided manual tracker like this one gives honest data at zero cost. Our blog compares the leading paid options in detail.",
  },
  {
    q: "How many questions should I track?",
    a: "Twenty to forty buyer questions is the sweet spot. Fewer makes trends unreliable. More makes the weekly habit hard to keep.",
  },
  {
    q: "How often should I check?",
    a: "Once a week, on the same day, under the same conditions. AI answers change too often for daily checks to mean much, and monthly checks miss movement you could have acted on.",
  },
  {
    q: "Can I use the reports with clients?",
    a: "Yes. The report and CSV exports are designed to be shared. They show the method, the conditions, the sample size and full RankVelt branding, so the reader can judge the data properly.",
  },
  {
    q: "What is a good AI Visibility Score?",
    a: "There is no universal good score, because markets differ. A rising trend across four to six weekly checks matters more than any single number. Treat early data, under twenty checks, as a starting picture rather than a verdict.",
  },
];

function ArticleContent() {
  return (
    <div className="aio-article">
      <h2>What Is an AI Overview Tracker?</h2>
      <p>An AI overview tracker is a tool that records how your business appears inside Google AI Overviews. It answers three simple questions.</p>
      <p>Did an AI Overview appear for your important searches? Were you cited as a source? Was your brand mentioned in the answer?</p>
      <p>This tracker does that job in a guided way. You check your key questions on Google, tap what you see, and the tool turns your checks into scores, trends and a clear action list.</p>
      <p>No signup. No cost. Your data stays in your browser.</p>
      <p>If you are new to the topic, start with our plain English guide on <a href="/blog/google-ai-overviews-how-it-works">how Google AI Overviews work</a>. Then come back and start tracking.</p>

      <h2>Why Tracking AI Overviews Matters Now</h2>
      <p>Search results are changing fast. For many questions, Google now answers at the top of the page with AI. The user often gets what they need without clicking any website.</p>
      <p>That changes what visibility means. A page can rank well and still be invisible, because the AI answer above it names other businesses and cites other sources. If you only watch classic rankings, you are watching half the picture.</p>
      <p>Citations are the new shelf space. When an AI Overview cites your page, your brand sits inside the answer itself. When it cites a competitor, that competitor gets the trust and, often, the customer.</p>
      <p>Our guide on <a href="/blog/show-up-in-google-ai-overviews">how to show up in Google AI Overviews</a> covers the tactics. This tracker covers the measurement, and measurement is what tells you if the tactics are working.</p>

      <h2>Why This Tracker Is Manual, and Why That Is a Strength</h2>
      <p>You may wonder why this tool does not fetch Google results by itself. The honest answer is simple. Google does not provide AI Overview data through any official API.</p>
      <p>Tools that show automatic data buy it from third party data providers, and the good ones charge for it, often from around 29 dollars a month and well beyond.</p>
      <p>There is a second problem, and it matters more. AI answers are not stable. In a widely reported study by SparkToro and Gumshoe, volunteers ran the same questions thousands of times, and the same list of brands appeared in the same order only about once in a thousand runs.</p>
      <p>One automatic snapshot can look precise and still mean very little.</p>
      <p>A guided manual check solves both problems. It costs nothing. It shows you exactly what a real searcher sees on a real device, in your real market.</p>
      <p>And when you repeat the same check every week, the pattern you build is worth more than any single snapshot. For the full method behind this thinking, read our guide on <a href="/blog/monitor-google-ai-overviews-performance">how to monitor Google AI Overviews performance</a>.</p>

      <h2>How to Use This AI Overviews Tracking Tool</h2>
      <h3>Step 1: Set up your project</h3>
      <p>Add your brand name, your website, and your market. Then add up to three competitors you actually compete with. This takes under a minute, and everything saves automatically as you type.</p>
      <h3>Step 2: Build your query bank</h3>
      <p>Add the questions your customers really ask. Twenty to forty questions is the sweet spot for most businesses. Fewer makes the data thin. More makes the weekly check a burden.</p>
      <p>Mix three kinds of questions. Category questions, like the best service in your city. Problem questions, like how to fix a common issue. And comparison questions, where buyers weigh their options.</p>
      <p>Your best sources are your own data: Search Console queries, sales calls, and the questions customers ask before they buy.</p>
      <h3>Step 3: Run a guided check</h3>
      <p>The tool walks you through one question at a time. Open the search on Google, look at the AI Overview, and tap what you see.</p>
      <p>Did an Overview appear? Are you cited? Is your brand mentioned? Who got cited instead?</p>
      <p>At the start of each session you set your conditions once: your country, your device, and whether you are signed in. Keeping conditions the same makes each week comparable with the last. A twenty question check takes about ten to twelve minutes.</p>
      <h3>Step 4: Read your dashboard</h3>
      <p>Your answers become five numbers, explained in the next section. You also see your trend against the previous session, your share of voice against competitors, and an action list built from your own results. Wins, gaps and lost citations are separated, so you know what to fix first.</p>
      <h3>Step 5: Export your report</h3>
      <p>Download your data as CSV, or open the report view and save a clean PDF from your browser. Every export carries full RankVelt branding and your session details, so the report is ready to share with a partner, a manager or a client.</p>

      <h2>The Five Numbers That Matter</h2>
      <p><strong>AI Overview presence.</strong> The share of your checked questions where an AI Overview appeared at all. This tells you how much of your market Google is answering with AI.</p>
      <p><strong>Citation rate.</strong> The share of those Overviews where your site was cited as a source. This is the strongest signal, because a citation puts your page inside the answer.</p>
      <p><strong>Mention rate.</strong> The share where your brand was named in the answer text, with or without a citation. Mentions build familiarity even when they do not send a click today.</p>
      <p><strong>Share of voice.</strong> Your citations compared with competitor citations across the same set of questions. It answers the only competitive question that matters: inside AI answers, who is winning your topic?</p>
      <p><strong>Prominence and accuracy.</strong> How high you appear in the answer, first, among others, or last. And whether what the AI says about you is correct.</p>
      <p>A wrong price, old opening hours or a service you no longer offer is not a statistic. It is a fix waiting to happen, and this tracker lists each one for you.</p>
      <p>These five numbers combine into your AI Visibility Score. The formula is shown openly inside the tool: citations weigh seventy percent, mentions thirty percent, scored only across questions where an AI Overview actually appeared. No mystery math.</p>

      <h2>How to Choose the Right Questions to Track</h2>
      <p>Good tracking starts with good questions. A list of your brand name searched fifty ways tells you almost nothing. Buyers do not search that way.</p>
      <p>Start with money questions. What do people ask right before they spend in your category? Add the questions where competitors keep appearing in AI answers. Add a small set of local questions if you serve a city or region.</p>
      <p>Write each question the way a customer would type or say it. Then keep the wording exactly the same every week. Changing the words changes the answer, and broken wording breaks your trend.</p>
      <p>If a question never triggers an AI Overview after several checks, retire it and replace it. Our 8 step guide on <a href="/blog/optimize-google-ai-overviews">how to rank in Google AI Overviews</a> will help you improve the pages behind the questions you keep.</p>

      <h2>The Weekly Ten Minute Routine</h2>
      <p>Consistency beats intensity. A short check every week tells you more than a giant check once a quarter, because AI answers move constantly and only repeated checks separate a pattern from a fluke.</p>
      <p>Pick a fixed day. Run the same questions, under the same conditions, in the same order. Look at the trend first, not at single questions.</p>
      <p>One lost citation is noise. The same gap four weeks in a row is a job to do.</p>
      <p>Avoid daily checking. It mostly creates stress and false alarms. And avoid judging a change after one session. Give every fix at least two or three sessions to show its effect before you decide it failed.</p>
      <p>For local businesses, pair this routine with consistent listings. AI systems cross check your business details across directories before they trust you in an answer, which is why our guide on <a href="/blog/local-seo-citations-ai-overviews">local SEO citations for AI Overviews</a> belongs in the same workflow.</p>

      <h2>AI Mode Tracking: The Next Surface</h2>
      <p>Google is rolling out AI Mode, a fuller AI search experience that sits beside classic results and AI Overviews. It answers in a more conversational way, and it can cite different sources for the same question. If you want the differences explained simply, read our comparison of <a href="/blog/ai-overviews-vs-ai-mode">AI Overviews vs AI Mode</a>.</p>
      <p>This is why AI mode tracker searches are growing while competition on them is still very low. The habit you build here transfers directly. The same questions, the same conditions, the same five numbers.</p>
      <p>Sessions in this tool record which surface you checked, so AI Mode results never get mixed into your AI Overviews trend.</p>
      <p>Start with AI Overviews, because that is where most buyers are today. Add AI Mode checks for your top ten questions when you are ready. Two surfaces, one routine, one honest picture.</p>

      <h2>Common Mistakes When Tracking AI Overviews</h2>
      <p><strong>Tracking too many questions.</strong> Two hundred questions sounds serious and guarantees the habit dies. Start with twenty to forty that carry real buying intent.</p>
      <p><strong>Changing the wording.</strong> Slightly different words produce different answers. Lock the wording once a question has history, and let the trend stay clean.</p>
      <p><strong>Treating one check as a verdict.</strong> AI answers vary from run to run. Report rates and trends, never single screenshots, when you explain results to anyone.</p>
      <p><strong>Only tracking easy questions.</strong> If every question is one you already win, the dashboard becomes a comfort blanket. Keep the hard competitive questions in the bank. That is where the value hides.</p>
      <p><strong>Ignoring who got cited instead.</strong> Every competitor citation is a free lesson. Open the cited page and ask what it answers that yours does not. That single habit improves content faster than any trick.</p>
      <p><strong>Never acting on the data.</strong> A tracker is not the goal. The goal is the short fix list it produces each week: a page to improve, a fact to correct, a gap to close.</p>

      <h2>Who This Tool Is For</h2>
      <p><strong>Business owners</strong> who want to know, in plain numbers, whether AI answers mention them or their competitors, without buying an enterprise platform.</p>
      <p><strong>Freelancers and small agencies</strong> who need client ready AI visibility reports. The exports are fully branded and method transparent, so a client can trust what they are reading.</p>
      <p><strong>In house marketers</strong> who already track rankings and need the AI layer beside them, in the same weekly rhythm.</p>
      <p>If your site itself is not ready to be cited, tracking will show that too. Run our free <a href="/tools/aeo-readiness-checker">AEO Readiness Checker</a> to see how your pages read to AI systems, then fix the basics before you judge your scores.</p>

      <h2>Free Manual Tracking vs Paid AI Overview Trackers</h2>
      <p>Paid trackers have a real place. If you manage hundreds of questions across many countries, or many client accounts, automation saves serious time, and the better platforms add history, alerts and team features.</p>
      <p>They also have limits worth knowing. They sample answers through data providers, so their snapshot may not match what your customers see. Their scores are often black boxes. And their cost adds up every single month, whether you act on the data or not.</p>
      <p>This free ai overviews tracking tool takes the other trade. You spend ten minutes a week. In return you get data you collected yourself, formulas you can read, and reports you can share.</p>
      <p>Many small businesses honestly need nothing more. When you outgrow it, our comparison of the <a href="/blog/ai-overviews-rank-tracking-tools">best AI Overviews rank tracking tools</a> will help you choose the paid step with open eyes.</p>

      <h2>Turn Tracking Into Results</h2>
      <p>A dashboard alone changes nothing. What changes results is the loop: track, fix, track again.</p>
      <p>When a competitor keeps winning a question, study the cited page and improve yours with a clearer, more direct answer. When the AI states a wrong fact about you, fix the source it is reading, starting with your own site and your main listings. When you are mentioned but never cited, your pages need better structure: direct answers near the top, clean headings, and facts that are easy to quote.</p>
      <p>That is the work RankVelt does for clients every week. If you would rather hand it over, our <a href="/ai-seo-agency">AI SEO agency</a> service covers AI visibility tracking, content fixes and citation building, with plain language reporting from 525 dollars per month.</p>
      <p>And if you would rather keep doing it yourself, this tool stays free. Either way, start with one honest baseline check this week. Next week, you will already know more than most of your competitors.</p>

      <h2>Frequently Asked Questions</h2>
      {FAQS.map((f) => (
        <div className="aio-faq" key={f.q}>
          <details>
            <summary>{f.q}</summary>
            <p style={{ marginTop: 8 }}>{f.a}</p>
          </details>
        </div>
      ))}
    </div>
  );
}

interface Draft {
  projectId: string;
  surface: string;
  country: string;
  device: string;
  signedIn: string;
  index: number;
  checks: Record<string, Check>;
}

export default function AiOverviewsVisibilityTracker() {
  const [data, setData] = useState<TrackerData>(() => loadData());
  const [tab, setTab] = useState<string>("dashboard");
  const [savedAt, setSavedAt] = useState<string>("");
  const [draft, setDraft] = useState<Draft | null>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? (JSON.parse(raw) as Draft) : null;
    } catch (e) {
      return null;
    }
  });
  const [cur, setCur] = useState<Check>(emptyCheck());
  const [bulkText, setBulkText] = useState("");
  const [bulkMsg, setBulkMsg] = useState("");
  const [newQ, setNewQ] = useState({ text: "", targetUrl: "", tag: "" });
  const [newComp, setNewComp] = useState({ name: "", domain: "" });
  const [deleted, setDeleted] = useState<{ q: QueryItem; idx: number } | null>(null);
  const [filter, setFilter] = useState("all");
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const project: Project =
    data.projects.find((p) => p.id === data.activeProjectId) || data.projects[0];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavedAt(new Date().toLocaleTimeString());
    } catch (e) {
      /* storage full or blocked: the tool keeps working in memory */
    }
  }, [data]);

  useEffect(() => {
    try {
      if (draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      else localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      /* ignore */
    }
  }, [draft]);

  useEffect(() => {
    document.title = "AI Overviews Visibility Tracker: Free Tool | RankVelt";
    const desc =
      "Track your AI Overview citations and brand mentions with a guided manual check. Scores, trends and client ready reports. Free, no signup.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
    const ld = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    let script = document.getElementById("aio-faq-schema") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "aio-faq-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }, []);

  const updateProject = (fn: (p: Project) => Project) => {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === project.id ? fn({ ...p }) : p)),
    }));
  };

  const latest = project.sessions[project.sessions.length - 1];
  const previous = project.sessions[project.sessions.length - 2];
  const m = useMemo(() => computeMetrics(project, latest), [project, latest]);
  const pm = useMemo(() => computeMetrics(project, previous), [project, previous]);
  const totalChecks = project.sessions.reduce(
    (n, s) => n + Object.values(s.checks).filter((c) => c.overview !== null).length,
    0
  );

  const statusOf = (q: QueryItem): { label: string; cls: string } => {
    if (!latest) return { label: "Not checked", cls: "none" };
    const c = latest.checks[q.id];
    if (!c || c.overview === null) return { label: "Not checked", cls: "none" };
    if (!c.overview) return { label: "No Overview", cls: "none" };
    if (c.cited) return { label: "Cited", cls: "cited" };
    if (c.mentioned) return { label: "Mention only", cls: "mention" };
    return { label: "Absent", cls: "absent" };
  };

  const actions = useMemo(() => {
    const list: string[] = [];
    if (!latest) return list;
    const prevById = previous ? previous.checks : {};
    const lost: string[] = [];
    const mentionNoCite: string[] = [];
    const tagGaps: Record<string, number> = {};
    const compCount: Record<string, number> = {};
    for (const q of project.queries) {
      const c = latest.checks[q.id];
      if (!c || !c.overview) continue;
      const pc = prevById[q.id];
      if (pc && pc.cited && !c.cited) lost.push(q.text);
      if (c.mentioned && !c.cited) mentionNoCite.push(q.text);
      if (!c.cited && !c.mentioned && c.competitorIds.length) {
        const t = q.tag || "general";
        tagGaps[t] = (tagGaps[t] || 0) + 1;
      }
      for (const cid of c.competitorIds) compCount[cid] = (compCount[cid] || 0) + 1;
    }
    for (const t of Object.keys(tagGaps)) {
      if (tagGaps[t] >= 2)
        list.push(
          "Content gap on " + t + ": competitors were cited on " + tagGaps[t] +
          " questions where you were absent. Study what the cited pages answer that yours does not."
        );
    }
    if (mentionNoCite.length >= 3)
      list.push(
        "Your brand is mentioned but not cited on " + mentionNoCite.length +
        " questions. Your entity signals are working, but your pages are not being picked as sources. Check page structure, headings and direct answers."
      );
    for (const q of lost)
      list.push("Citation lost on \"" + q + "\". Re check the page: has it changed, slowed down, or been out answered?");
    if (m.withOverview >= 5 && m.citationRate < 20)
      list.push(
        "AI answers appear across your topic (presence " + m.presenceRate + " percent) but your citation rate is only " +
        m.citationRate + " percent. This is the highest value work in your account right now."
      );
    const topComp = Object.entries(compCount).sort((a, b) => b[1] - a[1])[0];
    if (topComp && m.shareOfVoice !== null && m.shareOfVoice < 50) {
      const comp = project.competitors.find((c) => c.id === topComp[0]);
      if (comp)
        list.push(
          "Competitor watch: " + comp.name + " collected " + topComp[1] +
          " citations in this session and leads your tracked set. Open their cited pages and compare."
        );
    }
    return list;
  }, [project, latest, previous, m]);

  const startDraft = () => {
    const lastS = latest;
    setDraft({
      projectId: project.id,
      surface: lastS ? lastS.surface : "AI Overviews",
      country: lastS ? lastS.country : project.market || "",
      device: lastS ? lastS.device : "Desktop",
      signedIn: lastS ? lastS.signedIn : "Signed out",
      index: 0,
      checks: {},
    });
    setCur(emptyCheck());
  };

  const wizardQuery = draft ? project.queries[draft.index] : undefined;

  useEffect(() => {
    if (draft && wizardQuery) {
      setCur(draft.checks[wizardQuery.id] ? { ...draft.checks[wizardQuery.id] } : emptyCheck());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.index, draft?.projectId]);

  const saveCurAndMove = (dir: number, save: boolean) => {
    if (!draft || !wizardQuery) return;
    const checks = { ...draft.checks };
    if (save) checks[wizardQuery.id] = { ...cur };
    const next = Math.min(Math.max(draft.index + dir, 0), project.queries.length - 1);
    setDraft({ ...draft, checks, index: next });
  };

  const finishSession = () => {
    if (!draft) return;
    const checks = { ...draft.checks };
    if (wizardQuery && cur.overview !== null) checks[wizardQuery.id] = { ...cur };
    const recorded = Object.values(checks).filter((c) => c.overview !== null).length;
    if (!recorded) return;
    const session: Session = {
      id: uid(),
      dateISO: todayStr(),
      surface: draft.surface,
      country: draft.country,
      device: draft.device,
      signedIn: draft.signedIn,
      checks,
    };
    updateProject((p) => ({ ...p, sessions: [...p.sessions, session] }));
    setDraft(null);
    setTab("dashboard");
  };

  const addQueries = (lines: string[]) => {
    const existing = new Set(project.queries.map((q) => q.text.trim().toLowerCase()));
    let added = 0;
    let skipped = 0;
    const fresh: QueryItem[] = [];
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      if (existing.has(t.toLowerCase())) {
        skipped += 1;
        continue;
      }
      existing.add(t.toLowerCase());
      fresh.push({ id: uid() + added, text: t, targetUrl: "", tag: "" });
      added += 1;
    }
    if (fresh.length) updateProject((p) => ({ ...p, queries: [...p.queries, ...fresh] }));
    return { added, skipped };
  };

  const buildCsv = (branded: boolean): string => {
    const rows: string[][] = [];
    if (branded) {
      rows.push(["AI Overviews Visibility Report"]);
      rows.push(["Prepared with", "RankVelt AI Overviews Visibility Tracker"]);
      rows.push(["Tool", TOOL_URL]);
      rows.push(["Website", "https://www.rankvelt.com"]);
      rows.push(["Email", "info@rankvelt.com"]);
      rows.push(["Phone", "+92 324 4146447"]);
      rows.push(["Project", project.brand || ""]);
      rows.push(["Brand tracked", project.domain || ""]);
      rows.push(["Sessions included", String(project.sessions.length)]);
      rows.push(["Export date", todayStr()]);
      rows.push([]);
    }
    rows.push([
      "Date", "Surface", "Country", "Device", "Signed In", "Query", "Tag", "Target URL",
      "AI Overview Shown", "Cited", "Mentioned", "Prominence", "Accuracy", "Accuracy Note",
      "Cited URL", "Competitors Cited", "Other Cited Domains", "Note", "Generated By", "Tool",
    ]);
    for (const s of project.sessions) {
      for (const q of project.queries) {
        const c = s.checks[q.id];
        if (!c || c.overview === null) continue;
        const compNames = (c.competitorIds || [])
          .map((id) => {
            const cp = project.competitors.find((x) => x.id === id);
            return cp ? cp.name : id;
          })
          .join("; ");
        rows.push([
          s.dateISO, s.surface, s.country, s.device, s.signedIn, q.text, q.tag, q.targetUrl,
          c.overview ? "Yes" : "No",
          c.overview ? (c.cited ? "Yes" : "No") : "",
          c.overview ? (c.mentioned ? "Yes" : "No") : "",
          c.prominence, c.accuracy, c.accuracyNote, c.citedUrl, compNames, c.otherDomains, c.note,
          "RankVelt", TOOL_URL,
        ]);
      }
    }
    return rows.map((r) => r.map(csvCell).join(",")).join("\n");
  };

  const exportJson = () => {
    const payload = {
      generator: {
        tool: "AI Overviews Visibility Tracker",
        toolUrl: TOOL_URL,
        maker: "RankVelt",
        makerWebsite: "https://www.rankvelt.com",
        makerEmail: "info@rankvelt.com",
        exportedAt: new Date().toISOString(),
        formatVersion: 1,
      },
      project,
    };
    downloadFile(
      "rankvelt-ai-overviews-backup-" + todayStr() + ".json",
      JSON.stringify(payload, null, 2),
      "application/json"
    );
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const proj: Project = parsed.project || parsed;
        if (!proj || !Array.isArray(proj.queries) || !Array.isArray(proj.sessions)) throw new Error("shape");
        const withId: Project = { ...proj, id: uid(), competitors: proj.competitors || [] };
        setData((d) => ({ ...d, activeProjectId: withId.id, projects: [...d.projects, withId] }));
        setImportMsg("Backup imported as a new project: " + (withId.brand || "Untitled"));
      } catch (e) {
        setImportMsg("That file could not be read as a tracker backup. Please choose a JSON file exported from this tool.");
      }
    };
    reader.readAsText(file);
  };

  const delta = (now: number | null, before: number | null, suffix: string) => {
    if (now === null || before === null) return null;
    const d = now - before;
    if (d === 0) return <span className="delta">No change vs last session</span>;
    return (
      <span className={"delta " + (d > 0 ? "aio-up" : "aio-down")}>
        {d > 0 ? "Up " : "Down "}{Math.abs(d)}{suffix} vs last session
      </span>
    );
  };

  const filteredQueries = project.queries.filter((q) => {
    if (filter === "all") return true;
    const st = statusOf(q);
    if (filter === "gaps") return st.label === "Absent" || st.label === "Mention only";
    if (filter === "wins") return st.label === "Cited";
    if (filter === "losses") {
      if (!latest || !previous) return false;
      const c = latest.checks[q.id];
      const pc = previous.checks[q.id];
      return !!(pc && pc.cited && c && c.overview && !c.cited);
    }
    return true;
  });

  return (
    <div className="aio-wrap aio">
      <style>{CSS}</style>
      <div className="aio-hero">
        <h1>AI Overviews Visibility Tracker</h1>
        <p>Check whether Google AI Overviews cite and mention your brand. A guided ten minute weekly check that turns into scores, trends and a client ready report.</p>
        <div className="aio-badges">
          <span className="aio-badge">Free forever</span>
          <span className="aio-badge">No signup</span>
          <span className="aio-badge">Data stays in your browser</span>
          <span className="aio-badge">By RankVelt (rankvelt.com)</span>
        </div>
      </div>

      <div className="aio-row" style={{ justifyContent: "space-between" }}>
        <div className="aio-tabs" style={{ margin: 0 }}>
          {[
            ["setup", "1. Project"],
            ["queries", "2. Questions"],
            ["check", "3. Weekly Check"],
            ["dashboard", "4. Dashboard"],
            ["export", "5. Report and Export"],
          ].map(([key, label]) => (
            <button key={key} className={"aio-tab" + (tab === key ? " on" : "")} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>
        <span className="aio-saved">{savedAt ? "Saved " + savedAt : ""}</span>
      </div>

      {tab === "setup" && (
        <div className="aio-card">
          <h2>Your project</h2>
          <p className="aio-muted">One project is one brand in one market. Everything saves automatically in this browser.</p>
          <label>Switch project</label>
          <div className="aio-row">
            <select
              style={{ maxWidth: 340 }}
              value={project.id}
              onChange={(e) => setData((d) => ({ ...d, activeProjectId: e.target.value }))}
            >
              {data.projects.map((p) => (
                <option key={p.id} value={p.id}>{p.brand || "Untitled project"}</option>
              ))}
            </select>
            <button className="aio-btn sec" onClick={() => {
              const np = blankProject();
              setData((d) => ({ ...d, activeProjectId: np.id, projects: [...d.projects, np] }));
            }}>New project</button>
            {!data.projects.some((p) => p.id === "sample") && (
              <button className="aio-btn ghost" onClick={() => {
                const sp = sampleProject();
                setData((d) => ({ ...d, activeProjectId: sp.id, projects: [...d.projects, sp] }));
              }}>Load sample project</button>
            )}
          </div>
          <label>Brand name</label>
          <input type="text" value={project.brand} placeholder="e.g. Sunrise Plumbing"
            onChange={(e) => updateProject((p) => ({ ...p, brand: e.target.value }))} />
          <label>Website domain</label>
          <input type="text" value={project.domain} placeholder="e.g. sunriseplumbing.com"
            onChange={(e) => updateProject((p) => ({ ...p, domain: e.target.value }))} />
          <label>Market (city and country)</label>
          <input type="text" value={project.market} placeholder="e.g. Dallas, United States"
            onChange={(e) => updateProject((p) => ({ ...p, market: e.target.value }))} />
          <h3>Competitors (up to 3)</h3>
          {project.competitors.map((c) => (
            <div className="aio-qrow" key={c.id}>
              <div className="grow"><strong>{c.name}</strong> <span className="aio-muted">{c.domain}</span></div>
              <button className="aio-btn ghost" onClick={() =>
                updateProject((p) => ({ ...p, competitors: p.competitors.filter((x) => x.id !== c.id) }))}>Remove</button>
            </div>
          ))}
          {project.competitors.length < 3 && (
            <div className="aio-row">
              <input type="text" style={{ maxWidth: 240 }} placeholder="Competitor name" value={newComp.name}
                onChange={(e) => setNewComp({ ...newComp, name: e.target.value })} />
              <input type="text" style={{ maxWidth: 240 }} placeholder="Competitor domain" value={newComp.domain}
                onChange={(e) => setNewComp({ ...newComp, domain: e.target.value })} />
              <button className="aio-btn sec" onClick={() => {
                if (!newComp.name.trim()) return;
                updateProject((p) => ({ ...p, competitors: [...p.competitors, { id: uid(), name: newComp.name.trim(), domain: newComp.domain.trim() }] }));
                setNewComp({ name: "", domain: "" });
              }}>Add competitor</button>
            </div>
          )}
          <p className="aio-muted" style={{ marginTop: 12 }}>Privacy: your data never leaves your browser. Export a backup from the Report tab any time.</p>
        </div>
      )}

      {tab === "queries" && (
        <div className="aio-card">
          <h2>Your questions ({project.queries.length})</h2>
          <p className="aio-muted">Twenty to forty buyer questions is the sweet spot. Keep the wording identical every week, or your trend breaks.</p>
          <label>Add one question</label>
          <div className="aio-row">
            <input type="text" style={{ flex: 2 }} placeholder="e.g. best plumber in dallas" value={newQ.text}
              onChange={(e) => setNewQ({ ...newQ, text: e.target.value })} />
            <input type="text" style={{ flex: 1 }} placeholder="Tag (service, problem...)" value={newQ.tag}
              onChange={(e) => setNewQ({ ...newQ, tag: e.target.value })} />
            <button className="aio-btn" onClick={() => {
              if (!newQ.text.trim()) return;
              const r = addQueries([newQ.text.trim()]);
              if (r.added) {
                updateProject((p) => {
                  const qs = [...p.queries];
                  qs[qs.length - 1] = { ...qs[qs.length - 1], tag: newQ.tag.trim() };
                  return { ...p, queries: qs };
                });
                setNewQ({ text: "", targetUrl: "", tag: "" });
              } else setBulkMsg("That question is already in your bank.");
            }}>Add</button>
          </div>
          <label>Or paste a list (one question per line)</label>
          <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder={"best plumber in dallas\nhow to fix a leaking water heater\nemergency plumber near me"} />
          <div className="aio-row" style={{ marginTop: 8 }}>
            <button className="aio-btn sec" onClick={() => {
              const r = addQueries(bulkText.split("\n"));
              setBulkMsg("Added " + r.added + " questions. Skipped " + r.skipped + " duplicates.");
              setBulkText("");
            }}>Add pasted questions</button>
            {bulkMsg && <span className="aio-muted">{bulkMsg}</span>}
          </div>
          <h3>Starter patterns</h3>
          <p className="aio-muted">Tap a pattern set to add it, then edit the words in brackets to fit your business.</p>
          <div className="aio-row">
            {STARTER_TEMPLATES.map((t) => (
              <button key={t.label} className="aio-btn ghost" onClick={() => {
                const r = addQueries(t.items);
                setBulkMsg("Added " + r.added + " pattern questions from " + t.label + ". Edit the bracketed words in each question.");
              }}>{t.label}</button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            {project.queries.map((q, idx) => {
              const st = statusOf(q);
              return (
                <div className="aio-qrow" key={q.id}>
                  <div className="grow">
                    <strong>{q.text}</strong>
                    {q.tag ? <span className="aio-muted"> {" "}({q.tag})</span> : null}
                    <div><span className={"aio-pill " + st.cls}>{st.label}</span></div>
                  </div>
                  <button className="aio-btn ghost" onClick={() => {
                    setDeleted({ q, idx });
                    updateProject((p) => ({ ...p, queries: p.queries.filter((x) => x.id !== q.id) }));
                  }}>Delete</button>
                </div>
              );
            })}
            {project.queries.length === 0 && <p className="aio-muted">No questions yet. Add your first buyer question above.</p>}
          </div>
          {deleted && (
            <div className="aio-toast aio-row" style={{ justifyContent: "space-between", marginTop: 10 }}>
              <span>Deleted: {deleted.q.text}</span>
              <button className="aio-btn amber" onClick={() => {
                updateProject((p) => {
                  const qs = [...p.queries];
                  qs.splice(Math.min(deleted.idx, qs.length), 0, deleted.q);
                  return { ...p, queries: qs };
                });
                setDeleted(null);
              }}>Undo</button>
            </div>
          )}
        </div>
      )}

      {tab === "check" && (
        <div className="aio-card">
          <h2>Weekly check</h2>
          {!draft && (
            <>
              <p>Run the same questions, under the same conditions, once a week. A twenty question check takes about ten to twelve minutes. Use a signed out or private window so you see what a customer sees.</p>
              {project.queries.length === 0 ? (
                <p className="aio-muted">Add questions first in the Questions tab.</p>
              ) : (
                <button className="aio-btn" onClick={startDraft}>Start this week&apos;s check</button>
              )}
              {latest && <p className="aio-muted" style={{ marginTop: 10 }}>Last session: {latest.dateISO} ({latest.surface}, {latest.country}, {latest.device}, {latest.signedIn}).</p>}
            </>
          )}
          {draft && draft.projectId !== project.id && (
            <p className="aio-muted">A check is in progress on another project. Switch back to that project to finish it, or discard it there.</p>
          )}
          {draft && draft.projectId === project.id && wizardQuery && (
            <>
              <div className="aio-row">
                <select style={{ maxWidth: 190 }} value={draft.surface} onChange={(e) => setDraft({ ...draft, surface: e.target.value })}>
                  <option>AI Overviews</option>
                  <option>AI Mode</option>
                </select>
                <input type="text" style={{ maxWidth: 190 }} value={draft.country} placeholder="Country" onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
                <select style={{ maxWidth: 150 }} value={draft.device} onChange={(e) => setDraft({ ...draft, device: e.target.value })}>
                  <option>Desktop</option>
                  <option>Mobile</option>
                </select>
                <select style={{ maxWidth: 160 }} value={draft.signedIn} onChange={(e) => setDraft({ ...draft, signedIn: e.target.value })}>
                  <option>Signed out</option>
                  <option>Signed in</option>
                </select>
              </div>
              <div className="aio-prog"><i style={{ width: Math.round(((draft.index) / Math.max(project.queries.length, 1)) * 100) + "%" }} /></div>
              <p className="aio-muted">Question {draft.index + 1} of {project.queries.length}</p>
              <h3 style={{ fontSize: 22 }}>{wizardQuery.text}</h3>
              <div className="aio-row" style={{ marginBottom: 12 }}>
                <a className="aio-btn sec" style={{ textDecoration: "none" }} target="_blank" rel="noreferrer"
                  href={"https://www.google.com/search?q=" + encodeURIComponent(wizardQuery.text)}>Open this search on Google</a>
              </div>
              <p><strong>Did an AI Overview appear?</strong></p>
              <div className="aio-row">
                <button className={"aio-btn " + (cur.overview === true ? "" : "ghost")} onClick={() => setCur({ ...cur, overview: true })}>Yes</button>
                <button className={"aio-btn " + (cur.overview === false ? "" : "ghost")} onClick={() => setCur({ ...cur, overview: false, cited: null, mentioned: null })}>No</button>
              </div>
              {cur.overview === true && (
                <>
                  <p style={{ marginTop: 14 }}><strong>Were you cited as a source?</strong></p>
                  <div className="aio-row">
                    <button className={"aio-btn " + (cur.cited === true ? "" : "ghost")} onClick={() => setCur({ ...cur, cited: true })}>Yes</button>
                    <button className={"aio-btn " + (cur.cited === false ? "" : "ghost")} onClick={() => setCur({ ...cur, cited: false })}>No</button>
                  </div>
                  <p style={{ marginTop: 14 }}><strong>Was your brand mentioned in the answer?</strong></p>
                  <div className="aio-row">
                    <button className={"aio-btn " + (cur.mentioned === true ? "" : "ghost")} onClick={() => setCur({ ...cur, mentioned: true })}>Yes</button>
                    <button className={"aio-btn " + (cur.mentioned === false ? "" : "ghost")} onClick={() => setCur({ ...cur, mentioned: false })}>No</button>
                  </div>
                  {(cur.cited || cur.mentioned) && (
                    <>
                      <p style={{ marginTop: 14 }}><strong>How prominent were you?</strong></p>
                      <div className="aio-row">
                        {([["first", "First"], ["among", "Among others"], ["last", "Last"]] as [Prominence, string][]).map(([v, l]) => (
                          <button key={v} className={"aio-btn " + (cur.prominence === v ? "" : "ghost")} onClick={() => setCur({ ...cur, prominence: v })}>{l}</button>
                        ))}
                      </div>
                    </>
                  )}
                  {cur.mentioned && (
                    <>
                      <p style={{ marginTop: 14 }}><strong>Was what it said about you correct?</strong></p>
                      <div className="aio-row">
                        {([["correct", "Correct"], ["partly", "Partly wrong"], ["wrong", "Wrong"]] as [Accuracy, string][]).map(([v, l]) => (
                          <button key={v} className={"aio-btn " + (cur.accuracy === v ? "" : "ghost")} onClick={() => setCur({ ...cur, accuracy: v })}>{l}</button>
                        ))}
                      </div>
                      {(cur.accuracy === "partly" || cur.accuracy === "wrong") && (
                        <input type="text" style={{ marginTop: 8 }} placeholder="What was wrong? e.g. old price, wrong hours"
                          value={cur.accuracyNote} onChange={(e) => setCur({ ...cur, accuracyNote: e.target.value })} />
                      )}
                    </>
                  )}
                  {project.competitors.length > 0 && (
                    <>
                      <p style={{ marginTop: 14 }}><strong>Which competitors were cited?</strong></p>
                      <div className="aio-row">
                        {project.competitors.map((c) => {
                          const on = cur.competitorIds.includes(c.id);
                          return (
                            <button key={c.id} className={"aio-btn " + (on ? "" : "ghost")} onClick={() =>
                              setCur({ ...cur, competitorIds: on ? cur.competitorIds.filter((x) => x !== c.id) : [...cur.competitorIds, c.id] })}>
                              {c.name}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <label>Other cited domains (optional, comma separated)</label>
                  <input type="text" value={cur.otherDomains} onChange={(e) => setCur({ ...cur, otherDomains: e.target.value })} placeholder="e.g. angi.com, yelp.com" />
                  <label>Your cited page URL (optional)</label>
                  <input type="text" value={cur.citedUrl} onChange={(e) => setCur({ ...cur, citedUrl: e.target.value })} placeholder="Paste the page of yours that was cited" />
                </>
              )}
              <label>Note (optional)</label>
              <input type="text" value={cur.note} onChange={(e) => setCur({ ...cur, note: e.target.value })} />
              <div className="aio-row" style={{ marginTop: 16 }}>
                <button className="aio-btn ghost" disabled={draft.index === 0} onClick={() => saveCurAndMove(-1, true)}>Back</button>
                <button className="aio-btn ghost" onClick={() => saveCurAndMove(1, false)}>Skip</button>
                {draft.index < project.queries.length - 1 ? (
                  <button className="aio-btn" disabled={cur.overview === null} onClick={() => saveCurAndMove(1, true)}>Save and next</button>
                ) : (
                  <button className="aio-btn" disabled={cur.overview === null && Object.values(draft.checks).every((c) => c.overview === null)} onClick={finishSession}>Finish session</button>
                )}
                <button className="aio-btn ghost" onClick={() => { if (window.confirm("Discard this in progress check? Recorded answers in it will be lost.")) setDraft(null); }}>Discard check</button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "dashboard" && (
        <div>
          {!latest && (
            <div className="aio-card">
              <h2>No checks yet</h2>
              <p>Load the sample project from the Project tab to see a full dashboard, or run your first weekly check. Your scores appear here after the first session.</p>
              <button className="aio-btn" onClick={() => setTab("check")}>Start a check</button>
            </div>
          )}
          {latest && (
            <>
              <div className="aio-grid">
                <div className="aio-metric">
                  <div className="num">{m.score !== null ? m.score : "Not yet"}</div>
                  <div className="lbl">AI Visibility Score (citations 70%, mentions 30%)</div>
                  {delta(m.score, pm.score, "")}
                  {totalChecks < 20 && <div className="delta">Early data: fewer than 20 checks recorded</div>}
                </div>
                <div className="aio-metric">
                  <div className="num">{m.citationRate}%</div>
                  <div className="lbl">Citation rate (of questions with an AI Overview)</div>
                  {delta(m.citationRate, pm.citationRate, "%")}
                </div>
                <div className="aio-metric">
                  <div className="num">{m.mentionRate}%</div>
                  <div className="lbl">Mention rate</div>
                  {delta(m.mentionRate, pm.mentionRate, "%")}
                </div>
                <div className="aio-metric">
                  <div className="num">{m.presenceRate}%</div>
                  <div className="lbl">AI Overview presence ({m.withOverview} of {m.checked} checked)</div>
                  {delta(m.presenceRate, pm.presenceRate, "%")}
                </div>
                <div className="aio-metric">
                  <div className="num">{m.shareOfVoice !== null ? m.shareOfVoice + "%" : "No data"}</div>
                  <div className="lbl">Share of voice vs competitors ({m.yourCitations} yours, {m.competitorCitations} theirs)</div>
                  {delta(m.shareOfVoice, pm.shareOfVoice, "%")}
                </div>
                <div className="aio-metric">
                  <div className="num">{m.accuracyRate !== null ? m.accuracyRate + "%" : "No data"}</div>
                  <div className="lbl">Accuracy of what AI says about you</div>
                  {m.firstShare !== null && <div className="delta">You appear first in {m.firstShare}% of your appearances</div>}
                </div>
              </div>

              {m.accuracyIssues.length > 0 && (
                <div className="aio-card" style={{ marginTop: 16 }}>
                  <h2>Facts to fix</h2>
                  {m.accuracyIssues.map((ai, i) => (
                    <p key={i}><strong>{ai.level}:</strong> {ai.query}{ai.note ? " (" + ai.note + ")" : ""}</p>
                  ))}
                </div>
              )}

              <div className="aio-card" style={{ marginTop: 16 }}>
                <h2>Your action list</h2>
                {actions.length === 0 && <p className="aio-muted">No urgent patterns yet. Keep the weekly rhythm and watch the trend.</p>}
                {actions.map((a, i) => <p key={i}>{a}</p>)}
                <p className="aio-muted">Need this handled for you? RankVelt tracks and improves AI visibility for clients. See the end of this page.</p>
              </div>

              <div className="aio-card">
                <h2>Questions in the latest session ({latest.dateISO}, {latest.surface})</h2>
                <div className="aio-row" style={{ marginBottom: 10 }}>
                  <select style={{ maxWidth: 220 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All questions</option>
                    <option value="wins">Wins (cited)</option>
                    <option value="gaps">Gaps (absent or mention only)</option>
                    <option value="losses">Lost citations</option>
                  </select>
                </div>
                <table className="aio-table">
                  <thead><tr><th>Question</th><th>Status</th><th>Cited page / who was cited</th></tr></thead>
                  <tbody>
                    {filteredQueries.map((q) => {
                      const st = statusOf(q);
                      const c = latest.checks[q.id];
                      const who = c && c.overview
                        ? [
                            c.citedUrl ? "Yours: " + c.citedUrl : "",
                            ...(c.competitorIds || []).map((id) => {
                              const cp = project.competitors.find((x) => x.id === id);
                              return cp ? cp.name : id;
                            }),
                            c.otherDomains || "",
                          ].filter(Boolean).join(" | ")
                        : "";
                      return (
                        <tr key={q.id}>
                          <td>{q.text}</td>
                          <td><span className={"aio-pill " + st.cls}>{st.label}</span></td>
                          <td>{who}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="aio-muted" style={{ marginTop: 10 }}>Sessions so far: {project.sessions.length}. Scores use only the latest session. History lives in your exports.</p>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "export" && (
        <div>
          <div className="aio-card">
            <h2>Report and export</h2>
            <p>Every export carries full RankVelt branding, so the report speaks for itself wherever it goes. The branded CSV opens with a brand block and carries a Generated By column on every row. The clean CSV is a pure data table for re import and your own analysis.</p>
            <div className="aio-row">
              <button className="aio-btn" onClick={() => downloadFile("rankvelt-ai-overviews-report-" + todayStr() + ".csv", buildCsv(true), "text/csv")}>Branded report CSV</button>
              <button className="aio-btn sec" onClick={() => downloadFile("rankvelt-ai-overviews-data-" + todayStr() + ".csv", buildCsv(false), "text/csv")}>Clean data CSV</button>
              <button className="aio-btn sec" onClick={exportJson}>JSON backup</button>
              <button className="aio-btn ghost" onClick={() => fileRef.current && fileRef.current.click()}>Import JSON backup</button>
              <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (f) importJson(f);
              }} />
              <button className="aio-btn amber" onClick={() => window.print()}>Print / save PDF report</button>
            </div>
            {importMsg && <p className="aio-muted" style={{ marginTop: 8 }}>{importMsg}</p>}
          </div>

          <div className="aio-card aio-report" id="aio-report">
            <p style={{ margin: 0 }}><strong style={{ fontSize: 20, color: "#0F2A43" }}>RankVelt</strong> <span className="aio-muted">rankvelt.com</span></p>
            <h2 style={{ marginTop: 6 }}>AI Overviews Visibility Report</h2>
            <p className="aio-muted">
              Project: {project.brand || "Untitled"} ({project.domain})<br />
              {latest ? <>Latest session: {latest.dateISO}, {latest.surface}, {latest.country}, {latest.device}, {latest.signedIn}. </> : "No sessions yet. "}
              Sessions included: {project.sessions.length}. Export date: {todayStr()}.
            </p>
            {latest ? (
              <>
                <table className="aio-table">
                  <tbody>
                    <tr><td><strong>AI Visibility Score</strong></td><td>{m.score !== null ? m.score : "Not enough AI Overview data yet"}</td></tr>
                    <tr><td><strong>Citation rate</strong></td><td>{m.citationRate}%</td></tr>
                    <tr><td><strong>Mention rate</strong></td><td>{m.mentionRate}%</td></tr>
                    <tr><td><strong>AI Overview presence</strong></td><td>{m.presenceRate}% ({m.withOverview} of {m.checked} checked)</td></tr>
                    <tr><td><strong>Share of voice</strong></td><td>{m.shareOfVoice !== null ? m.shareOfVoice + "%" : "No competitor citations recorded"}</td></tr>
                    <tr><td><strong>Accuracy rate</strong></td><td>{m.accuracyRate !== null ? m.accuracyRate + "%" : "No evaluated mentions"}</td></tr>
                  </tbody>
                </table>
                <h3>Action list</h3>
                {actions.length === 0 ? <p>No urgent patterns. Keep the weekly rhythm.</p> : actions.map((a, i) => <p key={i}>{a}</p>)}
                {m.accuracyIssues.length > 0 && (
                  <>
                    <h3>Facts to fix</h3>
                    {m.accuracyIssues.map((ai, i) => <p key={i}>{ai.level}: {ai.query}{ai.note ? " (" + ai.note + ")" : ""}</p>)}
                  </>
                )}
              </>
            ) : (
              <p>Run a weekly check to fill this report with your first scores.</p>
            )}
            <p style={{ marginTop: 18 }}>Want these gaps fixed? RankVelt tracks and improves AI visibility for small businesses. Start with a free SEO Opportunity Check at rankvelt.com.</p>
            <p className="aio-muted">Prepared with RankVelt AI Overviews Visibility Tracker (rankvelt.com/tools/ai-overviews-visibility-tracker) | info@rankvelt.com | +92 324 4146447</p>
          </div>
        </div>
      )}

      <ArticleContent />
    </div>
  );
}
