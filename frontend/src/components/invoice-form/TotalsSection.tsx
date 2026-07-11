import { useInvoiceStore } from "@/store/invoiceStore";
import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import SectionHeader from "../ui/SectionHeader";
import { percentageFilter } from "@/utils/inputFilters";
import { Controller } from "react-hook-form";

const TotalsSection = ({ control, errors }: InvoiceFormProps) => {
  const invoiceTotal = useInvoiceStore(
    (state) => state.activeInvoice.invoiceTotal,
  );

  const currency = useCurrencySign();

  return (
    <div className="text-stone mt-8">
      <div className="flex items-center gap-3 w-full">
        <SectionHeader label="Summary" />
        <div className="flex-1 h-px bg-stone/50" />
      </div>

      <div className="flex items-center gap-8 mt-4 w-full">
        <div className="flex flex-col items-center justify-between w-full">
          <Controller
            name="invoiceTotal.taxRate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value as string}
                label="Tax Rate (%)"
                type="text"
                inputMode="decimal"
                placeholder="0"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (percentageFilter(e)) field.onChange(e);
                }}
                error={errors?.invoiceTotal?.taxRate?.message}
              />
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-1 w-full">
          <Controller
            name="invoiceTotal.discountRate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value as string}
                label="Discount (%)"
                type="text"
                inputMode="decimal"
                placeholder="0"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (percentageFilter(e)) field.onChange(e);
                }}
                error={errors.invoiceTotal?.discountRate?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-col gap-2 w-full sm:w-75 pr-0 sm:pr-6 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-wide">
              Subtotal
            </p>
            <span className="text-sm text-foreground">
              {currency}
              {invoiceTotal.subtotal}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-wide">
              Discount
            </p>
            <span className="text-sm text-foreground">
              {currency}
              {invoiceTotal.discountAmount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-wide">
              Tax
            </p>
            <span className="text-sm text-foreground">
              {currency}
              {invoiceTotal.taxAmount}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-stone text-[15px]">
            <p className="font-semibold uppercase tracking-wide mt-2">
              Total due
            </p>
            <span className="text-foreground font-semibold mt-2">
              {currency}
              {invoiceTotal.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;
