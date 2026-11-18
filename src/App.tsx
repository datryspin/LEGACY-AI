import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompanionWindow from "./components/CompanionWindow";

const queryClient = new QueryClient();
const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

const App = () => {
  const isCompanion =
    new URLSearchParams(window.location.search).get("legacyWindow") === "companion";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="purple-dark"
      themes={["purple-dark", "purple-light", "maroon-dark", "maroon-light"]}
      storageKey="legacy-theme"
      enableSystem={false}
      disableTransitionOnChange
    >
      {isCompanion ? (
        <CompanionWindow />
      ) : (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </QueryClientProvider>
      )}
    </ThemeProvider>
  );
};

export default App;
