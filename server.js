const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

/* ================= ROUTES IMPORT ================= */
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const orderRoutes = require("./routes/orderRoutes");

// 🔥 RBAC Roles
const adminRoutes = require("./routes/adminRoutes");
const managerRoutes = require("./routes/managerRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");

const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const publicRoutes = require("./routes/publicRoutes");

// 🤖 NEW: AI Support Route Import
const supportRoutes = require("./routes/supportRoutes");

// 🎟️ NEW: Coupon Route Import (Enterprise Feature)
const couponRoutes = require("./routes/couponRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* ================= API ROUTES ================= */

app.use("/api/auth", authRoutes); 
app.use("/api", authRoutes); // Wishlist fix

app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);

// 🔥 ROLE-SPECIFIC ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);       
app.use("/api/superadmin", superAdminRoutes); 

app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/public", publicRoutes);

// 🤖 NEW: AI Support Route Mounted
app.use("/api/support", supportRoutes);

// 🎟️ NEW: Coupon Route Mounted
app.use("/api/coupons", couponRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => res.send("H&P Solutions API with AI Support & Coupons Running 🚀"));

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});