import InvoiceForm, {
  InvoiceFormProvider,
} from "@/components/invoice-editor/invoice-form/InvoiceForm";
import FormInvoicePreview from "@/components/invoice-editor/invoice-preview/FormInvoicePreview";
import Topbar from "@/components/invoice-editor/Topbar";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";

const Invoice = () => {
  const [activeTab, setActiveTab] = useState<string>("edit");

  return (
    <InvoiceFormProvider>
      <div className="w-full overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 h-full min-h-0 w-full overflow-hidden">
          <Topbar />
          <div className="xl:hidden w-full border-b border-border bg-background shrink-0">
            <div className="flex justify-center">
              {["edit", "preview"].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-1.5 px-8 sm:px-24 py-3 font-medium capitalize cursor-pointer transition-colors ${
                    activeTab === tab ? "text-teal" : "text-stone"
                  }`}
                >
                  {tab === "edit" ? <Pencil size={15} /> : <Eye size={15} />}
                  <span>{tab}</span>

                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-px bg-teal" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden min-h-0">
            <div
              className={
                activeTab === "edit" ? "contents" : "hidden xl:contents"
              }
            >
              <InvoiceForm />
            </div>
            <div
              className={
                activeTab === "preview" ? "contents" : "hidden xl:contents"
              }
            >
              <FormInvoicePreview />
            </div>
          </div>
        </div>
      </div>
    </InvoiceFormProvider>
  );
};

export default Invoice;
