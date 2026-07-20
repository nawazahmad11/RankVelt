import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  Globe2,
  MapPinned,
  Package,
  Play,
  Rocket,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Target,
  TrendingDown,
  Wrench,
  Zap,
} from "lucide-react";

import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import PricingSection from "@/components/PricingSection";
import { AnimatedCounter } from "@/components/Tools/AnimatedCounter";
import AuditSection from "@/components/AuditSection";
import ProcessSection from "@/components/ProcessSection";
// import LiteYouTubeEmbed from "react-lite-youtube-embed";
// import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import FloatingIcon from "@/components/FloatingIcon";

import { lazy, Suspense, useState } from "react";

const PortfolioModal = lazy(() => import("@/components/PortfolioModal"));

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.6,
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
// const serviceItems = [
//   {
//     label: "Local SEO",
//     desc: "Improve Google Maps visibility, local relevance, service-area pages, and qualified local enquiries.",
//     link: "/local-seo",
//   },
//   {
//     label: "eCommerce SEO",
//     desc: "Grow organic product discovery through stronger Shopify collections, product pages, and technical SEO.",
//     link: "/ecommerce-seo",
//   },
//   {
//     label: "Business SEO",
//     desc: "Build stronger service pages, organic lead-generation pathways, technical SEO, and content strategy.",
//     link: "/business-seo",
//   },
//   {
//     label: "Technical SEO Audit",
//     desc: "Find indexation, internal linking, site structure, speed, and on-page SEO issues.",
//     link: "#audit",
//   },
//   {
//     label: "SEO-Ready WordPress Websites",
//     desc: "Build clear service pages, conversion paths, and a strong foundation for future SEO growth.",
//     link: "#audit",
//   },
//   {
//     label: "Shopify Store Design & SEO",
//     desc: "Improve Shopify navigation, product discovery, collection structure, and conversion journeys.",
//     link: "/services/custom-liquid-development",
//   },
//   {
//     label: "Mobile UX & Conversion Support",
//     desc: "Create faster, clearer, mobile-first experiences that make important actions easier.",
//     link: "/services/mobile-first-ux",
//   },
//   {
//     label: "Website Systems & API Support",
//     desc: "Support reliable integrations, tracking, and scalable site functionality.",
//     link: "/services/app-api-sync",
//   },
//   {
//     label: "Visual Storytelling & Landing Pages",
//     desc: "Build high-trust landing pages that explain your offer and guide visitors toward action.",
//     link: "/services/visual-storytelling",
//   },
//   {
//     label: "Checkout & CRO Support",
//     desc: "Reduce friction across key eCommerce conversion paths and purchase journeys.",
//     link: "/services/checkout-flow",
//   },
// ];


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
  const [playVideo, setPlayVideo] = useState(false);

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
    link: string,
  ) => {
    if (!link.startsWith("#")) return;

    event.preventDefault();
    scrollToSection(link.replace("#", ""));
  };

  const repeatedReviews = [...reviewData, ...reviewData];

  const testimonialRows = [
    repeatedReviews.slice(0, 13),
    repeatedReviews.slice(13, 26),
    repeatedReviews.slice(26, 39),
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pt-16">
      <div className="vignette-overlay" />

      <div className="pointer-events-none absolute inset-0 z-10 h-full overflow-hidden">
        <FloatingIcon
          iconUrl="/nawaz-builds-icon-google.webp"
          altText="Google Search"
          positionClass="top-[10%] left-[4%] md:left-[8%] md:top-[15%]"
          delay="0s"
        />

        <FloatingIcon
          iconUrl="/nawaz-builds-icon-shopify.webp"
          altText="Shopify"
          positionClass="top-[15%] right-[4%] md:right-[8%] md:top-[22%]"
          delay="2.5s"
        />

        <FloatingIcon
          iconUrl="/nawaz-builds-icon-react.webp"
          altText="SEO-ready websites"
          positionClass="bottom-[20%] left-[5%] md:bottom-[28%] md:left-[8%]"
          delay="1.2s"
        />

        <FloatingIcon
          iconUrl="/nawaz-builds-icon-meta.webp"
          altText="Analytics and tracking"
          positionClass="bottom-[20%] right-[4%] md:bottom-[28%] md:right-[12%]"
          delay="3.8s"
        />
      </div>

      <section className="relative z-20 overflow-hidden py-24 lg:py-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 opacity-50 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-5%] top-[-10%] h-[300px] w-[300px] rounded-full bg-gold/5 blur-[100px]" />
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

          <h1 className="mx-auto mt-8 max-w-5xl text-balance text-5xl font-medium md:text-7xl lg:mt-10 xl:text-[6rem] tracking-tight leading-[1.1] text-white text-center">
            SEO <span className="relative inline-block">
              <span className="relative bg-[length:200%_auto] bg-clip-text text-transparent font-bold italic"
                style={{
                  backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #a855f7 25%, #ec4899 50%, #a855f7 75%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  // animation: "aurora 2s linear infinite" // Animation ko filhal comment kar diya hai
                }}>
                Expert
              </span>
            </span>
            <br />
            <span className="flex flex-wrap items-center justify-center gap-x-4">
              <span className="font-light text-white/90">&</span>
              <span className="relative inline-block">
                <span className="relative bg-[length:200%_auto] bg-clip-text text-transparent font-black"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #a855f7 25%, #ec4899 50%, #a855f7 75%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                    // animation: "aurora 6s linear infinite" // Animation ko filhal comment kar diya hai
                  }}>
                  Growth
                </span>
              </span>
              <span className="text-white font-medium">Partner</span>
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


      <section className="relative z-20 border-y border-white/5 bg-black/10 py-16">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mb-12 text-center"
          >
            <motion.p
              variants={fadeInUp}
              custom={0}
              className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-primary"
            >
              Who RankVelt Helps
            </motion.p>

            <motion.h2
              variants={fadeInUp}
              custom={1}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Turn Google Visibility into Real Leads & Revenue.
            </motion.h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
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
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.12 }}
                  viewport={{ once: true }}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition-colors hover:border-primary/35 hover:bg-white/[0.04]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-relaxed text-white/60">
                    {item.desc}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-20 py-20">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mb-12 text-center"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Why Businesses Struggle to{""}
              <span className="mx-2 text-4xl italic text-destructive sm:text-5xl">
                Rank
              </span>
              <span className="text-white">on Google</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            style={{ perspective: "1200px" }}
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
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{
                    scale: 1.05,
                    rotateX: 8,
                    rotateY: -8,
                    z: 50,
                  }}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center transition-all duration-300 hover:border-destructive/40"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute -inset-1 -z-10 bg-gradient-to-b from-destructive/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div
                    className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 shadow-lg"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <Icon className="h-7 w-7 text-destructive transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3
                    className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-destructive/90"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-m leading-relaxed text-white/70"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
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
          </motion.div>
        </div>
      </section>

      <section id="services" className="relative z-20 scroll-mt-28 py-10">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mb-10 text-center"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              SEO Services for Growth & Revenue
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-sm font-bold uppercase tracking-[0.2em] text-primary"
            >
              SEO First. Web Design When It Supports Growth.
            </motion.p>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {serviceItems.map((item, index) => (
              <motion.div
                key={item.label}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -3, scale: 1.02 }}
                className="group relative flex cursor-default items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-white/[0.05]"
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
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* <div id="about-me" className="relative z-20 scroll-mt-28">
        <AboutSection />
      </div> */}

      <div id="portfolio" className="relative z-20 scroll-mt-28">
        <PortfolioSection
          onProjectSelect={(id) => setActiveProjectId(id)}
        />
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

      <section className="relative z-20 overflow-hidden py-12">
        <div className="section-container relative z-10 text-white">
          <motion.div
            className="mb-16 grid grid-cols-2 gap-11 border-y border-white/5 bg-white/[0.01] py-10 shadow-inner backdrop-blur-sm lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                value: 120,
                suffix: "+",
                label: "Websites Ranked on Google",
              },
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
              <motion.div
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
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Built for Businesses That Need Better Visibility
            </h2>

            <p className="mx-auto max-w-[600px] text-lg font-light text-white/60">
              Client feedback on SEO structure, technical improvements, ecommerce UX, and websites built to support long-term growth.
            </p>
          </motion.div>
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

          .animate-left {
            animation: marquee-left 90s linear infinite;
          }

          .animate-right {
            animation: marquee-right 90s linear infinite;
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
                className={`flex gap-4 whitespace-nowrap ${rowIndex === 1 ? "animate-right" : "animate-left"
                  }`}
              >
                {rowData.map((testimonial, index) => (
                  <div
                    key={`${testimonial.name}-${rowIndex}-${index}`}
                    className="w-[320px] shrink-0 whitespace-normal rounded-xl border border-white/10 bg-white/[0.03] p-5 shadow-md backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.05]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={testimonial.logo}
                          alt={testimonial.platform}
                          className="h-4 w-4 opacity-70"
                        />

                        <span className="text-[9.5px] font-bold uppercase tracking-widest text-white/60">
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

                        <div className="text-[9px] uppercase tracking-wider text-white/60">
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

      <div className="relative z-20">
        <PricingSection />
      </div>

      <div id="process" className="relative z-20 scroll-mt-28">
        <ProcessSection />
      </div>

      <div id="audit" className="relative z-20 scroll-mt-28">
        <AuditSection />
      </div>

      <div className="relative z-20">
        <BlogSection />
      </div>

      <div className="relative z-20">
        <FAQSection />
      </div>

      <section id="final-cta" className="radial-glow relative z-20 py-24">
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            >
              Ready to Build Stronger{" "}
              <span className="text-gradient-gold">
                Google Visibility & Growth?
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              custom={1}
              className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/60"
            >
              Start with a focused conversation about your website, your
              current visibility, and the highest-priority opportunities for
              growth.
            </motion.p>

            <motion.div variants={fadeInUp} custom={2}>
              <button
                type="button"
                onClick={() => handleCTA("SEO Growth Strategy Call")}
                className="gradient-cta inline-flex items-center gap-2 rounded-xl px-10 py-5 text-lg shadow-2xl shadow-primary/20 transition-transform duration-300 hover:scale-105"
                aria-label="Request an SEO growth strategy call"
              >
                <Rocket className="h-5 w-5" />
                Request a Strategy Call
              </button>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              custom={3}
              className="mt-6 flex items-center justify-center text-sm text-muted-foreground"
            >
              <Shield className="mr-2 h-4 w-4 text-primary" />
              Clear priorities, direct communication, and no unnecessary agency
              layers.
            </motion.p>
          </motion.div>
        </div>
      </section>

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
          animation: shine 3s linear infinite;
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
  );
};
export default FunnelStep1;