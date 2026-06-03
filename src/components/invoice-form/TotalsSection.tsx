import { useInvoiceStore } from "@/store/invoiceStore";
import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import SectionHeader from "../ui/SectionHeader";
import { percentageFilter } from "@/utils/inputFilters";
import { Controller } from "react-hook-form";

const TotalsSection = ({ control }: InvoiceFormProps) => {
  const invoiceTotal = useInvoiceStore((state) => state.activeInvoice.invoiceTotal);

  const currency = useCurrencySign();

  return (
    <div className="text-stone mt-4">
      <div className="flex items-center gap-3 w-full">
        <SectionHeader label="Summary" />
        <div className="flex-1 h-[1.5px] bg-stone" />
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
                onChange={(e) => {
                  if (percentageFilter(e)) field.onChange(e);
                }}
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
                onChange={(e) => {
                  if (percentageFilter(e)) field.onChange(e);
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-col gap-3.5 w-75 pr-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold uppercase tracking-wide">
              Subtotal
            </div>
            <span className="text-sm text-ink font-numbers">
              {currency}
              {invoiceTotal.subtotal}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold uppercase tracking-wide">
              Discount
            </div>
            <span className="text-sm text-ink font-numbers">
              {currency}
              {invoiceTotal.discountAmount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold uppercase tracking-wide">
              Tax Rate
            </div>
            <span className="text-sm text-ink font-numbers">
              {currency}
              {invoiceTotal.taxAmount}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-stone text-base">
            <span className="font-semibold uppercase font-numbers mt-2">
              Total due
            </span>
            <span className="text-ink font-normal font-numbers mt-2">
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
