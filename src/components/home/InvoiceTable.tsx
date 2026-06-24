import type { Invoice, InvoiceStore, Status } from '@/types/invoice';
import InvoiceActions from './InvoiceActions';
import { dateChecker } from '@/utils/dateChecker';
import { CircleAlert } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import { useCurrencySign } from '@/hooks/useCurrencySign';
import type { useInvoiceStore } from '@/store/invoiceStore';
import type { ActiveTab } from '@/pages/Home';

export type DeleteInvoice = ReturnType<
  typeof useInvoiceStore.getState
>["deleteInvoice"];

interface InvoiceTableProps {
  invoices: Invoice[];
  deleteInvoice: DeleteInvoice;
  activeTab: ActiveTab;
}

const InvoiceTable = ({
  invoices,
  deleteInvoice,
  activeTab
}: InvoiceTableProps) => {
  const currency = useCurrencySign();

  const STATUS_STYLES: Record<Status, string> = {
    Sent: "bg-[#dce8f7] text-[#3f6fa8]",
    Paid: "bg-[#dde9dc] text-[#4d7a52]",
    Draft: "bg-[#ece8e0] text-[#8a8377]",
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true;
    if (activeTab === "outstanding") return invoice.status === "Sent";
    if (activeTab === "paid") return invoice.status === "Paid";
    if (activeTab === "overdue") return dateChecker(invoice);
    return true;
  });

  return (
    <div>
      <div className="hidden md:grid grid-cols-[1.1fr_1.4fr_1fr_0.8fr_0.9fr_1.4fr] items-center px-6 py-3 bg-mist border-y border-parchment text-xs font-semibold tracking-wide text-stone uppercase">
        <div>Invoice</div>
        <div>Client</div>
        <div>Due Date</div>
        <div className="text-center">Total</div>
        <div className="text-center">Status</div>
        <div className="text-center">Actions</div>
      </div>

      <div className="flex flex-col max-h-[500px] overflow-y-auto mask-b-from-87% mask-b-to-100%">
        {filteredInvoices.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#8a8377]">
            No invoices in this view.
          </div>
        ) : (
          filteredInvoices.map((invoice, idx) => (
            <div
              key={invoice.id}
              className={`grid grid-cols-2 md:grid-cols-[1.1fr_1.4fr_1fr_0.8fr_0.9fr_1.4fr] gap-y-2 md:gap-y-0 items-center px-4 sm:px-6 py-5 ${
                idx !== filteredInvoices.length - 1
                  ? "border-b border-[#efece4]"
                  : ""
              }`}
            >
              <div className="text-sm text-ink md:order-0 order-1 col-span-2 md:col-span-1">
                {invoice.invoiceNumber}
              </div>

              <div className="order-2 md:order-0 col-span-2 md:col-span-1">
                <div className="font-semibold text-ink leading-tight">
                  {invoice.client.name}
                </div>
                <div className="text-sm text-stone">
                  {invoice.client.companyName}
                </div>
              </div>

              <div className="text-sm text-ink/90 inline-flex items-center gap-1 order-3 md:order-0">
                {invoice.dueDate}
                {dateChecker(invoice) && activeTab !== "overdue" && (
                  <span className="relative inline-flex text-red-400 cursor-pointer group">
                    <CircleAlert size={16} />
                    <Tooltip label="Invoice is Overdue" />
                  </span>
                )}
              </div>

              <div className="text-left md:text-center text-sm text-ink order-4 md:order-0">
                {currency}
                {invoice.invoiceTotal.total}
              </div>

              <div className="flex justify-start md:justify-center order-5 md:order-0">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase ${
                    STATUS_STYLES[invoice.status]
                  }`}
                >
                  {invoice.status}
                </span>
              </div>

              <InvoiceActions
                invoices={invoices}
                invoice={invoice}
                deleteInvoice={deleteInvoice}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InvoiceTable
