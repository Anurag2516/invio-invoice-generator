import type { useInvoiceStore } from "@/store/invoiceStore";

type PaymentInfo = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["paymentInfo"];

type PreviewAdditionalInfoProps = {
  paymentInfo: PaymentInfo;
};

const PreviewAdditionalInfo = ({ paymentInfo }: PreviewAdditionalInfoProps) => {
  return (
    <div className="flex flex-col items-start gap-2 text-stone">
      {(paymentInfo.bankName ||
        paymentInfo.accountholderName ||
        paymentInfo.accountNumber) && (
        <label className="text-base tracking-wide font-bold uppercase">
          Payment Information
        </label>
      )}
      <div className="flex flex-col gap-1 w-full text-sm ">
        {paymentInfo.bankName && (
          <label className="tracking-wide">
            Bank Name:{" "}
            <span className="font-normal text-ink">{paymentInfo.bankName}</span>
          </label>
        )}
        {paymentInfo.accountholderName && (
          <label className="tracking-wide">
            Accountholder Name:{" "}
            <span className="font-normal text-ink">
              {paymentInfo.accountholderName}
            </span>
          </label>
        )}
        {paymentInfo.accountNumber && (
          <label className="tracking-wide">
            Account Number:{" "}
            <span className="mono font-normal text-ink">
              {paymentInfo.accountNumber}
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default PreviewAdditionalInfo;
