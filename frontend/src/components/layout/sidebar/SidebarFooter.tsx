import { Moon, Sun, ChevronDown, LogOut, UserPen, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PasswordInput from "@/components/ui/PasswordInput";

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
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [deleting, setDeleting] = useState(false);

  const { theme, toggleTheme } = useAppStore();
  const { logout, deleteAccount } = useAuthStore();

  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (deleting) return;
    setDeleteOpen(open);
    if (!open) setPasswordInput("");
  };

  const handleDelete = async (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();

    if (deleting || passwordInput === "") return;
    setDeleting(true);
    try {
      const ok = await deleteAccount(passwordInput);
      if (ok) {
        setDeleteOpen(false);
        setPasswordInput("");
        navigate("/signup", { replace: true });
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className={`px-3 flex ${expanded ? "flex-row justify-between py-3" : "flex-col py-4 gap-1.5"} items-center border-t border-border`}
      >
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <Tooltip
            open={menuOpen ? false : tooltipOpen}
            onOpenChange={setTooltipOpen}
          >
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
            className="w-50"
            onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => setProfileModal(true)}>
              <UserPen /> Edit profile
            </DropdownMenuItem>

            <DropdownMenuItem disabled={loggingOut} onClick={handleLogoutClick}>
              <LogOut />
              {loggingOut ? "Logging out…" : "Log out"}
              {loggingOut && <Spinner />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              disabled={deleting}
              onClick={() => setDeleteOpen(true)}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 /> Delete account
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

      <AlertDialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently deletes your account and all your data.
              This action can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <label htmlFor="confirm">Confirm password to continue</label>
            <PasswordInput
              id="confirm"
              autoComplete="current-password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              disabled={deleting}
              className="h-10 mt-1"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={passwordInput === "" || deleting}
              onClick={handleDelete}
            >
              {deleting && <Spinner />}
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SidebarFooter;
