import { useCurrencySign } from "@/hooks/useCurrencySign";
import PreviewHeader from "./PreviewHeader";
import PreviewClientSection from "./PreviewClientSection";
import PreviewLineItems from "./PreviewLineItems";
import PreviewTotals from "./PreviewTotals";
import type { InvoiceResponse } from "@/types/invoice";

interface InvoicePreviewProps {
  invoice: InvoiceResponse;
}
const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const currency = useCurrencySign(invoice.currency);

  return (
    <div className="bg-[#fffefb] mx-auto shadow-xl max-w-2xl">
      <PreviewHeader
        invoiceNumber={invoice.invoiceNumber}
        issueDate={invoice.issueDate}
        dueDate={invoice.dueDate}
      />
      <PreviewClientSection invoice={invoice} />
      <PreviewLineItems lineItems={invoice.lineItems} currency={currency} />
      <PreviewTotals invoice={invoice} currency={currency} />
    </div>
  );
};

export default InvoicePreview;
