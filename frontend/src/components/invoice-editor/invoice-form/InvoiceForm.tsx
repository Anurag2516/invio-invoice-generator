import { FormProvider, useForm, useFormContext } from "react-hook-form";
import type { InvoiceFormValues, InvoiceResponse } from "@/types/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema } from "@/schema/invoice.schema";
import { useEffect, type ReactNode } from "react";
import InvoiceMeta from "./InvoiceMeta";
import ClientSection from "./ClientSection";
import LineItemsTable from "./LineItemsTable";
import TotalsSection from "./TotalsSection";
import InvoiceAdditionalInfo from "./InvoiceAdditionalInfo";
import { useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAutoSaveInvoice, useInvoice } from "@/hooks/useInvoices";
import { InvoiceFormSkeleton } from "@/components/ui/skeleton/InvoiceFormSkeleton";
import SenderSection from "./SenderSection";
import { invoiceResponseToFormData } from "@/mapper/invoice.mapper";
import { Lock } from "lucide-react";

export const InvoiceFormProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: invoice, isLoading } = useInvoice(id!);

  if (isLoading || !invoice) return <InvoiceFormSkeleton />;

  return (
    <InvoiceFormState key={id} invoice={invoice}>
      {children}
    </InvoiceFormState>
  );
};

const InvoiceFormState = ({
  invoice,
  children,
}: {
  invoice: InvoiceResponse;
  children: ReactNode;
}) => {
  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoiceResponseToFormData(invoice),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const InvoiceForm = () => {
  const { watch } = useFormContext<InvoiceFormValues>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id")!;
  const { data: invoice } = useInvoice(id);
  const { mutate: autoSave } = useAutoSaveInvoice();

  const isEditable = invoice?.status === "Draft";

  useEffect(() => {
    if (!isEditable) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    let pending: InvoiceFormValues | null = null;

    const subscription = watch((values) => {
      pending = values as InvoiceFormValues;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        autoSave({ invoice: pending!, id });
        pending = null;
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
      if (pending) autoSave({ invoice: pending, id });
    };
  }, [autoSave, id, isEditable, watch]);

  return (
    <ScrollArea className="w-full xl:w-3/5 h-full flex flex-col gap-6 px-4 sm:px-6 shrink-0 bg-background">
      <form onSubmit={(e) => e.preventDefault()}>
        {!isEditable && (
          <div className="mt-4 rounded-lg border border-amber-500/20 bg-[#f7f5f0] dark:bg-amber-500/5 p-3">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-amber-600" />

              <p className="text-sm font-medium">This invoice is locked</p>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Only draft invoices can be edited. This invoice is currently
              {` ${invoice?.status.toLowerCase()}`}.
            </p>
          </div>
        )}

        <fieldset
          disabled={!isEditable}
          className="m-0 min-w-0 border-0 p-0 disabled:cursor-not-allowed"
        >
          <InvoiceMeta />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            <SenderSection />
            <ClientSection />
          </div>

          <LineItemsTable />

          <TotalsSection />

          <InvoiceAdditionalInfo />
        </fieldset>
      </form>
    </ScrollArea>
  );
};

export default InvoiceForm;
