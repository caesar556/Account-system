import { CashTransaction } from "@/models/CashTransaction";
import Customer from "@/models/Customer";
import CustomerRecord from "@/models/CustomerRecord";
import { Treasury } from "@/models/Treasury";
import mongoose, { ClientSession } from "mongoose";
import { CustomerService } from "./customerService";

export class TransactionService {
  /**
   * Create cash transaction (DEBIT / CREDIT)
   * Ledger-based for customer
   * Stateful only for Treasury
   */
  static async createTransaction(
    data: {
      treasuryId: string;
      customerId?: string;
      type: "DEBIT" | "CREDIT";
      amount: number;
      paymentMethod: "CASH" | "TRANSFER" | "CHEQUE";
      description: string;
      referenceType: "CUSTOMER_RECORD" | "MANUAL" | "ADJUSTMENT";
      referenceId?: string;
    },
    session?: ClientSession,
  ) {
    if (data.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const ownSession = !session;
    if (!session) {
      session = await mongoose.startSession();
      session.startTransaction();
    }

    try {
      const treasury = await Treasury.findById(data.treasuryId).session(
        session,
      );
      if (!treasury || !treasury.isActive) {
        throw new Error("Treasury not available");
      }

      // Customer + credit limit check (Ledger-based)
      if (data.customerId && data.type === "DEBIT") {
        const customer = await Customer.findById(data.customerId).session(
          session,
        );

        if (!customer || !customer.isActive) {
          throw new Error("Customer not available");
        }

        if (customer.creditLimit > 0) {
          const allowed = await CustomerService.checkCreditLimit(
            data.customerId,
            data.amount,
            session,
          );

          if (!allowed) {
            throw new Error("Credit limit exceeded");
          }
        }
      }

      // Treasury balance check
      if (data.type === "DEBIT" && treasury.currentBalance < data.amount) {
        throw new Error("Insufficient treasury balance");
      }

      // Create transaction (ledger)
      const [transaction] = await CashTransaction.create([data], {
        session,
      });

      // Update treasury balance
      const treasuryDelta = data.type === "CREDIT" ? data.amount : -data.amount;

      await Treasury.findByIdAndUpdate(
        data.treasuryId,
        { $inc: { currentBalance: treasuryDelta } },
        { session },
      );

      if (ownSession) {
        await session.commitTransaction();
      }

      return transaction;
    } catch (error) {
      if (ownSession) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      if (ownSession) {
        session.endSession();
      }
    }
  }

  /**
   * Pay a customer record (Invoice / Obligation)
   * Atomic:
   * - create CREDIT transaction
   * - update record paidAmount + status
   */
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
      if (!record) {
        throw new Error("Record not found");
      }

      if (record.status === "PAID") {
        throw new Error("Record already fully paid");
      }

      const remaining = record.totalAmount - record.paidAmount;

      if (data.amount <= 0 || data.amount > remaining) {
        throw new Error("Invalid payment amount");
      }

      // Create CREDIT transaction (same session)
      const transaction = await this.createTransaction(
        {
          treasuryId: data.treasuryId,
          customerId: record.customerId.toString(),
          type: "CREDIT",
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          description: data.description || `Payment for ${record.title}`,
          referenceType: "CUSTOMER_RECORD",
          referenceId: record._id.toString(),
        },
        session,
      );

      // Update record
      record.paidAmount += data.amount;
      record.status =
        record.paidAmount >= record.totalAmount ? "PAID" : "PARTIAL";

      await record.save({ session });

      await session.commitTransaction();

      return { transaction, record };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
