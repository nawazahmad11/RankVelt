import { motion } from "framer-motion";

const ProcessSection = () => {
  const steps = [
    {
      num: "01",
      day: "Day 0",
      title: "Discovery",
      desc: "30-min strategy call. We define goals, brand identity, and technical requirements.",
    },
    {
      num: "02",
      day: "Day 1-3",
      title: "Design & UX",
      desc: "High-fidelity Figma mockups focused on conversion and mobile-first experience.",
    },
    {
      num: "03",
      day: "Day 4-10",
      title: "Development",
      desc: "Building your Shopify store with custom liquid code and speed optimization.",
    },
    {
      num: "04",
      day: "Day 11-13",
      title: "Review & Quality",
      desc: "Rigorous testing, bug fixing, and client revisions to ensure 100% perfection.",
    },
    {
      num: "05",
      day: "Day 14-15",
      title: "Launch & Support",
      desc: "Going live with marketing pixel setup and 30 days of post-launch maintenance.",
    },
  ];

  return (
    <section id="process" className="py-15 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            From first call to launch <br />
            in <span className="text-primary underline decoration-white/10 underline-offset-8">fifteen days.</span>
          </h2>
        </div>

        {/* Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
            >
              {/* Step Number Background */}
              <div className="absolute -top-4 -right-4 text-8xl font-black text-white/[0.06] group-hover:text-primary/5 transition-colors leading-none">
                {step.num}
              </div>

              <div className="relative z-10">
                <div className="text-4xl font-black text-white/40 group-hover:text-primary/40 transition-colors mb-4">
                  {step.num}
                </div>
                
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
                  {step.day}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                
                <p className="text-white/70 text-sm leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>

              {/* Connecting Line (Desktop Only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] bg-white/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;