"use client";

import {
  Wallet,
  History,
  Filter,
  Search,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Separator } from "@/components/ui/separator";

import AddTransactionForm from "@/components/forms/TransactionForm";
import HeaderSection from "./HeaderSection";
import Status from "./Status";
import { formatDate } from "@/lib/utils";
import { useTransactions } from "@/hooks/data/useTransactions";

export default function TreasuryMain() {
  const {
    transactions,
    isLoading,
    isError,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDelete,
    totalItems,
  } = useTransactions();

  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        جاري تحميل البيانات...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">
        حدث خطأ أثناء تحميل العمليات
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 max-w-7xl mx-auto">
      <HeaderSection />
      <Status />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <AddTransactionForm />
        </div>

        <div className="lg:col-span-8">
          <Card className="shadow-md">
            <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-violet-600" />
                  سجل العمليات
                </CardTitle>
                <CardDescription>
                  عرض أحدث الحركات المالية في النظام
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث في العمليات..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full sm:w-[200px] pr-9 h-9"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  تصفية
                </Button>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[120px] text-right">
                        الحالة
                      </TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">
                        البيان / الوصف
                      </TableHead>
                      <TableHead className="text-right hidden md:table-cell">
                        الوسيلة
                      </TableHead>
                      <TableHead className="text-right">السبب</TableHead>
                      <TableHead className="text-left">التوقيت</TableHead>
                      <TableHead className="w-[50px]" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {transactions.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground h-24"
                        >
                          {searchTerm
                            ? "لا توجد نتائج تطابق بحثك"
                            : "لا توجد عمليات مسجلة"}
                        </TableCell>
                      </TableRow>
                    )}

                    {transactions.map((tx: any) => (
                      <TableRow
                        key={tx._id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        {/* Status */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              tx.type === "IN"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                            {tx.type === "IN" ? "إيداع" : "سحب"}
                          </Badge>
                        </TableCell>

                        {/* Amount */}
                        <TableCell
                          className={`font-bold ${
                            tx.type === "IN" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {tx.amount.toLocaleString("ar-EG")}
                        </TableCell>

                        {/* Description */}
                        <TableCell className="max-w-[200px] truncate font-medium">
                          {tx.description}
                        </TableCell>

                        {/* Method */}
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Wallet className="h-3.5 w-3.5" />
                            {tx.method === "CASH"
                              ? "نقدي"
                              : tx.method === "TRANSFER"
                                ? "تحويل"
                                : "شيك"}
                          </div>
                        </TableCell>

                        <TableCell> {tx.reason} </TableCell>

                        {/* Date */}
                        <TableCell className="text-left text-xs text-muted-foreground font-mono">
                          {formatDate(tx.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(tx._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>

            <Separator />

            <div className="p-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                عرض {transactions.length} من أصل {totalItems} عملية
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 text-xs gap-1"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 text-xs gap-1"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
