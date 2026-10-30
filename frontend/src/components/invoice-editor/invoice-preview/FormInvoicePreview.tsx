import InvoicePreview from './InvoicePreview';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { InvoiceFormValues, InvoiceResponse } from '@/types/invoice';
import { useFormContext, useWatch } from 'react-hook-form';

const FormInvoicePreview = () => {
    const { control } = useFormContext<InvoiceFormValues>();
    const data = useWatch({ control })as InvoiceResponse;

  return (
    <ScrollArea className="w-full xl:w-2/5 shrink-0 sticky top-0  px-3 sm:px-4 bg-[#f7f5f0]">
      <div className='my-6 xl:mb-8 xl:mt-0'>
        <h1 className="hidden xl:block text-xl font-normal text-[#71685a] uppercase tracking-wide py-8">
          Live Preview
        </h1>

        <InvoicePreview invoice={data} />
      </div>
    </ScrollArea>
  );
}

export default FormInvoicePreview
