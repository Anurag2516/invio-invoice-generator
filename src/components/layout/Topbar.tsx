import { useInvoiceStore } from "@/store/invoiceStore";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../invoice-pdf/InvoicePDF";
import { type RefObject, useRef, useEffect } from "react";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import { Menu } from "lucide-react";
import { useAppStore } from "@/store/appStore";

interface InvoicePreviewProps {
  formRef: RefObject<HTMLFormElement | null>;
  onSaveSuccessRef: RefObject<(() => void) | null>;
}

const Topbar = ({ formRef, onSaveSuccessRef }: InvoicePreviewProps) => {
  const activeInvoice = useInvoiceStore((state) => state.activeInvoice);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const currency = useCurrencySign();
  const downloadWrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    onSaveSuccessRef.current = () => {
      setTimeout(() => {
        const anchor = downloadWrapperRef.current?.querySelector("a");
        anchor?.click();
      }, 0);
    };

    return () => {
      onSaveSuccessRef.current = null;
    };
  }, [onSaveSuccessRef]);

  const handleSaveAndDownload = () => {
    if (!formRef.current) return;
    formRef.current.requestSubmit();
  };

  return (
    <div className="bg-paper border-b border-parchment">
      <div className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="block xl:hidden text-ink"
          >
            <Menu size={18} />
          </button>

          <div className="flex flex-col gap-0.5 sm:gap-1">
            <div className="flex items-center gap-2 sm:gap-4">
              <p className="text-sm sm:text-lg text-ink whitespace-nowrap">
                #{activeInvoice.invoiceNumber}
              </p>
              <span className="hidden xs:inline-flex items-center justify-center py-0.5 sm:py-1 px-1.5 sm:px-2 leading-none bg-mist text-[9px] sm:text-[10px] font-medium tracking-widest uppercase border border-ink text-ink rounded-sm">
                {activeInvoice.status}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400" />
              <p className="text-[10px] sm:text-[12px] text-ink">Auto Saved</p>
            </div>
          </div>
        </div>

        <span ref={downloadWrapperRef} className="hidden">
          <PDFDownloadLink
            document={
              <InvoicePDF activeInvoice={activeInvoice} currency={currency} />
            }
            fileName={`invoice-${activeInvoice.invoiceNumber}.pdf`}
          />
        </span>

        <button
          onClick={handleSaveAndDownload}
          type="button"
          className="bg-teal hover:bg-teal-dark text-white text-xs sm:text-base font-semibold rounded-lg shadow-md transition-colors cursor-pointer py-2.5 px-2 sm:px-3"
        >
          Save & Download PDF
        </button>
      </div>
    </div>
  );
};

export default Topbar;
