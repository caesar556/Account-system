import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["IN", "OUT"], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_type && issue.received === "undefined") {
        return { message: "نوع الحركة مطلوب" };
      }
      return { message: ctx.defaultError };
    },
  }),

  amount: z.coerce
    .number({
      invalid_type_error: "المبلغ لازم يكون رقم",
    })
    .positive("المبلغ لازم يكون أكبر من صفر"),

  description: z.string().min(3, "الوصف قصير جدًا").max(200, "الوصف طويل"),

  method: z.enum(["CASH", "TRANSFER", "CHEQUE"], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_type && issue.received === "undefined") {
        return { message: "طريقة الدفع مطلوبة" };
      }
      return { message: ctx.defaultError };
    },
  }),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
