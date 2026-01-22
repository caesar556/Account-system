import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { transactionSchema } from "@/lib/validation/transaction";

import { useCreateTransactionMutation } from "@/store/transactions/transactionsApi";
import { useGetTreasuriesQuery } from "@/store/treasuries/treasuriesApi";
import {
  useGetCustomersQuery,
  useGetCustomerSummaryQuery,
} from "@/store/customers/customersApi";

import { ICustomer } from "@/lib/types/customer";
import { ITreasury } from "@/lib/types/treasure";
import z from "zod";

interface UseTransactionFormProps {
  defaultCustomerId?: string;
  defaultType?: "DEBIT" | "CREDIT";
  onSuccess?: () => void;
}

function calculateProjectedBalance(
  currentBalance: number,
  amount: number,
  type: "DEBIT" | "CREDIT",
) {
  return type === "DEBIT" ? currentBalance + amount : currentBalance - amount;
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

  const form = useForm<z.input<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: defaultType,
      amount: 0,
      description: "",
      paymentMethod: "CASH",
      referenceType: "MANUAL",
      treasuryId: "",
      referenceId: null,
      customerId: defaultCustomerId || null,
    },
  });

  const customerId = useWatch({
    control: form.control,
    name: "customerId",
  });

  const amount = useWatch({
    control: form.control,
    name: "amount",
  }) as number;

  const type = useWatch({
    control: form.control,
    name: "type",
  }) as "DEBIT" | "CREDIT";

  const {
    data: customerSummary,
    isLoading: loadingCustomerSummary,
    refetch: refetchCustomerSummary,
  } = useGetCustomerSummaryQuery((customerId as string) || "", {
    skip: !customerId || customerId === "NO_CUSTOMER",
  });

  const customers: ICustomer[] = customersData || [];
  const treasuries: ITreasury[] = treasuriesData || [];

  const selectedCustomer = useMemo(() => {
    if (!customerId || customerId === "NO_CUSTOMER") return null;
    return customers.find((c) => c._id === customerId) || null;
  }, [customerId, customers]);

  const currentBalance = useMemo(() => {
    return customerSummary?.balance?.current || 0;
  }, [customerSummary]);

  const projectedBalance = useMemo(() => {
    if (customerId === "NO_CUSTOMER" || !customerId) return null;
    return calculateProjectedBalance(currentBalance, amount, type);
  }, [selectedCustomer, currentBalance, amount, type]);

  const isNearCreditLimit = useMemo(() => {
    if (
      !selectedCustomer ||
      selectedCustomer.creditLimit <= 0 ||
      projectedBalance === null
    )
      return false;

    return projectedBalance / selectedCustomer.creditLimit >= 0.7;
  }, [selectedCustomer, projectedBalance]);

  const exceedsCreditLimit = useMemo(() => {
    if (
      !selectedCustomer ||
      selectedCustomer.creditLimit <= 0 ||
      projectedBalance === null
    )
      return false;

    return type === "DEBIT" && projectedBalance > selectedCustomer.creditLimit;
  }, [selectedCustomer, projectedBalance, type]);

  const handleSubmit = async (data: z.output<typeof transactionSchema>) => {
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...data,
        customerId:
          !data.customerId || data.customerId === "NO_CUSTOMER"
            ? undefined
            : data.customerId,
        referenceId: data.referenceId ?? undefined,
      };

      await createTransaction(payload).unwrap();

      setSuccess(true);

      form.reset({
        type: defaultType,
        customerId: defaultCustomerId || "NO_CUSTOMER",
        amount: 0,
        description: "",
        paymentMethod: "CASH",
        referenceType: "MANUAL",
        treasuryId: "",
        referenceId: null,
      });

      onSuccess?.();
    } catch (err: any) {
      setError(err.error ?? err?.message ?? "حدث خطأ");
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
    loadingCustomers,
    loadingTreasuries,
    loadingCustomerSummary,
    customers,
    treasuries,
  };
}
