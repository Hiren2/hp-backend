const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const {
  getAuditLogs,
  getAllUsers,
  updateUserRole
} = require("../controllers/superAdminController");

/* ================= SUPER ADMIN AUDIT LOGS ================= */
router.get(
  "/audit-logs",
  authenticate,
  superAdminMiddleware,
  getAuditLogs
);

/* ================= 🔥 NEW: GET ALL USERS FOR ROLE MANAGEMENT ================= */
router.get(
  "/users",
  authenticate,
  superAdminMiddleware,
  getAllUsers
);

/* ================= 🔥 NEW: UPDATE USER ROLE ================= */
router.put(
  "/users/:id/role",
  authenticate,
  superAdminMiddleware,
  updateUserRole
);

module.exports = router;