"use client";
import { useState, useCallback } from "react";
import {
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "@/store/customers/customersApi";

export function useCustomer(customerId: string) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: customer,
    isLoading,
    error,
    refetch,
  } = useGetCustomerQuery(customerId, {
    skip: !customerId,
  });

  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const handleUpdate = useCallback(
    async (data: any) => {
      if (!customerId) return;
      try {
        await updateCustomer({ id: customerId, data }).unwrap();
        setIsEditDialogOpen(false);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || "Failed to update customer" };
      }
    },
    [customerId, updateCustomer]
  );

  const handleDelete = useCallback(async () => {
    if (!customerId) return;
    try {
      await deleteCustomer(customerId).unwrap();
      setIsDeleteDialogOpen(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to delete customer" };
    }
  }, [customerId, deleteCustomer]);

  return {
    customer,
    isLoading,
    error,
    refetch,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleUpdate,
    handleDelete,
    isUpdating,
    isDeleting,
  };
}
