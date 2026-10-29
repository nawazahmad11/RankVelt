import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  Wrench,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const services = [
  {
    icon: Search,
    title: "SEO",
    text: "Full search engine optimization for business websites. Keyword research, on page work, internal linking and content that targets buyers, not just traffic.",
    link: "/business-seo",
    linkLabel: "Business SEO services",
  },
  {
    icon: MapPin,
    title: "Local SEO",
    text: "Google Business Profile, maps rankings, citations and reviews. Built for local service businesses that need calls and jobs from their own area.",
    link: "/local-seo",
    linkLabel: "Local SEO services",
  },
  {
    icon: ShoppingCart,
    title: "eCommerce SEO",
    text: "Product and category page optimization for online stores, including Shopify and WooCommerce. The goal is product discovery that turns into sales.",
    link: "/ecommerce-seo",
    linkLabel: "eCommerce SEO services",
  },
  {
    icon: Wrench,
    title: "Technical SEO",
    text: "Crawl issues, site speed, index problems, redirects and site structure. The unglamorous work that decides whether good content can rank at all.",
    link: "/technical-seo-services",
    linkLabel: "Technical SEO services",
  },
  {
    icon: Bot,
    title: "AEO and GEO",
    text: "Answer engine and generative engine optimization. We structure content so AI search tools like Google AI Overviews, ChatGPT and Perplexity can cite your business.",
    link: "/ai-seo-agency",
    linkLabel: "AI SEO agency",
  },
  {
    icon: ClipboardCheck,
    title: "SEO Audits",
    text: "A clear audit of what is holding your site back, in plain language, with a fixed order of work. Every engagement with RankVelt can start here, free.",
    link: "/seo-audit-services",
    linkLabel: "SEO audit services",
  },
];

const steps = [
  {
    title: "1. Free audit first",
    text: "We start by auditing your website for free. You see the real problems before you pay anything.",
  },
  {
    title: "2. A clear plan",
    text: "You get a written plan in simple words. What will be done, in what order, and why it matters for your business.",
  },
  {
    title: "3. The work gets done",
    text: "Technical fixes, content and authority building, done in the order the plan sets out. No random tasks and no busywork.",
  },
  {
    title: "4. Honest monthly reports",
    text: "Every month you get a clear report. What was done, what moved, and what comes next. Good news and bad news both included.",
  },
];

const differences = [
  "Published pricing. SEO plans start at $525 per month, with a 3 month initial term and rolling monthly terms after that.",
  "No ranking guarantees, because no honest agency can promise a position on Google. We promise the work, the process and clear reporting instead.",
  "Founder led work. You talk to the person who plans your SEO, not a sales rep or an account manager reading a script.",
  "Free tools and free audits first, so you can judge our thinking before you spend anything.",
  "Plain language reports. If a report needs a glossary, it has failed, so we write reports a business owner can actually read.",
];

const faqs = [
  {
    q: "Where is RankVelt based?",
    a: "RankVelt is based in Valancia Town, Lahore, Pakistan. We work with clients remotely, so your business does not need to be in Pakistan for us to help you.",
  },
  {
    q: "Who founded RankVelt?",
    a: "RankVelt was founded in 2025 by Nawaz Ahmad, an SEO strategist and web growth specialist. The agency is founder led, which means the person you speak to is the person who plans the work.",
  },
  {
    q: "How much does SEO cost at RankVelt?",
    a: "SEO plans start at $525 per month. The initial term is 3 months, and after that the plan runs month to month. There are no setup fees hidden in the small print.",
  },
  {
    q: "Do you guarantee first page rankings?",
    a: "No, and you should be careful with any agency that does. Google controls the rankings, not us. What we guarantee is real work, a clear plan and honest monthly reporting.",
  },
  {
    q: "How long does SEO take to show results?",
    a: "Most sites see early movement in the first few months, and stronger results after that. It depends on your market, your site history and your competition. We would rather tell you that plainly than sell you a fantasy timeline.",
  },
  {
    q: "How do we start working with RankVelt?",
    a: "Start with a free SEO audit or a strategy call. We look at your site, show you what we found, and only then talk about a plan. If the fit is not right, you still keep the audit.",
  },
];

const findUsGroups = [
  {
    title: "Social",
    links: [
      { label: "Facebook", url: "https://facebook.com/rankvelt" },
      { label: "Instagram", url: "https://instagram.com/rankvelt" },
      { label: "X", url: "https://x.com/RankVelts" },
      { label: "YouTube", url: "https://www.youtube.com/@rankvelts" },
      { label: "TikTok", url: "https://www.tiktok.com/@rankvelt3" },
      { label: "LinkedIn", url: "https://www.linkedin.com/company/rankvelt" },
      { label: "Reddit", url: "https://www.reddit.com/user/nawazahmad_seo/" },
      { label: "Gravatar", url: "https://gravatar.com/rankvelt" },
    ],
  },
  {
    title: "Writing and content",
    links: [
      { label: "Medium", url: "https://medium.com/@rankvelt" },
      { label: "Substack", url: "https://rankvelt.substack.com" },
      { label: "dev.to", url: "https://dev.to/rankvelt" },
      { label: "HackerNoon", url: "https://hackernoon.com/u/nawazahmad" },
      { label: "Quora", url: "https://www.quora.com/profile/Nawaz-Ahmad-289" },
      { label: "SoundCloud", url: "https://soundcloud.com/rankvelt" },
      { label: "GitHub", url: "https://github.com/rankvelt" },
      { label: "SourceForge", url: "https://sourceforge.net/projects/rankvelt-free-seo-tools/" },
      { label: "Product Hunt", url: "https://www.producthunt.com/products/rankvelt-free-seo-tools" },
    ],
  },
  {
    title: "Directories and listings",
    links: [
      { label: "Clutch", url: "https://clutch.co/profile/rankvelt" },
      { label: "GoodFirms", url: "https://www.goodfirms.co/company/rankvelt" },
      { label: "Crunchbase", url: "https://www.crunchbase.com/organization/rankvelt" },
      { label: "Sortlist", url: "https://www.sortlist.com/agency/rankvelt" },
      { label: "Trustpilot", url: "https://www.trustpilot.com/review/rankvelt.com" },
      { label: "G2", url: "https://www.g2.com/products/rankvelt-free-seo-tools/reviews" },
      { label: "Manta", url: "https://www.manta.com/c/m1hlgcb/rankvelt" },
      { label: "Foursquare", url: "https://app.foursquare.com/v/rankvelt/6ae0bfc61f47570e40eaabf5" },
    ],
  },
  {
    title: "Communities",
    links: [
      { label: "WordPress", url: "https://profiles.wordpress.org/rankvelt/" },
      { label: "Cloudflare Community", url: "https://community.cloudflare.com/u/rankvelt/summary" },
      { label: "Mozilla Support", url: "https://support.mozilla.org/en-US/user/rankvelt/" },
      { label: "Shopify Community", url: "https://community.shopify.com/u/rankvelt" },
      { label: "HubSpot Community", url: "https://community.hubspot.com/u/rankvelt/summary" },
      { label: "Salesforce Trailblazer", url: "https://www.salesforce.com/trailblazer/rankvelt" },
      { label: "Imgur", url: "https://imgur.com/user/rankvelt/about" },
      { label: "XDA Forums", url: "https://xdaforums.com/m/rankvelt.13488157/" },
      { label: "Autodesk Community", url: "https://forums.autodesk.com/t5/user/viewprofilepage/user-id/19675202" },
      { label: "PrestaShop Forum", url: "https://forum.prestashop.com/profile/2013048-rankvelt/" },
      { label: "Moz Community", url: "https://moz.com/community/q/user/rankvelt" },
      { label: "Atlassian Community", url: "https://community.atlassian.com/user/profile/3856d07a-5b2e-46dd-a843-7f8ed433efc8" },
      { label: "Envato", url: "https://themeforest.net/user/rankvelt" },
      { label: "Linus Tech Tips", url: "https://linustechtips.com/profile/1224899-rankvelt/" },
      { label: "Squarespace Forum", url: "https://forum.squarespace.com/profile/566782-rankvelt/" },
      { label: "Square Seller Community", url: "https://community.squareup.com/t5/user/viewprofilepage/user-id/776178" },
      { label: "BuddyPress", url: "https://buddypress.org/members/rankvelt/profile/" },
      { label: "Matomo Forum", url: "https://forum.matomo.org/u/rankvelt" },
      { label: "Colorlib Support", url: "https://colorlibsupport.com/u/rankvelt/summary" },
      { label: "Behance", url: "https://www.behance.net/rankvelt" },
      { label: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/users/rankvelt-6000/" },
      { label: "Adobe Community", url: "https://community.adobe.com/members/generous-dazzle714e-4109473" },
      { label: "HP Support Community", url: "https://h30434.www3.hp.com/t5/user/viewprofilepage/user-id/10992938" },
      { label: "Dell Community", url: "https://www.dell.com/community/en/users/6adacbc933653587fd6f9fb7" },
    ],
  },
];

const About = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About RankVelt",
            url: "https://www.rankvelt.com/about",
            mainEntity: {
              "@type": "Organization",
              name: "RankVelt",
              url: "https://www.rankvelt.com",
              email: "info@rankvelt.com",
              telephone: "+92 324 4146447",
              foundingDate: "2025",
              founder: {
                "@type": "Person",
                name: "Nawaz Ahmad",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Valancia Town, Lahore",
                addressCountry: "PK",
              },
              sameAs: [
      "https://facebook.com/rankvelt",
      "https://instagram.com/rankvelt",
      "https://www.linkedin.com/company/rankvelt",
      "https://x.com/RankVelts",
      "https://www.youtube.com/@rankvelts",
      "https://www.tiktok.com/@rankvelt3",
      "https://medium.com/@rankvelt",
      "https://rankvelt.substack.com",
      "https://dev.to/rankvelt",
      "https://clutch.co/profile/rankvelt",
      "https://www.goodfirms.co/company/rankvelt",
      "https://www.crunchbase.com/organization/rankvelt",
              ],
            },
          }),
        }}
      />

      <main className="min-h-screen bg-[#0f1115] text-white/80">
        <section className="relative overflow-hidden py-24">
          <div className="section-container relative z-10">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-4 text-center text-[11px] font-black uppercase tracking-[0.25em] text-primary"
            >
              About RankVelt
            </motion.p>

            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto max-w-4xl text-center text-4xl font-black tracking-tight text-white md:text-6xl"
            >
              An AI first SEO agency built on{" "}
              <span className="text-gradient-gold">honest work</span>
            </motion.h1>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto mt-8 max-w-3xl space-y-4 text-center text-lg font-light leading-relaxed text-white/60"
            >
              <p>
                RankVelt is a founder led SEO agency based in Lahore, Pakistan.
                We help small businesses get found on Google and in AI search.
              </p>
              <p>
                No inflated claims. No fake guarantees. Just clear plans, real
                work and reports you can actually read.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-black/20 py-24">
          <div className="section-container relative z-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative px-4"
              >
                <div className="absolute -inset-4 rounded-[2rem] bg-primary/20 opacity-50 blur-2xl transition-all duration-500 group-hover:bg-primary/30" />
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                  <img
                    src="/NawazCartMyPortfolios.webp"
                    alt="Nawaz Ahmad, founder of RankVelt"
                    width="400"
                    height="533"
                    decoding="async"
                    loading="lazy"
                    className="h-[450px] w-full object-cover object-top grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 md:h-[512px]"
                  />
                </div>
              </motion.div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Meet the founder
                </h2>
                <p className="text-lg font-light leading-relaxed text-white/60">
                  RankVelt was founded in 2025 by Nawaz Ahmad, an SEO
                  strategist and web growth specialist. He started RankVelt
                  after seeing the same pattern repeat for small businesses.
                </p>
                <p className="text-lg font-light leading-relaxed text-white/60">
                  Owners were paying for SEO they could not see, reading
                  reports they could not understand, and listening to promises
                  nobody could keep. RankVelt was built to be the opposite of
                  that experience.
                </p>
                <p className="text-lg font-light leading-relaxed text-white/60">
                  The agency stays deliberately small and founder led. When
                  you work with RankVelt, the person who audits your site is
                  the person who plans the work and reports on it.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="section-container">
            <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
              Our story
            </h2>
            <div className="mx-auto max-w-3xl space-y-4 text-lg font-light leading-relaxed text-white/60">
              <p>
                Search has changed fast. Google now answers many questions
                itself with AI Overviews, and tools like ChatGPT and
                Perplexity recommend businesses directly.
              </p>
              <p>
                Small businesses feel this change first. Their customers still
                search, but the clicks go to whoever Google and the AI tools
                trust and cite.
              </p>
              <p>
                RankVelt was founded in 2025 to help small businesses adapt to
                exactly this. We combine solid technical SEO with answer
                engine and generative engine optimization, so our clients can
                be found in both worlds.
              </p>
              <p>
                We also build free SEO tools that any business can use without
                paying us. Helping first is not a marketing line for us, it is
                how the agency actually works.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black/20 py-24">
          <div className="section-container">
            <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
              What we do
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8"
                >
                  <service.icon className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="mb-4 leading-relaxed text-white/60">
                    {service.text}
                  </p>
                  <Link
                    to={service.link}
                    className="inline-flex items-center gap-2 font-semibold text-primary"
                  >
                    {service.linkLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="section-container">
            <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
              Who we help
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="mb-3 text-xl font-bold text-white">
                  Local service businesses
                </h3>
                <p className="leading-relaxed text-white/60">
                  Dentists, plumbers, electricians, HVAC companies, lawyers
                  and other local firms. Businesses that live on calls, jobs
                  and map visibility.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="mb-3 text-xl font-bold text-white">
                  eCommerce stores
                </h3>
                <p className="leading-relaxed text-white/60">
                  Shopify and WooCommerce stores that need product pages found
                  and clicked. Stores where SEO has to end in sales, not just
                  sessions.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="mb-3 text-xl font-bold text-white">
                  Growing small businesses
                </h3>
                <p className="leading-relaxed text-white/60">
                  Companies that know SEO matters but do not want agency
                  theatre. Owners who want straight answers and steady,
                  visible progress.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black/20 py-24">
          <div className="section-container">
            <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
              How we work
            </h2>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8"
                >
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-white/60">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="section-container">
            <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
              What makes RankVelt different
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-lg font-light leading-relaxed text-white/60">
              Most agencies sell confidence. We would rather show you the work.
            </p>
            <div className="mx-auto max-w-3xl space-y-4">
              {differences.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <p className="leading-relaxed text-white/60">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black/20 py-24">
          <div className="section-container">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Free tools, free audits, real proof
              </h2>
              <p className="text-lg font-light leading-relaxed text-white/60">
                We publish 35 free SEO tools that anyone can use, including
                our AI Overviews Visibility Tracker. No signup walls and no
                paid API tricks, just tools that show a problem clearly.
              </p>
              <p className="text-lg font-light leading-relaxed text-white/60">
                Our case studies are published with real Search Console
                numbers, the good and the bad. You can read them and judge our
                work before you ever contact us.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  to="/tools"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-black"
                >
                  Try the free tools
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/case-studies"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white"
                >
                  Read the case studies
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="section-container">
            <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
              Questions people ask us
            </h2>
            <div className="mx-auto max-w-3xl space-y-8">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {faq.q}
                  </h3>
                  <p className="leading-relaxed text-white/60">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black/20 py-24">
          <div className="section-container">
            <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
              Find us online
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-lg font-light leading-relaxed text-white/60">
              RankVelt is active across the platforms below. Follow along
              wherever you already spend time.
            </p>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {findUsGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-4 text-xl font-bold text-white">
                    {group.title}
                  </h3>
                  <ul className="space-y-2">
                    {group.links.map((item) => (
                      <li key={item.url}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-primary"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="section-container">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Talk to us
              </h2>
              <p className="text-lg font-light leading-relaxed text-white/60">
                Start with a free audit or a short strategy call. We will show
                you what we find on your site, in plain words, with no
                obligation.
              </p>
              <div className="space-y-2 text-white/60">
                <p className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Valancia Town, Lahore, Pakistan
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:info@rankvelt.com" className="hover:text-primary">
                    info@rankvelt.com
                  </a>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+923244146447" className="hover:text-primary">
                    +92 324 4146447
                  </a>
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/strategy-call"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-black"
                >
                  Book a free strategy call
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
