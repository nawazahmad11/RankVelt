import React from 'react';

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0f1115] text-white/80 py-32 px-6">
    <div className="max-w-3xl mx-auto">
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight underline decoration-primary/30">
        {title}
      </h1>
      {/* Page Content */}
      <div className="space-y-8 text-sm md:text-base leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export default LegalLayout;