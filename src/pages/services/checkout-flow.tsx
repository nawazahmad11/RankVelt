import ShopifySupportServiceTemplate, {
    type ShopifySupportServiceConfig,
  } from "./ShopifySupportServiceTemplate";
  
  const config: ShopifySupportServiceConfig = {
    path: "/services/checkout-flow",
  
    metaTitle:
      "Shopify Cart and Checkout Optimisation | RankVelt",
  
    metaDescription:
      "RankVelt improves Shopify cart and checkout flow through clearer shipping information, trust signals, cart UX and reduced purchase friction.",
  
    eyebrow:
      "Shopify Cart and Checkout Optimisation",
  
    availabilityLabel:
      "Conversion Reviews Available",
  
    h1:
      "Shopify Cart and Checkout Optimisation That Reduces Purchase Friction",
  
    intro:
      "RankVelt improves the journey from product page to cart and checkout by clarifying costs, delivery expectations, product choices, trust information and next actions.",
  
    primaryCta: "Review My Checkout Flow",
  
    comparisonTitle:
      "Small Friction Points Can Interrupt a Strong Buying Journey",
  
    commonChallenges: [
      "Shipping costs shown too late.",
      "Cart drawers hiding important details.",
      "Upsells distracting from the purchase.",
      "Mobile cart controls that are difficult to use.",
      "Unclear discounts or checkout errors.",
    ],
  
    rankVeltApproach: [
      "Review the complete purchase journey.",
      "Clarify shipping and returns information.",
      "Improve cart hierarchy and controls.",
      "Use relevant cross-sells carefully.",
      "Respect Shopify plan limitations.",
    ],
  
    capabilitiesTitle:
      "Cart and Checkout Improvement Capabilities",
  
    capabilitiesIntro:
      "The work focuses on improvements available within the store's Shopify plan, theme and checkout permissions.",
  
    capabilities: [
      "Cart drawer improvements.",
      "Shipping-threshold messaging.",
      "Quantity and line-item controls.",
      "Relevant cross-sell blocks.",
      "Trust and returns information.",
      "Discount message clarity.",
      "Mobile cart usability.",
      "Checkout error review.",
      "Funnel tracking review.",
    ],
  
    bestForTitle: "This Service Is Best For",
  
    bestFor: [
      "Stores with add-to-cart activity but weak sales.",
      "Brands with confusing shipping information.",
      "Businesses adding bundles or cross-sells.",
      "Stores preparing a conversion audit.",
      "Teams needing high-priority checkout fixes.",
    ],
  
    seoImpactTitle:
      "How Checkout Improvements Support Growth",
  
    seoImpact: [
      "Makes better use of qualified traffic.",
      "Reduces uncertainty before checkout.",
      "Improves mobile purchase usability.",
      "Creates clearer funnel measurement.",
      "Connects product promises with delivery details.",
    ],
  
    caseStudy: {
      title: "Product Discovery at Scale",
      description:
        "Explore an eCommerce project focused on product discovery, category visibility and search performance.",
      path: "/case-studies/product-discovery-at-scale",
    },
  
    faqs: [
      {
        question:
          "Can Shopify checkout be fully customised without Shopify Plus?",
        answer:
          "Customisation options depend on the Shopify plan. Many improvements can still be made on product pages and cart drawers before checkout.",
      },
      {
        question:
          "Can cart changes improve conversion?",
        answer:
          "Cart improvements can reduce friction, but results also depend on traffic quality, pricing, trust and delivery.",
      },
      {
        question:
          "Should every store add upsells?",
        answer:
          "No. Upsells should be relevant, easy to understand and simple to decline.",
      },
      {
        question:
          "Can RankVelt review purchase tracking?",
        answer:
          "Yes. RankVelt can review key funnel events and identify whether important actions are tracked consistently.",
      },
    ],
  };
  
  export default function CheckoutFlowService() {
    return (
      <ShopifySupportServiceTemplate config={config} />
    );
  }