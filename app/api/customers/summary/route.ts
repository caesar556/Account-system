import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { CustomerService } from "@/lib/services/customerService";

export async function GET() {
  try {
    await dbConnect();
    const customers = await Customer.find().lean();

    let totalBalance = 0;
    const totalCustomers = customers.length;

    await Promise.all(
      customers.map(async (c: any) => {
        const balance = await CustomerService.calculateBalance(c._id.toString());
        totalBalance += balance.total;
      })
    );

    return NextResponse.json({
      totalCustomers,
      totalBalance,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
