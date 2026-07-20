import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  rate: z.number(),
  amount: z.number(),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string(),
  status: z.enum(["Draft", "Paid", "Sent", "Cancelled"]).default("Draft"),
  clientId: z.uuid(),
  issueDate: z.iso.datetime().optional(),
  dueDate: z.iso.datetime(),
  currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
  subtotal: z.number(),
  taxRate: z.number(),
  discountRate: z.number(),
  taxAmount: z.number(),
  discountAmount: z.number(),
  total: z.number(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  notes: z.string().optional(),
  lineItems: z.array(lineItemSchema),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;