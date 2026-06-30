import { motion } from "framer-motion";
import LegalLayout from "../components/LegalLayout"; 
import { useNavigate } from "react-router-dom"; // Link ki jagah useNavigate use kia

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const lastUpdated = "May, 2026";

  // Professional Scroll Logic (Same as Header & other Legal Pages)
  const handleInternalLink = (id: string) => {
    // 1. Pehle home page par navigate karein
    navigate("/");

    // 2. Thora delay dein taake page load ho jaye phir scroll karein
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 100; // Header height adjustment
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // 3. URL ko clean rakhein (# hash remove karein)
        window.history.pushState(null, "", "/");
      }
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
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
          <p className="text-white/60 leading-relaxed">
            Welcome to <span className="text-primary font-bold">Nawaz Builds</span>. I care about your privacy. This page tells you how I collect and use your data when you visit <span className="text-white border-b border-white/20">nawazbuilds.com</span>. My goal is to provide the best Shopify store design and development services while keeping your information safe.
          </p>
        </section>

        {/* Information I Collect */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Information I Collect</h2>
          <p className="text-white/60 mb-6 font-light">I only collect info that helps me work with you. This includes:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Your Name.",
              "Your Email Address.",
              "Your Store Details (for Shopify projects).",
              "Your Phone Number (if you provide it)."
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* How I Use Your Data */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">How I Use Your Data</h2>
          <div className="space-y-4">
            <p className="text-white/60">At Nawaz Builds, I use your info to:</p>
            <ul className="space-y-4 border-l border-primary/20 pl-6">
              {[
                "Talk to you about your project.",
                "Improve my Shopify development services.",
                "Send you updates about your store design.",
                "Answer your questions quickly."
              ].map((text, i) => (
                <li key={i} className="text-white/70 flex gap-3">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
          <p className="text-white/60 leading-relaxed">
            I use "cookies" to make your experience better. Cookies help me to see which parts of my website you like the most. This helps me improve my site’s speed and design.
          </p>
        </section>

        {/* Data Security */}
        <section className="relative overflow-hidden p-8 border border-primary/20 bg-primary/5 rounded-[2rem]">
          <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
          <p className="text-white/60 relative z-10 leading-relaxed">
            Your trust is part of my <span className="text-primary font-black tracking-widest uppercase">E-E-A-T</span> (Expertise, Authoritativeness, Trustworthiness). I use high-security tools to protect your data. I never sell your personal info to other people.
          </p>
          <div className="absolute top-[-20px] right-[-20px] text-primary/5 font-black text-8xl pointer-events-none select-none">
            EEAT
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
          <p className="text-white/60 leading-relaxed">
            You can ask me to delete your data at any time. Just send me an email. I am here to help you feel safe while I build your professional Shopify store.
          </p>
        </section>

        {/* Get In Touch - FIXED LINK */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-white/60 leading-relaxed">
            If you have any questions regarding these policies or want to discuss a project, 
            you can learn more about my work and find my direct contact details in the {" "}
            <button 
              onClick={() => handleInternalLink("about-me")} 
              className="text-primary hover:underline font-bold cursor-pointer bg-transparent border-none p-0 inline decoration-primary/30 underline-offset-4"
            >
              About Me
            </button>{" "}
            section on the home page, or email me directly at <span className="text-white">info@nawazbuilds.com</span>.
          </p>
        </section>

        {/* Page Footer */}
        <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/50 uppercase tracking-[4px]">Last Updated: {lastUpdated}</p>
          <p className="text-[10px] text-white/50 uppercase tracking-[4px]">Nawaz Builds © 2026</p>
        </footer>
      </motion.div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;