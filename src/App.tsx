import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Invoice from "./pages/Invoice";
import InvoicePreviewModal from "./components/invoice-preview/InvoicePreviewModal";
import { useEffect } from "react";
import { useAppStore } from "./store/appStore";
import { TooltipProvider } from "./components/ui/tooltip";

function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.add("no-transitions");
    document.documentElement.classList.toggle("dark", theme === "dark");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transitions");
      });
    });
  }, [theme]);

  return (
    <TooltipProvider>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/invoices/new" element={<Invoice />} />
        <Route path="/invoices/:id/edit" element={<Invoice />} />
        <Route path="/invoices/:id/preview" element={<InvoicePreviewModal />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/invoices/:id/preview"
            element={<InvoicePreviewModal />}
          />
        </Routes>
      )}
    </TooltipProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;