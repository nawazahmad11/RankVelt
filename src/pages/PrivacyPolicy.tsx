import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LegalLayout from "../components/LegalLayout";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const lastUpdated = "July 3, 2026";

  /*
    Replace this email once your final RankVelt business email is ready.
  */
  const contactEmail = "info@nawazbuilds.com";

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
    <LegalLayout title="Privacy Policy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Introduction
          </h2>

          <p className="leading-relaxed text-white/60">
            Welcome to <span className="font-bold text-primary">RankVelt</span>.
            This Privacy Policy explains how RankVelt collects, uses, stores,
            and protects personal information when you visit
            <span className="mx-1 border-b border-white/20 text-white">
              rankvelt.com
            </span>
            or submit an enquiry through this website.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-white">
            Information We May Collect
          </h2>

          <p className="mb-6 font-light text-white/60">
            The information collected depends on the form or service you use.
            It may include:
          </p>

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Your name.",
              "Your business email address.",
              "Your WhatsApp or phone number.",
              "Your website situation and business goals.",
              "Information you include in a project or strategy request.",
              "Your email address when you subscribe to updates.",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-white/80"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            How Your Information Is Used
          </h2>

          <div className="space-y-4">
            <p className="text-white/60">
              RankVelt may use your information to:
            </p>

            <ul className="space-y-4 border-l border-primary/20 pl-6">
              {[
                "Respond to your request, enquiry, or strategy-call submission.",
                "Review website, SEO, local visibility, eCommerce, or design opportunities you share with us.",
                "Prepare a proposal, project scope, or follow-up communication.",
                "Send requested website, SEO, or business-growth updates.",
                "Maintain reasonable internal records related to enquiries and services.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3 text-white/70">
                  <span className="font-bold text-primary">{index + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-primary/10 bg-primary/5 p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Form and Service Providers
          </h2>

          <p className="leading-relaxed text-white/60">
            RankVelt currently uses third-party services to operate website
            forms and enquiries. Strategy-call requests may be processed through
            Supabase. Newsletter and popup audit requests may be sent through a
            Google Apps Script endpoint. These providers may process the
            information needed to deliver the relevant form or service.
          </p>

          <p className="mt-4 leading-relaxed text-white/60">
            This page should be updated if additional analytics, advertising,
            cookie-consent, CRM, email-marketing, or tracking tools are added
            later.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Data Retention
          </h2>

          <p className="leading-relaxed text-white/60">
            RankVelt keeps personal information only for as long as reasonably
            necessary to respond to an enquiry, provide services, maintain
            project records, resolve issues, or meet applicable business and
            legal obligations.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Your Choices and Requests
          </h2>

          <p className="leading-relaxed text-white/60">
            Depending on applicable law, you may ask RankVelt to update,
            correct, delete, or provide information about the personal data
            connected with your enquiry. To make a request, contact:
          </p>

          <a
            href={`mailto:${contactEmail}`}
            className="mt-4 inline-flex font-bold text-primary hover:underline"
          >
            {contactEmail}
          </a>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/5 p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Data Security
          </h2>

          <p className="relative z-10 leading-relaxed text-white/60">
            RankVelt takes reasonable steps to protect submitted information.
            However, no website, internet transmission, or storage system can
            guarantee absolute security. Please avoid sending highly sensitive
            information through general website forms.
          </p>

          <div className="pointer-events-none absolute right-[-20px] top-[-20px] select-none text-8xl font-black text-primary/5">
            SEO
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Changes to This Policy
          </h2>

          <p className="leading-relaxed text-white/60">
            RankVelt may update this Privacy Policy when website tools,
            services, data practices, or legal requirements change. The latest
            version will be published on this page with an updated date.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Contact RankVelt
          </h2>

          <p className="leading-relaxed text-white/60">
            For privacy questions or general service enquiries, contact
            RankVelt by email or review our work and service approach on the
            homepage.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            <a
              href={`mailto:${contactEmail}`}
              className="font-bold text-primary hover:underline"
            >
              Email RankVelt
            </a>

            <button
              type="button"
              onClick={() => handleInternalLink("portfolio")}
              className="border-none bg-transparent p-0 font-bold text-primary hover:underline"
            >
              View website work
            </button>
          </div>
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

export default PrivacyPolicy;