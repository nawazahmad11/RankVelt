import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";

const AuditPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false); 
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  
  const location = useLocation(); 

  useEffect(() => {
    // Sirf Home page par popup trigger hoga
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const winScroll = window.pageYOffset || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      // 40% scroll + top reload protection
      if (scrolled > 40 && !hasShown && winScroll > 300) {
        setIsOpen(true);
        setHasShown(true); 
      }
    };

    const handleExitIntent = (e: MouseEvent) => {
      // Exit intent trigger after 500px scroll
      if (e.clientY <= 0 && !hasShown && window.scrollY > 500) {
        setIsOpen(true);
        setHasShown(true); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mouseleave", handleExitIntent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, [hasShown, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Same endpoint and mode as your original script
      await fetch("https://script.google.com/macros/s/AKfycbyMUlRY1rQYmA450Lf1t0lMp-C_WAwoCjBpjqDEigCy2fb58dNF4jD7muP2Vi5Ig2odAg/exec", {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          type: "Free Audit" 
        }),
      });
      setStep("success");
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && location.pathname === "/" && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-[2px]"
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0f1115] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl pointer-events-auto overflow-hidden"
            >
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <AnimatePresence mode="wait">
                {step === "form" ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex justify-center mb-6">
                      <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/30">
                        Free Offer
                      </span>
                    </div>
                    
                    <h3 className="text-3xl font-black text-white text-center mb-4 leading-tight">
                      Wait — before you go!
                    </h3>
                    <p className="text-white/50 text-center mb-8 text-sm leading-relaxed">
                      Get a <span className="text-primary font-bold">free 15-minute Shopify store audit</span> — I'll find the top 3 things killing your conversions.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input 
                        type="text" required placeholder="Your name"
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition-all"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <input 
                        type="email" required placeholder="Your email *"
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition-all"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      <button 
                        disabled={loading}
                        className="w-full py-5 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(var(--primary-rgb),0.2)]"
                      >
                        {loading ? "Processing..." : "Get My Free Audit"} <ArrowRight size={20} />
                      </button>
                    </form>
                    <p className="text-[10px] text-white/20 text-center mt-6 uppercase tracking-widest">No spam. Response within 24hrs.</p>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                    <div className="flex justify-center mb-6 text-primary">
                      <CheckCircle2 size={64} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 italic tracking-tight">You're on the list!</h3>
                    <p className="text-white/50 leading-relaxed text-sm">
                      I've received your request. I'll review your store and send the audit report to your inbox within 24 hours.
                    </p>
                    <button 
                      onClick={() => setIsOpen(false)} 
                      className="mt-8 px-8 py-3 border border-white/10 rounded-xl text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                      Close Window
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuditPopup;