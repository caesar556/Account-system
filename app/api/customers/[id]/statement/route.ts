import { NextResponse } from "next/server";
import { CashTransaction } from "@/models/CashTransaction";
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

    // Fetch transactions sorted by date
    const transactions = await CashTransaction.find({ customerId })
      .sort({ createdAt: 1 })
      .lean();

    let runningBalance = 0;
    const statement = transactions.map((tx: any) => {
      // Logic: IN (Payment from customer) reduces debt, OUT (Credit to customer) increases debt
      const change = tx.type === "IN" ? -tx.amount : tx.amount;
      runningBalance += change;
      
      return {
        ...tx,
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
