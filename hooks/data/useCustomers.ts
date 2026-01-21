"use client";
import { useGetCustomersQuery } from "@/store/customers/customersApi";
import { useMemo, useState } from "react";

export function useCustomers() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");

  const { data: customers = [], isLoading, error } = useGetCustomersQuery();

  const filteredCustomers = useMemo(() => {
    return customers.filter((c: any) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search)) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.isActive) ||
        (statusFilter === "inactive" && !c.isActive);

      const matchesCategory =
        categoryFilter === "all" || c.category === categoryFilter;

      const matchesBalance =
        balanceFilter === "all" ||
        (balanceFilter === "debt" && c.currentBalance > 0) ||
        (balanceFilter === "credit" && c.currentBalance < 0) ||
        (balanceFilter === "clear" && c.currentBalance === 0);

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesBalance
      );
    });
  }, [customers, search, statusFilter, categoryFilter, balanceFilter]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c: any) => c.isActive).length;
    const totalDebt = customers.reduce(
      (sum: number, c: any) =>
        sum + (c.currentBalance > 0 ? c.currentBalance : 0),
      0,
    );
    const totalCredit = customers.reduce(
      (sum: number, c: any) =>
        sum + (c.currentBalance < 0 ? -c.currentBalance : 0),
      0,
    );
    const vipCustomers = customers.filter(
      (c: any) => c.category === "vip",
    ).length;

    return {
      totalCustomers,
      activeCustomers,
      totalDebt,
      totalCredit,
      vipCustomers,
    };
  }, [customers]);

  return {
    customers: filteredCustomers,
    stats,
    isLoading,
    error,
    search,
    setSearch,
    setOpen,
    open,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    balanceFilter,
    setBalanceFilter,
  };
}
