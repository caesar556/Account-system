"use client";
import { useGetCustomersQuery } from "@/store/customers/customersApi";
import { useMemo, useState } from "react";

export function useCustomers() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");

  const {
    data: customers = [],
    isLoading,
    error,
    refetch,
  } = useGetCustomersQuery();

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

  const handleReverse = async () => {
    try {
    } catch (err) {}
  };

  return {
    customers: filteredCustomers,
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
