import { Menu, Plus, UserPlus } from "lucide-react";
import { Button } from "../ui/Button";
import { useAppStore } from "@/store/appStore";

type HeaderProps = {
  userName: string | undefined;
  setMode: React.Dispatch<React.SetStateAction<"Create" | "Edit" | null>>;
  handleNewInvoiceClick: () => void;
  isPending: boolean;
};

function Header({
  userName,
  setMode,
  handleNewInvoiceClick,
  isPending,
}: HeaderProps) {
  const { toggleSidebar } = useAppStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3 bg-background border-b border-stone/30">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="block xl:hidden text-foreground"
        >
          <Menu size={16} />
        </button>
        <h1 className="text-base sm:text-xl text-foreground font-medium">
          {getGreeting()}, {userName?.split(" ")[0]}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={() => setMode("Create")}
          className="hidden sm:flex py-4 bg-teal-tint dark:bg-teal-tint/60 hover:bg-teal-tint-hover 
          border border-teal-border text-teal-dark dark:text-teal-text"
        >
          <UserPlus size={14} className="hidden xs:block shrink-0" />
          <span className="text-[13px] xs:text-[15px]">Add client</span>
        </Button>
        <Button
          type="button"
          onClick={handleNewInvoiceClick}
          disabled={isPending}
          className="bg-teal hover:bg-teal-dark text-white py-4"
        >
          <Plus size={14} className="hidden xs:block shrink-0" />
          <span className="text-[13px] xs:text-[15px] font-medium">
            New invoice
          </span>
        </Button>
      </div>
    </header>
  );
}

export default Header;
