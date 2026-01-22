import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Clock, Receipt } from "lucide-react";
import { useCustomersRecords } from "@/hooks/data/useCustomersRecords";
import { format } from "date-fns/format";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function RecordsTable() {
  const {
    records,
    isPayDialogOpen,
    setIsPayDialogOpen,
    selectedRecord,
    setSelectedRecord,
    payAmount,
    setPayAmount,
    treasuryId,
    setTreasuryId,
    paymentMethod,
    setPaymentMethod,
    treasuries,
    handlePay,
  } = useCustomersRecords();

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
    <Card className="shadow-md border-none ring-1 ring-gray-200">
      <CardHeader className="bg-gray-50/50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>تاريخ السجلات</CardTitle>
            <CardDescription>جميع الفواتير وحالة الدفع الحالية</CardDescription>
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
              <TableHead className="font-semibold text-left">المدفوع</TableHead>
              <TableHead className="font-semibold text-left">المتبقي</TableHead>
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
                const remaining = record.totalAmount - (record.paidAmount || 0);
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
                          <DialogContent className="sm:max-w-[425px]" dir="rtl">
                            <DialogHeader>
                              <DialogTitle>معالجة الدفع</DialogTitle>
                              <CardDescription>
                                دفع للسجل: {record.title}
                              </CardDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="amount">
                                  المبلغ المراد دفعه (الحد الأقصى: {remaining})
                                </Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  value={payAmount}
                                  onChange={(e) => setPayAmount(e.target.value)}
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
                                    <SelectItem value="CHEQUE">شيك</SelectItem>
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
  );
}
