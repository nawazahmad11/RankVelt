import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Youtube,
  Send,
  MessageCircle,
} from "lucide-react";

const NEWSLETTER_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyMUlRY1rQYmA450Lf1t0lMp-C_WAwoCjBpjqDEigCy2fb58dNF4jD7muP2Vi5Ig2odAg/exec";

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

  const handleSubscribe = async (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");

    try {
      await fetch(NEWSLETTER_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          type: "Newsletter Subscription",
        }),
      });

      setStatus("success");
      setEmail("");
      scheduleStatusReset(5000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus("error");
      scheduleStatusReset(3500);
    }
  };

  const scrollToSection = (id: string) => {
    const performScroll = () => {
      const element = document.getElementById(id);

      if (!element) return;

      const headerOffset = 100;
      const position =
        element.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    };

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(performScroll, 400);
      return;
    }

    performScroll();
  };

  const socials = [
    {
      icon: <Youtube size={20} />,
      url: "",
      label: "Visit YouTube",
    },
    {
      icon: <Linkedin size={20} />,
      url: "https://www.linkedin.com/in/nawaz-ahmad-shopify/",
      label: "Visit LinkedIn",
    },
    {
      icon: <Instagram size={20} />,
      url: "https://www.instagram.com/nawazbuilds.official/",
      label: "Visit Instagram",
    },
    {
      icon: <MessageCircle size={20} />,
      url: "https://wa.me/923244146447",
      label: "Chat on WhatsApp",
    },
  ];

  return (
    <footer className="w-full overflow-hidden border-t border-white/5 bg-[#050505]">
      <div className="mx-auto w-full max-w-full px-6 py-16 md:px-12 lg:px-20">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 xl:gap-20">
          <div className="space-y-7 lg:col-span-4">
            <button
              type="button"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/");
                  return;
                }

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="flex items-center gap-3 text-left"
              aria-label="Go to RankVelt homepage"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f9a825]/35 bg-[#f9a825]/10 text-base font-black text-[#f9a825]">
                R
              </span>

              <div>
                <h3 className="text-xl font-bold tracking-tight text-white italic">
                  Rank<span className="text-[#f9a825]">Velt</span>
                </h3>

                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                  SEO & Web Growth Studio
                </p>
              </div>
            </button>

            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Founder-led SEO and web growth support for local businesses,
              eCommerce brands, and companies that want stronger Google
              visibility.
            </p>

            <div className="space-y-4 text-sm text-white/70">
              <div className="group flex items-center space-x-3 transition-colors hover:text-[#f9a825]">
                <Mail size={16} />

                {/* Keep this email until your RankVelt business email is ready */}
                <a href="mailto:info@nawazahmad.com">
                  info@nawazbuilds.com
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin size={16} />
                <span>Lahore, Dubai & Remote</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            <div className="space-y-5">
              <h4 className="text-[13px] font-black uppercase tracking-widest text-white">
                SEO Services
              </h4>

              <ul className="space-y-3 text-sm font-medium text-white/70">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("services")}
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Local SEO
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("services")}
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    eCommerce SEO
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("services")}
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Business SEO
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("audit")}
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    SEO Audit
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[13px] font-black uppercase tracking-widest text-white">
                Web Design
              </h4>

              <ul className="space-y-3 text-sm font-medium text-white/70">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("services")}
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    WordPress Websites
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("services")}
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Shopify Store Design
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("portfolio")}
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Website Projects
                  </button>
                </li>

                <li>
                  <Link
                    to="/case-studies"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Selected Case Studies
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[13px] font-black uppercase tracking-widest text-white">
                Growth Tools
              </h4>

              <ul className="space-y-3 text-sm font-medium text-white/70">
                <li>
                  <Link
                    to="/tools/profit-margin-calculator"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Profit Calculator
                  </Link>
                </li>

                <li>
                  <Link
                    to="/tools/legal-policy-generator"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Policy Generator
                  </Link>
                </li>

                <li>
                  <Link
                    to="/tools/business-name-generator"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Name Generator
                  </Link>
                </li>

                <li>
                  <Link
                    to="/tools/shopify-theme-detector"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Theme Detector
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[13px] font-black uppercase tracking-widest text-white">
                Legal & Resources
              </h4>

              <ul className="space-y-3 text-sm font-medium text-white/70">
                <li>
                  <Link
                    to="/blog"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    SEO Insights
                  </Link>
                </li>

                <li>
                  <Link
                    to="/privacy-policy"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link
                    to="/refund-policy"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Refund Policy
                  </Link>
                </li>

                <li>
                  <Link
                    to="/terms-of-service"
                    className="transition-colors hover:text-[#f9a825]"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-10 border-t border-white/5 py-12 text-center xl:flex-row xl:text-left">
          <div>
            <h4 className="mb-2 text-xl font-bold text-white italic">
              Get practical SEO growth insights.
            </h4>

            <p className="text-sm text-white/70">
              Receive useful SEO, web design, visibility, and conversion tips.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full flex-col gap-4 sm:flex-row xl:w-auto xl:min-w-[500px]"
          >
            <input
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all placeholder:text-white/30 focus:border-[#f9a825]/50 focus:outline-none"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === "loading" || status === "success"}
              aria-label="Email address for newsletter"
            />

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="flex min-w-[180px] items-center justify-center gap-3 rounded-xl bg-[#f9a825] px-6 py-4 text-[17px] font-black uppercase tracking-widest text-black transition-all hover:brightness-110 disabled:opacity-50"
            >
              {status === "loading"
                ? "Wait..."
                : status === "success"
                  ? "Subscribed!"
                  : status === "error"
                    ? "Try Again"
                    : "Subscribe"}

              <Send size={19} />
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-12 md:flex-row">
          <div className="flex items-center space-x-6">
            <span className="text-[10px] font-black uppercase tracking-[3px] text-white/60">
              Socials:
            </span>

            <div className="flex items-center space-x-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url || "#"}
                  target={social.url ? "_blank" : undefined}
                  rel={social.url ? "noopener noreferrer" : undefined}
                  onClick={(event) => {
                    if (!social.url) {
                      event.preventDefault();
                    }
                  }}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-white/40 transition-all hover:border-[#f9a825]/40 hover:text-[#f9a825]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-[4px] text-white/60 md:tracking-[6px]">
            © {new Date().getFullYear()} RANKVELT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;