import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const ecommerceSeoConfig: SeoServicePageConfig = {
  slug: "/ecommerce-seo",

  metaTitle:
    "eCommerce SEO Services for Shopify Growth | RankVelt",

  metaDescription:
    "RankVelt provides eCommerce SEO services for Shopify stores that need stronger product discovery, collection visibility, technical SEO and organic sales.",

  eyebrow: "eCommerce SEO Services",

  h1:
    "eCommerce SEO Services for Better Product Discovery and Organic Sales",

  intro:
    "RankVelt helps Shopify stores improve collection visibility, product-page relevance, technical SEO, internal linking and the customer journey from search result to purchase.",

  focusAreas: [
    "Shopify SEO",
    "Collection Page SEO",
    "Product Discovery",
    "Technical SEO",
  ],

  overviewTitle:
    "Make It Easier for Search Engines and Customers to Discover Your Products",

  overviewParagraphs: [
    "A visually attractive store can still struggle when categories are unclear, product descriptions repeat generic copy, internal links are weak or filter URLs create indexation problems.",

    "RankVelt maps commercial search intent to the correct collections, products and supporting content. This creates clearer page purpose and reduces competition between similar URLs.",

    "The strategy combines technical SEO, content, product information, navigation and mobile usability so organic traffic has a stronger route to revenue.",
  ],

  deliverablesTitle:
    "What an eCommerce SEO Strategy Can Include",

  deliverables: [
    "Shopify technical SEO review and prioritised roadmap.",
    "Keyword mapping for collections, products and content.",
    "Collection-page content and metadata improvements.",
    "Product-page optimisation for relevance and conversion.",
    "Internal linking across products, categories and guides.",
    "Canonical, duplicate URL and indexation checks.",
    "Content opportunities aligned with buying intent.",
  ],

  audienceTitle:
    "eCommerce SEO Is a Strong Fit For",

  audience: [
    "Shopify brands relying heavily on paid traffic.",
    "Stores with products that are difficult to find in Google.",
    "Brands preparing for a migration or collection expansion.",
    "Stores with duplicated content or unclear navigation.",
    "Businesses that want SEO and conversion to work together.",
  ],

  outcomesTitle:
    "What Strong eCommerce SEO Should Improve",

  outcomes: [
    "Clearer product and collection discovery.",
    "Better alignment between search intent and landing pages.",
    "More useful product information and navigation.",
    "Reduced indexation waste from low-value URLs.",
    "A stronger organic foundation for sales growth.",
  ],

  processTitle:
    "A Search-Focused eCommerce SEO Process",

  process: [
    {
      step: "01",
      title: "Audit",
      description:
        "RankVelt reviews store structure, collections, products, technical SEO and customer journeys.",
    },
    {
      step: "02",
      title: "Map",
      description:
        "Commercial keywords are mapped to the most suitable collection, product or content pages.",
    },
    {
      step: "03",
      title: "Optimise",
      description:
        "Priority work improves structure, metadata, content, links and technical signals.",
    },
    {
      step: "04",
      title: "Expand",
      description:
        "New collection, comparison and content opportunities are developed.",
    },
  ],

  faqs: [
    {
      question:
        "Can RankVelt help with Shopify SEO?",
      answer:
        "Yes. RankVelt supports Shopify SEO through collection optimisation, product-page improvements, technical reviews, internal linking and search-focused content planning.",
    },
    {
      question:
        "Should Shopify collection pages include content?",
      answer:
        "Useful collection content can explain the category and support search relevance. It should remain concise and should not make product browsing difficult.",
    },
    {
      question: "Can product pages rank in Google?",
      answer:
        "Yes. Product pages can rank when they are useful, unique, technically accessible and aligned with specific customer searches.",
    },
    {
      question: "Will SEO replace paid advertising?",
      answer:
        "SEO and paid campaigns have different roles. Organic visibility can reduce dependence on ads over time, while ads may remain useful for immediate reach and testing.",
    },
  ],

  relatedServices: [
    {
      title: "Custom Shopify Liquid",
      description:
        "Build maintainable Shopify sections and functionality.",
      path: "/services/custom-liquid-development",
    },
    {
      title: "Mobile-First UX",
      description:
        "Improve mobile product discovery and buying journeys.",
      path: "/services/mobile-first-ux",
    },
    {
      title: "Checkout Optimisation",
      description:
        "Reduce cart and checkout friction.",
      path: "/services/checkout-flow",
    },
  ],
};

export default function EcommerceSEOService() {
  return (
    <SeoServiceTemplate config={ecommerceSeoConfig} />
  );
}