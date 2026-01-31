import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { TransactionService } from "@/lib/services/transactionService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    const result = await TransactionService.payRecord({
      recordId: body.recordId,
      amount: body.amount,
      treasuryId: body.treasuryId,
      paymentMethod: body.paymentMethod,
      description: body.description,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
