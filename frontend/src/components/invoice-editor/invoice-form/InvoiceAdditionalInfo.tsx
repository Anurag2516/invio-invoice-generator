import type { InvoiceFormValues } from "@/types/invoice";
import SectionHeader from "@/components/ui/SectionHeader";
import Input from "@/components/ui/Input";
import { useFormContext } from "react-hook-form";

const InvoiceAdditionalInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();
  return (
    <div className="flex flex-col gap-6 mt-8 pb-8">
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center gap-3 w-full">
          <SectionHeader label="Payment Information" />
          <div className="flex-1 h-[1.5px] bg-stone/50" />
        </div>
        <Input
          {...register("bankName")}
          label="Bank Name"
          placeholder="Enter bank name"
          error={errors.bankName?.message}
        />
        <Input
          {...register("accountHolderName")}
          label="Accountholder Name"
          placeholder="John Doe"
          error={errors.accountHolderName?.message}
        />
        <Input
          {...register("accountNumber")}
          label="Account Number"
          placeholder="Enter account number"
          error={errors.accountNumber?.message}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <SectionHeader label="Notes" />
        <textarea
          {...register("notes")}
          className="bg-background dark:bg-input/30 border border-input rounded-lg px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/80 resize-y min-h-45 shadow-sm outline-none transition-[color, box-shadow] duration-150 ease-in-out w-full hover:border-ring/90 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Payment terms, bank details, UPI ID, thank you note…"
        />
      </div>
    </div>
  );
};

export default InvoiceAdditionalInfo;
