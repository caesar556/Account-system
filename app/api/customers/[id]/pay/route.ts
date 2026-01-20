import { NextResponse } from "next/server";
import { TransactionService } from "@/lib/services/transactionService";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {

    const body = await req.json();
    const { recordId, amount, treasuryId, paymentMethod, description } = body;

    if (!recordId || !amount || !treasuryId || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await TransactionService.payRecord({
      recordId,
      amount: Number(amount),
      treasuryId,
      paymentMethod,
      description,
      createdBy: "User",
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
