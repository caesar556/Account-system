"use client";

import { useMemo, useState } from "react";
import { useGetCustomersQuery } from "@/store/customers/customersApi";

export function useCustomers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const {
    data: customers = [],
    isLoading,
    error,
    refetch,
  } = useGetCustomersQuery();

  const filteredCustomers = useMemo(() => {
    const list = Array.isArray(customers) ? customers : [];

    const filtered = list.filter((c: any) => {
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

      const balance = c.balance || 0;

      const matchesBalance =
        balanceFilter === "all" ||
        (balanceFilter === "debt" && balance > 0) ||
        (balanceFilter === "credit" && balance < 0) ||
        (balanceFilter === "clear" && balance === 0);

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesBalance
      );
    });

    return filtered.sort((a: any, b: any) => {
      const dir = order === "asc" ? 1 : -1;

      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * dir;
      }
      if (sortBy === "balance") {
        return (a.balance - b.balance) * dir;
      }
      return 0;
    });
  }, [
    customers,
    search,
    statusFilter,
    categoryFilter,
    balanceFilter,
    sortBy,
    order,
  ]);

  return {
    customers: filteredCustomers,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    balanceFilter,
    setBalanceFilter,
    sortBy,
    setSortBy,
    order,
    setOrder,
    refetch,
  };
}
