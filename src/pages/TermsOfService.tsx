import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LegalLayout from "../components/LegalLayout";

const TermsOfService = () => {
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
    <LegalLayout title="Terms and Conditions">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Welcome to RankVelt
          </h2>

          <p className="font-light leading-relaxed text-white/60">
            These Terms and Conditions explain the general rules for using
            <span className="mx-1 font-bold text-primary">RankVelt</span>
            and working with RankVelt on SEO, website design, Shopify,
            WordPress, conversion, or digital-growth services.
          </p>

          <p className="mt-4 font-light leading-relaxed text-white/60">
            By browsing this website, submitting a form, requesting a proposal,
            or starting a paid project, you agree to these terms. A separate
            proposal, scope of work, invoice, or signed agreement may include
            additional terms for a specific project. Where there is a conflict,
            the specific written project agreement takes priority.
          </p>
        </section>

        <section className="border-l-2 border-primary/30 pl-8">
          <h2 className="mb-4 text-xl font-bold uppercase tracking-wider text-white">
            Services
          </h2>

          <p className="leading-relaxed text-white/60">
            RankVelt may provide Local SEO, eCommerce SEO, Business SEO,
            technical SEO reviews, keyword and content planning, WordPress
            website design, Shopify store design, landing pages, conversion
            improvements, website audits, and related digital-growth services.
          </p>

          <p className="mt-4 leading-relaxed text-white/60">
            The exact services, deliverables, timing, pricing, revision limits,
            and responsibilities for a paid project will be confirmed in the
            applicable proposal, project scope, invoice, or written agreement.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-white">
            Client Responsibilities
          </h2>

          <p className="mb-6 font-light text-white/60">
            To deliver effective work, RankVelt may need timely access,
            approvals, and accurate information from you. You agree to:
          </p>

          <ul className="space-y-4">
            {[
              "Provide accurate business, website, brand, technical, and contact information.",
              "Provide appropriate access to the website, CMS, Shopify, WordPress, analytics, or other agreed accounts when required.",
              "Confirm that you have permission to use any images, logos, content, products, data, or accounts you provide.",
              "Review requested work and provide approvals, feedback, or required materials within a reasonable time.",
              "Keep payment, contact, and project information accurate and current.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-4 text-white/80">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Fees and Payments
          </h2>

          <p className="leading-relaxed text-white/60">
            Pricing, deposits, payment schedules, and any recurring SEO fees
            will be confirmed before paid work begins. RankVelt may pause work,
            delivery, access, or support if an agreed payment is overdue.
          </p>

          <p className="mt-4 leading-relaxed text-white/60">
            Third-party costs are not included unless explicitly stated. These
            may include software subscriptions, paid themes, plugins, domains,
            hosting, advertising spend, external tools, stock media, or other
            services required for the project.
          </p>
        </section>

        <section className="rounded-[2rem] border border-primary/10 bg-primary/5 p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Scope Changes and Revisions
          </h2>

          <p className="leading-relaxed text-white/60">
            Requests outside the agreed scope may require a revised timeline,
            additional payment, or a separate proposal. RankVelt will make
            reasonable efforts to communicate this before beginning extra work.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Intellectual Property
          </h2>

          <p className="leading-relaxed text-white/60">
            Subject to full payment and the terms of the relevant project
            agreement, final client-specific deliverables created for your
            project may be transferred or licensed to you as agreed. RankVelt
            retains ownership of its pre-existing tools, methods, templates,
            systems, frameworks, know-how, reusable code, and brand assets.
          </p>

          <p className="mt-4 leading-relaxed text-white/60">
            RankVelt may display completed work in a portfolio or case-study
            format unless a written confidentiality or non-disclosure agreement
            says otherwise.
          </p>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            SEO and Performance Disclaimer
          </h2>

          <p className="relative z-10 leading-relaxed text-white/60">
            SEO, rankings, traffic, leads, revenue, and conversion outcomes can
            be affected by competition, search-engine changes, website history,
            content quality, market demand, user behaviour, third-party
            platforms, technical limitations, and your own business operations.
            RankVelt does not guarantee a particular Google ranking, traffic
            amount, lead volume, revenue level, or timeline.
          </p>

          <div className="pointer-events-none absolute bottom-[-20px] right-[-20px] select-none text-8xl font-black text-white/[0.025]">
            SEO
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-red-400/80">
            Limitation of Liability
          </h2>

          <p className="leading-relaxed text-white/60">
            To the maximum extent permitted by applicable law, RankVelt is not
            responsible for indirect, incidental, special, or consequential
            losses, including lost profits, lost data, lost sales, ranking
            changes, third-party platform issues, advertising performance, or
            business interruptions.
          </p>

          <p className="mt-4 leading-relaxed text-white/60">
            You remain responsible for your products, services, advertising,
            customer communications, legal compliance, website content,
            business decisions, and the use of any recommendations provided.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Changes to These Terms
          </h2>

          <p className="leading-relaxed text-white/60">
            RankVelt may update these terms when services, processes, tools, or
            legal requirements change. The latest version will be published on
            this page with an updated date.
          </p>
        </section>

        <section className="rounded-[2rem] border border-primary/10 bg-primary/5 p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Work and Service Enquiries
          </h2>

          <p className="leading-relaxed text-white/60">
            You can explore website projects, request an SEO opportunity check,
            or contact RankVelt directly to discuss your business needs.
          </p>

          <button
            type="button"
            onClick={() => handleInternalLink("portfolio")}
            className="mt-5 border-none bg-transparent p-0 font-bold text-primary hover:underline"
          >
            View RankVelt website work
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

export default TermsOfService;