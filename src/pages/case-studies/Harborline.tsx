import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const SITE_URL = "https://www.rankvelt.com";

const GSC_IMAGE = "/case-studies/harborline-gsc.webp";
const SPEED_IMAGE = "/case-studies/clear-ride-after.webp";

const searchMetrics = [
  {
    value: "18.7K",
    label: "Organic clicks",
    detail: "Google Web Search clicks recorded during the selected 28-day period.",
  },
  {
    value: "387K",
    label: "Search impressions",
    detail: "Times the website appeared in Google Search during the same period.",
  },
  {
    value: "4.8%",
    label: "Average CTR",
    detail: "Search-result engagement from the visibility already earned.",
  },
  {
    value: "5.8",
    label: "Average position",
    detail: "Average placement across all recorded Google Search impressions.",
  },
];

const speedMetrics = [
  {
    value: "91",
    label: "Performance",
    detail: "Mobile audit score in the supplied PageSpeed Insights report.",
  },
  {
    value: "93",
    label: "Accessibility",
    detail: "Mobile audit score for accessibility checks.",
  },
  {
    value: "100",
    label: "Best Practices",
    detail: "Mobile audit score for tested best-practice checks.",
  },
  {
    value: "100",
    label: "SEO",
    detail: "Mobile audit score for technical SEO checks.",
  },
];

const growthPriorities = [
  {
    number: "01",
    title: "Protect pages already gaining search visibility",
    description:
      "The strongest first step is to review the pages already earning impressions and clicks. These pages have proven search demand, so they should be kept accurate, useful, easy to navigate, and aligned with the promise made in Google Search.",
  },
  {
    number: "02",
    title: "Study high-impression searches with lower click volume",
    description:
      "A 4.8% CTR is a useful starting point, but it also creates room for improvement. High-impression pages should be checked for clearer page titles, stronger descriptions, better opening copy, and a closer match with search intent.",
  },
  {
    number: "03",
    title: "Improve the experience after the click",
    description:
      "Search visibility only matters when visitors find what they need after landing. Clear structure, readable content, useful internal links, accessible actions, and a simple next step can help turn organic traffic into more meaningful engagement.",
  },
  {
    number: "04",
    title: "Keep technical quality under regular review",
    description:
      "The supplied mobile audit is strong, but performance should be monitored over time. Different pages, devices, visitors, network conditions, and content updates can change the real experience.",
  },
];

const pageFaqs = [
  {
    question: "What does 18.7K organic clicks mean in this case study?",
    answer:
      "It means Google Search Console recorded 18,700 clicks from Google Web Search during the selected 28-day reporting period. A click happens when someone chooses the website from a Google search result.",
  },
  {
    question: "Does an average position of 5.8 mean every keyword ranked in position 5?",
    answer:
      "No. Google Search Console reports an average position across all recorded impressions. Some pages and queries may have appeared higher, while others may have appeared lower. It is a broad visibility metric rather than one fixed ranking.",
  },
  {
    question: "Why is a 4.8% click-through rate important?",
    answer:
      "CTR shows how often searchers choose a website after seeing it in Google Search. It should be reviewed alongside search intent, ranking position, competition, brand familiarity, and search-result features. It can also highlight pages where clearer titles and descriptions may earn more visits.",
  },
  {
    question: "What does the PageSpeed Performance score of 91 show?",
    answer:
      "It shows a strong mobile audit result in the supplied PageSpeed Insights report. It is useful technical evidence, but it represents a tested audit snapshot and does not guarantee that every visitor experienced the same loading performance.",
  },
  {
    question: "Why does the PageSpeed report say there is no real-user data?",
    answer:
      "The supplied PageSpeed screenshot shows no field data for the page. That means the visible scores are audit-based results. Field data, when available, reflects real visitor experiences across different devices, networks, and locations.",
  },
  {
    question: "Does this case study prove leads, sales, or individual keyword rankings?",
    answer:
      "No. This case study confirms only the metrics visible in the supplied Google Search Console and PageSpeed Insights screenshots. It does not claim leads, revenue, sales, conversions, individual keyword positions, or exact implementation work not shown in the evidence.",
  },
  {
    question: "How should a business actually use numbers like these?",
    answer:
      "Use them to decide where to work next. Pages earning impressions have proven demand, so they deserve accuracy checks and better internal links first. Pages with impressions but weak clicks need clearer titles and descriptions. Numbers like these are a work plan, not a trophy. RankVelt reviews them with clients every month so effort stays on the pages with real search demand behind them.",
  },
  {
    question: "Does a strong mobile audit score guarantee more organic traffic?",
    answer:
      "No. A strong audit supports a better experience after the click, and that protects the value of traffic. It does not create demand on its own. Traffic grows when relevant pages match real searches and earn visibility. Technical quality and content relevance have to move together, which is why this case study reports both kinds of evidence side by side.",
  },
];

const keyTakeaways = [
  "18.7K organic clicks and 387K impressions in one 28-day Google Search Console period.",
  "Clicks and impressions rose together across the window, which is a stronger momentum signal than either metric alone.",
  "A 4.8% average CTR and 5.8 average position show solid engagement from the visibility earned.",
  "The mobile audit showed 91 Performance, 93 Accessibility, and 100 for Best Practices and SEO.",
  "No real-user field data was available, so the audit scores are a tested snapshot, not a per-visitor guarantee.",
  "The evidence covers search and audit metrics only. It does not claim leads, sales, or revenue.",
];

const moreCaseStudies = [
  {
    title: "Civic Access",
    href: "/case-studies/civic-access",
    description:
      "32.3K organic clicks in 28 days for a public-service information platform, with a 3.7 average position.",
  },
  {
    title: "Clear Ride Auto Glass",
    href: "/case-studies/clear-ride-auto-glass",
    description:
      "18.4K organic clicks in 28 days for a local auto glass service, with a stronger mobile audit after optimisation.",
  },
  {
    title: "Bluebridge Partners",
    href: "/case-studies/bluebridge",
    description:
      "6.68K organic clicks in three months, a 13.6% average CTR, and clear mobile audit progress.",
  },
  {
    title: "Product Discovery at Scale",
    href: "/case-studies/product-discovery-at-scale",
    description:
      "An eCommerce SEO case study with 26.9K organic clicks and 1.82M impressions over three months.",
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

const Harborline = () => {
  useEffect(() => {
    const pageTitle =
      "Harborline SEO Case Study: 18.7K Organic Clicks | RankVelt";

    const pageDescription =
      "See how Harborline reached 18.7K organic clicks, 387K Google Search impressions, a 4.8% CTR, and a 5.8 average position in 28 days.";

    const pageUrl = `${SITE_URL}/case-studies/harborline`;

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

    document.getElementById("rankvelt-harborline-schema")?.remove();

    const schemaScript = document.createElement("script");

    schemaScript.id = "rankvelt-harborline-schema";
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline:
            "Harborline: 18.7K Organic Clicks in 28 Days With Strong Mobile Audit Quality",
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
      <div className="mx-auto max-w-6xl px-6">
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
              Organic Growth & Technical SEO Case Study
            </p>

            <p className="mt-5 text-sm font-semibold text-white/75">
              Harborline · Client name changed for confidentiality
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              18.7K Organic Clicks in 28 Days From Search Visibility That Kept Growing
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
              Harborline is a confidential client website supported by
              RankVelt. In one 28-day Google Search Console reporting period,
              the website recorded 18.7K organic clicks, 387K impressions, a
              4.8% average click-through rate, and a 5.8 average position.
            </p>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/80">
              The client industry, location, website, and target search terms
              are intentionally withheld. This case study focuses on the
              search and technical performance evidence visible in the supplied
              reports only.
            </p>
          </header>

          <nav
            aria-label="Case study sections"
            className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-y border-white/10 py-4 text-sm font-semibold text-white/80"
          >
            <a href="#results" className="transition-colors hover:text-primary">
              Results
            </a>

            <a href="#growth" className="transition-colors hover:text-primary">
              Search Growth
            </a>

            <a href="#speed" className="transition-colors hover:text-primary">
              Mobile Audit
            </a>

            <a href="#plan" className="transition-colors hover:text-primary">
              Next Priorities
            </a>

            <a href="#lessons" className="transition-colors hover:text-primary">
              Lessons
            </a>

            <a href="#faqs" className="transition-colors hover:text-primary">
              FAQs
            </a>
          </nav>

          <section
            aria-label="Key takeaways"
            className="mt-10 rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-primary">
              Key Takeaways
            </h2>

            <ul className="mt-4 space-y-3">
              {keyTakeaways.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/85"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

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
              alt="Google Search Console report showing 18.7K clicks, 387K impressions, 4.8 percent CTR, and 5.8 average position over 28 days"
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-lg border border-white/10"
            />

            <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
              Google Search Console Web Search performance report for the
              supplied 28-day period.
            </figcaption>
          </figure>

          <div className="mx-auto mt-16 max-w-3xl">
            <section id="growth" className="scroll-mt-28">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Search Growth
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                The Search Trend Rose Across the Reporting Window
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The report showed a clear rise in both clicks and impressions
                over the selected period. Search visibility increased first,
                followed by stronger click activity as the website appeared
                more often for relevant searches.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                This is an important pattern. Impressions show that Google is
                presenting pages more frequently. Clicks show that users are
                choosing those results. When both measures move upward
                together, it gives a stronger view of organic momentum than
                either metric alone.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The average position of 5.8 added useful context. It does not
                mean every search query ranked in position five or six. Google
                Search Console combines data from many pages and searches.
                However, it suggests the website was regularly competing in
                strong search placements across its recorded impressions.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The 4.8% average CTR showed that the search snippets were
                earning clicks from the visibility available. That number
                should always be judged alongside query type, competition,
                ranking position, and search-result features. Still, it gives
                RankVelt a practical base for finding pages where stronger
                titles, descriptions, and landing-page relevance could earn
                even more traffic.
              </p>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                What the Evidence Suggests
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Existing Visibility Should Shape the Next SEO Decisions
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The best SEO priorities are usually not based on guesses.
                Search data already shows which pages are being surfaced,
                where users are clicking, and where the website has potential
                to become more useful after the search result.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                For Harborline, the goal is not to add pages simply to increase
                page count. The priority is to protect pages that already earn
                attention, improve the experience after the click, and use
                search data to identify the clearest growth opportunities.
              </p>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                How to Read These Numbers
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Each Metric Answers a Different Question
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                Impressions answer the visibility question. Google showed
                this website 387K times, so its pages were part of the
                conversation for a large set of searches. A rising
                impressions trend usually means Google is testing the site
                on more queries, or the site is holding stronger positions
                on the queries it already had.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                Clicks answer the relevance question. 18.7K people chose
                this website after seeing it. A click is a small vote that
                the title, description, and brand looked more useful than
                the results around it. That is why snippet quality matters
                as much as ranking position.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                CTR and average position answer the quality question
                together. A 4.8% CTR at a 5.8 average position is a healthy
                pairing. It suggests the site was not buying visibility with
                misleading titles. The clicks came from results that matched
                what searchers actually wanted.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                Read this way, a Search Console report becomes a work plan
                instead of a scoreboard. We use the same reading method in
                our{" "}
                <Link
                  to="/blog/seo-growth-case-study-lessons"
                  className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  SEO growth case study lessons
                </Link>
                , where clicks, impressions, CTR, and position are broken
                down the way we review them with clients.
              </p>
            </section>

            <section className="mt-14 border-t border-white/10 pt-14">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Mobile Audit
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                The Supplied Mobile Audit Showed Strong Technical Quality
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The supplied PageSpeed Insights mobile report showed a
                Performance score of 91, an Accessibility score of 93, and
                scores of 100 for both Best Practices and SEO.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                These are useful signals because technical quality affects what
                happens after someone clicks from Google. A page should be
                readable, stable, accessible, and easy to use on a mobile
                device. These details support the user experience and help
                protect the value of organic search traffic.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The screenshot also showed that no real-user field data was
                available for this page. That means the visible scores should
                be read as audit-based results. They show a strong tested
                snapshot, but they do not prove the same experience for every
                visitor, device, network, or page on the website.
              </p>

              <section className="mt-8 border-y border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  {speedMetrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      className={`py-6 ${
                        index > 1 ? "border-t border-white/10 sm:border-t-0" : ""
                      } ${
                        index > 0 ? "border-l border-white/10" : ""
                      }`}
                    >
                      <p className="text-center text-3xl font-black text-primary">
                        {metric.value}
                      </p>

                      <p className="mt-2 text-center text-[10px] font-black uppercase tracking-wide text-white/80">
                        {metric.label}
                      </p>

                      <p className="mx-auto mt-3 max-w-[140px] text-center text-xs leading-relaxed text-white/65">
                        {metric.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <figure className="mt-10">
                <img
                  src={SPEED_IMAGE}
                  alt="PageSpeed Insights mobile audit screenshot shown as a visual placeholder"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-lg border border-white/10"
                />

                <figcaption className="mt-3 text-xs leading-relaxed text-white/70">
                  Supplied Google PageSpeed Insights mobile audit screenshot.
                </figcaption>
              </figure>
            </section>

            <section
              id="plan"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                RankVelt&apos;s Next Priorities
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Keep the Search Momentum While Improving What Matters After the Click
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The supplied reports show growing organic visibility and strong
                mobile audit quality. The next stage should focus on improving
                the pages and journeys that already have proof of search demand.
              </p>

              <div className="mt-7">
                {growthPriorities.map((priority) => (
                  <div
                    key={priority.number}
                    className="grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[52px_1fr]"
                  >
                    <span className="text-2xl font-black text-primary">
                      {priority.number}
                    </span>

                    <div>
                      <h3 className="text-xl font-black text-white">
                        {priority.title}
                      </h3>

                      <p className="mt-2 text-base leading-relaxed text-white/85">
                        {priority.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="lessons"
              className="scroll-mt-28 mt-14 border-t border-white/10 pt-14"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                Lessons for Similar Businesses
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                What Other Businesses Can Learn From This Data
              </h2>

              <p className="mt-5 text-base leading-relaxed text-white/85">
                The first lesson is to protect momentum. When impressions
                and clicks rise together, the worst move is a random
                redesign or a wave of untested new pages. The better move
                is to guard the pages already earning attention and improve
                them carefully, one change at a time.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The second lesson is that connections between pages carry
                growth. A visitor who lands from search should find a clear
                path to the next useful page, not a dead end. Planned{" "}
                <Link
                  to="/blog/internal-linking-seo-ai"
                  className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  internal linking
                </Link>{" "}
                turns one good page into a stronger whole website, and it
                helps Google understand which pages deserve the most
                attention.
              </p>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                The third lesson is to keep technical quality boring and
                consistent. A 91 Performance score is not a finish line. It
                is a snapshot that needs defending as content grows. RankVelt
                builds that discipline into its{" "}
                <Link
                  to="/technical-seo-services"
                  className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  technical SEO services
                </Link>{" "}
                and its monthly reporting. If you want the same clarity on
                your own numbers first, start with our{" "}
                <Link
                  to="/seo-audit-services"
                  className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  SEO audit services
                </Link>
                .
              </p>
            </section>

            <section className="mt-14 border-l-2 border-primary pl-5">
              <h2 className="text-2xl font-black text-white">
                Evidence and Scope Note
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/80">
                This case study is based on two supplied screenshots: a Google
                Search Console Web Search report and a Google PageSpeed Insights
                mobile audit. The case study confirms the visible metrics only.
              </p>

              <p className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-white/80">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                />
                It does not claim client identity, industry, location, revenue,
                leads, sales, conversion results, individual keyword rankings,
                exact implementation work, or guaranteed future performance.
              </p>
            </section>
          </div>

          <section
            id="faqs"
            className="scroll-mt-28 mx-auto mt-20 max-w-3xl border-t border-white/10 pt-14"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              Harborline FAQs
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
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

          <section className="mx-auto mt-20 max-w-3xl border-t border-white/10 pt-14">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              More RankVelt Case Studies
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              See How Other Websites Turned Search Data Into Growth
            </h2>

            <div className="mt-8">
              {moreCaseStudies.map((study) => (
                <Link
                  key={study.href}
                  to={study.href}
                  className="group block border-b border-white/10 py-6 first:border-t"
                >
                  <h3 className="flex items-center justify-between gap-4 text-xl font-black text-white transition-colors group-hover:text-primary">
                    {study.title}
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
                    />
                  </h3>

                  <p className="mt-2 text-base leading-relaxed text-white/85">
                    {study.description}
                  </p>
                </Link>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-white/75">
              Or browse the full{" "}
              <Link
                to="/case-studies"
                className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
              >
                case studies library
              </Link>{" "}
              for every published result.
            </p>
          </section>

          <section className="mt-20 border-t border-white/10 pt-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                  SEO by RankVelt
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                  Use the Search Demand You Already Have More Effectively
                </h2>

                <p className="mt-4 text-base leading-relaxed text-white/85">
                  RankVelt helps businesses improve organic visibility,
                  technical SEO, content relevance, internal linking, page
                  experience, and conversion paths for visitors with real
                  search intent.
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

export default Harborline;