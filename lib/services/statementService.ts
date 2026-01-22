import Customer from "@/models/Customer";
import CustomerRecord from "@/models/CustomerRecord";
import { CashTransaction } from "@/models/CashTransaction";

export interface StatementEntry {
  id: string;
  date: Date;
  type: "INVOICE" | "PAYMENT" | "TRANSACTION";
  title: string;
  description?: string;
  debit: number;
  credit: number;
  balance: number;
  referenceId?: string;
}

export class StatementService {
  static async generate(customerId: string): Promise<{
    customer: any;
    statement: StatementEntry[];
    currentBalance: number;
  }> {
    const customer = await Customer.findById(customerId).lean();
    if (!customer) throw new Error("Customer not found");

    const [records, transactions] = await Promise.all([
      CustomerRecord.find({ customerId }).lean(),
      CashTransaction.find({ customerId }).lean(),
    ]);

    // 1️⃣ حوّل الفواتير Entries
    const invoiceEntries = records.map((record) => ({
      id: record._id.toString(),
      date: record.createdAt,
      type: "INVOICE" as const,
      title: record.title,
      description: record.description,
      debit: record.totalAmount,
      credit: 0,
      referenceId: record._id.toString(),
    }));

    // 2️⃣ حوّل المعاملات Entries
    const transactionEntries = transactions.map((tx) => ({
      id: tx._id.toString(),
      date: tx.createdAt,
      type: "PAYMENT" as const,
      title: tx.description,
      description: tx.paymentMethod,
      debit: tx.type === "DEBIT" ? tx.amount : 0,
      credit: tx.type === "CREDIT" ? tx.amount : 0,
      referenceId: tx.referenceId,
    }));

    // 3️⃣ دمج + ترتيب
    const events = [...invoiceEntries, ...transactionEntries].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    // 4️⃣ Running balance
    let balance = 0;
    const statement = events.map((e) => {
      balance = balance + e.debit - e.credit;
      return { ...e, balance };
    });

    return {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      statement,
      currentBalance: balance,
    };
  }
}