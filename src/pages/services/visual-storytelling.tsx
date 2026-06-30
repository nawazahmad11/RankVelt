import React, { useState } from 'react';

export default function VisualStorytellingService() {
    // FAQ Accordion state setup
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // FAQ Data Array for Visual Storytelling
    const faqs = [
        {
            q: "How does premium visual storytelling affect e-commerce conversions?",
            a: "High-ticket products cannot be sold using cheap, generic grids. Elite brands require context, immersive media layouts, and cinematic space. By presenting products like an editorial digital lookbook, we eliminate pricing resistance and multiply perceived value instantly."
        },
        {
            q: "Will heavy cinematic lookbooks or videos drag down my site speed?",
            a: "Not when engineered natively. Instead of using clunky apps that fetch scripts from slow servers, we embed raw compressed MP4s/WebMs and utilize advanced Shopify CDN srcsets. Videos are lazy-loaded dynamically, meaning they execute only when they enter the user's viewport."
        },
        {
            q: "Can we build interactive editorial hotspots on top of existing themes?",
            a: "Yes, completely. We build these as custom isolated schema blocks. You can inject an interactive image section anywhere via your standard Shopify Customizer, drop point nodes on specific pixels, and link individual items directly to instant side-cart drawers."
        },
        {
            q: "Do these immersive layouts scale perfectly on mobile screens?",
            a: "Absolutely. Editorial layouts must remain elegant on mobile. We fluidly restructure asymmetric grids into clean, swipeable parallax rows on mobile viewports so that the luxury perception remains uniform across all devices."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white font-sans selection:bg-amber-500 selection:text-black relative z-10">

            {/* 🛠️ NAVIGATION HEADER AREA */}
            <div className="w-full pt-[80px] md:pt-[90px] block relative z-20">
                <div className="max-w-7xl mx-auto px-6 py-5 border-b border-zinc-900/60 flex justify-between items-center bg-[#0b0b0c]">
                    
                    {/* Left Side: Back to Home link */}
                    <a 
                        href="/" 
                        className="flex items-center gap-2.5 group text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-xs font-semibold tracking-widest uppercase">
                            Back to Home
                        </span>
                    </a>

                    {/* Right Side: Status tag */}
                    <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/80 px-3 py-1.5 rounded-full shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-[11px] text-zinc-400 font-medium tracking-wider uppercase">
                            Aesthetic Audits Open
                        </span>
                    </div>

                </div>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-16 max-w-7xl mx-auto px-6">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-xs text-amber-500 font-medium tracking-wide uppercase mb-6 shadow-sm">
                        ✨ Editorial Brand Elevating & Layout Design
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                        Immersive <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">Visual Storytelling</span> Architecture
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
                        Cheap product configurations sell commodities; luxury layout presentation builds icons. I build high-end editorial layouts, immersive video flows, and custom micro-interactions tailored for high-ticket desirability.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="https://calendly.com/nawazbuilds-info/30min" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-center">
                            Elevate My Brand Presentation
                        </a>
                        <a href="#capabilities" className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium rounded-xl border border-zinc-800 transition-all duration-200 text-center">
                            See Editorial Assets
                        </a>
                    </div>
                </div>
            </section>

            {/* Layout Identity Grid */}
            <section className="py-16 bg-zinc-950 border-y border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-center text-xs text-zinc-500 font-bold tracking-widest uppercase mb-12">The Contrast: Boring Marketplace Grids vs Custom Luxury Space</h2>
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                        
                        {/* Box 1 */}
                        <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800/40 relative">
                            <h3 className="text-xl font-bold text-zinc-300 mb-4">Standard Template Rows</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500/80 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Commodity Feel:</strong> Stiff boxes and repetitive templates that look indistinguishable from standard low-tier dropshipping stores.</span>
                                </li>
                                <li className="flex items-start gap-3 text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500/80 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Flat Media Assets:</strong> Static layouts failing to communicate fabric density, premium texture detail, or luxury alignment.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-[#121214] p-8 rounded-2xl border border-amber-500/30 relative shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                            <h3 className="text-xl font-bold text-amber-500 mb-4">Elite Lookbook Frameworks</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-zinc-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Asymmetric Spatial Layout:</strong> Balancing deliberate premium whitespace, bespoke typography sets, and elegant grid sizing.</span>
                                </li>
                                <li className="flex items-start gap-3 text-zinc-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Micro-Shimmer Animations:</strong> Incorporating signature custom hover states, glowing image masks, and seamless fluid load reveals.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <section id="capabilities" className="py-20 max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">High-Fidelity Interaction Features</h2>
                    <p className="text-zinc-400">Capturing premium intent through absolute design focus.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[#121214] p-8 rounded-2xl border border-zinc-800/60 group">
                        <div className="text-2xl mb-4">🎞️</div>
                        <h3 className="text-xl font-bold mb-3">Cinematic Scroll-Reveals</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Full-bleed video-to-text transitions that follow touch sequences organically without introducing layout jitter.
                        </p>
                    </div>
                    <div className="bg-[#121214] p-8 rounded-2xl border border-zinc-800/60 group">
                        <div className="text-2xl mb-4">📍</div>
                        <h3 className="text-xl font-bold mb-3">Interactive Lookbook Hotspots</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Allowing clients to click directly on lifestyle editorial imagery nodes to reveal native side-drawer configurations instantly.
                        </p>
                    </div>
                    <div className="bg-[#121214] p-8 rounded-2xl border border-zinc-800/60 group">
                        <div className="text-2xl mb-4">🪄</div>
                        <h3 className="text-xl font-bold mb-3">Custom Material Shimmers</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Polished, premium skeleton loads and micro-interactions that mirror international high-fashion digital standards.
                        </p>
                    </div>
                </div>
            </section>

            {/* 🔗 DYNAMIC CASE STUDY HIGHLIGHT INSERTION (Kith Inspired Model) */}
            <section className="py-20 bg-zinc-950/80 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <div>
                            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">
                                Editorial Framework Case Study
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">
                                High-End Visual Evolution: Kith Inspired Editorial Layout
                            </h2>
                            <p className="text-zinc-400 mb-6 leading-relaxed text-[15px]">
                                Taking structural cues from premier multi-brand luxury experiences, we engineered an editorial storefront focused entirely on brand perception. By omitting standard boxed setups and relying on continuous fluid sections, the layout transforms commercial purchasing into an artful narrative sequence.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8 border-y border-zinc-900 py-6">
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-amber-500">Luxury Aura</div>
                                    <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">
                                        Design Benchmark
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-emerald-500">Zero App</div>
                                    <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">
                                        Bloat Overhead
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://www.nawazbuilds.com/case-studies/kith-store"
                                className="inline-flex items-center gap-2 text-zinc-300 hover:text-amber-500 font-medium group transition-colors duration-200 text-sm"
                            >
                                <span>Read Full Kith Store Case Study</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl relative group overflow-hidden shadow-2xl">
                            <div className="flex items-center gap-1.5 mb-3 px-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></span>
                                <span className="text-[11px] text-zinc-600 font-mono ml-2 tracking-tight">nawazbuilds.com/kith-store</span>
                            </div>

                            <div className="aspect-[16/11] bg-zinc-950 rounded-lg border border-zinc-800/80 relative overflow-hidden group-hover:border-amber-500/30 transition-colors duration-300">
                                <img
                                    src="/kith-inspired-case-study.webp"
                                    alt="Kith Layout Inspired Shopify Editorial Presentation"
                                    className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accordion FAQ Section */}
            <section className="py-20 max-w-3xl mx-auto px-6 border-t border-zinc-900">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="bg-[#121214]/60 rounded-xl border border-zinc-800/60 overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between p-5 text-left text-zinc-200 hover:text-white transition-colors duration-200 group focus:outline-none"
                                >
                                    <span className="text-[15px] font-semibold tracking-tight pr-4 group-hover:text-amber-500 transition-colors">
                                        {faq.q}
                                    </span>
                                    <span className={`flex-shrink-0 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : ""}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[300px] border-t border-zinc-900/50" : "max-h-0"}`}>
                                    <p className="p-5 text-zinc-400 text-[14px] leading-relaxed bg-[#0c0c0e]/40">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Panel */}
            <section className="py-16 bg-[#121214] border-t border-zinc-900 text-center relative overflow-hidden">
                <div className="max-w-2xl mx-auto px-6 relative">
                    <h2 className="text-3xl font-bold mb-4">Elevate Your Visual Authority</h2>
                    <p className="text-zinc-400 text-sm mb-8">
                        Stop blending into boring templates. Let’s collaborate to transform your high-ticket offerings into a cinematic, editorial digital environment that commands extreme value.
                    </p>
                    <a href="https://calendly.com/nawazbuilds-info/30min" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all">
                        <span>Schedule Digital Lookbook Strategic Call</span>
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-zinc-950 text-center border-t border-zinc-900 text-xs text-zinc-500">
                © {new Date().getFullYear()} Nawaz Builds. Design Engineering. All rights reserved.
            </footer>
        </div>
    );
}