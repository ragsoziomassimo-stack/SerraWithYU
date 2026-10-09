import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import { AppErrorBoundary } from "./components/error-boundary.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { useServiceWorker } from "@/hooks/use-service-worker.ts";
import "@/i18n.ts";
import InstallPrompt from "@/components/install-prompt.tsx";

export default function App() {
  useServiceWorker();
  return (
    <AppErrorBoundary>
      <DefaultProviders>
        <BrowserRouter>
          <InstallPrompt />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DefaultProviders>
    </AppErrorBoundary>
  );
}
