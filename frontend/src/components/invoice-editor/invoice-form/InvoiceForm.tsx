import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import type { InvoiceFormValues, InvoiceResponse } from "@/types/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema } from "@/schema/invoice.schema";
import { useEffect, type RefObject } from "react";
import InvoiceMeta from "./InvoiceMeta";
import ClientSection from "./ClientSection";
import LineItemsTable from "./LineItemsTable";
import TotalsSection from "./TotalsSection";
import InvoiceAdditionalInfo from "./InvoiceAdditionalInfo";
import { useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useautoSaveInvoice, useInvoice } from "@/hooks/useInvoices";
import { InvoiceFormSkeleton } from "@/components/ui/skeleton/InvoiceFormSkeleton";
import SenderSection from "./SenderSection";
import { invoiceResponseToFormData } from "@/mapper/invoice.mapper";
import FormInvoicePreview from "@/components/invoice-editor/invoice-preview/FormInvoicePreview";

interface InvoiceFormLoaderProps {
  formRef: RefObject<HTMLFormElement | null>;
  onSaveSuccessRef: RefObject<(() => void) | null>;
  activeTab: string;
}

interface InvoiceFormProviderProps {
  id: string;
  activeTab: string;
  defaultInvoice: InvoiceResponse;
  formRef: RefObject<HTMLFormElement | null>;
  onSaveSuccessRef: RefObject<(() => void) | null>;
}

interface InvoiceFormProps {
  formRef: RefObject<HTMLFormElement | null>;
  onSaveSuccessRef: RefObject<(() => void) | null>;
  id: string;
}

const InvoiceFormLoader = ({
  formRef,
  onSaveSuccessRef,
  activeTab,
}: InvoiceFormLoaderProps) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: defaultInvoice, isLoading } = useInvoice(id!);

  if (isLoading || !defaultInvoice) return <InvoiceFormSkeleton />;

  return (
    <InvoiceFormProvider
      key={id}
      id={id!}
      defaultInvoice={defaultInvoice}
      formRef={formRef}
      onSaveSuccessRef={onSaveSuccessRef}
      activeTab={activeTab}
    />
  );
};

const InvoiceFormProvider = ({
  id,
  defaultInvoice,
  formRef,
  onSaveSuccessRef,
  activeTab,
}: InvoiceFormProviderProps) => {
  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoiceResponseToFormData(defaultInvoice),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <div className={activeTab === "edit" ? "contents" : "hidden xl:contents"}>
        <InvoiceForm
          id={id}
          formRef={formRef}
          onSaveSuccessRef={onSaveSuccessRef}
        />
      </div>
      <div
        className={activeTab === "preview" ? "contents" : "hidden xl:contents"}
      >
        <FormInvoicePreview />
      </div>
    </FormProvider>
  );
};

const InvoiceForm = ({ id, formRef, onSaveSuccessRef }: InvoiceFormProps) => {
  const methods = useFormContext<InvoiceFormValues>();
  const { mutateAsync: autoSave } = useautoSaveInvoice();

  useEffect(() => {
    let autoSaveTimeout: ReturnType<typeof setTimeout>;

    const subscription = methods.watch((formValues) => {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(async () => {
        await autoSave({
          invoice: formValues as InvoiceFormValues,
          id,
        });
      }, 2000);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(autoSaveTimeout);
    };
  }, [autoSave, id]);

  const formSubmit: SubmitHandler<InvoiceFormValues> = () => {
    onSaveSuccessRef.current?.();
  };

  return (
    <ScrollArea className="w-full xl:w-3/5 h-full flex flex-col gap-6 px-4 sm:px-6 shrink-0 bg-background">
      <form ref={formRef} onSubmit={methods.handleSubmit(formSubmit)}>
        <InvoiceMeta />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
          <SenderSection />
          <ClientSection />
        </div>
        <LineItemsTable />
        <TotalsSection />
        <InvoiceAdditionalInfo />
      </form>
    </ScrollArea>
  );
};

export default InvoiceFormLoader;
