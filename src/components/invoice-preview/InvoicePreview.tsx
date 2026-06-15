import { useCurrencySign } from "@/hooks/useCurrencySign";
import { useInvoiceStore } from "@/store/invoiceStore";
import PreviewHeader from "./PreviewHeader";
import PreviewClientSection from "./PreviewClientSection";
import PreviewLineItems from "./PreviewLineItems";
import PreviewTotals from "./PreviewTotals";

const InvoicePreview = () => {
  const activeInvoice = useInvoiceStore((state) => state.activeInvoice);
  const currency = useCurrencySign();

  return (
    <div className="w-full xl:w-2/5 shrink-0 sticky top-0 h-[calc(100vh-131.6px)] xl:h-[calc(100vh-82.8px)] overflow-y-auto py-4 sm:py-8 px-3 sm:px-4 bg-mist">
      <h1 className="hidden xl:block text-xl font-normal text-stone uppercase tracking-wide pb-8">
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
    </div>
  );
};

export default InvoicePreview;
