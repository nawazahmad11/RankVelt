import SeoServiceTemplate, {
    type SeoServicePageConfig,
  } from "./SeoServiceTemplate";
  
  const localSeoLawyersConfig: SeoServicePageConfig = {
    slug: "/local-seo/lawyers",
  
    metaTitle:
      "Law Firm SEO Services | Local SEO for Lawyers | RankVelt",
  
    metaDescription:
      "RankVelt provides law firm SEO services that improve Google Maps visibility, local rankings, citations, reviews and qualified enquiries for legal practices.",
  
    eyebrow: "Law Firm SEO Services",
  
    h1:
      "Law Firm SEO Services That Turn Searches Into Qualified Enquiries",
  
    intro:
      "RankVelt helps law firms improve Google visibility through Google Business Profile optimisation, accurate citations, review management, practice-area pages and clearer local ranking signals for the areas of law and locations you serve.",
  
    focusAreas: [
      "Google Business Profile",
      "Citations & NAP Consistency",
      "Review Management",
      "Practice-Area Pages",
    ],
  
    overviewTitle:
      "Build Local Visibility Around the Practice Areas and Locations You Actually Serve",
  
    overviewParagraphs: [
      "Most legal searches start with a specific situation, such as \"personal injury lawyer near me\" or \"family law attorney in [city]\". Law firm SEO focuses on making sure your firm appears, and looks credible, at that exact moment.",
  
      "RankVelt reviews the complete local search journey for a law firm. This includes Google Business Profile accuracy, practice-area page clarity, citation consistency, review activity, mobile usability and how easily a visitor can request a consultation.",
  
      "The goal is not to chase every possible keyword or publish thin, duplicate city pages. The goal is to build genuine visibility for the practice areas you handle and the locations you serve, so the right clients can find and contact your firm.",
    ],
  
    deliverablesTitle:
      "What a Law Firm SEO Strategy Can Include",
  
    deliverables: [
      "Google Business Profile review and optimisation priorities.",
      "Local citation and legal directory consistency review.",
      "Review management support and reputation monitoring.",
      "Dedicated practice-area pages instead of one generic services page.",
      "On-page SEO built around clear author credentials and accurate legal information.",
      "Technical SEO and mobile usability improvements.",
      "Conversion improvements for calls, form enquiries and consultation requests.",
    ],
  
    audienceTitle: "Law Firm SEO Is a Strong Fit For",
  
    audience: [
      "Solo practitioners and small-to-medium law firms.",
      "Firms handling personal injury, family law, estate planning or criminal defence.",
      "Multi-attorney practices covering several practice areas.",
      "Firms expanding into new office locations or regions.",
      "Firms with visibility but weak enquiry volume or consultation bookings.",
    ],
  
    outcomesTitle:
      "What Strong Law Firm SEO Should Improve",
  
    outcomes: [
      "Clearer visibility for relevant local legal searches.",
      "Better alignment between your website and Google Business Profile.",
      "Stronger discovery of priority practice areas and service locations.",
      "More useful mobile journeys for enquiries and consultation requests.",
      "A scalable foundation for adding new practice areas or locations.",
    ],
  
    processTitle: "A Practical Law Firm SEO Process",
  
    process: [
      {
        step: "01",
        title: "Review",
        description:
          "RankVelt reviews your website, Google Business Profile, local competitors, practice-area pages and current visibility.",
      },
      {
        step: "02",
        title: "Prioritise",
        description:
          "The highest-value practice-area pages, profile improvements, technical fixes and local opportunities are identified.",
      },
      {
        step: "03",
        title: "Improve",
        description:
          "Priority work strengthens local relevance, page clarity, credential signals and enquiry-generation paths.",
      },
      {
        step: "04",
        title: "Refine",
        description:
          "Search performance and enquiry quality guide future improvements.",
      },
    ],
  
    faqs: [
      {
        question: "Is SEO worth it for a law firm?",
        answer:
          "For most firms, yes. Potential clients actively search Google before contacting a lawyer, so accurate visibility, clear practice-area pages and a strong Google Business Profile directly affect how many of those searches turn into enquiries.",
      },
      {
        question: "How long does law firm SEO take to show results?",
        answer:
          "Timing depends on your current visibility, practice-area competitiveness, website condition and the amount of work required. Meaningful local growth for a law firm usually develops over several months, not weeks.",
      },
      {
        question:
          "What is Local SEO and how is it different from general SEO for law firms?",
        answer:
          "General SEO focuses on overall website visibility, while Local SEO focuses specifically on Google Maps rankings, Google Business Profile signals, citations and location-based searches, which is where many potential clients begin their search.",
      },
      {
        question: "What does RankVelt's law firm SEO service include?",
        answer:
          "Typical work includes Google Business Profile optimisation, citation and NAP consistency, review management support, dedicated practice-area pages and technical SEO improvements, scoped to your firm.",
      },
      {
        question: "Do you work with law firms outside the USA?",
        answer:
          "Yes. RankVelt works with law firms in the USA, UK, Australia and Canada, adjusting local SEO signals to match each country's search behaviour, directories and advertising rules.",
      },
      {
        question: "Can RankVelt help a firm with multiple practice areas?",
        answer:
          "Yes. Firms with multiple practice areas need dedicated, non-duplicate pages for each area, clear internal linking, and consistent credibility signals, which RankVelt plans as part of the strategy.",
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
        title: "Law Firm SEO Guide",
        description:
          "Read RankVelt's full guide on law firm SEO, E-E-A-T and common mistakes.",
        path: "/blog/law-firm-seo-guide",
      },
      {
        title: "Local SEO Checklist",
        description:
          "Use RankVelt's free scorecard to review your firm's Google Business Profile and website.",
        path: "/tools/local-seo-checklist",
      },
    ],
  };
  
  export default function LocalSEOLawyers() {
    return <SeoServiceTemplate config={localSeoLawyersConfig} />;
  }