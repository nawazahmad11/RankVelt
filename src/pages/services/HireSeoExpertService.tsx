import SeoServiceTemplate, {
  type SeoServicePageConfig,
} from "./SeoServiceTemplate";

const hireSeoExpertConfig: SeoServicePageConfig = {
  slug: "/hire-seo-expert",

  metaTitle:
    "Hire SEO Expert: Vetted Agency Specialist | RankVelt",

  metaDescription:
    "Hire an SEO expert from RankVelt and skip the marketplace gamble. Vetted agency specialists with AI search and GEO expertise, from $525/month.",

  eyebrow: "Hire SEO Expert",

  h1: "Hire an SEO Expert Without the Marketplace Gamble",

  intro:
    "Hiring on Upwork or Fiverr is a lottery. Profiles look similar, reviews can be gamed, and none of the marketplaces offer real AI-search expertise. RankVelt gives you a vetted agency SEO specialist who is accountable for results, not just deliverables.",

  focusAreas: [
    "Vetted SEO Specialists",
    "AI Search Expertise",
    "Transparent Pricing",
    "Monthly Reporting",
  ],

  overviewTitle:
    "An Expert Who Answers to You, Not to a Platform",

  overviewParagraphs: [
    "Marketplaces optimise for the marketplace. Freelancers there juggle dozens of clients, compete on price, and disappear when a better gig appears. You get task completion, not ownership of your growth.",

    "When you hire an SEO expert through RankVelt, you get a dedicated specialist backed by an agency process: proper audits, documented strategy, regular reporting and direct communication. One person owns your account and answers for it.",

    "There is another gap the marketplaces cannot close. AI search has changed what SEO expertise means. Your specialist needs to understand citations in AI Overviews, entity optimisation and GEO, not just meta tags and backlinks. That is the expertise RankVelt was built around.",
  ],

  deliverablesTitle: "What Your SEO Expert Handles",

  deliverables: [
    "Full technical SEO audit with a prioritised action plan.",
    "Keyword research mapped to pages with real commercial intent.",
    "On-page optimisation: metadata, headings, content structure and internal links.",
    "AI-search readiness: entity signals, schema and citation-friendly content.",
    "Content briefs and publishing guidance for your team or writers.",
    "Monthly reporting in plain language: what changed, what worked, what is next.",
    "Direct communication with the specialist working on your account.",
  ],

  audienceTitle: "Hiring an SEO Expert Is a Strong Fit For",

  audience: [
    "Business owners burned by freelancers who vanished mid-project.",
    "Teams that need consistent SEO ownership rather than one-off gigs.",
    "Companies whose customers now research through ChatGPT and AI Overviews.",
    "Agencies that want a white-label SEO specialist for client work.",
    "Startups that need senior-level thinking without a full-time hire.",
  ],

  outcomesTitle: "What a Good SEO Expert Should Improve",

  outcomes: [
    "Clear ownership of your SEO strategy and execution.",
    "Technical issues fixed in priority order, not at random.",
    "Content that targets searches with genuine buying intent.",
    "Visibility in both Google rankings and AI-generated answers.",
    "Reporting you can actually understand and act on.",
  ],

  processTitle: "How Hiring Works",

  process: [
    {
      step: "01",
      title: "Discover",
      description:
        "A free opportunity check reviews your site, market and goals so the engagement starts from evidence, not guesses.",
    },
    {
      step: "02",
      title: "Plan",
      description:
        "Your specialist builds a prioritised roadmap covering technical fixes, content and AI-search visibility.",
    },
    {
      step: "03",
      title: "Execute",
      description:
        "Work begins in priority order. You always know what is being done and why it matters for your revenue.",
    },
    {
      step: "04",
      title: "Report",
      description:
        "Monthly reports show movement in rankings, traffic and AI citations, with next steps agreed together.",
    },
  ],

  faqs: [
    {
      question: "Why hire an SEO expert instead of using Upwork or Fiverr?",
      answer:
        "Marketplaces reward low prices and fast turnover, which is the opposite of what good SEO needs. An agency SEO expert gives you vetted skill, a documented process, consistent availability and accountability. You also get AI-search expertise that marketplace freelancers rarely offer.",
    },
    {
      question: "What is the difference between an SEO expert and an SEO freelancer?",
      answer:
        "A freelancer typically completes isolated tasks you assign. An SEO expert owns the strategy: auditing, prioritising, executing and reporting against your business goals. With RankVelt you get the expert plus the agency process behind them.",
    },
    {
      question: "How much does it cost to hire an SEO expert?",
      answer:
        "RankVelt engagements start at $525 per month, with a minimum term of 3 months and then month to month. That is the full engagement price with no hidden fees. Marketplace rates may look cheaper per gig, but the cost of poor strategy and rework usually exceeds the saving.",
    },
    {
      question: "Do I get a dedicated specialist or a rotating team?",
      answer:
        "You get a dedicated specialist who owns your account and knows your business. They are supported by agency processes and reviews, but you always deal with the same person.",
    },
    {
      question: "Will my SEO expert understand AI search and GEO?",
      answer:
        "Yes. AI-search visibility is core to how RankVelt works. Your specialist covers entity optimisation, citation-friendly content structure and schema alongside traditional technical SEO, so your brand can appear in AI Overviews, ChatGPT and Perplexity answers.",
    },
    {
      question: "How do I know the work is actually happening?",
      answer:
        "Through monthly reporting in plain language and direct access to your specialist. Every report covers what was done, what changed in rankings and visibility, and what is planned next. You can ask questions any time.",
    },
    {
      question: "Can I hire an SEO expert for a short project?",
      answer:
        "Engagements start with a 3 month minimum because SEO needs time to compound. After that everything is month to month, so you are never locked in longer than the work earns its place.",
    },
    {
      question: "What do you need from me to get started?",
      answer:
        "Access to your website and analytics, plus a short conversation about your goals and customers. Your specialist handles the rest, starting with a full audit before any changes are made.",
    },
  ],

  relatedServices: [
    {
      title: "AI SEO Agency",
      description:
        "Full AI-first SEO engagements built for Google and AI search.",
      path: "/ai-seo-agency",
    },
    {
      title: "SEO Audit Services",
      description:
        "Start with an audit and see exactly what an expert would fix first.",
      path: "/seo-audit-services",
    },
    {
      title: "Book a Strategy Call",
      description:
        "Talk through your goals before you commit to anything.",
      path: "/strategy-call",
    },
  ],
};

export default function HireSeoExpertService() {
  return (
    <SeoServiceTemplate config={hireSeoExpertConfig} />
  );
}
