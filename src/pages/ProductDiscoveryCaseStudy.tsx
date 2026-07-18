import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

const CASE_STUDY_IMAGE =
  "/case-studies/product-discovery-at-scale-gsc.webp";

const performanceMetrics = [
  {
    value: "26.9K",
    label: "Organic clicks",
    detail: "Google Web Search clicks recorded over three months.",
  },
  {
    value: "1.82M",
    label: "Search impressions",
    detail: "Times product, category, and supporting pages appeared in Google.",
  },
  {
    value: "1.5%",
    label: "Average CTR",
    detail: "A clear opportunity to earn more visits from existing visibility.",
  },
  {
    value: "6.8",
    label: "Average position",
    detail: "Average search placement across recorded impressions.",
  },
];

const seoFocusAreas = [
  {
    title: "Category page relevance",
    description:
      "Category pages are often the strongest commercial entry points for an ecommerce store. They need clear titles, useful copy, logical product grouping, and internal links that help Google understand the collection.",
  },
  {
    title: "Product discovery",
    description:
      "Product pages should be easy to discover through search and internal links. Helpful descriptions, accurate product details, relevant filters, and clear page structure support both visibility and customer confidence.",
  },
  {
    title: "High-impression query review",
    description:
      "Queries already creating impressions should guide the next SEO work. This helps identify which pages deserve stronger titles, clearer page angles, better copy, or more useful supporting content.",
  },
  {
    title: "Commercial conversion paths",
    description:
      "Search traffic becomes more valuable when visitors can quickly compare products, understand delivery or returns, find trust information, and move towards the next action without friction.",
  },
];

const nextSteps = [
  {
    number: "01",
    title: "Improve high-impression category and product pages",
    description:
      "Start with pages that already appear regularly in Google. Review the title tag, visible H1, product or category copy, internal links, and the first information a shopper sees.",
  },
  {
    number: "02",
    title: "Refine titles and meta descriptions for commercial intent",
    description:
      "A good ecommerce search snippet should tell shoppers what the category or product offers. It should be clear, specific, and useful instead of repeating the same keyword variations.",
  },
  {
    number: "03",
    title: "Support pages ranking near the top of page one",
    description:
      "Pages that sit around positions four to ten can be strong opportunities. Improve helpful content, product comparison details, FAQs, internal links, and the page sections shoppers need before buying.",
  },
  {
    number: "04",
    title: "Measure the journey after the organic click",
    description:
      "Google Search Console confirms search activity. The next step is tracking product views, add-to-cart actions, checkout starts, purchases, email signups, and other meaningful ecommerce events.",
  },
];

const pageFaqs = [
  {
    question:
      "What does 1.82 million Google Search impressions mean for an ecommerce store?",
    answer:
      "It means the ecommerce website appeared 1.82 million times in Google Web Search during the selected three-month period. The impressions may come from product pages, category pages, informational content, brand searches, and other indexable store pages.",
  },
  {
    question:
      "Does an average position of 6.8 mean every product ranked in position 6?",
    answer:
      "No. Google Search Console reports an average position across all recorded impressions. Some products or categories may rank much higher, while others may rank lower. It is a broad search visibility metric, not one fixed ranking for every page.",
  },
  {
    question:
      "Why is CTR important for ecommerce SEO?",
    answer:
      "CTR shows how often people choose the store after seeing it in search results. Better titles, stronger category-page messaging, accurate product information, and clearer search intent alignment can help earn more visits from existing impressions.",
  },
  {
    question:
      "Does this case study prove product sales or ecommerce revenue?",
    answer:
      "No. The supplied Google Search Console screenshot confirms clicks, impressions, CTR, and average position only. Revenue, purchases, conversion rate, average order value, and return on ad spend require separate analytics or ecommerce platform data.",
  },
  {
    question:
      "What ecommerce pages should be prioritised first for SEO?",
    answer:
      "Start with important category pages, high-value product pages, pages already receiving impressions, best-selling collections, and pages close to stronger rankings. The right priority depends on search demand and the store's commercial goals.",
  },
  {
    question:
      "Can another ecommerce store expect the same result?",
    answer:
      "No. SEO performance depends on product demand, competition, technical setup, category structure, product availability, content quality, site authority, pricing, shipping experience, and many other factors. This is a real performance snapshot, not a guarantee.",
  },
];

const ensureMetaByName = (name: string) => {
  let meta = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }

  return meta;
};

const ensureMetaByProperty = (property: string) => {
  let meta = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }

  return meta;
};

const ProductDiscoveryCaseStudy = () => {
  useEffect(() => {
    const pageTitle =
      "Ecommerce SEO Case Study: 26.9K Organic Clicks | RankVelt";

    const pageDescription =
      "Explore an ecommerce SEO case study showing 26.9K organic clicks, 1.82M Google Search impressions, a 1.5% CTR, and 6.8 average position over three months.";

    const pageUrl = `${SITE_URL}/case-studies/product-discovery-at-scale`;

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "article";
    ensureMetaByProperty("og:url").content = pageUrl;
    ensureMetaByProperty("og:image").content =
      `${SITE_URL}${CASE_STUDY_IMAGE}`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = pageUrl;

    document
      .getElementById("rankvelt-product-discovery-case-study-schema")
      ?.remove();

    const schemaScript = document.createElement("script");

    schemaScript.id = "rankvelt-product-discovery-case-study-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline:
            "Product Discovery at Scale: Ecommerce SEO Case Study With 26.9K Organic Clicks",
          description: pageDescription,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
          },
          image: `${SITE_URL}${CASE_STUDY_IMAGE}`,
          author: {
            "@type": "Organization",
            name: "RankVelt",
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "RankVelt",
            url: SITE_URL,
          },
          about: {
            "@type": "Thing",
            name: "Ecommerce SEO",
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: pageFaqs.map((faq) => ({
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
  }, []);

  return (
    <main className="min-h-screen bg-[#070707] pb-24 pt-36 text-white sm:pt-40">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          to="/case-studies"
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} />
          Back to Case Studies
        </Link>

        <article className="pt-10">
          <header className="max-w-4xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              Ecommerce SEO Case Study
            </p>

            <p className="mt-5 text-sm font-semibold text-white/75">
              Product Discovery at Scale · Confidential Ecommerce Store
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              Ecommerce SEO Case Study: 26.9K Organic Clicks in Three Months
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
              This confidential ecommerce store recorded 26.9K organic clicks
              and 1.82M Google Search impressions in a three-month reporting
              period. The data showed strong product and category-page
              visibility. It also revealed a practical opportunity: earn more
              qualified store visits from the search exposure already in place.
            </p>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/80">
              RankVelt prepared this case study using the supplied Google
              Search Console Web Search data. The client name remains private,
              while the performance metrics are presented exactly as shown in
              the report.
            </p>
          </header>

          <nav
            aria-label="Case study sections"
            className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-y border-white/10 py-4 text-sm font-semibold text-white/80"
          >
            <a href="#results" className="transition-colors hover:text-primary">
              Results
            </a>

            <a href="#context" className="transition-colors hover:text-primary">
              Store Context
            </a>

            <a
              href="#opportunity"
              className="transition-colors hover:text-primary"
            >
              SEO Opportunity
            </a>

            <a href="#plan" className="transition-colors hover:text-primary">
              Next-Phase Plan
            </a>

            <a href="#faqs" className="transition-colors hover:text-primary">
              FAQs
            </a>
          </nav>

          <section
            id="results"
            className="scroll-mt-28 mt-10 border-y border-white/10"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {performanceMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={`py-7 sm:px-6 ${
                    index !== 0 ? "border-t border-white/10 sm:border-t-0" : ""
                  } ${
                    index > 0 ? "sm:border-l sm:border-white/10" : ""
                  }`}
                >
                  <p className="text-4xl font-black tracking-[-0.05em] text-white">
                    {metric.value}
                  </p>

                  <h2 className="mt-2 text-sm font-black text-primary">
                    {metric.label}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {metric.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <figure className="mt-14">
            <img
              src={CASE_STUDY_IMAGE}
              alt="Google Search Console report showing 26.9K clicks, 1.82M impressions, 1.5 percent CTR, and 6.8 average position across three months"
              className="h-auto w-full rounded-lg border border-white/10"
            />

            <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
              Google Search Console Web Search performance report for the
              selected three-month period.
            </figcaption>
          </figure>

          <div className="mx-auto mt-16 max-w-3xl">
            <section id="context" className="scroll-mt-28">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Store Context
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                Product Discovery Was Already Happening at Scale
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                Ecommerce SEO is not only about ranking a few product names.
                It is about helping Google understand the store structure,
                product categories, collection pages, product detail pages, and
                the information shoppers need before making a decision.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                In this case, the store was already generating meaningful
                search visibility. It appeared 1.82M times in Google Search
                across the three-month period. That level of exposure suggests
                that Google was regularly matching store pages with product,
                category, brand, and supporting informational searches.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The website also earned 26.9K organic clicks. This matters
                because it confirms that shoppers were not only seeing the
                store. A meaningful number were choosing to visit product and
                category pages from Google. The report also showed consistent
                daily activity instead of one short-lived spike.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The average position was 6.8. This is an overall visibility
                metric. It does not mean every product ranked in position six
                or seven. Some pages may have performed much better, while
                others appeared lower. Still, it showed that the store had a
                strong search base to improve further.
              </p>
            </section>

            <section
              id="opportunity"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                The SEO Opportunity
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                More Clicks Could Come From the Visibility Already Earned
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The average click-through rate was 1.5%. CTR changes for many
                reasons. Search intent, product price, brand recognition,
                search-result features, ranking position, and competition all
                play a part. It should never be judged in isolation.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                However, the large impression volume made CTR an important
                opportunity. When a store already receives 1.82M impressions,
                even a small improvement in how often shoppers click can create
                more organic visits without needing the same increase in total
                visibility.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The right response is not to rewrite every title at random.
                RankVelt would start with high-impression pages and queries.
                We would review what the shopper is looking for, the page being
                shown, the title tag, meta description, visible H1, product or
                category copy, internal links, and the first action available
                after landing on the page.
              </p>

              <div className="mt-8 border-l-2 border-primary pl-5">
                <p className="text-lg font-black text-white">
                  The core question:
                </p>

                <p className="mt-2 text-base leading-relaxed text-white/85">
                  Does the search result make a clear promise, and does the
                  ecommerce page fully deliver on that promise once the shopper
                  lands on it?
                </p>
              </div>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Ecommerce SEO Focus
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                Four Areas That Matter for Store Growth
              </h2>

              <div className="mt-7">
                {seoFocusAreas.map((area) => (
                  <div
                    key={area.title}
                    className="border-b border-white/10 py-6 first:border-t"
                  >
                    <h3 className="text-xl font-black text-white">
                      {area.title}
                    </h3>

                    <p className="mt-2 text-base leading-relaxed text-white/85">
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="plan"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                RankVelt&apos;s Next-Phase Plan
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                A Clear Path From Search Visibility to Better Store Traffic
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The Google Search Console report provides a useful starting
                point. It shows where search demand already exists. The next
                stage is to connect that demand with better category pages,
                stronger product discovery, clearer commercial content, and
                easier paths to conversion.
              </p>

              <div className="mt-7">
                {nextSteps.map((step) => (
                  <div
                    key={step.number}
                    className="grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[52px_1fr]"
                  >
                    <span className="text-lg font-black text-primary">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="text-xl font-black text-white">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-base leading-relaxed text-white/85">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Key Takeaway
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                Ecommerce SEO Is Stronger When Search Visibility Meets a Better Shopping Journey
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                This ecommerce store had already earned meaningful Google
                visibility. The 26.9K organic clicks, 1.82M impressions, and
                6.8 average position showed that the store had a real search
                presence across the reporting period.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The next opportunity was not simply adding more pages. It was
                improving the pages and queries already earning attention. This
                means making category pages more useful, product pages easier
                to understand, search snippets more relevant, internal links
                more purposeful, and conversion paths clearer for shoppers.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                At RankVelt, we use search data to create practical priorities.
                We look for pages with proven visibility, queries with clear
                commercial intent, product discovery gaps, technical issues,
                weak internal linking, and places where a better ecommerce
                experience can support better organic performance.
              </p>
            </section>

            <section className="mt-14 border-l-2 border-primary pl-5">
              <h2 className="text-2xl font-black text-white">
                Data Integrity Note
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                This case study is presented as an ecommerce SEO performance
                example. The supplied Google Search Console screenshot supports
                the reported clicks, impressions, CTR, and average position. It
                does not prove ecommerce revenue, orders, conversion rate,
                average order value, ad spend return, backlinks, individual
                keyword positions, or specific implementation work not shown in
                the source data.
              </p>
            </section>
          </div>

          <section
            id="faqs"
            className="scroll-mt-28 mx-auto mt-20 max-w-3xl border-t border-white/10 pt-14"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              Ecommerce SEO Case Study FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
              Understanding the Performance Data
            </h2>

            <div className="mt-8">
              {pageFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border-b border-white/10 py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-black text-white">
                    {faq.question}

                    <ChevronDown
                      size={18}
                      className="shrink-0 text-primary transition-transform group-open:rotate-180"
                    />
                  </summary>

                  <p className="mt-4 text-sm leading-relaxed text-white/85">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-20 border-t border-white/10 pt-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                  Ecommerce SEO by RankVelt
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                  Make Your Store Easier to Find, Understand, and Buy From
                </h2>

                <p className="mt-4 text-base leading-relaxed text-white/85">
                  RankVelt helps ecommerce stores improve category-page
                  relevance, product discovery, technical SEO, internal
                  linking, commercial content, and organic conversion paths.
                </p>
              </div>

              <Link
                to="/strategy-call?package=Ecommerce%20SEO%20Opportunity%20Check"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                Request an Ecommerce SEO Check
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
};

export default ProductDiscoveryCaseStudy;