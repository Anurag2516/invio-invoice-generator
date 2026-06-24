import InvoiceFilterTabs from "@/components/home/InvoiceFilterTabs";
import InvoiceTable from "@/components/home/InvoiceTable";
import StatsCards from "@/components/home/StatsCards";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

export type ActiveTab = "all" | "outstanding" | "paid" | "overdue";

const Home = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");

  const navigate = useNavigate();

  const { invoices, newInvoice, deleteInvoice } = useInvoiceStore(
    useShallow((state) => ({
      invoices: state.invoices,
      newInvoice: state.newInvoice,
      deleteInvoice: state.deleteInvoice,
    })),
  );

  const handleNewInvoiceClick = () => {
    newInvoice();
    navigate("/invoices/new");
  };

  return (
    <div>
      <header className="flex items-center justify-between px-4 sm:px-8 lg:px-24 py-3 bg-paper border-b border-parchment">
        <span className="text-2xl font-bold italic">Invio</span>
        <button
          type="button"
          onClick={handleNewInvoiceClick}
          title="New Invoice"
          className="flex items-center justify-center gap-1 bg-teal hover:bg-teal-dark text-paper shadow-md rounded-lg transition-colors cursor-pointer py-2 px-2.5 sm:py-3"
        >
          <Plus size={16} />
          <span className="text-[14px] font-bold tracking-wider uppercase">
            New Invoice
          </span>
        </button>
      </header>

      <StatsCards invoices={invoices} />

      <div className="pt-10 px-4 sm:px-8 lg:px-24">
        <h2 className="text-2xl text-ink font-medium pb-4">My Invoices</h2>
        <div className="min-h-screen bg-paper flex items-start justify-center w-full">
          <div className=" w-full flex flex-col border border-parchment rounded-lg bg-white overflow-hidden">
            <InvoiceFilterTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <InvoiceTable
              invoices={invoices}
              deleteInvoice={deleteInvoice}
              activeTab={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
