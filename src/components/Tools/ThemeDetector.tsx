import { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle2, AlertCircle, Scan, ShieldCheck, Database, Layout, HelpCircle, ChevronDown } from "lucide-react";

// --- JSON IMPORT ---
// Ensure this path is correct based on your file structure
import toolData from "../../data/tool-content.json";

const ThemeDetector = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  // --- Accordion State for FAQs ---
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeToolId = "shopify-theme-detector";
  const content = (toolData as any)[activeToolId];

  const loadingMessages = [
    { text: "Connecting to store servers...", icon: <Database className="w-4 h-4" /> },
    { text: "Bypassing firewalls & security...", icon: <ShieldCheck className="w-4 h-4" /> },
    { text: "Scanning Shopify liquid files...", icon: <Scan className="w-4 h-4" /> },
    { text: "Identifying theme patterns...", icon: <Layout className="w-4 h-4" /> },
    { text: "Extracting app signatures...", icon: <Search className="w-4 h-4" /> }
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const detectTheme = async () => {
    if (!url.trim()) return;
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Store is taking too long to respond.");
      
      const data = await response.json();
      const html = data.contents;
      if (!html) throw new Error("Could not extract data. Store might be private.");

      const isShopify = html.includes('cdn.shopify.com') || html.includes('shopify-pay') || html.includes('Shopify.shop');
      if (!isShopify) throw new Error("Analysis complete: This is not a Shopify store.");

      let detectedTheme = "Unknown Theme";
      const internalMatch = html.match(/Shopify\.theme\s*=\s*{[^}]*"name"\s*:\s*"(.*?)"/i) || html.match(/theme_name\s*:\s*"(.*?)"/i);
      const displayMatch = html.match(/"name"\s*:\s*"(.*?)"/);

      if (internalMatch && internalMatch[1]) detectedTheme = internalMatch[1];
      else if (displayMatch && displayMatch[1]) detectedTheme = displayMatch[1];

      const lowerHTML = html.toLowerCase();
      if (lowerHTML.includes('shella')) detectedTheme = "Shella (Premium Theme)";
      else if (lowerHTML.includes('prestige')) detectedTheme = "Prestige";
      else if (lowerHTML.includes('impulse')) detectedTheme = "Impulse";

      const appsFound = [];
      const appSignatures = { "Klaviyo": "klaviyo", "Judge.me": "judge.me", "Loox": "loox", "PageFly": "pagefly" };
      Object.entries(appSignatures).forEach(([appName, signature]) => {
        if (lowerHTML.includes(signature.toLowerCase())) appsFound.push(appName);
      });

      setTimeout(() => {
        setResult({ themeName: detectedTheme, apps: appsFound.length > 0 ? appsFound : ["No major apps detected"] });
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black">
      {/* TOOL MAIN CONTAINER */}
      <div className="w-full max-w-4xl mx-auto p-4 md:p-10 bg-[#0a0a0a] border border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#f9a825]/10 blur-[80px] rounded-full"></div>

        <div className="text-center mb-10 relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight uppercase">
            Shopify <span className="text-[#f9a825]">Theme Spy</span>
          </h2>
          <p className="text-white/70 text-[10px] font-black uppercase tracking-[4px]">Advanced OSINT Intelligence</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 relative">
          <input
            type="text"
            placeholder="Enter store URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && detectTheme()}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#f9a825] transition-all"
          />
          <button
            onClick={detectTheme}
            disabled={loading}
            className="bg-[#f9a825] text-black font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(249,168,37,0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            ANALYZE
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-[#f9a825]/10 border-t-[#f9a825] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center"><Scan className="text-[#f9a825] animate-pulse" size={24} /></div>
            </div>
            <div className="space-y-3 w-full max-w-xs">
              {loadingMessages.map((msg, idx) => (
                <div key={idx} className={`flex items-center gap-3 transition-all duration-500 ${idx === loadingStep ? "text-white" : idx < loadingStep ? "text-[#f9a825] opacity-50" : "text-white/40"}`}>
                  {idx < loadingStep ? <CheckCircle2 size={14} /> : msg.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{msg.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS STATE */}
        {result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 rounded-[32px] group hover:border-[#f9a825]/30 transition-all">
              <p className="text-[#f9a825] text-[10px] font-black uppercase tracking-[3px] mb-4">Core Architecture</p>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter uppercase leading-none">{result.themeName}</h3>
              <div className="flex items-center gap-2 text-green-500 mt-4"><CheckCircle2 size={12} /><span className="text-[10px] font-black uppercase tracking-widest">Verified Shopify Stack</span></div>
            </div>
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 rounded-[32px] group hover:border-[#f9a825]/30 transition-all">
              <p className="text-[#f9a825] text-[10px] font-black uppercase tracking-[3px] mb-4">App Ecosystem</p>
              <div className="flex flex-wrap gap-2">{result.apps.map((app: string) => (<span key={app} className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 text-[10px] font-black rounded-xl uppercase tracking-wider">{app}</span>))}</div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 text-red-400 bg-red-400/5 p-6 rounded-2xl border border-red-400/20 mb-6 animate-in zoom-in duration-300">
            <AlertCircle size={20} /> <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
          </div>
        )}
      </div>

      {/* --- SEO ARTICLE SECTION --- */}
      {content && (
        <div className="max-w-4xl mx-auto mt-24 px-6 pb-24">
          <div className="mb-16 border-l-4 border-[#f9a825] pl-8">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
              {content.title}
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              {content.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {content.features?.map((f: any, i: number) => (
              <div key={i} className="p-8 bg-[#0d0d0d] border border-white/5 rounded-[32px] hover:border-[#f9a825]/30 transition-all">
                <h3 className="text-[#f9a825] font-black uppercase text-[10px] tracking-[3px] mb-4">{f.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>

          {/* FAQ SECTION (With Accordion Logic) */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-10">
              <HelpCircle className="text-[#f9a825]" size={32} />
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Everything You Need To Know</h3>
            </div>
            
            <div className="space-y-4">
              {content.faqs?.map((faq: any, i: number) => (
                <div key={i} className={`group overflow-hidden bg-white/[0.02] border rounded-2xl transition-all duration-300 ${activeIndex === i ? "border-[#f9a825]/40 bg-white/[0.04]" : "border-white/5"}`}>
                  <button 
                    onClick={() => toggleFAQ(i)}
                    className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                  >
                    <h4 className={`font-bold uppercase text-sm tracking-wide transition-colors ${activeIndex === i ? "text-[#f9a825]" : "text-white"}`}>
                      Q: {faq.q}
                    </h4>
                    <ChevronDown size={18} className={`text-[#f9a825] transition-transform duration-300 ${activeIndex === i ? "rotate-180" : "rotate-0"}`} />
                  </button>
                  
                  <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${activeIndex === i ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="text-white/70 text-sm leading-relaxed border-l-2 border-[#f9a825]/20 pl-4">
                      A: {faq.a}
                    </p>
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

export default ThemeDetector;