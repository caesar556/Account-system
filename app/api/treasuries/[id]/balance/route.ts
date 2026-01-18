import { NextResponse } from "next/server";
import { CashTransaction } from "@/models/CashTransaction";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const treasuryId = params.id;

  const result = await CashTransaction.aggregate([
    { $match: { treasuryId: new mongoose.Types.ObjectId(treasuryId) } },
    {
      $group: {
        _id: null,
        balance: {
          $sum: {
            $cond: [
              { $eq: ["$type", "IN"] },
              "$amount",
              { $multiply: ["$amount", -1] },
            ],
          },
        },
      },
    },
  ]);

  return NextResponse.json({
    treasuryId,
    balance: result[0]?.balance || 0,
  });
}
