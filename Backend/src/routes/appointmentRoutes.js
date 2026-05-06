const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { createAppointmentValidation } = require("../validators/appointmentValidators");

const router = express.Router();

router.post("/", protect, authorize("patient"), createAppointmentValidation, validate, createAppointment);
router.get("/me", protect, authorize("patient"), getMyAppointments);
router.patch("/:id/cancel", protect, authorize("patient"), cancelAppointment);

module.exports = router;
