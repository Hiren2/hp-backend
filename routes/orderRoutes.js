const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteMyOrder,
  getManagerStats, 
  getAdminStats,
  capturePayment // 🔥 Payment function import kiya
} = require("../controllers/orderController");

/* ================= STATS (NEW) ================= */

router.get(
  "/admin/stats",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getAdminStats
);

router.get(
  "/manager/stats",
  authenticate,
  authorizeRoles("manager", "admin", "superadmin"),
  getManagerStats
);

/* ================= MOCK PAYMENT GATEWAY ================= */

// 🔥 Naya route for payment success capture
router.post(
  "/payment",
  authenticate,
  authorizeRoles("user", "manager", "admin", "superadmin"),
  capturePayment
);

/* ================= USER ================= */

router.post(
  "/",
  authenticate,
  authorizeRoles("user", "manager", "admin", "superadmin"),
  createOrder
);

router.get(
  "/my",
  authenticate,
  authorizeRoles("user", "manager", "admin", "superadmin"),
  getMyOrders
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("user", "manager", "admin", "superadmin"),
  deleteMyOrder
);

/* ================= ADMIN / MANAGER ================= */

router.get(
  "/admin",
  authenticate,
  authorizeRoles("admin", "manager"),
  getAllOrders
);

router.put(
  "/admin/:id",
  authenticate,
  authorizeRoles("admin", "manager"),
  updateOrderStatus
);

module.exports = router;