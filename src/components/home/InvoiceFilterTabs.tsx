import type { ActiveTab } from "@/pages/Home";
import type { SetStateAction } from "react";

interface InvoiceFilterTabsProps {
  activeTab: ActiveTab;
  setActiveTab: React.Dispatch<SetStateAction<ActiveTab>>;
}

const InvoiceFilterTabs = ({
  activeTab,
  setActiveTab,
}: InvoiceFilterTabsProps) => {
    
  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "all", label: "All Invoices" },
    { key: "outstanding", label: "Outstanding" },
    { key: "paid", label: "Paid" },
    { key: "overdue", label: "Overdue" },
  ];

  return (
    <div className="flex items-center gap-2 px-4 sm:px-6 pt-6 pb-4 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
              isActive
                ? "bg-ink/90 text-paper border-ink/90"
                : "bg-transparent text-stone border-parchment hover:border-[#cfc9bb] hover:text-[#5c5750]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default InvoiceFilterTabs;
