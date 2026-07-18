import { motion } from "framer-motion";
import { CheckCircle2, Briefcase, Trophy, Users } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const AboutSection = () => {
  return (
    <section id="about" className="relative overflow-hidden bg-black/20 py-24">
      <div className="section-container relative z-10">
        <div className="mb-16 text-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-primary"
          >
            Founder-Led SEO Studio
          </motion.p>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-4xl font-black tracking-tight text-white md:text-6xl"
          >
            Meet <span className="text-gradient-gold">RankVelt</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative px-4"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/20 opacity-50 blur-2xl transition-all duration-500 group-hover:bg-primary/30" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
              <img
                src="/NawazCartMyPortfolios.webp"
                alt="Nawaz Ahmad, RankVelt founder and SEO strategist"
                width="400"
                height="533"
               
                decoding="async"
                className="h-[450px] w-full object-cover object-top grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 md:h-[512px]"
               loading="lazy"/>
            </div>

            <div className="glass-card absolute -bottom-6 -right-2 hidden border-primary/20 p-6 md:block">
              <div className="text-3xl font-black text-primary">10+</div>

              <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-white/60">
                Years in Web Growth
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Hi, I'm Nawaz Ahmad — <br />
                <span className="text-primary">
                  SEO Strategist & Web Growth Specialist
                </span>
              </h3>

              <p className="text-lg font-light leading-relaxed text-white/60">
                RankVelt is a founder-led SEO and web growth studio focused on
                helping local businesses, eCommerce brands, and growing
                companies improve their Google visibility, website structure,
                and conversion pathways.
              </p>

              <p className="mt-4 text-lg font-light leading-relaxed text-white/60">
                I combine SEO strategy with practical website experience. That
                means the work is not limited to keywords. It also considers
                technical foundations, page structure, mobile usability,
                search intent, and the actions visitors need to take next.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary/60" />

                <div>
                  <div className="text-xl font-bold leading-none text-white">
                    150+
                  </div>

                  <div className="mt-1 text-[10px] uppercase text-white/60">
                    Projects Supported
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary/60" />

                <div>
                  <div className="text-xl font-bold leading-none text-white">
                    Global
                  </div>

                  <div className="mt-1 text-[10px] uppercase text-white/60">
                    Client Base
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
                Core Expertise:
              </h4>

              <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                {[
                  "Local SEO Strategy",
                  "eCommerce & Shopify SEO",
                  "Technical SEO Foundations",
                  "SEO-Ready WordPress Websites",
                  "Shopify Store Structure",
                  "Conversion-Focused Landing Pages",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white/80"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-wrap gap-4 pt-4"
            >
              <a
                href="https://wa.me/923244146447?text=Hi%20RankVelt%2C%20I%20would%20like%20to%20discuss%20SEO%20services%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-cta flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-black uppercase tracking-wider text-black"
              >
                <Briefcase className="h-4 w-4" />
                Discuss Your Growth
              </a>

              <a
                href="#portfolio"
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                View Website Work
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;