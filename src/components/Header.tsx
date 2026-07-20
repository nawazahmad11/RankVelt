import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  Layout,
  Menu,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";

type MenuName = "services" | "tools" | null;

const seoServiceLinks = [
  {
    name: "Local SEO",
    description: "Google Maps, local pages and qualified enquiries.",
    path: "/local-seo",
  },
  {
    name: "eCommerce SEO",
    description: "Shopify collections, products and organic discovery.",
    path: "/ecommerce-seo",
  },
  {
    name: "Business SEO",
    description: "Service pages, technical SEO and organic leads.",
    path: "/business-seo",
  },
];

const websiteSupportLinks = [
  {
    name: "Shopify Development",
    path: "/services/custom-liquid-development",
  },
  {
    name: "Mobile UX Optimisation",
    path: "/services/mobile-first-ux",
  },
  {
    name: "Shopify Landing Pages",
    path: "/services/visual-storytelling",
  },
];

const tools = [
  {
    name: "Profit Calculator",
    icon: <Calculator size={14} />,
    path: "/tools/profit-margin-calculator",
  },
  {
    name: "Policy Generator",
    icon: <ShieldCheck size={14} />,
    path: "/tools/legal-policy-generator",
  },
  {
    name: "Theme Detector",
    icon: <Layout size={14} />,
    path: "/tools/shopify-theme-detector",
  },
  {
    name: "Name Generator",
    icon: <ShoppingBag size={14} />,
    path: "/tools/business-name-generator",
  },
  {
    name: "Meta Title Checker",
    icon: <Search size={14} />,
    path: "/tools/meta-title-description-checker",
  },
  {
    name: "Schema Generator",
    icon: <Layout size={14} />,
    path: "/tools/schema-markup-generator",
  },
  {
    name: "Robots.txt Generator",
    icon: <ShieldCheck size={14} />,
    path: "/tools/robots-txt-generator",
  },
  {
    name: "XML Sitemap Generator",
    icon: <Search size={14} />,
    path: "/tools/xml-sitemap-generator",
  },
  {
    name: "Local SEO Checklist",
    icon: <Rocket size={14} />,
    path: "/tools/local-seo-checklist",
  },
  {
    name: "Redirect Generator",
    icon: <ArrowRight size={14} />,
    path: "/tools/redirect-mapping-generator",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideServices =
        servicesMenuRef.current?.contains(target) || false;

      const clickedInsideTools = toolsMenuRef.current?.contains(target) || false;

      if (!clickedInsideServices && !clickedInsideTools) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const pathname = location.pathname;

    const isServicePage =
      pathname === "/local-seo" ||
      pathname === "/ecommerce-seo" ||
      pathname === "/business-seo" ||
      pathname.startsWith("/services/");

    if (isServicePage) {
      setActiveSection("services");
      return;
    }

    if (pathname === "/blog" || pathname.startsWith("/blog/")) {
      setActiveSection("blog");
      return;
    }

    if (pathname === "/case-studies" || pathname.startsWith("/case-studies/")) {
      setActiveSection("case-studies");
      return;
    }

    if (pathname === "/tools" || pathname.startsWith("/tools/")) {
      setActiveSection("tools");
      return;
    }

    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = [
      "services",
      "about-me",
      "portfolio",
      "pricing",
      "process",
      "audit",
      "faq",
    ];

    const observers = sectionIds
      .map((id) => {
        const element = document.getElementById(id);

        if (!element) {
          return null;
        }

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          },
          {
            rootMargin: "-30% 0px -60% 0px",
          },
        );

        observer.observe(element);

        return observer;
      })
      .filter(Boolean);

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [location.pathname]);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    setOpenMenu(null);

    const scrollToTarget = () => {
      const element = document.getElementById(id);

      if (!element) {
        return;
      }

      const headerOffset = 100;
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    };

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(scrollToTarget, 400);
      return;
    }

    scrollToTarget();
  };

  const goHome = () => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);

    if (location.pathname !== "/") {
      navigate("/");
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeAllMenus = () => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  const NavUnderline = ({ active }: { active: boolean }) => (
    <span
      className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#f9a825] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"
        }`}
    />
  );

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-[100] flex justify-center pt-4 transition-all duration-500">
      <div
        className={`pointer-events-auto flex items-center justify-between transition-all duration-400 ease-in-out ${isScrolled
            ? "w-[95%] max-w-6xl rounded-full border border-white/10 bg-black/40 px-4 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl md:w-[92%] md:px-8"
            : "w-full max-w-7xl bg-transparent px-6 py-4"
          }`}
      >
        {/* <button
          type="button"
          onClick={goHome}
          className="flex shrink-0 items-center gap-3 text-left"
          aria-label="Go to RankVelt homepage"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f9a825]/35 bg-[#f9a825]/10 text-base font-black text-[#f9a825]">
            R
          </span>

          <span className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white italic">
              Rank<span className="text-[#f9a825]">Velt</span>
            </span>

            <span className="hidden text-[8px] font-black uppercase tracking-[0.18em] text-white/35 sm:block">
              SEO & Web Growth Studio
            </span>
          </span>
        </button> */}

<button
  type="button"
  onClick={goHome}
  className="flex shrink-0 items-center gap-3 text-left"
  aria-label="Go to RankVelt homepage"
>
  <img
    src="/rankvelt-icon.webp"
    alt="RankVelt Logo"
    className="h-12 w-auto object-contain"
  />

  <span className="flex flex-col">
    <span className="text-xl font-black tracking-tight text-white italic">
      Rank<span className="text">Velt</span>
    </span>

    <span className="hidden text-[8px] font-black uppercase tracking-[0.18em] text-white/35 sm:block">
      SEO & Web Growth Studio
    </span>
  </span>
</button>




        <nav className="hidden items-center gap-6 xl:flex">
          <div
            ref={servicesMenuRef}
            className="group relative py-1"
            onMouseEnter={() => setOpenMenu("services")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              onClick={() =>
                setOpenMenu((current) =>
                  current === "services" ? null : "services",
                )
              }
              onFocus={() => setOpenMenu("services")}
              className={`flex items-center gap-1 font-medium transition-all duration-300 ${isScrolled ? "text-[14px]" : "text-[15px]"
                } ${activeSection === "services"
                  ? "text-[#f9a825]"
                  : "text-white/55 hover:text-[#f9a825]"
                }`}
              aria-haspopup="menu"
              aria-expanded={openMenu === "services"}
            >
              Services
              <ChevronDown
                size={14}
                className={`transition-transform ${openMenu === "services" ? "rotate-180" : ""
                  }`}
              />
            </button>

            <NavUnderline active={activeSection === "services"} />

            <div
              className={`absolute left-1/2 top-full w-[390px] -translate-x-1/2 pt-4 transition-all duration-300 ${openMenu === "services"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
                }`}
              role="menu"
            >
              <div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-3 shadow-2xl backdrop-blur-2xl">
                <p className="px-3 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#f9a825]">
                  Core SEO Services
                </p>

                {seoServiceLinks.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    onClick={closeAllMenus}
                    role="menuitem"
                    className="group/item flex rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                  >
                    <span>
                      <span className="block text-sm font-black text-white group-hover/item:text-[#f9a825]">
                        {service.name}
                      </span>

                      <span className="mt-1 block text-[11px] leading-relaxed text-white/45">
                        {service.description}
                      </span>
                    </span>

                    <ArrowRight
                      size={15}
                      className="ml-auto mt-2 text-white/30 transition-transform group-hover/item:translate-x-1 group-hover/item:text-[#f9a825]"
                    />
                  </Link>
                ))}

                <div className="my-3 border-t border-white/10" />

                <p className="px-3 pb-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                  Website Support
                </p>

                <div className="grid grid-cols-1 gap-1">
                  {websiteSupportLinks.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      onClick={closeAllMenus}
                      role="menuitem"
                      className="rounded-xl px-3 py-2 text-xs font-bold text-white/60 transition-colors hover:bg-white/[0.05] hover:text-[#f9a825]"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleNavClick("services")}
                  className="mt-3 flex w-full items-center justify-between rounded-xl border border-[#f9a825]/20 bg-[#f9a825]/[0.05] px-3 py-3 text-xs font-black text-[#f9a825]"
                >
                  Explore All Services
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="group relative py-1">
            <button
              type="button"
              onClick={() => handleNavClick("portfolio")}
              className={`font-medium transition-all duration-300 ${isScrolled ? "text-[14px]" : "text-[15px]"
                } ${activeSection === "portfolio"
                  ? "text-[#f9a825]"
                  : "text-white/55 hover:text-[#f9a825]"
                }`}
            >
              Work
            </button>

            <NavUnderline active={activeSection === "portfolio"} />
          </div>

          <div
            ref={toolsMenuRef}
            className="group relative py-1"
            onMouseEnter={() => setOpenMenu("tools")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              onClick={() =>
                setOpenMenu((current) =>
                  current === "tools" ? null : "tools",
                )
              }
              onFocus={() => setOpenMenu("tools")}
              className={`flex items-center gap-1 font-medium transition-all duration-300 ${isScrolled ? "text-[14px]" : "text-[15px]"
                } ${activeSection === "tools"
                  ? "text-[#f9a825]"
                  : "text-white/55 hover:text-[#f9a825]"
                }`}
              aria-haspopup="menu"
              aria-expanded={openMenu === "tools"}
            >
              Tools
              <ChevronDown
                size={14}
                className={`transition-transform ${openMenu === "tools" ? "rotate-180" : ""
                  }`}
              />
            </button>

            <NavUnderline active={activeSection === "tools"} />

            <div
              className={`absolute left-1/2 top-full w-[460px] -translate-x-1/2 pt-4
                 transition-all duration-300 ${openMenu === "tools"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
                }`}
              role="menu"
               >
<div className="rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-3 shadow-2xl backdrop-blur-2xl">
  <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3">
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f9a825]">
      Free Growth Tools
    </span>

    <Link
      to="/tools"
      onClick={closeAllMenus}
      className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-[#f9a825]"
    >
      View All
    </Link>
  </div>

  <div className="mt-3 grid grid-cols-2 gap-1">
    {tools.map((tool) => (
      <Link
        key={tool.path}
        to={tool.path}
        onClick={closeAllMenus}
        role="menuitem"
        className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-[11px] font-bold text-white/65 transition-all hover:bg-white/[0.05] hover:text-[#f9a825]"
      >
        <span className="shrink-0 text-white/35 transition-colors group-hover/item:text-[#f9a825]">
          {tool.icon}
        </span>

        <span className="leading-tight">{tool.name}</span>
      </Link>
    ))}
  </div>

  <Link
    to="/tools"
    onClick={closeAllMenus}
    className="mt-3 flex items-center justify-between rounded-xl border border-[#f9a825]/20 bg-[#f9a825]/[0.06] px-3 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#f9a825] transition-colors hover:bg-[#f9a825]/[0.12]"
  >
    Explore All Free Tools
    <ArrowRight size={14} />
  </Link>
</div>

            </div>

          </div>

          <div className="group relative py-1">
            <Link
              to="/blog"
              onClick={() => {
                setActiveSection("blog");
                setOpenMenu(null);
              }}
              className={`font-medium transition-all duration-300 ${isScrolled ? "text-[14px]" : "text-[15px]"
                } ${activeSection === "blog"
                  ? "text-[#f9a825]"
                  : "text-white/55 hover:text-[#f9a825]"
                }`}
            >
              Insights
            </Link>

            <NavUnderline active={activeSection === "blog"} />
          </div>

          <div className="group relative py-1">
            <Link
              to="/case-studies"
              onClick={() => {
                setActiveSection("case-studies");
                setOpenMenu(null);
              }}
              className={`font-medium transition-all duration-300 ${isScrolled ? "text-[14px]" : "text-[15px]"
                } ${activeSection === "case-studies"
                  ? "text-[#f9a825]"
                  : "text-white/55 hover:text-[#f9a825]"
                }`}
            >
              Case Studies
            </Link>

            <NavUnderline active={activeSection === "case-studies"} />
          </div>

          <div className="group relative py-1">
            <button
              type="button"
              onClick={() => handleNavClick("faq")}
              className={`font-medium transition-all duration-300 ${isScrolled ? "text-[14px]" : "text-[15px]"
                } ${activeSection === "faq"
                  ? "text-[#f9a825]"
                  : "text-white/55 hover:text-[#f9a825]"
                }`}
            >
              FAQ
            </button>

            <NavUnderline active={activeSection === "faq"} />
          </div>
        </nav>

        <div className="relative z-[110] flex items-center gap-3">
          {!isMobileMenuOpen && (
            <button
              type="button"
              onClick={() => handleNavClick("audit")}
              aria-label="Request a free SEO audit"
              className={`flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffb347] via-[#f9a825] to-[#f57c00] font-bold text-[#0a0a0a] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(249,168,37,0.4)] active:scale-95 ${isScrolled ? "px-5 py-2 text-[11px]" : "px-7 py-2.5 text-xs"
                }`}
            >
              <Rocket className="h-3.5 w-3.5 fill-black/20" />
              <span className="hidden uppercase tracking-wider sm:inline">
                Free SEO Audit
              </span>
            </button>
          )}

          <button
            type="button"
            className="relative z-[110] p-2 text-white/70 transition-colors hover:text-[#f9a825] xl:hidden"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMobileMenuOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pointer-events-auto fixed inset-0 left-0 top-0 z-[105] flex h-screen w-full flex-col overflow-y-auto bg-black/98 p-8 pt-32 backdrop-blur-2xl"
          >
            <div className="mx-auto flex w-full max-w-md flex-col gap-5">
              <button
                type="button"
                onClick={() => handleNavClick("portfolio")}
                className="text-left text-3xl font-bold text-white transition-colors hover:text-[#f9a825]"
              >
                Work
              </button>

              <Link
                to="/blog"
                onClick={closeAllMenus}
                className="text-3xl font-bold text-white transition-colors hover:text-[#f9a825]"
              >
                Insights
              </Link>

              <Link
                to="/case-studies"
                onClick={closeAllMenus}
                className="text-3xl font-bold text-white transition-colors hover:text-[#f9a825]"
              >
                Case Studies
              </Link>

              <button
                type="button"
                onClick={() => handleNavClick("faq")}
                className="text-left text-3xl font-bold text-white transition-colors hover:text-[#f9a825]"
              >
                FAQ
              </button>

              <div className="my-2 h-px bg-white/10" />

              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#f9a825]">
                SEO Services
              </span>

              {seoServiceLinks.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  onClick={closeAllMenus}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
                >
                  <span className="block text-lg font-black text-white">
                    {service.name}
                  </span>

                  <span className="mt-1 block text-sm leading-relaxed text-white/55">
                    {service.description}
                  </span>
                </Link>
              ))}

              <span className="mt-2 text-[11px] font-black uppercase tracking-[0.25em] text-white/40">
                Website Support
              </span>

              <div className="grid gap-3 sm:grid-cols-2">
                {websiteSupportLinks.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    onClick={closeAllMenus}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-bold text-white/75 transition-colors hover:border-[#f9a825]/35 hover:text-[#f9a825]"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>

              <span className="mt-2 text-[11px] font-black uppercase tracking-[0.25em] text-white/40">
                Free Tools
              </span>

              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.path}
                    onClick={closeAllMenus}
                    className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10 active:scale-95"
                  >
                    <span className="rounded-full bg-[#f9a825]/10 p-2 text-[#f9a825]">
                      {tool.icon}
                    </span>

                    <span className="text-center text-[12px] font-medium text-white/90">
                      {tool.name}
                    </span>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleNavClick("audit")}
                className="mt-4 rounded-2xl bg-gradient-to-r from-[#ffb347] via-[#f9a825] to-[#f57c00] px-5 py-4 text-sm font-black uppercase tracking-wider text-black"
              >
                Get a Free SEO Audit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;