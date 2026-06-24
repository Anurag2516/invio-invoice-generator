import type { useInvoiceStore } from "@/store/invoiceStore";

type LineItems = ReturnType<
  typeof useInvoiceStore.getState
>["activeInvoice"]["lineItems"];

interface PreviewLineItemsProps {
  lineItems: LineItems;
  currency: string | undefined;
}

const PreviewLineItems = ({ lineItems, currency }: PreviewLineItemsProps) => {
  return (
    <div className="px-3 xs:px-4 sm:px-8">
      <table className="w-full border-collapse mb-4 sm:mb-6">
        <thead>
          <tr className="text-stone text-[9px] sm:text-xs font-bold uppercase tracking-widest border-b border-stone">
            <th className="py-1.5 sm:py-2.5 px-1.5 sm:px-3 text-left w-2/5">
              Description
            </th>
            <th className="py-1.5 sm:py-2.5 px-1.5 sm:px-3 text-center w-[15%]">
              Qty
            </th>
            <th className="py-1.5 sm:py-2.5 px-1.5 sm:px-3 text-right w-1/5">
              Rate
            </th>
            <th className="py-1.5 sm:py-2.5 px-1.5 sm:px-3 text-right w-1/4">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[#f0ebe3] text-[11px] sm:text-sm text-ink"
            >
              <td className="py-2 sm:py-3 px-1.5 sm:px-3">
                {item.description || "Item Description"}
              </td>
              <td className="py-2 sm:py-3 px-1.5 sm:px-3 text-center ">
                {item.quantity}
              </td>
              <td className="py-2 sm:py-3 px-1.5 sm:px-3 text-right ">
                {currency}
                {item.rate}
              </td>
              <td className="py-2 sm:py-3 px-1.5 sm:px-3 text-right ">
                {currency}
                {item.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewLineItems;
