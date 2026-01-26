import { FinancialAdviceInput } from "@/lib/types/financialTypes";
import { CashTransaction } from "@/models/CashTransaction";
import { Treasury } from "@/models/Treasury";

export class FinancialInsightsService {
  static async buildAdviceInput(
    treasuryId: string,
  ): Promise<FinancialAdviceInput> {
    const treasury = await Treasury.findById(treasuryId);
    if (!treasury) throw new Error("Treasury not found");

    const [revenueAgg, expenseAgg] = await Promise.all([
      CashTransaction.aggregate([
        { $match: { treasuryId: treasury._id, type: "CREDIT" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      CashTransaction.aggregate([
        { $match: { treasuryId: treasury._id, type: "DEBIT" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const netCash = totalRevenue - totalExpenses;

    return {
      treasury: {
        id: treasury._id.toString(),
        balance: treasury.balance,
        minLimit: treasury.minLimit,
      },
      cashFlow: {
        totalRevenue,
        totalExpenses,
        netCash,
        trend: netCash > 0 ? "UP" : netCash < 0 ? "DOWN" : "STABLE",
      },
      riskIndicators: {
        liquidityRatio:
          treasury.balance === 0 ? 0 : totalExpenses / treasury.balance,
        negativeCashFlow: netCash < 0,
        treasuryBelowLimit: treasury.balance < treasury.minLimit,
      },
      meta: {
        period: "Current Period",
        currency: "EGP",
      },
    };
  }
}
