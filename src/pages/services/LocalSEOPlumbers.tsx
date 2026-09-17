import SeoServiceTemplate, {
    type SeoServicePageConfig,
  } from "./SeoServiceTemplate";
  
  const localSeoPlumbersConfig: SeoServicePageConfig = {
    slug: "/local-seo/plumbers",
  
    metaTitle:
      "Plumbing SEO Services | Local SEO for Plumbers | RankVelt",
  
    metaDescription:
      "RankVelt provides plumbing SEO services that improve Google Maps visibility, local rankings, citations, reviews and call volume for plumbing companies.",
  
    eyebrow: "Plumbing SEO Services",
  
    h1:
      "Plumbing SEO Services That Turn Searches Into Booked Jobs",
  
    intro:
      "RankVelt helps plumbing companies improve Google visibility through Google Business Profile optimisation, accurate citations, review management, service-area pages and clearer local ranking signals for the services and areas you cover.",
  
    focusAreas: [
      "Google Business Profile",
      "Citations & NAP Consistency",
      "Review Management",
      "Service-Area Pages",
    ],
  
    overviewTitle:
      "Build Local Visibility Around the Services and Areas You Actually Cover",
  
    overviewParagraphs: [
      "Most plumbing calls start with an urgent Google search, such as \"emergency plumber near me\" or \"water heater repair in [city]\". Plumbing SEO focuses on making sure your business appears, and looks trustworthy, at that exact moment.",
  
      "RankVelt reviews the complete local search journey for a plumbing business. This includes Google Business Profile accuracy, service-page clarity, citation consistency, review activity, mobile usability and how easily a visitor can call or request a booking.",
  
      "The goal is not to chase every possible keyword or publish thin, duplicate city pages. The goal is to build genuine visibility for the services you offer and the areas you serve, so the right customers can find and call your business.",
    ],
  
    deliverablesTitle:
      "What a Plumbing SEO Strategy Can Include",
  
    deliverables: [
      "Google Business Profile review and optimisation priorities.",
      "Local citation and directory consistency review.",
      "Review management support and reputation monitoring.",
      "Service-area pages for the locations you actually cover.",
      "On-page SEO for high-intent service pages, such as emergency plumbing, water heaters and drain cleaning.",
      "Technical SEO and mobile usability improvements.",
      "Conversion improvements for calls, form enquiries and booking requests.",
    ],
  
    audienceTitle: "Plumbing SEO Is a Strong Fit For",
  
    audience: [
      "Residential plumbing companies and emergency plumbers.",
      "Commercial plumbing contractors.",
      "Multi-location plumbing businesses expanding into new areas.",
      "Plumbing franchises needing consistent, non-duplicate location pages.",
      "Businesses with visibility but weak calls, form enquiries or bookings.",
    ],
  
    outcomesTitle:
      "What Strong Plumbing SEO Should Improve",
  
    outcomes: [
      "Clearer visibility for relevant local plumbing searches.",
      "Better alignment between your website and Google Business Profile.",
      "Stronger discovery of priority services and service areas.",
      "More useful mobile journeys for calls and emergency requests.",
      "A scalable foundation for adding new locations or services.",
    ],
  
    processTitle: "A Practical Plumbing SEO Process",
  
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
        question: "Is SEO worth it for a plumbing business?",
        answer:
          "For most plumbing companies, yes. Customers actively search Google before calling a plumber, so accurate visibility, clear service pages and a strong Google Business Profile directly affect how many of those searches turn into calls.",
      },
      {
        question: "How long does plumbing SEO take to show results?",
        answer:
          "Timing depends on your current visibility, local competition, website condition and the amount of work required. Meaningful local growth for a plumbing business usually develops over several months, not weeks.",
      },
      {
        question:
          "What is Local SEO and how is it different from general SEO for plumbers?",
        answer:
          "General SEO focuses on overall website visibility, while Local SEO focuses specifically on Google Maps rankings, Google Business Profile signals, citations and location-based searches, which is where most plumbing customers begin their search.",
      },
      {
        question: "What does RankVelt's plumbing SEO service include?",
        answer:
          "Typical work includes Google Business Profile optimisation, citation and NAP consistency, review management support, service-area pages, service-page SEO and Google Maps ranking improvements, scoped to your business.",
      },
      {
        question: "Do you work with plumbing businesses outside the USA?",
        answer:
          "Yes. RankVelt works with plumbing businesses in the USA, UK, Australia and Canada, adjusting local SEO signals to match each country's search behaviour and directories.",
      },
      {
        question: "Can RankVelt help a multi-location plumbing company?",
        answer:
          "Yes. Multi-location plumbing companies need consistent, non-duplicate location pages, separate Google Business Profiles for each location, and clear internal linking, which RankVelt plans as part of the strategy.",
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
        title: "Plumbing SEO Guide",
        description:
          "Read RankVelt's full guide on plumbing SEO, common mistakes and quick wins.",
        path: "/blog/plumbing-seo-guide",
      },
      {
        title: "Local SEO Checklist",
        description:
          "Use RankVelt's free scorecard to review your business's Google Business Profile and website.",
        path: "/tools/local-seo-checklist",
      },
    ],
  };
  
  export default function LocalSEOPlumbers() {
    return <SeoServiceTemplate config={localSeoPlumbersConfig} />;
  }