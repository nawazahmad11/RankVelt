import SeoServiceTemplate, {
    type SeoServicePageConfig,
  } from "./SeoServiceTemplate";
  
  const localSeoHvacConfig: SeoServicePageConfig = {
    slug: "/local-seo/hvac",
  
    metaTitle:
      "HVAC SEO Services | Local SEO for Heating & Cooling | RankVelt",
  
    metaDescription:
      "RankVelt provides HVAC SEO services that improve Google Maps visibility, local rankings, citations, reviews and call volume for heating and cooling companies.",
  
    eyebrow: "HVAC SEO Services",
  
    h1:
      "HVAC SEO Services That Turn Searches Into Booked Jobs",
  
    intro:
      "RankVelt helps HVAC companies improve Google visibility through Google Business Profile optimisation, accurate citations, review management, service-area pages and clearer local ranking signals for the services and areas you cover.",
  
    focusAreas: [
      "Google Business Profile",
      "Citations & NAP Consistency",
      "Review Management",
      "Service-Area Pages",
    ],
  
    overviewTitle:
      "Build Local Visibility Around the Services and Areas You Actually Cover",
  
    overviewParagraphs: [
      "HVAC searches shift with the seasons, from urgent AC repair in summer to furnace and heat pump needs in winter. HVAC SEO focuses on making sure your business appears, and looks trustworthy, whenever that search happens.",
  
      "RankVelt reviews the complete local search journey for an HVAC company. This includes Google Business Profile accuracy, service-page clarity, citation consistency, review activity, mobile usability and how easily a visitor can call or request a quote.",
  
      "The goal is not to chase every possible keyword or publish thin, duplicate city pages. The goal is to build genuine visibility for the services you offer and the areas you serve, so the right customers can find and call your business.",
    ],
  
    deliverablesTitle:
      "What an HVAC SEO Strategy Can Include",
  
    deliverables: [
      "Google Business Profile review and optimisation priorities.",
      "Local citation and directory consistency review.",
      "Review management support and reputation monitoring.",
      "Service-area pages for the locations you actually cover.",
      "On-page SEO for high-intent service pages, such as AC repair, furnace repair and system replacement.",
      "Seasonal content planning for cooling and heating demand.",
      "Conversion improvements for calls, form enquiries and quote requests.",
    ],
  
    audienceTitle: "HVAC SEO Is a Strong Fit For",
  
    audience: [
      "Residential HVAC companies and emergency repair providers.",
      "Commercial HVAC contractors.",
      "Companies offering high-ticket system replacements and heat pump upgrades.",
      "Multi-location HVAC businesses expanding into new areas.",
      "Businesses with visibility but weak calls, form enquiries or bookings.",
    ],
  
    outcomesTitle:
      "What Strong HVAC SEO Should Improve",
  
    outcomes: [
      "Clearer visibility for relevant local HVAC searches.",
      "Better alignment between your website and Google Business Profile.",
      "Stronger discovery of priority services and service areas.",
      "More useful mobile journeys for calls and emergency requests.",
      "A scalable foundation for adding new locations or high-ticket services.",
    ],
  
    processTitle: "A Practical HVAC SEO Process",
  
    process: [
      {
        step: "01",
        title: "Review",
        description:
          "RankVelt reviews your website, Google Business Profile, local competitors, service pages and current visibility.",
      },
      {
        step: "02",
        title: "Prioritise",
        description:
          "The highest-value service pages, profile improvements, technical fixes and local opportunities are identified.",
      },
      {
        step: "03",
        title: "Improve",
        description:
          "Priority work strengthens local relevance, page clarity, internal links and call-generation paths.",
      },
      {
        step: "04",
        title: "Refine",
        description:
          "Search performance and seasonal call patterns guide future improvements.",
      },
    ],
  
    faqs: [
      {
        question: "Is SEO worth it for an HVAC business?",
        answer:
          "For most HVAC companies, yes. Customers actively search Google before calling a heating or cooling company, so accurate visibility, clear service pages and a strong Google Business Profile directly affect how many of those searches turn into calls.",
      },
      {
        question: "How long does HVAC SEO take to show results?",
        answer:
          "Timing depends on your current visibility, local competition, website condition and the amount of work required. Meaningful local growth for an HVAC business usually develops over several months, not weeks.",
      },
      {
        question:
          "What is Local SEO and how is it different from general SEO for HVAC companies?",
        answer:
          "General SEO focuses on overall website visibility, while Local SEO focuses specifically on Google Maps rankings, Google Business Profile signals, citations and location-based searches, which is where most HVAC customers begin their search.",
      },
      {
        question: "What does RankVelt's HVAC SEO service include?",
        answer:
          "Typical work includes Google Business Profile optimisation, citation and NAP consistency, review management support, service-area pages, service-page SEO and seasonal content planning, scoped to your business.",
      },
      {
        question: "Do you work with HVAC businesses outside the USA?",
        answer:
          "Yes. RankVelt works with HVAC businesses in the USA, UK, Australia and Canada, adjusting local SEO signals to match each country's search behaviour and directories.",
      },
      {
        question: "Can RankVelt help promote high-ticket system replacements?",
        answer:
          "Yes. RankVelt builds dedicated service pages and content for high-ticket HVAC work, such as system replacements and heat pump upgrades, rather than relying on one generic services page.",
      },
    ],
  
    relatedServices: [
      {
        title: "Local SEO Services",
        description:
          "See the full local SEO approach RankVelt applies across local and service-area businesses.",
        path: "/local-seo",
      },
      {
        title: "HVAC SEO Guide",
        description:
          "Read RankVelt's full guide on HVAC SEO, seasonal strategy and common mistakes.",
        path: "/blog/hvac-seo-guide",
      },
      {
        title: "Local SEO Checklist",
        description:
          "Use RankVelt's free scorecard to review your business's Google Business Profile and website.",
        path: "/tools/local-seo-checklist",
      },
    ],
  };
  
  export default function LocalSEOHvac() {
    return <SeoServiceTemplate config={localSeoHvacConfig} />;
  }