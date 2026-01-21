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

    isActive: {
      type: Boolean,
      default: true,
    },

    notes: String,
  },
  { timestamps: true },
);

CustomerSchema.index({ name: 1 });
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ isActive: 1 });

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
