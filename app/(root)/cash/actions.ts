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
    reason: formData.get("reason"),
    treasuryId: formData.get("treasuryId"),
  };

  const validatedFields = transactionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;

    await CashTransaction.create(data);
    revalidatePath("/cash");

    return {
      success: true,
    };
  } catch(err) {
    console.log("error", err);
    return {
      success: false,
      errors: {
        _form: ["خطأ غير متوقع أثناء حفظ الحركة"],
      },
      
    };
  }
}
