import React from 'react';

interface FloatingIconProps {
  iconUrl: string;
  altText: string;
  positionClass: string; 
  delay?: string;        
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ iconUrl, altText, positionClass, delay = "0s" }) => {
  return (
    <div 
      className={`absolute pointer-events-none z-10 w-12 h-12 md:w-20 md:h-20 ${positionClass}`} 
      style={{ contain: 'layout style' }}
    >
      <div 
        /* FIX: Animation ko 'md:animate-float' kiya taake mobile par paint load zero ho jaye aur desktop par premium vibe barkarar rahe */
        className="relative group md:animate-float will-change-transform" 
        style={{ 
          animationDelay: delay,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
        {/* --- PERFECTLY OPTIMIZED BLUR & GLOW CONTAINER --- */}
        <div className="relative w-full h-full aspect-square flex items-center justify-center p-2.5 md:p-4 overflow-visible transition-all duration-500
                        rounded-full 
                        bg-white/[0.07] backdrop-blur-[6px]
                        border border-white/10
                        /* FIX: Heavy multi-layered box shadows ko single clean drop-shadow se replace kiya jo GPU par load nahi dalti */
                        filter drop-shadow(0 0 25px rgba(255,255,255,0.05))
                        
                        group-hover:scale-110 group-hover:bg-white/15 group-hover:border-white/20"
        >
          
          <img 
            alt={altText} 
            loading="lazy"
            decoding="async" 
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
            src={iconUrl}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingIcon;