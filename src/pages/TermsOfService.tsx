import { motion } from "framer-motion";
import LegalLayout from "../components/LegalLayout"; 
import { useNavigate } from "react-router-dom"; // Link ki jagah useNavigate

const TermsOfService = () => {
  const navigate = useNavigate();
  const lastUpdated = "May, 2026";

  // Professional Scroll Logic (URL Clean rakhne ke liye)
  const handleInternalLink = (id: string) => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // URL se # saaf karne ke liye
        window.history.pushState(null, "", "/");
      }
    }, 400);
  };

  return (
    <LegalLayout title="Terms and Conditions">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Nawaz Builds</h2>
          <p className="text-white/60 leading-relaxed font-light">
            Thank you for choosing <span className="text-primary font-bold">Nawaz Builds</span>. These rules tell you how to use my website, <span className="text-white border-b border-white/20 text-sm">nawazbuilds.com</span>. By using this site, you agree to these terms. I provide high-quality Shopify store design and development services to help your business grow.
          </p>
        </section>

        {/* my Services */}
        <section className="border-l-2 border-primary/30 pl-8">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">Our Services</h2>
          <p className="text-white/60 leading-relaxed">
            I specialize in building professional online stores. When you hire <span className="text-white">Nawaz Builds</span>, I work hard to give you a premium design. My goal is to make sure your Shopify development project is a success.
          </p>
        </section>

        {/* Your Responsibilities */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Your Responsibilities</h2>
          <p className="text-white/60 mb-6 font-light">To make a great store, I need your help. You agree to:</p>
          <ul className="space-y-4">
            {[
              "Give me the right information about your business.",
              "Provide logos, images, and text for your store.",
              "Reply to my messages so I can finish the work on time."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-white/80">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Payment Rules */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Payment Rules</h2>
          <p className="text-white/60 leading-relaxed">
            I start working once I agree on the price and plan. All payments for my Shopify services should be made through my <span className="text-white font-medium">official channels</span>. This keeps everything safe and clear for both of us.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem]">
          <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
          <p className="text-white/60 leading-relaxed">
            The design and code I create for you become your property <span className="text-white underline underline-offset-4 decoration-primary/40">after full payment</span>. However, the name Nawaz Builds and the content on this website belong to us. Please do not copy my work without asking.
          </p>
        </section>

        {/* EEAT Section - FIXED LINK */}
        <section className="relative overflow-hidden p-8 border border-white/5 bg-white/[0.02] rounded-[2rem]">
          <h2 className="text-2xl font-bold text-white mb-4">Trust and Reliability (E-E-A-T)</h2>
          <p className="text-white/60 relative z-10 leading-relaxed">
            At Nawaz Builds, I value honesty. I promise to use my expertise to build the best store for you. You can see my past work on my {" "}
            <button 
              onClick={() => handleInternalLink("portfolio")} 
              className="text-primary hover:underline font-bold cursor-pointer bg-transparent border-none p-0 inline underline-offset-4"
            >
              Portfolio
            </button>{" "}
            section to see my high standards.
          </p>
        </section>


        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 text-red-400/80">Limitation of Liability</h2>
          <p className="text-white/60 leading-relaxed">
            I build the best tools for you, but I’m not responsible for your store's total sales. Success depends on your marketing and products. I focus on giving you a fast and working Shopify store design.
          </p>
        </section>

        {/* Changes to Terms */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Changes to These Terms</h2>
          <p className="text-white/60 leading-relaxed">
            Sometimes I update these rules. I will post the new date at the top of this page. Please check this page sometimes to stay updated.
          </p>
        </section>

        {/* Footer info for the page */}
        <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/50 uppercase tracking-[4px]">Last Updated: {lastUpdated}</p>
          <p className="text-[10px] text-white/50 uppercase tracking-[4px]">Nawaz Builds © 2026</p>
        </footer>
      </motion.div>
    </LegalLayout>
  );
};

export default TermsOfService;