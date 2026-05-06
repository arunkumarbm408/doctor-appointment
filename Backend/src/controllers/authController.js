const User = require("../models/User");
const Doctor = require("../models/Doctor");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { autoApproveDoctors } = require("../config/appConfig");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "patient", phone, location } = req.body;

  if (role === "admin") {
    res.status(403);
    throw new Error("Admin accounts cannot be created through public registration");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    location,
  });

  if (role === "doctor") {
    await Doctor.create({
      user: user._id,
      specialization: req.body.specialization || "General Physician",
      experience: Number(req.body.experience || 0),
      fees: Number(req.body.fees || 0),
      location: req.body.location || "TBD",
      qualifications: req.body.qualifications || [],
      about: req.body.about || "",
      isApproved: autoApproveDoctors,
    });
  }

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken({ id: user._id, role: user.role }),
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      },
      token: generateToken({ id: user._id, role: user.role }),
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  const doctorProfile =
    req.user.role === "doctor"
      ? await Doctor.findOne({ user: req.user._id }).populate("user", "name email phone location")
      : null;

  res.json({
    success: true,
    data: {
      user: req.user,
      doctorProfile,
    },
  });
});

module.exports = { register, login, getMe };
