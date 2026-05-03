import type { Invoice, InvoiceTotal, LineItem, User } from "../types/invoice";
import { generateId, generateInvoiceNumber } from "./generateId";

export const defaultUser = (): User => ({
  companyName: "",
  address: "",
  email: "",
  phone: "",
  website: "",
});

export const defaultLineItem = (serialNumber: number): LineItem => ({
  id: generateId(),
  serialNumber,
  description: "",
  quantity: 1,
  rate: 0,
  amount: 0,
});

export const defaultInvoiceTotal = (): InvoiceTotal => ({
  subtotal: 0,
  appliedTax: 0,
  appliedDiscount: 0,
  total: 0,
});

export const createEmptyInvoice = (
  existingNumbers: string[] = [],
): Invoice => ({
  id: generateId(),
  invoiceNumber: generateInvoiceNumber(existingNumbers),
  status: "Draft",
  sender: defaultUser(),
  client: defaultUser(),
  issueDate: new Date().toLocaleDateString(),
  dueDate: "",
  lineItems: [defaultLineItem(1)],
  currency: "INR",
  invoiceTotal: defaultInvoiceTotal(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  notes: "",
});
