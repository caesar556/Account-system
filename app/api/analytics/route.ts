import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CashTransaction } from "@/models/CashTransaction";

export async function GET() {
  try {
    await dbConnect();

    const summary = await CashTransaction.aggregate([
      {
        $facet: {
          byType: [
            { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } }
          ],
          byReason: [
            { $group: { _id: "$reason", total: { $sum: "$amount" }, count: { $sum: 1 } } },
            { $sort: { total: -1 } }
          ],
          byMethod: [
            { $group: { _id: "$method", total: { $sum: "$amount" }, count: { $sum: 1 } } }
          ],
          trends: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                in: {
                  $sum: { $cond: [{ $eq: ["$type", "IN"] }, "$amount", 0] }
                },
                out: {
                  $sum: { $cond: [{ $eq: ["$type", "OUT"] }, "$amount", 0] }
                }
              }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
          ]
        }
      }
    ]);

    return NextResponse.json(summary[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
