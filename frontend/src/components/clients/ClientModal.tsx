import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { ClientResponse } from "@/types/invoice";
import type { Dispatch, SetStateAction } from "react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "../ui/Button";

interface ClientModalProps {
  showClientModal: boolean;
  setShowClientModal: Dispatch<SetStateAction<boolean>>;
  client: ClientResponse | null;
  handleEditClick: (client: ClientResponse) => void;
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
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

export default ClientModal;
