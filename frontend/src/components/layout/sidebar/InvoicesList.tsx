import {
  CircleAlert,
  Download,
  EllipsisVertical,
  ReceiptText,
  Trash2,
} from "lucide-react";
import { InvoiceListSkeleton } from "../../ui/skeleton/SidebarInvoicesSkeleton";
import { STATUS_STYLES } from "@/constants/statusStyles";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../../invoice-editor/invoice-pdf/InvoicePDF";
import { getCurrencySign } from "@/utils/currency";
import type { InvoiceResponse } from "@/types/invoice";
import { type Dispatch, type SetStateAction } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export type InvoicesListProps = {
  expanded: boolean;
  onToggleExpand?: () => void;
  invoices: InvoiceResponse[];
  isInvoicesLoading: boolean;
  activeInvoiceId: string | null;
  onInvoiceClick: (id: string) => void;
  setDeleteId: Dispatch<SetStateAction<string | null>>;
};

const InvoicesList = ({
  expanded,
  onToggleExpand,
  invoices,
  isInvoicesLoading,
  activeInvoiceId,
  onInvoiceClick,
  setDeleteId,
}: InvoicesListProps) => (
  <div
    className={`flex flex-col gap-1 ${expanded && "pt-6"} pb-2 text-foreground flex-1 overflow-hidden`}
  >
    {expanded && (
      <h2 className="text-sm uppercase tracking-widest text-stone px-4 pb-1">
        Recent Invoices
      </h2>
    )}
    {isInvoicesLoading ? (
      <InvoiceListSkeleton />
    ) : !expanded ? (
      <Tooltip>
        <TooltipTrigger>
          <button
            type="button"
            onClick={onToggleExpand}
            className="w-full flex items-center justify-center py-3 text-foreground/80 hover:bg-muted transition-colors cursor-pointer"
            title="My Invoices"
          >
            <ReceiptText size={18} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">My Invoices</TooltipContent>
      </Tooltip>
    ) : invoices.length > 0 ? (
      <>
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            onClick={() => onInvoiceClick(invoice.id)}
            className={`py-3 pl-3 pr-1.5 ml-0.5 mr-1.5 flex flex-col cursor-pointer transition-[background-color, border-color, border-left-width] duration-150 ease-in-out ${activeInvoiceId === invoice.id ? "bg-black/10 dark:bg-white/10 border-l-5 border-teal" : "bg-background hover:bg-black/5 dark:hover:bg-white/5"}`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-foreground/90 text-sm font-semibold tracking-wide">
                {invoice.invoiceNumber}
              </h2>
              <div className="flex items-center gap-0.75">
                {invoice.isOverdue ? (
                  <Tooltip>
                    <TooltipTrigger className="bg-[#f1e3df] dark:bg-[#3a1f1f] text-[#b42318] dark:text-[#e08a8a] inline-flex items-center justify-center gap-1 h-5 px-1.5 text-[11px] font-medium tracking-widest uppercase rounded-sm">
                      <CircleAlert size={12} /> Overdue
                    </TooltipTrigger>
                    <TooltipContent>This invoice is overdue</TooltipContent>
                  </Tooltip>
                ) : (
                  <p
                    className={`inline-flex items-center justify-center py-1 px-1.5 sm:px-3 leading-none text-[11px] font-semibold tracking-widest uppercase rounded-sm ${STATUS_STYLES[invoice.status]}`}
                  >
                    {invoice.status}
                  </p>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
                      className="p-1 rounded-sm text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors duration-150 ease-in-out cursor-pointer"
                    >
                      <EllipsisVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
                  >
                    <DropdownMenuItem asChild>
                      <PDFDownloadLink
                        document={
                          <InvoicePDF
                            invoice={invoice}
                            currency={getCurrencySign(invoice.currency)}
                          />
                        }
                        fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                        className="flex items-center gap-2 py-2 w-full cursor-pointer transition-colors"
                      >
                        <Download size={14} />
                        Download Invoice
                      </PDFDownloadLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteId(invoice.id)}
                      className="flex items-center gap-2 py-2 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete Invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-stone text-[13px] pt-1.5 truncate">
              {invoice.snapshotClientName}
              {invoice.snapshotClientCompany && (
                <span> · {invoice.snapshotClientCompany}</span>
              )}
            </p>
            <span className="text-stone text-[13px] font-medium tabular-nums">
              {getCurrencySign(invoice.currency)}
              {invoice.total}
            </span>
          </div>
        ))}
      </>
    ) : (
      <div className="flex items-center justify-center pt-8 text-stone">
        No invoices in this view.
      </div>
    )}
  </div>
);

export default InvoicesList;
