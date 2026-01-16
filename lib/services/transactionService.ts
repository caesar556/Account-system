import mongoose from "mongoose";
import { Treasury } from "@/models/Treasury";
import { CashTransaction } from "@/models/CashTransaction";

export async function createCashTransaction(data: any) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const treasury = await Treasury
      .findById(data.treasuryId)
      .session(session);

    if (!treasury || !treasury.isActive) {
      throw new Error("الخزنة غير متاحة");
    }

    if (data.type === "OUT") {
      const newBalance = treasury.balance - data.amount;

      if (newBalance < treasury.minBalance) {
        throw new Error("الرصيد أقل من الحد الأدنى");
      }

      treasury.balance = newBalance;
    } else {
      treasury.balance += data.amount;
    }

    await treasury.save({ session });

    const [transaction] = await CashTransaction.create(
      [data],
      { session }
    );

    await session.commitTransaction();
    return transaction;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}