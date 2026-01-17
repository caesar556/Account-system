"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCustomersQuery } from "@/store/customers/customersApi";
import { Loader2, Plus, Search } from "lucide-react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const { data: customers = [], isLoading, error } = useGetCustomersQuery();

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading customers. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {" "}
      {/* Header */}{" "}
      <div className="flex items-center justify-between">
        {" "}
        <h1 className="text-2xl font-bold">Customers</h1>{" "}
        <Button>
          {" "}
          <Plus className="mr-2 h-4 w-4" /> Add Customer{" "}
        </Button>{" "}
      </div>
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customer by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell
                    className={
                      customer.balance > 0
                        ? "text-red-600"
                        : customer.balance < 0
                          ? "text-green-600"
                          : "text-muted-foreground"
                    }
                  >
                    {customer.balance} EGP
                  </TableCell>
                  <TableCell>
                    {customer.balance === 0 && (
                      <Badge variant="secondary">Paid</Badge>
                    )}
                    {customer.balance > 0 && (
                      <Badge variant="destructive">Due</Badge>
                    )}
                    {customer.balance < 0 && (
                      <Badge className="bg-green-600 text-white">Credit</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
