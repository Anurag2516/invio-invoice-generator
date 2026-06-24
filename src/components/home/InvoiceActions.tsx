import type { Invoice } from '@/types/invoice';
import { Download, Eye, Pencil, Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tooltip from '../ui/Tooltip';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../invoice-pdf/InvoicePDF';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';
import { useState } from 'react';
import type { DeleteInvoice } from './InvoiceTable';
import { useCurrencySign } from '@/hooks/useCurrencySign';

interface InvoiceActionsProps {
  invoices: Invoice[];
  invoice: Invoice;
  deleteInvoice: DeleteInvoice;
}

const InvoiceActions = ({ invoice, deleteInvoice, invoices }: InvoiceActionsProps) => {
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currency = useCurrencySign();

  const handleDeleteBtnClick = (e: React.SyntheticEvent, id: string) => {
    e.stopPropagation();
    setDeleteModalId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteModalId) {
      deleteInvoice(deleteModalId);
      setDeleteModalId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalId(null);
  };

  const deleteTargetInvoice = invoices.find(
    (invoice) => invoice.id === deleteModalId,
  );

  return (
    <>
      <div className="flex items-center justify-start md:justify-center gap-3 text-stone order-6 md:order-0 col-span-2 md:col-span-1">
        <button
          type="button"
          onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
          className="relative group px-2 py-1.5 hover:bg-sand rounded-md hover:text-[#5c5750] cursor-pointer transition-colors"
        >
          <Pencil size={18} />
          <Tooltip label="Edit Invoice" />
        </button>
        <button
          type="button"
          onClick={() =>
            navigate(`/invoices/${invoice.id}/preview`, {
              state: { backgroundLocation: location },
            })
          }
          className="relative group px-2 py-1.5 hover:bg-sand rounded-md hover:text-[#5c5750] cursor-pointer transition-colors"
        >
          <Eye size={18} />
          <Tooltip label="Open Invoice" />
        </button>
        <PDFDownloadLink
          document={<InvoicePDF activeInvoice={invoice} currency={currency} />}
          fileName={`invoice-${invoice.invoiceNumber}.pdf`}
        >
          <button
            type="button"
            className="relative group px-2 py-1.5 hover:bg-sand rounded-md hover:text-[#5c5750] cursor-pointer transition-colors"
          >
            <Download size={18} />
            <Tooltip label="Download Invoice" />
          </button>
        </PDFDownloadLink>

        <button
          type="button"
          onClick={(e) => handleDeleteBtnClick(e, invoice.id)}
          className="relative group px-2 py-1.5 text-red-400/90 hover:bg-sand rounded-md cursor-pointer transition-colors"
        >
          <Trash2 size={18} />
          <Tooltip label="Delete Invoice" />
        </button>
      </div>
      {deleteModalId && (
        <DeleteConfirmModal
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
          deleteTargetInvoice={deleteTargetInvoice}
        />
      )}
    </>
  );
};

export default InvoiceActions
