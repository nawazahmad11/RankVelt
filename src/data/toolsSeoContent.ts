export type ToolType = "calculator" | "policy" | "detector" | "generator";

export type ToolFaq = {
  question: string;
  answer: string;
};

export type ToolRelatedLink = {
  title: string;
  description: string;
  path: string;
};

export type ToolContent = {
  toolType: ToolType;
  slug: string;
  badge: string;
  title: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  intro: string;
  guideTitle: string;
  guideIntro: string[];
  bestFor: string[];
  steps: string[];
  resultsTitle: string;
  results: string[];
  commonMistakes: string[];
  faqs: ToolFaq[];
  relatedLinks: ToolRelatedLink[];
};

export const toolContent: ToolContent[] = [
  {
    toolType: "calculator",
    slug: "profit-margin-calculator",
    badge: "Free eCommerce Calculator",
    title: "Profit Margin Calculator",
    pageTitle: "Free Profit Margin Calculator for eCommerce",
    metaTitle: "Free Profit Margin Calculator for eCommerce | RankVelt",
    metaDescription:
      "Use RankVelt's free eCommerce profit margin calculator to estimate product profit, selling margin, fees, advertising costs, shipping costs, and pricing direction.",
    shortDescription:
      "Estimate product profit, margin direction, and cost impact before changing prices or campaigns.",
    intro:
      "Use your product price, product cost, shipping, payment fees, advertising spend, and other direct costs to estimate whether a product has enough room to support your business goals.",
    guideTitle:
      "How an eCommerce Profit Margin Calculator Supports Better Decisions",
    guideIntro: [
      "A product can generate sales and still leave very little room for profit. This calculator helps you review the relationship between your selling price, direct costs, marketing spend, fulfilment costs, and the money left after those inputs.",
      "Use it before launching a product, offering a discount, building a bundle, testing paid ads, changing shipping prices, or deciding whether a product category is worth expanding.",
    ],
    bestFor: [
      "Shopify store owners reviewing product pricing.",
      "eCommerce brands planning discounts, bundles, or free-shipping offers.",
      "Businesses testing whether paid advertising costs fit their margins.",
      "Product sellers comparing supplier, fulfilment, and payment-fee costs.",
      "Founders who need a quick planning estimate before making a decision.",
    ],
    steps: [
      "Enter the selling price for one product or offer.",
      "Add product cost, shipping, transaction fees, advertising cost, and other relevant direct costs.",
      "Review the estimated profit and margin direction.",
      "Adjust pricing or costs to compare different business scenarios.",
    ],
    resultsTitle: "How to Read Your Margin Result",
    results: [
      "Profit is the estimated money remaining after the costs you entered are deducted from the selling price.",
      "Margin percentage helps you compare products with different selling prices and costs.",
      "A positive result does not automatically mean a product is sustainable. You may still need to include refunds, software subscriptions, taxes, wages, returns, packaging, and other operating costs.",
      "Use the result as a planning estimate, then validate it with your actual financial records and business data.",
    ],
    commonMistakes: [
      "Ignoring payment processor fees, shipping subsidies, returns, packaging, or fulfilment costs.",
      "Using average advertising spend without checking product-level campaign performance.",
      "Assuming revenue equals profit.",
      "Changing a price without checking how discounts affect the remaining margin.",
      "Treating the calculator as tax, legal, financial, or accounting advice.",
    ],
    faqs: [
      {
        question: "Can I use this calculator for Shopify products?",
        answer:
          "Yes. It works for Shopify, WooCommerce, marketplaces, local product businesses, and other eCommerce models where you need a simple product-level profit estimate.",
      },
      {
        question: "Does this calculate every business expense automatically?",
        answer:
          "No. The result only includes the values you enter. Add relevant costs such as product cost, fulfilment, shipping, transaction fees, ads, packaging, refunds, and other direct expenses.",
      },
      {
        question: "Is gross margin the same as net profit?",
        answer:
          "Not always. Gross margin usually focuses on revenue minus direct product costs. Net profit can include additional operating expenses. Use this tool as a planning estimate and confirm final numbers with your own financial records.",
      },
      {
        question: "Can I use it before running paid ads?",
        answer:
          "Yes. Add an estimated ad cost per sale to understand how paid acquisition could affect the money left from each order.",
      },
    ],
    relatedLinks: [
      {
        title: "eCommerce SEO",
        description:
          "Improve product discovery, collection-page structure, Shopify SEO, and organic traffic quality.",
        path: "/ecommerce-seo",
      },
      {
        title: "High-Converting Product Pages",
        description:
          "Learn how product-page clarity, trust, content, and customer journeys affect eCommerce decisions.",
        path: "/blog/high-converting-product-pages",
      },
    ],
  },

  {
    toolType: "policy",
    slug: "legal-policy-generator",
    badge: "Free Website Policy Tool",
    title: "Legal Policy Generator",
    pageTitle: "Free Legal Policy Generator for Websites",
    metaTitle: "Free Legal Policy Generator for Websites | RankVelt",
    metaDescription:
      "Generate starter privacy policy, refund policy, and terms content for websites, Shopify stores, local businesses, and eCommerce brands with RankVelt's free policy generator.",
    shortDescription:
      "Create starter privacy, refund, and terms-policy content for your website or store.",
    intro:
      "Generate a structured starter draft for privacy policies, refund policies, and website terms. Review every section carefully so it matches your actual products, services, customer support process, payment methods, shipping rules, and data practices.",
    guideTitle:
      "Why Clear Website Policies Matter for Trust and Customer Clarity",
    guideIntro: [
      "Privacy, refund, and terms pages are not just footer links. They help visitors understand how your business handles personal information, purchases, returns, delivery, support, and acceptable website use.",
      "A generic policy can create confusion when it does not match what your business actually does. Use this generator to create a starting draft, then edit it around your real processes and seek qualified legal advice where appropriate.",
    ],
    bestFor: [
      "New Shopify stores preparing for launch.",
      "WordPress websites adding forms, email capture, or online payments.",
      "Local service businesses collecting enquiries or booking requests.",
      "eCommerce brands that need starter privacy, terms, or refund wording.",
      "Businesses reviewing old footer policies after changing tools or services.",
    ],
    steps: [
      "Choose the privacy, refund, or terms policy you need.",
      "Enter accurate business details and relevant policy information.",
      "Generate the draft and check every section against your real practices.",
      "Publish only after appropriate review and business-specific editing.",
    ],
    resultsTitle: "What You Should Review Before Publishing",
    results: [
      "Make sure your business name, contact method, customer support details, and location information are accurate.",
      "Check that your refund, delivery, cancellation, and payment wording matches your actual customer process.",
      "Update privacy wording when you add analytics, forms, email marketing, payment processors, third-party apps, or customer data collection.",
      "Do not claim rights, guarantees, delivery terms, or refund conditions your business cannot actually provide.",
    ],
    commonMistakes: [
      "Publishing generated content without reviewing it for your country or business model.",
      "Using a refund policy that conflicts with product, delivery, or customer-support practices.",
      "Forgetting to update privacy wording after adding tracking tools, forms, email software, or payment providers.",
      "Copying a competitor's policy without understanding whether it applies to your business.",
      "Treating a generated draft as legal advice or a complete compliance guarantee.",
    ],
    faqs: [
      {
        question: "Are generated policies legally guaranteed?",
        answer:
          "No. The generator creates starter content only. It is not legal advice and does not guarantee compliance. Consider a qualified legal review before publishing policies for a live business.",
      },
      {
        question: "Can I use this policy generator for Shopify or WordPress?",
        answer:
          "Yes. The draft can be adapted for Shopify stores, WordPress websites, WooCommerce stores, local businesses, portfolios, agencies, and service websites.",
      },
      {
        question: "When should I update a website policy?",
        answer:
          "Update your policy when you add payment methods, analytics, cookies, email marketing, third-party apps, international shipping, recurring services, new forms, or different data-collection practices.",
      },
      {
        question: "Which pages should a typical business website have?",
        answer:
          "Many businesses need at least a privacy policy, terms and conditions, and a refund or cancellation policy when they sell products, services, subscriptions, bookings, or online consultations.",
      },
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build a stronger business website with clearer service pages, technical SEO, and qualified lead pathways.",
        path: "/business-seo",
      },
      {
        title: "Cart & Checkout Optimisation",
        description:
          "Improve product-to-cart journeys, delivery clarity, trust content, and customer decision pathways.",
        path: "/services/checkout-flow",
      },
    ],
  },

  {
    toolType: "detector",
    slug: "shopify-theme-detector",
    badge: "Free Shopify Research Tool",
    title: "Shopify Theme Detector",
    pageTitle: "Free Shopify Theme Detector Tool",
    metaTitle: "Shopify Theme Detector Tool | RankVelt",
    metaDescription:
      "Use RankVelt's free Shopify Theme Detector to check public storefront signals and identify the likely Shopify theme setup behind a public eCommerce store.",
    shortDescription:
      "Check public storefront signals to research a store's likely Shopify theme setup.",
    intro:
      "Paste a public Shopify store URL to check accessible storefront signals that may indicate the store's likely theme setup. Results are most useful for research, inspiration, and early redesign planning.",
    guideTitle:
      "Use Theme Research to Understand Store Patterns, Not Copy Competitors",
    guideIntro: [
      "A Shopify theme can influence basic store structure, but it is only one part of an eCommerce experience. Product-page content, collection hierarchy, apps, custom code, images, navigation, speed, trust signals, and customer journey decisions all matter too.",
      "Use this tool to research public storefront patterns and understand potential theme direction. Do not assume a detected theme means the store uses default settings or that installing the same theme will create the same business outcome.",
    ],
    bestFor: [
      "Shopify store owners researching redesign options.",
      "eCommerce founders collecting storefront inspiration.",
      "Agencies reviewing public theme patterns before planning a build.",
      "Businesses comparing default-theme capability with custom development needs.",
      "Store owners who want to understand whether a competitor appears heavily customised.",
    ],
    steps: [
      "Copy the public URL of a Shopify storefront.",
      "Paste the address into the detector and run the check.",
      "Review available public signals and treat them as research clues.",
      "Use the findings alongside a wider review of UX, SEO, product pages, and store structure.",
    ],
    resultsTitle: "How to Interpret Theme Detector Results",
    results: [
      "A detected theme name is a likely indicator based on publicly exposed storefront information, not a complete technical audit.",
      "A store may use a renamed theme, extensive custom code, a headless setup, private theme details, or apps that make detection less clear.",
      "The result does not identify every app, custom integration, internal workflow, conversion feature, or performance issue.",
      "Use the output to guide research, then review the actual customer experience before making design or development decisions.",
    ],
    commonMistakes: [
      "Assuming the detector can identify every Shopify app or custom feature.",
      "Copying a competitor's theme without understanding their product range, audience, and business model.",
      "Believing the same theme will automatically produce similar traffic or sales.",
      "Ignoring collection structure, product content, mobile UX, and technical SEO during a redesign.",
      "Trying to inspect password-protected or private storefronts.",
    ],
    faqs: [
      {
        question: "Can the tool detect every Shopify theme exactly?",
        answer:
          "No. Theme detection relies on publicly available storefront signals. A heavily customised, renamed, headless, private, or uncommon setup may not return a clear or accurate result.",
      },
      {
        question: "Can it detect Shopify apps too?",
        answer:
          "It may identify limited public storefront signals, but it is not a full app audit. Many app, tracking, backend, and custom-code details are not publicly visible.",
      },
      {
        question: "Can I use the result to copy another store?",
        answer:
          "Use the result for inspiration and research, not copying. Your own store should be shaped around your products, customers, content, brand, and business goals.",
      },
      {
        question: "What should I review after finding a theme?",
        answer:
          "Review mobile UX, navigation, collection structure, product-page layout, page speed, internal links, trust content, and whether the theme can support your SEO and conversion requirements.",
      },
    ],
    relatedLinks: [
      {
        title: "eCommerce SEO",
        description:
          "Improve Shopify category pages, product discovery, internal linking, and technical SEO foundations.",
        path: "/ecommerce-seo",
      },
      {
        title: "Shopify Redesign Guide",
        description:
          "Learn the signs that a store redesign may be needed for SEO, usability, product discovery, and conversions.",
        path: "/blog/shopify-redesign-signs-2026",
      },
    ],
  },

  {
    toolType: "generator",
    slug: "business-name-generator",
    badge: "Free Brand Planning Tool",
    title: "Business Name Generator",
    pageTitle: "Free Business Name Generator",
    metaTitle: "Free Business Name Generator for Brands | RankVelt",
    metaDescription:
      "Generate business-name ideas for eCommerce stores, local services, agencies, product brands, and growing businesses with RankVelt's free business name generator.",
    shortDescription:
      "Generate starting name ideas for eCommerce brands, local services, and new businesses.",
    intro:
      "Enter a keyword, niche, product type, audience, service, or business direction to generate naming ideas. Use the output for brainstorming, then check domains, social handles, local registrations, and trademarks before choosing a final name.",
    guideTitle:
      "How to Choose a Business Name That Can Grow With Your Brand",
    guideIntro: [
      "A useful business name should be easy to remember, practical to spell, suitable for your customers, and flexible enough to work across your website, social profiles, email address, packaging, and future marketing.",
      "A name does not need to contain every service keyword. In many cases, forcing too many keywords into a name makes it generic or difficult to remember. Clarity and distinctiveness usually matter more than stuffing location or service terms into the brand name.",
    ],
    bestFor: [
      "New Shopify stores and eCommerce product brands.",
      "Local service businesses looking for a memorable brand direction.",
      "Freelancers, agencies, consultants, and digital projects.",
      "Founders validating an early business or product idea.",
      "Businesses planning a rebrand or new product line.",
    ],
    steps: [
      "Enter a product, service, niche, audience, or style-related keyword.",
      "Generate several naming directions instead of choosing the first idea.",
      "Shortlist names that are clear, memorable, and relevant to your audience.",
      "Check domains, social handles, trademarks, and business-registration availability.",
    ],
    resultsTitle: "How to Evaluate a Generated Business Name",
    results: [
      "Choose names that are easy to say, spell, search, and share verbally.",
      "Check whether the name still makes sense if your business adds new products, services, or locations later.",
      "Avoid names that are too close to competitors, famous brands, or registered trademarks.",
      "Make sure the matching domain and social handles are realistic before investing in logos, packaging, or website work.",
    ],
    commonMistakes: [
      "Choosing a name before checking trademark, domain, social-handle, and local registration availability.",
      "Using difficult spelling, unnecessary numbers, punctuation, or confusing word combinations.",
      "Making the name too narrow for future product or service expansion.",
      "Adding too many keywords until the name becomes generic and forgettable.",
      "Assuming a generated idea is legally available to use.",
    ],
    faqs: [
      {
        question: "Are generated business names guaranteed to be available?",
        answer:
          "No. Always check domains, social handles, trademarks, business registrations, and relevant local requirements before using a name commercially.",
      },
      {
        question: "Can I use this for a local service business?",
        answer:
          "Yes. Enter your service, niche, audience, city idea, or preferred style to generate more relevant naming directions for a local business.",
      },
      {
        question: "Should my business name include SEO keywords?",
        answer:
          "Not necessarily. A name should first be clear and memorable. Your website pages, headings, titles, service pages, Google Business Profile, and content can target relevant keywords without making the brand name awkward.",
      },
      {
        question: "What should I do after I shortlist a name?",
        answer:
          "Check domain availability, social handles, trademarks, business registration, pronunciation, competitor similarity, and whether the name can support your future brand direction.",
      },
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build service pages, technical foundations, content structure, and qualified organic lead pathways.",
        path: "/business-seo",
      },
      {
        title: "Local SEO",
        description:
          "Improve local visibility, service-area relevance, Google Business Profile signals, and qualified enquiries.",
        path: "/local-seo",
      },
    ],
  },
];

export const toolAliases: Record<string, ToolType> = {
  "profit-margin-calculator": "calculator",
  calculator: "calculator",

  "legal-policy-generator": "policy",
  "policy-generator": "policy",
  policy: "policy",

  "shopify-theme-detector": "detector",
  "theme-detector": "detector",
  detector: "detector",

  "business-name-generator": "generator",
  "name-generator": "generator",
  generator: "generator",
};