import { Treasury } from "@/models/Treasury";
import { CashTransaction } from "@/models/CashTransaction";
import Customer from "@/models/Customer";

export async function createCashTransaction(data: any) {
  const { treasuryId, customerId, type, amount } = data;

  const treasury = await Treasury.findById(treasuryId);
  if (!treasury || !treasury.isActive) {
    throw new Error("الخزنة غير متاحة");
  }

  let customer = null;
  if (customerId && customerId !== "none") {
    customer = await Customer.findById(customerId);
    if (!customer || !customer.isActive) {
      throw new Error("العميل غير متاح");
    }
  }

  if (customer && type === "OUT" && (customer as any).creditLimit > 0) {
    const agg = await CashTransaction.aggregate([
      { $match: { customerId: customer._id } },
      {
        $group: {
          _id: null,
          balance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "OUT"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
        },
      },
    ]);

    const currentBalance = agg[0]?.balance || 0;
    const projectedBalance = currentBalance + amount;

    if (projectedBalance > (customer as any).creditLimit) {
      throw new Error(`العميل تجاوز الحد الائتماني (${(customer as any).creditLimit})`);
    }
  }

  const transaction = await CashTransaction.create({
    ...data,
    customerId: customer ? customer._id : null,
  });

  return transaction;
}
