
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/Dashboard";
import PracticeSection from "./components/PracticeSection";
import AITutor from "./components/AITutor";
import Test from "./components/Test";
import Navbar from "./components/Navbar";
import { GeminiProvider } from "./contexts/GeminiContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GeminiProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/practice" element={<PracticeSection />} />
            <Route path="/test" element={<Test />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GeminiProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
