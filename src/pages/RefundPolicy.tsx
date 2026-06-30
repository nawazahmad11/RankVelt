import { motion } from "framer-motion";
import LegalLayout from "../components/LegalLayout"; 
import { useNavigate } from "react-router-dom"; // Link ki jagah useNavigate use kia

const RefundPolicy = () => {
  const navigate = useNavigate();
  const lastUpdated = "May, 2026";

  // Professional Scroll Logic (Same as Header)
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

        // 3. URL se hash (#) saaf karein taake layout jump na kare
        window.history.pushState(null, "", "/");
      }
    }, 400); 
  };

  return (
    <LegalLayout title="Refund and Cancellation Policy">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        {/* My Goal Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">My Goal at Nawaz Builds</h2>
          <p className="text-white/60 leading-relaxed">
            At <span className="text-primary font-bold">Nawaz Builds</span>, I want you to love your new online store. I work very hard on every Shopify store design to make sure it meets your needs. Your satisfaction is my top priority.
          </p>
        </section>

        {/* How Cancellations Work */}
        <section className="border-l-2 border-primary/30 pl-8">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">How Cancellations Work</h2>
          <p className="text-white/60 mb-4">I understand that plans can change.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              If you want to cancel your Shopify project, please tell me as soon as possible.
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              If I have not started any work yet, I can cancel the project easily.
            </li>
          </ul>
        </section>

        {/* Refund Policy (Detailed) */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Refund Policy</h2>
          <p className="text-white/60 mb-6 font-light">Because I provide professional services and spend my time building your store, my refund rules are:</p>
          <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
              <h3 className="text-white font-bold mb-1">Before Work Starts:</h3>
              <p className="text-white/60 text-sm">If you cancel before I start the design or development, you may get a full refund.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
              <h3 className="text-white font-bold mb-1">During Work:</h3>
              <p className="text-white/60 text-sm">If the project is already in progress, I will charge for the work I have already finished. The rest of the money will be refunded to you.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
              <h3 className="text-white font-bold mb-1">After Completion:</h3>
              <p className="text-white/60 text-sm">Once the Shopify development is finished and delivered, I cannot offer a refund.</p>
            </div>
          </div>
        </section>

        {/* Why I Have This Policy */}
        <section className="relative overflow-hidden p-8 border border-primary/20 bg-primary/5 rounded-[2rem]">
          <h2 className="text-2xl font-bold text-white mb-4">Why I Have This Policy</h2>
          <p className="text-white/60 relative z-10">
            This policy helps me, <span className="text-white font-bold">Nawaz Ahmad</span>, keep a high standard of work. It ensures I can cover the tools and time used to create your premium store. This is part of my commitment to <span className="text-primary font-black uppercase tracking-widest">E-E-A-T</span> (Trustworthiness).
          </p>
        </section>

        {/* Get In Touch - Fixed Section */}
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

        {/* Revisions and Fixes */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
          <h2 className="text-2xl font-bold text-white mb-4">Revisions and Fixes</h2>
          <p className="text-white/60 leading-relaxed">
            Instead of a refund, I usually offer free revisions. If you don't like a small detail in the Shopify design, just tell me. I will fix it until it looks perfect for your brand.
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

export default RefundPolicy;