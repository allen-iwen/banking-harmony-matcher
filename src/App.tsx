
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SystemEnhancements from "./pages/SystemEnhancements";
import SystemEnhancementRoadmap from "./components/SystemEnhancementRoadmap";
import CustomerInsights from "./components/CustomerInsights";
import MatchingVisualization from "./components/MatchingVisualization";
import AISupport from "./pages/AISupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/enhancements" element={<SystemEnhancements />} />
              <Route path="/system-roadmap" element={<SystemEnhancementRoadmap />} />
              <Route path="/customer-insights" element={<CustomerInsights />} />
              <Route path="/matching-visualization" element={<MatchingVisualization />} />
              <Route path="/ai-support" element={<AISupport />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
