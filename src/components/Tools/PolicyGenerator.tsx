import { useState } from "react";
import { ShieldCheck, Copy, Check, HelpCircle, ChevronDown, AlertTriangle, ArrowRight } from "lucide-react";
import toolData from "../../data/tool-content.json";

const PolicyGenerator = () => {
  const [activeTab, setActiveTab] = useState("privacy");
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    websiteUrl: "",
    refundDays: "30",
    isDropshipping: false,
    useCookies: true,
    collectPhone: false
  });

  const activeToolId = "policy-generator";
  const content = (toolData as any)[activeToolId];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Content Generation Logic
  const generatePrivacy = () => {
    return `PRIVACY POLICY FOR ${formData.storeName || "[STORE NAME]"}

At ${formData.storeName || "our store"}, accessible from ${formData.websiteUrl || "our website"}, we prioritize visitor privacy.

Information We Collect:
We collect your email address and name to process orders.${formData.collectPhone ? "\nWe also collect your phone number for SMS updates and delivery coordination." : ""}

${formData.useCookies ? "Cookies & Web Beacons:\nWe use cookies to store information about visitors' preferences and the pages on the website that the visitor accessed or visited." : ""}

Third-Party Policies:
Our Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of these third-party ad servers.

Contact: ${formData.email || "[Your Email]"}`;
  };

  const generateRefund = () => {
    return `REFUND & RETURN POLICY

Thank you for shopping at ${formData.storeName || "[Store Name]"}.

Return Window:
Users have ${formData.refundDays} days to return an item from the date of delivery. To be eligible, the item must be unused and in original packaging.

${formData.isDropshipping ? "Dropshipping & Shipping Notice:\nPlease note that as we source products globally, shipping times may vary. Refunds will not be issued for delays caused by customs or international transit unless the package exceeds our 60-day delivery guarantee." : ""}

Process:
To start a return, contact us at ${formData.email || "[Your Email]"}. Once inspected, we will notify you of the approval or rejection of your refund.`;
  };

  const generateTerms = () => {
    return `TERMS OF SERVICE

By using ${formData.websiteUrl || "this website"}, you agree to comply with the following terms.

Intellectual Property:
All content on ${formData.storeName || "this store"} is the property of the store owner.

Liability:
${formData.isDropshipping ? "We act as a facilitator between suppliers and customers. We are not liable for minor manufacturing defects but will assist in replacements." : "We are liable only for the cost of the product purchased."}

Governing Law:
These terms are governed by the laws of the jurisdiction where the business is registered.`;
  };

  const currentContent = activeTab === "privacy" ? generatePrivacy() : activeTab === "refund" ? generateRefund() : generateTerms();

  return (
    <div className="w-full">
      {/* MAIN GENERATOR UI */}
      <div className="w-full max-w-6xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Side: Configuration */}
          <div className="lg:col-span-5 p-8 border-r border-white/5 bg-white/[0.01]">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                Policy <span className="text-[#f9a825]">Customizer</span>
              </h2>
              <p className="text-white/65 text-[10px] font-black uppercase tracking-[3px]">Tailor-made Legal Documents</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <input type="text" placeholder="Store Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#f9a825] outline-none transition-all" onChange={(e) => setFormData({...formData, storeName: e.target.value})} />
                <input type="email" placeholder="Support Email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#f9a825] outline-none transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="h-[1px] bg-white/5 my-6"></div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-[#f9a825] uppercase tracking-widest">Business Rules</p>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-xs text-white/60 font-bold uppercase">Refund Window</span>
                  <select 
                    className="bg-black text-[#f9a825] text-xs font-bold border-none outline-none cursor-pointer"
                    onChange={(e) => setFormData({...formData, refundDays: e.target.value})}
                    value={formData.refundDays}
                  >
                    <option value="5">5 Days</option>
                    <option value="10">10 Days</option>
                    <option value="15">15 Days</option>
                    <option value="20">20 Days</option>
                    <option value="25">25 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all group">
                  <input type="checkbox" className="accent-[#f9a825] w-4 h-4" onChange={(e) => setFormData({...formData, isDropshipping: e.target.checked})} />
                  <span className="text-xs text-white/60 font-bold uppercase group-hover:text-white transition-colors">I am Dropshipping</span>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all group">
                  <input type="checkbox" className="accent-[#f9a825] w-4 h-4" onChange={(e) => setFormData({...formData, collectPhone: e.target.checked})} />
                  <span className="text-xs text-white/60 font-bold uppercase group-hover:text-white transition-colors">Collect Phone Numbers</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="lg:col-span-7 p-8 flex flex-col h-full bg-black/40">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
              {["privacy", "refund", "terms"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${activeTab === tab ? "bg-[#f9a825] text-black shadow-[0_0_20px_rgba(249,168,37,0.3)]" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                >
                  {tab === "privacy" ? "Privacy" : tab === "refund" ? "Refunds" : "Terms"}
                </button>
              ))}
            </div>

            <div className="relative flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 overflow-y-auto max-h-[500px]">
              <button 
                onClick={() => handleCopy(currentContent)}
                className="absolute top-4 right-4 p-3 bg-[#f9a825] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 font-black text-[10px] uppercase"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy Content"}
              </button>
              <pre className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-white/70 uppercase tracking-tight">
                {currentContent}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC ARTICLE SECTION FROM JSON */}
      {content && (
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="mb-16 border-l-4 border-[#f9a825] pl-8">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">{content.title}</h2>
            <p className="text-white/65 text-lg font-medium leading-relaxed max-w-2xl">{content.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {content.features?.map((f: any, i: number) => (
              <div key={i} className="p-8 bg-[#0d0d0d] border border-white/5 rounded-[32px] hover:border-[#f9a825]/30 transition-all group">
                <h3 className="text-[#f9a825] font-black uppercase text-[10px] tracking-[3px] mb-4 flex items-center gap-2">
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> {f.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-10">
              <HelpCircle className="text-[#f9a825]" size={32} />
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Legal FAQs</h3>
            </div>
            <div className="space-y-4">
              {content.faqs?.map((faq: any, i: number) => (
                <div key={i} className={`group overflow-hidden bg-white/[0.02] border rounded-2xl transition-all duration-300 ${activeIndex === i ? "border-[#f9a825]/40 bg-white/[0.04]" : "border-white/5"}`}>
                  <button onClick={() => setActiveIndex(activeIndex === i ? null : i)} className="w-full p-6 flex items-center justify-between text-left outline-none">
                    <h4 className={`font-bold uppercase text-sm tracking-wide transition-colors ${activeIndex === i ? "text-[#f9a825]" : "text-white"}`}>Q: {faq.q}</h4>
                    <ChevronDown size={18} className={`text-[#f9a825] transition-transform duration-300 ${activeIndex === i ? "rotate-180" : "rotate-0"}`} />
                  </button>
                  <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${activeIndex === i ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="text-white/70 text-sm leading-relaxed border-l-2 border-[#f9a825]/20 pl-4">A: {faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyGenerator;