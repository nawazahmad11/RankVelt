import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const PricingSection = () => {
  
  // Redirection function with Package Tracking
  const handleCTA = (packageName: string) => {
    const encodedPackage = encodeURIComponent(packageName);
   
    window.location.href = `/strategy-call?package=${encodedPackage}`;
  };

  return (
    <section id="pricing" className="py-24 z-20 relative overflow-hidden">
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">
            Ready to Scale Your <span className="text-gradient-gold">Business?</span>
          </h2>
          <p className="text-[19px] text-white/60 max-w-[600px] mx-auto text-lg font-light">
            Transparent pricing with no hidden developer fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto items-stretch">
          
          {/* 1. MAINTENANCE */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass-card p-8 flex flex-col border border-white/5 shadow-lg h-full transition-transform duration-300 hover:border-white/20 bg-white/[0.02]"
          >
            <div className="h-32 mb-6">
              <h3 className="text-lg font-bold text-white/70">Maintenance</h3>
              <div className="text-4xl font-black text-white mt-2">$99</div>
              <p className="text-[12px] text-white/55 mt-1 italic uppercase tracking-wider">Store Refresh & Fixes</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["Speed Optimization (90+)", "Bug Fixes & App Setup", "10 Product Listings", "Conversion Audit", "2-3 Days Delivery"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-light">
                  <CheckCircle className="w-4 h-4 text-green-500/80 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleCTA("Maintenance ($99)")}
              className="w-full py-3 rounded-lg text-sm font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:text-white transition-colors duration-300"
            >
              Get Started
            </button>
          </motion.div>

          {/* 2. STANDARD (BEST SELLER) */}
          <motion.div 
            whileHover={{ y: -12 }}
            className="glass-card p-8 flex flex-col border-2 border-primary/40 shadow-2xl shadow-primary/10 relative bg-white/[0.04] md:scale-105 z-30 h-full transition-all duration-300 hover:border-primary/60"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-4 py-1 rounded-full uppercase z-40 whitespace-nowrap shadow-md animate-pulse">
              Best Seller
            </div>
            <div className="h-32 mb-6">
              <h3 className="text-xl font-bold text-primary">Full Store Design</h3>
              <div className="text-5xl font-black text-white mt-2 drop-shadow-sm">$299</div>
              <p className="text-[12px] text-primary/70 mt-2 font-medium italic">*Premium theme license cost not included</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["High-Converting UI/UX Design", "Winning Product Research", "Custom Liquid Functionality", "13-15 Days Rapid Delivery", "Mobile-First Optimization", "Marketing Pixel Setup", "30 Days Support"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className={item.includes("13-15 Days") ? "font-bold text-primary" : ""}>{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleCTA("Full Store Design ($299)")}
              className="gradient-cta w-full py-4 rounded-xl text-sm font-black text-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              Claim This Offer
            </button>
          </motion.div>

          {/* 3. ENTERPRISE */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass-card p-8 flex flex-col border border-white/5 shadow-lg h-full transition-transform duration-300 hover:border-white/20 bg-white/[0.02]"
          >
            <div className="h-32 mb-6">
              <h3 className="text-lg font-bold text-white/70">Enterprise</h3>
              <div className="text-4xl font-black text-white mt-2 italic tracking-tighter">Custom</div>
              <p className="text-[12px] text-white/55 mt-1 italic uppercase tracking-wider">7-Figure Scalability</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {["Headless Shopify (Hydrogen)", "Custom App Development", "Advanced API Integration", "Unlimited Support", "Full Brand Strategy", "Priority 24/7 Support"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-light">
                  <CheckCircle className="w-4 h-4 text-green-500/80 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleCTA("Enterprise (Custom)")}
              className="w-full py-3 rounded-lg text-sm font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:text-white transition-colors duration-300"
            >
              Book Discovery Call
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;