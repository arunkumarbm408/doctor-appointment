const express = require("express");
const {
  getDashboardStats,
  getAllUsers,
  getPendingDoctors,
  approveDoctor,
  getAllAppointments,
  getPendingPayments,
  verifyPayment,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/doctors", getPendingDoctors);
router.patch("/doctors/:id/approve", approveDoctor);
router.get("/appointments", getAllAppointments);
router.get("/payments/pending", getPendingPayments);
router.patch("/payments/:id/verify", verifyPayment);

module.exports = router;
