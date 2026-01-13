import dbConnect from "@/lib/db";
import { CashTransaction } from "@/models/CashTransaction";
import { Treasury } from "@/models/treasury";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  LayoutDashboard,
  History
} from "lucide-react";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  await dbConnect();

  // Fetch summary data from DB
  const transactions = await CashTransaction.find().sort({ createdAt: -1 }).limit(5);
  const allTransactions = await CashTransaction.find();

  const totalIn = allTransactions
    .filter(t => t.type === "IN")
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalOut = allTransactions
    .filter(t => t.type === "OUT")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIn - totalOut;

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 animate-in fade-in duration-700" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-violet-600" />
            لوحة التحكم الرئيسية
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">نظرة عامة على الوضع المالي للمنشأة</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-none shadow-md bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingUp className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">إجمالي الوارد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">
              {totalIn.toLocaleString()} <span className="text-sm font-normal">ج.م</span>
            </div>
            <div className="flex items-center gap-1 mt-4 text-green-100 bg-white/10 w-fit px-2 py-1 rounded text-sm">
              <ArrowUpRight className="h-4 w-4" />
              <span>معدل نمو جيد</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-red-500 to-rose-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingDown className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">إجمالي المنصرف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">
              {totalOut.toLocaleString()} <span className="text-sm font-normal">ج.م</span>
            </div>
            <div className="flex items-center gap-1 mt-4 text-red-100 bg-white/10 w-fit px-2 py-1 rounded text-sm">
              <ArrowDownLeft className="h-4 w-4" />
              <span>تحت السيطرة</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Wallet className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">رصيد الخزينة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">
              {balance.toLocaleString()} <span className="text-sm font-normal">ج.م</span>
            </div>
            <div className="flex items-center gap-1 mt-4 text-violet-100 bg-white/10 w-fit px-2 py-1 rounded text-sm">
              <History className="h-4 w-4" />
              <span>تحديث حي الآن</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts inflow={totalIn} outflow={totalOut} />

      {/* Recent Activity */}
      <Card className="shadow-sm border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold">آخر الحركات</CardTitle>
            <p className="text-sm text-muted-foreground">أحدث المعاملات المسجلة في النظام</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 border-y text-sm font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-3">العملية</th>
                  <th className="px-6 py-3">المبلغ</th>
                  <th className="px-6 py-3">التفاصيل</th>
                  <th className="px-6 py-3">طريقة الدفع</th>
                  <th className="px-6 py-3">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((t) => (
                  <tr key={t._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Badge variant={t.type === "IN" ? "outline" : "destructive"} className={t.type === "IN" ? "bg-green-50 text-green-700 border-green-200" : ""}>
                        {t.type === "IN" ? "وارد" : "صادر"}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 font-bold ${t.type === "IN" ? "text-green-600" : "text-red-600"}`}>
                      {t.amount.toLocaleString()} ج.م
                    </td>
                    <td className="px-6 py-4 text-slate-600">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                        {t.method === "CASH" ? "نقدي" : t.method === "TRANSFER" ? "تحويل" : "شيك"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                      {new Date(t.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
