require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const resetSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // ❌ Remove existing superadmin if any
    await User.deleteOne({ email: "superadmin@system.com" });

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash("SuperAdmin@123", 10);

    // ✅ Create fresh superadmin
    const user = await User.create({
      name: "System Owner",
      email: "superadmin@system.com",
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("✅ SUPER ADMIN CREATED FRESH");
    console.log("📧 Email:", user.email);
    console.log("🔑 Password: SuperAdmin@123");

    process.exit();
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  }
};

resetSuperAdmin();
