import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { CustomerService } from "@/lib/services/customerService";

export async function GET() {
  try {
    const customers = await Customer.find().lean();

    const data = await Promise.all(
      customers.map(async (c: any) => {
        const balance = await CustomerService.calculateBalance(
          c._id.toString(),
        );
        return {
          ...c,
          balance: balance.total,
          ledger: balance.ledger,
          unpaidRecords: balance.unpaidRecords,
        };
      }),
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Map status from form (unpaid/paid) if necessary or handle in model
    // The form sends 'status', but the model uses 'isActive' and we calculate balance.
    // Let's ensure the body is compatible.
    const customerData = {
      ...body,
      isActive: true, // New customers are active by default
    };

    const customer = await Customer.create(customerData);
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
