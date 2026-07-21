import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
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

  outcomesTitle: string;
  outcomes: string[];

  faqs: ServiceFaq[];
  relatedServices: RelatedService[];
};

const SeoServiceTemplate = ({
  config,
}: {
  config: SeoServicePageConfig;
}) => {
  const navigate = useNavigate();

  const [openFaqIndex, setOpenFaqIndex] = useState<
    number | null
  >(0);

  useEffect(() => {
    const previousTitle = document.title;

    const existingDescription = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;

    const existingCanonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    const previousDescription =
      existingDescription?.getAttribute("content");

    const previousCanonical =
      existingCanonical?.getAttribute("href");

    document.title = config.metaTitle;

    let descriptionElement = existingDescription;
    const descriptionCreated = !descriptionElement;

    if (!descriptionElement) {
      descriptionElement = document.createElement("meta");
      descriptionElement.name = "description";
      document.head.appendChild(descriptionElement);
    }

    descriptionElement.content = config.metaDescription;

    let canonicalElement = existingCanonical;
    const canonicalCreated = !canonicalElement;

    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }

    canonicalElement.href = `${SITE_URL}${config.slug}`;

    const schemaId = "rankvelt-service-schema";

    document.getElementById(schemaId)?.remove();

    const schemaScript = document.createElement("script");

    schemaScript.id = schemaId;
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
          areaServed: "Worldwide",
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
      document.title = previousTitle;

      if (descriptionElement) {
        if (descriptionCreated) {
          descriptionElement.remove();
        } else if (previousDescription === null) {
          descriptionElement.removeAttribute("content");
        } else if (previousDescription !== undefined) {
          descriptionElement.content = previousDescription;
        }
      }

      if (canonicalElement) {
        if (canonicalCreated) {
          canonicalElement.remove();
        } else if (previousCanonical === null) {
          canonicalElement.removeAttribute("href");
        } else if (previousCanonical !== undefined) {
          canonicalElement.href = previousCanonical;
        }
      }

      schemaScript.remove();
    };
  }, [config]);

  const openStrategyForm = () => {
    navigate(
      "/strategy-call?package=Free%20SEO%20Opportunity%20Check",
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#090611] pt-36 text-white sm:pt-40">
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

            <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-5xl md:text-6xl">
              {config.h1}
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg md:text-xl">
              {config.intro}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openStrategyForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-black transition-transform hover:scale-[1.02]"
              >
                Get a Free SEO Opportunity Check
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("service-overview")
                    ?.scrollIntoView({
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
                  <CheckCircle2
                    size={15}
                    className="text-primary"
                  />
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
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Service Overview
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              {config.overviewTitle}
            </h2>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-white/65">
              {config.overviewParagraphs.map(
                (paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ),
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex items-center gap-3">
              <Target className="text-primary" />

              <h2 className="text-xl font-black">
                {config.deliverablesTitle}
              </h2>
            </div>

            <ul className="mt-6 space-y-4">
              {config.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-white/70"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                  />

                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
            <Search className="text-primary" />

            <h2 className="mt-5 text-2xl font-black">
              {config.audienceTitle}
            </h2>

            <ul className="mt-6 space-y-4">
              {config.audience.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-white/70"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                  />

                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
            <ShieldCheck className="text-primary" />

            <h2 className="mt-5 text-2xl font-black">
              {config.outcomesTitle}
            </h2>

            <ul className="mt-6 space-y-4">
              {config.outcomes.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-white/70"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                  />

                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-black/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Sparkles className="mx-auto text-primary" />

            <h2 className="mt-5 text-3xl font-black sm:text-4xl">
              {config.processTitle}
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {config.process.map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
              >
                <span className="text-xs font-black text-primary">
                  {item.step}
                </span>

                <h3 className="mt-4 text-xl font-black">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-black sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 space-y-3">
            {config.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaqIndex(
                        isOpen ? null : index,
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-primary transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="border-t border-white/10 px-5 py-5 text-sm leading-relaxed text-white/65">
                      {faq.answer}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-black/25 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-black">
            Related RankVelt Services
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {config.relatedServices.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-primary/40"
              >
                <h3 className="text-xl font-black">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {service.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Explore Service
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={openStrategyForm}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-black text-black"
            >
              Get a Free SEO Opportunity Check
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SeoServiceTemplate;