const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const {
  getAllOrders,
  updateOrderStatus,
  getManagerStats
} = require("../controllers/orderController");

/* ================= MANAGER ================= */

// ✅ Get all orders
router.get(
  "/orders",
  authenticate,
  authorizeRoles("manager"),
  getAllOrders
);

// ✅ Update order status
router.put(
  "/orders/:id",
  authenticate,
  authorizeRoles("manager"),
  updateOrderStatus
);

// ✅ Get manager stats (🔥 chart fix)
router.get(
  "/stats",
  authenticate,
  authorizeRoles("manager"),
  getManagerStats
);

module.exports = router;