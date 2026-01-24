import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().optional(),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  creditLimit: z.coerce
    .number()
    .min(0, "الحد الائتماني لا يمكن أن يكون أقل من صفر")
    .default(0),
  status: z.enum(["paid", "unpaid"]).default("unpaid"),
  openingBalance: z.coerce.number().default(0),

  category: z.enum(["regular", "vip", "wholesale"]).default("regular"),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
