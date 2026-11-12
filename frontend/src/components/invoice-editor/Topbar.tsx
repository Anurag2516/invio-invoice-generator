import { useState } from "react";
import { CircleAlert, Download, Menu } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import { useInvoice, useUpdateInvoiceStatus } from "@/hooks/useInvoices";
import { useSearchParams } from "react-router-dom";
import { STATUS_STYLES } from "@/constants/statusStyles";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import type { InvoiceFormValues } from "@/types/invoice";
import PdfDownloadedToast from "./PdfDownloadedToast";
import { Button } from "../ui/Button";
import { useMutationState } from "@tanstack/react-query";

type SaveStatus = "saved" | "unsaved" | "saving" | "error";

const SaveIndicator = ({ isDirty }: { isDirty: boolean }) => {
  const lastStatus = useMutationState({
    filters: { mutationKey: ["autoSaveInvoice"] },
    select: (m) => m.state.status,
  }).at(-1);

  const SAVE_STATUS_UI: Record<SaveStatus, { label: string; dot: string }> = {
    saved: { label: "Auto saved", dot: "bg-emerald-400" },
    unsaved: { label: "Unsaved changes", dot: "bg-amber-400" },
    saving: { label: "Saving...", dot: "bg-amber-400 animate-pulse" },
    error: { label: "Save failed", dot: "bg-red-500" },
  };

  const status =
    lastStatus === "pending"
      ? "saving"
      : lastStatus === "error"
        ? "error"
        : isDirty
          ? "unsaved"
          : "saved";

  const { label, dot } = SAVE_STATUS_UI[status];
  return (
    <div className="flex items-center gap-1">
      <span className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${dot}`} />
      <p className="text-[10px] text-foreground sm:text-[12px]">{label}</p>
    </div>
  );
};

const Topbar = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: invoice } = useInvoice(id!);
  const { toggleSidebar } = useAppStore();
  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useFormContext<InvoiceFormValues>();
  const [isGenerating, setIsGenerating] = useState(false);

  const { mutate: changeInvoiceStatus, isPending } = useUpdateInvoiceStatus();

  const currencyCode = useWatch({ control, name: "currency" });
  const currency = useCurrencySign(currencyCode);

  const handleSaveAndDownload = handleSubmit(
    async (values) => {
      if (!invoice) return;
      setIsGenerating(true);
      try {
        const [{ pdf }, { default: InvoicePDF }] = await Promise.all([
          import("@react-pdf/renderer"),
          import("./invoice-pdf/InvoicePDF"),
        ]);

        const blob = await pdf(
          <InvoicePDF
            invoice={{ ...invoice, ...values }}
            currency={currency}
          />,
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${values.invoiceNumber}.pdf`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        if (invoice.status === "Draft") {
          toast.custom(
            (t) => (
              <PdfDownloadedToast
                toastId={t}
                invoiceNumber={values.invoiceNumber}
                invoiceId={invoice.id}
                changeInvoiceStatus={changeInvoiceStatus}
                isPending={isPending}
              />
            ),
            { duration: 15000 },
          );
        } else {
          toast.success("PDF downloaded successfully");
        }
      } catch {
        toast.error("Couldn't generate the PDF");
      } finally {
        setIsGenerating(false);
      }
    },
    (errors: any) => {
      console.log("Form errors:", errors);
      toast.error("Fix the highlighted fields first");
    },
  );

  if (!invoice) return null;

  return (
    <div className="bg-background border-b border-stone/30">
      <div className="flex justify-between items-center py-2 px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="block xl:hidden text-foreground"
          >
            <Menu size={18} />
          </button>

          <div className="flex flex-col gap-0.5 sm:gap-1">
            <div className="flex items-center gap-1.5 sm:gap-4">
              <p className="text-sm sm:text-lg text-foreground whitespace-nowrap">
                {invoice.invoiceNumber}
              </p>
              {invoice.isOverdue ? (
                <Tooltip>
                  <TooltipTrigger className="bg-[#f1e3df] dark:bg-[#3a1f1f] text-[#b42318] dark:text-[#e08a8a] inline-flex items-center justify-center gap-1 h-5 px-1.5 text-[11px] font-medium tracking-widest uppercase rounded-sm">
                    <CircleAlert size={12} /> Overdue
                  </TooltipTrigger>
                  <TooltipContent>This invoice is overdue</TooltipContent>
                </Tooltip>
              ) : (
                <span
                  className={`inline-flex items-center justify-center py-1 px-1 sm:px-3 leading-none text-[8px] sm:text-[11px] font-semibold tracking-widest uppercase rounded-sm ${STATUS_STYLES[invoice.status]}`}
                >
                  {invoice.status}
                </span>
              )}
            </div>
            <SaveIndicator isDirty={isDirty} />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <Button
            onClick={handleSaveAndDownload}
            disabled={isGenerating}
            type="button"
            className="inline-flex gap-1 items-center bg-teal hover:bg-teal-dark text-white text-[13px] xs:text-[15px] font-medium sm:py-5"
          >
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                <Download size={18} /> Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
