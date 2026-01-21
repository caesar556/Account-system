export interface AnalyticsResponse {
  kpis: {
    totalIn: number;
    totalOut: number;
    net: number;
    transactions: number;
    treasuryBalance: number;
  };
  charts: {
    byType: { _id: "DEBIT" | "CREDIT"; total: number; count: number }[];
    byReason: {
      _id: string;
      in: number;
      out: number;
      net: number;
      count: number;
    }[];
    byMethod: {
      _id: string;
      in: number;
      out: number;
      net: number;
      count: number;
    }[];
    trends: { _id: string; in: number; out: number; net: number }[];
  };
}
