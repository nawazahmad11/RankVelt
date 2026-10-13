import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { blogPosts } from "@/data/blogData";
import { caseStudies } from "@/data/caseStudyData";

const SITE_URL = "https://www.rankvelt.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;

// Every valid /tools/ slug: the 21 hub tools plus the short aliases that
// Tools.tsx maps to the same tools. Unknown slugs must not inherit the
// tools hub meta, they fall through to the Page Not Found meta below.
const KNOWN_TOOL_SLUGS = new Set([
  "profit-margin-calculator",
  "legal-policy-generator",
  "shopify-theme-detector",
  "business-name-generator",
  "guest-post-finder",
  "bulk-redirect-generator",
  "open-graph-preview",
  "robots-txt-generator",
  "title-tag-preview",
  "bulk-email-extractor",
  "meta-title-description-checker",
  "schema-markup-generator",
  "xml-sitemap-generator",
  "local-seo-checklist",
  "redirect-mapping-generator",
  "bulk-broken-link-checker",
  "bulk-http-status-checker",
  "ssl-checker",
  "utm-builder",
  "website-speed-test",
  "aeo-readiness-checker",
  "calculator",
  "policy",
  "policy-generator",
  "detector",
  "theme-detector",
  "generator",
  "name-generator",
  "guest-post",
  "email-extractor",
]);

type RouteMeta = {
  title: string;
  description: string;
  robots?: string;
  image?: string;
  type?: "website" | "article";
};

const staticPageMeta: Record<string, RouteMeta> = {
  "/": {
    title: "RankVelt | SEO Services for Local Businesses & eCommerce Brands",
    description:
      "RankVelt helps local businesses, eCommerce brands, and growing companies improve Google visibility with Local SEO, eCommerce SEO, Business SEO, and search-ready websites.",
  },

  "/local-seo": {
    title: "Local SEO Services for More Local Leads | RankVelt",
    description:
      "RankVelt provides local SEO services for stronger Google Maps visibility, local rankings, service-area traffic, calls, bookings and qualified leads.",
  },

  "/ecommerce-seo": {
    title: "eCommerce SEO Company for Shopify Stores | RankVelt",
    description:
      "RankVelt is an eCommerce SEO company for Shopify stores, improving product discovery, collection visibility, technical SEO and organic sales.",
  },

  "/business-seo": {
    title: "Business SEO Services for Organic Leads | RankVelt",
    description:
      "RankVelt provides business SEO services for companies, consultants and agencies that need qualified organic traffic, stronger service pages and leads.",
  },

  "/ai-seo-agency": {
    title: "AI SEO Agency: AI-First Search Visibility | RankVelt",
    description:
      "RankVelt is an AI-first SEO agency helping brands get cited in AI Overviews, ChatGPT and Perplexity with AEO, GEO and technical SEO built for AI search.",
  },

  "/hire-seo-expert": {
    title: "Hire SEO Expert: Vetted Agency Specialist | RankVelt",
    description:
      "Hire an SEO expert from RankVelt and skip the marketplace gamble. Vetted agency specialists with AI search and GEO expertise, from $525/month.",
  },

  "/ecommerce-seo-services": {
    title: "eCommerce SEO Services for Online Stores | RankVelt",
    description:
      "RankVelt offers ecommerce SEO services for online stores: AI search optimisation, product discovery, technical SEO and content that turns searches into sales.",
  },

  "/shopify-seo-services": {
    title: "Shopify SEO Services for AI-Ready Stores | RankVelt",
    description:
      "RankVelt's Shopify SEO services make stores AI-search ready: technical audits, product discovery, collection SEO and content for ChatGPT and Perplexity.",
  },

  "/seo-audit-services": {
    title: "SEO Audit Services That Find Growth Blocks | RankVelt",
    description:
      "RankVelt provides SEO audit services covering technical SEO, content and AI search visibility, so you know what blocks rankings, citations and leads.",
  },

  "/local-seo/dentists": {
  title: "Dental SEO Services | Local SEO for Dentists | RankVelt",
  description:
    "RankVelt provides dental SEO services that improve Google Maps visibility, local rankings, citations, reviews and patient enquiries for dental practices.",
  },
  "/local-seo/plumbers": {
  title: "Plumbing SEO Services | Local SEO for Plumbers | RankVelt",
  description:
    "RankVelt provides plumbing SEO services that improve Google Maps visibility, local rankings, citations, reviews and call volume for plumbing companies.",
},

"/local-seo/electricians": {
  title: "Electrician SEO Services | Local SEO for Electricians | RankVelt",
  description:
    "RankVelt provides electrician SEO services that improve Google Maps visibility, local rankings, citations, reviews and call volume for electrical contractors.",
},
"/local-seo/hvac": {
  title: "HVAC SEO Services | Local SEO for Heating & Cooling | RankVelt",
  description:
    "RankVelt provides HVAC SEO services that improve Google Maps visibility, local rankings, citations, reviews and call volume for heating and cooling companies.",
},

"/local-seo/lawyers": {
  title: "Law Firm SEO Services | Local SEO for Lawyers | RankVelt",
  description:
    "RankVelt provides law firm SEO services that improve Google Maps visibility, local rankings, citations, reviews and qualified enquiries for legal practices.",
},




  "/blog": {
    title: "RankVelt Insights | SEO, eCommerce & Website Growth",
    description:
      "Practical RankVelt insights on SEO, Shopify growth, eCommerce performance, technical SEO, website structure, and conversion-focused design.",
  },

  "/case-studies": {
    title: "Website & eCommerce Case Studies | RankVelt",
    description:
      "Explore RankVelt website and eCommerce project showcases focused on product discovery, mobile UX, Shopify structure, visual storytelling, and conversion-ready customer journeys.",
  },

  "/tools": {
    title: "Free eCommerce & Business Tools | RankVelt",
    description:
      "Use RankVelt's free tools for profit margin planning, policy generation, Shopify theme research, and business-name ideas.",
  },

  "/tools/profit-margin-calculator": {
    title: "Free Profit Margin Calculator for eCommerce | RankVelt",
    description:
      "Calculate product profit, costs, margin direction, and potential break-even information with RankVelt's free eCommerce profit margin calculator.",
  },

  "/tools/legal-policy-generator": {
    title: "Free Legal Policy Generator for Websites | RankVelt",
    description:
      "Generate starter privacy policy, refund policy, and terms content for a business website with RankVelt's free policy generator.",
  },

  "/tools/shopify-theme-detector": {
    title: "Shopify Theme Detector Tool | RankVelt",
    description:
      "Use RankVelt's Shopify Theme Detector to check public storefront signals and identify the likely theme setup behind a Shopify store.",
  },

  "/tools/business-name-generator": {
    title: "Free Business Name Generator | RankVelt",
    description:
      "Generate business-name ideas for eCommerce stores, local businesses, and growing brands with RankVelt's free business name generator.",
  },

  "/tools/bulk-email-extractor": {
    title: "Free Bulk Email Extractor for Websites | RankVelt",
    description:
      "Extract public contact emails from a list of websites straight into Google Sheets. Free extractor powered by GitHub Actions, no paid APIs.",
  },

  "/tools/bulk-redirect-generator": {
    title: "Free Bulk Redirect Generator: 301/302 Rules for Apache & Nginx",
    description:
      "Generate bulk 301 or 302 redirect rules in seconds. Paste old and new URLs, get Apache .htaccess, Nginx, or Cloudflare output. Free, runs in your browser.",
  },

  "/tools/open-graph-preview": {
    title: "Open Graph Checker & Social Preview Tool | RankVelt",
    description:
      "Test Open Graph tags free: preview Facebook, X and LinkedIn link cards, check og:image sizes, catch missing tags, and copy the exact HTML to fix them.",
  },

  "/tools/robots-txt-generator": {
    title: "Free Robots.txt Generator | RankVelt",
    description:
      "Build a valid robots.txt file in seconds. Add user-agent rules, allow and disallow paths, sitemap URL, and crawl delay with live preview. Free, no signup.",
  },

  "/tools/title-tag-preview": {
    title: "Title Tag Preview Tool: Free SERP Snippet Simulator",
    description:
      "Preview your title tag and meta description as Google shows them. Free SERP snippet tool: pixel widths, desktop and mobile views, copy-ready HTML tags.",
  },

  "/tools/bulk-broken-link-checker": {
    title: "Free Broken Link Checker for Websites | RankVelt",
    description:
      "Crawl your website free and find every broken link: internal and external links, status codes, and the pages they appear on. No signup.",
  },

  "/tools/bulk-http-status-checker": {
    title: "Bulk HTTP Status Checker: URL & Redirect Chain Tool",
    description:
      "Check up to 100 URLs at once: status codes, redirect chains, final URLs, and response times. Free bulk HTTP status checker, no signup needed.",
  },

  "/tools/ssl-checker": {
    title: "Free SSL Checker: Certificate Expiry & Validity | RankVelt",
    description:
      "Check any domain's SSL certificate free: expiration date, days remaining, issuer, validity, and hostname match. No signup required.",
  },

  "/tools/utm-builder": {
    title: "Free UTM Builder: Campaign URL Builder | RankVelt",
    description:
      "Build UTM campaign URLs in seconds with presets and bulk mode. Free UTM builder for Google Analytics, ads, social, and email campaigns.",
  },

  "/tools/website-speed-test": {
    title: "Free Website Speed Test: Core Web Vitals Checker | RankVelt",
    description:
      "Test any website speed free: performance score, Core Web Vitals, and the fixes that matter most. Mobile and desktop results, no signup.",
  },

  "/tools/aeo-readiness-checker": {
    title: "Free AEO Readiness Checker: AI Answer Visibility Score | RankVelt",
    description:
      "Check how ready any page is for AI answers: structure, schema, questions, and citable content scored free. No signup required.",
  },

  "/privacy-policy": {
    title: "Privacy Policy | RankVelt",
    description:
      "Read RankVelt's privacy policy and learn how website enquiry and contact information may be collected and used.",
  },

  "/terms-of-service": {
    title: "Terms and Conditions | RankVelt",
    description:
      "Read RankVelt's terms and conditions for SEO, website design, Shopify support, and digital growth services.",
  },

  "/refund-policy": {
    title: "Refund and Cancellation Policy | RankVelt",
    description:
      "Read RankVelt's refund and cancellation policy for SEO, website design, Shopify, and digital growth services.",
  },

  "/services/custom-liquid-development": {
    title: "Custom Shopify Liquid Development Services | RankVelt",
    description:
      "RankVelt provides custom Shopify Liquid development for eCommerce brands that need flexible, SEO-ready storefront sections, product templates, collection pages, and better customer journeys.",
  },

  "/services/mobile-first-ux": {
    title: "Mobile UX Optimisation for Shopify Stores | RankVelt",
    description:
      "RankVelt improves Shopify mobile UX through clearer product discovery, responsive layouts, mobile calls to action, faster journeys, and conversion-focused eCommerce design.",
  },

  "/services/visual-storytelling": {
    title: "Shopify Landing Page and Visual Storytelling Services | RankVelt",
    description:
      "RankVelt creates Shopify landing pages and visual storytelling systems that improve product education, brand clarity, search-focused content structure, and conversion-ready customer journeys.",
  },

  "/services/app-api-sync": {
    title: "Shopify App and API Integration Services | RankVelt",
    description:
      "RankVelt provides Shopify app and API integration support for stores that need reliable data flows, CRM connections, inventory sync, tracking setup, and scalable operations.",
  },

  "/services/checkout-flow": {
    title: "Shopify Cart and Checkout Optimisation Services | RankVelt",
    description:
      "RankVelt improves Shopify cart and checkout journeys through clearer product actions, shipping information, trust signals, mobile usability, and conversion-focused UX.",
  },
};

const noIndexMeta: Record<string, RouteMeta> = {
  "/strategy-call": {
    title: "Request a Strategy Call | RankVelt",
    description:
      "Submit your RankVelt SEO, website, Shopify, or growth-service request.",
    robots: "noindex, nofollow",
  },

  "/thank-you": {
    title: "Request Received | RankVelt",
    description: "Your RankVelt request has been received.",
    robots: "noindex, nofollow",
  },

  "/funnel/step1": {
    title: "RankVelt | SEO Services for Local Businesses & eCommerce Brands",
    description:
      "RankVelt helps local businesses, eCommerce brands, and growing companies improve Google visibility and website performance.",
    robots: "noindex, follow",
  },
};

const normalisePath = (pathname: string) => {
  if (pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "");
};

const getPlainText = (content?: string) => {
  if (!content) {
    return "";
  }

  return content
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const toAbsoluteImageUrl = (image?: string) => {
  if (!image) {
    return DEFAULT_OG_IMAGE;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

const setMetaByName = (name: string, content: string) => {
  let element = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  element.content = content;
};

const setMetaByProperty = (property: string, content: string) => {
  let element = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  element.content = content;
};

const setCanonical = (canonicalUrl: string) => {
  let canonical = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = canonicalUrl;
};

const RouteSeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = normalisePath(location.pathname);

    let routeMeta: RouteMeta | undefined =
      noIndexMeta[pathname] || staticPageMeta[pathname];

    if (!routeMeta && pathname.startsWith("/blog/")) {
      const articleId = decodeURIComponent(pathname.replace("/blog/", ""));

      const article = blogPosts.find((post) => post.id === articleId);

      if (article) {
        const articleDescription = getPlainText(article.content)
          .slice(0, 155)
          .trim();

        routeMeta = {
          title: `${article.title} | RankVelt Insights`,
          description:
            articleDescription ||
            `Read RankVelt's practical guide: ${article.title}`,
          image: article.image,
          type: "article",
        };
      }
    }

    if (!routeMeta && pathname.startsWith("/case-studies/")) {
      const projectId = decodeURIComponent(
        pathname.replace("/case-studies/", ""),
      );

      const project = caseStudies.find((item) => item.id === projectId);

      if (project) {
        routeMeta = {
          title: `${project.title} | Website & eCommerce Case Study | RankVelt`,
          description: `${project.subtitle}. Explore this RankVelt website project showcase focused on ${project.category.toLowerCase()}, user experience, product discovery, and growth-ready structure.`,
          image: project.image,
        };
      }
    }

    if (!routeMeta && pathname.startsWith("/tools/")) {
      const toolSlug = pathname.replace("/tools/", "");

      if (KNOWN_TOOL_SLUGS.has(toolSlug)) {
        routeMeta = staticPageMeta["/tools"];
      }
    }

    if (!routeMeta) {
      routeMeta = {
        title: "Page Not Found | RankVelt",
        description: "The requested RankVelt page could not be found.",
        robots: "noindex, nofollow",
      };
    }

    const robots = routeMeta.robots || "index, follow";
    const canonicalUrl = `${SITE_URL}${pathname}`;
    const imageUrl = toAbsoluteImageUrl(routeMeta.image);

    document.title = routeMeta.title;

    setCanonical(canonicalUrl);

    setMetaByName("description", routeMeta.description);
    setMetaByName("robots", robots);
    setMetaByName("googlebot", robots);
    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", routeMeta.title);
    setMetaByName("twitter:description", routeMeta.description);
    setMetaByName("twitter:image", imageUrl);

    setMetaByProperty("og:title", routeMeta.title);
    setMetaByProperty("og:description", routeMeta.description);
    setMetaByProperty("og:url", canonicalUrl);
    setMetaByProperty("og:image", imageUrl);
    setMetaByProperty("og:site_name", "RankVelt");
    setMetaByProperty("og:type", routeMeta.type || "website");
  }, [location.pathname]);

  return null;
};

export default RouteSeoManager;