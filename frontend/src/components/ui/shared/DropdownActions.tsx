import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { Download, FolderOpen, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/invoice-editor/invoice-pdf/InvoicePDF";
import type { InvoiceResponse } from "@/types/invoice";
import { getCurrencySign } from "@/utils/currency";

interface DropdownActionsProps {
  invoice: InvoiceResponse;
  setDeleteId: Dispatch<SetStateAction<string | null>>;
}

const DropdownActions = ({ invoice, setDeleteId }: DropdownActionsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currency = getCurrencySign(invoice.currency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 p-1.5">
        <DropdownMenuItem
          onClick={() => navigate(`/invoices/edit?id=${invoice.id}`)}
          className="py-1"
        >
          <SquarePen size={15} className="text-muted-foreground" />
          Edit Invoice
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            navigate(`/invoices/${invoice.id}/preview`, {
              state: { backgroundLocation: location },
            })
          }
          className="py-1"
        >
          <FolderOpen size={15} className="text-muted-foreground" />
          Open Invoice
        </DropdownMenuItem>

        {invoice.status !== "Draft" && (
          <DropdownMenuItem>
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} currency={currency} />}
              fileName={`invoice-${invoice.invoiceNumber}.pdf`}
              className="flex items-center gap-2 py-1"
            >
              <Download size={15} className="text-muted-foreground" />
              Download invoice
            </PDFDownloadLink>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => setDeleteId(invoice.id)}
          className="py-1"
        >
          <Trash2 size={15} />
          Delete Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;
