import { NextResponse } from "next/server";
import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: customerId } = await params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 },
      );
    }

    const [transactions, records] = await Promise.all([
      CashTransaction.find({ customerId }).sort({ createdAt: 1 }).lean(),
      CustomerRecord.find({ customerId }).sort({ createdAt: 1 }).lean(),
    ]);

    const allEvents = [
      ...transactions.map((tx: any) => ({
        ...tx,
        eventDate: tx.createdAt,
        eventType: "TRANSACTION",
      })),
      ...records.map((rec: any) => ({
        ...rec,
        eventDate: rec.createdAt,
        eventType: "RECORD",
        amount: rec.totalAmount,
        type: "OUT",
        description: `سجل: ${rec.title} - ${rec.description || ""}`,
      })),
    ].sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    );

    let runningBalance = 0;
    const statement = allEvents.map((event: any) => {
      const change = event.type === "IN" ? -event.amount : event.amount;
      runningBalance += change;

      return {
        ...event,
        balanceAfter: runningBalance,
        change,
      };
    });

    return NextResponse.json({
      customerId,
      currentBalance: runningBalance,
      transactions: statement.reverse(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
