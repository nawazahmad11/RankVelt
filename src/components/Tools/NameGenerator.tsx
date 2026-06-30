import { useState } from "react"; 
import { Copy, Sparkles, Check, HelpCircle, ChevronDown, ShoppingBag, Hash, Sparkle, Leaf, Cpu, Baby, Flower2, Heart, BookOpen, Hammer } from "lucide-react";
import toolData from "../../data/tool-content.json";

const NameGenerator = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Shopify Business");
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeToolId = "name-generator";
  const content = (toolData as any)[activeToolId];

  const data: any = {
    "Shopify Business": { 
      icon: <ShoppingBag size={14} />,
      suffixes: ["Cart", "Vault", "Luxe", "Mart", "Flow", "Sync", "Hub", "Grid", "Base", "Bloom", "Swift", "Peak"],
      prefixes: ["Elite", "Smart", "Neo", "Pure", "Prime", "Global", "Urban", "Next", "Aura", "Zen", "Bold"]
    },
    "Clothing Store": { 
      icon: <ShoppingBag size={14} />,
      suffixes: ["Wear", "Apparel", "Stitch", "Vogue", "Thread", "Fit", "Fab", "Cloth", "Studio", "Atelier"],
      prefixes: ["Urban", "Chic", "Moda", "Silk", "Trend", "Street", "Velvet", "Retro", "Loom", "Stitch"]
    },
    "TikTok Shop": { 
      icon: <Hash size={14} />,
      suffixes: ["Viral", "Flash", "Drop", "Tok", "Trends", "Buzz", "Snap", "Pick", "Now", "Go"],
      prefixes: ["Fast", "Z", "Epic", "Daily", "Hot", "Top", "Viral", "Trend", "Quick", "Smart"]
    },
    "Jewelry Store": { 
      icon: <Sparkle size={14} />,
      suffixes: ["Gems", "Bling", "Shine", "Jewel", "Stone", "Aura", "Gold", "Silver", "Pearls", "Ice"],
      prefixes: ["Royal", "Elegant", "Pure", "Lustre", "Ice", "Gilded", "Fine", "Bright", "Ever", "Nova"]
    },
    "Organic Shop": {
      icon: <Leaf size={14} />,
      suffixes: ["Eco", "Leaf", "Root", "Seed", "Farm", "Nature", "Green", "Earth", "Sprout", "Bloom"],
      prefixes: ["Bio", "Pure", "Eco", "Natural", "Green", "Earth", "Wild", "Raw", "Fresh", "True"]
    },
    "Tech/Gadget": {
      icon: <Cpu size={14} />,
      suffixes: ["Tech", "Bot", "Gear", "Logic", "Port", "Wire", "Node", "Grid", "System", "Flow"],
      prefixes: ["Cyber", "Nano", "Smart", "Neo", "Micro", "Alpha", "Hyper", "Logic", "Swift", "Pro"]
    },
    "Baby Store": {
      icon: <Baby size={14} />,
      suffixes: ["Baby", "Tot", "Kid", "Care", "Nest", "Safe", "Soft", "Joy", "Love", "Home"],
      prefixes: ["Little", "Tiny", "Sweet", "Soft", "Cuddly", "Baby", "Happy", "Kind", "Pure", "Safe"]
    },
    "Cosmetic/Beauty": {
      icon: <Flower2 size={14} />,
      suffixes: ["Glow", "Skin", "Face", "Lash", "Pout", "Glam", "Luxe", "Pure", "Blush", "Silk"],
      prefixes: ["Lush", "Vivid", "Pure", "Luxe", "Silk", "Velvet", "Glow", "Nu", "Rare", "Aura"]
    },
    "Pet Store": {
      icon: <Heart size={14} />,
      suffixes: ["Paws", "Tail", "Bark", "Fur", "Whiskers", "Zoo", "Buddy", "Den", "Park", "Bones"],
      prefixes: ["Happy", "Loyal", "Snug", "Wild", "Pet", "Fur", "Calm", "Wag", "Cute", "Kind"]
    },
    "Book Store": {
      icon: <BookOpen size={14} />,
      suffixes: ["Reads", "Pages", "Library", "Book", "Nook", "Shelf", "Chapter", "Story", "Verse", "Ink"],
      prefixes: ["Wise", "Open", "Classic", "Dream", "Story", "Paper", "Ink", "Little", "The", "Grand"]
    },
    "Craft Store": {
      icon: <Hammer size={14} />,
      suffixes: ["Arts", "Craft", "Made", "Hand", "Studio", "Works", "Lab", "Space", "Build", "Create"],
      prefixes: ["Handy", "Art", "Pure", "Real", "Simply", "Craft", "Hand", "Small", "Home", "Bold"]
    }
  };

  const generateNames = () => {
    if (!keyword.trim()) return;
    const currentData = data[category];
    const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);
    
    const combinations = [
      ...shuffle(currentData.suffixes).slice(0, 8).map(s => `${keyword}${s}`),
      ...shuffle(currentData.prefixes).slice(0, 8).map(p => `${p}${keyword}`),
      `${keyword}ly`,
      `${keyword}ify`,
      `The ${keyword} Co`
    ];

    setResults(shuffle(combinations).slice(0, 16)); 
  };

  const copyToClipboard = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-[#0a0a0a] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden">
        
        {/* TABS SELECTOR */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {Object.keys(data).map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setResults([]); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
                category === cat 
                ? "bg-[#f9a825] text-black border-[#f9a825] shadow-[0_0_15px_rgba(249,168,37,0.3)]" 
                : "bg-white/5 text-white/55 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {data[cat].icon} {cat}
            </button>
          ))}
        </div>

        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-1xl font-black text-white tracking-tighter uppercase leading-none">
            {category} <span className="text-[#f9a825]">Generator</span>
          </h2>
        </div>

        {/* INPUT */}
        <div className="flex flex-col sm:row gap-4 mb-12 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Enter keyword for ${category.toLowerCase()}...`}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateNames()}
              className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-5 text-white focus:outline-none focus:border-[#f9a825] transition-all text-sm uppercase font-bold tracking-tight"
            />
          </div>
          <button
            onClick={generateNames}
            className="bg-[#f9a825] text-black font-black px-12 py-5 rounded-[20px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            <Sparkles size={18} fill="black" /> 
            <span className="uppercase tracking-widest text-xs">Generate Brand</span>
          </button>
        </div>

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-500">
            {results.map((name, index) => (
              <div key={index} className="group bg-white/[0.03] border border-white/5 px-6 py-5 rounded-2xl flex items-center justify-between hover:border-[#f9a825]/40 transition-all">
                <span className="text-white font-black uppercase tracking-tight text-sm truncate">{name}</span>
                <button onClick={() => copyToClipboard(name, index)} className="text-white/60 group-hover:text-[#f9a825] transition-all">
                  {copiedIndex === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DYNAMIC ARTICLE SECTION */}
      {content && (
        <div className="max-w-4xl mx-auto mt-24 px-6 pb-24">
          <div className="mb-16 border-l-4 border-[#f9a825] pl-8">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">{content.title}</h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed max-w-2xl">{content.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {content.features?.map((f: any, i: number) => (
              <div key={i} className="p-8 bg-[#0d0d0d] border border-white/5 rounded-[32px] hover:border-[#f9a825]/30 transition-all group">
                <h3 className="text-[#f9a825] font-black uppercase text-[10px] tracking-[3px] mb-4 flex items-center gap-2">
                  <Sparkle size={12} /> {f.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-10">
              <HelpCircle className="text-[#f9a825]" size={32} />
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">F.A.Q</h3>
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

export default NameGenerator;