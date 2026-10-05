import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const localSeoUpgradedConfig: SeoServicePageConfig = {
  slug: "/local-seo",

  metaTitle:
    "Local SEO Services for More Local Leads | RankVelt",

  metaDescription:
    "RankVelt provides local SEO services for stronger Google Maps visibility, local rankings, AI search citations, calls, bookings and qualified leads.",

  eyebrow: "Local SEO Services",

  h1:
    "Local SEO Services That Help Nearby Customers Find Your Business",

  intro:
    "RankVelt helps local and service-area businesses improve Google visibility through stronger service pages, Google Business Profile signals, local keyword targeting, technical SEO and clearer lead-generation journeys. We also optimise for AI search, so ChatGPT, Perplexity and Google AI Overviews can find and recommend your business, not just Google Maps.",

  focusAreas: [
    "Google Business Profile",
    "Local Keyword Research",
    "Service-Area Pages",
    "Local Lead Conversion",
    "AI Search Visibility",
  ],

  overviewTitle:
    "Build Local Visibility Around the Services and Areas You Actually Serve",

  overviewParagraphs: [
    "Local SEO connects your website, Google Business Profile, services, location relevance and customer trust signals. Each part should make it easier for nearby customers to understand what you offer and how to contact you. The same clarity helps AI systems cite your business in local answers.",

    "RankVelt reviews the complete local search journey. This includes service-page visibility, business information, local content, internal links, mobile usability, review signals and conversion paths.",

    "The goal is not to publish dozens of thin city pages. The goal is to create useful local pages and search signals that support real customers, Google Search and AI assistants that answer local questions.",
  ],

  deliverablesTitle:
    "What a Local SEO Strategy Can Include",

  deliverables: [
    "Google Business Profile review and optimisation priorities.",
    "Local keyword, competitor and service opportunity research.",
    "Local service-page and service-area page planning.",
    "On-page SEO for commercially important services.",
    "Business information and local trust-signal review.",
    "Technical SEO and internal-linking improvements.",
    "Conversion improvements for calls, forms and bookings.",
    "AI search readiness review: can ChatGPT and Perplexity find, understand and cite your business for local queries?",
    "Local entity consistency checks across your website, profile and key directories.",
    "Google Business Profile content structured for AI Overviews and voice-style local answers.",
  ],

  audienceTitle: "Local SEO Is a Strong Fit For",

  audience: [
    "Home-service businesses such as roofers, plumbers, cleaners and electricians.",
    "Dentists, orthodontists, clinics and other appointment-based healthcare practices.",
    "Salons, gyms and other appointment-led local businesses.",
    "Consultants, accountants, lawyers and professional service companies.",
    "Companies serving specific cities, suburbs or service areas.",
    "Businesses with visibility but weak calls, enquiries or bookings.",
    "Businesses that rank on Maps but never appear in AI-generated local answers.",
  ],

  outcomesTitle:
    "What Strong Local SEO Should Improve",

  outcomes: [
    "Clearer visibility for relevant local searches.",
    "Better alignment between your website and Google Business Profile.",
    "Stronger discovery of priority services and service areas.",
    "More useful mobile journeys for calls and enquiries.",
    "A scalable foundation for future local expansion.",
    "Stronger chances of being cited in AI-generated local recommendations.",
  ],

  processTitle: "A Practical Local SEO Process",

  process: [
    {
      step: "01",
      title: "Review",
      description:
        "RankVelt reviews your website, Google Business Profile, local competitors, service areas, current visibility and AI citation presence.",
    },
    {
      step: "02",
      title: "Prioritise",
      description:
        "The highest-value pages, profile improvements, technical fixes and local opportunities are identified.",
    },
    {
      step: "03",
      title: "Improve",
      description:
        "Priority work strengthens local relevance, page clarity, internal links and lead-generation paths. Business information is also structured so AI systems can cite it accurately.",
    },
    {
      step: "04",
      title: "Refine",
      description:
        "Search performance and customer behaviour guide future improvements.",
    },
  ],

  faqs: [
    {
      question:
        "Can local SEO work without a physical storefront?",
      answer:
        "Yes. Service-area businesses can improve local visibility when their business information, service pages, coverage areas and contact journey are accurate and useful.",
    },
    {
      question: "How long does local SEO take?",
      answer:
        "Timing depends on competition, website condition, business history and the amount of work required. Stronger local growth usually develops over several months.",
    },
    {
      question:
        "Does RankVelt create service-area pages?",
      answer:
        "Yes, where those pages provide genuine local value. RankVelt avoids thin doorway pages and focuses on useful location-specific information.",
    },
    {
      question:
        "Can RankVelt help with Google Maps visibility?",
      answer:
        "RankVelt can review and improve the website and business profile signals connected to local relevance, services, categories, trust and conversion readiness.",
    },
    {
      question:
        "Can AI search send local customers to my business?",
      answer:
        "Yes. People now ask ChatGPT and Perplexity for local recommendations, not just Google. When your business information is consistent and your content answers local questions clearly, AI systems are more likely to cite your business in those answers.",
    },
    {
      question:
        "Does RankVelt optimise my Google Business Profile for AI answers?",
      answer:
        "Yes. We structure your profile content, services and business information so both Google Maps and AI assistants can understand and reference it accurately.",
    },
    {
      question:
        "Why does my business rank on Maps but never appear in ChatGPT answers?",
      answer:
        "Maps rankings and AI citations rely on different signals. AI systems depend on consistent entity information across your website, directories and reviews. If those signals conflict or are incomplete, AI assistants skip your business even when Maps ranks it well.",
    },
  ],

  relatedServices: [
    {
      title: "AI SEO Agency",
      description:
        "Extend local visibility into AI search with an AI-first SEO strategy.",
      path: "/ai-seo-agency",
    },
    {
      title: "Business SEO",
      description:
        "Build stronger service pages and organic lead-generation systems.",
      path: "/business-seo",
    },
    {
      title: "SEO Tools",
      description:
        "Use RankVelt tools for metadata, schema and technical SEO.",
      path: "/tools",
    },
  ],
};

export default function LocalSEOServiceUpgraded() {
  return (
    <SeoServiceTemplate config={localSeoUpgradedConfig} />
  );
}
