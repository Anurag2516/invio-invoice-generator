import type z from "zod";
import type { invoiceSchema } from "../schema/invoice.schema";
import type userProfileSchema from "@/schema/profile.schema";
import type clientSchema from "@/schema/client.schema";

export type Status = "Draft" | "Paid" | "Sent" | "Cancelled";
export type Currency =
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "CAD"
  | "AUD"
  | "SGD"
  | "JPY"
  | "CNY"
  | "CHF"
  | "HKD";

export const ACTIVE_TABS = [
  "outstanding",
  "paid",
  "overdue",
  "cancelled",
] as const;
export type ActiveTab = (typeof ACTIVE_TABS)[number];

export type RequestParams = {
  search?: string;
  limit?: number;
  sort?: "updatedAt" | "createdAt";
  order?: "asc" | "desc";
  filter?: ActiveTab;
};

export type DashboardStats = {
  total: number;
  outstanding: number;
  paid: number;
  overdue: number;
};

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export interface InvoiceApiPayload {
  invoiceNumber: string;
  status: Status;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  subtotal: number;
  taxRate: number;
  discountRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  notes?: string;
  senderName: string;
  senderEmail?: string;
  senderCompany?: string;
  senderAddress?: string;
  senderPhone?: string;
  senderWebsite?: string;
  clientId: string | null;
  snapshotClientName: string;
  snapshotClientEmail?: string;
  snapshotClientCompany?: string;
  snapshotClientAddress?: string;
  snapshotClientPhone?: string;
  snapshotClientWebsite?: string;
  lineItems: Omit<LineItemFormData, "id">[];
}

type Nullable<T> = T extends object
  ? { [K in keyof T]: Nullable<T[K]> | null | undefined }
  : T | null | undefined;

export interface AutoSaveApiPayload extends Nullable<
  Omit<InvoiceApiPayload, "lineItems">
> {
  lineItems: Nullable<Omit<LineItemFormData, "id">>[] | undefined;
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  status: Status;
  currency: Currency;
  issueDate: string;
  dueDate: string;
  createdAt: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  notes?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  senderName: string;
  senderEmail?: string;
  senderCompany?: string;
  senderAddress?: string;
  senderPhone?: string;
  senderWebsite?: string;
  clientId: string | null;
  snapshotClientName: string;
  snapshotClientEmail?: string;
  snapshotClientCompany?: string;
  snapshotClientAddress?: string;
  snapshotClientPhone?: string;
  snapshotClientWebsite?: string;
  lineItems: LineItemResponse[];
  isOverdue: boolean;
}

export interface DraftInvoiceResponse {
  id: string;
  invoiceNumber: string;
  status: Status;
  senderName: string;
  senderEmail?: string;
  senderCompany?: string;
  senderAddress?: string;
  senderPhone?: string;
  senderWebsite?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
}

export interface LineItemFormData {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type LineItemResponse = LineItemFormData;

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export interface UserProfileApiPayload {
  name: string;
  companyName: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  bankName: string | null;
  accountHolderName: string | null;
  accountNumber: string | null;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  address?: string;
  phone?: string;
  website?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientFormValues = z.infer<typeof clientSchema>;

export type ClientApiPayload = Partial<ClientFormValues> & { name: string };

export type ClientUpdateApiPayload = Partial<ClientFormValues>;

export interface ClientResponse {
  id: string;
  name: string;
  email?: string;
  companyName?: string;
  address?: string;
  phone?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  invoiceCount: number;
  lastInvoiceNumber: string | null;
}
