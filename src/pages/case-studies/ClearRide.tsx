import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

const GSC_IMAGE = "/case-studies/clear-ride-gsc.webp";
const SPEED_BEFORE_IMAGE = "/case-studies/clear-ride-before.webp";
const SPEED_AFTER_IMAGE = "/case-studies/clear-ride-after.webp";

const searchMetrics = [
  {
    value: "18.4K",
    label: "Organic clicks",
    detail: "Google Web Search clicks recorded in the selected 28-day period.",
  },
  {
    value: "779K",
    label: "Search impressions",
    detail: "Times the service website appeared in Google Search results.",
  },
  {
    value: "2.4%",
    label: "Average CTR",
    detail: "A clear opportunity to improve search-result engagement further.",
  },
  {
    value: "6.9",
    label: "Average position",
    detail: "Average placement across all recorded Google Search impressions.",
  },
];

const beforeMetrics = [
  {
    value: "76",
    label: "Performance",
  },
  {
    value: "90",
    label: "Accessibility",
  },
  {
    value: "92",
    label: "Best Practices",
  },
  {
    value: "85",
    label: "SEO",
  },
];

const afterMetrics = [
  {
    value: "91",
    label: "Performance",
  },
  {
    value: "93",
    label: "Accessibility",
  },
  {
    value: "100",
    label: "Best Practices",
  },
  {
    value: "100",
    label: "SEO",
  },
];

const userJourneyPoints = [
  {
    title: "Local service pages need clear intent",
    description:
      "Someone searching for windshield replacement usually needs help quickly. The page has to make the service, location, availability, and next step clear without forcing the visitor to search through long blocks of content.",
  },
  {
    title: "Mobile experience matters more in urgent searches",
    description:
      "A customer may be searching from a car, workplace, home, or roadside situation. Mobile pages should load quickly, stay readable, and make it easy to call, request a quote, or understand the service area.",
  },
  {
    title: "Trust signals support the decision",
    description:
      "Auto glass services are high-intent local searches. Clear contact details, service information, nearby coverage, insurance guidance, reviews, and direct booking options can help visitors feel ready to take the next step.",
  },
  {
    title: "Search pages should match the service request",
    description:
      "A strong local SEO page should answer the real question behind the search. That includes the type of glass service, the local area, expected process, and what the customer should do next.",
  },
];

const nextSteps = [
  {
    number: "01",
    title: "Protect pages already earning local visibility",
    description:
      "The Search Console report shows meaningful demand already exists. Priority pages should be reviewed regularly for accurate service details, clear city or service-area information, helpful calls to action, and up-to-date customer guidance.",
  },
  {
    number: "02",
    title: "Improve high-impression search snippets",
    description:
      "With 779K impressions and a 2.4% average CTR, the first opportunity is to study the pages and queries that appear often but receive fewer clicks. Titles and descriptions should stay specific, useful, and aligned with customer intent.",
  },
  {
    number: "03",
    title: "Strengthen the path from search to quote request",
    description:
      "Visitors should quickly understand what service is available, whether their location is covered, and how to contact the business. Better search performance is more valuable when it leads to clear customer actions.",
  },
  {
    number: "04",
    title: "Monitor field data after technical improvements",
    description:
      "The improved post-optimisation audit is a strong sign, but mobile field data should still be monitored over time. Real-user performance can change by page, device, network, and location.",
  },
];

const pageFaqs = [
  {
    question: "What does 18.4K organic clicks mean in this case study?",
    answer:
      "It means Google Search Console recorded 18,400 clicks from Google Web Search during the selected 28-day period. A click happens when someone chooses the website from a Google search result.",
  },
  {
    question: "Does an average position of 6.9 mean every keyword ranked in position 6?",
    answer:
      "No. Google Search Console reports an average position across recorded impressions. Some service pages and queries may have ranked higher, while others may have appeared lower. It is a broad search visibility metric.",
  },
  {
    question: "Why is a 2.4% CTR important for local SEO?",
    answer:
      "CTR shows how often people choose the business after seeing it in Google Search. For a local service business, stronger titles, service relevance, location clarity, and customer trust can help improve the quality of those clicks.",
  },
  {
    question: "Did the PageSpeed improvements prove that Core Web Vitals passed?",
    answer:
      "No. The before screenshot showed a failed mobile Core Web Vitals assessment. The after screenshot showed stronger Lighthouse audit scores, but it also displayed no field data. The screenshots support a better lab audit, not a confirmed field-data pass for every real user.",
  },
  {
    question: "Why is TTFB important for a local service website?",
    answer:
      "Time to First Byte measures how quickly the browser receives the first response from the server. Slow response time can delay the start of the page experience, especially for mobile visitors who need urgent service information.",
  },
  {
    question: "Does this case study prove leads, revenue, or booked jobs?",
    answer:
      "No. The supplied evidence confirms Google Search Console metrics and PageSpeed audit results only. It does not prove calls, quote requests, bookings, revenue, customer lifetime value, or individual keyword positions.",
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

const ClearRide = () => {
  useEffect(() => {
    const pageTitle =
      "Auto Glass SEO Case Study: 18.4K Organic Clicks | RankVelt";

    const pageDescription =
      "See how a local auto glass service reached 18.4K organic clicks and 779K Google impressions in 28 days while improving its mobile PageSpeed audit.";

    const pageUrl = `${SITE_URL}/case-studies/clear-ride-auto-glass`;

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

    document.getElementById("rankvelt-clear-ride-schema")?.remove();

    const schemaScript = document.createElement("script");

    schemaScript.id = "rankvelt-clear-ride-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline:
            "ClearRide Auto Glass: 18.4K Organic Clicks in 28 Days With a Stronger Mobile Audit",
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
            name: "Local SEO for Auto Glass Services",
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
              Local SEO & Technical Performance Case Study
            </p>

            <p className="mt-5 text-sm font-semibold text-white/75">
              ClearRide Auto Glass · Brand name changed for confidentiality
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              18.4K Organic Clicks in 28 Days for a Local Windshield Service
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
              ClearRide Auto Glass is a local mobile windshield replacement and
              auto glass service business. The supplied Google Search Console
              report shows 18.4K organic clicks and 779K impressions during one
              28-day reporting period.
            </p>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/80">
              The website served customers searching for urgent auto glass
              help, windshield replacement, mobile service, and nearby
              location-based support. The business name, exact website, and
              primary search terms have been changed to protect client
              confidentiality.
            </p>
          </header>

          <nav
            aria-label="Case study sections"
            className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-y border-white/10 py-4 text-sm font-semibold text-white/80"
          >
            <a href="#results" className="transition-colors hover:text-primary">
              Search Results
            </a>

            <a href="#context" className="transition-colors hover:text-primary">
              Business Context
            </a>

            <a href="#speed" className="transition-colors hover:text-primary">
              Mobile Performance
            </a>

            <a href="#plan" className="transition-colors hover:text-primary">
              Growth Plan
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
              alt="Google Search Console report showing 18.4K clicks, 779K impressions, 2.4 percent CTR, and 6.9 average position over 28 days"
              className="h-auto w-full rounded-lg border border-white/10"
            />

            <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
              Google Search Console Web Search report for the supplied 28-day
              reporting period.
            </figcaption>
          </figure>

          <div className="mx-auto mt-16 max-w-3xl">
            <section id="context" className="scroll-mt-28">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Business Context
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Local Search Has to Meet an Immediate Customer Need
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                Auto glass searches are usually high intent. A customer may
                have a cracked windshield, broken side window, damaged rear
                glass, or an urgent need to understand replacement options.
                They are not browsing for a future idea. They often need a
                reliable answer and a direct next step.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                That is why local service pages need more than a list of
                keywords. The page needs to explain the service clearly. It
                needs to show where the business operates, how customers can
                request help, and what they can expect from the process.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The supplied Search Console report showed that this website was
                already earning meaningful Google visibility. The graph rose
                sharply during the second half of the reporting period. The
                final visible day showed 2,283 clicks and 107,133 impressions.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The average position of 6.9 should be read carefully. It does
                not mean every keyword ranked in the same position. It is an
                average across all recorded impressions. Still, it shows that
                the site had a strong search presence across a wide group of
                local service-related searches.
              </p>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Search Opportunity
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Visibility Was Strong. Search-Result Engagement Was the Next Lever.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The website appeared 779K times in Google Search during the
                selected 28 days. It received 18.4K clicks and had a 2.4%
                average CTR. That tells an important story. The business was
                visible, but not every relevant impression became a visit.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                CTR can change for many reasons. Search-result features,
                ranking position, location, competition, urgency, service
                pricing, brand recognition, and query intent all affect the
                decision to click. A 2.4% CTR is not enough on its own to make
                a final judgement.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                But with 779K impressions, it becomes a meaningful area for
                review. Better titles, clearer service statements, strong local
                relevance, and more useful descriptions can help turn more
                existing impressions into visitors who need the service now.
              </p>

              <div className="mt-8 border-l-2 border-primary pl-5">
                <p className="text-lg font-black text-white">
                  The key local SEO question:
                </p>

                <p className="mt-2 text-base leading-relaxed text-white/85">
                  When a nearby customer sees the result, does it make the
                  service, location, urgency, and next action clear enough to
                  earn the click?
                </p>
              </div>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Customer Journey Focus
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                A Better Local SEO Page Supports the Decision After the Click
              </h2>

              <div className="mt-7">
                {userJourneyPoints.map((point) => (
                  <div
                    key={point.title}
                    className="border-b border-white/10 py-6 first:border-t"
                  >
                    <h3 className="text-xl font-black text-white">
                      {point.title}
                    </h3>

                    <p className="mt-2 text-base leading-relaxed text-white/85">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="speed"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Mobile Performance
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                The Mobile Audit Improved, But Field Data Still Needed Monitoring
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The before screenshot showed a mobile Core Web Vitals
                assessment marked as failed. The field data displayed a 2.7s
                Largest Contentful Paint, 71ms Interaction to Next Paint, zero
                Cumulative Layout Shift, 2.5s First Contentful Paint, and a
                2.1s Time to First Byte.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The largest technical concern in the supplied before report was
                the 2.1s Time to First Byte. This can delay the start of the
                page experience. For a mobile visitor searching for urgent
                windshield help, slow server response can add friction before
                they even see the service information.
              </p>

              <section className="mt-8 border-y border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  {beforeMetrics.map((metric, index) => (
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

                      <p className="mt-2 text-center text-[10px] font-black uppercase tracking-wide text-white/70">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <figure className="mt-10">
                <img
                  src={SPEED_BEFORE_IMAGE}
                  alt="Before Google PageSpeed Insights mobile report showing failed Core Web Vitals assessment, 76 performance score, and 85 SEO score"
                  className="h-auto w-full rounded-lg border border-white/10"
                />

                <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
                  Supplied mobile PageSpeed Insights screenshot before the
                  reported optimisation phase.
                </figcaption>
              </figure>

              <p className="mt-12 text-base leading-relaxed text-white/85">
                The after screenshot showed a stronger mobile Lighthouse audit.
                Performance increased from 76 to 91. Accessibility increased
                from 90 to 93. Best Practices improved from 92 to 100, while
                the SEO audit score improved from 85 to 100.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                This is positive technical evidence. However, it is important
                to separate lab testing from field data. The after screenshot
                displayed no real-user data. It supports a stronger tested page
                audit, but it does not prove that Core Web Vitals passed for
                every visitor after the update.
              </p>

              <section className="mt-8 border-y border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  {afterMetrics.map((metric, index) => (
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
                  alt="After Google PageSpeed Insights mobile report showing 91 performance, 93 accessibility, 100 best practices, and 100 SEO"
                  className="h-auto w-full rounded-lg border border-white/10"
                />

                <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
                  Supplied mobile PageSpeed Insights screenshot after the
                  reported optimisation phase.
                </figcaption>
              </figure>
            </section>

            <section
              id="plan"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                RankVelt&apos;s Recommended Growth Plan
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Build on the Local Visibility Already Earned
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The supplied evidence shows meaningful local search demand and
                stronger mobile audit quality. The next stage should focus on
                protecting what already works, improving click quality, and
                making every priority service page easier for customers to act
                on.
              </p>

              <div className="mt-7">
                {nextSteps.map((step) => (
                  <div
                    key={step.number}
                    className="grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[52px_1fr]"
                  >
                    <span className=" text-2xl font-bold text-primary">
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
                This case study is based on three supplied screenshots: Google
                Search Console performance data, a before mobile PageSpeed
                Insights report, and an after mobile PageSpeed Insights report.
                It confirms the visible metrics only.
              </p>

              <p className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-white/80">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                />
                It does not claim revenue, leads, booked jobs, insurance
                approvals, individual keyword positions, exact implementation
                work, or a confirmed post-update field-data Core Web Vitals
                pass.
              </p>
            </section>
          </div>

          <section
            id="faqs"
            className="scroll-mt-28 mx-auto mt-20 max-w-3xl border-t border-white/10 pt-14"
          >
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              ClearRide Auto Glass FAQs
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
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
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Local SEO by RankVelt
                </p>

                <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Turn Local Search Demand Into Better Service Enquiries
                </h2>

                <p className="mt-4 text-base leading-relaxed text-white/85">
                  RankVelt helps local service businesses improve search
                  visibility, service-page relevance, local content,
                  technical SEO, mobile usability, and clearer conversion
                  paths for customers ready to take action.
                </p>
              </div>

              <Link
                to="/strategy-call?package=Local%20SEO%20Opportunity%20Check"
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

export default ClearRide;