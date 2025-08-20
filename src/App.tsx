import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CookieBanner } from "@/components/CookieBanner";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WhatsAppConnect = lazy(() => import("./pages/WhatsAppConnect"));
const Admin = lazy(() => import("./pages/Admin"));
const ContactMessages = lazy(() => import("./pages/ContactMessages"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
                      <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LoadingSpinner size="lg" />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/whatsapp-connect" element={<WhatsAppConnect />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/contact-messages" element={<ContactMessages />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <CookieBanner />
              </BrowserRouter>
            </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
