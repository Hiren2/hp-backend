const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const {
  getAuditLogs,
} = require("../controllers/superAdminController");

/* SUPER ADMIN AUDIT LOGS */

router.get(
  "/audit-logs",
  authenticate,
  superAdminMiddleware,
  getAuditLogs
);

module.exports = router;