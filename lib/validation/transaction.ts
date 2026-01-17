import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["IN", "OUT"]),

  amount: z.coerce.number().positive("المبلغ لازم يكون أكبر من صفر"),

  description: z.string().min(3, "الوصف قصير جدًا").max(200, "الوصف طويل"),

  method: z.enum(["CASH", "TRANSFER", "CHEQUE"]),

  reason: z
    .enum([
      "CUSTOMER_PAYMENT",
      "CUSTOMER_REFUND",
      "EXPENSE",
      "WITHDRAW",
      "DEPOSIT",
      "TREASURY_TRANSFER",
      "ADJUSTMENT",
      "OTHER",
    ])
    .default("OTHER"),

  treasuryId: z.string().min(1, "الخزينة مطلوبة"),
  customerId: z.string().optional().nullable(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
