const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (_req, res) => {
  const [users, doctors, approvedDoctors, appointments, pendingAppointments] = await Promise.all([
    User.countDocuments(),
    Doctor.countDocuments(),
    Doctor.countDocuments({ isApproved: true }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "Pending" }),
  ]);

  res.json({
    success: true,
    data: {
      users,
      doctors,
      approvedDoctors,
      appointments,
      pendingAppointments,
    },
  });
});

const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

const getPendingDoctors = asyncHandler(async (_req, res) => {
  const doctors = await Doctor.find().populate("user", "name email phone location").sort({ createdAt: -1 });
  res.json({ success: true, data: doctors });
});

const approveDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  doctor.isApproved = req.body.isApproved;
  await doctor.save();

  res.json({
    success: true,
    message: `Doctor ${doctor.isApproved ? "approved" : "marked as pending"} successfully`,
    data: doctor,
  });
});

const getAllAppointments = asyncHandler(async (_req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "name email phone")
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name email phone" },
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: appointments });
});

const getPendingPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ status: "Pending" })
    .populate("patient", "name email phone")
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name email phone" },
    })
    .populate("appointment", "appointmentDate timeSlot")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: payments });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isApproved, adminNote } = req.body;

  const payment = await Payment.findById(id).populate("appointment");
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  if (isApproved) {
    payment.status = "Approved";
    payment.appointment.status = "Pending"; // Wait for doctor approval
    payment.appointment.paymentStatus = "Paid";
  } else {
    payment.status = "Rejected";
    payment.appointment.status = "Cancelled";
  }
  
  if (adminNote) payment.adminNote = adminNote;

  await payment.appointment.save();
  await payment.save();

  res.json({
    success: true,
    message: `Payment ${isApproved ? "approved" : "rejected"} successfully`,
    data: payment,
  });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getPendingDoctors,
  approveDoctor,
  getAllAppointments,
  getPendingPayments,
  verifyPayment,
};
