const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAllRead,
  deleteNotification,
  clearAllNotifications // 🔥 Imported the new function
} = require("../controllers/notificationController");


router.get(
  "/",
  authenticate,
  getNotifications
);

router.put(
  "/read-all",
  authenticate,
  markAllRead
);

// 🔥 NEW: Bulk Clear Route (MUST BE ABOVE /:id)
router.delete(
  "/clear-all",
  authenticate,
  clearAllNotifications
);

// 🔥 NEW: Single Delete Route
router.delete(
  "/:id",
  authenticate,
  deleteNotification
);

module.exports = router;