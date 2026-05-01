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
  changePassword 
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");


router.post("/register", register);
router.post("/login", login);
router.post("/verify-dob", verifyDob);
router.post("/reset-password", resetPasswordWithDob);


router.get("/wishlist", authenticate, getWishlist);
router.put("/wishlist/toggle", authenticate, toggleWishlist);


router.put("/profile", authenticate, updateProfile);


router.put("/change-password", authenticate, changePassword);

module.exports = router;