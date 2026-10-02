import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const businessSeoConfig: SeoServicePageConfig = {
  slug: "/business-seo",

  metaTitle:
    "Business SEO Services for Organic Leads | RankVelt",

  metaDescription:
    "RankVelt provides business SEO services for companies, consultants and agencies that need qualified organic traffic, stronger service pages and leads.",

  eyebrow: "Business SEO Services",

  h1:
    "Business SEO Services for Sustainable Organic Lead Generation",

  intro:
    "RankVelt helps service businesses turn their website into a stronger growth asset through search-focused service pages, technical SEO, content planning, internal linking and conversion-ready structure.",

  focusAreas: [
    "Service Page SEO",
    "Organic Lead Generation",
    "Technical SEO",
    "Content Strategy",
  ],

  overviewTitle:
    "Build an SEO Strategy Around the Services That Drive Your Business",

  overviewParagraphs: [
    "Business SEO is more than publishing blog posts. Your priority services need dedicated pages, clear search intent, useful information and a simple route to enquiry.",

    "Most service businesses lose enquiries quietly. A prospect searches for exactly what you sell, finds a competitor with a clearer page, and never learns your name. The traffic was never the problem. The page the search landed on was.",

    "RankVelt identifies the pages, search themes, technical improvements and content opportunities most likely to attract qualified prospects.",

    "The roadmap is shaped around your services, audience, sales process, competition and current website condition.",

    "Everything is measured against one standard: does this help the right person find the right service and take the next step?",
  ],

  deliverablesTitle:
    "What a Business SEO Strategy Can Include",

  deliverables: [
    "SEO audit and prioritised growth roadmap.",
    "Service-page and landing-page optimisation.",
    "Commercial keyword and competitor research.",
    "Technical SEO implementation priorities.",
    "Website architecture and internal linking.",
    "Service, comparison and guide content planning.",
    "Conversion improvements for calls and forms.",
  ],

  audienceTitle:
    "Business SEO Is a Strong Fit For",

  audience: [
    "Service businesses that need qualified leads.",
    "Consultants, agencies, SaaS and B2B companies.",
    "Businesses with weak service-page visibility.",
    "Companies expanding into new services or markets.",
    "Brands preparing to scale content or advertising.",
  ],

  outcomesTitle:
    "What Strong Business SEO Should Improve",

  outcomes: [
    "Clearer visibility for valuable services.",
    "Better website structure and navigation.",
    "More qualified traffic to service pages.",
    "Stronger conversion paths from search to enquiry.",
    "A scalable SEO foundation for future growth.",
  ],

  aiVisibility: {
    title: "Ready for AI Search, Not Just Google",
    intro:
      "Prospects now ask ChatGPT, Perplexity and Google AI Overviews for recommendations before they ever visit a website. Business SEO should make your services easy to find, understand and cite in those answers as well.",
    points: [
      "Service pages written to answer real buyer questions clearly and directly.",
      "Consistent company and service information that AI systems can cite with confidence.",
      "Supporting guide and comparison content planned around commercial searches.",
      "Technical and internal-linking foundations checked as part of every roadmap.",
    ],
  },

  pricing: {
    title: "Simple, Published Pricing",
    intro:
      "No hidden quotes and no pressure calls. This is exactly how a RankVelt engagement starts.",
    steps: [
      {
        title: "Share your website",
        description:
          "Send your website and the services you want more enquiries for through the free opportunity check form.",
      },
      {
        title: "Get a prioritised review",
        description:
          "RankVelt reviews your visibility, your competitors and the biggest growth opportunities first.",
      },
      {
        title: "See the plan and the price",
        description:
          "You receive a clear plan with exact pricing before you decide anything.",
      },
    ],
    price: "from $525",
    unit: "/month",
    term: "Minimum 3 months, then month-to-month.",
    includes: [
      "Service page optimisation",
      "Commercial keyword and competitor research",
      "Technical SEO priorities",
      "Content planning and internal linking",
      "Monthly progress summary",
      "Direct founder access",
    ],
    note: "Final pricing depends on your website condition, scope and competition. The free opportunity check confirms your exact price before any work starts.",
    founderNote:
      "Your work is led personally by founder Nawaz Ahmad. No juniors and no handoffs.",
  },

  processTitle:
    "A Business SEO Process Built Around Real Priorities",

  process: [
    {
      step: "01",
      title: "Understand",
      description:
        "RankVelt reviews your services, audience, competitors and desired customer actions.",
    },
    {
      step: "02",
      title: "Plan",
      description:
        "A focused roadmap is created for service pages, keywords, content and technical improvements.",
    },
    {
      step: "03",
      title: "Build",
      description:
        "Priority pages and technical foundations are improved.",
    },
    {
      step: "04",
      title: "Improve",
      description:
        "Search performance and new market opportunities guide continued work.",
    },
  ],

  guide: {
    title: "The RankVelt Guide to Business SEO",
    intro:
      "A plain English look at how service pages, content and technical foundations turn searches into enquiries.",
    sections: [
      {
        heading: "What Business SEO Actually Includes",
        paragraphs: [
          "Business SEO is the work that helps your company get found by people who are ready to buy a service. It covers your service pages, the technical health of your website, supporting content, internal linking and the path from a search result to an enquiry.",
          "It is not a traffic contest. A thousand visits from people who will never buy is worth less than ten visits from prospects comparing providers. Every part of the strategy, from keyword choice to page structure, is judged by whether it attracts the second kind of visitor.",
        ],
        links: [
          {
            label: "Browse the free RankVelt SEO tools",
            path: "/tools",
          },
        ],
      },
      {
        heading: "Service Pages Are the Engine",
        paragraphs: [
          "For a service business, the service page does the selling. Each priority service needs its own page, written around the searches buyers actually make, explaining the service in plain language, answering the obvious questions and ending with one clear next step.",
          "Businesses often hide every service on one page, or describe services the way they would to a colleague instead of a customer. Google cannot rank what it cannot understand, and prospects will not enquire about what they cannot follow. One clear page per service is the single highest value change most business websites can make.",
        ],
        links: [
          {
            label: "See how local service pages are structured",
            path: "/local-seo",
          },
        ],
      },
      {
        heading: "Content That Supports Sales, Not Just Traffic",
        paragraphs: [
          "Good business content answers the questions prospects ask before they hire. Cost guides, comparisons, process explainers and problem led articles position your company as the obvious expert while the buyer is still deciding. That is the content that shortens sales calls.",
          "Content written only to chase search volume rarely does this. It attracts readers with no budget and no intent, and it sits apart from the services that pay for it. RankVelt plans content backwards from your services, so every article has a commercial reason to exist and a natural path to an enquiry.",
        ],
      },
      {
        heading: "Technical Foundations That Decide Whether Content Works",
        paragraphs: [
          "Technical SEO is unglamorous, and it decides whether everything else counts. If search engines cannot crawl your important pages, if the site structure buries them five clicks deep, or if duplicate and thin pages compete with your real services, strong content underperforms through no fault of its own.",
          "A technical review checks indexation, site structure, internal linking, page speed basics and the errors that quietly waste visibility. Fixing these first means later content and service page work lands on solid ground.",
        ],
      },
      {
        heading: "Common Business SEO Mistakes",
        paragraphs: [
          "These patterns show up in almost every business website review. Most are cheap to fix once someone points at them.",
        ],
        bullets: [
          "Blogging regularly while the service pages stay thin and invisible.",
          "Targeting high traffic keywords that attract students and job seekers, not buyers.",
          "Service pages with no clear next step, so visitors leave to keep searching.",
          "Measuring success only by rankings instead of enquiries and calls.",
          "Copying competitor page structures without the proof or content behind them.",
          "Letting old, thin pages compete with the services that make money.",
        ],
      },
      {
        heading: "How to Choose a Business SEO Partner",
        paragraphs: [
          "Ask any provider five questions. What will you fix first, and why that first? Who does the work, and can I reach them? What does it cost, and am I locked in? How will I see progress in business terms? What will you not do? The quality of the answers tells you most of what the engagement will feel like.",
          "RankVelt answers plainly: published pricing from $525 per month, a 3 month minimum instead of a 6 or 12 month lock-in, a founder who reviews your account personally, monthly reporting in plain English and a free opportunity check that shows the plan before you pay anything.",
        ],
        links: [
          {
            label: "Start with the free SEO Opportunity Check",
            path: "/strategy-call?package=Free%20SEO%20Opportunity%20Check",
          },
        ],
      },
    ],
  },

  faqs: [
    {
      question:
        "What is the difference between business SEO and local SEO?",
      answer:
        "Local SEO focuses on nearby customers and location-based visibility. Business SEO may include regional, national or broader service-page and content strategies.",
    },
    {
      question: "Can SEO generate qualified leads?",
      answer:
        "SEO can attract people searching for relevant services. Lead quality also depends on the offer, targeting, trust and conversion path.",
    },
    {
      question:
        "Can RankVelt improve an existing website?",
      answer:
        "Yes. RankVelt can audit and improve an existing website or support a redesign where the current structure limits growth.",
    },
    {
      question:
        "Which pages should a service business prioritise?",
      answer:
        "Priority service pages, high-value landing pages, relevant proof pages and supporting content should usually come first.",
    },
    {
      question: "How much do business SEO services cost?",
      answer:
        "Business SEO engagements at RankVelt start at $525 per month, with a minimum engagement of 3 months. Your exact price depends on scope, website condition and how competitive your market is. The free opportunity check confirms your exact price before you commit to anything.",
    },
    {
      question: "Do you require a long-term contract?",
      answer:
        "SEO needs a proper runway to work. Engagements start with a minimum of 3 months so improvements have time to compound, then continue month to month for as long as the work keeps delivering. There are no 6 or 12 month lock-ins.",
    },
    {
      question: "Can SEO run alongside paid advertising?",
      answer:
        "Yes. SEO builds long-term visibility while paid campaigns can deliver immediate reach and test offers. Many businesses run both and reduce ad dependence as organic visibility grows.",
    },
    {
      question: "What reporting do I receive?",
      answer:
        "A monthly summary covering visibility changes, the priority work completed, the signals worth watching and the next planned actions. The focus stays on qualified traffic and enquiries, not vanity numbers.",
    },
    {
      question: "Who will work on my account?",
      answer:
        "RankVelt is founder-led. Nawaz Ahmad reviews the strategy and progress personally instead of handing your account to a junior account manager.",
    },
    {
      question: "Do you guarantee results?",
      answer:
        "No honest agency can guarantee specific rankings, because Google controls the results. What RankVelt guarantees is a clear plan, consistent work and transparent reporting, so you always know what was done and why.",
    },
  ],

  relatedServices: [
    {
      title: "Local SEO",
      description:
        "Improve local visibility and service-area leads.",
      path: "/local-seo",
    },
    {
      title: "eCommerce SEO",
      description:
        "Improve Shopify product discovery and sales.",
      path: "/ecommerce-seo",
    },
    {
      title: "SEO Tools",
      description:
        "Use RankVelt tools for practical SEO tasks.",
      path: "/tools",
    },
  ],
};

export default function BusinessSEOService() {
  return (
    <SeoServiceTemplate config={businessSeoConfig} />
  );
}
