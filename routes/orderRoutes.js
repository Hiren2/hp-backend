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
  capturePayment 
} = require("../controllers/orderController");

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

router.post(
  "/payment",
  authenticate,
  authorizeRoles("user", "manager", "admin", "superadmin"),
  capturePayment
);

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

// FRONTEND MATCHING ROUTES: Added these so ManagerOrders.js doesn't get 403 error
router.get(
  "/manager/orders",
  authenticate,
  authorizeRoles("manager", "admin", "superadmin"),
  getAllOrders
);

router.put(
  "/manager/orders/:id",
  authenticate,
  authorizeRoles("manager", "admin", "superadmin"),
  updateOrderStatus
);

// Fallback old routes
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