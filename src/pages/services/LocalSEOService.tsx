import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const localSeoConfig: SeoServicePageConfig = {
  slug: "/local-seo",

  metaTitle:
    "Local SEO Services for More Local Leads | RankVelt",

  metaDescription:
    "RankVelt provides local SEO services for stronger Google Maps visibility, local rankings, service-area traffic, calls, bookings and qualified leads.",

  eyebrow: "Local SEO Services",

  h1:
    "Local SEO Services That Help Nearby Customers Find Your Business",

  intro:
    "RankVelt helps local and service-area businesses improve Google visibility through stronger service pages, Google Business Profile signals, local keyword targeting, technical SEO and clearer lead-generation journeys.",

  focusAreas: [
    "Google Business Profile",
    "Local Keyword Research",
    "Service-Area Pages",
    "Local Lead Conversion",
  ],

  overviewTitle:
    "Build Local Visibility Around the Services and Areas You Actually Serve",

  overviewParagraphs: [
    "Local SEO connects your website, Google Business Profile, services, location relevance and customer trust signals. Each part should make it easier for nearby customers to understand what you offer and how to contact you.",

    "RankVelt reviews the complete local search journey. This includes service-page visibility, business information, local content, internal links, mobile usability, review signals and conversion paths.",

    "The goal is not to publish dozens of thin city pages. The goal is to create useful local pages and search signals that support real customers, Google Search and AI-powered discovery.",
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
  ],

  audienceTitle: "Local SEO Is a Strong Fit For",

  audience: [
    "Home-service businesses such as roofers, plumbers, cleaners and electricians.",
    "Clinics, salons, gyms and appointment-led businesses.",
    "Consultants, accountants, lawyers and professional service companies.",
    "Companies serving specific cities, suburbs or service areas.",
    "Businesses with visibility but weak calls, enquiries or bookings.",
  ],

  outcomesTitle:
    "What Strong Local SEO Should Improve",

  outcomes: [
    "Clearer visibility for relevant local searches.",
    "Better alignment between your website and Google Business Profile.",
    "Stronger discovery of priority services and service areas.",
    "More useful mobile journeys for calls and enquiries.",
    "A scalable foundation for future local expansion.",
  ],

  processTitle: "A Practical Local SEO Process",

  process: [
    {
      step: "01",
      title: "Review",
      description:
        "RankVelt reviews your website, Google Business Profile, local competitors, service areas and current visibility.",
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
        "Priority work strengthens local relevance, page clarity, internal links and lead-generation paths.",
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
  ],

  relatedServices: [
    {
      title: "Business SEO",
      description:
        "Build stronger service pages and organic lead-generation systems.",
      path: "/business-seo",
    },
    {
      title: "Mobile-First UX",
      description:
        "Improve mobile usability and lead-generation journeys.",
      path: "/services/mobile-first-ux",
    },
    {
      title: "SEO Tools",
      description:
        "Use RankVelt tools for metadata, schema and technical SEO.",
      path: "/tools",
    },
  ],
};

export default function LocalSEOService() {
  return <SeoServiceTemplate config={localSeoConfig} />;
}