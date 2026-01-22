import { z } from "zod";

export const recordSchema = z.object({
  customerId: z.string().min(1, "يجب تحديد العميل"),

  title: z
    .string()
    .min(3, "العنوان يجب أن يكون 3 أحرف على الأقل")
    .max(100, "العنوان طويل جدًا"),

  description: z.string().optional(),

  totalAmount: z.coerce.number().min(1, "المبلغ يجب أن يكون أكبر من صفر"),

  paidAmount: z.coerce.number().min(0, "المبلغ المدفوع يجب أن يكون أكبر من أو يساوي صفر"),

  status: z.enum(["OPEN", "PARTIAL", "PAID", "CANCELLED", "PENDING"]),

  dueDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => !val || !Number.isNaN(Date.parse(val)), {
      message: "تاريخ الاستحقاق غير صحيح",
    }),
});

export type RecordFormValues = z.infer<typeof recordSchema>;
