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
import { Spinner } from "../spinner";
import type { Dispatch, SetStateAction } from "react";

interface DeleteInvoiceDialogProps {
  deleteId: string | null;
  setDeleteId: Dispatch<SetStateAction<string | null>>;
  isDeletePending: boolean;
  handleDelete: () => void;
}

const DeleteInvoiceDialog = ({
  deleteId,
  setDeleteId,
  isDeletePending,
  handleDelete,
}: DeleteInvoiceDialogProps) => {
  return (
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
            invoice.
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
  );
};

export default DeleteInvoiceDialog;
