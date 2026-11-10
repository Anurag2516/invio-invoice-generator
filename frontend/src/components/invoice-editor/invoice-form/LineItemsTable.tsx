import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import type { InvoiceFormValues, LineItemFormData } from "@/types/invoice";
import Input from "@/components/ui/Input";
import { Plus, X } from "lucide-react";
import { useCurrencySign } from "@/hooks/useCurrencySign";
import SectionHeader from "@/components/ui/SectionHeader";
import { positiveNumberFilter } from "@/utils/inputFilters";
import { Button } from "@/components/ui/Button";
import { calculateLineAmount } from "@/utils/calculations";
import { useEffect } from "react";

const LineItemsTable = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const { fields, append, remove } = useFieldArray({
    name: "lineItems",
    control,
  });

  const [lineItems, currency] = useWatch({
    name: ["lineItems", "currency"],
  });

  const currencySign = useCurrencySign(currency);

  useEffect(() => {
    lineItems.forEach((item: LineItemFormData, index: number) => {
      const computed = calculateLineAmount(
        item.quantity ?? 0,
        item.rate ?? 0,
      );
      if (item.amount !== computed) {
        setValue(`lineItems.${index}.amount`, computed, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });
  }, [lineItems, setValue]);

  const defaultLineItem = (): LineItemFormData => ({
    id: `temp_${crypto.randomUUID()}`,
    description: "",
    quantity: 1,
    rate: 0,
    amount: 0,
  });

  return (
    <div className="w-full pt-8">
      <div className="flex items-center gap-3 w-full">
        <SectionHeader label="LineItems" />
        <div className="flex-1 h-px bg-stone/50" />
      </div>

      <div className="sm:hidden flex flex-col gap-3 mt-5">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-3 border border-stone-200 rounded-xl p-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-stone">
                Item {index + 1}
              </span>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  remove(index);
                }}
                disabled={fields.length === 1}
              >
                <X size={16} />
              </Button>
            </div>
            <Input
              {...register(`lineItems.${index}.description`)}
              placeholder="Item Description"
              label="Description"
              error={errors.lineItems?.[index]?.description?.message}
            />
            <div className="grid grid-cols-3 gap-2">
              <Controller
                name={`lineItems.${index}.rate`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value as number}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    label="Rate"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (positiveNumberFilter(e)) field.onChange(e);
                    }}
                    error={errors?.lineItems?.[index]?.rate?.message}
                  />
                )}
              />
              <Controller
                name={`lineItems.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value as number}
                    type="text"
                    inputMode="decimal"
                    placeholder="1"
                    label="Qty"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (positiveNumberFilter(e)) field.onChange(e);
                    }}
                    error={errors?.lineItems?.[index]?.quantity?.message}
                  />
                )}
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold uppercase tracking-wide text-stone">
                  Amount
                </span>
                <span className="text-base font-medium text-foreground pt-2">
                  {currencySign}
                  {lineItems[index]?.amount ?? 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <table className="hidden sm:table w-full border-collapse mt-5">
        <thead>
          <tr>
            <th className="w-8" />
            <th className="py-2 text-left text-sm font-semibold uppercase tracking-wider text-stone">
              Description
            </th>
            <th className="py-2 text-left text-sm font-semibold uppercase tracking-wider text-stone w-24">
              Rate
            </th>
            <th className="py-2 text-left text-sm font-semibold uppercase tracking-wider text-stone w-24">
              Qty
            </th>
            <th className="py-2 text-right text-sm font-semibold uppercase tracking-wider text-stone w-20">
              Amount
            </th>
          </tr>
        </thead>

        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id} className="align-middle">
              <td className="pr-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    remove(index);
                  }}
                  disabled={fields.length === 1}
                >
                  <X size={18} />
                </Button>
              </td>

              <td className="py-2 pr-3">
                <Input
                  {...register(`lineItems.${index}.description`)}
                  placeholder="Item Description"
                  error={errors.lineItems?.[index]?.description?.message}
                />
              </td>

              <td className="py-2 pr-3">
                <Controller
                  name={`lineItems.${index}.rate`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value as number}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (positiveNumberFilter(e)) field.onChange(e);
                      }}
                      error={errors?.lineItems?.[index]?.rate?.message}
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
                      value={field.value as number}
                      type="text"
                      inputMode="decimal"
                      placeholder="1"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (positiveNumberFilter(e)) field.onChange(e);
                      }}
                      error={errors?.lineItems?.[index]?.quantity?.message}
                    />
                  )}
                />
              </td>

              <td className="py-2 text-right text-base font-medium text-foreground ">
                {currencySign}
                {calculateLineAmount(
                  lineItems[index]?.quantity ?? 0,
                  lineItems[index]?.rate ?? 0,
                )}
              </td>

              <td />
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        className="flex items-center gap-2 justify-center w-full mt-4 rounded-xl border-2 border-dashed border-teal py-3 text-base font-semibold tracking-widest text-teal hover:cursor-pointer hover:border-teal-dark hover:text-teal-dark hover:bg-teal/5 transition-colors"
        onClick={() => append(defaultLineItem())}
      >
        <Plus size={18} />
        <p>Add Line Item</p>
      </button>
    </div>
  );
};

export default LineItemsTable;
