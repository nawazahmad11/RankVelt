export interface ProjectSnapshot {
  label?: string;
  value: string;
  change: string;
  isUp: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;

  problem: string[];
  solution: string[];
  result: string[];

  image: string;
  metrics: {
    label: string;
    value: string;
  }[];

  analytics: {
    totalSales: ProjectSnapshot;
    sessions: ProjectSnapshot;
    totalOrders: ProjectSnapshot;
    conversionRate: ProjectSnapshot;
  };

  store: {
    layoutType:
      | "District99"
      | "clothing"
      | "jewelry"
      | "Saha"
      | "restaurant"
      | "luxury";
    themeColor: string;
    secondaryColor: string;
    fontStyle: "urban" | "modern" | "classic" | "serif";
    hero: {
      backgroundImage: string;
      headline: string;
      cta: string;
    };
    varients: {
      image: string;
    }[];
    products: {
      name: string;
      price: string;
      image: string;
      desc?: string;
    }[];
    marqueeText?: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    id: "District99",
    title: "District 99",
    subtitle: "Streetwear Storefront Showcase",
    category: "Streetwear",

    problem: [
      "The project brief required a streetwear storefront that felt more premium, clearer to browse, and easier to use on mobile devices.",
      "> Heavy image use could make the visual hierarchy feel crowded.",
      "> Product discovery needed a cleaner route from collection to item.",
      "> The store design needed stronger brand consistency.",
      "> Mobile browsing needed to remain simple and easy to scan.",
    ],

    solution: [
      "The storefront direction focused on a bold, editorial streetwear system with cleaner product visibility and simple purchase pathways.",
      "> Dark visual direction with a clear contrast system.",
      "> Stronger collection and product hierarchy.",
      "> Mobile-aware layout and navigation.",
      "> Clear add-to-cart and product discovery placement.",
      "> Image presentation designed around the product story.",
    ],

    result: [
      "The final project showcase demonstrates a more structured streetwear browsing experience built around clarity, mobile usability, and product discovery.",
      "> Cleaner visual hierarchy.",
      "> More direct route from discovery to product.",
      "> Easier product scanning across devices.",
      "> Stronger brand-led presentation.",
      "> SEO-ready collection and internal-linking potential.",
    ],

    image: "/district-99-online-store.webp",

    metrics: [
      { label: "Speed", value: "85/100" },
      { label: "Revenue", value: "+42%" },
    ],

    analytics: {
      totalSales: {
        value: "$28,900",
        change: "18%",
        isUp: true,
      },
      sessions: {
        value: "22,400",
        change: "12%",
        isUp: true,
      },
      totalOrders: {
        value: "620",
        change: "8%",
        isUp: true,
      },
      conversionRate: {
        value: "2.7%",
        change: "1.8%",
        isUp: true,
      },
    },

    store: {
      layoutType: "District99",
      themeColor: "#050505",
      secondaryColor: "#E11D48",
      fontStyle: "urban",
      hero: {
        backgroundImage: "/district-99-online-store.webp",
        headline: "ELEVATE<br/>YOUR DROP",
        cta: "Explore Collection",
      },
      varients: [{ image: "" }, { image: "" }, { image: "" }],
      products: [
        {
          name: "Rough Cargo",
          price: "$80",
          image: "/district-99-pent-online-stor.webp",
        },
        {
          name: "Vanguard Tee",
          price: "$40",
          image: "/district-99-Tee-online-stor.webp",
        },
        {
          name: "Varsity Wild",
          price: "$160",
          image: "/district-99-jak-online-stor.webp",
        },
        {
          name: "Puffer",
          price: "$280",
          image: "/district-99-puff-online-stor.webp",
        },
        {
          name: "Apex Hoodie",
          price: "$90",
          image: "/district-99-hod-online-stor.webp",
        },
        {
          name: "Union Bag",
          price: "$120",
          image: "/district-99-bag-online-stor.webp",
        },
      ],
      marqueeText: "NEW DROP SHOWCASE — STREETWEAR EDITORIAL — DISTRICT99 —",
    },
  },

  {
    id: "clothing-store",
    title: "Urban Threads",
    subtitle: "Fashion Product Page Showcase",
    category: "Fashion",

    problem: [
      "The project concept required a fashion product page that felt less cluttered and gave customers a clearer route through product details, variants, and related items.",
      "> Product details needed stronger visual order.",
      "> Size and fit information had to be easier to find.",
      "> Product education required clearer page sections.",
      "> Mobile browsing needed a more focused layout.",
      "> Related products needed a useful discovery role.",
    ],

    solution: [
      "The design direction simplified the product page and organised the key decision-making information around the customer journey.",
      "> Clear product title, price, and variant placement.",
      "> Easy-to-find size guide and product details.",
      "> Stronger product imagery and visual order.",
      "> Related products placed to support browsing.",
      "> Mobile-first page spacing and interactions.",
    ],

    result: [
      "The finished showcase demonstrates a cleaner product-page structure designed to support customer understanding, product discovery, and a more focused purchase path.",
      "> Simpler product information hierarchy.",
      "> Clearer size and detail access.",
      "> More structured mobile experience.",
      "> Better support for related-product browsing.",
      "> SEO-ready product-page content potential.",
    ],

    image: "/urban-threads-show-shopify-store.webp",

    metrics: [
      { label: "Speed", value: "89/100" },
      { label: "Sales", value: "+38%" },
    ],

    analytics: {
      totalSales: {
        value: "$16,840",
        change: "21%",
        isUp: true,
      },
      sessions: {
        value: "18,450",
        change: "14%",
        isUp: true,
      },
      totalOrders: {
        value: "412",
        change: "9%",
        isUp: false,
      },
      conversionRate: {
        value: "2.4%",
        change: "2.1%",
        isUp: true,
      },
    },

    store: {
      layoutType: "clothing",
      themeColor: "#ffffff",
      secondaryColor: "#000000",
      fontStyle: "modern",
      hero: {
        backgroundImage: "/urban-threads-shopify-store.webp",
        headline: "ESSENTIALS<br/>FOR SUMMER",
        cta: "Explore Collection",
      },
      varients: [
        {
          image: "/urban-threads-black-shopify-store.webp",
        },
        {
          image: "/urban-threads-skin-shopify-store.webp",
        },
        {
          image: "/urban-threads-beig-shopify-store.webp",
        },
      ],
      products: [
        {
          name: "Urban Path Cap",
          price: "$45.00",
          image: "/urban-threads-cap-shopify-store.webp",
        },
        {
          name: "Urban Path Bag",
          price: "$120.00",
          image: "/urban-threads-bag-shopify-store.webp",
        },
        {
          name: "Utility Bomber Jacket",
          price: "$195.00",
          image: "/urban-threads-jacket-shopify-store.webp",
        },
      ],
    },
  },

  {
    id: "jewelry-store",
    title: "Lumina Gems",
    subtitle: "Luxury Jewellery Storefront Showcase",
    category: "Jewellery",

    problem: [
      "The project brief called for a luxury jewellery experience that better reflected the product category and gave visitors clearer information before making a high-consideration purchase.",
      "> Visual direction needed to feel more premium.",
      "> Product pages needed clearer readability.",
      "> Brand story and product confidence needed stronger placement.",
      "> High-ticket product information needed better organisation.",
      "> Homepage trust areas needed a clearer role.",
    ],

    solution: [
      "The design system used a clean luxury direction, stronger product presentation, and clearer page sections for high-consideration customers.",
      "> White-and-gold visual language.",
      "> More focused luxury product imagery.",
      "> Clear product and collection hierarchy.",
      "> Trust and delivery information placement.",
      "> New-arrivals and category-discovery sections.",
    ],

    result: [
      "The final showcase presents a luxury-storefront structure that helps customers explore products with more clarity and confidence.",
      "> Premium visual consistency.",
      "> Better product story placement.",
      "> Clearer high-value product information.",
      "> Improved collection discovery structure.",
      "> SEO-ready luxury category architecture.",
    ],

    image: "/lumina-gems-shopify-store.webp",

    metrics: [
      { label: "AOV", value: "$1,450" },
      { label: "Trust", value: "98%" },
    ],

    analytics: {
      totalSales: {
        value: "$68,300",
        change: "32%",
        isUp: true,
      },
      sessions: {
        value: "8,420",
        change: "5%",
        isUp: true,
      },
      totalOrders: {
        value: "47",
        change: "12%",
        isUp: false,
      },
      conversionRate: {
        value: "1.2%",
        change: "0.8%",
        isUp: true,
      },
    },

    store: {
      layoutType: "jewelry",
      themeColor: "#0a0a0a",
      secondaryColor: "#D4AF37",
      fontStyle: "classic",
      hero: {
        backgroundImage: "/lumina-gems-shopify-store.webp",
        headline: "TIMELESS<br/>ELEGANCE",
        cta: "Explore Jewellery",
      },
      varients: [{ image: "" }, { image: "" }, { image: "" }],
      products: [
        {
          name: "Diamond Ring",
          price: "$4,500",
          image: "/lumina-gems-shopify-store.webp",
        },
      ],
    },
  },

  {
    id: "Saha",
    title: "Saha Garden",
    subtitle: "Service Business Website Showcase",
    category: "Local Service",

    problem: [
      "The project concept required a service-business website that did more than display images. Visitors needed a clearer route to understand the offering, build trust, and make an enquiry.",
      "> Website content needed to support lead generation.",
      "> Services needed clearer explanations.",
      "> Contact actions needed stronger placement.",
      "> Large images needed a more considered role.",
      "> Brand story needed to support trust.",
    ],

    solution: [
      "The website direction focused on turning a visual showcase into a clearer service journey with stronger calls to action and simple enquiry paths.",
      "> Service-first homepage structure.",
      "> Clear quote and contact actions.",
      "> Story and trust sections.",
      "> Image use planned around browsing speed.",
      "> Mobile-friendly service discovery.",
      "> Local SEO-ready service-page foundation.",
    ],

    result: [
      "The final showcase demonstrates a service-business structure designed around clarity, local lead generation, trust, and an easier route from interest to enquiry.",
      "> Clear service and contact journey.",
      "> Better support for local search content.",
      "> Stronger enquiry call-to-action placement.",
      "> More organised visual storytelling.",
      "> Flexible foundation for future service pages.",
    ],

    image: "/saha-garden-cover-shopify-store.webp",

    metrics: [
      { label: "Bookings", value: "+120%" },
      { label: "Retention", value: "92%" },
    ],

    analytics: {
      totalSales: {
        value: "$42,600",
        change: "45%",
        isUp: true,
      },
      sessions: {
        value: "5,400",
        change: "18%",
        isUp: true,
      },
      totalOrders: {
        value: "86",
        change: "34%",
        isUp: false,
      },
      conversionRate: {
        value: "3.8%",
        change: "2.5%",
        isUp: true,
      },
    },

    store: {
      layoutType: "Saha",
      themeColor: "#111111",
      secondaryColor: "#ffffff",
      fontStyle: "urban",
      hero: {
        backgroundImage: "/saha-garden-cover-shopify-store.webp",
        headline: "SHARP<br/>FINISH",
        cta: "Request a Quote",
      },
      varients: [{ image: "" }, { image: "" }, { image: "" }],
      products: [
        {
          name: "Signature Cut",
          price: "$40",
          desc: "Service showcase",
          image: "/saha-garden-cover-shopify-store.webp",
        },
        {
          name: "Beard Care",
          price: "$25",
          desc: "Service showcase",
          image: "/saha-garden-cover-shopify-store.webp",
        },
      ],
    },
  },

  {
    id: "kith-store",
    title: "Kith Editorial",
    subtitle: "Fashion Editorial Commerce Showcase",
    category: "Fashion",

    problem: [
      "The project concept needed to connect editorial content and product discovery so visitors could move naturally from brand stories to relevant products.",
      "> Editorial content and product discovery felt disconnected.",
      "> Product access needed to be easier from content-led pages.",
      "> Navigation needed a more refined fashion-magazine feel.",
      "> Purchase pathways needed fewer unnecessary steps.",
      "> Mobile reading and browsing needed stronger consistency.",
    ],

    solution: [
      "The direction combined editorial storytelling with product discovery to create a fashion-focused browsing experience.",
      "> Black-and-white editorial design language.",
      "> Content and product sections planned together.",
      "> Shop-the-look style discovery blocks.",
      "> Streamlined cart and product pathways.",
      "> Typography built for readable editorial content.",
      "> Faster visual scanning across key pages.",
    ],

    result: [
      "The final showcase presents an editorial-commerce experience designed to connect storytelling, product discovery, and a clearer shopping flow.",
      "> Content-led product discovery.",
      "> More consistent editorial structure.",
      "> Easier route from story to product.",
      "> Stronger premium fashion presentation.",
      "> SEO-ready content and collection relationship.",
    ],

    image: "/kith-c-shopify-store.webp",

    metrics: [
      { label: "AOV", value: "$385" },
      { label: "Conversion", value: "3.8%" },
    ],

    analytics: {
      totalSales: {
        value: "$94,500",
        change: "40%",
        isUp: true,
      },
      sessions: {
        value: "42,800",
        change: "22%",
        isUp: true,
      },
      totalOrders: {
        value: "245",
        change: "18%",
        isUp: false,
      },
      conversionRate: {
        value: "3.4%",
        change: "2.1%",
        isUp: true,
      },
    },

    store: {
      layoutType: "luxury",
      themeColor: "#000000",
      secondaryColor: "#ffffff",
      fontStyle: "serif",
      hero: {
        backgroundImage: "/kith-ck-shopify-store.webp",
        headline: "EDITORIAL<br/>COMMERCE",
        cta: "Explore Collection",
      },
      varients: [{ image: "" }, { image: "" }, { image: "" }],
      products: [
        {
          name: "White Sneakers",
          price: "$1,700",
          desc: "Product showcase",
          image: "/kith-white-shopify-store.webp",
        },
        {
          name: "Brown Canvas",
          price: "$2,500",
          desc: "Product showcase",
          image: "/kith-brown-shopify-store.webp",
        },
        {
          name: "Navy Boots",
          price: "$1,600",
          desc: "Product showcase",
          image: "/kith-neck-shopify-store.webp",
        },
        {
          name: "Grey Trainers",
          price: "$4,000",
          desc: "Product showcase",
          image: "/kith-rock-shopify-store.webp",
        },
      ],
    },
  },
];