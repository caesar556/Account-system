export interface FinancialAdviceInput {
  treasury: {
    id: string;
    balance: number;
    minLimit: number;
  };

  cashFlow: {
    totalRevenue: number;
    totalExpenses: number;
    netCash: number;
    trend: "UP" | "DOWN" | "STABLE";
  };

  riskIndicators: {
    liquidityRatio: number;
    negativeCashFlow: boolean;
    treasuryBelowLimit: boolean;
  };

  meta: {
    period: string; 
    currency: string;
  };
}