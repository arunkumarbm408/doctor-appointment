const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");

const submitPaymentDetails = asyncHandler(async (req, res) => {
  const { appointmentId, utrId, amount } = req.body;

  if (!appointmentId) {
    res.status(400);
    throw new Error("Appointment ID is required");
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.patient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this appointment");
  }

  const screenshotPath = req.file ? `/uploads/${req.file.filename}` : "";

  let payment = await Payment.findOne({ appointment: appointmentId });
  if (payment) {
    payment.utrId = utrId || payment.utrId;
    if (screenshotPath) payment.screenshot = screenshotPath;
    await payment.save();
  } else {
    // Standardizing amount or falling back if not provided in request
    const paymentAmount = amount || 500; 
    payment = await Payment.create({
      patient: req.user._id,
      doctor: appointment.doctor,
      appointment: appointment._id,
      amount: paymentAmount,
      utrId: utrId || "",
      screenshot: screenshotPath,
      method: "PhonePe",
    });
  }

  appointment.paymentStatus = "Pending";
  // The appointment itself stays "Pending" until the admin approves it
  if (appointment.status === "Cancelled" || appointment.status === "Rejected") {
     appointment.status = "Pending"; 
  }
  await appointment.save();

  res.status(201).json({
    success: true,
    message: "Payment details submitted successfully",
    data: payment,
  });
});

module.exports = { submitPaymentDetails };
