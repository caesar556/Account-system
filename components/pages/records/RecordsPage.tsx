"use client";

import {
  useGetCustomerRecordsQuery,
  usePayRecordMutation,
  useGetCustomerSummaryQuery,
} from "@/store/customers/customersApi";
import { useGetTreasuriesQuery } from "@/store/treasuries/treasuriesApi";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  DollarSign,
  Plus,
} from "lucide-react";
import { AddRecordForm } from "@/components/forms/customers/AddRecordForm";

export default function RecordsPage() {
  const { id } = useParams();
  const customerId = id as string;
  const {
    data: records,
    isLoading,
    isError,
    refetch,
  } = useGetCustomerRecordsQuery(customerId);
  const { data: summary } = useGetCustomerSummaryQuery(customerId);
  const { data: treasuries } = useGetTreasuriesQuery();
  const [payRecord] = usePayRecordMutation();

  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("");
  const [treasuryId, setTreasuryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const handlePay = async () => {
    if (!selectedRecord || !payAmount || !treasuryId) return;
    try {
      await payRecord({
        customerId,
        recordId: selectedRecord._id,
        amount: parseFloat(payAmount),
        treasuryId,
        paymentMethod,
      }).unwrap();
      setIsPayDialogOpen(false);
      setPayAmount("");
      setSelectedRecord(null);
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4" dir="rtl">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500" dir="rtl">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <p className="text-xl font-semibold">خطأ في تحميل سجلات العميل.</p>
        <p>يرجى المحاولة مرة أخرى لاحقاً.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-3 h-3 ml-1" /> مدفوع
          </Badge>
        );
      case "PARTIAL":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 ml-1" /> جزئي
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200 bg-orange-50"
          >
            <Clock className="w-3 h-3 ml-1" /> مفتوح
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {summary?.customer?.name || "سجلات العميل"}
          </h1>
          <p className="text-muted-foreground mt-1">
            إدارة وتتبع سجلات الدفع والفواتير الخاصة بالعميل.
          </p>
        </div>
        <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة سجل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة سجل مالي جديد</DialogTitle>
              <CardDescription>
                أدخل تفاصيل الفاتورة أو السجل المالي الجديد للعميل.
              </CardDescription>
            </DialogHeader>
            <AddRecordForm
              customerId={customerId}
              onSuccess={() => {
                setIsAddRecordOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-r-4 border-r-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>إجمالي الرصيد</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <DollarSign className="w-5 h-5 ml-1 text-blue-500" />
              {summary?.balance?.current?.toLocaleString() || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-r-4 border-r-orange-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>السجلات غير المدفوعة</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Receipt className="w-5 h-5 ml-1 text-orange-500" />
              {summary?.records?.totalUnpaid?.toLocaleString() || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-r-4 border-r-purple-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>حد الائتمان</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Badge
                variant="outline"
                className="text-purple-600 border-purple-200"
              >
                {summary?.balance?.creditLimit?.toLocaleString() || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-md border-none ring-1 ring-gray-200">
        <CardHeader className="bg-gray-50/50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>تاريخ السجلات</CardTitle>
              <CardDescription>
                جميع الفواتير وحالة الدفع الحالية
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold px-6 text-right">
                  التاريخ
                </TableHead>
                <TableHead className="font-semibold text-right">
                  العنوان
                </TableHead>
                <TableHead className="font-semibold text-left">
                  الإجمالي
                </TableHead>
                <TableHead className="font-semibold text-left">
                  المدفوع
                </TableHead>
                <TableHead className="font-semibold text-left">
                  المتبقي
                </TableHead>
                <TableHead className="font-semibold text-center">
                  الحالة
                </TableHead>
                <TableHead className="font-semibold text-left px-6">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Receipt className="h-12 w-12 mb-2 opacity-20" />
                      <p>لا توجد سجلات لهذا العميل.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                records?.map((record: any) => {
                  const remaining =
                    record.totalAmount - (record.paidAmount || 0);
                  return (
                    <TableRow
                      key={record._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="px-6 font-medium">
                        {format(new Date(record.createdAt), "dd MMM yyyy", {
                          locale: ar,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.title}</div>
                        {record.description && (
                          <div className="text-xs text-muted-foreground">
                            {record.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-left font-semibold">
                        {record.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-left text-green-600">
                        {(record.paidAmount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-left text-orange-600 font-bold">
                        {remaining.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell className="text-left px-6">
                        {record.status !== "PAID" && (
                          <Dialog
                            open={
                              isPayDialogOpen &&
                              selectedRecord?._id === record._id
                            }
                            onOpenChange={(open) => {
                              setIsPayDialogOpen(open);
                              if (!open) setSelectedRecord(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setPayAmount(remaining.toString());
                                }}
                              >
                                دفع
                              </Button>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-[425px]"
                              dir="rtl"
                            >
                              <DialogHeader>
                                <DialogTitle>معالجة الدفع</DialogTitle>
                                <CardDescription>
                                  دفع للسجل: {record.title}
                                </CardDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="amount">
                                    المبلغ المراد دفعه (الحد الأقصى: {remaining}
                                    )
                                  </Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    value={payAmount}
                                    onChange={(e) =>
                                      setPayAmount(e.target.value)
                                    }
                                    max={remaining}
                                    className="col-span-3 text-left"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="treasury">من الخزينة</Label>
                                  <Select
                                    onValueChange={setTreasuryId}
                                    value={treasuryId}
                                  >
                                    <SelectTrigger id="treasury">
                                      <SelectValue placeholder="اختر الخزينة" />
                                    </SelectTrigger>
                                    <SelectContent dir="rtl">
                                      {treasuries?.map((t: any) => (
                                        <SelectItem key={t._id} value={t._id}>
                                          {t.name} (الرصيد: {t.currentBalance})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="method">طريقة الدفع</Label>
                                  <Select
                                    onValueChange={setPaymentMethod}
                                    value={paymentMethod}
                                  >
                                    <SelectTrigger id="method">
                                      <SelectValue placeholder="اختر الطريقة" />
                                    </SelectTrigger>
                                    <SelectContent dir="rtl">
                                      <SelectItem value="CASH">نقدي</SelectItem>
                                      <SelectItem value="TRANSFER">
                                        تحويل
                                      </SelectItem>
                                      <SelectItem value="CHEQUE">
                                        شيك
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter className="gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsPayDialogOpen(false)}
                                >
                                  إلغاء
                                </Button>
                                <Button
                                  onClick={handlePay}
                                  disabled={!payAmount || !treasuryId}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  تأكيد الدفع
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
