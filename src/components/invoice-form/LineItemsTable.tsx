import { useFieldArray } from "react-hook-form";
import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import { defaultLineItem } from "@/utils/defaults";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Plus, Trash2 } from "lucide-react";
import { useCurrencySign } from "@/hooks/useCurrencySign";

const LineItemsTable = ({ register, control }: InvoiceFormProps) => {
  const { fields, append, remove } = useFieldArray({
    name: "lineItems",
    control,
  });

  const lineItems = useInvoiceStore((state) => state.activeInvoice.lineItems);
  const removeLineItem = useInvoiceStore((state) => state.removeLineItem);

  const currency = useCurrencySign()

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-t border-stone-700">
            <th className="py-2 text-left text-[9px] font-bold uppercase tracking-widest text-stone-400 w-8" />

            <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-stone-600">
              Description
            </th>
            <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-stone-600 w-24">
              Rate
            </th>
            <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-stone-600 w-24">
              Qty
            </th>
            <th className="py-2 text-right text-xs font-semibold uppercase tracking-wide text-stone-600 w-20">
              Amount
            </th>
            <th className="w-8" />
          </tr>
        </thead>

        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id} className="border-b border-stone-100 align-top">
              <td className="pt-2 pr-2">
                <button
                  type="button"
                  onClick={() => {
                    remove(index);
                    removeLineItem(field.id);
                  }}
                  disabled={fields.length === 1}
                  className="flex h-11 w-11 items-center justify-center
             rounded-lg bg-gray-200 text-black
             hover:bg-gray-300 hover:cursor-pointer transition-all duration-300
             disabled:opacity-30"
                >
                  <Trash2 size={19} />
                </button>
              </td>

              <td className="py-2 pr-3">
                <Input
                  {...register(`lineItems.${index}.description`)}
                  placeholder="Item Description"
                />
              </td>

              <td className="py-2 pr-3">
                <Input
                  {...register(`lineItems.${index}.rate`)}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                />
              </td>

              <td className="py-2 pr-3">
                <Input
                  {...register(`lineItems.${index}.quantity`)}
                  placeholder="1"
                  type="number"
                />
              </td>

              <td className="py-2 text-right text-sm font-medium text-stone-900">
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
        onClick={() => append(defaultLineItem())}
        className="mt-5 flex h-10 w-10 items-center justify-center
             rounded-sm bg-stone-800 text-white
             hover:bg-stone-700 hover:cursor-pointer transition-all duration-300"
      >
        <Plus />
      </button>
    </div>
  );
};

export default LineItemsTable;
