import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Code2,
  ExternalLink,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const SITE_URL = "https://rankvelt.com";

/*
  Existing Calendly URL is intentionally retained.
  Replace it yourself later when your RankVelt booking URL is ready.
*/
const DIRECT_CALL_URL = "https://calendly.com/nawazbuilds-info/30min";

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
  packageName: string;
  primaryCta: string;
  directCta: string;
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const previousTitle = document.title;

    const descriptionElement = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;

    const previousDescription = descriptionElement?.content || "";

    const canonicalElement = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    const previousCanonical = canonicalElement?.href || "";

    document.title = config.metaTitle;

    let activeDescriptionElement = descriptionElement;

    if (!activeDescriptionElement) {
      activeDescriptionElement = document.createElement("meta");
      activeDescriptionElement.name = "description";
      document.head.appendChild(activeDescriptionElement);
    }

    activeDescriptionElement.content = config.metaDescription;

    const canonicalUrl = `${SITE_URL}${config.path}`;

    if (canonicalElement) {
      canonicalElement.href = canonicalUrl;
    }

    const oldSchema = document.getElementById(
      "rankvelt-shopify-support-schema",
    );

    oldSchema?.remove();

    const schemaScript = document.createElement("script");
    schemaScript.id = "rankvelt-shopify-support-schema";
    schemaScript.type = "application/ld+json";
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: config.h1,
          description: config.metaDescription,
          url: canonicalUrl,
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

      if (activeDescriptionElement) {
        activeDescriptionElement.content = previousDescription;
      }

      if (canonicalElement && previousCanonical) {
        canonicalElement.href = previousCanonical;
      }

      schemaScript.remove();
    };
  }, [config]);

  const openStrategyCall = () => {
    navigate(
      `/strategy-call?package=${encodeURIComponent(config.packageName)}`,
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

            <h1 className="mt-7 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
              {config.h1}
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-white/65 md:text-xl">
              {config.intro}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openStrategyCall}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffbd59] via-[#f9a825] to-[#f57c00] px-7 py-4 text-sm font-black text-[#1c1002] transition-transform hover:scale-[1.03]"
              >
                {config.primaryCta}
                <ArrowRight size={17} />
              </button>

              <a
                href={DIRECT_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-bold text-white/80 transition-colors hover:border-[#f9a825]/40 hover:bg-[#f9a825]/10 hover:text-[#f9a825]"
              >
                {config.directCta}
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-black/20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f9a825]">
              The Website Growth Problem
            </p>

            <h2 className="mt-4 text-4xl font-black text-white">
              {config.comparisonTitle}
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-red-500/15 bg-red-500/[0.035] p-7">
              <h3 className="text-2xl font-black text-white">
                Common Website Barriers
              </h3>

              <ul className="mt-7 space-y-4">
                {config.commonChallenges.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/65"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-[#f9a825]/25 bg-[#f9a825]/[0.06] p-7">
              <h3 className="text-2xl font-black text-white">
                RankVelt Approach
              </h3>

              <ul className="mt-7 space-y-4">
                {config.rankVeltApproach.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/75"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[#f9a825]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9a825]/10 text-[#f9a825]">
                <Code2 size={23} />
              </div>

              <p className="mt-6 text-[11px] font-black uppercase tracking-[0.24em] text-[#f9a825]">
                Scope of Support
              </p>

              <h2 className="mt-4 text-4xl font-black text-white">
                {config.capabilitiesTitle}
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                {config.capabilitiesIntro}
              </p>

              <button
                type="button"
                onClick={openStrategyCall}
                className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#f9a825] transition-transform hover:translate-x-1"
              >
                Discuss Your Requirements
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {config.capabilities.map((item, index) => (
                <article
                  key={item}
                  className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6"
                >
                  <span className="text-xs font-black tracking-[0.2em] text-[#f9a825]">
                    0{index + 1}
                  </span>

                  <p className="mt-5 text-lg font-bold leading-snug text-white">
                    {item}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-black/20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9a825]/10 text-[#f9a825]">
                <Target size={23} />
              </div>

              <h2 className="mt-6 text-3xl font-black text-white">
                {config.bestForTitle}
              </h2>

              <ul className="mt-7 space-y-4">
                {config.bestFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/65"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f9a825]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-[#f9a825]/20 bg-gradient-to-br from-[#f9a825]/10 via-white/[0.02] to-purple-500/10 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] text-[#f9a825]">
                <Search size={23} />
              </div>

              <h2 className="mt-6 text-3xl font-black text-white">
                {config.seoImpactTitle}
              </h2>

              <ul className="mt-7 space-y-4">
                {config.seoImpact.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-white/70"
                  >
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-[#f9a825]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f9a825]/10 text-[#f9a825]">
                  <Layers3 size={21} />
                </div>

                <p className="mt-6 text-[11px] font-black uppercase tracking-[0.22em] text-[#f9a825]">
                  Related Website Project
                </p>

                <h2 className="mt-4 text-3xl font-black text-white">
                  {config.caseStudy.title}
                </h2>

                <p className="mt-4 max-w-2xl leading-relaxed text-white/60">
                  {config.caseStudy.description}
                </p>
              </div>

              <Link
                to={config.caseStudy.path}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#f9a825]/35 px-6 py-4 text-sm font-black text-[#f9a825] transition-colors hover:bg-[#f9a825]/10"
              >
                View Project
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-black/20 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f9a825]">
              Service FAQs
            </p>

            <h2 className="mt-4 text-4xl font-black text-white">
              Common Questions Before Starting
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {config.faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === index ? null : index,
                      )
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                  >
                    <span className="text-lg font-black text-white">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-[#f9a825] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/[0.07] px-6 py-5 leading-relaxed text-white/60">
                      {faq.answer}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9a825]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Sparkles className="mx-auto text-[#f9a825]" size={28} />

          <h2 className="mt-6 text-4xl font-black text-white">
            Need Shopify Support That Also Supports Growth?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
            Share your current website, store goals, and technical needs.
            RankVelt will help you identify the highest-priority improvement.
          </p>

          <button
            type="button"
            onClick={openStrategyCall}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffbd59] via-[#f9a825] to-[#f57c00] px-8 py-4 text-sm font-black text-[#1c1002] transition-transform hover:scale-[1.03]"
          >
            Request a Strategy Call
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default ShopifySupportServiceTemplate;