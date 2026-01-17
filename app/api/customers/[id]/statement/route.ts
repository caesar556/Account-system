import { NextResponse } from "next/server";
import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
    }

    // Fetch transactions and records sorted by date
    const [transactions, records] = await Promise.all([
      CashTransaction.find({ customerId }).sort({ createdAt: 1 }).lean(),
      CustomerRecord.find({ customerId }).sort({ createdAt: 1 }).lean()
    ]);

    // Combine and sort all events by date
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
        // A record (like an invoice) increases debt
        amount: rec.totalAmount,
        type: "OUT", // Standard accounting: Debt increase
        description: `سجل: ${rec.title} - ${rec.description || ""}`
      }))
    ].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

    let runningBalance = 0;
    const statement = allEvents.map((event: any) => {
      // Logic: IN (Payment from customer) reduces debt, OUT (Credit/Invoice to customer) increases debt
      const change = event.type === "IN" ? -event.amount : event.amount;
      runningBalance += change;
      
      return {
        ...event,
        balanceAfter: runningBalance,
        change
      };
    });

    return NextResponse.json({
      customerId,
      currentBalance: runningBalance,
      transactions: statement.reverse() // Show latest first for display
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
