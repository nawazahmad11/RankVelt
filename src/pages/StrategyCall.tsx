import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Globe2,
  Mail,
  PenTool,
  Phone,
  Send,
  Target,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const StrategyCallForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Direct Inquiry");

  /*
    IMPORTANT:
    These field names are intentionally retained because your current
    Supabase table uses these existing columns:
    - existing_shopify_store
    - monthly_revenue_goal
    - ready_to_invest

    Only visitor-facing labels are changed for RankVelt SEO services.
  */
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    hasStore: "",
    revenueGoal: "",
    readyToInvest: "",
    message: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("package");

    if (plan?.trim()) {
      setSelectedPlan(plan.trim());
    }
  }, []);

  const handleChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.whatsapp.trim() ||
      !form.message.trim() ||
      !form.hasStore ||
      !form.revenueGoal ||
      !form.readyToInvest
    ) {
      toast({
        title: "Missing information",
        description:
          "Please complete all fields so RankVelt can review your request properly.",
        variant: "destructive",
      });

      return;
    }

    setLoading(true);

    const leadSummary = [
      `Requested service: ${selectedPlan}`,
      `Website situation: ${form.hasStore}`,
      `Primary growth goal: ${form.revenueGoal}`,
      `Investment timeline: ${form.readyToInvest}`,
      "",
      `Business notes: ${form.message.trim()}`,
    ].join("\n");

    try {
      /*
        Existing Supabase functionality is preserved.
        Column names are not changed to avoid breaking your current table.
      */
      const { error } = await supabase.from("seo_leads").insert({
        full_name: form.name.trim(),
        email: form.email.trim(),
        whatsapp_number: form.whatsapp.trim(),
        brand_goals: leadSummary,
        existing_shopify_store: form.hasStore,
        monthly_revenue_goal: form.revenueGoal,
        ready_to_invest: form.readyToInvest,
      });

      if (error) {
        throw error;
      }

      /*
        Existing optional Meta Pixel functionality is preserved.
        This only runs when fbq is already installed elsewhere on the site.
      */
      const trackingWindow = window as typeof window & {
        fbq?: (
          action: string,
          eventName: string,
          payload?: Record<string, string>,
        ) => void;
      };

      trackingWindow.fbq?.("track", "Lead", {
        content_name: selectedPlan,
        status: "RankVelt Strategy Request",
      });

      toast({
        title: "Request received! 🎉",
        description: "Redirecting to your confirmation page...",
      });

      navigate(`/thank-you?package=${encodeURIComponent(selectedPlan)}`);
    } catch (error) {
      console.error("RankVelt lead form error:", error);

      toast({
        title: "Something went wrong",
        description:
          "Your request could not be submitted. Please try again or contact RankVelt on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectionButtonClass = (isSelected: boolean) =>
    `rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
      isSelected
        ? "border-primary bg-primary/10 text-primary"
        : "border-white/10 bg-secondary/30 text-muted-foreground hover:border-white/30 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-background py-12 pt-28 sm:py-20 sm:pt-32">
      <div className="section-container">
        <motion.div
          className="mx-auto max-w-xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="mb-10 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <CheckCircle className="h-4 w-4" />
              Final Step
            </div>

            <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
              Request Your{" "}
              <span className="text-gradient-gold">Growth Strategy Call</span>
            </h1>

            <p className="text-muted-foreground">
              Interested in:{" "}
              <span className="font-bold text-white">{selectedPlan}</span>
            </p>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            custom={1}
            onSubmit={handleSubmit}
            className="glass-card space-y-6 p-6 sm:p-8"
          >
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <p className="text-sm leading-relaxed text-white/70">
                  Share a few details about your business. This helps RankVelt
                  understand whether you need Local SEO, eCommerce SEO, a
                  website rebuild, or a broader growth plan.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) =>
                    handleChange("name", event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-secondary/50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/50"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Business Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-secondary/50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/50"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                WhatsApp Number
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />

                <input
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={(event) =>
                    handleChange("whatsapp", event.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-secondary/50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/50"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                What is your website situation?
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "I have an existing website",
                  "I need a new website",
                  "I need a redesign",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleChange("hasStore", option)}
                    className={selectionButtonClass(
                      form.hasStore === option,
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                What is your main growth goal?
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "More local leads",
                  "More organic traffic",
                  "More eCommerce sales",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleChange("revenueGoal", option)}
                    className={selectionButtonClass(
                      form.revenueGoal === option,
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                When are you ready to invest in growth?
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {["Ready now", "Within 30 days", "Researching options"].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange("readyToInvest", option)}
                      className={selectionButtonClass(
                        form.readyToInvest === option,
                      )}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Tell RankVelt about your business and goals
              </label>

              <div className="relative">
                <PenTool className="absolute left-3 top-3 h-4 w-4 text-white/40" />

                <textarea
                  required
                  value={form.message}
                  onChange={(event) =>
                    handleChange("message", event.target.value)
                  }
                  className="min-h-[120px] w-full rounded-lg border border-white/10 bg-secondary/50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/50"
                  placeholder="For example: We are a local service business in Toronto and want more calls from Google. Or: We have a Shopify store and need better collection-page traffic."
                />
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <p className="text-xs leading-relaxed text-white/55">
                By sending this request, you agree that RankVelt may contact
                you about your enquiry using the details you provide.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-cta flex w-full items-center justify-center gap-2 rounded-lg py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-5 w-5" />
              {loading
                ? "Submitting Request..."
                : "Confirm My Strategy Request"}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default StrategyCallForm;