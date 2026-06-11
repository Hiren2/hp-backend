const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createReview,
  getReviews,
  getAllReviews,
  deleteReview
} = require("../controllers/reviewController");

// Public/User Routes
router.get("/service/:serviceId", getReviews);
router.post("/", authenticate, createReview);

// 🔥 Admin/SuperAdmin Routes
router.get("/all", authenticate, authorizeRoles("admin", "superadmin"), getAllReviews);
router.delete("/:id", authenticate, authorizeRoles("admin", "superadmin"), deleteReview);

module.exports = router;