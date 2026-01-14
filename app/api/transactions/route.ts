import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CashTransaction } from "@/models/CashTransaction";

export async function GET() {
  try {
    await dbConnect();
    const treasuries = await CashTransaction.find();
    return NextResponse.json(treasuries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const transaction = await CashTransaction.create(body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
