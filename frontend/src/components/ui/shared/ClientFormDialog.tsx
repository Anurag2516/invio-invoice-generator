import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useEffect, type SetStateAction } from "react";
import type { ClientFormValues, ClientResponse } from "@/types/invoice";
import { useClientForm } from "@/hooks/useClientForm";
import { Spinner } from "../spinner";

interface ClientEditModalProps {
  formData: ClientFormValues;
  setMode: React.Dispatch<SetStateAction<"Edit" | "Create" | null>>;
  onCancel: () => void;
  handleOnChange: (field: keyof ClientFormValues, value: string) => void;
  handleEdit: () => void;
  isEditPending?: boolean;
}

interface ClientAddModalProps {
  setMode: React.Dispatch<SetStateAction<"Edit" | "Create" | null>>;
  onSuccess?: (client: ClientResponse) => void;
}

export const ClientEditModal = ({
  formData,
  setMode,
  handleOnChange,
  onCancel,
  handleEdit,
  isEditPending,
}: ClientEditModalProps) => {
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) setMode(null);
      }}
    >
      <DialogContent className="md:max-w-107.5">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Edit client details</DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-2">
          <div className="w-full">
            <h3 className="text-sm font-semibold tracking-wider text-foreground/95 pb-1">
              Name *
            </h3>
            <Input
              value={formData.name}
              onChange={(e) => handleOnChange("name", e.target.value)}
              placeholder="John Doe"
              className="h-10"
            />
          </div>
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Email
            </h3>
            <Input
              value={formData.email}
              onChange={(e) => handleOnChange("email", e.target.value)}
              placeholder="johndoe@gmail.com"
              className="h-10"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
            Company Name
          </h3>
          <Input
            value={formData.companyName}
            onChange={(e) => handleOnChange("companyName", e.target.value)}
            placeholder="Abc Industries"
            className="h-10"
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
            Address
          </h3>
          <Input
            value={formData.address}
            onChange={(e) => handleOnChange("address", e.target.value)}
            placeholder="New York City, New York"
            className="h-10"
          />
        </div>
        <div className="flex justify-between gap-2">
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Phone
            </h3>
            <Input
              value={formData.phone}
              onChange={(e) => handleOnChange("phone", e.target.value)}
              placeholder="+91 9587564459"
              className="h-10"
            />
          </div>
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Website
            </h3>
            <Input
              value={formData.website}
              onChange={(e) => handleOnChange("website", e.target.value)}
              placeholder="abcindustries.com"
              className="h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleEdit}
            type="button"
            disabled={isEditPending}
            className="bg-teal hover:bg-teal-dark text-white"
          >
            {isEditPending ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ClientAddModal = ({ setMode, onSuccess }: ClientAddModalProps) => {
  const { form, onSubmit, isPending, isSuccess } = useClientForm();

  const {
    register,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (isSuccess) {
      setMode(null);
    }
  }, [isSuccess]);

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) setMode(null);
      }}
    >
      <DialogContent className="md:max-w-107.5">
        <DialogHeader>
          <DialogTitle>Add new client</DialogTitle>
          <DialogDescription>Create a new client</DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-2">
          <div className="w-full">
            <h3 className="text-sm font-semibold tracking-wider text-foreground/95 pb-1">
              Name *
            </h3>
            <Input
              {...register("name")}
              error={errors.name?.message}
              placeholder="John Doe"
              className="h-10"
            />
          </div>
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Email
            </h3>
            <Input
              {...register("email")}
              error={errors.email?.message}
              placeholder="johndoe@gmail.com"
              className="h-10"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
            Company Name
          </h3>
          <Input
            {...register("companyName")}
            error={errors.companyName?.message}
            placeholder="Abc Industries"
            className="h-10"
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
            Address
          </h3>
          <Input
            {...register("address")}
            error={errors.address?.message}
            placeholder="New York City, New York"
            className="h-10"
          />
        </div>
        <div className="flex justify-between gap-2">
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Phone
            </h3>
            <Input
              {...register("phone")}
              error={errors.phone?.message}
              placeholder="+91 9587564459"
              className="h-10"
            />
          </div>
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Website
            </h3>
            <Input
              {...register("website")}
              error={errors.website?.message}
              placeholder="abcindustries.com"
              className="h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => onSubmit({ onSuccess })()}
            disabled={isPending}
            type="button"
          >
            {isPending ? (
              <>
                <Spinner /> Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
