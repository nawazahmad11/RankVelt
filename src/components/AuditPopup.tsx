import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

const AUDIT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyMUlRY1rQYmA450Lf1t0lMp-C_WAwoCjBpjqDEigCy2fb58dNF4jD7muP2Vi5Ig2odAg/exec";

const AuditPopup = () => {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const scrollableHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (scrollableHeight <= 0) return;

      const scrollPercent = (scrollTop / scrollableHeight) * 100;

      if (scrollPercent > 40 && !hasShown && scrollTop > 300) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    const handleExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 0 && !hasShown && window.scrollY > 500) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleExitIntent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, [hasShown, location.pathname]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      await fetch(AUDIT_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          name: formData.name.trim(),
          type: "Free SEO Opportunity Check",
        }),
      });

      setStep("success");
    } catch (error) {
      console.error("SEO audit lead submission error:", error);
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

          <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f1115] p-7 shadow-2xl sm:p-10"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-6 top-6 z-10 text-white/40 transition-colors hover:text-white"
                aria-label="Close SEO audit popup"
              >
                <X size={24} />
              </button>

              <AnimatePresence mode="wait">
                {step === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-6 flex justify-center">
                      <span className="rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
                        Free SEO Opportunity Check
                      </span>
                    </div>

                    <h3 className="mb-4 text-center text-3xl font-black leading-tight text-white">
                      Before you go, find what is holding your website back.
                    </h3>

                    <p className="mb-7 text-center text-sm leading-relaxed text-white/50">
                      Get a focused first look at SEO, search visibility,
                      technical, local, or eCommerce growth opportunities.
                    </p>

                    <div className="mb-7 space-y-3">
                      {[
                        "Search visibility review",
                        "Technical and on-page gaps",
                        "Local or eCommerce opportunities",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 text-sm text-white/70"
                        >
                          <CheckCircle2 size={16} className="text-primary" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        placeholder="Your name"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            name: event.target.value,
                          }))
                        }
                      />

                      <input
                        type="email"
                        required
                        value={formData.email}
                        placeholder="Business email"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            email: event.target.value,
                          }))
                        }
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-5 font-black uppercase tracking-widest text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Processing..." : "Request My Free SEO Check"}

                        <ArrowRight size={20} />
                      </button>
                    </form>

                    <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-white/20">
                      No spam. Response within 24hrs.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 text-center"
                  >
                    <div className="mb-6 flex justify-center text-primary">
                      <CheckCircle2 size={64} strokeWidth={1.5} />
                    </div>

                    <h3 className="mb-4 text-3xl font-black italic tracking-tight text-white">
                      Request received!
                    </h3>

                    <p className="text-sm leading-relaxed text-white/50">
                      Your SEO opportunity check request has been received.
                      RankVelt will review it and reply with the next steps.
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="mt-8 rounded-xl border border-white/10 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white/60 transition-all hover:bg-white/5"
                    >
                      Continue Browsing
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