import { motion } from "framer-motion";
import {
  ChevronDown,
  Globe,
  Layout,
  MapPinned,
  Search,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

const faqs = [
  {
    question: "What types of businesses does RankVelt work with?",
    answer:
      "RankVelt focuses on local businesses, eCommerce brands, service businesses, consultants, agencies, and growing companies that want better organic visibility and stronger website foundations.",
    icon: <Globe className="h-4 w-4" />,
  },
  {
    question: "How long does SEO take to show progress?",
    answer:
      "SEO timelines depend on your market, competitors, website history, technical condition, and the amount of work required. The first goal is to identify the highest-impact work and create a clear roadmap instead of making random changes.",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    question: "Do you offer Local SEO services?",
    answer:
      "Yes. Local SEO support can include Google Business Profile optimization, local keyword research, service-area pages, local visibility improvements, review strategy guidance, and location-based content planning.",
    icon: <MapPinned className="h-4 w-4" />,
  },
  {
    question: "Can you help with Shopify and eCommerce SEO?",
    answer:
      "Yes. RankVelt supports collection pages, product pages, internal linking, Shopify technical foundations, category visibility, search-focused content, and better product discovery paths.",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    question: "Do you also build WordPress websites and Shopify stores?",
    answer:
      "Yes. Website design is available when it supports SEO and growth. This can include SEO-ready WordPress websites, Shopify store structure, landing pages, mobile improvements, and conversion-focused redesigns.",
    icon: <Layout className="h-4 w-4" />,
  },
  {
    question: "Can you guarantee first-page or number-one rankings?",
    answer:
      "No. Ethical SEO cannot guarantee a specific ranking position. RankVelt focuses on improving search relevance, technical health, useful page content, user experience, and the long-term signals that support stronger visibility.",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    question: "Will I work directly with the person handling my SEO?",
    answer:
      "Yes. RankVelt is founder-led. You work directly with the strategist responsible for your SEO direction, website priorities, communication, and next-step recommendations.",
    icon: <Search className="h-4 w-4" />,
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="overflow-hidden bg-black/20 py-24">
      <div className="section-container">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-primary">
                Before We Start
              </p>

              <h2 className="text-4xl font-black leading-tight text-white">
                Frequently Asked{" "}
                <span className="text-gradient-gold">Questions</span>
              </h2>

              <p className="mt-6 text-lg font-light text-white/60">
                Need clarity around your website, SEO, or growth priorities?
                <br />

                <a
                  href="https://wa.me/923244146447?text=Hi%20RankVelt%2C%20I%20have%20a%20question%20about%20SEO%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary hover:underline decoration-primary/30"
                >
                  Contact RankVelt directly
                </a>
              </p>
            </div>
          </div>

          <div className="lg:w-2/3">
            <Accordion.Root type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <Accordion.Item
                  key={faq.question}
                  value={`item-${index}`}
                  className="glass-card overflow-hidden border border-white/5 transition-all duration-300 data-[state=open]:border-primary/30"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full items-center justify-between p-6 text-left">
                      <div className="flex items-center gap-4">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-primary transition-colors group-data-[state=open]:bg-primary group-data-[state=open]:text-black">
                          {faq.icon}
                        </div>

                        <span className="text-lg font-semibold text-white">
                          {faq.question}
                        </span>
                      </div>

                      <ChevronDown className="h-5 w-5 shrink-0 text-white/40 transition-transform group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" />
                    </Accordion.Trigger>
                  </Accordion.Header>

                  <Accordion.Content className="animate-accordion-down px-6 pb-6 font-light leading-relaxed text-white/60">
                    <div className="border-t border-white/5 pt-4">
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