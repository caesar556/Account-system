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
import { Bar, Pie, Line } from "react-chartjs-2";

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
  Legend
);

/* ===================== LABEL MAPS ===================== */

const TYPE_LABEL: Record<string, string> = {
  DEBIT: "وارد",
  CREDIT: "منصرف",
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

/* ===================== UI HELPERS ===================== */

function KPI({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-900">
        {value.toLocaleString("ar-EG")} EGP
      </div>
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */

export default function DashboardCharts () {
  const { data, isLoading } = useGetAnalyticsQuery({});

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-[120px] bg-slate-100 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  /* ===================== CHART DATA ===================== */

  const barData = {
    labels: data.charts.byType.map(t => TYPE_LABEL[t._id]),
    datasets: [
      {
        label: "إجمالي",
        data: data.charts.byType.map(t => t.total),
        backgroundColor: [
          "rgba(34,197,94,0.6)",
          "rgba(239,68,68,0.6)",
        ],
      },
    ],
  };

  const reasonPieData = {
    labels: data.charts.byReason.map(
      r => REASON_LABEL[r._id] ?? r._id
    ),
    datasets: [
      {
        data: data.charts.byReason.map(r => r.net),
        backgroundColor: [
          "rgba(124,58,237,0.6)",
          "rgba(59,130,246,0.6)",
          "rgba(249,115,22,0.6)",
          "rgba(20,184,166,0.6)",
          "rgba(236,72,153,0.6)",
        ],
      },
    ],
  };

  const trendData = {
    labels: data.charts.trends.map(t => t._id),
    datasets: [
      {
        label: "وارد",
        data: data.charts.trends.map(t => t.in),
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.4)",
        tension: 0.3,
      },
      {
        label: "منصرف",
        data: data.charts.trends.map(t => t.out),
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.4)",
        tension: 0.3,
      },
      {
        label: "الصافي",
        data: data.charts.trends.map(t => t.net),
        borderColor: "rgb(59,130,246)",
        backgroundColor: "rgba(59,130,246,0.4)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="space-y-8">

      {/* ===================== KPIs ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI label="إجمالي الوارد" value={data.kpis.totalIn} />
        <KPI label="إجمالي المنصرف" value={data.kpis.totalOut} />
        <KPI label="الصافي" value={data.kpis.net} />
        <KPI label="عدد العمليات" value={data.kpis.transactions} />
      </div>

      {/* ===================== CHARTS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[380px]">
          <h3 className="font-semibold mb-4 text-right">
            وارد مقابل منصرف
          </h3>
          <div className="h-[300px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm h-[380px]">
          <h3 className="font-semibold mb-4 text-right">
            التوزيع حسب السبب (صافي)
          </h3>
          <div className="h-[300px]">
            <Pie data={reasonPieData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* ===================== TRENDS ===================== */}
      <div className="bg-white p-6 rounded-xl border shadow-sm h-[420px]">
        <h3 className="font-semibold mb-4 text-right">
          حركة التدفق المالي
        </h3>
        <div className="h-[330px]">
          <Line data={trendData} options={chartOptions} />
        </div>
      </div>

      {/* ===================== PAYMENT METHODS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.charts.byMethod.map(method => (
          <div
            key={method._id}
            className="bg-white p-4 rounded-xl border shadow-sm text-center"
          >
            <div className="text-sm text-muted-foreground">
              {METHOD_LABEL[method._id] ?? method._id}
            </div>
            <div className="text-xl font-bold mt-1">
              {method.net.toLocaleString("ar-EG")} EGP
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {method.count} عملية
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}