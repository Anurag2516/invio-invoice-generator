import type { ClientResponse } from "@/types/invoice";
import { UserPlus, Users } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import { Button } from "../ui/Button";

type ClientListProps = {
  isClientsLoading: boolean;
  clients: ClientResponse[];
  navigate: NavigateFunction;
  setMode: React.Dispatch<React.SetStateAction<"Create" | "Edit" | null>>;
};

const ClientList = ({
  isClientsLoading,
  clients,
  navigate,
  setMode
}: ClientListProps) => {
  return (
    <>
      {isClientsLoading ? (
        <div className="flex flex-col divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-2.5 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-border rounded-xl shadow-sm">
          <Users size={24} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">No clients yet</p>
          <Button
            type="button"
            onClick={() => setMode("Create")}
            className="py-3 bg-teal-tint dark:bg-teal-tint/60 hover:bg-teal-tint-hover 
          border border-teal-border text-teal-dark dark:text-teal-text"
          >
            <UserPlus size={13} className="hidden xs:block shrink-0" />
            <span className="text-[12px] xs:text-[14px]">Add client</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 divide-y divide-border">
          {clients.map((client: ClientResponse) => {
            return (
              <div
                key={client.id}
                className="flex flex-col gap-5 px-6 py-3 hover:bg-muted/50 cursor-pointer transition-colors border border-border rounded-xl shadow-sm"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-teal flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-white">
                      {client.name
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {client.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {client.companyName || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Invoices</p>
                    <p className="text-sm font-semibold text-foreground">
                      {client.invoiceCount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Last invoice
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {client.lastInvoiceNumber ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ClientList;
