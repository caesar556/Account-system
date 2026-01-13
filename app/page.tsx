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
  History,
  PlusCircle
} from "lucide-react";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  await dbConnect();

  // Initialize treasury if none exists (for dev/demo)
  let treasury = await Treasury.findOne();
  if (!treasury) {
    treasury = await Treasury.create({ name: "الخزينة الرئيسية", currency: "EGP" });
  }

  // Fetch summary data from DB
  const transactions = await CashTransaction.find().sort({ createdAt: -1 }).limit(8);
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <LayoutDashboard className="h-8 w-8 text-violet-600" />
            </div>
            لوحة التحكم المالية
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">مرحباً بك، إليك ملخص النشاط المالي اليوم</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cash">
            <Button className="bg-violet-600 hover:bg-violet-700 gap-2 h-11 px-6 text-lg font-bold shadow-lg shadow-violet-200 transition-all active:scale-95">
              <PlusCircle className="h-5 w-5" />
              إضافة حركة جديدة
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative group transition-all hover:translate-y-[-4px]">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">إجمالي المقبوضات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight flex items-baseline gap-2">
              {totalIn.toLocaleString()} <span className="text-lg font-normal opacity-80 font-sans">EGP</span>
            </div>
            <div className="flex items-center gap-1 mt-4 text-emerald-100 bg-white/10 w-fit px-2 py-1 rounded-full text-sm font-medium">
              <ArrowUpRight className="h-4 w-4" />
              <span>+12.5% منذ الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-rose-500 to-red-600 text-white overflow-hidden relative group transition-all hover:translate-y-[-4px]">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <TrendingDown className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">إجمالي المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight flex items-baseline gap-2">
              {totalOut.toLocaleString()} <span className="text-lg font-normal opacity-80 font-sans">EGP</span>
            </div>
            <div className="flex items-center gap-1 mt-4 text-rose-100 bg-white/10 w-fit px-2 py-1 rounded-full text-sm font-medium">
              <ArrowDownLeft className="h-4 w-4" />
              <span>تحت الميزانية المقدرة</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden relative group transition-all hover:translate-y-[-4px]">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <Wallet className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">رصيد الخزينة المتوفر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight flex items-baseline gap-2">
              {balance.toLocaleString()} <span className="text-lg font-normal opacity-80 font-sans">EGP</span>
            </div>
            <div className="flex items-center gap-1 mt-4 text-violet-100 bg-white/10 w-fit px-2 py-1 rounded-full text-sm font-medium">
              <History className="h-4 w-4" />
              <span>تحديث فوري عبر السحابة</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="animate-in slide-in-from-bottom duration-1000 delay-200">
        <DashboardCharts inflow={totalIn} outflow={totalOut} />
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg border-none ring-1 ring-slate-200 animate-in slide-in-from-bottom duration-1000 delay-300">
        <CardHeader className="flex flex-row items-center justify-between pb-6 border-b mx-6 px-0">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900">سجل العمليات الأخيرة</CardTitle>
            <p className="text-base text-muted-foreground mt-1">تتبع أحدث الحركات المالية في نظامك</p>
          </div>
          <Link href="/cash">
            <Button variant="outline" className="text-violet-600 border-violet-200 hover:bg-violet-50 font-bold">
              عرض السجل الكامل
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50/50 text-sm font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4">النوع</th>
                  <th className="px-8 py-4">المبلغ</th>
                  <th className="px-8 py-4">البيان / الوصف</th>
                  <th className="px-8 py-4">وسيلة الدفع</th>
                  <th className="px-8 py-4 text-left">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={t._id.toString()} className="hover:bg-slate-50/80 transition-all">
                      <td className="px-8 py-5">
                        <Badge 
                          variant={t.type === "IN" ? "outline" : "destructive"} 
                          className={`
                            px-3 py-1 font-bold rounded-full
                            ${t.type === "IN" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200 shadow-none"}
                          `}
                        >
                          {t.type === "IN" ? "وارد (IN)" : "صادر (OUT)"}
                        </Badge>
                      </td>
                      <td className={`px-8 py-5 text-lg font-black ${t.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.type === "IN" ? "+" : "-"}{t.amount.toLocaleString()} 
                        <span className="text-xs font-normal mr-1 opacity-70">EGP</span>
                      </td>
                      <td className="px-8 py-5 font-medium text-slate-700">{t.description}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${t.method === "CASH" ? "bg-orange-400" : t.method === "TRANSFER" ? "bg-blue-400" : "bg-purple-400"}`}></span>
                          <span className="text-sm font-bold text-slate-600">
                            {t.method === "CASH" ? "نقدي" : t.method === "TRANSFER" ? "تحويل" : "شيك"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-left text-sm text-slate-400 font-mono">
                        {new Date(t.createdAt).toLocaleDateString('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                      <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-lg font-medium">لا توجد عمليات مسجلة حتى الآن</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
