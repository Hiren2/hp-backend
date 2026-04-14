const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  updateUserStatus, 
  getAuditLogs,
} = require("../controllers/adminController");

const { getAllOrders } = require("../controllers/orderController");

/* TEST */
router.get("/ping", (req, res) => {
  res.send("ADMIN ROUTE WORKING");
});

/* ADMIN DASHBOARD STATS */
router.get(
  "/stats",
  authenticate,
  adminMiddleware,
  getAdminStats
);

/* USERS */
router.get(
  "/users",
  authenticate,
  adminMiddleware,
  getAllUsers
);

router.put(
  "/users/:id/role",
  authenticate,
  adminMiddleware,
  updateUserRole
);

/* 🔥 KILL SWITCH ROUTE */
router.put(
  "/users/:id/status",
  authenticate,
  adminMiddleware,
  updateUserStatus
);

/* ORDER HISTORY */
router.get(
  "/orders",
  authenticate,
  adminMiddleware,
  getAllOrders
);

/* AUDIT LOGS */
router.get(
  "/audit-logs",
  authenticate,
  superAdminMiddleware,
  getAuditLogs
);

module.exports = router;