"use client";

import { useGetStatementQuery } from "@/store/apiSlice";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Printer,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Phone,
  Wallet,
  Calendar,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CustomerStatementProps {
  customerId: string;
}

export default function CustomerStatement({
  customerId,
}: CustomerStatementProps) {
  const { data, isLoading, error } = useGetStatementQuery(customerId);
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-6 dir-rtl" dir="rtl">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive dir-rtl" dir="rtl">
        <CardHeader>
          <CardTitle className="text-destructive font-bold">
            خطأ في تحميل كشف الحساب
          </CardTitle>
          <CardDescription>
            تعذر استرداد سجل العميل في الوقت الحالي. يرجى المحاولة مرة أخرى
            لاحقاً.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { customer, statement, currentBalance } = data;

  const filteredStatement = statement.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.description &&
        entry.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 dir-rtl font-arabic pb-10 p-4 " dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary mb-2">
            كشف حساب عميل
          </h1>
          <p className="text-muted-foreground text-lg">
            سجل مفصل لجميع المعاملات المالية والفواتير الخاصة بالعميل.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrint}
            className="rounded-xl border-2 hover:bg-secondary"
          >
            <Printer className="ml-2 h-5 w-5" />
            طباعة الكشف
          </Button>
          <Button
            variant="default"
            size="lg"
            className="rounded-xl shadow-lg shadow-primary/20"
          >
            <Download className="ml-2 h-5 w-5" />
            تصدير PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-r-4 border-r-primary overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">
              بيانات العميل
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black mb-1">{customer.name}</div>
            <div className="flex items-center text-sm text-muted-foreground font-medium">
              <Phone className="ml-2 h-4 w-4" />
              {customer.phone}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-r-4 ${currentBalance > 0 ? "border-r-destructive" : "border-r-emerald-500"} overflow-hidden transition-all hover:shadow-md`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">
              الرصيد الحالي
            </CardTitle>
            <div
              className={`p-2 ${currentBalance > 0 ? "bg-destructive/10" : "bg-emerald-500/10"} rounded-full`}
            >
              <Wallet
                className={`h-4 w-4 ${currentBalance > 0 ? "text-destructive" : "text-emerald-500"}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-black ${currentBalance > 0 ? "text-destructive" : "text-emerald-600"}`}
            >
              {Math.abs(currentBalance).toLocaleString()}{" "}
              <span className="text-sm font-bold text-muted-foreground">
                د.ع
              </span>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-2 flex items-center">
              <span
                className={`h-2 w-2 rounded-full ml-1.5 ${currentBalance > 0 ? "bg-destructive" : "bg-emerald-500"}`}
              ></span>
              {currentBalance > 0
                ? "عليه"
                : currentBalance < 0
                  ? "له"
                  : "الرصيد مصفر"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-blue-500 overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">
              إجمالي العمليات
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{statement.length}</div>
            <p className="text-xs font-bold text-muted-foreground mt-2">
              إجمالي الحركات في السجل
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card className="rounded-2xl border-2 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">
                سجل الحركات المالية
              </CardTitle>
              <CardDescription className="font-medium">
                عرض تفصيلي لجميع الفواتير والمدفوعات مرتبة زمنياً.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72 print:hidden">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث في الحركات..."
                className="pr-10 rounded-xl bg-background border-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px] font-bold text-primary text-right">
                    التاريخ
                  </TableHead>
                  <TableHead className="font-bold text-primary text-right">
                    التفاصيل والوصف
                  </TableHead>
                  <TableHead className="font-bold text-primary text-right">
                    نوع العملية
                  </TableHead>
                  <TableHead className="text-left font-bold text-primary">
                    عليه
                  </TableHead>
                  <TableHead className="text-left font-bold text-primary">
                    له
                  </TableHead>
                  <TableHead className="text-left font-bold text-primary text-lg">
                    الرصيد
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStatement.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Search className="h-10 w-10 opacity-20" />
                        <p className="text-lg font-bold">
                          لا توجد عمليات مطابقة للبحث
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStatement.map((entry: any, idx: number) => (
                    <TableRow
                      key={entry.id}
                      className={`${idx % 2 === 0 ? "bg-transparent" : "bg-muted/10"} hover:bg-muted/20 transition-colors`}
                    >
                      <TableCell className="font-bold text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-primary/40" />
                          {format(new Date(entry.date), "yyyy/MM/dd", {
                            locale: ar,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-foreground">
                            {entry.title}
                          </span>
                          {entry.description && (
                            <span className="text-sm text-muted-foreground font-medium">
                              {entry.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`rounded-lg px-2 py-0.5 border-2 ${
                            entry.type === "INVOICE"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {entry.type === "INVOICE" ? (
                            <>
                              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />{" "}
                              فاتورة
                            </>
                          ) : (
                            <>
                              <ArrowDownLeft className="ml-1 h-3.5 w-3.5" />{" "}
                              دفعة مالية
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left font-bold text-destructive">
                        {entry.debit > 0 ? entry.debit.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="text-left font-bold text-emerald-600">
                        {entry.credit > 0 ? entry.credit.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell
                        className={`text-left font-black text-lg ${entry.balance > 0 ? "text-destructive" : "text-emerald-600"}`}
                      >
                        {Math.abs(entry.balance).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Print Footer */}
      <div className="hidden print:flex flex-col items-center mt-12 gap-4 border-t-2 pt-8">
        <div className="text-center">
          <p className="text-xl font-black text-primary">
            نظام المحاسبة المتكامل
          </p>
          <p className="text-sm font-bold text-muted-foreground mt-1">
            تم استخراج هذا الكشف بتاريخ:{" "}
            {format(new Date(), "PPPP", { locale: ar })}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-20 mt-10 w-full px-20">
          <div className="text-center border-t-2 border-dashed pt-4">
            <p className="font-black">توقيع المحاسب</p>
          </div>
          <div className="text-center border-t-2 border-dashed pt-4">
            <p className="font-black">ختم الشركة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
