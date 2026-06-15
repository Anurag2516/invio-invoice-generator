import { useInvoiceStore } from "@/store/invoiceStore";
import { useShallow } from "zustand/react/shallow";
import {
  ChevronLast,
  ChevronFirst,
  Plus,
  ReceiptText,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { currencyOptions } from "@/constants/currencies";
import { useAppStore } from "@/store/appStore";

export default function Sidebar() {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

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

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 xl:hidden transition-opacity duration-250 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          xl:relative xl:translate-x-0 xl:z-auto
          transition-all duration-250
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
          ${expanded ? "w-57.5" : "w-14"}
        `}
      >
        <div className="h-full flex flex-col bg-ink border-r border-white/8 shadow-sm">
          <nav className="flex items-center justify-between px-3 py-4 border-b border-white/8">
            {expanded && (
              <h1 className="text-white text-2xl tracking-wide italic font-semibold px-1">
                Invio
              </h1>
            )}
            <button
              type="button"
              onClick={() => setExpanded((curr) => !curr)}
              title={expanded ? "Close Sidebar" : "Open Sidebar"}
              className={`p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/8 transition-colors cursor-pointer ${!expanded && "mx-auto"}`}
            >
              {expanded ? (
                <ChevronFirst size={18} />
              ) : (
                <ChevronLast size={18} />
              )}
            </button>
          </nav>

          <div className="px-3 pt-5">
            <button
              type="button"
              onClick={handleNewInvoiceClick}
              title="New Invoice"
              className="flex items-center justify-center gap-1.5 bg-sage-green hover:bg-sage-green-dark text-white rounded-lg transition-colors cursor-pointer w-full py-2 sm:py-3"
            >
              <Plus size={16} />
              {expanded && (
                <span className="text-[14px] font-semibold tracking-wider uppercase">
                  New Invoice
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-6 text-white flex-1 overflow-hidden">
            {expanded && (
              <h2 className="text-sm uppercase tracking-widest text-white/40 px-4 pb-1">
                My Invoices
              </h2>
            )}

            <div className="overflow-y-auto flex-1">
              {expanded ? (
                invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    onClick={() => handleInvoiceClick(invoice.id)}
                    onMouseEnter={() => setHoveredId(invoice.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`group relative py-3 pl-3 pr-3 flex flex-col gap-1 cursor-pointer transition-all ${activeInvoiceId === invoice.id ? "bg-white/10 border-l-2 border-sage-green" : "bg-ink hover:bg-white/5"}`}
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-white text-sm font-semibold tracking-wide">
                        #{invoice.invoiceNumber}
                      </h2>
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center justify-center h-5 px-2 text-[11px] font-medium tracking-widest uppercase border border-white/20 text-white/50 rounded-sm">
                          {invoice.status}
                        </span>

                        {hoveredId === invoice.id && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteBtnClick(e, invoice.id)}
                            className="cursor-pointer text-white/70 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[#dcd6cd]/80 text-[13px] truncate">
                      {invoice.client.name}
                      {invoice.client.companyName && (
                        <span> · {invoice.client.companyName}</span>
                      )}
                    </p>
                    <span className="text-[#dcd6cd]/80 text-[13px] font-medium tabular-nums font-numbers">
                      {
                        currencyOptions.find(
                          (c) => c.value === invoice.currency,
                        )?.sign
                      }
                      {invoice.invoiceTotal.total}
                    </span>
                  </div>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="w-full flex items-center justify-center py-3 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                  title="My Invoices"
                >
                  <ReceiptText size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {deleteModalId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleCancelDelete}
          >
            <div className="absolute inset-0 bg-black/60" />

            <div
              className="relative z-10 bg-ink border border-white/12 rounded-xl shadow-2xl w-80 p-6 flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20">
                  <Trash2 size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold tracking-wide">
                    Delete Invoice
                  </h3>
                  <p className="text-white/50 text-xs mt-1 leading-relaxed">
                    {deleteTargetInvoice
                      ? `#${deleteTargetInvoice.invoiceNumber}${deleteTargetInvoice.client.name ? ` · ${deleteTargetInvoice.client.name}` : ""} will be permanently removed.`
                      : "This invoice will be permanently removed."}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase border border-white/12 text-white/60 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase bg-red-500/80 hover:bg-red-500 text-white transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}