import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useClients } from "@/hooks/useClients";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  ClientFormValues,
  ClientResponse,
  InvoiceFormValues,
} from "@/types/invoice";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { useFormContext, useWatch, type SetValueConfig } from "react-hook-form";
import {
  ClientAddModal,
  ClientEditModal,
} from "@/components/ui/shared/ClientFormDialog";

type ClientData = {
  id: string | null;
  name: string;
  email: string;
  companyName: string;
  address: string;
  phone: string;
  website: string;
};

interface ClientSearchProps {
  clientData: ClientData;
  isClientSelected: boolean;
  onCreate: () => void;
  handleOnClear: () => void;
  handleOnSelect: (client: ClientResponse) => void;
  handleEditClick: () => void;
  error?: string;
}

interface ClientCardProps {
  clientData: ClientData;
  handleEditClick: () => void;
  handleOnClear: () => void;
  error?: string;
}

const ClientCard = ({
  clientData,
  handleOnClear,
  handleEditClick,
  error,
}: ClientCardProps) => {
  return (
    <>
      <div className="rounded-md border border-border bg-foreground/3 mt-4 p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-full bg-teal/15 flex items-center justify-center shrink-0">
              <User className="size-3.5 text-teal" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-foreground truncate">
                {clientData.name}
              </p>
              {clientData.email && (
                <p className="text-sm text-foreground/50 truncate">
                  {clientData.email}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center gap-1 shrink-0">
            <Button
              onClick={handleEditClick}
              type="button"
              variant="ghost"
              className="px-2 py-1 text-sm"
            >
              Edit
            </Button>
            <Button
              type="button"
              onClick={handleOnClear}
              variant="ghost"
              className="px-2 py-1"
            >
              <X size={10} />
            </Button>
          </div>
        </div>

        {(clientData.companyName ||
          clientData.address ||
          clientData.phone ||
          clientData.website) && (
          <div className="pl-9 flex flex-col space-y-[0.5px] text-sm">
            {clientData.companyName && (
              <p className=" text-foreground/60">{clientData.companyName}</p>
            )}
            {clientData.address && (
              <p className="text-foreground/60">{clientData.address}</p>
            )}
            {clientData.phone && (
              <p className=" text-foreground/60 pt-1.5">{clientData.phone}</p>
            )}
            {clientData.website && (
              <p className=" text-foreground/60">{clientData.website}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const ClientSearch = ({
  clientData,
  isClientSelected,
  onCreate,
  handleOnClear,
  handleOnSelect,
  handleEditClick,
  error,
}: ClientSearchProps) => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 300);
  const {
    data: clients = [],
    isLoading,
    isError,
  } = useClients({ search: debouncedSearch }, false);

  const isSearching = search !== debouncedSearch || isLoading;
  const hasSearched = debouncedSearch.length > 0;

  return (
    <div className="w-full max-w-md">
      <SectionHeader label="Bill To" subLabel="(Client Details)" />

      {!isClientSelected && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-invalid={!!error}
              className={cn(
                "mt-3 flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm",
                error && "border-destructive",
              )}
            >
              {clientData.name ? (
                <span className="font-medium">{clientData.name}</span>
              ) : (
                <span className="text-muted-foreground">
                  Select a client...
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command shouldFilter={false}>
              <CommandInput
                onValueChange={setSearch}
                placeholder="Search clients..."
              />

              <CommandList>
                {isSearching && hasSearched && (
                  <CommandEmpty>Searching...</CommandEmpty>
                )}

                {!isSearching && isError && (
                  <CommandEmpty>Something went wrong. Try again.</CommandEmpty>
                )}

                {!isSearching &&
                  !isError &&
                  hasSearched &&
                  clients.length === 0 && (
                    <CommandEmpty>
                      No clients found for "{debouncedSearch}".
                    </CommandEmpty>
                  )}

                {!isSearching && !isError && !hasSearched && (
                  <CommandEmpty>Start typing to search clients.</CommandEmpty>
                )}

                {!isSearching && !isError && clients.length > 0 && (
                  <CommandGroup>
                    {clients.map((client: ClientResponse) => (
                      <CommandItem
                        key={client.id}
                        value={`${client.name} ${client.email}`}
                        onSelect={() => {
                          handleOnSelect(client);
                        }}
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
                <CommandItem onSelect={onCreate}>
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

      {isClientSelected && (
        <ClientCard
          clientData={clientData}
          handleEditClick={handleEditClick}
          handleOnClear={handleOnClear}
          error={error}
        />
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

  const [form, setForm] = useState<ClientFormValues>({
    name: "",
    email: "",
    companyName: "",
    address: "",
    phone: "",
    website: "",
  });

  const [mode, setMode] = useState<"Edit" | "Create" | null>(null);

  const isClientSelected = Boolean(name?.trim()) || Boolean(id);

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

  const onCreate = () => {
    setMode("Create");
  };

  const handleOnSelect = (client: ClientResponse) => {
    setClientValues(client);
  };

  const handleOnClear = () => {
    setClientValues({});
    formReset();
  };

  const handleEdit = () => {
    setSnapshotValues(form, { shouldDirty: true, shouldValidate: true });
    setMode(null);
  };

  const handleCreate = (client: ClientResponse) => {
    setClientValues(client, { shouldDirty: true, shouldValidate: true });
  };

  const handleEditClick = () => {
    setForm({ name, email, companyName, address, phone, website });
    setMode("Edit");
  };

  const handleEditCancel = () => {
    formReset();
    setMode(null);
  };

  const clientError =
    errors.clientId?.message ?? errors.snapshotClientName?.message;

  const clientData = {
    id,
    name,
    email,
    companyName,
    address,
    phone,
    website,
  };
  return (
    <>
      <ClientSearch
        clientData={clientData}
        isClientSelected={isClientSelected}
        onCreate={onCreate}
        handleOnClear={handleOnClear}
        handleOnSelect={handleOnSelect}
        handleEditClick={handleEditClick}
        error={isClientSelected ? undefined : clientError}
      />

      {mode === "Edit" && (
        <ClientEditModal
          setMode={setMode}
          formData={form}
          onCancel={handleEditCancel}
          handleOnChange={handleOnChange}
          handleEdit={handleEdit}
        />
      )}

      {mode === "Create" && (
        <ClientAddModal
          setMode={setMode}
          onSuccess={(client) => handleCreate(client)}
        />
      )}
    </>
  );
};

export default ClientSection;
