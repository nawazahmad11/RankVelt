import React, { useState } from 'react';

export default function AppApiSyncService() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "Will custom API webhooks bypass standard Shopify rate limits?",
            a: "Yes. By deploying a headless translation layer or middleware workers (like Cloudflare Workers), we queue heavy web requests. This prevents inventory drops from hitting Shopify's concurrent connection ceilings during high-volume drops."
        },
        {
            q: "Can we sync specialized ERP inventory systems natively?",
            a: "Absolutely. I code dedicated private Shopify apps and sync webhooks that speak directly with your warehouse, ERP, or legacy database systems, completely maintaining real-time multi-location counts without subscription dependencies."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0b0c] text-white font-sans selection:bg-amber-500 selection:text-black relative z-10">
            {/* Navigation Header */}
            <div className="w-full pt-[80px] md:pt-[90px] block relative z-20">
                <div className="max-w-7xl mx-auto px-6 py-5 border-b border-zinc-900/60 flex justify-between items-center bg-[#0b0b0c]">
                    <a href="/" className="flex items-center gap-2.5 group text-zinc-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-xs font-semibold tracking-widest uppercase">Back to Home</span>
                    </a>
                    <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-[11px] text-zinc-400 font-medium tracking-wider uppercase">Backend Integrations Active</span>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden pt-16 pb-16 max-w-7xl mx-auto px-6">
                <div className="relative text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-amber-500 font-medium tracking-wide uppercase mb-6">
                        🔄 Real-time Infrastructure & Data Synchronization
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                        Bulletproof <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">App & API Sync</span> Solutions
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                        Eliminate stock discrepancies and broken warehouse webhooks. I architect direct, custom API nodes and seamless data pathways to link your Shopify architecture to external modern ecosystems.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="https://calendly.com/nawazbuilds-info/30min" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl shadow-lg transition-all">
                            Connect My Ecosystem
                        </a>
                    </div>
                </div>
            </section>

            {/* Case Study Featurette */}
            <section className="py-20 bg-zinc-950/80 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <div>
                            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-3">Featured Infrastructure Case Study</div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">District99 Operations Scaling</h2>
                            <p className="text-zinc-400 mb-6 leading-relaxed text-[15px]">
                                Realized zero lag operations for high-volume catalogs. By executing secure endpoint routines and optimizing data collection, we successfully unified their multi-source logistics channels right into Shopify's database.
                            </p>
                            <a href="https://www.nawazbuilds.com/case-studies/District99" className="inline-flex items-center gap-2 text-zinc-300 hover:text-amber-500 font-medium group transition-colors text-sm">
                                <span>Explore District99 Integration Schema</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl relative">
                            <div className="aspect-[16/11] bg-zinc-950 rounded-lg border border-zinc-800/80 overflow-hidden">
                                <div className="p-4 font-mono text-xs text-zinc-500">{"// API Connection established..."} <br/> <span className="text-emerald-500">STATUS: 200 OK</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-20 max-w-3xl mx-auto px-6 border-t border-zinc-900">
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-[#121214]/60 rounded-xl border border-zinc-800/60 overflow-hidden">
                            <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left text-zinc-200 hover:text-white transition-colors">
                                <span className="text-[15px] font-semibold">{faq.q}</span>
                            </button>
                            {openIndex === index && <p className="p-5 text-zinc-400 text-[14px] leading-relaxed border-t border-zinc-900/50">{faq.a}</p>}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}