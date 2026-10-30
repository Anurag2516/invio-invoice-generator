import { ChevronFirst, ChevronLast, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Button } from "../../ui/Button";
import { Spinner } from "../../ui/spinner";
import { Link, type PathMatch } from "react-router-dom";

type SidebarHeaderProps = {
  expanded: boolean;
  onToggleExpand?: () => void;
  isPending: boolean;
  onNewInvoiceClick: () => void;
  isEditPage: PathMatch<"id"> | null;
};

const SidebarHeader = ({
  expanded,
  onToggleExpand,
  isPending,
  onNewInvoiceClick,
  isEditPage,
}: SidebarHeaderProps) => {
  return (
    <div>
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

      {isEditPage && (
        <div className="px-3 pt-3">
          {expanded ? (
            <Button
              type="button"
              disabled={isPending}
              onClick={onNewInvoiceClick}
              title="New Invoice"
              variant="default"
              className="w-full py-4 bg-teal disabled:bg-teal/90 hover:bg-teal-dark text-white"
            >
              {isPending ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : (
                <>
                  <Plus size={16} />

                  <span className="text-[15px]">New Invoice</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isPending}
              onClick={onNewInvoiceClick}
              title="New Invoice"
              variant="default"
              className="w-full py-4 bg-teal disabled:bg-teal/90 hover:bg-teal-dark text-white"
            >
              {isPending ? <Spinner /> : <Plus size={16} />}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
