import { useInvoiceStore } from "@/store/invoiceStore";
import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import { useCurrencySign } from "@/hooks/useCurrencySign";

const TotalsSection = ({ register }: InvoiceFormProps) => {
  const invoiceTotal = useInvoiceStore((state) => state.activeInvoice.invoiceTotal);

  const currency = useCurrencySign();

  return (
    <>
      <div className="flex justify-end border-t border-stone-300">
        <div className="flex flex-col gap-3.5 w-75 pr-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold uppercase tracking-wide text-stone-600">
              Subtotal
            </div>
            <span className="text-sm font-semibold text-stone-600">
              {currency}
              {invoiceTotal.subtotal}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1">
            <label className="text-sm font-semibold uppercase tracking-wide text-stone-600">
              Tax Rate
            </label>
            <div className="flex items-center h-11 w-25">
              <Input
                {...register("invoiceTotal.appliedTax")}
                type="number"
                step="0.01"
                placeholder="0"
              />
              <span className="text-stone-600 text-sm ml-1">%</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <label className="text-sm font-semibold uppercase tracking-wide text-stone-600">
              Discount
            </label>
            <div className="flex items-center h-11 w-25">
              <Input
                {...register("invoiceTotal.appliedDiscount")}
                type="number"
                step="0.01"
                placeholder="0"
              />
              <span className="text-stone-600 text-sm ml-1">%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold uppercase text-stone-600">
              Total due
            </span>
            <span className="text-lg font-semibold">
              {currency}
              {invoiceTotal.total}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalsSection;
