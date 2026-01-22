import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetCustomerRecordsQuery,
  useGetCustomerSummaryQuery,
  usePayRecordMutation,
} from "@/store/customers/customersApi";
import { useGetTreasuriesQuery } from "@/store/treasuries/treasuriesApi";

export function useCustomersRecords() {
  const { id } = useParams();
  const customerId = id as string;

  const {
    data: records,
    isLoading,
    isError,
    refetch,
  } = useGetCustomerRecordsQuery(customerId);

  const { data: summary } = useGetCustomerSummaryQuery(customerId);
  const { data: treasuries } = useGetTreasuriesQuery();

  const [payRecord] = usePayRecordMutation();

  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("");
  const [treasuryId, setTreasuryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const handlePay = async () => {
    if (!selectedRecord || !payAmount || !treasuryId) return;

    try {
      await payRecord({
        customerId,
        recordId: selectedRecord._id,
        amount: parseFloat(payAmount),
        treasuryId,
        paymentMethod,
      }).unwrap();

      setIsPayDialogOpen(false);
      setPayAmount("");
      setSelectedRecord(null);
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  return {
    customerId,
    records,
    summary,
    treasuries,
    isLoading,
    isError,
    refetch,
    isAddRecordOpen,
    setIsAddRecordOpen,
    isPayDialogOpen,
    setIsPayDialogOpen,
    selectedRecord,
    setSelectedRecord,
    payAmount,
    setPayAmount,
    treasuryId,
    setTreasuryId,
    paymentMethod,
    setPaymentMethod,
    handlePay,
  };
}
