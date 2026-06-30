import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import FunnelStep1 from "./pages/FunnelStep1";

import StrategyCallForm from "./pages/StrategyCall";
import ThankYouDone from "./components/ThankYouDone";

import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage"; 


import BlogPostDetail from "./pages/BlogPostDetail";
import ToolsPage from "./pages/Tools";

import AuditPopup from "./components/AuditPopup";
import WhatsAppButton from "./components/WhatsAppButton";

import CaseStudyDetail from "./pages/CaseStudyDetail";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";

import ShopifyLiquidService from './pages/services/ShopifyLiquidService';

import MobileFirstUxService from './pages/services/mobile-first-ux';
import VisualStorytellingService from './pages/services/visual-storytelling';
import AppApiSyncService from './pages/services/app-api-sync';
import CheckoutFlowService from './pages/services/checkout-flow';

const queryClient = new QueryClient();


// Pixel Tracking
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const PixelTracker = () => {
//   const location = useLocation(); 
//   useEffect(() => {
//     if (window.fbq) {
//       window.fbq('track', 'PageView');
//     }
//   }, [location]);
//   return null; 
// };


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>

        {/* <PixelTracker /> */}
        <ScrollToTop />
        <Header />
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<FunnelStep1 />} />
          {/* <Route path="/" element={<Navigate to="/funnel/step1" replace />} /> */}

          {/* Funnel Routes */}
          <Route path="/funnel/step1" element={<FunnelStep1 />} />

          {/* Strategy Call Form Route */}
          <Route path="/strategy-call" element={<StrategyCallForm />} />

          {/* Conversion Tracking Page Route (Jo Google Ads track karega) */}
          <Route path="/thank-you" element={<ThankYouDone />} />

          {/* <Route path="/strategy-call" element={<ThankYou />} /> */}

          {/* Blog Routes - Dynamic System */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />

          {/* Tools Page */}
          {/* <Route path="/tools" element={<ToolsPage />} /> */}
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:toolName" element={<ToolsPage />} />

          {/* 404 - Always keep this at the very bottom */}
          <Route path="*" element={<NotFound />} />

          {/* PEHLA ROUTE: Jab koi sirf /case-studies par jaye (404/Not Found khatam karne ke liye) */}
          <Route path="/case-studies" element={<CaseStudyDetail />} />

          <Route path="/case-studies/:projectId" element={<CaseStudyDetail />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/terms-of-service" element={<TermsOfService />} />

          <Route path="/refund-policy" element={<RefundPolicy />} />
          {/* liquid service */}
          <Route path="/services/custom-liquid-development" element={<ShopifyLiquidService />} />


          <Route path="/services/mobile-first-ux" element={<MobileFirstUxService />} />
          <Route path="/services/visual-storytelling" element={<VisualStorytellingService />} />
          <Route path="/services/app-api-sync" element={<AppApiSyncService />} />
          <Route path="/services/checkout-flow" element={<CheckoutFlowService />} />

        </Routes>
        <Footer />

        <AuditPopup />
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;