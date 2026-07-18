import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuditSection = () => {
  const navigate = useNavigate();

  const points = [
    "Search visibility review",
    "Technical & on-page gaps",
    "Local or eCommerce opportunities",
    "Clear next-step priorities",
  ];

  const handleAuditRequest = () => {
    navigate(
      `/strategy-call?package=${encodeURIComponent(
        "Free SEO Opportunity Check",
      )}`,
    );
  };

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-8 shadow-2xl backdrop-blur-md md:p-10"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                Free SEO Opportunity Check
              </div>

              <h3 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                Find out what is holding your{" "}
                <span className="text-primary">website back.</span>
              </h3>

              <p className="max-w-2xl text-lg leading-relaxed text-white/70">
                Share your website and business details. RankVelt will identify
                the most important visibility, website, technical, or
                conversion opportunities worth addressing first.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-4 lg:justify-start">
                {points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white/65"
                  >
                    <CheckCircle2 size={14} className="text-primary" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 text-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAuditRequest}
                className="group flex items-center gap-3 rounded-2xl bg-primary px-10 py-5 text-[15px] font-black uppercase tracking-widest text-black shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] transition-all hover:shadow-primary/40"
              >
                Request My SEO Check
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </motion.button>

              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                No obligation · Response within 48hrs
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AuditSection;