import PreviewAdditionalInfo from "./PreviewAdditionalInfo";
import type { InvoiceResponse } from "@/types/invoice";

interface PreviewTotalsProps {
  invoice: InvoiceResponse
  currency: string | undefined;
}
const PreviewTotals = ({ invoice, currency }: PreviewTotalsProps) => {
  
  return (
    <div className="flex flex-col gap-4 pb-6 sm:pb-10 px-3 xs:px-4 sm:px-8">
      <div className="flex justify-between items-start gap-3 sm:gap-6">
        <PreviewAdditionalInfo
          accountHolderName={invoice.accountHolderName}
          accountNumber={invoice.accountNumber}
          bankName={invoice.bankName}
        />

        <div className="min-w-32 sm:min-w-54 text-[10px] sm:text-sm text-[#71685a]">
          <div className="flex justify-between items-center">
            <p>Subtotal</p>
            <span className="font-normal text-[#0f0e0c] ">
              {currency}
              {invoice.subtotal}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 sm:py-1.5">
            <p>
              Tax{" "}
              {invoice.taxRate > 0 && (
                <span className=" text-xs">({invoice.taxRate}%)</span>
              )}
            </p>
            <span className="font-normal text-[#0f0e0c] ">
              {currency}
              {invoice.taxAmount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <p>
              Discount{" "}
              {invoice.discountRate > 0 && (
                <span className=" text-xs">({invoice.discountRate}%)</span>
              )}
            </p>
            <span className="font-normal text-[#0f0e0c] ">
              {currency}
              {invoice.discountAmount}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#0f0e0c] mt-2 px-1.5 sm:px-2 py-2 sm:py-2.5">
            <h1 className="font-normal text-[11px] sm:text-lg text-[#fffefb] tracking-wide leading-tight">
              Total Due
            </h1>
            <span className="text-[11px] sm:text-lg text-[#fffefb] tracking-wide">
              {currency}
              {invoice.total}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {invoice.notes && (
          <>
            <p className="text-[10px] sm:text-sm font-bold uppercase tracking-wider text-[#71685a] mb-1">
              Notes
            </p>
            <p className="text-[9px] sm:text-xs text-[#0f0e0c] leading-relaxed">
              {invoice.notes}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewTotals;
