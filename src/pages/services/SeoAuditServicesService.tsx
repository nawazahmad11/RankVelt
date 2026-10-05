import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const seoAuditServicesConfig: SeoServicePageConfig = {
  slug: "/seo-audit-services",

  metaTitle:
    "SEO Audit Services That Find Growth Blocks | RankVelt",

  metaDescription:
    "RankVelt provides SEO audit services covering technical SEO, content and AI search visibility, so you know what blocks rankings, citations and leads.",

  eyebrow: "SEO Audit Services",

  h1:
    "SEO Audit Services That Show Exactly What Holds Your Website Back",

  intro:
    "RankVelt audits technical SEO, content and AI search visibility. You get a clear, prioritised report of what blocks your rankings, your citations in AI answers and your leads, plus what to fix first.",

  focusAreas: [
    "Technical SEO Audit",
    "AI Search Visibility",
    "Content Review",
    "Prioritised Roadmap",
  ],

  overviewTitle:
    "Know What Is Wrong Before You Spend on Fixes",

  overviewParagraphs: [
    "Many websites lose traffic for fixable reasons. Slow pages, crawl errors, thin content, weak internal links or unclear page purpose all hold rankings back. An audit finds these problems before they cost more.",

    "RankVelt also checks a newer risk. Customers now ask ChatGPT, Perplexity and Google AI Overviews for recommendations. If your business is never cited in those answers, you stay invisible in a growing channel. Our AI SEO audit tests whether AI systems can find, understand and cite your website.",

    "Every audit ends with a prioritised roadmap. Issues are ranked by impact and effort, so you know what to fix first, what can wait and what needs ongoing work.",
  ],

  deliverablesTitle:
    "What an SEO Audit Can Include",

  deliverables: [
    "Technical SEO audit services covering crawlability, indexation, site speed and mobile usability.",
    "Content review for thin pages, duplicate content and weak search intent matching.",
    "AI search visibility check: can ChatGPT, Perplexity and Google AI Overviews find and cite your site?",
    "Entity and brand consistency review across your website and key listings.",
    "Internal linking and site structure analysis.",
    "Competitor gap analysis for rankings and AI citations.",
    "Prioritised fix list ranked by impact and effort.",
  ],

  audienceTitle:
    "An SEO Audit Is a Strong Fit For",

  audience: [
    "Businesses whose traffic dropped without a clear reason.",
    "Companies planning a redesign or migration.",
    "Brands investing in SEO that want an independent second opinion.",
    "Businesses invisible in AI answers despite decent Google rankings.",
    "Teams that need a clear roadmap before hiring ongoing SEO help.",
  ],

  outcomesTitle:
    "What a Good Audit Should Give You",

  outcomes: [
    "A complete picture of technical and content issues.",
    "Clarity on your visibility in AI search answers.",
    "A prioritised list of fixes, not a vague report.",
    "Quick wins you can apply immediately.",
    "A solid starting point for monthly SEO work.",
  ],

  processTitle:
    "A Thorough Audit Process",

  process: [
    {
      step: "01",
      title: "Discover",
      description:
        "RankVelt reviews your website, search visibility, business goals and competitors.",
    },
    {
      step: "02",
      title: "Analyse",
      description:
        "Technical checks, content review and AI citation testing run in parallel.",
    },
    {
      step: "03",
      title: "Prioritise",
      description:
        "Findings are ranked by impact so the most valuable fixes come first.",
    },
    {
      step: "04",
      title: "Report",
      description:
        "You receive a clear report and a walkthrough of what to do next.",
    },
  ],

  faqs: [
    {
      question: "What does an SEO audit include?",
      answer:
        "A RankVelt audit covers technical SEO, content quality, internal linking, competitor gaps and AI search visibility. You receive a prioritised report that explains each issue in plain language and ranks fixes by impact.",
    },
    {
      question: "What is an AI SEO audit?",
      answer:
        "An AI SEO audit checks whether AI systems such as ChatGPT, Perplexity and Google AI Overviews can find, understand and cite your website. It looks at entity clarity, content structure, brand consistency and the signals AI answers rely on when recommending businesses.",
    },
    {
      question: "How long does an SEO audit take?",
      answer:
        "Timing depends on website size and complexity. Most audits are completed within one to two weeks, followed by a walkthrough of the findings.",
    },
    {
      question:
        "Do technical SEO audit services cover my whole website?",
      answer:
        "Yes. Technical SEO audit services review crawlability, indexation, site speed, mobile usability and site structure across the full website, not just the homepage.",
    },
    {
      question: "Will the audit fix the problems it finds?",
      answer:
        "The audit identifies and prioritises every issue. Your team can apply the fixes, or RankVelt can handle them through monthly SEO work starting from $525/month.",
    },
    {
      question: "How much do SEO audit services cost?",
      answer:
        "Audits are quoted per project based on website size and depth. Ongoing SEO starts from $525/month, with a minimum 3 months, then month-to-month. The audit roadmap often becomes the plan for that monthly work.",
    },
    {
      question: "Can an audit lead to monthly SEO work?",
      answer:
        "Yes. Many clients start with an audit because it is low risk. The prioritised roadmap then becomes the foundation for a monthly retainer, so nothing found in the audit goes to waste.",
    },
    {
      question:
        "Do I need an audit if my rankings look fine?",
      answer:
        "Rankings are only part of the picture. A site can rank well on Google yet never appear in AI-generated answers. An audit shows both sides, so you do not miss the channel your customers are moving toward.",
    },
    {
      question:
        "How is an AI SEO audit different from a normal audit?",
      answer:
        "A normal audit focuses on Google rankings. An AI SEO audit adds checks for AI citation readiness: clear entity information, answer-friendly content structure and consistent brand signals across the web. RankVelt covers both in one report.",
    },
  ],

  relatedServices: [
    {
      title: "AI SEO Agency",
      description:
        "Turn audit findings into ongoing AI-first SEO growth.",
      path: "/ai-seo-agency",
    },
    {
      title: "Local SEO",
      description:
        "Apply audit insights to stronger Maps and local AI visibility.",
      path: "/local-seo",
    },
    {
      title: "eCommerce SEO",
      description:
        "Fix product and collection issues found in the audit.",
      path: "/ecommerce-seo",
    },
  ],
};

export default function SeoAuditServicesService() {
  return (
    <SeoServiceTemplate config={seoAuditServicesConfig} />
  );
}
