import { CashTransaction } from "@/models/CashTransaction";
import Customer from "@/models/Customer";
import CustomerRecord from "@/models/CustomerRecord";
import { Types } from "mongoose";

export class CustomerService {
  /**
   * Get customer's current balance (calculated from transactions)
   * Positive = Customer owes money (DEBIT > CREDIT)
   * Negative = We owe customer money (CREDIT > DEBIT)
   */
  static async getCurrentBalance(customerId: string): Promise<number> {
    const customer = await Customer.findById(customerId);
    if (!customer) return 0;
    
    const openingBalance = (customer as any).currentBalance || 0;

    const result = await CashTransaction.aggregate([
      { $match: { customerId: new Types.ObjectId(customerId) } },
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

    const txBalance = result[0]?.txBalance || 0;
    
    // Total balance = Opening Balance + (Debits - Credits)
    return openingBalance + txBalance;
  }


  static async getCustomerSummary(customerId: string) {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error("Customer not found");

    const currentBalance = await this.getCurrentBalance(customerId);

    const transactions = await CashTransaction.aggregate([
      { $match: { customerId: new Types.ObjectId(customerId) } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalDebit = transactions.find((t) => t._id === "DEBIT")?.total || 0;
    const totalCredit =
      transactions.find((t) => t._id === "CREDIT")?.total || 0;

    const records = await CustomerRecord.aggregate([
      { $match: { customerId: new Types.ObjectId(customerId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          paidAmount: { $sum: "$paidAmount" },
        },
      },
    ]);

    const unpaidRecords = records.filter(
      (r) => r._id === "PENDING" || r._id === "PARTIAL",
    );
    const totalUnpaid = unpaidRecords.reduce(
      (sum, r) => sum + (r.totalAmount - r.paidAmount),
      0,
    );

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
        debitCount: transactions.find((t) => t._id === "DEBIT")?.count || 0,
        creditCount: transactions.find((t) => t._id === "CREDIT")?.count || 0,
      },
      records: {
        totalUnpaid,
        unpaidCount: unpaidRecords.reduce((sum, r) => sum + r.count, 0),
      },
    };
  }

  static async checkCreditLimit(
    customerId: string,
    additionalAmount: number,
    type: "DEBIT" | "CREDIT" = "DEBIT"
  ): Promise<boolean> {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error("Customer not found");

    if (customer.creditLimit <= 0 || type === "CREDIT") return true;

    const currentBalance = await this.getCurrentBalance(customerId);
    const projectedBalance = currentBalance + additionalAmount;

    return projectedBalance <= customer.creditLimit;
  }

  /**
   * Get customers with outstanding balances
   */
  static async getCustomersWithDebt(
    options: {
      minBalance?: number;
      sortBy?: "balance" | "name";
      order?: "asc" | "desc";
    } = {},
  ) {
    const { minBalance = 0, sortBy = "balance", order = "desc" } = options;

    const customers = await Customer.find({ isActive: true }).lean();

    const customersWithBalance = await Promise.all(
      customers.map(async (customer) => {
        const balance = await this.getCurrentBalance(customer._id.toString());
        return {
          ...customer,
          currentBalance: balance,
        };
      }),
    );

    const filtered = customersWithBalance.filter(
      (c) => c.currentBalance >= minBalance,
    );

    return filtered.sort((a, b) => {
      if (sortBy === "balance") {
        return order === "desc"
          ? b.currentBalance - a.currentBalance
          : a.currentBalance - b.currentBalance;
      }
      return order === "desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    });
  }
}
