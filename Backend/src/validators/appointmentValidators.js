const { body } = require("express-validator");

const createAppointmentValidation = [
  body("doctorId").isMongoId().withMessage("Valid doctorId is required"),
  body("appointmentDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("timeSlot").trim().notEmpty().withMessage("Time slot is required"),
];

module.exports = { createAppointmentValidation };
