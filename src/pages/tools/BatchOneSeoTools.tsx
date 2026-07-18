import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  MailCheck,
  Search,
  Sparkles,
} from "lucide-react";

import {
  MetaTitleDescriptionChecker,
  SerpSnippetPreview,
} from "@/components/Tools/SeoSnippetTools";

import BulkEmailVerifier from "@/components/Tools/BulkEmailVerifier";

const SITE_URL = "https://rankvelt.com";

type ToolFaq = {
  question: string;
  answer: string;
};

type ToolPageConfig = {
  slug: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  howToUse: string[];
  resultGuideTitle: string;
  resultGuide: string[];
  faqs: ToolFaq[];
  relatedLinks: {
    title: string;
    description: string;
    path: string;
  }[];
  tool: ReactNode;
};

const toolConfigs: Record<string, ToolPageConfig> = {
  meta: {
    slug: "/tools/meta-title-description-checker",
    eyebrow: "Free SEO Metadata Tool",
    title: "Meta Title & Description Checker",
    metaTitle: "Free Meta Title and Description Checker | RankVelt",
    metaDescription:
      "Check page title and meta description length, clarity, and search-result preview with RankVelt's free SEO metadata checker.",
    intro:
      "Review whether your page title and meta description clearly explain the page, match user intent, and remain readable before publishing.",
    howToUse: [
      "Add the page title you plan to publish.",
      "Paste or write your meta description.",
      "Review the editing guidance and visual result preview.",
      "Update your website title tag and description only when the wording accurately represents the page.",
    ],
    resultGuideTitle: "How to Use the Result Properly",
    resultGuide: [
      "Use length guidance as an editing signal, not a guaranteed Google display limit.",
      "Keep titles specific, accurate, and connected to the visible page heading.",
      "Write descriptions for real searchers. Explain the page instead of listing keywords.",
      "Avoid repeating the same title and description across unrelated pages.",
    ],
    faqs: [
      {
        question: "What is the difference between a page title and an H1 heading?",
        answer:
          "A page title appears in the browser tab and may be used in search results. An H1 is the main visible heading on the page. They can be similar, but both should accurately describe the page and work naturally for users.",
      },
      {
        question: "Does a character count guarantee that Google will show my full title?",
        answer:
          "No. Search-result display can change based on device, query, available space, page content, and how a search engine chooses to present the result. Use the checker as a practical writing guide.",
      },
      {
        question: "Can Google rewrite my title or meta description?",
        answer:
          "Yes. Search engines can choose different title or snippet text when they believe another version better matches the query or page content. Clear, accurate metadata still gives the page a stronger starting point.",
      },
      {
        question: "Do meta descriptions directly improve rankings?",
        answer:
          "A meta description should mainly help a relevant searcher understand the page before clicking. Focus on clarity, accuracy, and user intent instead of treating it as a direct ranking shortcut.",
      },
      {
        question: "Should every page have a unique title and description?",
        answer:
          "Important indexable pages should usually have unique metadata that reflects their distinct purpose. Reusing the same wording across unrelated service, product, or location pages can make pages less clear.",
      },
      {
        question: "Should I include my brand name in every title?",
        answer:
          "Often it can be useful, especially on key pages. Place the important topic first, then use the brand name where it adds clarity and still keeps the title easy to read.",
      },
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Improve service-page structure, technical SEO, content clarity, and organic lead paths.",
        path: "/business-seo",
      },
      {
        title: "SEO Content & Website Review",
        description:
          "Request a focused review of your page structure, search visibility, and priority improvements.",
        path: "/strategy-call?package=SEO%20Content%20%26%20Website%20Review",
      },
    ],
    tool: <MetaTitleDescriptionChecker />,
  },

  serp: {
    slug: "/tools/serp-snippet-preview",
    eyebrow: "Free SERP Preview Tool",
    title: "Google SERP Snippet Preview",
    metaTitle: "Free SERP Snippet Preview Tool | RankVelt",
    metaDescription:
      "Preview how a page title, URL, and meta description may appear in desktop and mobile search results with RankVelt's free SERP snippet preview tool.",
    intro:
      "Preview your page title, readable URL, and meta description before publishing. Use the preview to improve clarity and user expectations, not to copy a fixed search-result format.",
    howToUse: [
      "Add your proposed SEO title, domain, URL path, and description.",
      "Switch between desktop and mobile preview modes.",
      "Review whether the topic is clear before the text visually truncates.",
      "Make sure the visible page content supports the promise made in the snippet.",
    ],
    resultGuideTitle: "What a Snippet Preview Can and Cannot Do",
    resultGuide: [
      "A visual preview helps you edit clarity and avoid overly long wording.",
      "Search engines may change titles, snippets, dates, or other result elements.",
      "Avoid adding claims, prices, ratings, or urgency messaging that is not clearly supported on the page.",
      "Your actual page quality, relevance, and technical setup matter more than a preview design.",
    ],
    faqs: [
      {
        question: "Will this preview match Google exactly?",
        answer:
          "No. It is a practical visual guide. Search-result appearance can vary by device, query, language, location, available space, and search-engine decisions.",
      },
      {
        question: "Why might Google show a different description?",
        answer:
          "A search engine may select page text that better matches a specific query. Clear on-page headings, useful introductory copy, and accurate metadata improve consistency.",
      },
      {
        question: "Should I create a separate title for mobile search?",
        answer:
          "No. Use one clear title that works across devices. The mobile preview helps you see whether the most important wording appears early enough.",
      },
      {
        question: "Does the URL path matter in a search snippet?",
        answer:
          "A readable URL path can help visitors understand the page topic. Keep URLs short, meaningful, and connected to the page rather than using unnecessary dates, codes, or filler words.",
      },
      {
        question: "Can I add review stars or dates manually in the preview?",
        answer:
          "Do not add visual elements to metadata unless they accurately reflect visible content and supported implementation. Rich-result appearance is determined by search engines, not a preview tool.",
      },
      {
        question: "What should I improve first: title, description, or page content?",
        answer:
          "Start with the page content and user intent. Then write a title and description that accurately summarise that content. Metadata cannot fix a page that lacks useful information.",
      },
    ],
    relatedLinks: [
      {
        title: "Local SEO",
        description:
          "Build clearer local service pages, Google Business Profile relevance, and location-based customer journeys.",
        path: "/local-seo",
      },
      {
        title: "eCommerce SEO",
        description:
          "Improve collection pages, product discovery, Shopify metadata, and commercial search visibility.",
        path: "/ecommerce-seo",
      },
    ],
    tool: <SerpSnippetPreview />,
  },

  email: {
    slug: "/tools/bulk-email-verifier",
    eyebrow: "Free Email List Quality Tool",
    title: "Free Bulk Email Verifier",
    metaTitle: "Free Bulk Email Verifier and Email List Checker | RankVelt",
    metaDescription:
      "Check up to 100 email addresses for format issues, duplicates, disposable domains, role-based inboxes, domain typos, and MX-record signals with RankVelt's free bulk email verifier.",
    intro:
      "Check a small email list for common quality signals before importing it into your CRM, newsletter platform, outreach workflow, or contact database.",
    howToUse: [
      "Paste up to 100 email addresses or upload a CSV or TXT file.",
      "Run the free syntax, duplicate, disposable-domain, role-address, and MX-record checks.",
      "Filter results into Keep, Review, and Remove groups.",
      "Download a CSV report or copy the Keep list for your own review.",
    ],
    resultGuideTitle: "How to Read the Email Results",
    resultGuide: [
      "Likely Deliverable means the address passed format checks and the domain showed a mail-server signal. It does not prove a specific mailbox exists.",
      "Role-based addresses such as info@, sales@, and support@ may be legitimate but are shared inboxes, so review them based on your purpose.",
      "Disposable domains are commonly associated with temporary inboxes and should normally be removed from customer or lead lists.",
      "Needs Review may indicate a likely typo or a domain situation that requires a manual decision.",
    ],
    faqs: [
      {
        question: "Can this free email verifier confirm that a mailbox definitely exists?",
        answer:
          "No. This tool does not send SMTP mailbox probes and does not claim to prove inbox ownership or mailbox existence. It checks format, duplicates, disposable domains, role addresses, domain signals, and MX records.",
      },
      {
        question: "What does an MX record mean for an email address?",
        answer:
          "An MX record is a DNS record that indicates where a domain receives email. Finding an MX record is a useful domain-level signal, but it does not confirm that a specific inbox is active.",
      },
      {
        question: "Should I remove role-based email addresses such as info@ or support@?",
        answer:
          "Not automatically. Role-based addresses can be valid shared inboxes. Review them based on your use case, consent, relevance, and whether you need an individual contact or a general business inbox.",
      },
      {
        question: "Why are disposable email domains marked for removal?",
        answer:
          "Disposable domains are often used for temporary inboxes. They may be unsuitable for long-term customer communication, account registration, newsletters, or contact databases.",
      },
      {
        question: "Does RankVelt save my uploaded email list?",
        answer:
          "This tool does not write submitted lists to a database. The check runs for the current request, and the application code does not store your list for later use.",
      },
      {
        question: "Why is an address marked Needs Review instead of Invalid?",
        answer:
          "Some issues are not certain failures. For example, a common domain typo or a domain that resolves but lacks an expected mail-server signal may need a manual decision rather than immediate removal.",
      },
    ],
    relatedLinks: [
      {
        title: "Business SEO",
        description:
          "Build clearer service pages, stronger organic lead paths, and better website conversion foundations.",
        path: "/business-seo",
      },
      {
        title: "Local SEO",
        description:
          "Improve local visibility, service-area relevance, Google Maps presence, and qualified customer enquiries.",
        path: "/local-seo",
      },
    ],
    tool: <BulkEmailVerifier />,
  },
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

const ToolPageTemplate = ({ config }: { config: ToolPageConfig }) => {
  useEffect(() => {
    document.title = config.metaTitle;

    setMetaByName("description", config.metaDescription);
    setMetaByName("robots", "index, follow");
    setMetaByProperty("og:title", config.metaTitle);
    setMetaByProperty("og:description", config.metaDescription);
    setMetaByProperty("og:type", "website");
    setMetaByProperty("og:url", `${SITE_URL}${config.slug}`);

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = `${SITE_URL}${config.slug}`;

    document.getElementById("rankvelt-batch-one-tool-schema")?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-batch-one-tool-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: config.title,
          url: `${SITE_URL}${config.slug}`,
          description: config.metaDescription,
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
          mainEntity: config.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
      ],
    });

    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, [config]);

  return (
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.08] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} />
          Back to Free Tools
        </Link>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            {config.eyebrow}
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            {config.title}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            {config.intro}
          </p>
        </section>

        <section className="mt-12">{config.tool}</section>

        <section className="mt-16 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <MailCheck className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              How to Use This Tool
            </h2>

            <ol className="mt-6 space-y-4">
              {config.howToUse.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-black text-black">
                    {index + 1}
                  </span>

                  <p className="pt-0.5 text-sm leading-relaxed text-white/70">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-white/[0.02] to-purple-500/[0.08] p-6 sm:p-8">
            <Search className="text-primary" size={22} />

            <h2 className="mt-5 text-2xl font-black text-white">
              {config.resultGuideTitle}
            </h2>

            <ul className="mt-6 space-y-3.5">
              {config.resultGuide.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Tool FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Questions Before You Use the Tool
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-3">
            {config.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 open:border-primary/35"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-black text-white sm:text-base">
                  {faq.question}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  />
                </summary>

                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Continue Your Research
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Related RankVelt Resources
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Use the tool as a practical starting point, then explore the
                service or resource that helps you turn the insight into action.
              </p>
            </div>

            <Link
              to="/strategy-call?package=Free%20SEO%20Opportunity%20Check"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02]"
            >
              Request a Free SEO Check
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {config.relatedLinks.map((link) => (
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

export const MetaTitleDescriptionCheckerPage = () => {
  return <ToolPageTemplate config={toolConfigs.meta} />;
};

export const SerpSnippetPreviewPage = () => {
  return <ToolPageTemplate config={toolConfigs.serp} />;
};

export const BulkEmailVerifierPage = () => {
  return <ToolPageTemplate config={toolConfigs.email} />;
};