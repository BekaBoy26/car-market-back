import z from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(2).optional(),
});