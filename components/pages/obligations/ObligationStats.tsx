"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
} from "lucide-react";
import { useGetObligationsQuery } from "@/store/obligations/obligationsApi";
import { cn } from "@/lib/utils";

interface ObligationStatsProps {
  filter: "all" | "OPEN" | "DONE" | "overdue";
  setFilter: (filter: "all" | "OPEN" | "DONE" | "overdue") => void;
}

export default function ObligationStats({ filter, setFilter }: ObligationStatsProps) {
  const { data: allObligations = [] } = useGetObligationsQuery();
  const { data: overdueObligations = [] } = useGetObligationsQuery({ overdue: true });

  const totalAmount = allObligations.reduce((sum, o) => sum + o.amount, 0);
  const openObligations = allObligations.filter((o) => o.status === "OPEN");
  const doneObligations = allObligations.filter((o) => o.status === "DONE");
  const openAmount = openObligations.reduce((sum, o) => sum + o.amount, 0);
  const overdueAmount = overdueObligations.reduce((sum, o) => sum + o.amount, 0);

  const stats = [
    {
      id: "all",
      title: "إجمالي الإلتزامات",
      value: allObligations.length,
      amount: totalAmount,
      icon: CreditCard,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "OPEN",
      title: "إلتزامات مفتوحة",
      value: openObligations.length,
      amount: openAmount,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "overdue",
      title: "متأخرة",
      value: overdueObligations.length,
      amount: overdueAmount,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      id: "DONE",
      title: "مكتملة",
      value: doneObligations.length,
      amount: doneObligations.reduce((sum, o) => sum + o.amount, 0),
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.id}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            filter === stat.id && "ring-2 ring-violet-500 shadow-md"
          )}
          onClick={() => setFilter(stat.id as typeof filter)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className={cn("text-sm font-semibold mt-1", stat.color)}>
                  {stat.amount.toLocaleString()} ج.م
                </p>
              </div>
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", stat.bgColor)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
