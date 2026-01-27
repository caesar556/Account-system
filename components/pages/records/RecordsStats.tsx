import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Receipt, CheckCircle2, AlertCircle } from "lucide-react";
import { useCustomersRecords } from "@/hooks/data/useCustomersRecords";

export default function RecordsStats() {
  const { summary } = useCustomersRecords();
  const currentBalance = summary?.balance?.current || 0;
  const shouldPay = currentBalance > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className={`shadow-sm border-r-4 ${shouldPay ? 'border-r-red-500 bg-red-50' : 'border-r-green-500 bg-green-50'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription>حالة الدفع</CardDescription>
            {shouldPay ? (
              <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
                <AlertCircle className="w-3 h-3 ml-1" />
                يجب الدفع
              </Badge>
            ) : (
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                <CheckCircle2 className="w-3 h-3 ml-1" />
                مدفوع بالكامل
              </Badge>
            )}
          </div>
          <CardTitle className={`text-2xl flex items-center ${shouldPay ? 'text-red-600' : 'text-green-600'}`}>
            <DollarSign className={`w-5 h-5 ml-1 ${shouldPay ? 'text-red-500' : 'text-green-500'}`} />
            {currentBalance.toLocaleString()}
            <span className="text-sm font-normal mr-2">{shouldPay ? 'مستحق الدفع' : 'الرصيد'}</span>
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
  );
}
