import SeoServiceTemplate, {
    type SeoServicePageConfig,
  } from "./SeoServiceTemplate";
  
  const businessSeoConfig: SeoServicePageConfig = {
    slug: "/business-seo",
    metaTitle: "Business SEO Services for Organic Lead Generation | RankVelt",
    metaDescription:
      "RankVelt provides Business SEO services for service companies, consultants, agencies, and growing businesses that need stronger website visibility, qualified traffic, and organic leads.",
    eyebrow: "Business SEO Services",
    h1: "Business SEO Services for Sustainable Organic Lead Generation",
    intro:
      "RankVelt helps service businesses, consultants, agencies, and growing companies turn their website into a stronger organic growth asset through search-focused service pages, technical SEO, content planning, and conversion-ready website structure.",
    ctaPackage: "Business SEO Strategy Call",
    focusAreas: [
      "Service Page SEO",
      "Organic Lead Generation",
      "Technical SEO",
      "Content Strategy",
    ],
    overviewTitle:
      "Build an SEO Strategy Around the Services That Drive Your Business",
    overviewParagraphs: [
      "Business SEO is about more than publishing blog posts. Your highest-value services need clear pages, relevant search intent, useful content, internal links, technical health, and a website structure that gives visitors a simple route to enquire.",
      "RankVelt helps businesses identify which pages, topics, search terms, and technical improvements are most likely to support qualified organic traffic and better lead generation.",
      "The strategy is shaped around your business model, target customer, service offer, location coverage, competition, and current website condition.",
    ],
    deliverablesTitle: "What a Business SEO Strategy Can Include",
    deliverables: [
      "SEO audit and high-priority growth roadmap.",
      "Service-page and landing-page optimisation.",
      "Keyword research aligned with commercial search intent.",
      "Technical SEO review and implementation priorities.",
      "Internal-linking and website information architecture.",
      "Content strategy for service, comparison, guide, and support topics.",
      "Conversion recommendations for contact, booking, and enquiry journeys.",
    ],
    audienceTitle: "Business SEO Is a Strong Fit For",
    audience: [
      "Service businesses that need more qualified leads from Google.",
      "Consultants, agencies, SaaS providers, and B2B companies.",
      "Businesses with an existing website but weak service-page visibility.",
      "Companies expanding into new services, locations, or markets.",
      "Brands that need a stronger SEO foundation before investing heavily in content or ads.",
    ],
    processTitle: "A Business SEO Process Built Around Real Priorities",
    process: [
      {
        step: "01",
        title: "Understand",
        description:
          "We review your services, audience, current website, competitors, search landscape, and the business actions you want visitors to take.",
      },
      {
        step: "02",
        title: "Plan",
        description:
          "RankVelt creates a focused roadmap covering service pages, keyword targets, technical gaps, internal links, and content priorities.",
      },
      {
        step: "03",
        title: "Build",
        description:
          "The work improves the pages, structure, and technical foundation needed for stronger search relevance and lead generation.",
      },
      {
        step: "04",
        title: "Improve",
        description:
          "We refine the approach using search performance, page behaviour, market changes, and new opportunities identified over time.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between Business SEO and Local SEO?",
        answer:
          "Local SEO focuses on location-based visibility and nearby customers. Business SEO is broader and can include service pages, national or regional targeting, technical SEO, content strategy, and organic lead generation across a wider market.",
      },
      {
        question: "Can Business SEO work for a new website?",
        answer:
          "Yes. Starting with SEO-first website structure, service pages, keyword mapping, technical foundations, and clear conversion paths can make future growth more organised and efficient.",
      },
      {
        question: "Do I need a blog for Business SEO?",
        answer:
          "Not always at the start. Priority service pages and technical issues often need attention first. A blog or resource hub becomes useful when it supports real questions, commercial research, topical authority, and internal linking.",
      },
      {
        question: "Can RankVelt improve an existing WordPress website?",
        answer:
          "Yes. RankVelt can review WordPress website structure, page content, technical SEO, mobile usability, internal links, and conversion paths before deciding whether optimisation or redesign is the better option.",
      },
    ],
    relatedServices: [
      {
        title: "Local SEO",
        description:
          "For businesses that need stronger local visibility, Google Maps presence, and service-area enquiries.",
        path: "/local-seo",
      },
      {
        title: "eCommerce SEO",
        description:
          "For Shopify stores and online brands that need better collection, product, category, and organic sales visibility.",
        path: "/ecommerce-seo",
      },
    ],
  };
  
  const BusinessSEOService = () => {
    return <SeoServiceTemplate config={businessSeoConfig} />;
  };
  
  export default BusinessSEOService;