const { body } = require("express-validator");

const doctorProfileValidation = [
  body("specialization").trim().notEmpty().withMessage("Specialization is required"),
  body("experience").isInt({ min: 0 }).withMessage("Experience must be a positive number"),
  body("fees").isFloat({ min: 0 }).withMessage("Fees must be a positive number"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("availabilitySlots")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) {
        return true;
      }
      if (typeof value === "string") {
        JSON.parse(value);
        return true;
      }
      throw new Error("Availability slots must be a valid JSON array");
    }),
];

module.exports = { doctorProfileValidation };
