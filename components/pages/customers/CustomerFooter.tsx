"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCustomers } from "@/hooks/data/useCustomers";

export default function CustomerFooter() {
  const { customers, customers: filteredCustomers } = useCustomers();
  return (
    <div>
      {filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-4">
            <span>
              إظهار {filteredCustomers.length} من {customers.length} عميل
            </span>
            <Badge variant="outline" className="font-normal">
              {customers.filter((c: any) => c.currentBalance > 0).length} عميل
              مدين
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Download className="h-4 w-4 ml-1" />
            تصدير التقرير
          </Button>
        </div>
      )}
    </div>
  );
}
