import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { CustomerService } from "@/lib/services/customerService";

export async function GET() {
  try {
    await dbConnect();
    const customers = await CustomerService.getAllCustomersWithBalances();

    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const customerData = {
      ...body,
      isActive: true,
    };

    const customer = await Customer.create(customerData);
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
