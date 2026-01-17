import mongoose from "mongoose";
import { Treasury } from "@/models/Treasury";
import { CashTransaction } from "@/models/CashTransaction";
import Customer from "@/models/Customer";

export async function createCashTransaction(data: any) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { customerId, ...transactionData } = data;
    const effectiveCustomerId = customerId === "none" ? null : customerId;

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

    // Update Customer Balance if customerId is provided
    if (effectiveCustomerId) {
      const customer = await Customer.findById(effectiveCustomerId).session(session);
      if (customer) {
        // For IN (money received from customer), decrease their balance (they owe less)
        // For OUT (money paid to customer), increase their balance (they owe more)
        if (data.type === "IN") {
          customer.balance -= data.amount;
        } else {
          customer.balance += data.amount;
        }
        await customer.save({ session });
      }
    }

    const [transaction] = await CashTransaction.create(
      [{
        ...transactionData,
        customerId: effectiveCustomerId
      }],
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