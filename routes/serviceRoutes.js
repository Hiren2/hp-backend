const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

/* 🔥 MULTER SETUP */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const {
  getServices,
  createService,
  updateService,
  deleteService,
  getServiceAnalytics,
  getRelatedServices 
} = require("../controllers/serviceController");

/* ================= PUBLIC / USER ROUTES ================= */

router.get(
  "/",
  authenticate,
  getServices
);

// 🔥 RELATED SERVICES (Must be above /:id admin routes)
router.get(
  "/:id/related",
  authenticate,
  getRelatedServices
);

/* ================= ADMIN ================= */

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  upload.single("image"),
  createService
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  upload.single("image"),
  updateService
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  deleteService
);

router.get(
  "/analytics/top",
  authenticate,
  authorizeRoles("admin", "superadmin"),
  getServiceAnalytics
);

module.exports = router;