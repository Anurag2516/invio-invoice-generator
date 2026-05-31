import type { useInvoiceStore } from "@/store/invoiceStore";

type LineItems = ReturnType<typeof useInvoiceStore.getState>["activeInvoice"]["lineItems"]

interface PreviewLineItemsProps {
    lineItems: LineItems;
    currency: string | undefined
}

const PreviewLineItems = ({ lineItems, currency }: PreviewLineItemsProps) => {
  return (
    <div className="px-10">
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="text-stone text-xs font-bold uppercase tracking-widest border-b border-stone">
            <th className="py-2.5 px-3 text-left w-2/5">Description</th>
            <th className="py-2.5 px-3 text-center w-[15%]">Qty</th>
            <th className="py-2.5 px-3 text-right w-1/5">Rate</th>
            <th className="py-2.5 px-3 text-right w-1/4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[#f0ebe3] text-base text-ink"
            >
              <td className="py-3 px-3 text-sm">
                {item.description || "Item Description"}
              </td>
              <td className="py-3 px-3 text-center font-mono">
                {item.quantity}
              </td>
              <td className="py-3 px-3 text-right font-mono">
                {currency}
                {item.rate}
              </td>
              <td className="py-3 px-3 text-right font-semibold font-mono">
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

export default PreviewLineItems
