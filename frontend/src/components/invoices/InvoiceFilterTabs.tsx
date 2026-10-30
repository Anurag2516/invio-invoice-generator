import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/Button";
import { ChevronDown } from "lucide-react";
import type { ActiveTab } from "@/types/invoice";

interface InvoiceFilterTabsProps {
  activeTab: ActiveTab | undefined;
  setActiveTab: (tab: ActiveTab | undefined) => void;
}

const InvoiceFilterTabs = ({
  activeTab,
  setActiveTab,
}: InvoiceFilterTabsProps) => {
  const tabs: { key: ActiveTab | undefined; label: string }[] = [
    { key: undefined, label: "All Invoices" },
    { key: "outstanding", label: "Outstanding" },
    { key: "paid", label: "Paid" },
    { key: "overdue", label: "Overdue" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const activeLabel = tabs.find((t) => t.key === activeTab)?.label;

  return (
    <>
      <div className="md:hidden py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 w-40 justify-between">
              {activeLabel}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {tabs.map((tab, idx) => (
              <div key={tab.key ?? "all"}>
                <DropdownMenuItem
                  onClick={() => setActiveTab(tab.key)}
                  className={
                    activeTab === tab.key ? "text-teal font-semibold" : ""
                  }
                >
                  {tab.label}
                </DropdownMenuItem>
                {idx !== tabs.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:flex items-center gap-2.5 py-4 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              type="button"
              key={tab.key ?? "all"}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-[color,border-color] duration-150 ease-in-out ${
                isActive
                  ? "bg-teal text-white border-transparent"
                  : "bg-transparent text-stone border-border hover:border-foreground/35 hover:text-foreground/85"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default InvoiceFilterTabs;
