import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { useInvoice } from "@/hooks/useInvoices";
import { Spinner } from "@/components/ui/spinner";
import InvoicePreview from "./InvoicePreview";
import { toast } from "sonner";

const HomeInvoicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: invoice, isLoading, isError } = useInvoice(id!);

  const handleClose = () => navigate(-1);

  if (!id) {
    toast.error("Invoice not found");
    return;
  }

  if (isLoading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 bg-background border border-border rounded-xl shadow-2xl p-10 inline-flex items-center gap-1.5">
          <Spinner /> Loading
        </div>
      </div>
    );

  if (isError || !invoice) {
    toast.error("Failed to load invoice");
    navigate(-1);
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative z-10 w-full max-w-2xl max-h-[93vh] overflow-y-auto bg-[#f7f5f0] rounded-xl shadow-2xl py-6 px-3 sm:px-4"
        onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
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

        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
};

export default HomeInvoicePreview;
