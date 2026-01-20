import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTransactionMutation } from "@/store/transactions/transactionsApi";
import { useGetTreasuriesQuery } from "@/store/treasuries/treasuriesApi";
import { useGetCustomersQuery } from "@/store/customers/customersApi";
import {
  transactionSchema,
  type TransactionInput,
} from "@/lib/validation/transaction";
import { useState, useEffect } from "react";

interface UseTransactionFormProps {
  defaultCustomerId?: string;
  defaultType?: "DEBIT" | "CREDIT";
  onSuccess?: () => void;
}

export function useTransactionForm({
  defaultCustomerId,
  defaultType = "DEBIT",
  onSuccess,
}: UseTransactionFormProps = {}) {
  const [createTransaction, { isLoading: isSubmitting }] =
    useCreateTransactionMutation();
  const { data: treasuriesData, isLoading: loadingTreasuries } =
    useGetTreasuriesQuery();
  const { data: customersData, isLoading: loadingCustomers } =
    useGetCustomersQuery();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: defaultType,
      amount: 0,
      description: "",
      paymentMethod: "CASH",
      referenceType: "MANUAL",
      treasuryId: "",
      referenceId: "",
      customerId: defaultCustomerId || "",
    },
  });

  const watchCustomerId = form.watch("customerId");
  const watchAmount = form.watch("amount") || 0;
  const watchType = form.watch("type");

  // Update selected customer when ID changes
  useEffect(() => {
    if (watchCustomerId && customersData?.data) {
      const customer = customersData.data.find(
        (c) => c._id === watchCustomerId,
      );
      setSelectedCustomer(customer || null);
    } else {
      setSelectedCustomer(null);
    }
  }, [watchCustomerId, customersData]);

  // Calculate projected balance
  const projectedBalance = selectedCustomer
    ? watchType === "DEBIT"
      ? selectedCustomer.currentBalance + watchAmount
      : selectedCustomer.currentBalance - watchAmount
    : null;

  // Check if near credit limit
  const isNearCreditLimit =
    selectedCustomer && selectedCustomer.creditLimit > 0
      ? (selectedCustomer.currentBalance / selectedCustomer.creditLimit) * 100 >
        70
      : false;

  // Check if exceeds credit limit
  const exceedsCreditLimit =
    selectedCustomer && selectedCustomer.creditLimit > 0
      ? projectedBalance !== null &&
        projectedBalance > selectedCustomer.creditLimit
      : false;

  const handleSubmit = async (data: TransactionInput) => {
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...data,
        customerId: data.customerId || undefined,
      };

      await createTransaction(payload).unwrap();

      setSuccess(true);
      form.reset();

      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }

      // Auto-hide success
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.data?.error || err.message || "حدث خطأ");
      console.error("Transaction error:", err);
    }
  };

  return {
    form,
    handleSubmit,
    isSubmitting,
    error,
    success,
    selectedCustomer,
    projectedBalance,
    isNearCreditLimit,
    exceedsCreditLimit,
    loadingTreasuries,
    loadingCustomers,
    treasuries: treasuriesData?.data?.filter((t: any) => t.isActive) || [],
    customers: customersData?.data?.filter((c: any) => c.isActive) || [],
  };
}
