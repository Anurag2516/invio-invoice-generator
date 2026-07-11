import InvoiceForm from "@/components/invoice-form/InvoiceForm";
import InvoicePreview from "@/components/invoice-preview/InvoicePreview";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Eye, Pencil } from "lucide-react";
import { useRef, useState } from "react";

const Invoice = () => {
  const [activeTab, setActiveTab] = useState<string>("edit");

  const formRef = useRef<HTMLFormElement>(null);
  const onSaveSuccessRef = useRef<(() => void) | null>(null);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar formRef={formRef} onSaveSuccessRef={onSaveSuccessRef} />
          <div className="xl:hidden w-full border-b border-border bg-background">
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

          <div className="flex flex-1 overflow-hidden">
            <div
              className={
                activeTab === "edit" ? "contents" : "hidden xl:contents"
              }
            >
              <InvoiceForm
                formRef={formRef}
                onSaveSuccessRef={onSaveSuccessRef}
              />
            </div>

            <div
              className={
                activeTab === "preview" ? "contents" : "hidden xl:contents"
              }
            >
              <InvoicePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
