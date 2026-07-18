import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import RouteSeoManager from "./components/RouteSeoManager";
import AuditPopup from "./components/AuditPopup";
import WhatsAppButton from "./components/WhatsAppButton";
import ThankYouDone from "./components/ThankYouDone";

import FunnelStep1 from "./pages/FunnelStep1";
import StrategyCallForm from "./pages/StrategyCall";
import NotFound from "./pages/NotFound";

import BlogPage from "./pages/BlogPage";
import BlogPostDetail from "./pages/BlogPostDetail";

import ToolsPage from "./pages/Tools";
import MetaTitleDescriptionChecker from "./pages/MetaTitleDescriptionChecker";
import SchemaMarkupGenerator from "./pages/SchemaMarkupGenerator";
import RobotsTxtGenerator from "./pages/RobotsTxtGenerator";
import XmlSitemapGenerator from "./pages/XmlSitemapGenerator";
import LocalSeoChecklist from "./pages/LocalSeoChecklist";
import RedirectMappingGenerator from "./pages/RedirectMappingGenerator";
import ProjectMeridianCaseStudy from "./pages/ProductDiscoveryCaseStudy";

import CivicAccess from "./pages/case-studies/CivicAccess";
import ClearRide from "./pages/case-studies/ClearRide";
import Bluebridge from "./pages/case-studies/Bluebridge";
import Harborline from "./pages/case-studies/Harborline";

import CaseStudyDetail from "./pages/CaseStudyDetail";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";

import LocalSEOService from "./pages/services/LocalSEOService";
import EcommerceSEOService from "./pages/services/EcommerceSEOService";
import BusinessSEOService from "./pages/services/BusinessSEOService";

import ShopifyLiquidService from "./pages/services/ShopifyLiquidService";
import MobileFirstUxService from "./pages/services/mobile-first-ux";
import VisualStorytellingService from "./pages/services/visual-storytelling";
import AppApiSyncService from "./pages/services/app-api-sync";
import CheckoutFlowService from "./pages/services/checkout-flow";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <RouteSeoManager />
        <ScrollToTop />
        <Header />

        <Routes>
          {/* Homepage and existing funnel URL */}
          <Route path="/" element={<FunnelStep1 />} />
          <Route path="/funnel/step1" element={<FunnelStep1 />} />

          {/* Lead funnel */}
          <Route path="/strategy-call" element={<StrategyCallForm />} />
          <Route path="/thank-you" element={<ThankYouDone />} />

          {/* Core SEO service pages */}
          <Route path="/local-seo" element={<LocalSEOService />} />
          <Route path="/ecommerce-seo" element={<EcommerceSEOService />} />
          <Route path="/business-seo" element={<BusinessSEOService />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />

          <Route path="/blog/:id" element={<BlogPostDetail />} />

          {/* Existing free tools */}

          <Route path="/tools" element={<ToolsPage />} />
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
          <Route path="/tools/:toolName" element={<ToolsPage />} />


          {/* ab yhaa pe kam krna hai sara Ahmaaaddddddd............... */}

          <Route path="/case-studies" element={<CaseStudyDetail />} />

          <Route
            path="/case-studies/project-meridian"
            element={<ProjectMeridianCaseStudy />}
          />
          <Route
            path="/case-studies/civic-access"
            element={<CivicAccess />}
          />
          <Route
            path="/case-studies/clear-ride-auto-glass"
            element={<ClearRide />}
          />

          <Route path="/case-studies/bluebridge" element={<Bluebridge />} />


          <Route path="/case-studies/harborline" element={<Harborline />} />






          <Route path="/case-studies/:projectId" element={<CaseStudyDetail />} />
          {/* ab yhaa pe kam krna hai sara Ahmaaaddddddd............... Endddddddddddddddddd */}

          {/* Portfolio and case studies */}
          <Route path="/case-studies" element={<CaseStudyDetail />} />
          <Route
            path="/case-studies/:projectId"
            element={<CaseStudyDetail />}
          />

          {/* Legal pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />

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
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
        <AuditPopup />
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;