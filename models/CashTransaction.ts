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
        "CUSTOMER_SALE",
        "CUSTOMER_PAYMENT",
        "CUSTOMER_REFUND",
        "EXPENSE",
        "WITHDRAW",
        "DEPOSIT",
        "TREASURY_TRANSFER",
        "ADJUSTMENT",
      ],
      required: true,
    },

    description: String,

    method: {
      type: String,
      enum: ["CASH", "TRANSFER", "CHEQUE"],
      default: "CASH",
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    referenceType: {
      type: String,
      enum: ["CUSTOMER_RECORD", "EXPENSE", "MANUAL"],
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
