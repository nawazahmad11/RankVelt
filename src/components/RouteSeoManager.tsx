import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { blogPosts } from "@/data/blogData";
import { caseStudies } from "@/data/caseStudyData";

const SITE_URL = "https://rankvelt.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;

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
    title: "Local SEO Services for Local Businesses | RankVelt",
    description:
      "RankVelt provides Local SEO services for businesses that want stronger Google Maps visibility, local search rankings, service-area traffic, calls, and qualified leads.",
  },

  "/ecommerce-seo": {
    title: "eCommerce SEO Services for Shopify Stores | RankVelt",
    description:
      "RankVelt provides eCommerce SEO services for Shopify stores and online brands that need stronger product discovery, collection-page visibility, technical SEO, and organic sales growth.",
  },

  "/business-seo": {
    title: "Business SEO Services for Organic Lead Generation | RankVelt",
    description:
      "RankVelt provides Business SEO services for service companies, consultants, agencies, and growing businesses that need stronger website visibility, qualified traffic, and organic leads.",
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
      routeMeta = staticPageMeta["/tools"];
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