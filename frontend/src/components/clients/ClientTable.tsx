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
import { formatDate } from "@/utils/formatDate";
import { useCreateDraftInvoice } from "@/hooks/useInvoices";
import { useNavigate } from "react-router-dom";
import type { ClientResponse } from "@/types/invoice";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui/Button";
import { MoreHorizontal, Users } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface ClientTableProps {
  clients: ClientResponse[];
  handleClientClick: (client: ClientResponse) => void;
  handleEditClick: (client: ClientResponse) => void;
  setDeleteId: Dispatch<SetStateAction<string | null>>;
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
              <Spinner /> Creating client...
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

export default ClientTable;
