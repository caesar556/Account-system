"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  History, 
  Filter, 
  Download,
  Search,
  MoreVertical,
  Banknote,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function TreasuryMain() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة الخزينة</h1>
          <p className="text-muted-foreground mt-1">مراقبة السيولة النقدية والتدفقات المالية اليومية</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-dashed">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">تصدير التقارير</span>
            <span className="sm:hidden">تصدير</span>
          </Button>
          <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="h-4 w-4" />
            <span>معاملة جديدة</span>
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-r-4 border-r-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <div className="p-2 bg-green-50 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">25,000.00 ر.س</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12.5% منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-r-4 border-r-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المصروفات</CardTitle>
            <div className="p-2 bg-red-50 rounded-full">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">8,500.00 ر.س</div>
            <p className="text-xs text-muted-foreground mt-1">
              -4.2% منذ الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-r-4 border-r-violet-500 bg-violet-50/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-900">الرصيد المتوفر</CardTitle>
            <div className="p-2 bg-violet-100 rounded-full">
              <Wallet className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-700">16,500.00 ر.س</div>
            <p className="text-xs text-violet-600/70 mt-1">
              سيولة نقدية جاهزة
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Form Section */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
             <AddTransactionForm />
             
             {/* Quick Links Card */}
             <Card className="hidden lg:block border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">روابط سريعة</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                   <Button variant="ghost" className="justify-start text-xs h-8">تحميل كشف حساب</Button>
                   <Button variant="ghost" className="justify-start text-xs h-8">إغلاق الصندوق اليومي</Button>
                   <Button variant="ghost" className="justify-start text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50">تبليغ عن خطأ</Button>
                </CardContent>
             </Card>
          </div>
        </div>

        {/* Right Column: Transactions Table */}
        <div className="lg:col-span-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-violet-600" />
                  سجل العمليات
                </CardTitle>
                <CardDescription>عرض أحدث الحركات المالية في النظام</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="بحث..." className="w-full sm:w-[200px] pr-9 h-9" />
                </div>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>تصفية</span>
                </Button>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[120px] text-right">الحالة</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">البيان / الوصف</TableHead>
                      <TableHead className="text-right hidden md:table-cell">الوسيلة</TableHead>
                      <TableHead className="text-left">التوقيت</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample Entry 1 */}
                    <TableRow className="hover:bg-muted/20 transition-colors cursor-default">
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5 px-2.5 py-0.5">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          إيداع
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">10,000.00</TableCell>
                      <TableCell className="max-w-[200px] truncate font-medium">دفعة مقدمة - مشروع الفلاح</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Wallet className="h-3.5 w-3.5" />
                          نقدي
                        </div>
                      </TableCell>
                      <TableCell className="text-left text-xs text-muted-foreground font-mono">13 Jan, 10:30 AM</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Sample Entry 2 */}
                    <TableRow className="hover:bg-muted/20 transition-colors cursor-default">
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 px-2.5 py-0.5">
                          <ArrowDownRight className="h-3.5 w-3.5" />
                          صرف
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-red-600">1,200.00</TableCell>
                      <TableCell className="max-w-[200px] truncate font-medium">فواتير كهرباء وصيانة</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Banknote className="h-3.5 w-3.5" />
                          تحويل بنكي
                        </div>
                      </TableCell>
                      <TableCell className="text-left text-xs text-muted-foreground font-mono">12 Jan, 04:15 PM</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <Separator />
            <div className="p-4 flex items-center justify-between">
               <p className="text-xs text-muted-foreground">عرض 2 من أصل 48 عملية</p>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" disabled className="h-8 text-xs">السابق</Button>
                 <Button variant="outline" size="sm" className="h-8 text-xs">التالي</Button>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
