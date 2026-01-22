import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Receipt } from "lucide-react";
import { useCustomersRecords } from "@/hooks/data/useCustomersRecords";

export default function RecordsStats() {
  const { summary } = useCustomersRecords();
  return (
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
  );
}
