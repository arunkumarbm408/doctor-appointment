const express = require("express");
const {
  listDoctors,
  getDoctorDetails,
  upsertDoctorProfile,
  getMyDoctorAppointments,
  updateAppointmentStatus,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { doctorProfileValidation } = require("../validators/doctorValidators");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", listDoctors);
router.get("/me/appointments", protect, authorize("doctor"), getMyDoctorAppointments);
router.put(
  "/me/profile",
  protect,
  authorize("doctor"),
  upload.single("profileImage"),
  doctorProfileValidation,
  validate,
  upsertDoctorProfile
);
router.patch("/appointments/:id/status", protect, authorize("doctor"), updateAppointmentStatus);
router.get("/:id", getDoctorDetails);

module.exports = router;
