import { CashTransaction } from "@/models/CashTransaction";
import Customer from "@/models/Customer";
import { Treasury } from "@/models/Treasury";
import CustomerRecord from "@/models/CustomerRecord";
import { CustomerService } from "./customerService";

export class TransactionService {
  // Create a new transaction
  static async createTransaction(data: {
    treasuryId: string;
    customerId?: string;
    type: "DEBIT" | "CREDIT";
    amount: number;
    paymentMethod: "CASH" | "TRANSFER" | "CHEQUE";
    description: string;
    referenceType: "CUSTOMER_RECORD" | "MANUAL" | "ADJUSTMENT";
    referenceId?: string;
    createdBy: string;
  }) {
    // Validate treasury
    const treasury = await Treasury.findById(data.treasuryId);
    if (!treasury || !treasury.isActive) {
      throw new Error("Treasury not available");
    }

    // Validate customer if exists
    if (data.customerId) {
      const customer = await Customer.findById(data.customerId);
      if (!customer || !customer.isActive) {
        throw new Error("Customer not available");
      }

      // Check credit limit for DEBIT transactions
      if (data.type === "DEBIT") {
        const withinLimit = await CustomerService.checkCreditLimit(
          data.customerId,
          data.amount,
        );
        if (!withinLimit) {
          throw new Error(`Exceeds credit limit (${customer.creditLimit})`);
        }
      }
    }

    // Create transaction
    const transaction = await CashTransaction.create(data);

    // Update customer balance if customer exists
    if (data.customerId) {
      await CustomerService.updateBalance(
        data.customerId,
        data.amount,
        data.type,
      );
    }

    // Update treasury balance
    const treasuryChange = data.type === "DEBIT" ? data.amount : -data.amount;
    await Treasury.findByIdAndUpdate(data.treasuryId, {
      $inc: { currentBalance: treasuryChange },
    });

    return transaction;
  }

  // Pay a customer record
  static async payRecord(data: {
    recordId: string;
    amount: number;
    treasuryId: string;
    paymentMethod: "CASH" | "TRANSFER" | "CHEQUE";
    description?: string;
    createdBy: string;
  }) {
    const record = await CustomerRecord.findById(data.recordId);
    if (!record) throw new Error("Record not found");

    if (record.status === "PAID") {
      throw new Error("Record already paid");
    }

    const remaining = record.totalAmount - record.paidAmount;
    if (data.amount <= 0) throw new Error("Amount must be positive");
    if (data.amount > remaining) throw new Error("Amount exceeds remaining");

    // Create transaction (CREDIT because customer is paying, reducing their debt)
    const transaction = await this.createTransaction({
      treasuryId: data.treasuryId,
      customerId: record.customerId,
      type: "CREDIT",
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      description: data.description || `Payment for ${record.title}`,
      referenceType: "CUSTOMER_RECORD",
      referenceId: record._id,
      createdBy: data.createdBy,
    });

    // Update record
    record.paidAmount += data.amount;
    record.status =
      record.paidAmount >= record.totalAmount ? "PAID" : "PARTIAL";
    await record.save();

    return { transaction, record };
  }
}
