import SeoServiceTemplate, {
    type SeoServicePageConfig,
  } from "./SeoServiceTemplate";
  
  const localSeoElectriciansConfig: SeoServicePageConfig = {
    slug: "/local-seo/electricians",
  
    metaTitle:
      "Electrician SEO Services | Local SEO for Electricians | RankVelt",
  
    metaDescription:
      "RankVelt provides electrician SEO services that improve Google Maps visibility, local rankings, citations, reviews and call volume for electrical contractors.",
  
    eyebrow: "Electrician SEO Services",
  
    h1:
      "Electrician SEO Services That Turn Searches Into Booked Jobs",
  
    intro:
      "RankVelt helps electrical contractors improve Google visibility through Google Business Profile optimisation, accurate citations, review management, service-area pages and clearer local ranking signals for the services and areas you cover.",
  
    focusAreas: [
      "Google Business Profile",
      "Citations & NAP Consistency",
      "Review Management",
      "Service-Area Pages",
    ],
  
    overviewTitle:
      "Build Local Visibility Around the Services and Areas You Actually Cover",
  
    overviewParagraphs: [
      "Electrical searches fall into two groups: urgent problems, such as a power outage, and planned, high-ticket work, such as EV charger installation or a generator setup. Electrician SEO focuses on making sure your business appears, and looks trustworthy, for both.",
  
      "RankVelt reviews the complete local search journey for an electrical contractor. This includes Google Business Profile accuracy, service-page clarity, citation consistency, review activity, mobile usability and how easily a visitor can call or request a quote.",
  
      "The goal is not to chase every possible keyword or publish thin, duplicate city pages. The goal is to build genuine visibility for the services you offer and the areas you serve, so the right customers can find and call your business.",
    ],
  
    deliverablesTitle:
      "What an Electrician SEO Strategy Can Include",
  
    deliverables: [
      "Google Business Profile review and optimisation priorities.",
      "Local citation and directory consistency review.",
      "Review management support and reputation monitoring.",
      "Service-area pages for the locations you actually cover.",
      "On-page SEO for high-intent service pages, such as EV charger installation, panel upgrades and rewiring.",
      "Technical SEO and mobile usability improvements.",
      "Conversion improvements for calls, form enquiries and quote requests.",
    ],
  
    audienceTitle: "Electrician SEO Is a Strong Fit For",
  
    audience: [
      "Residential electrical contractors and emergency electricians.",
      "Commercial and industrial electrical contractors.",
      "Electricians offering EV charger installation and generator services.",
      "Multi-location electrical businesses expanding into new areas.",
      "Businesses with visibility but weak calls, form enquiries or bookings.",
    ],
  
    outcomesTitle:
      "What Strong Electrician SEO Should Improve",
  
    outcomes: [
      "Clearer visibility for relevant local electrical searches.",
      "Better alignment between your website and Google Business Profile.",
      "Stronger discovery of priority services and service areas.",
      "More useful mobile journeys for calls and emergency requests.",
      "A scalable foundation for adding new locations or high-ticket services.",
    ],
  
    processTitle: "A Practical Electrician SEO Process",
  
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
          "Search performance and call enquiry behaviour guide future improvements.",
      },
    ],
  
    faqs: [
      {
        question: "Is SEO worth it for an electrical business?",
        answer:
          "For most electrical contractors, yes. Customers actively search Google before calling an electrician, so accurate visibility, clear service pages and a strong Google Business Profile directly affect how many of those searches turn into calls.",
      },
      {
        question: "How long does electrician SEO take to show results?",
        answer:
          "Timing depends on your current visibility, local competition, website condition and the amount of work required. Meaningful local growth for an electrical business usually develops over several months, not weeks.",
      },
      {
        question:
          "What is Local SEO and how is it different from general SEO for electricians?",
        answer:
          "General SEO focuses on overall website visibility, while Local SEO focuses specifically on Google Maps rankings, Google Business Profile signals, citations and location-based searches, which is where most electrical customers begin their search.",
      },
      {
        question: "What does RankVelt's electrician SEO service include?",
        answer:
          "Typical work includes Google Business Profile optimisation, citation and NAP consistency, review management support, service-area pages, service-page SEO and Google Maps ranking improvements, scoped to your business.",
      },
      {
        question: "Do you work with electrical businesses outside the USA?",
        answer:
          "Yes. RankVelt works with electrical businesses in the USA, UK, Australia and Canada, adjusting local SEO signals to match each country's search behaviour and directories.",
      },
      {
        question: "Can RankVelt help promote high-ticket services like EV charger installation?",
        answer:
          "Yes. RankVelt builds dedicated service pages and content for high-ticket electrical work, such as EV charger installation and generator setup, rather than relying on one generic services page.",
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
        title: "Electrician SEO Guide",
        description:
          "Read RankVelt's full guide on electrician SEO, common mistakes and quick wins.",
        path: "/blog/electrician-seo-guide",
      },
      {
        title: "Local SEO Checklist",
        description:
          "Use RankVelt's free scorecard to review your business's Google Business Profile and website.",
        path: "/tools/local-seo-checklist",
      },
    ],
  };
  
  export default function LocalSEOElectricians() {
    return <SeoServiceTemplate config={localSeoElectriciansConfig} />;
  }