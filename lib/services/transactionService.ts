import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";
import { Treasury } from "@/models/Treasury";
import mongoose from "mongoose";
import { CustomerService } from "./customerService";

export class TransactionService {
  static async createTransaction(data: {
    treasuryId: string;
    customerId?: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
    paymentMethod: "CASH" | "TRANSFER" | "CHEQUE";
    description: string;
    referenceType: "CUSTOMER_RECORD" | "MANUAL" | "ADJUSTMENT";
    referenceId?: string;
  }) {
    if (data.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const treasury = await Treasury.findById(data.treasuryId).session(
        session,
      );
      if (!treasury || !treasury.isActive) {
        throw new Error("Treasury not available");
      }

      if (data.customerId && data.type === "DEBIT") {
        const allowed = await CustomerService.checkCreditLimit(
          data.customerId,
          data.amount,
        );
        if (!allowed) {
          throw new Error("Exceeds credit limit");
        }
      }

      if (data.type === "DEBIT" && treasury.currentBalance < data.amount) {
        throw new Error(
          `رصيد الخزينة غير كافٍ. المتوفر: ${treasury.currentBalance}`,
        );
      }

      const [transaction] = await CashTransaction.create([data], { session });

      const treasuryChange =
        data.type === "CREDIT" ? data.amount : -data.amount;

      await Treasury.findByIdAndUpdate(
        data.treasuryId,
        { $inc: { currentBalance: treasuryChange } },
        { session },
      );

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async payRecord(data: {
    recordId: string;
    amount: number;
    treasuryId: string;
    paymentMethod: "CASH" | "TRANSFER" | "CHEQUE";
    description?: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const record = await CustomerRecord.findById(data.recordId).session(
        session,
      );
      if (!record) throw new Error("Record not found");

      if (record.status === "PAID") {
        throw new Error("Record already fully paid");
      }

      if (data.amount <= 0) {
        throw new Error("Payment amount must be positive");
      }

      const paidAgg = await CashTransaction.aggregate([
        {
          $match: {
            referenceType: "CUSTOMER_RECORD",
            referenceId: record._id,
            type: "CREDIT",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const totalPaid = paidAgg[0]?.total || 0;
      const remaining = record.totalAmount - totalPaid;

      if (data.amount > remaining) {
        throw new Error(
          `Payment exceeds remaining balance. Remaining: ${remaining}`,
        );
      }

      const transaction = await CashTransaction.create(
        [
          {
            treasuryId: data.treasuryId,
            customerId: record.customerId,
            type: "CREDIT",
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            description: data.description || `دفع للسجل  ${record.title}`,
            referenceType: "CUSTOMER_RECORD",
            referenceId: record._id,
          },
        ],
        { session },
      );

      const newPaidTotal = totalPaid + data.amount;
      record.status = newPaidTotal === record.totalAmount ? "PAID" : "PARTIAL";

      await record.save({ session });

      await session.commitTransaction();

      return {
        transaction: transaction[0],
        record,
        remainingAfter: record.totalAmount - newPaidTotal,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async reverseTransaction(params: {
    transactionId: string;
    reason: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const original = await CashTransaction.findById(
        params.transactionId,
      ).session(session);

      if (!original) throw new Error("Transaction not found");

      if (original.isReversal)
        throw new Error("Transaction is already a reversal");

      const treasury = await Treasury.findById(original.treasuryId).session(
        session,
      );

      if (!treasury || !treasury.isActive) {
        throw new Error("Treasury not available");
      }
      const reversalType = original.type === "DEBIT" ? "CREDIT" : "DEBIT";

      const [reversal] = await CashTransaction.create(
        [
          {
            treasuryId: original.treasuryId,
            customerId: original.customerId,
            type: reversalType,
            amount: original.amount,
            paymentMethod: original.paymentMethod,
            description: `معاملة مردودة ${original._id}`,
            referenceType: "ADJUSTMENT",
            referenceId: original._id,
            isReversal: true,
            reversedTransactionId: original._id,
            reversalReason: params.reason,
          },
        ],
        { session },
      );

      const treasuryChange =
        reversalType === "CREDIT" ? original.amount : -original.amount;

      await Treasury.findByIdAndUpdate(
        original.treasuryId,
        { $inc: { currentBalance: treasuryChange } },
        { session },
      );

      original.isReversed = true;
      await original.save({ session });

      await session.commitTransaction();
      return reversal;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
