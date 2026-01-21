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

export default function CustomerTable() {
  const {
    customers: filteredCustomers,
    search,
    setSearch,
    categoryFilter,
    balanceFilter,
  } = useCustomers();
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle>قائمة العملاء</CardTitle>
            <CardDescription className="mt-1">
              {filteredCustomers.length} عميل
              {search && ` مطابق لـ "${search}"`}
              {categoryFilter !== "all" && ` - فئة: ${categoryFilter}`}
              {balanceFilter !== "all" && ` - حالة مالية: ${balanceFilter}`}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-base px-3 py-1">
            {filteredCustomers.length} عميل
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-right w-[300px]">العميل</TableHead>
                <TableHead className="text-right">معلومات التواصل</TableHead>
                <TableHead className="text-right">الفئة</TableHead>
                <TableHead className="text-right">الحالة المالية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer: any) => {
                  const balance = customer.currentBalance || 0;
                  const initials = customer.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <TableRow key={customer._id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold">{customer.name}</div>
                            {customer.notes && (
                              <div className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                                {customer.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          )}
                          {customer.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">
                                {customer.email}
                              </span>
                            </div>
                          )}
                          {customer.address && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">
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
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400"
                              : customer.category === "wholesale"
                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400"
                                : ""
                          }
                        >
                          {customer.category === "vip" && "VIP"}
                          {customer.category === "wholesale" && "جملة"}
                          {customer.category === "regular" && "عادي"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <span
                            className={`font-bold text-lg ${
                              balance > 0
                                ? "text-red-600"
                                : balance < 0
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {balance.toLocaleString()} ج.م
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {balance > 0 ? (
                              <span className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                مدين
                              </span>
                            ) : balance < 0 ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="h-3 w-3" />
                                دائن
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                خلاص
                              </span>
                            )}
                          </div>
                          {customer.creditLimit > 0 && (
                            <div className="text-xs">
                              الحد الائتماني:{" "}
                              {customer.creditLimit.toLocaleString()} ج.م
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {customer.isActive ? (
                            <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400">
                              <CheckCircle className="h-3 w-3 ml-1" />
                              نشط
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              <XCircle className="h-3 w-3 ml-1" />
                              غير نشط
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/customers/${customer._id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              التفاصيل
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
                              <DropdownMenuItem>
                                <Link
                                  href={`/customers/${customer._id}/transactions`}
                                  className="w-full"
                                >
                                  المعاملات
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  href={`/customers/${customer._id}/edit`}
                                  className="w-full"
                                >
                                  تعديل البيانات
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
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
