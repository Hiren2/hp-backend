const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  verifyDob, 
  resetPasswordWithDob,
  getWishlist,    
  toggleWishlist,
  updateProfile // 🔥 Ye naya controller import kiya
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-dob", verifyDob);
router.post("/reset-password", resetPasswordWithDob);

// 🔥 WISHLIST ROUTES
router.get("/wishlist", authenticate, getWishlist);
router.put("/wishlist/toggle", authenticate, toggleWishlist);

// 🔥 PROFILE UPDATE ROUTE (The Fix)
router.put("/profile", authenticate, updateProfile);

module.exports = router;