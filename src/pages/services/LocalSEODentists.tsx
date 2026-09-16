import SeoServiceTemplate, {
    type SeoServicePageConfig,
  } from "./SeoServiceTemplate";
  
  const localSeoDentistsConfig: SeoServicePageConfig = {
    slug: "/local-seo/dentists",
  
    metaTitle:
      "Dental SEO Services | Local SEO for Dentists | RankVelt",
  
    metaDescription:
      "RankVelt provides dental SEO services that improve Google Maps visibility, local rankings, citations, reviews and patient enquiries for dental practices.",
  
    eyebrow: "Dental SEO Services",
  
    h1:
      "Dental SEO Services That Help Patients Find Your Practice",
  
    intro:
      "RankVelt helps dental practices improve Google visibility through Google Business Profile optimisation, accurate citations, review management, local landing pages and clearer local ranking signals for the treatments and areas you serve.",
  
    focusAreas: [
      "Google Business Profile",
      "Citations & NAP Consistency",
      "Review Management",
      "Local Landing Pages",
    ],
  
    overviewTitle:
      "Build Local Visibility Around the Treatments and Areas You Actually Serve",
  
    overviewParagraphs: [
      "Patients usually search for a dentist the same way they search for any local service, by typing what they need and where they are, such as \"dentist near me\" or \"emergency dentist in [city]\". Dental SEO focuses on making sure your practice appears, and looks trustworthy, at that exact moment.",
  
      "RankVelt reviews the complete local search journey for a dental practice. This includes Google Business Profile accuracy, treatment-page clarity, citation consistency, review activity, mobile usability and how easily a visitor can call or book an appointment.",
  
      "The goal is not to chase every possible keyword. The goal is to build genuine visibility for the treatments you offer and the areas you serve, so the right patients can find and choose your practice.",
    ],
  
    deliverablesTitle:
      "What a Dental SEO Strategy Can Include",
  
    deliverables: [
      "Google Business Profile review and optimisation priorities.",
      "Local citation and directory consistency review.",
      "Review management support and reputation monitoring.",
      "Local landing pages for the treatments and locations you serve.",
      "On-page SEO for high-intent treatment pages, such as implants, orthodontics and emergency care.",
      "Technical SEO and mobile usability improvements.",
      "Conversion improvements for calls, form enquiries and appointment bookings.",
    ],
  
    audienceTitle: "Dental SEO Is a Strong Fit For",
  
    audience: [
      "General dentists and family dental practices.",
      "Pediatric dentists, orthodontists and periodontists.",
      "Oral surgeons and endodontists.",
      "Multi-location dental groups expanding into new areas.",
      "Practices with visibility but weak calls, form enquiries or bookings.",
    ],
  
    outcomesTitle:
      "What Strong Dental SEO Should Improve",
  
    outcomes: [
      "Clearer visibility for relevant local dental searches.",
      "Better alignment between your website and Google Business Profile.",
      "Stronger discovery of priority treatments and service areas.",
      "More useful mobile journeys for calls and appointment requests.",
      "A scalable foundation for adding new locations or treatments.",
    ],
  
    processTitle: "A Practical Dental SEO Process",
  
    process: [
      {
        step: "01",
        title: "Review",
        description:
          "RankVelt reviews your website, Google Business Profile, local competitors, treatment pages and current visibility.",
      },
      {
        step: "02",
        title: "Prioritise",
        description:
          "The highest-value treatment pages, profile improvements, technical fixes and local opportunities are identified.",
      },
      {
        step: "03",
        title: "Improve",
        description:
          "Priority work strengthens local relevance, page clarity, internal links and appointment-booking paths.",
      },
      {
        step: "04",
        title: "Refine",
        description:
          "Search performance and patient enquiry behaviour guide future improvements.",
      },
    ],
  
    faqs: [
      {
        question: "Is SEO worth it for a dental practice?",
        answer:
          "For most practices, yes. Patients actively search Google before choosing a dentist, so accurate visibility, clear treatment pages and a strong Google Business Profile directly affect how many of those searches turn into calls or bookings.",
      },
      {
        question: "How long does dental SEO take to show results?",
        answer:
          "Timing depends on your current visibility, local competition, website condition and the amount of work required. Meaningful local growth for a dental practice usually develops over several months, not weeks.",
      },
      {
        question:
          "What is Local SEO and how is it different from general SEO for dentists?",
        answer:
          "General SEO focuses on overall website visibility, while Local SEO focuses specifically on Google Maps rankings, Google Business Profile signals, citations and location-based searches, which is where most dental patients begin their search.",
      },
      {
        question: "What does RankVelt's dental SEO service include?",
        answer:
          "Typical work includes Google Business Profile optimisation, citation and NAP consistency, review management support, local landing pages, treatment-page SEO and Google Maps ranking improvements, scoped to your practice.",
      },
      {
        question: "Do you work with dental practices outside the USA?",
        answer:
          "Yes. RankVelt works with dental practices in the USA, UK, Australia and Canada, adjusting local SEO signals to match each country's search behaviour and directories.",
      },
      {
        question: "Can RankVelt help a multi-location dental group?",
        answer:
          "Yes. Multi-location dental groups need consistent, non-duplicate location pages, separate Google Business Profiles for each location, and clear internal linking, which RankVelt plans as part of the strategy.",
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
        title: "Local SEO Checklist",
        description:
          "Use RankVelt's free scorecard to review your practice's Google Business Profile and website.",
        path: "/tools/local-seo-checklist",
      },
      {
        title: "Business SEO",
        description:
          "Strengthen technical foundations, content structure and organic lead generation.",
        path: "/business-seo",
      },
    ],
  };
  
  export default function LocalSEODentists() {
    return <SeoServiceTemplate config={localSeoDentistsConfig} />;
  }