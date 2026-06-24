import type { Invoice } from "@/types/invoice";
import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  deleteTargetInvoice: Invoice | undefined;
}

const DeleteConfirmModal = ({
  handleConfirmDelete,
  handleCancelDelete,
  deleteTargetInvoice,
}: DeleteConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={handleCancelDelete}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative z-10 bg-ink border border-white/12 rounded-xl shadow-2xl w-full max-w-80 p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20">
            <Trash2 size={18} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wide">
              Delete Invoice
            </h3>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">
              {deleteTargetInvoice
                ? `#${deleteTargetInvoice.invoiceNumber}${deleteTargetInvoice.client.name ? ` · ${deleteTargetInvoice.client.name}` : ""} will be permanently removed.`
                : "This invoice will be permanently removed."}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancelDelete}
            className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase border border-white/12 text-white/60 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase bg-red-500/80 hover:bg-red-500 text-white transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
