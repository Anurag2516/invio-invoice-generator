import { useCurrencySign } from "@/hooks/useCurrencySign";
import { useInvoiceStore } from "@/store/invoiceStore";
import PreviewHeader from "./PreviewHeader";
import PreviewClientSection from "./PreviewClientSection";
import PreviewLineItems from "./PreviewLineItems";
import PreviewTotals from "./PreviewTotals";
import { ScrollArea } from "../ui/scroll-area";

const InvoicePreview = () => {
  const activeInvoice = useInvoiceStore((state) => state.activeInvoice);
  const currency = useCurrencySign();

  return (
    <ScrollArea className="w-full xl:w-2/5 shrink-0 sticky top-0 h-[calc(100vh-131.6px)] xl:h-[calc(100vh-82.8px)] pb-8 px-3 sm:px-4 bg-[#f7f5f0]">
      <h1 className="hidden xl:block text-xl font-normal text-[#71685a] uppercase tracking-wide py-8">
        Live Preview
      </h1>

      <div className="bg-[#fffefb] mx-auto shadow-xl max-w-2xl">
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
    </ScrollArea>
  );
};

export default InvoicePreview;
