type Customer = {
  _id: string;
  name: string;
  phone?: string;
  balance: number;
};

type CustomerStatement = {
  customerId: string;
  currentBalance: number;
  transactions: {
    _id: string;
    type: "IN" | "OUT";
    amount: number;
    description: string;
    balanceAfter: number;
    createdAt: string;
  }[];
};