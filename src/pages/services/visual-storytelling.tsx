import ShopifySupportServiceTemplate, {
    type ShopifySupportServiceConfig,
  } from "./ShopifySupportServiceTemplate";
  
  const config: ShopifySupportServiceConfig = {
    path: "/services/visual-storytelling",
  
    metaTitle:
      "Shopify Visual Storytelling and Product Design | RankVelt",
  
    metaDescription:
      "RankVelt creates Shopify visual storytelling, editorial product sections, lookbooks and shoppable content for stronger product presentation.",
  
    eyebrow: "Shopify Visual Storytelling",
  
    availabilityLabel: "Design Projects Available",
  
    h1:
      "Shopify Visual Storytelling That Gives Products More Context",
  
    intro:
      "RankVelt designs editorial product sections, lookbooks, visual narratives and shoppable content that help customers understand product details, use cases and brand value.",
  
    primaryCta: "Discuss My Store Design",
  
    comparisonTitle:
      "Move Beyond Repetitive Product Grids and Generic Theme Sections",
  
    commonChallenges: [
      "Products shown without enough context.",
      "Repeated templates weakening brand identity.",
      "Large media added without a performance plan.",
      "Editorial content disconnected from products.",
      "Design that looks attractive but does not help decisions.",
    ],
  
    rankVeltApproach: [
      "Connect visual design to product education.",
      "Use editable modular sections.",
      "Keep product links easy to understand.",
      "Plan mobile content order and media loading.",
      "Balance design with SEO and accessibility.",
    ],
  
    capabilitiesTitle:
      "Visual Commerce and Editorial Design Capabilities",
  
    capabilitiesIntro:
      "Visual storytelling works best when imagery, product information and purchase actions support the same customer decision.",
  
    capabilities: [
      "Editorial homepage sections.",
      "Shoppable image layouts.",
      "Lookbook landing pages.",
      "Product feature sections.",
      "Material-detail presentations.",
      "Responsive video sections.",
      "Brand story layouts.",
      "Product comparison layouts.",
      "Mobile-first visual ordering.",
    ],
  
    bestForTitle: "This Service Is Best For",
  
    bestFor: [
      "Fashion, beauty and jewellery brands.",
      "Products requiring detail explanation.",
      "Seasonal and campaign landing pages.",
      "Brands needing a stronger Shopify identity.",
      "Businesses connecting design with conversion.",
    ],
  
    seoImpactTitle:
      "How Visual Storytelling Can Support SEO and Sales",
  
    seoImpact: [
      "Adds useful product and category context.",
      "Creates meaningful internal links.",
      "Supports clearer headings and information.",
      "Improves understanding for search visitors.",
      "Connects content with commercial pages.",
    ],
  
    caseStudy: {
      title: "Harborline",
      description:
        "See how mobile quality, organic visibility and search-intent optimisation were reviewed.",
      path: "/case-studies/harborline",
    },
  
    faqs: [
      {
        question:
          "Will visual storytelling slow the store?",
        answer:
          "It can when media is added without optimisation. RankVelt plans responsive images, video loading and content order.",
      },
      {
        question:
          "Can visual sections remain editable?",
        answer:
          "Yes. Shopify theme settings can be added for images, products, text and links.",
      },
      {
        question:
          "Is visual storytelling only for luxury brands?",
        answer:
          "No. It is useful whenever product context, quality or use needs to be explained.",
      },
      {
        question:
          "Can lookbooks link directly to products?",
        answer:
          "Yes. Shoppable images and lookbooks can connect visual content with relevant product pages.",
      },
    ],
  };
  
  export default function VisualStorytellingService() {
    return (
      <ShopifySupportServiceTemplate config={config} />
    );
  }