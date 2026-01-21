"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useGetTransactionsQuery } from "@/store/transactions/transactionsApi";

export default function Status() {
  const { data: transactions = [] } = useGetTransactionsQuery();

  const totals = transactions.reduce(
    (acc: any, tx: any) => {
      if (tx.type === "DEBIT") acc.in += tx.amount;
      if (tx.type === "CREDIT") acc.out += tx.amount;
      return acc;
    },
    { in: 0, out: 0 },
  );

  const balance = totals.in - totals.out;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-sm border-r-4 border-r-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            إجمالي الإيرادات
          </CardTitle>
          <div className="p-2 bg-green-50 rounded-full">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {totals.in.toLocaleString("ar-EG")} ر.س
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            إجمالي المبالغ الواردة
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-r-4 border-r-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            إجمالي المصروفات
          </CardTitle>
          <div className="p-2 bg-red-50 rounded-full">
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {totals.out.toLocaleString("ar-EG")} ر.س
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            إجمالي المبالغ الصادرة
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-r-4 border-r-violet-500 bg-violet-50/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-violet-900">
            الرصيد المتوفر
          </CardTitle>
          <div className="p-2 bg-violet-100 rounded-full">
            <Wallet className="h-4 w-4 text-violet-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-violet-700">
            {balance.toLocaleString("ar-EG")} ر.س
          </div>
          <p className="text-xs text-violet-600/70 mt-1">سيولة نقدية جاهزة</p>
        </CardContent>
      </Card>
    </div>
  );
}
