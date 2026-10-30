import { Moon, Sun, ChevronDown, LogOut, UserPen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type SidebarFooterProps = {
  username: string | undefined;
  setProfileModal: Dispatch<SetStateAction<boolean>>;
  expanded: boolean;
};

const SidebarFooter = ({
  username,
  setProfileModal,
  expanded,
}: SidebarFooterProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useAppStore();
  const { logout } = useAuthStore();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogoutClick = async () => {
    await logout();
    navigate("/login", { replace: true });
    queryClient.clear();
  };

  return (
    <div
      className={`px-3 flex ${expanded ? "flex-row justify-between py-3" : "flex-col py-4 gap-1.5"} items-center border-t border-border`}
    >
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <Tooltip open={menuOpen ? false : undefined}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="User profile"
                className={`${expanded ? "order-1" : "order-2"} flex gap-1.5 items-center hover:bg-muted px-2 rounded-lg cursor-pointer`}
              >
                <div className="size-7 rounded-full bg-teal flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-medium text-white">
                    {username
                      ?.split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>

                {expanded && (
                  <>
                    <span className="text-sm text-wide">
                      {username?.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className="text-stone" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">User profile</TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align="start"
          onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
        >
          <DropdownMenuItem
            onClick={() => setProfileModal(true)}
            variant="default"
          >
            <UserPen /> Edit Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogoutClick}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          className={`${expanded ? "order-2" : "order-1"} p-2.5 hover:bg-foreground/10 text-foreground/80 cursor-pointer rounded-md transition-colors duration-150 ease-in-out`}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </TooltipTrigger>
        <TooltipContent>
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SidebarFooter;
