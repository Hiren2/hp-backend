const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("../middleware/authMiddleware"); 

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Forbidden: No role found." });
    }
    const allowedRoles = roles.map(r => r.toLowerCase());
    const userRole = req.user.role.toLowerCase();

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: You don't have permission to perform this action." });
    }
    next();
  };
};

// 🔥 COUPON SCHEMA (WITH CATEGORY)
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true, unique: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  type: { type: String, enum: ["percent", "fixed"], required: true },
  value: { type: Number, required: true },
  maxDiscount: { type: Number, default: 10000 },
  applicableCategory: { type: String, default: "All" }, 
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

// @route   GET /api/coupons/active
// @desc    Get all active coupons (For Users & Admin)
router.get("/active", async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json(coupons);
  } catch (error) {
    console.error("Coupon Fetch Error:", error);
    res.status(500).json({ message: "Server Error fetching coupons" });
  }
});

// @route   POST /api/coupons
// @desc    Create a new coupon (Admin Only)
router.post("/", protect, checkRole("Admin", "SuperAdmin"), async (req, res) => {
  try {
    const { code, title, desc, type, value, maxDiscount, applicableCategory } = req.body;
    if (!code || !title || !desc || !type || !value) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (type === "fixed" && value > 10000) {
      return res.status(400).json({ message: "Fixed discount cannot exceed ₹10,000" });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: "Coupon code already exists" });

    const newCoupon = new Coupon({
      code: code.toUpperCase(), 
      title, 
      desc, 
      type, 
      value,
      maxDiscount: maxDiscount > 10000 ? 10000 : (maxDiscount || 10000),
      applicableCategory: applicableCategory ? applicableCategory.trim() : "All" 
    });

    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    console.error("Coupon Create Error:", error);
    res.status(500).json({ message: "Server Error creating coupon" });
  }
});

// 🔥 @route PUT /api/coupons/:id
// @desc    Update an existing coupon (Admin Only)
router.put("/:id", protect, checkRole("Admin", "SuperAdmin"), async (req, res) => {
  try {
    const { code, title, desc, type, value, maxDiscount, applicableCategory } = req.body;
    
    if (!code || !title || !desc || !type || !value) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (type === "fixed" && value > 10000) {
      return res.status(400).json({ message: "Fixed discount cannot exceed ₹10,000" });
    }

    // Check if the new code already belongs to ANOTHER coupon
    const existing = await Coupon.findOne({ code: code.toUpperCase(), _id: { $ne: req.params.id } });
    if (existing) return res.status(400).json({ message: "Coupon code already exists on another offer" });

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code: code.toUpperCase(),
        title,
        desc,
        type,
        value,
        maxDiscount: maxDiscount > 10000 ? 10000 : (maxDiscount || 10000),
        applicableCategory: applicableCategory ? applicableCategory.trim() : "All"
      },
      { new: true } 
    );

    if (!updatedCoupon) return res.status(404).json({ message: "Coupon not found" });
    
    res.json(updatedCoupon);
  } catch (error) {
    console.error("Coupon Update Error:", error);
    res.status(500).json({ message: "Server Error updating coupon" });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete/Deactivate a coupon (Admin Only)
router.delete("/:id", protect, checkRole("Admin", "SuperAdmin"), async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon removed successfully" });
  } catch (error) {
    console.error("Coupon Delete Error:", error);
    res.status(500).json({ message: "Server Error deleting coupon" });
  }
});

module.exports = router;