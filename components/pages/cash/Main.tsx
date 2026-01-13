import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6 p-4 md:p-6">

      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Treasury Dashboard</h1>
        <Button>Add Transaction</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Cash In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">+ 25,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Cash Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">- 8,500</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">16,500</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Add Transaction */}
        <div>
          <AddTransactionForm />
        </div>

        {/* Transactions Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-green-600">
                      IN
                    </TableCell>
                    <TableCell>10,000</TableCell>
                    <TableCell>Client payment</TableCell>
                    <TableCell>Cash</TableCell>
                    <TableCell>Today</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium text-red-600">
                      OUT
                    </TableCell>
                    <TableCell>1,500</TableCell>
                    <TableCell>Transportation</TableCell>
                    <TableCell>Cash</TableCell>
                    <TableCell>Today</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}