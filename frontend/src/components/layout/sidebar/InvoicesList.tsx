import { ReceiptText } from "lucide-react";
import { InvoiceListSkeleton } from "../../ui/skeleton/SidebarInvoicesSkeleton";
import { STATUS_STYLES } from "@/constants/statusStyles";
import { getCurrencySign } from "@/utils/currency";
import type { InvoiceResponse } from "@/types/invoice";
import { type Dispatch, type SetStateAction } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import Dropdown from "./Dropdown";

export type InvoicesListProps = {
  expanded: boolean;
  onToggleExpand?: () => void;
  invoices: InvoiceResponse[];
  isInvoicesLoading: boolean;
  onInvoiceClick: (id: string) => void;
  setDeleteId: Dispatch<SetStateAction<string | null>>;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getMeta = (invoice: InvoiceResponse): string | null => {
  const due = invoice.dueDate ? new Date(invoice.dueDate) : null;

  if (invoice.isOverdue && due) {
    const days = Math.max(
      1,
      Math.floor((startOfToday().getTime() - due.getTime()) / DAY_MS),
    );
    return `${days} ${days === 1 ? "day" : "days"} overdue`;
  }
  if (invoice.status === "Sent" && due) {
    return `Due ${due.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
  }
  return null;
};

const InvoicesList = ({
  expanded,
  onToggleExpand,
  invoices,
  isInvoicesLoading,
  onInvoiceClick,
  setDeleteId,
}: InvoicesListProps) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  return (
    <div
      className={`flex flex-col gap-1 ${expanded && "pt-6"} pb-2 text-foreground flex-1 overflow-hidden`}
    >
      {expanded && (
        <h2 className="text-sm uppercase tracking-widest text-stone px-3 pb-1 border-b border-border">
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
          {invoices.map((invoice) => {
            const client =
              invoice.snapshotClientCompany || invoice.snapshotClientName;
            const meta = getMeta(invoice);
            return (
              <div
                key={invoice.id}
                onClick={() => onInvoiceClick(invoice.id)}
                className={`py-3 pl-3 pr-1.5 ml-0.5 mr-1.5 flex flex-col cursor-pointer border-l-5 transition-[background-color,border-color] duration-150 ease-in-out ${
                  id === invoice.id
                    ? "border-teal dark:bg-teal-tint/50 bg-teal-tint"
                    : "border-transparent bg-background hover:bg-teal-tint dark:hover:bg-teal-tint/40"
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span
                    className={`min-w-0 truncate text-sm font-medium ${
                      client
                        ? "text-foreground/90"
                        : "italic text-foreground/50"
                    }`}
                  >
                    {client ?? "No client"}
                  </span>
                  <div className="flex items-center gap-0.75 shrink-0">
                    <p
                      className={`inline-flex items-center justify-center py-1 px-1.5 sm:px-2 leading-none text-[11px] font-semibold tracking-widest uppercase rounded-sm ${STATUS_STYLES[invoice.status]}`}
                    >
                      {invoice.status}
                    </p>
                    <Dropdown invoice={invoice} setDeleteId={setDeleteId} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pr-1 text-xs text-stone">
                  <span className="truncate">
                    {invoice.invoiceNumber}
                    <span
                      className={`${invoice.isOverdue ? "text-red-600 dark:text-[#ec7e7e]" : ""}`}
                    >
                      {meta && ` · ${meta}`}
                    </span>
                  </span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {getCurrencySign(invoice.currency)}
                      {invoice.total}
                    </span>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="flex items-center justify-center pt-8 text-stone">
          No invoices in this view.
        </div>
      )}
      {expanded && (
        <Button
          onClick={() => navigate("/invoices")}
          className="mx-3 mt-4 py-3 bg-teal-tint hover:bg-teal-tint-hover 
          border border-teal-border text-teal-dark dark:text-teal-text"
        >
          View all invoices
        </Button>
      )}
    </div>
  );
};

export default InvoicesList;
