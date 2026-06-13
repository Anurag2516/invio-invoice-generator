import type { InvoiceFormProps } from "@/types/invoice";
import SectionHeader from "../ui/SectionHeader";
import Input from "../ui/Input";

const InvoiceAdditionalInfo = ({ register, errors }: InvoiceFormProps) => {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-3 w-full">
          <SectionHeader label="Payment Information" />
          <div className="flex-1 h-[1.5px] bg-stone" />
        </div>
        <Input
          {...register("paymentInfo.bankName")}
          label="Bank Name"
          placeholder="Enter bank name"
          error={errors.paymentInfo?.bankName?.message}
        />
        <Input
          {...register("paymentInfo.accountholderName")}
          label="Accountholder Name"
          placeholder="John Doe"
          error={errors.paymentInfo?.accountholderName?.message}
        />
        <Input
          {...register("paymentInfo.accountNumber")}
          label="Account Number"
          placeholder="Enter account number"
          error={errors.paymentInfo?.accountNumber?.message}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <SectionHeader label="Notes" />
        <textarea
          {...register("notes")}
          className="bg-mist border border-stone-200 rounded-lg px-3.5 py-3 text-sm text-stone-800 placeholder:text-stone/60 resize-y min-h-45 outline-none w-full hover:border-stone-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
          placeholder="Payment terms, bank details, UPI ID, thank you note…"
        />
      </div>
    </div>
  );
};

export default InvoiceAdditionalInfo;
