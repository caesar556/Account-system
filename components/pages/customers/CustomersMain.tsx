"use client";
import CustomerFilter from "./customerFilter";
import CustomerHeader from "./CustomerHeader";
import CustomerStats from "./CustomerStats";

import { useCustomers } from "@/hooks/data/useCustomers";
import CustomerTable from "./CustomerTable";

export default function CustomersMain() {
  const { open, setOpen } = useCustomers();
  return (
    <div className="p-6 space-y-6" dir="rtl">
      <CustomerHeader open={open} setOpen={setOpen} />
      <CustomerStats />
      <CustomerTable />
    </div>
  );
}
