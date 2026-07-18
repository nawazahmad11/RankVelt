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

const SITE_URL = "https://rankvelt.com";

type ToolType = "calculator" | "policy" | "detector" | "generator";

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
      "Use RankVelt's free eCommerce profit margin calculator to estimate selling margin, product profit, direct costs, advertising costs, fees, and break-even pricing direction.",
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
      "Generate starter privacy, refund, and terms-policy content for websites, Shopify stores, eCommerce brands, and local businesses with RankVelt's free policy generator.",
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
    metaTitle: "Shopify Theme Detector Tool | RankVelt",
    metaDescription:
      "Use RankVelt's free Shopify Theme Detector to check public storefront signals and identify the likely Shopify theme setup behind a public eCommerce store.",
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
      ? "Free eCommerce & Business Tools | RankVelt"
      : selectedTool.metaTitle;

    const pageDescription = isHubPage
      ? "Use RankVelt's free eCommerce and business tools for product-profit planning, policy drafts, Shopify theme research, and business-name ideas."
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
          name: selectedTool.title,
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

        <section className="mt-12">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Choose a Tool
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Useful Tools for Website and Business Planning
              </h2>
            </div>

            <p className="text-xs text-white/40">4 free tools available</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool) => {
              const isActive = activeTool === tool.toolType;

              return (
                <button
                  key={tool.toolType}
                  type="button"
                  onClick={() => handleToolClick(tool)}
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    isActive
                      ? "border-primary/45 bg-primary/[0.08]"
                      : "border-white/[0.08] bg-white/[0.025] hover:border-primary/30 hover:bg-white/[0.04]"
                  }`}
                >
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
                </button>
              );
            })}
          </div>
        </section>

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