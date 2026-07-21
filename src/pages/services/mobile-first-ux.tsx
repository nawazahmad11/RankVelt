import ShopifySupportServiceTemplate, {
    type ShopifySupportServiceConfig,
  } from "./ShopifySupportServiceTemplate";
  
  const config: ShopifySupportServiceConfig = {
    path: "/services/mobile-first-ux",
  
    metaTitle:
      "Shopify Mobile UX Design and Optimisation | RankVelt",
  
    metaDescription:
      "RankVelt improves Shopify mobile UX, navigation, product discovery, cart usability and responsive performance for clearer buying journeys.",
  
    eyebrow: "Shopify Mobile-First UX",
  
    availabilityLabel: "Mobile UX Reviews Available",
  
    h1:
      "Shopify Mobile UX Designed Around Real Shopping Behaviour",
  
    intro:
      "RankVelt improves mobile navigation, product discovery, product-page usability, cart interactions and responsive layouts so shoppers can understand products and act with less friction.",
  
    primaryCta: "Review My Mobile Store",
  
    comparisonTitle:
      "Responsive Design Is Not Always Mobile-First UX",
  
    commonChallenges: [
      "Desktop layouts compressed into small screens.",
      "Menus and filters that are difficult to use.",
      "Large media causing slow loading and layout shifts.",
      "Purchase controls hidden too far down the page.",
      "Crowded product cards and unclear navigation.",
    ],
  
    rankVeltApproach: [
      "Prioritise mobile discovery and purchase actions.",
      "Improve touch targets and spacing.",
      "Simplify navigation and filter interfaces.",
      "Optimise media loading and responsive behaviour.",
      "Test key journeys across common devices.",
    ],
  
    capabilitiesTitle:
      "Mobile UX Improvements for Shopify Stores",
  
    capabilitiesIntro:
      "The work focuses on pages and interactions that influence product discovery, confidence and purchase intent.",
  
    capabilities: [
      "Mobile navigation improvements.",
      "Collection filter optimisation.",
      "Product gallery improvements.",
      "Variant selector usability.",
      "Sticky purchase controls.",
      "Mobile cart drawer improvements.",
      "Responsive typography and spacing.",
      "Layout-shift review.",
      "Accessibility and touch targets.",
    ],
  
    bestForTitle: "This Service Is Best For",
  
    bestFor: [
      "Stores with high mobile traffic.",
      "Themes that feel crowded on phones.",
      "Stores with complex filters or variants.",
      "Brands preparing for a redesign.",
      "Teams combining UX and SEO improvements.",
    ],
  
    seoImpactTitle:
      "How Mobile UX Supports Search and Conversion",
  
    seoImpact: [
      "Clearer product and collection information.",
      "Better usability for mobile search visitors.",
      "Reduced navigation and purchase friction.",
      "Improved media and layout behaviour.",
      "Stronger experience without removing useful content.",
    ],
  
    caseStudy: {
      title: "ClearRide Auto Glass",
      description:
        "Review a project focused on mobile usability, local search visibility and technical performance.",
      path: "/case-studies/clear-ride-auto-glass",
    },
  
    faqs: [
      {
        question:
          "Is a responsive Shopify theme enough?",
        answer:
          "A responsive theme is a starting point. Mobile-first work also considers touch interactions, content order, navigation and performance.",
      },
      {
        question:
          "Will mobile improvements affect desktop design?",
        answer:
          "Each viewport is tested separately so mobile improvements do not weaken the desktop experience.",
      },
      {
        question:
          "Can RankVelt improve an existing theme?",
        answer:
          "Yes. Many mobile problems can be improved without rebuilding the full store.",
      },
      {
        question: "Does mobile UX help SEO?",
        answer:
          "Mobile UX can support usability and page experience, while rankings also depend on content, relevance, technical SEO and authority.",
      },
    ],
  };
  
  export default function MobileFirstUxService() {
    return (
      <ShopifySupportServiceTemplate config={config} />
    );
  }