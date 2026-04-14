const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

/* ================= ROUTES IMPORT ================= */
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const managerRoutes = require("./routes/managerRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const publicRoutes = require("./routes/publicRoutes");
const supportRoutes = require("./routes/supportRoutes");
const couponRoutes = require("./routes/couponRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */

// 🔥 Render/Production Fix: Trust proxy for secure cookies/headers
app.set("trust proxy", 1);

// 🔥 CORS FIXED: Tune domain badla tha, isliye yahan naya domain add kar diya hai
app.use(cors({
  origin: [
    "https://hpsolutions.vercel.app",        // Tera naya professional domain
    "https://hp-frontend-blush.vercel.app",  // Backup ke liye purana domain
    "http://localhost:3000"                  // Local testing ke liye
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= DATABASE ================= */
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* ================= API ROUTES ================= */

// Standard Auth Routes
app.use("/api/auth", authRoutes); 

// Services & Orders
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);

// 🔥 ROLE-SPECIFIC ROUTES (RBAC)
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);       
app.use("/api/superadmin", superAdminRoutes); 

// Features
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/coupons", couponRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({ 
    status: "Running", 
    message: "H&P Solutions API is Live 🚀",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack);
  res.status(500).json({ 
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server active on port ${PORT}`);
});