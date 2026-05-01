const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


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




app.set("trust proxy", 1);


app.use(cors({
  origin: [
    "https://hpsolutions.vercel.app",        
    "https://hp-frontend-blush.vercel.app",  
    "http://localhost:3000"                  
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/uploads", express.static("uploads"));


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));




app.use("/api/auth", authRoutes); 


app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);


app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);       
app.use("/api/superadmin", superAdminRoutes); 


app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/coupons", couponRoutes);


app.get("/", (req, res) => {
  res.json({ 
    status: "Running", 
    message: "H&P Solutions API is Live 🚀",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});


app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack);
  res.status(500).json({ 
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server active on port ${PORT}`);
});