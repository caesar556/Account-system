import AddTransactionForm from "@/components/forms/Transaction form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TreasuryPage() {
  return (
    <section dir="rtl" className="min-h-screen bg-muted/40 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">الخزينة</h1>

          <Button className="bg-violet-800 hover:bg-violet-900">
            إضافة حركة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-r-4 border-green-600">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                إجمالي الداخل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">+ 25,000</p>
            </CardContent>
          </Card>

          <Card className="border-r-4 border-red-600">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                إجمالي الخارج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-700">- 8,500</p>
            </CardContent>
          </Card>

          <Card className="border-r-4 border-violet-600">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                الرصيد الحالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">16,500</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">آخر الحركات</CardTitle>
              </CardHeader>

              <CardContent className="overflow-x-auto">
                <Table className="min-w-full border">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-center">النوع</TableHead>
                      <TableHead className="text-center">المبلغ</TableHead>
                      <TableHead className="text-center">الوصف</TableHead>
                      <TableHead className="text-center">طريقة الدفع</TableHead>
                      <TableHead className="text-center">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow className="hover:bg-muted/40 transition">
                      <TableCell>
                        <span className="border-2 border-red-700">داخل</span>
                      </TableCell>

                      <TableCell className="font-semibold text-green-700 text-center">
                        + 10,000
                      </TableCell>

                      <TableCell className="text-muted-foreground text-center">
                        دفع من العميل
                      </TableCell>

                      <TableCell className="text-center">كاش</TableCell>

                      <TableCell className="text-sm text-muted-foreground text-center">
                        اليوم
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
