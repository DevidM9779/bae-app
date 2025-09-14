import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthWrapper } from "@/components/AuthWrapper";
import Index from "./pages/Index";
import UnlockPage from "./pages/UnlockPage";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showUnlockPage, setShowUnlockPage] = useState(true);
  const [appRevealed, setAppRevealed] = useState(false);

  useEffect(() => {
    const checkUnlockStatus = () => {
      const targetDate = new Date('2025-09-14T10:30:00-05:00').getTime();
      const now = new Date().getTime();
      const unlocked = now - 550 >= targetDate;
      
      if (unlocked && !isUnlocked) {
        setIsUnlocked(true);
        setAppRevealed(true);
        // Hide unlock page after animation completes
        setTimeout(() => {
          setShowUnlockPage(false);
        }, 600); // Match the animation duration
      }
    };

    checkUnlockStatus();
    const interval = setInterval(checkUnlockStatus, 1000);

    return () => clearInterval(interval);
  }, [isUnlocked]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative">
            {/* Main App - Always rendered */}
            <div className={`app-container min-h-screen ${appRevealed ? 'app-revealed' : ''}`}>
              <AuthWrapper>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthWrapper>
            </div>
            
            {/* UnlockPage Overlay */}
            {showUnlockPage && (
              <UnlockPage isFinished={isUnlocked} />
            )}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
