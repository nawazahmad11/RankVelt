import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const aiSeoAgencyConfig: SeoServicePageConfig = {
  slug: "/ai-seo-agency",

  metaTitle:
    "AI SEO Agency: AI-First Search Visibility | RankVelt",

  metaDescription:
    "RankVelt is an AI-first SEO agency helping brands get cited in AI Overviews, ChatGPT and Perplexity with AEO, GEO and technical SEO built for AI search.",

  eyebrow: "AI SEO Agency",

  h1: "AI-First SEO Agency for Google and AI Search",

  intro:
    "RankVelt was built for AI search from day one. We help brands get cited in AI Overviews, ChatGPT, Perplexity and other answer engines, while keeping the traditional SEO foundations that still drive rankings and revenue.",

  focusAreas: [
    "AI Search Visibility",
    "Answer Engine Optimisation",
    "Generative Engine Optimisation",
    "Technical SEO",
  ],

  overviewTitle: "Built for How Search Works Now",

  overviewParagraphs: [
    "Search has changed. People now ask ChatGPT or read the AI summary at the top of Google instead of clicking through ten blue links. If your brand is not cited in those answers, you are invisible to customers who never reach your site.",

    "Most agencies treat AI search as an add-on to old SEO checklists. RankVelt works the other way around. Every engagement starts with one question: can AI systems clearly understand who you are, what you offer and why you are credible?",

    "That means entity clarity across the web, citation-friendly content structure, rigorous schema and the same solid technical SEO that has always mattered. Google's own guidance confirms it: strong SEO practice is the foundation of AI visibility. We build on that foundation with AEO and GEO methods designed for answer engines.",
  ],

  deliverablesTitle:
    "What an AI SEO Engagement Can Include",

  deliverables: [
    "AI visibility audit: where your brand appears (or is missing) in AI answers today.",
    "Entity and brand-signal optimisation across your site and the wider web.",
    "Citation-friendly content structure with clear definitions and direct answers.",
    "Schema markup review: Organisation, LocalBusiness, FAQPage and Article types.",
    "Answer Engine Optimisation for conversational and question-based queries.",
    "Technical SEO review covering crawlability, indexation and site health.",
    "Ongoing measurement of AI citations and search visibility.",
  ],

  audienceTitle: "AI SEO Is a Strong Fit For",

  audience: [
    "Brands whose customers already use ChatGPT or AI Overviews to research purchases.",
    "Businesses ranking in Google but absent from AI-generated answers.",
    "Agencies and consultants who want an AI-search partner for their clients.",
    "eCommerce stores whose products should surface in AI shopping answers.",
    "Local businesses that want visibility in AI-powered local recommendations.",
  ],

  outcomesTitle: "What AI-First SEO Should Improve",

  outcomes: [
    "Clearer brand entity that AI systems can describe accurately.",
    "Content structured so answer engines can cite it directly.",
    "Stronger presence in AI Overviews and chatbot answers.",
    "Consistent business information across directories and mentions.",
    "A technical foundation that supports both rankings and citations.",
  ],

  processTitle: "An AI-First SEO Process",

  process: [
    {
      step: "01",
      title: "Audit",
      description:
        "RankVelt reviews your current visibility in Google and in AI answers, plus entity signals, content structure and technical health.",
    },
    {
      step: "02",
      title: "Structure",
      description:
        "Brand information, schema and content formats are organised so AI systems can parse and cite them with confidence.",
    },
    {
      step: "03",
      title: "Publish",
      description:
        "Citation-ready content is created around the questions your customers actually ask, in the formats answer engines prefer.",
    },
    {
      step: "04",
      title: "Measure",
      description:
        "AI citations, rankings and traffic are tracked over time, and the strategy is refined based on what the data shows.",
    },
  ],

  faqs: [
    {
      question: "What is an AI SEO agency?",
      answer:
        "An AI SEO agency optimises your brand for both traditional search engines and AI-powered answer engines like ChatGPT, Perplexity and Google AI Overviews. The goal is to be ranked and cited: ranked in search results and cited inside AI-generated answers.",
    },
    {
      question: "How is RankVelt different from a traditional SEO agency?",
      answer:
        "Traditional agencies were built for blue-link rankings and added AI services later. RankVelt was built AI-first. Every audit, content plan and technical review considers both Google rankings and AI citations from the start, not as an afterthought.",
    },
    {
      question: "How do I choose from the best AI SEO agencies?",
      answer:
        "Look past the label. Ask how they measure AI visibility, whether they audit your brand entity across the web, and whether their content is structured for citations rather than just keywords. Lists of the best AI SEO agencies are a starting point, but the right fit is the one that treats AI search as a core discipline, not a buzzword.",
    },
    {
      question: "What are AEO and GEO?",
      answer:
        "AEO (Answer Engine Optimisation) focuses on getting your content selected as the direct answer to user questions. GEO (Generative Engine Optimisation) focuses on getting your brand cited inside AI-generated responses. RankVelt covers both as part of AI-first SEO.",
    },
    {
      question: "Do I still need traditional SEO if I invest in AI SEO?",
      answer:
        "Yes. Google's AI features are built on the same ranking systems as classic search. Strong technical SEO, quality content and real authority remain the foundation. AI SEO extends that foundation into answer engines rather than replacing it.",
    },
    {
      question: "How long does AI SEO take to show results?",
      answer:
        "Timelines vary by competition, site authority and how clearly your brand entity is already defined. Structural and technical improvements can show movement in weeks, while consistent AI citations typically build over a few months of steady work.",
    },
    {
      question: "Can small businesses benefit from AI SEO?",
      answer:
        "Yes, often more than large brands. AI answers frequently cite specific, well-structured sources regardless of company size. A small business with clear entity signals and direct, helpful content can earn citations that bigger competitors miss.",
    },
    {
      question: "How much does RankVelt charge?",
      answer:
        "RankVelt services start at $525 per month. Engagements run for a minimum of 3 months, then continue month to month. You can request a free SEO opportunity check to see what applies to your site before committing.",
    },
  ],

  relatedServices: [
    {
      title: "Hire SEO Expert",
      description:
        "Work with a vetted agency SEO specialist instead of gambling on marketplaces.",
      path: "/hire-seo-expert",
    },
    {
      title: "SEO Audit Services",
      description:
        "A technical and AI-visibility audit that shows exactly what is holding your site back.",
      path: "/seo-audit-services",
    },
    {
      title: "eCommerce SEO Services",
      description:
        "AI-search-ready optimisation for Shopify and WooCommerce stores.",
      path: "/ecommerce-seo-services",
    },
  ],
};

export default function AiSeoAgencyService() {
  return (
    <SeoServiceTemplate config={aiSeoAgencyConfig} />
  );
}
