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
import { Bar, Pie } from 'react-chartjs-2';

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

interface DashboardChartsProps {
  inflow: number;
  outflow: number;
}

export default function DashboardCharts({ inflow, outflow }: DashboardChartsProps) {
  const barData = {
    labels: ['الوارد', 'المنصرف'],
    datasets: [
      {
        label: 'التدفق المالي',
        data: [inflow, outflow],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['سيولة متوفرة', 'منصرفات'],
    datasets: [
      {
        data: [inflow - outflow, outflow],
        backgroundColor: [
          'rgba(124, 58, 237, 0.6)',
          'rgba(249, 115, 22, 0.6)',
        ],
        borderColor: [
          'rgb(124, 58, 237)',
          'rgb(249, 115, 22)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Geist',
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm h-[350px]">
        <h3 className="text-lg font-semibold mb-4 text-right">تحليل التدفقات</h3>
        <div className="h-[250px]">
          <Bar options={options} data={barData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border shadow-sm h-[350px]">
        <h3 className="text-lg font-semibold mb-4 text-right">توزيع السيولة</h3>
        <div className="h-[250px]">
          <Pie options={options} data={pieData} />
        </div>
      </div>
    </div>
  );
}
