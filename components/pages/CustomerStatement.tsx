"use client";

import { useGetStatementQuery } from "@/store/apiSlice";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Printer, 
  Download, 
  FileText, 
  ArrowUpRight, 
  ArrowDownLeft,
  User,
  Phone,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerStatementProps {
  customerId: string;
}

export default function CustomerStatement({ customerId }: CustomerStatementProps) {
  const { data, isLoading, error } = useGetStatementQuery(customerId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Statement</CardTitle>
          <CardDescription>Could not retrieve customer history at this time.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { customer, statement, currentBalance } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Statement</h1>
          <p className="text-muted-foreground">Detailed history of all customer interactions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Details</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{customer.name}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Phone className="mr-1 h-3 w-3" />
              {customer.phone}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentBalance > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
              {Math.abs(currentBalance).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">IQD</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentBalance > 0 ? 'Amount Due (Debit)' : currentBalance < 0 ? 'Credit Balance' : 'Clear Balance'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statement.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total entries in period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A chronological record of invoices and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right font-bold">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statement.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No operations found for this customer.
                    </TableCell>
                  </TableRow>
                ) : (
                  statement.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {format(new Date(entry.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{entry.title}</span>
                          {entry.description && (
                            <span className="text-xs text-muted-foreground">{entry.description}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.type === 'INVOICE' ? 'secondary' : 'outline'}>
                          {entry.type === 'INVOICE' ? (
                            <><ArrowUpRight className="mr-1 h-3 w-3" /> Invoice</>
                          ) : (
                            <><ArrowDownLeft className="mr-1 h-3 w-3" /> Payment</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {entry.debit > 0 ? entry.debit.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600">
                        {entry.credit > 0 ? entry.credit.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${entry.balance > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                        {entry.balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="hidden print:block mt-10 text-center text-xs text-muted-foreground">
        Generated on {format(new Date(), "PPPP")}
      </div>
    </div>
  );
}
