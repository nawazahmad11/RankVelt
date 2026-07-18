import React, { useState } from 'react';

export default function ShopifyLiquidService() {
    // FAQ Accordion state setup
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // FAQ Data Array
    const faqs = [
        {
            q: "Why should I pay for custom Liquid instead of installing a free or cheap Shopify App?",
            a: "Every Shopify app you install adds 3rd party JS scripts to your store, slowing down your page load times. Apps also come with monthly subscriptions and are highly rigid. Custom Liquid is written natively in your code—meaning it has zero subscription cost and near-zero impact on page speed."
        },
        {
            q: "Will I still be able to use the Shopify Customizer panel easily?",
            a: "Yes, absolutely. I write modern schema configurations. Any custom section I code will have native settings block panels in your Shopify Admin, allowing you to edit text, upload images, select colors, and drag-and-drop sections easily."
        },
        {
            q: "How do you ensure custom code doesn't break during future theme updates?",
            a: "I avoid hacking core global stylesheets or structural templates. Everything is written as isolated custom sections or theme extensions. If you update your main theme file later, my custom Liquid sections will continue working safely."
        },
        {
            q: "What is your project turnaround time, and how do we communicate?",
            a: "Most premium theme enhancements are shipped within 7 to 14 days. For large-scale custom architecture builds, my baseline delivery is guaranteed within 30 days. We communicate directly via standard Slack, WhatsApp sync loops, or daily Loom update clips."
        },
        {
            q: "Can you fix broken core tracking scripts or pixel configurations?",
            a: "Yes. Along with custom frontend development, I audit and configure native server-side events, clean up dual-firing duplicate tracking, and properly calibrate Meta Pixel and Google Analytics (GA4) accuracy."
        },
        {
            q: "Do you sign NDAs (Non-Disclosure Agreements) before working?",
            a: "Yes. I frequently build pre-launch systems and custom features for elite internal operations. Your private business metrics, source files, and brand assets are kept strictly confidential."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white font-sans selection:bg-amber-500 selection:text-black relative z-10">

            {/* 🛠️ STEP 1: MAIN NAVIGATION HEADER AREA */}
            {/* Agar aapka global navbar framework layout se aa raha hai, toh yeh div uske niche automatic space (pt-24) create karega taake collision khatam ho jaye */}
            <div className="w-full pt-[80px] md:pt-[90px] block relative z-20">
                
                {/* 🛠️ STEP 2: INNER SUB-HEADER CONTROL STRIP */}
                {/* Yeh segment main header ke niche bina takraye ek saaf horizontal bar banayega */}
                <div className="max-w-7xl mx-auto px-6 py-5 border-b border-zinc-900/60 flex justify-between items-center bg-[#0b0b0c]">
                    
                    {/* Left Side: Back to Home arrow link */}
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

                    {/* Right Side: Status availability tag */}
                    <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/80 px-3 py-1.5 rounded-full shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[11px] text-zinc-400 font-medium tracking-wider uppercase">
                            Liquid Openings Available
                        </span>
                    </div>

                </div>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-16 max-w-7xl mx-auto px-6">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-xs text-amber-500 font-medium tracking-wide uppercase mb-6 shadow-sm">
                        ⚡ Custom Code Only • Zero App Dependancy
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                        Bespoke <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">Shopify Liquid</span> Development
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
                        Break free from bloated Shopify apps and rigid theme templates. I engineer lightning-fast custom Liquid solutions designed for extreme mobile conversions and high-volume scale.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="https://calendly.com/nawazbuilds-info/30min" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-center">
                            Book Free Strategy Call
                        </a>
                        <a href="#solutions" className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium rounded-xl border border-zinc-800 transition-all duration-200 text-center">
                            Explore Custom Capabilities
                        </a>
                    </div>
                </div>
            </section>

            {/* Pain Points vs Custom Code Grid */}
            <section className="py-16 bg-zinc-950 border-y border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-center text-xs text-zinc-500 font-bold tracking-widest uppercase mb-12">The Reality: Rigid Themes vs Custom Liquid Code</h2>
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                        {/* Rigid Themes */}
                        <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800/40 relative">
                            <div className="absolute top-4 right-4 text-red-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-300 mb-4">Standard Off-The-Shelf Themes</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500/80 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Heavy App Bloat:</strong> Adding page-builders or upsell apps destroys site speed and mobile loading scores.</span>
                                </li>
                                <li className="flex items-start gap-3 text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500/80 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Generic UX/UI:</strong> Standard sections that look like every other competitor store, causing weak conversion rates.</span>
                                </li>
                                <li className="flex items-start gap-3 text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500/80 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Hardcoded Limits:</strong> Incapable of displaying custom product data fields or complex bundle mechanisms without external apps.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Custom Code */}
                        <div className="bg-[#121214] p-8 rounded-2xl border border-amber-500/30 relative shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                            <div className="absolute top-4 right-4 text-amber-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-amber-500 mb-4">My Custom Liquid Solutions</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-zinc-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Native Speed (95+):</strong> Tailored script architecture ensuring raw CSS/JS assets are compressed directly within Liquid core.</span>
                                </li>
                                <li className="flex items-start gap-3 text-zinc-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Unique Visual Identity:</strong> High-ticket custom layout components built on top of Dawn or custom headless bases.</span>
                                </li>
                                <li className="flex items-start gap-3 text-zinc-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span><strong>Dynamic Metafields:</strong> Deep integration of Shopify 2.0 schema, block controls, and nested API metafield architecture.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Custom Capabilities */}
            <section id="solutions" className="py-20 max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What Custom Liquid Code Can Unleash</h2>
                    <p className="text-zinc-400">Stop paying monthly app subscriptions. I build custom, fully manageable features natively in your Shopify dashboard.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-[#121214] p-8 rounded-2xl border border-zinc-800/60 hover:border-amber-500/50 transition-all duration-300 group">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Custom Theme Sections</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Drag-and-drop schema sections built exactly to your Figma file requirements. Easy to manage for your team directly from the Shopify customizer.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#121214] p-8 rounded-2xl border border-zinc-800/60 hover:border-amber-500/50 transition-all duration-300 group">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Dynamic Product Visualizers</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Custom color swatches, dynamic bundle builders, interactive visual upsells, and size charts designed flawlessly within Liquid scope.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#121214] p-8 rounded-2xl border border-zinc-800/60 hover:border-amber-500/50 transition-all duration-300 group">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Performance Engineering</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Refactoring bloated themes, deferring non-essential scripts, restructuring asset loading pipelines, and converting heavy apps to native Liquid code.
                        </p>
                    </div>
                </div>
            </section>

            {/* Case Study Feature Highlight */}
            <section className="py-20 bg-zinc-950/80 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <div>
                            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">
                                Liquid Spotlight Case Study
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">
                                Turning a Gallery into a Lead Generation Engine: Saha Garden
                            </h2>
                            <p className="text-zinc-400 mb-6 leading-relaxed text-[15px]">
                                Saha Garden had beautiful work, but their store functioned like a static gallery rather than a business tool. By writing custom Liquid architecture natively into the core layout, I eliminated slow page loads from unoptimized images and engineered a seamless, zero-friction path from interest to inquiry.
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-8 border-y border-zinc-900 py-6">
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-amber-500">+120%</div>
                                    <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">
                                        Bookings & Quotes
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-emerald-500">3.8%</div>
                                    <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">
                                        Conversion Rate
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-white">92%</div>
                                    <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">
                                        Client Retention
                                    </div>
                                </div>
                            </div>

                            <a
                                href="/case-studies/Saha"
                                className="inline-flex items-center gap-2 text-zinc-300 hover:text-amber-500 font-medium group transition-colors duration-200 text-sm"
                            >
                                <span>Read Full Saha Garden Case Study</span>
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
                                <span className="text-[11px] text-zinc-600 font-mono ml-2 tracking-tight">rankvelt.preview/saha</span>
                            </div>

                            <div className="aspect-[16/11] bg-zinc-950 rounded-lg border border-zinc-800/80 relative overflow-hidden group-hover:border-amber-500/30 transition-colors duration-300">
                                <img
                                    src="/saha-garden-cover-shopify-store.webp"
                                    alt="Saha Garden Designer Planters UX Interface"
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
                    <p className="text-zinc-400 text-sm">Everything you need to know about custom Liquid work and scaling your Shopify store.</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className="bg-[#121214]/60 rounded-xl border border-zinc-800/60 overflow-hidden transition-all duration-200"
                            >
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

                                <div 
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                        isOpen ? "max-h-[300px] border-t border-zinc-900/50" : "max-h-0"
                                    }`}
                                >
                                    <p className="p-5 text-zinc-400 text-[14px] leading-relaxed bg-[#0c0c0e]/40">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Call to Action Booking Panel */}
            <section className="py-16 bg-[#121214] border-t border-zinc-900 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none"></div>
                <div className="max-w-2xl mx-auto px-6 relative">
                    <h2 className="text-3xl font-bold mb-4">Let's Unlock Your Store's True Potential</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                        Tell me about the custom features or speed blocks you are currently struggling with. We'll outline a direct conversion-focused solution in a free 30-minute discovery call.
                    </p>
                    <a href="https://calendly.com/nawazbuilds-info/30min" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                        <span>Book Your Free Strategy Call</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </a>
                    <p className="text-xs text-zinc-500 tracking-wider font-semibold uppercase mt-4">⚡ No obligation • Response within 24 hours</p>
                </div>
            </section>

            {/* Small Footer */}
            <footer className="py-8 bg-zinc-950 text-center border-t border-zinc-900 text-xs text-zinc-500">
                © {new Date().getFullYear()} Nawaz Builds. Custom engineered Shopify experiences. All rights reserved.
            </footer>
        </div>
    );
}