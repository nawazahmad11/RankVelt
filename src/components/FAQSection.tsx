import { motion } from "framer-motion";
import { 
  ChevronDown, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Layout, 
  Clock 
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

const faqs = [
  {
    question: "Do you build Shopify stores from scratch or use templates?",
    answer: "I specialize in both! I can customize premium themes or build a fully custom 'Liquid' store from scratch. Every store I build is optimized for conversions and mobile-first experience.",
    icon: <Layout className="w-4 h-4" />
  },
  {
    question: "Will my store be fast and SEO friendly?",
    answer: "Absolutely. I guarantee a 90+ speed score on Google PageSpeed Insights. I handle image optimization, code minification, and essential SEO structure to ensure you rank higher.",
    icon: <Zap className="w-4 h-4" />
  },
  {
    question: "Do I need to buy the Shopify theme separately?",
    answer: "Yes, the theme license fee is paid directly to the theme developer. However, I can help you choose the best theme for your niche, saving you from wasting money on 'heavy' or outdated themes.",
    icon: <ShoppingBag className="w-4 h-4" />
  },
  {
    question: "Can you integrate custom payment gateways?",
    answer: "Yes, I can set up Stripe, PayPal, and local gateways like 2Checkout or COD (Cash on Delivery) configurations to ensure your customers have a seamless checkout experience.",
    icon: <ShieldCheck className="w-4 h-4" />
  },
  {
    question: "How long does a full store design take?",
    answer: "A professional, high-converting store typically takes 13-15 days. This includes product research, custom design, app integrations, and rigorous testing before launch.",
    icon: <Clock className="w-4 h-4" />
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-black/20 overflow-hidden">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Header */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <h2 className="text-4xl font-black text-white leading-tight">
                Frequently Asked <span className="text-gradient-gold">Questions</span>
              </h2>
              <p className="text-white/60 mt-6 text-lg font-light">
                Can't find what you're looking for? <br />
                <a 
                  href="https://wa.me/923244146447" 
                  className="text-primary font-bold hover:underline decoration-primary/30"
                >
                  Contact me directly
                </a>
              </p>
            </div>
          </div>

          {/* Right Side: Accordion */}
          <div className="lg:w-2/3">
            <Accordion.Root type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <Accordion.Item 
                  key={i} 
                  value={`item-${i}`}
                  className="glass-card border border-white/5 overflow-hidden transition-all duration-300 data-[state=open]:border-primary/30"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between p-6 text-left group">
                      <div className="flex items-center gap-4">
                        <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-black transition-colors">
                          {faq.icon}
                        </div>
                        <span className="text-white font-semibold text-lg">{faq.question}</span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-white/40 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary transition-transform" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  
                  <Accordion.Content className="px-6 pb-6 text-white/60 font-light leading-relaxed animate-accordion-down">
                    <div className="pt-2 border-t border-white/5">
                      {faq.answer}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FAQSection;