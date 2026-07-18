import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

const GSC_IMAGE = "/case-studies/bluebridge-gsc.webp";
const SPEED_BEFORE_IMAGE = "/case-studies/bluebridge-before.webp";
const SPEED_AFTER_IMAGE = "/case-studies/bluebridge-after.webp";

const searchMetrics = [
  {
    value: "6.68K",
    label: "Organic clicks",
    detail: "Google Web Search clicks during the selected three-month period.",
  },
  {
    value: "49K",
    label: "Search impressions",
    detail: "Times the website appeared across Google Search results.",
  },
  {
    value: "13.6%",
    label: "Average CTR",
    detail: "A strong click-through rate from the visibility already earned.",
  },
  {
    value: "5.5",
    label: "Average position",
    detail: "Average Google Search position across recorded impressions.",
  },
];

const beforeAudit = [
  {
    value: "59",
    label: "Performance",
  },
  {
    value: "79",
    label: "Accessibility",
  },
  {
    value: "69",
    label: "Best Practices",
  },
  {
    value: "92",
    label: "SEO",
  },
];

const afterAudit = [
  {
    value: "79",
    label: "Performance",
  },
  {
    value: "96",
    label: "Accessibility",
  },
  {
    value: "100",
    label: "Best Practices",
  },
  {
    value: "92",
    label: "SEO",
  },
];

const searchFocus = [
  {
    title: "Build on pages that already earned visibility",
    description:
      "The search data showed that Google was already discovering and presenting the website for relevant queries. The strongest next step was to study pages with existing impressions and improve them before expanding into low-priority content.",
  },
  {
    title: "Protect a strong click-through rate",
    description:
      "A 13.6% average CTR is a valuable signal. It suggests many search snippets were useful and relevant to the people who saw them. Important titles and descriptions should remain clear, accurate, and focused on the real page purpose.",
  },
  {
    title: "Improve the page experience after the click",
    description:
      "Organic visibility becomes more valuable when visitors can quickly understand the page, find the next step, and access key information without waiting through unnecessary loading delays or distractions.",
  },
  {
    title: "Keep technical work connected to user outcomes",
    description:
      "Performance scores matter because they affect the experience after search. Faster interaction, stable layouts, readable content, and accessible paths help visitors make better use of the page they clicked.",
  },
];

const nextSteps = [
  {
    number: "01",
    title: "Review high-value pages first",
    description:
      "Start with pages that already earn clicks and impressions. Check whether the page still answers the query clearly, offers useful next steps, and supports the visitor without unnecessary friction.",
  },
  {
    number: "02",
    title: "Maintain search-result relevance",
    description:
      "Strong CTR should be protected. Review page titles and meta descriptions as content changes so the search result continues to match the visitor's expected outcome.",
  },
  {
    number: "03",
    title: "Continue technical monitoring",
    description:
      "The later audit snapshot showed progress in several areas, but one metric still needs attention. Ongoing checks should include page speed, field data where available, accessibility, and core page templates.",
  },
  {
    number: "04",
    title: "Connect traffic to meaningful actions",
    description:
      "Search Console confirms visibility and clicks. The next layer is measuring what visitors do after landing: contact actions, downloads, sign-ups, consultations, or other meaningful business outcomes.",
  },
];

const pageFaqs = [
  {
    question: "What does 6.68K organic clicks mean in this case study?",
    answer:
      "It means Google Search Console recorded 6,680 clicks from Google Web Search during the selected three-month reporting period. A click happens when someone chooses the website from a Google search result.",
  },
  {
    question: "Does an average position of 5.5 mean every keyword ranked in position 5?",
    answer:
      "No. Google Search Console reports an average position across all recorded impressions. Some pages and queries may have appeared higher, while others may have appeared lower. It is a broad visibility signal rather than one fixed ranking.",
  },
  {
    question: "Why is a 13.6% click-through rate important?",
    answer:
      "CTR shows how often searchers choose a website after seeing it in Google. A 13.6% CTR suggests the visible search results were relevant for many users. It should still be reviewed alongside page intent, competition, ranking position, and search-result features.",
  },
  {
    question: "Did the PageSpeed score improve after optimisation?",
    answer:
      "The supplied later audit screenshot showed a Performance score of 79, compared with 59 in the earlier screenshot. Accessibility improved from 79 to 96, and Best Practices improved from 69 to 100. These are supplied audit snapshots and should not be treated as a guarantee for every page, device, or visitor.",
  },
  {
    question: "Did every speed metric improve in the later PageSpeed image?",
    answer:
      "No. The later image showed major improvement in Total Blocking Time and Cumulative Layout Shift, while Largest Contentful Paint was still slower in the later test. This is why performance work should be ongoing rather than treated as a one-time task.",
  },
  {
    question: "Does this case study prove leads, revenue, or individual keyword rankings?",
    answer:
      "No. This case study confirms the Google Search Console and PageSpeed metrics visible in the supplied screenshots. It does not claim leads, sales, revenue, conversions, individual keyword rankings, or specific implementation tasks not shown in the evidence.",
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

const Bluebridge = () => {
  useEffect(() => {
    const pageTitle =
      "SEO Case Study: 6.68K Organic Clicks in 3 Months | RankVelt";

    const pageDescription =
      "See how Bluebridge Partners earned 6.68K organic clicks, 49K Google Search impressions, a 13.6% CTR, and improved mobile audit quality.";

    const pageUrl = `${SITE_URL}/case-studies/bluebridge`;

    document.title = pageTitle;

    ensureMetaByName("description").content = pageDescription;
    ensureMetaByName("robots").content = "index, follow";
    ensureMetaByName("twitter:title").content = pageTitle;
    ensureMetaByName("twitter:description").content = pageDescription;

    ensureMetaByProperty("og:title").content = pageTitle;
    ensureMetaByProperty("og:description").content = pageDescription;
    ensureMetaByProperty("og:type").content = "article";
    ensureMetaByProperty("og:url").content = pageUrl;
    ensureMetaByProperty("og:image").content = `${SITE_URL}${GSC_IMAGE}`;

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = pageUrl;

    document.getElementById("rankvelt-bluebridge-schema")?.remove();

    const schemaScript = document.createElement("script");

    schemaScript.id = "rankvelt-bluebridge-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline:
            "Bluebridge Partners: 6.68K Organic Clicks and Stronger Mobile Audit Quality",
          description: pageDescription,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
          },
          image: `${SITE_URL}${GSC_IMAGE}`,
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
            name: "Search Engine Optimization",
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
              Search Growth & Technical SEO Case Study
            </p>

            <p className="mt-5 text-sm font-semibold text-white/75">
              Bluebridge Partners · Client name changed for confidentiality
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              6.68K Organic Clicks in Three Months With Stronger Mobile Audit Quality
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
              Bluebridge Partners is a confidential client website supported by
              RankVelt. Over one three-month Google Search Console reporting
              period, the website recorded 6.68K organic clicks, 49K
              impressions, a 13.6% average click-through rate, and a 5.5
              average position.
            </p>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/80">
              The client identity, industry, location, website, and primary
              search terms have been changed or withheld for confidentiality.
              This page focuses only on the performance evidence visible in the
              supplied Google Search Console and PageSpeed Insights reports.
            </p>
          </header>

          <nav
            aria-label="Case study sections"
            className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-y border-white/10 py-4 text-sm font-semibold text-white/80"
          >
            <a href="#results" className="transition-colors hover:text-primary">
              Search Results
            </a>

            <a href="#growth" className="transition-colors hover:text-primary">
              Growth Story
            </a>

            <a href="#speed" className="transition-colors hover:text-primary">
              Mobile Audit
            </a>

            <a href="#plan" className="transition-colors hover:text-primary">
              Next Steps
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
              {searchMetrics.map((metric, index) => (
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
              src={GSC_IMAGE}
              alt="Google Search Console report showing 6.68K clicks, 49K impressions, 13.6 percent CTR, and 5.5 average position over three months"
              className="h-auto w-full rounded-lg border border-white/10"
            />

            <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
              Google Search Console Web Search performance report for the
              supplied three-month period.
            </figcaption>
          </figure>

          <div className="mx-auto mt-16 max-w-3xl">
            <section id="growth" className="scroll-mt-28">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                The Growth Story
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                The Search Curve Changed in the Final Weeks
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The performance graph showed a quiet baseline through much of
                the first part of the reporting period. Search visibility then
                started to rise in June. Both clicks and impressions climbed
                sharply during the final weeks.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                This matters because the increase was visible in both primary
                search metrics. More impressions meant Google was showing the
                website more frequently. More clicks meant users were choosing
                the result after seeing it.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The 13.6% average CTR added useful context. A website can earn
                impressions without attracting visitors. Here, the click rate
                showed that many searchers found the visible page titles and
                descriptions relevant enough to select.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The average position of 5.5 also supported the broader pattern.
                This is not a fixed position for every query. It is an average
                across all recorded impressions. Still, it suggests that the
                website was often competing within strong Google Search
                placements during the period shown.
              </p>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                What the Data Supported
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Existing Visibility Created a Better SEO Starting Point
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The strongest SEO opportunities are often visible inside the
                data a website already has. Pages with impressions have proven
                that Google can connect them with real search demand. Pages
                with clicks have proven that users see enough relevance to
                choose them.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                For Bluebridge Partners, the goal was not to publish pages
                without a reason. It was to protect the pages already earning
                visibility, understand why the search curve was rising, and
                improve the user journey after the click.
              </p>

              <div className="mt-7">
                {searchFocus.map((item) => (
                  <div
                    key={item.title}
                    className="border-b border-white/10 py-6 first:border-t"
                  >
                    <h3 className="text-xl font-black text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-base leading-relaxed text-white/85">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="speed"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Mobile Audit Progress
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                The Later Snapshot Showed Stronger Technical Quality, With One Remaining Priority
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The supplied baseline mobile audit showed a Performance score
                of 59. Accessibility was 79, Best Practices was 69, and SEO
                was 92. The report also showed a 1,990ms Total Blocking Time,
                which can delay interaction when a visitor tries to use a page.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The baseline screenshot also showed a 3.5-second Largest
                Contentful Paint, 2.1-second First Contentful Paint, 0.093
                Cumulative Layout Shift, and a 2.9-second Speed Index. These
                values created a clear technical baseline for future work.
              </p>

              <section className="mt-8 border-y border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  {beforeAudit.map((metric, index) => (
                    <div
                      key={metric.label}
                      className={`py-5 ${
                        index > 1 ? "border-t border-white/10 sm:border-t-0" : ""
                      } ${
                        index > 0 ? "border-l border-white/10" : ""
                      }`}
                    >
                      <p className="text-center text-3xl font-black text-white">
                        {metric.value}
                      </p>

                      <p className="mt-2 text-center text-[10px] font-black uppercase tracking-wide text-white/75">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <figure className="mt-10">
                <img
                  src={SPEED_BEFORE_IMAGE}
                  alt="Baseline Google PageSpeed Insights mobile report showing 59 performance, 79 accessibility, 69 best practices, and 92 SEO"
                  className="h-auto w-full rounded-lg border border-white/10"
                />

                <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
                  Supplied baseline mobile PageSpeed Insights audit screenshot.
                </figcaption>
              </figure>

              <p className="mt-12 text-base leading-relaxed text-white/85">
                The later audit screenshot showed stronger scores in several
                areas. Performance was 79, Accessibility was 96, Best Practices
                was 100, and SEO remained at 92. Total Blocking Time was shown
                as 0ms, while Cumulative Layout Shift improved to 0.002.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                It is important to read the result honestly. The later audit
                was better overall, but Largest Contentful Paint was shown as
                5.2 seconds in that screenshot. This means the technical work
                should not stop at the score. LCP remains an important
                performance priority for ongoing review.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The two screenshots should be treated as supplied mobile audit
                snapshots. PageSpeed results can change by page, device,
                connection, location, test timing, and page content. They show
                clear progress in several areas, but they do not guarantee the
                same result for every visitor.
              </p>

              <section className="mt-8 border-y border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  {afterAudit.map((metric, index) => (
                    <div
                      key={metric.label}
                      className={`py-5 ${
                        index > 1 ? "border-t border-white/10 sm:border-t-0" : ""
                      } ${
                        index > 0 ? "border-l border-white/10" : ""
                      }`}
                    >
                      <p className="text-center text-3xl font-black text-primary">
                        {metric.value}
                      </p>

                      <p className="mt-2 text-center text-[10px] font-black uppercase tracking-wide text-white/75">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <figure className="mt-10">
                <img
                  src={SPEED_AFTER_IMAGE}
                  alt="Later Google PageSpeed Insights mobile report showing 79 performance, 96 accessibility, 100 best practices, and 92 SEO"
                  className="h-auto w-full rounded-lg border border-white/10"
                />

                <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
                  Supplied later mobile PageSpeed Insights audit screenshot.
                </figcaption>
              </figure>
            </section>

            <section
              id="plan"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                RankVelt&apos;s Next-Step Plan
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Keep the Search Momentum and Improve the Full Page Experience
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The search data showed a positive direction. The technical
                audit showed practical progress, with LCP still requiring
                attention. The next stage should protect what is working while
                improving the remaining issues that may affect visitors after
                the click.
              </p>

              <div className="mt-7">
                {nextSteps.map((step) => (
                  <div
                    key={step.number}
                    className="grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[52px_1fr]"
                  >
                    <span className="text-2xl font-black text-primary">
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

            <section className="mt-14 border-l-2 border-primary pl-5">
              <h2 className="text-2xl font-black text-white">
                Evidence and Scope Note
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                This case study is based on three supplied screenshots: one
                Google Search Console report and two mobile PageSpeed Insights
                audit snapshots. It confirms only the visible metrics included
                in those reports.
              </p>

              <p className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-white/80">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                />
                It does not claim revenue, leads, sales, conversions,
                individual keyword rankings, client identity, exact industry,
                specific implementation actions, or a guaranteed result for
                every page and visitor.
              </p>
            </section>
          </div>

          <section
            id="faqs"
            className="scroll-mt-28 mx-auto mt-20 max-w-3xl border-t border-white/10 pt-14"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              Bluebridge Partners FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              Understanding the Case Study Data
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
                  SEO by RankVelt
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                  Turn Search Growth Into Better Business Opportunities
                </h2>

                <p className="mt-4 text-base leading-relaxed text-white/85">
                  RankVelt helps businesses improve search visibility, content
                  relevance, technical SEO, on-page experience, internal
                  linking, and the conversion path for visitors who already
                  show intent.
                </p>
              </div>

              <Link
                to="/strategy-call?package=SEO%20Opportunity%20Check"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-xs font-black text-black transition-transform hover:scale-[1.02]"
              >
                Request a Free SEO Check
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
};

export default Bluebridge;