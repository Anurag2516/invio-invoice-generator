import { useState, type Dispatch, type SetStateAction } from "react";
import { Search, Plus, MoreHorizontal, Users, Menu } from "lucide-react";
import {
  useClients,
  useDeleteClient,
  useUpdateClient,
} from "@/hooks/useClients";
import { useDebounce } from "@/hooks/useDebounce";
import type { ClientFormValues, ClientResponse } from "@/types/invoice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  ClientAddModal,
  ClientEditModal,
} from "@/components/ui/shared/ClientFormDialog";
import { ClientResponseToFormData } from "@/mapper/client.mapper";
import { formatDate } from "@/utils/formatDate";
import { useCreateDraftInvoice } from "@/hooks/useInvoices";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/appStore";

interface ClientModalProps {
  showClientModal: boolean;
  setShowClientModal: Dispatch<SetStateAction<boolean>>;
  client: ClientResponse | null;
  handleEditClick: (client: ClientResponse) => void;
}

interface ClientTableProps {
  clients: ClientResponse[];
  handleClientClick: (client: ClientResponse) => void;
  handleEditClick: (client: ClientResponse) => void;
  setDeleteId: Dispatch<SetStateAction<string | null>>;
}

const ClientModal = ({
  client,
  showClientModal,
  setShowClientModal,
  handleEditClick,
}: ClientModalProps) => {
  if (!client) return null;

  return (
    <Dialog
      open={showClientModal}
      onOpenChange={(open) => {
        if (!open) setShowClientModal(false);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-125 p-0 gap-0 overflow-hidden"
      >
        <div className="px-5 sm:px-7 pt-6 pb-2 overflow-hidden">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="size-8 sm:size-10 rounded-full bg-teal flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-white">
                {client.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-semibold truncate">
                {client.name}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground truncate">
                {client.email || "No email"}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="space-y-5 py-6 px-5 sm:px-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-10">
            <Detail label="Company" value={client.companyName} />
            <Detail label="Phone" value={client.phone} />
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-10">
            <Detail label="Address" value={client.address} />
            <Detail
              label="Website"
              value={client.website?.replace(/^https?:\/\//, "")}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-10">
            <Detail label="Created" value={formatDate(client.createdAt)} />
            <Detail label="Last updated" value={formatDate(client.updatedAt)} />
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2 px-5 sm:px-7 py-5">
          <Button
            variant="outline"
            onClick={() => {
              setShowClientModal(false);
              setTimeout(() => handleEditClick(client), 150);
            }}
          >
            Edit client
          </Button>
          <DialogClose>
            <Button className="bg-teal hover:bg-teal-dark text-white">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

const ClientTable = ({
  clients,
  handleClientClick,
  handleEditClick,
  setDeleteId,
}: ClientTableProps) => {
  const navigate = useNavigate();
  const { mutate: createInvoice } = useCreateDraftInvoice();
  const [creatingInvoiceForId, setCreatingInvoiceForId] = useState<
    string | null
  >(null);

  const handleNewInvoiceClick = (clientId: string) => {
    setCreatingInvoiceForId(clientId);
    createInvoice(clientId, {
      onSuccess: (data) => navigate(`/invoice/new?id=${data.id}`),
      onSettled: () => setCreatingInvoiceForId(null),
    });
  };

  const ActionMenu = ({ client }: { client: ClientResponse }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          disabled={creatingInvoiceForId === client.id}
          variant="ghost"
          size="icon"
          className="size-8"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => handleEditClick(client)}>
          Edit details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNewInvoiceClick(client.id)}
          disabled={creatingInvoiceForId === client.id}
        >
          {creatingInvoiceForId === client.id ? (
            <>
              <Spinner /> Creating invoice...
            </>
          ) : (
            "Open in new invoice"
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => setDeleteId(client.id)}
        >
          Delete client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <Users size={24} className="text-muted-foreground mb-2" />
        <p className="text-[16px] text-muted-foreground mb-2">No clients yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border rounded-xl bg-background">
      <div className="flex flex-col divide-y divide-border md:hidden">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between px-4 py-4 gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
            onClick={() => handleClientClick(client)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 rounded-full bg-teal flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-white">
                  {client.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {client.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {client.companyName || client.email}
                </p>
              </div>
            </div>
            <ActionMenu client={client} />
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-warm-background dark:bg-sidebar">
            <TableRow>
              <TableHead className="text-[13px] uppercase tracking-wide">
                Client
              </TableHead>
              <TableHead className="text-[13px] uppercase tracking-wide">
                Company
              </TableHead>
              <TableHead className="text-[13px] uppercase tracking-wide">
                Phone
              </TableHead>
              <TableHead className="text-[13px] uppercase tracking-wide">
                Created
              </TableHead>
              <TableHead className="text-[13px] uppercase tracking-wide text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => handleClientClick(client)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-teal flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-white">
                        {client.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {client.name}
                      </p>
                      {client.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {client.email}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm">
                  {client.companyName ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell className="text-sm whitespace-nowrap">
                  {client.phone ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(client.createdAt)}
                </TableCell>

                <TableCell className="text-right">
                  <ActionMenu client={client} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

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
