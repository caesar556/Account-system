export type TransactionType = "DEBIT" | "CREDIT";
export type PaymentMethod = "CASH" | "TRANSFER" | "CHEQUE";

export interface ITransaction {
  _id: string;
  treasuryId: string;
  customerId?: string;
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  description: string;
  referenceType: "CUSTOMER_RECORD" | "MANUAL" | "ADJUSTMENT";
  referenceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentRequest {
  recordId: string;
  amount: number;
  treasuryId: string;
  paymentMethod: PaymentMethod;
  description?: string;
}
