const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const {
  getAuditLogs,
  getAllUsers,
  updateUserRole
} = require("../controllers/superAdminController");


router.get(
  "/audit-logs",
  authenticate,
  superAdminMiddleware,
  getAuditLogs
);


router.get(
  "/users",
  authenticate,
  superAdminMiddleware,
  getAllUsers
);


router.put(
  "/users/:id/role",
  authenticate,
  superAdminMiddleware,
  updateUserRole
);

module.exports = router;