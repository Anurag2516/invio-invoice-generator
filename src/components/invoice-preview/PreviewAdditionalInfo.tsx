import type { useInvoiceStore } from "@/store/invoiceStore";

type PaymentInfo = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["paymentInfo"];

type PreviewAdditionalInfoProps = {
  paymentInfo: PaymentInfo;
};

const PreviewAdditionalInfo = ({ paymentInfo }: PreviewAdditionalInfoProps) => {
  return (
    <div className="flex flex-col items-start gap-1.5 sm:gap-2 text-[#71685a]">
      {(paymentInfo.bankName ||
        paymentInfo.accountholderName ||
        paymentInfo.accountNumber) && (
        <h3 className="text-[10px] sm:text-sm tracking-wide font-bold uppercase">
          Payment Information
        </h3>
      )}
      <div className="flex flex-col gap-0.5 sm:gap-1 w-full text-[10px] sm:text-xs">
        {paymentInfo.bankName && (
          <p className="tracking-wide">
            Bank Name:{" "}
            <span className="font-normal text-[#0f0e0c]">
              {paymentInfo.bankName}
            </span>
          </p>
        )}
        {paymentInfo.accountholderName && (
          <p className="tracking-wide">
            Accountholder Name:{" "}
            <span className="font-normal text-[#0f0e0c]">
              {paymentInfo.accountholderName}
            </span>
          </p>
        )}
        {paymentInfo.accountNumber && (
          <p className="tracking-wide">
            Account Number:{" "}
            <span className="font-normal text-[#0f0e0c] ">
              {paymentInfo.accountNumber}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PreviewAdditionalInfo;
