import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ImageOff,
} from "lucide-react";

import { portfolioProjects } from "@/data/portfolioProjects";
import { seoCaseStudies } from "@/data/seoCaseStudyData";

const spotlightProjects = portfolioProjects
  .filter((project) => Boolean(project.thumbnail))
  .slice(0, 9);

const latestSeoCaseStudies = seoCaseStudies.slice(-3).reverse();

interface PortfolioSectionProps {
  onProjectSelect: (id: string) => void;
}

const PortfolioSection = ({ onProjectSelect }: PortfolioSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const activeProject =
    spotlightProjects[activeIndex] || spotlightProjects[0];

  useEffect(() => {
    if (spotlightProjects.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        return (currentIndex + 1) % spotlightProjects.length;
      });
    }, 6000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setImageFailed(false);
  }, [activeProject?.id]);

  if (!activeProject) {
    return null;
  }

  const spotlightPoints = [
    "Clearer visual hierarchy",
    "Product discovery support",
    "Mobile-first browsing",
  ];

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-[#0b0615] py-20 sm:py-24"
    >
      {/* SEO CASE STUDIES */}
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
            RankVelt Case Studies
          </p>

          <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            SEO Results Backed by{" "}
            <span className="text-gradient-gold">Search Data.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            A focused selection of organic search growth and technical SEO work
            supported by Google Search Console and website performance evidence.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestSeoCaseStudies.map((study, index) => (
            <motion.article
              key={study.path}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={study.path}
                aria-label={`Read ${study.title} SEO case study`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-white/[0.05]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={study.image}
                    alt={`${study.title} SEO performance report`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-black/75 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-primary backdrop-blur-sm">
                    SEO Case Study
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                    {study.category}
                  </p>

                  <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                    {study.title}
                  </h3>

                  <p className="mt-5 text-2xl font-black tracking-tight text-white">
                    {study.result}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    {study.period}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all group-hover:gap-3">
                    Read Case Study
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/case-studies"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/[0.06] px-5 py-2.5 text-xs font-black text-primary transition-all hover:border-primary hover:bg-primary/10"
          >
            View All Case Studies
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* SHOPIFY FEATURED WORK */}
      <div className="relative mx-auto mt-24 max-w-7xl border-t border-white/10 px-6 pt-14">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
            Shopify Store Design
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
            Featured Ecommerce Store Work
          </h2>

          <p className="mt-4 text-base leading-relaxed text-white/70">
            Selected Shopify design concepts focused on product discovery,
            visual trust, mobile usability, and clearer buying journeys.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                Featured Project
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                  aria-live="polite"
                >
                  <h3 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                    {activeProject.title}
                  </h3>

                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                    {activeProject.description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {spotlightPoints.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-2 text-xs leading-relaxed text-white/75"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-primary"
                        />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onProjectSelect(activeProject.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-black transition-transform hover:scale-[1.02]"
                    >
                      View Project Details
                      <ArrowRight size={15} />
                    </button>

                    <Link
                      to="/case-studies"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-xs font-bold text-white/80 transition-colors hover:border-primary/35 hover:text-primary"
                    >
                      Explore More Work
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-2">
                {spotlightProjects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${project.title} project`}
                    aria-pressed={activeIndex === index}
                    className={`h-1.5 rounded-full transition-all ${
                      activeIndex === index
                        ? "w-10 bg-primary"
                        : "w-4 bg-white/15 hover:bg-white/35"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30"
                >
                  {!imageFailed ? (
                    <img
                      src={activeProject.thumbnail}
                      alt={`${activeProject.title} featured website project`}
                      loading="lazy"
                      decoding="async"
                      onError={() => setImageFailed(true)}
                      className="aspect-[16/10] h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[16/10] flex-col items-center justify-center px-8 text-center">
                      <ImageOff className="h-9 w-9 text-primary" />

                      <p className="mt-4 text-lg font-black text-white">
                        {activeProject.title}
                      </p>

                      <p className="mt-2 text-sm text-white/60">
                        Website project preview
                      </p>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-primary backdrop-blur-md">
                    {activeProject.category}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;