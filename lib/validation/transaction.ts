import { z } from "zod";

export const transactionSchema = z.object({
  type: z.string().refine((val) => val === "IN" || val === "OUT", {
    message: "نوع الحركة مطلوب",
  }),

  amount: z.coerce.number().positive("المبلغ لازم يكون أكبر من صفر"),

  description: z.string().min(3, "الوصف قصير جدًا").max(200, "الوصف طويل"),

  method: z
    .string()
    .refine((val) => ["CASH", "TRANSFER", "CHEQUE"].includes(val), {
      message: "طريقة الدفع مطلوبة",
    }),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
