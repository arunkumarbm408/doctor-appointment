const express = require("express");
const { submitPaymentDetails } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("patient"),
  upload.single("screenshot"),
  submitPaymentDetails
);

module.exports = router;
