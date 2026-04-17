const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  verifyDob, 
  resetPasswordWithDob,
  getWishlist,    
  toggleWishlist,
  updateProfile,
  changePassword // 🔥 Imported the new controller function
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

// ================= PUBLIC AUTH ROUTES =================
router.post("/register", register);
router.post("/login", login);
router.post("/verify-dob", verifyDob);
router.post("/reset-password", resetPasswordWithDob);

// ================= PROTECTED WISHLIST ROUTES =================
router.get("/wishlist", authenticate, getWishlist);
router.put("/wishlist/toggle", authenticate, toggleWishlist);

// ================= PROTECTED PROFILE ROUTE =================
router.put("/profile", authenticate, updateProfile);

// ================= 🔥 NEW: SECURE CHANGE PASSWORD ROUTE =================
router.put("/change-password", authenticate, changePassword);

module.exports = router;