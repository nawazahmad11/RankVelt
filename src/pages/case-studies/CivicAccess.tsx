import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

const GSC_IMAGE = "/case-studies/civic-gsc.webp";
const TRAFFIC_IMAGE = "/case-studies/civic-traffic.webp";
const SPEED_IMAGE = "/case-studies/civic-speed.webp";

const searchMetrics = [
  {
    value: "32.3K",
    label: "Organic clicks",
    detail: "Google Web Search clicks recorded in 28 days.",
  },
  {
    value: "439K",
    label: "Search impressions",
    detail: "Times the platform appeared in Google Search results.",
  },
  {
    value: "7.4%",
    label: "Average CTR",
    detail: "A strong rate of users choosing the result from search.",
  },
  {
    value: "3.7",
    label: "Average position",
    detail: "Average placement across recorded search impressions.",
  },
];

const trafficMetrics = [
  {
    value: "94.9K",
    label: "Estimated organic traffic",
    detail: "Third-party SEO tool estimate shown in the supplied report.",
  },
  {
    value: "$4.1K",
    label: "Estimated traffic value",
    detail: "Third-party estimate, not confirmed revenue or earnings.",
  },
  {
    value: "97",
    label: "Mobile performance",
    detail: "Google PageSpeed Insights mobile audit score.",
  },
  {
    value: "100",
    label: "SEO audit score",
    detail: "Google PageSpeed Insights mobile audit score.",
  },
];

const focusAreas = [
  {
    title: "Answer the real task behind the search",
    description:
      "Citizens do not search only for information. They usually need to complete a task. They may want to check a document, follow an application, understand an error, or find the right official next step. The content needs to answer that task quickly.",
  },
  {
    title: "Create clear routes between related questions",
    description:
      "A public-service information platform often covers connected topics. Search, application progress, eligibility, document updates, rejected requests, and support guidance should connect naturally. This helps users continue without returning to Google for every next step.",
  },
  {
    title: "Keep trust language visible",
    description:
      "People dealing with public-service information need clarity. The platform should explain its role, avoid acting like an official authority, and direct users to the relevant official service when a formal action or final verification is required.",
  },
  {
    title: "Protect the mobile experience",
    description:
      "Many users access essential information from a phone. Fast loading, readable text, clear headings, accessible controls, and simple page navigation reduce friction when the visitor needs an answer quickly.",
  },
];

const nextSteps = [
  {
    number: "01",
    title: "Expand pages with proven search demand",
    description:
      "The 439K impressions show that Google is already finding demand across the platform. The next move is to identify pages and topics with strong impressions, then improve their clarity, completeness, and internal links.",
  },
  {
    number: "02",
    title: "Protect high-performing search snippets",
    description:
      "A 7.4% CTR is a valuable signal. Important pages should keep clear titles, accurate descriptions, and a direct explanation of what the user can do after clicking.",
  },
  {
    number: "03",
    title: "Strengthen helpful on-page journeys",
    description:
      "Visitors should move from a general answer to a practical next step. That can include eligibility guidance, application-status information, document requirements, support instructions, or an official-source referral.",
  },
  {
    number: "04",
    title: "Monitor quality as visibility grows",
    description:
      "More organic traffic increases the need for content reviews. Important pages should be checked for outdated steps, broken official links, misleading wording, weak mobile layout, and gaps in user guidance.",
  },
];

const pageFaqs = [
  {
    question: "What does 32.3K organic clicks mean in this case study?",
    answer:
      "It means Google Search Console recorded 32,300 clicks from Web Search during the selected 28-day period. A click represents a user choosing the website from a Google search result.",
  },
  {
    question: "Does an average position of 3.7 mean every page ranked in position 3?",
    answer:
      "No. Google Search Console reports an average position across recorded impressions. Some queries and pages may rank higher, while others may rank lower. It is a broad visibility metric, not one fixed ranking for every keyword.",
  },
  {
    question: "Why is a 7.4% CTR important?",
    answer:
      "CTR shows how often users choose a result after seeing it in Google Search. A 7.4% CTR suggests that many search snippets were relevant and compelling for the queries where the platform appeared.",
  },
  {
    question: "Is the 94.9K traffic figure the same as Google Search Console clicks?",
    answer:
      "No. The 94.9K figure is a third-party estimated organic traffic number shown in the supplied SEO tool screenshot. Google Search Console clicks are first-party search performance data, while third-party traffic figures are estimates.",
  },
  {
    question: "Does a PageSpeed score of 97 prove that every visitor had a fast experience?",
    answer:
      "No. The PageSpeed screenshot shows a mobile Lighthouse audit result from a specific test. Scores can vary by page, device, network, location, and test conditions. It is useful technical evidence, but it is not the same as field data for every user.",
  },
  {
    question: "Does this case study prove leads, revenue, or government approval outcomes?",
    answer:
      "No. This case study confirms the supplied search, third-party visibility, and PageSpeed audit metrics only. It does not claim revenue, leads, application approvals, user outcomes, rankings for individual redacted terms, or official-government affiliation.",
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

const CivicAccess = () => {
  useEffect(() => {
    const pageTitle =
      "Civic Access SEO Case Study: 32.3K Organic Clicks | RankVelt";

    const pageDescription =
      "See how Civic Access reached 32.3K organic clicks, 439K Google impressions, a 7.4% CTR, and a 3.7 average position in 28 days.";

    const pageUrl = `${SITE_URL}/case-studies/civic-access`;

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

    document
      .getElementById("rankvelt-civic-access-schema")
      ?.remove();

    const schemaScript = document.createElement("script");

    schemaScript.id = "rankvelt-civic-access-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline:
            "Civic Access: 32.3K Organic Clicks in 28 Days for a Regional Public-Service Information Platform",
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
            name: "SEO for Public Service Information Websites",
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
              Civic Access · Regional public-service information platform
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              How Civic Access Reached 32.3K Organic Clicks in 28 Days
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
              Civic Access is an independent information platform built for
              people trying to understand public-service processes, document
              checks, application journeys, eligibility questions, and support
              options. In one 28-day Google Search Console reporting period,
              the platform recorded 32.3K organic clicks and 439K impressions.
            </p>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/80">
              The client name and core search terms have been changed for
              confidentiality. The platform is not presented as an official
              government website. It is an independent informational resource
              that helps users understand available processes and find the
              appropriate official next step.
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
              Platform Context
            </a>

            <a href="#growth" className="transition-colors hover:text-primary">
              Growth Signals
            </a>

            <a href="#speed" className="transition-colors hover:text-primary">
              Mobile Performance
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
              alt="Google Search Console report showing 32.3K organic clicks, 439K impressions, 7.4 percent click-through rate, and 3.7 average position over 28 days"
              className="h-auto w-full rounded-lg border border-white/10"
            />

            <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
              Google Search Console Web Search report for the supplied 28-day
              performance window.
            </figcaption>
          </figure>

          <div className="mx-auto mt-16 max-w-3xl">
            <section id="context" className="scroll-mt-28">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Platform Context
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                A Clear Answer Matters When the User Needs Help Quickly
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                Public-service information searches are different from casual
                browsing. The user usually arrives with a specific problem.
                They may need to check a document, understand eligibility,
                follow an application, resolve a rejected request, or locate
                the correct support channel.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                That means the content has to be direct. It should explain the
                process in plain language, show the options available, and
                avoid making the visitor work through long or confusing pages
                before finding the next step.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The platform was structured around these user journeys. It
                covered status checks, application guidance, identity-related
                checks, document details, rejection support, and access to
                official-service routes. This gave Google a clearer content
                structure while also helping visitors find relevant answers
                without unnecessary friction.
              </p>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                What the Search Data Shows
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                Strong Visibility Was Matched With Stronger Click Quality
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The 32.3K clicks and 439K impressions show that Google was
                regularly presenting the platform for a wide group of relevant
                searches. The average position of 3.7 is especially important.
                It suggests that the website achieved strong overall placement
                across the impressions recorded in this report.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                Average position is not a promise that every page or query
                ranked in the same spot. It is a combined metric. Still, it
                gave RankVelt a useful signal: the platform was not only being
                indexed. It was competing near the top of Google results for
                important user-intent searches.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The 7.4% average click-through rate added another positive
                signal. People were seeing the result and choosing it. For an
                information platform, that usually depends on clear page
                titles, helpful descriptions, relevant content, and a search
                result that makes the visitor believe they will find a useful
                answer after clicking.
              </p>
            </section>

            <section
              id="growth"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Independent Visibility Snapshot
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                Third-Party Data Also Showed a Sharp Organic Growth Trend
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The supplied third-party SEO report showed an estimated 94.9K
                organic traffic figure and an estimated traffic value of
                $4.1K. The chart also showed a steep upward trend toward the
                most recent reporting point.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                It is important to read this correctly. Third-party traffic
                tools provide estimates. They are useful for checking market
                visibility and broad trend direction, but they are not a
                replacement for Google Search Console or analytics data. For
                this reason, RankVelt uses the Search Console numbers as the
                primary search-performance proof on this page.
              </p>

              <section className="mt-8 border-y border-white/10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                  {trafficMetrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      className={`py-7 sm:px-5 ${
                        index !== 0
                          ? "border-t border-white/10 sm:border-t-0"
                          : ""
                      } ${
                        index > 0 ? "sm:border-l sm:border-white/10" : ""
                      }`}
                    >
                      <p className="text-3xl font-black tracking-[-0.05em] text-white">
                        {metric.value}
                      </p>

                      <h3 className="mt-2 text-sm font-black text-primary">
                        {metric.label}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {metric.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <figure className="mt-10">
                <img
                  src={TRAFFIC_IMAGE}
                  alt="Third-party organic traffic estimate report showing 94.9K estimated organic traffic, 4.1 thousand dollars estimated traffic value, and an upward growth trend"
                  className="h-auto w-full rounded-lg border border-white/10"
                />

                <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
                  Third-party SEO visibility estimate supplied by the client.
                  Estimated traffic and traffic value are directional metrics,
                  not first-party analytics data.
                </figcaption>
              </figure>
            </section>

            <section
              id="speed"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Mobile Performance
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                Technical Quality Supported a Better Mobile Experience
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                Search growth is stronger when the website works well after the
                click. The supplied mobile PageSpeed Insights screenshot showed
                a 97 Performance score, 93 Accessibility score, 100 Best
                Practices score, and 100 SEO score.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                These scores matter because the audience is likely to use
                mobile devices while looking for time-sensitive information.
                A cleaner mobile experience can make it easier to read
                instructions, move between related pages, and find the right
                next step without delay.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The screenshot is marked as an after-optimisation result. It
                shows a strong laboratory audit for that test. It should not be
                treated as a guarantee that every user had the same loading
                experience or that every field Core Web Vitals threshold passed.
                Real-world performance can change by page, connection, device,
                and visitor location.
              </p>

              <figure className="mt-10">
                <img
                  src={SPEED_IMAGE}
                  alt="Google PageSpeed Insights mobile report showing 97 performance, 93 accessibility, 100 best practices, and 100 SEO"
                  className="h-auto w-full rounded-lg border border-white/10"
                />

                <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
                  Google PageSpeed Insights mobile audit screenshot supplied for
                  the case study.
                </figcaption>
              </figure>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                RankVelt&apos;s SEO Approach
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                Search Growth Came From Clearer Information, Better Structure, and Mobile Usability
              </h2>

              <div className="mt-7">
                {focusAreas.map((area) => (
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
                Next Growth Phase
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                Protect Trust While Scaling What Already Works
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The strongest next step is not publishing content for the sake
                of publishing content. The performance report already points to
                demand. RankVelt would use that demand to improve the pages and
                journeys that have the best chance of helping the user.
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

            <section className="mt-14 border-l-2 border-primary pl-5">
              <h2 className="text-2xl font-black text-white">
                Data Integrity Note
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                This case study is based on three supplied screenshots: Google
                Search Console, a third-party organic visibility report, and a
                Google PageSpeed Insights mobile audit. It confirms the metrics
                visible in those screenshots only.
              </p>

              <p className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-white/80">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                />
                It does not claim revenue, leads, application approvals,
                government affiliation, individual redacted keyword rankings,
                exact implementation tasks, or outcomes that are not visible
                in the supplied evidence.
              </p>
            </section>
          </div>

          <section
            id="faqs"
            className="scroll-mt-28 mx-auto mt-20 max-w-3xl border-t border-white/10 pt-14"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              Civic Access FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
              Understanding the Performance Evidence
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

                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">
                  Build Search Growth Around What Real Users Need
                </h2>

                <p className="mt-4 text-base leading-relaxed text-white/85">
                  RankVelt helps information platforms improve search
                  visibility, content clarity, technical SEO, mobile
                  performance, internal linking, and user journeys that turn
                  organic demand into practical outcomes.
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

export default CivicAccess;