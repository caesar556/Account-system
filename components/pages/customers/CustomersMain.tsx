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
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        <Card className="lg:col-span-3 shadow-sm border-muted/50">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="البحث عن عميل بالاسم أو رقم الهاتف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 h-11 border-muted-foreground/20 focus:ring-primary/20"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-muted/50 bg-primary/5">
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <div className="text-sm font-semibold text-primary/80 uppercase tracking-wider">إجمالي العملاء</div>
            <div className="text-3xl font-black text-primary mt-1">{filteredCustomers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden border-muted/40 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-muted/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground/80">قائمة العملاء</CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              {filteredCustomers.length} سجل
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 divide-x divide-x-reverse divide-muted/20">
                  <TableHead className="text-right font-bold py-4 px-6">العميل</TableHead>
                  <TableHead className="text-right font-bold py-4 px-6">التواصل</TableHead>
                  <TableHead className="text-right font-bold py-4 px-6">الحالة المالية</TableHead>
                  <TableHead className="text-right font-bold py-4 px-6">التصنيف</TableHead>
                  <TableHead className="text-left font-bold py-4 px-6">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer._id || customer.id} className="hover:bg-muted/5 transition-colors border-b last:border-0 divide-x divide-x-reverse divide-muted/10">
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-base text-foreground">{customer.name}</span>
                          <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Search className="h-3 w-3" /> {customer.address || "بدون عنوان"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-mono font-medium text-foreground/80">{customer.phone || "—"}</span>
                          {customer.email && <span className="text-xs text-muted-foreground lowercase">{customer.email}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`font-black text-base ${
                              customer.balance > 0
                                ? "text-red-600"
                                : customer.balance < 0
                                  ? "text-green-600"
                                  : "text-slate-500"
                            }`}
                          >
                            {Math.abs(customer.balance).toLocaleString()} ج.م
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                            الحد: {customer.creditLimit ? `${customer.creditLimit.toLocaleString()} ج.م` : "غير محدد"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-1">
                            {customer.balance === 0 && (
                              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold px-2 py-0">
                                خالص
                              </Badge>
                            )}
                            {customer.balance > 0 && (
                              <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 font-bold px-2 py-0 shadow-none">
                                مدين
                              </Badge>
                            )}
                            {customer.balance < 0 && (
                              <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-bold px-2 py-0 shadow-none">
                                دائن
                              </Badge>
                            )}
                          </div>
                          {customer.category && (
                            <span className="text-[10px] font-bold text-muted-foreground/70 uppercase">
                              {customer.category === 'vip' ? 'VIP' : customer.category === 'wholesale' ? 'جملة' : 'عادي'}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-left">
                        <Button variant="outline" size="sm" className="h-8 px-3 font-semibold hover:bg-primary hover:text-primary-foreground border-primary/20 transition-all">
                          التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Search className="h-10 w-10 opacity-20" />
                        <p className="text-lg font-medium">لا يوجد عملاء مطابقين للبحث</p>
                      </div>
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
