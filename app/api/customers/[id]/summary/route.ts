import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CustomerService } from "@/lib/services/customerService";

export async function GET(
  request: NextRequest,
    { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const customerSummary = await CustomerService.getCustomerSummary(id);
    return NextResponse.json(customerSummary);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
