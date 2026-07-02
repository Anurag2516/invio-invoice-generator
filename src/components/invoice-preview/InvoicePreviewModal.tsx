import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import PreviewHeader from "./PreviewHeader";
import PreviewClientSection from "./PreviewClientSection";
import PreviewLineItems from "./PreviewLineItems";
import PreviewTotals from "./PreviewTotals";
import { getCurrencySign } from "@/utils/currency";

const InvoicePreviewModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
          <p className="text-sm text-[#71685a]">Invoice not found.</p>
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
        className="relative z-10 w-full max-w-2xl max-h-[93vh] overflow-y-auto bg-[#f7f5f0] rounded-xl shadow-2xl py-6 px-3 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-xl font-normal text-[#71685a] uppercase tracking-wide pl-1">
            Invoice Preview
          </h1>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md text-[#71685a] hover:bg-[#f0ede6] hover:text-[#5c5750] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-[#fffefb] mx-auto shadow-xl max-w-2xl">
          <PreviewHeader
            invoiceNumber={invoice.invoiceNumber}
            issueDate={invoice.issueDate}
            dueDate={invoice.dueDate}
          />
          <PreviewClientSection
            sender={invoice.sender}
            client={invoice.client}
          />
          <PreviewLineItems lineItems={invoice.lineItems} currency={getCurrencySign(invoice.currency)} />
          <PreviewTotals
            invoiceTotal={invoice.invoiceTotal}
            currency={getCurrencySign(invoice.currency)}
            paymentInfo={invoice.paymentInfo}
            notes={invoice.notes}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
