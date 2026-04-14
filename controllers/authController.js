const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= 🔥 HELPER: CALCULATE AGE & GET AVATAR ================= */
// Ye function DOB se age nikalega aur uske hisaab se avatar dega
const getSmartAvatar = (name, dob) => {
  try {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // Agar is saal b'day nahi aaya, toh 1 saal kam karo
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    let style = "avataaars"; // Default for Adults (18 - 45)

    if (age < 18) {
      style = "adventurer"; // Funky for kids/teens
    } else if (age > 45) {
      style = "bottts-neutral"; // Clean/Neutral for seniors
    }

    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name)}`;
  } catch (err) {
    // Agar DOB format galat hai toh default de do
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  }
};

/* ================= REGISTER ================= */

const register = async (req, res) => {
  try {
    let { name, email, password, dob } = req.body;

    if (!name || !email || !password || !dob) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.toLowerCase().trim();

    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email exists" });

    if (await User.findOne({ name }))
      return res.status(409).json({ message: "Username exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    /* 🔥 NEW: Assigning Smart Avatar Based on DOB */
    const smartImage = getSmartAvatar(name, dob);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      dob,
      image: smartImage, // Save the dynamic image
    });

    /* 🔍 audit log */
    await AuditLog.create({
      actor: user._id,
      actorRole: user.role,
      action: "USER_REGISTERED",
      target: "User",
      targetId: user._id,
      severity: "info",
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name,
        email,
        role: user.role,
        image: user.image, // Bhejo frontend pe
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Register failed" });
  }
};

/* ================= LOGIN ================= */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid login" });
    }

    /* 🔒 account status check */
    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        message: "Account suspended. Contact administrator.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      /* 🔍 failed login audit */
      await AuditLog.create({
        actor: user._id,
        actorRole: user.role,
        action: "FAILED_LOGIN_ATTEMPT",
        target: "Auth",
        targetId: user._id,
        severity: "warning",
      });

      return res.status(400).json({ message: "Invalid login" });
    }

    /* 🔄 update last login */
    user.lastLogin = new Date();

    /* 🔥 LOGIC FOR OLD USERS: Agar purane user ke paas image nahi hai toh de do */
    if (!user.image) {
      user.image = getSmartAvatar(user.name, user.dob);
    }

    await user.save({ validateBeforeSave: false });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /* 🔍 login audit */
    await AuditLog.create({
      actor: user._id,
      actorRole: user.role,
      action: "USER_LOGIN",
      target: "Auth",
      targetId: user._id,
      severity: "info",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image, // 🔥 Bhejo frontend pe
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login error" });
  }
};

/* ================= DOB VERIFY ================= */

const verifyDob = async (req, res) => {
  try {
    const { email, dob } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.dob !== dob) {
      return res.status(400).json({
        message: "Invalid email or DOB",
      });
    }

    res.json({ message: "Verified" });
  } catch (err) {
    console.error("DOB VERIFY ERROR:", err);
    res.status(500).json({
      message: "Verification failed",
    });
  }
};

/* ================= RESET PASSWORD ================= */

const resetPasswordWithDob = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    /* 🔍 audit log */
    await AuditLog.create({
      actor: user._id,
      actorRole: user.role,
      action: "PASSWORD_RESET",
      target: "User",
      targetId: user._id,
      severity: "warning",
    });

    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({
      message: "Password reset failed",
    });
  }
};

/* ================= 🔥 GET WISHLIST ================= */
const getWishlist = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.wishlist);
  } catch (err) {
    console.error("GET WISHLIST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

/* ================= 🔥 TOGGLE WISHLIST ================= */
const toggleWishlist = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const { serviceId } = req.body;
    if (!serviceId) return res.status(400).json({ message: "Service ID is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if service is already in wishlist
    const isLiked = user.wishlist.includes(serviceId);

    if (isLiked) {
      // Remove it
      user.wishlist = user.wishlist.filter(id => id.toString() !== serviceId.toString());
    } else {
      // Add it
      user.wishlist.push(serviceId);
    }

    await user.save({ validateBeforeSave: false });

    res.json({
      message: isLiked ? "Removed from wishlist" : "Added to wishlist",
      wishlist: user.wishlist
    });

  } catch (err) {
    console.error("TOGGLE WISHLIST ERROR:", err);
    res.status(500).json({ message: "Failed to update wishlist" });
  }
};

module.exports = {
  register,
  login,
  verifyDob,
  resetPasswordWithDob,
  getWishlist,     // 🔥 Naya export
  toggleWishlist   // 🔥 Naya export
};