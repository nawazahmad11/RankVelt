import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const PricingSection = () => {
  const handleCTA = (packageName: string) => {
    const encodedPackage = encodeURIComponent(packageName);

    window.location.href = `/strategy-call?package=${encodedPackage}`;
  };

  const plans = [
    {
      title: "SEO Opportunity Check",
      price: "Free",
      subtitle: "A Focused Starting Point",
      features: [
        "Initial website opportunity review",
        "Top SEO and visibility gaps",
        "Local or eCommerce direction",
        "Practical next-step priorities",
      ],
      buttonLabel: "Request Free Check",
      packageName: "Free SEO Opportunity Check",
      featured: false,
    },
    {
      title: "SEO Growth Plan",
      price: "Custom",
      subtitle: "For Ongoing SEO Growth",
      features: [
        "SEO audit and growth roadmap",
        "Priority page optimization",
        "Technical SEO improvements",
        "Content and keyword strategy",
        "Clear reporting and next steps",
      ],
      buttonLabel: "Request a Proposal",
      packageName: "SEO Growth Plan",
      featured: true,
    },
    {
      title: "Website + SEO",
      price: "Custom",
      subtitle: "For Businesses Building Better Foundations",
      features: [
        "SEO-ready WordPress website",
        "Shopify store design and structure",
        "Landing pages built for conversion",
        "Technical and on-page SEO setup",
        "Custom scope around business goals",
      ],
      buttonLabel: "Discuss Your Project",
      packageName: "Website + SEO Project",
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="relative z-20 overflow-hidden py-24">
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-primary">
            Flexible Growth Support
          </p>

          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Choose the right{" "}
            <span className="text-gradient-gold">starting point.</span>
          </h2>

          <p className="mx-auto max-w-[650px] text-lg font-light text-white/60">
            Every business has a different website, market, and competition
            level. RankVelt scopes SEO and web work around your actual growth
            goals instead of forcing a generic package.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-7xl items-stretch gap-6 md:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.title}
              whileHover={{ y: plan.featured ? -12 : -8 }}
              className={`glass-card relative flex h-full flex-col p-8 transition-all duration-300 ${
                plan.featured
                  ? "z-30 border-2 border-primary/40 bg-white/[0.04] shadow-2xl shadow-primary/10 hover:border-primary/60 md:scale-105"
                  : "border border-white/5 bg-white/[0.02] shadow-lg hover:border-white/20"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-[10px] font-black uppercase text-black shadow-md animate-pulse">
                  Most Popular
                </div>
              )}

              <div className="mb-6 min-h-32">
                <h3
                  className={`text-lg font-bold ${
                    plan.featured ? "text-primary" : "text-white/70"
                  }`}
                >
                  {plan.title}
                </h3>

                <div
                  className={`mt-2 text-4xl font-black tracking-tight ${
                    plan.featured ? "text-white md:text-5xl" : "text-white"
                  }`}
                >
                  {plan.price}
                </div>

                <p
                  className={`mt-2 text-[12px] italic uppercase tracking-wider ${
                    plan.featured ? "text-primary/70" : "text-white/55"
                  }`}
                >
                  {plan.subtitle}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((item) => (
                  <li
                    key={item}
                    className={`flex items-center gap-3 text-sm ${
                      plan.featured
                        ? "text-white/90"
                        : "font-light text-white/70"
                    }`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 shrink-0 ${
                        plan.featured ? "text-primary" : "text-green-500/80"
                      }`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleCTA(plan.packageName)}
                className={
                  plan.featured
                    ? "gradient-cta w-full rounded-xl py-4 text-sm font-black uppercase tracking-widest text-black transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                    : "w-full rounded-lg border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                }
              >
                {plan.buttonLabel}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;