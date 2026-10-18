import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

// Chart image placement: the SeoServicePageConfig pattern has no image
// field, so the chart is not rendered by the template. When the template
// supports section images, place it as:
// <img src="/technical-seo-services-chart.webp" alt="Monthly search volume for technical SEO keyword variations" />
// in the demand/volume section near the top of the page.

const technicalSeoServicesConfig: SeoServicePageConfig = {
  slug: "/technical-seo-services",

  metaTitle:
    "Technical SEO Services: What's Included, Real Pricing and Timelines | RankVelt",

  metaDescription:
    "Technical SEO services explained: what's included, audit vs retainer, honest pricing ranges, realistic timelines, and RankVelt's $525/mo plan.",

  eyebrow: "Technical SEO Services",

  h1: "Technical SEO Services, Explained Like a Buyer Deserves",

  intro:
    "Most pages selling technical SEO services give you the same checklist: crawl, speed, schema, done. Then they ask you to sign a retainer. They never show the deliverable or a fair price. They never tell you if you even need ongoing work.",

  focusAreas: [
    "Technical SEO Audits",
    "Crawl and Indexation",
    "Core Web Vitals",
    "Schema Markup",
  ],

  overviewTitle: "The Engineering Layer of Search",

  overviewParagraphs: [
    "Technical SEO is the engineering layer of search. It makes sure search engines can find your pages, render them, understand them, and trust them enough to rank them.",

    "It breaks into four groups: crawl, render, index, and trust. Crawl covers robots.txt, XML sitemaps, redirect chains, broken links, and crawl budget for large sites. Render covers whether Google sees what your visitors see, which matters for JavaScript-heavy sites and single page apps.",

    "Index covers canonical tags, noindex rules, duplicate content fixes, hreflang, and parameter handling. Trust covers Core Web Vitals (LCP, INP, CLS), HTTPS, security headers, mobile-first indexing readiness, and schema markup.",

    "Notice what is not on this list. Keyword research and content writing are on-page SEO. Link building is off-page SEO. An engagement that is really just a plugin install and a keyword report is not technical SEO at all.",

    "This page shows what technical SEO services actually include, how to tell if your site needs them, the honest difference between a one-off audit and a monthly retainer, what each costs, how long fixes take to show results, and exactly what RankVelt charges and delivers.",
  ],

  deliverablesTitle: "What a Real Technical SEO Audit Covers",

  deliverables: [
    "Crawl and indexation review: every indexable URL checked, blocked and orphaned pages found, sitemap coverage compared against the actual index.",
    "Site architecture and internal linking: how deep money pages sit from the homepage, orphaned pages flagged, pagination and faceted navigation duplicates mapped.",
    "Redirect and canonical audit: chains and loops mapped, conflicting canonical signals mapped URL by URL, redirect maps prepared for migrations.",
    "Speed and Core Web Vitals: lab and field data (LCP, INP, CLS), exact assets or scripts causing failures named, fix recommendations a developer can act on.",
    "Mobile and rendering checks: what Googlebot sees versus what users see, mobile usability errors and JavaScript rendering gaps flagged.",
    "Duplicate content resolution: exact and near duplicates found, each cluster given a clear recommendation of canonical, noindex, or consolidation.",
    "Schema markup review: what is implemented, what is broken, and what is missing that could earn rich results or help AI systems understand the content.",
    "International setup (if relevant): hreflang correctness, geo-targeting, and translated page indexation checked.",
    "Security and access: HTTPS coverage and mixed content, security headers, and crawler access including AI crawlers like GPTBot and ClaudeBot.",
    "Prioritized fix list: every issue ranked by expected impact and effort, so you know what to fix first and what can wait.",
  ],

  audienceTitle: "Signs Your Site Needs Technical SEO",

  audience: [
    "Important pages are not in Google's index, or indexed pages keep dropping out.",
    "Traffic fell after a redesign, migration, or platform switch.",
    "Pages are slow, especially on mobile, and Core Web Vitals scores are red.",
    "Google ignores your canonical tags or indexes the wrong URL versions.",
    "You publish good content but rankings stay flat.",
    "Your site runs on JavaScript and organic traffic never matched expectations.",
    "You are planning a migration, rebrand, or domain change, which is the highest-risk technical SEO moment there is.",
    "Rich results you expected, like product or review snippets, never appear.",
  ],

  processTitle: "How a RankVelt Technical SEO Engagement Runs",

  process: [
    {
      step: "01",
      title: "Audit",
      description:
        "A full technical audit with a prioritized fix list. Impact is ranked and effort is estimated, so your developer knows exactly what to do first.",
    },
    {
      step: "02",
      title: "Fix",
      description:
        "RankVelt implements fixes directly where it has access, or delivers ticket-style fix specs per URL for your developer. Crawl, indexation, redirect, canonical, and sitemap cleanup happen in the first sprint.",
    },
    {
      step: "03",
      title: "Monitor",
      description:
        "Continuous crawl monitoring catches new errors, indexation drops, and redirect issues early. Core Web Vitals are tracked against the 28-day field data window.",
    },
    {
      step: "04",
      title: "Report",
      description:
        "A monthly report shows what was fixed, what moved, and what is next. Every fix is documented, so you always know what your money bought.",
    },
  ],

  outcomesTitle: "Realistic Timelines for Fixes",

  outcomes: [
    "Crawl blocks and accidental noindex: 2 to 4 weeks after Google recrawls the affected pages.",
    "Redirect and canonical fixes: 2 to 4 weeks as Google processes the new signals.",
    "Schema markup additions: days to weeks for rich results to appear, only when Google chooses to show them. Never guaranteed.",
    "Site architecture and internal linking changes: 4 to 8 weeks as link equity redistributes.",
    "JavaScript rendering fixes: 2 to 6 weeks after recrawl and re-render.",
    "Core Web Vitals improvements: field data updates on roughly a 28-day rolling window, so expect a month or more before scores move.",
    "Duplicate content consolidation: 1 to 3 months for Google to settle on the canonical versions.",
    "Migration recovery: weeks to months, depending on site size and how clean the redirect maps were.",
  ],

  aiVisibility: {
    title: "Technical SEO for AI Search",
    intro:
      "In 2026, technical SEO has a second audience: AI systems. ChatGPT, Gemini, Perplexity, and Google AI Overviews cite sources instead of showing blue links. These technical foundations decide whether your site gets cited.",
    points: [
      "AI crawler access: GPTBot, ClaudeBot, and similar crawlers obey robots.txt. Many sites block them accidentally through broad disallow rules or aggressive bot protection.",
      "llms.txt (emerging): an experimental convention giving AI systems a structured map of your site. Not a standard yet and adoption is early, but a forward-looking provider should know it.",
      "Schema markup: structured data helps Google and AI systems understand your content precisely. It does not guarantee citations, but unclear content never gets cited.",
      "Quotable content structure: clear headings, direct answers, and FAQ sections make your content easy for AI systems to extract and attribute.",
    ],
  },

  guide: {
    title: "The RankVelt Buyer's Guide to Technical SEO",
    intro:
      "A plain English guide to the audit versus retainer decision, what technical SEO costs in 2026, how your platform changes the job, and the red flags to watch for.",
    sections: [
      {
        heading: "One-Off Audit vs Ongoing Retainer",
        paragraphs: [
          "This is the question almost no agency page answers honestly, because retainers pay better. Here is the honest framework.",
          "Get a one-off audit with a fix sprint when your site is small (under a few hundred pages) and was never properly audited, when you just launched or migrated and want a safety check, or when your developer can implement fixes from a good spec. Pay once, fix, done.",
          "Get an ongoing retainer when your site has thousands of URLs, when you publish or change content constantly, or when frequent platform updates or JavaScript deploys keep breaking rendering. Technical SEO on a big dynamic site is maintenance, not a project.",
          "The honest middle path most buyers should take: start with a paid audit, fix the high-impact issues, then move to quarterly checkups or a light monitoring retainer. If a provider pushes a 12-month retainer before auditing anything, they are selling you the retainer, not the outcome.",
          "One more distinction that matters: ask whether the engagement includes implementation or only reporting. Good providers either fix the issues themselves or hand your developer ticket-style specs with exact instructions per URL. Decide which you need before you sign.",
        ],
        links: [
          {
            label: "What a full audit engagement looks like",
            path: "/enterprise-seo-audit",
          },
        ],
      },
      {
        heading: "What Technical SEO Costs in 2026",
        paragraphs: [
          "Real ranges from what agencies publicly list in the US market. A one-off technical audit typically costs $500 to $5,000: a small business site lands near the low end, and large ecommerce, international, or JavaScript-heavy sites land near the high end. Under $500 usually buys an automated scan with no prioritization and no implementation guidance.",
          "Monthly technical SEO retainers typically run $1,000 to $5,000 or more per month, with enterprise programs running higher. Hourly consulting typically runs $75 to $200 per hour, best for narrow questions or a second opinion on an audit.",
          "Marketplace gigs at $10 to $350 per audit buy you a software report, not a consultant. They work as a starting checklist. They are not a diagnosis.",
          "Why does one audit cost $500 and another $5,000? Site size, depth (automated scan versus manual log file analysis and rendering tests), and deliverable quality (raw warnings versus prioritized, ticket-style fix specs). Ask any provider which of the three their price reflects.",
        ],
      },
      {
        heading: "Your Platform Changes the Job",
        paragraphs: [
          "Service pages usually pretend every platform is the same. It is not. WordPress is the most fixable platform and the most common source of self-inflicted issues: plugin bloat, heavy themes, and conflicting SEO plugins cause most of its technical problems. Nearly everything is fixable with the right configuration and a staging site.",
          "Shopify is solid out of the box but has real ceilings: rigid URL structure, limited sitemap control, hreflang workarounds for international stores, and faceted collection filters that generate duplicate URL sprawl fast.",
          "Ecommerce catalogs generally are where budgets get spent on faceted navigation, product variants, and out-of-stock pages. Duplicate variant URLs and thin category pages are the classic issues, and crawl budget gets eaten by filters.",
          "Headless and JavaScript frameworks are the hardest and most expensive technical SEO work. Rendering strategy is the core question, and every deploy must not break indexation. If your provider cannot discuss rendering in detail, they should not touch a headless site.",
          "Ask any candidate: what can you not fix on my platform? An honest answer tells you more than any checklist.",
        ],
        links: [
          {
            label: "WordPress SEO issues guide",
            path: "/wordpress-seo-issues",
          },
          {
            label: "Who should handle the technical work",
            path: "/wordpress-seo-expert",
          },
          {
            label: "Catalog technical issues",
            path: "/woocommerce-seo",
          },
        ],
      },
      {
        heading: "Red Flags When Vetting a Provider",
        paragraphs: [
          "Watch for these warning signs before you sign anything.",
        ],
        bullets: [
          "Guaranteed rankings or traffic from fixes. No one controls Google's algorithm.",
          "A free deep audit. A real audit takes 10 to 40 hours of expert work, so a free one is automated or a sales document.",
          "No sample deliverable. Ask to see a redacted audit or a ticket-style fix spec.",
          "No prioritization. A 300-line issue list with no impact ranking is a scanner dump, not consulting.",
          "Audit only with no implementation path. Know upfront whether fixes are included or you are on your own afterward.",
          "They cannot explain their process in plain words. Proprietary methodology with no specifics means there is no methodology.",
          "They never mention your platform's limits. Same promised fixes for Shopify, WordPress, and a headless React app means they have not done the work.",
          "No access to your own data. You should always keep full access to Search Console, Analytics, and everything they produce for you.",
        ],
      },
      {
        heading: "Can You Do Technical SEO Yourself?",
        paragraphs: [
          "Some of it, yes. A small site owner can handle the basics: submit a sitemap, fix broken links, compress images, keep plugins updated, add basic schema with a plugin, and check Search Console coverage reports monthly. That covers real ground.",
          "DIY stops working when the issues need judgment: log file analysis, rendering strategy, redirect architecture for a migration, international hreflang debugging, or a 5,000-page catalog with faceted duplicates. At that point the cost of getting it wrong dwarfs the cost of hiring someone, and a botched migration can erase years of rankings.",
          "Rule of thumb: if the fix touches how Google crawls or renders your whole site, get an expert to at least review the plan.",
        ],
        links: [
          {
            label: "How the technical layer connects to AI search",
            path: "/seo-vs-aeo-vs-geo",
          },
          {
            label: "Start with a free SEO audit",
            path: "/seo-audit-services",
          },
        ],
      },
    ],
  },

  pricing: {
    title: "Simple, Published Pricing",
    intro:
      "No hidden quotes and no pressure calls. This is exactly what RankVelt charges and delivers for technical SEO.",
    steps: [
      {
        title: "Get a free audit",
        description:
          "The first step is a free SEO audit that shows what your site actually needs before you pay anything.",
      },
      {
        title: "Month 1: audit and fix sprint",
        description:
          "Full technical audit with a prioritized fix list, ticket-style fix specs or direct implementation, and crawl, indexation, redirect, canonical, sitemap, and schema cleanup.",
      },
      {
        title: "Months 2 and 3, then rolling",
        description:
          "Continuous crawl monitoring, Core Web Vitals tracking, technical checks on new pages, and a monthly report showing what was fixed and what moved.",
      },
    ],
    price: "from $525",
    unit: "/month",
    term: "3 month initial term, then rolling monthly.",
    includes: [
      "Full technical audit with a prioritized, impact-ranked fix list",
      "Ticket-style fix specs your developer can implement, or direct implementation where RankVelt has access",
      "Crawl, indexation, redirect, canonical, and sitemap cleanup",
      "Core Web Vitals diagnosis with specific asset and script level fixes",
      "Schema markup review and implementation for your key page types",
      "AI crawler access configured: robots.txt reviewed for GPTBot, ClaudeBot, and similar",
      "Continuous crawl monitoring and technical checks on new pages",
      "Monthly report showing what was fixed, what moved, and what is next",
    ],
    note: "Technical SEO is included in every RankVelt plan, not sold as a separate upsell. Enterprise-scale log file programs and dedicated rendering engineering for very large sites may need a custom scope; the audit will tell you honestly if that is your case. RankVelt does not guarantee rankings or AI citations, and does not manage paid ads inside this plan.",
    founderNote:
      "Your work is led personally by founder Nawaz Ahmad. No juniors and no handoffs.",
  },

  faqs: [
    {
      question: "What is technical SEO?",
      answer:
        "Technical SEO is the work that makes sure search engines can crawl your website, render it, index it, and trust it. It covers site speed and Core Web Vitals, crawlability, indexation, redirects, canonicals, schema markup, mobile readiness, and site security. Without it, even great content can go unranked because Google cannot properly access or understand the site.",
    },
    {
      question: "What do technical SEO services include?",
      answer:
        "A full technical SEO service includes a technical audit, crawl and indexation fixes, redirect and canonical cleanup, Core Web Vitals and speed optimization, JavaScript rendering fixes, duplicate content resolution, schema markup implementation, XML sitemap and robots.txt configuration, and ongoing monitoring.",
    },
    {
      question: "How much do technical SEO services cost?",
      answer:
        "A one-off technical audit typically costs $500 to $5,000 depending on site size and depth. Monthly retainers typically run $1,000 to $5,000 or more per month. Hourly consulting typically runs $75 to $200 per hour. RankVelt charges $525 per month with technical SEO included, starting with a 3 month initial term, then rolling monthly.",
    },
    {
      question: "What is the difference between technical SEO and on-page SEO?",
      answer:
        "Technical SEO is about access and infrastructure: can search engines crawl your site, render it, and index it? On-page SEO is about relevance: keywords, content quality, titles, and headings on each page. You need both. Great content on a site Google cannot crawl still does not rank.",
    },
    {
      question: "How long does a technical SEO audit take?",
      answer:
        "For a small site, about a week. For a large ecommerce or international site, up to a month. It depends on site size, platform complexity, and manual work like log file analysis and rendering tests. A deep audit delivered in 24 hours is an automated scan, not an audit.",
    },
    {
      question: "How often should a technical SEO audit be repeated?",
      answer:
        "A full audit once a year is a reasonable baseline for stable sites. Large, dynamic sites need continuous monitoring instead: ecommerce, publishers, and JavaScript apps with frequent deploys. New issues appear with every change. Any migration or platform switch deserves a fresh audit regardless of schedule.",
    },
    {
      question: "Can I do technical SEO myself, or do I need an agency?",
      answer:
        "You can handle the basics on a small site: sitemaps, broken links, image compression, plugin updates, basic schema, and Search Console checks. Hire help when issues need judgment: rendering strategy, migrations, hreflang, large catalog duplicates, or anything that changes how Google crawls your whole site. A botched migration can cost far more than an expert review.",
    },
    {
      question: "Do you fix the issues, or just report them?",
      answer:
        "It depends on the provider, and you should ask before signing. Some sell audit-only engagements that end with a PDF. RankVelt implements fixes directly where it has access. Where it does not, it delivers ticket-style fix specs your developer can implement per URL.",
    },
    {
      question: "How long before technical SEO fixes show results in search?",
      answer:
        "It varies by fix type. Crawl blocks and redirect fixes typically show in 2 to 4 weeks. Architecture changes take 4 to 8 weeks. Core Web Vitals field data updates on roughly a 28-day rolling window. Duplicate consolidation can take 1 to 3 months. Technical SEO waits on Google's crawl and evaluation cycles, so instant results are not realistic.",
    },
    {
      question: "Will technical SEO help my site get cited in AI Overviews or ChatGPT?",
      answer:
        "It helps, but it cannot guarantee citations. AI crawler access matters: make sure GPTBot and similar crawlers are not accidentally blocked. Clean schema markup and clearly structured, quotable content matter too. No provider can promise AI citations. A technically clean site is the entry ticket.",
    },
    {
      question: "How do I spot red flags when choosing a technical SEO provider?",
      answer:
        "Watch for guaranteed rankings and free deep audits, no sample deliverable to inspect, a 300-line issue list with no prioritization, audit-only engagements with no implementation path, vague proprietary methodology answers, providers who ignore your platform's limits, and no access to your own Search Console or Analytics data.",
    },
  ],

  relatedServices: [
    {
      title: "SEO Audit Services",
      description:
        "A full technical audit with a prioritized fix list, the honest starting point for any site.",
      path: "/seo-audit-services",
    },
    {
      title: "WordPress SEO Issues",
      description:
        "The common WordPress technical failure modes and how to fix them.",
      path: "/wordpress-seo-issues",
    },
    {
      title: "WooCommerce SEO",
      description:
        "Catalog-level technical SEO for stores: variants, filters, and crawl budget.",
      path: "/woocommerce-seo",
    },
    {
      title: "SEO vs AEO vs GEO",
      description:
        "How the technical layer connects to AI search visibility and citations.",
      path: "/seo-vs-aeo-vs-geo",
    },
  ],
};

export default function TechnicalSeoServicesService() {
  return (
    <SeoServiceTemplate config={technicalSeoServicesConfig} />
  );
}
