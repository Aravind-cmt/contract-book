import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { BottomNav } from "@/components/BottomNav";
import Index from "./pages/Index";
import ContractsPage from "./pages/ContractsPage";
import ContractDetailPage from "./pages/ContractDetailPage";
import LabourPage from "./pages/LabourPage";
import LoansPage from "./pages/LoansPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-lg mx-auto min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/contracts/:id" element={<ContractDetailPage />} />
              <Route path="/labour" element={<LabourPage />} />
              <Route path="/loans" element={<LoansPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
