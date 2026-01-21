import mongoose from "mongoose";

const CustomerRecordSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    title: { type: String, required: true },
    description: String,

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueDate: Date,

    status: {
      type: String,
      enum: ["OPEN", "PAID"],
      default: "OPEN",
    },
  },
  { timestamps: true },
);

CustomerRecordSchema.index({ customerId: 1, status: 1 });
CustomerRecordSchema.index({ dueDate: 1 });
CustomerRecordSchema.index({ status: 1 });

export default mongoose.models.CustomerRecord ||
  mongoose.model("CustomerRecord", CustomerRecordSchema);
