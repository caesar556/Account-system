"use client";

import { useGetCustomerRecordsQuery, usePayRecordMutation, useGetCustomerSummaryQuery } from "@/store/customers/customersApi";
import { useGetTreasuriesQuery } from "@/store/treasuries/treasuriesApi";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Receipt, DollarSign } from "lucide-react";

export default function RecordsPage() {
  const { id } = useParams();
  const customerId = id as string;
  const { data: records, isLoading, isError } = useGetCustomerRecordsQuery(customerId);
  const { data: summary } = useGetCustomerSummaryQuery(customerId);
  const { data: treasuries } = useGetTreasuriesQuery();
  const [payRecord] = usePayRecordMutation();

  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("");
  const [treasuryId, setTreasuryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const handlePay = async () => {
    if (!selectedRecord || !payAmount || !treasuryId) return;
    try {
      await payRecord({
        customerId,
        recordId: selectedRecord._id,
        amount: parseFloat(payAmount),
        treasuryId,
        paymentMethod,
      }).unwrap();
      setIsPayDialogOpen(false);
      setPayAmount("");
      setSelectedRecord(null);
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
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
      <div className="p-6 text-center text-red-500">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <p className="text-xl font-semibold">Error loading customer records.</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</Badge>;
      case "PARTIAL":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> Partial</Badge>;
      default:
        return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50"><Clock className="w-3 h-3 mr-1" /> Open</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {summary?.customer?.name || "Customer Records"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track customer payment records and invoices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <DollarSign className="w-5 h-5 mr-1 text-blue-500" />
              {summary?.balance?.current?.toLocaleString() || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Unpaid Records</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Receipt className="w-5 h-5 mr-1 text-orange-500" />
              {summary?.records?.totalUnpaid?.toLocaleString() || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Credit Limit</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                {summary?.balance?.creditLimit?.toLocaleString() || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-md border-none ring-1 ring-gray-200">
        <CardHeader className="bg-gray-50/50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Record History</CardTitle>
              <CardDescription>All invoices and their current payment status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold px-6">Date</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold text-right">Total</TableHead>
                <TableHead className="font-semibold text-right">Paid</TableHead>
                <TableHead className="font-semibold text-right">Remaining</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Receipt className="h-12 w-12 mb-2 opacity-20" />
                      <p>No records found for this customer.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                records?.map((record: any) => {
                  const remaining = record.totalAmount - (record.paidAmount || 0);
                  return (
                    <TableRow key={record._id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="px-6 font-medium">
                        {format(new Date(record.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.title}</div>
                        {record.description && <div className="text-xs text-muted-foreground">{record.description}</div>}
                      </TableCell>
                      <TableCell className="text-right font-semibold">${record.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">${(record.paidAmount || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-right text-orange-600 font-bold">${remaining.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell className="text-right px-6">
                        {record.status !== "PAID" && (
                          <Dialog open={isPayDialogOpen && selectedRecord?._id === record._id} onOpenChange={(open) => {
                            setIsPayDialogOpen(open);
                            if (!open) setSelectedRecord(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setPayAmount(remaining.toString());
                                }}
                              >
                                Pay
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Process Payment</DialogTitle>
                                <CardDescription>Pay for record: {record.title}</CardDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="amount">Amount to Pay (Max: ${remaining})</Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    max={remaining}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="treasury">From Treasury</Label>
                                  <Select onValueChange={setTreasuryId} value={treasuryId}>
                                    <SelectTrigger id="treasury">
                                      <SelectValue placeholder="Select treasury" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {treasuries?.map((t: any) => (
                                        <SelectItem key={t._id} value={t._id}>
                                          {t.name} (Balance: ${t.currentBalance})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="method">Payment Method</Label>
                                  <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                                    <SelectTrigger id="method">
                                      <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="CASH">Cash</SelectItem>
                                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                                      <SelectItem value="CHEQUE">Cheque</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handlePay} disabled={!payAmount || !treasuryId}>Confirm Payment</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
