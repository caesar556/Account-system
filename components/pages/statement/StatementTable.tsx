import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { Calendar, Search } from "lucide-react";

interface StatementTableProps {
  filteredStatement: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function StatementTable({
  filteredStatement,
  searchTerm,
  setSearchTerm,
}: StatementTableProps) {
  return (
    <Card className="rounded-2xl border-2 overflow-hidden shadow-sm">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold">
              سجل الحركات المالية
            </CardTitle>
            <CardDescription className="font-medium">
              عرض تفصيلي لجميع الفواتير والمدفوعات مرتبة زمنياً.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-72 print:hidden">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في الحركات..."
              className="pr-10 rounded-xl bg-background border-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b-2">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] font-bold text-primary text-right">
                  التاريخ
                </TableHead>
                <TableHead className="min-w-[200px] font-bold text-primary text-right">
                  التفاصيل والبيان
                </TableHead>
                <TableHead className="w-[150px] font-bold text-primary text-center">
                  نوع العملية
                </TableHead>
                <TableHead className="w-[120px] text-center font-bold text-destructive">
                  مدين (عليه)
                </TableHead>
                <TableHead className="w-[120px] text-center font-bold text-emerald-600">
                  دائن (له)
                </TableHead>
                <TableHead className="w-[150px] text-left font-black text-primary border-r bg-primary/5">
                  الرصيد التراكمي
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStatement.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Search className="h-10 w-10 opacity-20" />
                      <p className="text-lg font-bold">
                        لا توجد عمليات مطابقة للبحث
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStatement.map((entry: any, idx: number) => (
                  <TableRow
                    key={entry.id}
                    className={`${idx % 2 === 0 ? "bg-transparent" : "bg-muted/5"} hover:bg-muted/10 transition-colors border-b`}
                  >
                    <TableCell className="font-medium text-muted-foreground py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary/40" />
                        <span className="tabular-nums">
                          {format(new Date(entry.date), "yyyy/MM/dd", {
                            locale: ar,
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-foreground">
                          {entry.title}
                        </span>
                        {entry.description && (
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            {entry.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`rounded-md px-2 py-1 font-bold border ${
                          entry.type === "INVOICE"
                            ? "border-blue-200 bg-blue-50/50 text-blue-700"
                            : "border-emerald-200 bg-emerald-50/50 text-emerald-700"
                        }`}
                      >
                        {entry.type === "INVOICE" ? "فاتورة" : "دفعة نقدية"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold text-destructive tabular-nums text-base">
                      {entry.debit > 0 ? entry.debit.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-center font-bold text-emerald-600 tabular-nums text-base">
                      {entry.credit > 0 ? entry.credit.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell
                      className={`text-left font-black text-lg border-r  tabular-nums ${entry.balance > 0 ? "text-destructive" : entry.balance < 0 ? "text-emerald-600" : "text-muted-foreground"}`}
                    >
                      {Math.abs(entry.balance).toLocaleString()}
                      <span className="text-[10px] mr-1 opacity-60">
                        {entry.balance > 0
                          ? "مدين"
                          : entry.balance < 0
                            ? "دائن"
                            : ""}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
