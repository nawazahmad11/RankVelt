export interface CaseStudy {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    // longDescription: string;

    problem: string[];
    solution: string[];
    result: string[];

    image: string;
    metrics: { label: string; value: string }[];

    analytics: {
        totalSales: { value: string; change: string; isUp: boolean };
        sessions: { value: string; change: string; isUp: boolean };
        totalOrders: { value: string; change: string; isUp: boolean };
        conversionRate: { value: string; change: string; isUp: boolean };
    }

    store: {
      layoutType: 'District99' | 'clothing' | 'jewelry' | 'Saha' | 'restaurant' | 'luxury';
      themeColor: string;
      secondaryColor: string;
      fontStyle: 'urban' | 'modern' | 'classic' | 'serif' ;
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
        desc?: string 
      }[];


      // Yeh line add karein:
      marqueeText?: string; 
    }
}


// const services = [
//     {
//       title: "Premium Store Design",
//       description: "I build high-conversion Shopify stores with a focus on luxury editorial aesthetics and minimal clutter.",
//       tags: ["UI/UX", "Shopify", "Branding"]
//     },
//     {
//       title: "Performance Optimization",
//       description: "Complete technical SEO and speed optimization to ensure your store loads in under 2 seconds.",
//       tags: ["SEO", "Page Speed", "CRO"]
//     },
//     {
//       title: "Custom Development",
//       description: "Tailor-made liquid sections and custom CSS animations to make your brand stand out from competitors.",
//       tags: ["Liquid", "React", "Custom CSS"]
//     }
//   ];


export const caseStudies: CaseStudy[] = [
    {
        id: "District99",
        title: "District 99",
        subtitle: "High-end Streetwear.",
        category: "Streetwear",
        // longDescription: "District 99 had a really cool brand and great clothes, but their website was a mess. They were getting a lot of clicks from Instagram and TikTok, but nobody was actually buying anything.",
        
        problem: [ "District 99 was getting good traffic from Instagram and TikTok. But the website was not turning visitors into buyers. People were landing on the store and leaving quickly. The site did not feel trustworthy or smooth to use.",
                    ">The website was slow because of heavy images",
                    "> Product visuals looked low quality",
                    ">The design felt messy and confusing",
                    ">It was not optimized for mobile users"
        ],
        solution: ["The goal was simple. Make the store clean, fast, and easy to use. Everything was redesigned with the user in mind.",
                    ">A clean dark design was used to give a premium feel",
                    ">The mobile version was fully improved",
                    ">Images were optimized to make the site faster",
                    ">The “Add to Cart” button was made clear and easy to find",
                    ">The buying process was kept simple and smooth",

        ],
        result:[ "After the changes, the store started performing much better. Users felt more comfortable and started taking action.",
                ">Conversion rate increased from 0.9% to 2.8%",
                 ">Visitors stayed longer on the website",
                ">Fewer people left without interacting",
                ">Customers started buying more than one product",
                ">Overall sales and trust improved",
        ],

        image: "/district-99-online-store.webp",
        metrics: [{ label: "Speed", value: "85/100" }, { label: "Revenue", value: "+42%" }],

        analytics: {
            totalSales: { value: "$28,900", change: "18%", isUp: true },
            sessions: { value: "22,400", change: "12%", isUp: true },
            totalOrders: { value: "620", change: "8%", isUp: true },
            conversionRate: { value: "2.7%", change: "1.8%", isUp: true }
        },

        store: {
          layoutType: 'District99',
          themeColor: "#050505",
          secondaryColor: "#E11D48",
          fontStyle: 'urban',
          hero: { 
            backgroundImage: "/district-99-online-store.webp", 
            headline: "ELEVATE<br/>YOUR DROP", 
            cta: "Shop Now" 
          },
          varients: [
            { image: "" },
            { image: "" },
            { image: "" }
          ],
          // In sections ko hum loop mein use karenge
          products: [
            { name: "Rough Cargo", price: "$80", image: "/district-99-pent-online-stor.webp" },
            { name: "Vanguard Tee", price: "$40", image: "/district-99-Tee-online-stor.webp" },
            { name: "Varsity Wild", price: "$160", image: "/district-99-jak-online-stor.webp" },
            { name: "Puffer", price: "$280", image: "/district-99-puff-online-stor.webp" },
            { name: "Apex Hoodie", price: "$90", image: "/district-99-hod-online-stor.webp" },
            { name: "Union Bag", price: "$120", image: "/district-99-bag-online-stor.webp" }
          ],
          
            

         marqueeText: "NEW DROP LIVE — WORLDWIDE SHIPPING — District99 2026 —"
        }
    },
    {
        id: "clothing-store",
        title: "Urban Threads",
        subtitle: "Street Style.",
        category: "Clothing",
        
        problem: 
        [
            "Urban Threads had a strong streetwear vibe, but the product page was stopping customers from buying. When users landed on the page, it felt overwhelming and unclear. Important details were hidden, and the overall experience made people hesitate instead of taking action.",
            "> The page looked cluttered with too many colors and sections",
            "> Key info like the size guide was difficult to find",
            "> Product quality was not clearly explained",
            "> No visible social proof to build trust",
            "> Mobile browsing felt heavy and unorganized"
        ],
        solution:
        [
            "The goal was to remove confusion and make the page feel easy and reliable. Every element was adjusted to guide the user step-by-step toward purchase.",
            "> The layout was simplified to create a clean and focused look",
            "> A strong call-to-action (“Add to Cart”) was placed where users see it instantly",
            "> Size guide was made clearly visible to reduce hesitation",
            "> A detailed customer reviews section was added to build confidence",
            "> Related products were introduced to encourage more browsing",
            "> The page was optimized for faster loading and smoother mobile use"
        ],
        result:
        [
            "The new product page changed how users interacted with the store. It felt easier to trust, easier to use, and easier to buy from.",
            "> Conversion rate improved by 35%",
            "> Customers showed higher confidence while purchasing", 
            "> Average order size increased with multiple item purchases",
            "> Engagement on product pages went up",
            "> Store experience became more smooth and conversion-focused",
        ],
        

        image: "/urban-threads-show-shopify-store.webp",
        metrics: [{ label: "Speed", value: "89/100" }, { label: "Sales", value: "+38%" }],

        analytics: {
            totalSales: { value: "$16,840", change: "21%", isUp: true },
            sessions: { value: "18,450", change: "14%", isUp: true },
            totalOrders: { value: "412", change: "9%", isUp: false },
            conversionRate: { value: "2.4%", change: "2.1%", isUp: true }
        },

        store: {
          layoutType: 'clothing',
          themeColor: "#ffffff",
          secondaryColor: "#000000",
          fontStyle: 'modern',
          hero: { 
            backgroundImage: "/urban-threads-shopify-store.webp", 
            headline: "ESSENTIALS<br/>FOR SUMMER", 
            cta: "Explore Collection" 
          },
          varients: [
            { image: "/urban-threads-black-shopify-store.webp" },
            { image: "/urban-threads-skin-shopify-store.webp" },
            { image: "/urban-threads-beig-shopify-store.webp" }
          ],
          products: [
            { name: "Urban Path Cap", price: "$45.00", image: "/urban-threads-cap-shopify-store.webp" },
            { name: "Urban Path Bag", price: "$120.00", image: "/urban-threads-bag-shopify-store.webp" },
            { name: "Utility Bomber Jacket", price: "$195.00", image: "/urban-threads-jacket-shopify-store.webp" }
          ]
        }
    },
    {
      id: "jewelry-store",
      title: "Lumina Gems",
      subtitle: "Luxury Jewelry.",
      category: "Luxury",
    //   longDescription: "Elegant gold-themed store for high-end buyers with premium product interactions.",

    problem: 
    [
        "Lumina Gems was selling high-value diamond jewelry, but the website did not match the price or quality of the products. When people visited the store, it did not feel like a luxury brand. This created doubt, and customers were not comfortable spending large amounts online.",
        "> The design looked unstructured and not premium",
        "> Fonts were hard to read, especially on product pages",
        "> No strong brand story to build emotional connection",
        "> Missing trust signals for high-ticket purchases",
        "> No visible customer feedback on the homepage"
    ],
    solution:
    [ 
        "The focus was to create a luxury experience that builds trust from the first second. The design and content were shaped to reflect elegance, clarity, and confidence.",
        "> A clean white and gold theme was used for a high-end look",
        "> A strong hero section was added to present the brand as timeless and established",
        "> Trust badges (shipping, guarantee) were placed in visible areas",
        "> A dedicated customer reviews section was added to build credibility",
        "> Product visuals were upgraded to look sharp and premium",
        "> A “New Arrivals” section was introduced to keep the store fresh and engaging"
    ],
    result: 
    [
        "After the redesign, the store started to feel like a true luxury brand. Visitors showed more confidence, and this directly improved buying behavior.",
        "> Conversion rate increased significantly",
        "> More users clicked on “Shop Now” and explored products",
        "> Customer trust improved, especially for high-value purchases",
        "> Sales started growing as hesitation reduced",
        "> The brand now feels premium, reliable, and market-ready"
    ],

      image: "/lumina-gems-shopify-store.webp",
      metrics: [{ label: "AOV", value: "$1,450" }, { label: "Trust", value: "98%" }],

      analytics: {
        totalSales: { value: "$68,300", change: "32%", isUp: true },
        sessions: { value: "8,420", change: "5%", isUp: true },
        totalOrders: { value: "47", change: "12%", isUp: false },
        conversionRate: { value: "1.2%", change: "0.8%", isUp: true }
    },

      store:
      {
        layoutType: 'jewelry',
        themeColor: "#0a0a0a",
        secondaryColor: "#D4AF37",
        fontStyle: 'classic',
        hero: { backgroundImage: "/lumina-gems-shopify-store.webp", headline: "TIMELESS<br/>ELEGANCE", cta: "Inquire Now" },
        varients: [
            { image: "" },
            { image: "" },
            { image: "" }
          ],
        products: [{ name: "Diamond Ring", price: "$4,500", image: "" }]
      }
    },
    {
      id: "Saha",
      title: "Saha Garden",
      subtitle: "Master Barbers.",
      category: "Service",
    //   longDescription: "Service-oriented layout for professional grooming salons with booking focus.",


    problem: 
    [
        "Saha Garden had beautiful work, but their website was not helping them get clients. It was only showing images, with no clear way for visitors to take the next step. People would visit, look around, and leave without contacting the business. This was causing a loss of potential local customers.",
        "> Website worked like a gallery, not a business tool",
        "> No clear option to request a quote or contact",
        "> Slow loading speed due to large images",
        "> No service details, so users felt unsure",
        "> Weak trust and no strong brand story",
    ],
    solution:
    [ 
        "The goal was to turn the website into a simple and effective lead system. Every change was made to help visitors understand the service and take action.",
        "> A clean and structured layout was created to highlight their work",
        "> A clear “Our Services” section was added to explain offerings",
        "> A “Get a Quote” form was placed in key areas for easy contact",
        "> An “Our Story” section was introduced to build trust",
        "> All images were optimized to improve speed, especially on mobile",
        "> The overall flow was designed to guide users from interest to inquiry"
    ],
    result:
    [
         "After the redesign, the website started bringing real business instead of just views. Visitors now had a clear path to connect, which improved lead generation.",
         "> Quote requests increased by 3x",
         "> More local customers started reaching out",
         "> Users spent more time exploring the site",
         "> Trust improved due to clear information and story",
         "> Business bookings increased, with a stronger client pipeline"
    ],

      image: "/saha-garden-cover-shopify-store.webp",
      metrics: [{ label: "Bookings", value: "+120%" }, { label: "Retention", value: "92%" }],

      analytics: {
        totalSales: { value: "$42,600", change: "45%", isUp: true },
        sessions: { value: "5,400", change: "18%", isUp: true },
        totalOrders: { value: "86", change: "34%", isUp: false },
        conversionRate: { value: "3.8%", change: "2.5%", isUp: true }
    },

      store: {
        layoutType: 'Saha',
        themeColor: "#111111",
        secondaryColor: "#ffffff",
        fontStyle: 'urban',
        hero: { backgroundImage: "/saha-garden-cover-shopify-store.webp", headline: "SHARP<br/>FINISH", cta: "Book Now" },
        varients: [
            { image: "" },
            { image: "" },
            { image: "" }
          ],
        products: [
          { name: "", price: "$40", desc: "", image: "" },
          { name: "", price: "", desc: "", image: "" }
        ]
      }
    },
    {
        id: "kith-store", // Aapne ab isay restaurant se change kar ke kith-store kar dena hai
        title: "Kith Editorial",
        subtitle: "Foottwear & Lifestyle.",
        category: "Fashion",
        // longDescription: "A high-end editorial commerce experience featuring multi-layered navigation and immersive brand storytelling inspired by Kith NYC.",

        problem: 
        [
            "Kith Editorial had a strong fashion identity, but the website was not turning readers into buyers. The content and shop felt disconnected. People enjoyed reading articles, but when they wanted to buy something, the process felt long and confusing. This gap was hurting sales.",
            "> Articles and shop were separated, not linked together",
            "> Products mentioned in stories were hard to find",
            "> Too many steps to reach checkout",
            "> Slow and frustrating buying experience",
            "> Low conversion because interest was not turning into action"
        ],
        solution:
        [ 
            "The goal was to connect content and shopping into one smooth experience. The site was redesigned to feel like a modern fashion magazine with built-in shopping.",
            "> A clean black-and-white editorial layout was created",
            "> “Shop” and “Stories” were merged into one seamless flow",
            "> “Shop the Look” feature added for instant product access",
            "> A slide-out cart was introduced for quick checkout without leaving the page",
            "> Typography and layout were improved for easy reading",
            "> Overall experience was made faster and more engaging"
        ],
        result: [
            "The new experience changed how users interacted with the brand. Readers no longer just consumed content—they started buying directly from it.",
            "> Sales increased by 40%",
            "> Users spent more time on the website",
            "> More visitors moved from reading to purchasing",
            "> Checkout became faster and smoother",
            "> Brand positioning improved as a premium fashion platform",
        ],

        image: "/kith-c-shopify-store.webp",
        metrics: [
          { label: "AOV", value: "$385" }, 
          { label: "Conversion", value: "3.8%" }
        ],

        analytics: {
            totalSales: { value: "$94,500", change: "40%", isUp: true },
            sessions: { value: "42,800", change: "22%", isUp: true },
            totalOrders: { value: "245", change: "18%", isUp: false },
            conversionRate: { value: "3.4%", change: "2.1%", isUp: true }
        },

        store: {
          layoutType: 'luxury',
          themeColor: "#000000",
          secondaryColor: "#ffffff",
          fontStyle: 'serif',
          hero: { 
              backgroundImage: "/kith-ck-shopify-store.webp", 
              headline: "Kith for the <br/> New York Knicks", 
              cta: "Shop Now" 
          },
          varients: [
            { image: "" },
            { image: "" },
            { image: "" }
          ],
          products: [
            { 
              name: "White Sneakers", 
              price: "1700", 
              desc: "", 
              image: "/kith-white-shopify-store.webp" 
            },
            { 
              name: "Brown Canvas", 
              price: "2500", 
              desc: "", 
              image: "/kith-brown-shopify-store.webp" 
            },
            { 
              name: "Navy Boots", 
              price: "1600", 
              desc: "", 
              image: "/kith-neck-shopify-store.webp" 
            },
            { 
              name: "Grey Trainers", 
              price: "4000", 
              desc: "", 
              image: "/kith-rock-shopify-store.webp" 
            }
          ]
        }
      }
];