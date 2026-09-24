import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  MapPinned,
  Rocket,
  Search,
  Shield,
  ShoppingBag,
  Smartphone,
  Star,
  Target,
  TrendingDown,
  Wrench,
} from "lucide-react";

import { AnimatedCounter } from "@/components/Tools/AnimatedCounter";
import { lazy, Suspense, useState, useRef, useEffect } from "react";

const PortfolioModal = lazy(() => import("@/components/PortfolioModal"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const AuditSection = lazy(() => import("@/components/AuditSection"));
const BlogSection = lazy(() => import("@/components/BlogSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

// Correctly typed Framer Motion Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: typeof index === "number" ? index * 0.05 : 0,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const serviceItems = [
  {
    label: "Local SEO",
    desc: "Improve Google Maps visibility, local rankings, and service-area leads that convert into real customers.",
    link: "/local-seo",
  },
  {
    label: "eCommerce SEO",
    desc: "Increase product visibility, Shopify rankings, and organic sales through structured SEO systems.",
    link: "/ecommerce-seo",
  },
  {
    label: "Business SEO",
    desc: "Build strong service pages, content strategy, and organic lead generation systems for long-term growth.",
    link: "/business-seo",
  },
  {
    label: "Technical SEO Audit",
    desc: "Fix indexing, speed, structure, and on-page SEO issues to improve overall Google performance.",
    link: "#audit",
  },
  {
    label: "Website SEO & Design",
    desc: "SEO-ready WordPress & Shopify websites built for speed, structure, and conversion-focused growth.",
    link: "#websites",
  },
  {
    label: "Conversion Optimization (CRO)",
    desc: "Improve user journeys, landing pages, and checkout flow to turn traffic into paying customers.",
    link: "/services/cro",
  },
];

const reviewData = [
  {
    name: "James Anderson",
    platform: "Upwork",
    logo: "/Nawaz-builds-icon-upwork.webp",
    text: "The SEO plan turned a scattered website into a clear structure that was easier for users and Google to understand.",
    initial: "JA",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Sarah Jenkins",
    platform: "Fiverr",
    logo: "/Nawaz-builds-icon-Fiverr.webp",
    text: "The mobile pages feel much faster now. The content is easier to scan, and the main actions are far clearer.",
    initial: "SJ",
    color: "from-green-400 to-emerald-600",
  },
  {
    name: "Robert Wilson",
    platform: "LinkedIn",
    logo: "/Nawaz-builds-icon-Linkedin.webp",
    text: "The redesign gave every important page a clearer purpose. Navigation, service information, and trust signals now work together.",
    initial: "RW",
    color: "from-blue-600 to-blue-800",
  },
  {
    name: "Emily Thompson",
    platform: "Upwork",
    logo: "/Nawaz-builds-icon-upwork.webp",
    text: "Our landing pages are now structured around what visitors actually need. The journey from search to enquiry feels more natural.",
    initial: "ET",
    color: "from-purple-500 to-indigo-600",
  },
  {
    name: "Michael O'Neil",
    platform: "Fiverr",
    logo: "/Nawaz-builds-icon-Fiverr.webp",
    text: "The technical audit made the real website issues easy to understand. The fixes gave us a much stronger base for future SEO.",
    initial: "MO",
    color: "from-red-500 to-rose-600",
  },
  {
    name: "David Beck",
    platform: "Upwork",
    logo: "/Nawaz-builds-icon-upwork.webp",
    text: "We finally had a practical SEO roadmap. The keyword priorities, page structure, and internal linking plan all made sense.",
    initial: "DB",
    color: "from-orange-500 to-yellow-600",
  },
  {
    name: "Jessica Miller",
    platform: "LinkedIn",
    logo: "/Nawaz-builds-icon-Linkedin.webp",
    text: "The site feels more professional, but the biggest difference is how clearly the pages now explain what we do.",
    initial: "JM",
    color: "from-pink-500 to-purple-600",
  },
  {
    name: "Chris Ward",
    platform: "Fiverr",
    logo: "/Nawaz-builds-icon-Fiverr.webp",
    text: "The new ecommerce structure made collections and product pages easier to browse. It feels simpler for shoppers to find the right item.",
    initial: "CW",
    color: "from-teal-500 to-green-600",
  },
  {
    name: "Linda Evans",
    platform: "Upwork",
    logo: "/Nawaz-builds-icon-upwork.webp",
    text: "The customer journey is much more focused now. Visitors can understand the offer quickly and move to the right next step.",
    initial: "LE",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Kevin Scott",
    platform: "LinkedIn",
    logo: "/Nawaz-builds-icon-Linkedin.webp",
    text: "Strong technical thinking from start to finish. The page hierarchy, schema planning, and content structure were handled carefully.",
    initial: "KS",
    color: "from-slate-600 to-slate-800",
  },
  {
    name: "Alice Morgan",
    platform: "Upwork",
    logo: "/Nawaz-builds-icon-upwork.webp",
    text: "The website is easier to manage and more useful for visitors. The new structure also gives us a better platform for ongoing SEO work.",
    initial: "AM",
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Thomas Wright",
    platform: "Fiverr",
    logo: "/Nawaz-builds-icon-Fiverr.webp",
    text: "Excellent attention to detail. The site now works smoothly on mobile, looks credible, and gives users clearer information.",
    initial: "TW",
    color: "from-amber-500 to-orange-700",
  },
  {
    name: "Sophia Grey",
    platform: "LinkedIn",
    logo: "/Nawaz-builds-icon-Linkedin.webp",
    text: "The analytics setup showed us where users were leaving the site. That helped us make better decisions about our priority pages.",
    initial: "SG",
    color: "from-violet-500 to-purple-700",
  },
  {
    name: "Daniel Reed",
    platform: "Upwork",
    logo: "/Nawaz-builds-icon-upwork.webp",
    text: "The performance work made a noticeable difference. Pages load more reliably, and the overall experience feels much cleaner.",
    initial: "DR",
    color: "from-emerald-500 to-teal-700",
  },
  {
    name: "Olivia Foster",
    platform: "Fiverr",
    logo: "/Nawaz-builds-icon-Fiverr.webp",
    text: "From keyword research to final implementation, the project stayed organised. Every recommendation had a clear reason behind it.",
    initial: "OF",
    color: "from-rose-400 to-pink-600",
  },
  {
    name: "Mark Stevens",
    platform: "Upwork",
    logo: "/Nawaz-builds-icon-upwork.webp",
    text: "The technical cleanup gave us a much better foundation for content, marketing, and long-term organic search growth.",
    initial: "MS",
    color: "from-gray-700 to-black",
  },
  {
    name: "Emma Walsh",
    platform: "Fiverr",
    logo: "/Nawaz-builds-icon-Fiverr.webp",
    text: "The conversion improvements helped us make better use of the traffic we already had instead of simply chasing more visits.",
    initial: "EW",
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "John Higgins",
    platform: "LinkedIn",
    logo: "/Nawaz-builds-icon-Linkedin.webp",
    text: "Clear communication, useful SEO strategy, and quality implementation throughout. The website now has a much clearer direction.",
    initial: "JH",
    color: "from-blue-800 to-indigo-900",
  },
  {
    name: "Clara Bennett",
    platform: "Upwork",
    logo: "/Nawaz-builds-icon-upwork.webp",
    text: "The refreshed landing pages are easier to navigate and more focused on the questions visitors ask before they contact us.",
    initial: "CB",
    color: "from-teal-400 to-cyan-500",
  },
  {
    name: "Paul Richards",
    platform: "Fiverr",
    logo: "/Nawaz-builds-icon-Fiverr.webp",
    text: "A valuable investment in better site structure, stronger user experience, and a more practical SEO foundation for growth.",
    initial: "PR",
    color: "from-red-600 to-red-800",
  },
];

const FunnelStep1 = () => {
  const navigate = useNavigate();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.src = "/rankvelt-real-stats.webm";
            node.load();
            node.play().catch(() => {});
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCTA = (packageName = "Free SEO Opportunity Check") => {
    navigate(`/strategy-call?package=${encodeURIComponent(packageName)}`);
  };

  const handleServiceLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string
  ) => {
    if (!link.startsWith("#")) return;
    event.preventDefault();
    scrollToSection(link.replace("#", ""));
  };

  const featuredReviews = reviewData.slice(0, 10);
  const repeatedReviews = [...featuredReviews, ...featuredReviews];
  const testimonialRows = [
    repeatedReviews.slice(0, 10),
    repeatedReviews.slice(10, 20),
  ];

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="relative min-h-screen overflow-hidden bg-background pt-16">
        <div className="pointer-events-none absolute inset-0 bg-black/60" />

        {/* HERO SECTION */}
        <section className="relative z-20 overflow-hidden py-24 lg:py-28">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px] md:block" />
            <div className="pointer-events-none absolute right-[-5%] top-[-10%] h-[300px] w-[300px] rounded-full bg-gold/5 blur-[60px]" />
          </div>

          <div className="section-container relative z-10">
            <div className="mb-8 flex justify-center">
              <div className="relative mx-auto w-fit overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-sm">
                <a
                  href="#services"
                  className="group flex w-fit cursor-pointer items-center gap-4 rounded-full bg-muted/30 p-1.5 pl-5 transition-all duration-300 hover:bg-white/10"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection("services");
                  }}
                  aria-label="Explore RankVelt SEO services"
                >
                  <span className="shimmer-text-effect text-sm font-semibold tracking-wide">
                    Available for New Opportunities
                  </span>
                  <span className="h-4 w-0.5 border-l border-white/20" />
                  <div className="size-6 overflow-hidden rounded-full bg-background duration-500 group-hover:bg-white/20">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3 text-white" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3 text-white" />
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-balance text-center text-5xl font-medium leading-[1.1] tracking-tight text-white md:text-7xl lg:mt-10 xl:text-[6rem]">
              SEO{" "}
              <span className="relative inline-block">
                <span
                  className="relative bg-[length:200%_auto] bg-clip-text font-bold italic text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #3b82f6 0%, #a855f7 25%, #ec4899 50%, #a855f7 75%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Expert
                </span>
              </span>
              <br />
              <span className="flex flex-wrap items-center justify-center gap-x-4">
                <span className="font-light text-white/90">&</span>
                <span className="relative inline-block">
                  <span
                    className="relative bg-[length:200%_auto] bg-clip-text font-black text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #3b82f6 0%, #a855f7 25%, #ec4899 50%, #a855f7 75%, #3b82f6 100%)",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    Growth
                  </span>
                </span>
                <span className="font-medium text-white">Partner</span>
              </span>
            </h1>

            <p className="mx-auto mb-8 mt-5 max-w-2xl text-center text-lg font-normal leading-relaxed text-white/60 md:text-xl">
              RankVelt helps businesses improve Google visibility, attract more
              qualified visitors, and build websites that support long-term SEO
              growth and conversions.
            </p>

            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => handleCTA("Free SEO Opportunity Check")}
                className="gradient-cta flex items-center gap-2 rounded-lg px-8 py-4 text-lg shadow-xl shadow-primary/20"
                aria-label="Request a free SEO opportunity check"
              >
                <Target className="h-5 w-5" />
                Get a Free SEO Audit
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("services")}
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-8 py-4 text-lg font-semibold text-white/80 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                aria-label="Explore SEO services"
              >
                Explore Services
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[16px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Founder-led strategy
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Clear growth priorities
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-400" />
                SEO-ready website support
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHO RANKVELT HELPS */}
        <section className="relative z-20 overflow-hidden border-y border-white/5 bg-black/20 py-16 lg:py-24">
          <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

          <div className="section-container relative z-10">
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-14 text-center"
            >
              <m.p
                variants={fadeInUp}
                custom={0}
                className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-gold"
              >
                WHO RANKVELT HELPS
              </m.p>

              <m.h2
                variants={fadeInUp}
                custom={1}
                className="text-2xl font-bold tracking-tight text-white sm:whitespace-nowrap sm:text-3xl md:text-4xl lg:text-5xl"
              >
                Turn Google Visibility into{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Real Leads & Revenue.
                </span>
              </m.h2>
            </m.div>

            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              <div className="flex flex-col justify-between gap-4 lg:col-span-7">
                {[
                  {
                    icon: MapPinned,
                    title: "Local Businesses",
                    desc: "For businesses that need stronger Google Maps visibility, local search relevance, calls, enquiries, and service-area leads.",
                  },
                  {
                    icon: ShoppingBag,
                    title: "eCommerce Brands",
                    desc: "For Shopify stores and online brands that need better product discovery, category visibility, and sustainable organic sales.",
                  },
                  {
                    icon: Building2,
                    title: "Growing Companies",
                    desc: "For service businesses, consultants, agencies, and brands that need stronger pages, websites, and organic lead generation.",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <m.article
                      key={item.title}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.04]"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-black">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gold transition-colors duration-300 group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/60">
                          {item.desc}
                        </p>
                      </div>
                    </m.article>
                  );
                })}
              </div>

              <div className="flex items-center justify-center lg:col-span-5 lg:justify-end">
                <m.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="group relative h-full w-full max-w-[500px]"
                >
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-purple-500/30 opacity-30 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
                  <div className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl transition-all duration-500 group-hover:border-primary/50">
                    <video
                      ref={videoRef}
                      loop
                      muted
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      className="h-auto max-h-[420px] w-full rounded-xl object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </m.div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="relative z-20 pb-10 pt-16">
          <div className="section-container">
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-12 text-center"
            >
              <m.h2
                variants={fadeInUp}
                custom={0}
                className="text-3xl font-bold text-white sm:text-4xl"
              >
                Why Businesses Struggle to{" "}
                <span className="mx-2 inline-block text-4xl italic text-destructive sm:text-5xl">
                  Rank
                </span>{" "}
                <span className="text-white">on Google</span>
              </m.h2>
            </m.div>

            <m.div
              className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: Search,
                  title: "Weak Search Intent",
                  desc: "Important service and product pages do not clearly answer what real customers are searching for.",
                },
                {
                  icon: Smartphone,
                  title: "Poor Mobile Experience",
                  desc: "Slow, unclear, or difficult mobile pages can hurt engagement, leads, and sales.",
                },
                {
                  icon: Wrench,
                  title: "Technical SEO Gaps",
                  desc: "Indexation issues, weak internal links, duplicate content, and slow templates limit visibility.",
                },
                {
                  icon: TrendingDown,
                  title: "No Growth Roadmap",
                  desc: "Random SEO tasks and disconnected content do not create a reliable path to long-term growth.",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <m.div
                    key={item.title}
                    variants={fadeInUp}
                    custom={index}
                    className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center transition-transform duration-300 md:hover:scale-[1.02] hover:border-destructive/40"
                  >
                    <div className="absolute -inset-1 -z-10 bg-gradient-to-b from-destructive/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 shadow-lg">
                      <Icon className="h-7 w-7 text-destructive transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-destructive/90">
                      {item.title}
                    </h3>
                    <p className="text-m leading-relaxed text-white/70">
                      {item.desc}
                    </p>
                  </m.div>
                );
              })}
            </m.div>

            <m.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <button
                type="button"
                onClick={() => scrollToSection("services")}
                aria-label="Explore RankVelt SEO services"
                className="inline-flex items-center gap-2 border-none bg-transparent text-lg font-semibold text-primary transition-all hover:gap-4 hover:text-primary/80"
              >
                See How RankVelt Fixes This
                <ArrowRight className="h-5 w-5" />
              </button>
            </m.div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section
          id="services"
          className="relative z-20 scroll-mt-28 pb-16 pt-6"
        >
          <div className="section-container">
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-10 text-center"
            >
              <m.h2
                variants={fadeInUp}
                custom={0}
                className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                SEO Services for Growth & Revenue
              </m.h2>
              <m.p
                variants={fadeInUp}
                custom={1}
                className="text-sm font-bold uppercase tracking-[0.2em] text-primary"
              >
                SEO First. Web Design When It Supports Growth.
              </m.p>
            </m.div>

            <m.div
              className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {serviceItems.map((item, index) => (
                <m.div
                  key={item.label}
                  variants={fadeInUp}
                  custom={index}
                  className="group relative flex cursor-default items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-300 md:hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.05]"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="z-10 shrink-0">
                    <div className="rounded-md bg-primary/10 p-1.5 text-primary shadow-sm shadow-primary/20 transition-colors duration-300 group-hover:bg-primary group-hover:text-black">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="z-10 flex w-full flex-col">
                    <h3 className="text-[16px] font-semibold text-white transition-colors duration-300 group-hover:text-primary">
                      {item.label}
                    </h3>
                    <p className="text-[15px] leading-tight text-white/65 transition-colors group-hover:text-white/80">
                      {item.desc}
                    </p>
                    <a
                      href={item.link}
                      onClick={(event) =>
                        handleServiceLinkClick(event, item.link)
                      }
                      className="z-20 mt-1.5 inline-flex w-fit cursor-pointer items-center gap-1 text-[13px] text-primary transition-colors hover:underline"
                    >
                      Learn More
                    </a>
                  </div>
                </m.div>
              ))}
            </m.div>
          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <div id="portfolio" className="relative z-20 scroll-mt-28">
          <Suspense
            fallback={<div className="min-h-[400px]" aria-hidden="true" />}
          >
            <PortfolioSection
              onProjectSelect={(id) => setActiveProjectId(id)}
            />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          {activeProjectId && (
            <PortfolioModal
              isOpen={Boolean(activeProjectId)}
              projectId={activeProjectId}
              onClose={() => setActiveProjectId(null)}
            />
          )}
        </Suspense>

        {/* STATS & TESTIMONIALS */}
        <section className="relative z-20 overflow-hidden py-10">
          <div className="section-container relative z-10 text-white">
            <m.div
              className="mb-16 grid grid-cols-2 gap-11 border-y border-white/5 bg-white/[0.01] py-10 shadow-inner lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { value: 120, suffix: "+", label: "Websites Ranked on Google" },
                {
                  value: 10,
                  prefix: "$",
                  suffix: "M+",
                  label: "Organic Revenue Impact Generated",
                },
                {
                  value: 500,
                  suffix: "k+",
                  label: "Monthly Organic Clicks Driven",
                },
                {
                  value: 85,
                  suffix: "%",
                  label: "Average SEO Traffic Growth",
                },
              ].map((stat, index) => (
                <m.div
                  key={stat.label}
                  variants={fadeInUp}
                  custom={index}
                  className="group cursor-default text-center"
                >
                  <div className="mb-2 text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)] transition-transform duration-300 group-hover:scale-110 sm:text-5xl">
                    {stat.prefix && <span>{stat.prefix}</span>}
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/60 transition-colors group-hover:text-white/60 sm:text-sm">
                    {stat.label}
                  </div>
                </m.div>
              ))}
            </m.div>

            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
                Built for Businesses That Need Better Visibility
              </h2>
              <p className="mx-auto max-w-[600px] text-lg font-light text-white/60">
                Client feedback on SEO structure, technical improvements,
                ecommerce UX, and websites built to support long-term growth.
              </p>
            </m.div>
          </div>

          <style>{`
            @keyframes marquee-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }

            @keyframes marquee-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }

            .animate-left,
            .animate-right {
              animation: none;
            }

            @media(min-width:768px){
              .animate-left {
                animation: marquee-left 90s linear infinite;
              }
              .animate-right {
                animation: marquee-right 90s linear infinite;
              }
            }

            .marquee-wrapper:hover .animate-left,
            .marquee-wrapper:hover .animate-right {
              animation-play-state: paused;
            }
          `}</style>

          <div className="marquee-wrapper relative flex flex-col gap-4 py-4">
            {testimonialRows.map((rowData, rowIndex) => (
              <div
                key={rowIndex}
                className="marquee-container relative flex overflow-hidden py-1"
              >
                <div
                  className={`flex gap-4 whitespace-nowrap ${
                    rowIndex === 1 ? "animate-right" : "animate-left"
                  }`}
                >
                  {rowData.map((testimonial, index) => (
                    <div
                      key={`${testimonial.name}-${rowIndex}-${index}`}
                      className="w-[320px] shrink-0 whitespace-normal rounded-xl border border-white/10 bg-white/[0.03] p-5 shadow-md transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.05]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={testimonial.logo}
                            alt={testimonial.platform}
                            width="16"
                            height="16"
                            loading="lazy"
                            decoding="async"
                            className="h-4 w-4 opacity-70"
                          />
                          <span className="text-[9.5px] font-bold uppercase tracking-widest text-white/80">
                            {testimonial.platform}
                          </span>
                        </div>

                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500"
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mb-4 text-[12px] font-light italic leading-relaxed text-white/80">
                        "{testimonial.text}"
                      </p>

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br text-[10px] font-bold text-white shadow-lg ${testimonial.color}`}
                        >
                          {testimonial.initial}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {testimonial.name}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-white/80">
                            Client
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-32 bg-gradient-to-r from-background via-background/80 to-transparent md:w-48" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-32 bg-gradient-to-l from-background via-background/80 to-transparent md:w-48" />
          </div>
        </section>

        {/* LAZY SECTIONS */}
        <div id="process" className="relative z-20 scroll-mt-28">
          <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
            <ProcessSection />
          </Suspense>
        </div>

        <div id="audit" className="relative z-20 scroll-mt-28">
          <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
            <AuditSection />
          </Suspense>
        </div>

        <div className="relative z-20">
          <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
            <BlogSection />
          </Suspense>
        </div>

        <div className="relative z-20">
          <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
            <FAQSection />
          </Suspense>
        </div>

        {/* FINAL CTA SECTION */}
        <section id="final-cta" className="radial-glow relative z-20 py-24">
          <div className="section-container relative z-10 text-center">
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <m.h2
                variants={fadeInUp}
                custom={0}
                className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
              >
                Ready to Build Stronger{" "}
                <span className="text-gradient-gold">
                  Google Visibility & Growth?
                </span>
              </m.h2>

              <m.p
                variants={fadeInUp}
                custom={1}
                className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/60"
              >
                Start with a focused conversation about your website, your
                current visibility, and the highest-priority opportunities for
                growth.
              </m.p>

              <m.div variants={fadeInUp} custom={2}>
                <button
                  type="button"
                  onClick={() => handleCTA("Free SEO Opportunity Check")}
                  className="gradient-cta inline-flex items-center gap-2 rounded-xl px-10 py-5 text-lg shadow-2xl shadow-primary/20 transition-transform duration-300 hover:scale-105"
                  aria-label="Request an SEO growth strategy call"
                >
                  <Rocket className="h-5 w-5" />
                  Get a Free SEO Audit
                </button>
              </m.div>

              <m.p
                variants={fadeInUp}
                custom={3}
                className="mt-6 flex items-center justify-center text-sm text-muted-foreground"
              >
                <Shield className="mr-2 h-4 w-4 text-primary" />
                Clear priorities, direct communication, and no unnecessary agency
                layers.
              </m.p>
            </m.div>
          </div>
        </section>

        {/* FIXED MOBILE BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/80 p-4 pb-safe backdrop-blur-xl sm:hidden">
          <button
            type="button"
            onClick={() => handleCTA("SEO Growth Strategy Call")}
            className="gradient-cta flex w-full items-center justify-center gap-2 rounded-lg py-3.5 font-semibold shadow-lg shadow-primary/20"
            aria-label="Request a strategy call"
          >
            <Target className="h-5 w-5" />
            Get a Free SEO Audit
          </button>
        </div>

        <style>{`
          .shimmer-text-effect {
            background: linear-gradient(90deg, #666 0%, #fff 50%, #666 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          @media (min-width: 768px) {
            .shimmer-text-effect {
              animation: shine 3s linear infinite;
            }
          }

          @keyframes shine {
            to {
              background-position: 200% center;
            }
          }

          .pb-safe {
            padding-bottom: env(safe-area-inset-bottom, 16px);
          }
        `}</style>
      </div>
    </LazyMotion>
  );
};

export default FunnelStep1;