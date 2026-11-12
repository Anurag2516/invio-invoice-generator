import StatsCards from "@/components/dashboard/StatsCards";
import InvoiceTableSkeleton from "@/components/ui/skeleton/InvoiceTableSkeleton";
import { useClients } from "@/hooks/useClients";
import { useCreateDraftInvoice, useDeleteInvoice, useInvoices } from "@/hooks/useInvoices";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import RecentInvoiceTable from "@/components/dashboard/RecentInvoicesTable";
import { ClientAddModal } from "@/components/ui/shared/ClientFormDialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClientList from "@/components/dashboard/ClientList";
import Header from "@/components/dashboard/Header";
import OverdueBanner from "@/components/dashboard/OverdueBanner";
import DeleteInvoiceDialog from "@/components/ui/shared/DeleteInvoiceDialog";

const Dashboard = () => {
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mode, setMode] = useState<"Edit" | "Create" | null>(null);
  const userName = useAuthStore((state) => state.user?.name);

  const { mutate: createDraft, isPending } = useCreateDraftInvoice();

  const {
    data: invoices = [],
    isLoading: isInvoicesLoading,
    isError,
  } = useInvoices({ limit: 7, sort: "updatedAt", order: "desc" });

  const { data: clients = [], isLoading: isClientsLoading } = useClients({
    limit: 3,
    sort: "createdAt",
    order: "desc",
  });

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
      <ScrollArea className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        <Header
          userName={userName}
          setMode={setMode}
          handleNewInvoiceClick={handleNewInvoiceClick}
          isPending={isPending}
        />
        <div className="px-4 sm:px-8 bg-background flex-1">
          <OverdueBanner navigate={navigate} />

          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-5 w-full pt-14 pb-20">
            <div className="flex flex-col gap-4 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg lg:text-[22px] text-foreground font-medium">
                  Recently Updated
                </h2>
                <a
                  onClick={() => navigate("/invoices")}
                  className="text-teal text-[13px] lg:text-sm font-semibold inline-flex items-center cursor-pointer hover:underline hover:text-teal-dark"
                >
                  View All <ArrowRight size={16} />
                </a>
              </div>
              {isInvoicesLoading && <InvoiceTableSkeleton />}
              {!isInvoicesLoading && !isError && (
                <RecentInvoiceTable
                  invoices={invoices}
                  handleNewInvoiceClick={handleNewInvoiceClick}
                  isPending={isPending}
                  setDeleteId={setDeleteId}
                />
              )}
            </div>

            <div className="flex flex-col gap-4 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg lg:text-[22px] text-foreground font-medium">
                  Recent Clients
                </h2>
                <a
                  onClick={() => navigate("/clients")}
                  className="text-teal text-[13px] lg:text-sm font-semibold inline-flex items-center cursor-pointer hover:underline hover:text-teal-dark"
                >
                  View All <ArrowRight size={16} />
                </a>
              </div>

              <ClientList
                isClientsLoading={isClientsLoading}
                clients={clients}
                navigate={navigate}
                setMode={setMode}
              />
            </div>
          </div>
        </div>
        {mode === "Create" && <ClientAddModal setMode={setMode} />}

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

export default Dashboard;
