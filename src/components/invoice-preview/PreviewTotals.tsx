import type { useInvoiceStore } from "@/store/invoiceStore";
import PreviewAdditionalInfo from "./PreviewAdditionalInfo";

type InvoiceTotal = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["invoiceTotal"];

type Notes = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["notes"];

type PaymentInfo = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["paymentInfo"];

interface PreviewTotalsProps {
  invoiceTotal: InvoiceTotal;
  currency: string | undefined;
  notes: Notes;
  paymentInfo: PaymentInfo;
}
const PreviewTotals = ({
  invoiceTotal,
  currency,
  notes,
  paymentInfo,
}: PreviewTotalsProps) => {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:pb-10 px-3 xs:px-4 sm:px-8">
      <div className="flex justify-between items-start gap-3 sm:gap-6">
        <PreviewAdditionalInfo paymentInfo={paymentInfo} />

        <div className="min-w-32 sm:min-w-54 text-[10px] sm:text-sm text-stone">
          <div className="flex justify-between items-center">
            <p>Subtotal</p>
            <span className="font-normal text-ink ">
              {currency}
              {invoiceTotal.subtotal}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 sm:py-1.5">
            <p>
              Tax{" "}
              {invoiceTotal.taxRate > 0 && (
                <span className=" text-xs">({invoiceTotal.taxRate}%)</span>
              )}
            </p>
            <span className="font-normal text-ink ">
              {currency}
              {invoiceTotal.taxAmount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <p>
              Discount{" "}
              {invoiceTotal.discountRate > 0 && (
                <span className=" text-xs">({invoiceTotal.discountRate}%)</span>
              )}
            </p>
            <span className="font-normal text-ink ">
              {currency}
              {invoiceTotal.discountAmount}
            </span>
          </div>

          <div className="flex justify-between items-center bg-ink mt-2 px-1.5 sm:px-2 py-2 sm:py-2.5">
            <h1 className="font-normal text-[11px] sm:text-lg text-paper tracking-wide leading-tight">
              Total Due
            </h1>
            <span className="text-[11px] sm:text-lg text-paper  tracking-wide">
              {currency}
              {invoiceTotal.total}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {notes && (
          <>
            <p className="text-[10px] sm:text-sm font-bold uppercase tracking-wider text-stone mb-1">
              Notes
            </p>
            <p className="text-[9px] sm:text-xs text-ink leading-relaxed">
              {notes}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewTotals;
