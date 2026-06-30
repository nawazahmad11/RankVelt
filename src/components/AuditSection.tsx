import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const AuditSection = () => {
  const points = [
    "PageSpeed analysis",
    "UX & mobile review",
    "Conversion opportunities",
    "Delivered in 48hrs",
  ];

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-10 shadow-2xl backdrop-blur-md"
        >
          {/* Background Decor */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            
            {/* Left Side: Content */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                Free Offer
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Get a free <span className="text-primary">store audit.</span>
              </h3>
              
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                I'll review your Shopify store and send you a personalised report 
                covering speed, UX, mobile experience, and conversion rate — 
                <span className="text-white"> completely free, no strings attached.</span>
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4">
                {points.map((point, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/2 bg-white/[0.1] text-[11px] font-bold text-white/65 uppercase tracking-wider">
                    <CheckCircle2 size={14} className="text-primary" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: CTA */}
            <div className="text-center shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 rounded-2xl bg-primary text-black font-black uppercase text-[15px] tracking-widest flex items-center gap-3 shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/40 transition-all"
              >
                {/* Start Your Project */}

            <button 
                onClick={() => window.location.href = '/strategy-call?package=Maintenance'}
                className="btn-primary" // Ya jo bhi aapki class hai
                    >
                Start Your Project →
            </button>


                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <p className="mt-4 text-[11px] font-mono text-white/60 uppercase tracking-[0.2em]">
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