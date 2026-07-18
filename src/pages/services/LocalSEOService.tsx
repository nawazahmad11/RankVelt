import SeoServiceTemplate, {
    type SeoServicePageConfig,
  } from "./SeoServiceTemplate";
  
  const localSeoConfig: SeoServicePageConfig = {
    slug: "/local-seo",
    metaTitle: "Local SEO Services for Local Businesses | RankVelt",
    metaDescription:
      "RankVelt provides Local SEO services for businesses that want stronger Google Maps visibility, local search rankings, service-area traffic, calls, and qualified leads.",
    eyebrow: "Local SEO Services",
    h1: "Local SEO Services That Help Nearby Customers Find Your Business",
    intro:
      "RankVelt helps service businesses improve local search visibility through stronger Google Business Profile signals, location-focused pages, local keyword targeting, technical SEO, and clear conversion paths.",
    ctaPackage: "Local SEO Strategy Call",
    focusAreas: [
      "Google Business Profile",
      "Local Keyword Research",
      "Service-Area Pages",
      "Local Lead Conversion",
    ],
    overviewTitle:
      "Build Local Visibility Around the Services and Areas You Actually Serve",
    overviewParagraphs: [
      "Local SEO is not just about appearing on Google Maps. Your website, service pages, Google Business Profile, business information, internal links, and local relevance all need to work together.",
      "RankVelt focuses on the pages and local search signals that help nearby customers understand what you offer, where you work, and why they should contact your business.",
      "The approach is built around useful local content, accurate business details, technically sound website pages, and clear next steps for calls, enquiries, bookings, or direction requests.",
    ],
    deliverablesTitle: "What a Local SEO Strategy Can Include",
    deliverables: [
      "Google Business Profile review and optimisation guidance.",
      "Local keyword and service-area opportunity research.",
      "Local service page structure and content recommendations.",
      "Location pages where they genuinely add value for users.",
      "On-page SEO improvements for core service pages.",
      "Technical SEO and internal-linking checks.",
      "Local conversion recommendations for calls, forms, and bookings.",
    ],
    audienceTitle: "Local SEO Is a Strong Fit For",
    audience: [
      "Home-service businesses such as roofers, plumbers, electricians, and cleaners.",
      "Professional services including consultants, accountants, lawyers, and agencies.",
      "Clinics, salons, gyms, wellness businesses, and appointment-led companies.",
      "Businesses serving specific cities, suburbs, regions, or service areas.",
      "Companies with an existing website that is not generating enough local enquiries.",
    ],
    processTitle: "A Practical Local SEO Process",
    process: [
      {
        step: "01",
        title: "Review",
        description:
          "We assess your website, Google Business Profile, local competition, service areas, and the search terms connected to your business.",
      },
      {
        step: "02",
        title: "Prioritise",
        description:
          "You receive clear priorities for your local pages, business profile, technical gaps, content needs, and conversion improvements.",
      },
      {
        step: "03",
        title: "Improve",
        description:
          "RankVelt improves the pages and local search signals most relevant to qualified enquiries and stronger local visibility.",
      },
      {
        step: "04",
        title: "Refine",
        description:
          "We review progress, identify new opportunities, and refine the strategy around real search demand and business goals.",
      },
    ],
    faqs: [
      {
        question: "Can Local SEO work for a business without a physical shop?",
        answer:
          "Yes. Service-area businesses can still use Local SEO when their website, service pages, business profile, service locations, and customer journey are structured clearly and accurately.",
      },
      {
        question: "Do I need a Google Business Profile for Local SEO?",
        answer:
          "A Google Business Profile is often an important part of Local SEO, especially for map visibility. However, website content, local relevance, technical SEO, and clear service pages also matter.",
      },
      {
        question: "Can you help me target more than one city?",
        answer:
          "Yes, where it makes real business and user sense. RankVelt can review how to structure service-area pages, city pages, or regional content without creating thin or repetitive pages.",
      },
      {
        question: "Does Local SEO guarantee Google Maps rankings?",
        answer:
          "No. Local rankings depend on competition, location, relevance, website quality, business profile signals, and other factors. RankVelt focuses on improving the elements within your control.",
      },
    ],
    relatedServices: [
      {
        title: "eCommerce SEO",
        description:
          "For Shopify stores and online brands that need stronger product, collection, category, and organic sales visibility.",
        path: "/ecommerce-seo",
      },
      {
        title: "Business SEO",
        description:
          "For service companies and growing businesses that need a wider organic lead-generation strategy.",
        path: "/business-seo",
      },
    ],
  };
  
  const LocalSEOService = () => {
    return <SeoServiceTemplate config={localSeoConfig} />;
  };
  
  export default LocalSEOService;