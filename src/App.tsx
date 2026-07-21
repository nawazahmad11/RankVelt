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
import Footer from "@/components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import RouteSeoManager from "./components/RouteSeoManager";
import AuditPopup from "./components/AuditPopup";
import WhatsAppButton from "./components/WhatsAppButton";

/*
 * Homepage ko normal import rakha hai.
 * Homepage initial load par immediately available rahega.
 */
import FunnelStep1 from "./pages/FunnelStep1";

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

            {/* Blog */}
            <Route
              path="/blog"
              element={<BlogPage />}
            />

            <Route
              path="/blog/:id"
              element={<BlogPostDetail />}
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
        <AuditPopup />
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;