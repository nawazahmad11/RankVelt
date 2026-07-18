import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LegalLayout from "../components/LegalLayout";

const RefundPolicy = () => {
  const navigate = useNavigate();

  const lastUpdated = "July 3, 2026";

  const handleInternalLink = (id: string) => {
    navigate("/");

    window.setTimeout(() => {
      const element = document.getElementById(id);

      if (!element) return;

      const headerOffset = 100;
      const position =
        element.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });

      window.history.pushState(null, "", "/");
    }, 400);
  };

  return (
    <LegalLayout title="Refund and Cancellation Policy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            RankVelt Refund Approach
          </h2>

          <p className="leading-relaxed text-white/60">
            RankVelt provides strategy, SEO, website, design, consulting, and
            implementation services. Because these services involve reserved
            time, planning, research, access, custom work, and digital
            deliverables, refund eligibility depends on the stage of work and
            the terms agreed for your project.
          </p>

          <p className="mt-4 leading-relaxed text-white/60">
            A specific signed agreement, proposal, invoice, or project scope may
            include additional or different cancellation and refund terms. Where
            that happens, the written project-specific terms take priority.
          </p>
        </section>

        <section className="border-l-2 border-primary/30 pl-8">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-white">
            Cancellations
          </h2>

          <p className="mb-4 text-white/60">
            Plans can change. If you need to cancel a project or recurring
            service, please notify RankVelt as early as possible in writing.
          </p>

          <ul className="space-y-4">
            {[
              "Before work begins, RankVelt will review whether any payment is refundable under the agreed project terms.",
              "If work has already started, RankVelt may retain fees that reflect completed work, reserved time, research, planning, tools, or delivered materials.",
              "For recurring SEO work, cancellation timing and the current billing period are handled according to the agreed monthly service terms.",
              "Access, work, or scheduled deliverables may be paused while a cancellation request or unpaid balance is being resolved.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/80">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-white">
            Refund Eligibility
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:border-primary/20">
              <h3 className="mb-2 font-bold text-white">Before Work Starts</h3>

              <p className="text-sm leading-relaxed text-white/60">
                If no research, planning, setup, design, SEO work, development,
                or reserved production time has begun, RankVelt may approve a
                refund based on the payment and project terms agreed with you.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:border-primary/20">
              <h3 className="mb-2 font-bold text-white">
                During an Active Project
              </h3>

              <p className="text-sm leading-relaxed text-white/60">
                If a project is underway, any potential refund is assessed after
                accounting for completed milestones, strategy, research,
                communication, revisions, setup, implementation, third-party
                costs, and time already committed.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:border-primary/20">
              <h3 className="mb-2 font-bold text-white">
                After Delivery or Completion
              </h3>

              <p className="text-sm leading-relaxed text-white/60">
                Completed SEO work, delivered strategy documents, website
                design, development, technical fixes, digital deliverables, and
                approved milestones are generally non-refundable unless a
                written project agreement states otherwise.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Third-Party Costs
          </h2>

          <p className="leading-relaxed text-white/60">
            Payments made to third parties are generally outside RankVelt&apos;s
            refund control. These can include domain providers, hosting
            companies, paid themes, plugins, app subscriptions, software tools,
            stock media, advertising platforms, or other external services.
          </p>

          <p className="mt-4 leading-relaxed text-white/60">
            RankVelt will make reasonable efforts to explain relevant
            third-party costs before they are incurred, but third-party refunds
            depend on the policies of those providers.
          </p>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/5 p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            SEO and Results
          </h2>

          <p className="relative z-10 leading-relaxed text-white/60">
            SEO and website-growth services cannot guarantee rankings, traffic,
            leads, revenue, or sales. Refund requests cannot be based solely on
            a particular ranking, traffic, revenue, or timeline expectation
            unless a specific written agreement explicitly says otherwise.
          </p>

          <div className="pointer-events-none absolute right-[-20px] top-[-20px] select-none text-8xl font-black text-primary/5">
            SEO
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Requesting a Cancellation or Refund Review
          </h2>

          <p className="leading-relaxed text-white/60">
            To request a cancellation or refund review, contact RankVelt in
            writing with your name, project details, invoice or payment
            information, and the reason for your request. RankVelt will review
            the request in line with the agreed scope and work completed.
          </p>

          <a
            href="mailto:info@nawazbuilds.com"
            className="mt-5 inline-flex font-bold text-primary hover:underline"
          >
            Contact RankVelt about a refund request
          </a>
        </section>

        <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Explore RankVelt Services
          </h2>

          <p className="leading-relaxed text-white/60">
            Before starting paid work, RankVelt aims to make the service scope,
            priorities, and expected deliverables clear.
          </p>

          <button
            type="button"
            onClick={() => handleInternalLink("services")}
            className="mt-5 border-none bg-transparent p-0 font-bold text-primary hover:underline"
          >
            Explore RankVelt SEO services
          </button>
        </section>

        <footer className="flex flex-col items-center gap-4 border-t border-white/5 pt-12 md:flex-row md:justify-between">
          <p className="text-[10px] uppercase tracking-[4px] text-white/50">
            Last Updated: {lastUpdated}
          </p>

          <p className="text-[10px] uppercase tracking-[4px] text-white/50">
            RankVelt © 2026
          </p>
        </footer>
      </motion.div>
    </LegalLayout>
  );
};

export default RefundPolicy;