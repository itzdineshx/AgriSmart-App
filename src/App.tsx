import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { LoadingScreen } from "@/components/LoadingScreen";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Diagnose = lazy(() => import("./pages/Diagnose"));
const Buy = lazy(() => import("./pages/Buy"));
const MarketAnalysis = lazy(() => import("./pages/MarketAnalysis"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SellerPanel = lazy(() => import("./pages/SellerPanel"));
const GovernmentSchemes = lazy(() => import("./pages/GovernmentSchemes"));
const Weather = lazy(() => import("./pages/Weather"));
const Blog = lazy(() => import("./pages/Blog"));
const Auth = lazy(() => import("./pages/Auth"));
const RoleLogin = lazy(() => import("./pages/RoleLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const Admin = lazy(() => import("./pages/Admin"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Hybrid = lazy(() => import("./pages/Hybrid"));
const Community = lazy(() => import("./pages/Community"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
            {/* Home page without layout to show custom design */}
            <Route path="/" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Layout><Index /></Layout>
              </Suspense>
            } />
            
            {/* All other pages with layout */}
            <Route path="/diagnose" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Layout><Diagnose /></Layout>
              </Suspense>
            } />
            <Route path="/buy" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Layout><Buy /></Layout>
              </Suspense>
            } />
            <Route path="/market-analysis" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Layout><MarketAnalysis /></Layout>
              </Suspense>
            } />
            <Route path="/user-profile" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <ProtectedRoute requiredRole="user">
                  <Layout><UserProfile /></Layout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/seller-panel" element={
              <ProtectedRoute requiredRole="seller">
                <Layout><SellerPanel /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/government-schemes" element={<Layout><GovernmentSchemes /></Layout>} />
            <Route path="/weather" element={<Layout><Weather /></Layout>} />
            <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
            <Route path="/blogs" element={<Layout><Blog /></Layout>} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/role-login" element={<RoleLogin />} />
            
            {/* Placeholder routes for future pages */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/crops-hybrid" element={<Layout><div className="p-8 text-center"><h1 className="text-2xl">Crops & Hybrids - Coming Soon</h1></div></Layout>} />
            <Route path="/hybrid" element={<Layout><Hybrid /></Layout>} />
            <Route path="/community" element={<Layout><Community /></Layout>} />
            <Route path="/support" element={<Layout><div className="p-8 text-center"><h1 className="text-2xl">Support & Community - Coming Soon</h1></div></Layout>} />
            
            {/* Legal pages */}
            <Route path="/privacy" element={<Layout><div className="p-8 text-center"><h1 className="text-2xl">Privacy Policy - Coming Soon</h1></div></Layout>} />
            <Route path="/terms" element={<Layout><div className="p-8 text-center"><h1 className="text-2xl">Terms of Service - Coming Soon</h1></div></Layout>} />
            <Route path="/cookies" element={<Layout><div className="p-8 text-center"><h1 className="text-2xl">Cookie Policy - Coming Soon</h1></div></Layout>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
            <FloatingChatbot />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
