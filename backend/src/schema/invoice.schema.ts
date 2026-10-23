import { z } from "zod";

export const statusSchema = z.enum(["Draft", "Paid", "Sent", "Cancelled"]);
export const currencySchema = z.enum(["INR", "USD", "EUR"]);

export const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative().default(0),
  ),
  rate: z.preprocess((val) => Number(val), z.number().nonnegative().default(0)),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative().default(0),
  ),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  status: statusSchema,
  currency: currencySchema,
  clientId: z.string().min(1),
  senderName: z.string().min(1),
  senderEmail: z.email().optional(),
  senderCompany: z.string().optional(),
  senderAddress: z.string().optional(),
  senderPhone: z.string().optional(),
  senderWebsite: z.string().optional(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  snapshotClientName: z.string().min(1),
  snapshotClientEmail: z.email().optional(),
  snapshotClientCompany: z.string().optional(),
  snapshotClientAddress: z.string().optional(),
  snapshotClientPhone: z.string().optional(),
  snapshotClientWebsite: z.string().optional(),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  lineItems: z.array(lineItemSchema).min(1),
  subtotal: z.preprocess((val) => Number(val), z.number()),
  taxRate: z.preprocess((val) => Number(val), z.number().nonnegative()),
  taxAmount: z.preprocess((val) => Number(val), z.number()),
  discountRate: z.preprocess((val) => Number(val), z.number().nonnegative()),
  discountAmount: z.preprocess((val) => Number(val), z.number()),
  total: z.preprocess((val) => Number(val), z.number().positive()),
  notes: z.string().optional(),
});

const nullableStr = z.string().nullable().optional();
const nullableNum = z.number().nullable().optional();

export const autoSaveSchema = z.object({
  invoiceNumber: z.string().optional(),
  status: statusSchema.optional(),
  clientId: z.string().nullable().optional(),
  issueDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  currency: currencySchema.optional(),
  subtotal: nullableNum,
  taxRate: nullableNum,
  taxAmount: nullableNum,
  discountRate: nullableNum,
  discountAmount: nullableNum,
  total: nullableNum,
  bankName: nullableStr,
  accountHolderName: nullableStr,
  accountNumber: nullableStr,
  notes: nullableStr,
  senderName: nullableStr,
  senderEmail: nullableStr,
  senderCompany: nullableStr,
  senderAddress: nullableStr,
  senderPhone: nullableStr,
  senderWebsite: nullableStr,
  snapshotClientName: nullableStr,
  snapshotClientEmail: nullableStr,
  snapshotClientCompany: nullableStr,
  snapshotClientAddress: nullableStr,
  snapshotClientPhone: nullableStr,
  snapshotClientWebsite: nullableStr,
  lineItems: z
    .array(
      z.object({
        description: z.string().nullable().optional(),
        quantity: z.number().nonnegative().optional(),
        rate: z.number().nonnegative().optional(),
        amount: z.number().nonnegative().optional(),
      }),
    )
    .optional(),
});

export const listInvoicesQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.enum(["updatedAt", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type AutoSaveInput = z.infer<typeof autoSaveSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
