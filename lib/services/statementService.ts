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
    openingBalance?: number;
  }> {
    const customer = await Customer.findById(customerId).lean();
    if (!customer) throw new Error("Customer not found");

    const [records, transactions] = await Promise.all([
      CustomerRecord.find({ customerId }).sort({ createdAt: 1 }).lean(),
      CashTransaction.find({ customerId }).sort({ createdAt: 1 }).lean(),
    ]);

    const openingBalance = customer.openingBalance || 0;

    const invoiceEntries: Omit<StatementEntry, "balance">[] = records.map(
      (record) => ({
        id: record._id.toString(),
        date: record.createdAt,
        type: "INVOICE" as const,
        title: record.title,
        description: record.description,
        debit: record.totalAmount,
        credit: 0,
        referenceId: record._id.toString(),
      }),
    );

    const transactionEntries: Omit<StatementEntry, "balance">[] =
      transactions.map((tx) => ({
        id: tx._id.toString(),
        date: tx.createdAt,
        type: "PAYMENT" as const,
        title: tx.description,
        description: tx.paymentMethod,
        debit: tx.type === "DEBIT" ? tx.amount : 0,
        credit: tx.type === "CREDIT" ? tx.amount : 0,
        referenceId: tx.referenceId,
      }));

    const openingEntry: Omit<StatementEntry, "balance"> | null =
      openingBalance !== 0
        ? {
            id: "OPENING_BALANCE",
            date: customer.createdAt,
            type: "TRANSACTION",
            title: "Opening Balance",
            description: "رصيد افتتاحي",
            debit: openingBalance > 0 ? openingBalance : 0,
            credit: openingBalance < 0 ? Math.abs(openingBalance) : 0,
          }
        : null;

    const events: Omit<StatementEntry, "balance">[] = [
      ...(openingEntry ? [openingEntry] : []),
      ...invoiceEntries,
      ...transactionEntries,
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

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
