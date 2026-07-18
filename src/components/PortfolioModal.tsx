import { useEffect } from "react";
import { ExternalLink, Store, X } from "lucide-react";

export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  longImage: string;
  liveUrl: string;
  description: string;
  processPoints: string[];
  platform: string;
  stack: string;
  focus: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "gala-tea",
    title: "Manga Fashion",
    category: "Fashion & Apparel",
    thumbnail: "/mangadesign_1.webp",
    longImage: "/mangadesign_2.webp",
    liveUrl: "",
    description:
      "A fashion storefront showcase built around a clean editorial direction, clearer product discovery, and a more polished browsing experience for a premium apparel audience.",
    processPoints: [
      "Brand and visual direction",
      "Editorial storefront layout",
      "Collection hierarchy",
      "Product discovery pathways",
      "Mobile browsing support",
      "Launch-ready page structure",
    ],
    platform: "eCommerce Website",
    stack: "Custom Storefront UI",
    focus: "Brand clarity and product discovery",
  },
  {
    id: "fitgears",
    title: "Rheno Interior",
    category: "Interior & Home Decor",
    thumbnail: "/rheno-interior-dropship-brand.webp",
    longImage: "/rheno-interior-dropship-brand-full.webp",
    liveUrl: "",
    description:
      "An interior and home-decor storefront showcase designed to present premium products with clearer visual hierarchy, stronger category organisation, and a more considered brand experience.",
    processPoints: [
      "Typography and colour direction",
      "Brand identity support",
      "Story-led layout planning",
      "Product and collection structure",
      "Trust-focused page sections",
      "Conversion-ready storefront flow",
    ],
    platform: "eCommerce Website",
    stack: "Custom Storefront UI",
    focus: "Premium product presentation",
  },
  {
    id: "silk-stone",
    title: "Fashion Zapp",
    category: "Modern Fashion",
    thumbnail: "/fashion-zapp-cover.webp",
    longImage: "/fashion-zapp-full.webp",
    liveUrl: "",
    description:
      "A branded fashion storefront concept focused on making a diverse catalogue feel more cohesive through stronger collections, visual consistency, and a clearer shopper journey.",
    processPoints: [
      "Brand and colour system",
      "Collection structure",
      "Product catalogue organisation",
      "Storefront page creation",
      "Conversion-focused content blocks",
      "Marketing-ready landing page framework",
    ],
    platform: "eCommerce Website",
    stack: "Custom Storefront UI",
    focus: "Collection clarity and brand cohesion",
  },
  {
    id: "project-4",
    title: "Edge Recovery",
    category: "Wellness & Lifestyle",
    thumbnail: "/edge-recovery-cover.webp",
    longImage: "/edge-recovery-full.webp",
    liveUrl: "",
    description:
      "A wellness-storefront showcase created around a calm premium visual system, clear product education, and a customer journey designed to make high-consideration products easier to explore.",
    processPoints: [
      "Visual direction",
      "Brand positioning support",
      "Product education sections",
      "Storefront page structure",
      "Mobile-first user journey",
      "Launch content guidance",
    ],
    platform: "eCommerce Website",
    stack: "Custom Storefront UI",
    focus: "Trust and product education",
  },
  {
    id: "project-5",
    title: "Kyco Nails",
    category: "Beauty & Cosmetics",
    thumbnail: "/kyco-nails-cover-shopify-store.webp",
    longImage: "/kyco-nails-full-shopify-store.webp",
    liveUrl: "",
    description:
      "A beauty-storefront showcase designed around simple product selection, bundle discovery, product education, and mobile-friendly paths for customers comparing nail-wrap options.",
    processPoints: [
      "Bundle presentation",
      "Quick-add cart structure",
      "Educational content sections",
      "Before-and-after visual layout",
      "Mobile product discovery",
      "Marketing-ready content areas",
    ],
    platform: "eCommerce Website",
    stack: "Custom Storefront UI",
    focus: "Product education and mobile UX",
  },
  {
    id: "project-6",
    title: "Oroe Jewels",
    category: "Jewellery",
    thumbnail: "/oroe-jewels-cover-shopify-store.webp",
    longImage: "/oroe-jewels-full-shopify-store.webp",
    liveUrl: "",
    description:
      "A jewellery storefront showcase developed around luxury visual direction, easier catalogue navigation, clear product presentation, and a smoother route from product discovery to checkout.",
    processPoints: [
      "Luxury visual direction",
      "Catalog navigation structure",
      "Collection grid design",
      "Product hierarchy",
      "Cart journey clarity",
      "Performance-aware layout",
    ],
    platform: "eCommerce Website",
    stack: "Custom Storefront UI",
    focus: "Luxury discovery and product navigation",
  },
  {
    id: "project-7",
    title: "Variety Play",
    category: "Gaming",
    thumbnail: "/variety-play-cover-shopify-store.webp",
    longImage: "/variety-play-full-shopify-store.webp",
    liveUrl: "",
    description:
      "A retro-gaming storefront showcase focused on category discovery, product comparison, localised user experience, and clearer navigation for a specialist product range.",
    processPoints: [
      "GoHighLevel page architecture",
      "Category navigation planning",
      "Hero and campaign sections",
      "Trust-focused page blocks",
      "Product recommendation areas",
      "Mobile browsing support",
    ],
    platform: "GoHighLevel Website",
    stack: "Custom Landing Page System",
    focus: "Specialist catalogue discovery",
  },
  {
    id: "project-8",
    title: "TR Protection",
    category: "Safety Apparel & Equipment",
    thumbnail: "/tr-protection-cover-shopify-store.webp",
    longImage: "/tr-protection-full-shopify-store.webp",
    liveUrl: "",
    description:
      "A multi-category safety-equipment storefront showcase built around clear navigation, category segmentation, B2B and B2C browsing paths, and practical product discovery.",
    processPoints: [
      "Multi-category navigation",
      "Product recommendation sections",
      "Authority and trust blocks",
      "Newsletter capture pathway",
      "Google review placement area",
      "Mobile-first product browsing",
    ],
    platform: "GoHighLevel Website",
    stack: "Custom Landing Page System",
    focus: "Complex catalogue navigation",
  },
  {
    id: "project-9",
    title: "Gold Banner Beauty",
    category: "Beauty & Cosmetics",
    thumbnail: "/gold-banner-cover-shopify-store.webp",
    longImage: "/portfolio/pawcare-full.webp",
    liveUrl: "",
    description:
      "A beauty storefront showcase designed to combine a premium visual direction with clearer filtering, collection organisation, product presentation, and an easier shopping journey.",
    processPoints: [
      "Premium visual system",
      "Collection and filter structure",
      "Product grid design",
      "Secure checkout-ready layout",
      "Review-display area",
      "Cart and product journey support",
    ],
    platform: "eCommerce Website",
    stack: "Custom Storefront UI",
    focus: "Premium beauty discovery",
  },
  {
    id: "project-10",
    title: "Giomia",
    category: "Eyewear",
    thumbnail: "/giomia-eyeglasses-cover-shopify-store.webp",
    longImage: "/giomia-eyeglasses-full-shopify-store.webp",
    liveUrl: "",
    description:
      "An eyewear storefront showcase structured around product comparison, cleaner category browsing, best-seller discovery, and a more consistent visual experience across devices.",
    processPoints: [
      "Eyewear category navigation",
      "Visual brand system",
      "Best-seller presentation",
      "Product filtering support",
      "Checkout journey structure",
      "Performance-aware design",
    ],
    platform: "eCommerce Website",
    stack: "Custom Storefront UI",
    focus: "Product comparison and usability",
  },
];

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
}

const PortfolioModal = ({
  isOpen,
  onClose,
  projectId,
}: PortfolioModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !projectId) {
    return null;
  }

  const project = portfolioProjects.find((item) => item.id === projectId);

  if (!project) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} website project preview`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0a1c] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 bg-black/20 px-6 py-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Website Project · {project.category}
            </span>

            <h3 className="text-xl font-bold text-white">{project.title}</h3>
          </div>

          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
              >
                Live Website
                <ExternalLink size={14} />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white/5 p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close project preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto bg-black/40 p-6 lg:flex-row">
          <div className="flex w-full flex-col gap-4 text-left lg:w-1/3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <h4 className="mb-2 text-sm font-semibold text-white/90">
                Project Overview
              </h4>

              <p className="mb-1 text-sm leading-relaxed text-white/60">
                {project.description}
              </p>

              <div className="mt-5 border-t border-white/10 pt-4">
                <h4 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
                  Design & Build Focus
                </h4>

                <ul className="space-y-2.5">
                  {project.processPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-xs font-light text-white/80"
                    >
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/40">Platform:</span>
                <span className="text-right font-medium text-white/80">
                  {project.platform}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/40">Build:</span>
                <span className="text-right font-semibold text-[#facc15]">
                  {project.stack}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/40">Primary focus:</span>
                <span className="text-right font-medium text-white/80">
                  {project.focus}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/[0.06] p-4">
              <div className="flex items-start gap-3">
                <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <p className="text-xs leading-relaxed text-white/60">
                  This is a design and build showcase. Any product names,
                  interface elements, or store visuals shown in the preview are
                  illustrative unless separately confirmed as live client data.
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-[50vh] w-full overflow-hidden rounded-xl border border-white/10 bg-[#07040d] lg:h-full lg:w-2/3">
            <div className="h-full w-full overflow-y-auto scroll-smooth">
              <img
                src={project.longImage}
                alt={`${project.title} full website project preview`}
                loading="eager"
                decoding="async"
                className="h-auto w-full object-top"
              />
            </div>

            <div className="pointer-events-none absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/30 bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <span>Scroll to explore</span>
              <span className="inline-block animate-bounce text-sm font-bold text-[#facc15]">
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