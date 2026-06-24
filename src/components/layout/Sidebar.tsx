import { useInvoiceStore } from "@/store/invoiceStore";
import { useShallow } from "zustand/react/shallow";
import {
  ChevronLast,
  ChevronFirst,
  Plus,
  ReceiptText,
  Trash2,
  CircleAlert,
} from "lucide-react";
import { useState } from "react";
import { currencyOptions } from "@/constants/currencies";
import { useAppStore } from "@/store/appStore";
import { useNavigate } from "react-router-dom";
import type { Status } from "@/types/invoice";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";
import { dateChecker } from "@/utils/dateChecker";

export default function Sidebar() {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
  const STATUS_STYLES: Record<Status, string> = {
    Sent: "bg-[#1e2f45] text-[#7ba8e0]",
    Paid: "bg-[#426F4F]/75 text-[#bce8c7]",
    Draft: "bg-[#2a2825] text-[#b3aa9c]",
  };

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
              className="flex items-center justify-center gap-1.5 bg-teal hover:bg-teal-dark text-white rounded-lg transition-colors cursor-pointer w-full py-2 sm:py-3"
            >
              <Plus size={16} />
              {expanded && (
                <span className="text-sm font-semibold tracking-wider uppercase">
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
                    className={`group relative py-3 pl-3 pr-3 flex flex-col gap-1 cursor-pointer transition-all ${activeInvoiceId === invoice.id ? "bg-white/10 border-l-2 border-teal" : "bg-ink hover:bg-white/5"}`}
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-white text-sm font-semibold tracking-wide">
                        #{invoice.invoiceNumber}
                      </h2>
                      <div className="flex items-center gap-1">
                        {dateChecker(invoice) ? (
                          <span className="bg-[#3a1f1f] text-[#e08a8a] inline-flex items-center justify-center gap-1 h-5 px-2 text-[11px] font-medium tracking-widest uppercase rounded-sm">
                            <CircleAlert size={12} /> Overdue
                          </span>
                        ) : (
                          <p
                            className={`inline-flex items-center justify-center h-5 px-2 text-[11px] font-medium tracking-widest uppercase rounded-sm ${
                              STATUS_STYLES[invoice.status]
                            }`}
                          >
                            {invoice.status}
                          </p>
                        )}

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
                    <span className="text-[#dcd6cd]/80 text-[13px] font-medium tabular-nums">
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
          <DeleteConfirmModal
            handleConfirmDelete={handleConfirmDelete}
            handleCancelDelete={handleCancelDelete}
            deleteTargetInvoice={deleteTargetInvoice}
          />
        )}
      </aside>
    </>
  );
}