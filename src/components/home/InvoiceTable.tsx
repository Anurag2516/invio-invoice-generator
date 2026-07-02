import type { Invoice } from "@/types/invoice";
import InvoiceActions from "./InvoiceActions";
import { dateChecker } from "@/utils/dateChecker";
import { CircleAlert } from "lucide-react";
import type { useInvoiceStore } from "@/store/invoiceStore";
import type { ActiveTab } from "@/pages/Home";
import { ScrollArea } from "../ui/scroll-area";
import { STATUS_STYLES } from "@/constants/statusStyles";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { getCurrencySign } from "@/utils/currency";

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
  activeTab,
}: InvoiceTableProps) => {
  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true;
    if (activeTab === "outstanding") return invoice.status === "Sent";
    if (activeTab === "paid") return invoice.status === "Paid";
    if (activeTab === "overdue") return dateChecker(invoice);
    return true;
  });

  return (
    <div>
      <div className="hidden md:grid grid-cols-[1.1fr_1.4fr_1fr_0.8fr_0.9fr_1.4fr] items-center px-6 py-3 bg-warm-background dark:bg-sidebar border-y border-border text-xs font-semibold tracking-wide text-stone uppercase">
        <div>Invoice</div>
        <div>Client</div>
        <div>Due Date</div>
        <div className="text-center">Total</div>
        <div className="text-center">Status</div>
        <div className="text-center">Actions</div>
      </div>

      <ScrollArea className="flex flex-col max-h-125">
        {filteredInvoices.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-stone">
            No invoices in this view.
          </div>
        ) : (
          filteredInvoices.map((invoice, idx) => (
            <div
              key={invoice.id}
              className={`grid grid-cols-2 md:grid-cols-[1.1fr_1.4fr_1fr_0.8fr_0.9fr_1.4fr] gap-y-2 md:gap-y-0 items-center px-4 sm:px-6 py-5 ${
                idx !== filteredInvoices.length - 1
                  ? "border-b border-border"
                  : ""
              }`}
            >
              <div className="text-sm text-foreground md:order-0 order-1 col-span-2 md:col-span-1">
                {invoice.invoiceNumber}
              </div>

              <div className="order-2 md:order-0 col-span-2 md:col-span-1">
                <div className="font-semibold text-foreground leading-tight">
                  {invoice.client.name}
                </div>
                <div className="text-sm text-stone">
                  {invoice.client.companyName}
                </div>
              </div>

              <div className="text-sm text-foreground/90 inline-flex items-center gap-1 order-3 md:order-0">
                {invoice.dueDate}
                {dateChecker(invoice) && activeTab !== "overdue" && (
                  <Tooltip>
                    <TooltipTrigger className="relative inline-flex text-red-400 cursor-pointer group">
                      <CircleAlert size={16} />
                    </TooltipTrigger>
                    <TooltipContent>Invoice is Overdue</TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="text-left md:text-center text-sm text-foreground order-4 md:order-0">
                {getCurrencySign(invoice.currency)}
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
      </ScrollArea>
    </div>
  );
};

export default InvoiceTable;
