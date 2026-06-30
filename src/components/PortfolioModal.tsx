import React, { useEffect } from 'react';
import { X, ExternalLink, Store } from 'lucide-react';

// 1. SARE 10 PROJECTS KA DATA MODAL KE ANDAR SHIFT (Home Page Load Free)
export const portfolioProjects = [
    {
        id: 'gala-tea',
        title: 'Manga Fashion',
        category: 'FASHION & APPAREL',
        thumbnail: '/mangadesign_1.webp',
        longImage: '/mangadesign_2.webp',
        liveUrl: '',
        description: 'The storefront design featured here is a custom, high-converting layout built for a premium fashion brand. It balances a clean, editorial aesthetic with an optimized user experience to instantly engage shoppers and build brand authority.',
        // 🎯 Process ki bina pe points yahan easily add kar sakte hain:
        processPoints: [
            'Store Branding',
            'Clean, Editorial Aesthetic',
            'Optimized User Experience',
            'Instant Cart Triggers',
            'Brand Authority Building',
            'Launch Marketing Guide'
        ]
    },
    {
        id: 'fitgears',
        title: 'RHENO INTERIOR',
        category: 'INTERIOR DESIGNER',
        thumbnail: '/rheno-interior-dropship-brand.webp',
        longImage: '/rheno-interior-dropship-brand-full.webp',
        liveUrl: '',
        description: 'The custom storefront you see here is a transformation, I partnered with Rheno to transform a generic dropshipping setup into a high-end interior decor brand. The client had premium products but lacked the elite visual trust needed for high-ticket sales.',
        processPoints: [
            'Typography & Colors',
            'Logo & Branding Identity',
            'Brand Story Integration',
            'Verified Suppliers Grid',
            'Product Research & Curation',
            'Conversion-Focused Layout'
        ]
    },
    {
        id: 'silk-stone',
        title: 'FASHION ZAPP',
        category: 'MODERN FASHION',
        thumbnail: '/fashion-zapp-cover.webp',
        longImage: '/fashion-zapp-full.webp',
        liveUrl: '',
        description: 'The custom e-commerce system featured here is a fully branded storefront built for FashionZapp (a subsidiary of High Choice Inc.). My mission was to transition their catalog of trending, innovative products into a cohesive, standalone brand identity with optimized collections.',

        processPoints: [
            'Custom Logo Design',
            'Store Branding & Color Strategy',
            'Product Research & Curation',
            'End-to-End Storefront Creation',
            'Conversion-Focused UI Layout',
            'Launch Marketing Framework'
        ]
    },
    {
        id: 'project-4',
        title: 'EDGE RECOVERY',
        category: 'LIFE STYLE',
        thumbnail: '/edge-recovery-cover.webp',
        longImage: '/edge-recovery-full.webp',
        liveUrl: '',
        description: 'The storefront layout featured here is a premium digital experience I engineered for Edge Recovery, a brand in the luxury sauna and wellness niche. My objective was to design a calm, professional aesthetic that mirrors the relaxing nature of wellness products while maximizing user trust and sales.',
        processPoints: [
            'Logo Creation',
            'Store Branding',
            'Product Research',
            'Store Creation Beginning to End',
            'Marketing Guide for the Start From Scratch'
        ]

    },
    {
        id: 'project-5',
        title: 'KYCO NAILS',
        category: 'FASHION',
        thumbnail: '/kyco-nails-cover-shopify-store.webp',
        longImage: '/kyco-nails-full-shopify-store.webp',
        liveUrl: '',
        description: 'The custom storefront design featured here is a conversion-focused platform built for Kyco Nails, a modern beauty brand specializing in premium at-home gel nail wraps. The primary focus was streamlining complicated purchasing pathways and engineering an interactive user interface to maximize conversions.',
        processPoints: [
            'Custom Bundle Architecture',
            'Frictionless Quick-Add Cart',
            'Educational Infographic Layout',
            'Before & After Visual Grids',
            'Mobile UX Optimization',
            'Marketing Guide for the Start From Scratch'
        ]
    },
    {
        id: 'project-6',
        title: 'OROE JEWELS',
        category: 'FASHION & APPAREL',
        thumbnail: '/oroe-jewels-cover-shopify-store.webp',
        longImage: '/oroe-jewels-full-shopify-store.webp',
        liveUrl: '',
        description: 'The digital storefront layout you see here is a premium, high-converting ecosystem built for Oroe Jewels. The main objective was to bridge the gap between luxury branding and functional e-commerce, creating a clean layout that establishes immediate consumer trust while handling extensive product lines smoothly.',
        processPoints: [
            'Luxury Branding Identity',
            'Structured Catalog Navigation',
            'Streamlined Checkout Flow',
            'Minimalist Grid Layout',
            'Optimized Page Speed',
            'Frictionless Cart Access'
        ]
    },
    {
        id: 'project-7',
        title: 'VARIETY PLAY',
        category: 'GAMING',
        thumbnail: '/variety-play-cover-shopify-store.webp',
        longImage: '/variety-play-full-shopify-store.webp',
        liveUrl: '',
        description: 'The custom e-commerce system engineered here is a dynamic storefront optimized for a specialized retro gaming brand. Developed on GoHighLevel, the primary objective was to streamline the product discovery journey for handheld consoles, removing common user experience friction points to maximize regional sales performance.',
        processPoints: [
            'GoHighLevel Architecture',
            'Localized User Experience',
            'Dynamic Hero Section',
            'Strategic Trust Badges',
            'Vibrant Conversion Pathing',
            'Integrated Review Grids'
        ]
    },
    {
        id: 'project-8',
        title: 'TR PROTECTION',
        category: 'E-Commerce',
        thumbnail: '/tr-protection-cover-shopify-store.webp',
        longImage: '/tr-protection-full-shopify-store.webp',
        liveUrl: '',
        description: 'The digital platform shown here is a GoHighLevel website development project engineered for a premium safety apparel and protective gear retailer. The core challenge was structuring a highly diverse product catalog without causing user navigation fatigue, resulting in a streamlined layout built for b2b and b2c conversions.',
        processPoints: [
            'Multi-Category Navigation Hierarchy',
            'Brand Authority Logo Carousel',
            'Segmented Product Recommendation Grids',
            'Integrated Google Review Widgets',
            'Newsletter Capture Conversion Paths',
            'High-Usability Mobile Layout'
        ]
    },
    {
        id: 'project-9',
        title: 'GOLD BANNER BEAUTY',
        category: 'BEAUTY & COSMETICS',
        thumbnail: '/gold-banner-cover-shopify-store.webp',
        longImage: '/portfolio/pawcare-full.webp',
        liveUrl: '',
        description: 'The custom storefront layout featured here is a high-performing digital platform engineered for Gold Banner Beauty. The primary objective was to align the brand unique luxurious appeal with a high converting architecture implementing streamlined navigation and robust ecommerce features tailored for a premium shopping experience.',
        processPoints: [
            'Sleek Luxury Aesthetics',
            'Advanced Product Filtering',
            'Secure Payment Integration',
            'Visual Collection Grid',
            'Dynamic Testimonial Carousel',
            'Optimized Checkout Flow'
        ]
    },
    {
        id: 'project-10',
        title: 'GIOMIA',
        category: 'GLASSES',
        thumbnail: '/giomia-eyeglasses-cover-shopify-store.webp',
        longImage: '/giomia-eyeglasses-full-shopify-store.webp',
        liveUrl: '',
        description: 'The custom storefront layout featured here is a modern e-commerce platform developed for Giomia. The design process focused on building a clean interface that mirrors the brand commitment to quality and style while creating intuitive navigation systems and a secure checkout flow to improve conversion performance.',
        processPoints: [
            'Intuitive Eyewear Navigation',
            'Cohesive Brand Aesthetics',
            'Secure Checkout Optimization',
            'Dynamic Best Sellers Grid',
            'Speed and Performance Enhancement',
            'Interactive Product Filtering'
        ]
    }
];

interface PortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string | null;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose, projectId }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !projectId) return null;

    // Click kiye gaye ID ke mutabiq project find karna
    const project = portfolioProjects.find(p => p.id === projectId);
    if (!project) return null;

    return (
        // ✅ Fixed: z-[999] toggled high to overlay perfectly above header navigation
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-5xl h-[90vh] bg-[#0f0a1c] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">

                {/* Header Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{project.category}</span>
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                            >
                                Live Store <ExternalLink size={14} />
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-black/40 flex flex-col lg:flex-row gap-6 scrollbar-thin">

                    {/* Details (Left) */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 text-left">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <h4 className="text-sm font-semibold text-white/90 mb-2">Project Overview</h4>
                            <p className="text-sm text-white/60 leading-relaxed mb-1">{project.description}</p>

                            {/* 🎯 Fixed: Dynamic Process Points Section with 'as any' safe compilation mapping */}
                            {(project as any).processPoints && (project as any).processPoints.length > 0 && (
                                <div className="mt-5 border-t border-white/10 pt-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">
                                        Execution & Process
                                    </h4>
                                    <ul className="space-y-2.5">
                                        {(project as any).processPoints.map((point: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2.5 text-white/80 text-xs font-light">
                                                <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/40">Platform:</span>
                                <span className="text-white/80 font-medium">Shopify (OS 2.0)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Core Stack:</span>
                                <span className="text-[#facc15] font-semibold">Custom Liquid, HTML/CSS</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Animations:</span>
                                <span className="text-white/80 font-medium">Tailwind, GSAP Engine</span>
                            </div>
                        </div>
                    </div>

                    {/* Fiverr Style Scrollable Frame (Right) */}
                    <div className="w-full lg:w-2/3 h-[50vh] lg:h-full rounded-xl border border-white/10 overflow-hidden bg-[#07040d] relative">
                        <div className="w-full h-full overflow-y-auto scrollbar-none scroll-smooth">
                            <img
                                src={project.longImage}
                                alt={`${project.title} Full Preview`}
                                loading="eager"
                                decoding="async"
                                className="w-full h-auto object-top"
                            />
                        </div>
                        {/* 🎯 High-Prominence Animated Scroll Indicator */}
                        <div className="absolute bottom-5 right-5 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)] select-none animate-pulse">
                            <span>Scroll to explore</span>
                            <span className="animate-bounce inline-block text-[#facc15] font-bold text-sm">
                                ↓
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PortfolioModal;