import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const ecommerceSeoServicesConfig: SeoServicePageConfig =
  {
    slug: "/ecommerce-seo-services",

    metaTitle:
      "eCommerce SEO Services for Online Stores | RankVelt",

    metaDescription:
      "RankVelt offers ecommerce SEO services for online stores: AI search optimisation, product discovery, technical SEO and content that turns searches into sales.",

    eyebrow: "eCommerce SEO Services",

    h1: "eCommerce SEO Services for Product Discovery in Google and AI Search",

    intro:
      "RankVelt provides SEO services for ecommerce stores on Shopify, WooCommerce and custom platforms. The focus is product discovery: helping customers find your products through Google, ChatGPT, Perplexity and Google AI Overviews, then turning those visits into sales.",

    focusAreas: [
      "Product Discovery",
      "AI Search Optimisation",
      "Technical SEO",
      "Buying-Intent Content",
    ],

    overviewTitle:
      "Get Found Where Your Customers Actually Search",

    overviewParagraphs: [
      "Search behaviour is changing. Customers ask ChatGPT for product recommendations, read Google AI Overviews before buying and still use classic Google search. Most online stores are optimised for only one of these.",

      "RankVelt treats product discovery as one connected problem. Category structure, product information, technical health and content all shape whether your products appear in search results and in AI-generated answers.",

      "This service works across platforms. Whether your store runs on Shopify, WooCommerce or a custom build, the approach stays the same: clear structure, strong product pages and content that matches how people actually shop.",
    ],

    deliverablesTitle:
      "What eCommerce SEO Services Include",

    deliverables: [
      "AI search readiness review across ChatGPT, Perplexity and Google AI Overviews.",
      "Full technical SEO audit with a prioritised action roadmap.",
      "Keyword mapping for categories, products and buying guides.",
      "Category and product page optimisation for relevance and clarity.",
      "Product schema and structured data improvements.",
      "Internal linking across the catalogue, guides and blog content.",
      "Content plan for comparison and buying-intent searches.",
    ],

    audienceTitle:
      "Who Benefits from eCommerce SEO Services",

    audience: [
      "Online stores on Shopify, WooCommerce or custom platforms.",
      "Brands whose products rarely appear in AI-generated answers.",
      "Stores relying heavily on paid ads for every sale.",
      "Catalogues with thin, duplicated or supplier-copied descriptions.",
      "Businesses preparing a replatform, redesign or range expansion.",
    ],

    outcomesTitle:
      "What This Service Aims to Improve",

    outcomes: [
      "Stronger product visibility in Google and AI search.",
      "Clearer category and product page purpose.",
      "Better product information for shoppers and search engines.",
      "Less indexation waste from filters, tags and thin URLs.",
      "A steadier flow of organic revenue over time.",
    ],

    processTitle: "How the Service Works",

    process: [
      {
        step: "01",
        title: "Discover",
        description:
          "RankVelt studies how your customers search, which products matter most and where discovery currently breaks down.",
      },
      {
        step: "02",
        title: "Audit",
        description:
          "A technical review covers crawlability, indexation, site speed, structured data and AI search visibility.",
      },
      {
        step: "03",
        title: "Optimise",
        description:
          "Priority fixes improve structure, product pages, metadata, internal links and content quality.",
      },
      {
        step: "04",
        title: "Expand",
        description:
          "New category, comparison and guide opportunities are built out to capture more buying-intent searches.",
      },
    ],

    faqs: [
      {
        question: "What are ecommerce SEO services?",
        answer:
          "They are ongoing SEO services for online stores: technical audits, keyword mapping, product and category optimisation, structured data, internal linking and content planning, all aimed at turning organic search into revenue.",
      },
      {
        question:
          "Do you offer SEO services for ecommerce stores on WooCommerce?",
        answer:
          "Yes. RankVelt provides SEO services for ecommerce stores on Shopify, WooCommerce and custom platforms. The fundamentals are the same and the implementation adapts to your setup.",
      },
      {
        question:
          "How do you optimise products for AI search like ChatGPT and Perplexity?",
        answer:
          "Through clear product information, structured data, strong category pages and content that answers buying questions directly. AI systems cite pages that are specific, well organised and easy to quote.",
      },
      {
        question:
          "Will this work for a store with thousands of products?",
        answer:
          "Yes. Large catalogues get a template-based approach: category frameworks, product page templates and rules for filters and variants, so improvements scale across the whole store.",
      },
      {
        question: "Do you rewrite product descriptions?",
        answer:
          "RankVelt can rewrite priority product and category pages and provide templates and guidelines for the rest. Supplier-copied descriptions are replaced with original, useful copy.",
      },
      {
        question: "How long before results appear?",
        answer:
          "Technical fixes can improve crawlability within weeks. Rankings and revenue impact usually build over three to six months as pages are recrawled and content gains traction.",
      },
      {
        question:
          "What do ecommerce SEO services cost?",
        answer:
          "RankVelt's ecommerce SEO services start from $525/month. The minimum term is 3 months, then it continues month-to-month. You will know the exact scope before anything starts.",
      },
      {
        question:
          "Can you work alongside our in-house team or developer?",
        answer:
          "Yes. RankVelt can lead the strategy while your team handles implementation, or handle everything directly. The working model is agreed before the engagement begins.",
      },
    ],

    relatedServices: [
      {
        title: "AI SEO Agency",
        description:
          "AI-first SEO built for Google and AI search visibility.",
        path: "/ai-seo-agency",
      },
      {
        title: "Shopify SEO Services",
        description:
          "Shopify-specific SEO with AI-search-ready product discovery.",
        path: "/shopify-seo-services",
      },
      {
        title: "SEO Audit Services",
        description:
          "A technical and AI-search audit before you commit to a retainer.",
        path: "/seo-audit-services",
      },
    ],
  };

export default function EcommerceSeoServicesService() {
  return (
    <SeoServiceTemplate
      config={ecommerceSeoServicesConfig}
    />
  );
}
