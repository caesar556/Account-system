"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useGetAnalyticsQuery } from '@/store/analyticsApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const REASON_LABEL_MAP: Record<string, string> = {
  CUSTOMER_RECORD: "سجل عملاء",
  MANUAL: "يدوي",
  ADJUSTMENT: "تسوية",
};

const METHOD_MAP: Record<string, string> = {
  CASH: "نقدي",
  TRANSFER: "تحويل",
  CHEQUE: "شيك",
};

export default function DashboardCharts() {
  const { data, isLoading } = useGetAnalyticsQuery();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[350px] bg-slate-100 animate-pulse rounded-xl" />
        <div className="h-[350px] bg-slate-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  const barData = {
    labels: data.byType?.map((t: any) => t._id === "DEBIT" ? "الوارد" : "المنصرف") || [],
    datasets: [
      {
        label: 'التدفق المالي',
        data: data.byType?.map((t: any) => t.total) || [],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 1,
      },
    ],
  };

  const reasonData = {
    labels: data.byReason?.map((r: any) => REASON_LABEL_MAP[r._id] || r._id) || [],
    datasets: [
      {
        data: data.byReason?.map((r: any) => r.total) || [],
        backgroundColor: [
          'rgba(124, 58, 237, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(20, 184, 166, 0.6)',
          'rgba(107, 114, 128, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const trendData = {
    labels: data.trends?.map((t: any) => t._id) || [],
    datasets: [
      {
        label: 'الوارد',
        data: data.trends?.map((t: any) => t.in) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
      {
        label: 'المنصرف',
        data: data.trends?.map((t: any) => t.out) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { font: { family: 'Geist' } },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-right">تحليل التدفقات (وارد vs منصرف)</h3>
          <div className="h-[300px]">
            <Bar options={options} data={barData} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-right">توزيع العمليات حسب المصدر</h3>
          <div className="h-[300px]">
            <Pie options={options} data={reasonData} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border shadow-sm h-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-right">حركة التدفق المالي اليومي</h3>
        <div className="h-[300px]">
          <Line options={options} data={trendData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.byMethod?.map((m: any) => (
          <div key={m._id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center space-y-2">
            <span className="text-sm text-muted-foreground">{METHOD_MAP[m._id] || m._id}</span>
            <span className="text-2xl font-bold text-slate-900">{m.total.toLocaleString("ar-EG")} EGP</span>
            <span className="text-xs text-slate-500">{m.count} عملية</span>
          </div>
        ))}
      </div>
    </div>
  );
}
