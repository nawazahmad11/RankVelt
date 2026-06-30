import { motion } from "framer-motion";
import { CheckCircle2, Briefcase, Trophy, Users } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-black/20">
      <div className="section-container relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            About <span className="text-gradient-gold">Me</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Profile Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group px-4">
            <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-2xl group-hover:bg-primary/30 transition-all duration-500 opacity-50" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-white/5">
            
            
            {/* <img src="/NawazCartMyPortfolio.webp" alt="Nawaz Ahmad" 
            className="w-full h-[450px] md:h-[680px] object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
            /> */}

            {/* <img 
              src="/NawazCartMyPortfolio.webp" 
              alt="Nawaz Ahmad" 
              width="512"
              height="512"
              className="w-full h-[450px] md:h-[512px] object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
            /> */}

            <img 
              src="/NawazCartMyPortfolio.webp" 
              alt="Nawaz Ahmad"
              width="400" 
              height="533"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-[450px] md:h-[512px] object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
            />

            </div>
            {/* Experience Floating Badge */}
            <div className="absolute -bottom-6 -right-2 glass-card p-6 border-primary/20 hidden md:block">
              <div className="text-3xl font-black text-primary">10+</div>
              <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold font-sans">Years Exp.</div>
            </div>
          </motion.div>

          {/* Right Side: Professional Content */}
          <div className="space-y-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Hi, I'm Nawaz Ahmad — <br />
                <span className="text-primary">Shopify Expert & Developer</span>
              </h3>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                I'm a Full-Stack Developer with <span className="text-white font-medium">10+ years of experience</span>. I specialize in building high-converting Shopify stores and custom Liquid solutions that help brands scale globally. Based in Lahore & Dubai, I bring a mix of technical skill and business strategy to every project.
              </p>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary/60" />
                <div>
                  <div className="text-xl font-bold text-white leading-none">150+</div>
                  <div className="text-[10px] text-white/60 uppercase mt-1">Projects Done</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary/60" />
                <div>
                  <div className="text-xl font-bold text-white leading-none">Global</div>
                  <div className="text-[10px] text-white/60 uppercase mt-1">Client Base</div>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Core Expertise:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                {[
                  "Custom Shopify Theme Dev",
                  "Liquid & API Integration",
                  "Next.js & React Expert",
                  "AI Chatbot Implementation",
                  "Store Speed Optimization",
                  "SaaS Architecture"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <a href="https://wa.me/923244146447" target="_blank" className="gradient-cta px-8 py-3 rounded-xl text-black font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Hire Me Now
              </a>
              <a href="#portfolio" className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-xl text-white font-bold text-sm transition-all">
                View My Work
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;