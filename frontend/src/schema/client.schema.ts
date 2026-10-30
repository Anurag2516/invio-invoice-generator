import z from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string(),
  companyName: z.string(),
  address: z.string(),
  phone: z.string(),
  website: z.string(),
});

export default clientSchema;