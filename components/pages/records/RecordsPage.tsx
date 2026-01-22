"use client";

import { useGetCustomerRecordsQuery } from "@/store/customers/customersApi";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function RecordsPage() {
  const { id } = useParams();
  const { data: records, isLoading, isError } = useGetCustomerRecordsQuery(id as string);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading customer records. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Records</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No records found for this customer.
                  </TableCell>
                </TableRow>
              ) : (
                records?.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.type === "DEPOSIT" ? "default" : "destructive"}>
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${record.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.status || "Completed"}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
