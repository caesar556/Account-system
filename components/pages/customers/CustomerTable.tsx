"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCustomers } from "@/hooks/data/useCustomers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerTable() {
  const {
    customers: filteredCustomers,
    isLoading,
    search,
    setSearch,
    categoryFilter,
    balanceFilter,
  } = useCustomers();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const customerList = Array.isArray(filteredCustomers)
    ? filteredCustomers
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle>قائمة العملاء</CardTitle>
            <CardDescription className="mt-1">
              {customerList.length} عميل
              {search && ` مطابق لـ "${search}"`}
              {categoryFilter !== "all" && ` - فئة: ${categoryFilter}`}
              {balanceFilter !== "all" && ` - حالة مالية: ${balanceFilter}`}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-base px-3 py-1">
            {customerList.length} عميل
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right w-[250px]">العميل</TableHead>
                <TableHead className="text-right">التواصل</TableHead>
                <TableHead className="text-right">الفئة</TableHead>
                <TableHead className="text-right">الحالة المالية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {customerList.length > 0 ? (
                customerList.map((customer: any) => {
                  const balance = customer.openingBalance || 0;
                  const initials = customer.name
                    ? customer.name
                        .split(" ")
                        .filter((n: string) => n)
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "??";

                  return (
                    <TableRow
                      key={customer._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-primary/10">
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="font-bold text-base">
                              {customer.name}
                            </div>
                            {customer.notes && (
                              <div className="text-xs text-muted-foreground line-clamp-1 max-w-[180px]">
                                {customer.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          )}
                          {customer.address && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[120px]">
                                {customer.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            customer.category === "vip"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : customer.category === "wholesale"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                          }
                        >
                          {customer.category === "vip" && "VIP"}
                          {customer.category === "wholesale" && "جملة"}
                          {customer.category === "regular" && "عادي"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div
                            className={`font-bold text-base ${
                              balance > 0
                                ? "text-red-600"
                                : balance < 0
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {Math.abs(balance).toLocaleString()} ج.م
                          </div>
                          <div className="flex items-center gap-1.5">
                            {balance > 0 ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-5 bg-red-50 text-red-700 border-red-100 px-1 font-bold"
                              >
                                عليه
                              </Badge>
                            ) : balance < 0 ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-5 bg-green-50 text-green-700 border-green-100 px-1 font-bold"
                              >
                                له
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-5 bg-slate-50 text-slate-500 border-slate-100 px-1"
                              >
                                متوازن
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {customer.isActive ? (
                          <div className="flex items-center gap-1.5 text-green-600">
                            <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                            <span className="text-xs font-bold">نشط</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                            <span className="text-xs font-bold">معطل</span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 justify-end px-2">
                          <Link href={`/customers/${customer._id}/statement`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-primary hover:text-primary hover:bg-primary/5 font-bold"
                            >
                              <FileText className="ml-1.5 h-4 w-4" />
                              كشف الحساب
                            </Button>
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuLabel>
                                خيارات العميل
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/customers/${customer._id}/records`}
                                  className="w-full text-right"
                                >
                                  سجل الإلتزامات
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/customers/${customer._id}/edit`}
                                  className="w-full text-right"
                                >
                                  تعديل البيانات
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 text-right">
                                تعطيل الحساب
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">لا توجد نتائج</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {search
                            ? "لم يتم العثور على عملاء مطابقين للبحث"
                            : "لم يتم إضافة عملاء بعد"}
                        </p>
                      </div>
                      {search && (
                        <Button
                          variant="outline"
                          onClick={() => setSearch("")}
                          className="mt-2"
                        >
                          عرض جميع العملاء
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
