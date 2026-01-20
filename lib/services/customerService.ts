import Customer from "@/models/Customer";
import { ICustomer } from "../types/customer";

export class CustomerService {
  static async updateBalance(
    customerId: string,
    amount: number,
    type: "DEBIT" | "CREDIT",
  ): Promise<void> {
    const balanceChange = type === "DEBIT" ? amount : -amount;

    await Customer.findByIdAndUpdate(
      customerId,
      { $inc: { currentBalance: balanceChange } },
      { new: true },
    );
  }

  static async getCustomer(id: string): Promise<ICustomer | null> {
    return await Customer.findById(id).lean();
  }

  static async checkCreditLimit(
    customerId: string,
    additionalAmount: number,
  ): Promise<boolean> {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.creditLimit <= 0) return true;

    const projectedBalance = customer.currentBalance + additionalAmount;

    return projectedBalance <= customer.creditLimit;
  }
}
