import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  companyName: z.string(),
  address: z.string(),
  email: z.email({ message: "Invalid email" }).or(z.literal("")),
  phone: z.string(),
  website: z.string()
})

export const lineItemSchema = z.object({
  id: z.string(),
  serialNumber: z.number(),
  description: z.string().min(1, "Description is required"),
  quantity: z
    .number({ message: "Must be a number" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  rate: z
    .number({ message: "Must be a number" })
    .min(0, "Rate cannot be negative"),
  amount: z.number(),
});

export const invoiceTotalSchema = z.object({
  subtotal: z.number(),
  appliedTax: z
    .number()
    .min(0, "Tax must be at least at 0%")
    .max(100, "Tax must be at most at 100%"),
  appliedDiscount: z.number().min(0).max(100),
  total: z.number(),
});

export const invoice = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  status: z.enum(["Draft" , "Paid" , "Sent" , "Overdue"]),
  sender: userSchema,
  client: userSchema,
  issueDate: z.string(),
  dueDate: z.string(),
  lineItems: z.array(lineItemSchema).min(1, "Add at least one line item"),
  currency: z.enum(["INR", "USD", "EUR"]),
  invoiceTotal: invoiceTotalSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.string(),
});