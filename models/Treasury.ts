import mongoose from "mongoose";

const TreasurySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    balance: {
      type: Number,
      default: 0,
    },
    minBalance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Treasury =
  mongoose.models.Treasury || mongoose.model("Treasury", TreasurySchema);
