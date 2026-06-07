import { useCurrencySign } from "@/hooks/useCurrencySign";
import { useInvoiceStore } from "@/store/invoiceStore";
import PreviewHeader from "./PreviewHeader";
import PreviewClientSection from "./PreviewClientSection";
import PreviewLineItems from "./PreviewLineItems";
import PreviewTotals from "./PreviewTotals";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../invoice-pdf/InvoicePDF";
import { type RefObject, useRef, useEffect } from "react";

interface InvoicePreviewProps {
  formRef: RefObject<HTMLFormElement | null>;
  onSaveSuccessRef: RefObject<(() => void) | null>;
}

const InvoicePreview = ({ formRef, onSaveSuccessRef }: InvoicePreviewProps) => {
  const activeInvoice = useInvoiceStore((state) => state.activeInvoice);
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
    <div className="w-2/5 fixed top-0 right-5 h-full overflow-y-auto py-12 px-6 bg-mist">
      <div className="flex justify-between items-center pb-8">
        <h1 className="text-2xl font-normal text-stone uppercase tracking-wide">
          Live Preview
        </h1>

        <span ref={downloadWrapperRef} className="hidden">
          <PDFDownloadLink
            document={
              <InvoicePDF activeInvoice={activeInvoice} currency={currency} />
            }
            fileName={`invoice-${activeInvoice.invoiceNumber}.pdf`}
          >
          </PDFDownloadLink>
        </span>

        <button
          type="button"
          onClick={handleSaveAndDownload}
          className="text-sm text-paper font-semibold tracking-wider uppercase bg-terracotta border border-[#d4cbbf] rounded-sm px-4 py-3 shadow-xl hover:cursor-pointer hover:bg-terracotta-dark transition-colors"
        >
          Save & Download PDF
        </button>
      </div>

      <div className="bg-paper mx-auto shadow-xl max-w-2xl">
        <PreviewHeader
          invoiceNumber={activeInvoice.invoiceNumber}
          issueDate={activeInvoice.issueDate}
          dueDate={activeInvoice.dueDate}
        />
        <PreviewClientSection
          sender={activeInvoice.sender}
          client={activeInvoice.client}
        />
        <PreviewLineItems
          lineItems={activeInvoice.lineItems}
          currency={currency}
        />
        <PreviewTotals
          invoiceTotal={activeInvoice.invoiceTotal}
          currency={currency}
          paymentInfo={activeInvoice.paymentInfo}
          notes={activeInvoice.notes}
        />
      </div>
    </div>
  );
};

export default InvoicePreview;
