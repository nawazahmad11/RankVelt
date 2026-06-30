import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";

// ✅ Optimized Icon Imports
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2";
import { Link } from "react-router-dom";

// ✅ Naya Data Array Modal File se direct import kiya
import { portfolioProjects } from "@/components/PortfolioModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" as const },
  }),
};

// --- SPOTLIGHT DATA SECTION ---
const showcaseProjects = [
  {
    title: "Forma Liv",
    description: "A minimalist furniture store designed for a premium feel. We kept the layout clean and warm, making it easy for customers to browse and shop for high-end home decor without any distractions.",
    features: ["45% Increase in Mobile CR", "Sub-1s Loading Time", "Custom Scent Finder" , "Clean & Minimal Design"],
    img: "/forma-liv.webp",
    color: "#facc15"
  },
  {
    title: "AeroTech Gear",
    description: "A sharp, modern tech store built for gadgets and drones. I focused on a professional look and a fast checkout flow to make buying electronics easy and reliable.",
    features: ["Flash Sale Optimization", "Advanced Inventory Sync", "3D Product Previews"],
    img: "/aerotech-gear-shopify-store.webp",
    color: "#ffffff"
  },
  {
    title: "Axeon Sport",
    description: "A high-performance store built for athletes. I combined a bold, technical look with a fast shopping flow to make sure the gear stands out and the checkout is effortless.",
    features: ["Rapid Peak Scaling", "UGC Integration", "Mobile Optimization"],
    img: "/axeon-sport-shopify-store.webp",
    color: "#facc15"
  },
  {
    title: "Haven Loom",
    description: "A high-end, bespoke furniture store designed for the thoughtful home. I combined a clean, natural palette with a seamless interface to make shopping for handcrafted luxury simple and incredibly intuitive.",
    features: ["Bespoke UI Design", "360° AR Visualization", "Mobile-First Luxury"],
    img: "/haven-loom-shopify-store.webp",
    color: "#facc15"
  },  
  {
    title: "Naturale Skincare",
    description: "Experience botanical luxury. I crafted this premium skincare store with a focus on natural elegance and modern functionality. The goal was to make high-end beauty shopping feel effortless and perfectly personalized for every customer.",
    features: ["Smart Skincare Funnel", "UGC Integration", "Skincare Quiz Funnel"],
    img: "/naturale-skincare-shopify-store.webp",
    color: "#facc15"
  },
  {
    title: "Sustainable Drops",
    description: "Modern streetwear with a conscious soul. I designed this store to bridge the gap between high-end fashion and eco-friendly practices. The layout is intentionally clean, allowing the `recycled` aesthetic and premium textures to take center stage.",
    features: ["Dynamic Drop Architecture", "Lookbook-Integrated UX", "Eco-Metric Visualization"],
    img: "/sustainable-drops-shopify-store.webp",
    color: "#facc15"
  },
  {
    title: "Gadget Array",
    description: "Premium tech meets effortless shopping. I designed this storefront for high-end electronics, focusing on a clean white-space aesthetic that highlights technical details. The goal was to create a trustworthy environment for gadget enthusiasts to explore and buy with ease.",
    features: ["High-Fidelity Product Previews", "Unified Accessory Ecosystem", "Sub-1s Interaction Speed"],
    img: "/gadget-array-shopify-store.webp",
    color: "#facc15"
  },
  {
    title: "Vitality Wellness",
    description: "A serene, botanical-inspired store built for the health-conscious consumer. I created a calm, organic atmosphere using earthy tones to make browsing for premium supplements feel like a natural extension of a wellness routine.",
    features: ["Smart Supplement Finder", "Subscription Model Ready", "Conversion-Optimized Flow"],
    img: "/vitality-wellness-shopify-store.webp",
    color: "#facc15"
  },
  {
    title: "Culinary Edge",
    description: "A sophisticated, high-end storefront built for professional chefs and home cooking enthusiasts. We designed this experience to reflect the precision of the tools it sells, using a bold, dark aesthetic that emphasizes quality, durability, and premium kitchen aesthetics.",
    features: ["Precision UI Design", "Conversion-Optimized Checkout", "Dynamic Sales Analytics"],
    img: "/culinary-edge-shopify-store.webp",
    color: "#facc15"
  }
];

interface PortfolioSectionProps {
  onProjectSelect: (id: string) => void;
}

const PortfolioSection = ({ onProjectSelect }: PortfolioSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const duplicatedProjects = useMemo(() => {
    return [...portfolioProjects, ...portfolioProjects, ...portfolioProjects];
  }, []);

  useEffect(() => {
    showcaseProjects.forEach((project) => {
      const img = new Image();
      img.src = project.img;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseProjects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section id="portfolio" className="py-20 bg-black/40 overflow-hidden relative">
      <style>{`
        @keyframes scroll-portfolio {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-portfolio {
          animation: scroll-portfolio 40s linear infinite;
        }
        .portfolio-container:hover .animate-portfolio {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="section-container mb-5 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} custom={0}>
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tight">
            My <span className="text-gradient-gold">Work</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Premium Shopify stores designed for high conversions and global scale.
          </p>
        </motion.div>
      </div>

      {/* --- INFINITE MARQUEE SLIDER --- */}
      <div className="portfolio-container relative flex items-center overflow-hidden py-10 mb-7">
        <div className="animate-portfolio flex gap-8 whitespace-nowrap px-4">
          {duplicatedProjects.map((project, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => onProjectSelect(project.id)}
              className="w-[350px] md:w-[450px] shrink-0 group relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="aspect-[16/11] overflow-hidden bg-white/5">
                <img 
                  // ✅ Fixed: Type assertions applied to read dynamic objects safely without errors
                  src={project.thumbnail || (project as any).image || ""} 
                  alt={project.title} 
                  loading="lazy" 
                  width="450"
                  height="310"
                  decoding="async" 
                  className="w-full h-full object-cover transition-all duration-700 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
                    {project.category || "Shopify Store"}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                  <div className="flex items-center gap-4">
                    <button 
                      className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-primary transition-all duration-300"
                    >
                      View Details <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>

      {/* --- FEATURE SHOWCASE (SPOTLIGHT) --- */}
      <div className="section-container relative z-20 mt-[-20px]">
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-[2rem] p-6 md:p-8 backdrop-blur-xl relative"> 
            
          {/* --- View All Button --- */}
          <div className="flex justify-start md:block mb-6 md:mb-0"> 
            <Link 
              to="/case-studies" 
              className="relative md:absolute top-0 right-0 md:top-10 md:right-10 z-30 flex items-center gap-2.5 px-5 py-2 border border-[#f9a825]/40 rounded-full transition-all bg-white/5 hover:bg-[#f9a825]/10 hover:border-[#f9a825]/100 group"
            >
              <span className="text-[12px] md:text-[13px] font-bold text-[#f9a825]">
                View all Case Studies
              </span>
              <ArrowRight size={14} className="text-[#f9a825] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
            
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content Column */}
              <div className="order-2 lg:order-1 min-h-[380px] py-4 flex flex-col justify-center relative overflow-hidden">
                <AnimatePresence mode="wait"> 
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <span className="text-primary font-black tracking-widest text-xs uppercase mb-2 block">Project Spotlight</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                      {showcaseProjects[activeIndex].title}
                    </h2>
                    <p className="text-white/50 text-lg mb-5 font-light leading-relaxed">
                      {showcaseProjects[activeIndex].description}
                    </p>
                    
                    <div className="space-y-4 mb-2">
                      {showcaseProjects[activeIndex].features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-white/80">
                          <CheckCircle2 size={20} className="text-primary" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-3 mt-8 z-30">
                  {showcaseProjects.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleDotClick(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1 transition-all duration-500 cursor-pointer rounded-full outline-none border-none ${activeIndex === i ? 'w-12 bg-primary' : 'w-4 bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Image Column */}
              <div className="order-1 lg:order-2 relative flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full flex justify-center relative items-center py-4"
                  >
                    <img
                      src={showcaseProjects[activeIndex].img}
                      width="550"
                      height="275"
                      fetchPriority={activeIndex === 0 ? "high" : "auto"} 
                      loading={activeIndex === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="rounded-[1.2rem] w-full h-auto object-contain shadow-2xl" 
                      alt={showcaseProjects[activeIndex].title}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute -z-10 w-[70%] h-[70%] bg-primary/5 blur-[100px] rounded-full" />
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;









// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect, useMemo } from "react";

// // ✅ Optimized Icon Imports (Har icon alag import taake bundle size chota rahe)
// import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
// import ExternalLink from "lucide-react/dist/esm/icons/external-link";
// import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2";

// import { Link } from "react-router-dom";
// import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";

// const fadeInUp = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" as const },
//   }),
// };

// // --- DATA SECTIONS (Unchanged as requested) ---
// const showcaseProjects = [
//   {
//     title: "Forma Liv",
//     description: "A minimalist furniture store designed for a premium feel. We kept the layout clean and warm, making it easy for customers to browse and shop for high-end home decor without any distractions.",
//     features: ["45% Increase in Mobile CR", "Sub-1s Loading Time", "Custom Scent Finder" , "Clean & Minimal Design"],
//     img: "/forma-liv.webp",
//     color: "#facc15"
//   },
//   {
//     title: "AeroTech Gear",
//     description: "A sharp, modern tech store built for gadgets and drones. I focused on a professional look and a fast checkout flow to make buying electronics easy and reliable.",
//     features: ["Flash Sale Optimization", "Advanced Inventory Sync", "3D Product Previews"],
//     img: "/aerotech-gear-shopify-store.webp",
//     color: "#ffffff"
//   },
//   {
//     title: "Axeon Sport",
//     description: "A high-performance store built for athletes. I combined a bold, technical look with a fast shopping flow to make sure the gear stands out and the checkout is effortless.",
//     features: ["Rapid Peak Scaling", "UGC Integration", "Mobile Optimization"],
//     img: "/axeon-sport-shopify-store.webp",
//     color: "#facc15"
//   },
//   {
//     title: "Haven Loom",
//     description: "A high-end, bespoke furniture store designed for the thoughtful home. I combined a clean, natural palette with a seamless interface to make shopping for handcrafted luxury simple and incredibly intuitive.",
//     features: ["Bespoke UI Design", "360° AR Visualization", "Mobile-First Luxury"],
//     img: "/haven-loom-shopify-store.webp",
//     color: "#facc15"
//   },  
//   {
//     title: "Naturale Skincare",
//     description: "Experience botanical luxury. I crafted this premium skincare store with a focus on natural elegance and modern functionality. The goal was to make high-end beauty shopping feel effortless and perfectly personalized for every customer.",
//     features: ["Smart Skincare Funnel", "UGC Integration", "Skincare Quiz Funnel"],
//     img: "/naturale-skincare-shopify-store.webp",
//     color: "#facc15"
//   },
//   {
//     title: "Sustainable Drops",
//     description: "Modern streetwear with a conscious soul. I designed this store to bridge the gap between high-end fashion and eco-friendly practices. The layout is intentionally clean, allowing the `recycled` aesthetic and premium textures to take center stage.",
//     features: ["Dynamic Drop Architecture", "Lookbook-Integrated UX", "Eco-Metric Visualization"],
//     img: "/sustainable-drops-shopify-store.webp",
//     color: "#facc15"
//   },
//   {
//     title: "Gadget Array",
//     description: "Premium tech meets effortless shopping. I designed this storefront for high-end electronics, focusing on a clean white-space aesthetic that highlights technical details. The goal was to create a trustworthy environment for gadget enthusiasts to explore and buy with ease.",
//     features: ["High-Fidelity Product Previews", "Unified Accessory Ecosystem", "Sub-1s Interaction Speed"],
//     img: "/gadget-array-shopify-store.webp",
//     color: "#facc15"
//   },
//   {
//     title: "Vitality Wellness",
//     description: "A serene, botanical-inspired store built for the health-conscious consumer. I created a calm, organic atmosphere using earthy tones to make browsing for premium supplements feel like a natural extension of a wellness routine.",
//     features: ["Smart Supplement Finder", "Subscription Model Ready", "Conversion-Optimized Flow"],
//     img: "/vitality-wellness-shopify-store.webp",
//     color: "#facc15"
//   },
//   {
//     title: "Culinary Edge",
//     description: "A sophisticated, high-end storefront built for professional chefs and home cooking enthusiasts. We designed this experience to reflect the precision of the tools it sells, using a bold, dark aesthetic that emphasizes quality, durability, and premium kitchen aesthetics.",
//     features: ["Precision UI Design", "Conversion-Optimized Checkout", "Dynamic Sales Analytics"],
//     img: "/culinary-edge-shopify-store.webp",
//     color: "#facc15"
//   }
// ];

// const projects = [
//   { name: "Luxe Fragrances", 
//     cat: "Luxury Perfumes", 
//     img: "/perfume-shopify-store.webp",
//     link: "https://LuxeFragrancess.com" 
//   },
    
//   { name: "Gala Tea", 
//     cat: "Fictional Novels", 
//     img: "/fictional-books-shopify-store.webp", 
//     link: "https://shop.galatea.com/"
//   },

//   { name: "FitGears", 
//     cat: "Fitness Apparel", 
//     img: "/gym-couture-shopify-store.webp",
//     link: "https://gymcouture.co.uk/"
//   },

//   { name: "Silk & Stone", 
//     cat: "Modern Fashion", 
//     img: "/ovrthnk-shopify-store.webp",
//     link: "https://ovrthnk.us/"
//   },

//   { name: "Urban Fit", 
//     cat: "Clothing Store", 
//     img: "/urban-clothing-shopify-store.webp",
//     link: "https://urbanfits.co.in/"  
//   },
  
//   { name: "Roasted Cherry", 
//     cat: "Coffee Shop", 
//     img: "/coffee-shopify-store.webp",
//     link: "https://roastedcherry.ca/"
//   },

//   { name: "Revoo Concept", 
//     cat: "Food Store", 
//     img: "/olive-oil-shopify-store.webp",
//     link: "https://revooconcept.com/"  
//   },

//   { name: "Nura Fashion", 
//     cat: "Fashion", 
//     img: "/ladies-shopify-store.webp",
//     link: "https://nurafashion.com/"  
//   },

//   { name: "Little Wren", 
//     cat: "Kids Accessories", 
//     img: "/little-wren-shopify-store.webp",
//     link: "https://www.ohlittlewren.com/" 
//   },

//   { name: "Denim Den", 
//     cat: "Kids Wear", 
//     img: "/kids-wear-shopify-store.webp",
//     link: "https://denimden.shop/"
//   },

//   { name: "Welevate club", 
//     cat: "Personal Accessories", 
//     img: "/breathe-freely-shopify-store.webp", 
//     link: "https://welevateclub.com/"}
// ];



// const PortfolioSection = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   // Memoize duplicated projects to prevent re-renders on every scroll
//   const duplicatedProjects = useMemo(() => [...projects, ...projects, ...projects], []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % showcaseProjects.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section id="portfolio" className="py-20 bg-black/40 overflow-hidden relative">

//       <style>{`
//         @keyframes scroll-portfolio {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-33.33%); }
//         }
//         .animate-portfolio {
//           animation: scroll-portfolio 40s linear infinite;
//         }
//         .portfolio-container:hover .animate-portfolio {
//           animation-play-state: paused;
//         }
//       `}</style>

//       {/* --- HEADER --- */}
//       <div className="section-container mb-5 text-center">
//         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} custom={0}>
//           <h2 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tight">
//             My <span className="text-gradient-gold">Work</span>
//           </h2>
//           <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
//             Premium Shopify stores designed for high conversions and global scale.
//           </p>
//         </motion.div>
//       </div>

//       <div className="portfolio-container relative flex items-center overflow-hidden py-10 mb-7">
//         <div className="animate-portfolio flex gap-8 whitespace-nowrap px-4">


//           {duplicatedProjects.map((project, i) => (
//             <motion.div key={i} whileHover={{ y: -10, scale: 1.02 }} 
//             className="w-[350px] md:w-[450px] shrink-0 group relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl transition-all duration-500 cursor-pointer">
//               <div className="aspect-[16/11] overflow-hidden bg-white/5">
//                 <img 
//                   src={project.img} 
//                   alt={project.name} 
//                   loading="lazy" 
//                   width="450"
//                   height="310"
//                   decoding="async" 
//                   className="w-full h-full object-cover transition-all duration-700 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110" 
//                 />
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
//                 <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
//                   <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">{project.cat}</span>
//                   <h3 className="text-2xl font-bold text-white mb-4">{project.name}</h3>
//                   <div className="flex items-center gap-4">
//                     <a 
//                       href={project.link} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-primary transition-all duration-300"
//                     >
//                       Live Preview <ExternalLink className="w-3 h-3" />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//         <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
//         <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
//       </div>

//       <div className="section-container relative z-20 mt-[-20px]"> {/* Slider ke mazeed kareeb karne ke liye negative margin */}
//         <div className="bg-white/[0.04] border border-white/6 rounded-[2rem] p-6 md:p-8 backdrop-blur-xl"> {/* p-8 ko md:p-8 rakha magar mobile pe p-6 kiya */}
            

//         <div className="flex justify-start md:block mb-6 md:mb-0"> 
//           <Link 
//             to="/case-studies" 
//             className="
//               /* Mobile par simple relative position, Desktop par absolute */
//               relative md:absolute 
//               top-0 right-0 md:top-10 md:right-10 
//               z-30 flex items-center gap-2.5 px-5 py-2 
//               border border-[#f9a825]/40 rounded-full transition-all 
//               bg-white/5 hover:bg-[#f9a825]/10 hover:border-[#f9a825] group
//             "
//           >
//             <span className="text-[12px] md:text-[13px] font-bold text-[#f9a825]">
//               View all Case Studies
//             </span>
//             <ArrowRight size={14} className="text-[#f9a825] group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">


//                 <div className="order-2 lg:order-1 min-h-fit py-4 flex flex-col justify-center relative">

//                     <AnimatePresence mode="popLayout"> 
//                         <motion.div
//                             key={activeIndex}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 20 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <span className="text-primary font-black tracking-widest text-xs uppercase mb-2 block">Project Spotlight</span>
//                             <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
//                                 {showcaseProjects[activeIndex].title}
//                             </h2>
//                             <p className="text-white/50 text-lg mb-5 font-light leading-relaxed">
//                                 {showcaseProjects[activeIndex].description}
//                             </p>
                            
//                             <div className="space-y-4 mb-2">
//                                 {showcaseProjects[activeIndex].features.map((feature, idx) => (
//                                     <div key={idx} className="flex items-center gap-3 text-white/80">
//                                         <CheckCircle2 size={20} className="text-primary" />
//                                         <span className="font-medium">{feature}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </motion.div>
//                     </AnimatePresence>

//                     <div className="flex gap-3 mt-8"> 
//                         {showcaseProjects.map((_, i) => (
//                             <div 
//                                 key={i} 
//                                 onClick={() => setActiveIndex(i)}
//                                 className={`h-1 transition-all duration-500 cursor-pointer rounded-full ${activeIndex === i ? 'w-12 bg-primary' : 'w-4 bg-white/10'}`}
//                             />
//                         ))}
//                     </div>
//                 </div>

//                 <div className="order-1 lg:order-2 relative flex items-center justify-center min-h-fit lg:min-h-[400px]">
//                     <AnimatePresence mode="popLayout">
//                         <motion.div
//                             key={activeIndex}
//                             initial={{ opacity: 0, x: 50, filter: "blur(10px)", scale: 0.95 }}
//                             animate={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
//                             exit={{ opacity: 0, x: -50, filter: "blur(10px)", scale: 0.95 }}
//                             transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.8 }}
//                             className="w-full flex justify-center relative items-center py-4"
//                         >
//                            <img
//                             src={showcaseProjects[activeIndex].img}
//                             width="550"
//                             height="275"
//                             // Isse performance mazeed behtar hogi
//                             fetchPriority={activeIndex === 0 ? "high" : "auto"} 
//                             loading={activeIndex === 0 ? "eager" : "lazy"}
//                             decoding="async"
//                             className="rounded-[1.2rem] w-full h-auto object-contain shadow-2xl" 
//                             alt={showcaseProjects[activeIndex].title}
//                         />

//                         <div className="hidden">
//                           {showcaseProjects.map((project, index) => (
//                             <link key={index} rel="preload" as="image" href={project.img} />
//                           ))}
//                         </div>
//                         </motion.div>
//                     </AnimatePresence>

//                     <div className="absolute -z-10 w-[70%] h-[70%] bg-primary/5 blur-[100px] rounded-full" />
//                 </div>
//             </div>
//         </div>
//       </div>
//         </section>
//       );
//     };

// export default PortfolioSection;