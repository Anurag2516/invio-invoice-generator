import type z from "zod";
import type { invoice } from "../schema/invoice.schema";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export type InvoiceFormValues = z.infer<typeof invoice>;

export interface User {
  name: string;
  companyName: string;
  address: string;
  email: string;
  phone: string;
  website: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceTotal {
  subtotal: number;
  appliedTax: number;
  appliedDiscount: number;
  total: number;
}

export type Status = "Draft" | "Paid" | "Sent" | "Overdue";

export type Currencies = "INR" | "USD" | "EUR";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: Status;
  sender: User;
  client: User;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  currency: Currencies;
  invoiceTotal: InvoiceTotal;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface InvoiceFormProps {
  register: UseFormRegister<InvoiceFormValues>;
  control: Control<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
}

export interface InvoiceStore {
  invoices: Invoice[];
  activeInvoice: Invoice;
  newInvoice: () => void;
  saveInvoice: () => void;
  deleteInvoice: (id: string) => void;
  loadInvoice: (id: string) => void;
  updateActiveInvoice: (invoice: Invoice) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
}