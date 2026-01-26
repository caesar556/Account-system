import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface StatementHeaderProps {
  handlePrint: () => void;
}

export default function StatementHeader({ handlePrint }: StatementHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-primary mb-2">
          كشف حساب عميل
        </h1>
        <p className="text-muted-foreground text-lg">
          سجل مفصل لجميع المعاملات المالية والفواتير الخاصة بالعميل.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrint}
          className="rounded-xl border-2 hover:bg-secondary"
        >
          <Printer className="ml-2 h-5 w-5" />
          طباعة الكشف
        </Button>
        <Button
          variant="default"
          size="lg"
          className="rounded-xl shadow-lg shadow-primary/20"
        >
          <Download className="ml-2 h-5 w-5" />
          تصدير PDF
        </Button>
      </div>
    </div>
  );
}
