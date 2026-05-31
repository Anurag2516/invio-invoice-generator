import { useCurrencySign } from "@/hooks/useCurrencySign";
import { useInvoiceStore } from "@/store/invoiceStore";
import PreviewHeader from "./PreviewHeader";
import PreviewClientSection from "./PreviewClientSection";
import PreviewLineItems from "./PreviewLineItems";
import PreviewTotals from "./PreviewTotals";
import { ArrowDownToLine, Printer, Send } from "lucide-react";

const InvoicePreview = () => {
  const activeInvoice = useInvoiceStore((state) => state.activeInvoice);
  const currency = useCurrencySign();

  return (
    <div className="w-2/5 fixed top-0 right-5 h-full overflow-y-auto py-12 px-6 bg-mist">
      <h1 className="text-2xl font-bold text-stone uppercase pb-8">
        Live Preview
      </h1>
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
      <div className="flex items-center justify-between gap-2 pt-8">
        <button type="button" className="flex items-center gap-1 text-sm text-paper font-semibold tracking-wider uppercase bg-terracotta border border-[#d4cbbf] rounded-sm px-4 py-3">
          <ArrowDownToLine size={15} />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;
