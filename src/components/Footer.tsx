import { useState } from "react"; // Nayi state add ki
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Youtube, Send, MessageCircle } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const websiteLogo = "/NawazCart.webp"; 

  // --- Naya Function: Newsletter Logic ---
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMUlRY1rQYmA450Lf1t0lMp-C_WAwoCjBpjqDEigCy2fb58dNF4jD7muP2Vi5Ig2odAg/exec"; 

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      setStatus("success");
      setEmail(""); 
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };
  // --------------------------------------

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-white/5 bg-[#050505] w-full overflow-hidden">
      <div className="w-full max-w-full mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 xl:gap-20 mb-16">
          
          <div className="lg:col-span-4 space-y-7">
            <div className="flex items-center space-x-3">
              
              {/* <img src={websiteLogo} alt="Logo" className="h-10 w-auto rounded-full object-contain" /> */}

              <img 
                  src={websiteLogo} 
                  alt="Logo" 
                  width={40} 
                  height={40} 
                  className="h-10 w-auto object-contain rounded-full" 
                />

              <h3 className="text-xl font-bold tracking-tight text-white italic">Nawaz Ahmad</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">Shopify Architect & Performance Expert. Helping e-commerce brands scale from $0 to 7-figures with high-performance stores.</p>
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex items-center space-x-3 hover:text-[#f9a825] transition-colors cursor-pointer group">
                <Mail size={16} />
                <a href="mailto:info@nawazahmad.com">info@nawazbuilds.com</a>
              </div>
              <div className="flex items-center space-x-3"><MapPin size={16} /><span>Lahore, Dubai & Remote</span></div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="space-y-5">
              <h4 className="text-[13px] font-black text-white uppercase tracking-widest">Expertise</h4>
              <ul className="space-y-3 text-sm text-white/70 font-medium">
                <li><button onClick={() => scrollToSection("services")} className="hover:text-[#f9a825] transition-colors">Development</button></li>
                <li><button onClick={() => scrollToSection("performance")} className="hover:text-[#f9a825] transition-colors">Optimization</button></li>
                <li><Link to="/blog" className="hover:text-[#f9a825] transition-colors">Case Studies</Link></li>
              </ul>
            </div>




            <div className="space-y-5">
              <h4 className="text-[13px] font-black text-white uppercase tracking-widest">Growth Tools</h4>
              <ul className="space-y-3 text-sm text-white/70 font-medium">
                <li><Link to="/tools/profit-margin-calculator" className="hover:text-[#f9a825] transition-colors">Profit Calculator</Link></li>
                <li><Link to="/tools/legal-policy-generator"  className="hover:text-[#f9a825] transition-colors">Policy Generator</Link></li>
                <li><Link to="/tools/business-name-generator" className="hover:text-[#f9a825] transition-colors">Name Generator</Link></li>
                <li><Link to="/tools/shopify-theme-detector" className="hover:text-[#f9a825] transition-colors">Theme Detector</Link></li>
              </ul>
            </div>


            {/* --- Naya Legal Section --- */}
            <div className="space-y-5">
              <h4 className="text-[13px] font-black text-white uppercase tracking-widest">Legal</h4>
              <ul className="space-y-3 text-sm text-white/70 font-medium">
                <li>
                  <Link to="/privacy-policy" className="hover:text-[#f9a825] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="hover:text-[#f9a825] transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="hover:text-[#f9a825] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>






            <div className="space-y-5">
              <h4 className="text-[13px] font-black text-white uppercase tracking-widest">Resources</h4>
              <ul className="space-y-3 text-sm text-white/70 font-medium">
                <li><Link to="/blog" className="hover:text-[#f9a825] transition-colors">Shopify Tips</Link></li>
                <li><a href="#" className="hover:text-[#f9a825] transition-colors">WhatsApp Channel</a></li>
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[13px] font-black text-white uppercase tracking-widest">Connect</h4>
              <ul className="space-y-3 text-sm text-white/70 font-medium">
                <li><a href="https://wa.me/923244146447" className="flex items-center gap-2 hover:text-[#f9a825] transition-colors"><MessageCircle size={14} /> WhatsApp</a></li>
                <li><a href="mailto:info@nawazahmad.com" className="flex items-center gap-2 hover:text-[#f9a825] transition-colors"><Mail size={14} /> Email Me</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-12 border-t border-white/5 flex flex-col xl:flex-row items-center justify-between gap-10 text-center xl:text-left">
          <div>
            <h4 className="text-xl font-bold text-white mb-2 italic">Scale Your Shopify Store</h4>
            <p className="text-sm text-white/70">Get conversion and speed tips directly to your inbox.</p>
          </div>
          {/* Form ko update kiya taake functions connect ho sakein */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto xl:min-w-[500px]">
            <input 
              placeholder="you@example.com" 
              className="flex-1 px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#f9a825]/50 transition-all" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
            <button 
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-4 rounded-xl bg-[#f9a825] text-black font-black uppercase text-[17px] tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50 min-w-[180px]"
            >
              {status === "loading" ? "Wait..." : status === "success" ? "Subscribed!" : "Subscribe"} 
              <Send size={19} />
            </button>
          </form>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-white/60">Socials:</span>
              <div className="flex items-center space-x-4">
                {[
                  { icon: <Youtube size={20} />, url: "", label: "Visit YouTube" },
                  { icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/nawaz-ahmad-shopify/", label: "Visit LinkedIn" },
                  { icon: <Instagram size={20} />, url: "https://www.instagram.com/nawazbuilds.official/", label: "Visit Instagram" },
                  { icon: <MessageCircle size={20} />, url: "https://wa.me/923244146447", label: "Chat on WhatsApp" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.url || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={social.label} // Ye line Google PageSpeed score fix karegi
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-[#f9a825] hover:border-[#f9a825]/40 transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="text-[11px] font-bold text-white/60 uppercase tracking-[6px]">
              © {new Date().getFullYear()} NAWAZ AHMAD. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>



    </footer>
  );
};

export default Footer;