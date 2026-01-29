export interface Obligation {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  partyName: string;
  dueDate: string;
  status: "OPEN" | "DONE";
  doneAt?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateObligationInput {
  title: string;
  description?: string;
  amount: number;
  partyName: string;
  dueDate: string;
  notes?: string;
}