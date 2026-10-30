import type { InvoiceResponse } from "@/types/invoice";

type PreviewAdditionalInfoProps = Pick<
  InvoiceResponse,
  "bankName" | "accountHolderName" | "accountNumber"
>;

const PreviewAdditionalInfo = ({
  bankName,
  accountHolderName,
  accountNumber,
}: PreviewAdditionalInfoProps) => {
  return (
    <div className="flex flex-col items-start gap-1.5 sm:gap-2 text-[#71685a]">
      {(bankName || accountHolderName || accountNumber) && (
        <h3 className="text-[10px] sm:text-sm tracking-wide font-bold uppercase">
          Payment Information
        </h3>
      )}
      <div className="flex flex-col gap-0.5 sm:gap-1 w-full text-[10px] sm:text-xs">
        {bankName && (
          <p className="tracking-wide">
            Bank Name:{" "}
            <span className="font-normal text-[#0f0e0c]">{bankName}</span>
          </p>
        )}
        {accountHolderName && (
          <p className="tracking-wide">
            Accountholder Name:{" "}
            <span className="font-normal text-[#0f0e0c]">
              {accountHolderName}
            </span>
          </p>
        )}
        {accountNumber && (
          <p className="tracking-wide">
            Account Number:{" "}
            <span className="font-normal text-[#0f0e0c] ">{accountNumber}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PreviewAdditionalInfo;
