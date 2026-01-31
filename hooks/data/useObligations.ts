import { Obligation } from "@/lib/types/obligation";
import {
  useDeleteObligationMutation,
  useGetObligationsQuery,
  useMarkObligationDoneMutation,
  useReopenObligationMutation,
} from "@/store/obligations/obligationsApi";
import { useState } from "react";

interface UseObligationsProps {
  filter: "all" | "OPEN" | "DONE" | "overdue";
}

export function useObligations({ filter }: UseObligationsProps) {
  const queryParams =
    filter === "all"
      ? undefined
      : filter === "overdue"
        ? { overdue: true }
        : { status: filter as "OPEN" | "DONE" };

  const { data: obligations = [], isLoading } =
    useGetObligationsQuery(queryParams);
  const [markDone] = useMarkObligationDoneMutation();
  const [reopenObligation] = useReopenObligationMutation();
  const [deleteObligation] = useDeleteObligationMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedObligation, setSelectedObligation] =
    useState<Obligation | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === "OPEN" && new Date(dueDate) < new Date();
  };

  const handleMarkDone = async (id: string) => {
    try {
      await markDone(id).unwrap();
    } catch (error) {
      console.log("Error marking obligation as done:", error);
    }
  };

  const handleReopen = async (id: string) => {
    try {
      await reopenObligation(id).unwrap();
    } catch (error) {
      console.log("Error reopening obligation:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedObligation) return;
    try {
      await deleteObligation(selectedObligation._id).unwrap();
      setDeleteDialogOpen(false);
      setSelectedObligation(null);
    } catch (error) {
      console.log("Error deleting obligation:", error);
    }
  };

  const confirmDelete = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setDeleteDialogOpen(true);
  };

  return {
    obligations,
    isLoading,
    formatDate,
    isOverdue,
    handleMarkDone,
    handleReopen,
    confirmDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete,
    selectedObligation
  };
}
