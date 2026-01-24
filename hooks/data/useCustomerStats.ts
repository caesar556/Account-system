"use client";
import { useGetCustomerStatsQuery } from "@/store/customers/customersApi";

export function useCustomerStats() {
  const { data: stats, isLoading, error, refetch } = useGetCustomerStatsQuery();

  return {
    stats: stats || {
      customers: {
        total: 0,
        active: 0,
        inactive: 0,
        byCategory: {},
      },
      transactions: {
        totalDebit: 0,
        totalCredit: 0,
        debitCount: 0,
        creditCount: 0,
        netBalance: 0,
      },
      balances: {
        totalBalance: 0,
        positiveBalanceCount: 0,
        negativeBalanceCount: 0,
        zeroBalanceCount: 0,
        totalCreditLimit: 0,
      },
    },
    isLoading,
    error,
    refetch,
  };
}
