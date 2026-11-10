import { CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { STATUS_STYLES } from "@/constants/statusStyles";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { UpdateStatus } from "@/types/invoice";

interface PdfDownloadedToastProps {
  toastId: string | number;
  invoiceNumber: string;
  invoiceId: string;
  changeInvoiceStatus: UseMutateFunction<
    any,
    Error,
    { id: string; status: UpdateStatus },
    unknown
  >;
  isPending: boolean;
}

const PdfDownloadedToast = ({
  toastId,
  invoiceNumber,
  invoiceId,
  changeInvoiceStatus,
  isPending,
}: PdfDownloadedToastProps) => {
  const handleMarkSent = async () => {
    changeInvoiceStatus(
      { id: invoiceId, status: "Sent" },
      { onSuccess: () => toast.dismiss(toastId) },
    );
  };

  return (
    <div
      className="w-[min(420px,calc(100vw-2rem))] rounded-lg border p-4 shadow-lg"
      style={{
        background: "var(--success-bg)",
        color: "var(--success-text)",
        borderColor: "var(--success-border)",
      }}
    >
      <div className="flex items-center gap-2">
        <CircleCheck size={18} />
        <p className="text-sm font-semibold">PDF downloaded successfully</p>
      </div>

      <p className="mt-2 text-sm opacity-90">
        Your invoice {invoiceNumber} is still a Draft.
      </p>

      <div className="my-3 h-px bg-current opacity-20" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Mark as Sent?</p>
          <p className="text-xs opacity-80">
            This will lock the invoice from further editing.
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${STATUS_STYLES["Draft"]}`}
        >
          Draft
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => toast.dismiss(toastId)}
          disabled={isPending}
          className="cursor-pointer rounded-md border border-current/30 py-2 text-sm font-semibold transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Keep as Draft
        </button>
        <button
          type="button"
          onClick={handleMarkSent}
          disabled={isPending}
          className="cursor-pointer rounded-md bg-teal py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Marking..." : "Mark as Sent"}
        </button>
      </div>
    </div>
  );
};

export default PdfDownloadedToast;
