import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Phone, User, Wallet } from "lucide-react";

interface StatementSummaryProps {
  currentBalance: number;
  customer: {
    _id: string;
    name: string;
    phone: string;
  } | undefined;
  statement: any[];
}

export default function StatementSummary({
  currentBalance,
  customer,
  statement,
}: StatementSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-r-4 border-r-primary overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground">
            بيانات العميل
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black mb-1">{customer.name}</div>
          <div className="flex items-center text-sm text-muted-foreground font-medium">
            <Phone className="ml-2 h-4 w-4" />
            {customer.phone}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`border-r-4 ${currentBalance > 0 ? "border-r-destructive" : "border-r-emerald-500"} overflow-hidden transition-all hover:shadow-md`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground">
            الرصيد الحالي
          </CardTitle>
          <div
            className={`p-2 ${currentBalance > 0 ? "bg-destructive/10" : "bg-emerald-500/10"} rounded-full`}
          >
            <Wallet
              className={`h-4 w-4 ${currentBalance > 0 ? "text-destructive" : "text-emerald-500"}`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-black ${currentBalance > 0 ? "text-destructive" : currentBalance < 0 ? "text-emerald-600" : "text-muted-foreground"}`}
          >
            {Math.abs(currentBalance).toLocaleString()}{" "}
            <span className="text-sm font-bold text-muted-foreground">ج.م</span>
          </div>
          <p className="text-xs font-bold text-muted-foreground mt-2 flex items-center">
            <span
              className={`h-2 w-2 rounded-full ml-1.5 ${currentBalance > 0 ? "bg-destructive" : currentBalance < 0 ? "bg-emerald-500" : "bg-slate-300"}`}
            ></span>
            {currentBalance > 0
              ? "عليه (مدين)"
              : currentBalance < 0
                ? "له (دائن)"
                : "الرصيد متوازن"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-r-4 border-r-blue-500 overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground">
            إجمالي العمليات
          </CardTitle>
          <div className="p-2 bg-blue-500/10 rounded-full">
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black">{statement.length}</div>
          <p className="text-xs font-bold text-muted-foreground mt-2">
            إجمالي الحركات في السجل
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
