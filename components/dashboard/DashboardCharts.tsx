"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

import { useGetAnalyticsQuery } from "@/store/analyticsApi";
import type { AnalyticsResponse } from "@/lib/types/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
);


const TYPE_LABEL: Record<string, string> = {
  DEBIT: "المدفوعات",
  CREDIT: "المقبوضات",
};

const REASON_LABEL: Record<string, string> = {
  CUSTOMER_RECORD: "تحصيل من عميل",
  MANUAL: "عملية يدوية",
  ADJUSTMENT: "تسوية رصيد",
};

const METHOD_LABEL: Record<string, string> = {
  CASH: "نقدي",
  TRANSFER: "تحويل",
  CHEQUE: "شيك",
};


function KPI({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "success" | "danger" | "info" | "warning";
}) {
  const variants = {
    default: "bg-white border-slate-200 text-slate-900",
    success: "bg-emerald-50 border-emerald-100 text-emerald-700",
    danger: "bg-rose-50 border-rose-100 text-rose-700",
    info: "bg-blue-50 border-blue-100 text-blue-700",
    warning: "bg-amber-50 border-amber-100 text-amber-700",
  };

  return (
    <div
      className={`p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md ${variants[variant]}`}
    >
      <div className="text-sm font-medium opacity-80 mb-2">{label}</div>
      <div className="text-3xl font-black tracking-tight">
        {value.toLocaleString("ar-EG")}{" "}
        <span className="text-xs font-normal opacity-60 mr-1">EGP</span>
      </div>
    </div>
  );
}


export default function DashboardCharts() {
  const { data, isLoading } = useGetAnalyticsQuery({});

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[120px] bg-slate-100 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }


  const barData = {
    labels: data.charts.byType.map((t) => TYPE_LABEL[t._id] || t._id),
    datasets: [
      {
        label: "القيمة الإجمالية",
        data: data.charts.byType.map((t) => t.total),
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(244, 63, 94, 0.7)", 
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const methodDoughnutData = {
    labels: data.charts.byMethod.map((m) => METHOD_LABEL[m._id] ?? m._id),
    datasets: [
      {
        data: data.charts.byMethod.map((m) => Math.abs(m.net)),
        backgroundColor: [
          "rgba(245, 158, 11, 0.7)",
          "rgba(59, 130, 246, 0.7)", 
          "rgba(139, 92, 246, 0.7)", 
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const trendData = {
    labels: data.charts.trends.map((t) => t._id),
    datasets: [
      {
        label: "المقبوضات",
        data: data.charts.trends.map((t) => t.in),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "المدفوعات",
        data: data.charts.trends.map((t) => t.out),
        borderColor: "rgb(244, 63, 94)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        rtl: true,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: "inherit",
            size: 12,
          },
        },
      },
      tooltip: {
        padding: 12,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleAlign: "right" as const,
        bodyAlign: "right" as const,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 11 } },
      },
    },
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPI
          label="رصيد الخزينة الحالي"
          value={data.kpis.treasuryBalance}
          variant="info"
        />
        <KPI
          label="إجمالي المقبوضات"
          value={data.kpis.totalIn}
          variant="success"
        />
        <KPI
          label="إجمالي المدفوعات"
          value={data.kpis.totalOut}
          variant="danger"
        />
        <KPI label="صافي الفترة" value={data.kpis.net} variant="warning" />
        <KPI label="عدد العمليات" value={data.kpis.transactions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              حركة التدفق المالي
            </h3>
          </div>
          <div className="h-[350px]">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            توزيع المقبوضات/المدفوعات
          </h3>
          <div className="h-[350px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            السيولة حسب وسيلة الدفع
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-[300px] h-[300px]">
              <Doughnut
                data={methodDoughnutData}
                options={{ ...chartOptions, cutout: "70%" }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm overflow-hidden">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            تحليل الأسباب
          </h3>
          <div className="space-y-4">
            {data.charts.byReason.map((reason, idx) => (
              <div key={reason._id} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-700">
                    {REASON_LABEL[reason._id] ?? reason._id}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {reason.net.toLocaleString("ar-EG")} EGP
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      idx % 3 === 0
                        ? "bg-violet-500"
                        : idx % 3 === 1
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min(100, (Math.abs(reason.net) / Math.max(...data.charts.byReason.map((r) => Math.abs(r.net)))) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
