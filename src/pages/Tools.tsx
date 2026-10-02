// TOOLS-VERSION-21
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
  Bot,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Gauge,
  Activity,
  Layout,
  Link2,
  Lock,
  MailSearch,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  Unlink,
} from "lucide-react";

import NameGenerator from "../components/Tools/NameGenerator";
import ThemeDetector from "../components/Tools/ThemeDetector";
import ProfitCalculator from "../components/Tools/ProfitCalculator";
import PolicyGenerator from "../components/Tools/PolicyGenerator";

import toolContentJson from "../data/tool-content.json";

import GuestPostFinder from "../components/Tools/GuestPostFinder";

import NotFound from "./NotFound";

const SITE_URL = "https://rankvelt.com";

type ToolType =
  | "calculator"
  | "policy"
  | "detector"
  | "generator"
  | "guest-post"
  | "redirect"
  | "opengraph"
  | "robots"
  | "serp"
  | "email-extractor"
  | "meta-title"
  | "schema"
  | "sitemap"
  | "local-seo"
  | "redirect-map"
  | "broken-link"
  | "http-status"
  | "ssl"
  | "speed"
  | "aeo"
  | "utm";

type ToolFaq = {
  q: string;
  a: string;
};

type ToolArticleSection = {
  heading: string;
  paragraphs: string[];
};

type ToolArticle = {
  sections: ToolArticleSection[];
};

type ToolJsonContent = {
  title: string;
  description: string;
  features: {
    title: string;
    detail: string;
  }[];
  faqs: ToolFaq[];
  article?: ToolArticle;
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
  standalone?: boolean;
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

  "bulk-email-extractor": "email-extractor",
  "email-extractor": "email-extractor",

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
    toolType: "redirect",
    slug: "bulk-redirect-generator",
    contentKey: "redirect-generator",
    badge: "Free Bulk Redirect Tool",
    title: "Bulk Redirect Generator",
    pageTitle: "Free Bulk Redirect Generator",
    metaTitle: "Free Bulk Redirect Generator: 301/302 Rules for Apache & Nginx",
    metaDescription:
      "Generate bulk 301 or 302 redirect rules in seconds. Paste old and new URLs, get Apache .htaccess, Nginx, or Cloudflare output. Free, runs in your browser.",
    shortDescription:
      "Generate bulk 301/302 redirect rules for Apache, Nginx, and Cloudflare.",
    intro:
      "Paste your old and new URLs to generate ready-to-use 301 or 302 redirect rules for Apache .htaccess, Nginx, or Cloudflare. Free, runs entirely in your browser, no signup needed.",
    guideTitle: "Map Every Old URL to Its New Home",
    guideText:
      "Site migrations, redesigns, and domain moves create redirect work that is easy to get wrong. Generate the full rule set here, validate each row before launch, and keep the 301s in place long enough for Google to pass ranking signals to the new URLs.",
    bestFor: [
      "Website migrations and domain moves with hundreds of URLs.",
      "Redesigns where page slugs change across the site.",
      "Cleaning up old campaign or deleted product URLs.",
      "Agencies preparing redirect maps for client launches.",
    ],
    relatedLinks: [
      {
        title: "XML Sitemap Generator",
        description:
          "Generate a fresh sitemap for the new URL structure after your redirects go live.",
        path: "/tools/xml-sitemap-generator",
      },
      {
        title: "Business SEO",
        description:
          "Plan the full technical migration with redirects, sitemaps, and on-page SEO.",
        path: "/business-seo",
      },
    ],
    standalone: true,
  },
  {
    toolType: "opengraph",
    slug: "open-graph-preview",
    contentKey: "open-graph-preview",
    badge: "Free Social Preview Tool",
    title: "Open Graph Preview",
    pageTitle: "Free Open Graph Checker & Preview Tool",
    metaTitle: "Open Graph Checker & Social Preview Tool | RankVelt",
    metaDescription:
      "Test Open Graph tags free: preview Facebook, X and LinkedIn link cards, check og:image sizes, catch missing tags, and copy the exact HTML to fix them.",
    shortDescription:
      "Preview Facebook, X, and LinkedIn link cards and validate OG tags.",
    intro:
      "Enter your Open Graph tags to see exactly how your page will look when shared on Facebook, X, and LinkedIn. Catch missing tags, image problems, and length issues before you publish.",
    guideTitle: "Make Every Shared Link Look Its Best",
    guideText:
      "Social platforms decide how your link looks from your Open Graph tags alone. A missing og:image or a cropped title costs clicks on every share. Test the tags here, copy the corrected HTML, and ship previews that earn the click.",
    bestFor: [
      "Bloggers and content teams checking previews before publishing.",
      "eCommerce brands sharing product pages on social.",
      "Agencies auditing client sites for social readiness.",
      "Anyone debugging a wrong image or stale link preview.",
    ],
    relatedLinks: [
      {
        title: "Meta Title Checker",
        description:
          "Check any live page for missing or overlong titles and meta descriptions.",
        path: "/tools/meta-title-description-checker",
      },
      {
        title: "Title Tag Preview",
        description:
          "Preview how the same page appears in Google search results.",
        path: "/tools/title-tag-preview",
      },
    ],
    standalone: true,
  },
  {
    toolType: "robots",
    slug: "robots-txt-generator",
    contentKey: "robots-txt-generator",
    badge: "Free Technical SEO Tool",
    title: "Robots.txt Generator",
    pageTitle: "Free Robots.txt Generator",
    metaTitle: "Free Robots.txt Generator | RankVelt",
    metaDescription:
      "Build a valid robots.txt file in seconds. Add user-agent rules, allow and disallow paths, sitemap URL, and crawl delay with live preview. Free, no signup.",
    shortDescription:
      "Build a valid robots.txt with rules, sitemap, and AI crawler controls.",
    intro:
      "Create a valid robots.txt file in seconds with per-crawler rules, allow and disallow paths, your sitemap URL, and one-click AI crawler blocking. Live preview and validation included.",
    guideTitle: "Tell Crawlers Exactly Where They Can Go",
    guideText:
      "A robots.txt file is the first thing search crawlers read. One wrong Disallow can remove your whole site from Google, while a missing sitemap line slows down discovery. Build the file here, review the warnings, and upload it to your domain root.",
    bestFor: [
      "New websites preparing for their first Google crawl.",
      "WordPress and Shopify sites with admin or staging areas to block.",
      "Sites that want AI training crawlers blocked from content.",
      "Agencies setting up technical foundations for clients.",
    ],
    relatedLinks: [
      {
        title: "XML Sitemap Generator",
        description:
          "Generate the sitemap URL that your robots.txt file should reference.",
        path: "/tools/xml-sitemap-generator",
      },
      {
        title: "Bulk Redirect Generator",
        description:
          "Handle URL changes safely during migrations alongside robots rules.",
        path: "/tools/bulk-redirect-generator",
      },
    ],
    standalone: true,
  },
  {
    toolType: "serp",
    slug: "title-tag-preview",
    contentKey: "title-tag-preview",
    badge: "Free SERP Preview Tool",
    title: "Title Tag Preview",
    pageTitle: "Free Title Tag Preview Tool",
    metaTitle: "Title Tag Preview Tool: Free SERP Snippet Simulator",
    metaDescription:
      "Preview your title tag and meta description as Google shows them. Free SERP snippet tool: pixel widths, desktop and mobile views, copy-ready HTML tags.",
    shortDescription:
      "Preview Google snippets with pixel-accurate desktop and mobile views.",
    intro:
      "Type your title tag and meta description to see exactly how Google will display them on desktop and mobile, with pixel-width measurement and copy-ready HTML.",
    guideTitle: "Write Snippets That Earn the Click",
    guideText:
      "Google truncates titles by pixel width, not character count. Preview your snippet here to stay inside the limits, keep your keyword visible, and write descriptions that persuade before you publish.",
    bestFor: [
      "SEO writers optimising titles and descriptions before publishing.",
      "eCommerce brands improving product-page click-through rates.",
      "Agencies preparing on-page recommendations for clients.",
      "Bloggers checking how posts appear in Google results.",
    ],
    relatedLinks: [
      {
        title: "Meta Title Checker",
        description:
          "Check any live page for missing or overlong titles and meta descriptions.",
        path: "/tools/meta-title-description-checker",
      },
      {
        title: "Open Graph Preview",
        description:
          "Preview how the same page looks when shared on social media.",
        path: "/tools/open-graph-preview",
      },
    ],
    standalone: true,
  },
  {
    toolType: "email-extractor",
    slug: "bulk-email-extractor",
    contentKey: "bulk-email-extractor",
    badge: "Free Lead Research Tool",
    title: "Bulk Email Extractor",
    pageTitle: "Free Bulk Email Extractor for Websites",
    metaTitle: "Free Bulk Email Extractor for Websites | RankVelt",
    metaDescription:
      "Extract public contact emails from a list of websites straight into Google Sheets. Free extractor powered by GitHub Actions, no paid APIs.",
    shortDescription:
      "Pull public contact emails from a list of websites into a Google Sheet.",
    intro:
      "Paste a Google Sheet link with your website list, and the extractor checks each site's homepage, contact, and about pages for public email addresses. Results are written back into your sheet automatically.",
    guideTitle: "Build Your Outreach List Faster",
    guideText:
      "Manually hunting for contact emails across hundreds of websites takes hours. This tool automates the repetitive part: it visits the pages where businesses normally publish contact details and collects what is publicly listed, so you can focus on the outreach itself.",
    bestFor: [
      "Agencies building prospect lists for outreach campaigns.",
      "Freelancers finding contact emails of local businesses.",
      "Link builders collecting outreach targets at scale.",
      "Founders researching partners, vendors, or directories.",
    ],
    relatedLinks: [
      {
        title: "Guest Post Finder",
        description:
          "Find guest posting opportunities and outreach emails fast.",
        path: "/tools/guest-post-finder",
      },
      {
        title: "Bulk Redirect Generator",
        description:
          "Generate bulk 301/302 redirect rules for Apache, Nginx, and Cloudflare.",
        path: "/tools/bulk-redirect-generator",
      },
    ],
    standalone: true,
  },
  {
    toolType: "meta-title",
    slug: "meta-title-description-checker",
    contentKey: "meta-title-checker",
    badge: "Free SEO Tool",
    title: "Meta Title Checker",
    pageTitle: "Free Meta Title Checker",
    metaTitle: "Free Meta Title Checker | RankVelt",
    metaDescription:
      "Check your meta title and description length, preview the SERP snippet, and fix truncation issues.",
    shortDescription:
      "Check meta title and description length with a live SERP preview.",
    intro:
      "Paste your title and meta description to see exactly how they will look in Google search results, including pixel-based truncation warnings.",
    guideTitle: "Fix Truncation Before You Publish",
    guideText:
      "Titles that get cut off in search results lose clicks. This tool measures your title in pixels, the same way Google does, so you can adjust before publishing.",
    bestFor: [
      "Bloggers and SEOs writing click-worthy titles.",
      "Store owners fixing product page snippets.",
    ],
    relatedLinks: [
      {
        title: "Title Tag Preview",
        description: "Preview Google snippets with pixel-accurate desktop and mobile views.",
        path: "/tools/title-tag-preview",
      },
    ],
    standalone: true,
  },
  {
    toolType: "schema",
    slug: "schema-markup-generator",
    contentKey: "schema-generator",
    badge: "Free SEO Tool",
    title: "Schema Generator",
    pageTitle: "Free Schema Markup Generator",
    metaTitle: "Free Schema Markup Generator | RankVelt",
    metaDescription:
      "Generate valid JSON-LD schema markup for your pages: articles, products, FAQs, local business, and more.",
    shortDescription:
      "Generate valid JSON-LD schema markup for rich results.",
    intro:
      "Fill in the fields for your content type and get clean JSON-LD schema markup ready to paste into your page.",
    guideTitle: "Qualify for Rich Results",
    guideText:
      "Schema markup helps search engines understand your pages and can unlock rich results like FAQs, reviews, and product info in the SERP.",
    bestFor: [
      "SEOs adding structured data without writing code.",
      "Developers who want a quick valid starting point.",
    ],
    relatedLinks: [
      {
        title: "Robots.txt Generator",
        description: "Build a valid robots.txt with rules, sitemap, and AI crawler controls.",
        path: "/tools/robots-txt-generator",
      },
    ],
    standalone: true,
  },
  {
    toolType: "sitemap",
    slug: "xml-sitemap-generator",
    contentKey: "xml-sitemap-generator",
    badge: "Free SEO Tool",
    title: "XML Sitemap Generator",
    pageTitle: "Free XML Sitemap Generator",
    metaTitle: "Free XML Sitemap Generator | RankVelt",
    metaDescription:
      "Generate a clean XML sitemap for your website to help search engines discover and crawl your pages.",
    shortDescription:
      "Generate a clean XML sitemap for better crawling.",
    intro:
      "Enter your pages and generate a properly formatted XML sitemap that you can upload and submit to Google Search Console.",
    guideTitle: "Help Google Find Every Page",
    guideText:
      "A sitemap does not guarantee indexing, but it gives crawlers a complete map of your site, which matters most for new or large websites.",
    bestFor: [
      "New websites waiting for first indexing.",
      "Large sites with pages buried deep in navigation.",
    ],
    relatedLinks: [
      {
        title: "Robots.txt Generator",
        description: "Build a valid robots.txt with rules, sitemap, and AI crawler controls.",
        path: "/tools/robots-txt-generator",
      },
    ],
    standalone: true,
  },
  {
    toolType: "local-seo",
    slug: "local-seo-checklist",
    contentKey: "local-seo-checklist",
    badge: "Free SEO Tool",
    title: "Local SEO Checklist",
    pageTitle: "Free Local SEO Checklist",
    metaTitle: "Free Local SEO Checklist | RankVelt",
    metaDescription:
      "Work through a practical local SEO checklist: Google Business Profile, citations, reviews, and on-page local signals.",
    shortDescription:
      "A practical checklist to rank in local search and maps.",
    intro:
      "Go through the checklist step by step and tick off each local SEO task, from your Google Business Profile to reviews and citations.",
    guideTitle: "Own Your Local Map Pack",
    guideText:
      "Local rankings are won with consistency: complete profiles, accurate citations, real reviews, and location pages that match what searchers see.",
    bestFor: [
      "Local businesses targeting map pack rankings.",
      "Agencies auditing client local SEO setups.",
    ],
    relatedLinks: [
      {
        title: "Business Name Generator",
        description: "Generate starting business-name ideas for brands, stores, and services.",
        path: "/tools/business-name-generator",
      },
    ],
    standalone: true,
  },
  {
    toolType: "redirect-map",
    slug: "redirect-mapping-generator",
    contentKey: "redirect-mapping-generator",
    badge: "Free SEO Tool",
    title: "Redirect Generator",
    pageTitle: "Free Redirect Mapping Generator",
    metaTitle: "Free Redirect Mapping Generator | RankVelt",
    metaDescription:
      "Map old URLs to new ones and generate redirect rules for site migrations without losing rankings.",
    shortDescription:
      "Map old URLs to new ones for safe site migrations.",
    intro:
      "List your old and new URLs side by side to build a clean redirect map before a redesign, rebrand, or platform migration.",
    guideTitle: "Migrate Without Losing Rankings",
    guideText:
      "A redirect map planned before launch prevents broken links and ranking drops. Every old URL should point to its closest matching new page.",
    bestFor: [
      "Site owners planning a redesign or rebrand.",
      "SEOs managing domain or platform migrations.",
    ],
    relatedLinks: [
      {
        title: "Bulk Redirect Generator",
        description: "Generate bulk 301/302 redirect rules for Apache, Nginx, and Cloudflare.",
        path: "/tools/bulk-redirect-generator",
      },
    ],
    standalone: true,
  },
  {
    toolType: "broken-link",
    slug: "bulk-broken-link-checker",
    contentKey: "broken-link-checker",
    badge: "Free SEO Tool",
    title: "Broken Link Checker",
    pageTitle: "Free Broken Link Checker",
    metaTitle: "Free Broken Link Checker for Websites | RankVelt",
    metaDescription:
      "Crawl your website free and find every broken link: internal and external links, status codes, and the pages they appear on. No signup.",
    shortDescription:
      "Crawl your site and find every broken internal and external link.",
    intro:
      "Enter your website URL and the checker crawls up to 25 pages, collects every link, and verifies each one from our servers, no signup and no captcha.",
    guideTitle: "Find and Fix Broken Links Before Visitors Do",
    guideText:
      "Broken links waste crawl budget and send visitors to dead ends. This free checker finds them across your pages so you can fix, redirect, or remove them.",
    bestFor: [
      "Site owners auditing after a redesign or migration.",
      "SEOs running monthly technical health checks.",
    ],
    relatedLinks: [
      {
        title: "Bulk HTTP Status Checker",
        description: "Check up to 100 URLs at once: status codes, redirect chains, and response times.",
        path: "/tools/bulk-http-status-checker",
      },
    ],
    standalone: true,
  },
  {
    toolType: "http-status",
    slug: "bulk-http-status-checker",
    contentKey: "http-status-checker",
    badge: "Free SEO Tool",
    title: "HTTP Status Checker",
    pageTitle: "Bulk HTTP Status Checker",
    metaTitle: "Bulk HTTP Status Checker: URL & Redirect Chain Tool",
    metaDescription:
      "Check up to 100 URLs at once: status codes, redirect chains, final URLs, and response times. Free bulk HTTP status checker, no signup needed.",
    shortDescription:
      "Check up to 100 URLs at once for status codes and redirect chains.",
    intro:
      "Paste a list of URLs and get each one's status code, full redirect chain, final destination, and response time in one table.",
    guideTitle: "Audit Redirects in Bulk, Not One by One",
    guideText:
      "Redirect chains and silent status errors hide in large URL lists. This tool checks them in batches so migration and launch audits take minutes.",
    bestFor: [
      "SEOs verifying redirect maps after migrations.",
      "Developers checking staging and production URLs.",
    ],
    relatedLinks: [
      {
        title: "Bulk Redirect Generator",
        description: "Generate bulk 301/302 redirect rules for Apache, Nginx, and Cloudflare.",
        path: "/tools/bulk-redirect-generator",
      },
    ],
    standalone: true,
  },
  {
    toolType: "ssl",
    slug: "ssl-checker",
    contentKey: "ssl-checker",
    badge: "Free SEO Tool",
    title: "SSL Checker",
    pageTitle: "Free SSL Checker",
    metaTitle: "Free SSL Checker: Certificate Expiry & Validity | RankVelt",
    metaDescription:
      "Check any domain's SSL certificate free: expiration date, days remaining, issuer, validity, and hostname match. No signup required.",
    shortDescription:
      "Check any domain's SSL certificate expiry, issuer, and validity.",
    intro:
      "Enter a domain and instantly see whether its SSL certificate is valid, who issued it, when it expires, and how many days are left.",
    guideTitle: "Never Let a Certificate Expire Silently",
    guideText:
      "An expired certificate shows visitors a scary browser warning and can pause your traffic overnight. Check expiry dates before they become emergencies.",
    bestFor: [
      "Site owners renewing certificates on time.",
      "Agencies auditing client website health.",
    ],
    relatedLinks: [
      {
        title: "Robots.txt Generator",
        description: "Build a valid robots.txt with rules, sitemap, and AI crawler controls.",
        path: "/tools/robots-txt-generator",
      },
    ],
    standalone: true,
  },
  {
    toolType: "utm",
    slug: "utm-builder",
    contentKey: "utm-builder",
    badge: "Free Marketing Tool",
    title: "UTM Builder",
    pageTitle: "Free UTM Builder",
    metaTitle: "Free UTM Builder: Campaign URL Builder | RankVelt",
    metaDescription:
      "Build UTM campaign URLs in seconds with presets and bulk mode. Free UTM builder for Google Analytics, ads, social, and email campaigns.",
    shortDescription:
      "Build UTM campaign URLs with presets and a bulk mode.",
    intro:
      "Fill in source, medium, and campaign to generate clean tracking URLs, or switch to bulk mode and tag a whole list of landing pages at once.",
    guideTitle: "Track Every Campaign Without the Mess",
    guideText:
      "Consistent UTM naming keeps your GA4 reports clean. Presets for ads, social, and email plus bulk mode make it fast to tag every link the same way.",
    bestFor: [
      "Marketers tagging ad and social campaigns.",
      "Newsletter owners tracking email clicks in GA4.",
    ],
    relatedLinks: [
      {
        title: "Title Tag Preview",
        description: "Preview Google snippets with pixel-accurate desktop and mobile views.",
        path: "/tools/title-tag-preview",
      },
    ],
    standalone: true,
  },
  {
    toolType: "speed",
    slug: "website-speed-test",
    contentKey: "website-speed-test",
    badge: "Free SEO Tool",
    title: "Website Speed Test",
    pageTitle: "Free Website Speed Test",
    metaTitle: "Free Website Speed Test: Core Web Vitals Checker | RankVelt",
    metaDescription:
      "Test any website speed free: performance score, Core Web Vitals, and the fixes that matter most. Mobile and desktop results, no signup.",
    shortDescription:
      "Test any page speed and Core Web Vitals on mobile and desktop.",
    intro:
      "Enter a URL and get a full performance score with Core Web Vitals, powered by Google Lighthouse lab data and real Chrome field data where available.",
    guideTitle: "Speed You Can Measure, Fixes You Can Prioritise",
    guideText:
      "A single score hides the story. This test shows which metric is failing, why it matters for visitors, and which fix saves the most time first.",
    bestFor: [
      "Site owners checking Core Web Vitals before a launch.",
      "Agencies auditing client site performance.",
    ],
    relatedLinks: [
      {
        title: "SSL Checker",
        description: "Check any domain certificate expiry, issuer, and validity.",
        path: "/tools/ssl-checker",
      },
    ],
    standalone: true,
  },
  {
    toolType: "aeo",
    slug: "aeo-readiness-checker",
    contentKey: "aeo-readiness-checker",
    badge: "Free AEO Tool",
    title: "AEO Readiness Checker",
    pageTitle: "Free AEO Readiness Checker",
    metaTitle: "Free AEO Readiness Checker: AI Answer Visibility Score | RankVelt",
    metaDescription:
      "Check how ready any page is for AI answers: structure, schema, questions, and citable content scored free. No signup required.",
    shortDescription:
      "Score any page for AI answer readiness across 12 checks.",
    intro:
      "Enter a URL and score how ready the page is to be understood and cited by AI answer engines like ChatGPT, Google AI Overviews, and Perplexity.",
    guideTitle: "Built for the AI Answer Era",
    guideText:
      "Search is shifting from ten blue links to direct answers. Pages with clear structure, direct answers, and machine readable signals get cited first.",
    bestFor: [
      "Site owners preparing content for AI search.",
      "SEOs auditing pages for answer engine visibility.",
    ],
    relatedLinks: [
      {
        title: "Schema Markup Generator",
        description: "Generate valid JSON-LD schema for your pages in minutes.",
        path: "/tools/schema-markup-generator",
      },
    ],
    standalone: true,
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

    case "redirect":
      return <ArrowRight className={className} />;

    case "opengraph":
      return <Sparkles className={className} />;

    case "robots":
      return <ShieldCheck className={className} />;

    case "serp":
      return <Search className={className} />;

    case "email-extractor":
      return <MailSearch className={className} />;

    case "broken-link":
      return <Unlink className={className} />;

    case "http-status":
      return <Activity className={className} />;

    case "ssl":
      return <Lock className={className} />;

    case "speed":
      return <Gauge className={className} />;

    case "aeo":
      return <Bot className={className} />;

    case "utm":
      return <Link2 className={className} />;

    case "meta-title":
      return <Target className={className} />;

    case "schema":
      return <Layout className={className} />;

    case "sitemap":
      return <ExternalLink className={className} />;

    case "local-seo":
      return <CheckCircle2 className={className} />;

    case "redirect-map":
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

    case "redirect":
      return "text-orange-400";

    case "opengraph":
      return "text-pink-400";

    case "robots":
      return "text-emerald-400";

    case "serp":
      return "text-blue-400";

    case "email-extractor":
      return "text-cyan-400";

    case "broken-link":
      return "text-red-400";

    case "http-status":
      return "text-teal-400";

    case "ssl":
      return "text-green-400";

    case "utm":
      return "text-indigo-400";

    case "meta-title":
      return "text-amber-400";

    case "schema":
      return "text-violet-400";

    case "sitemap":
      return "text-sky-400";

    case "local-seo":
      return "text-lime-400";

    case "redirect-map":
      return "text-orange-400";

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

function renderArticleParagraphs(paragraphs: string[]): ReactNode {
  const blocks: ReactNode[] = [];
  let pending: string[] = [];
  let key = 0;
  const flush = () => {
    if (pending.length > 0) {
      const items = pending;
      pending = [];
      const listKey = key++;
      blocks.push(
        <ul key={`ul-${listKey}`} className="list-disc space-y-2 pl-6">
          {items.map((b, bi) => (
            <li key={bi}>{b.replace(/^-\s*/, "")}</li>
          ))}
        </ul>
      );
    }
  };
  paragraphs.forEach((p) => {
    if (/^-\s/.test(p)) {
      pending.push(p);
    } else {
      flush();
      const pKey = key++;
      blocks.push(<p key={`p-${pKey}`}>{p}</p>);
    }
  });
  flush();
  return <>{blocks}</>;
}

function ToolArticleBlock({ article }: { article?: ToolArticle }) {
  if (!article || !article.sections || article.sections.length === 0) {
    return null;
  }
  return (
    <section className="mx-auto mt-16 max-w-4xl">
      {article.sections.map((sec, si) => (
        <div key={si} className={si === 0 ? "" : "mt-12"}>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {sec.heading}
          </h2>
          <div className="mt-4 space-y-4 text-[15px] leading-[1.8] text-white/65">
            {renderArticleParagraphs(sec.paragraphs)}
          </div>
        </div>
      ))}
    </section>
  );
}

const ToolsPage = () => {
  const { toolName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTool, setActiveTool] = useState<ToolType>("generator");
  const toolRef = useRef<HTMLDivElement>(null);

  const queryTool = searchParams.get("tool") || "";
  const isHubPage = !toolName && !queryTool;
  const isInvalidToolSlug = Boolean(toolName && !toolMapping[toolName]);

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
      // Unknown tool slugs render the 404 page below instead of
      // redirecting to the tools hub. Soft 404 fix in TOOLS-VERSION-21.
      return;
    }

    setActiveTool("generator");
  }, [toolName, queryTool, navigate]);

  useEffect(() => {
    if (isInvalidToolSlug) {
      document.title = "Page Not Found | RankVelt";
      ensureMetaByName("description").content =
        "The page you are looking for might have been moved, deleted, or never existed.";
      ensureMetaByName("robots").content = "noindex, follow";
      document.getElementById("rankvelt-tool-schema")?.remove();
      return;
    }

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
  }, [isHubPage, selectedTool, selectedToolContent.faqs, isInvalidToolSlug]);

  const handleToolClick = (tool: ToolConfig) => {
    // Standalone tools render on their own explicit routes, so the hub only
    // navigates and never tries to render them inline.
    if (!tool.standalone) {
      setActiveTool(tool.toolType);
    }
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

  if (isInvalidToolSlug) {
    return <NotFound />;
  }

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

            <p className="text-xs text-white/40">{tools.length} free tools available</p>
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

        <ToolArticleBlock article={selectedToolContent.article} />
      </div>
    </main>
  );
};

export default ToolsPage;