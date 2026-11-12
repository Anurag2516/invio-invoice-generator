import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  ClientAddModal,
  ClientEditModal,
} from "@/components/ui/shared/ClientFormDialog";
import { useClients } from "@/hooks/useClients";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type {
  ClientFormValues,
  ClientResponse,
  InvoiceFormValues,
} from "@/types/invoice";
import { Check, ChevronsUpDown, Plus, User, X } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch, type SetValueConfig } from "react-hook-form";

type ClientData = ClientFormValues & { id: string | null };
type Mode = "Edit" | "Create" | null;

const EMPTY_CLIENT_FORM: ClientFormValues = {
  name: "",
  email: "",
  companyName: "",
  address: "",
  phone: "",
  website: "",
};

interface ClientCardProps {
  clientData: ClientData;
  onEdit: () => void;
  onClear: () => void;
}

interface ClientSearchProps {
  clientData: ClientData;
  isClientSelected: boolean;
  onCreate: () => void;
  onClear: () => void;
  onSelect: (client: ClientResponse) => void;
  onEdit: () => void;
  error?: string;
}

const ClientCard = ({ clientData, onEdit, onClear }: ClientCardProps) => {
  const { name, email, companyName, address, phone, website } = clientData;
  const hasDetails = companyName || address || phone || website;

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-md border border-border bg-foreground/3 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal/15">
            <User className="size-3.5 text-teal" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-foreground">
              {name}
            </p>
            {email && (
              <p className="truncate text-sm text-foreground/50">{email}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            className="px-2 py-1 text-sm"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="px-2 py-1"
            aria-label="Remove client"
            onClick={onClear}
          >
            <X size={10} />
          </Button>
        </div>
      </div>

      {hasDetails && (
        <div className="flex flex-col space-y-[0.5px] pl-9 text-sm text-foreground/60">
          {companyName && <p>{companyName}</p>}
          {address && <p>{address}</p>}
          {phone && <p className="pt-1.5">{phone}</p>}
          {website && <p>{website}</p>}
        </div>
      )}
    </div>
  );
};

const ClientSearch = ({
  clientData,
  isClientSelected,
  onCreate,
  onClear,
  onSelect,
  onEdit,
  error,
}: ClientSearchProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);

  const term = debounced.trim();
  const hasSearched = term.length > 0;

  const {
    data: clients = [],
    isFetching,
    isError,
  } = useClients({ search: term }, {enabled: hasSearched});

  const isSearching = search.trim() !== term || (hasSearched && isFetching);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  };

  const handleSelect = (client: ClientResponse) => {
    onSelect(client);
    handleOpenChange(false);
  };

  const handleCreate = () => {
    handleOpenChange(false);
    onCreate();
  };

  const renderStatus = () => {
    if (!hasSearched && !isSearching) return "Start typing to search clients.";
    if (isSearching) return "Searching...";
    if (isError) return "Something went wrong. Try again.";
    if (clients.length === 0) return `No clients found for "${term}".`;
    return null;
  };

  const status = renderStatus();

  return (
    <div className="w-full max-w-md">
      <SectionHeader label="Bill To" subLabel="(Client Details)" />

      {isClientSelected ? (
        <ClientCard clientData={clientData} onEdit={onEdit} onClear={onClear} />
      ) : (
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-invalid={!!error}
              className={cn(
                "mt-3 flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm",
                error && "border-destructive",
              )}
            >
              <span className="text-muted-foreground">Select a client...</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command shouldFilter={false}>
              <CommandInput
                value={search}
                onValueChange={setSearch}
                placeholder="Search clients..."
              />

              <CommandList>
                {status && <CommandEmpty>{status}</CommandEmpty>}

                {!status && (
                  <CommandGroup>
                    {clients.map((client: ClientResponse) => (
                      <CommandItem
                        key={client.id}
                        value={`${client.name} ${client.email}`}
                        onSelect={() => handleSelect(client)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {client.email}
                          </span>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            clientData.id === client.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>

              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={handleCreate}>
                  <Plus /> Create New
                </CommandItem>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

const ClientSection = () => {
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const [id, name, email, companyName, address, phone, website] = useWatch({
    control,
    name: [
      "clientId",
      "snapshotClientName",
      "snapshotClientEmail",
      "snapshotClientCompany",
      "snapshotClientAddress",
      "snapshotClientPhone",
      "snapshotClientWebsite",
    ],
  });

  const [form, setForm] = useState<ClientFormValues>(EMPTY_CLIENT_FORM);
  const [mode, setMode] = useState<Mode>(null);

  const clientData: ClientData = {
    id: id ?? null,
    name: name ?? "",
    email: email ?? "",
    companyName: companyName ?? "",
    address: address ?? "",
    phone: phone ?? "",
    website: website ?? "",
  };

  const isClientSelected = Boolean(clientData.name.trim() || clientData.id);

  const clientError =
    errors.clientId?.message ?? errors.snapshotClientName?.message;

  const setSnapshotValues = (
    client: Partial<ClientFormValues>,
    options: SetValueConfig = { shouldDirty: true },
  ) => {
    setValue("snapshotClientName", client.name ?? "", options);
    setValue("snapshotClientEmail", client.email ?? "", options);
    setValue("snapshotClientCompany", client.companyName ?? "", options);
    setValue("snapshotClientAddress", client.address ?? "", options);
    setValue("snapshotClientPhone", client.phone ?? "", options);
    setValue("snapshotClientWebsite", client.website ?? "", options);
  };

  const setClientValues = (
    client: Partial<ClientResponse>,
    options?: SetValueConfig,
  ) => {
    setValue("clientId", client.id ?? null, options);
    setSnapshotValues(client, options);
  };

  const handleSelect = (client: ClientResponse) => setClientValues(client);

  const handleClear = () => {
    setClientValues({});
    setForm(EMPTY_CLIENT_FORM);
  };

  const handleCreateSuccess = (client: ClientResponse) =>
    setClientValues(client, { shouldDirty: true, shouldValidate: true });

  const handleEditOpen = () => {
    const { id: _id, ...rest } = clientData;
    setForm(rest);
    setMode("Edit");
  };

  const handleEditSave = () => {
    setSnapshotValues(form, { shouldDirty: true, shouldValidate: true });
    setMode(null);
  };

  const handleEditCancel = () => {
    setForm(EMPTY_CLIENT_FORM);
    setMode(null);
  };

  const handleFormChange = (field: keyof ClientFormValues, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <ClientSearch
        clientData={clientData}
        isClientSelected={isClientSelected}
        onCreate={() => setMode("Create")}
        onClear={handleClear}
        onSelect={handleSelect}
        onEdit={handleEditOpen}
        error={isClientSelected ? undefined : clientError}
      />

      {mode === "Edit" && (
        <ClientEditModal
          setMode={setMode}
          formData={form}
          onCancel={handleEditCancel}
          handleOnChange={handleFormChange}
          handleEdit={handleEditSave}
        />
      )}

      {mode === "Create" && (
        <ClientAddModal setMode={setMode} onSuccess={handleCreateSuccess} />
      )}
    </>
  );
};

export default ClientSection;
