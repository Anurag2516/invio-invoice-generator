import { FileText, LayoutDashboard, Users } from "lucide-react";
import type { Location, NavigateFunction } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

type SidebarNavProps = {
  location: Location;
  navigate: NavigateFunction;
  expanded: boolean;
};

const SidebarNav = ({ location, navigate, expanded }: SidebarNavProps) => {
  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FileText, label: "Invoices", path: "/invoices" },
    { icon: Users, label: "Clients", path: "/clients" },
  ];

  return (
    <div className="px-2 w-full">
      {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path;
        return (
          <Tooltip key={path} open={expanded ? false : undefined}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => navigate(path)}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 w-full px-3 ${expanded ? "py-2" : "py-3"} rounded-md text-[15px] transition-colors text-left ${
                  active
                    ? "bg-teal/10 text-teal font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    active
                      ? "text-teal"
                      : expanded
                        ? "text-muted-foreground"
                        : "text-foreground/80"
                  }
                />
                {expanded && label}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default SidebarNav;
