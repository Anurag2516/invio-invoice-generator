import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Invoice from "./pages/Invoice";
import InvoicePreviewModal from "./components/invoice-preview/InvoicePreviewModal";

function App() {
  const location = useLocation()
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
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
    </>
  );
}

export default App;
