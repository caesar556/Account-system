import mongoose from "mongoose";

const CashTransactionSchema = new mongoose.Schema(
  {
    treasuryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treasury",
      required: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      enum: [
        "DEAL_PAYMENT",
        "EXPENSE",
        "WITHDRAW",
        "DEPOSIT",
        "ADJUSTMENT",
        "OTHER",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      enum: ["CASH", "TRANSFER", "CHEQUE"],
      default: "CASH",
    },

    referenceType: {
      type: String,
      enum: ["DEAL", "PAYMENT", "MANUAL"],
      default: "MANUAL",
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true },
);

export const CashTransaction =
  mongoose.models.CashTransaction ||
  mongoose.model("CashTransaction", CashTransactionSchema);
