"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerForm } from "@/components/forms/customers/CustomerForm";
import { useGetCustomersQuery } from "@/store/customers/customersApi";
import { Loader2, Plus, Search } from "lucide-react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { data: customers = [], isLoading, error } = useGetCustomersQuery();

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">العملاء</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> إضافة عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة عميل جديد للنظام</DialogTitle>
            </DialogHeader>
            <CustomerForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث عن عميل بالاسم أو رقم الهاتف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <div className="text-sm font-medium text-muted-foreground">إجمالي العملاء</div>
            <div className="text-2xl font-bold">{filteredCustomers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg">قائمة العملاء</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                  <TableHead className="text-right font-bold">الاسم</TableHead>
                  <TableHead className="text-right font-bold">رقم الهاتف</TableHead>
                  <TableHead className="text-right font-bold">العنوان</TableHead>
                  <TableHead className="text-right font-bold">الرصيد</TableHead>
                  <TableHead className="text-right font-bold">الحد الائتماني</TableHead>
                  <TableHead className="text-right font-bold">الحالة</TableHead>
                  <TableHead className="text-left font-bold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer._id || customer.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-semibold">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono">{customer.phone || "—"}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{customer.address || "—"}</TableCell>
                      <TableCell
                        className={`font-bold ${
                          customer.balance > 0
                            ? "text-red-600"
                            : customer.balance < 0
                              ? "text-green-600"
                              : "text-slate-500"
                        }`}
                      >
                        {Math.abs(customer.balance).toLocaleString()} ج.م
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {customer.creditLimit ? `${customer.creditLimit.toLocaleString()} ج.م` : "—"}
                      </TableCell>
                      <TableCell>
                        {customer.balance === 0 && (
                          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                            خالص
                          </Badge>
                        )}
                        {customer.balance > 0 && (
                          <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                            عليه مديونية
                          </Badge>
                        )}
                        {customer.balance < 0 && (
                          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 shadow-none">
                            له رصيد
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-left">
                        <Button variant="ghost" size="sm" className="hover:bg-primary hover:text-white transition-all">
                          عرض التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      لا يوجد عملاء مطابقين للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
