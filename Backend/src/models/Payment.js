const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor:  { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    amount:     { type: Number, required: true },
    utrId:      { type: String, trim: true, default: "" },
    screenshot: { type: String, default: "" },
    method:     { type: String, default: "PhonePe" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
