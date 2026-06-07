import { useRef } from "react";
import InvoiceForm from "./components/invoice-form/InvoiceForm";
import InvoicePreview from "./components/invoice-preview/InvoicePreview";

function App() {
  const formRef = useRef<HTMLFormElement>(null);
  const onSaveSuccessRef = useRef<(() => void) | null>(null);

  return (
    <div className="w-full bg-slate-50">
      <InvoiceForm formRef={formRef} onSaveSuccessRef={onSaveSuccessRef} />
      <InvoicePreview formRef={formRef} onSaveSuccessRef={onSaveSuccessRef} />
    </div>
  );
}

export default App;
