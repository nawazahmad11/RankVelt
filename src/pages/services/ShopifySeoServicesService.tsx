import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const shopifySeoServicesConfig: SeoServicePageConfig =
  {
    slug: "/shopify-seo-services",

    metaTitle:
      "Shopify SEO Services for AI-Ready Stores | RankVelt",

    metaDescription:
      "RankVelt's Shopify SEO services make stores AI-search ready: technical audits, product discovery, collection SEO and content for ChatGPT and Perplexity.",

    eyebrow: "Shopify SEO Services",

    h1: "Shopify SEO Services for Stores That Get Found Everywhere",

    intro:
      "RankVelt helps Shopify stores fix the technical issues holding them back and become ready for AI search. The starting point is usually a deep technical audit. The goal is simple: customers find your products through Google, ChatGPT, Perplexity and AI Overviews, not just one channel.",

    focusAreas: [
      "Shopify Technical Audits",
      "Product Discovery",
      "Collection SEO",
      "AI Search Visibility",
    ],

    overviewTitle:
      "Fix the Foundation, Then Win in Google and AI Search",

    overviewParagraphs: [
      "Many Shopify stores look finished but carry hidden problems: app bloat slowing every page, duplicate URLs from filters and variants, weak collection structure and theme code that search engines struggle to read.",

      "RankVelt starts with a thorough technical audit of your Shopify store. Theme code, apps, site speed, indexation and structured data are reviewed so you know exactly what is broken and what to fix first.",

      "On top of that foundation comes AI search readiness. Product pages, collections and buying guides are shaped so AI systems can understand and cite them, which is where a growing share of product discovery now happens.",
    ],

    deliverablesTitle:
      "What Shopify SEO Services Include",

    deliverables: [
      "A dedicated Shopify technical SEO audit service covering theme code, apps, speed and indexation.",
      "Prioritised fix list with clear developer-ready guidance.",
      "Collection page optimisation for search relevance and browsing.",
      "Product page optimisation for discovery and conversion.",
      "Duplicate URL, canonical and filter indexation cleanup.",
      "Product and organisation schema improvements.",
      "AI search readiness for ChatGPT, Perplexity and Google AI Overviews.",
    ],

    audienceTitle:
      "Who Benefits from Shopify SEO Services",

    audience: [
      "Shopify stores with falling or flat organic traffic.",
      "Stores slowed down by too many apps or a heavy theme.",
      "Brands whose products never appear in AI-generated answers.",
      "Stores planning a theme change, migration or major update.",
      "Merchants tired of paying for every single visitor.",
    ],

    outcomesTitle:
      "What This Service Aims to Improve",

    outcomes: [
      "A faster, cleaner Shopify store that is easier to crawl.",
      "Collections and products that match real customer searches.",
      "Less wasted crawl budget on duplicate and filter URLs.",
      "Product pages that AI systems can understand and cite.",
      "Organic traffic that converts instead of just visiting.",
    ],

    processTitle: "How the Service Works",

    process: [
      {
        step: "01",
        title: "Audit",
        description:
          "A full Shopify technical SEO audit service reviews your theme, apps, speed, structure and indexation.",
      },
      {
        step: "02",
        title: "Fix",
        description:
          "The highest-impact technical issues are resolved first, with guidance your developer can follow.",
      },
      {
        step: "03",
        title: "Optimise",
        description:
          "Collections, products, metadata and internal links are improved for Google and AI search.",
      },
      {
        step: "04",
        title: "Grow",
        description:
          "Content and category opportunities are developed to capture more buying-intent searches over time.",
      },
    ],

    faqs: [
      {
        question: "What do Shopify SEO services include?",
        answer:
          "A technical audit of your Shopify store, fixes for speed and indexation issues, collection and product page optimisation, structured data improvements and content planning, with AI search readiness built in.",
      },
      {
        question:
          "What is a Shopify technical SEO audit service?",
        answer:
          "It is a detailed review of everything technical in your Shopify store: theme code quality, app impact on speed, duplicate URLs from filters and variants, canonical setup, indexation, structured data and mobile usability. You receive a prioritised list of what to fix and why.",
      },
      {
        question:
          "My store is slow because of apps. Can you help?",
        answer:
          "Yes. The audit measures which apps slow your store and whether each one earns its place. Unnecessary apps are flagged for removal and alternatives are suggested where a lighter option exists.",
      },
      {
        question:
          "How do you make a Shopify store AI-search ready?",
        answer:
          "By making product information clear and quotable: strong product titles and descriptions, proper schema, well-structured collections and buying guides that answer real customer questions. AI systems cite pages they can easily understand.",
      },
      {
        question: "Will you edit my theme code?",
        answer:
          "RankVelt can implement technical fixes directly or provide developer-ready instructions for your team. Theme changes are always tested and documented.",
      },
      {
        question: "Do you work with Shopify Plus stores?",
        answer:
          "Yes. The service covers standard Shopify and Shopify Plus stores, including checkout-adjacent SEO considerations where relevant.",
      },
      {
        question: "What do Shopify SEO services cost?",
        answer:
          "RankVelt's Shopify SEO services start from $525/month. The minimum term is 3 months, then it continues month-to-month. A one-off technical audit can also be arranged before any retainer.",
      },
      {
        question:
          "How is this different from hiring a Shopify developer?",
        answer:
          "A developer builds and maintains your store. This service decides what should be built and why, based on search data, technical analysis and AI search behaviour, then guides the implementation.",
      },
    ],

    relatedServices: [
      {
        title: "eCommerce SEO Services",
        description:
          "Platform-agnostic ecommerce SEO for Shopify, WooCommerce and custom stores.",
        path: "/ecommerce-seo-services",
      },
      {
        title: "SEO Audit Services",
        description:
          "A standalone technical and AI-search audit for any website.",
        path: "/seo-audit-services",
      },
      {
        title: "AI SEO Agency",
        description:
          "AI-first SEO built for Google and AI search visibility.",
        path: "/ai-seo-agency",
      },
    ],
  };

export default function ShopifySeoServicesService() {
  return (
    <SeoServiceTemplate
      config={shopifySeoServicesConfig}
    />
  );
}
