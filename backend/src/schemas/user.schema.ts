import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
  companyName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.url().optional(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.url().optional(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;