import { useEffect } from "react";
import { ExternalLink, Store, X } from "lucide-react";

import { portfolioProjects } from "@/data/portfolioProjects";

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