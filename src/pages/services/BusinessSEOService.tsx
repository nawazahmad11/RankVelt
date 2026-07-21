import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const businessSeoConfig: SeoServicePageConfig = {
  slug: "/business-seo",

  metaTitle:
    "Business SEO Services for Organic Leads | RankVelt",

  metaDescription:
    "RankVelt provides business SEO services for companies, consultants and agencies that need qualified organic traffic, stronger service pages and leads.",

  eyebrow: "Business SEO Services",

  h1:
    "Business SEO Services for Sustainable Organic Lead Generation",

  intro:
    "RankVelt helps service businesses turn their website into a stronger growth asset through search-focused service pages, technical SEO, content planning, internal linking and conversion-ready structure.",

  focusAreas: [
    "Service Page SEO",
    "Organic Lead Generation",
    "Technical SEO",
    "Content Strategy",
  ],

  overviewTitle:
    "Build an SEO Strategy Around the Services That Drive Your Business",

  overviewParagraphs: [
    "Business SEO is more than publishing blog posts. Your priority services need dedicated pages, clear search intent, useful information and a simple route to enquiry.",

    "RankVelt identifies the pages, search themes, technical improvements and content opportunities most likely to attract qualified prospects.",

    "The roadmap is shaped around your services, audience, sales process, competition and current website condition.",
  ],

  deliverablesTitle:
    "What a Business SEO Strategy Can Include",

  deliverables: [
    "SEO audit and prioritised growth roadmap.",
    "Service-page and landing-page optimisation.",
    "Commercial keyword and competitor research.",
    "Technical SEO implementation priorities.",
    "Website architecture and internal linking.",
    "Service, comparison and guide content planning.",
    "Conversion improvements for calls and forms.",
  ],

  audienceTitle:
    "Business SEO Is a Strong Fit For",

  audience: [
    "Service businesses that need qualified leads.",
    "Consultants, agencies, SaaS and B2B companies.",
    "Businesses with weak service-page visibility.",
    "Companies expanding into new services or markets.",
    "Brands preparing to scale content or advertising.",
  ],

  outcomesTitle:
    "What Strong Business SEO Should Improve",

  outcomes: [
    "Clearer visibility for valuable services.",
    "Better website structure and navigation.",
    "More qualified traffic to service pages.",
    "Stronger conversion paths from search to enquiry.",
    "A scalable SEO foundation for future growth.",
  ],

  processTitle:
    "A Business SEO Process Built Around Real Priorities",

  process: [
    {
      step: "01",
      title: "Understand",
      description:
        "RankVelt reviews your services, audience, competitors and desired customer actions.",
    },
    {
      step: "02",
      title: "Plan",
      description:
        "A focused roadmap is created for service pages, keywords, content and technical improvements.",
    },
    {
      step: "03",
      title: "Build",
      description:
        "Priority pages and technical foundations are improved.",
    },
    {
      step: "04",
      title: "Improve",
      description:
        "Search performance and new market opportunities guide continued work.",
    },
  ],

  faqs: [
    {
      question:
        "What is the difference between business SEO and local SEO?",
      answer:
        "Local SEO focuses on nearby customers and location-based visibility. Business SEO may include regional, national or broader service-page and content strategies.",
    },
    {
      question: "Can SEO generate qualified leads?",
      answer:
        "SEO can attract people searching for relevant services. Lead quality also depends on the offer, targeting, trust and conversion path.",
    },
    {
      question:
        "Can RankVelt improve an existing website?",
      answer:
        "Yes. RankVelt can audit and improve an existing website or support a redesign where the current structure limits growth.",
    },
    {
      question:
        "Which pages should a service business prioritise?",
      answer:
        "Priority service pages, high-value landing pages, relevant proof pages and supporting content should usually come first.",
    },
  ],

  relatedServices: [
    {
      title: "Local SEO",
      description:
        "Improve local visibility and service-area leads.",
      path: "/local-seo",
    },
    {
      title: "eCommerce SEO",
      description:
        "Improve Shopify product discovery and sales.",
      path: "/ecommerce-seo",
    },
    {
      title: "SEO Tools",
      description:
        "Use RankVelt tools for practical SEO tasks.",
      path: "/tools",
    },
  ],
};

export default function BusinessSEOService() {
  return (
    <SeoServiceTemplate config={businessSeoConfig} />
  );
}