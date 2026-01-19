"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Loader2, Plus, Search, FileText } from "lucide-react";

export default function CustomersMain() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: customers = [], isLoading, error } = useGetCustomersQuery();

  const filteredCustomers = customers.filter((c: any) =>
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
        خطأ في تحميل العملاء
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">العملاء</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة عميل
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة عميل جديد</DialogTitle>
            </DialogHeader>
            <CustomerForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث باسم العميل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة العملاء</CardTitle>
            <Badge variant="outline">{filteredCustomers.length} عميل</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">الهاتف</TableHead>
                <TableHead className="text-right">الحالة المالية</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer: any) => {
                  const balance = customer.balance || 0;

                  return (
                    <TableRow key={customer._id}>
                      <TableCell className="font-bold">
                        {customer.name}
                      </TableCell>

                      <TableCell>{customer.phone || "—"}</TableCell>

                      <TableCell>
                        <span
                          className={`font-black ${
                            balance > 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {balance > 0
                            ? `عليه ${balance.toLocaleString()} ج.م`
                            : "خلاص"}
                        </span>
                      </TableCell>

                      <TableCell className="text-left">
                        <Link href={`/customers/${customer._id}`}>
                          <Button size="sm" variant="outline" className="gap-1">
                            <FileText className="h-4 w-4" />
                            التفاصيل
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-20 text-muted-foreground"
                  >
                    لا يوجد عملاء
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
