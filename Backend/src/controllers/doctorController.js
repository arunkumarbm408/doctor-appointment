const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { autoApproveDoctors } = require("../config/appConfig");

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSpecializationRegex = (value) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }

  const normalized = raw.toLowerCase();
  const suffixes = ["ologist", "ology", "ician", "ian", "ics", "ist", "ry", "er"];
  let root = normalized;

  for (const suffix of suffixes) {
    if (root.endsWith(suffix) && root.length > suffix.length + 2) {
      root = root.slice(0, -suffix.length);
      break;
    }
  }

  return new RegExp(escapeRegex(root), "i");
};

const listDoctors = asyncHandler(async (req, res) => {
  const { specialization, location, search, page = 1, limit = 9 } = req.query;
  const baseQuery = {};
  const query = { ...baseQuery };
  const trimmedSpecialization = String(specialization || "").trim();
  const trimmedLocation = String(location || "").trim();
  const trimmedSearch = String(search || "").trim();
  const specializationRegex = buildSpecializationRegex(trimmedSpecialization);
  const searchSpecializationRegex = buildSpecializationRegex(trimmedSearch);
  const selectedSort = { isApproved: -1, createdAt: -1 };

  if (specializationRegex) {
    query.specialization = specializationRegex;
  }
  if (trimmedLocation) {
    query.location = new RegExp(trimmedLocation, "i");
  }
  if (trimmedSearch) {
    const matchingUsers = await User.find({
      role: "doctor",
      name: new RegExp(trimmedSearch, "i"),
    }).select("_id");

    query.$or = [
      { specialization: searchSpecializationRegex || new RegExp(trimmedSearch, "i") },
      { location: new RegExp(trimmedSearch, "i") },
      { user: { $in: matchingUsers.map((user) => user._id) } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  let [doctors, total] = await Promise.all([
    Doctor.find(query)
      .populate("user", "name email phone")
      .sort(selectedSort)
      .skip(skip)
      .limit(Number(limit)),
    Doctor.countDocuments(query),
  ]);

  if (doctors.length === 0 && (trimmedSpecialization || trimmedLocation || trimmedSearch)) {
    [doctors, total] = await Promise.all([
      Doctor.find(baseQuery)
        .populate("user", "name email phone")
        .sort(selectedSort)
        .skip(skip)
        .limit(Number(limit)),
      Doctor.countDocuments(baseQuery),
    ]);
  }

  res.json({
    success: true,
    data: doctors,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

const getDoctorDetails = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate("user", "name email phone location");

  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  const bookedSlots = await Appointment.find({
    doctor: doctor._id,
    status: { $in: ["Pending", "Approved", "Completed"] },
  }).select("appointmentDate timeSlot status");

  res.json({
    success: true,
    data: { doctor, bookedSlots },
  });
});

const upsertDoctorProfile = asyncHandler(async (req, res) => {
  const payload = {
    specialization: req.body.specialization,
    experience: req.body.experience,
    fees: req.body.fees,
    location: req.body.location,
    about: req.body.about || "",
    qualifications: req.body.qualifications
      ? Array.isArray(req.body.qualifications)
        ? req.body.qualifications
        : String(req.body.qualifications)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
      : [],
    availabilitySlots: req.body.availabilitySlots
      ? typeof req.body.availabilitySlots === "string"
        ? JSON.parse(req.body.availabilitySlots)
        : req.body.availabilitySlots
      : [],
    isApproved: autoApproveDoctors,
  };

  if (req.file) {
    payload.profileImage = `/uploads/${req.file.filename}`;
  }

  const doctor = await Doctor.findOneAndUpdate(
    { user: req.user._id },
    { ...payload, user: req.user._id },
    { new: true, upsert: true, runValidators: true }
  ).populate("user", "name email phone location");

  res.json({
    success: true,
    message: "Doctor profile saved successfully",
    data: doctor,
  });
});

const getMyDoctorAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor profile not found");
  }

  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate("patient", "name email phone")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: appointments,
  });
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    doctor: doctor?._id,
  });

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (req.body.status === "Approved") {
    if (appointment.paymentMethod !== "Pay at clinic" && appointment.paymentStatus !== "Paid") {
      res.status(400);
      throw new Error("Cannot approve an appointment until payment is verified.");
    }
  }

  appointment.status = req.body.status;
  appointment.notes = req.body.notes || appointment.notes;
  await appointment.save();

  res.json({
    success: true,
    message: "Appointment updated successfully",
    data: appointment,
  });
});

module.exports = {
  listDoctors,
  getDoctorDetails,
  upsertDoctorProfile,
  getMyDoctorAppointments,
  updateAppointmentStatus,
};
