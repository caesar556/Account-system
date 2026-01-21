import { CashTransaction } from "@/models/CashTransaction";
import Customer from "@/models/Customer";
import CustomerRecord from "@/models/CustomerRecord";
import { Treasury } from "@/models/Treasury";
import mongoose from "mongoose";
import { CustomerService } from "./customerService";

export class TransactionService {
  /**
   * Create a financial transaction with full atomicity
   */
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
    // Validation
    if (data.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Validate Treasury
      const treasury = await Treasury.findById(data.treasuryId).session(
        session,
      );
      if (!treasury || !treasury.isActive) {
        throw new Error("Treasury not available");
      }

      // 2. Validate Customer (if provided)
      if (data.customerId) {
        const customer = await Customer.findById(data.customerId).session(
          session,
        );
        if (!customer || !customer.isActive) {
          throw new Error("Customer not available");
        }

        // 3. Check Credit Limit for DEBIT transactions
        if (data.type === "DEBIT" && customer.creditLimit > 0) {
          const currentBalance = await CustomerService.getCurrentBalance(
            data.customerId,
          );
          const projectedBalance = currentBalance + data.amount;

          if (projectedBalance > customer.creditLimit) {
            throw new Error(
              `Exceeds credit limit. Current: ${currentBalance}, Limit: ${customer.creditLimit}`,
            );
          }
        }
      }

      // 4. Check Treasury has sufficient funds for DEBIT (payment out / expense)
      if (data.type === "DEBIT") {
        if (treasury.currentBalance < data.amount) {
          throw new Error(
            `رصيد الخزينة غير كافٍ. المتوفر: ${treasury.currentBalance}`,
          );
        }
      }

      // 5. Create Transaction
      const [transaction] = await CashTransaction.create([data], { session });

      // 6. Update Treasury Balance
      // DEBIT (Red) = OUT (Expense/Debt for customer) = DECREASE Treasury
      // CREDIT (Green) = IN (Income/Payment from customer) = INCREASE Treasury
      const treasuryChange = data.type === "CREDIT" ? data.amount : -data.amount;

      await Treasury.findByIdAndUpdate(
        data.treasuryId,
        { $inc: { currentBalance: treasuryChange } },
        { session },
      );

      // 7. Update Customer Balance
      // DEBIT = Debt increases = +Amount
      // CREDIT = Debt decreases = -Amount
      if (data.customerId) {
        await Customer.findByIdAndUpdate(
          data.customerId,
          { $inc: { currentBalance: data.type === "DEBIT" ? data.amount : -data.amount } },
          { session }
        );
      }

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
