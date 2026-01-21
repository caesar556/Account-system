import mongoose from "mongoose";

export interface ITreasury {
  _id: string;
  name: string;

  type: TreasuryType;
  currency: CurrencyType;
  description?: string;
  initalBalance?: number;

  currentBalance: number;
  minBalance?: number;

  isDefault: boolean;
  isActive: boolean;

  closedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
export type TreasuryType = "CASH" | "BANK" | "PETTY_CASH";

export type CurrencyType = "EGP" | "USD" | "EUR";
