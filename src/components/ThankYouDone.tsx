import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Home,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ThankYouDone = () => {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("Direct Inquiry");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("package");

    if (plan?.trim()) {
      setSelectedPlan(plan.trim());
    }
  }, []);

  const whatsappMessage = `Hi RankVelt, I submitted a request for ${selectedPlan}.`;

  const whatsappUrl = `https://wa.me/923244146447?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pb-16 pt-28">
      <motion.div
        className="glass-card mx-auto max-w-xl p-8 text-center sm:p-10"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
          <CheckCircle className="check-green h-8 w-8" />
        </div>

        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-primary">
          RankVelt Request Received
        </p>

        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          You&apos;re all set. 🎉
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
          Your request for{" "}
          <span className="font-bold text-primary">{selectedPlan}</span> has
          been received.
        </p>

        <div className="glass-card mb-8 rounded-2xl p-5 text-left text-sm">
          <div className="flex items-start gap-3">
            <MessageCircle className="check-green mt-0.5 h-5 w-5 shrink-0" />

            <p className="leading-relaxed text-muted-foreground">
              RankVelt will review your details and contact you on WhatsApp or
              email with the next steps. Please keep an eye on your inbox and
              WhatsApp messages.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Back to Homepage
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-cta flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYouDone;