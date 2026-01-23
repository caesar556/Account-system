import { ClientSession, Types } from "mongoose";
import Customer from "@/models/Customer";
import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";

export class CustomerService {
  /**
   * حساب الرصيد بالكامل (Ledger + Unpaid Records)
   * ledger: transactions (DEBIT - CREDIT)
   * unpaidRecords: OPEN / PARTIAL records
   * total: ledger + unpaidRecords
   */
  static async calculateBalance(
    customerId: string,
    session?: ClientSession,
  ): Promise<{ ledger: number; unpaidRecords: number; total: number }> {
    const id = new Types.ObjectId(customerId);

    const tx = await CashTransaction.aggregate(
      [
        { $match: { customerId: id } },
        {
          $group: {
            _id: null,
            ledger: {
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
      ],
      session ? { session } : undefined,
    );

    const ledger = tx[0]?.ledger || 0;

    const rec = await CustomerRecord.aggregate(
      [
        {
          $match: {
            customerId: id,
            status: { $in: ["OPEN", "PARTIAL"] },
          },
        },
        {
          $group: {
            _id: null,
            unpaidRecords: {
              $sum: { $subtract: ["$totalAmount", "$paidAmount"] },
            },
          },
        },
      ],
      session ? { session } : undefined,
    );

    const unpaidRecords = rec[0]?.unpaidRecords || 0;

    return {
      ledger,
      unpaidRecords,
      total: ledger + unpaidRecords,
    };
  }

  /**
   * check if customer can take additionalAmount (DEBIT)
   * based on credit limit and current balance
   */
  static async checkCreditLimit(
    customerId: string,
    additionalAmount: number,
    session?: ClientSession,
  ): Promise<boolean> {
    const customer = await Customer.findById(customerId).session(
      session || null,
    );
    if (!customer || customer.creditLimit <= 0) return true;

    const balance = await this.calculateBalance(customerId, session);

    return balance.total + additionalAmount <= customer.creditLimit;
  }

  /**
   * Customer summary
   * - balance
   * - transactions totals
   * - customer info
   */
  static async getCustomerSummary(customerId: string) {
    const customer = await Customer.findById(customerId).lean();
    if (!customer) throw new Error("Customer not found");

    const balance = await this.calculateBalance(customerId);

    const txStats = await CashTransaction.aggregate([
      { $match: { customerId: new Types.ObjectId(customerId) } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        category: customer.category,
        creditLimit: customer.creditLimit,
        isActive: customer.isActive,
      },
      balance: {
        ledger: balance.ledger,
        unpaidRecords: balance.unpaidRecords,
        current: balance.total,
        creditLimit: customer.creditLimit,
        availableCredit: Math.max(0, customer.creditLimit - balance.total),
      },
      transactions: {
        debitTotal: txStats.find((t) => t._id === "DEBIT")?.total || 0,
        creditTotal: txStats.find((t) => t._id === "CREDIT")?.total || 0,
        debitCount: txStats.find((t) => t._id === "DEBIT")?.count || 0,
        creditCount: txStats.find((t) => t._id === "CREDIT")?.count || 0,
      },
    };
  }

  /**
   * Get customers with debt (ledger + unpaid records)
   * + sorting + filtering
   */
  static async getCustomersWithDebt(
    options: {
      minBalance?: number;
      sortBy?: "balance" | "name";
      order?: "asc" | "desc";
    } = {},
  ) {
    const { minBalance = 0, sortBy = "balance", order = "desc" } = options;

    const pipeline = [
      { $match: { isActive: true } },

      // Join transactions
      {
        $lookup: {
          from: "cashtransactions",
          localField: "_id",
          foreignField: "customerId",
          as: "transactions",
        },
      },

      // Join records
      {
        $lookup: {
          from: "customerrecords",
          localField: "_id",
          foreignField: "customerId",
          as: "records",
        },
      },

      // Calculate ledger + unpaidRecords
      {
        $addFields: {
          ledger: {
            $sum: {
              $map: {
                input: "$transactions",
                as: "tx",
                in: {
                  $cond: [
                    { $eq: ["$$tx.type", "DEBIT"] },
                    "$$tx.amount",
                    { $multiply: ["$$tx.amount", -1] },
                  ],
                },
              },
            },
          },
          unpaidRecords: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$records",
                    as: "r",
                    cond: { $in: ["$$r.status", ["OPEN", "PARTIAL"]] },
                  },
                },
                as: "r",
                in: { $subtract: ["$$r.totalAmount", "$$r.paidAmount"] },
              },
            },
          },
        },
      },

      // Total balance
      {
        $addFields: {
          currentBalance: { $add: ["$ledger", "$unpaidRecords"] },
        },
      },

      { $match: { currentBalance: { $gte: minBalance } } },

      {
        $sort:
          sortBy === "balance"
            ? { currentBalance: order === "desc" ? -1 : 1 }
            : { name: order === "desc" ? -1 : 1 },
      },

      {
        $project: {
          transactions: 0,
          records: 0,
        },
      },
    ];

    return await Customer.aggregate(pipeline as any);
  }
}
