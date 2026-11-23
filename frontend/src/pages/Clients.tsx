import { useState } from "react";
import { Search, Plus, Menu } from "lucide-react";
import {
  useClients,
  useDeleteClient,
  useUpdateClient,
} from "@/hooks/useClients";
import { useDebounce } from "@/hooks/useDebounce";
import type { ClientFormValues, ClientResponse } from "@/types/invoice";
import { Button } from "@/components/ui/Button";
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
import { Spinner } from "@/components/ui/spinner";
import {
  ClientAddModal,
  ClientEditModal,
} from "@/components/ui/shared/ClientFormDialog";
import { ClientResponseToFormData } from "@/mapper/client.mapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/appStore";
import ClientModal from "@/components/clients/ClientModal";
import ClientTable from "@/components/clients/ClientTable";

const Clients = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mode, setMode] = useState<"Edit" | "Create" | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(
    null,
  );
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientFormValues>({
    name: "",
    email: "",
    companyName: "",
    address: "",
    phone: "",
    website: "",
  });
  const [search, setSearch] = useState<string>("");

  const { toggleSidebar } = useAppStore();

  const debouncedSearch = useDebounce(search, 300);
  const { data: clients = [], isLoading: isClientsLoading } = useClients({
    search: debouncedSearch,
  });
  const { mutate: deleteClient, isPending: isDeletePending } =
    useDeleteClient();
  const { mutate: updateClient, isPending: isUpdatePending } =
    useUpdateClient();

  const formReset = () => {
    setForm({
      name: "",
      email: "",
      companyName: "",
      address: "",
      phone: "",
      website: "",
    });
  };

  const handleOnChange = (field: keyof ClientFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClientClick = (client: ClientResponse) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleEdit = () => {
    updateClient(
      { id: editingClientId!, clientData: form },
      {
        onSuccess: () => {
          setMode(null);
          setEditingClientId(null);
        },
      },
    );
  };

  const handleEditClick = (client: ClientResponse) => {
    setEditingClientId(client.id);
    setForm(ClientResponseToFormData(client));
    setMode("Edit");
  };

  const handleEditCancel = () => {
    formReset();
    setMode(null);
  };

  const handleDelete = async () => {
    deleteClient(deleteId!, { onSuccess: () => setDeleteId(null) });
  };

  return (
    <>
      <ScrollArea className="bg-background flex flex-col flex-1 min-w-0 overflow-y-auto">
        <div className="px-4 sm:px-10 pt-6 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl text-foreground font-medium">
                  My Clients
                </h2>
                <p className="text-sm text-foreground/50 mt-1">
                  {clients.length} {clients.length === 1 ? "client" : "clients"}
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
                  placeholder="Search by name or email..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none"
                />
                {isClientsLoading && <Spinner />}
              </div>
              <Button
                onClick={() => setMode("Create")}
                variant="default"
                className="py-4.5 bg-teal hover:bg-teal-dark text-white shrink-0"
              >
                <Plus />
                <span className="hidden xs:inline">Add client</span>
              </Button>
            </div>
          </div>

          <ClientTable
            clients={clients}
            handleClientClick={handleClientClick}
            handleEditClick={handleEditClick}
            setDeleteId={setDeleteId}
          />
        </div>

        <ClientModal
          showClientModal={showClientModal}
          setShowClientModal={setShowClientModal}
          client={selectedClient}
          handleEditClick={handleEditClick}
        />

        {mode === "Edit" && (
          <ClientEditModal
            setMode={setMode}
            formData={form}
            onCancel={handleEditCancel}
            handleOnChange={handleOnChange}
            handleEdit={handleEdit}
            isEditPending={isUpdatePending}
          />
        )}

        {mode === "Create" && <ClientAddModal setMode={setMode} />}

        <AlertDialog
          open={!!deleteId}
          onOpenChange={(open) => {
            if (!open) setDeleteId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                client.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                variant="outline"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isDeletePending}
                onClick={handleDelete}
              >
                {isDeletePending ? (
                  <>
                    <Spinner /> Deleting...
                  </>
                ) : (
                  "Delete client"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ScrollArea>
    </>
  );
};

export default Clients;
