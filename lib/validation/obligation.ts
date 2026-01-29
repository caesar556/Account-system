import { z } from "zod";

export const obligationSchema = z.object({
  title: z.string().min(3, "العنوان قصير جدًا").max(100, "العنوان طويل جدًا"),
  description: z.string().optional(),
  amount: z.preprocess((val) => Number(val), z.number().positive("المبلغ يجب أن يكون أكبر من صفر")),
  partyName: z.string().min(2, "اسم الطرف قصير جدًا"),
  dueDate: z.string().min(1, "تاريخ الاستحقاق مطلوب"),
  notes: z.string().optional(),
});

export type ObligationFormValues = z.infer<typeof obligationSchema>;
