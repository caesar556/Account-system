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
import { Plus, Search } from "lucide-react";

const customers = [
  {
    id: "1",
    name: "Ahmed Ali",
    phone: "01012345678",
    balance: 1500,
    status: "DUE",
  },
  {
    id: "2",
    name: "Mohamed Hassan",
    phone: "01198765432",
    balance: 0,
    status: "PAID",
  },
  {
    id: "3",
    name: "Sara Ibrahim",
    phone: "01255544321",
    balance: -300,
    status: "CREDIT",
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

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
                    {customer.status === "PAID" && (
                      <Badge variant="secondary">Paid</Badge>
                    )}
                    {customer.status === "DUE" && (
                      <Badge variant="destructive">Due</Badge>
                    )}
                    {customer.status === "CREDIT" && (
                      <Badge className="bg-green-600">Credit</Badge>
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
