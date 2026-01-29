import mongoose from "mongoose";

const ObligationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    partyName: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "DONE"],
      default: "OPEN",
    },

    doneAt: {
      type: Date,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Obligation ||
  mongoose.model("Obligation", ObligationSchema);