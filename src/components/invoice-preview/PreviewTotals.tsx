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
    <div className="flex flex-col gap-4 pb-10 px-10">
      <div className="flex justify-between items-start gap-6">
        <PreviewAdditionalInfo paymentInfo={paymentInfo} />

        <div className="min-w-50 text-base text-stone">
          <div className="flex justify-between">
            <p className="text-sm">Subtotal</p>
            <span className="mono font-semibold text-ink">
              {currency}
              {invoiceTotal.subtotal}
            </span>
          </div>

          <div className="flex justify-between py-1.5">
            <p className="text-sm">
              Tax{" "}
              {invoiceTotal.taxRate > 0 && (
                <span className="mono">({invoiceTotal.taxRate}%)</span>
              )}
            </p>
            <span className="mono font-semibold text-ink">
              {currency}
              {invoiceTotal.taxAmount}
            </span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">
              Discount{" "}
              {invoiceTotal.discountRate > 0 && (
                <span className="mono">({invoiceTotal.discountRate}%)</span>
              )}
            </p>
            <span className="mono font-semibold text-ink">
              {currency}
              {invoiceTotal.discountAmount}
            </span>
          </div>
          <div className="flex justify-between items-center bg-ink mt-2 px-3 py-2.5">
            <h1 className="font-bold text-lg text-paper tracking-wider leading-tight italic">
              Total Due
            </h1>
            <span className="mono text-xl font-black text-terracotta">
              {currency}
              {invoiceTotal.total}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        {notes && (
          <>
            <p className="text-sm font-bold uppercase tracking-wider text-stone mb-1">
              Notes
            </p>
            <p className="text-xs text-ink leading-relaxed">{notes}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewTotals;
