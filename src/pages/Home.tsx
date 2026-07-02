import InvoiceFilterTabs from "@/components/home/InvoiceFilterTabs";
import InvoiceTable from "@/components/home/InvoiceTable";
import StatsCards from "@/components/home/StatsCards";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/store/appStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Moon, Plus, Sun } from "lucide-react";
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
  const { theme, toggleTheme } = useAppStore(
    useShallow((state) => ({
      theme: state.theme,
      toggleTheme: state.toggleTheme,
    })),
  );

  const handleNewInvoiceClick = () => {
    newInvoice();
    navigate("/invoices/new");
  };

  return (
    <div>
      <header className="flex items-center justify-between px-4 sm:px-8 lg:px-24 py-3 bg-background border-b border-stone/30">
        <h1 className="text-[22px] sm:text-2xl text-foreground font-bold italic tracking-wide">
          Invio
        </h1>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Tooltip>
            <TooltipTrigger
              className="p-2 hover:bg-foreground/10 text-foreground/80 cursor-pointer rounded-md transition-colors duration-150 ease-in-out"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="size-5.5 sm:size-6 shrink-0" />
              ) : (
                <Moon className="size-5.5 sm:size-6 shrink-0" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"}
            </TooltipContent>
          </Tooltip>

          <button
            type="button"
            onClick={handleNewInvoiceClick}
            className="flex items-center justify-center gap-1.5 bg-teal hover:bg-teal-dark text-white shadow-md rounded-md transition-colors duration-150 ease-in-out cursor-pointer py-2 xs:py-2.5 px-3 xs:px-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus size={15} className="hidden xs:block shrink-0" />
            <span className="text-[13px] xs:text-sm font-bold tracking-wide uppercase">
              New Invoice
            </span>
          </button>
        </div>
      </header>

      <StatsCards invoices={invoices} />

      <div className="pt-14 pb-20 px-4 sm:px-8 lg:px-24 bg-background">
        <h2 className="text-2xl text-foreground font-medium pb-4">
          My Invoices
        </h2>
        <div className="bg-background flex items-start justify-center w-full">
          <div className=" w-full flex flex-col border border-border shadow-xs rounded-lg bg-background overflow-hidden">
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
