import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Code2,
  Layers3,
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

type CaseStudyLink = {
  title: string;
  description: string;
  path: string;
};

export type ShopifySupportServiceConfig = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  availabilityLabel: string;
  h1: string;
  intro: string;
  primaryCta: string;

  comparisonTitle: string;
  commonChallenges: string[];
  rankVeltApproach: string[];

  capabilitiesTitle: string;
  capabilitiesIntro: string;
  capabilities: string[];

  bestForTitle: string;
  bestFor: string[];

  seoImpactTitle: string;
  seoImpact: string[];

  caseStudy: CaseStudyLink;
  faqs: ServiceFaq[];
};

const ShopifySupportServiceTemplate = ({
  config,
}: {
  config: ShopifySupportServiceConfig;
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

    canonicalElement.href = `${SITE_URL}${config.path}`;

    const schemaId =
      "rankvelt-shopify-support-schema";

    document.getElementById(schemaId)?.remove();

    const schemaScript =
      document.createElement("script");

    schemaScript.id = schemaId;
    schemaScript.type = "application/ld+json";

    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: config.h1,
          serviceType: config.eyebrow,
          description: config.metaDescription,
          url: `${SITE_URL}${config.path}`,
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
    <main className="min-h-screen overflow-hidden bg-[#0b0b0c] pt-28 text-white">
      <section className="relative overflow-hidden pb-20 pt-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[580px] w-[580px] -translate-x-1/2 rounded-full bg-[#f9a825]/10 blur-[150px]" />
          <div className="absolute right-[-120px] top-[140px] h-[380px] w-[380px] rounded-full bg-purple-500/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-[#f9a825]"
            >
              <ArrowLeft size={15} />
              Back to RankVelt
            </Link>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f9a825]/20 bg-[#f9a825]/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#f9a825]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              {config.availabilityLabel}
            </span>
          </div>

          <div className="mx-auto mt-16 max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-[#f9a825]/25 bg-[#f9a825]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#f9a825]">
              {config.eyebrow}
            </span>

            <h1 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl md:text-6xl">
              {config.h1}
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-white/65 md:text-xl">
              {config.intro}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openStrategyForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffbd59] via-[#f9a825] to-[#f57c00] px-7 py-4 text-sm font-black text-[#1c1002] transition-transform hover:scale-[1.03]"
              >
                {config.primaryCta}
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("capabilities")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-bold text-white/80 transition-colors hover:border-[#f9a825]/40 hover:text-[#f9a825]"
              >
                Explore Capabilities
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-black/25 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-black sm:text-4xl">
            {config.comparisonTitle}
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-red-500/15 bg-red-500/[0.03] p-7">
              <Search className="text-red-400" />

              <h3 className="mt-5 text-2xl font-black">
                Common Challenges
              </h3>

              <ul className="mt-6 space-y-4">
                {config.commonChallenges.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-white/65"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-red-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-[#f9a825]/20 bg-[#f9a825]/[0.035] p-7">
              <ShieldCheck className="text-[#f9a825]" />

              <h3 className="mt-5 text-2xl font-black">
                The RankVelt Approach
              </h3>

              <ul className="mt-6 space-y-4">
                {config.rankVeltApproach.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-white/70"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#f9a825]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="capabilities"
        className="scroll-mt-32 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Code2 className="mx-auto text-[#f9a825]" />

            <h2 className="mt-5 text-3xl font-black sm:text-4xl">
              {config.capabilitiesTitle}
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/65">
              {config.capabilitiesIntro}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {config.capabilities.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
              >
                <Layers3 className="text-[#f9a825]" />

                <p className="mt-4 text-sm font-semibold leading-relaxed text-white/75">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-black/25 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
            <Target className="text-[#f9a825]" />

            <h2 className="mt-5 text-2xl font-black">
              {config.bestForTitle}
            </h2>

            <ul className="mt-6 space-y-4">
              {config.bestFor.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-white/70"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#f9a825]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
            <Sparkles className="text-[#f9a825]" />

            <h2 className="mt-5 text-2xl font-black">
              {config.seoImpactTitle}
            </h2>

            <ul className="mt-6 space-y-4">
              {config.seoImpact.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-white/70"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#f9a825]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-[#f9a825]/20 bg-[#f9a825]/[0.035] p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f9a825]">
              Related Case Study
            </p>

            <h2 className="mt-4 text-3xl font-black">
              {config.caseStudy.title}
            </h2>

            <p className="mt-4 max-w-3xl leading-relaxed text-white/65">
              {config.caseStudy.description}
            </p>

            <Link
              to={config.caseStudy.path}
              className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#f9a825]"
            >
              Read Case Study
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-black/25 py-16">
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
                      className={`shrink-0 text-[#f9a825] transition-transform ${
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

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">
            Discuss Your Shopify Project With RankVelt
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/65">
            Share your store, technical challenge, growth
            goal or redesign requirement. RankVelt will
            review the opportunity and outline a focused
            next step.
          </p>

          <button
            type="button"
            onClick={openStrategyForm}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffbd59] via-[#f9a825] to-[#f57c00] px-7 py-4 text-sm font-black text-[#1c1002]"
          >
            {config.primaryCta}
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default ShopifySupportServiceTemplate;