import { getCurrencySign } from "@/utils/currency";
import { formatDate } from "@/utils/formatDate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STATUS_STYLES } from "@/constants/statusStyles";
import type { InvoiceResponse } from "@/types/invoice";
import { CircleAlert } from "lucide-react";

const colWidths = (
  <>
    <col className="w-[15%]" />
    <col className="w-[29%]" />
    <col className="w-[16%]" />
    <col className="w-[16%]" />
    <col className="w-[14%]" />
  </>
);

const RecentInvoiceTable = ({ invoices }: { invoices: InvoiceResponse[] }) => (
    <>
      <div className="md:hidden flex flex-col divide-y divide-border w-full border border-border shadow-xs rounded-lg bg-background overflow-hidden">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex flex-col gap-4 px-4 py-4">
            <span className="text-[13px] font-medium">
              {invoice.invoiceNumber}
            </span>

            <div className="flex items-start justify-between">
              <div>
                {invoice.snapshotClientName || invoice.snapshotClientCompany ? (
                  <>
                    <div className="font-semibold text-foreground leading-tight">
                      {invoice.snapshotClientName}
                    </div>
                    <div className="text-stone text-[13px]">
                      {invoice.snapshotClientCompany}
                    </div>
                  </>
                ) : (
                  <span className="text-stone">No client</span>
                )}
              </div>
              <span className="text-base font-semibold text-foreground">
                {getCurrencySign(invoice.currency)}
                {invoice.total}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase ${STATUS_STYLES[invoice.status]}`}
              >
                {invoice.status}
              </span>
              <span className="text-foreground/80 inline-flex items-center gap-1 text-[13px]">
                {invoice.dueDate ? (
                  formatDate(invoice.dueDate)
                ) : (
                  <span className="text-stone">No due date</span>
                )}
                {invoice.isOverdue && (
                  <Tooltip>
                    <TooltipTrigger className="relative inline-flex text-red-400 cursor-pointer">
                      <CircleAlert size={16} />
                    </TooltipTrigger>
                    <TooltipContent>Invoice is Overdue</TooltipContent>
                  </Tooltip>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:flex w-full flex-col border border-border shadow-xs rounded-lg bg-background overflow-hidden">
        <Table>
          <colgroup>{colWidths}</colgroup>
          <TableHeader className="bg-warm-background dark:bg-sidebar">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 text-xs font-semibold tracking-wide text-stone uppercase">
                Invoice
              </TableHead>
              <TableHead className="px-6 text-xs font-semibold tracking-wide text-stone uppercase">
                Client
              </TableHead>
              <TableHead className="px-6 text-xs font-semibold tracking-wide text-stone uppercase">
                Due Date
              </TableHead>
              <TableHead className="px-6 text-xs font-semibold tracking-wide text-stone uppercase text-center">
                Total
              </TableHead>
              <TableHead className="px-6 text-xs font-semibold tracking-wide text-stone uppercase text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="px-6 text-sm text-foreground">
                  {invoice.invoiceNumber}
                </TableCell>

                <TableCell className="px-6 py-2.5 text-sm overflow-hidden">
                  {invoice.snapshotClientName ||
                  invoice.snapshotClientCompany ? (
                    <>
                      <div className="font-semibold text-foreground leading-tight">
                        {invoice.snapshotClientName}
                      </div>
                      <div className="text-stone text-[13px]">
                        {invoice.snapshotClientCompany}
                      </div>
                    </>
                  ) : (
                    <span className="text-stone">Not selected</span>
                  )}
                </TableCell>

                <TableCell className="px-6 text-sm text-foreground/90">
                  <span className="inline-flex items-center gap-1">
                    {invoice.dueDate ? (
                      formatDate(invoice.dueDate)
                    ) : (
                      <span className="text-stone">Not set</span>
                    )}
                    {invoice.isOverdue && (
                      <Tooltip>
                        <TooltipTrigger className="relative inline-flex text-red-400 cursor-pointer group">
                          <CircleAlert size={16} />
                        </TooltipTrigger>
                        <TooltipContent>Invoice is Overdue</TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </TableCell>

                <TableCell className="px-6 text-sm text-foreground text-center">
                  {getCurrencySign(invoice.currency)}
                  {invoice.total}
                </TableCell>

                <TableCell className="px-6 text-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase ${STATUS_STYLES[invoice.status]}`}
                  >
                    {invoice.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );

export default RecentInvoiceTable;
