import { z } from "zod";

export const clientSchema = z.object({
  name: z.string(),
  email: z.email(),
  companyName: z.string().optional(),
  address: z.string(),
  phone: z.string().optional(),
  website: z.url().optional(),
});

export const updateClientSchema = clientSchema.partial();

export type ClientInput = z.infer<typeof clientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;