const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  verifyDob, 
  resetPasswordWithDob,
  getWishlist,    // 🔥 Ensure this is imported
  toggleWishlist  // 🔥 Ensure this is imported
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-dob", verifyDob);
router.post("/reset-password", resetPasswordWithDob);

// 🔥 WISHLIST ROUTES (These were missing in your screenshot)
router.get("/wishlist", authenticate, getWishlist);
router.put("/wishlist/toggle", authenticate, toggleWishlist);

module.exports = router;