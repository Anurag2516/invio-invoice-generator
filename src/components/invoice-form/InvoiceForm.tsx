import { useForm } from "react-hook-form";
import { useInvoiceStore } from "../../store/invoiceStore";
import type { Invoice, InvoiceFormValues, LineItem } from "../../types/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoice } from "../../schema/invoice.schema";
import { useEffect } from "react";
import { generateId } from "../../utils/generateId";
import {
  calculateInvoiceTotal,
  calculateLineAmount,
} from "../../utils/calculations";
import InvoiceMeta from "./InvoiceMeta";
import ClientSection from "./ClientSection";
import LineItemsTable from "./LineItemsTable";
import TotalsSection from "./TotalsSection";
import InvoiceAdditionalInfo from "./InvoiceAdditionalInfo";

const InvoiceForm = () => {
  const activeInvoice = useInvoiceStore((s) => s.activeInvoice);
  const updateActiveInvoice = useInvoiceStore((s) => s.updateActiveInvoice);

  const {
    register,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoice),
    defaultValues: activeInvoice,
  });

  function toLineItems(lineItems: LineItem[] | any[]): LineItem[] {
    return lineItems.map((item) => ({
      id: item.id ?? generateId(),
      description: item.description ?? "",
      quantity: Number.isFinite(Number(item.quantity))
        ? Number(item.quantity)
        : 1,
      rate: Number.isFinite(Number(item.rate)) ? Number(item.rate) : 0,
      amount: calculateLineAmount(
        Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1,
        Number.isFinite(Number(item.rate)) ? Number(item.rate) : 0,
      ),
    }));
  }

  useEffect(() => {
    const subscription = watch((formValues) => {
      const lineItems: LineItem[] = toLineItems(formValues.lineItems ?? []);

      const invoiceTotal = calculateInvoiceTotal(
        lineItems,
        Number(formValues.invoiceTotal?.appliedTax),
        Number(formValues.invoiceTotal?.appliedDiscount),
      );

      updateActiveInvoice({
        ...(formValues as Invoice),
        lineItems,
        invoiceTotal,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateActiveInvoice]);

  useEffect(() => {
    reset(activeInvoice);
  }, [activeInvoice.id]);

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full w-3/5">
      <h1 className="text-2xl font-bold">New Invoice</h1>
      <InvoiceMeta register={register} control={control} errors={errors} />
      <ClientSection register={register} control={control} errors={errors} />
      <LineItemsTable register={register} control={control} errors={errors} />
      <TotalsSection register={register} control={control} errors={errors} />
      <InvoiceAdditionalInfo
        register={register}
        control={control}
        errors={errors}
      />
    </div>
  );
};

export default InvoiceForm;
