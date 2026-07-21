import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";

const NEWSLETTER_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyMUlRY1rQYmA450Lf1t0lMp-C_WAwoCjBpjqDEigCy2fb58dNF4jD7muP2Vi5Ig2odAg/exec";

const STRATEGY_CALL_PATH =
  "/strategy-call?package=Free%20SEO%20Opportunity%20Check";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const scheduleStatusReset = (delay: number) => {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setStatus("idle");
    }, delay);
  };

  const handleSubscribe = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return;
    }

    setStatus("loading");

    try {
      await fetch(NEWSLETTER_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          type: "RankVelt Newsletter Subscription",
          source: location.pathname,
        }),
      });

      setStatus("success");
      setEmail("");
      scheduleStatusReset(5000);
    } catch (error) {
      console.error(
        "Newsletter subscription error:",
        error,
      );

      setStatus("error");
      scheduleStatusReset(4000);
    }
  };

  const goToHomepage = () => {
    if (location.pathname !== "/") {
      navigate("/");
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openOpportunityCheck = () => {
    navigate(STRATEGY_CALL_PATH);
  };

  const seoServices = [
    {
      label: "Local SEO",
      path: "/local-seo",
    },
    {
      label: "eCommerce SEO",
      path: "/ecommerce-seo",
    },
    {
      label: "Business SEO",
      path: "/business-seo",
    },
    {
      label: "SEO Case Studies",
      path: "/case-studies",
    },
  ];

  const shopifyServices = [
    {
      label: "Custom Liquid Development",
      path: "/services/custom-liquid-development",
    },
    {
      label: "Mobile-First UX",
      path: "/services/mobile-first-ux",
    },
    {
      label: "Visual Storytelling",
      path: "/services/visual-storytelling",
    },
    {
      label: "App & API Integration",
      path: "/services/app-api-sync",
    },
    {
      label: "Cart & Checkout Flow",
      path: "/services/checkout-flow",
    },
  ];

  const tools = [
    {
      label: "All SEO Tools",
      path: "/tools",
    },
    {
      label: "Meta Title & Description Checker",
      path: "/tools/meta-title-description-checker",
    },
    {
      label: "Schema Markup Generator",
      path: "/tools/schema-markup-generator",
    },
    {
      label: "Robots.txt Generator",
      path: "/tools/robots-txt-generator",
    },
    {
      label: "XML Sitemap Generator",
      path: "/tools/xml-sitemap-generator",
    },
    {
      label: "Local SEO Checklist",
      path: "/tools/local-seo-checklist",
    },
  ];

  const resources = [
    {
      label: "SEO Insights",
      path: "/blog",
    },
    {
      label: "Case Studies",
      path: "/case-studies",
    },
    {
      label: "Privacy Policy",
      path: "/privacy-policy",
    },
    {
      label: "Terms of Service",
      path: "/terms-of-service",
    },
    {
      label: "Refund Policy",
      path: "/refund-policy",
    },
  ];

  return (
    <footer className="w-full overflow-hidden border-t border-white/[0.06] bg-[#050505]">
      <div className="w-full px-6 py-14 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr] lg:gap-16">
          {/* Brand column */}
          <div>
            <button
              type="button"
              onClick={goToHomepage}
              className="flex items-center gap-3 text-left"
              aria-label="Go to RankVelt homepage"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f9a825]/35 bg-[#f9a825]/10 text-base font-black text-[#f9a825]">
                R
              </span>

              <span>
                <span className="block text-xl font-black tracking-tight text-white">
                  Rank
                  <span className="text-[#f9a825]">
                    Velt
                  </span>
                </span>

                <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                  SEO & Web Growth Studio
                </span>
              </span>
            </button>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/65">
              RankVelt helps local businesses,
              eCommerce brands and growing companies
              improve search visibility, website
              structure, product discovery and
              conversion-focused customer journeys.
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/65">
              <a
                href="mailto:info@rankvelt.com"
                className="flex w-fit items-center gap-3 transition-colors hover:text-[#f9a825]"
              >
                <Mail size={17} />
                info@rankvelt.com
              </a>

              <div className="flex items-center gap-3">
                <MapPin size={17} />
                <span>
                  Remote SEO and website support
                  worldwide
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={openOpportunityCheck}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#f9a825] px-5 py-3 text-sm font-black text-black transition-transform hover:scale-[1.02]"
            >
              Free SEO Opportunity Check
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Footer navigation */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-white">
                SEO Services
              </h2>

              <ul className="mt-5 space-y-3">
                {seoServices.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm leading-relaxed text-white/60 transition-colors hover:text-[#f9a825]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-white">
                Shopify Support
              </h2>

              <ul className="mt-5 space-y-3">
                {shopifyServices.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm leading-relaxed text-white/60 transition-colors hover:text-[#f9a825]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-white">
                SEO Tools
              </h2>

              <ul className="mt-5 space-y-3">
                {tools.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm leading-relaxed text-white/60 transition-colors hover:text-[#f9a825]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-white">
                Resources
              </h2>

              <ul className="mt-5 space-y-3">
                {resources.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm leading-relaxed text-white/60 transition-colors hover:text-[#f9a825]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 grid gap-7 border-t border-white/[0.06] pt-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <h2 className="text-xl font-black text-white">
              Get practical SEO growth insights.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Receive useful guidance about SEO,
              eCommerce visibility, website structure,
              AI search and conversion-focused growth.
            </p>
          </div>

          <div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label
                htmlFor="footer-newsletter-email"
                className="sr-only"
              >
                Email address
              </label>

              <input
                id="footer-newsletter-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={
                  status === "loading" ||
                  status === "success"
                }
                className="min-h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#f9a825]/55 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={
                  status === "loading" ||
                  status === "success"
                }
                className="inline-flex min-h-12 min-w-40 items-center justify-center gap-2 rounded-xl bg-[#f9a825] px-5 py-3 text-sm font-black text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading"
                  ? "Submitting..."
                  : status === "success"
                    ? "Subscribed"
                    : status === "error"
                      ? "Try Again"
                      : "Subscribe"}

                <Send size={17} />
              </button>
            </form>

            <div
              className="mt-3 min-h-5 text-xs"
              aria-live="polite"
              role="status"
            >
              {status === "success" && (
                <p className="text-emerald-400">
                  Thank you. You have been added to the
                  RankVelt insights list.
                </p>
              )}

              {status === "error" && (
                <p className="text-red-400">
                  The subscription could not be submitted.
                  Please try again.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-6 border-t border-white/[0.06] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs leading-relaxed text-white/45 md:text-left">
            © {new Date().getFullYear()} RankVelt.
            All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-3">
            {/*
              LinkedIn button should only be activated
              after the official RankVelt company page
              URL is available.
            */}
            <button
              type="button"
              disabled
              aria-label="RankVelt LinkedIn page coming soon"
              title="RankVelt LinkedIn page coming soon"
              className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-white/20"
            >
              <Linkedin size={18} />
            </button>

            <a
              href="https://wa.me/923244146447"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with RankVelt on WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/45 transition-colors hover:border-[#f9a825]/40 hover:text-[#f9a825]"
            >
              <MessageCircle size={18} />
            </a>

            <a
              href="mailto:info@rankvelt.com"
              aria-label="Email RankVelt"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/45 transition-colors hover:border-[#f9a825]/40 hover:text-[#f9a825]"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;