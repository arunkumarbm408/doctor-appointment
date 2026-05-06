require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const { users } = require("./sampleData");

const seed = async () => {
  try {
    await connectDB();

    await Payment.deleteMany();
    await Appointment.deleteMany();
    await Doctor.deleteMany();
    await User.deleteMany();

    const createdUsers = [];
    for (const userPayload of users) {
      const user = await User.create(userPayload);
      createdUsers.push(user);
    }

    const doctorUser = createdUsers.find((user) => user.role === "doctor");
    const patientUser = createdUsers.find((user) => user.role === "patient");

    const doctor = await Doctor.create({
      user: doctorUser._id,
      specialization: "Cardiologist",
      experience: 8,
      fees: 1200,
      location: "Delhi",
      about: "Specialist in preventive cardiology and long-term heart care.",
      qualifications: ["MBBS", "MD Cardiology"],
      isApproved: true,
      availabilitySlots: [
        { day: "Monday", startTime: "10:00", endTime: "13:00", maxPatients: 1 },
        { day: "Wednesday", startTime: "15:00", endTime: "18:00", maxPatients: 1 },
      ],
    });

    await Appointment.create({
      patient: patientUser._id,
      doctor: doctor._id,
      appointmentDate: "2026-05-10",
      timeSlot: "10:00 - 10:30",
      status: "Approved",
      paymentStatus: "Paid",
      paymentMethod: "Stripe",
      symptoms: "Routine check-up",
    });

    console.log("Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
