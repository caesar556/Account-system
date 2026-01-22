"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCustomersRecords } from "@/hooks/data/useCustomersRecords";
import { AlertCircle } from "lucide-react";
import RecordsHeader from "./RecordsHeader";
import RecordsStats from "./RecordsStats";
import RecordsTable from "./RecordsTable";

export default function RecordsPage() {
  const { isLoading, isError } = useCustomersRecords();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4" dir="rtl">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500" dir="rtl">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <p className="text-xl font-semibold">خطأ في تحميل سجلات العميل.</p>
        <p>يرجى المحاولة مرة أخرى لاحقاً.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto" dir="rtl">
      <RecordsHeader />
      <RecordsStats />
      <RecordsTable />
    </div>
  );
}
