"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddTransactionForm from "@/components/forms/TransactionForm";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Banknote, 
  Calendar, 
  ChevronRight, 
  Download, 
  Filter, 
  History, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Wallet 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TreasuryPage() {
  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة الخزينة</h1>
          <p className="text-muted-foreground">متابعة وإدارة الحركات النقدية والتدفقات المالية</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-700">
            <Plus className="h-4 w-4" />
            معاملة جديدة
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المقبوضات</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">25,000.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدفوعات</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">8,500.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              -5% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-violet-500 shadow-md bg-violet-50/50 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرصيد الحالي</CardTitle>
            <Wallet className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-700">16,500.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              رصيد الخزينة المتوفر
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        
        {/* Left Side: Add Form */}
        <div className="lg:col-span-4 lg:sticky lg:top-8">
          <AddTransactionForm />
        </div>

        {/* Right Side: Transactions List */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  أحدث المعاملات
                </CardTitle>
                <CardDescription>آخر 10 حركات تمت على الخزينة</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Filter className="h-3.5 w-3.5" />
                تصفية
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <div className="rounded-md border-t">
                <Table dir="rtl">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[100px] text-right font-bold">النوع</TableHead>
                      <TableHead className="text-right font-bold">المبلغ</TableHead>
                      <TableHead className="text-right font-bold hidden md:table-cell">الوصف</TableHead>
                      <TableHead className="text-right font-bold">طريقة الدفع</TableHead>
                      <TableHead className="text-left font-bold">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 gap-1 hover:bg-green-100">
                          <Plus className="h-3 w-3" />
                          داخل
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">10,000.00</TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">دفعة مقدمة من عميل</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                          كاش
                        </div>
                      </TableCell>
                      <TableCell className="text-left text-xs text-muted-foreground font-mono">2026-01-13</TableCell>
                    </TableRow>

                    <TableRow className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 gap-1 hover:bg-red-100">
                          <TrendingDown className="h-3 w-3" />
                          خارج
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-red-600">1,500.00</TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">مصاريف نقل وتوريد</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                          تحويل
                        </div>
                      </TableCell>
                      <TableCell className="text-left text-xs text-muted-foreground font-mono">2026-01-13</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t text-center">
                <Button variant="link" size="sm" className="text-violet-600 gap-1">
                  عرض كافة المعاملات
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
