import { useGetStatementQuery } from "@/store/apiSlice";
import { useMemo, useState } from "react";

export function useStatements({ customerId }: { customerId: string }) {
  const { data, isLoading, error } = useGetStatementQuery(customerId);
  const [searchTerm, setSearchTerm] = useState("");

  const customer = data?.customer;
  const statement = data?.statement ?? [];
  const currentBalance = data?.currentBalance ?? 0;

  const filteredStatement = useMemo(() => {
    return statement.filter(
      (entry) =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.description &&
          entry.description.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [statement, searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  return {
    customer,
    statement,
    filteredStatement,
    currentBalance,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    handlePrint,
  };
}
