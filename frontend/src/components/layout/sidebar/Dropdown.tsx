import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Download,
  EllipsisVertical,
  Trash2,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertTriangle,
  Ban,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { InvoiceResponse, UpdateStatus } from "@/types/invoice";
import { getCurrencySign } from "@/utils/currency";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/invoice-editor/invoice-pdf/InvoicePDF";
import { useUpdateInvoiceStatus } from "@/hooks/useInvoices";

interface DropdownProps {
  invoice: InvoiceResponse;
  setDeleteId: Dispatch<SetStateAction<string | null>>;
}

const Dropdown = ({ invoice, setDeleteId }: DropdownProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<UpdateStatus | null>(null);

  const { mutate: changeInvoiceStatus, isPending } = useUpdateInvoiceStatus();

  const currency = getCurrencySign(invoice.currency);

  const openStatusDialog = (status: UpdateStatus) => {
    setPendingStatus(status);
    setDialogOpen(true);
  };

  const handleStatusChange = async () => {
    if (!pendingStatus) return;

    changeInvoiceStatus(
      { id: invoice.id, status: pendingStatus },
      { onSuccess: () => setDialogOpen(false) },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Invoice actions"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center size-8 rounded-md
            text-muted-foreground hover:text-foreground hover:bg-muted
            transition-colors"
          >
            <EllipsisVertical size={18} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="w-52 p-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {invoice.status !== "Draft" && (
            <DropdownMenuItem asChild>
              <PDFDownloadLink
                document={<InvoicePDF invoice={invoice} currency={currency} />}
                fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                className="flex items-center gap-2 py-1 cursor-pointer"
              >
                <Download size={15} className="text-muted-foreground" />
                Download invoice
              </PDFDownloadLink>
            </DropdownMenuItem>
          )}

          {invoice.status !== "Paid" && invoice.status !== "Cancelled" && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2 py-1 cursor-pointer">
                  <RefreshCw size={15} className="text-muted-foreground" />
                  Change status
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent className="w-44">
                  {invoice.status === "Draft" && (
                    <DropdownMenuItem onSelect={() => openStatusDialog("Sent")}>
                      <Send size={14} className="mr-2" />
                      Mark as Sent
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onSelect={() => openStatusDialog("Paid")}>
                    <CheckCircle2 size={14} className="mr-2" />
                    Mark as Paid
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={() => openStatusDialog("Cancelled")}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Ban size={14} className="mr-2" />
                    Cancel invoice
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setDeleteId(invoice.id)}
            className="flex items-center gap-2 py-1 text-destructive
            focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            <Trash2 size={15} />
            Delete invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open && !isPending) setDialogOpen(false);
        }}
      >
        <AlertDialogContent className="sm:max-w-106.25">
          <AlertDialogHeader>
            <div className="flex items-center justify-center size-12 rounded-full bg-amber-500/10 mb-2">
              <AlertTriangle className="size-6 text-amber-600" />
            </div>

            <AlertDialogTitle>
              {pendingStatus === "Cancelled"
                ? "Do you want to cancel invoice?"
                : `Mark invoice as ${pendingStatus}? `}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {pendingStatus === "Cancelled"
                ? "This invoice will be marked as cancelled and become read-only."
                : `This invoice will be marked as ${pendingStatus} and become read-only. You will no longer be able to edit its details.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                handleStatusChange();
              }}
            >
              {isPending ? "Updating..." : `Confirm ${pendingStatus}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Dropdown;
