const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAllRead
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

module.exports = router;