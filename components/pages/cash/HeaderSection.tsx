import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export default function HeaderSection() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">إدارة الخزينة</h1>
        <p className="text-muted-foreground mt-1">
          مراقبة السيولة النقدية والتدفقات المالية اليومية
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 border-dashed">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">تصدير التقارير</span>
          <span className="sm:hidden">تصدير</span>
        </Button>
        <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
          <Plus className="h-4 w-4" />
          <span>معاملة جديدة</span>
        </Button>
      </div>
    </div>
  );
}
