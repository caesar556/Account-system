import { NextResponse } from "next/server";
import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";
import Customer from "@/models/Customer";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const customerId = params.id;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const customer = await Customer.findById(customerId).lean();
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const [transactions, records] = await Promise.all([
    CashTransaction.find({ customerId }).sort({ createdAt: 1 }).lean(),
    CustomerRecord.find({ customerId }).sort({ createdAt: 1 }).lean(),
  ]);

  const events = [
    ...transactions.map((tx: any) => ({
      ...tx,
      eventDate: tx.createdAt,
      eventType: "TRANSACTION",
      change: tx.type === "OUT" ? tx.amount : -tx.amount,
    })),
    ...records.map((rec: any) => ({
      ...rec,
      eventDate: rec.createdAt,
      eventType: "RECORD",
      change: rec.totalAmount,
    })),
  ].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
  );

  let balance = 0;
  const statement = events.map((e: any) => {
    balance += e.change;
    return { ...e, balanceAfter: balance };
  });

  return NextResponse.json({
    customerId,
    customer,
    currentBalance: balance,
    statement,
  });
}
