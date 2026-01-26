"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { useStatements } from "@/hooks/data/useStatements";
import StatementHeader from "./StatementHeader";
import StatementSummary from "./StatementSummary";
import StatementTable from "./StatementTable";
import StatementFooter from "./StatementFooter";

interface CustomerStatementProps {
  customerId: string;
}

export default function CustomerStatement({
  customerId,
}: CustomerStatementProps) {
  const {
    customer,
    statement,
    filteredStatement,
    currentBalance,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    handlePrint,
  } = useStatements({ customerId });

  if (isLoading) {
    return (
      <div className="space-y-6 dir-rtl" dir="rtl">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive dir-rtl" dir="rtl">
        <CardHeader>
          <CardTitle className="text-destructive font-bold">
            خطأ في تحميل كشف الحساب
          </CardTitle>
          <CardDescription>
            تعذر استرداد سجل العميل في الوقت الحالي. يرجى المحاولة مرة أخرى
            لاحقاً.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8 dir-rtl font-arabic pb-10 p-4 " dir="rtl">
      <StatementHeader handlePrint={handlePrint} />
      <StatementSummary
        currentBalance={currentBalance}
        customer={customer}
        statement={statement}
      />

      <StatementTable
        filteredStatement={filteredStatement}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <StatementFooter />
    </div>
  );
}
