import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";

export async function GET() {
  try {
    await dbConnect();
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();
    
    // Calculate balance for each customer
    const customersWithBalance = await Promise.all(customers.map(async (customer: any) => {
      const customerId = customer._id;
      const [transactions, records] = await Promise.all([
        CashTransaction.find({ customerId }).lean(),
        CustomerRecord.find({ customerId }).lean(),
      ]);

      const transactionBalance = (transactions || []).reduce((acc: number, tx: any) => {
        const amount = Number(tx.amount) || 0;
        return acc + (tx.type === "OUT" ? amount : -amount);
      }, 0);

      const recordBalance = (records || []).reduce((acc: number, rec: any) => {
        const amount = Number(rec.totalAmount) || 0;
        return acc + amount;
      }, 0);

      return {
        ...customer,
        balance: transactionBalance + recordBalance,
      };
    }));

    return NextResponse.json(customersWithBalance);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const customer = await Customer.create(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
