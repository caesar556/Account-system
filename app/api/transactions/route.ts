import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CashTransaction } from "@/models/CashTransaction";
import { createCashTransaction } from "@/lib/services/transactionService";

export async function GET() {
  try {
    await dbConnect();
    const transactions = await CashTransaction.find().sort({ createdAt: -1 });
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const transaction = await createCashTransaction(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
