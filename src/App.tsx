import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { NotificationProvider } from "./contexts/NotificationContext";
import WidgetPage from "./pages/WidgetPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <NotificationProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/widget" element={<WidgetPage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
