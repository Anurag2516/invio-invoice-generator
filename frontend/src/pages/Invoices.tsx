import { useState } from "react";
import { Search, Plus, Menu } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/spinner";
import {
  useCreateDraftInvoice,
  useDeleteInvoice,
  useInvoices,
} from "@/hooks/useInvoices";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import DeleteInvoiceDialog from "@/components/ui/shared/DeleteInvoiceDialog";
import InvoiceFilterTabs from "@/components/invoices/InvoiceFilterTabs";
import InvoiceTableSkeleton from "@/components/ui/skeleton/InvoiceTableSkeleton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ACTIVE_TABS, type ActiveTab } from "@/types/invoice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/appStore";

const Invoices = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const { toggleSidebar } = useAppStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: ActiveTab | undefined = ACTIVE_TABS.find(
    (t) => t === tabParam,
  );

  const setActiveTab = (tab: ActiveTab | undefined) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (tab) next.set("tab", tab);
        else next.delete("tab");
        return next;
      },
      { replace: true },
    );
  };

  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 300);
  const {
    data: invoices = [],
    isLoading: isInvoicesLoading,
    isError,
  } = useInvoices({
    search: debouncedSearch,
    order: "desc",
    filter: activeTab,
  });

  const { mutate: createDraft, isPending: isCreateDraftPending } =
    useCreateDraftInvoice();

  const { mutate: deleteInvoice, isPending: isDeletePending } =
    useDeleteInvoice();

  const handleNewInvoiceClick = () => {
    createDraft(undefined, {
      onSuccess: (data) => {
        navigate(`/invoice/new?id=${data.id}`);
      },
    });
  };

  const handleDelete = () => {
    deleteInvoice(deleteId!, { onSuccess: () => setDeleteId(null) });
  };

  return (
    <>
      <ScrollArea className="bg-background flex flex-col flex-1 min-w-0 overflow-y-auto">
        <div className="px-4 sm:px-10 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl text-foreground font-medium">
                  My Invoices
                </h2>
                <p className="text-sm text-foreground/50 mt-1">
                  {invoices.length}{" "}
                  {invoices.length === 1 ? "invoice" : "invoices"}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                className="block xl:hidden text-foreground"
              >
                <Menu size={18} />
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background dark:bg-input/30 hover:border-ring/90 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] transition-[color,box-shadow] duration-150 ease-in-out flex-1 sm:flex-none sm:w-70">
                <Search className="size-3.5 text-foreground/60 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search invoices..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none"
                />
                {isInvoicesLoading && <Spinner />}
              </div>
              <Button
                onClick={handleNewInvoiceClick}
                disabled={isCreateDraftPending}
                variant="default"
                className="py-4.5 bg-teal hover:bg-teal-dark text-white shrink-0"
              >
                {isCreateDraftPending ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  <>
                    <Plus />
                    <span className="hidden xs:inline">New Invoice</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {isInvoicesLoading && <InvoiceTableSkeleton />}

          {!isInvoicesLoading && !isError && (
            <>
              <InvoiceFilterTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <InvoiceTable invoices={invoices} activeTab={activeTab} />
            </>
          )}
        </div>

        <DeleteInvoiceDialog
          deleteId={deleteId}
          setDeleteId={setDeleteId}
          isDeletePending={isDeletePending}
          handleDelete={handleDelete}
        />
      </ScrollArea>
    </>
  );
};

export default Invoices;
