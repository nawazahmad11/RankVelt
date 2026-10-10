import { lazy, Suspense } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Header from "@/components/Header";
// import Footer from "@/components/Footer";
const Footer = lazy(() => import("@/components/Footer"));


import ScrollToTop from "./components/ScrollToTop";
import RouteSeoManager from "./components/RouteSeoManager";
// import AuditPopup from "./components/AuditPopup";
// import WhatsAppButton from "./components/WhatsAppButton";
// const AuditPopup = lazy(() => import("./components/AuditPopup"));
const WhatsAppButton = lazy(() => import("./components/WhatsAppButton"));



/*
 * Homepage ko normal import rakha hai.
 * Homepage initial load par immediately available rahega.
 */
import FunnelStep1 from "./pages/FunnelStep1";


const LocalSEODentists = lazy(
  () => import("./pages/services/LocalSEODentists"),
);

const LocalSEOPlumbers = lazy(
  () => import("./pages/services/LocalSEOPlumbers"),
);

const LocalSEOElectricians = lazy(
  () => import("./pages/services/LocalSEOElectricians"),
);

const LocalSEOHvac = lazy(
  () => import("./pages/services/LocalSEOHvac"),
); 

const LocalSEOLawyers = lazy(
  () => import("./pages/services/LocalSEOLawyers"),
);



/*
 * Lead funnel pages
 */
const StrategyCallForm = lazy(
  () => import("./pages/StrategyCall"),
);

const ThankYouDone = lazy(
  () => import("./components/ThankYouDone"),
);

/*
 * Blog pages
 */
const BlogPage = lazy(
  () => import("./pages/BlogPage"),
);

const BlogPostDetail = lazy(
  () => import("./pages/BlogPostDetail"),
);

/*
 * Tools pages
 */
const ToolsPage = lazy(
  () => import("./pages/Tools"),
);

const MetaTitleDescriptionChecker = lazy(
  () => import("./pages/MetaTitleDescriptionChecker"),
);

const SchemaMarkupGenerator = lazy(
  () => import("./pages/SchemaMarkupGenerator"),
);

const RobotsTxtGenerator = lazy(
  () => import("./pages/RobotsTxtGenerator"),
);

const XmlSitemapGenerator = lazy(
  () => import("./pages/XmlSitemapGenerator"),
);

const LocalSeoChecklist = lazy(
  () => import("./pages/LocalSeoChecklist"),
);

const RedirectMappingGenerator = lazy(
  () => import("./pages/RedirectMappingGenerator"),
);

const BulkEmailExtractor = lazy(
  () => import("./pages/tools/BulkEmailExtractor"),
);

/* New Batch 1 tools (browser-only). RobotsTxtGenerator already imported above. */
const BulkRedirectGenerator = lazy(
  () => import("./pages/tools/BulkRedirectGenerator"),
);

const OpenGraphPreview = lazy(
  () => import("./pages/tools/OpenGraphPreview"),
);

const SerpSnippetPreview = lazy(
  () => import("./pages/tools/SerpSnippetPreview"),
);

/* New Phase 2 tools (API-assisted checkers + client-only UTM builder). */
const BulkBrokenLinkChecker = lazy(
  () => import("./pages/tools/BulkBrokenLinkChecker"),
);

const BulkHttpStatusChecker = lazy(
  () => import("./pages/tools/BulkHttpStatusChecker"),
);

const SslChecker = lazy(
  () => import("./pages/tools/SslChecker"),
);

const UtmBuilder = lazy(
  () => import("./pages/tools/UtmBuilder"),
);

const WebsiteSpeedTest = lazy(
  () => import("./pages/tools/WebsiteSpeedTest"),
);

const AeoReadinessChecker = lazy(
  () => import("./pages/tools/AeoReadinessChecker"),
);

/* New Batch 4 tools: 9 SEO/writing/design tools + 5 eCommerce/local tools. */
const SentenceCounter = lazy(
  () => import("./pages/tools/SentenceCounter"),
);

const ImageCompressor = lazy(
  () => import("./pages/tools/ImageCompressor"),
);

const H1Checker = lazy(
  () => import("./pages/tools/H1Checker"),
);

const CanonicalChecker = lazy(
  () => import("./pages/tools/CanonicalChecker"),
);

const BulkQrCodeGenerator = lazy(
  () => import("./pages/tools/BulkQrCodeGenerator"),
);

const ParagraphGenerator = lazy(
  () => import("./pages/tools/ParagraphGenerator"),
);

const AltTextChecker = lazy(
  () => import("./pages/tools/AltTextChecker"),
);

const MetaTagGenerator = lazy(
  () => import("./pages/tools/MetaTagGenerator"),
);

const ColorContrastChecker = lazy(
  () => import("./pages/tools/ColorContrastChecker"),
);

const MarkupCalculator = lazy(
  () => import("./pages/tools/MarkupCalculator"),
);

const SkuGenerator = lazy(
  () => import("./pages/tools/SkuGenerator"),
);

const VinBarcodeGenerator = lazy(
  () => import("./pages/tools/VinBarcodeGenerator"),
);

const GoogleReviewLinkGenerator = lazy(
  () => import("./pages/tools/GoogleReviewLinkGenerator"),
);

const OpenGraphChecker = lazy(
  () => import("./pages/tools/OpenGraphChecker"),
);

/*
 * Case-study pages
 */
const ProductDiscoveryCaseStudy = lazy(
  () => import("./pages/ProductDiscoveryCaseStudy"),
);

const CivicAccess = lazy(
  () => import("./pages/case-studies/CivicAccess"),
);

const ClearRide = lazy(
  () => import("./pages/case-studies/ClearRide"),
);

const Bluebridge = lazy(
  () => import("./pages/case-studies/Bluebridge"),
);

const Harborline = lazy(
  () => import("./pages/case-studies/Harborline"),
);

const CaseStudyDetail = lazy(
  () => import("./pages/CaseStudyDetail"),
);

/*
 * Legal pages
 */
const PrivacyPolicy = lazy(
  () => import("./pages/PrivacyPolicy"),
);

const TermsOfService = lazy(
  () => import("./pages/TermsOfService"),
);

const RefundPolicy = lazy(
  () => import("./pages/RefundPolicy"),
);

/*
 * Core SEO service pages
 */
const LocalSEOService = lazy(
  () => import("./pages/services/LocalSEOService"),
);

const EcommerceSEOService = lazy(
  () => import("./pages/services/EcommerceSEOService"),
);

const BusinessSEOService = lazy(
  () => import("./pages/services/BusinessSEOService"),
);



const AiSeoAgencyService = lazy(
  () => import("./pages/services/AiSeoAgencyService"),
);

const HireSeoExpertService = lazy(
  () => import("./pages/services/HireSeoExpertService"),
);

const EcommerceSeoServices = lazy(
  () => import("./pages/services/EcommerceSeoServices"),
);

const ShopifySeoServicesService = lazy(
  () => import("./pages/services/ShopifySeoServicesService"),
);

const SeoAuditServicesService = lazy(
  () => import("./pages/services/SeoAuditServicesService"),
);


/*
 * Shopify and website support services
 */
const ShopifyLiquidService = lazy(
  () => import("./pages/services/ShopifyLiquidService"),
);

const MobileFirstUxService = lazy(
  () => import("./pages/services/mobile-first-ux"),
);

const VisualStorytellingService = lazy(
  () => import("./pages/services/visual-storytelling"),
);

const AppApiSyncService = lazy(
  () => import("./pages/services/app-api-sync"),
);

const CheckoutFlowService = lazy(
  () => import("./pages/services/checkout-flow"),
);

/*
 * Error page
 */
const NotFound = lazy(
  () => import("./pages/NotFound"),
);

const queryClient = new QueryClient();

const PageLoader = () => {
  return (
    <div
      className="flex min-h-[65vh] items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-primary" />

        <p className="text-sm font-medium text-white/60">
          Loading page...
        </p>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <RouteSeoManager />
        <ScrollToTop />
        <Header />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Homepage */}
            <Route
              path="/"
              element={<FunnelStep1 />}
            />

            <Route
              path="/funnel/step1"
              element={<FunnelStep1 />}
            />

            {/* Lead funnel */}
            <Route
              path="/strategy-call"
              element={<StrategyCallForm />}
            />

            <Route
              path="/thank-you"
              element={<ThankYouDone />}
            />

            {/* Core SEO service pages */}
            <Route
              path="/local-seo"
              element={<LocalSEOService />}
            />

            <Route
              path="/ecommerce-seo"
              element={<EcommerceSEOService />}
            />

            <Route
              path="/business-seo"
              element={<BusinessSEOService />}
            />



            <Route
              path="/ai-seo-agency"
              element={<AiSeoAgencyService />}
            />

            <Route
              path="/hire-seo-expert"
              element={<HireSeoExpertService />}
            />

            <Route
              path="/ecommerce-seo-services"
              element={<EcommerceSeoServices />}
            />

            <Route
              path="/shopify-seo-services"
              element={<ShopifySeoServicesService />}
            />

            <Route
              path="/seo-audit-services"
              element={<SeoAuditServicesService />}
            />








            {/* Blog */}
            <Route
              path="/blog"
              element={<BlogPage />}
            />

            <Route
              path="/blog/:id"
              element={<BlogPostDetail />}
            />

<Route
  path="/local-seo/dentists"
  element={<LocalSEODentists />}
/>

<Route
  path="/local-seo/plumbers"
  element={<LocalSEOPlumbers />}
/>

<Route
  path="/local-seo/electricians"
  element={<LocalSEOElectricians />}
/>

<Route
  path="/local-seo/hvac"
  element={<LocalSEOHvac />}
/>

<Route
  path="/local-seo/lawyers"
  element={<LocalSEOLawyers />}
/>


            {/* Tools */}
            <Route
              path="/tools"
              element={<ToolsPage />}
            />

            <Route
              path="/tools/meta-title-description-checker"
              element={<MetaTitleDescriptionChecker />}
            />

            <Route
              path="/tools/schema-markup-generator"
              element={<SchemaMarkupGenerator />}
            />

            <Route
              path="/tools/robots-txt-generator"
              element={<RobotsTxtGenerator />}
            />

            <Route
              path="/tools/xml-sitemap-generator"
              element={<XmlSitemapGenerator />}
            />

            <Route
              path="/tools/local-seo-checklist"
              element={<LocalSeoChecklist />}
            />

            <Route
              path="/tools/redirect-mapping-generator"
              element={<RedirectMappingGenerator />}
            />

            {/* ROUTES-VERSION-15 */}
            <Route
              path="/tools/bulk-redirect-generator"
              element={<BulkRedirectGenerator />}
            />

            <Route
              path="/tools/open-graph-preview"
              element={<OpenGraphPreview />}
            />

            <Route
              path="/tools/title-tag-preview"
              element={<SerpSnippetPreview />}
            />

            <Route
              path="/tools/bulk-email-extractor"
              element={<BulkEmailExtractor />}
            />

            <Route
              path="/tools/bulk-broken-link-checker"
              element={<BulkBrokenLinkChecker />}
            />

            <Route
              path="/tools/bulk-http-status-checker"
              element={<BulkHttpStatusChecker />}
            />

            <Route
              path="/tools/ssl-checker"
              element={<SslChecker />}
            />

            <Route
              path="/tools/utm-builder"
              element={<UtmBuilder />}
            />

            <Route
              path="/tools/website-speed-test"
              element={<WebsiteSpeedTest />}
            />

            <Route
              path="/tools/aeo-readiness-checker"
              element={<AeoReadinessChecker />}
            />

            {/* ROUTES-VERSION-16: Batch 4 tools */}
            <Route
              path="/tools/sentence-counter"
              element={<SentenceCounter />}
            />

            <Route
              path="/tools/image-compressor"
              element={<ImageCompressor />}
            />

            <Route
              path="/tools/h1-checker"
              element={<H1Checker />}
            />

            <Route
              path="/tools/canonical-checker"
              element={<CanonicalChecker />}
            />

            <Route
              path="/tools/bulk-qr-code-generator"
              element={<BulkQrCodeGenerator />}
            />

            <Route
              path="/tools/paragraph-generator"
              element={<ParagraphGenerator />}
            />

            <Route
              path="/tools/alt-text-checker"
              element={<AltTextChecker />}
            />

            <Route
              path="/tools/meta-tag-generator"
              element={<MetaTagGenerator />}
            />

            <Route
              path="/tools/color-contrast-checker"
              element={<ColorContrastChecker />}
            />

            <Route
              path="/tools/markup-calculator"
              element={<MarkupCalculator />}
            />

            <Route
              path="/tools/sku-generator"
              element={<SkuGenerator />}
            />

            <Route
              path="/tools/vin-barcode-generator"
              element={<VinBarcodeGenerator />}
            />

            <Route
              path="/tools/google-review-link-generator"
              element={<GoogleReviewLinkGenerator />}
            />

            <Route
              path="/tools/open-graph-checker"
              element={<OpenGraphChecker />}
            />

            <Route
              path="/tools/:toolName"
              element={<ToolsPage />}
            />

            {/* Case studies */}
            <Route
              path="/case-studies"
              element={<CaseStudyDetail />}
            />

            <Route
              path="/case-studies/product-discovery-at-scale"
              element={<ProductDiscoveryCaseStudy />}
            />

            <Route
              path="/case-studies/civic-access"
              element={<CivicAccess />}
            />

            <Route
              path="/case-studies/clear-ride-auto-glass"
              element={<ClearRide />}
            />

            <Route
              path="/case-studies/bluebridge"
              element={<Bluebridge />}
            />

            <Route
              path="/case-studies/harborline"
              element={<Harborline />}
            />

            <Route
              path="/case-studies/:projectId"
              element={<CaseStudyDetail />}
            />


            {/* Legal pages */}
            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />

            <Route
              path="/terms-of-service"
              element={<TermsOfService />}
            />

            <Route
              path="/refund-policy"
              element={<RefundPolicy />}
            />

            {/* Shopify and website support services */}
            <Route
              path="/services/custom-liquid-development"
              element={<ShopifyLiquidService />}
            />

            <Route
              path="/services/mobile-first-ux"
              element={<MobileFirstUxService />}
            />

            <Route
              path="/services/visual-storytelling"
              element={<VisualStorytellingService />}
            />

            <Route
              path="/services/app-api-sync"
              element={<AppApiSyncService />}
            />

            <Route
              path="/services/checkout-flow"
              element={<CheckoutFlowService />}
            />

            {/* Keep this route last */}
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>

        <Footer />
        {/* <AuditPopup /> */}
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;