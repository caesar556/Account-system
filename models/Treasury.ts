import mongoose from "mongoose";

const TreasurySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CASH", "BANK", "PETTY_CASH"],
      default: "CASH",
    },

    currency: {
      type: String,
      enum: ["EGP", "USD", "EUR"],
      default: "EGP",
    },

    isDefault: { type: Boolean, default: false },

    closedAt: Date,

    name: {
      type: String,
      required: true,
      unique: true,
    },
    initialBalance: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: String,
  },
  { timestamps: true },
);

export const Treasury =
  mongoose.models.Treasury || mongoose.model("Treasury", TreasurySchema);
