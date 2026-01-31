import { CashTransaction } from "@/models/CashTransaction";
import Customer from "@/models/Customer";
import CustomerRecord from "@/models/CustomerRecord";
import { Types } from "mongoose";

export class CustomerService {
  static async getCurrentBalance(customerId: string): Promise<number> {
    const customer = await Customer.findById(customerId);
    if (!customer) return 0;

    const openingBalance = (customer as any).openingBalance || 0;
    const customerObjectId = new Types.ObjectId(customerId);

    const txResult = await CashTransaction.aggregate([
      { 
        $match: { 
          customerId: customerObjectId,
          deletedAt: { $exists: false },
        } 
      },
      {
        $group: {
          _id: null,
          txBalance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "DEBIT"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
        },
      },
    ]);

    const recordResult = await CustomerRecord.aggregate([
      {
        $match: {
          customerId: customerObjectId,
          status: { $ne: "CANCELLED" },
        },
      },
      {
        $group: {
          _id: null,
          totalRecordAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const recordPaymentResult = await CashTransaction.aggregate([
      {
        $match: {
          customerId: customerObjectId,
          referenceType: "CUSTOMER_RECORD",
          type: "CREDIT",
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$amount" },
        },
      },
    ]);

    const txBalance = txResult[0]?.txBalance || 0;
    const totalRecordAmount = recordResult[0]?.totalRecordAmount || 0;
    const totalPaidOnRecords = recordPaymentResult[0]?.totalPaid || 0;

    const unpaidRecordBalance = totalRecordAmount - totalPaidOnRecords;

    return openingBalance + txBalance + unpaidRecordBalance;
  }

  static async getCustomerSummary(customerId: string) {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error("Customer not found");

    const transactions = await CashTransaction.find({ customerId }).lean();

    const totalDebit = transactions
      .filter((t) => t.type === "DEBIT")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCredit = transactions
      .filter((t) => t.type === "CREDIT")
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalDebit - totalCredit;

    const records = await CustomerRecord.find({ customerId }).lean();

    let totalUnpaid = 0;
    let unpaidCount = 0;

    records.forEach((record) => {
      const payments = transactions.filter(
        (tx) =>
          tx.referenceType === "CUSTOMER_RECORD" &&
          tx.referenceId.toString() === record._id.toString() &&
          tx.type === "CREDIT",
      );
      const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
      const remaining = Math.max(0, record.totalAmount - paidAmount);

      if (remaining > 0) {
        totalUnpaid += remaining;
        unpaidCount += 1;
      }
    });

    return {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        creditLimit: customer.creditLimit,
        isActive: customer.isActive,
      },
      balance: {
        current: currentBalance,
        creditLimit: customer.creditLimit,
        availableCredit: Math.max(0, customer.creditLimit - currentBalance),
        utilizationPercent:
          customer.creditLimit > 0
            ? (currentBalance / customer.creditLimit) * 100
            : 0,
      },
      transactions: {
        totalDebit,
        totalCredit,
        debitCount: transactions.filter((t) => t.type === "DEBIT").length,
        creditCount: transactions.filter((t) => t.type === "CREDIT").length,
      },
      records: {
        totalUnpaid,
        unpaidCount,
      },
    };
  }

  static async checkCreditLimit(
    customerId: string,
    additionalAmount: number,
    type: "DEBIT" | "CREDIT" = "DEBIT",
  ): Promise<boolean> {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error("Customer not found");

    if (customer.creditLimit <= 0 || type === "CREDIT") return true;

    const currentBalance = await this.getCurrentBalance(customerId);
    const projectedBalance = currentBalance + additionalAmount;

    return projectedBalance <= customer.creditLimit;
  }

  static async getAllCustomersWithBalances() {
    const customers = await Customer.find({}).lean();

    const txBalances = await CashTransaction.aggregate([
      {
        $match: {
          customerId: { $exists: true, $ne: null },
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: "$customerId",
          txBalance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "DEBIT"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
        },
      },
    ]);

    const recordTotals = await CustomerRecord.aggregate([
      {
        $match: {
          status: { $ne: "CANCELLED" },
        },
      },
      {
        $group: {
          _id: "$customerId",
          totalRecordAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const recordPayments = await CashTransaction.aggregate([
      {
        $match: {
          referenceType: "CUSTOMER_RECORD",
          type: "CREDIT",
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: "$customerId",
          totalPaid: { $sum: "$amount" },
        },
      },
    ]);

    const txBalanceMap = new Map(
      txBalances.map((b) => [b._id.toString(), b.txBalance]),
    );

    const recordTotalMap = new Map(
      recordTotals.map((r) => [r._id.toString(), r.totalRecordAmount]),
    );

    const recordPaymentMap = new Map(
      recordPayments.map((p) => [p._id.toString(), p.totalPaid]),
    );

    return customers.map((customer) => {
      const customerId = customer._id.toString();
      const txBalance = txBalanceMap.get(customerId) || 0;
      const totalRecordAmount = recordTotalMap.get(customerId) || 0;
      const totalPaidOnRecords = recordPaymentMap.get(customerId) || 0;

      const unpaidRecordBalance = totalRecordAmount - totalPaidOnRecords;

      return {
        ...customer,
        currentBalance: (customer.openingBalance || 0) + txBalance + unpaidRecordBalance,
      };
    });
  }
}
