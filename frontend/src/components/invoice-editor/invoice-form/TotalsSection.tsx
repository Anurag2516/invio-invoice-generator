import type { InvoiceFormValues } from "@/types/invoice";
import Input from "@/components/ui/Input";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import SectionHeader from "@/components/ui/SectionHeader";
import { percentageFilter } from "@/utils/inputFilters";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { calculateInvoiceTotal } from "@/utils/calculations";

const TotalsSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const [lineItems, taxRate, discountRate, currency] = useWatch({
    name: ["lineItems", "taxRate", "discountRate", "currency"],
  });

  const { subtotal, taxAmount, discountAmount, total } = calculateInvoiceTotal(lineItems, taxRate, discountRate)

  const currencySign = useCurrencySign(currency);

  return (
    <div className="text-stone mt-8">
      <div className="flex items-center gap-3 w-full">
        <SectionHeader label="Summary" />
        <div className="flex-1 h-px bg-stone/50" />
      </div>

      <div className="flex items-center gap-8 mt-4 w-full">
        <div className="flex flex-col items-center justify-between w-full">
          <Controller
            name="taxRate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value as number}
                label="Tax Rate (%)"
                type="text"
                inputMode="decimal"
                placeholder="0"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (percentageFilter(e)) field.onChange(e);
                }}
                error={errors.taxRate?.message}
              />
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-1 w-full">
          <Controller
            name="discountRate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value as number}
                label="Discount (%)"
                type="text"
                inputMode="decimal"
                placeholder="0"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (percentageFilter(e)) field.onChange(e);
                }}
                error={errors.discountRate?.message}
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
              {currencySign}
              {subtotal}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-wide">
              Discount
            </p>
            <span className="text-sm text-foreground">
              {currencySign}
              {discountAmount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-wide">
              Tax
            </p>
            <span className="text-sm text-foreground">
              {currencySign}
              {taxAmount}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-stone text-[15px]">
            <p className="font-semibold uppercase tracking-wide mt-2">
              Total due
            </p>
            <span className="text-foreground font-semibold mt-2">
              {currencySign}
              {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;
