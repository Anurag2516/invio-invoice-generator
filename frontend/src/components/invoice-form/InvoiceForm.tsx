import { useForm, type SubmitHandler } from "react-hook-form";
import { useInvoiceStore } from "../../store/invoiceStore";
import type { Invoice, InvoiceFormValues, LineItem } from "../../types/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoice } from "../../schema/invoice.schema";
import { useEffect, type RefObject } from "react";
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
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "../ui/scroll-area";

interface InvoiceFormProps {
  formRef: RefObject<HTMLFormElement | null>;
  onSaveSuccessRef: RefObject<(() => void) | null>;
}

const InvoiceForm = ({ formRef, onSaveSuccessRef }: InvoiceFormProps) => {
  const { activeInvoice, saveInvoice, updateActiveInvoice, loadInvoice } =
    useInvoiceStore(
      useShallow((state) => ({
        activeInvoice: state.activeInvoice,
        saveInvoice: state.saveInvoice,
        updateActiveInvoice: state.updateActiveInvoice,
        loadInvoice: state.loadInvoice,
      })),
    );

  const { id } = useParams();

  const {
    register,
    watch,
    reset,
    control,
    handleSubmit,
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
        Number(formValues.invoiceTotal?.taxRate),
        Number(formValues.invoiceTotal?.discountRate),
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

  const formSubmit: SubmitHandler<InvoiceFormValues> = () => {
    saveInvoice();
    onSaveSuccessRef.current?.();
  };

  useEffect(() => {
    if (id) loadInvoice(id);
  }, [id]);

  return (
    <ScrollArea className="w-full xl:w-3/5 h-full flex flex-col gap-6 px-4 sm:px-6 shrink-0 bg-background">
      <form ref={formRef} onSubmit={handleSubmit(formSubmit)}>
        <InvoiceMeta register={register} control={control} errors={errors} />
        <ClientSection register={register} control={control} errors={errors} />
        <LineItemsTable register={register} control={control} errors={errors} />
        <TotalsSection register={register} control={control} errors={errors} />
        <InvoiceAdditionalInfo
          register={register}
          control={control}
          errors={errors}
        />
      </form>
    </ScrollArea>
  );
};

export default InvoiceForm;
