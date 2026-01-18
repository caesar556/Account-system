"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetCustomerStatementQuery } from "@/store/customers/customersApi";
import { Loader2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface CustomerStatementProps {
  customerId: string;
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerStatement({
  customerId,
  customerName,
  open,
  onOpenChange,
}: CustomerStatementProps) {
  const { data, isLoading } = useGetCustomerStatementQuery(customerId, {
    skip: !open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold">
            كشف حساب: {customerName}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">الرصيد الحالي</p>
                <p className={`text-2xl font-black ${(data?.currentBalance || 0) > 0 ? "text-red-600" : (data?.currentBalance || 0) < 0 ? "text-green-600" : "text-slate-500"}`}>
                  {Math.abs(data?.currentBalance || 0).toLocaleString()} ج.م
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">عدد العمليات</p>
                <p className="text-2xl font-black text-primary">
                  {data?.statement?.length || 0}
                </p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-right font-bold">التاريخ</TableHead>
                    <TableHead className="text-right font-bold">البيان</TableHead>
                    <TableHead className="text-right font-bold">الحركة</TableHead>
                    <TableHead className="text-right font-bold">المبلغ</TableHead>
                    <TableHead className="text-right font-bold">الرصيد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.statement?.map((tx: any, idx: number) => (
                    <TableRow key={tx._id || idx}>
                      <TableCell className="text-xs">
                        {tx.eventDate ? format(new Date(tx.eventDate), "yyyy/MM/dd HH:mm", { locale: ar }) : "—"}
                      </TableCell>
                      <TableCell className="font-medium">{tx.description || tx.title || "—"}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 text-xs font-bold ${tx.change > 0 ? "text-red-600" : tx.change < 0 ? "text-green-600" : "text-slate-500"}`}>
                          {tx.eventType === "RECORD" ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">سجل</Badge>
                          ) : tx.change < 0 ? (
                            <><ArrowUpCircle className="h-3 w-3" /> وارد</>
                          ) : (
                            <><ArrowDownCircle className="h-3 w-3" /> صادر</>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {Math.abs(tx.change || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className={`font-black ${tx.balanceAfter > 0 ? "text-red-600" : tx.balanceAfter < 0 ? "text-green-600" : "text-slate-500"}`}>
                        {Math.abs(tx.balanceAfter || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!data?.statement || data.statement.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        لا توجد معاملات مسجلة لهذا العميل
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
