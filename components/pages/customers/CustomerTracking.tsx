"use client";

import { useGetCustomerStatementQuery } from "@/store/customers/customersApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface CustomerTrackingProps {
  customerId: string;
}

export default function CustomerTracking({
  customerId,
}: CustomerTrackingProps) {
  const { data, isLoading, isError } = useGetCustomerStatementQuery(customerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        حدث خطأ أثناء تحميل كشف الحساب
      </div>
    );
  }

  const balance = data.currentBalance || 0;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-black">
            كشف حساب العميل: {data.customer.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">الرصيد الحالي</p>
            <p
              className={`text-2xl font-black ${
                balance > 0
                  ? "text-red-600"
                  : balance < 0
                    ? "text-green-600"
                    : "text-slate-500"
              }`}
            >
              {balance > 0
                ? `عليه ${balance.toLocaleString()} ج.م`
                : balance === 0
                  ? "مالوش فلوس"
                  : `ليه ${Math.abs(balance).toLocaleString()} ج.م`}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">عدد العمليات</p>
            <p className="text-2xl font-black text-primary">
              {data.statement.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statement Table */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل العمليات</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right font-bold">التاريخ</TableHead>
                <TableHead className="text-right font-bold">البيان</TableHead>
                <TableHead className="text-right font-bold">الحركة</TableHead>
                <TableHead className="text-right font-bold">المبلغ</TableHead>
                <TableHead className="text-right font-bold">
                  الرصيد بعد العملية
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.statement.map((tx: any, idx: number) => (
                <TableRow key={tx._id || idx}>
                  <TableCell className="text-xs">
                    {tx.eventDate
                      ? format(new Date(tx.eventDate), "yyyy/MM/dd HH:mm", {
                          locale: ar,
                        })
                      : "—"}
                  </TableCell>

                  <TableCell className="font-medium">
                    {tx.description || tx.title || "—"}
                  </TableCell>

                  <TableCell>
                    <div
                      className={`flex items-center gap-1 text-xs font-bold ${
                        tx.change > 0
                          ? "text-red-600"
                          : tx.change < 0
                            ? "text-green-600"
                            : "text-slate-500"
                      }`}
                    >
                      {tx.eventType === "RECORD" ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          سجل
                        </Badge>
                      ) : tx.change < 0 ? (
                        <>
                          <ArrowUpCircle className="h-3 w-3" /> وارد
                        </>
                      ) : (
                        <>
                          <ArrowDownCircle className="h-3 w-3" /> صادر
                        </>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-bold">
                    {Math.abs(tx.change || 0).toLocaleString()} ج.م
                  </TableCell>

                  <TableCell
                    className={`font-black ${
                      tx.balanceAfter > 0
                        ? "text-red-600"
                        : tx.balanceAfter < 0
                          ? "text-green-600"
                          : "text-slate-500"
                    }`}
                  >
                    {tx.balanceAfter > 0
                      ? `عليه ${tx.balanceAfter.toLocaleString()}`
                      : tx.balanceAfter === 0
                        ? "مالوش فلوس"
                        : `ليه ${Math.abs(tx.balanceAfter).toLocaleString()}`}
                  </TableCell>
                </TableRow>
              ))}

              {data.statement.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    لا توجد معاملات مسجلة لهذا العميل
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
