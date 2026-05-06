const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../utils/asyncHandler");

const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, appointmentDate, timeSlot, symptoms, paymentMethod } = req.body;

  const doctor = await Doctor.findById(doctorId).populate("user", "name");
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate,
    timeSlot,
    status: { $in: ["Pending", "Approved", "Completed"] },
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error("This slot has already been booked");
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    appointmentDate,
    timeSlot,
    symptoms,
    paymentMethod: paymentMethod || "Pay at clinic",
    paymentStatus: paymentMethod && paymentMethod !== "Pay at clinic" ? "Paid" : "Pending",
  });

  const populatedAppointment = await appointment.populate([
    { path: "patient", select: "name email phone" },
    {
      path: "doctor",
      populate: { path: "user", select: "name email" },
    },
  ]);

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    data: populatedAppointment,
  });
});

const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name email phone" },
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: appointments,
  });
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    patient: req.user._id,
  });

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.status === "Completed") {
    res.status(400);
    throw new Error("Completed appointments cannot be cancelled");
  }

  appointment.status = "Cancelled";
  await appointment.save();

  res.json({
    success: true,
    message: "Appointment cancelled successfully",
    data: appointment,
  });
});

module.exports = { createAppointment, getMyAppointments, cancelAppointment };
