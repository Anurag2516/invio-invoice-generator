export interface User {
  companyName: string;
  address: string;
  email: string;
  phone: string;
  website: string;
}

export interface LineItem {
  id: string;
  serialNumber: number;
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

export type Currencies = "INR" | "USD" | "EUR";

export interface Invoice {
  id: string;
  invoiceNumber: string;
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