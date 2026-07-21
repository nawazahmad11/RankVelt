import React from "react";

const LegalLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          publisher: {
            "@type": "Organization",
            name: "RankVelt",
            url: "https://rankvelt.com",
          },
        }),
      }}
    />

    <main className="min-h-screen bg-[#0f1115] px-6 py-32 text-white/80">
      <div className="mx-auto max-w-4xl">

        {/* Page Title */}
        <h1
          className="
          mb-12 
          text-4xl 
          font-black 
          tracking-tight 
          text-white 
          underline 
          decoration-primary/30
          md:text-5xl
          "
        >
          {title}
        </h1>


        {/* Page Content */}
        <div
          className="
          space-y-8 
          text-sm 
          leading-relaxed 
          md:text-base
          "
        >
          {children}
        </div>

      </div>
    </main>
  </>
);

export default LegalLayout;