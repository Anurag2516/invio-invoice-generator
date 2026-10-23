import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email address"));

const text = (max = 255) =>
  z
    .string()
    .trim()
    .max(max, `Must be at most ${max} characters`)
    .transform((v) => v || null)
    .nullish();

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  email,
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(255).optional(),
    companyName: text(),
    address: text(500),
    phone: text(20),
    website: z
      .string()
      .trim()
      .pipe(
        z.union([
          z.literal("").transform(() => null),
          z.httpUrl("Invalid website URL"),
        ]),
      )
      .nullish(),
    bankName: text(),
    accountHolderName: text(),
    accountNumber: text(34),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
