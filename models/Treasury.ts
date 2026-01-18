import mongoose from "mongoose";

const TreasurySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

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

    minBalance: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    closedAt: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Treasury =
  mongoose.models.Treasury || mongoose.model("Treasury", TreasurySchema);
