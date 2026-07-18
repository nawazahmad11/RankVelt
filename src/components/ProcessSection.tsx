import { motion } from "framer-motion";

const ProcessSection = () => {
  const steps = [
    {
      num: "01",
      day: "Step 1",
      title: "Discovery",
      desc: "We review your business goals, website, competitors, target market, and the search opportunities that matter most.",
    },
    {
      num: "02",
      day: "Step 2",
      title: "SEO Roadmap",
      desc: "You receive a practical growth plan covering priority pages, technical gaps, content needs, and realistic next steps.",
    },
    {
      num: "03",
      day: "Step 3",
      title: "Implementation",
      desc: "RankVelt improves the highest-impact pages, website structure, technical foundations, and conversion pathways.",
    },
    {
      num: "04",
      day: "Step 4",
      title: "Measurement",
      desc: "We monitor relevant progress, identify new opportunities, and refine the plan around real data and business goals.",
    },
    {
      num: "05",
      day: "Step 5",
      title: "Sustainable Growth",
      desc: "SEO becomes a repeatable growth system supported by clearer content, stronger pages, and ongoing improvements.",
    },
  ];

  return (
    <section id="process" className="relative overflow-hidden px-6 py-20">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[2px] w-10 bg-primary" />

            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              How RankVelt Works
            </span>
          </div>

          <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
            From first audit to{" "}
            <span className="text-primary underline decoration-white/10 underline-offset-8">
              sustainable results.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:bg-white/[0.05]"
            >
              <div className="absolute -right-4 -top-7 text-8xl font-black text-white/[0.025] transition-transform duration-500 group-hover:scale-110">
                {step.num}
              </div>

              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  {step.day}
                </span>

                <h3 className="mt-5 text-2xl font-black text-white">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;