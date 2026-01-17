import {
  useDeleteTransactionMutation,
  useGetTransactionsQuery,
} from "@/store/transactions/transactionsApi";
import { useState } from "react";

export const useTransactions = () => {
  const { data, isLoading, isError } = useGetTransactionsQuery();

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const rawTransactions = Array.isArray(data)
    ? (data as any[])
    : (data as any)?.transactions || [];

  const filteredTransactions = rawTransactions.filter(
    (tx: any) =>
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount?.toString().includes(searchTerm) ||
      tx.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const transactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه المعاملة؟")) {
      try {
        await deleteTransaction(id).unwrap();
      } catch (err) {
        console.error("Failed to delete transaction", err);
      }
    }
  };

  return {
    transactions,
    isLoading,
    isError,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    handleDelete,
    totalItems
  };
};
