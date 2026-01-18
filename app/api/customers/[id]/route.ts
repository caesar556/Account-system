import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const customer = await Customer.findById(params.id).lean();
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const [transactions, records] = await Promise.all([
      CashTransaction.find({ customerId: params.id }).lean(),
      CustomerRecord.find({ customerId: params.id }).lean(),
    ]);

    const transactionBalance = (transactions || []).reduce((acc: number, tx: any) => {
      const amount = Number(tx.amount) || 0;
      return acc + (tx.type === "OUT" ? amount : -amount);
    }, 0);

    const recordBalance = (records || []).reduce((acc: number, rec: any) => {
      const amount = Number(rec.totalAmount) || 0;
      return acc + amount;
    }, 0);

    return NextResponse.json({
      ...customer,
      balance: transactionBalance + recordBalance,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const customer = await Customer.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const customer = await Customer.findByIdAndDelete(params.id);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
