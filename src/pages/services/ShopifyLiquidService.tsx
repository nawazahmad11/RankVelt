import ShopifySupportServiceTemplate, {
    type ShopifySupportServiceConfig,
  } from "./ShopifySupportServiceTemplate";
  
  const config: ShopifySupportServiceConfig = {
    path: "/services/custom-liquid-development",
  
    metaTitle:
      "Custom Shopify Liquid Development Services | RankVelt",
  
    metaDescription:
      "RankVelt builds custom Shopify Liquid sections, theme functionality and performance-conscious features without unnecessary app dependence.",
  
    eyebrow: "Custom Shopify Liquid Development",
  
    availabilityLabel: "Shopify Projects Available",
  
    h1:
      "Custom Shopify Liquid Development for Faster, More Flexible Stores",
  
    intro:
      "RankVelt creates maintainable Shopify Liquid sections, theme features and storefront interactions that improve flexibility, product presentation and customer journeys without unnecessary app bloat.",
  
    primaryCta: "Discuss My Shopify Project",
  
    comparisonTitle:
      "When Standard Themes and Apps Start Limiting Your Store",
  
    commonChallenges: [
      "Rigid sections that cannot support required product information.",
      "Multiple apps adding scripts and recurring costs.",
      "Theme changes that are difficult to manage.",
      "Inconsistent mobile layouts and slow interactions.",
      "Custom code added without clear structure.",
    ],
  
    rankVeltApproach: [
      "Build isolated and reusable Liquid sections.",
      "Use native Shopify functionality where practical.",
      "Keep code structured and maintainable.",
      "Design features around product discovery.",
      "Test responsive behaviour and accessibility.",
    ],
  
    capabilitiesTitle:
      "Custom Shopify Development Capabilities",
  
    capabilitiesIntro:
      "Each project is scoped around the existing theme, technical requirements and customer journey.",
  
    capabilities: [
      "Custom homepage and collection sections.",
      "Custom product-page sections.",
      "Sticky add-to-cart controls.",
      "Cart drawers and promotional messages.",
      "Shoppable image and lookbook sections.",
      "Editable Shopify theme settings.",
      "Lightweight app replacement.",
      "Theme script and tracking cleanup.",
      "Theme migration support.",
    ],
  
    bestForTitle: "This Service Is Best For",
  
    bestFor: [
      "Stores that have outgrown standard sections.",
      "Brands paying for several simple apps.",
      "Stores preparing for a redesign.",
      "Teams that need editable custom sections.",
      "Businesses aligning development with SEO.",
    ],
  
    seoImpactTitle:
      "How Custom Liquid Can Support SEO and UX",
  
    seoImpact: [
      "Cleaner markup and page hierarchy.",
      "More useful product content layouts.",
      "Reduced dependence on unnecessary scripts.",
      "Improved mobile interaction clarity.",
      "Better control over headings and links.",
    ],
  
    caseStudy: {
      title: "Product Discovery at Scale",
      description:
        "See how stronger category visibility and product discovery supported an eCommerce growth project.",
      path: "/case-studies/product-discovery-at-scale",
    },
  
    faqs: [
      {
        question:
          "Why use custom Liquid instead of another Shopify app?",
        answer:
          "Custom Liquid can be suitable when the required feature is focused and better handled natively. Complex systems may still require a specialist app.",
      },
      {
        question:
          "Will custom sections remain editable?",
        answer:
          "Yes. RankVelt can include Shopify schema settings for text, images, products, colours and layout options.",
      },
      {
        question:
          "Can custom code affect theme updates?",
        answer:
          "Any customisation needs planning. Isolated sections and documented changes reduce update risk.",
      },
      {
        question:
          "Can RankVelt improve existing Liquid code?",
        answer:
          "Yes. Existing sections can be reviewed for duplication, maintainability and storefront issues.",
      },
    ],
  };
  
  export default function ShopifyLiquidService() {
    return (
      <ShopifySupportServiceTemplate config={config} />
    );
  }