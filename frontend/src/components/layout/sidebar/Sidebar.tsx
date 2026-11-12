import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ScrollArea } from "../../ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "../../ui/sheet";
import {
  useCreateDraftInvoice,
  useDeleteInvoice,
  useInvoices,
} from "@/hooks/useInvoices";
import DeleteInvoiceDialog from "../../ui/shared/DeleteInvoiceDialog";
import { useAuthStore } from "@/store/authStore";
import ProfileFormLoader from "./UserProfile";
import InvoicesList from "./InvoicesList";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";

export default function Sidebar() {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [profileModal, setProfileModal] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isEditPage = useMatch("/invoices/edit");
  const isNewInvoicePage = useMatch("/invoice/new");

  const username = useAuthStore((state) => state.user?.name);

  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get("id");

  const { data: invoices = [], isLoading: isInvoicesLoading } = useInvoices({
    limit: 7,
    sort: "updatedAt",
    order: "desc",
  });
  const { mutate: createDraft, isPending } = useCreateDraftInvoice();
  const { mutate: deleteInvoice, isPending: isDeletePending } =
    useDeleteInvoice();

  const { sidebarOpen, toggleSidebar } = useAppStore();

  const handleInvoiceClick = (invoiceId: string) => {
    setSearchParams({ id: invoiceId });
    if (window.innerWidth < 1280) toggleSidebar();
  };

  const handleNewInvoiceClick = async () => {
    createDraft(undefined, {
      onSuccess: (data) => {
        setSearchParams({ id: data.id });
        if (window.innerWidth < 1280) toggleSidebar();
      },
    });
  };

  const handleDelete = () => {
    deleteInvoice(deleteId!, {
      onSuccess: () => {
        if (openId === deleteId) navigate("/invoices", { replace: true });
        setDeleteId(null);
      },
    });
  };

  const onToggleExpand = () => setExpanded((curr) => !curr);

  return (
    <>
      <aside
        className={`shrink-0 
          hidden xl:block bg-background border-r border-stone/30
          transition-[width] duration-250 ease-in-out
          ${expanded ? "w-57.5" : "w-14"}
        `}
      >
        <div className="h-full flex flex-col bg-background gap-4">
          <SidebarHeader
            expanded={expanded}
            onToggleExpand={onToggleExpand}
            isPending={isPending}
            onNewInvoiceClick={handleNewInvoiceClick}
            isEditPage={isEditPage}
          />

          <ScrollArea className="overflow-y-auto flex-1 [&>[data-radix-scroll-area-viewport]>div]:block!">
            <SidebarNav
              expanded={expanded}
              location={location}
              navigate={navigate}
            />

            {(isEditPage || isNewInvoicePage) && (
              <InvoicesList
                expanded={expanded}
                onToggleExpand={onToggleExpand}
                invoices={invoices}
                isInvoicesLoading={isInvoicesLoading}
                onInvoiceClick={handleInvoiceClick}
                setDeleteId={setDeleteId}
              />
            )}
          </ScrollArea>

          <SidebarFooter
            expanded={expanded}
            username={username}
            setProfileModal={setProfileModal}
          />
        </div>
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={toggleSidebar}>
        <SheetContent
          side="left"
          className="p-0 w-57.5 xl:hidden [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Invoice Sidebar</SheetTitle>
          <div className="h-full flex flex-col bg-background gap-4">
            <SidebarHeader
              expanded={true}
              onToggleExpand={toggleSidebar}
              isPending={isPending}
              onNewInvoiceClick={handleNewInvoiceClick}
              isEditPage={isEditPage}
            />

            <ScrollArea className="overflow-y-auto flex-1 [&>[data-radix-scroll-area-viewport]>div]:block!">
              <SidebarNav
                expanded={true}
                location={location}
                navigate={navigate}
              />

              {(isEditPage || isNewInvoicePage) && (
                <InvoicesList
                  expanded={true}
                  onToggleExpand={toggleSidebar}
                  invoices={invoices}
                  isInvoicesLoading={isInvoicesLoading}
                  onInvoiceClick={handleInvoiceClick}
                  setDeleteId={setDeleteId}
                />
              )}
            </ScrollArea>

            <SidebarFooter
              expanded={true}
              username={username}
              setProfileModal={setProfileModal}
            />
          </div>
        </SheetContent>
      </Sheet>

      {profileModal && (
        <ProfileFormLoader
          profileModal={profileModal}
          setProfileModal={setProfileModal}
        />
      )}

      <DeleteInvoiceDialog
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        isDeletePending={isDeletePending}
        handleDelete={handleDelete}
      />
    </>
  );
}
