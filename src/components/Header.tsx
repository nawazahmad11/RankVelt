import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Rocket from "lucide-react/dist/esm/icons/rocket";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import Calculator from "lucide-react/dist/esm/icons/calculator";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import Layout from "lucide-react/dist/esm/icons/layout";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";
import Menu from "lucide-react/dist/esm/icons/menu";
import X from "lucide-react/dist/esm/icons/x";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const websiteLogo = "/NawazCart.webp"; 

  const tools = [
    { 
      name: "Profit Calculator", 
      icon: <Calculator size={14} />, 
      path: "/tools/profit-margin-calculator" 
    },
    { 
      name: "Policy Generator", 
      icon: <ShieldCheck size={14} />, 
      path: "/tools/legal-policy-generator" 
    },
    { 
      name: "Theme Detector", 
      icon: <Layout size={14} />, 
      path: "/tools/shopify-theme-detector"
    },
    { 
      name: "Name Generator", 
      icon: <ShoppingBag size={14} />, 
      path: "/tools/business-name-generator"
    },
  ];

  // 1. Scroll check ke liye optimized, passive event listener lagaya hai
  useEffect(() => {
    const handleScroll = () => {
      // IsScrolled check lagane ke liye getBoundingClientRect ki zaroorat nahi
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Section highlights ke liye Intersection Observer lagaya (No more Forced Reflows! 🚀)
  useEffect(() => {
    if (location.pathname === "/blog") {
      setActiveSection("blog");
      return;
    }
    if (location.pathname.includes("/tools")) {
      setActiveSection("tools");
      return;
    }
    if (location.pathname.includes("/case-studies")) {
      setActiveSection("case-studies");
      return;
    }
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["services", "portfolio", "pricing", "faq"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          // Jab section screen ke beech (middle area) mein aaye tab active ho
          rootMargin: "-30% 0px -60% 0px",
        }
      );

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((item) => {
        if (item) item.observer.unobserve(item.el);
      });
    };
  }, [location.pathname]);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);

    const performScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 100; // Header height adjustment
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        window.history.pushState(null, "", window.location.pathname);
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(performScroll, 400);
    } else {
      performScroll();
    }
  };

  const NavUnderline = ({ active }: { active: boolean }) => (
    <span className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 rounded-full bg-[#f9a825] ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 flex justify-center pt-4 pointer-events-none">
      <div 
        className={`
          flex items-center justify-between transition-all duration-400 ease-in-out pointer-events-auto
          ${isScrolled 
            ? "max-w-5xl w-[95%] md:w-[90%] bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-8 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            : "max-w-7xl w-full bg-transparent px-6 py-4"
          }
        `}
      >
        
        {/* Logo Section */}
        <div 
          onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }} 
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <img src={websiteLogo} alt="Logo" width={40} height={40} className="w-10 h-10 object-contain rounded-full border border-white/10" />
          <span className="text-xl font-black tracking-tight text-white italic">Nawaz Builds</span>
        </div>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-7">
          <div className="relative py-1 group">
            <button onClick={() => handleNavClick("services")} className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "services" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`}>Services</button>
            <NavUnderline active={activeSection === "services"} />
          </div>

          <div className="relative py-1 group">
            <button onClick={() => handleNavClick("portfolio")} className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "portfolio" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`}>Portfolio</button>
            <NavUnderline active={activeSection === "portfolio"} />
          </div>
          
          <div className="relative py-1 group cursor-pointer" onMouseEnter={() => setIsToolsOpen(true)} onMouseLeave={() => setIsToolsOpen(false)}>
            <div className={`flex items-center gap-1 font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "tools" ? "text-[#f9a825]" : "text-white/50 group-hover:text-[#f9a825]"}`}>
              <span>Tools</span> 
              <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 ${isToolsOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 w-52 ${isToolsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl">
                {tools.map((tool) => (
                  <Link key={tool.name} to={tool.path} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold text-white/40 hover:text-[#f9a825] hover:bg-white/5 transition-all group">
                    <span className="text-white/20 group-hover:text-[#f9a825]">{tool.icon}</span>
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
            <NavUnderline active={activeSection === "tools"} />
          </div>

          <div className="relative py-1 group">
            <Link to="/blog" className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "blog" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`}>Blog</Link>
            <NavUnderline active={activeSection === "blog"} />
          </div>

          <div className="relative py-1 group">
            <Link to="/case-studies" className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "case-studies" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`} onClick={() => setActiveSection("case-studies")}>Case Studies</Link>
            <NavUnderline active={activeSection === "case-studies"} />
          </div>

          <div className="relative py-1 group">
            <button onClick={() => handleNavClick("faq")} className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "faq" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`}>FAQ</button>
            <NavUnderline active={activeSection === "faq"} />
          </div>
        </nav>

        {/* Right Section: Button + Hamburger */}
        <div className="flex items-center gap-3 relative z-[110]">
          {!isMobileMenuOpen && (
            <button
              onClick={() => handleNavClick("pricing")}
              aria-label="Get Started and view pricing"
              className={`bg-gradient-to-r from-[#ffb347] via-[#f9a825] to-[#f57c00] text-[#0a0a0a] rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(249,168,37,0.4)] ${isScrolled ? "px-5 py-2 text-[11px]" : "px-7 py-2.5 text-xs"}`}>
              <Rocket className="w-3.5 h-3.5 fill-black/20" aria-hidden="true" /> 
              <span className="uppercase tracking-wider hidden sm:inline">Get Started</span>
            </button>
          )}

          {/* Mobile Toggle Button */}
          <button 
            className="md:hidden p-2 text-white/70 hover:text-[#f9a825] transition-colors relative z-[110]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMobileMenuOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>  

      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-black/98 backdrop-blur-2xl z-[105] flex flex-col p-8 pt-32 pointer-events-auto overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-center max-w-sm mx-auto w-full">
              {["services", "portfolio", "faq"].map((item) => (
                <button 
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-3xl font-bold text-white capitalize hover:text-[#f9a825] transition-colors"
                >
                  {item}
                </button>
              ))}
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-[#f9a825] transition-colors">Blog</Link>
              <Link to="/case-studies" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-[#f9a825] transition-colors">Case Studies</Link>
              
              <div className="h-[1px] bg-white/10 my-6 w-full" />
              
              <span className="text-[#f9a825] uppercase tracking-[0.3em] text-[11px] font-black block mb-4">Tools</span>
              <div className="grid grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <Link 
                    key={tool.name} 
                    to={tool.path} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex flex-col items-center justify-center gap-3 p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 active:scale-95 transition-all"
                  >
                    <span className="text-[#f9a825] bg-[#f9a825]/10 p-2 rounded-full">{tool.icon}</span>
                    <span className="text-[12px] font-medium text-white/90">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;



// import { useState, useEffect } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// import Rocket from "lucide-react/dist/esm/icons/rocket";
// import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
// import Calculator from "lucide-react/dist/esm/icons/calculator";
// import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
// import Layout from "lucide-react/dist/esm/icons/layout";
// import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag";
// import Menu from "lucide-react/dist/esm/icons/menu";
// import X from "lucide-react/dist/esm/icons/x";

// const Header = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeSection, setActiveSection] = useState("");
//   const [isToolsOpen, setIsToolsOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const websiteLogo = "/NawazCart.webp"; 

// // Is array ko update karein
// const tools = [
//   { 
//     name: "Profit Calculator", 
//     icon: <Calculator size={14} />, 
//     path: "/tools/profit-margin-calculator" 
//   },
//   { 
//     name: "Policy Generator", 
//     icon: <ShieldCheck size={14} />, 
//     path: "/tools/legal-policy-generator" 
//   },
//   { 
//     name: "Theme Detector", 
//     icon: <Layout size={14} />, 
//     path: "/tools/shopify-theme-detector"
//   },
//   { 
//     name: "Name Generator", 
//     icon: <ShoppingBag size={14} />, 
//     path: "/tools/business-name-generator"
//   },
// ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//       const sections = ["services", "portfolio", "pricing", "faq"];
//       const current = sections.find(id => {
//         const el = document.getElementById(id);
//         if (el) {
//           const rect = el.getBoundingClientRect();
//           return rect.top <= 150 && rect.bottom >= 150;
//         }
//         return false;
//       });

//       if (current) setActiveSection(current);
//       else if (location.pathname === "/blog") setActiveSection("blog");
//       else if (location.pathname.includes("/tools")) setActiveSection("tools");
//       else if (location.pathname.includes("/case-studies")) setActiveSection("case-studies");
//       else setActiveSection("");
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [location.pathname]);

//       const handleNavClick = (id: string) => {
//         setActiveSection(id);
//         setIsMobileMenuOpen(false);

//         const performScroll = () => {
//           const element = document.getElementById(id);
//           if (element) {
//             const headerOffset = 100; // Header height adjustment
//             const elementPosition = element.getBoundingClientRect().top;
//             const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

//             window.scrollTo({
//               top: offsetPosition,
//               behavior: "smooth"
//             });

//             // URL se hash (#) saaf karne ke liye taake layout jump na kare
//             window.history.pushState(null, "", window.location.pathname);
//           }
//         };

//         if (location.pathname !== "/") {
//           // Agar home page par nahi hain to pehle home par jayein
//           navigate("/");
//           // Page load hone ka thora wait karein phir scroll karein
//           setTimeout(performScroll, 400);
//         } else {
//           // Agar pehle se home par hain to foran scroll karein
//           performScroll();
//         }
//       };



//   const NavUnderline = ({ active }: { active: boolean }) => (
//     <span className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 rounded-full bg-[#f9a825] ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
//   );

//   return (
//     <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 flex justify-center pt-4 pointer-events-none">
//       <div 
//         className={`
//           flex items-center justify-between transition-all duration-400 ease-in-out pointer-events-auto
//           ${isScrolled 
//             ? "max-w-5xl w-[95%] md:w-[90%] bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-8 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
//             : "max-w-7xl w-full bg-transparent px-6 py-4"
//           }
//         `}
//       >
        
//         {/* Logo Section */}
//           <div 
//             onClick={() => {
//               if (location.pathname === "/") {
//                 // Agar pehle se home par hain to smooth scroll up karein
//                 window.scrollTo({ top: 0, behavior: "smooth" });
//               } else {
//                 // Agar kisi aur page (blog/tools) par hain to home par navigate karein
//                 navigate("/");
//               }
//             }} 
//             className="flex items-center gap-3 cursor-pointer shrink-0"
//           >
//             <img src={websiteLogo} alt="Logo" width={40} height={40} className="w-10 h-10 object-contain rounded-full border border-white/10" />
//             <span className="text-xl font-black tracking-tight text-white italic">Nawaz Builds</span>
//           </div>


//         {/* Navigation (Desktop) */}
//         <nav className="hidden md:flex items-center gap-7">
//           <div className="relative py-1 group">
//             <button onClick={() => handleNavClick("services")} className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "services" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`}>Services</button>
//             <NavUnderline active={activeSection === "services"} />
//           </div>

//           <div className="relative py-1 group">
//             <button onClick={() => handleNavClick("portfolio")} className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "portfolio" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`}>Portfolio</button>
//             <NavUnderline active={activeSection === "portfolio"} />
//           </div>
          
//           <div className="relative py-1 group cursor-pointer" onMouseEnter={() => setIsToolsOpen(true)} onMouseLeave={() => setIsToolsOpen(false)}>
//             <div className={`flex items-center gap-1 font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "tools" ? "text-[#f9a825]" : "text-white/50 group-hover:text-[#f9a825]"}`}>
//               <span>Tools</span> 
//               <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 ${isToolsOpen ? 'rotate-180' : ''}`} />
//             </div>
//             <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 w-52 ${isToolsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
//               <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl">
//                 {tools.map((tool) => (
//                   <Link key={tool.name} to={tool.path} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold text-white/40 hover:text-[#f9a825] hover:bg-white/5 transition-all group">
//                     <span className="text-white/20 group-hover:text-[#f9a825]">{tool.icon}</span>
//                     {tool.name}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             <NavUnderline active={activeSection === "tools"} />
//           </div>

//           <div className="relative py-1 group">
//             <Link to="/blog" className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "blog" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`}>Blog</Link>
//             <NavUnderline active={activeSection === "blog"} />
//           </div>

//           <div className="relative py-1 group">
//             <Link to="/case-studies" className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "case-studies" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`} onClick={() => setActiveSection("case-studies")}>Case Studies</Link>
//             <NavUnderline active={activeSection === "case-studies"} />
//           </div>

//           <div className="relative py-1 group">
//             <button onClick={() => handleNavClick("faq")} className={`font-medium transition-all duration-500 ${isScrolled ? "text-[15px]" : "text-[16px]"} ${activeSection === "faq" ? "text-[#f9a825]" : "text-white/50 hover:text-[#f9a825]"}`}>FAQ</button>
//             <NavUnderline active={activeSection === "faq"} />
//           </div>
//         </nav>
//         {/* Right Section: Button + Hamburger */}
//         <div className="flex items-center gap-3 relative z-[110]">
//           {!isMobileMenuOpen && (
//             <button
//               onClick={() => handleNavClick("pricing")}
//               // Fix 1: aria-label add kiya taake screen reader ko pata chale ye kya hai
//               aria-label="Get Started and view pricing"
//               className={`bg-gradient-to-r from-[#ffb347] via-[#f9a825] to-[#f57c00] text-[#0a0a0a] rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(249,168,37,0.4)] ${isScrolled ? "px-5 py-2 text-[11px]" : "px-7 py-2.5 text-xs"}`}>
//               <Rocket className="w-3.5 h-3.5 fill-black/20" aria-hidden="true" /> 
//               <span className="uppercase tracking-wider hidden sm:inline">Get Started</span>
//             </button>
//           )}

//           {/* Mobile Toggle Button */}
//           <button 
//             className="md:hidden p-2 text-white/70 hover:text-[#f9a825] transition-colors relative z-[110]"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             // Fix 2: Dynamic aria-label menu open/close status ke mutabiq
//             aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
//             aria-expanded={isMobileMenuOpen}
//           >
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={isMobileMenuOpen ? "close" : "menu"}
//                 initial={{ opacity: 0, rotate: -90 }}
//                 animate={{ opacity: 1, rotate: 0 }}
//                 exit={{ opacity: 0, rotate: 90 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 {isMobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
//               </motion.div>
//             </AnimatePresence>
//           </button>
//         </div>  

        
//       </div>

//       {/* Mobile Menu Overlay */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed inset-0 top-0 left-0 w-full h-screen bg-black/98 backdrop-blur-2xl z-[105] flex flex-col p-8 pt-32 pointer-events-auto overflow-y-auto"
//           >
//             <div className="flex flex-col gap-6 text-center max-w-sm mx-auto w-full">
//               {["services", "portfolio", "faq"].map((item) => (
//                 <button 
//                   key={item}
//                   onClick={() => handleNavClick(item)}
//                   className="text-3xl font-bold text-white capitalize hover:text-[#f9a825] transition-colors"
//                 >
//                   {item}
//                 </button>
//               ))}
//               <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-[#f9a825] transition-colors">Blog</Link>
//               <Link to="/case-studies" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-white hover:text-[#f9a825] transition-colors">Case Studies</Link>
              
//               <div className="h-[1px] bg-white/10 my-6 w-full" />
              
//               <span className="text-[#f9a825] uppercase tracking-[0.3em] text-[11px] font-black block mb-4">Tools</span>
//               <div className="grid grid-cols-2 gap-4">
//                 {tools.map((tool) => (
//                   <Link 
//                     key={tool.name} 
//                     to={tool.path} 
//                     onClick={() => setIsMobileMenuOpen(false)} 
//                     className="flex flex-col items-center justify-center gap-3 p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 active:scale-95 transition-all"
//                   >
//                     <span className="text-[#f9a825] bg-[#f9a825]/10 p-2 rounded-full">{tool.icon}</span>
//                     <span className="text-[12px] font-medium text-white/90">{tool.name}</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// };

// export default Header;