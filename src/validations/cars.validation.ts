import z from "zod";

export const CarSchema = z.object({
  brand_id: z.coerce.number(),
  model: z.string().min(3).max(100),
  year: z.coerce.number().min(1900).max(new Date().getFullYear()),
  mileage: z.coerce.number().min(0),
  price: z.coerce.number().min(1),
  description: z.string().optional(),
  condition: z.enum(["new", "used"]),
});

