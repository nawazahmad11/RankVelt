import SeoServiceTemplate, {
    type SeoServicePageConfig,
  } from "./SeoServiceTemplate";
  
  const ecommerceSeoConfig: SeoServicePageConfig = {
    slug: "/ecommerce-seo",
    metaTitle: "eCommerce SEO Services for Shopify Stores | RankVelt",
    metaDescription:
      "RankVelt provides eCommerce SEO services for Shopify stores and online brands that need stronger product discovery, collection-page visibility, technical SEO, and organic sales growth.",
    eyebrow: "eCommerce SEO Services",
    h1: "eCommerce SEO Services for Shopify Stores and Online Brands",
    intro:
      "RankVelt helps eCommerce brands improve organic visibility through search-focused collection pages, product-page structure, technical SEO, internal linking, content opportunities, and better product discovery journeys.",
    ctaPackage: "eCommerce SEO Strategy Call",
    focusAreas: [
      "Shopify SEO Foundations",
      "Collection Page SEO",
      "Product Discovery",
      "Technical SEO Review",
    ],
    overviewTitle:
      "Make It Easier for Search Engines and Customers to Discover Your Products",
    overviewParagraphs: [
      "eCommerce SEO works best when your store is organised around how customers search, browse, compare, and buy. A visually attractive store can still struggle when categories are unclear, product pages are thin, filters create crawl issues, or internal links are weak.",
      "RankVelt reviews the technical and content foundations behind product discovery. The goal is to improve the pages that can attract relevant organic traffic while making the path from search result to product clearer for users.",
      "The work can include Shopify collection-page SEO, product-page improvements, keyword mapping, internal-linking structure, technical checks, and content planning around real search demand.",
    ],
    deliverablesTitle: "What an eCommerce SEO Strategy Can Include",
    deliverables: [
      "Shopify technical SEO review and issue prioritisation.",
      "Keyword mapping for collections, categories, products, and content.",
      "Collection-page SEO recommendations and content structure.",
      "Product-page optimisation guidance for search and user clarity.",
      "Internal-linking improvements across categories and products.",
      "Duplicate-content, indexation, and crawlability checks.",
      "Content opportunities that support commercial search intent.",
    ],
    audienceTitle: "eCommerce SEO Is a Strong Fit For",
    audience: [
      "Shopify brands that rely heavily on ads and want stronger organic visibility.",
      "Stores with collections, products, or categories that are difficult to find in Google.",
      "eCommerce brands preparing for a redesign, migration, or major collection expansion.",
      "Businesses that need better product discovery, navigation, and search-focused store architecture.",
      "Online stores that want SEO and conversion thinking to work together.",
    ],
    processTitle: "A Search-Focused eCommerce SEO Process",
    process: [
      {
        step: "01",
        title: "Audit",
        description:
          "We review Shopify structure, collection pages, product pages, technical SEO, keyword opportunities, and user journeys.",
      },
      {
        step: "02",
        title: "Map",
        description:
          "RankVelt maps priority keywords and commercial search intent to the right product, collection, category, or content pages.",
      },
      {
        step: "03",
        title: "Optimise",
        description:
          "The priority work focuses on page structure, technical fixes, internal links, content improvements, and product discovery.",
      },
      {
        step: "04",
        title: "Expand",
        description:
          "As the foundation improves, we identify additional collection, content, category, and authority opportunities for growth.",
      },
    ],
    faqs: [
      {
        question: "Can you help with Shopify SEO?",
        answer:
          "Yes. RankVelt supports Shopify SEO through collection-page optimisation, product-page structure, technical SEO, internal linking, keyword mapping, and search-focused store improvements.",
      },
      {
        question: "Should every product page target a keyword?",
        answer:
          "Important products should be structured around real customer search language, but not every product requires a separate high-volume keyword target. The strategy depends on demand, category structure, uniqueness, and your store goals.",
      },
      {
        question: "Can eCommerce SEO help reduce dependence on paid ads?",
        answer:
          "Organic search can create an additional discovery channel over time. It does not replace advertising instantly, but stronger category and product visibility can help diversify traffic sources.",
      },
      {
        question: "Do you redesign Shopify stores as part of SEO work?",
        answer:
          "Yes, when the store structure, navigation, templates, mobile experience, or product discovery flow is holding back SEO and conversions. RankVelt can scope SEO-ready Shopify design support where needed.",
      },
    ],
    relatedServices: [
      {
        title: "Local SEO",
        description:
          "For service businesses that need stronger Google Maps visibility, local pages, and qualified local enquiries.",
        path: "/local-seo",
      },
      {
        title: "Business SEO",
        description:
          "For growing companies that need sustainable organic lead generation beyond a Shopify store.",
        path: "/business-seo",
      },
    ],
  };
  
  const EcommerceSEOService = () => {
    return <SeoServiceTemplate config={ecommerceSeoConfig} />;
  };
  
  export default EcommerceSEOService;