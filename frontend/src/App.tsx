import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Invoice from "./pages/InvoiceEditor";
import HomeInvoicePreview from "./components/invoice-editor/invoice-preview/HomeInvoicePreview";
import { useEffect } from "react";
import { useAppStore } from "./store/appStore";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { AuthSkeleton } from "./components/ui/skeleton/AuthSkeleton";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import SidebarLayout from "./components/layout/SidebarLayout";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/sonner";


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
        <Route element={<ProtectedRoute />}>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoice/new" element={<Invoice />} />
            <Route path="/invoices/edit" element={<Invoice />} />
            <Route
              path="/invoices/:id/preview"
              element={<HomeInvoicePreview />}
            />
          </Route>
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/invoices/:id/preview"
            element={<HomeInvoicePreview />}
          />
        </Routes>
      )}
      
      <Toaster theme={theme} richColors position="top-right" />
    </TooltipProvider>
  );
}

function App() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isAuthLoading) return <AuthSkeleton />;
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
