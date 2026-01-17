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
        // Financial Logic:
        // When we RECEIVE money (IN) from a customer, their debt (balance) decreases.
        // When we PAY money (OUT) to a customer, their debt (balance) increases.
        const balanceChange = data.type === "IN" ? -data.amount : data.amount;
        
        // Enforce Credit Limit for debt increases
        if (balanceChange > 0 && customer.creditLimit > 0) {
          const projectedBalance = customer.balance + balanceChange;
          if (projectedBalance > customer.creditLimit) {
            throw new Error(`العملية مرفوضة: العميل تجاوز الحد الائتماني المسموح به (${customer.creditLimit})`);
          }
        }

        customer.balance += balanceChange;
        
        // Auto-update status based on balance
        if (customer.balance <= 0) {
          customer.status = "paid";
        } else {
          customer.status = "unpaid";
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