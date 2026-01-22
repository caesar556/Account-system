"use client";
import { useGetCustomersQuery } from "@/store/customers/customersApi";
import { useMemo, useState } from "react";

export function useCustomers() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");

  const { data: customers = [], isLoading, error, refetch } = useGetCustomersQuery();

  const filteredCustomers = useMemo(() => {
    return (Array.isArray(customers) ? customers : []).filter((c: any) => {
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

      const balance = c.currentBalance || 0;
      const matchesBalance =
        balanceFilter === "all" ||
        (balanceFilter === "debt" && balance > 0) ||
        (balanceFilter === "credit" && balance < 0) ||
        (balanceFilter === "clear" && balance === 0);

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesBalance
      );
    });
  }, [customers, search, statusFilter, categoryFilter, balanceFilter]);

  const stats = useMemo(() => {
    const customerList = Array.isArray(customers) ? customers : [];
    const totalCustomers = customerList.length;
    const activeCustomers = customerList.filter((c: any) => c.isActive).length;
    const totalDebt = customerList.reduce(
      (sum: number, c: any) =>
        sum + (c.currentBalance > 0 ? Number(c.currentBalance) : 0),
      0,
    );
    const totalCredit = customerList.reduce(
      (sum: number, c: any) =>
        sum + (c.currentBalance < 0 ? Math.abs(Number(c.currentBalance)) : 0),
      0,
    );
    const vipCustomers = customerList.filter(
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
    refetch,
  };
}
