import { useInvoiceStore } from "@/store/invoiceStore";
import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import { currencyOptions } from "@/constants/currencies";
import SectionHeader from "../ui/SectionHeader";

const TotalsSection = ({ register }: InvoiceFormProps) => {

 const { invoiceTotal, currency } = useInvoiceStore(
   (state) => state.activeInvoice,
 );

  const currencies = currencyOptions.find((c)=> c.value === currency)?.sign

  return (
    <>
      <div className="flex justify-end border-t border-stone-300">
        <div className="flex flex-col gap-3.5 w-75 pr-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold uppercase tracking-wide text-stone-600">
              Subtotal
            </div>
            <span className="text-sm font-semibold text-stone-600">
              {currencies}
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
              {currencies}
              {invoiceTotal.total}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <SectionHeader label="Notes" />
        <textarea
          className="border border-stone-200 rounded-lg px-3.5 py-3 text-sm text-stone-800 placeholder:text-stone-400 resize-y min-h-20 outline-none w-full hover:border-stone-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
          placeholder="Payment terms, bank details, UPI ID, thank you note…"
        />
      </div>
    </>
  );
};

export default TotalsSection;
