"use server";

import dbConnect from "@/lib/db";
import { CashTransaction } from "@/models/CashTransaction";
import { transactionSchema } from "@/lib/validation/transaction";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
};

export async function createTransaction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await dbConnect();

  const rawData = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    method: formData.get("method"),
  };

  // Convert amount to number for Zod coercion if it's a string
  const amountStr = formData.get("amount");
  const processedData = {
    ...rawData,
    amount: amountStr ? parseFloat(amountStr as string) : undefined,
  };

  const validatedFields = transactionSchema.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;

    const amount = data.type === "OUT" ? -Math.abs(data.amount) : data.amount;

    await CashTransaction.create({ ...data, amount });
    revalidatePath("/cash");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      errors: {
        _form: ["خطأ غير متوقع أثناء حفظ الحركة"],
      },
    };
  }
}
