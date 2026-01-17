import mongoose from "mongoose";

const CustomerRecordSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["OPEN", "PARTIAL", "PAID"],
      default: "OPEN",
    },

    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.CustomerRecord ||
  mongoose.model("CustomerRecord", CustomerRecordSchema);
