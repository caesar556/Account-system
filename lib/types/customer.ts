export interface ICustomer {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  category: "regular" | "vip" | "wholesale";
  creditLimit: number;
  currentBalance: number;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerRecord {
  _id: string;
  customerId: string;
  title: string;
  description?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "OPEN" | "PAID" | "PARTIAL";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  category?: "regular" | "vip" | "wholesale";
  creditLimit?: number;
  notes?: string;
}

export interface ICustomerListItem extends ICustomer {
  totalDebt: number;
  totalCredit: number;
  status: "active" | "overdue" | "inactive";
}
