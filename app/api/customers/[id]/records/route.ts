import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CustomerRecord from "@/models/CustomerRecord";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const records = await CustomerRecord.find({ customerId: id })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const record = await CustomerRecord.create({
      ...body,
      customerId: id,
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
