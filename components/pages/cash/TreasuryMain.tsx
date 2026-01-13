"use client";

import {
  Wallet,
  History,
  Filter,
  Search,
  MoreVertical,
  ArrowUpRight,
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

export default function TreasuryMain() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 max-w-7xl mx-auto">
      <HeaderSection />

      <Status />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Form Section */}
        <div className="lg:col-span-4">
            <AddTransactionForm />
        </div>

        <div className="lg:col-span-8">
          <Card className="shadow-md ">
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
                    placeholder="بحث..."
                    className="w-full sm:w-[200px] pr-9 h-9"
                  />
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
                      <TableHead className="text-left">التوقيت</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample Entry 1 */}
                    <TableRow className="hover:bg-muted/20 transition-colors cursor-default">
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 gap-1.5 px-2.5 py-0.5"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          إيداع
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        10,000.00
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-medium">
                        دفعة مقدمة - مشروع الفلاح
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Wallet className="h-3.5 w-3.5" />
                          نقدي
                        </div>
                      </TableCell>
                      <TableCell className="text-left text-xs text-muted-foreground font-mono">
                        13 Jan, 10:30 AM
                      </TableCell>
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
              <p className="text-xs text-muted-foreground">
                عرض 2 من أصل 48 عملية
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-8 text-xs"
                >
                  السابق
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  التالي
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
