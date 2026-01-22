import { AddRecordForm } from "@/components/forms/customers/AddRecordForm";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCustomersRecords } from "@/hooks/data/useCustomersRecords";

export default function RecordsHeader() {
  const { summary, customerId, refetch, isAddRecordOpen, setIsAddRecordOpen } =
    useCustomersRecords();
  return (
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
  );
}
