import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Search, ArrowUpRight, 
    Plus, 
    Instagram, 
    User, 
    Heart, 
    ChevronLeft, 
    ChevronRight, 
    ChevronDown, // Yeh add karein
    ChevronUp,   // Yeh add karein
    Truck, 
    RotateCcw, 
    BadgePercent, 
    Headphones, 
    Star, 
    ArrowRight, 
    Clock, 
    Leaf, 
    ShieldCheck, 
    Facebook, 
    Twitter, 
    Youtube 
 } from "lucide-react";


    
  
import { caseStudies } from "../data/caseStudyData";

import React, { useState, useEffect } from 'react';

    // --- 1. District 99 STUDIO DESIGN (STREETWEAR) ---
    const AurexStore = ({ s }: { s: any }) => {
    return (
        <div className="bg-[#050505] text-white font-mono selection:bg-[#E11D48]">
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50 border-b border-white/5">
            <span className="text-sm font-black tracking-tighter text-[#E11D48]">District99</span>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-60">
            <span className="hover:text-[#E11D48] cursor-pointer">Shop</span>
            <span className="hover:text-[#E11D48] cursor-pointer">Story</span>
            <ShoppingBag size={14} className="hover:text-[#E11D48] cursor-pointer" />
            </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[650px] flex items-center justify-center text-center px-6 overflow-hidden">
            <img src={s.hero.backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            <div className="relative z-10">
            <h2 className="text-7xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter mb-10 drop-shadow-2xl" 
                dangerouslySetInnerHTML={{__html: s.hero.headline}} />
            <button className="px-12 py-4 bg-[#E11D48] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:scale-110 transition-transform active:scale-95">
                {s.hero.cta}
            </button>
            </div>
        </section>

        {/* Glow Stats Bar */}
        <div className="flex justify-center gap-10 py-6 border-y border-white/10 bg-[#050505] text-[10px] uppercase tracking-[0.3em] font-bold text-white/60">
        <div className="hover:text-[#E11D48] transition">🔥 24 Orders Today</div>
        <div className="hover:text-[#E11D48] transition">👁 1.2K Viewing</div>
        <div className="hover:text-[#E11D48] transition">⚡ New Drop Active</div>
        <div className="hover:text-[#E11D48] transition">📦 Limited Stock</div>
        </div>

        {/* Infinite Marquee */}
        <div className="bg-[#E11D48] py-4 overflow-hidden flex border-y border-black/10">
            <style>
            {`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}
            </style>
            <div className="flex whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite', width: 'max-content' }}>
            {[1, 2, 3, 4].map((i) => (
                <span key={i} className="text-[10px] font-black uppercase tracking-[0.5em] px-10 text-black">
                {s.marqueeText}
                </span>
            ))}
            </div>
        </div>

        {/* Featured Grid */}
        <section className="py-24 px-10">
            <div className="flex justify-between items-end mb-16">
            <h3 className="text-4xl font-black uppercase tracking-tighter">New Arrivals</h3>
            <span className="text-[10px] font-bold border-b border-[#E11D48] pb-1 cursor-pointer hover:text-[#E11D48]">View All Collections</span>
            </div>
            <div className="grid grid-cols-2 gap-10">
            {s.products.map((p: any, i: number) => (
                <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-white/[0.03] rounded-[2rem] overflow-hidden border border-white/5 mb-6">
                    <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={p.name} />
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div> */}
                    <Plus size={18} />
                    </div>
                </div>
                <div className="flex justify-between items-start px-2">
                    <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest">{p.name}</h4>
                    <p className="text-[10px] text-white/30 uppercase mt-1">Limited Release</p>
                    </div>
                    <span className="text-sm font-black text-[#E11D48]">{p.price}</span>
                </div>
                </div>
            ))}
            </div>
        </section>

        <section className="py-28 px-10 text-center border-t border-white/10">
  
  <h2 className="text-5xl font-black uppercase tracking-tighter mb-6">
    Built for the Streets.<br/>Refined for the World.
  </h2>

  <p className="max-w-xl mx-auto text-[11px] uppercase tracking-[0.3em] leading-relaxed text-white/50">
    District99 is not just clothing. It is a movement shaped by underground culture, limited drops, and raw expression.
  </p>

  <div className="mt-10 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-white/30">
    <span>DESIGN LED</span>
    <span>DROP CULTURE</span>
    <span>LIMITED RUNS</span>
  </div>

</section>

            {/* --- NAYA SECTION: WHITE SPACE WITH BLACK TEXT --- */}
            <section className="bg-white text-black relative">
                {/* --- ADDED: TOP BLACK GRADIENT OVERLAY (VIGNETTE) --- */}
                <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-t from-transparent to-[#050505] z-10 pointer-events-none"></div>
                {/* --------------------------------------------------- */}

                <div className="relative py-32 px-10 flex flex-col items-center justify-center text-center z-20">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                        More Than <br/> Just Clothing.
                    </h2>
                    <p className="max-w-md text-xs font-bold uppercase tracking-[0.2em] leading-relaxed opacity-70">
                        District 99 is a movement rooted in the streets. We blend high-end aesthetics with raw urban culture. Every drop is limited, every piece is a statement.
                    </p>
                    <div className="mt-10 h-20 w-[1px] bg-black/20"></div> {/* Vertical line */}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div>
            </section>


        {/* Footer */}
        <footer className="p-10 border-t border-white/5 text-center">
            <div className="flex justify-center gap-6 mb-8 opacity-40">
            <Instagram size={18} className="hover:text-[#E11D48] cursor-pointer" />
            <span className="text-[10px] font-black uppercase">Twitter</span>
            <span className="text-[10px] font-black uppercase">Facebook</span>
            </div>
            <p className="text-[9px] uppercase tracking-[0.5em] opacity-20">© 2026 District99 — Built by Nawaz</p>
        </footer>
        </div>
    );
    };

    // --- 2. URBAN THREADS DESIGN (MINIMAL CLOTHING) ---
    const ClothingStore = ({ s }: { s: any }) => {
        return (
        <div className="bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* 1. Full Header with Menu */}
            <nav className="px-10 py-6 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-[60] border-b border-gray-100">
            <span className="text-xl font-bold tracking-tighter uppercase">Urban Threads</span>
            <div className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="hover:opacity-50 cursor-pointer transition-opacity">Shop All</span>
                <span className="hover:opacity-50 cursor-pointer transition-opacity">New Arrivals</span>
                <span className="hover:opacity-50 cursor-pointer transition-opacity">Our Story</span>
                <span className="hover:opacity-50 cursor-pointer transition-opacity">Contact</span>
            </div>
            <div className="flex gap-6 items-center">
                <Search size={18} className="cursor-pointer" />
                <div className="relative cursor-pointer">
                <ShoppingBag size={18} />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </div>
            </div>
            </nav>
    
            {/* LIVE ACTIVITY BAR */}
            <div className="bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold flex justify-center gap-10 py-3">
            <span>🔥 32 People Viewing</span>
            <span>⚡ New Drop Live</span>
            <span>📦 Ships in 24h</span>
            </div>

            {/* 2. Main Product Section */}
            <div className="grid grid-cols-12 gap-0 border-b border-gray-100">

                {/* TRUST BADGES */}
                <div className="col-span-12 flex justify-center gap-12 py-4 border-b border-gray-100 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
                <span>✔ Premium Fabric</span>
                <span>✔ Fast Shipping</span>
                <span>✔ Easy Returns</span>
                <span>✔ Secure Checkout</span>
                </div>

            {/* Left: Product Media */}
            <div className="col-span-7 border-r border-gray-100 p-8">
                {/* Main Large Image */}
                <div className="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden mb-4">
                <img src={s.hero.backgroundImage} className="w-full h-full object-cover" alt="Main Product" />
                </div>
                {/* Small Relavent Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                    {s.varients.map((p: any, i: number) => (
                    <div key={i} className="aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:ring-1 ring-black transition-all">
                    <img src={p.image} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                    </div>
                        ))}
                
                </div>
            </div>
    
            {/* Right: Sticky Info Box */}
            <div className="col-span-5 relative">
                <div className="sticky top-[90px] p-12">
                <div className="mb-10">
                    <div className="flex justify-between items-start mb-4">
                    <h1 className="text-4xl font-bold uppercase tracking-tighter leading-none">
                        Heavyweight<br/>Boxy Tee
                    </h1>
                    </div>
                    <span className="text-2xl font-medium">$45.00</span>

                    {/* MINI SOCIAL PROOF */}
                    <div className="flex items-center gap-2 mt-2 text-[10px] uppercase tracking-widest text-gray-400">
                    <span>⭐ 4.9 Rating</span>
                    <span>•</span>
                    <span>1200+ Sold</span>
                    <span>•</span>
                    <span>Trending Item</span>
                    </div>

                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2">
                        Only 6 pieces left in stock
                        </p>

                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Collection 001/26 — Essentials</p>
                </div>
    
                {/* Selection Options */}
                <div className="space-y-8 mb-10">
                    {/* Colors */}
                    <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4">Color — Carbon Black</p>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-black ring-2 ring-offset-2 ring-black cursor-pointer"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-300 cursor-pointer"></div>
                        <div className="w-6 h-6 rounded-full bg-[#E5D3B3] cursor-pointer"></div>
                    </div>
                    </div>
    
                    {/* Sizes */}
                    <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span>Select Size</span>
                        <span className="underline cursor-pointer">Size Guide</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {['S', 'M', 'L', 'XL'].map((sz) => (
                        <button key={sz} className="border border-gray-200 py-3 text-[11px] font-bold hover:bg-black hover:text-white transition-all">
                            {sz}
                        </button>
                        ))}
                    </div>
                    </div>
                </div>
    
                <button className="w-full bg-black text-white py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all mb-8">
                    Add to Cart
                </button>
    
                {/* Product Details Accordion */}
                <div className="border-t border-gray-100 pt-8 space-y-6">
                    <div className="group cursor-pointer">
                    <p className="text-[10px] font-bold uppercase tracking-widest flex justify-between items-center">
                        Description <Plus size={14} />
                    </p>
                    <p className="text-[11px] text-gray-500 mt-4 leading-relaxed uppercase">
                        A premium heavyweight tee featuring a boxy, relaxed fit. Crafted from 300GSM organic cotton for ultimate durability and comfort.
                    </p>
                    </div>
                    <div className="border-t border-gray-100 pt-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest flex justify-between items-center opacity-30">
                        Shipping & Returns <Plus size={14} />
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>


            <section className="bg-white text-black relative overflow-hidden">
                {/* TOP VIGNETTE */}
                {/* <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none"></div> */}

                <div className="relative py-32 px-10 flex flex-col items-center justify-center text-center z-20">
                    
                    {/* Total Reviews Header */}
                    <div className="mb-16">
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={16} fill="black" />
                            ))}
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            340+ REVIEWS
                        </h2>
                        <p className="text-[10px] font-bold tracking-[0.3em] opacity-50 mt-2">TRUSTED BY THE STREETS</p>
                    </div>

                    {/* Reviews Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full text-left">
                        {[
                            { name: "James R.", text: "The heavy-weight fabric on the oversized tee is insane. Best drop so far." },
                            { name: "Marcus V.", text: "Finally a brand that gets the boxy fit right. The stitching is high-end." },
                            { name: "Liam K.", text: "The graphics don't fade after wash. Streetwear quality at its peak." },
                            { name: "Ethan Hunt", text: "Fast shipping and the shirt fits like a dream. Definitely copping more." }
                        ].map((review, idx) => (
                            <div key={idx} className="border-l-2 border-black/10 pl-6">
                                <div className="flex gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} fill="black" />)}
                                </div>
                                <p className="text-sm font-bold uppercase tracking-tight mb-2">"{review.text}"</p>
                                <span className="text-[10px] font-black opacity-40">— {review.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Navigation / Control Icons */}
                    <div className="mt-16 flex items-center gap-8">
                        <ChevronLeft size={24} className="opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
                        <div className="h-[1px] w-20 bg-black/10"></div>
                        <ChevronRight size={24} className="opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
                    </div>
                </div>

                {/* BOTTOM VIGNETTE */}
                {/* <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div> */}
            </section>


            {/* 3. Related Products Section */}
            <section className="px-10 py-24 bg-gray-50/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-12 text-center text-gray-400">You Might Also Like</p>
            <div className="grid grid-cols-4 gap-8">
                {s.products.map((p: any, i: number) => (
                <div key={i} className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-white overflow-hidden rounded-xl mb-4 relative">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest">{p.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">{p.price}</p>
                </div>
                ))}
            </div>
            </section>
    

            {/* 4. Complete Footer */}
            <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-10">
            <div className="grid grid-cols-4 gap-12 mb-20">
                <div className="col-span-1">
                <h3 className="text-lg font-bold uppercase tracking-tighter mb-6">Urban Threads</h3>
                <p className="text-[10px] text-gray-400 uppercase leading-relaxed tracking-widest">
                    Redefining street style through minimal design and premium quality.
                </p>
                </div>
                <div>
                <p className="text-[11px] font-bold uppercase mb-6">Shop</p>
                <ul className="text-[10px] text-gray-400 uppercase space-y-3 tracking-widest">
                    <li className="hover:text-black cursor-pointer">All Products</li>
                    <li className="hover:text-black cursor-pointer">Featured</li>
                    <li className="hover:text-black cursor-pointer">Sale</li>
                </ul>
                </div>
                <div>
                <p className="text-[11px] font-bold uppercase mb-6">Support</p>
                <ul className="text-[10px] text-gray-400 uppercase space-y-3 tracking-widest">
                    <li className="hover:text-black cursor-pointer">Shipping</li>
                    <li className="hover:text-black cursor-pointer">Returns</li>
                    <li className="hover:text-black cursor-pointer">FAQ</li>
                </ul>
                </div>
                <div>
                <p className="text-[11px] font-bold uppercase mb-6">Connect</p>
                <div className="flex gap-4">
                    <Instagram size={18} className="cursor-pointer hover:opacity-50" />
                    <span className="text-[10px] font-bold uppercase cursor-pointer hover:opacity-50">Twitter</span>
                </div>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-10 flex justify-between items-center">
                <p className="text-[9px] text-gray-300 uppercase tracking-[0.3em]">© 2026 Urban Threads. Developed by Nawaz Builds.</p>
                <div className="flex gap-6 opacity-20">
                <div className="w-8 h-5 bg-gray-400 rounded-sm"></div>
                <div className="w-8 h-5 bg-gray-400 rounded-sm"></div>
                </div>
            </div>
            </footer>
        </div>
        );
    };

   // --- 3. LUMINA GEMS (FRONT PAGE - WHITE THEME) ---
//    const JewelryStore = ({ s }: { s: any }) => {
//      const [currentSlide, setCurrentSlide] = useState(0);
   
//      const slides = [
//        {
//          title: "Rubans Modern Minimal Ring Hoop Earrings",
//          subtitle: "Awesome products for the dynamic urban lifestyle",
//          img: "/lumina-gems-necklace-shopify-store.webp"
//        },
//        {
//          title: "Timeless Diamond Engagement Collections",
//          subtitle: "Luxury redefined for your special moments",
//          img: "/lumina-gems-shopify-store.webp"
//        }
//      ];
   
//      useEffect(() => {
//        const timer = setInterval(() => {
//          setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//        }, 5000);
//        return () => clearInterval(timer);
//      }, []);
   
//      return (
//        <div className="bg-white text-[#1a1a1a] font-sans selection:bg-[#c4a484] selection:text-white">
         
//          {/* 1. Header (Logo Left, Menu Center, Icons Right) */}
//          <nav className="px-10 py-5 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-[100] border-b border-gray-100">
//            <div className="text-2xl font-black tracking-tighter">Lumina Gems</div>
           
//            <div className="hidden lg:flex gap-8 text-[11px] font-bold uppercase tracking-widest">
//              <span className="text-[#c4a484] cursor-pointer">Home</span>
//              <div className="group relative cursor-pointer">SHOP <span className="text-[8px]">▼</span></div>
//              <span className="hover:text-[#c4a484] cursor-pointer transition-colors">Collections</span>
//              <span className="hover:text-[#c4a484] cursor-pointer transition-colors">Necklaces</span>
//              <span className="hover:text-[#c4a484] cursor-pointer transition-colors">More</span>
//            </div>
   
//            <div className="flex gap-5 items-center">
//              <Search size={20} strokeWidth={1.5} className="cursor-pointer hover:text-[#c4a484]" />
//              <User size={20} strokeWidth={1.5} className="cursor-pointer hover:text-[#c4a484]" />
//              <div className="relative cursor-pointer group">
//                <Heart size={20} strokeWidth={1.5} />
//                <span className="absolute -top-1 -right-1 bg-[#c4a484] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
//              </div>
//              <div className="relative cursor-pointer group">
//                <ShoppingBag size={20} strokeWidth={1.5} />
//                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">1</span>
//              </div>
//            </div>
//          </nav>
         
   
//          {/* 2. Hero Slider (Appear/Disappear Effect) */}
   
//             <section className="relative h-[750px] bg-[#fdfaf7] overflow-hidden flex items-center">
//             {slides.map((slide, index) => (
//                 <div 
//                 key={index}
//                 className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-between px-20 ${
//                     index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
//                 }`}
//                 >
//                 {/* Left Content: Text */}
//                 <div className="w-[55%] pr-10">
//                     <p className="text-[#c4a484] text-[12px] font-bold uppercase tracking-[0.3em] mb-4">
//                     Authentic 925 Sterling
//                     </p>
//                     <h1 className="text-6xl font-bold text-zinc-900 leading-[1.1] mb-6">
//                     {slide.title}
//                     </h1>
//                     <p className="text-zinc-500 text-lg mb-10 max-w-md leading-relaxed">
//                     <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#c4a484] font-bold">
//                     Handcrafted • Certified Diamonds • Lifetime Shine Guarantee
//                     </div>

//                     {slide.subtitle}
//                     </p>
//                     <button className="px-12 py-4 bg-zinc-900 text-white text-[13px] font-bold uppercase tracking-widest hover:bg-[#c4a484] transition-all">
//                     Shop Now
//                     </button>
//                 </div>

//                 {/* Right Content: Image */}
//                 <div className="w-[40%] flex justify-end">
//                     <div className="w-[450px] h-[550px] rounded-[30px] overflow-hidden shadow-2xl border-8 border-white">
//                     <img src={slide.img} className="w-full h-full object-cover" alt="jewelry" />
//                     </div>
//                 </div>
//                 </div>
//             ))}

//             {/* Simple Navigation - Bottom Left */}
//             <div className="absolute bottom-10 left-20 z-20 flex items-center gap-4">
//                 <button onClick={() => setCurrentSlide(currentSlide === 0 ? 1 : 0)} className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-white transition-all shadow-sm">
//                 <ChevronLeft size={20} />
//                 </button>
//                 <button onClick={() => setCurrentSlide(currentSlide === 0 ? 1 : 0)} className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-white transition-all shadow-sm">
//                 <ChevronRight size={20} />
//                 </button>
//             </div>
//             </section>


//             `{/* SOCIAL PROOF */}
//             <div className="flex justify-center gap-12 py-6 border-b border-gray-100 text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">
//             <span>⭐ 4.9 Rated Worldwide</span>
//             <span>👑 50K+ Happy Clients</span>
//             <span>💎 Premium Craftsmanship</span>
//             </div>`

//          {/* 3. Features Bar (Worldwide Shipping Portion) */}
//          <section className="py-16 px-10 border-b border-gray-50">
//            <div className="grid grid-cols-4 gap-8">
//              <div className="flex gap-4 items-center">
//                <Truck className="text-[#c4a484]" size={32} strokeWidth={1} />
//                <div>
//                  <h4 className="text-[11px] font-bold uppercase">Worldwide Shipping</h4>
//                  <p className="text-[10px] text-gray-400">For all Orders Over $100</p>
//                </div>
//              </div>
//              <div className="flex gap-4 items-center">
//                <RotateCcw className="text-[#c4a484]" size={32} strokeWidth={1} />
//                <div>
//                  <h4 className="text-[11px] font-bold uppercase">Money Back Guarantee</h4>
//                  <p className="text-[10px] text-gray-400">Guarantee Within 30 Days</p>
//                </div>
//              </div>
//              <div className="flex gap-4 items-center">
//                <BadgePercent className="text-[#c4a484]" size={32} strokeWidth={1} />
//                <div>
//                  <h4 className="text-[11px] font-bold uppercase">Offers and Discounts</h4>
//                  <p className="text-[10px] text-gray-400">Back Returns in 7 Days</p>
//                </div>
//              </div>
//              <div className="flex gap-4 items-center">
//                <Headphones className="text-[#c4a484]" size={32} strokeWidth={1} />
//                <div>
//                  <h4 className="text-[11px] font-bold uppercase">24/7 Support Services</h4>
//                  <p className="text-[10px] text-gray-400">Contact us Anytime</p>
//                </div>
//              </div>
//            </div>
//          </section>
   
//          {/* 4. Banner Grid (The 3 Image Portion) */}
//          <section className="py-20 px-10 grid grid-cols-2 gap-6">
//            <div className="relative aspect-square overflow-hidden group">
//              <img src="/lumina-gems-ring-shopify-store.webp" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Ring" />
//              <div className="absolute inset-0 bg-black/20"></div>
//              <div className="absolute top-16 left-16 text-white">
//                <p className="text-[10px] uppercase font-bold tracking-widest mb-2 opacity-60">Diamond Ring</p>
//                <h3 className="text-4xl font-bold mb-6">Yellow Gold &<br/>Diamond Ring</h3>
//                <button className="text-[10px] font-bold uppercase border-b-2 border-white pb-1">Shop Now</button>
//              </div>
//            </div>
//            <div className="flex flex-col gap-6">
//              <div className="relative h-1/2 overflow-hidden group">
//                <img src="/lumina-gems-karay-shopify-store.webp" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Bracelet" />
//                <div className="absolute top-10 left-10">
//                  <p className="text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c4a484]">Diamond Bracelets</p>
//                  <h3 className="text-3xl font-bold mb-4">Infinity Diamond<br/>Bracelet</h3>
//                  <button className="text-[10px] font-bold uppercase border-b-2 border-black pb-1">Shop Now</button>
//                </div>
//              </div>
//              <div className="relative h-1/2 overflow-hidden group">
//                <img src="/lumina-gems-set2-shopify-store.webp" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Pendant" />
//                <div className="absolute top-10 left-10">
//                  <p className="text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c4a484]">Diamond Pendant</p>
//                  <h3 className="text-3xl font-bold mb-4">Teardrop Diamond<br/>Pendant</h3>
//                  <button className="text-[10px] font-bold uppercase border-b-2 border-black pb-1">Shop Now</button>
//                </div>
//              </div>
//            </div>
//          </section>
            
//                             {/* LUXURY STORY SECTION */}
//             <section className="py-28 text-center bg-[#fdfaf7] border-y border-gray-100">
//             <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6">
//                 Jewelry that defines <span className="text-[#c4a484] font-serif">your identity</span>
//             </h2>
//             <p className="max-w-xl mx-auto text-[12px] uppercase tracking-[0.4em] text-gray-600 leading-relaxed">
//                 Each piece is designed to capture emotion, elegance, and timeless beauty.
//             </p>
//             </section>


//          {/* 5. New Arrivals (6 Products Grid) */}
//          <section className="py-20 px-10 bg-white">
//             {/* Header */}
//             <div className="text-center mb-16">
//                 <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 mb-4">New Arrivals</h2>
//                 <div className="w-20 h-1 bg-[#c4a484] mx-auto"></div>
//             </div>

//             {/* Grid - Direct 6 Products */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                
//                 {/* Product 1 */}
//                 <div className="group text-center">
//                 <div className="aspect-square bg-gray-100 overflow-hidden mb-6 relative rounded-2xl">
//                     <img src="/lumina-gems-necklace3-shopify-store.webp" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Product" />
//                     <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
//                 </div>
//                 <h4 className="text-[13px] font-bold uppercase tracking-widest mb-2 text-zinc-800">Lumina Ring</h4>
//                 <p className="text-[#c4a484] font-black">$1,200.00</p>
//                 </div>

//                 {/* Product 2 */}
//                 <div className="group text-center">
//                 <div className="aspect-square bg-gray-100 overflow-hidden mb-6 relative rounded-2xl">
//                     <img src="/lumina-gems-earings-shopify-store.webp " className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Product" />
//                 </div>
//                 <h4 className="text-[13px] font-bold uppercase tracking-widest mb-2 text-zinc-800">Minimal Hoop</h4>
//                 <p className="text-[#c4a484] font-black">$800.00</p>
//                 </div>

//                 {/* Product 3 */}
//                 <div className="group text-center">
//                 <div className="aspect-square bg-gray-100 overflow-hidden mb-6 relative rounded-2xl">
//                     <img src="/lumina-gems-necklaceset-shopify-store.webp" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Product" />
//                 </div>
//                 <h4 className="text-[13px] font-bold uppercase tracking-widest mb-2 text-zinc-800">Sterling Chain</h4>
//                 <p className="text-[#c4a484] font-black">$1,500.00</p>
//                 </div>

//                 {/* Product 4 */}
//                 <div className="group text-center">
//                 <div className="aspect-square bg-gray-100 overflow-hidden mb-6 relative rounded-2xl">
//                     <img src="/lumina-gems-head-shopify-store.webp" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Product" />
//                 </div>
//                 <h4 className="text-[13px] font-bold uppercase tracking-widest mb-2 text-zinc-800">Diamond Studs</h4>
//                 <p className="text-[#c4a484] font-black">$2,100.00</p>
//                 </div>

//                 {/* Product 5 */}
//                 <div className="group text-center">
//                 <div className="aspect-square bg-gray-100 overflow-hidden mb-6 relative rounded-2xl">
//                     <img src="/lumina-gems-jewelryset-shopify-store.webp" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Product" />
//                 </div>
//                 <h4 className="text-[13px] font-bold uppercase tracking-widest mb-2 text-zinc-800">Gold Band</h4>
//                 <p className="text-[#c4a484] font-black">$950.00</p>
//                 </div>

//                 {/* Product 6 */}
//                 <div className="group text-center">
//                 <div className="aspect-square bg-gray-100 overflow-hidden mb-6 relative rounded-2xl">
//                     <img src="/lumina-gems-braclet-shopify-store.webp" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="Product" />
//                 </div>
//                 <h4 className="text-[13px] font-bold uppercase tracking-widest mb-2 text-zinc-800">Urban Pendant</h4>
//                 <p className="text-[#c4a484] font-black">$1,100.00</p>
//                 </div>

//             </div>
//             </section>

//             <section className="bg-white text-black relative overflow-hidden">
//             {/* Background Decorative Aura - Vignette ka Behtar Alternet */}
//             <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#c4a484]/10 rounded-full blur-[100px] pointer-events-none"></div>
//             <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#c4a484]/10 rounded-full blur-[100px] pointer-events-none"></div>

//             <div className="relative py-40 px-10 flex flex-col items-center justify-center text-center z-20">
//                 <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter mb-6">
//                     Timeless <span className="font-serif text-[#c4a484]">Artistry</span>
//                 </h2>
//                 <p className="max-w-md text-[13px] font-bold uppercase tracking-[0.4em] opacity-40">
//                     Defining luxury since 1950
//                 </p>
//             </div>
//         </section>
   
//          {/* 6. Customer Testimonials Portion (Text Only) */}
//          <section className="py-32 px-10 bg-white">
//            <div className="text-center mb-20">
//              <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
//              <p className="text-gray-400 text-sm ">Authentic feedback from our archival community</p>
//            </div>
//            <div className="grid grid-cols-3 gap-12">
//              {[
//                { name: "STEFANIE RASHFORD", role: "FOUNDER", quote: "Reliable product, consistently delivers. The craftsmanship is simply unparalleled in the industry." },
//                { name: "AUGUSTA WIND", role: "WEB DESIGNER", quote: "Excellent product, A+ customer service. Every piece tells a unique story that resonates with my style." },
//                { name: "REEMA GHURDE", role: "MANAGER", quote: "Impressive quality, durable and reliable. I've been wearing my heritage band daily for years." }
//              ].map((t, i) => (
//                <div key={i} className="p-10 border border-gray-100 text-center hover:shadow-xl transition-all group">
//                  <div className="flex justify-center gap-1 mb-6 text-[#c4a484]">
//                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
//                  </div>
//                  <p className="text-gray-500 mb-10 leading-relaxed">"{t.quote}"</p>
//                  <h5 className="text-[12px] font-bold tracking-widest">{t.name}</h5>
//                  <p className="text-[10px] text-gray-300 font-bold uppercase mt-1">{t.role}</p>
//                </div>
//              ))}
//            </div>
//          </section>
   
//          {/* 7. Footer */}
//          <footer className="bg-[#1a1a1a] text-white py-20 px-10 text-center">
//            <h3 className="text-3xl font-bold tracking-[0.3em] mb-10">Lumina Gems</h3>
//            <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em] mb-10">© 2026 Lumina Gems — BUILT BY NAWAZ</p>
//            <div className="flex justify-center gap-10 opacity-40 text-[10px] font-bold uppercase tracking-widest">
//               <span className="hover:text-[#c4a484] cursor-pointer">Instagram</span>
//               <span className="hover:text-[#c4a484] cursor-pointer">Facebook</span>
//               <span className="hover:text-[#c4a484] cursor-pointer">Pinterest</span>
//            </div>
//          </footer>
//        </div>
//      );
//    };

    const JewelryStore = ({ s }: { s: any }) => {
        const [currentSlide, setCurrentSlide] = useState(0);
        
        const slides = [
        {
            title: "Handcrafted Elegance",
            mainText: "MODERN MINIMAL RING HOOP",
            subtitle: "AUTHENTIC 925 STERLING SILVER",
            img: "/lumina-gems-necklace-shopify-store.webp"
        },
        {
            title: "Royal Collections",
            mainText: "TIMELESS DIAMOND ENGAGEMENT",
            subtitle: "PURE 18K GOLD • CERTIFIED GEMS",
            img: "/lumina-gems-shopify-store.webp"
        }
        ];
        
        return (
        <div className="bg-white text-[#1a1a1a] font-sans selection:bg-[#c4a484] selection:text-white">
                
            {/* 1. TOP NAV - Ultra Thin & Classy */}
            <nav className="px-12 py-8 bg-white/98 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-50">
            <div className="max-w-[1440px] mx-auto grid grid-cols-12 items-center">
                    
                {/* 1. LOGO SECTION (Left) - Fixed Width Space */}
                <div className="col-span-3">
                <div className="text-2xl font-[900] tracking-tighter uppercase flex flex-col leading-[0.8]">
                    <span className="text-black">LUMINA</span>
                    <span className="text-[#c4a484] ml-auto w-full">GEMS</span>
                </div>
                </div>
                    
                {/* 2. MENU SECTION (Center) - No Wrapping */}
                <div className="col-span-6 flex justify-center items-center gap-8 whitespace-nowrap">
                {[
                    { name: 'Home', active: true },
                    { name: 'New In', active: false },
                    { name: 'Collections', active: false },
                    { name: 'Bestsellers', active: false },
                    { name: 'Our Story', active: false }
                ].map((item) => (
                    <div key={item.name} className="relative group cursor-pointer py-2">
                    <span className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 ${
                        item.active ? 'text-[#c4a484]' : 'text-zinc-500 group-hover:text-black'
                    }`}>
                        {item.name}
                </span>
                        {item.active && (
                            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#c4a484]"></span>
                        )}
                        <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c4a484] transition-all duration-300 group-hover:w-full"></span>
                        </div>
                    ))}
                    </div>

                    {/* 3. ICONS SECTION (Right) */}
                    <div className="col-span-3 flex justify-end items-center gap-8">
                    <div className="group cursor-pointer">
                        <Search size={20} strokeWidth={1.2} className="group-hover:text-[#c4a484] transition-all" />
                    </div>
                    
                    <div className="relative cursor-pointer group">
                        <ShoppingBag size={20} strokeWidth={1.2} className="group-hover:text-[#c4a484] transition-all" />
                        <span className="absolute -top-2 -right-2 bg-black text-[7px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        1
                        </span>
                    </div>
                    </div>

                </div>
                </nav>
        
                {/* 2. IMPROVED HERO SECTION - Structured & Bold */}
                <section className="relative h-[85vh] bg-[#fdfaf7] flex items-center overflow-hidden">
                <div className="container mx-auto px-12 grid grid-cols-12 items-center gap-8">
                    
                    {/* Left Content */}
                    <div className="col-span-5 z-20">
                    <p className="text-[#c4a484] text-[12px] font-bold uppercase tracking-[0.5em] mb-4">
                        {slides[currentSlide].subtitle}
                    </p>
                    <h1 className="text-6xl font-black leading-[0.95] text-zinc-900 mb-8 tracking-tighter">
                        {slides[currentSlide].mainText}
                    </h1>
                    <p className="text-zinc-500 text-[16px] mb-10 max-w-sm font-light">
                        Elevate your presence with pieces designed for the modern connoisseur of fine jewelry.
                    </p>
                    <div className="flex items-center gap-8">
                        <button className="px-12 py-5 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#c4a484] transition-all shadow-2xl">
                        Shop Collection
                        </button>

                    </div>
                    </div>
        
                    {/* Right Image - No Overlapping Text */}
                    <div className="col-span-7 relative flex justify-end">
                    <div className="relative w-[550px] h-[650px]">
                        {/* Decorative Background box */}
                        <div className="absolute top-10 -left-5 w-full h-full border border-[#c4a484]/30 rounded-2xl z-0"></div>
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] z-10">
                        <img 
                            src={slides[currentSlide].img} 
                            className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-[3000ms]" 
                            alt="Elite Jewelry" 
                        />
                        </div>
                    </div>
                    </div>
                </div>
        
                {/* Controls */}
                <div className="absolute bottom-12 left-12 flex gap-4 z-30">
                    <button onClick={() => setCurrentSlide(0)} className={`h-1 transition-all duration-500 ${currentSlide === 0 ? 'w-16 bg-black' : 'w-8 bg-zinc-200'}`}></button>
                    <button onClick={() => setCurrentSlide(1)} className={`h-1 transition-all duration-500 ${currentSlide === 1 ? 'w-16 bg-black' : 'w-8 bg-zinc-200'}`}></button>
                </div>
                </section>
        
                {/* 3. TRENDING CATEGORIES - New Addition */}
                <section className="py-20 px-12 grid grid-cols-4 gap-6">
                {['Rings', 'Necklaces', 'Bracelets', 'Earrings'].map((cat, i) => (
                    <div key={i} className="group cursor-pointer relative h-40 flex items-center justify-center overflow-hidden rounded-lg bg-[#f9f9f9]">
                    <span className="relative z-10 text-[12px] font-bold uppercase tracking-[0.4em] group-hover:text-[#c4a484] transition-colors">{cat}</span>
                    <div className="absolute inset-0 bg-zinc-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </div>
                ))}
                </section>
                
                {/* SECTION: SHOP BY DIAMOND SHAPE */}
                <section className="py-20 bg-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-light tracking-[0.3em] uppercase mb-3">Shop by Diamond Shapes</h2>
                    <p className="text-zinc-400 text-xs mb-12">Explore our exquisite collection to find your perfect gem.</p>

                    {/* Horizontal Scroll Container */}
                    <div className="flex gap-8 overflow-x-auto no-scrollbar pb-6 justify-start md:justify-center">
                    {[
                        { name: 'Round', img: '/diamond-round-shape.webp' },
                        { name: 'Oval', img: '/diamond-oval-shape.webp' },
                        { name: 'Emerald', img: '/diamond-emerald-shape.webp' },
                        { name: 'Cushion', img: '/diamond-cushion-shape.webp' },
                        { name: 'Princess', img: '/diamond-princes-shape.webp' }
                    ].map((shape, i) => (
                        <div key={i} className="min-w-[110px] group cursor-pointer">
                        <div className="w-20 h-20 mx-auto rounded-full border border-zinc-100 flex items-center justify-center mb-3 group-hover:border-[#c4a484] transition-all">
                            <img src={shape.img} alt={shape.name} className="w-12 h-12 object-contain" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">{shape.name}</p>
                        </div>
                    ))}
                    </div>

                    {/* Modern Points (Pagination Dots) */}
                    <div className="flex justify-center gap-2 mt-4">
                    <span className="w-2 h-2 rounded-full bg-[#c4a484]"></span>
                    <span className="w-2 h-2 rounded-full bg-zinc-200"></span>
                    <span className="w-2 h-2 rounded-full bg-zinc-200"></span>
                    </div>
                </div>
                </section>



                {/* 4. EXPANDED PRODUCT GRID (9 Products) */}
                <section className="py-24 px-12 bg-white">
                <div className="flex justify-between items-end mb-20">
                    <div className="max-w-md">
                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Curated Arrivals</h2>
                    <p className="text-zinc-400 text-sm">Explore our latest masterpieces, each certified for quality and brilliance.</p>
                    </div>
                    <button className="text-[11px] font-bold uppercase border-b-2 border-black pb-2 hover:text-[#c4a484] hover:border-[#c4a484] transition-all">View All Products</button>
                </div>
                <div className="grid grid-cols-3 gap-x-12 gap-y-20">
                    {[
                    { name: "Veridian Crown", price: "1,200", img: "/lumina-gems-necklace3-shopify-store.webp" },
                    { name: "Pure Solitaire", price: "800", img: "/lumina-gems-ring4-shopify-store.webp" },
                    { name: "Royal Pear", price: "1,500", img: "/lumina-gems-necklace4-shopify-store.webp" },
                    { name: "Luna Drop", price: "1250", img: "/lumina-gems-head-shopify-store.webp" },
                    { name: "Aura Linkd", price: "2,100", img: "/lumina-gems-jewelryset-shopify-store.webp" },
                    { name: "Solare Hoop", price: "1,100", img: "/lumina-gems-braclet-shopify-store.webp" },
                    { name: "Halo Luxe", price: "1,800", img: "/lumina-gems-ring-shopify-store.webp" },
                    { name: "Frost Bloom", price: "2,400", img: "/lumina-gems-karay-shopify-store.webp" },
                    { name: "Royal Meena", price: "3,500", img: "/lumina-gems-set2-shopify-store.webp" }
                    ].map((item, i) => (
                    <div key={i} className="group">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-[#f9f9f9]">
                        <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Product" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all">
                            <Heart size={16} />
                            </button>
                        </div>
                        <button className="absolute inset-x-6 bottom-6 py-4 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                            Quick Add to Bag
                        </button>
                        </div>
                        <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-zinc-800">{item.name}</h4>
                            <p className="text-zinc-400 text-[11px] mt-1">Fine Jewelry</p>
                        </div>
                        <span className="text-[#c4a484] font-black tracking-widest text-sm">${item.price}</span>
                        </div>
                    </div>
                    ))}
                </div>
                </section>
        
                {/* 5. BRAND STORY - Full Width Impact */}
                <section className="py-40 bg-[#111] text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-700 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 px-10">
                    <h2 className="text-7xl font-light font-serif mb-10 text-[#c4a484]">Timeless Artistry</h2>
                    <p className="max-w-2xl mx-auto text-[14px] uppercase tracking-[0.6em] leading-relaxed opacity-60">
                    Crafting Legacy Since 1950. Every Diamond tells a story of love, endurance, and unmatched beauty.
                    </p>
                    <div className="mt-16 w-px h-24 bg-[#c4a484] mx-auto animate-pulse"></div>
                </div>
                </section>
                    

                    {/* SECTION: WHY CHOOSE US */}
                    <section className="py-32 px-12 bg-[#f9f9f9]">
                    <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-16 items-center">
                        
                        {/* Left: Branding Image (Ring in a Box) */}
                        <div className="col-span-5">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#c4a484]/10 rounded-2xl translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-all duration-700"></div>
                            <img 
                            src="/lumina-shopify-store.webp" 
                            className="w-full rounded-2xl shadow-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                            alt="Premium Packaging" 
                            />
                        </div>
                        </div>

                        {/* Right: Benefits Grid */}
                        <div className="col-span-7 pl-12">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Why Shop at <span className="text-[#c4a484]">Lumina Gems</span></h2>
                        
                        <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                            {[
                            { title: "Manufacturer Direct", desc: "No middleman, just pure value." },
                            { title: "30-Day Returns", desc: "Completely risk-free shopping." },
                            { title: "Complimentary Appraisal", desc: "Expert valuation with every purchase." },
                            { title: "Free Global Shipping", desc: "Insured delivery to your doorstep." },
                            { title: "Lifetime Maintenance", desc: "We keep your gems shining forever." },
                            { title: "Custom Resizing", desc: "Perfect fit, guaranteed." }
                            ].map((benefit, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[#c4a484] group-hover:scale-150 transition-transform"></div>
                                <div>
                                <h4 className="text-[13px] font-bold uppercase tracking-widest mb-1">{benefit.title}</h4>
                                <p className="text-zinc-500 text-[11px] leading-relaxed">{benefit.desc}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>

                    </div>
                    </section>


                {/* 6. TESTIMONIALS & FOOTER */}
                <section className="py-24 px-12 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-16">
                    {[1,2,3].map(i => (
                        <div key={i} className="space-y-4">
                        <div className="flex gap-1 text-[#c4a484]"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                        <p className="text-sm text-zinc-500">"The quality surpassed my expectations. It's not just jewelry, it's an investment in beauty."</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest">— Client Review</p>
                        </div>
                    ))}
                </div>
                </section>
        
                <footer className="py-12 px-12 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">
                <span>© 2026 Lumina Gems</span>
                <div className="flex gap-8">
                    <span className="hover:text-black cursor-pointer">Instagram</span>
                    <span className="hover:text-black cursor-pointer">Facebook</span>
                </div>
                <span>BUILT BY NAWAZ</span>
                </footer>
            </div>
            );
        };

  // --- 4. Decor Store (FULL PAGE EXACT REPLICA) ---
    const DecorStore = ({ s }: { s: any }) => {
    return (
      <div className="bg-white text-[#1a1a1a] font-sans selection:bg-[#e2dfd5] selection:text-black">
        
        {/* 1. TOP ANNOUNCEMENT BAR */}
        <div className="bg-[#1a1a1a] text-white text-[9px] py-2 text-center uppercase tracking-[0.3em] font-bold">
          Shop on Sale Planters
        </div>
  
        {/* 2. MAIN NAVIGATION */}
        <nav className="px-10 py-5 bg-white border-b border-gray-100 sticky top-0 z-[100]">
          <div className="flex justify-between items-center max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2 border-b border-black/10 pb-1">
              <Search size={14} className="opacity-40" />
              <input type="text" placeholder="Search our store" className="bg-transparent outline-none text-[10px] w-32 uppercase tracking-widest placeholder:text-gray-300" />
            </div>
            
            <div className="text-xl font-bold tracking-[0.3em] uppercase pl-20">
              Saha GARDEN<span className="text-[8px] align-top">®</span>
            </div>
  
            <div className="flex gap-6 items-center">
              <User size={18} strokeWidth={1} className="cursor-pointer" />
              <div className="relative cursor-pointer">
                <ShoppingBag size={20} strokeWidth={1} />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
              </div>
            </div>
          </div>
          
          {/* SUB MENU */}
          <div className="flex justify-center gap-10 mt-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
            <span className="border-b-2 border-black pb-1">Home</span>
            <span className="hover:opacity-50 cursor-pointer">Shop <span className="text-[7px]">▼</span></span>
            <span className="hover:opacity-50 cursor-pointer">Contact</span>
            <span className="hover:opacity-50 cursor-pointer">Faqs</span>
            <span className="hover:opacity-50 cursor-pointer">Curated</span>
            <span className="hover:opacity-50 cursor-pointer">Our Story</span>
          </div>
        </nav>
  
        {/* 3. HERO SECTION */}
        <section className="relative h-[80vh] bg-[#f4f4f2] overflow-hidden">
          <img src="/saha-garden-cover-shopify-store.webp" className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-7xl font-light tracking-[0.1em] uppercase mb-4 drop-shadow-sm">Designer Planters</h1>
            <p className="text-sm tracking-widest mb-8 opacity-90">Elevate your home and garden.</p>
            <button className="text-[10px] font-bold uppercase tracking-[0.4em] border-b-2 border-white pb-2 hover:opacity-70 transition-all">Explore</button>
          </div>
        </section>
  
        {/* 4. EXPLORE OUR COLLECTION (CIRCLES) */}
        <section className="py-20 px-10 max-w-[1400px] mx-auto">
          <h2 className="text-center text-2xl font-light uppercase tracking-[0.3em] mb-16 text-gray-600">Explore Our Collection</h2>
          <div className="grid grid-cols-4 gap-10">
            {[
              { name: "Willow Range", img: "/saha-garden-cat2-shopify-store.webp" },
              { name: "Terra Botanica", img: "/saha-garden-cat1-shopify-store.webp" },
              { name: "Bad Names Range", img: "/saha-garden-cat3-shopify-store.webp" },
              { name: "Slugg Clusters", img: "/saha-garden-cat4-shopify-store.webp" }
            ].map((cat, i) => (
              <div key={i} className="group cursor-pointer text-center">
                <div className="aspect-square overflow-hidden mb-6">
                  <img src={cat.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={cat.name} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest border-b border-transparent group-hover:border-black pb-1 transition-all">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>
  
        {/* 5. PERFECT FOR OUTDOORS (SCREENSHOT REPLICA) */}
        <section className="bg-[#f0efeb] py-24 px-10 grid grid-cols-2 gap-20 items-center">
          <div className="text-center space-y-8 order-1">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">— Outdoor Planters —</p>
            <h2 className="text-5xl font-light tracking-tight uppercase leading-none">Perfect For <br/> Outdoors</h2>
            <button className="px-10 py-4 bg-[#6b705c] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">Shop Outdoor Planters</button>
          </div>
          <div className="aspect-[4/5] overflow-hidden order-2">
            <img src="/saha-garden-outdoor-shopify-store.webp" className="w-full h-full object-cover shadow-2xl" alt="Outdoors" />
          </div>
        </section>
  
        {/* 6. LOGO BAR (AS SEEN IN) */}
        <section className="py-20 px-10 border-b border-gray-100 opacity-60">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.5em] mb-12">You may have seen us in</p>
          <div className="flex justify-center items-center gap-20 grayscale opacity-70">
             <span className="text-2xl font-serif font-black">VOGUE</span>
             <span className="text-xl font-bold tracking-tighter uppercase">Architectural Digest</span>
             <span className="text-2xl font-bold tracking-widest">dwell</span>
             <span className="text-2xl font-serif font-bold">ELLE</span>
          </div>
        </section>
  
        {/* 7. FEATURED PRODUCTS (HORIZONTAL SLIDER STYLE) */}

        <section className="py-24 px-10 max-w-[1400px] mx-auto">
            <h2 className="text-center text-3xl font-light uppercase tracking-[0.3em] mb-20 text-zinc-800">
                Featured Products
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {[
                { name: "Shoob", range: "Willow Range", price: "$299", img: "/saha-garden-product1-shopify-store.webp" },
                { name: "The Chop", range: "Willow Range", price: "$199", img: "/saha-garden-product2-shopify-store.webp" },
                { name: "Ripple", range: "Willow Range", price: "$239", img: "/saha-garden-product3-shopify-store.webp" },
                { name: "Jitt", range: "Willow Range", price: "$239", img: "/saha-garden-product4-shopify-store.webp" },
                { name: "Loob", range: "Willow Range", price: "$100", img: "/saha-garden-product5-shopify-store.webp" }
                ].map((p, i) => (
                <div key={i} className="group cursor-pointer" style={{ perspective: '1000px' }}>
                    {/* 3D Effect Wrapper */}
                    <div 
                    className="relative aspect-[3/4] mb-6 bg-[#f9f9f9] overflow-hidden rounded-sm shadow-sm transition-all duration-500 ease-out"
                    style={{ transformStyle: 'preserve-3d' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'rotateX(4deg) rotateY(-8deg) translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                    {/* Image linked with p.img */}
                    <img 
                        src={p.img} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={p.name} 
                    />
                    
                    {/* Subtle Reflection Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Product Info */}
                    <div className="text-center space-y-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900">{p.name}</h4>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest">{p.range}</p>
                    <div className="flex flex-col items-center pt-2">
                        <p className="text-[11px] font-semibold">From {p.price} USD</p>
                        <div className="w-0 h-[1px] bg-black group-hover:w-12 transition-all duration-500 mt-1"></div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </section>
  
        {/* 8. FEATURE ICONS SECTION */}
        <section className="py-20 bg-[#fdfdfb] border-y border-gray-100">
          <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-20">
            <div className="flex flex-col items-center text-center space-y-4">
              <Clock size={40} strokeWidth={0.5} />
              <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed">Fast shipping for <br/> online orders</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <Leaf size={40} strokeWidth={0.5} />
              <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed">Suitable for <br/> indoors and outside</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-10 h-10 border border-black rounded-sm flex items-center justify-center">U</div>
              <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed">Over 100+ styles <br/> and colors</p>
            </div>
          </div>
        </section>
  
        {/* 9. BLOG SECTION (EXACT REPLICA) */}
        <section className="py-24 px-10 bg-white">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light uppercase tracking-[0.2em] mb-4">Saha Garden Blog</h2>
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Read all the latest news, features & interviews</p>
            <button className="px-10 py-3 bg-[#3a4030] text-white text-[10px] font-bold uppercase tracking-widest">All articles</button>
          </div>
          <div className="grid grid-cols-1 max-w-[1000px] mx-auto gap-20">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-8 group cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img src={i === 1 ? "/saha-garden-product6-shopify-store.webp" : "/saha-garden-blog-shopify-store.webp"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="Blog" />
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#6b705c]">Guide to lightweight planters</p>
                  <h3 className="text-2xl font-light uppercase tracking-tight">The Ultimate Guide to Plant Pots in the United States</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">Summary Selecting the right planters for commercial environments isn’t just about aesthetics—it’s a long-term investment decision. This gui...</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">Read More</span>
                    <span className="text-[9px] text-gray-300 uppercase font-bold">April 14, 2026</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
  
        {/* 10. OUR STORY (FOOTER IMAGE SECTION) */}
        <section className="px-12 py-32 grid grid-cols-2 gap-20 bg-[#f9f9f7]">
          <div className="aspect-square">
             <img src="/saha-garden-story-shopify-store.webp" className="w-full h-full object-cover" alt="Story" />
          </div>
          <div className="flex flex-col justify-center space-y-10 pr-20">
            <h2 className="text-5xl font-light uppercase tracking-tighter">Our Story</h2>
            <p className="text-sm text-gray-500 leading-loose">
              At Saha Garden, our mission is simple yet profound: Cultivating a greener world by ensuring every plant has a place to grow. We believe that every plant deserves a beautiful home, and that’s why we’re passionate about creating designer garden planters that enhance the beauty of your plants and elevate your space—indoors or outdoors.
            </p>
            <button className="w-fit px-12 py-4 bg-[#6b705c] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">Learn More</button>
          </div>
        </section>
  
        {/* 11. FINAL FOOTER */}
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-10 text-center">
          <div className="text-[9px] text-gray-400 uppercase tracking-[0.5em] font-bold">
            © 2026 SAHA GARDEN STUDIO — BUILT BY NAWAZ BUILDS
          </div>
        </footer>
      </div>
    );
    };

    // --- 5. THE Shoes  (FULL PAGE EXACT REPLICA) ---
    const KithStore = ({ s }: { s: any }) => {
        return (
          <div className="bg-white text-black font-sans selection:bg-gray-200">
            
            {/* 1. TOP NAV (KITH STYLE) */}
            <nav className="px-6 py-4 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-[100] border-b border-gray-100">
              <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="cursor-pointer hover:opacity-50">New</span>
                <span className="cursor-pointer hover:opacity-50">Mens</span>
                <span className="cursor-pointer hover:opacity-50">Womens</span>
                <span className="cursor-pointer hover:opacity-50">Kids</span>
              </div>
              
              <div className="text-2xl font-bold tracking-[0.4em] uppercase absolute left-1/2 -translate-x-1/2">
                  KITH
              </div>
      
              <div className="flex gap-5 items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Hospitality</span>
                <User size={18} strokeWidth={1} className="cursor-pointer" />
                <Search size={18} strokeWidth={1} className="cursor-pointer" />
                <div className="relative cursor-pointer">
                  <ShoppingBag size={20} strokeWidth={1} />
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                </div>
              </div>
            </nav>
      
            {/* 2. HERO EDITORIAL (Knicks Playoffs Style) */}
            <section className="relative h-[90vh] bg-gray-200 overflow-hidden group">
              <img src={s.hero.backgroundImage} className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-[3000ms]" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-20 left-10 text-white max-w-xl">
                <h1 className="text-4xl font-serif mb-4 leading-tight" dangerouslySetInnerHTML={{__html: s.hero.headline}} />
                <p className="text-[11px] uppercase tracking-[0.2em] mb-8 opacity-80 leading-loose">
                  Defined by KITH signature shoes dedicated to our hometown modern people.
                </p>
                <div className="flex gap-4">
                  <button className="px-10 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                      Shop Now
                  </button>
                </div>
              </div>
              {/* Carousel Indicators */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                {[1,2,3,4,5].map(i => <div key={i} className={`h-1 rounded-full transition-all ${i===1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></div>)}
              </div>
            </section>
      
            {/* 3. PRODUCT ROW (PKR Pricing Style) */}
            <section className="py-20 px-6">
              <div className="grid grid-cols-5 gap-4">
                {s.products.map((p: any, i: number) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-[4/5] bg-[#f5f5f5] mb-4 relative overflow-hidden">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={p.name} />
                    </div>
                    <div className="space-y-1 text-center">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{p.name}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Rs.{p.price}.00 $</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-12">
                  <button className="border border-black px-12 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">Shop All</button>
              </div>
            </section>
      
            {/* 4. SPRING 2026 SECTION (Large Image with In-Scene CTA) */}
            <section className="relative h-[100vh] mb-4">
              <img src="/kith-runner-shopify-store.webp" className="w-full h-full object-cover" alt="Spring" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-white text-center">
                 <h2 className="text-4xl font-serif mb-6">Kith Spring 2026</h2>
                 <div className="flex gap-4">
                   <button className="border border-white px-10 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black">Shop Now</button>
                   <button className="border border-white px-10 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black">A Closer Look</button>
                 </div>
              </div>
            </section>
      
            {/* 5. WOMEN SPRING (4 COLUMN GRID WITH BAG ICON) */}
           
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 mb-20">
                {[
                    { id: 1, img: "/kith-cat1-shopify-store.webp", alt: "White Sneakers" },
                    { id: 2, img: "/kith-cat3-shopify-store.webp", alt: "Engagement Rings" },
                    { id: 3, img: "/kith-cat2-shopify-store.webp", alt: "Bridal Sets" },
                    { id: 4, img: "/kith-cat4-shopify-store.webp", alt: "Luxury Watches" }
                ].map((item) => (
                    <div 
                    key={item.id} 
                    className="relative aspect-[3/4] group cursor-pointer overflow-hidden bg-[#f9f9f9]"
                    >
                    {/* Product Image - Linked to your custom path */}
                    <img 
                        src={item.img} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2s] ease-out" 
                        alt={item.alt} 
                    />

                    {/* Hover Overlay: Darkens slightly for text visibility if needed */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>

                    {/* Shopping Bag Icon: Animated from bottom */}
                    <div className="absolute bottom-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out z-20">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-[#c4a484] hover:text-white transition-colors">
                        <ShoppingBag size={20} />
                        </div>
                    </div>

                    {/* Optional: Subtle Border on hover */}
                    <div className="absolute inset-0 border-0 group-hover:border-[8px] border-white/20 transition-all duration-500 pointer-events-none"></div>
                    </div>
                ))}
                </section>

                


      
            {/* 6. KIDS & BABY SECTIONS (REPEATED EDITORIAL) */}
            <section className="bg-gray-50 py-24 text-center px-10">
                <h3 className="text-5xl font-serif mb-10 tracking-tighter">Kith Kids Collection 2026</h3>
                <img src="/kith-kids-shopify-store.webp" className="w-full h-[600px] object-cover mb-10" alt="Kids" />
                <div className="flex justify-center gap-4">
                   <button className="border border-black px-12 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">Shop Now</button>
                   <button className="border border-black px-12 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">Lookbook</button>
                </div>
            </section>
      
            {/* 7. KITH FOOTER (EXACT LINKS & LOGOS) */}
            <footer className="bg-gray-100 pt-20 pb-10 px-10">
              <div className="grid grid-cols-5 gap-10 mb-20 text-[10px] uppercase font-bold tracking-widest">
                 <div className="space-y-6">
                   <p className="opacity-30">Join Our List</p>
                   <div className="flex border-b border-black/10 pb-2">
                      <input type="text" placeholder="EMAIL ADDRESS" className="bg-transparent outline-none w-full text-[9px]" />
                      <button className="opacity-40">SUBMIT</button>
                   </div>
                 </div>
                    <div className="space-y-6">
                        <p className="opacity-30">Learn</p>
                        <ul className="space-y-3">
                        <li>About</li>
                        <li>FAQs</li>
                        <li>Loyalty Program</li>
                        </ul>
                     </div>
                 <div className="space-y-6">
                   <p className="opacity-30">Kith</p>
                   <ul className="space-y-3">
                     <li>Discover</li>
                     <li>Locations</li>
                     <li>Support</li>
                   </ul>
                 </div>
                 <div className="space-y-6">
                   <p className="opacity-30">Policies</p>
                   <ul className="space-y-3">
                     <li>Cookie Policy</li>
                     <li>Privacy Statement</li>
                     <li>Accessibility</li>
                   </ul>
                 </div>
                 <div className="space-y-6">
                   <p className="opacity-30">Follow Us</p>
                   <div className="flex gap-4">
                      <Instagram size={18} strokeWidth={1} />
                      <Facebook size={18} strokeWidth={1} />
                      <Youtube size={18} strokeWidth={1} />
                   </div>
                 </div>
              </div>
              
              <div className="flex justify-between items-center pt-10 border-t border-black/5 text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">
                 <div className="flex gap-10">
                   <span>PK / Rs. PKR</span>
                   <span>English</span>
                 </div>
                 <span>© 2026 KITH NYC — BUILT BY NAWAZ BUILDS</span>
                 <div className="flex gap-4 items-center">
                    <span className="text-[12px] font-bold">♿</span>
                    
                 </div>
              </div>
            </footer>
          </div>
        );
      };

    // --- MAIN PREVIEW CONTAINER (UPDATED WITH KITH & DECOR) ---
    const StorePreview = ({ project }: { project: any }) => {
        return (
        <div className="w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            {/* Browser Bar */}
            <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center text-[10px] opacity-40">
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/40"></div>
            </div>
            <span className="uppercase tracking-widest font-mono">shopify.preview/{project.id}</span>
            <div className="flex gap-3"><Search size={14}/><ShoppingBag size={14}/></div>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="h-[750px] overflow-y-auto scroll-smooth custom-scrollbar">
            {/* 1. District 99 Store Condition */}
            {project.id === 'District99' && <AurexStore s={project.store} />}
            
            {/* 2. Clothing Store Condition */}
            {project.id === 'clothing-store' && <ClothingStore s={project.store} />}
            
            {/* 3. Jewelry Store Condition */}
            {project.id === 'jewelry-store' && <JewelryStore s={project.store} />}
    
            {/* 4. Decor Store / Saha Garden */}
            {project.id === 'Saha' && <DecorStore s={project.store} />}
    
            {/* 5. Kith Editorial Luxury Store (New) */}
            {project.id === 'kith-store' && <KithStore s={project.store} />}
            
            {/* 6. Empty State Logic (Updated to include all active IDs) */}
            {!['District99', 'clothing-store', 'jewelry-store', 'Saha', 'kith-store'].includes(project.id) && (
                <div className="p-20 text-center opacity-20 uppercase font-black tracking-widest">
                Coming Soon: {project.title} Preview
                </div>
            )}
            </div>
        </div>
        );
    };

        const CaseStudyDetail = () => {
            const { projectId } = useParams();
          
            // A. Listing View
            if (!projectId) {
              return (
                <div className="min-h-screen bg-[#050505] text-white pt-40 pb-20 px-6">
                  <div className="max-w-[1400px] mx-auto">
                    <span className="text-[#f9a825] text-xs font-black uppercase tracking-[0.4em] mb-4 block">Selected Works</span>
                    <h1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-16">
                    Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f9a825] to-[#ffe066]">Studies.</span>
                    </h1>

                    {/* <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.85]  uppercase">
                Shopify <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f9a825] to-[#ffe066]">Titans.</span>
              </h1> */}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {caseStudies.map((p) => (
                        <Link key={p.id} to={`/case-studies/${p.id}`} className="group p-4 bg-white/5 border border-white/5 rounded-[2rem] hover:border-[#f9a825]/30 transition-all">
                          <img src={p.image} className="w-full aspect-video object-cover rounded-2xl mb-6 grayscale group-hover:grayscale-0 transition-all" alt={p.title} />
                          <h2 className="text-2xl font-black uppercase tracking-tighter">{p.title}</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#f9a825] mt-2">{p.category}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
          
            // B. Detail View
            const project = caseStudies.find(p => p.id === projectId);
            if (!project) return <div className="text-white text-center mt-40 font-black">404 - NOT FOUND</div>;
          
            return (
              <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 lg:px-16">
                <div className="max-w-[1500px] mx-auto">
                  <Link to="/case-studies" className="inline-flex items-center gap-2 text-white/60 hover:text-[#f9a825] mb-12 uppercase text-[11px] font-black tracking-[0.2em] transition-colors">
                    <ArrowLeft size={16} /> Close Preview
                  </Link>
                  
                  <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Left Info Column */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                      <span className="text-[#f9a825] text-[12px] font-black uppercase tracking-[0.4em] mb-6 block ">{project.category}</span>
                      <h1 className="text-7xl md:text-7xl font-black uppercase leading-[0.85] mb-16 tracking-tighter">{project.title}.</h1>
                      
                      {/* Structured Content: Problem, Solution, Result */}
                      <div className="space-y-14 mb-20">
                        {/* 01. Problem Section */}
                        <div>
                            <h3 className="text-[#f9a825] text-[18px] font-black uppercase tracking-[0.2em] mb-5 border-l-2 border-[#f9a825] pl-4">The Problem</h3>
                            <div className="space-y-5">
                            {project.problem.map((para, i) => {
                                const isBullet = para.trim().startsWith(">");
                                return (
                                    <div key={i} className="flex gap-3">
                                        {isBullet && <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />}
                                        <p className={`text-white/70 leading-relaxed font-light ${isBullet ? "text-[16px]" : "text-[18px]"}`}>
                                            {isBullet ? para.replace(">", "").trim() : para}
                                        </p>
                                    </div>
                                )
                            })}
                            </div>
                        </div>
          
                        {/* 02. Solution Section */}
                        <div>
                            <h3 className="text-[#f9a825] text-[18px] font-black uppercase tracking-[0.2em] mb-5 border-l-2 border-[#f9a825] pl-4">The Solution</h3>
                            <div className="space-y-5">
                            {project.solution.map((para, i) => {
                                const isBullet = para.trim().startsWith(">");
                                return (
                                    <div key={i} className="flex gap-3">
                                        {isBullet && <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />}
                                        <p className={`text-white/70 leading-relaxed font-light ${isBullet ? "text-[16px]" : "text-[18px]"}`}>
                                            {isBullet ? para.replace(">", "").trim() : para}
                                        </p>
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                        
                        {/* 03. Result Section */}
                        <div>
                            <h3 className="text-[#f9a825] text-[20px] font-black uppercase tracking-[0.2em] mb-5 border-l-2 border-[#f9a825] pl-4">The Result</h3>
                            <div className="space-y-5">
                            {project.result.map((para, i) => {
                                const isBullet = para.trim().startsWith(">");
                                return (
                                    <div key={i} className="flex gap-3">
                                        {isBullet && <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#f9a825] shrink-0" />}
                                        <p className={`leading-relaxed ${isBullet ? "text-white/70 text-[18px] font-light" : "text-white font-medium text-[20px]"}`}>
                                            {isBullet ? para.replace(">", "").trim() : para}
                                        </p>
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                      </div>
                        
                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-12">
                        {project.metrics.map((m, i) => (
                          <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all group">
                            <p className="text-[12px] font-black text-white/50 group-hover:text-white/80 uppercase tracking-[0.2em] mb-3 transition-colors">
                                {m.label}
                            </p>
                            <p className="text-5xl font-black text-[#f9a825] tracking-tighter">{m.value}</p>
                       </div>
                        ))}
                       </div>
                      </div>
        
                     {/* Right Store Preview Column */}
                                <div className="lg:col-span-7">
                                    <div className="rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
                                        <StorePreview project={project} />
                                    </div>
                                </div>
                  </div>                                                   
        
        
                {project.analytics && (
                    <div className="mt-20 w-full font-sans antialiased">
                        <div className="p-8 bg-white rounded-[1rem] text-[#1a1a1a] shadow-sm border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                
                                {/* Card 1: Sessions */}
                                <div className="flex flex-col bg-[#f6f6f7] rounded-lg p-4 relative border border-gray-200">
                                    <div className="absolute top-4 right-4 text-gray-400">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </div>
                                    <div className="flex items-center text-[12px] font-bold text-[#303030] mb-3">
                                        <span className="border-b border-dotted border-gray-400 pb-0.5 leading-none">Sessions</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-[900] tracking-tighter text-black leading-none">
                                            {project.analytics.sessions.value}
                                        </span>
                                        <div className="flex items-center text-[11px] font-black text-[#008060] leading-none mb-0.5">
                                            <ArrowUpRight size={12} strokeWidth={4} />
                                            <span>{project.analytics.sessions.change}</span>
                                        </div>
                                    </div>
                                </div>
        
                                {/* Card 2: Total Sales */}
                                <div className="flex flex-col p-4 bg-white border border-transparent">
                                    <div className="flex items-center text-[12px] font-bold text-[#303030] mb-3">
                                        <span className="border-b border-dotted border-gray-400 pb-0.5 leading-none">Total sales</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-[900] tracking-tighter text-black leading-none">{project.analytics.totalSales.value}</span>
                                        <div className="flex items-center text-[11px] font-black text-[#008060] leading-none mb-0.5">
                                            <ArrowUpRight size={12} strokeWidth={4} />
                                            <span>{project.analytics.totalSales.change}</span>
                                        </div>
                                    </div>
                                </div>
        
                                {/* Card 3: Orders */}
                                <div className="flex flex-col p-4 bg-white border border-transparent">
                                    <div className="flex items-center text-[12px] font-bold text-[#303030] mb-3">
                                        <span className="border-b border-dotted border-gray-400 pb-0.5 leading-none">Orders</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-[900] tracking-tighter text-black leading-none">{project.analytics.totalOrders.value}</span>
                                        <div className="flex items-center text-[11px] font-black text-[#008060] leading-none mb-0.5">
                                            <ArrowUpRight size={12} strokeWidth={4} />
                                            <span>{project.analytics.totalOrders.change}</span>
                                        </div>
                                    </div>
                                </div>
        
                                {/* Card 4: Conversion Rate */}
                                <div className="flex flex-col p-4 bg-white relative border border-transparent">
                                    <div className="absolute top-5 right-5 text-gray-500">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 15l-6-6-6 6"></path>
                                        </svg>
                                    </div>
                                    <div className="flex items-center text-[12px] font-bold text-[#303030] mb-3">
                                        <span className="border-b border-dotted border-gray-400 pb-0.5 leading-none">Conversion rate</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-[900] tracking-tighter text-black leading-none">{project.analytics.conversionRate.value}</span>
                                        <div className="flex items-center text-[11px] font-black text-[#008060] leading-none mb-0.5">
                                            <ArrowUpRight size={12} strokeWidth={4} />
                                            <span>{project.analytics.conversionRate.change}</span>
                                        </div>
                                    </div>
                                </div>
        
                            </div>
                        </div>
                    </div>
                    )}
        
                </div>
              </div>
            );
        };


export default CaseStudyDetail;