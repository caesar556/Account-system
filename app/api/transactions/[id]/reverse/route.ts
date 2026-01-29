import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { TransactionService } from "@/lib/services/transactionService";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await req.json();
    const { reason } = body;

    if (!reason || typeof reason !== "string") {
      return NextResponse.json(
        { message: "Reversal reason is required" },
        { status: 400 },
      );
    }

    const reversalTransaction = await TransactionService.reverseTransaction({
      transactionId: id,
      reason,
    });

    return NextResponse.json(
      {
        message: "Transaction reversed successfully",
        data: reversalTransaction,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error.message || "Internal server error",
      },
      { status: 400 },
    );
  }
}
