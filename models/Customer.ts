import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    address: String,

    category: {
      type: String,
      enum: ["regular", "vip", "wholesale"],
      default: "regular",
    },

    creditLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentBalance: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    notes: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

CustomerSchema.virtual("totalDebt").get(function () {
  return Math.max(0, this.currentBalance);
});

CustomerSchema.virtual("totalCredit").get(function () {
  return Math.max(0, -this.currentBalance);
});

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
