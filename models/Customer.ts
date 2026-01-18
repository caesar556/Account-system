import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,

    category: {
      type: String,
      enum: ["regular", "vip", "wholesale"],
      default: "regular",
    },

    isActive: { type: Boolean, default: true },
    notes: String,
  },
  { timestamps: true },
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
