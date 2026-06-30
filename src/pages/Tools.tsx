// import { useState, useRef, useEffect } from "react";
// import { useSearchParams } from "react-router-dom"; // URL parameters handle karne ke liye
// import { 
//   ShoppingBag, Layout, Calculator, ShieldCheck
// } from "lucide-react";
// import NameGenerator from "../components/Tools/NameGenerator";
// import ThemeDetector from "../components/Tools/ThemeDetector"; 
// import ProfitCalculator from "../components/Tools/ProfitCalculator"; 
// import PolicyGenerator from "../components/Tools/PolicyGenerator";

// const ToolsPage = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [activeTool, setActiveTool] = useState("generator"); 
//   const generatorRef = useRef<HTMLDivElement>(null);

//   // --- URL Logic: Check for requested tool on load or URL change ---
//   useEffect(() => {
//     const requestedTool = searchParams.get("tool");
    
//     if (requestedTool) {
//       // Check if the tool exists in our set
//       const validTools = ["calculator", "policy", "detector", "generator"];
//       if (validTools.includes(requestedTool)) {
//         setActiveTool(requestedTool);
        
//         // Give UI a moment to render then scroll
//         setTimeout(() => {
//           generatorRef.current?.scrollIntoView({ 
//             behavior: "smooth", 
//             block: "start" 
//           });
//         }, 300);
//       }
//     }
//   }, [searchParams]);

//   const allTools = [
//     {
//       title: "Profit Margin Cal",
//       desc: "Calculate net profit, margins, and ROI for your shop.",
//       icon: <Calculator className="w-5 h-5 text-yellow-500" />,
//       toolType: "calculator", 
//       status: "Live"
//     },
//     {
//       title: "Legal Policy Gen",
//       desc: "Generate custom Privacy, Refund, and Terms pages.",
//       icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
//       toolType: "policy", 
//       status: "Live"
//     },
//     {
//       title: "Shopify Theme Detector",
//       desc: "Identify any Shopify theme and its apps instantly.",
//       icon: <Layout className="w-5 h-5 text-blue-400" />,
//       toolType: "detector", 
//       status: "Live"
//     },
//     {
//       title: "Shopify Name Gen",
//       desc: "Premium brandable names for all types of Shopify stores.",
//       icon: <ShoppingBag className="w-5 h-5 text-[#f9a825] shadow-[0_0_10px_rgba(249,168,37,0.3)]" />,
//       toolType: "generator",
//       status: "Live"
//     }
//   ];

//   const handleToolClick = (toolType: string) => {
//     // URL update karein baghair page refresh kiye
//     setSearchParams({ tool: toolType });
//     setActiveTool(toolType);
    
//     // Scroll to the tool
//     setTimeout(() => {
//       generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 100);
//   };

//   const renderActiveTool = () => {
//     switch(activeTool) {
//       case "detector": return <ThemeDetector />;
//       case "calculator": return <ProfitCalculator />;
//       case "policy": return <PolicyGenerator />;
//       default: return <NameGenerator />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header Section */}
//         <div className="mb-16 text-center lg:text-left">
//           <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase">
//             E-commerce <span className="text-[#f9a825]">Growth Engine</span>
//           </h1>
//           <p className="text-white/60 max-w-2xl text-lg leading-relaxed font-medium">
//             Professional tools designed for Shopify architects and brand owners. 
//             Analyze margins, detect themes, and generate viral brand names.
//           </p>
//         </div>

//         {/* Dynamic Active Tool Section */}
//         <section ref={generatorRef} className="mb-24 scroll-mt-32 min-h-[600px]">
//           <div className="w-full h-full transition-all duration-500 ease-in-out">
//             {renderActiveTool()}
//           </div>
//         </section>

//         {/* Full Tools Grid Selector */}
//         <div className="mt-28">
//           <div className="flex items-center gap-4 mb-10">
//             <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Core Intelligence Tools</h3>
//             <div className="h-[1px] flex-1 bg-white/5"></div>
//           </div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {allTools.map((tool, index) => (
//               <div 
//                 key={index}
//                 onClick={() => handleToolClick(tool.toolType)}
//                 className={`
//                   group p-6 bg-[#0a0a0a] border rounded-3xl transition-all duration-300 cursor-pointer
//                   ${activeTool === tool.toolType 
//                     ? "border-[#f9a825] bg-[#f9a825]/5" 
//                     : "border-white/5 hover:border-[#f9a825]/30 hover:bg-white/[0.02]"}
//                 `}
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#f9a825]/20 transition-colors">
//                     {tool.icon}
//                   </div>
//                   <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#f9a825] text-black">
//                     {tool.status}
//                   </span>
//                 </div>
                
//                 <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#f9a825] transition-colors uppercase tracking-tight">
//                   {tool.title}
//                 </h4>
//                 <p className="text-xs text-white/30 leading-relaxed font-medium">
//                   {tool.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ToolsPage;




import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom"; // useParams aur useNavigate add kiya
import { 
  ShoppingBag, Layout, Calculator, ShieldCheck
} from "lucide-react";
import NameGenerator from "../components/Tools/NameGenerator";
import ThemeDetector from "../components/Tools/ThemeDetector"; 
import ProfitCalculator from "../components/Tools/ProfitCalculator"; 
import PolicyGenerator from "../components/Tools/PolicyGenerator";

const ToolsPage = () => {
  const { toolName } = useParams(); // SEO Friendly URL slug (/tools/profit-margin-calculator)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [activeTool, setActiveTool] = useState("generator"); 
  const generatorRef = useRef<HTMLDivElement>(null);

  // Mapping Table: URL Slug ko Component ID se jorna
  const toolMapping: Record<string, string> = {
    "profit-margin-calculator": "calculator",
    "legal-policy-generator": "policy",
    "shopify-theme-detector": "detector",
    "business-name-generator": "generator",
    // Purani support ke liye (Agar koi purane ?tool=calculator link se aaye)
    "calculator": "calculator",
    "policy": "policy",
    "detector": "detector",
    "generator": "generator"
  };

  // --- Logic: Check for requested tool on load or URL change ---
  useEffect(() => {
    // Pehle path check karein (/tools/:toolName), phir query check karein (?tool=)
    const rawTool = toolName || searchParams.get("tool");
    const requestedTool = rawTool ? toolMapping[rawTool] : null;
    
    if (requestedTool) {
      setActiveTool(requestedTool);
      
      setTimeout(() => {
        generatorRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }, 300);
    }
  }, [toolName, searchParams]); // toolName change hone par bhi chalay ga

  const allTools = [
    {
      title: "Profit Margin Cal",
      desc: "Calculate net profit, margins, and ROI for your shop.",
      icon: <Calculator className="w-5 h-5 text-yellow-500" />,
      toolType: "calculator", 
      slug: "profit-margin-calculator", // SEO Friendly Slug
      status: "Live"
    },
    {
      title: "Legal Policy Gen",
      desc: "Generate custom Privacy, Refund, and Terms pages.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      toolType: "policy", 
      slug: "legal-policy-generator",
      status: "Live"
    },
    {
      title: "Shopify Theme Detector",
      desc: "Identify any Shopify theme and its apps instantly.",
      icon: <Layout className="w-5 h-5 text-blue-400" />,
      toolType: "detector", 
      slug: "theme-detector",
      status: "Live"
    },
    {
      title: "Shopify Name Gen",
      desc: "Premium brandable names for all types of Shopify stores.",
      icon: <ShoppingBag className="w-5 h-5 text-[#f9a825] shadow-[0_0_10px_rgba(249,168,37,0.3)]" />,
      toolType: "generator",
      slug: "business-name-generator",
      status: "Live"
    }
  ];

  const handleToolClick = (slug: string, toolType: string) => {
    // Ab URL ko ?tool= ki jagah /tools/slug par bhejien ge
    navigate(`/tools/${slug}`);
    setActiveTool(toolType);
    
    setTimeout(() => {
      generatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const renderActiveTool = () => {
    switch(activeTool) {
      case "detector": return <ThemeDetector />;
      case "calculator": return <ProfitCalculator />;
      case "policy": return <PolicyGenerator />;
      default: return <NameGenerator />;
    }
  };

  return (
    // <div className="min-h-screen bg-[#050505] items-center justify-center pt-40 pb-20 px-6">
    //   <div className="max-w-7xl mx-auto">

      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6">
      <div className="max-w-7xl w-full text-center">
        
        {/* Header Section - mt-20 ya mt-32 se ye thora nichay ho jayega */}
        <div className="mb-12 text-center mt-48"> 
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase">
            E-commerce <span className="text-[#f9a825]">Growth Engine</span>
          </h1>
          
          {/* mx-auto add kiya hai taake paragraph center ho jaye */}
          <p className="text-white/60 max-w-2xl text-lg leading-relaxed font-medium mx-auto">
            Professional tools designed for Shopify architects and brand owners. 
            Analyze margins, detect themes, and generate viral brand names.
          </p>
        </div>

        {/* Dynamic Active Tool Section */}
        <section ref={generatorRef} className="mb-24 scroll-mt-32 min-h-[600px]">
          <div className="w-full h-full transition-all duration-500 ease-in-out">
            {renderActiveTool()}
          </div>
        </section>

        {/* Full Tools Grid Selector */}
        <div className="mt-28">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Core Intelligence Tools</h3>
            <div className="h-[1px] flex-1 bg-white/5"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allTools.map((tool, index) => (
              <div 
                key={index}
                onClick={() => handleToolClick(tool.slug, tool.toolType)}
                className={`
                  group p-6 bg-[#0a0a0a] border rounded-3xl transition-all duration-300 cursor-pointer
                  ${activeTool === tool.toolType 
                    ? "border-[#f9a825] bg-[#f9a825]/5" 
                    : "border-white/5 hover:border-[#f9a825]/30 hover:bg-white/[0.02]"}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#f9a825]/20 transition-colors">
                    {tool.icon}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#f9a825] text-black">
                    {tool.status}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#f9a825] transition-colors uppercase tracking-tight">
                  {tool.title}
                </h4>
                <p className="text-xs text-white/30 leading-relaxed font-medium">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;