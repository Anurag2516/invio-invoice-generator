import { useInvoiceStore } from "@/store/invoiceStore";
import { useShallow } from "zustand/react/shallow";
import {
  ChevronLast,
  ChevronFirst,
  Plus,
  ReceiptText,
  Trash2,
  CircleAlert,
  EllipsisVertical,
  Download,
} from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";
import { dateChecker } from "@/utils/dateChecker";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import { STATUS_STYLES } from "@/constants/statusStyles";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../invoice-pdf/InvoicePDF";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getCurrencySign } from "@/utils/currency";
import type { Invoice } from "@/types/invoice";

type SidebarContentProps = {
  expanded: boolean;
  onToggleExpand?: () => void;
  invoices: Invoice[];
  activeInvoiceId: string | null;
  onInvoiceClick: (id: string) => void;
  onNewInvoiceClick: () => void;
  onDeleteBtnClick: (e: React.SyntheticEvent, id: string) => void;
};

function SidebarContent({
  expanded,
  onToggleExpand,
  invoices,
  activeInvoiceId,
  onInvoiceClick,
  onNewInvoiceClick,
  onDeleteBtnClick,
}: SidebarContentProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <nav className="flex items-center justify-between px-3 py-4 border-b border-stone/25">
        {expanded && (
          <h1 className="text-2xl tracking-wide italic font-semibold px-1">
            <Link to="/" className="text-foreground">
              Invio
            </Link>
          </h1>
        )}
        {onToggleExpand && (
          <Tooltip>
            <TooltipTrigger
              onClick={onToggleExpand}
              className={`p-1.5 rounded-md text-foreground/50 hover:text-foreground hover:bg-foreground/8 transition-colors duration-150 ease-in-out cursor-pointer ${!expanded && "mx-auto"}`}
            >
              {expanded ? (
                <ChevronFirst size={18} />
              ) : (
                <ChevronLast size={18} />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {expanded ? "Close Sidebar" : "Open Sidebar"}
            </TooltipContent>
          </Tooltip>
        )}
      </nav>

      <div className="px-3 pt-5">
        <button
          type="button"
          onClick={onNewInvoiceClick}
          title="New Invoice"
          className="flex items-center justify-center gap-1.5 bg-teal hover:bg-teal-dark text-white rounded-lg transition-colors duration-150 ease-in-out cursor-pointer w-full py-2 sm:py-3"
        >
          <Plus size={16} />
          {expanded && (
            <span className="text-sm font-semibold tracking-wider uppercase">
              New Invoice
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2 pt-6 pb-2 text-foreground flex-1 overflow-hidden">
        {expanded && (
          <h2 className="text-sm uppercase tracking-widest text-stone px-4 pb-1">
            My Invoices
          </h2>
        )}
        {invoices.length > 0 ? (
          <ScrollArea className="overflow-y-auto flex-1">
            {expanded ? (
              invoices.map((invoice) => (
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
                      {dateChecker(invoice) ? (
                        <Tooltip>
                          <TooltipTrigger className="bg-[#f1e3df] dark:bg-[#3a1f1f] text-[#b42318] dark:text-[#e08a8a] inline-flex items-center justify-center gap-1 h-5 px-1.5 text-[11px] font-medium tracking-widest uppercase rounded-sm">
                            <CircleAlert size={12} /> Overdue
                          </TooltipTrigger>
                          <TooltipContent>
                            This invoice is overdue
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <p
                          className={`inline-flex items-center justify-center py-1 px-1.5 sm:px-3 leading-none text-[11px] font-semibold tracking-widest uppercase rounded-sm ${
                            STATUS_STYLES[invoice.status]
                          }`}
                        >
                          {invoice.status}
                        </p>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={(e: React.SyntheticEvent) =>
                              e.stopPropagation()
                            }
                            className="p-1 rounded-sm text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors duration-150 ease-in-out cursor-pointer"
                          >
                            <EllipsisVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          onClick={(e: React.SyntheticEvent) =>
                            e.stopPropagation()
                          }
                        >
                          <DropdownMenuItem asChild>
                            <PDFDownloadLink
                              document={
                                <InvoicePDF
                                  activeInvoice={invoice}
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
                            onClick={(e: React.SyntheticEvent) =>
                              onDeleteBtnClick(e, invoice.id)
                            }
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
                    {invoice.client.name}
                    {invoice.client.companyName && (
                      <span> · {invoice.client.companyName}</span>
                    )}
                  </p>
                  <span className="text-stone text-[13px] font-medium tabular-nums">
                    {getCurrencySign(invoice.currency)}
                    {invoice.invoiceTotal.total}
                  </span>
                </div>
              ))
            ) : (
              <button
                type="button"
                onClick={onToggleExpand}
                className="w-full flex items-center justify-center py-3 text-foreground/40 hover:text-foreground/80 transition-colors cursor-pointer"
                title="My Invoices"
              >
                <ReceiptText size={18} />
              </button>
            )}
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center pt-8 text-stone">
            No invoices in this view.
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const navigate = useNavigate();

  const { invoices, newInvoice, loadInvoice, deleteInvoice } = useInvoiceStore(
    useShallow((state) => ({
      invoices: state.invoices,
      newInvoice: state.newInvoice,
      loadInvoice: state.loadInvoice,
      deleteInvoice: state.deleteInvoice,
    })),
  );

  const { sidebarOpen, toggleSidebar } = useAppStore(
    useShallow((state) => ({
      sidebarOpen: state.sidebarOpen,
      toggleSidebar: state.toggleSidebar,
    })),
  );

  const handleInvoiceClick = (id: string) => {
    loadInvoice(id);
    setActiveInvoiceId(id);
    if (window.innerWidth < 1280) toggleSidebar();
  };

  const handleNewInvoiceClick = () => {
    navigate("/invoices/new");
    newInvoice();
    setActiveInvoiceId(null);
    if (window.innerWidth < 1280) toggleSidebar();
  };

  const handleDeleteBtnClick = (e: React.SyntheticEvent, id: string) => {
    e.stopPropagation();
    setDeleteModalId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteModalId) {
      deleteInvoice(deleteModalId);
      if (activeInvoiceId === deleteModalId) setActiveInvoiceId(null);
      setDeleteModalId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalId(null);
  };

  const deleteTargetInvoice = invoices.find(
    (invoice) => invoice.id === deleteModalId,
  );

  const sharedProps = {
    invoices,
    activeInvoiceId,
    onInvoiceClick: handleInvoiceClick,
    onNewInvoiceClick: handleNewInvoiceClick,
    onDeleteBtnClick: handleDeleteBtnClick,
  };

  return (
    <>
      <aside
        className={`
          hidden xl:block bg-background border-r border-stone/30
          transition-[width] duration-250 ease-in-out
          ${expanded ? "w-57.5" : "w-14"}
        `}
      >
        <SidebarContent
          expanded={expanded}
          onToggleExpand={() => setExpanded((curr) => !curr)}
          {...sharedProps}
        />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={toggleSidebar}>
        <SheetContent
          side="left"
          className="p-0 w-57.5 xl:hidden [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Invoice Sidebar</SheetTitle>
          <SidebarContent expanded={true} {...sharedProps} />
        </SheetContent>
      </Sheet>

      {deleteModalId && (
        <DeleteConfirmModal
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
          deleteTargetInvoice={deleteTargetInvoice}
        />
      )}
    </>
  );
}
