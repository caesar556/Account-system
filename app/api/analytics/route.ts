import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CashTransaction } from "@/models/CashTransaction";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const treasuryId = searchParams.get("treasuryId");

    const match: any = {};

    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    if (treasuryId) {
      match.treasuryId = new mongoose.Types.ObjectId(treasuryId);
    }

    const [result] = await CashTransaction.aggregate([
      { $match: match },

      {
        $facet: {
          /* ================= KPIs ================= */
          kpis: [
            {
              $group: {
                _id: null,
                totalIn: {
                  $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] },
                },
                totalOut: {
                  $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] },
                },
                transactions: { $sum: 1 },
              },
            },
            {
              $addFields: {
                net: { $subtract: ["$totalIn", "$totalOut"] },
              },
            },
          ],

          /* ================= By Type ================= */
          byType: [
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],

          /* ================= By Reason ================= */
          byReason: [
            {
              $group: {
                _id: "$referenceType",
                in: {
                  $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] },
                },
                out: {
                  $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] },
                },
                count: { $sum: 1 },
              },
            },
            {
              $addFields: {
                net: { $subtract: ["$in", "$out"] },
              },
            },
            { $sort: { net: -1 } },
          ],

          /* ================= By Method ================= */
          byMethod: [
            {
              $group: {
                _id: "$paymentMethod",
                in: {
                  $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] },
                },
                out: {
                  $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] },
                },
                count: { $sum: 1 },
              },
            },
            {
              $addFields: {
                net: { $subtract: ["$in", "$out"] },
              },
            },
          ],

          /* ================= Trends ================= */
          trends: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
                in: {
                  $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] },
                },
                out: {
                  $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] },
                },
              },
            },
            {
              $addFields: {
                net: { $subtract: ["$in", "$out"] },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    return NextResponse.json({
      kpis: result.kpis[0] ?? {
        totalIn: 0,
        totalOut: 0,
        net: 0,
        transactions: 0,
      },
      charts: {
        byType: result.byType,
        byReason: result.byReason,
        byMethod: result.byMethod,
        trends: result.trends,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
