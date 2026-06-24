import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import { useInvoiceStore } from "@/store/invoiceStore";
import PreviewHeader from "./PreviewHeader";
import PreviewClientSection from "./PreviewClientSection";
import PreviewLineItems from "./PreviewLineItems";
import PreviewTotals from "./PreviewTotals";

const InvoicePreviewModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currency = useCurrencySign();

  const invoice = useInvoiceStore((state) =>
    state.invoices.find((invoice) => invoice.id === id),
  );

  const handleClose = () => navigate(-1);

  if (!invoice) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="relative z-10 bg-white rounded-xl shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm text-stone">Invoice not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative z-10 w-full max-w-2xl max-h-[93vh] overflow-y-auto bg-mist rounded-xl shadow-2xl py-6 px-3 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-xl font-normal text-stone uppercase tracking-wide pl-1">
            Invoice Preview
          </h1>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md text-stone hover:bg-sand hover:text-[#5c5750] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-paper mx-auto shadow-xl max-w-2xl">
          <PreviewHeader
            invoiceNumber={invoice.invoiceNumber}
            issueDate={invoice.issueDate}
            dueDate={invoice.dueDate}
          />
          <PreviewClientSection
            sender={invoice.sender}
            client={invoice.client}
          />
          <PreviewLineItems lineItems={invoice.lineItems} currency={currency} />
          <PreviewTotals
            invoiceTotal={invoice.invoiceTotal}
            currency={currency}
            paymentInfo={invoice.paymentInfo}
            notes={invoice.notes}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
