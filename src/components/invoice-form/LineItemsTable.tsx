import { Controller, useFieldArray } from "react-hook-form";
import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import { defaultLineItem } from "@/utils/defaults";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Plus, X } from "lucide-react";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import SectionHeader from "../ui/SectionHeader";
import { positiveNumberFilter } from "@/utils/inputFilters";

const LineItemsTable = ({ register, control, errors }: InvoiceFormProps) => {
  const { fields, append, remove } = useFieldArray({
    name: "lineItems",
    control,
  });

  const lineItems = useInvoiceStore((state) => state.activeInvoice.lineItems);
  const removeLineItem = useInvoiceStore((state) => state.removeLineItem);

  const currency = useCurrencySign();

  return (
    <div className="w-full mt-4">
      <SectionHeader label="LineItems" />
      <table className="w-full border-collapse mt-5">
        <thead>
          <tr>
            <th className="w-8" />
            <th className="py-2 text-left text-sm font-semibold uppercase tracking-wide text-brand">
              Description
            </th>
            <th className="py-2 text-left text-sm font-semibold uppercase tracking-wide text-brand w-24">
              Rate
            </th>
            <th className="py-2 text-left text-sm font-semibold uppercase tracking-wide text-brand w-24">
              Qty
            </th>
            <th className="py-2 text-right text-sm font-semibold uppercase tracking-wide text-brand w-20">
              Amount
            </th>
          </tr>
        </thead>

        <tbody>
          {fields.map((field, index) => (
            <tr
              key={field.id}
              className="border-b border-stone-100 align-middle"
            >
              <td className="pr-4">
                <button
                  type="button"
                  onClick={() => {
                    remove(index);
                    removeLineItem(field.id);
                  }}
                  disabled={fields.length === 1}
                  className="flex h-10.5 w-10.5 items-center justify-center rounded-lg text-brand border border-brand hover:bg-red-100 hover-border-200 hover:cursor-pointer transition-all duration-300 disabled:opacity-30"
                >
                  <X size={18} />
                </button>
              </td>

              <td className="py-2 pr-3">
                <Input
                  {...register(`lineItems.${index}.description`)}
                  placeholder="Item Description"
                />
              </td>

              <td className="py-2 pr-3">
                <Controller
                  name={`lineItems.${index}.rate`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value as string}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      onChange={(e) => {
                        if (positiveNumberFilter(e)) field.onChange(e);
                      }}
                    />
                  )}
                />
              </td>

              <td className="py-2 pr-3">
                <Controller
                  name={`lineItems.${index}.quantity`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value as string}
                      type="text"
                      inputMode="decimal"
                      placeholder="1"
                      onChange={(e) => {
                        if (positiveNumberFilter(e)) field.onChange(e);
                      }}
                    />
                  )}
                />
              </td>

              <td className="py-2 text-right text-base font-medium text-ink font-mono">
                {currency}
                {(lineItems[index]?.amount ?? 0).toFixed(2)}
              </td>

              <td />
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        className="flex items-center gap-2 justify-center w-full mt-4 rounded-xl border-2 border-dashed border-[#4d82d4] py-3 text-base font-semibold tracking-widest text-[#4d82d4] hover:cursor-pointer hover:border-[#2f6bc8] hover:text-[#2f6bc8] hover:bg-[#2f6bc8]/5 transition-colors"
        onClick={() => append(defaultLineItem())}
      >
        <Plus size={18} />
        <p>Add Line Item</p>
      </button>
    </div>
  );
};

export default LineItemsTable;
