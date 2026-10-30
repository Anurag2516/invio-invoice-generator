import type {
  AutoSaveApiPayload,
  InvoiceApiPayload,
  InvoiceFormValues,
  InvoiceResponse,
  LineItemResponse,
} from "@/types/invoice";

const toNull = (val: string) => (val.trim() === "" ? null : val.trim());
const toOptional = (val: string) =>
  val.trim() === "" ? undefined : val.trim();
const optNum = (val: unknown) => {
  if (val === "") return null;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
};

export const formDataToAutoSavePayload = (
  form: InvoiceFormValues,
): AutoSaveApiPayload => ({
  invoiceNumber: toOptional(form.invoiceNumber),
  status: form.status || undefined,
  clientId: form.clientId || null,
  issueDate: form.issueDate ? new Date(form.issueDate).toISOString() : null,
  dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
  currency: form.currency || undefined,
  subtotal: optNum(form.subtotal),
  taxRate: optNum(form.taxRate),
  discountRate: optNum(form.discountRate),
  taxAmount: optNum(form.taxAmount),
  discountAmount: optNum(form.discountAmount),
  total: optNum(form.total),
  bankName: toNull(form.bankName),
  accountHolderName: toNull(form.accountHolderName),
  accountNumber: toNull(form.accountNumber),
  notes: toNull(form.notes),
  senderName: toNull(form.senderName),
  senderEmail: toNull(form.senderEmail),
  senderCompany: toNull(form.senderCompany),
  senderAddress: toNull(form.senderAddress),
  senderPhone: toNull(form.senderPhone),
  senderWebsite: toNull(form.senderWebsite),
  snapshotClientName: toNull(form.snapshotClientName),
  snapshotClientEmail: toNull(form.snapshotClientEmail),
  snapshotClientCompany: toNull(form.snapshotClientCompany),
  snapshotClientAddress: toNull(form.snapshotClientAddress),
  snapshotClientPhone: toNull(form.snapshotClientPhone),
  snapshotClientWebsite: toNull(form.snapshotClientWebsite),
  lineItems: form.lineItems.map(({ id, ...rest }) => ({
    description: rest.description || null,
    quantity: optNum(rest.quantity),
    rate: optNum(rest.rate),
    amount: optNum(rest.amount),
  })),
});

export const formDataToApiPayload = (
  form: InvoiceFormValues,
): InvoiceApiPayload => ({
  invoiceNumber: form.invoiceNumber.trim(),
  status: form.status,
  clientId: form.clientId,
  issueDate: new Date(form.issueDate).toISOString(),
  dueDate: new Date(form.dueDate).toISOString(),
  currency: form.currency,
  subtotal: form.subtotal,
  taxRate: form.taxRate,
  discountRate: form.discountRate,
  taxAmount: form.taxAmount,
  discountAmount: form.discountAmount,
  total: form.total,
  bankName: toOptional(form.bankName),
  accountHolderName: toOptional(form.accountHolderName),
  accountNumber: toOptional(form.accountNumber),
  notes: toOptional(form.notes),
  senderName: form.senderName.trim(),
  senderEmail: toOptional(form.senderEmail),
  senderCompany: toOptional(form.senderCompany),
  senderAddress: toOptional(form.senderAddress),
  senderPhone: toOptional(form.senderPhone),
  senderWebsite: toOptional(form.senderWebsite),
  snapshotClientName: form.snapshotClientName.trim(),
  snapshotClientEmail: toOptional(form.snapshotClientEmail),
  snapshotClientCompany: toOptional(form.snapshotClientCompany),
  snapshotClientAddress: toOptional(form.snapshotClientAddress),
  snapshotClientPhone: toOptional(form.snapshotClientPhone),
  snapshotClientWebsite: toOptional(form.snapshotClientWebsite),
  lineItems: form.lineItems.map(({ id, ...rest }) => ({
    ...rest,
    description: rest.description.trim(),
  })),
});

export const invoiceResponseToFormData = (
  invoice: InvoiceResponse,
): InvoiceFormValues => ({
  invoiceNumber: invoice.invoiceNumber,
  status: invoice.status,
  clientId: invoice.clientId,
  issueDate: new Date(invoice.issueDate).toISOString().split("T")[0],
  dueDate: invoice.dueDate
    ? new Date(invoice.dueDate).toISOString().split("T")[0]
    : "",
  currency: invoice.currency,
  subtotal: invoice.subtotal,
  taxRate: invoice.taxRate,
  taxAmount: invoice.taxAmount,
  discountRate: invoice.discountRate,
  discountAmount: invoice.discountAmount,
  total: invoice.total,
  bankName: invoice.bankName ?? "",
  accountHolderName: invoice.accountHolderName ?? "",
  accountNumber: invoice.accountNumber ?? "",
  notes: invoice.notes ?? "",
  senderName: invoice.senderName,
  senderEmail: invoice.senderEmail ?? "",
  senderCompany: invoice.senderCompany ?? "",
  senderAddress: invoice.senderAddress ?? "",
  senderPhone: invoice.senderPhone ?? "",
  senderWebsite: invoice.senderWebsite ?? "",
  snapshotClientName: invoice.snapshotClientName ?? "",
  snapshotClientEmail: invoice.snapshotClientEmail ?? "",
  snapshotClientCompany: invoice.snapshotClientCompany ?? "",
  snapshotClientAddress: invoice.snapshotClientAddress ?? "",
  snapshotClientPhone: invoice.snapshotClientPhone ?? "",
  snapshotClientWebsite: invoice.snapshotClientWebsite ?? "",
  lineItems: invoice.lineItems.map((item) => ({
    id: item.id,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.amount,
  })),
});

export const mapInvoice = (invoice: InvoiceResponse) => ({
  invoiceNumber: invoice.invoiceNumber,
  status: invoice.status,
  clientId: invoice.clientId,
  issueDate: new Date(invoice.issueDate).toISOString().split("T")[0],
  dueDate: invoice.dueDate
    ? new Date(invoice.dueDate).toISOString().split("T")[0]
    : null,
  currency: invoice.currency,
  subtotal: Number(invoice.subtotal),
  taxRate: Number(invoice.taxRate),
  taxAmount: Number(invoice.taxAmount),
  discountRate: Number(invoice.discountRate),
  discountAmount: Number(invoice.discountAmount),
  total: Number(invoice.total),
  bankName: invoice.bankName,
  accountHolderName: invoice.accountHolderName,
  accountNumber: invoice.accountNumber,
  notes: invoice.notes,
  senderName: invoice.senderName,
  senderEmail: invoice.senderEmail,
  senderCompany: invoice.senderCompany,
  senderAddress: invoice.senderAddress,
  senderPhone: invoice.senderPhone,
  senderWebsite: invoice.senderWebsite,
  snapshotClientName: invoice.snapshotClientName,
  snapshotClientEmail: invoice.snapshotClientEmail,
  snapshotClientCompany: invoice.snapshotClientCompany,
  snapshotClientAddress: invoice.snapshotClientAddress,
  snapshotClientPhone: invoice.snapshotClientPhone,
  snapshotClientWebsite: invoice.snapshotClientWebsite,
  lineItems: invoice.lineItems.map((item: LineItemResponse) => ({
    id: item.id,
    description: item.description,
    quantity: Number(item.quantity),
    rate: Number(item.rate),
    amount: Number(item.amount),
  })),
});
