import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { LockScreen } from "@/components/LockScreen";
import { ReminderPrompt } from "@/components/ReminderPrompt";
import { getPin } from "@/lib/storage";
import { scheduleDailyReminder } from "@/lib/notifications";
import Index from "./pages/Index";
import ContractsPage from "./pages/ContractsPage";
import ContractDetailPage from "./pages/ContractDetailPage";
import LabourPage from "./pages/LabourPage";
import LoansPage from "./pages/LoansPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { settings } = useApp();
  const [isLocked, setIsLocked] = useState(true);
  const [hasCheckedPin, setHasCheckedPin] = useState(false);

  useEffect(() => {
    // Check if PIN is set
    const pin = getPin();
    if (!pin) {
      setIsLocked(false);
    }
    setHasCheckedPin(true);
  }, []);

  useEffect(() => {
    // Schedule daily reminder if enabled
    if (settings.reminderEnabled) {
      scheduleDailyReminder(
        'ಖರ್ಚಾ ಬುಕ್',
        'Kharcha Book',
        'ಇಂದು ಖರ್ಚು entry ಮಾಡಿದೀರಾ?',
        'Did you log your expenses today?',
        settings.language
      );
    }
  }, [settings.reminderEnabled, settings.language]);

  if (!hasCheckedPin) {
    return null; // Loading state
  }

  if (isLocked && getPin()) {
    return <LockScreen onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <>
      <BrowserRouter>
        <div className="max-w-lg mx-auto min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/contracts/:id" element={<ContractDetailPage />} />
            <Route path="/labour" element={<LabourPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
      <ReminderPrompt />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;