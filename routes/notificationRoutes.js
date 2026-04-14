const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAllRead
} = require("../controllers/notificationController");

/* GET */
router.get(
  "/",
  authenticate,
  getNotifications
);

/* 🔥 MARK ALL READ */
router.put(
  "/read-all",
  authenticate,
  markAllRead
);

module.exports = router;