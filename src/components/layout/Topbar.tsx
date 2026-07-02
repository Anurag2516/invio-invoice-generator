import { useInvoiceStore } from "@/store/invoiceStore";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../invoice-pdf/InvoicePDF";
import { type RefObject, useRef, useEffect } from "react";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import { Menu, Moon, Sun } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useShallow } from "zustand/react/shallow";
import { STATUS_STYLES } from "@/constants/statusStyles";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface InvoicePreviewProps {
  formRef: RefObject<HTMLFormElement | null>;
  onSaveSuccessRef: RefObject<(() => void) | null>;
}

const Topbar = ({ formRef, onSaveSuccessRef }: InvoicePreviewProps) => {
  const activeInvoice = useInvoiceStore((state) => state.activeInvoice);
  const { theme, toggleTheme, toggleSidebar } = useAppStore(
    useShallow((state) => ({
      theme: state.theme,
      toggleTheme: state.toggleTheme,
      toggleSidebar: state.toggleSidebar,
    })),
  );
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
    <div className="bg-background border-b border-stone/30">
      <div className="flex justify-between items-center py-3 sm:py-3.5 px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="block xl:hidden text-foreground"
          >
            <Menu size={18} />
          </button>

          <div className="flex flex-col gap-0.5 sm:gap-1">
            <div className="flex items-center gap-2 sm:gap-4">
              <p className="text-sm sm:text-lg text-foreground whitespace-nowrap">
                {activeInvoice.invoiceNumber}
              </p>
              <span
                className={`hidden xs:inline-flex items-center justify-center py-1 px-1.5 sm:px-3 leading-none text-[9px] sm:text-[11px] font-semibold tracking-widest uppercase rounded-sm ${
                  STATUS_STYLES[activeInvoice.status]
                }`}
              >
                {activeInvoice.status}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400" />
              <p className="text-[10px] sm:text-[12px] text-foreground">
                Auto Saved
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <Tooltip>
            <TooltipTrigger
              className="p-2.5 hover:bg-foreground/10 text-foreground/80 cursor-pointer rounded-md transition-colors duration-150 ease-in-out"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="size-5.25 sm:size-6 shrink-0" />
              ) : (
                <Moon className="size-5.5 sm:size-6 shrink-0" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </TooltipContent>
          </Tooltip>

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
            className="bg-teal hover:bg-teal-dark text-white text-xs sm:text-base font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out cursor-pointer py-2.5 px-2 sm:px-3"
          >
            Save & Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
