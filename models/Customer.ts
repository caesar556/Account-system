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

    address: {
      type: String,
      trim: true,
    },

    creditLimit: {
      type: Number,
      default: 0,
    },

    balance: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },

    category: {
      type: String,
      enum: ["regular", "vip", "wholesale"],
      default: "regular",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);