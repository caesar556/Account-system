import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { CustomerService } from "@/lib/services/customerService";

export async function GET() {
  try {
    await dbConnect();
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();
    
    // Enrich customers with current balance
    const enrichedCustomers = await Promise.all(
      customers.map(async (customer: any) => {
        const balance = await CustomerService.getCurrentBalance(customer._id.toString());
        return {
          ...customer,
          currentBalance: balance,
        };
      })
    );
    
    return NextResponse.json(enrichedCustomers);
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
