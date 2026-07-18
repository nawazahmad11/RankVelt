import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

type ServiceFaq = {
  question: string;
  answer: string;
};

type RelatedService = {
  title: string;
  description: string;
  path: string;
};

export type SeoServicePageConfig = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  ctaPackage: string;
  focusAreas: string[];
  overviewTitle: string;
  overviewParagraphs: string[];
  deliverablesTitle: string;
  deliverables: string[];
  audienceTitle: string;
  audience: string[];
  processTitle: string;
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  faqs: ServiceFaq[];
  relatedServices: RelatedService[];
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

const SeoServiceTemplate = ({
  config,
}: {
  config: SeoServicePageConfig;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = config.metaTitle;

    setMetaByName("description", config.metaDescription);
    setCanonical(`${SITE_URL}${config.slug}`);

    document.getElementById("rankvelt-service-schema")?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-service-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: config.h1,
          description: config.metaDescription,
          url: `${SITE_URL}${config.slug}`,
          provider: {
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

  const requestStrategyCall = () => {
    navigate(
      `/strategy-call?package=${encodeURIComponent(config.ctaPackage)}`,
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#090611] pt-40 text-white sm:pt-44">
      <section className="relative overflow-hidden pb-16 sm:pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/12 blur-[150px]" />
          <div className="absolute right-[-180px] top-[40px] h-[340px] w-[340px] rounded-full bg-purple-500/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-primary"
          >
            <ArrowLeft size={15} />
            Back to RankVelt
          </Link>

          <div className="mx-auto mt-12 max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              {config.eyebrow}
            </span>

            <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              {config.h1}
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg md:text-xl">
              {config.intro}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={requestStrategyCall}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-black transition-transform hover:scale-[1.02]"
              >
                Request a Strategy Call
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() =>
                  document.getElementById("service-overview")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-white/75 transition-colors hover:border-primary/35 hover:text-primary"
              >
                Explore the Service
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-3">
              {config.focusAreas.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white/65"
                >
                  <CheckCircle2 size={15} className="text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="service-overview"
        className="scroll-mt-32 border-y border-white/[0.06] bg-black/20 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                SEO Strategy With Clear Priorities
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                {config.overviewTitle}
              </h2>

              <div className="mt-6 space-y-4 text-base leading-relaxed text-white/62">
                {config.overviewParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileSearch size={21} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-white">
                {config.deliverablesTitle}
              </h2>

              <ul className="mt-6 space-y-3.5">
                {config.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target size={21} />
              </div>

              <h2 className="mt-5 text-3xl font-black text-white">
                {config.audienceTitle}
              </h2>

              <ul className="mt-6 space-y-3.5">
                {config.audience.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/65"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.09] via-white/[0.02] to-purple-500/[0.08] p-6 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-primary">
                <ShieldCheck size={21} />
              </div>

              <h2 className="mt-5 text-3xl font-black text-white">
                Practical, Ethical SEO Work
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
                RankVelt does not sell guaranteed rankings or shortcut tactics.
                The focus is on useful pages, clean structure, technical
                improvements, search intent, user experience, and sustainable
                visibility.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                The work is prioritised around your market, current website,
                competition, business model, and the actions visitors need to
                take after finding you.
              </p>

              <button
                type="button"
                onClick={requestStrategyCall}
                className="mt-7 inline-flex items-center gap-2 text-sm font-black text-primary transition-transform hover:translate-x-1"
              >
                Discuss Your SEO Priorities
                <ArrowRight size={16} />
              </button>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-black/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              How the Service Works
            </p>

            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              {config.processTitle}
            </h2>
          </div>

          <div className="relative mt-10 border-l border-primary/25 pl-7 sm:pl-9">
            {config.process.map((item, index) => (
              <article
                key={item.step}
                className={`relative ${
                  index !== config.process.length - 1 ? "pb-10" : ""
                }`}
              >
                <span className="absolute -left-[39px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-[#090611] text-[9px] font-black text-primary sm:-left-[47px]">
                  {item.step}
                </span>

                <div className="grid gap-2 sm:grid-cols-[150px_1fr] sm:gap-7">
                  <h3 className="text-xl font-black text-white">
                    {item.title}
                  </h3>

                  <p className="max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Service FAQs
            </p>

            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              Questions About {config.eyebrow}
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {config.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 open:border-primary/35"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-black text-white sm:text-lg">
                  {faq.question}
                  <ChevronDown
                    size={19}
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  />
                </summary>

                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-black/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles size={20} />
                </div>

                <h2 className="mt-5 text-3xl font-black text-white">
                  Explore Related RankVelt Services
                </h2>

                <p className="mt-3 leading-relaxed text-white/60">
                  Your best next step depends on your website, market, and
                  growth goals. Explore a related service or request a focused
                  review.
                </p>
              </div>

              <button
                type="button"
                onClick={requestStrategyCall}
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-black transition-transform hover:scale-[1.02]"
              >
                Get a Free SEO Audit
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {config.relatedServices.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  className="group rounded-2xl border border-white/[0.08] bg-black/20 p-5 transition-all hover:border-primary/35 hover:bg-primary/[0.04]"
                >
                  <h3 className="text-xl font-black text-white transition-colors group-hover:text-primary">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {service.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                    Explore service
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-[130px]" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Search className="mx-auto text-primary" size={25} />

          <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
            Ready to Discuss Your Search Growth?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            Share your website and goals. RankVelt will help you identify the
            right service, priority opportunities, and a practical route
            forward.
          </p>

          <button
            type="button"
            onClick={requestStrategyCall}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-black transition-transform hover:scale-[1.02]"
          >
            Request My SEO Opportunity Check
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default SeoServiceTemplate;