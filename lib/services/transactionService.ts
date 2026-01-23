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

      const remaining = record.totalAmount - record.paidAmount;

      if (data.amount <= 0) {
        throw new Error("Payment amount must be positive");
      }

      if (data.amount > remaining) {
        throw new Error(
          `Payment exceeds remaining balance. Remaining: ${remaining}`,
        );
      }

      const transaction = await this.createTransaction({
        treasuryId: data.treasuryId,
        customerId: record.customerId.toString(),
        type: "CREDIT",
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        description: data.description || `Payment for ${record.title}`,
        referenceType: "CUSTOMER_RECORD",
        referenceId: record._id.toString(),
      });

      record.paidAmount += data.amount;
      record.status =
        record.paidAmount >= record.totalAmount ? "PAID" : "PARTIAL";
      await record.save({ session });

      await session.commitTransaction();

      return { transaction, record };
    } catch (error) {
      console.log("service error", error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
