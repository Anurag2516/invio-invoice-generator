import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  companyName: z.string(),
  address: z.string().min(1, "Address is required"),
  email: z.email({ message: "Invalid email" }),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(10, "Phone cannot exceed 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits").or(z.literal("")),
  website: z.string(),
});

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce
    .number({ message: "Must be a number" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  rate: z.coerce
    .number({ message: "Must be a number" })
    .min(0, "Rate cannot be negative"),
  amount: z.number(),
});

export const invoiceTotalSchema = z.object({
  subtotal: z.number(),
  taxRate: z.coerce
    .number({ message: "Must be a number" })
    .min(0, "Tax must be at least 0%")
    .max(100, "Tax must be at most 100%"),
  discountRate: z.coerce
    .number({ message: "Must be a number" })
    .min(0, "Discount must be at least 0%")
    .max(100, "Discount must be at most 100%"),
  taxAmount: z.number(),
  discountAmount: z.number(),
  total: z.number(),
});

export const paymentInfo = z.object({
  bankName: z.string(),
  accountholderName: z.string(),
  accountNumber: z
    .string()
    .min(8, "Account number must be at least 8 digits")
    .max(17, "Account number cannot exceed 17 digits")
    .regex(/^\d+$/, "Account number must contain only digits").or(z.literal("")),
});

export const invoice = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  status: z.enum(["Draft", "Paid", "Sent", "Overdue"]),
  sender: userSchema,
  client: userSchema,
  issueDate: z.string(),
  dueDate: z.string(),
  lineItems: z.array(lineItemSchema).min(1, "Add at least one line item"),
  currency: z.enum(["INR", "USD", "EUR"]),
  invoiceTotal: invoiceTotalSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  paymentInfo: paymentInfo,
  notes: z.string(),
});