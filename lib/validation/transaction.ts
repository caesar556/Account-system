import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["DEBIT", "CREDIT"]),

  amount: z.preprocess((val) => Number(val), z.number().positive()),
  description: z.string().min(3, "الوصف قصير جدًا").max(200, "الوصف طويل"),

  paymentMethod: z.enum(["CASH", "TRANSFER", "CHEQUE"]),

  referenceType: z
    .enum(["CUSTOMER_RECORD", "MANUAL", "ADJUSTMENT"])
    .default("MANUAL"),
  referenceId: z.string().optional().nullable(),

  treasuryId: z.string().min(1, "الخزينة مطلوبة"),
  customerId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === "NO_CUSTOMER" ? null : val)),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
