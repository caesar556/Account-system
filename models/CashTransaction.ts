import mongoose from "mongoose";

const CashTransactionSchema = new mongoose.Schema(
  {
    treasuryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treasury",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "TRANSFER", "CHEQUE"],
      default: "CASH",
    },

    description: {
      type: String,
      required: true,
    },

    referenceType: {
      type: String,
      enum: ["CUSTOMER_RECORD", "MANUAL", "ADJUSTMENT"],
      default: "MANUAL",
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

CashTransactionSchema.index({ customerId: 1, createdAt: -1 });
CashTransactionSchema.index({ treasuryId: 1, createdAt: -1 });

export const CashTransaction =
  mongoose.models.CashTransaction ||
  mongoose.model("CashTransaction", CashTransactionSchema);
