import { Plus, UserPlus } from "lucide-react";
import { Button } from "../ui/Button";

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
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3 bg-background border-b border-stone/30">
      <h1 className="text-lg sm:text-xl text-foreground font-medium">
        {getGreeting()}, {userName?.split(" ")[0]}
      </h1>

      <div className="hidden sm:flex items-center gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => setMode("Create")}
          className="py-5"
        >
          <UserPlus size={15} className="hidden xs:block shrink-0" />
          <span className="text-[13px] xs:text-[15px]">Add client</span>
        </Button>
        <Button
          type="button"
          onClick={handleNewInvoiceClick}
          disabled={isPending}
          className="bg-teal hover:bg-teal-dark text-white py-5"
        >
          <Plus size={15} className="hidden xs:block shrink-0" />
          <span className="text-[13px] xs:text-[15px] font-semibold">
            New invoice
          </span>
        </Button>
      </div>
    </header>
  );
}

export default Header;
