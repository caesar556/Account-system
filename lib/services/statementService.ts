import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";
import Customer from "@/models/Customer";

export interface IStatementEntry {
  id: string;
  date: Date;
  type: "RECORD" | "TRANSACTION" | "OPENING_BALANCE";
  title: string;
  description?: string;
  debit: number;
  credit: number;
  balance: number;
}

export class StatementService {
  static async generateStatement(customerId: string): Promise<{
    customer: any;
    openingBalance: number;
    currentBalance: number;
    statement: IStatementEntry[];
  }> {
    const customer = await Customer.findById(customerId).lean();
    if (!customer) throw new Error("Customer not found");

    const [transactions, records] = await Promise.all([
      CashTransaction.find({ customerId }).sort({ createdAt: 1 }).lean(),
      CustomerRecord.find({ customerId }).sort({ createdAt: 1 }).lean(),
    ]);

    const events = [
      {
        id: "opening",
        date: customer.createdAt,
        type: "OPENING_BALANCE" as const,
        title: "رصيد افتتاحي",
        debit: Math.max(0, customer.currentBalance),
        credit: Math.max(0, -customer.currentBalance),
      },

      ...records.map((record) => ({
        id: record._id.toString(),
        date: record.createdAt,
        type: "RECORD" as const,
        title: record.title,
        description: record.description,
        debit: record.totalAmount,
        credit: 0,
        status: record.status,
        paidAmount: record.paidAmount,
      })),

      ...transactions.map((tx) => ({
        id: tx._id.toString(),
        date: tx.createdAt,
        type: "TRANSACTION" as const,
        title: tx.description,
        description: tx.paymentMethod,
        debit: tx.type === "DEBIT" ? tx.amount : 0,
        credit: tx.type === "CREDIT" ? tx.amount : 0,
        referenceId: tx.referenceId,
      })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    let balance = 0;
    const statement = events.map((event) => {
      balance = balance + event.debit - event.credit;

      return {
        ...event,
        balance,
      };
    });

    return {
      customer,
      openingBalance: customer.currentBalance,
      currentBalance: balance,
      statement,
    };
  }
}
