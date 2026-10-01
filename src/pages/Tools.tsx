// TOOLS-VERSION-11 : 11 tools hub (2026-09-30)
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Layout,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
} from "lucide-react";

import NameGenerator from "../components/Tools/NameGenerator";
import ThemeDetector from "../components/Tools/ThemeDetector";
import ProfitCalculator from "../components/Tools/ProfitCalculator";
import PolicyGenerator from "../components/Tools/PolicyGenerator";

import toolContentJson from "../data/tool-content.json";

import GuestPostFinder from "../components/Tools/GuestPostFinder";

const SITE_URL = "https://www.rankvelt.com";

type ToolType =
  | "calculator"
  | "policy"
  | "detector"
  | "generator"
  | "guest-post"
  | "meta-checker"
  | "schema"
  | "robots"
  | "sitemap"
  | "seo-checklist"
  | "redirect"
  | "email-extractor";

type ToolFaq = {
  q: string;
  a: string;
};

type ToolJsonContent = {
  title: string;
  description: string;
  features: {
    title: string;
    detail: string;
  }[];
  faqs: ToolFaq[];
};

type ToolJsonMap = Record<string, ToolJsonContent>;

type ToolConfig = {
  toolType: ToolType;
  slug: string;
  contentKey: string;
  badge: string;
  title: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  intro: string;
  guideTitle: string;
  guideText: string;
  bestFor: string[];
  relatedLinks: {
    title: string;
    description: string;
    path: string;
  }[];
  directPath?: string;
};

const toolJson = toolContentJson as ToolJsonMap;

const toolMapping: Record<string, ToolType> = {
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


  "guest-post-finder": "guest-post",
  "guest-post": "guest-post",

};

const tools: ToolConfig[] = [
  {
    toolType: "calculator",
    slug: "profit-margin-calculator",
    contentKey: "profit-calculator",
    badge: "Free eCommerce Calculator",
    title: "Profit Margin Calculator",
    pageTitle: "Free Profit Margin Calculator for eCommerce",
    metaTitle: "Free Profit Margin Calculator for eCommerce | RankVelt",
    metaDescription:
      "Free eCommerce profit margin calculator: estimate selling margin, product profit, costs, fees, and break-even pricing direction.",
    shortDescription:
      "Estimate product profit, costs, margin direction, and pricing scenarios.",
    intro:
      "Use your product price, product cost, shipping, payment fees, advertising spend, and other direct costs to estimate the profitability direction of a product or offer.",
    guideTitle: "Plan Pricing Before You Scale Traffic",
    guideText:
      "A product can generate revenue without creating enough room for profit. Use this calculator before increasing ad spend, discounting a product, offering free shipping, building bundles, or expanding a product category.",
    bestFor: [
      "Shopify stores reviewing product prices and discounts.",
      "Brands estimating the impact of shipping and fulfilment costs.",
      "Founders checking whether paid acquisition fits their margin.",
      "eCommerce businesses comparing bundle or promotion scenarios.",
    ],
    relatedLinks: [
      {
        title: "eCommerce SEO",
        description:
          "Improve product discovery, collection structure, Shopify SEO, and qualified organic traffic.",
        path: "/ecommerce-seo",
      },
      {
        title: "High-Converting Product Pages",
        description:
          "Learn how product-page clarity, trust content, SEO, and UX affect purchase decisions.",
        path: "/blog/high-converting-product-pages",
      },
    ],
  },
  {
    toolType: "policy",
    slug: "legal-policy-generator",
    contentKey: "policy-generator",
    badge: "Free Website Policy Tool",
    title: "Legal Policy Generator",
    pageTitle: "Free Legal Policy Generator for Websites",
    metaTitle: "Free Legal Policy Generator for Websites | RankVelt",
    metaDescription:
      "Free legal policy generator: create starter privacy, refund, and terms content for websites, Shopify stores, and local businesses.",
    shortDescription:
      "Create starter privacy, refund, and terms content for your website.",
    intro:
      "Generate a structured starter draft for privacy policies, refund policies, and website terms, then review every section against your real business processes.",
    guideTitle: "Clear Policies Support Trust Before Customers Contact You",
    guideText:
      "Policy pages are not just footer links. They help customers understand refunds, returns, cancellation terms, customer support, delivery expectations, data collection, and how your business handles online transactions.",
    bestFor: [
      "New Shopify stores preparing for launch.",
      "WordPress websites using forms, analytics, or online payments.",
      "Local services collecting customer enquiries or bookings.",
      "Businesses updating old policies after adding tools or services.",
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead-generation pathways.",
        path: "/business-seo",
      },
      {
        title: "Cart & Checkout Optimisation",
        description:
          "Improve delivery clarity, trust content, cart experience, and customer conversion paths.",
        path: "/services/checkout-flow",
      },
    ],
  },
  {
    toolType: "detector",
    slug: "shopify-theme-detector",
    contentKey: "theme-detector",
    badge: "Free Shopify Research Tool",
    title: "Shopify Theme Detector",
    pageTitle: "Free Shopify Theme Detector Tool",
    metaTitle: "Free Shopify Theme Detector | RankVelt",
    metaDescription:
      "Free Shopify theme detector and checker: paste any store URL to identify the likely Shopify theme behind a public eCommerce storefront.",
    shortDescription:
      "Research likely Shopify theme setups using public storefront signals.",
    intro:
      "Paste a public Shopify store URL to review accessible storefront signals that may indicate its likely theme setup, then use the result for research and redesign planning.",
    guideTitle: "Use Theme Research to Understand Store Patterns",
    guideText:
      "A theme is only one part of a successful store. Use the result to start a wider review of navigation, collections, product pages, mobile UX, visual hierarchy, apps, speed, SEO, and customer journey design.",
    bestFor: [
      "Shopify founders researching redesign options.",
      "eCommerce brands collecting useful storefront inspiration.",
      "Agencies evaluating public theme patterns before planning a build.",
      "Store owners deciding between a theme adjustment and custom development.",
    ],
    relatedLinks: [
      {
        title: "eCommerce SEO",
        description:
          "Improve Shopify collections, product discovery, internal linking, and technical SEO foundations.",
        path: "/ecommerce-seo",
      },
      {
        title: "Shopify Redesign Guide",
        description:
          "Understand the signs a Shopify store needs redesign work for SEO, usability, and conversions.",
        path: "/blog/shopify-redesign-signs-2026",
      },
    ],
  },
  {
    toolType: "generator",
    slug: "business-name-generator",
    contentKey: "name-generator",
    badge: "Free Brand Planning Tool",
    title: "Business Name Generator",
    pageTitle: "Free Business Name Generator",
    metaTitle: "Free Business Name Generator for Brands | RankVelt",
    metaDescription:
      "Generate business-name ideas for eCommerce stores, local services, product brands, agencies, and growing companies with RankVelt's free business name generator.",
    shortDescription:
      "Generate starting business-name ideas for brands, stores, and services.",
    intro:
      "Enter a keyword, niche, service, product type, audience, or business direction to generate ideas, then check domains, social profiles, registrations, and trademarks before selecting a final name.",
    guideTitle: "Choose a Name That Can Grow With Your Business",
    guideText:
      "The best names are clear, easy to remember, practical to spell, and flexible enough to work across websites, social profiles, packaging, local listings, emails, and future products or services.",
    bestFor: [
      "New Shopify stores and eCommerce brands.",
      "Local service businesses and appointment-led companies.",
      "Freelancers, agencies, consultants, and digital projects.",
      "Founders planning a rebrand, new product line, or new venture.",
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Create stronger service pages, website structure, technical SEO, and organic lead pathways.",
        path: "/business-seo",
      },
      {
        title: "Local SEO",
        description:
          "Improve local visibility, service-area relevance, Google Business Profile signals, and enquiries.",
        path: "/local-seo",
      },
    ],
  },
  // 👇 YAHAN NAYA TOOL CONFIG BLOCK ADD KAREIN:
  {
    toolType: "guest-post",
    slug: "guest-post-finder",
    contentKey: "guest-post-finder",
    badge: "Free SEO & Outreach Tool",
    title: "Guest Post Finder",
    pageTitle: "Free Guest Post & Email Outreach Finder",
    metaTitle: "Free Guest Post & Email Outreach Finder | RankVelt",
    metaDescription:
      "Find guest post opportunities and outreach emails directly from websites using RankVelt's free outreach tool.",
    shortDescription:
      "Find guest posting opportunities and outreach emails fast.",
    intro:
      "Scan target websites to instantly identify guest post guidelines, write-for-us pages, and direct contact email addresses.",
    guideTitle: "Scale Your Backlink & SEO Outreach Effortlessly",
    guideText:
      "Manual outreach takes hours. Use this tool to quickly filter through domains, discover submission guidelines, and extract contact emails for guest blogging campaigns.",
    bestFor: [
      "SEO specialists looking for high-quality backlink sources.",
      "Content marketers searching for guest blogging opportunities.",
      "Agencies building targeted outreach email lists.",
      "Founders doing manual link-building research.",
    ],
    relatedLinks: [
      {
        title: "eCommerce SEO",
        description:
          "Improve product discovery, collection structure, and qualified organic traffic.",
        path: "/ecommerce-seo",
      },
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead pathways.",
        path: "/business-seo",
      },
    ],
  },


  
  {
    toolType: "email-extractor",
    slug: "bulk-email-extractor",
    contentKey: "email-extractor",
    badge: "Free Lead Generation Tool",
    title: "Bulk Email Extractor",
    pageTitle: "Free Bulk Email Extractor & Verifier",
    metaTitle: "Free Bulk Email Extractor & Verifier | RankVelt",
    metaDescription:
      "Extract emails from any list of websites and verify them free with RankVelt's bulk email extractor and verifier tool.",
    shortDescription:
      "Extract and verify emails from a bulk list of websites, free.",
    intro:
      "Paste a list of websites to extract public contact emails and verify them, all from one free tool.",
    guideTitle: "Build Your Outreach List Faster",
    guideText:
      "Manual email collection takes hours. Paste your website list, extract contact emails in bulk, then verify them before outreach.",
    bestFor: [
      "Founders building cold outreach lists.",
      "Agencies collecting lead contact data.",
      "Marketers cleaning email lists before campaigns.",
      "Freelancers finding client contact emails.",
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead pathways.",
        path: "/business-seo",
      },
      {
        title: "eCommerce SEO",
        description:
          "Improve product discovery, collection structure, and qualified organic traffic.",
        path: "/ecommerce-seo",
      },
    ],
  },
  





  {
    toolType: "meta-checker",
    slug: "meta-title-description-checker",
    contentKey: "meta-checker",
    badge: "Free SEO Metadata Tool",
    title: "Meta Title Checker",
    pageTitle: "Free Meta Title & Description Checker",
    metaTitle: "Free Meta Title & Description Checker | RankVelt",
    metaDescription:
      "Check meta title and description length, clarity, and SERP preview with RankVelt's free SEO metadata checker.",
    shortDescription:
      "Check title and description length with a live SERP preview.",
    intro:
      "Paste a title and meta description to check length, clarity, and how the snippet looks in desktop and mobile search results.",
    guideTitle: "Write Snippets People Want to Click",
    guideText:
      "Titles and descriptions do not change rankings directly, but they decide whether a searcher clicks your result. Check the length first, then make the wording specific to the query and the promise of the page.",
    bestFor: [
      "Blog editors reviewing titles before publishing.",
      "SEO specialists auditing snippet quality at scale.",
      "Shopify stores improving product and collection snippets.",
      "Agencies standardising metadata across client sites.",
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead pathways.",
        path: "/business-seo",
      },
      {
        title: "SEO vs AEO vs GEO",
        description:
          "Understand how classic SEO, answer optimisation, and AI visibility fit together.",
        path: "/blog/seo-vs-aeo-vs-geo",
      },
    ],
    directPath: "/tools/meta-title-description-checker",
  },
  {
    toolType: "schema",
    slug: "schema-markup-generator",
    contentKey: "schema",
    badge: "Free Structured Data Tool",
    title: "Schema Generator",
    pageTitle: "Free Schema Markup Generator",
    metaTitle: "Free Schema Markup Generator | RankVelt",
    metaDescription:
      "Generate JSON-LD schema markup for Organization, LocalBusiness, FAQ, and Article pages with RankVelt's free generator.",
    shortDescription:
      "Generate JSON-LD schema markup in seconds.",
    intro:
      "Fill in your business or page details to generate clean JSON-LD schema markup you can paste straight into your website.",
    guideTitle: "Add Schema Without Writing Code",
    guideText:
      "Structured data helps search engines understand your pages and can unlock rich results. Generate the markup here, add it to the page, then validate it before deploying.",
    bestFor: [
      "Local businesses adding LocalBusiness schema.",
      "Bloggers marking up articles and FAQs.",
      "Agencies shipping schema across client sites.",
      "Developers who want valid JSON-LD without hand-writing it.",
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead pathways.",
        path: "/business-seo",
      },
      {
        title: "Local SEO",
        description:
          "Improve local visibility, service-area relevance, and Google Business Profile signals.",
        path: "/local-seo",
      },
    ],
    directPath: "/tools/schema-markup-generator",
  },
  {
    toolType: "robots",
    slug: "robots-txt-generator",
    contentKey: "robots",
    badge: "Free Crawler Control Tool",
    title: "Robots.txt Generator",
    pageTitle: "Free Robots.txt Generator",
    metaTitle: "Free Robots.txt Generator | RankVelt",
    metaDescription:
      "Create a practical robots.txt file with crawler rules, path exclusions, and a sitemap line using RankVelt's free generator.",
    shortDescription:
      "Build a clean robots.txt with crawler rules.",
    intro:
      "Choose which crawlers can access which parts of your site, add path exclusions, and include your sitemap location.",
    guideTitle: "Control Crawlers Without Blocking the Wrong Pages",
    guideText:
      "A small syntax error in robots.txt can block your whole site from search. Generate the file here, then test it in Search Console before uploading it to your server.",
    bestFor: [
      "New websites setting crawl rules for the first time.",
      "Site owners blocking staging or internal sections.",
      "SEOs auditing crawler access during technical reviews.",
      "Agencies standardising robots.txt across client sites.",
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead pathways.",
        path: "/business-seo",
      },
      {
        title: "XML Sitemap Generator",
        description:
          "Build a clean XML sitemap to reference from your robots.txt file.",
        path: "/tools/xml-sitemap-generator",
      },
    ],
    directPath: "/tools/robots-txt-generator",
  },
  {
    toolType: "sitemap",
    slug: "xml-sitemap-generator",
    contentKey: "sitemap",
    badge: "Free Technical SEO Tool",
    title: "XML Sitemap Generator",
    pageTitle: "Free XML Sitemap Generator",
    metaTitle: "Free XML Sitemap Generator | RankVelt",
    metaDescription:
      "Build a clean XML sitemap from canonical URLs and download sitemap.xml with RankVelt's free generator.",
    shortDescription:
      "Build and download a clean XML sitemap.",
    intro:
      "Enter your canonical URLs to build a clean XML sitemap, then download the file and submit it in Search Console.",
    guideTitle: "Help Google Find Every Important Page",
    guideText:
      "A sitemap does not guarantee indexing, but it helps crawlers discover new and updated pages faster. Keep it limited to canonical, indexable URLs.",
    bestFor: [
      "New websites submitting their first sitemap.",
      "Site owners cleaning up duplicate or invalid URLs.",
      "SEOs auditing indexable URL lists.",
      "Migrated sites confirming new URLs are discoverable.",
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead pathways.",
        path: "/business-seo",
      },
      {
        title: "Robots.txt Generator",
        description:
          "Generate a robots.txt file that references your new sitemap.",
        path: "/tools/robots-txt-generator",
      },
    ],
    directPath: "/tools/xml-sitemap-generator",
  },
  {
    toolType: "seo-checklist",
    slug: "local-seo-checklist",
    contentKey: "seo-checklist",
    badge: "Free Local SEO Tool",
    title: "Local SEO Checklist",
    pageTitle: "Free Local SEO Checklist & Scorecard",
    metaTitle: "Free Local SEO Checklist & Scorecard | RankVelt",
    metaDescription:
      "Score your local SEO across Google Business Profile, service pages, reviews, and citations with RankVelt's free checklist.",
    shortDescription:
      "Score your local SEO with an actionable checklist.",
    intro:
      "Work through the checklist to score your Google Business Profile, service pages, reviews, and citations, then fix the weakest areas first.",
    guideTitle: "Fix the Local Gaps That Cost Calls",
    guideText:
      "Most local businesses lose enquiries to small, fixable gaps: an incomplete profile, thin service pages, or missing reviews. The scorecard shows you exactly where to start.",
    bestFor: [
      "Local service businesses auditing their own visibility.",
      "Multi-location brands standardising local pages.",
      "Agencies onboarding new local SEO clients.",
      "Founders preparing a Google Business Profile for launch.",
    ],
    relatedLinks: [
      {
        title: "Local SEO",
        description:
          "Improve local visibility, service-area relevance, and Google Business Profile signals.",
        path: "/local-seo",
      },
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead pathways.",
        path: "/business-seo",
      },
    ],
    directPath: "/tools/local-seo-checklist",
  },
  {
    toolType: "redirect",
    slug: "redirect-mapping-generator",
    contentKey: "redirect",
    badge: "Free Migration SEO Tool",
    title: "Redirect Mapping Generator",
    pageTitle: "Free Redirect Mapping Generator",
    metaTitle: "Free Redirect Mapping Generator | RankVelt",
    metaDescription:
      "Build old-to-new URL redirect maps and generate CSV, Apache, or Nginx rules with RankVelt's free redirect mapping generator.",
    shortDescription:
      "Map old URLs to new ones and export redirect rules.",
    intro:
      "Paste your old and new URLs to build a clean redirect map, then export CSV, Apache, or Nginx rules for your migration.",
    guideTitle: "Keep Rankings Through Every Migration",
    guideText:
      "Every URL that changes without a redirect leaks authority. Map each old URL to its closest new destination before launch, then test every rule after deployment.",
    bestFor: [
      "Site owners planning a redesign or replatform.",
      "SEOs managing domain or URL structure migrations.",
      "Agencies handling client site launches.",
      "Shopify merchants cleaning up legacy URLs.",
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build stronger service pages, technical foundations, and organic lead pathways.",
        path: "/business-seo",
      },
      {
        title: "eCommerce SEO",
        description:
          "Improve product discovery, collection structure, and qualified organic traffic.",
        path: "/ecommerce-seo",
      },
    ],
    directPath: "/tools/redirect-mapping-generator",
  },
];

const getIcon = (
  toolType: ToolType,
  className = "h-5 w-5",
): ReactNode => {
  switch (toolType) {
    case "calculator":
      return <Calculator className={className} />;

    case "policy":
      return <ShieldCheck className={className} />;

    case "detector":
      return <Layout className={className} />;

    case "guest-post":
      return <Search className={className} />;

    case "meta-checker":
      return <Search className={className} />;

    case "schema":
      return <Layout className={className} />;

    case "robots":
      return <ShieldCheck className={className} />;

    case "sitemap":
      return <Target className={className} />;

    case "seo-checklist":
      return <CheckCircle2 className={className} />;

    case "redirect":
      return <ArrowRight className={className} />;

    case "generator":
    default:
      return <ShoppingBag className={className} />;
  }
};

const getIconClass = (toolType: ToolType) => {
  switch (toolType) {
    case "calculator":
      return "text-yellow-400";

    case "policy":
      return "text-emerald-400";

    case "detector":
      return "text-blue-400";

    case "guest-post":
      return "text-purple-400";

    case "meta-checker":
      return "text-cyan-400";

    case "schema":
      return "text-orange-400";

    case "robots":
      return "text-red-400";

    case "sitemap":
      return "text-teal-400";

    case "seo-checklist":
      return "text-lime-400";

    case "redirect":
      return "text-amber-400";

    case "generator":
    default:
      return "text-primary";
  }
};

const ensureMetaByName = (name: string) => {
  let element = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
};

const ensureMetaByProperty = (property: string) => {
  let element = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  return element;
};

const ToolsPage = () => {
  const { toolName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTool, setActiveTool] = useState<ToolType>("generator");
  const toolRef = useRef<HTMLDivElement>(null);

  const queryTool = searchParams.get("tool") || "";
  const isHubPage = !toolName && !queryTool;

  const selectedTool = useMemo(() => {
    return (
      tools.find((tool) => tool.toolType === activeTool) ||
      tools.find((tool) => tool.toolType === "generator")!
    );
  }, [activeTool]);

  const selectedToolContent =
    toolJson[selectedTool.contentKey] || {
      title: "",
      description: "",
      features: [],
      faqs: [],
    };

  useEffect(() => {
    const rawTool = toolName || queryTool;
    const mappedTool = rawTool ? toolMapping[rawTool] : undefined;

    if (mappedTool) {
      setActiveTool(mappedTool);

      const timer = window.setTimeout(() => {
        toolRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (toolName) {
      navigate("/tools", { replace: true });
      return;
    }

    setActiveTool("generator");
  }, [toolName, queryTool, navigate]);

  useEffect(() => {
    const pageTitle = isHubPage
      ? "Free SEO, eCommerce & Business Tools | RankVelt"
      : selectedTool.metaTitle;

    const pageDescription = isHubPage
      ? "Use RankVelt's free SEO, eCommerce, and business tools: profit margin calculator, policy generator, Shopify theme detector, business name generator, and outreach finder."
      : selectedTool.metaDescription;

    const canonicalPath = isHubPage
      ? "/tools"
      : `/tools/${selectedTool.slug}`;

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:card").content = "summary_large_image";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:url").content = `${SITE_URL}${canonicalPath}`;
    ensureMetaByProperty("og:type").content = "website";

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}${canonicalPath}`;

    document.getElementById("rankvelt-tool-schema")?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-tool-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: isHubPage ? "RankVelt Free Tools" : selectedTool.title,
          url: `${SITE_URL}${canonicalPath}`,
          description: pageDescription,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          publisher: {
            "@type": "Organization",
            name: "RankVelt",
            url: SITE_URL,
          },
        },
        ...(!isHubPage && selectedToolContent.faqs.length
          ? [
              {
                "@type": "FAQPage",
                mainEntity: selectedToolContent.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.a,
                  },
                })),
              },
            ]
          : []),
      ],
    });

    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, [isHubPage, selectedTool, selectedToolContent.faqs]);

  const handleToolClick = (tool: ToolConfig) => {
    setActiveTool(tool.toolType);
    navigate(`/tools/${tool.slug}`);

    window.setTimeout(() => {
      toolRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case "calculator":
        return <ProfitCalculator />;

      case "policy":
        return <PolicyGenerator />;

      case "detector":
        return <ThemeDetector />;

        case "guest-post":
        return <GuestPostFinder />;

      case "generator":
      default:
        return <NameGenerator />;
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.08] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <section className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free RankVelt Tools
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            {isHubPage ? (
              <>
                Free Tools for{" "}
                <span className="text-gradient-gold">Smarter Decisions</span>
              </>
            ) : (
              selectedTool.pageTitle
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            {isHubPage
              ? "Practical free tools for eCommerce brands, local businesses, service companies, and founders who need stronger research, planning, and next-step decisions."
              : selectedTool.intro}
          </p>
        </section>

        {!isHubPage && (
          <>
        <section ref={toolRef} className="mt-12 scroll-mt-32">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 ${getIconClass(
                  selectedTool.toolType,
                )}`}
              >
                {getIcon(selectedTool.toolType)}
              </span>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-primary">
                  {selectedTool.badge}
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  {selectedTool.title}
                </h2>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-300">
              <CheckCircle2 size={13} />
              Ready to use
            </span>
          </div>

          <div className="rounded-[2rem] border border-white/[0.08] bg-black/20 p-3 sm:p-5">
            {renderActiveTool()}
          </div>
        </section>
          </>
        )}

        {!isHubPage && (
          <>
        <section className="mt-14 border-y border-white/[0.08] py-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Tool Guide
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                {selectedTool.guideTitle}
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                {selectedTool.guideText}
              </p>
            </div>

            <aside className="border-l border-primary/25 pl-6 sm:pl-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target size={19} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-white">
                Best Used For
              </h2>

              <ul className="mt-5 space-y-3">
                {selectedTool.bestFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/65"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
          </>
        )}

        <section className="mt-12">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Choose a Tool
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                {isHubPage
                  ? "Useful Tools for Website and Business Planning"
                  : "Explore More Free Tools"}
              </h2>
            </div>

            <p className="text-xs text-white/40">{tools.length} free tools available</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool) => {
              const isActive = activeTool === tool.toolType;

              const cardClassName = `rounded-2xl border p-5 text-left transition-all ${
                isActive
                  ? "border-primary/45 bg-primary/[0.08]"
                  : "border-white/[0.08] bg-white/[0.025] hover:border-primary/30 hover:bg-white/[0.04]"
              }`;

              const cardInner = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-black/25 ${getIconClass(
                        tool.toolType,
                      )}`}
                    >
                      {getIcon(tool.toolType)}
                    </span>

                    {isActive && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-lg font-black leading-tight text-white">
                    {tool.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-white/55">
                    {tool.shortDescription}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-black text-primary">
                    Open tool
                    <ArrowRight size={14} />
                  </span>
                </>
              );

              if (tool.directPath) {
                return (
                  <Link
                    key={tool.toolType}
                    to={tool.directPath}
                    className={cardClassName}
                  >
                    {cardInner}
                  </Link>
                );
              }

              return (
                <button
                  key={tool.toolType}
                  type="button"
                  onClick={() => handleToolClick(tool)}
                  className={cardClassName}
                >
                  {cardInner}
                </button>
              );
            })}
          </div>
        </section>

        {isHubPage && (
          <section className="mt-14 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Why Use These Tools
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Free Tools Built for Real Work
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
              Every tool above is free and runs directly in your browser:
              estimate product margins, draft website policies, research
              Shopify themes, brainstorm business names, find guest-post
              outreach targets, check meta titles, generate schema markup,
              build robots.txt and XML sitemaps, score your local SEO, and
              map redirects. Each tool page includes a practical guide so
              you know exactly what to do with the result.
            </p>
          </section>
        )}

        <section className="mt-14 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Continue Your Research
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Related RankVelt Resources
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Use the tool for a practical starting point, then explore a
                relevant SEO, Shopify, website, or growth resource below.
              </p>
            </div>

            <Link
              to="/strategy-call?package=Free%20SEO%20Opportunity%20Check"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02]"
            >
              Request a Free SEO Check
              <ExternalLink size={15} />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {selectedTool.relatedLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="group rounded-2xl border border-white/[0.08] bg-black/20 p-5 transition-all hover:border-primary/35 hover:bg-primary/[0.04]"
              >
                <h3 className="text-lg font-black text-white transition-colors group-hover:text-primary">
                  {link.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {link.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                  Explore resource
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ToolsPage;