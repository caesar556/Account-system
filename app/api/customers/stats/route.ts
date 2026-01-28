import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { CashTransaction } from "@/models/CashTransaction";

export async function GET() {
  try {
    await dbConnect();

    /* ===============================
       Customers basic stats
    =============================== */

    const totalCustomers = await Customer.countDocuments({});
    const activeCustomers = await Customer.countDocuments({ isActive: true });
    const inactiveCustomers = await Customer.countDocuments({
      isActive: false,
    });

    const customersByCategory = await Customer.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    /* ===============================
       Transactions stats (global)
       + Opening balance as DEBIT
    =============================== */

    const transactionStats = await CashTransaction.aggregate([
      {
        $match: {
          customerId: { $exists: true, $ne: null },
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $unionWith: {
          coll: "customers",
          pipeline: [
            {
              $project: {
                _id: 0,
                type: "DEBIT",
                amount: { $ifNull: ["$openingBalance", 0] },
              },
            },
            { $match: { amount: { $ne: 0 } } },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          total: { $sum: "$total" },
          count: { $sum: "$count" },
        },
      },
    ]);

    const totalDebit =
      transactionStats.find((t) => t._id === "DEBIT")?.total || 0;
    const totalCredit =
      transactionStats.find((t) => t._id === "CREDIT")?.total || 0;

    const debitCount =
      transactionStats.find((t) => t._id === "DEBIT")?.count || 0;
    const creditCount =
      transactionStats.find((t) => t._id === "CREDIT")?.count || 0;

    /* ===============================
       Customers balances
       (Opening + Transactions + Unpaid Records)
    =============================== */

    const customersWithBalances = await Customer.aggregate([
      // 🔹 Transactions balance
      {
        $lookup: {
          from: "cashtransactions",
          let: { customerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$customerId", "$$customerId"] },
                deletedAt: { $exists: false },
              },
            },
            {
              $group: {
                _id: null,
                txBalance: {
                  $sum: {
                    $cond: [
                      { $eq: ["$type", "DEBIT"] },
                      "$amount",
                      { $multiply: ["$amount", -1] },
                    ],
                  },
                },
              },
            },
          ],
          as: "transactions",
        },
      },

      // 🔹 Unpaid / partial records
      {
        $lookup: {
          from: "customerrecords",
          let: { customerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$customerId", "$$customerId"] },
                status: { $in: ["PARTIAL"] },
              },
            },
            {
              $lookup: {
                from: "cashtransactions",
                let: { recordId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$referenceId", "$$recordId"] },
                      type: "CREDIT",
                      deletedAt: { $exists: false },
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      paid: { $sum: "$amount" },
                    },
                  },
                ],
                as: "payments",
              },
            },
            {
              $addFields: {
                paid: {
                  $ifNull: [{ $arrayElemAt: ["$payments.paid", 0] }, 0],
                },
                remaining: {
                  $subtract: [
                    "$totalAmount",
                    {
                      $ifNull: [{ $arrayElemAt: ["$payments.paid", 0] }, 0],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                remaining: 1,
              },
            },
          ],
          as: "unpaidRecords",
        },
      },

      // 🔹 Final balance per customer
      {
        $addFields: {
          txBalance: {
            $ifNull: [{ $arrayElemAt: ["$transactions.txBalance", 0] }, 0],
          },
          unpaidAmount: {
            $sum: "$unpaidRecords.remaining",
          },
          currentBalance: {
            $add: [
              { $ifNull: ["$openingBalance", 0] },
              {
                $ifNull: [{ $arrayElemAt: ["$transactions.txBalance", 0] }, 0],
              },
              { $sum: "$unpaidRecords.remaining" },
            ],
          },
        },
      },

      // 🔹 Global balances stats
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$currentBalance" },
          positiveBalanceCount: {
            $sum: { $cond: [{ $gt: ["$currentBalance", 0] }, 1, 0] },
          },
          negativeBalanceCount: {
            $sum: { $cond: [{ $lt: ["$currentBalance", 0] }, 1, 0] },
          },
          zeroBalanceCount: {
            $sum: { $cond: [{ $eq: ["$currentBalance", 0] }, 1, 0] },
          },
          totalCreditLimit: {
            $sum: { $ifNull: ["$creditLimit", 0] },
          },
        },
      },
    ]);

    const balanceStats = customersWithBalances[0] || {
      totalBalance: 0,
      positiveBalanceCount: 0,
      negativeBalanceCount: 0,
      zeroBalanceCount: 0,
      totalCreditLimit: 0,
    };

    /* ===============================
       Format category map
    =============================== */

    const categoryMap: Record<string, number> = {};
    customersByCategory.forEach((c) => {
      categoryMap[c._id || "regular"] = c.count;
    });

    /* ===============================
       Response
    =============================== */

    return NextResponse.json({
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        inactive: inactiveCustomers,
        byCategory: categoryMap,
      },
      transactions: {
        totalDebit,
        totalCredit,
        debitCount,
        creditCount,
        netBalance: totalDebit - totalCredit,
      },
      balances: {
        totalBalance: balanceStats.totalBalance,
        positiveBalanceCount: balanceStats.positiveBalanceCount,
        negativeBalanceCount: balanceStats.negativeBalanceCount,
        zeroBalanceCount: balanceStats.zeroBalanceCount,
        totalCreditLimit: balanceStats.totalCreditLimit,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
